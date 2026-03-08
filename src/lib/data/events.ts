import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  sanitizePostgREST,
  SearchResult,
  PlayerSearchResult,
  LeaderboardEntry,
  Season,
} from "./common";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Search across schools, players, and coaches with pagination
 */
export async function searchAll(query: string, page = 1, pageSize = 30) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Sanitize query to prevent PostgREST injection
          const sanitizedQuery = sanitizePostgREST(query);

          const offset = (page - 1) * pageSize;

          // Search schools, players, and coaches with pagination
          // Optimized search: use prefix matching and word-start matching for index usage
          const [schoolsRes, playersRes, coachesRes, totalRes] = await Promise.all([
            supabase
              .from("schools")
              .select("id, slug, name, city, state")
              .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
              .is("deleted_at", null)
              .order("name")
              .range(offset, offset + pageSize - 1),
            supabase
              .from("players")
              .select("id, slug, name, college, pro_team, primary_school_id, schools:schools!players_primary_school_id_fkey(name, slug)")
              .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
              .is("deleted_at", null)
              .order("name")
              .range(offset, offset + pageSize - 1),
            supabase
              .from("coaches")
              .select("id, slug, name")
              .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
              .is("deleted_at", null)
              .order("name")
              .range(offset, offset + Math.floor(pageSize / 3) - 1),
            // Get total count across all entities for hasMore calculation
            Promise.all([
              supabase
                .from("schools")
                .select("id", { count: "exact", head: true })
                .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
                .is("deleted_at", null),
              supabase
                .from("players")
                .select("id", { count: "exact", head: true })
                .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
                .is("deleted_at", null),
              supabase
                .from("coaches")
                .select("id", { count: "exact", head: true })
                .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
                .is("deleted_at", null),
            ]),
          ]);

          const results: SearchResult[] = [];

          // Schools
          // TODO: Detect sport context from player/coach/championship data instead of defaulting to football
          for (const s of schoolsRes.data ?? []) {
            results.push({
              entity_type: "school",
              entity_id: s.id,
              display_name: s.name,
              context: [s.city, s.state].filter(Boolean).join(", "),
              url_path: `/football/schools/${s.slug}`,
            });
          }

          // Players — detect their sport from stat tables
          for (const p of (playersRes.data ?? []) as unknown as PlayerSearchResult[]) {
            const school = p.schools;
            results.push({
              entity_type: "player",
              entity_id: p.id,
              display_name: p.name,
              context: [school?.name, p.college, p.pro_team].filter(Boolean).join(" · "),
              url_path: `/football/players/${p.slug}`,
            });
          }

          // Coaches
          for (const c of coachesRes.data ?? []) {
            results.push({
              entity_type: "coach",
              entity_id: c.id,
              display_name: c.name,
              context: "Coach",
              url_path: `/football/coaches/${c.slug}`,
            });
          }

          const [schoolCount, playerCount, coachCount] = await totalRes;
          const totalResults = (schoolCount.count ?? 0) + (playerCount.count ?? 0) + (coachCount.count ?? 0);

          return {
            data: results,
            total: totalResults,
            page,
            pageSize,
            hasMore: (offset + pageSize) < totalResults,
          };
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    { data: [], total: 0, page, pageSize, hasMore: false },
    "DATA_SEARCH_ALL",
    { query, page, pageSize }
  );
}

/**
 * Get all coaches with their coaching stints (with pagination)
 * Cached to avoid redundant database queries within the same request
 */
export const getAllCoaches = cache(async (page = 1, pageSize = 50) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const offset = (page - 1) * pageSize;

          const [dataRes, countRes] = await Promise.all([
            supabase
              .from("coaches")
              .select("*, coaching_stints(school_id, sport_id, start_year, end_year, role, record_wins, record_losses, record_ties, championships, schools(name, slug), sports(name))")
              .is("deleted_at", null)
              .order("name")
              .range(offset, offset + pageSize - 1),
            supabase
              .from("coaches")
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
    "DATA_ALL_COACHES",
    { page, pageSize }
  );
});

/**
 * Get coaches for a specific sport (with pagination)
 * Cached to avoid redundant database queries within the same request
 */
export const getCoachesBySport = cache(async (sportId: string, page = 1, pageSize = 50) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const offset = (page - 1) * pageSize;

          const [dataRes, countRes] = await Promise.all([
            supabase
              .from("coaching_stints")
              .select("*, coaches(id, name, slug, bio, photo_url), schools(name, slug), sports(name)")
              .eq("sport_id", sportId)
              .order("championships", { ascending: false })
              .range(offset, offset + pageSize - 1),
            supabase
              .from("coaching_stints")
              .select("id", { count: "exact", head: true })
              .eq("sport_id", sportId),
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
    "DATA_COACHES_BY_SPORT",
    { sportId, page, pageSize }
  );
});

