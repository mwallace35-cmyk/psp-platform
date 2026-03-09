import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { VALID_SPORTS } from "@/lib/data";
import { captureError } from "@/lib/error-tracking";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://phillysportspack.com";
  const supabase = await createClient();

  // NOTE: lastModified uses current date for all entries except articles (which have updated_at).
  // This is a tradeoff: we prioritize simplicity and ISR cache efficiency over per-record timestamps.
  // Most entries are regenerated frequently via ISR (3600s for hubs, 86400s for championships),
  // so lastModified accuracy is less critical. Individual record timestamps would require storing
  // metadata on every entity, which adds complexity. Revisit if search crawl frequency becomes problematic.

  // Helper to build sitemap entries
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Add sport hubs
  for (const sport of VALID_SPORTS) {
    entries.push({
      url: `${baseUrl}/${sport}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // Championships pages
    entries.push({
      url: `${baseUrl}/${sport}/championships`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Records pages
    entries.push({
      url: `${baseUrl}/${sport}/records`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Leaderboard stat categories
    const statCategories =
      sport === "football"
        ? ["rushing", "passing", "receiving", "scoring"]
        : sport === "basketball"
          ? ["scoring", "rebounds", "assists"]
          : sport === "baseball"
            ? ["batting", "pitching"]
            : ["goals"];

    for (const stat of statCategories) {
      entries.push({
        url: `${baseUrl}/${sport}/leaderboards/${stat}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Fetch all entities in parallel using Promise.all with individual error handling
  try {
    const results = await Promise.allSettled([
      // Fetch all schools in one query
      supabase.from("team_seasons").select("sport_id, schools(slug)"),
      // Fetch all player IDs from sport-specific tables
      supabase
        .from("football_player_seasons")
        .select("player_id")
        .is("deleted_at", null),
      supabase
        .from("basketball_player_seasons")
        .select("player_id")
        .is("deleted_at", null),
      supabase
        .from("baseball_player_seasons")
        .select("player_id")
        .is("deleted_at", null),
      // Fetch all players from misc sports table
      supabase.from("player_seasons_misc").select("player_id, sport_id"),
      // Fetch all coaches with their sports
      supabase.from("coaching_stints").select("sport_id, coach_id"),
      // Fetch all published articles
      supabase
        .from("articles")
        .select("slug, updated_at")
        .eq("status", "published")
        .order("slug"),
    ]);

    const [
      schoolsSettled,
      fbPlayersSettled,
      bbPlayersSettled,
      bsbPlayersSettled,
      miscPlayersSettled,
      coachesSettled,
      articlesSettled,
    ] = results;

    // Process schools with error handling
    if (schoolsSettled.status === "fulfilled" && schoolsSettled.value.data) {
      const schoolsResult = schoolsSettled.value;
      const uniqueSlugs = new Set<string>();
      const schoolsData = schoolsResult.data as unknown as Array<{ schools: { slug: string } | null }>;
      for (const ts of schoolsData) {
        const schoolData = ts.schools;
        if (schoolData?.slug) {
          uniqueSlugs.add(schoolData.slug);
        }
      }

      for (const slug of uniqueSlugs) {
        entries.push({
          url: `${baseUrl}/football/schools/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    } else if (schoolsSettled.status === "rejected") {
      captureError(schoolsSettled.reason, { context: "sitemap", fetch: "schools" });
    }

    // Build player sports map from all sources with error handling
    const playerSportsMap = new Map<number, string>();

    // Map football players
    if (fbPlayersSettled.status === "fulfilled" && fbPlayersSettled.value.data) {
      for (const row of fbPlayersSettled.value.data as Array<{ player_id: number }>) {
        if (!playerSportsMap.has(row.player_id)) {
          playerSportsMap.set(row.player_id, "football");
        }
      }
    } else if (fbPlayersSettled.status === "rejected") {
      captureError(fbPlayersSettled.reason, { context: "sitemap", fetch: "football_players" });
    }

    // Map basketball players
    if (bbPlayersSettled.status === "fulfilled" && bbPlayersSettled.value.data) {
      for (const row of bbPlayersSettled.value.data as Array<{ player_id: number }>) {
        if (!playerSportsMap.has(row.player_id)) {
          playerSportsMap.set(row.player_id, "basketball");
        }
      }
    } else if (bbPlayersSettled.status === "rejected") {
      captureError(bbPlayersSettled.reason, { context: "sitemap", fetch: "basketball_players" });
    }

    // Map baseball players
    if (bsbPlayersSettled.status === "fulfilled" && bsbPlayersSettled.value.data) {
      for (const row of bsbPlayersSettled.value.data as Array<{ player_id: number }>) {
        if (!playerSportsMap.has(row.player_id)) {
          playerSportsMap.set(row.player_id, "baseball");
        }
      }
    } else if (bsbPlayersSettled.status === "rejected") {
      captureError(bsbPlayersSettled.reason, { context: "sitemap", fetch: "baseball_players" });
    }

    // Map minor sport players
    if (miscPlayersSettled.status === "fulfilled" && miscPlayersSettled.value.data) {
      for (const row of miscPlayersSettled.value.data as Array<{ player_id: number; sport_id: string | null }>) {
        if (!playerSportsMap.has(row.player_id)) {
          playerSportsMap.set(row.player_id, row.sport_id || "miscellaneous");
        }
      }
    } else if (miscPlayersSettled.status === "rejected") {
      captureError(miscPlayersSettled.reason, { context: "sitemap", fetch: "misc_players" });
    }

    // Fetch all players in one query and add to sitemap
    if (playerSportsMap.size > 0) {
      try {
        const { data: players } = await supabase
          .from("players")
          .select("id, slug")
          .is("deleted_at", null)
          .order("slug");

        if (players) {
          for (const player of players as Array<{ id: number; slug: string }>) {
            const sport = playerSportsMap.get(player.id);
            if (sport) {
              entries.push({
                url: `${baseUrl}/${sport}/players/${player.slug}`,
                lastModified: new Date(),
                changeFrequency: "monthly",
                priority: 0.7,
              });
            }
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching player slugs for sitemap:", error);
        }
      }
    }

    // Build coach sports map with error handling
    const coachSportsMap = new Map<number, string>();

    if (coachesSettled.status === "fulfilled" && coachesSettled.value.data) {
      for (const stint of coachesSettled.value.data as Array<{ coach_id: number; sport_id: string | null }>) {
        if (!coachSportsMap.has(stint.coach_id)) {
          coachSportsMap.set(stint.coach_id, stint.sport_id || "football");
        }
      }
    } else if (coachesSettled.status === "rejected") {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to fetch coaches for sitemap:", coachesSettled.reason);
      }
      captureError(coachesSettled.reason, { context: "sitemap", fetch: "coaches" });
    }

    // Fetch all coaches in one query and add to sitemap
    if (coachSportsMap.size > 0) {
      try {
        const { data: coaches } = await supabase
          .from("coaches")
          .select("id, slug")
          .is("deleted_at", null)
          .order("slug");

        if (coaches) {
          for (const coach of coaches as Array<{ id: number; slug: string }>) {
            const sport = coachSportsMap.get(coach.id);
            if (sport) {
              entries.push({
                url: `${baseUrl}/${sport}/coaches/${coach.slug}`,
                lastModified: new Date(),
                changeFrequency: "monthly",
                priority: 0.6,
              });
            }
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching coach slugs for sitemap:", error);
        }
      }
    }

    // Process articles with error handling
    if (articlesSettled.status === "fulfilled" && articlesSettled.value.data) {
      for (const article of articlesSettled.value.data as Array<{ slug: string; updated_at: string | null }>) {
        entries.push({
          url: `${baseUrl}/articles/${article.slug}`,
          lastModified: new Date(article.updated_at || Date.now()),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    } else if (articlesSettled.status === "rejected") {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to fetch articles for sitemap:", articlesSettled.reason);
      }
      captureError(articlesSettled.reason, { context: "sitemap", fetch: "articles" });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error during sitemap generation:", error);
    }
    captureError(error, { context: "sitemap_generation" });
  }

  // Public content pages
  entries.push(
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/potw`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/coaches`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    }
  );

  return entries;
}
