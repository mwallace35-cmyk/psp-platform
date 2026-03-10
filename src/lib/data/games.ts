import { createClient, withErrorHandling, withRetry } from "./common";

// ============================================================================
// GAME DETAIL & BOX SCORE DATA FETCHERS
// ============================================================================

export interface GamePlayerStat {
  id: number;
  game_id: number;
  player_id: number | null;
  school_id: number;
  sport_id: string;
  player_name: string;
  jersey_number: string | null;
  rush_carries: number | null;
  rush_yards: number | null;
  pass_completions: number | null;
  pass_yards: number | null;
  rec_catches: number | null;
  rec_yards: number | null;
  points: number | null;
  stats_json: Record<string, unknown> | null;
  source_type: string | null;
  players?: { id: number; name: string; slug: string } | null;
  schools?: { id: number; name: string; slug: string } | null;
}

export interface GameDetail {
  id: number;
  sport_id: string;
  season_id: number;
  game_date: string | null;
  home_school_id: number | null;
  away_school_id: number | null;
  home_score: number | null;
  away_score: number | null;
  home_school: { id: number; name: string; slug: string } | null;
  away_school: { id: number; name: string; slug: string } | null;
  seasons: { label: string; year_start: number; year_end: number } | null;
}

/**
 * Get a single game with full details
 */
export async function getGameById(gameId: number): Promise<GameDetail | null> {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("games")
            .select(
              `id, sport_id, season_id, game_date, home_school_id, away_school_id, home_score, away_score,
               home_school:schools!games_home_school_id_fkey(id, name, slug),
               away_school:schools!games_away_school_id_fkey(id, name, slug),
               seasons(label, year_start, year_end)`
            )
            .eq("id", gameId)
            .single();
          return data as GameDetail | null;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    null,
    "DATA_GAME_BY_ID",
    { gameId }
  );
}

/**
 * Get box score (player stats) for a game
 */
export async function getGameBoxScore(gameId: number): Promise<GamePlayerStat[]> {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("game_player_stats")
            .select(
              `id, game_id, player_id, school_id, sport_id, player_name, jersey_number,
               rush_carries, rush_yards, pass_completions, pass_yards, rec_catches, rec_yards,
               points, stats_json, source_type,
               players(id, name, slug),
               schools(id, name, slug)`
            )
            .eq("game_id", gameId)
            .order("school_id")
            .order("player_name");
          return (data as unknown as GamePlayerStat[]) ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_GAME_BOX_SCORE",
    { gameId }
  );
}

export interface PlayerGameLog {
  id: number;
  game_id: number;
  player_name: string;
  jersey_number: string | null;
  rush_carries: number | null;
  rush_yards: number | null;
  pass_completions: number | null;
  pass_yards: number | null;
  rec_catches: number | null;
  rec_yards: number | null;
  points: number | null;
  stats_json: Record<string, unknown> | null;
  source_type: string | null;
  games: {
    id: number;
    game_date: string | null;
    home_score: number | null;
    away_score: number | null;
    home_school_id: number | null;
    away_school_id: number | null;
    home_school: { id: number; name: string; slug: string } | null;
    away_school: { id: number; name: string; slug: string } | null;
    seasons: { label: string } | null;
  } | null;
}

/**
 * Get a player's game-by-game stats (game log)
 */
export async function getPlayerGameLog(playerId: number): Promise<PlayerGameLog[]> {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("game_player_stats")
            .select(
              `id, game_id, player_name, jersey_number,
               rush_carries, rush_yards, pass_completions, pass_yards, rec_catches, rec_yards,
               points, stats_json, source_type,
               games!inner(id, game_date, home_score, away_score, home_school_id, away_school_id,
                 home_school:schools!games_home_school_id_fkey(id, name, slug),
                 away_school:schools!games_away_school_id_fkey(id, name, slug),
                 seasons(label)
               )`
            )
            .eq("player_id", playerId);
          // Sort by game_date descending (newest first) — PostgREST can't sort by nested relation fields
          const sorted = (data as unknown as PlayerGameLog[]) ?? [];
          sorted.sort((a, b) => {
            const dateA = a.games?.game_date || '';
            const dateB = b.games?.game_date || '';
            return dateB.localeCompare(dateA);
          });
          return sorted;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_PLAYER_GAME_LOG",
    { playerId }
  );
}

/**
 * Check if a game has box score data (for showing "Box Score" links)
 */
export async function getGamesWithBoxScores(
  gameIds: number[]
): Promise<Set<number>> {
  if (gameIds.length === 0) return new Set();

  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("game_player_stats")
            .select("game_id")
            .in("game_id", gameIds);

          const ids = new Set((data ?? []).map((r: { game_id: number }) => r.game_id));
          return ids;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    new Set<number>(),
    "DATA_GAMES_WITH_BOX_SCORES",
    { count: gameIds.length }
  );
}
