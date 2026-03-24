export const revalidate = 3600;
export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import { captureError } from "@/lib/error-tracking";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About | PhillySportsPack",
  description: "PhillySportsPack is the definitive Philadelphia high school sports database — 55,000+ players, 700+ schools, 7 sports, 25+ years of history.",
  alternates: { canonical: "https://phillysportspack.com/about" },
};
import HeroSectionNew from "@/components/home/HeroSectionNew";
import LiveStatsStrip from "@/components/home/LiveStatsStrip";
import SportNavigationGrid from "@/components/home/SportNavigationGrid";
import SectionDivider from "@/components/home/SectionDivider";
import PotwSpotlight from "@/components/home/PotwSpotlight";
import PhillyEverywhere from "@/components/home/PhillyEverywhere";
import RecentScores from "@/components/home/RecentScores";
import LatestArticles from "@/components/home/LatestArticles";
import NewsletterCTA from "@/components/home/NewsletterCTA";
import TrendingPlayersWidget from "@/components/home/TrendingPlayersWidget";
import SponsorSlot from "@/components/ads/SponsorSlot";

// ============ DATA FETCHING FUNCTIONS ============

async function getOverviewStats() {
  try {
    const supabase = createStaticClient();
    const [schools, players, championships] = await Promise.all([
      supabase.from("schools").select("id", { count: "exact", head: true }),
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("championships").select("id", { count: "exact", head: true }),
    ]);
    return {
      schools: schools.count ?? 0,
      players: players.count ?? 0,
      championships: championships.count ?? 0,
      years: 25,
    };
  } catch (error) {
    captureError(error, { function: "getOverviewStats", context: "data_fetching" });
    return { schools: 1237, players: 21502, championships: 1665, years: 25 };
  }
}

async function getSportsWithCounts() {
  try {
    const supabase = createStaticClient();
    const sports = [
      { id: 'fb', name: 'Football', slug: 'football' },
      { id: 'bb', name: 'Basketball', slug: 'basketball' },
      { id: 'base', name: 'Baseball', slug: 'baseball' },
      { id: 'soccer', name: 'Soccer', slug: 'soccer' },
      { id: 'lac', name: 'Lacrosse', slug: 'lacrosse' },
      { id: 'track', name: 'Track & Field', slug: 'track-field' },
      { id: 'wrest', name: 'Wrestling', slug: 'wrestling' },
    ];

    const sportCounts: Record<string, number> = {};

    for (const sport of sports) {
      try {
        const { count } = await supabase
          .from('players')
          .select('id', { count: 'exact', head: true })
          .ilike('sports', `%${sport.id}%`);
        sportCounts[sport.slug] = count ?? 3000;
      } catch {
        sportCounts[sport.slug] = 3000;
      }
    }

    return sports.map(s => ({
      ...s,
      playerCount: sportCounts[s.slug]
    }));
  } catch (error) {
    captureError(error, { function: "getSportsWithCounts", context: "data_fetching" });
    return [
      { id: 'fb', name: 'Football', slug: 'football', playerCount: 3000 },
      { id: 'bb', name: 'Basketball', slug: 'basketball', playerCount: 2500 },
      { id: 'base', name: 'Baseball', slug: 'baseball', playerCount: 1500 },
      { id: 'soccer', name: 'Soccer', slug: 'soccer', playerCount: 800 },
      { id: 'lac', name: 'Lacrosse', slug: 'lacrosse', playerCount: 600 },
      { id: 'track', name: 'Track & Field', slug: 'track-field', playerCount: 1200 },
      { id: 'wrest', name: 'Wrestling', slug: 'wrestling', playerCount: 900 },
    ];
  }
}

async function getRecentArticles(limit: number = 3) {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("articles")
      .select("slug, title, excerpt, sport_id, featured_image_url, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    return data || [];
  } catch (error) {
    captureError(error, { function: "getRecentArticles", context: "data_fetching" });
    return [];
  }
}

