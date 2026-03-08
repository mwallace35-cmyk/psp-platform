import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { isValidSport, SPORT_META, getSportOverview, getRecentChampions, getSchoolsBySport, getFeaturedArticles, getDataFreshness, getRecentGamesBySport, getTeamsWithRecords, getTrackedAlumni, type Championship } from "@/lib/data";
import SportLayoutSwitcher from "@/components/sport-layouts/SportLayoutSwitcher";
import HubScoresStrip, { type HubGame } from "@/components/sport-layouts/HubScoresStrip";
import { captureError } from "@/lib/error-tracking";
import { buildOgImageUrl } from "@/lib/og-utils";
import { SPORT_COLORS, SPORT_COLORS_HEX } from "@/lib/constants/sports";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { sport: string };

interface SportOverview {
  schools: number;
  players: number;
  seasons: number;
  championships: number;
}

interface FeaturedArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string | null;
}

interface DataFreshness {
  lastUpdated?: string;
  source?: string;
  lastVerified?: string;
}

interface TeamWithRecords {
  id: number;
  wins: number;
  losses: number;
  ties?: number;
  schools?: { name: string; slug: string } | null;
  seasons?: { label: string } | null;
}

interface TrackedAlumni {
  id: number;
  person_name: string;
  current_level: string;
  current_org: string;
  current_role?: string;
  college?: string;
  pro_team?: string;
  pro_league?: string;
  sport_id: string;
  bio_note?: string;
  schools?: { name: string; slug: string } | null;
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  const meta = SPORT_META[sport];
  const ogImageUrl = buildOgImageUrl({
    title: `${meta.name} — Stats, Schools & Championships`,
    subtitle: "Philadelphia High School Sports Database",
    sport: sport,
    type: "sport",
  });
  return {
    title: `${meta.name} — PhillySportsPack`,
    description: `Philadelphia high school ${meta.name.toLowerCase()} stats, schools, leaderboards, records, and championships.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}`,
    },
    openGraph: {
      title: `${meta.name} — PhillySportsPack`,
      description: `Philadelphia high school ${meta.name.toLowerCase()} stats, schools, leaderboards, records, and championships.`,
      url: `https://phillysportspack.com/${sport}`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${meta.name} - PhillySportsPack`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.name} — PhillySportsPack`,
      description: `Philadelphia high school ${meta.name.toLowerCase()} stats, schools, leaderboards, records, and championships.`,
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  return [
    { sport: "football" },
    { sport: "basketball" },
    { sport: "baseball" },
    { sport: "track-field" },
    { sport: "lacrosse" },
    { sport: "wrestling" },
    { sport: "soccer" },
  ];
}

export default async function SportHubPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const sportColor = SPORT_COLORS[sport] || "var(--fb)";
  const sportColorHex = SPORT_COLORS_HEX[sport] || "#16a34a";

  // Fallback data for graceful degradation if any fetch fails
  const defaultOverview: SportOverview = { schools: 0, players: 0, seasons: 0, championships: 0 };
  const defaultFreshness: DataFreshness | null = { lastUpdated: new Date().toISOString() };

  // Wrap all data fetching in try/catch to prevent full page crash
  let overview: SportOverview = defaultOverview;
  let champions: Championship[] = [];
  let schools: Awaited<ReturnType<typeof getSchoolsBySport>>["data"] = [];
  let featured: FeaturedArticle[] = [];
  let freshness: DataFreshness | null = defaultFreshness;
  let recentGames: HubGame[] = [];
  let standings: TeamWithRecords[] = [];
  let trackedAlumni: TrackedAlumni[] = [];

