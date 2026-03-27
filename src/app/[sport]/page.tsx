import Link from "next/link";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SPORT_META, getSportOverview, getRecentChampions, getSchoolsBySport, getFeaturedArticles, getDataFreshness, getRecentGamesBySport, getTeamsWithRecords, getTrackedAlumni, type Championship, getCompoundLeaders, getCompoundCategoriesForSport, COMPOUND_CATEGORIES, getRecordWatchData, getSeasonPhaseForSport } from "@/lib/data";
import type { CompoundCategory } from "@/lib/data/computed-records";
import type { SeasonPhase, SportSeasonInfo } from "@/lib/data/seasons";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import SportLayoutSwitcher from "@/components/sport-layouts/SportLayoutSwitcher";
import HubScoresStrip, { type HubGame } from "@/components/sport-layouts/HubScoresStrip";
import QuickNavigation from "@/components/sport-layouts/QuickNavigation";
import PlayoffPreview from "@/components/sport-layouts/PlayoffPreview";
import DesignBibleSections from "@/components/sport-layouts/DesignBibleSections";
import SportHeroSilhouette from "@/components/sport-layouts/SportHeroSilhouette";
import SportHubHero from "@/components/sport-layouts/SportHubHero";
import SportHubNews from "@/components/sport-layouts/SportHubNews";
import SportHubStandings from "@/components/sport-layouts/SportHubStandings";
import CompoundLeaderboards from "@/components/leaderboards/CompoundLeaderboards";
import RecordWatch from "@/components/widgets/RecordWatch";
import DidYouKnow from "@/components/ui/DidYouKnow";
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
  published_at?: string | null;
  author_name?: string | null;
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
  division?: string | null;
  schools?: {
    name: string;
    slug: string;
    league_id?: number | null;
    leagues?: { id: number; name: string } | null;
  } | null;
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