async function getFeaturedAlumni() {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("next_level_tracking")
      .select(
        `person_name,
         current_org,
         current_role,
         sport_id,
         high_school_id,
         schools!next_level_tracking_high_school_id_fkey(name)`
      )
      .eq("featured", true)
      .eq("status", "active")
      .limit(12);
    return data || [];
  } catch (error) {
    captureError(error, { function: "getFeaturedAlumni", context: "data_fetching" });
    return [];
  }
}

async function getRecentScores() {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("games")
      .select(
        `id,
         home_score,
         away_score,
         game_date,
         status,
         sport_id,
         schools!games_home_team_id_fkey(name),
         away_schools:schools!games_away_team_id_fkey(name)`
      )
      .not("home_score", "is", null)
      .order("game_date", { ascending: false })
      .limit(10);
    return data || [];
  } catch (error) {
    captureError(error, { function: "getRecentScores", context: "data_fetching" });
    return [];
  }
}

async function getPotwNominees() {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("potw_nominees")
      .select("id, player_name, school_name, sport_id, stat_line, votes")
      .eq("is_winner", false)
      .order("votes", { ascending: false })
      .limit(5);
    return data || [];
  } catch (error) {
    captureError(error, { function: "getPotwNominees", context: "data_fetching" });
    return [];
  }
}

async function getHotTakes() {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("hot_takes")
      .select("id, user_handle, content, type, upvotes, downvotes, created_at")
      .order("created_at", { ascending: false })
      .limit(3);
    return data || [];
  } catch (error) {
    captureError(error, { function: "getHotTakes", context: "data_fetching" });
    return [];
  }
}

// ============ INTERFACES ============

interface Article {
  slug: string;
  title: string;
  excerpt: string | null;
  sport_id: string;
  featured_image_url: string | null;
  published_at: string;
}

interface FeaturedAlumni {
  person_name: string;
  current_org: string;
  current_role: string | null;
  sport_id: string;
  high_school_id: number;
  schools: { name: string }[] | { name: string } | null;
}

interface GameScore {
  id: string;
  home_score: number;
  away_score: number;
  game_date: string;
  status: string;
  sport_id: string;
  schools: { name: string }[] | { name: string } | null;
  away_schools: { name: string }[] | { name: string } | null;
}

interface PotwNominee {
  id: string;
  player_name: string;
  school_name: string;
  sport_id: string;
  stat_line: string;
  votes: number;
}

