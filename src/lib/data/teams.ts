import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  Championship,
  Season,
  SchoolRecord,
  Game,
  RosterPlayer,
  TeamSeasonWithRelations,
} from "./common";

// Helper type for sorting season-joined data
interface SeasonJoinedRecord {
  seasons: Season | Season[];
  year_start?: number;
  [key: string]: unknown;
}

function sortBySeasonYear<T extends SeasonJoinedRecord>(records: T[]): T[] {
  return records.sort((a, b) => {
    const aSeason = Array.isArray(a.seasons) ? a.seasons[0] : a.seasons;
    const bSeason = Array.isArray(b.seasons) ? b.seasons[0] : b.seasons;
    const aYear = aSeason?.year_start ?? 0;
    const bYear = bSeason?.year_start ?? 0;
    return bYear - aYear;
  });
}

/**
 * Get recently crowned champions for a sport
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getRecentChampions = cache(
  async (sportId: string, limit = 5) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from("championships")
              .select("id, sport_id, school_id, opponent_id, season_id, level, league_id, score, notes, schools!championships_school_id_fkey(name, slug), seasons(year_start, year_end, label), leagues(name)")
              .eq("sport_id", sportId)
              .not("season_id", "is", null)
              .order("created_at", { ascending: false })
              .limit(Math.min(limit, 200));
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_RECENT_CHAMPIONS",
      { sportId, limit }
    );
  }
);

/**
 * Get all championships for a sport
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getChampionshipsBySport = cache(
  async (sportId: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data, error } = await supabase
              .from("championships")
              .select(
                `id, sport_id, school_id, opponent_id, season_id, level, league_id, score, notes, championship_type,
                 schools!championships_school_id_fkey(name, slug), seasons(year_start, year_end, label), leagues(name),
                 opponent:schools!championships_opponent_id_fkey(name)`
              )
              .eq("sport_id", sportId)
              .order("created_at", { ascending: false })
              .limit(500);
            if (error) {
              console.error("Championships query error:", error);
              return [];
            }
            // Sort by season year_start client-side (more reliable than ordering by join)
            return sortBySeasonYear((data ?? []) as unknown as SeasonJoinedRecord[]) as unknown as Championship[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_CHAMPIONSHIPS_BY_SPORT",
      { sportId }
    );
  }
);

/**
 * Get records for a sport
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getRecordsBySport = cache(
  async (sportId: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from("records")
              .select("id, sport_id, category, subcategory, record_value, record_number, holder_name, holder_school, year_set, description, player_id, school_id, season_id, scope, verified, players(name, slug), schools(name, slug), seasons(label)")
              .eq("sport_id", sportId)
              .order("category")
              .order("record_number", { ascending: false })
              .limit(600);
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_RECORDS_BY_SPORT",
      { sportId }
    );
  }
);

/**
 * Get team season by school, sport, and season label
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getTeamSeason = cache(
  async (schoolId: number, sportId: string, seasonLabel: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("team_seasons")
            .select("id, school_id, sport_id, season_id, coach_id, wins, losses, ties, playoff_result, notes, seasons(year_start, year_end, label), schools(name, slug), coaches(id, name, slug)")
            .eq("school_id", schoolId)
            .eq("sport_id", sportId)
            .filter("seasons.label", "eq", seasonLabel)
            .single();
          return data;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    null,
    "DATA_TEAM_SEASON",
    { schoolId, sportId, seasonLabel }
  );
}
);

/**
 * Get games for a team in a season
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getGamesByTeamSeason = cache(
  async (schoolId: number, sportId: string, seasonId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from("games")
              .select("id, sport_id, season_id, game_date, game_time, home_school_id, away_school_id, home_score, away_score, notes, data_source, seasons(label, year_start), home_school:schools!games_home_school_id_fkey(name, slug), away_school:schools!games_away_school_id_fkey(name, slug)")
              .eq("season_id", seasonId)
              .eq("sport_id", sportId)
              .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
              .order("game_date")
              .limit(500);
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_GAMES_BY_TEAM_SEASON",
      { schoolId, sportId, seasonId }
    );
  }
);

/**
 * Get roster for a team in a season
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getTeamRosterBySeason = cache(
  async (schoolId: number, sportId: string, seasonId: number) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("rosters")
            .select("id, player_id, school_id, sport_id, season_id, jersey_number, position, players(id, name, slug)")
            .eq("school_id", schoolId)
            .eq("sport_id", sportId)
            .eq("season_id", seasonId)
            .order("jersey_number")
            .limit(500);
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_TEAM_ROSTER_BY_SEASON",
    { schoolId, sportId, seasonId }
  );
}
);

/**
 * Get available team seasons for a school and sport (for dropdown selectors)
 */
export const getAvailableTeamSeasons = cache(
  async (schoolId: number, sportId: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("team_seasons")
            .select("id, season_id, seasons(year_start, year_end, label)")
            .eq("school_id", schoolId)
            .eq("sport_id", sportId)
            .order("seasons.year_start", { ascending: false })
            .limit(200);
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_AVAILABLE_TEAM_SEASONS",
    { schoolId, sportId }
  );
}
);

