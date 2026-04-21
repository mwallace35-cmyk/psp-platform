export const revalidate = 3600; // ISR: 1 hour
import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import { VALID_SPORTS } from "@/lib/data";
import { captureError } from "@/lib/error-tracking";
import { getLegendsByCategory } from "@/lib/data/legends";
import { ALL_STATE_CHAMPIONSHIPS } from "@/lib/data/state-champions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://phillysportspack.com";
  const supabase = createStaticClient();

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

    // Awards & Honors pages
    entries.push({
      url: `${baseUrl}/${sport}/awards`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });

    // Leaderboard stat categories
    const statCategories =
      sport === "football"
        ? ["rushing", "passing", "receiving", "scoring"]
        : sport === "basketball" || sport === "girls-basketball"
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
      // Fetch all schools with their sports
      supabase.from("team_seasons").select("sport_id, schools(slug)"),
      // Fetch all player IDs from sport-specific tables
      supabase
        .from("football_player_seasons")
        .select("player_id"),
      supabase
        .from("basketball_player_seasons")
        .select("player_id"),
      supabase
        .from("baseball_player_seasons")
        .select("player_id"),
      // Fetch all coaches with their sports
      supabase.from("coaching_stints").select("sport_id, coach_id"),
      // Fetch all published articles
      supabase
        .from("articles")
        .select("slug, updated_at")
        .eq("status", "published")
        .order("slug"),
      // Fetch all games (each game has a detail page)
      supabase
        .from("games")
        .select("id, sport_id")
        .not("sport_id", "is", null),
    ]);

    const [
      schoolsSettled,
      fbPlayersSettled,
      bbPlayersSettled,
      bsbPlayersSettled,
      coachesSettled,
      articlesSettled,
      gamesSettled,
    ] = results;

    // Process schools with error handling — group by sport
    if (schoolsSettled.status === "fulfilled" && schoolsSettled.value.data) {
      const schoolsResult = schoolsSettled.value;
      const schoolsBySport = new Map<string, Set<string>>();
      const schoolsData = schoolsResult.data as unknown as Array<{ sport_id: string; schools: { slug: string } | null }>;

      for (const ts of schoolsData) {
        const schoolData = ts.schools;
        if (schoolData?.slug) {
          if (!schoolsBySport.has(ts.sport_id)) {
            schoolsBySport.set(ts.sport_id, new Set<string>());
          }
          schoolsBySport.get(ts.sport_id)!.add(schoolData.slug);
        }
      }

      // Add school pages for each sport
      for (const [sport, slugs] of schoolsBySport.entries()) {
        for (const slug of slugs) {
          entries.push({
            url: `${baseUrl}/${sport}/schools/${slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
          });
        }
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

    // Fetch all players in one query and add to sitemap
    if (playerSportsMap.size > 0) {
      try {
        const supabase2 = createStaticClient();
        const { data: players } = await supabase2
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
        const supabase3 = createStaticClient();
        const { data: coaches } = await supabase3
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

    // Process games with box scores with error handling
    if (gamesSettled.status === "fulfilled" && gamesSettled.value.data) {
      for (const game of gamesSettled.value.data as Array<{ id: number; sport_id: string }>) {
        entries.push({
          url: `${baseUrl}/${game.sport_id}/games/${game.id}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    } else if (gamesSettled.status === "rejected") {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to fetch games for sitemap:", gamesSettled.reason);
      }
      captureError(gamesSettled.reason, { context: "sitemap", fetch: "games" });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error during sitemap generation:", error);
    }
    captureError(error, { context: "sitemap_generation" });
  }

  // Ted Silary Archive stories — /stories landing + /stories/[year]/[slug] detail pages
  entries.push({
    url: `${baseUrl}/stories`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  });
  try {
    const supabaseStories = createStaticClient();
    const { data: stories } = await (supabaseStories as unknown as {
      from: (t: string) => {
        select: (c: string) => { order: (c: string, o: { ascending: boolean }) => Promise<{ data: Array<{ year: number; slug: string; updated_at: string | null }> | null }> };
      };
    }).from("archive_stories").select("year, slug, updated_at").order("year", { ascending: false });
    if (stories) {
      for (const s of stories) {
        if (!s.slug) continue;
        entries.push({
          url: `${baseUrl}/stories/${s.year}/${s.slug}`,
          lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
          changeFrequency: "yearly",
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    captureError(error, { context: "sitemap", fetch: "archive_stories" });
  }

  // Public content pages
  entries.push(
    // Main content pages
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
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
    },
    // Pulse / community pages
    {
      url: `${baseUrl}/pulse`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/our-guys`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pulse/calendar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pulse/forum`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/rankings`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pulse/outside-the-215`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // Awards & recognition pages
    {
      url: `${baseUrl}/potw`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Information & reference pages
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/schools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Tools & features
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Community & engagement
    // /community redirects to / — no separate sitemap entry needed
    {
      url: `${baseUrl}/our-guys`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Content / special features
    {
      url: `${baseUrl}/recruiting`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/next-level`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/philly-everywhere`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/challenge`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Authentication
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    }
  );

  // HOF Legends (coaches), In Memoriam, and Player Spotlights
  const hofSections = [
    { path: "legends", category: "coach" as const },
    { path: "in-memoriam", category: "in-memoriam" as const },
    { path: "spotlights", category: "player-spotlight" as const },
  ];

  for (const section of hofSections) {
    entries.push({
      url: `${baseUrl}/hof/${section.path}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    });

    for (const legend of getLegendsByCategory(section.category)) {
      entries.push({
        url: `${baseUrl}/hof/${section.path}/${legend.slug}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.7,
      });
    }
  }

  // Coaching records page
  entries.push({
    url: `${baseUrl}/hof/legends/records`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.8,
  });

  // State champions hub + detail pages
  entries.push({
    url: `${baseUrl}/hof/state-champions`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.8,
  });

  for (const champ of ALL_STATE_CHAMPIONSHIPS) {
    entries.push({
      url: `${baseUrl}/hof/state-champions/${champ.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    });
  }

  return entries;
}