/**
 * Get total count of coaches
 * Cached to avoid redundant database queries within the same request
 */
export const getCoachCount = cache(async () => {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { count } = await supabase
        .from("coaches")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null);
      return count ?? 0;
    },
    0,
    "DATA_COACH_COUNT",
    {}
  );
});

/**
 * Get tracked alumni ("Our Guys" - next level tracking)
 * Cached to avoid redundant database queries within the same request
 */
export const getTrackedAlumni = cache(async (filters?: { level?: string; sport?: string; featured?: boolean }, limit = 100) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let query = supabase
            .from("next_level_tracking")
            .select("*, schools:high_school_id(name, slug)")
            .order("featured", { ascending: false })
            .order("person_name")
            .limit(limit);
          if (filters?.level) query = query.eq("current_level", filters.level);
          if (filters?.sport) query = query.eq("sport_id", filters.sport);
          if (filters?.featured) query = query.eq("featured", true);
          const { data } = await query;
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_TRACKED_ALUMNI",
    { filters, limit }
  );
});

/**
 * Get social posts from tracked alumni
 * Cached to avoid redundant database queries within the same request
 */
export const getSocialPosts = cache(async (limit = 20) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("social_posts")
            .select("*, next_level_tracking(person_name, current_org, current_role)")
            .order("curated_at", { ascending: false })
            .limit(limit);
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SOCIAL_POSTS",
    { limit }
  );
});

/**
 * Get featured alumni
 * Cached to avoid redundant database queries within the same request
 */
export const getFeaturedAlumni = cache(async (limit = 5) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("next_level_tracking")
            .select("*, schools:high_school_id(name, slug)")
            .eq("featured", true)
            .eq("status", "active")
            .order("updated_at", { ascending: false })
            .limit(limit);
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_FEATURED_ALUMNI",
    { limit }
  );
});

/**
 * Get counts of alumni across different levels
 * Cached to avoid redundant database queries within the same request
 */
export const getAlumniCounts = cache(async () => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const [nfl, nba, mlb, college, coaching] = await Promise.all([
            supabase.from("next_level_tracking").select("id", { count: "exact", head: true }).eq("pro_league", "NFL"),
            supabase.from("next_level_tracking").select("id", { count: "exact", head: true }).eq("pro_league", "NBA"),
            supabase.from("next_level_tracking").select("id", { count: "exact", head: true }).eq("pro_league", "MLB"),
            supabase.from("next_level_tracking").select("id", { count: "exact", head: true }).eq("current_level", "college"),
            supabase.from("next_level_tracking").select("id", { count: "exact", head: true }).eq("current_level", "coaching"),
          ]);
          return {
            nfl: nfl.count ?? 0,
            nba: nba.count ?? 0,
            mlb: mlb.count ?? 0,
            college: college.count ?? 0,
            coaching: coaching.count ?? 0,
            total: (nfl.count ?? 0) + (nba.count ?? 0) + (mlb.count ?? 0) + (college.count ?? 0) + (coaching.count ?? 0),
          };
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    { nfl: 0, nba: 0, mlb: 0, college: 0, coaching: 0, total: 0 },
    "DATA_ALUMNI_COUNTS",
    {}
  );
});

/**
 * Get recruiting profiles with optional filters
 * Cached to avoid redundant database queries within the same request
 */
export const getRecruits = cache(async (filters?: { sportId?: string; classYear?: number; status?: string }, limit = 50) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let query = supabase
            .from("recruiting_profiles")
            .select("*, players(name, slug, schools:schools!players_primary_school_id_fkey(name, slug)), sports(name)")
            .order("star_rating", { ascending: false, nullsFirst: false })
            .order("composite_rating", { ascending: false, nullsFirst: false })
            .limit(limit);
          if (filters?.sportId) query = query.eq("sport_id", filters.sportId);
          if (filters?.classYear) query = query.eq("class_year", filters.classYear);
          if (filters?.status) query = query.eq("status", filters.status);
          const { data } = await query;
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_RECRUITS",
    { filters, limit }
  );
});

/**
 * Get recruiting profiles for a specific class year
 */
export async function getRecruitsByClass(classYear: number, limit = 50) {
  return getRecruits({ classYear }, limit);
}

/**
 * Get recent commitments
 */
