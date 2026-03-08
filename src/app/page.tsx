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

export default async function HomePage() {
  let stats = { schools: 405, players: 10057, seasons: 76, championships: 713 };
  let articles: Article[] = [];
  let featuredAlumni: FeaturedAlumni[] = [];

  try {
    const results = await Promise.allSettled([
      getOverviewStats(),
      getRecentArticles(3),
      getFeaturedAlumni(),
    ]);

    const [statsResult, articlesResult, alumniResult] = results;

    if (statsResult.status === "fulfilled") stats = statsResult.value;
    if (articlesResult.status === "fulfilled") articles = articlesResult.value;
    if (alumniResult.status === "fulfilled") featuredAlumni = alumniResult.value;

    if (statsResult.status === "rejected") {
      captureError(statsResult.reason, { function: "HomePage", fetch: "getOverviewStats" });
    }
    if (articlesResult.status === "rejected") {
      captureError(articlesResult.reason, { function: "HomePage", fetch: "getRecentArticles" });
    }
    if (alumniResult.status === "rejected") {
      captureError(alumniResult.reason, { function: "HomePage", fetch: "getFeaturedAlumni" });
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

  return (
    <HomePageClient
      stats={stats}
      articles={displayArticles}
      alumni={displayAlumni}
      websiteJsonLd={websiteJsonLd}
    />
  );
}
