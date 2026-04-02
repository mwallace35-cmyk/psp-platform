import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  Season,
} from "./common";

/**
 * Award with player and school details
 */
export interface AwardDetail {
  id: number;
  award_type: string;
  award_name?: string;
  category?: string;
  position?: string;
  sport_id: string;
  year?: number;
  player_name?: string;
  players?: {
    id: number;
    name: string;
    slug: string;
    primary_school_id?: number;
    schools?: {
      id: number;
      name: string;
      slug: string;
    } | null;
  } | null;
  seasons?: Season | null;
}

/**
 * Awards summary statistics
 */
export interface AwardsSummary {
  total: number;
  byType: Record<string, number>;
  byYear: Record<number, number>;
  topSchools: Array<{ id: number; name: string; slug: string; count: number }>;
  yearRange: { min: number; max: number };
}

/**
 * Get awards summary stats for all sports
 */
export const getAwardsSummary = cache(async () => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Use SQL aggregation instead of fetching 25K rows
          const [countResult, typeResult, yearMinResult, yearMaxResult] = await Promise.all([
            supabase.from("awards").select("id", { count: "exact", head: true }),
            supabase.rpc("awards_count_by_type"),
            supabase.from("awards").select("seasons(year_start)").not("season_id", "is", null).order("season_id", { ascending: true }).limit(1),
            supabase.from("awards").select("seasons(year_start)").not("season_id", "is", null).order("season_id", { ascending: false }).limit(1),
          ]);

          const byType: Record<string, number> = {};
          for (const row of (typeResult.data || []) as { award_type: string; cnt: number }[]) {
            byType[row.award_type] = Number(row.cnt);
          }

          const minYear = (yearMinResult.data?.[0] as any)?.seasons?.year_start || 1932;
          const maxYear = (yearMaxResult.data?.[0] as any)?.seasons?.year_start || 2025;

          return {
            total: countResult.count || 0,
            byType,
            byYear: {},
            topSchools: [],
            yearRange: { min: minYear, max: maxYear },
          } as AwardsSummary;
        },
        { maxRetries: 3 }
      );
    },
    {
      total: 0,
      byType: {},
      byYear: {},
      topSchools: [],
      yearRange: { min: 0, max: 0 },
    },
    "getAwardsSummary",
    {}
  );
});

/**
 * Get recent awards across all sports
 */
export const getRecentAwards = cache(async (limit = 50) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const { data, error } = await supabase
            .from("awards")
            .select(
              `
              id,
              award_type,
              award_name,
              category,
              position,
              sport_id,
              season_id,
              player_name,
              players(
                id,
                name,
                slug,
                primary_school_id,
                schools(id, name, slug)
              ),
              seasons(id, year_start, year_end, label)
            `
            )
            .order("created_at", { ascending: false })
            .limit(Math.min(limit, 500));

          if (error) {
            console.error("[getRecentAwards] Supabase error:", error);
          }

          return (data || []) as unknown as AwardDetail[];
        },
        { maxRetries: 2 }
      );
    },
    [],
    "getRecentAwards",
    { limit }
  );
});

/**
 * Get top awarded schools by count
 */
export const getTopAwardedSchools = cache(async (limit = 15) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Use SQL aggregation instead of fetching 25K rows
          const { data, error } = await supabase.rpc("top_awarded_schools", { lim: limit });

          if (error) {
            console.error("[getTopAwardedSchools] Supabase error:", error);
          }

          return ((data || []) as { school_id: number; school_name: string; school_slug: string; cnt: number }[])
            .map((row) => ({
              id: row.school_id,
              name: row.school_name,
              slug: row.school_slug,
              count: Number(row.cnt),
            }));
        },
        { maxRetries: 2 }
      );
    },
    [],
    "getTopAwardedSchools",
    { limit }
  );
});

/**
 * Get awards by type and sport for tabbed browsing
 */