export async function getRecentCommitments(limit = 10) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("recruiting_profiles")
            .select("*, players(name, slug, schools:schools!players_primary_school_id_fkey(name, slug)), sports(name)")
            .eq("status", "committed")
            .not("committed_date", "is", null)
            .order("committed_date", { ascending: false })
            .limit(limit);
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_RECENT_COMMITMENTS",
    { limit }
  );
}

/**
 * Get teams with records for a sport (with pagination)
 */
export async function getTeamsWithRecords(sportId: string, page = 1, pageSize = 50) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const offset = (page - 1) * pageSize;

          const [dataRes, countRes] = await Promise.all([
            supabase
              .from("team_seasons")
              .select("*, schools(name, slug), seasons(label)")
              .eq("sport_id", sportId)
              .order("wins", { ascending: false })
              .order("losses")
              .order("ties")
              .range(offset, offset + pageSize - 1),
            supabase
              .from("team_seasons")
              .select("id", { count: "exact", head: true })
              .eq("sport_id", sportId),
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
    "DATA_TEAMS_WITH_RECORDS",
    { sportId, page, pageSize }
  );
}

/**
 * Get leaderboard entries (cross-sport abstraction)
 */
export type StatCategory = "rushing" | "passing" | "receiving" | "scoring" | "points" | "ppg" | "rebounds" | "assists" | "batting_avg" | "home_runs" | "era";

const STAT_TABLE_MAP: Record<string, { table: string; column: string; sport: string }> = {
  rushing: { table: "football_player_seasons", column: "rush_yards", sport: "football" },
  passing: { table: "football_player_seasons", column: "pass_yards", sport: "football" },
  receiving: { table: "football_player_seasons", column: "rec_yards", sport: "football" },
  scoring: { table: "football_player_seasons", column: "total_td", sport: "football" },
  points: { table: "basketball_player_seasons", column: "points", sport: "basketball" },
  ppg: { table: "basketball_player_seasons", column: "ppg", sport: "basketball" },
  rebounds: { table: "basketball_player_seasons", column: "rebounds", sport: "basketball" },
  assists: { table: "basketball_player_seasons", column: "assists", sport: "basketball" },
  batting_avg: { table: "baseball_player_seasons", column: "batting_avg", sport: "baseball" },
  home_runs: { table: "baseball_player_seasons", column: "home_runs", sport: "baseball" },
  era: { table: "baseball_player_seasons", column: "era", sport: "baseball" },
};

interface LeaderboardRowData {
  [key: string]: unknown;
  players?: { id: number; name: string; slug: string } | null;
  schools?: { name: string; slug: string } | null;
  seasons?: Season | null;
}

export async function getLeaderboard(stat: StatCategory, limit = 25): Promise<LeaderboardEntry[]> {
  const mapping = STAT_TABLE_MAP[stat];
  if (!mapping) return [];

  // Cap limit to prevent abuse: maximum 100 results
  const cappedLimit = Math.min(Math.max(1, limit), 100);

  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const ascending = stat === "era";
          const { data } = await supabase
            .from(mapping.table)
            .select("*, players(id, name, slug), schools(name, slug), seasons(label)")
            .not(mapping.column, "is", null)
            .gt(mapping.column, 0)
            .order(mapping.column, { ascending })
            .limit(cappedLimit);
          return (data as LeaderboardRowData[] ?? []).map((row: LeaderboardRowData, i: number) => ({
            rank: i + 1,
            value: (row[mapping.column] as number) ?? 0,
            player: row.players ?? null,
            school: row.schools ?? null,
            season: row.seasons ?? null,
            sport: mapping.sport,
            stat,
          } as LeaderboardEntry));
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_LEADERBOARD",
    { stat, limit }
  );
}

/**
 * Get football career leaders by stat
 */
export async function getFootballCareerLeaders(stat: string = "rush_yards", limit = 25) {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("football_career_leaders")
        .select("*")
        .order(stat, { ascending: false, nullsFirst: false })
        .limit(limit);
      if (error) {
        console.warn("[PSP] football_career_leaders view query failed, falling back:", error.message);
        return [];
      }
      return data ?? [];
    },
    [],
    "DATA_FOOTBALL_CAREER_LEADERS",
    { stat, limit }
  );
}

/**
 * Get basketball career leaders by stat
 */
export async function getBasketballCareerLeaders(stat: string = "points", limit = 25) {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("basketball_career_leaders")
        .select("*")
        .order(stat, { ascending: false, nullsFirst: false })
        .limit(limit);
      if (error) {
        console.warn("[PSP] basketball_career_leaders view query failed, falling back:", error.message);
        return [];
      }
      return data ?? [];
    },
    [],
    "DATA_BASKETBALL_CAREER_LEADERS",
    { stat, limit }
  );
}

