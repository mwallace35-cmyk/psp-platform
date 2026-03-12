import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  type Player,
} from "./common";

/**
 * Similar player with similarity score
 */
export interface SimilarPlayer extends Player {
  school_name?: string;
  school_slug?: string;
  primary_stat_value?: number;
  similarity_score: number;
}

/**
 * Get similar football players based on position and stats
 * Uses weighted similarity: 40% primary stat, 30% position match, 20% era, 10% base
 */
export const getSimilarFootballPlayers = cache(
  async (playerId: number, limit: number = 5) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get the target player and their career stats
            const { data: player } = await supabase
              .from("players")
              .select(
                "id, positions, graduation_year, primary_school_id, name, slug"
              )
              .eq("id", playerId)
              .is("deleted_at", null)
              .single();

            if (!player) return [];

            // Get target player's max stats
            const { data: targetStats } = await supabase
              .from("football_player_seasons")
              .select("rush_yards, pass_yards, rec_yards")
              .eq("player_id", playerId)
              .order("rush_yards", { ascending: false })
              .limit(1);

            if (!targetStats || targetStats.length === 0) return [];

            const targetRushYards = targetStats[0].rush_yards ?? 0;
            const targetPassYards = targetStats[0].pass_yards ?? 0;
            const targetRecYards = targetStats[0].rec_yards ?? 0;

            // Determine primary stat based on position
            let targetPrimaryStat = targetRushYards;
            const positions = (player.positions as string[]) ?? [];

            if (positions.includes("QB")) {
              targetPrimaryStat = targetPassYards;
            } else if (positions.includes("WR") || positions.includes("TE")) {
              targetPrimaryStat = targetRecYards;
            }

            if (targetPrimaryStat === 0) {
              targetPrimaryStat = Math.max(
                targetRushYards,
                targetPassYards,
                targetRecYards
              );
            }

            // Query similar players using CTE for calculation
            const { data: similarPlayers } = await supabase.rpc("get_similar_football_players", {
              target_player_id: playerId,
              target_positions: positions,
              target_primary_stat: targetPrimaryStat,
              target_graduation_year: player.graduation_year,
              result_limit: limit,
            });

            return (similarPlayers ?? []) as SimilarPlayer[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_SIMILAR_FOOTBALL_PLAYERS",
      { playerId, limit }
    );
  }
);

/**
 * Get similar basketball players based on position and scoring
 */
export const getSimilarBasketballPlayers = cache(
  async (playerId: number, limit: number = 5) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get the target player
            const { data: player } = await supabase
              .from("players")
              .select(
                "id, positions, graduation_year, primary_school_id, name, slug"
              )
              .eq("id", playerId)
              .is("deleted_at", null)
              .single();

            if (!player) return [];

            // Get target player's max points
            const { data: targetStats } = await supabase
              .from("basketball_player_seasons")
              .select("points")
              .eq("player_id", playerId)
              .order("points", { ascending: false })
              .limit(1);

            if (!targetStats || targetStats.length === 0) return [];

            const targetPoints = targetStats[0].points ?? 0;
            const positions = (player.positions as string[]) ?? [];

            // Query similar players
            const { data: similarPlayers } = await supabase.rpc(
              "get_similar_basketball_players",
              {
                target_player_id: playerId,
                target_positions: positions,
                target_primary_stat: targetPoints,
                target_graduation_year: player.graduation_year,
                result_limit: limit,
              }
            );

            return (similarPlayers ?? []) as SimilarPlayer[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_SIMILAR_BASKETBALL_PLAYERS",
      { playerId, limit }
    );
  }
);

/**
 * Get similar baseball players based on position and stats
 */
export const getSimilarBaseballPlayers = cache(
  async (playerId: number, limit: number = 5) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get the target player
            const { data: player } = await supabase
              .from("players")
              .select(
                "id, positions, graduation_year, primary_school_id, name, slug"
              )
              .eq("id", playerId)
              .is("deleted_at", null)
              .single();

            if (!player) return [];

            // Get target player's max home runs
            const { data: targetStats } = await supabase
              .from("baseball_player_seasons")
              .select("home_runs, batting_avg")
              .eq("player_id", playerId)
              .order("home_runs", { ascending: false })
              .limit(1);

            if (!targetStats || targetStats.length === 0) return [];

            const targetHomeRuns = targetStats[0].home_runs ?? 0;
            const positions = (player.positions as string[]) ?? [];

            // Query similar players
            const { data: similarPlayers } = await supabase.rpc(
              "get_similar_baseball_players",
              {
                target_player_id: playerId,
                target_positions: positions,
                target_primary_stat: targetHomeRuns,
                target_graduation_year: player.graduation_year,
                result_limit: limit,
              }
            );

            return (similarPlayers ?? []) as SimilarPlayer[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_SIMILAR_BASEBALL_PLAYERS",
      { playerId, limit }
    );
  }
);

/**
 * Universal get similar players function (dispatches to sport-specific functions)
 */
export const getSimilarPlayers = cache(
  async (playerId: number, sportId: string, limit: number = 5) => {
    switch (sportId) {
      case "football":
        return getSimilarFootballPlayers(playerId, limit);
      case "basketball":
        return getSimilarBasketballPlayers(playerId, limit);
      case "baseball":
        return getSimilarBaseballPlayers(playerId, limit);
      default:
        return [];
    }
  }
);
