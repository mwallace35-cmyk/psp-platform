import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SPORT_META, getSportOverview, getRecentChampions, getSchoolsBySport, getFeaturedArticles, getDataFreshness, getRecentGamesBySport, getTeamsWithRecords, getTrackedAlumni, type Championship } from "@/lib/data";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import SportLayoutSwitcher from "@/components/sport-layouts/SportLayoutSwitcher";
import HubScoresStrip, { type HubGame } from "@/components/sport-layouts/HubScoresStrip";
import QuickNavigation from "@/components/sport-layouts/QuickNavigation";
import PlayoffPreview from "@/components/sport-layouts/PlayoffPreview";
import DesignBibleSections from "@/components/sport-layouts/DesignBibleSections";
import { captureError } from "@/lib/error-tracking";
import { buildOgImageUrl } from "@/lib/og-utils";
import { SPORT_COLORS, SPORT_COLORS_HEX, SPORT_GRADIENTS } from "@/lib/constants/sports";
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
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
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
  const sport = await validateSportParam(params);

  const meta = SPORT_META[sport];
  const sportColor = SPORT_COLORS[sport] || "var(--fb)";
  const sportColorHex = SPORT_COLORS_HEX[sport] || "#16a34a";
  const sportGradient = SPORT_GRADIENTS[sport] || "from-[#0a1628] to-[#16a34a]";

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

    // Log any failures with structured error context (development logging)
    if (process.env.NODE_ENV === 'development') {
      if (overviewResult.status === "rejected") {
        const errorMsg = overviewResult.reason instanceof Error ? overviewResult.reason.message : String(overviewResult.reason);
        console.error(`[PSP] Failed to fetch sport overview for ${sport}:`, errorMsg);
      }
      if (championsResult.status === "rejected") {
        const errorMsg = championsResult.reason instanceof Error ? championsResult.reason.message : String(championsResult.reason);
        console.error(`[PSP] Failed to fetch recent champions for ${sport}:`, errorMsg);
      }
      if (schoolsResult.status === "rejected") {
        const errorMsg = schoolsResult.reason instanceof Error ? schoolsResult.reason.message : String(schoolsResult.reason);
        console.error(`[PSP] Failed to fetch schools for ${sport}:`, errorMsg);
      }
      if (featuredResult.status === "rejected") {
        const errorMsg = featuredResult.reason instanceof Error ? featuredResult.reason.message : String(featuredResult.reason);
        console.error(`[PSP] Failed to fetch featured articles for ${sport}:`, errorMsg);
      }
      if (freshnessResult.status === "rejected") {
        const errorMsg = freshnessResult.reason instanceof Error ? freshnessResult.reason.message : String(freshnessResult.reason);
        console.error(`[PSP] Failed to fetch data freshness for ${sport}:`, errorMsg);
      }
      if (gamesResult.status === "rejected") {
        const errorMsg = gamesResult.reason instanceof Error ? gamesResult.reason.message : String(gamesResult.reason);
        console.error(`[PSP] Failed to fetch recent games for ${sport}:`, errorMsg);
      }
      if (standingsResult.status === "rejected") {
        const errorMsg = standingsResult.reason instanceof Error ? standingsResult.reason.message : String(standingsResult.reason);
        console.error(`[PSP] Failed to fetch team standings for ${sport}:`, errorMsg);
      }
      if (alumniResult.status === "rejected") {
        const errorMsg = alumniResult.reason instanceof Error ? alumniResult.reason.message : String(alumniResult.reason);
        console.error(`[PSP] Failed to fetch tracked alumni for ${sport}:`, errorMsg);
      }
    }

    // Always capture errors for error tracking (non-development)
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
    if (standingsResult.status === "rejected") {
      captureError(standingsResult.reason, { sport, fetch: "getTeamsWithRecords" });
    }
    if (alumniResult.status === "rejected") {
      captureError(alumniResult.reason, { sport, fetch: "getTrackedAlumni" });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[PSP] Unexpected error during sport page data fetching for ${sport}:`, errorMsg);
    }
    captureError(error, { sport, context: "data_fetching" });
    // Page will degrade gracefully with fallback data already set above
  }

  // Sport-specific editorial intros
  const sportIntros: Record<string, string> = {
    football: "From the Catholic League's storied rivalry games at Franklin Field to the Public League's Friday night lights, Philadelphia football has produced NFL legends and forged lifelong bonds. Explore the statistics and stories that defined generations of champions.",
    basketball: "The Catholic League's dynasties, the Public League's talent pipeline, and the Inter-Ac's proud traditions. Philadelphia basketball has given the world Hall of Famers and inspired countless athletes. Discover the players and programs that built this legacy.",
    baseball: "From All-City award winners to PIAA state champions, Philadelphia's baseball tradition runs deep. Explore the schools, players, and seasons that have made Philly a baseball hotbed.",
    soccer: "Philadelphia's soccer programs have built increasingly competitive traditions across multiple leagues. Discover the schools, players, and championships shaping this growing sport.",
    lacrosse: "Elite programs like Haverford, Conestoga, and Episcopal have put Philadelphia on the lacrosse map nationally. Explore the history, champions, and rising stars of Philly lacrosse.",
    'track-field': "From sprinters to distance runners, from jumpers to throwers — Philadelphia's track and field athletes have set records that inspire. Discover the individual achievements and team championships.",
    wrestling: "Malvern Prep's national ranking, PAISWT champions, and a tradition of toughness defines Philadelphia wrestling. Explore the wrestlers and programs building this legacy.",
  };

  const sportIntro = sportIntros[sport] || "Explore the history, statistics, and champions of Philadelphia high school sports.";

  return (
    <main id="main-content">
      {/* Breadcrumb JSON-LD */}
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
      ]} />

      {/* Breadcrumb */}
      <Breadcrumb items={[{label: meta.name}]} />

      {/* Sport Hero with Gradient */}
      <div className={`bg-gradient-to-r ${sportGradient} text-white py-12 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <span style={{ fontSize: 48 }} aria-hidden="true">{meta.emoji}</span>
            <h1 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {meta.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-4 text-sm md:text-base">
            <div className="bg-white/20 px-4 py-2 rounded-full"><strong>{overview.players.toLocaleString()}</strong> players</div>
            <div className="bg-white/20 px-4 py-2 rounded-full"><strong>{overview.schools.toLocaleString()}</strong> schools</div>
            <div className="bg-white/20 px-4 py-2 rounded-full"><strong>{overview.championships.toLocaleString()}</strong> titles</div>
          </div>
        </div>
      </div>

      {/* Design Bible Sections: Top Performers, Recent Scores, Power Rankings */}
            <DesignBibleSections sport={sport} />

      {/* Editorial Intro */}
      <div style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "0 1.5rem",
        fontSize: "1.1rem",
        lineHeight: 1.7,
        color: "var(--text-body)",
        fontFamily: "var(--font-dm-sans)",
      }}>
        <p>{sportIntro}</p>
      </div>

      {/* Playoff Preview (basketball only, March 2026) */}
      {sport === "basketball" && <PlayoffPreview />}

      {/* Score Banner */}
      <HubScoresStrip games={recentGames} sportColor={sportColorHex} sport={sport} />

      {/* Quick Navigation */}
      <QuickNavigation sport={sport} sportColor={sportColorHex} />

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
