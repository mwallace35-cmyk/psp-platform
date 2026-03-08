export const revalidate = 3600;

import { createClient } from "@/lib/supabase/server";
import { captureError } from "@/lib/error-tracking";
import HomePageClient from "@/components/HomePageClient";

// Helper function to get emoji for sport
function getSportEmoji(sportId?: string): string {
  const emojiMap: Record<string, string> = {
    basketball: "🏀",
    football: "🏈",
    baseball: "⚾",
    soccer: "⚽",
    lacrosse: "🥍",
    wrestling: "🤼",
    track: "🏃",
  };
  return emojiMap[sportId?.toLowerCase() || ""] || "🏅";
}

async function getOverviewStats() {
  try {
    const supabase = await createClient();
    const [schools, players, seasons, championships] = await Promise.all([
      supabase.from("schools").select("id", { count: "exact", head: true }),
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("seasons").select("id", { count: "exact", head: true }),
      supabase.from("championships").select("id", { count: "exact", head: true }),
    ]);
    return {
      schools: schools.count ?? 0,
      players: players.count ?? 0,
      seasons: seasons.count ?? 0,
      championships: championships.count ?? 0,
    };
  } catch (error) {
    captureError(error, { function: "getOverviewStats", context: "data_fetching" });
    console.error("[PSP] Failed to fetch overview stats:", error instanceof Error ? error.message : String(error));
    return { schools: 405, players: 10057, seasons: 76, championships: 713 };
  }
}

async function getRecentArticles(limit: number = 3) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("articles")
      .select("slug, title, excerpt, sport_id, featured_image_url, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    return data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    captureError(error, { function: "getRecentArticles", context: "data_fetching" });
    console.error("[PSP] Failed to fetch recent articles:", errorMessage);
    return [];
  }
}

async function getFeaturedAlumni() {
  try {
    const supabase = await createClient();
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    captureError(error, { function: "getFeaturedAlumni", context: "data_fetching" });
    console.error("[PSP] Failed to fetch featured alumni:", errorMessage);
    return [];
  }
}

async function getRecentScores() {
  try {
    const supabase = await createClient();
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    captureError(error, { function: "getRecentScores", context: "data_fetching" });
    console.error("[PSP] Failed to fetch recent scores:", errorMessage);
    return [];
  }
}

async function getPotwNominees() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("potw_nominees")
      .select("id, player_name, school_name, sport_id, stat_line, votes")
      .eq("is_winner", false)
      .order("votes", { ascending: false })
      .limit(5);
    return data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    captureError(error, { function: "getPotwNominees", context: "data_fetching" });
    console.error("[PSP] Failed to fetch POTW nominees:", errorMessage);
    return [];
  }
}

async function getHotTakes() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("hot_takes")
      .select("id, user_handle, content, type, upvotes, downvotes, created_at")
      .order("created_at", { ascending: false })
      .limit(3);
    return data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    captureError(error, { function: "getHotTakes", context: "data_fetching" });
    console.error("[PSP] Failed to fetch hot takes:", errorMessage);
    return [];
  }
}

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

export default async function HomePage() {
  let stats = { schools: 405, players: 10057, seasons: 76, championships: 713 };
  let articles: Article[] = [];
  let featuredAlumni: FeaturedAlumni[] = [];
  let recentScores: GameScore[] = [];
  let potwNominees: PotwNominee[] = [];
  let hotTakes: HotTake[] = [];

  try {
    const results = await Promise.allSettled([
      getOverviewStats(),
      getRecentArticles(3),
      getFeaturedAlumni(),
      getRecentScores(),
      getPotwNominees(),
      getHotTakes(),
    ]);

    const [statsResult, articlesResult, alumniResult, scoresResult, potwResult, hotTakesResult] = results;

    if (statsResult.status === "fulfilled") stats = statsResult.value;
    if (articlesResult.status === "fulfilled") articles = articlesResult.value;
    if (alumniResult.status === "fulfilled") featuredAlumni = alumniResult.value;
    if (scoresResult.status === "fulfilled") recentScores = scoresResult.value;
    if (potwResult.status === "fulfilled") potwNominees = potwResult.value;
    if (hotTakesResult.status === "fulfilled") hotTakes = hotTakesResult.value;

    if (statsResult.status === "rejected") {
      captureError(statsResult.reason, { function: "HomePage", fetch: "getOverviewStats" });
    }
    if (articlesResult.status === "rejected") {
      captureError(articlesResult.reason, { function: "HomePage", fetch: "getRecentArticles" });
    }
    if (alumniResult.status === "rejected") {
      captureError(alumniResult.reason, { function: "HomePage", fetch: "getFeaturedAlumni" });
    }
    if (scoresResult.status === "rejected") {
      captureError(scoresResult.reason, { function: "HomePage", fetch: "getRecentScores" });
    }
    if (potwResult.status === "rejected") {
      captureError(potwResult.reason, { function: "HomePage", fetch: "getPotwNominees" });
    }
    if (hotTakesResult.status === "rejected") {
      captureError(hotTakesResult.reason, { function: "HomePage", fetch: "getHotTakes" });
    }
  } catch (error) {
    captureError(error, { function: "HomePage", context: "data_fetching" });
  }

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
      emoji: getSportEmoji(person.sport_id),
      name: person.person_name,
      team: person.current_org,
      role: person.current_role || undefined,
      hs: schoolName || "Unknown",
    };
  });

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

  const sampleHotTakes = [
    {
      id: "sample1",
      userHandle: "@PhillyHoops",
      content: "The 2024 season is looking like the most competitive basketball year we've seen in a decade",
      type: "take",
      upvotes: 342,
      downvotes: 18,
      createdAt: new Date().toISOString(),
    },
    {
      id: "sample2",
      userHandle: "@GridironGuru",
      content: "Central High's offense is the most explosive in the entire region right now",
      type: "take",
      upvotes: 298,
      downvotes: 24,
      createdAt: new Date().toISOString(),
    },
    {
      id: "sample3",
      userHandle: "@BaseballBuff",
      content: "This year's playoff race is going to come down to the wire with 3 schools tied",
      type: "take",
      upvotes: 267,
      downvotes: 15,
      createdAt: new Date().toISOString(),
    },
  ];

  const displayHotTakes = hotTakes.length > 0 ? hotTakes.map((take) => ({
    id: take.id,
    userHandle: take.user_handle,
    content: take.content,
    type: take.type,
    upvotes: take.upvotes,
    downvotes: take.downvotes,
    createdAt: take.created_at,
  })) : sampleHotTakes;

  return (
    <HomePageClient
      stats={stats}
      articles={displayArticles}
      alumni={displayAlumni}
      recentScores={displayScores}
      potwNominees={displayPotw}
      hotTakes={displayHotTakes}
      websiteJsonLd={websiteJsonLd}
    />
  );
}