  try {
    // Use Promise.allSettled to prevent one failure from crashing the page
    const results = await Promise.allSettled([
      getSportOverview(sport),
      getRecentChampions(sport, 10),
      getSchoolsBySport(sport, 30),
      getFeaturedArticles(sport, 3),
      getDataFreshness(sport),
      getRecentGamesBySport(sport, 20),
      getTeamsWithRecords(sport, 1, 10),
      getTrackedAlumni({ sport }, 8),
    ]);

    // Process results safely
    const [overviewResult, championsResult, schoolsResult, featuredResult, freshnessResult, gamesResult, standingsResult, alumniResult] = results;

    if (overviewResult.status === "fulfilled") overview = overviewResult.value as unknown as SportOverview;
    if (championsResult.status === "fulfilled") champions = championsResult.value as unknown as Championship[];
    if (schoolsResult.status === "fulfilled") schools = (schoolsResult.value as unknown as Awaited<ReturnType<typeof getSchoolsBySport>>).data;
    if (featuredResult.status === "fulfilled") featured = featuredResult.value as unknown as FeaturedArticle[];
    if (freshnessResult.status === "fulfilled") freshness = freshnessResult.value as unknown as DataFreshness | null;
    if (gamesResult.status === "fulfilled") recentGames = gamesResult.value as unknown as HubGame[];
    if (standingsResult.status === "fulfilled") standings = (standingsResult.value as unknown as Awaited<ReturnType<typeof getTeamsWithRecords>>).data || [];
    if (alumniResult.status === "fulfilled") trackedAlumni = alumniResult.value as unknown as TrackedAlumni[];

    // Log any failures with structured error context
    if (overviewResult.status === "rejected") {
      const errorMsg = overviewResult.reason instanceof Error ? overviewResult.reason.message : String(overviewResult.reason);
      console.error(`[PSP] Failed to fetch sport overview for ${sport}:`, errorMsg);
      captureError(overviewResult.reason, { sport, fetch: "getSportOverview" });
    }
    if (championsResult.status === "rejected") {
      const errorMsg = championsResult.reason instanceof Error ? championsResult.reason.message : String(championsResult.reason);
      console.error(`[PSP] Failed to fetch recent champions for ${sport}:`, errorMsg);
      captureError(championsResult.reason, { sport, fetch: "getRecentChampions" });
    }
    if (schoolsResult.status === "rejected") {
      const errorMsg = schoolsResult.reason instanceof Error ? schoolsResult.reason.message : String(schoolsResult.reason);
      console.error(`[PSP] Failed to fetch schools for ${sport}:`, errorMsg);
      captureError(schoolsResult.reason, { sport, fetch: "getSchoolsBySport" });
    }
    if (featuredResult.status === "rejected") {
      const errorMsg = featuredResult.reason instanceof Error ? featuredResult.reason.message : String(featuredResult.reason);
      console.error(`[PSP] Failed to fetch featured articles for ${sport}:`, errorMsg);
      captureError(featuredResult.reason, { sport, fetch: "getFeaturedArticles" });
    }
    if (freshnessResult.status === "rejected") {
      const errorMsg = freshnessResult.reason instanceof Error ? freshnessResult.reason.message : String(freshnessResult.reason);
      console.error(`[PSP] Failed to fetch data freshness for ${sport}:`, errorMsg);
      captureError(freshnessResult.reason, { sport, fetch: "getDataFreshness" });
    }
    if (gamesResult.status === "rejected") {
      const errorMsg = gamesResult.reason instanceof Error ? gamesResult.reason.message : String(gamesResult.reason);
      console.error(`[PSP] Failed to fetch recent games for ${sport}:`, errorMsg);
      captureError(gamesResult.reason, { sport, fetch: "getRecentGamesBySport" });
    }
    if (standingsResult.status === "rejected") {
      const errorMsg = standingsResult.reason instanceof Error ? standingsResult.reason.message : String(standingsResult.reason);
      console.error(`[PSP] Failed to fetch team standings for ${sport}:`, errorMsg);
      captureError(standingsResult.reason, { sport, fetch: "getTeamsWithRecords" });
    }
    if (alumniResult.status === "rejected") {
      const errorMsg = alumniResult.reason instanceof Error ? alumniResult.reason.message : String(alumniResult.reason);
      console.error(`[PSP] Failed to fetch tracked alumni for ${sport}:`, errorMsg);
      captureError(alumniResult.reason, { sport, fetch: "getTrackedAlumni" });
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[PSP] Unexpected error during sport page data fetching for ${sport}:`, errorMsg);
    captureError(error, { sport, context: "data_fetching" });
    // Page will degrade gracefully with fallback data already set above
  }

  return (
    <main id="main-content">
      {/* Breadcrumb JSON-LD */}
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
      ]} />

      {/* Breadcrumb */}
      <Breadcrumb items={[{label: meta.name}]} />

      {/* Sport Header */}
      <div className="sport-hdr" style={{ borderBottomColor: sportColor }}>
        <div className="sport-hdr-inner">
          <span style={{ fontSize: 28 }} aria-hidden="true">{meta.emoji}</span>
          <h1>{meta.name}</h1>
          <div className="stat-pills">
            <div className="pill"><strong>{overview.players.toLocaleString()}</strong> players</div>
            <div className="pill"><strong>{overview.schools.toLocaleString()}</strong> schools</div>
            <div className="pill"><strong>{overview.championships.toLocaleString()}</strong> titles</div>
            <span className="db-tag"><span className="dot" /> Supabase</span>
          </div>
        </div>
      </div>

      {/* Score Banner */}
      <HubScoresStrip games={recentGames} sportColor={sportColorHex} sport={sport} />

      {/* Layout Switcher (Client Component) */}
      <SportLayoutSwitcher
        sport={sport}
        sportColor={sportColorHex}
        meta={meta}
        overview={overview}
        champions={champions as unknown as import("@/lib/data/types").Championship[]}
        schools={schools}
        featured={featured}
        freshness={freshness}
        recentGames={recentGames}
        standings={standings}
        trackedAlumni={trackedAlumni}
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Philadelphia High School ${meta.name}`,
            description: `Comprehensive ${meta.name.toLowerCase()} database for Philadelphia area high schools.`,
            url: `https://phillysportspack.com/${sport}`,
            isPartOf: { "@type": "WebSite", name: "PhillySportsPack", url: "https://phillysportspack.com" },
          }),
        }}
      />
    </main>
  );
}
