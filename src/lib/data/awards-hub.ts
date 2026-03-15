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

          // Get total count efficiently
          const { count: total, error: countErr } = await supabase
            .from("awards")
            .select("id", { count: "exact", head: true });

          if (countErr) {
            console.error("[getAwardsSummary] count error:", countErr);
          }

          // Get distinct award types with counts using a lighter query
          const { data: typeData, error: typeErr } = await supabase
            .from("awards")
            .select("award_type")
            .limit(25000);

          if (typeErr) {
            console.error("[getAwardsSummary] type error:", typeErr);
          }

          const byType: Record<string, number> = {};
          for (const row of (typeData || []) as { award_type: string }[]) {
            const t = row.award_type || "other";
            byType[t] = (byType[t] || 0) + 1;
          }

          // Get year range from seasons join — just grab a sample
          const { data: yearData } = await supabase
            .from("awards")
            .select("seasons(year_start)")
            .not("season_id", "is", null)
            .order("season_id", { ascending: true })
            .limit(1);

          const { data: yearDataMax } = await supabase
            .from("awards")
            .select("seasons(year_start)")
            .not("season_id", "is", null)
            .order("season_id", { ascending: false })
            .limit(1);

          const minYear = (yearData?.[0] as any)?.seasons?.year_start || 1932;
          const maxYear = (yearDataMax?.[0] as any)?.seasons?.year_start || 2025;

          return {
            total: total || 0,
            byType,
            byYear: {},  // Skip per-year breakdown for performance
            topSchools: [], // Fetched separately by getTopAwardedSchools
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

          // Use a lighter query — just get school_id from the join
          const { data, error } = await supabase
            .from("awards")
            .select(
              `
              id,
              players(
                schools(id, name, slug)
              )
            `
            )
            .not("player_id", "is", null)
            .limit(25000);

          if (error) {
            console.error("[getTopAwardedSchools] Supabase error:", error);
          }

          interface AwardRecord {
            players?: { schools?: { id: number; name: string; slug: string } };
          }

          const awards = (data || []) as unknown as AwardRecord[];
          const schoolCounts: Record<number, { name: string; slug: string; count: number }> = {};

          for (const award of awards) {
            const school = award.players?.schools;
            if (school?.id) {
              if (!schoolCounts[school.id]) {
                schoolCounts[school.id] = {
                  name: school.name,
                  slug: school.slug,
                  count: 0,
                };
              }
              schoolCounts[school.id].count++;
            }
          }

          return Object.entries(schoolCounts)
            .map(([id, school]) => ({ id: parseInt(id), ...school }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
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
