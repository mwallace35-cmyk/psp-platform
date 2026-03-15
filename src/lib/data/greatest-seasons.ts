import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  Season,
} from "./common";

/**
 * Greatest season with dominance score
 */
export interface GreatestSeason {
  player_id: number;
  player_name: string;
  player_slug: string;
  school_id: number;
  school_name: string;
  school_slug: string;
  season_id: number;
  season_label: string;
  year_start: number;
  dominance_score: number;
  stat_category: string;
  stat_value: number;
  avg_stat: number;
  std_dev: number;
  percentile: number;
}

/**
 * Get greatest football seasons with dominance scoring
 */
export const getGreatestFootballSeasons = cache(
  async (statFilter?: string, limit: number = 50): Promise<GreatestSeason[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get all football player seasons with season and school data
            const { data: seasons, error } = await supabase
              .from("football_player_seasons")
              .select(
                `id, player_id, season_id, school_id,
                 rush_yards, pass_yards, rush_td, pass_td, rec_yards, rec_td,
                 players(id, name, slug),
                 schools(id, name, slug),
                 seasons(id, year_start, year_end, label)`
              )
              .limit(5000);

            if (error) {
              console.error("Greatest seasons query error:", error);
              return [];
            }

            const allSeasons = seasons ?? [];

            // Compute statistics and dominance scores
            const processedSeasons: GreatestSeason[] = [];

            // Football stat categories
            type StatKey = "rush_yards" | "pass_yards" | "total_td";
            const categories: Array<{
              key: StatKey;
              label: string;
              compute: (s: any) => number;
            }> = [
              {
                key: "rush_yards",
                label: "Rushing",
                compute: (s) => s.rush_yards || 0,
              },
              {
                key: "pass_yards",
                label: "Passing",
                compute: (s) => s.pass_yards || 0,
              },
              {
                key: "total_td",
                label: "Touchdowns",
                compute: (s) => (s.rush_td || 0) + (s.pass_td || 0) + (s.rec_td || 0),
              },
            ];

            for (const category of categories) {
              const statValues = allSeasons
                .map(category.compute)
                .filter((v) => v > 0);

              if (statValues.length === 0) continue;

              // Calculate mean and std dev
              const mean = statValues.reduce((a, b) => a + b, 0) / statValues.length;
              const variance =
                statValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
                statValues.length;
              const stdDev = Math.sqrt(variance);

              // Score each season
              for (const season of allSeasons) {
                const statValue = category.compute(season);
                if (statValue === 0) continue;

                // Z-score
                const zScore = stdDev > 0 ? (statValue - mean) / stdDev : 0;

                // Percentile (rough approximation using cumulative distribution)
                const betterCount = statValues.filter((v) => v > statValue).length;
                const percentile = ((statValues.length - betterCount) / statValues.length) * 100;

                // Dominance score: weighted combination
                const dominanceScore = Math.min(
                  100,
                  Math.max(0, zScore * 10 + 50 + (percentile - 50) * 0.1)
                );

                if (dominanceScore > 0) {
                  processedSeasons.push({
                    player_id: season.player_id,
                    player_name: (season.players as any)?.name || "Unknown",
                    player_slug: (season.players as any)?.slug || "",
                    school_id: season.school_id,
                    school_name: (season.schools as any)?.name || "Unknown",
                    school_slug: (season.schools as any)?.slug || "",
                    season_id: season.season_id,
                    season_label: (season.seasons as any)?.label || "",
                    year_start: (season.seasons as any)?.year_start || 0,
                    dominance_score: dominanceScore,
                    stat_category: category.label,
                    stat_value: statValue,
                    avg_stat: mean,
                    std_dev: stdDev,
                    percentile,
                  });
                }
              }
            }

            // Filter by stat if provided
            let filtered = processedSeasons;
            if (statFilter && statFilter !== "All") {
              filtered = processedSeasons.filter(
                (s) => s.stat_category === statFilter
              );
            }

            // Sort by dominance score descending
            return filtered
              .sort((a, b) => b.dominance_score - a.dominance_score)
              .slice(0, limit);
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_GREATEST_FOOTBALL_SEASONS",
      { statFilter, limit }
    );
  }
);

/**
 * Get greatest basketball seasons with dominance scoring
 */
