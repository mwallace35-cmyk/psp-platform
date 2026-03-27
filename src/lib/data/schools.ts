import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  School,
  TeamSeason,
  Season,
  Championship,
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
 * Get overview stats for a sport (schools, players, seasons, championships)
 * Cached to avoid redundant database queries within the same request
 */
export const getSportOverview = cache(async (sportId: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Use the correct stat table per sport
          const PLAYER_STAT_TABLES: Record<string, string> = {
            football: "football_player_seasons",
            basketball: "basketball_player_seasons",
            baseball: "baseball_player_seasons",
          };
          const statTable = PLAYER_STAT_TABLES[sportId];

          // For sports with typed tables, count from that table; otherwise count from player_seasons_misc
          const playerQuery = statTable
            ? supabase.from(statTable).select("player_id", { count: "exact", head: true })
            : supabase.from("player_seasons_misc").select("player_id", { count: "exact", head: true }).eq("sport_id", sportId);

          const [schoolsRes, playersRes, seasonsRes, champsRes] = await Promise.all([
            supabase.from("team_seasons").select("school_id", { count: "exact", head: true }).eq("sport_id", sportId),
            playerQuery,
            supabase.from("team_seasons").select("season_id", { count: "exact", head: true }).eq("sport_id", sportId),
            supabase.from("championships").select("id", { count: "exact", head: true }).eq("sport_id", sportId),
          ]);
          return {
            schools: schoolsRes.count ?? 0,
            players: playersRes.count ?? 0,
            seasons: seasonsRes.count ?? 0,
            championships: champsRes.count ?? 0,
          };
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    { schools: 0, players: 0, seasons: 0, championships: 0 },
    "DATA_SPORT_OVERVIEW",
    { sportId }
  );
});

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Get schools for a specific sport (with pagination)
 * Cached to avoid redundant database queries within the same request
 */
export const getSchoolsBySport = cache(async (sportId: string, page = 1, pageSize = 50) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const offset = (page - 1) * pageSize;

          const [dataRes, countRes] = await Promise.all([
            supabase
              .from("schools")
              .select(
                `
                id, slug, name, short_name, city, mascot,
                leagues(name, short_name),
                team_seasons!inner(wins, losses, ties, sport_id)
              `
              )
              .eq("team_seasons.sport_id", sportId)
              .is("deleted_at", null)
              .order("name")
              .range(offset, offset + pageSize - 1),
            supabase
              .from("schools")
              .select("id", { count: "exact", head: true })
              .is("deleted_at", null),
          ]);

          return {
            data: dataRes.data ?? [],
            total: countRes.count ?? 0,
            page,
            pageSize,
            hasMore: (offset + pageSize) < (countRes.count ?? 0),
          };
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    { data: [], total: 0, page, pageSize, hasMore: false },
    "DATA_SCHOOLS_BY_SPORT",
    { sportId, page, pageSize }
  );
});

/**
 * Get school by slug
 * Cached to avoid redundant database queries within the same request
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getSchoolBySlug = cache(async (slug: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("schools")
            .select("id, slug, name, short_name, city, state, league_id, mascot, closed_year, founded_year, website_url, colors, address, phone, principal, athletic_director, enrollment, piaa_class, school_type, logo_url, primary_color, secondary_color, leagues(name, short_name)")
            .eq("slug", slug)
            .is("deleted_at", null)
            .single();
          return data;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    null,
    "DATA_SCHOOL_BY_SLUG",
    { slug }
  );
});

/**
 * Get team seasons for a school and sport
 * Cached to avoid redundant database queries within the same request
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getSchoolTeamSeasons = cache(async (schoolId: number, sportId: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("team_seasons")
            .select("id, school_id, sport_id, season_id, coach_id, wins, losses, ties, points_for, points_against, league_finish, league_wins, league_losses, playoff_result, notes, seasons(year_start, year_end, label), coaches(name, slug)")
            .eq("school_id", schoolId)
            .eq("sport_id", sportId)
            .order("created_at", { ascending: false });
          // NOTE: Supabase JS client doesn't support ORDER BY on joined columns (seasons.year_start).
          // Client-side sort is necessary here. The DB returns data in created_at order as a rough approximation.
          return sortBySeasonYear((data ?? []) as unknown as SeasonJoinedRecord[]) as unknown as TeamSeason[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_TEAM_SEASONS",
    { schoolId, sportId }
  );
});

/**
 * Get championships for a school (optionally filtered by sport)
 * Cached to avoid redundant database queries within the same request
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getSchoolChampionships = cache(async (schoolId: number, sportId?: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let query = supabase
            .from("championships")
            .select("id, sport_id, school_id, opponent_id, season_id, level, league_id, score, notes, championship_type, seasons(year_start, year_end, label), leagues(name), opponent:schools!championships_opponent_id_fkey(name)")
            .eq("school_id", schoolId);
          if (sportId) query = query.eq("sport_id", sportId);
          const { data } = await query.order("created_at", { ascending: false });
          // NOTE: Supabase JS client doesn't support ORDER BY on joined columns (seasons.year_start).
          // Client-side sort is necessary here. The DB returns data in created_at order as a rough approximation.
          return sortBySeasonYear((data ?? []) as unknown as SeasonJoinedRecord[]) as unknown as Championship[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_CHAMPIONSHIPS",
    { schoolId, sportId }
  );
});

/**
 * Get notable players from a school, prioritizing those with pro/college credentials
 * Cached to avoid redundant database queries within the same request
 */
