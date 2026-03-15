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
  game_time: string | null;
  home_school_id: number | null;
  away_school_id: number | null;
  home_score: number | null;
  away_score: number | null;
  period_scores: Record<string, unknown> | null;
  game_type: string | null;
  playoff_round: string | null;
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
                `id, sport_id, season_id, game_date, game_time, home_school_id, away_school_id, home_score, away_score, period_scores, game_type, playoff_round, notes, data_source,
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
            const { data, error } = await supabase
              .from("game_player_stats")
              .select(
                `id, game_id, player_id, school_id, sport_id, player_name, jersey_number,
                 rush_carries, rush_yards, pass_completions, pass_yards, rec_catches, rec_yards,
                 points, stats_json, source_type`
              )
              .eq("game_id", gameId)
              .order("school_id")
              .order("player_name");

            if (error) {
              console.error(`[DATA_GAME_BOX_SCORE] Query error for game ${gameId}:`, error);
              throw error;
            }

            console.log(`[DATA_GAME_BOX_SCORE] Retrieved ${(data as unknown as GamePlayerStat[])?.length ?? 0} stats for game ${gameId}`);

            // Fetch player and school details separately and attach to stats
            const stats = (data as unknown as GamePlayerStat[]) ?? [];
            if (stats.length === 0) {
              return [];
            }

            const playerIds = [...new Set(stats.map(s => s.player_id).filter(id => id !== null))];
            const schoolIds = [...new Set(stats.map(s => s.school_id))];

            const playersMap = new Map();
            const schoolsMap = new Map();

            if (playerIds.length > 0) {
              const { data: players } = await supabase
                .from("players")
                .select("id, name, slug")
                .in("id", playerIds as number[]);
              players?.forEach(p => playersMap.set(p.id, p));
            }

            if (schoolIds.length > 0) {
              const { data: schools } = await supabase
                .from("schools")
                .select("id, name, slug")
                .in("id", schoolIds);
              schools?.forEach(s => schoolsMap.set(s.id, s));
            }

            // Attach the fetched data to the stats
            return stats.map(stat => ({
              ...stat,
              players: stat.player_id ? playersMap.get(stat.player_id) ?? null : null,
              schools: schoolsMap.get(stat.school_id) ?? null,
            }));
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

// ============================================================================
// RIVALRY DATA
// ============================================================================

export interface RivalryRecord {
  opponentId: number;
  opponentName: string;
  opponentSlug: string;
  wins: number;
  losses: number;
  ties: number;
  totalGames: number;
  lastGameDate: string | null;
  lastGameHomeScore: number | null;
  lastGameAwayScore: number | null;
  isLastGameHome: boolean;
}

/**
 * Get head-to-head rivalry records for a school in a given sport.
 * Returns top 5 rivals by total games played (biggest rivalries).
 * Includes win-loss record and most recent game result.
 */
export const getSchoolRivalries = cache(
  async (schoolId: number, sportId: string): Promise<RivalryRecord[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get all games for this school (both home and away)
            const { data: games } = await supabase
              .from("games")
              .select(
                `id, game_date, home_school_id, away_school_id, home_score, away_score,
                 home_school:schools!games_home_school_id_fkey(id, name, slug),
                 away_school:schools!games_away_school_id_fkey(id, name, slug)`
              )
              .eq("sport_id", sportId)
              .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
              .order("game_date", { ascending: false });

            if (!games || games.length === 0) {
              return [];
            }

            // Group games by opponent and calculate records
            const rivalryMap = new Map<number, {
              opponentId: number;
              opponentName: string;
              opponentSlug: string;
              wins: number;
              losses: number;
              ties: number;
              totalGames: number;
              lastGameDate: string | null;
              lastGameHomeScore: number | null;
              lastGameAwayScore: number | null;
              isLastGameHome: boolean;
            }>();

            for (const game of games as any[]) {
              const isHome = game.home_school_id === schoolId;
              const opponentId = isHome ? game.away_school_id : game.home_school_id;
              const opponentData = isHome ? game.away_school : game.home_school;

              if (!opponentData) continue;

              if (!rivalryMap.has(opponentId)) {
                rivalryMap.set(opponentId, {
                  opponentId,
                  opponentName: opponentData.name,
                  opponentSlug: opponentData.slug,
                  wins: 0,
                  losses: 0,
                  ties: 0,
                  totalGames: 0,
                  lastGameDate: null,
                  lastGameHomeScore: null,
                  lastGameAwayScore: null,
                  isLastGameHome: isHome,
                });
              }

              const rivalry = rivalryMap.get(opponentId)!;
              rivalry.totalGames++;

              // Only count games with final scores
              if (game.home_score !== null && game.away_score !== null) {
                if (isHome) {
                  if (game.home_score > game.away_score) {
                    rivalry.wins++;
                  } else if (game.home_score < game.away_score) {
                    rivalry.losses++;
                  } else {
                    rivalry.ties++;
                  }
                  // Track last game (first iteration since sorted by date descending)
                  if (!rivalry.lastGameDate) {
                    rivalry.lastGameDate = game.game_date;
                    rivalry.lastGameHomeScore = game.home_score;
                    rivalry.lastGameAwayScore = game.away_score;
                    rivalry.isLastGameHome = true;
                  }
                } else {
                  if (game.away_score > game.home_score) {
                    rivalry.wins++;
                  } else if (game.away_score < game.home_score) {
                    rivalry.losses++;
                  } else {
                    rivalry.ties++;
                  }
                  // Track last game (first iteration since sorted by date descending)
                  if (!rivalry.lastGameDate) {
                    rivalry.lastGameDate = game.game_date;
                    rivalry.lastGameHomeScore = game.home_score;
                    rivalry.lastGameAwayScore = game.away_score;
                    rivalry.isLastGameHome = false;
                  }
                }
              }
            }

            // Convert to array and sort by total games (most games = biggest rivalry)
            const rivalries = Array.from(rivalryMap.values())
              .sort((a, b) => b.totalGames - a.totalGames)
              .slice(0, 5);

            return rivalries as RivalryRecord[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_SCHOOL_RIVALRIES",
      { schoolId, sportId }
    );
  }
);
