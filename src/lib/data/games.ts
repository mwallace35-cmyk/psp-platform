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
  home_school: { id: number; name: string; slug: string; city?: string | null; league_id?: number | null } | null;
  away_school: { id: number; name: string; slug: string; city?: string | null; league_id?: number | null } | null;
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
                 home_school:schools!games_home_school_id_fkey(id, name, slug, city, league_id),
                 away_school:schools!games_away_school_id_fkey(id, name, slug, city, league_id),
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
            // Single query with JOINs — eliminates N+1 pattern (was 3 queries)
            const { data, error } = await supabase
              .from("game_player_stats")
              .select(
                `id, game_id, player_id, school_id, sport_id, player_name, jersey_number,
                 rush_carries, rush_yards, pass_completions, pass_yards, rec_catches, rec_yards,
                 points, stats_json, source_type,
                 players:player_id(id, name, slug),
                 schools:school_id(id, name, slug)`
              )
              .eq("game_id", gameId)
              .order("school_id")
              .order("player_name");

            if (error) {
              console.error(`[DATA_GAME_BOX_SCORE] Query error for game ${gameId}:`, error);
              throw error;
            }

            const stats = (data as unknown as GamePlayerStat[]) ?? [];

            // Supabase returns joined data as nested objects — unwrap arrays if needed
            return stats.map(stat => {
              const players = Array.isArray(stat.players) ? stat.players[0] : stat.players;
              const schools = Array.isArray(stat.schools) ? stat.schools[0] : stat.schools;
              return { ...stat, players: players ?? null, schools: schools ?? null };
            });
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
  sport_id: string;
  school_id: number | null;
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
  async (playerId: number, sportId?: string): Promise<PlayerGameLog[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from("game_player_stats")
              .select(
                `id, game_id, player_name, jersey_number, sport_id, school_id,
                 rush_carries, rush_yards, pass_completions, pass_yards, rec_catches, rec_yards,
                 points, stats_json, source_type,
                 games!inner(id, game_date, home_score, away_score, home_school_id, away_school_id,
                   home_school:schools!games_home_school_id_fkey(id, name, slug, city, league_id),
                   away_school:schools!games_away_school_id_fkey(id, name, slug, city, league_id),
                   seasons(label)
                 )`
              )
              .eq("player_id", playerId);
            // Filter by sport if provided (important for multi-sport athletes)
            if (sportId && data) {
              const filtered = (data as any[]).filter((row: any) => {
                const gameDate = row.games?.game_date;
                // Use the sport_id on the game_player_stats row itself
                return row.sport_id === sportId || !row.sport_id;
              });
              const sorted = (filtered as unknown as PlayerGameLog[]) ?? [];
              sorted.sort((a, b) => {
                const dateA = a.games?.game_date || '';
                const dateB = b.games?.game_date || '';
                return dateB.localeCompare(dateA);
              });
              return sorted;
            }
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
  home_school: { id: number; name: string; slug: string; city?: string | null; league_id?: number | null } | null;
  away_school: { id: number; name: string; slug: string; city?: string | null; league_id?: number | null } | null;
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
                 home_school:schools!games_home_school_id_fkey(id, name, slug, city, league_id),
                 away_school:schools!games_away_school_id_fkey(id, name, slug, city, league_id),
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
                 home_school:schools!games_home_school_id_fkey(id, name, slug, city, league_id),
                 away_school:schools!games_away_school_id_fkey(id, name, slug, city, league_id),
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
  home_school: { id: number; name: string; slug: string; city?: string | null; league_id?: number | null } | null;
  away_school: { id: number; name: string; slug: string; city?: string | null; league_id?: number | null } | null;
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
                 home_school:schools!games_home_school_id_fkey(id, name, slug, city, league_id),
                 away_school:schools!games_away_school_id_fkey(id, name, slug, city, league_id),
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
                 home_school:schools!games_home_school_id_fkey(id, name, slug, city, league_id),
                 away_school:schools!games_away_school_id_fkey(id, name, slug, city, league_id),
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

            // First, get game IDs that have box scores for this sport
            let statsQuery = supabase
              .from("game_player_stats")
              .select("game_id", { head: false })
              .eq("sport_id", sportId)
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
                 home_school:schools!games_home_school_id_fkey(id, name, slug, city, league_id),
                 away_school:schools!games_away_school_id_fkey(id, name, slug, city, league_id),
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
// TEAM SEASON ROSTER/STATS (fallback for games without box scores)
// ============================================================================

export interface TeamSeasonPlayer {
  player_id: number;
  player_name: string;
  player_slug: string;
  jersey_number: string | null;
  position: string | null;
  // Basketball
  points: number | null;
  ppg: number | null;
  games_played: number | null;
  rebounds: number | null;
  assists: number | null;
  // Football
  rush_yards: number | null;
  rush_carries: number | null;
  pass_yards: number | null;
  pass_completions: number | null;
  rec_yards: number | null;
  rec_catches: number | null;
  // Baseball
  batting_avg: number | null;
  hits: number | null;
  at_bats: number | null;
  rbi: number | null;
  home_runs: number | null;
  era: number | null;
  wins: number | null;
  losses: number | null;
}

export interface TeamSeasonStats {
  schoolId: number;
  schoolName: string;
  schoolSlug: string;
  players: TeamSeasonPlayer[];
}

/**
 * Get season roster/stats for both teams in a game.
 * Falls back to this when no game_player_stats (box score) data exists.
 * Returns player season stats from sport-specific tables.
 */
export const getTeamSeasonStats = cache(
  async (
    sport: string,
    seasonId: number,
    homeSchoolId: number | null,
    awaySchoolId: number | null
  ): Promise<{ home: TeamSeasonStats | null; away: TeamSeasonStats | null }> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const result: { home: TeamSeasonStats | null; away: TeamSeasonStats | null } = {
              home: null,
              away: null,
            };

            async function fetchTeamStats(schoolId: number): Promise<TeamSeasonPlayer[]> {
              if (sport === "basketball") {
                const { data } = await supabase
                  .from("basketball_player_seasons")
                  .select("player_id, points, ppg, games_played, rebounds, rpg, assists, jersey_number, players(id, name, slug, positions)")
                  .eq("school_id", schoolId)
                  .eq("season_id", seasonId)
                  .order("points", { ascending: false, nullsFirst: false })
                  .limit(20);
                return (data ?? []).map((r: any) => ({
                  player_id: r.player_id,
                  player_name: r.players?.name ?? "Unknown",
                  player_slug: r.players?.slug ?? "",
                  jersey_number: r.jersey_number,
                  position: r.players?.positions?.[0] ?? null,
                  points: r.points,
                  ppg: r.ppg,
                  games_played: r.games_played,
                  rebounds: r.rebounds,
                  assists: r.assists,
                  rush_yards: null, rush_carries: null, pass_yards: null, pass_completions: null,
                  rec_yards: null, rec_catches: null,
                  batting_avg: null, hits: null, at_bats: null, rbi: null, home_runs: null,
                  era: null, wins: null, losses: null,
                }));
              } else if (sport === "football") {
                const { data } = await supabase
                  .from("football_player_seasons")
                  .select("player_id, rush_yards, rush_carries, pass_yards, pass_completions, rec_yards, rec_catches, jersey_number, players(id, name, slug, positions)")
                  .eq("school_id", schoolId)
                  .eq("season_id", seasonId)
                  .limit(30);
                return (data ?? []).map((r: any) => ({
                  player_id: r.player_id,
                  player_name: r.players?.name ?? "Unknown",
                  player_slug: r.players?.slug ?? "",
                  jersey_number: r.jersey_number,
                  position: r.players?.positions?.[0] ?? null,
                  points: null,
                  ppg: null,
                  games_played: null,
                  rebounds: null,
                  assists: null,
                  rush_yards: r.rush_yards,
                  rush_carries: r.rush_carries,
                  pass_yards: r.pass_yards,
                  pass_completions: r.pass_completions,
                  rec_yards: r.rec_yards,
                  rec_catches: r.rec_catches,
                  batting_avg: null, hits: null, at_bats: null, rbi: null, home_runs: null,
                  era: null, wins: null, losses: null,
                }));
              } else if (sport === "baseball") {
                const { data } = await supabase
                  .from("baseball_player_seasons")
                  .select("player_id, batting_avg, hits, at_bats, rbi, home_runs, era, wins, losses, jersey_number, players(id, name, slug, positions)")
                  .eq("school_id", schoolId)
                  .eq("season_id", seasonId)
                  .limit(25);
                return (data ?? []).map((r: any) => ({
                  player_id: r.player_id,
                  player_name: r.players?.name ?? "Unknown",
                  player_slug: r.players?.slug ?? "",
                  jersey_number: r.jersey_number,
                  position: r.players?.positions?.[0] ?? null,
                  points: null, ppg: null, games_played: null, rebounds: null, assists: null,
                  rush_yards: null, rush_carries: null, pass_yards: null, pass_completions: null,
                  rec_yards: null, rec_catches: null,
                  batting_avg: r.batting_avg,
                  hits: r.hits,
                  at_bats: r.at_bats,
                  rbi: r.rbi,
                  home_runs: r.home_runs,
                  era: r.era,
                  wins: r.wins,
                  losses: r.losses,
                }));
              }
              return [];
            }

            // Fetch school names
            const schoolIds = [homeSchoolId, awaySchoolId].filter((id): id is number => id !== null);
            const { data: schools } = await supabase
              .from("schools")
              .select("id, name, slug")
              .in("id", schoolIds);
            const schoolMap = new Map((schools ?? []).map((s: any) => [s.id, s]));

            if (homeSchoolId) {
              const players = await fetchTeamStats(homeSchoolId);
              const school = schoolMap.get(homeSchoolId);
              if (school) {
                result.home = {
                  schoolId: homeSchoolId,
                  schoolName: school.name,
                  schoolSlug: school.slug,
                  players,
                };
              }
            }

            if (awaySchoolId) {
              const players = await fetchTeamStats(awaySchoolId);
              const school = schoolMap.get(awaySchoolId);
              if (school) {
                result.away = {
                  schoolId: awaySchoolId,
                  schoolName: school.name,
                  schoolSlug: school.slug,
                  players,
                };
              }
            }

            return result;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      { home: null, away: null },
      "DATA_TEAM_SEASON_STATS",
      { sport, seasonId, homeSchoolId, awaySchoolId }
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
                 home_school:schools!games_home_school_id_fkey(id, name, slug, city, league_id),
                 away_school:schools!games_away_school_id_fkey(id, name, slug, city, league_id)`
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

// ============================================================================
// HEAD-TO-HEAD HISTORY BETWEEN TWO SCHOOLS
// ============================================================================

export interface HeadToHeadResult {
  totalGames: number;
  schoolAWins: number;
  schoolBWins: number;
  ties: number;
  schoolAName: string;
  schoolBName: string;
  schoolASlug: string;
  schoolBSlug: string;
  lastGame: {
    date: string | null;
    homeSchoolId: number | null;
    awaySchoolId: number | null;
    homeScore: number | null;
    awayScore: number | null;
  } | null;
  streak: {
    team: string;
    teamId: number;
    count: number;
  } | null;
}

/**
 * Get head-to-head history between two schools in a specific sport.
 * Returns overall record, last game, and current streak.
 */
export const getHeadToHead = cache(
  async (
    schoolA: number,
    schoolB: number,
    sportId: string
  ): Promise<HeadToHeadResult | null> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get school names
            const { data: schools } = await supabase
              .from("schools")
              .select("id, name, slug")
              .in("id", [schoolA, schoolB]);

            if (!schools || schools.length < 2) return null;

            const schoolAData = schools.find((s: any) => s.id === schoolA);
            const schoolBData = schools.find((s: any) => s.id === schoolB);
            if (!schoolAData || !schoolBData) return null;

            // Get all games between the two schools in this sport
            // schoolA could be home or away
            const { data: gamesAHome } = await supabase
              .from("games")
              .select("id, game_date, home_school_id, away_school_id, home_score, away_score")
              .eq("sport_id", sportId)
              .eq("home_school_id", schoolA)
              .eq("away_school_id", schoolB)
              .not("home_score", "is", null)
              .not("away_score", "is", null)
              .order("game_date", { ascending: false });

            const { data: gamesBHome } = await supabase
              .from("games")
              .select("id, game_date, home_school_id, away_school_id, home_score, away_score")
              .eq("sport_id", sportId)
              .eq("home_school_id", schoolB)
              .eq("away_school_id", schoolA)
              .not("home_score", "is", null)
              .not("away_score", "is", null)
              .order("game_date", { ascending: false });

            const allGames = [
              ...((gamesAHome as any[]) ?? []),
              ...((gamesBHome as any[]) ?? []),
            ].sort((a, b) => (b.game_date || "").localeCompare(a.game_date || ""));

            if (allGames.length === 0) {
              return {
                totalGames: 0,
                schoolAWins: 0,
                schoolBWins: 0,
                ties: 0,
                schoolAName: schoolAData.name,
                schoolBName: schoolBData.name,
                schoolASlug: schoolAData.slug,
                schoolBSlug: schoolBData.slug,
                lastGame: null,
                streak: null,
              };
            }

            let schoolAWins = 0;
            let schoolBWins = 0;
            let ties = 0;

            // Track streak (games are sorted most recent first)
            let streakTeamId: number | null = null;
            let streakCount = 0;
            let streakBroken = false;

            for (const game of allGames) {
              const isAHome = game.home_school_id === schoolA;
              const aScore = isAHome ? game.home_score : game.away_score;
              const bScore = isAHome ? game.away_score : game.home_score;

              let winnerId: number | null = null;
              if (aScore > bScore) {
                schoolAWins++;
                winnerId = schoolA;
              } else if (bScore > aScore) {
                schoolBWins++;
                winnerId = schoolB;
              } else {
                ties++;
                winnerId = null;
              }

              // Build streak from most recent games
              if (!streakBroken) {
                if (winnerId === null) {
                  // Tie breaks streak
                  if (streakCount === 0) continue;
                  streakBroken = true;
                } else if (streakTeamId === null) {
                  streakTeamId = winnerId;
                  streakCount = 1;
                } else if (winnerId === streakTeamId) {
                  streakCount++;
                } else {
                  streakBroken = true;
                }
              }
            }

            const lastGame = allGames[0];
            const streakTeamName = streakTeamId === schoolA
              ? schoolAData.name
              : streakTeamId === schoolB
                ? schoolBData.name
                : null;

            return {
              totalGames: allGames.length,
              schoolAWins,
              schoolBWins,
              ties,
              schoolAName: schoolAData.name,
              schoolBName: schoolBData.name,
              schoolASlug: schoolAData.slug,
              schoolBSlug: schoolBData.slug,
              lastGame: {
                date: lastGame.game_date,
                homeSchoolId: lastGame.home_school_id,
                awaySchoolId: lastGame.away_school_id,
                homeScore: lastGame.home_score,
                awayScore: lastGame.away_score,
              },
              streak:
                streakTeamId && streakCount > 1
                  ? { team: streakTeamName!, teamId: streakTeamId, count: streakCount }
                  : null,
            };
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      "DATA_HEAD_TO_HEAD",
      { schoolA, schoolB, sportId }
    );
  }
);

// ============================================================================
// TEAM STAT LEADERS (from game_player_stats)
// ============================================================================

export interface TeamStatLeader {
  playerName: string;
  statValue: number;
  statLabel: string;
  gamesPlayed: number;
}

export interface TeamGameStatsResult {
  totalRushYards: number;
  totalPassYards: number;
  totalRecYards: number;
  totalPoints: number;
  gamesWithStats: number;
  rushLeader: TeamStatLeader | null;
  passLeader: TeamStatLeader | null;
  recLeader: TeamStatLeader | null;
  scoringLeader: TeamStatLeader | null;
}

/**
 * Get aggregated team stats and individual leaders from game_player_stats
 * for a specific school and season.
 */
export const getTeamStatLeaders = cache(
  async (schoolId: number, seasonId: number): Promise<TeamGameStatsResult> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Fetch all game_player_stats for this school in this season
            const { data: stats } = await supabase
              .from("game_player_stats")
              .select("player_name, rush_yards, rush_carries, pass_yards, pass_completions, rec_yards, rec_catches, points, game_id, games!inner(season_id)")
              .eq("school_id", schoolId)
              .eq("games.season_id", seasonId);

            const rows = stats ?? [];

            if (rows.length === 0) {
              return {
                totalRushYards: 0,
                totalPassYards: 0,
                totalRecYards: 0,
                totalPoints: 0,
                gamesWithStats: 0,
                rushLeader: null,
                passLeader: null,
                recLeader: null,
                scoringLeader: null,
              };
            }

            // Count unique games
            const uniqueGames = new Set(rows.map((r: any) => r.game_id));

            // Aggregate team totals
            let totalRush = 0, totalPass = 0, totalRec = 0, totalPts = 0;
            const playerRush: Record<string, { yards: number; games: Set<number> }> = {};
            const playerPass: Record<string, { yards: number; games: Set<number> }> = {};
            const playerRec: Record<string, { yards: number; games: Set<number> }> = {};
            const playerPts: Record<string, { pts: number; games: Set<number> }> = {};

            for (const row of rows as any[]) {
              const name = row.player_name || "Unknown";
              const gameId = row.game_id;

              if (row.rush_yards) {
                totalRush += row.rush_yards;
                if (!playerRush[name]) playerRush[name] = { yards: 0, games: new Set() };
                playerRush[name].yards += row.rush_yards;
                playerRush[name].games.add(gameId);
              }
              if (row.pass_yards) {
                totalPass += row.pass_yards;
                if (!playerPass[name]) playerPass[name] = { yards: 0, games: new Set() };
                playerPass[name].yards += row.pass_yards;
                playerPass[name].games.add(gameId);
              }
              if (row.rec_yards) {
                totalRec += row.rec_yards;
                if (!playerRec[name]) playerRec[name] = { yards: 0, games: new Set() };
                playerRec[name].yards += row.rec_yards;
                playerRec[name].games.add(gameId);
              }
              if (row.points) {
                totalPts += row.points;
                if (!playerPts[name]) playerPts[name] = { pts: 0, games: new Set() };
                playerPts[name].pts += row.points;
                playerPts[name].games.add(gameId);
              }
            }

            // Find leaders
            const rushLeaderEntry = Object.entries(playerRush).sort((a, b) => b[1].yards - a[1].yards)[0];
            const passLeaderEntry = Object.entries(playerPass).sort((a, b) => b[1].yards - a[1].yards)[0];
            const recLeaderEntry = Object.entries(playerRec).sort((a, b) => b[1].yards - a[1].yards)[0];
            const ptsLeaderEntry = Object.entries(playerPts).sort((a, b) => b[1].pts - a[1].pts)[0];

            return {
              totalRushYards: totalRush,
              totalPassYards: totalPass,
              totalRecYards: totalRec,
              totalPoints: totalPts,
              gamesWithStats: uniqueGames.size,
              rushLeader: rushLeaderEntry
                ? { playerName: rushLeaderEntry[0], statValue: rushLeaderEntry[1].yards, statLabel: "Rush Yds", gamesPlayed: rushLeaderEntry[1].games.size }
                : null,
              passLeader: passLeaderEntry
                ? { playerName: passLeaderEntry[0], statValue: passLeaderEntry[1].yards, statLabel: "Pass Yds", gamesPlayed: passLeaderEntry[1].games.size }
                : null,
              recLeader: recLeaderEntry
                ? { playerName: recLeaderEntry[0], statValue: recLeaderEntry[1].yards, statLabel: "Rec Yds", gamesPlayed: recLeaderEntry[1].games.size }
                : null,
              scoringLeader: ptsLeaderEntry
                ? { playerName: ptsLeaderEntry[0], statValue: ptsLeaderEntry[1].pts, statLabel: "Points", gamesPlayed: ptsLeaderEntry[1].games.size }
                : null,
            };
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      {
        totalRushYards: 0,
        totalPassYards: 0,
        totalRecYards: 0,
        totalPoints: 0,
        gamesWithStats: 0,
        rushLeader: null,
        passLeader: null,
        recLeader: null,
        scoringLeader: null,
      },
      "DATA_TEAM_STAT_LEADERS",
      { schoolId, seasonId }
    );
  }
);
