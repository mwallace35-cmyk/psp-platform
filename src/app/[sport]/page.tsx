import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { isValidSport, SPORT_META, getSportOverview, getRecentChampions, getSchoolsBySport, getFeaturedArticles, getDataFreshness, getRecentGamesBySport } from "@/lib/data";
import SportLayoutSwitcher from "@/components/sport-layouts/SportLayoutSwitcher";
import HubScoresStrip from "@/components/sport-layouts/HubScoresStrip";
import { captureError } from "@/lib/error-tracking";
import { buildOgImageUrl } from "@/lib/og-utils";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { sport: string };

const SPORT_COLORS: Record<string, string> = {
  football: "var(--fb)",
  basketball: "var(--bb)",
  baseball: "var(--base)",
  "track-field": "var(--track)",
  lacrosse: "var(--lac)",
  wrestling: "var(--wrest)",
  soccer: "var(--soccer)",
};

// Raw hex colors for client components (CSS vars don't work in JS)
const SPORT_COLORS_HEX: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

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
  const defaultOverview = { schools: 0, players: 0, seasons: 0, championships: 0 };
  const defaultArray: any[] = [];
  const defaultFreshness: { fetched_at: string } | null = { fetched_at: new Date().toISOString() };

  // Wrap all data fetching in try/catch to prevent full page crash
  let overview = defaultOverview;
  let champions = defaultArray;
  let schools = defaultArray;
  let featured = defaultArray;
  let freshness: any = defaultFreshness;
  let recentGames = defaultArray;

  try {
    // Use Promise.allSettled to prevent one failure from crashing the page
    const results = await Promise.allSettled([
      getSportOverview(sport),
      getRecentChampions(sport, 10),
      getSchoolsBySport(sport, 30),
      getFeaturedArticles(sport, 3),
      getDataFreshness(sport),
      getRecentGamesBySport(sport, 20),
    ]);

    // Process results safely
    const [overviewResult, championsResult, schoolsResult, featuredResult, freshnessResult, gamesResult] = results;

    if (overviewResult.status === "fulfilled") overview = overviewResult.value;
    if (championsResult.status === "fulfilled") champions = championsResult.value;
    if (schoolsResult.status === "fulfilled") schools = schoolsResult.value;
    if (featuredResult.status === "fulfilled") featured = featuredResult.value;
    if (freshnessResult.status === "fulfilled") freshness = freshnessResult.value;
    if (gamesResult.status === "fulfilled") recentGames = gamesResult.value;

    // Log any failures
    if (overviewResult.status === "rejected") {
      captureError(overviewResult.reason, { sport, fetch: "getSportOverview" });
    }
    if (championsResult.status === "rejected") {
      captureError(championsResult.reason, { sport, fetch: "getRecentChampions" });
    }
    if (schoolsResult.status === "rejected") {
      captureError(schoolsResult.reason, { sport, fetch: "getSchoolsBySport" });
    }
    if (featuredResult.status === "rejected") {
      captureError(featuredResult.reason, { sport, fetch: "getFeaturedArticles" });
    }
    if (freshnessResult.status === "rejected") {
      captureError(freshnessResult.reason, { sport, fetch: "getDataFreshness" });
    }
    if (gamesResult.status === "rejected") {
      captureError(gamesResult.reason, { sport, fetch: "getRecentGamesBySport" });
    }
  } catch (error) {
    captureError(error, { sport, context: "data_fetching" });
    // Page will degrade gracefully with fallback data already set above
  }

  return (
    <>
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
          <span style={{ fontSize: 28 }}>{meta.emoji}</span>
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
        champions={champions}
        schools={schools}
        featured={featured}
        freshness={freshness}
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
    </>
  );
}