/**
 * Get recent games for a sport (for the hub score banner).
 * Finds the most recent season with completed games, then returns
 * the latest results from that season. Filters out games where
 * either school name is missing (TBD / deleted school).
 * Deduplicates games that appear twice (same teams + same scores).
 * Returns most recent games first, limited to `limit`.
 */
export const getRecentGamesBySport = cache(
  async (sportId: string, limit = 20) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Step 1: Find the most recent season that has completed games
            // Exclude 0-0 placeholder games (future/unplayed games with default scores)
            const { data: latestSeasonData } = await supabase
              .from("games")
              .select("season_id, seasons(id, label, year_start)")
              .eq("sport_id", sportId)
              .not("home_score", "is", null)
              .not("away_score", "is", null)
              .not("season_id", "is", null)
              .or("home_score.gt.0,away_score.gt.0")
              .order("game_date", { ascending: false })
              .limit(1);

            const latestSeasonId = latestSeasonData?.[0]?.season_id;
            if (!latestSeasonId) return [];

            // Step 2: Fetch completed games from that season only
            // Over-fetch to have room after filtering
            // Exclude 0-0 placeholder games (future/unplayed games with default scores)
            const { data } = await supabase
              .from("games")
              .select(
                "id, home_score, away_score, game_date, game_type, playoff_round, " +
                "home_school:schools!games_home_school_id_fkey(id, name, slug), " +
                "away_school:schools!games_away_school_id_fkey(id, name, slug), " +
                "seasons(label)"
              )
              .eq("sport_id", sportId)
              .eq("season_id", latestSeasonId)
              .not("home_score", "is", null)
              .not("away_score", "is", null)
              .or("home_score.gt.0,away_score.gt.0")
              .order("game_date", { ascending: false })
              .limit(Math.min(limit * 3, 500));

            // Step 3: Filter — require BOTH teams to have names (no TBD)
            interface GameWithSchools {
              home_school?: { name?: string; id?: number };
              away_school?: { name?: string; id?: number };
              home_score?: number;
              away_score?: number;
              game_date?: string;
            }

            const withBothTeams = ((data ?? []) as GameWithSchools[]).filter(
              (g) => g.home_school?.name && g.away_school?.name
            );

            // Step 4: Deduplicate (same two teams + same scores = duplicate import)
            const seen = new Set<string>();
            const deduped = withBothTeams.filter((g) => {
              const key = [
                Math.min(g.home_school?.id ?? 0, g.away_school?.id ?? 0),
                Math.max(g.home_school?.id ?? 0, g.away_school?.id ?? 0),
                Math.min(g.home_score ?? 0, g.away_score ?? 0),
                Math.max(g.home_score ?? 0, g.away_score ?? 0),
                g.game_date,
              ].join("|");
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });

            return deduped.slice(0, limit);
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      "DATA_RECENT_GAMES_BY_SPORT",
      { sportId, limit }
    );
  }
);

/**
 * Get championship games with box score availability
 * Links championships to their game records and indicates if box scores exist
 */
export const getChampionshipGamesWithBoxScores = cache(
  async (sportId: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Fetch championship games by matching:
            // 1. Same sport and season
            // 2. Matching home/away school_id with championship school_id and opponent_id
            // 3. game_type = 'championship'
            const { data, error } = await supabase
              .from("games")
              .select(
                `id, sport_id, season_id, game_date, home_school_id, away_school_id, home_score, away_score, notes,
                 home_school:schools!games_home_school_id_fkey(id, name, slug),
                 away_school:schools!games_away_school_id_fkey(id, name, slug),
                 seasons(label, year_start, year_end),
                 game_player_stats(id)`
              )
              .eq("sport_id", sportId)
              .eq("game_type", "championship")
              .order("game_date", { ascending: false })
              .limit(500);

            if (error) {
              console.error("Championship games query error:", error);
              return {};
            }

            // Build map of championship games: key = `${season_id}|${home_school_id}|${away_school_id}`
            interface ChampionshipGame {
              id: number;
              sport_id: string;
              season_id: number;
              game_date: string;
              home_school_id: number;
              away_school_id: number;
              home_score: number;
              away_score: number;
              notes?: string;
              game_player_stats: unknown[];
              home_school?: { id?: number; name?: string; slug?: string };
              away_school?: { id?: number; name?: string; slug?: string };
              seasons?: { label?: string; year_start?: number; year_end?: number };
              hasBoxScore?: boolean;
              [key: string]: unknown;
            }

            const champGameMap: Record<string, ChampionshipGame> = {};
            for (const game of (data ?? []) as ChampionshipGame[]) {
              const hasBoxScore = Array.isArray(game.game_player_stats) && game.game_player_stats.length > 0;
              // Create multiple key variations to handle home/away swaps and different opponent records
              const seasonId = game.season_id;
              if (seasonId) {
                const key1 = `${seasonId}|${game.home_school_id}|${game.away_school_id}`;
                const key2 = `${seasonId}|${game.away_school_id}|${game.home_school_id}`;
                champGameMap[key1] = { ...game, hasBoxScore };
                champGameMap[key2] = { ...game, hasBoxScore };
              }
            }

            return champGameMap;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      {},
      "DATA_CHAMPIONSHIP_GAMES",
      { sportId }
    );
  }
);
