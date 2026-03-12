import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  Championship,
  School,
} from "./common";

/**
 * Dynasty ranking with full details
 */
export interface DynastyRanking {
  school: School;
  total_titles: number;
  titles_by_decade: Record<string, number>;
  latest_title_year: number;
  titles_by_level: Record<string, number>;
}

/**
 * Championship timeline point
 */
export interface ChampionshipYear {
  year: number;
  level: string;
  league?: string;
  opponent?: string;
  score?: string;
}

/**
 * Get dynasty rankings for a sport (schools ranked by championship count)
 */
export const getDynastyRankings = cache(
  async (sportSlug: string): Promise<DynastyRanking[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data: championships, error } = await supabase
              .from("championships")
              .select(
                `id, school_id, season_id, level, league_id,
                 schools!championships_school_id_fkey(id, name, slug, short_name, city, state),
                 seasons(year_start, year_end, label),
                 leagues(name)`
              )
              .eq("sport_id", sportSlug)
              .limit(1000);

            if (error) {
              console.error("Dynasty rankings query error:", error);
              return [];
            }

            // Group championships by school
            const dynastyMap: Record<
              number,
              {
                school: School;
                championships: Championship[];
              }
            > = {};

            for (const champ of championships ?? []) {
              if (!champ.schools) continue;
              const schoolId = champ.school_id;
              if (!dynastyMap[schoolId]) {
                dynastyMap[schoolId] = {
                  school: champ.schools as unknown as School,
                  championships: [],
                };
              }
              dynastyMap[schoolId].championships.push(
                champ as unknown as Championship
              );
            }

            // Convert to rankings
            const rankings: DynastyRanking[] = Object.values(dynastyMap).map(
              ({ school, championships: champs }) => {
                const titles_by_decade: Record<string, number> = {};
                const titles_by_level: Record<string, number> = {};
                let latestYear = 0;

                for (const c of champs) {
                  const season = c.seasons as unknown as {
                    year_start: number;
                    year_end: number;
                    label: string;
                  };
                  if (!season?.year_start) continue;

                  // Decade tracking
                  const decade = Math.floor(season.year_start / 10) * 10;
                  const decadeKey = `${decade}s`;
                  titles_by_decade[decadeKey] =
                    (titles_by_decade[decadeKey] ?? 0) + 1;

                  // Level tracking
                  const level = c.level || "other";
                  titles_by_level[level] = (titles_by_level[level] ?? 0) + 1;

                  // Latest title
                  if (season.year_start > latestYear) {
                    latestYear = season.year_start;
                  }
                }

                return {
                  school: school as unknown as School,
                  total_titles: champs.length,
                  titles_by_decade,
                  latest_title_year: latestYear,
                  titles_by_level,
                };
              }
            );

            // Sort by total titles descending
            return rankings.sort(
              (a, b) => b.total_titles - a.total_titles
            );
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_DYNASTY_RANKINGS",
      { sportSlug }
    );
  }
);

/**
 * Get championship timeline for a specific school
 */
export const getDynastyTimeline = cache(
  async (schoolId: number, sportSlug: string): Promise<ChampionshipYear[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data, error } = await supabase
              .from("championships")
              .select(
                `id, season_id, level, score, notes,
                 seasons(year_start, year_end, label),
                 leagues(name),
                 opponent:schools!championships_opponent_id_fkey(name)`
              )
              .eq("school_id", schoolId)
              .eq("sport_id", sportSlug)
              .order("created_at", { ascending: false })
              .limit(200);

            if (error) {
              console.error("Dynasty timeline query error:", error);
              return [];
            }

            return ((data ?? []) as unknown as Championship[]).map((c) => {
              const season = c.seasons as unknown as {
                year_start: number;
                year_end: number;
                label: string;
              };
              return {
                year: season?.year_start ?? 0,
                level: c.level || "other",
                league: (c.leagues as unknown as { name: string })?.name,
                opponent: (c.opponent as unknown as { name: string })?.name,
                score: c.score,
              };
            });
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_DYNASTY_TIMELINE",
      { schoolId, sportSlug }
    );
  }
);

/**
 * Get consecutive championship streaks for a school
 */
export const getChampionshipStreaks = cache(
  async (schoolId: number, sportSlug: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const timeline = await getDynastyTimeline(schoolId, sportSlug);

            // Group by decade for streak detection
            const streaks: Array<{
              start_year: number;
              end_year: number;
              count: number;
            }> = [];
            let currentStreak = {
              start_year: 0,
              end_year: 0,
              count: 0,
            };

            // Sort by year ascending
            const sortedYears = timeline
              .map((t) => t.year)
              .sort((a, b) => a - b);
            for (const year of sortedYears) {
              if (currentStreak.count === 0) {
                currentStreak = { start_year: year, end_year: year, count: 1 };
              } else if (year === currentStreak.end_year + 1) {
                currentStreak.end_year = year;
                currentStreak.count++;
              } else {
                if (currentStreak.count > 1) {
                  streaks.push({ ...currentStreak });
                }
                currentStreak = { start_year: year, end_year: year, count: 1 };
              }
            }
            if (currentStreak.count > 1) {
              streaks.push(currentStreak);
            }

            return streaks.sort((a, b) => b.count - a.count);
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_CHAMPIONSHIP_STREAKS",
      { schoolId, sportSlug }
    );
  }
);
