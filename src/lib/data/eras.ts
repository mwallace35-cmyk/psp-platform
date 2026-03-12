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

            // Determine table and column based on sport and stat type
            let query = `
              SELECT
                FLOOR(s.year_start / 10) * 10 as decade,
                COUNT(*) as sample_size,
                ROUND(AVG(COALESCE(x.stat_value, 0))::numeric, 2) as avg_value,
                MAX(COALESCE(x.stat_value, 0)) as max_value,
                MIN(COALESCE(x.stat_value, 0)) as min_value,
                ROUND(STDDEV(COALESCE(x.stat_value, 0))::numeric, 2) as stddev
              FROM (
            `;

            // Build the stat value subquery based on sport
            if (sportSlug === "football") {
              query += `
                SELECT fps.season_id, fps.${statType} as stat_value
                FROM football_player_seasons fps
                WHERE fps.${statType} IS NOT NULL AND fps.${statType} > 0
              `;
            } else if (sportSlug === "basketball") {
              query += `
                SELECT bps.season_id, bps.${statType} as stat_value
                FROM basketball_player_seasons bps
                WHERE bps.${statType} IS NOT NULL AND bps.${statType} > 0
              `;
            } else if (sportSlug === "baseball") {
              query += `
                SELECT bsp.season_id, bsp.${statType} as stat_value
                FROM baseball_player_seasons bsp
                WHERE bsp.${statType} IS NOT NULL AND bsp.${statType} > 0
              `;
            } else {
              return [];
            }

            query += `
              ) x
              JOIN seasons s ON x.season_id = s.id
              WHERE s.label NOT LIKE '%-%' OR s.label LIKE '%-__'
              GROUP BY decade
              ORDER BY decade DESC
            `;

            const { data, error } = await supabase.rpc("execute_raw_sql", {
              sql: query,
            });

            if (error) {
              // Fallback: try direct query via REST API for simple case
              console.error("Raw SQL error:", error);
              return [];
            }

            if (!data || !Array.isArray(data)) return [];

            // Calculate trends
            const eras: EraStatistic[] = data.map(
              (row: Record<string, unknown>) => ({
                decade: row.decade as number,
                decade_label: `${row.decade}s`,
                sample_size: row.sample_size as number,
                avg_value: parseFloat(row.avg_value as string) || 0,
                max_value: row.max_value as number,
                min_value: row.min_value as number,
                stddev: parseFloat(row.stddev as string) || 0,
              })
            );

            // Add trends
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