export const getAwardsByType = cache(
  async (awardType: string, sport?: string, limit = 100) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            let query = supabase
              .from("awards")
              .select(
                `
                id,
                award_type,
                award_name,
                category,
                position,
                sport_id,
                player_name,
                players(
                  id,
                  name,
                  slug,
                  primary_school_id,
                  schools(id, name, slug)
                ),
                seasons(id, year_start, year_end, label)
              `
              );

            // Filter by type - support multiple types
            if (awardType === "all-city") {
              query = query.or(
                "award_type.eq.all-city,award_type.eq.all-state,award_type.eq.all-public,award_type.eq.all-catholic,award_type.eq.all-inter-ac,award_type.eq.all-scholastic"
              );
            } else if (awardType === "player-of-year") {
              query = query.or(
                "award_type.eq.player-of-year,award_type.eq.daily-news-player-of-year,award_type.eq.daily-news-pitcher-of-year,award_type.eq.pitcher-of-year,award_type.eq.coaches-mvp,award_type.eq.markward"
              );
            } else if (awardType === "hall-of-fame") {
              query = query.or(
                "award_type.eq.hall-of-fame,award_type.eq.all-era,award_type.eq.all-decade"
              );
            } else if (awardType === "all-league") {
              query = query.or(
                "award_type.eq.all-league,award_type.eq.coaches-all-league,award_type.eq.stat-leader"
              );
            }

            if (sport) {
              query = query.eq("sport_id", sport);
            }

            const { data, error } = await query
              .order("season_id", { ascending: false })
              .limit(Math.min(limit, 500));

            if (error) {
              console.error("[getAwardsByType] Supabase error:", {
                error,
                awardType,
                sport,
              });
            }

            return (data || []) as unknown as AwardDetail[];
          },
          { maxRetries: 2 }
        );
      },
      [],
      "getAwardsByType",
      { awardType, sport, limit }
    );
  }
);

/**
 * Championship record for hub display
 */
export interface ChampionshipHubRecord {
  id: number;
  sport_id: string;
  level: string;
  championship_type: string;
  result?: string;
  score?: string;
  venue?: string;
  notes?: string;
  schools?: { id: number; name: string; slug: string } | null;
  seasons?: { year_start: number; year_end: number; label: string } | null;
}

/**
 * Get championship counts by sport for the hub
 */
export const getChampionshipsSummary = cache(async () => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data, error } = await supabase
            .from("championships")
            .select("id, sport_id")
            .limit(5000);

          if (error) console.error("[getChampionshipsSummary] error:", error);

          const bySport: Record<string, number> = {};
          let total = 0;
          for (const row of (data || []) as { id: number; sport_id: string }[]) {
            bySport[row.sport_id] = (bySport[row.sport_id] || 0) + 1;
            total++;
          }
          return { total, bySport };
        },
        { maxRetries: 2 }
      );
    },
    { total: 0, bySport: {} },
    "getChampionshipsSummary",
    {}
  );
});

/**
 * Get recent championships across all sports
 */
export const getRecentChampionships = cache(async (limit = 50) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data, error } = await supabase
            .from("championships")
            .select(`
              id, sport_id, level, championship_type, result, score, venue, notes,
              schools!championships_school_id_fkey(id, name, slug),
              seasons(year_start, year_end, label)
            `)
            .order("season_id", { ascending: false })
            .limit(limit);

          if (error) console.error("[getRecentChampionships] error:", error);
          return (data || []) as unknown as ChampionshipHubRecord[];
        },
        { maxRetries: 2 }
      );
    },
    [],
    "getRecentChampionships",
    { limit }
  );
});

/**
 * Dynasty tracker: top schools by championship count
 */
export const getDynastyTracker = cache(async (limit = 20) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data, error } = await supabase
            .from("championships")
            .select("id, schools!championships_school_id_fkey(id, name, slug)")
            .limit(5000);

          if (error) console.error("[getDynastyTracker] error:", error);

          const schoolCounts: Record<number, { name: string; slug: string; count: number }> = {};
          for (const row of (data || []) as any[]) {
            const school = row.schools;
            if (school?.id) {
              if (!schoolCounts[school.id]) {
                schoolCounts[school.id] = { name: school.name, slug: school.slug, count: 0 };
              }
              schoolCounts[school.id].count++;
            }
          }

          return Object.entries(schoolCounts)
            .map(([id, s]) => ({ id: parseInt(id), ...s }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
        },
        { maxRetries: 2 }
      );
    },
    [],
    "getDynastyTracker",
    { limit }
  );
});

/**
 * Awards count by sport for the hub sport cards
 */
export const getAwardsCountBySport = cache(async () => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          // Use SQL aggregation instead of fetching 30K rows
          const { data, error } = await supabase.rpc("awards_count_by_sport");

          if (error) console.error("[getAwardsCountBySport] error:", error);

          const bySport: Record<string, number> = {};
          for (const row of (data || []) as { sport: string; cnt: number }[]) {
            bySport[row.sport] = Number(row.cnt);
          }
          return bySport;
        },
        { maxRetries: 2 }
      );
    },
    {},
    "getAwardsCountBySport",
    {}
  );
});

/**
 * Get pro athletes count for hub display
 */
export const getProAthletesCount = cache(async () => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { count, error } = await supabase
            .from("next_level_tracking")
            .select("id", { count: "exact", head: true })
            .in("current_level", ["NFL", "NBA", "MLB", "ABA"]);

          if (error) console.error("[getProAthletesCount] error:", error);
          return count || 0;
        },
        { maxRetries: 2 }
      );
    },
    0,
    "getProAthletesCount",
    {}
  );
});
