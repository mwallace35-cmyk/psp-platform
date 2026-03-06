import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { VALID_SPORTS } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://phillysportspack.com";
  const supabase = await createClient();

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

    // Career leaderboards (football + basketball only)
    if (sport === "football" || sport === "basketball") {
      const careerStats = sport === "football"
        ? ["rushing", "passing", "receiving", "scoring"]
        : ["scoring", "ppg", "rebounds", "assists"];
      for (const stat of careerStats) {
        entries.push({
          url: `${baseUrl}/${sport}/career-leaders/${stat}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  // Fetch all schools and add to sitemap
  try {
    const { data: schools } = await supabase
      .from("schools")
      .select("slug, sport_id")
      .order("slug");

    if (schools) {
      // Group schools by sport for efficient querying
      const sportSchools: Record<string, Set<string>> = {};
      for (const school of schools) {
        if (!sportSchools[school.sport_id]) {
          sportSchools[school.sport_id] = new Set();
        }
        sportSchools[school.sport_id].add(school.slug);
      }

      for (const [sport, schoolSlugs] of Object.entries(sportSchools)) {
        for (const slug of schoolSlugs) {
          entries.push({
            url: `${baseUrl}/schools/${slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching schools for sitemap:", error);
  }

  // Fetch all players and add to sitemap
  try {
    const { data: players } = await supabase
      .from("players")
      .select("slug, primary_sport")
      .order("slug");

    if (players) {
      for (const player of players) {
        entries.push({
          url: `${baseUrl}/${player.primary_sport}/players/${player.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching players for sitemap:", error);
  }

  // Fetch all coaches and add to sitemap
  try {
    const { data: coaches } = await supabase
      .from("coaches")
      .select("slug, sport_id")
      .order("slug");

    if (coaches) {
      for (const coach of coaches) {
        entries.push({
          url: `${baseUrl}/${coach.sport_id}/coaches/${coach.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching coaches for sitemap:", error);
  }

  // Rivalries
  entries.push({
    url: `${baseUrl}/rivalries`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  });

  try {
    const { data: rivalriesData } = await supabase
      .from("rivalries")
      .select("slug")
      .order("slug");

    if (rivalriesData) {
      for (const rivalry of rivalriesData) {
        entries.push({
          url: `${baseUrl}/rivalries/${rivalry.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching rivalries for sitemap:", error);
  }

  // Games (recent games with scores — limit to most recent 500 for sitemap size)
  try {
    const { data: games } = await supabase
      .from("games")
      .select("id, sport_id, game_date")
      .not("home_score", "is", null)
      .not("away_score", "is", null)
      .order("game_date", { ascending: false })
      .limit(500);

    if (games) {
      for (const game of games) {
        entries.push({
          url: `${baseUrl}/${game.sport_id}/games/${game.id}`,
          lastModified: game.game_date ? new Date(game.game_date) : new Date(),
          changeFrequency: "yearly" as const,
          priority: 0.5,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching games for sitemap:", error);
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
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare-schools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/scores`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/our-guys`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/corrections`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/embed`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    }
  );

  // Add analytics and decade pages per sport
  for (const sport of ["football", "basketball", "baseball"]) {
    entries.push({
      url: `${baseUrl}/${sport}/analytics`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const decade of ["2000s", "2010s", "2020s"]) {
      entries.push({
        url: `${baseUrl}/${sport}/decades/${decade}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Fetch articles for sitemap
  try {
    const { data: articles } = await supabase
      .from("articles")
      .select("slug, updated_at")
      .eq("status", "published")
      .order("slug");

    if (articles) {
      for (const article of articles) {
        entries.push({
          url: `${baseUrl}/articles/${article.slug}`,
          lastModified: new Date(article.updated_at || Date.now()),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching articles for sitemap:", error);
  }

  return entries;
}