export interface NotablePlayer {
  id: number;
  name: string;
  slug: string;
  positions?: string | string[];
  graduation_year?: number | null;
  height?: string | null;
  weight?: number | null;
  college?: string | null;
  pro_team?: string | null;
  pro_league?: string | null;
  season_count?: number;
}

export const getSchoolNotablePlayers = cache(async (schoolId: number, sportId: string, limit = 10) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Determine the sport stat table
          const PLAYER_STAT_TABLES: Record<string, string> = {
            football: "football_player_seasons",
            basketball: "basketball_player_seasons",
            baseball: "baseball_player_seasons",
          };
          const statTable = PLAYER_STAT_TABLES[sportId];

          if (!statTable) {
            // For minor sports, query next_level_tracking directly
            const { data } = await supabase
              .from("next_level_tracking")
              .select("id, person_name, college, pro_team, pro_league, sport_id")
              .eq("high_school_id", schoolId)
              .eq("sport_id", sportId)
              .is("deleted_at", null)
              .order("pro_league", { ascending: true })
              .order("person_name", { ascending: true })
              .limit(limit);

            interface NextLevelRecord {
              id: number;
              person_name: string;
              college?: string;
              pro_team?: string;
              pro_league?: string;
            }
            return (data ?? []).map((d) => {
              const record = d as NextLevelRecord;
              return {
                id: record.id,
                name: record.person_name,
                slug: "", // Not available from next_level_tracking directly
                college: record.college,
                pro_team: record.pro_team,
                pro_league: record.pro_league,
              };
            });
          }

          // For typed sports, fetch from player_seasons with next_level priority
          const { data } = await supabase
            .from(statTable)
            .select(
              `
              player_id,
              players!inner(
                id, name, slug, positions, graduation_year, height, weight,
                next_level:next_level_tracking(
                  college, pro_team, pro_league
                )
              )
            `
            )
            .eq("school_id", schoolId)
            .limit(25)
            .is("players.deleted_at", null)
            .order("players(name)", { ascending: true });

          if (!data) return [];

          // Group by player to get unique players, count seasons, and prioritize by next-level status
          interface StatTableRecord {
            player_id: number;
            players: {
              id: number;
              name: string;
              slug: string;
              positions?: string[];
              graduation_year?: number;
              height?: string;
              weight?: number;
              next_level?: Array<{ college?: string; pro_team?: string; pro_league?: string }>;
            };
          }

          const playerMap = new Map<number, NotablePlayer & { hasNextLevel: boolean; seasonCount: number }>();

          (data as unknown as StatTableRecord[]).forEach((row) => {
            const p = row.players;
            if (!playerMap.has(p.id)) {
              const nextLevel = Array.isArray(p.next_level) ? p.next_level[0] : p.next_level;
              playerMap.set(p.id, {
                id: p.id,
                name: p.name,
                slug: p.slug,
                positions: p.positions,
                graduation_year: p.graduation_year,
                height: p.height,
                weight: p.weight,
                college: nextLevel?.college ?? null,
                pro_team: nextLevel?.pro_team ?? null,
                pro_league: nextLevel?.pro_league ?? null,
                seasonCount: 0,
                hasNextLevel: !!(nextLevel?.pro_team || nextLevel?.college),
              });
            }
            playerMap.get(p.id)!.seasonCount++;
          });

          // Sort by: has pro team, then has college, then season count, then name
          const sorted = Array.from(playerMap.values())
            .sort((a, b) => {
              // Pro athletes first
              if (!!b.pro_team !== !!a.pro_team) return !!b.pro_team ? 1 : -1;
              // Then college
              if (!!b.college !== !!a.college) return !!b.college ? 1 : -1;
              // Then by season count
              if (b.seasonCount !== a.seasonCount) return b.seasonCount - a.seasonCount;
              // Finally by name
              return a.name.localeCompare(b.name);
            })
            .slice(0, limit)
            .map(({ hasNextLevel, seasonCount, ...player }) => player);

          return sorted;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_NOTABLE_PLAYERS",
    { schoolId, sportId, limit }
  );
});

// ============================================================================
// CURRENT SEASON DATA (for school page "Current Season" block)
// ============================================================================

