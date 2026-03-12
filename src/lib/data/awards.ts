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
 * Get all-city awards by year for a sport
 */
export const getAllCityByYear = cache(async (sport: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Query awards with type matching all-city, all-state, all-public, all-catholic, or all-inter-ac
          const { data } = await supabase
            .from("awards")
            .select(
              `
              id,
              award_type,
              award_name,
              category,
              position,
              source,
              created_at,
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
            .limit(2000)
            .eq("sport_id", sport)
            .or(
              `award_type.eq.all-city,award_type.eq.all-state,award_type.eq.all-public,award_type.eq.all-catholic,award_type.eq.all-inter-ac,award_type.eq.all-scholastic,award_type.eq.all-decade,award_type.eq.all-era`
            )
            .order("seasons(year_start)", { ascending: false });

          return (data || []) as unknown as AwardRecord[];
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
 * Get all-city summary stats
 */
export const getAllCitySummary = cache(async (sport: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Get all All-City awards with player/school info
          const { data } = await supabase
            .from("awards")
            .select(
              `
              id,
              award_type,
              players(primary_school_id, schools(name, slug)),
              seasons(year_start)
            `
            )
            .eq("sport_id", sport)
            .or(
              `award_type.eq.all-city,award_type.eq.all-state,award_type.eq.all-public,award_type.eq.all-catholic,award_type.eq.all-inter-ac,award_type.eq.all-scholastic,award_type.eq.all-decade,award_type.eq.all-era`
            )
            .limit(2000);

          interface AwardRecord {
            seasons?: { year_start: number };
            players?: { schools?: { slug: string } };
            [key: string]: unknown;
          }
          const awards = (data || []) as unknown as AwardRecord[];

          // Calculate summary stats
          const totalSelections = awards.length;
          const yearsSet = new Set<number>();
          const schoolsSet = new Set<string>();

          for (const award of awards) {
            if (award.seasons?.year_start) {
              yearsSet.add(award.seasons.year_start);
            }
            if (award.players?.schools?.slug) {
              schoolsSet.add(award.players.schools.slug);
            }
          }

          // Top schools by selection count
          const schoolCounts: Record<string, { name: string; count: number }> = {};
          for (const award of awards) {
            const schools = award.players?.schools as unknown as any[];
            if (Array.isArray(schools)) {
              for (const school of schools) {
                if (school?.name && school?.slug) {
                  const key = school.slug;
                  if (!schoolCounts[key]) {
                    schoolCounts[key] = { name: school.name, count: 0 };
                  }
                  schoolCounts[key].count++;
                }
              }
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