/**
 * Get season leaderboard for a sport and stat
 */
export async function getSeasonLeaderboard(sportId: string, stat: string, seasonLabel?: string, limit = 25) {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      let query = supabase
        .from("season_leaderboards")
        .select("*")
        .eq("sport_id", sportId)
        .order(stat, { ascending: false, nullsFirst: false })
        .limit(limit);
      if (seasonLabel) {
        query = query.eq("season_label", seasonLabel);
      }
      const { data, error } = await query;
      if (error) {
        console.warn("[PSP] season_leaderboards view query failed:", error.message);
        return [];
      }
      return data ?? [];
    },
    [],
    "DATA_SEASON_LEADERBOARD",
    { sportId, stat, seasonLabel, limit }
  );
}

/**
 * Get data freshness for a sport
 */
export async function getDataFreshness(sportId: string) {
  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("games")
        .select("updated_at, data_source, last_verified_at")
        .eq("sport_id", sportId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
      return data ? {
        lastUpdated: data.updated_at,
        source: data.data_source,
        lastVerified: data.last_verified_at,
      } : null;
    },
    null,
    "DATA_FRESHNESS",
    { sportId }
  );
}

export interface FootballLeaderRowData extends Record<string, unknown> {
  id: string;
  players?: {
    name: string;
    slug: string;
    pro_team?: string | null;
    schools?: { name: string; slug: string } | null;
  } | null;
  schools?: {
    name: string;
    slug: string;
  } | null;
  seasons?: {
    label: string;
    year_start: number;
  } | null;
  rush_yards?: number;
  pass_yards?: number;
  rec_yards?: number;
  total_td?: number;
}

/**
 * Get football leaders by stat (rushing, passing, receiving, scoring)
 * Cached to avoid redundant database queries within the same request
 */
export const getFootballLeaders = cache(async (stat: string, limit = 50) => {
  // Cap limit to prevent abuse: maximum 100 results
  const cappedLimit = Math.min(Math.max(1, limit), 100);

  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let orderCol = "rush_yards";
          if (stat === "passing") orderCol = "pass_yards";
          else if (stat === "receiving") orderCol = "rec_yards";
          else if (stat === "scoring" || stat === "touchdowns") orderCol = "total_td";

          const { data } = await supabase
            .from("football_player_seasons")
            .select("*, players(name, slug, pro_team, schools:schools!players_primary_school_id_fkey(name, slug)), seasons(label, year_start)")
            .not(orderCol, "is", null)
            .gt(orderCol, 0)
            .order(orderCol, { ascending: false, nullsFirst: false })
            .limit(cappedLimit);

          // Flatten school from players.schools to top-level for template
          return (data as FootballLeaderRowData[] ?? []).map((row) => ({
            ...row,
            schools: row.players?.schools || row.schools || null,
          })) as FootballLeaderRowData[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_FOOTBALL_LEADERS",
    { stat, limit }
  );
});

export interface BasketballLeaderRowData extends Record<string, unknown> {
  id: string;
  players?: {
    name: string;
    slug: string;
    pro_team?: string | null;
    schools?: { name: string; slug: string } | null;
  } | null;
  schools?: {
    name: string;
    slug: string;
  } | null;
  seasons?: {
    label: string;
    year_start: number;
  } | null;
  points?: number;
  ppg?: number;
  rebounds?: number;
  assists?: number;
}

/**
 * Get basketball leaders by stat (points, ppg, rebounds, assists)
 * Cached to avoid redundant database queries within the same request
 */
export const getBasketballLeaders = cache(async (stat: string, limit = 50) => {
  // Cap limit to prevent abuse: maximum 100 results
  const cappedLimit = Math.min(Math.max(1, limit), 100);

  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let orderCol = "points";
          if (stat === "ppg") orderCol = "ppg";
          else if (stat === "rebounds") orderCol = "rebounds";
          else if (stat === "assists") orderCol = "assists";

          const { data } = await supabase
            .from("basketball_player_seasons")
            .select("*, players(name, slug, pro_team, schools:schools!players_primary_school_id_fkey(name, slug)), seasons(label, year_start)")
            .not(orderCol, "is", null)
            .gt(orderCol, 0)
            .order(orderCol, { ascending: false, nullsFirst: false })
            .limit(cappedLimit);

          // Flatten school from players.schools to top-level for template
          return (data as BasketballLeaderRowData[] ?? []).map((row) => ({
            ...row,
            schools: row.players?.schools || row.schools || null,
          })) as BasketballLeaderRowData[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_BASKETBALL_LEADERS",
    { stat, limit }
  );
});
