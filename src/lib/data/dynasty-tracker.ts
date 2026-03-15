import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
} from "./common";

/**
 * Dynasty data grouped by decade
 */
export interface DynastyDecadeData {
  decade: string; // "1890s", "1900s", etc.
  year_start: number;
  schools: Array<{
    school_id: number;
    school_name: string;
    school_slug: string;
    championship_count: number;
    colors?: {
      primary?: string;
      secondary?: string;
    };
  }>;
}

/**
 * Overall dynasty leader
 */
export interface DynastyLeader {
  school_id: number;
  school_name: string;
  school_slug: string;
  total_championships: number;
  championships_by_level: Record<string, number>;
  latest_championship_year: number;
  colors?: {
    primary?: string;
    secondary?: string;
  };
}

/**
 * Get dynasty data by decade for a sport
 */
export const getDynastyTrackerData = cache(
  async (sportSlug: string): Promise<DynastyDecadeData[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get all championships for the sport
            const { data: championships, error } = await supabase
              .from("championships")
              .select(
                `id, school_id, season_id, level,
                 schools(id, name, slug, school_colors),
                 seasons(year_start, year_end, label)`
              )
              .eq("sport_id", sportSlug)
              .limit(5000);

            if (error) {
              console.error("Dynasty tracker query error:", error);
              return [];
            }

            if (!championships) return [];

            // Group by decade
            const decadeMap: Record<string, DynastyDecadeData> = {};

            for (const champ of championships) {
              const season = champ.seasons as any;
              if (!season?.year_start) continue;

              const decade = Math.floor(season.year_start / 10) * 10;
              const decadeKey = `${decade}s`;
              const yearStart = decade;

              if (!decadeMap[decadeKey]) {
                decadeMap[decadeKey] = {
                  decade: decadeKey,
                  year_start: yearStart,
                  schools: [],
                };
              }

              // Find or create school entry for this decade
              const school = champ.schools as any;
              let schoolEntry = decadeMap[decadeKey].schools.find(
                (s) => s.school_id === school.id
              );

              if (!schoolEntry) {
                schoolEntry = {
                  school_id: school.id,
                  school_name: school.name,
                  school_slug: school.slug,
                  championship_count: 0,
                  colors: school.school_colors || {},
                };
                decadeMap[decadeKey].schools.push(schoolEntry);
              }

              schoolEntry.championship_count += 1;
            }

            // Sort schools within each decade by championship count
            const decades = Object.values(decadeMap)
              .sort((a, b) => a.year_start - b.year_start)
              .map((d) => ({
                ...d,
                schools: d.schools.sort(
                  (a, b) => b.championship_count - a.championship_count
                ),
              }));

            return decades;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_DYNASTY_TRACKER",
      { sportSlug }
    );
  }
);

/**
 * Get all-time dynasty leaders for a sport
 */
export const getDynastyLeaders = cache(
  async (sportSlug: string, limit: number = 10): Promise<DynastyLeader[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            const { data: championships, error } = await supabase
              .from("championships")
              .select(
                `id, school_id, level,
                 schools(id, name, slug, school_colors),
                 seasons(year_start, year_end, label)`
              )
              .eq("sport_id", sportSlug)
              .limit(5000);

            if (error) {
              console.error("Dynasty leaders query error:", error);
              return [];
            }

            if (!championships) return [];

            // Aggregate by school
            const schoolMap: Record<number, DynastyLeader> = {};

            for (const champ of championships) {
              const school = champ.schools as any;
              const season = champ.seasons as any;

              if (!schoolMap[school.id]) {
                schoolMap[school.id] = {
                  school_id: school.id,
                  school_name: school.name,
                  school_slug: school.slug,
                  total_championships: 0,
                  championships_by_level: {},
                  latest_championship_year: 0,
                  colors: school.school_colors || {},
                };
              }

              schoolMap[school.id].total_championships += 1;

              const level = champ.level || "other";
              schoolMap[school.id].championships_by_level[level] =
                (schoolMap[school.id].championships_by_level[level] || 0) + 1;

              if (season?.year_start > schoolMap[school.id].latest_championship_year) {
                schoolMap[school.id].latest_championship_year = season.year_start;
              }
            }

            // Sort and return top N
            return Object.values(schoolMap)
              .sort((a, b) => b.total_championships - a.total_championships)
              .slice(0, limit);
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_DYNASTY_LEADERS",
      { sportSlug, limit }
    );
  }
);

/**
 * Get available decades for a sport
 */
export async function getAvailableDecades(sportSlug: string): Promise<string[]> {
  const data = await getDynastyTrackerData(sportSlug);
  return data.map((d) => d.decade);
}