export interface CurrentSeasonData {
  seasonId: number;
  seasonLabel: string;
  teamSeason: {
    id: number;
    wins: number;
    losses: number;
    ties: number;
    league_finish: string | null;
    playoff_result: string | null;
    coach: { name: string; slug: string } | null;
  } | null;
  nextGame: {
    id: number;
    game_date: string | null;
    home_score: number | null;
    away_score: number | null;
    game_type: string | null;
    isHome: boolean;
    opponent: { name: string; slug: string };
  } | null;
  roster: Array<{
    id: number;
    jersey_number: string | null;
    position: string | null;
    class_year: string | null;
    player: { id: number; name: string; slug: string };
  }>;
}

/**
 * Get current season data for a school: record, standing, next game, and roster preview.
 * Returns null if no current season exists or no team_season for this school/sport.
 */
export const getCurrentSeasonData = cache(
  async (schoolId: number, sportId: string): Promise<CurrentSeasonData | null> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // 1. Get current season
            const { data: currentSeason } = await supabase
              .from("seasons")
              .select("id, label")
              .eq("is_current", true)
              .single();

            if (!currentSeason) return null;

            // 2. Get team_season for this school/sport/season
            const { data: teamSeason } = await supabase
              .from("team_seasons")
              .select("id, wins, losses, ties, league_finish, playoff_result, coaches(name, slug)")
              .eq("school_id", schoolId)
              .eq("sport_id", sportId)
              .eq("season_id", currentSeason.id)
              .single();

            if (!teamSeason) return null;

            // 3. Get most recent/next game (closest to today, preferring future games)
            const today = new Date().toISOString().split("T")[0];

            // Try future game first
            const { data: futureGame } = await supabase
              .from("games")
              .select(
                `id, game_date, home_score, away_score, game_type, home_school_id, away_school_id,
                 home_school:schools!games_home_school_id_fkey(name, slug),
                 away_school:schools!games_away_school_id_fkey(name, slug)`
              )
              .eq("season_id", currentSeason.id)
              .eq("sport_id", sportId)
              .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
              .gte("game_date", today)
              .order("game_date", { ascending: true })
              .limit(1);

            // If no future game, get most recent past game
            let gameData = futureGame?.[0] || null;
            if (!gameData) {
              const { data: pastGame } = await supabase
                .from("games")
                .select(
                  `id, game_date, home_score, away_score, game_type, home_school_id, away_school_id,
                   home_school:schools!games_home_school_id_fkey(name, slug),
                   away_school:schools!games_away_school_id_fkey(name, slug)`
                )
                .eq("season_id", currentSeason.id)
                .eq("sport_id", sportId)
                .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
                .order("game_date", { ascending: false })
                .limit(1);
              gameData = pastGame?.[0] || null;
            }

            let nextGame: CurrentSeasonData["nextGame"] = null;
            if (gameData) {
              const isHome = gameData.home_school_id === schoolId;
              const opponentRaw = isHome ? gameData.away_school : gameData.home_school;
              const opponent = Array.isArray(opponentRaw) ? opponentRaw[0] : opponentRaw;
              nextGame = {
                id: gameData.id,
                game_date: gameData.game_date,
                home_score: gameData.home_score,
                away_score: gameData.away_score,
                game_type: gameData.game_type,
                isHome,
                opponent: opponent || { name: "TBD", slug: "" },
              };
            }

            // 4. Get roster preview (up to 8 players, prefer starters/positions)
            const { data: rosterData } = await supabase
              .from("rosters")
              .select("id, jersey_number, position, class_year, players(id, name, slug)")
              .eq("school_id", schoolId)
              .eq("sport_id", sportId)
              .eq("season_id", currentSeason.id)
              .order("position")
              .order("jersey_number")
              .limit(8);

            const roster = (rosterData || []).map((r: any) => {
              const player = Array.isArray(r.players) ? r.players[0] : r.players;
              return {
                id: r.id,
                jersey_number: r.jersey_number,
                position: r.position,
                class_year: r.class_year,
                player: player || { id: 0, name: "Unknown", slug: "" },
              };
            });

            const coach = teamSeason.coaches
              ? Array.isArray(teamSeason.coaches)
                ? (teamSeason.coaches as any)[0]
                : teamSeason.coaches
              : null;

            return {
              seasonId: currentSeason.id,
              seasonLabel: currentSeason.label,
              teamSeason: {
                id: teamSeason.id,
                wins: teamSeason.wins ?? 0,
                losses: teamSeason.losses ?? 0,
                ties: teamSeason.ties ?? 0,
                league_finish: teamSeason.league_finish,
                playoff_result: teamSeason.playoff_result,
                coach,
              },
              nextGame,
              roster,
            };
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      "DATA_CURRENT_SEASON",
      { schoolId, sportId }
    );
  }
);
