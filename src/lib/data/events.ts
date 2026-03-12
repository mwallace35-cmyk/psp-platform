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
 * OPTIMIZED: Combines count with data queries using { count: 'exact' } option
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

          // OPTIMIZED: Run all search queries in parallel with count included
          // This eliminates the need for separate count-only queries
          const [schoolsRes, playersRes, coachesRes] = await Promise.all([
            // Schools: data + count in one query
            supabase
              .from("schools")
              .select("id, slug, name, city, state", { count: "exact" })
              .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
              .is("deleted_at", null)
              .order("name")
              .range(offset, offset + pageSize - 1),
            // Players: data + count in one query
            supabase
              .from("players")
              .select("id, slug, name, college, pro_team, primary_school_id, schools:schools!players_primary_school_id_fkey(name, slug)", { count: "exact" })
              .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
              .is("deleted_at", null)
              .order("name")
              .range(offset, offset + pageSize - 1),
            // Coaches: data + count in one query
            supabase
              .from("coaches")
              .select("id, slug, name", { count: "exact" })
              .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
              .is("deleted_at", null)
              .order("name")
              .range(offset, offset + Math.floor(pageSize / 3) - 1),
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

          // Get total count from responses
          const totalResults =
            (schoolsRes.count ?? 0) + (playersRes.count ?? 0) + (coachesRes.count ?? 0);

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
 * OPTIMIZED: Explicit column selection instead of SELECT *, combined with count
 */
export const getAllCoaches = cache(async (page = 1, pageSize = 50) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const offset = (page - 1) * pageSize;

          // Combined query with count
          const dataRes = await supabase
            .from("coaches")
            .select("id, name, slug, bio, photo_url, coaching_stints(school_id, sport_id, start_year, end_year, role, record_wins, record_losses, record_ties, championships, schools(name, slug), sports(name))", { count: "exact" })
            .is("deleted_at", null)
            .order("name")
            .range(offset, offset + pageSize - 1);

          return {
            data: dataRes.data ?? [],
            total: dataRes.count ?? 0,
            page,
            pageSize,
            hasMore: (offset + pageSize) < (dataRes.count ?? 0),
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
 * OPTIMIZED: Explicit column selection instead of SELECT *, combined with count
 */
export const getCoachesBySport = cache(async (sportId: string, page = 1, pageSize = 50) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const offset = (page - 1) * pageSize;

          // Combined query with count
          const dataRes = await supabase
            .from("coaching_stints")
            .select("id, coach_id, school_id, sport_id, start_year, end_year, role, record_wins, record_losses, record_ties, championships, coaches(id, name, slug, bio, photo_url), schools(name, slug), sports(name)", { count: "exact" })
            .eq("sport_id", sportId)
            .order("championships", { ascending: false })
            .range(offset, offset + pageSize - 1);

          return {
            data: dataRes.data ?? [],
            total: dataRes.count ?? 0,
            page,
            pageSize,
            hasMore: (offset + pageSize) < (dataRes.count ?? 0),
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
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getTrackedAlumni = cache(async (filters?: { level?: string; sport?: string; featured?: boolean }, limit = 100) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let query = supabase
            .from("next_level_tracking")
            .select("id, person_name, current_level, college, pro_team, pro_league, draft_info, status, sport_id, featured, schools:high_school_id(name, slug)")
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
 * OPTIMIZED: Explicit column selection instead of SELECT *
 */
export const getSocialPosts = cache(async (limit = 20) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("social_posts")
            .select("id, alumni_id, platform, post_url, text, curated_at, next_level_tracking(person_name, current_org, current_role)")
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
 * Get aggregated team stats by school (all-time records, championships, seasons)
 * Used for the teams directory page to show school-level statistics.
 * Rewrote to use parallel flat queries instead of N+1 nested embeds.
 */
export async function getSchoolTeamStats(sportId: string, page = 1, pageSize = 500) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const offset = (page - 1) * pageSize;

          // 1. Get all team_seasons for this sport with school + league data (flat queries)
          // IMPORTANT: Supabase PostgREST has a default 1000-row limit.
          // team_seasons can have 2700+ rows, schools 1300+, so we must
          // use .range() to fetch all rows (up to 10000).
          const [teamSeasonsRes, champsRes, schoolsRes] = await Promise.all([
            supabase
              .from("team_seasons")
              .select("school_id, wins, losses, ties")
              .eq("sport_id", sportId)
              .range(0, 9999),
            supabase
              .from("championships")
              .select("school_id")
              .eq("sport_id", sportId)
              .range(0, 9999),
            supabase
              .from("schools")
              .select("id, name, slug, city, state, league_id, leagues(name)")
              .is("deleted_at", null)
              .range(0, 9999),
          ]);

          const teamSeasons = teamSeasonsRes.data ?? [];
          const championships = champsRes.data ?? [];
          const allSchools = schoolsRes.data ?? [];

          // 2. Build school lookup map
          const schoolMap = new Map<number, any>();
          for (const s of allSchools) {
            schoolMap.set(s.id, s);
          }

          // 3. Aggregate team seasons by school
          const schoolStats = new Map<number, {
            totalWins: number; totalLosses: number; totalTies: number;
            seasonCount: number; championships: number;
          }>();

          for (const ts of teamSeasons) {
            const sid = ts.school_id;
            if (!schoolMap.has(sid)) continue; // skip deleted schools
            const existing = schoolStats.get(sid) || {
              totalWins: 0, totalLosses: 0, totalTies: 0, seasonCount: 0, championships: 0,
            };
            existing.totalWins += ts.wins || 0;
            existing.totalLosses += ts.losses || 0;
            existing.totalTies += ts.ties || 0;
            existing.seasonCount += 1;
            schoolStats.set(sid, existing);
          }

          // 4. Count championships per school
          for (const c of championships) {
            const sid = c.school_id;
            const existing = schoolStats.get(sid);
            if (existing) existing.championships += 1;
          }

          // 5. Build result array
          const teamStatsArray = Array.from(schoolStats.entries()).map(([schoolId, stats]) => {
            const school = schoolMap.get(schoolId);
            return {
              school: school || { id: schoolId, name: "Unknown", slug: "", city: null, state: null },
              league: (school?.leagues as any)?.name || "Independent",
              ...stats,
            };
          });

          // 6. Sort by win percentage, then by wins
          teamStatsArray.sort((a, b) => {
            const aTotal = a.totalWins + a.totalLosses + a.totalTies;
            const bTotal = b.totalWins + b.totalLosses + b.totalTies;
            const aWinPct = aTotal > 0 ? a.totalWins / aTotal : 0;
            const bWinPct = bTotal > 0 ? b.totalWins / bTotal : 0;
            if (bWinPct !== aWinPct) return bWinPct - aWinPct;
            return b.totalWins - a.totalWins;
          });

          const totalCount = teamStatsArray.length;
          const paginatedStats = teamStatsArray.slice(offset, offset + pageSize);

          return {
            data: paginatedStats,
            total: totalCount,
            page,
            pageSize,
            hasMore: (offset + pageSize) < totalCount,
          };
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    { data: [], total: 0, page, pageSize, hasMore: false },
    "DATA_SCHOOL_TEAM_STATS",
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
 * Get football career leaders from materialized view.
 * Stat options: rushing, passing, receiving, scoring, total_yards (or raw column names)
 */
export async function getFootballCareerLeaders(stat: string = "rushing", limit = 50): Promise<CareerLeaderRow[]> {
  const cappedLimit = Math.min(Math.max(1, limit), 100);
  // Map friendly stat keys to column names
  const colMap: Record<string, string> = {
    rushing: "career_rush_yards",
    passing: "career_pass_yards",
    receiving: "career_rec_yards",
    scoring: "career_total_td",
    total_yards: "career_total_yards",
  };
  const orderCol = colMap[stat] || stat;

  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("football_career_leaders")
        .select("*")
        .not(orderCol, "is", null)
        .gt(orderCol, 0)
        .order(orderCol, { ascending: false, nullsFirst: false })
        .limit(cappedLimit);
      if (error) {
        console.warn("[PSP] football_career_leaders view query failed:", error.message);
        return [];
      }
      return (data ?? []) as CareerLeaderRow[];
    },
    [],
    "DATA_FOOTBALL_CAREER_LEADERS",
    { stat, limit }
  );
}

/**
 * Get basketball career leaders from materialized view.
 * Stat options: scoring, ppg (or raw column names)
 */
export async function getBasketballCareerLeaders(stat: string = "scoring", limit = 50): Promise<CareerLeaderRow[]> {
  const cappedLimit = Math.min(Math.max(1, limit), 100);
  const colMap: Record<string, string> = {
    scoring: "career_points",
    ppg: "career_ppg",
  };
  const orderCol = colMap[stat] || stat;

  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("basketball_career_leaders")
        .select("*")
        .not(orderCol, "is", null)
        .gt(orderCol, 0)
        .order(orderCol, { ascending: false, nullsFirst: false })
        .limit(cappedLimit);
      if (error) {
        console.warn("[PSP] basketball_career_leaders view query failed:", error.message);
        return [];
      }
      return (data ?? []) as CareerLeaderRow[];
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
            .not("games_played", "is", null) // Exclude incomplete/aggregate records with no games data
            .neq("season_id", 264) // Exclude "Career" aggregate season
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

// ─── Career Leaderboard Types ─────────────────────────────────────

export interface CareerLeaderRow extends Record<string, unknown> {
  player_id: number;
  player_name: string;
  player_slug: string;
  graduation_year: number | null;
  college: string | null;
  pro_team?: string | null;
  school_id: number;
  school_name: string;
  school_slug: string;
  seasons_played: number;
  first_year: number;
  last_year: number;
}

// ─── School Leaderboard Fetchers ─────────────────────────────────────

export interface SchoolWinsRow {
  school_id: number;
  school_slug: string;
  school_name: string;
  city: string | null;
  mascot: string | null;
  logo_url: string | null;
  league_name: string | null;
  sport_id: string;
  total_seasons: number;
  total_wins: number;
  total_losses: number;
  total_ties: number;
  total_games: number;
  win_pct: string;
  championship_count: number;
  total_points_for: number;
  total_points_against: number;
  first_year: number;
  last_year: number;
}

export interface SchoolChampionshipRow {
  school_id: number;
  school_name: string;
  school_slug: string;
  total_championships: number;
  fb_champs: number;
  bb_champs: number;
  base_champs: number;
  other_champs: number;
}

export interface SchoolStatProductionRow {
  school_id: number;
  school_name: string;
  school_slug: string;
  league_name: string | null;
  total_players: number;
  [key: string]: unknown;
}

/**
 * Get school win/loss leaderboard from team_alltime_records materialized view.
 * Filterable by sport.
 */
export async function getSchoolWinsLeaderboard(sportId: string, orderBy: string = "total_wins", limit = 50): Promise<SchoolWinsRow[]> {
  const cappedLimit = Math.min(Math.max(1, limit), 100);
  const validOrders = ["total_wins", "win_pct", "total_games", "championship_count", "total_points_for"];
  const orderCol = validOrders.includes(orderBy) ? orderBy : "total_wins";

  return withErrorHandling(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("team_alltime_records")
        .select("*")
        .eq("sport_id", sportId)
        .gt("total_games", 0)
        .order(orderCol, { ascending: false, nullsFirst: false })
        .limit(cappedLimit);
      if (error) {
        console.warn("[PSP] team_alltime_records query failed:", error.message);
        return [];
      }
      return (data ?? []) as SchoolWinsRow[];
    },
    [],
    "DATA_SCHOOL_WINS_LEADERBOARD",
    { sportId, orderBy, limit }
  );
}

/**
 * Get school championship leaderboard (aggregated across all sports or filtered).
 * Uses raw SQL via RPC since we need cross-sport aggregation.
 */
export async function getSchoolChampionshipLeaderboard(sportFilter?: string, limit = 50): Promise<SchoolChampionshipRow[]> {
  const cappedLimit = Math.min(Math.max(1, limit), 100);

  return withErrorHandling(
    async () => {
      const supabase = await createClient();

      if (sportFilter && sportFilter !== "all") {
        // Single sport
        const { data, error } = await supabase
          .from("championships")
          .select("school_id, schools!championships_school_id_fkey!inner(name, slug)")
          .eq("sport_id", sportFilter)
          .not("school_id", "is", null);

        if (error) { console.warn("[PSP] champ query failed:", error.message); return []; }

        // Aggregate in JS
        const counts = new Map<number, { name: string; slug: string; count: number }>();
        for (const row of (data ?? []) as any[]) {
          const sid = row.school_id as number;
          const existing = counts.get(sid);
          if (existing) {
            existing.count++;
          } else {
            counts.set(sid, {
              name: row.schools?.name || "Unknown",
              slug: row.schools?.slug || "",
              count: 1,
            });
          }
        }

        return Array.from(counts.entries())
          .map(([id, v]) => ({
            school_id: id,
            school_name: v.name,
            school_slug: v.slug,
            total_championships: v.count,
            fb_champs: sportFilter === "football" ? v.count : 0,
            bb_champs: sportFilter === "basketball" ? v.count : 0,
            base_champs: sportFilter === "baseball" ? v.count : 0,
            other_champs: !["football", "basketball", "baseball"].includes(sportFilter) ? v.count : 0,
          }))
          .sort((a, b) => b.total_championships - a.total_championships)
          .slice(0, cappedLimit);
      } else {
        // All sports — aggregate
        const { data, error } = await supabase
          .from("championships")
          .select("school_id, sport_id, schools!championships_school_id_fkey!inner(name, slug)")
          .not("school_id", "is", null);

        if (error) { console.warn("[PSP] champ query failed:", error.message); return []; }

        const counts = new Map<number, {
          name: string; slug: string; total: number;
          fb: number; bb: number; base: number; other: number;
        }>();

        for (const row of (data ?? []) as any[]) {
          const sid = row.school_id as number;
          const sport = row.sport_id as string;
          const existing = counts.get(sid) || {
            name: row.schools?.name || "Unknown",
            slug: row.schools?.slug || "",
            total: 0, fb: 0, bb: 0, base: 0, other: 0,
          };
          existing.total++;
          if (sport === "football") existing.fb++;
          else if (sport === "basketball") existing.bb++;
          else if (sport === "baseball") existing.base++;
          else existing.other++;
          counts.set(sid, existing);
        }

        return Array.from(counts.entries())
          .map(([id, v]) => ({
            school_id: id,
            school_name: v.name,
            school_slug: v.slug,
            total_championships: v.total,
            fb_champs: v.fb,
            bb_champs: v.bb,
            base_champs: v.base,
            other_champs: v.other,
          }))
          .sort((a, b) => b.total_championships - a.total_championships)
          .slice(0, cappedLimit);
      }
    },
    [],
    "DATA_SCHOOL_CHAMPIONSHIP_LEADERBOARD",
    { sportFilter, limit }
  );
}

/**
 * Get school stat production leaderboard (total stats produced by all players from that school).
 */
export async function getSchoolStatProduction(sport: string, orderBy: string = "total_yards", limit = 50): Promise<SchoolStatProductionRow[]> {
  const cappedLimit = Math.min(Math.max(1, limit), 100);

  return withErrorHandling(
    async () => {
      const supabase = await createClient();

      if (sport === "football") {
        // Use football_career_leaders view for aggregation
        const { data, error } = await supabase
          .from("football_career_leaders")
          .select("school_id, school_name, school_slug, career_rush_yards, career_pass_yards, career_rec_yards, career_total_td, career_points, career_total_yards");

        if (error) { console.warn("[PSP] fb career leaders query failed:", error.message); return []; }

        // Aggregate by school
        const schools = new Map<number, SchoolStatProductionRow>();
        for (const row of (data ?? []) as any[]) {
          const sid = row.school_id as number;
          const existing = schools.get(sid);
          if (existing) {
            existing.total_players = (existing.total_players || 0) + 1;
            existing.total_rush_yards = ((existing.total_rush_yards as number) || 0) + (row.career_rush_yards || 0);
            existing.total_pass_yards = ((existing.total_pass_yards as number) || 0) + (row.career_pass_yards || 0);
            existing.total_rec_yards = ((existing.total_rec_yards as number) || 0) + (row.career_rec_yards || 0);
            existing.total_td = ((existing.total_td as number) || 0) + (row.career_total_td || 0);
            existing.total_points = ((existing.total_points as number) || 0) + (row.career_points || 0);
            existing.total_yards = ((existing.total_yards as number) || 0) + (row.career_total_yards || 0);
          } else {
            schools.set(sid, {
              school_id: sid,
              school_name: row.school_name,
              school_slug: row.school_slug,
              league_name: null,
              total_players: 1,
              total_rush_yards: row.career_rush_yards || 0,
              total_pass_yards: row.career_pass_yards || 0,
              total_rec_yards: row.career_rec_yards || 0,
              total_td: row.career_total_td || 0,
              total_points: row.career_points || 0,
              total_yards: row.career_total_yards || 0,
            });
          }
        }

        const validOrders: Record<string, string> = {
          total_yards: "total_yards",
          total_rush_yards: "total_rush_yards",
          total_pass_yards: "total_pass_yards",
          total_td: "total_td",
          total_points: "total_points",
          total_players: "total_players",
        };
        const sortKey = validOrders[orderBy] || "total_yards";

        return Array.from(schools.values())
          .sort((a, b) => ((b[sortKey] as number) || 0) - ((a[sortKey] as number) || 0))
          .slice(0, cappedLimit);

      } else if (sport === "basketball") {
        const { data, error } = await supabase
          .from("basketball_career_leaders")
          .select("school_id, school_name, school_slug, career_points, career_games, career_ppg");

        if (error) { console.warn("[PSP] bb career leaders query failed:", error.message); return []; }

        const schools = new Map<number, SchoolStatProductionRow>();
        for (const row of (data ?? []) as any[]) {
          const sid = row.school_id as number;
          const existing = schools.get(sid);
          if (existing) {
            existing.total_players = (existing.total_players || 0) + 1;
            existing.total_points = ((existing.total_points as number) || 0) + (row.career_points || 0);
            existing.total_games = ((existing.total_games as number) || 0) + (row.career_games || 0);
          } else {
            schools.set(sid, {
              school_id: sid,
              school_name: row.school_name,
              school_slug: row.school_slug,
              league_name: null,
              total_players: 1,
              total_points: row.career_points || 0,
              total_games: row.career_games || 0,
            });
          }
        }

        return Array.from(schools.values())
          .sort((a, b) => ((b.total_points as number) || 0) - ((a.total_points as number) || 0))
          .slice(0, cappedLimit);
      }

      return [];
    },
    [],
    "DATA_SCHOOL_STAT_PRODUCTION",
    { sport, orderBy, limit }
  );
}