export const getGreatestBasketballSeasons = cache(
  async (statFilter?: string, limit: number = 50): Promise<GreatestSeason[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get all basketball player seasons
            const { data: seasons, error } = await supabase
              .from("basketball_player_seasons")
              .select(
                `id, player_id, season_id, school_id,
                 points, ppg, rebounds, rpg, assists, apg,
                 players(id, name, slug),
                 schools(id, name, slug),
                 seasons(id, year_start, year_end, label)`
              )
              .limit(5000);

            if (error) {
              console.error("Greatest basketball seasons query error:", error);
              return [];
            }

            const allSeasons = seasons ?? [];

            const processedSeasons: GreatestSeason[] = [];

            type StatKey = "points" | "ppg" | "assists";
            const categories: Array<{
              key: StatKey;
              label: string;
              compute: (s: any) => number;
            }> = [
              {
                key: "points",
                label: "Scoring",
                compute: (s) => s.points || 0,
              },
              {
                key: "ppg",
                label: "Points Per Game",
                compute: (s) => s.ppg || 0,
              },
              {
                key: "assists",
                label: "Assists",
                compute: (s) => s.assists || 0,
              },
            ];

            for (const category of categories) {
              const statValues = allSeasons
                .map(category.compute)
                .filter((v) => v > 0);

              if (statValues.length === 0) continue;

              const mean = statValues.reduce((a, b) => a + b, 0) / statValues.length;
              const variance =
                statValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
                statValues.length;
              const stdDev = Math.sqrt(variance);

              for (const season of allSeasons) {
                const statValue = category.compute(season);
                if (statValue === 0) continue;

                const zScore = stdDev > 0 ? (statValue - mean) / stdDev : 0;
                const betterCount = statValues.filter((v) => v > statValue).length;
                const percentile = ((statValues.length - betterCount) / statValues.length) * 100;

                const dominanceScore = Math.min(
                  100,
                  Math.max(0, zScore * 10 + 50 + (percentile - 50) * 0.1)
                );

                if (dominanceScore > 0) {
                  processedSeasons.push({
                    player_id: season.player_id,
                    player_name: (season.players as any)?.name || "Unknown",
                    player_slug: (season.players as any)?.slug || "",
                    school_id: season.school_id,
                    school_name: (season.schools as any)?.name || "Unknown",
                    school_slug: (season.schools as any)?.slug || "",
                    season_id: season.season_id,
                    season_label: (season.seasons as any)?.label || "",
                    year_start: (season.seasons as any)?.year_start || 0,
                    dominance_score: dominanceScore,
                    stat_category: category.label,
                    stat_value: statValue,
                    avg_stat: mean,
                    std_dev: stdDev,
                    percentile,
                  });
                }
              }
            }

            let filtered = processedSeasons;
            if (statFilter && statFilter !== "All") {
              filtered = processedSeasons.filter(
                (s) => s.stat_category === statFilter
              );
            }

            return filtered
              .sort((a, b) => b.dominance_score - a.dominance_score)
              .slice(0, limit);
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_GREATEST_BASKETBALL_SEASONS",
      { statFilter, limit }
    );
  }
);

/**
 * Get greatest baseball seasons with dominance scoring
 */
export const getGreatestBaseballSeasons = cache(
  async (statFilter?: string, limit: number = 50): Promise<GreatestSeason[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            const { data: seasons, error } = await supabase
              .from("baseball_player_seasons")
              .select(
                `id, player_id, season_id, school_id,
                 hits, home_runs, runs_batted_in, at_bats,
                 players(id, name, slug),
                 schools(id, name, slug),
                 seasons(id, year_start, year_end, label)`
              )
              .limit(5000);

            if (error) {
              console.error("Greatest baseball seasons query error:", error);
              return [];
            }

            const allSeasons = seasons ?? [];
            const processedSeasons: GreatestSeason[] = [];

            type StatKey = "hits" | "home_runs" | "runs_batted_in";
            const categories: Array<{
              key: StatKey;
              label: string;
              compute: (s: any) => number;
            }> = [
              {
                key: "hits",
                label: "Hits",
                compute: (s) => s.hits || 0,
              },
              {
                key: "home_runs",
                label: "Home Runs",
                compute: (s) => s.home_runs || 0,
              },
              {
                key: "runs_batted_in",
                label: "RBIs",
                compute: (s) => s.runs_batted_in || 0,
              },
            ];

            for (const category of categories) {
              const statValues = allSeasons
                .map(category.compute)
                .filter((v) => v > 0);

              if (statValues.length === 0) continue;

              const mean = statValues.reduce((a, b) => a + b, 0) / statValues.length;
              const variance =
                statValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
                statValues.length;
              const stdDev = Math.sqrt(variance);

              for (const season of allSeasons) {
                const statValue = category.compute(season);
                if (statValue === 0) continue;

                const zScore = stdDev > 0 ? (statValue - mean) / stdDev : 0;
                const betterCount = statValues.filter((v) => v > statValue).length;
                const percentile = ((statValues.length - betterCount) / statValues.length) * 100;

                const dominanceScore = Math.min(
                  100,
                  Math.max(0, zScore * 10 + 50 + (percentile - 50) * 0.1)
                );

                if (dominanceScore > 0) {
                  processedSeasons.push({
                    player_id: season.player_id,
                    player_name: (season.players as any)?.name || "Unknown",
                    player_slug: (season.players as any)?.slug || "",
                    school_id: season.school_id,
                    school_name: (season.schools as any)?.name || "Unknown",
                    school_slug: (season.schools as any)?.slug || "",
                    season_id: season.season_id,
                    season_label: (season.seasons as any)?.label || "",
                    year_start: (season.seasons as any)?.year_start || 0,
                    dominance_score: dominanceScore,
                    stat_category: category.label,
                    stat_value: statValue,
                    avg_stat: mean,
                    std_dev: stdDev,
                    percentile,
                  });
                }
              }
            }

            let filtered = processedSeasons;
            if (statFilter && statFilter !== "All") {
              filtered = processedSeasons.filter(
                (s) => s.stat_category === statFilter
              );
            }

            return filtered
              .sort((a, b) => b.dominance_score - a.dominance_score)
              .slice(0, limit);
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_GREATEST_BASEBALL_SEASONS",
      { statFilter, limit }
    );
  }
);

/**
 * Get stat categories for a sport (for filter pills)
 */
export function getGreatestSeasonCategories(
  sport: string
): string[] {
  const categoryMap: Record<string, string[]> = {
    football: ["All", "Rushing", "Passing", "Touchdowns"],
    basketball: ["All", "Scoring", "Points Per Game", "Assists"],
    baseball: ["All", "Hits", "Home Runs", "RBIs"],
  };
  return categoryMap[sport] || ["All"];
}
