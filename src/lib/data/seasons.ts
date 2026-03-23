import { cache } from "react";
import { createClient, withErrorHandling, withRetry } from "./common";

// ============================================================================
// SEASON AWARENESS HELPERS
// ============================================================================

/**
 * Get the current season ID from the `seasons` table.
 * Uses `is_current = true` flag. Falls back to season 76 (2025-26).
 * Cached per-request via React `cache()`.
 */
export const getCurrentSeasonId = cache(async (): Promise<number> => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("seasons")
            .select("id")
            .eq("is_current", true)
            .single();
          return data?.id ?? 76;
        },
        { maxRetries: 2, baseDelay: 300 }
      );
    },
    76,
    "DATA_CURRENT_SEASON_ID",
    {}
  );
});

/**
 * Get the current season's full details.
 */
export const getCurrentSeason = cache(async () => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("seasons")
            .select("id, label, year_start, year_end, is_current")
            .eq("is_current", true)
            .single();
          return data ?? { id: 76, label: "2025-26", year_start: 2025, year_end: 2026, is_current: true };
        },
        { maxRetries: 2, baseDelay: 300 }
      );
    },
    { id: 76, label: "2025-26", year_start: 2025, year_end: 2026, is_current: true },
    "DATA_CURRENT_SEASON",
    {}
  );
});

// ============================================================================
// SEASON PHASE DETECTION
// ============================================================================

export type SeasonPhase = "in-season" | "preseason" | "offseason";

export interface SportSeasonInfo {
  phase: SeasonPhase;
  /** Most recent game date for this sport in the current season (if any) */
  lastGameDate: string | null;
  /** Total games with scores in current season */
  scoredGames: number;
  /** Total scheduled games (no scores yet) in current season */
  scheduledGames: number;
  /** Approximate month the sport typically starts (for offseason messaging) */
  typicalStartMonth: string | null;
}

/**
 * Typical start months for each sport in the Philly HS calendar.
 * Used for "returns in [month]" messaging during offseason.
 */
const SPORT_START_MONTHS: Record<string, string> = {
  football: "August",
  basketball: "November",
  baseball: "March",
  soccer: "September",
  lacrosse: "March",
  "track-field": "March",
  wrestling: "November",
};

/**
 * Determine the season phase for a specific sport within the current season.
 * - "in-season": current season has games with scores
 * - "preseason": current season has scheduled games but no scores yet
 * - "offseason": no games at all in the current season for this sport
 */
export const getSeasonPhaseForSport = cache(
  async (sportId: string): Promise<SportSeasonInfo> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const currentSeasonId = await getCurrentSeasonId();

            // Count scored games and total games for this sport in current season
            const [scoredRes, totalRes] = await Promise.all([
              supabase
                .from("games")
                .select("id, game_date", { count: "exact", head: false })
                .eq("sport_id", sportId)
                .eq("season_id", currentSeasonId)
                .not("home_score", "is", null)
                .or("home_score.gt.0,away_score.gt.0")
                .order("game_date", { ascending: false })
                .limit(1),
              supabase
                .from("games")
                .select("id", { count: "exact", head: true })
                .eq("sport_id", sportId)
                .eq("season_id", currentSeasonId),
            ]);

            const scoredGames = scoredRes.count ?? 0;
            const totalGames = totalRes.count ?? 0;
            const scheduledGames = totalGames - scoredGames;
            const lastGameDate = scoredRes.data?.[0]?.game_date ?? null;

            let phase: SeasonPhase;
            if (scoredGames > 0) {
              phase = "in-season";
            } else if (totalGames > 0) {
              phase = "preseason";
            } else {
              phase = "offseason";
            }

            return {
              phase,
              lastGameDate,
              scoredGames,
              scheduledGames,
              typicalStartMonth: SPORT_START_MONTHS[sportId] ?? null,
            };
          },
          { maxRetries: 2, baseDelay: 300 }
        );
      },
      {
        phase: "offseason" as SeasonPhase,
        lastGameDate: null,
        scoredGames: 0,
        scheduledGames: 0,
        typicalStartMonth: SPORT_START_MONTHS[sportId] ?? null,
      },
      "DATA_SEASON_PHASE",
      { sportId }
    );
  }
);