// export async function generateStaticParams() {
//   return [
//     { sport: "football" },
//     { sport: "basketball" },
//     { sport: "baseball" },
//     { sport: "track-field" },
//     { sport: "lacrosse" },
//     { sport: "wrestling" },
//     { sport: "soccer" },
//   ];
// }

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
  let compoundCategories: { key: string; label: string; description: string; data: any[] }[] = [];
  let recordWatchData: Awaited<ReturnType<typeof getRecordWatchData>> = [];
  let seasonInfo: SportSeasonInfo = {
    phase: "offseason" as SeasonPhase,
    lastGameDate: null,
    scoredGames: 0,
    scheduledGames: 0,
    typicalStartMonth: null,
  };

  try {
    // Build compound leaderboard fetch promises
    const compoundKeys = getCompoundCategoriesForSport(sport);
    const compoundPromises = compoundKeys.map((key) =>
      getCompoundLeaders(sport, key, 10).then((data) => ({
        key,
        label: COMPOUND_CATEGORIES[key].label,
        description: COMPOUND_CATEGORIES[key].description,
        data,
      }))
    );

    // Use Promise.allSettled to prevent one failure from crashing the page
    const results = await Promise.allSettled([
      getSportOverview(sport),
      getRecentChampions(sport, 10),
      getSchoolsBySport(sport, 30),
      getFeaturedArticles(sport, 4),
      getDataFreshness(sport),
      getRecentGamesBySport(sport, 20),
      getTeamsWithRecords(sport, 1, 200),
      getTrackedAlumni({ sport }, 8),
      Promise.allSettled(compoundPromises),
      getRecordWatchData(sport, sport === "basketball" ? 25 : 11),
      getSeasonPhaseForSport(sport),
    ]);

    // Process results safely
    const [overviewResult, championsResult, schoolsResult, featuredResult, freshnessResult, gamesResult, standingsResult, alumniResult, compoundResult, recordWatchResult, seasonInfoResult] = results;

    if (overviewResult.status === "fulfilled") overview = overviewResult.value as unknown as SportOverview;
    if (championsResult.status === "fulfilled") champions = championsResult.value as unknown as Championship[];
    if (schoolsResult.status === "fulfilled") schools = (schoolsResult.value as unknown as Awaited<ReturnType<typeof getSchoolsBySport>>).data;
    if (featuredResult.status === "fulfilled") featured = featuredResult.value as unknown as FeaturedArticle[];
    if (freshnessResult.status === "fulfilled") freshness = freshnessResult.value as unknown as DataFreshness | null;
    if (gamesResult.status === "fulfilled") recentGames = gamesResult.value as unknown as HubGame[];
    if (standingsResult.status === "fulfilled") standings = (standingsResult.value as unknown as Awaited<ReturnType<typeof getTeamsWithRecords>>).data || [];

    // Process compound leaderboard results
    if (compoundResult.status === "fulfilled") {
      const settled = compoundResult.value as PromiseSettledResult<{ key: string; label: string; description: string; data: any[] }>[];
      compoundCategories = settled
        .filter((r): r is PromiseFulfilledResult<{ key: string; label: string; description: string; data: any[] }> => r.status === "fulfilled")
        .map((r) => r.value);
    }

    // Process record watch results
    if (recordWatchResult.status === "fulfilled") {
      recordWatchData = recordWatchResult.value as Awaited<ReturnType<typeof getRecordWatchData>>;
    }
    if (alumniResult.status === "fulfilled") trackedAlumni = alumniResult.value as unknown as TrackedAlumni[];
    if (seasonInfoResult.status === "fulfilled") seasonInfo = seasonInfoResult.value as SportSeasonInfo;

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

  // Sport-specific editorial intros — now season-phase aware
  const sportIntrosBase: Record<string, string> = {
    football: "From the Catholic League's storied rivalry games at Franklin Field to the Public League's Friday night lights, Philadelphia football has produced NFL legends and forged lifelong bonds.",
    basketball: "The Catholic League's dynasties, the Public League's talent pipeline, and the Inter-Ac's proud traditions. Philadelphia basketball has given the world Hall of Famers and inspired countless athletes.",
    baseball: "From All-City award winners to PIAA state champions, Philadelphia's baseball tradition runs deep. The schools, players, and seasons that have made Philly a baseball hotbed.",
    soccer: "Philadelphia's soccer programs have built increasingly competitive traditions across multiple leagues. The schools, players, and championships shaping this growing sport.",
    lacrosse: "Elite programs like Haverford, Conestoga, and Episcopal have put Philadelphia on the lacrosse map nationally. The history, champions, and rising stars of Philly lacrosse.",
    'track-field': "From sprinters to distance runners, from jumpers to throwers — Philadelphia's track and field athletes have set records that inspire.",
    wrestling: "Malvern Prep's national ranking, PAISWT champions, and a tradition of toughness defines Philadelphia wrestling.",
  };

  // Build season-phase suffix
  let phaseIntroSuffix = " Explore the statistics and stories that defined generations of champions.";
  if (seasonInfo.phase === "in-season") {
    phaseIntroSuffix = ` The ${meta.name.toLowerCase()} season is underway — follow the latest scores, stats, and standings.`;
  } else if (seasonInfo.phase === "preseason") {
    phaseIntroSuffix = ` The ${meta.name.toLowerCase()} season is just around the corner. Check back soon for scores and stats.`;
  } else if (seasonInfo.phase === "offseason") {
    const returnMonth = seasonInfo.typicalStartMonth;
    phaseIntroSuffix = returnMonth
      ? ` ${meta.name} returns in ${returnMonth}. Until then, explore the records and stories from past seasons.`
      : ` Explore the records and stories from past seasons.`;
  }

  const sportIntro = (sportIntrosBase[sport] || "Explore the history, statistics, and champions of Philadelphia high school sports.") + phaseIntroSuffix;

  // Season phase badge config
  const phaseBadge: Record<SeasonPhase, { label: string; color: string; bg: string }> = {
    "in-season": { label: "In Season", color: "text-green-300", bg: "bg-green-500/20 border-green-500/30" },
    "preseason": { label: "Preseason", color: "text-yellow-300", bg: "bg-yellow-500/20 border-yellow-500/30" },
    "offseason": { label: "Offseason", color: "text-gray-300", bg: "bg-gray-500/20 border-gray-500/30" },
  };

  // Split articles: first = hero, rest = news grid
  const heroArticle = featured.length > 0 ? featured[0] : null;
  const newsArticles = featured.length > 1 ? featured.slice(1, 4) : [];
  const fallbackBannerSport = sport === 'track-field' ? 'track' : sport;

  return (
    <main id="main-content">
      {/* Breadcrumb JSON-LD */}
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
      ]} />

      {/* Breadcrumb */}
      <Breadcrumb items={[{label: meta.name}]} />

      {/* 1. HERO — Featured Story (Bleacher Report style) */}
      <SportHubHero
        sport={sport}
        sportName={meta.name}
        sportEmoji={meta.emoji}
        sportColorHex={sportColorHex}
        article={heroArticle}
        seasonPhaseBadge={phaseBadge[seasonInfo.phase]}
        fallbackBannerSport={fallbackBannerSport}
      />

      {/* 2. LATEST NEWS — Horizontal card row */}
      <div className="bg-[var(--psp-navy)]">
        <SportHubNews
          sport={sport}
          sportName={meta.name}
          sportColorHex={sportColorHex}
          articles={newsArticles}
        />
      </div>

      {/* 2.5 SCORES TICKER — Scrolling score strip right after news */}
      <HubScoresStrip games={recentGames} sportColor={sportColorHex} sport={sport} />

      {/* Did You Know? — Sport-scoped trivia */}
      <div className="bg-[var(--psp-navy)]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="max-w-lg">
            <DidYouKnow sport={sport} />
          </div>
        </div>
      </div>

      {/* Playoff Preview (basketball only) */}
      {sport === "basketball" && <PlayoffPreview />}

      {/* 3. QUICK ACCESS — Navigation cards for key sections */}
      <div className="bg-[var(--psp-navy)]">
        <QuickNavigation sport={sport} sportColor={sportColorHex} />
      </div>

      {/* 4. SCORES + RANKINGS + LEADERS — Compact dark theme */}
      <div className="bg-[var(--psp-navy)]">
        <DesignBibleSections sport={sport} compact darkTheme />
      </div>

      {/* 5. STANDINGS — Compact league standings */}
      <div className="bg-[var(--psp-navy)]">
        <SportHubStandings
          standings={standings}
          sport={sport}
          sportName={meta.name}
          sportColorHex={sportColorHex}
        />
      </div>

      {/* Compound Leaderboards + Record Watch */}
      {(compoundCategories.length > 0 || recordWatchData.length > 0) && (
        <div className="bg-[var(--psp-navy)]">
          {/* Compound Leaderboards */}
          {compoundCategories.length > 0 && (
            <CompoundLeaderboards sport={sport} categories={compoundCategories} />
          )}

          {/* Record Watch Widget */}
          {recordWatchData.length > 0 && (
            <section className="py-6 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="max-w-lg">
                  <RecordWatch sport={sport} data={recordWatchData} />
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* City All-Star Game Card (football only) */}
      {sport === "football" && (
        <div className="bg-[var(--psp-navy)]">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Link
              href="/football/city-all-star-game"
              className="block max-w-sm"
              style={{ textDecoration: "none" }}
            >
              <div className="bg-[var(--psp-navy-mid)] border border-[var(--psp-gold)]/25 rounded-xl p-5 hover:border-[var(--psp-gold)]/50 transition-colors group">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0" role="img" aria-label="Football">
                    🏈
                  </span>
                  <div className="min-w-0">
                    <h3
                      className="text-[var(--psp-gold)] font-bold tracking-wide mb-1"
                      style={{
                        fontFamily: "var(--font-bebas)",
                        fontSize: "1.15rem",
                        letterSpacing: "0.06em",
                      }}
                    >
                      CITY ALL-STAR GAME
                    </h3>
                    <p className="text-gray-300 text-sm leading-snug">
                      May &middot; Northeast HS
                    </p>
                    <p className="text-gray-400 text-sm">
                      Public vs. Non-Public
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Since 1975</p>
                    <span className="inline-flex items-center gap-1 text-[var(--psp-gold)] text-xs font-bold mt-2 group-hover:gap-2 transition-all">
                      Details
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Editorial Intro */}
      <div className="bg-[var(--psp-navy)]">
        <div className="max-w-[900px] mx-auto py-8 px-6 text-[1.1rem] leading-[1.7]" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-dm-sans)" }}>
          <p>{sportIntro}</p>
        </div>
      </div>

      {/* Layout Switcher (Client Component) — Editorial/Dashboard toggle */}
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