interface HotTake {
  id: string;
  user_handle: string;
  content: string;
  type: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

// ============ MAIN PAGE COMPONENT ============

export default async function HomePage() {
  let stats = { schools: 1237, players: 21502, championships: 1665, years: 25 };
  let sports: Array<{ id: string; name: string; slug: string; playerCount: number }> = [];
  let articles: Article[] = [];
  let featuredAlumni: FeaturedAlumni[] = [];
  let recentScores: GameScore[] = [];
  let potwNominees: PotwNominee[] = [];
  let hotTakes: HotTake[] = [];

  try {
    const results = await Promise.allSettled([
      getOverviewStats(),
      getSportsWithCounts(),
      getRecentArticles(3),
      getFeaturedAlumni(),
      getRecentScores(),
      getPotwNominees(),
      getHotTakes(),
    ]);

    const [statsResult, sportsResult, articlesResult, alumniResult, scoresResult, potwResult, hotTakesResult] = results;

    if (statsResult.status === "fulfilled") stats = statsResult.value;
    if (sportsResult.status === "fulfilled") sports = sportsResult.value;
    if (articlesResult.status === "fulfilled") articles = articlesResult.value;
    if (alumniResult.status === "fulfilled") featuredAlumni = alumniResult.value;
    if (scoresResult.status === "fulfilled") recentScores = scoresResult.value;
    if (potwResult.status === "fulfilled") potwNominees = potwResult.value;
    if (hotTakesResult.status === "fulfilled") hotTakes = hotTakesResult.value;

    // Error logging for failed fetches
    [statsResult, sportsResult, articlesResult, alumniResult, scoresResult, potwResult, hotTakesResult].forEach(
      (result, idx) => {
        if (result.status === "rejected") {
          const names = ["getOverviewStats", "getSportsWithCounts", "getRecentArticles", "getFeaturedAlumni", "getRecentScores", "getPotwNominees", "getHotTakes"];
          captureError(result.reason, { function: "HomePage", fetch: names[idx] });
        }
      }
    );
  } catch (error) {
    captureError(error, { function: "HomePage", context: "data_fetching" });
  }

  // Transform data for components
  const displayArticles = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt || "",
    sport_id: a.sport_id || "News",
    featured_image_url: a.featured_image_url || "/sports/football.svg",
    published_at: a.published_at,
  }));

  const displayAlumni = featuredAlumni.map((person) => {
    const schoolName = person.schools
      ? Array.isArray(person.schools)
        ? person.schools[0]?.name
        : person.schools.name
      : undefined;
    return {
      name: person.person_name,
      team: person.current_org,
      school: schoolName || "Unknown",
      emoji: "⭐",
    };
  });

  const displayScores = recentScores.map((game) => {
    const homeName = game.schools
      ? Array.isArray(game.schools) ? game.schools[0]?.name : game.schools.name
      : "Unknown";
    const awayName = game.away_schools
      ? Array.isArray(game.away_schools) ? game.away_schools[0]?.name : game.away_schools.name
      : "Unknown";
    return {
      id: game.id,
      homeTeam: homeName || "Unknown",
      awayTeam: awayName || "Unknown",
      homeScore: game.home_score,
      awayScore: game.away_score,
      gameDate: game.game_date,
      status: game.status,
      sportId: game.sport_id,
    };
  });

  const displayPotw = potwNominees.map((nominee) => ({
    id: nominee.id,
    playerName: nominee.player_name,
    schoolName: nominee.school_name,
    sportId: nominee.sport_id,
    statLine: nominee.stat_line,
    votes: nominee.votes,
  }));

  const displayHotTakes = hotTakes.length > 0 ? hotTakes.map((take) => ({
    id: take.id,
    userHandle: take.user_handle,
    content: take.content,
    type: take.type,
    upvotes: take.upvotes,
    downvotes: take.downvotes,
  })) : [];

  // JSON-LD Schema
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PhillySportsPack",
    url: "https://phillysportspack.com",
    description: "Comprehensive database of Philadelphia high school sports statistics, players, coaches, and records across football, basketball, baseball, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://phillysportspack.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      <ErrorBoundary>
        <div style={{ width: "100%" }}>
          <div id="content-updates" aria-live="polite" aria-atomic="true" className="sr-only"></div>

          {/* SECTION 1: Hero Section */}
          <HeroSectionNew stats={stats} />

          {/* SECTION 2: Live Scores (unified scores) */}
          {displayScores.length > 0 && (
            <>
              <SectionDivider />
              <LiveStatsStrip />
              <RecentScores scores={displayScores} />
            </>
          )}

          {/* SECTION 3: Sport Navigation Cards */}
          <SectionDivider />
          <SportNavigationGrid sports={sports} />

          {/* SECTION 4: Trending Players */}
          <SectionDivider />
          <TrendingPlayersWidget />

          {/* SECTION 5: POTW Spotlight */}
          <SectionDivider />
          <PotwSpotlight nominees={displayPotw} />

          {/* SECTION 5: Philly Everywhere / Alumni */}
          {displayAlumni.length > 0 && (
            <>
              <SectionDivider />
              <PhillyEverywhere alumni={displayAlumni} totalCount={stats.players} />
            </>
          )}

          {/* SECTION 6: Latest Articles */}
          {displayArticles.length > 0 && (
            <>
              <SectionDivider />
              <LatestArticles articles={displayArticles} />
            </>
          )}

          {/* Inline Sponsor Slot */}
          <SectionDivider />
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            <SponsorSlot placement="inline" />
          </div>

          {/* SECTION 7: Community + Newsletter (merged) */}
          <SectionDivider />
          <NewsletterCTA />
        </div>
      </ErrorBoundary>
    </>
  );
}
