import {
  createClient,
  withErrorHandling,
  withRetry,
  School,
  TeamSeason,
  Season,
  Championship,
} from "./common";

/**
 * Get overview stats for a sport (schools, players, seasons, championships)
 */
export async function getSportOverview(sportId: string) {
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
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Get schools for a specific sport (with pagination)
 */
export async function getSchoolsBySport(sportId: string, page = 1, pageSize = 50) {
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
}

/**
 * Get school by slug
 */
export async function getSchoolBySlug(slug: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("schools")
            .select("*, leagues(name, short_name)")
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
}

/**
 * Get team seasons for a school and sport
 */
export async function getSchoolTeamSeasons(schoolId: number, sportId: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("team_seasons")
            .select("*, seasons(year_start, year_end, label), coaches(name, slug)")
            .eq("school_id", schoolId)
            .eq("sport_id", sportId)
            .order("created_at", { ascending: false });
          // NOTE: Supabase JS client doesn't support ORDER BY on joined columns (seasons.year_start).
          // Client-side sort is necessary here. The DB returns data in created_at order as a rough approximation.
          return (data ?? []).sort((a: TeamSeason, b: TeamSeason) => {
            const aYear = (a.seasons as Season | null)?.year_start ?? 0;
            const bYear = (b.seasons as Season | null)?.year_start ?? 0;
            return bYear - aYear;
          });
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_TEAM_SEASONS",
    { schoolId, sportId }
  );
}

/**
 * Get championships for a school (optionally filtered by sport)
 */
export async function getSchoolChampionships(schoolId: number, sportId?: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let query = supabase
            .from("championships")
            .select("*, seasons(year_start, year_end, label), leagues(name), opponent:schools!championships_opponent_id_fkey(name)")
            .eq("school_id", schoolId);
          if (sportId) query = query.eq("sport_id", sportId);
          const { data } = await query.order("created_at", { ascending: false });
          // NOTE: Supabase JS client doesn't support ORDER BY on joined columns (seasons.year_start).
          // Client-side sort is necessary here. The DB returns data in created_at order as a rough approximation.
          return (data ?? []).sort((a, b) => {
            const aYear = (a.seasons as Season | null)?.year_start ?? 0;
            const bYear = (b.seasons as Season | null)?.year_start ?? 0;
            return bYear - aYear;
          });
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SCHOOL_CHAMPIONSHIPS",
    { schoolId, sportId }
  );
}
