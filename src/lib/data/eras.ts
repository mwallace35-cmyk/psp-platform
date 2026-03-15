import { cache } from "react";
import { createClient, withErrorHandling, withRetry } from "./common";

/**
 * Statistical era data point
 */
export interface EraStatistic {
  decade: number;
  decade_label: string;
  sample_size: number;
  avg_value: number;
  max_value: number;
  min_value: number;
  stddev: number;
  trend?: "up" | "down" | "stable";
  trend_pct?: number;
}

/**
 * Era stat type definition
 */
export interface EraStatType {
  key: string;
  label: string;
  unit?: string;
  description: string;
}

/**
 * Stat type definitions by sport
 */
const STAT_TYPES: Record<string, EraStatType[]> = {
  football: [
    {
      key: "rush_yards",
      label: "Rushing Yards",
      unit: "yards",
      description: "Average rushing yards per player",
    },
    {
      key: "pass_yards",
      label: "Passing Yards",
      unit: "yards",
      description: "Average passing yards per player",
    },
    {
      key: "rec_yards",
      label: "Receiving Yards",
      unit: "yards",
      description: "Average receiving yards per player",
    },
    {
      key: "total_td",
      label: "Total TDs",
      unit: "touchdowns",
      description: "Average touchdowns per player",
    },
  ],
  basketball: [
    {
      key: "points",
      label: "Points Per Game",
      unit: "PPG",
      description: "Average points per game per player",
    },
  ],
  baseball: [
    {
      key: "hits",
      label: "Hits",
      unit: "hits",
      description: "Average hits per season per player",
    },
  ],
};

/**
 * Get available stat types for a sport
 */
export const getStatTypes = (sportSlug: string): EraStatType[] => {
  return STAT_TYPES[sportSlug] || [];
};

/**
 * Get statistics by era (decade) for a specific stat type
 * OPTIMIZED: Uses PostgREST queries instead of dropped execute_raw_sql RPC
 */
export const getStatByEra = cache(
  async (
    sportSlug: string,
    statType: string
  ): Promise<EraStatistic[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Determine table based on sport
            let tableName = "";
            if (sportSlug === "football") {
              tableName = "football_player_seasons";
            } else if (sportSlug === "basketball") {
              tableName = "basketball_player_seasons";
            } else if (sportSlug === "baseball") {
              tableName = "baseball_player_seasons";
            } else {
              return [];
            }

            // Fetch all player seasons with season info
            const { data: rawData, error } = await supabase
              .from(tableName)
              .select(
                `${statType}, season_id, seasons(id, year_start, year_end, label)`
              )
              .not(statType, "is", null);

            if (error) {
              console.error("Era query error:", error);
              return [];
            }

            if (!rawData || !Array.isArray(rawData)) return [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = rawData as any[];

            // Group by decade
            const decadeStats = new Map<
              number,
              { values: number[]; years: Set<number> }
            >();

            for (const row of data) {
              const seasonData = (row.seasons as any) || {};
              const yearStart = seasonData.year_start as number;
              const statValue = row[statType as keyof typeof row] as number;

              if (!yearStart || statValue === null || statValue === undefined || statValue <= 0) {
                continue;
              }

              const decade = Math.floor(yearStart / 10) * 10;
              if (!decadeStats.has(decade)) {
                decadeStats.set(decade, { values: [], years: new Set() });
              }

              const stats = decadeStats.get(decade)!;
              stats.values.push(statValue);
              stats.years.add(yearStart);
            }

            // Calculate statistics for each decade
            const eras: EraStatistic[] = [];

            for (const [decade, stats] of decadeStats) {
              if (stats.values.length === 0) continue;

              const values = stats.values.sort((a, b) => a - b);
              const mean = values.reduce((a, b) => a + b, 0) / values.length;
              const variance =
                values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
                values.length;
              const stdDev = Math.sqrt(variance);

              eras.push({
                decade,
                decade_label: `${decade}s`,
                sample_size: values.length,
                avg_value: Math.round(mean * 100) / 100,
                max_value: Math.max(...values),
                min_value: Math.min(...values),
                stddev: Math.round(stdDev * 100) / 100,
              });
            }

            // Sort by decade descending
            eras.sort((a, b) => b.decade - a.decade);

            // Calculate trends
            for (let i = 0; i < eras.length - 1; i++) {
              const current = eras[i];
              const previous = eras[i + 1];

              if (previous) {
                const pctChange =
                  ((current.avg_value - previous.avg_value) /
                    previous.avg_value) *
                  100;
                current.trend_pct = Math.round(pctChange);
                if (Math.abs(pctChange) < 5) {
                  current.trend = "stable";
                } else if (pctChange > 0) {
                  current.trend = "up";
                } else {
                  current.trend = "down";
                }
              }
            }

            return eras;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_STAT_BY_ERA",
      { sportSlug, statType }
    );
  }
);

/**
 * Get era summary with context blurb
 */
export const getEraSummary = (
  sportSlug: string,
  statType: string,
  eras: EraStatistic[]
): string => {
  if (eras.length < 2) return "";

  const current = eras[0];
  const previous = eras[1];

  if (!previous || current.trend_pct === undefined) return "";

  const statTypeObj = STAT_TYPES[sportSlug]?.find((st) => st.key === statType);
  if (!statTypeObj) return "";

  const direction = current.trend === "up" ? "increased" : "decreased";
  const absChange = Math.abs(current.trend_pct);

  return `The ${current.decade}s saw ${statTypeObj.label.toLowerCase()} ${direction} ${absChange}% compared to the ${previous.decade}s.`;
};
