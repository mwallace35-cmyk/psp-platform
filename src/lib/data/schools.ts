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
            .select("id, slug, name, short_name, city, state, league_id, mascot, closed_year, founded_year, website_url, colors, address, phone, principal, athletic_director, enrollment, piaa_class, school_type, leagues(name, short_name)")
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
            .select("id, school_id, sport_id, season_id, coach_id, wins, losses, ties, playoff_result, notes, seasons(year_start, year_end, label), coaches(name, slug)")
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
            .select("id, sport_id, school_id, opponent_id, season_id, level, league_id, score, notes, seasons(year_start, year_end, label), leagues(name), opponent:schools!championships_opponent_id_fkey(name)")
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
