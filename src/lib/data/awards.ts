import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  type Season,
} from "./common";

/**
 * Award record with all relations
 */
export interface AwardRecord {
  id: number;
  award_type: string;
  award_name?: string;
  category?: string;
  position?: string;
  source?: string;
  created_at?: string;
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
 * All-City selection by year
 */
export interface AllCityYear {
  year_start: number;
  year_end: number;
  label: string;
  awards: AwardRecord[];
}

/**
 * Get all-city awards by year for a sport — uses RPC to bypass PostgREST 1000-row limit
 */
export const getAllCityByYear = cache(async (sport: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const { data, error } = await supabase.rpc("get_all_city_awards", {
            p_sport_id: sport,
          });

          if (error) {
            console.warn("[PSP] get_all_city_awards RPC failed:", error.message);
            return [];
          }

          // Map RPC rows to AwardRecord format expected by page
          return ((data ?? []) as any[]).map((row) => ({
            id: row.award_id,
            award_type: row.award_type,
            award_name: row.award_name,
            category: row.category,
            position: row.award_position,
            source: row.award_source,
            players: row.player_id
              ? {
                  id: row.player_id,
                  name: row.player_name,
                  slug: row.player_slug,
                  primary_school_id: row.school_id,
                  schools: row.school_id
                    ? {
                        id: row.school_id,
                        name: row.school_name,
                        slug: row.school_slug,
                      }
                    : null,
                }
              : null,
            seasons: row.year_start
              ? {
                  id: 0,
                  year_start: row.year_start,
                  year_end: row.year_end,
                  label: row.season_label,
                }
              : null,
          })) as AwardRecord[];
        },
        { maxRetries: 3 }
      );
    },
    [],
    "getAllCityByYear",
    { sport }
  );
});

/**
 * Get all-city summary stats — computed from the same RPC data
 */
export const getAllCitySummary = cache(async (sport: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const { data, error } = await supabase.rpc("get_all_city_awards", {
            p_sport_id: sport,
          });

          if (error) {
            console.warn("[PSP] get_all_city_awards RPC (summary) failed:", error.message);
            return {
              totalSelections: 0,
              yearsSpanned: { min: 0, max: 0 },
              schoolsRepresented: 0,
              topSchools: [] as { name: string; count: number }[],
            };
          }

          const awards = (data ?? []) as any[];
          const totalSelections = awards.length;
          const yearsSet = new Set<number>();
          const schoolsSet = new Set<string>();
          const schoolCounts: Record<string, { name: string; count: number }> = {};

          for (const row of awards) {
            if (row.year_start) {
              yearsSet.add(row.year_start);
            }
            if (row.school_slug) {
              schoolsSet.add(row.school_slug);
              if (!schoolCounts[row.school_slug]) {
                schoolCounts[row.school_slug] = { name: row.school_name, count: 0 };
              }
              schoolCounts[row.school_slug].count++;
            }
          }

          const topSchools = Object.values(schoolCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

          return {
            totalSelections,
            yearsSpanned: {
              min: yearsSet.size > 0 ? Math.min(...Array.from(yearsSet)) : 0,
              max: yearsSet.size > 0 ? Math.max(...Array.from(yearsSet)) : 0,
            },
            schoolsRepresented: schoolsSet.size,
            topSchools,
          };
        },
        { maxRetries: 3 }
      );
    },
    {
      totalSelections: 0,
      yearsSpanned: { min: 0, max: 0 },
      schoolsRepresented: 0,
      topSchools: [],
    },
    "getAllCitySummary",
    { sport }
  );
});
