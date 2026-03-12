import { cache } from "react";
import { createClient, withErrorHandling, withRetry } from "./common";

/**
 * Breakout player alert
 */
export interface BreakoutAlert {
  player_id: number;
  player_name: string;
  player_slug: string;
  school_id: number;
  school_name: string;
  school_slug: string;
  sport_id: string;
  current_season: string;
  previous_season: string;
  current_stat: number;
  previous_stat: number;
  pct_increase: number;
  avg_per_game: number;
  projected_total: number;
  position?: string;
  stat_label: string;
}

/**
 * Get breakout players for a sport (current season vs previous season)
 * Calculates year-over-year stat jumps
 */
export const getBreakoutPlayers = cache(
  async (sportSlug: string, limit = 10): Promise<BreakoutAlert[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Determine stat type and table based on sport
            let statColumn = "";
            let tableName = "";
            let statLabel = "";

            if (sportSlug === "football") {
              statColumn = "rush_yards"; // Primary stat
              tableName = "football_player_seasons";
              statLabel = "Rushing Yards";
            } else if (sportSlug === "basketball") {
              statColumn = "points"; // Primary stat
              tableName = "basketball_player_seasons";
              statLabel = "Points";
            } else if (sportSlug === "baseball") {
              statColumn = "hits";
              tableName = "baseball_player_seasons";
              statLabel = "Hits";
            } else {
              return [];
            }

            // Build query to find year-over-year stat jumps
            const query = `
              SELECT
                p.id as player_id,
                p.name as player_name,
                p.slug as player_slug,
                p.primary_school_id as school_id,
                sc.name as school_name,
                sc.slug as school_slug,
                '${sportSlug}' as sport_id,
                s_curr.label as current_season,
                s_prev.label as previous_season,
                COALESCE(curr.${statColumn}, 0) as current_stat,
                COALESCE(prev.${statColumn}, 0) as previous_stat,
                CASE
                  WHEN COALESCE(prev.${statColumn}, 0) = 0 THEN 999
                  ELSE ROUND((COALESCE(curr.${statColumn}, 0) - COALESCE(prev.${statColumn}, 0)) / COALESCE(prev.${statColumn}, 1) * 100)
                END as pct_increase,
                CASE
                  WHEN COALESCE(curr.games_played, 1) > 0 THEN ROUND(COALESCE(curr.${statColumn}, 0) / COALESCE(curr.games_played, 1), 1)
                  ELSE 0
                END as avg_per_game,
                CASE
                  WHEN COALESCE(curr.games_played, 1) > 0 THEN ROUND(COALESCE(curr.${statColumn}, 0) / COALESCE(curr.games_played, 1) * 11)
                  ELSE 0
                END as projected_total,
                '${statLabel}' as stat_label
              FROM ${tableName} curr
              JOIN ${tableName} prev ON curr.player_id = prev.player_id
                AND curr.school_id = prev.school_id
                AND curr.season_id = prev.season_id + 1
              JOIN players p ON curr.player_id = p.id
              JOIN schools sc ON curr.school_id = sc.id
              JOIN seasons s_curr ON curr.season_id = s_curr.id
              JOIN seasons s_prev ON prev.season_id = s_prev.id
              WHERE p.deleted_at IS NULL
                AND sc.deleted_at IS NULL
                AND COALESCE(curr.games_played, 0) >= 5
                AND COALESCE(prev.${statColumn}, 0) > 0
                AND COALESCE(curr.${statColumn}, 0) - COALESCE(prev.${statColumn}, 0) > 0
              ORDER BY pct_increase DESC, current_stat DESC
              LIMIT ${Math.min(limit, 50)}
            `;

            const { data, error } = await supabase.rpc("execute_raw_sql", {
              sql: query,
            });

            if (error) {
              console.error("Breakouts query error:", error);
              return [];
            }

            if (!data || !Array.isArray(data)) return [];

            // Filter for minimum 100% increase
            return (data as BreakoutAlert[]).filter(
              (alert) => alert.pct_increase >= 100
            );
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_BREAKOUT_PLAYERS",
      { sportSlug, limit }
    );
  }
);

/**
 * Get top breakout players for a specific school
 */
export const getSchoolBreakouts = cache(
  async (sportSlug: string, schoolId: number, limit = 5): Promise<BreakoutAlert[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const breakouts = await getBreakoutPlayers(sportSlug, 100);
            return breakouts.filter((b) => b.school_id === schoolId).slice(0, limit);
          },
          { maxRetries: 1, baseDelay: 300 }
        );
      },
      [],
      "DATA_SCHOOL_BREAKOUTS",
      { sportSlug, schoolId, limit }
    );
  }
);
