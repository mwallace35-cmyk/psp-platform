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

          // Fetch all awards with aggregated data
          const { data } = await supabase
            .from("awards")
            .select(
              `
              id,
              award_type,
              sport_id,
              seasons(year_start),
              players(
                primary_school_id,
                schools(id, name, slug)
              )
            `
            )
            .is("deleted_at", null);

          interface AwardRecord {
            award_type?: string;
            sport_id?: string;
            seasons?: { year_start?: number };
            players?: {
              primary_school_id?: number;
              schools?: { id: number; name: string; slug: string };
            };
          }

          const awards = (data || []) as unknown as AwardRecord[];
          const summary: AwardsSummary = {
            total: awards.length,
            byType: {},
            byYear: {},
            topSchools: [],
            yearRange: { min: 9999, max: 0 },
          };

          const schoolCounts: Record<number, { name: string; slug: string; count: number }> = {};

          for (const award of awards) {
            // Count by type
            const type = award.award_type || "other";
            summary.byType[type] = (summary.byType[type] || 0) + 1;

            // Count by year
            const year = award.seasons?.year_start;
            if (year) {
              summary.byYear[year] = (summary.byYear[year] || 0) + 1;
              summary.yearRange.min = Math.min(summary.yearRange.min, year);
              summary.yearRange.max = Math.max(summary.yearRange.max, year);
            }

            // Count by school
            if (award.players?.schools?.id) {
              const schoolId = award.players.schools.id;
              if (!schoolCounts[schoolId]) {
                schoolCounts[schoolId] = {
                  name: award.players.schools.name,
                  slug: award.players.schools.slug,
                  count: 0,
                };
              }
              schoolCounts[schoolId].count++;
            }
          }

          // Sort top schools
          summary.topSchools = Object.entries(schoolCounts)
            .map(([id, school]) => ({ id: parseInt(id), ...school }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);

          return summary;
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

          const { data } = await supabase
            .from("awards")
            .select(
              `
              id,
              award_type,
              award_name,
              category,
              position,
              sport_id,
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
            .is("deleted_at", null)
            .order("created_at", { ascending: false })
            .limit(Math.min(limit, 500));

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

          // Fetch awards with school info
          const { data } = await supabase
            .from("awards")
            .select(
              `
              id,
              players(
                schools(id, name, slug)
              )
            `
            )
            .is("deleted_at", null);

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
              .is("deleted_at", null);

            // Filter by type - support multiple types like "all-city" patterns
            if (awardType === "all-city") {
              query = query.or(
                "award_type.eq.all-city,award_type.eq.all-state,award_type.eq.all-public,award_type.eq.all-catholic,award_type.eq.all-inter-ac"
              );
            } else if (awardType === "player-of-year") {
              query = query.eq("award_type", "player-of-year");
            } else if (awardType === "hall-of-fame") {
              query = query.eq("award_type", "hall-of-fame");
            } else if (awardType === "all-league") {
              query = query.or(
                "award_type.eq.all-league,award_type.eq.all-decade"
              );
            }

            if (sport) {
              query = query.eq("sport_id", sport);
            }

            const { data } = await query
              .order("seasons(year_start)", { ascending: false })
              .limit(Math.min(limit, 500));

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
