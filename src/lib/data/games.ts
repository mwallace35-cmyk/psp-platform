import { cache } from "react";
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
  notes: string | null;
  data_source: string | null;
  home_school: { id: number; name: string; slug: string } | null;
  away_school: { id: number; name: string; slug: string } | null;
  seasons: { label: string; year_start: number; year_end: number } | null;
}

/**
 * Get a single game with full details
 */
export const getGameById = cache(
  async (gameId: number): Promise<GameDetail | null> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from("games")
              .select(
                `id, sport_id, season_id, game_date, home_school_id, away_school_id, home_score, away_score, notes, data_source,
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
);

/**
 * Get box score (player stats) for a game
 */
export const getGameBoxScore = cache(
  async (gameId: number): Promise<GamePlayerStat[]> => {
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
);

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
export const getPlayerGameLog = cache(
  async (playerId: number): Promise<PlayerGameLog[]> => {
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
);

// ============================================================================
// TEAM GAME LOG (ALL GAMES FOR A SCHOOL IN GIVEN SEASONS)
// ============================================================================

export interface TeamGame {
  id: number;
  sport_id: string;
  game_date: string | null;
  home_school_id: number | null;
  away_school_id: number | null;
  home_score: number | null;
  away_score: number | null;
  home_school: { id: number; name: string; slug: string } | null;
  away_school: { id: number; name: string; slug: string } | null;
  seasons: { label: string } | null;
}

/**
 * Get all games for a school in a specific sport across given season IDs.
 * Used to show a player's full team schedule alongside their individual box scores.
 */
export const getPlayerTeamGames = cache(
  async (
    schoolId: number,
    sportSlug: string,
    seasonIds: number[]
  ): Promise<TeamGame[]> => {
    if (seasonIds.length === 0) return [];

    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            // Get games where the school is home
            const { data: homeGames } = await supabase
              .from("games")
              .select(
                `id, sport_id, game_date, home_school_id, away_school_id, home_score, away_score,
                 home_school:schools!games_home_school_id_fkey(id, name, slug),
                 away_school:schools!games_away_school_id_fkey(id, name, slug),
                 seasons(label)`
              )
              .eq("home_school_id", schoolId)
              .eq("sport_id", sportSlug)
              .in("season_id", seasonIds);

            // Get games where the school is away
            const { data: awayGames } = await supabase
              .from("games")
              .select(
                `id, sport_id, game_date, home_school_id, away_school_id, home_score, away_score,
                 home_school:schools!games_home_school_id_fkey(id, name, slug),
                 away_school:schools!games_away_school_id_fkey(id, name, slug),
                 seasons(label)`
              )
              .eq("away_school_id", schoolId)
              .eq("sport_id", sportSlug)
              .in("season_id", seasonIds);

            const all = [
              ...((homeGames as unknown as TeamGame[]) ?? []),
              ...((awayGames as unknown as TeamGame[]) ?? []),
            ];

            // Sort by game_date descending (newest first)
            all.sort((a, b) => {
              const dateA = a.game_date || "";
              const dateB = b.game_date || "";
              return dateB.localeCompare(dateA);
            });

            return all;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_PLAYER_TEAM_GAMES",
      { schoolId, sportSlug, seasonCount: seasonIds.length }
    );
  }
);

/**
 * Check if a game has box score data (for showing "Box Score" links)
 */
export const getGamesWithBoxScores = cache(
  async (gameIds: number[]): Promise<Set<number>> => {
    if (gameIds.length === 0) return new Set();

    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from("game_player_stats")
              .select("game_id")
              .in("game_id", gameIds)
              .limit(500);

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
);

// ============================================================================
// SCORES & SCHEDULE HUBS
// ============================================================================

export interface ScoresGame {
  id: number;
  sport_id: string;
  game_date: string | null;
  home_school_id: number | null;
  away_school_id: number | null;
  home_score: number | null;
  away_score: number | null;
  home_school: { id: number; name: string; slug: string } | null;
  away_school: { id: number; name: string; slug: string } | null;
  seasons: { label: string } | null;
}

/**
 * Get recent completed games (with scores), optionally filtered by sport.
 * Sorted by date descending (most recent first).
 */
export const getRecentScores = cache(
  async (sportId?: string, limit: number = 50): Promise<ScoresGame[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            let query = supabase
              .from("games")
              .select(
                `id, sport_id, game_date, home_school_id, away_school_id, home_score, away_score,
                 home_school:schools!games_home_school_id_fkey(id, name, slug),
                 away_school:schools!games_away_school_id_fkey(id, name, slug),
                 seasons(label)`
              )
              .not("home_score", "is", null)
              .not("away_score", "is", null)
              .order("game_date", { ascending: false })
              .limit(Math.min(limit, 500));

            if (sportId) {
              query = query.eq("sport_id", sportId);
            }

            const { data } = await query;
            return (data as unknown as ScoresGame[]) ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_RECENT_SCORES",
      { sportId, limit }
    );
  }
);

/**
 * Get upcoming games (no scores yet or future dates), optionally filtered by sport.
 * Sorted by date ascending (soonest first).
 */
export const getUpcomingGames = cache(
  async (sportId?: string, limit: number = 50): Promise<ScoresGame[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            let query = supabase
              .from("games")
              .select(
                `id, sport_id, game_date, home_school_id, away_school_id, home_score, away_score,
                 home_school:schools!games_home_school_id_fkey(id, name, slug),
                 away_school:schools!games_away_school_id_fkey(id, name, slug),
                 seasons(label)`
              )
              .or("home_score.is.null,away_score.is.null")
              .order("game_date", { ascending: true })
              .limit(Math.min(limit, 500));

            if (sportId) {
              query = query.eq("sport_id", sportId);
            }

            const { data } = await query;
            return (data as unknown as ScoresGame[]) ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_UPCOMING_GAMES",
      { sportId, limit }
    );
  }
);

/**
 * Get games with available box scores for a sport
 * Includes games that have game_player_stats entries
 * Sorted by date descending (most recent first).
 */
export const getGamesBySportWithBoxScores = cache(
  async (sportId: string, seasonLabel?: string, limit: number = 100): Promise<ScoresGame[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // First, get game IDs that have box scores
            let statsQuery = supabase
              .from("game_player_stats")
              .select("game_id", { head: false })
              .limit(1000);

            const { data: statsData } = await statsQuery;
            const gameIdsWithStats = new Set((statsData ?? []).map((r: any) => r.game_id));
            const gameIdArray = Array.from(gameIdsWithStats);

            if (gameIdArray.length === 0) {
              return [];
            }

            // Now fetch the actual game details
            let query = supabase
              .from("games")
              .select(
                `id, sport_id, game_date, home_school_id, away_school_id, home_score, away_score,
                 home_school:schools!games_home_school_id_fkey(id, name, slug),
                 away_school:schools!games_away_school_id_fkey(id, name, slug),
                 seasons(label)`
              )
              .eq("sport_id", sportId)
              .in("id", gameIdArray)
              .order("game_date", { ascending: false })
              .limit(Math.min(limit, 500));

            if (seasonLabel) {
              // Get season ID from label first
              const seasonRes = await supabase
                .from("seasons")
                .select("id")
                .eq("label", seasonLabel)
                .single();

              if (seasonRes.data) {
                query = query.eq("season_id", seasonRes.data.id);
              }
            }

            const { data } = await query;
            return (data as unknown as ScoresGame[]) ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_GAMES_BY_SPORT_WITH_BOX_SCORES",
      { sportId, seasonLabel, limit }
    );
  }
);
