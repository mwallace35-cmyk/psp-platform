import {
  createClient,
  withErrorHandling,
  withRetry,
  sanitizePostgREST,
  SearchResult,
  PlayerSearchResult,
} from "./common";

/**
 * Search across schools, players, and coaches
 */
export async function searchAll(query: string, limit = 30) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Sanitize query to prevent PostgREST injection
          const sanitizedQuery = sanitizePostgREST(query);

          // Search schools, players, and coaches directly (search_index may be empty)
          // Optimized search: use prefix matching and word-start matching for index usage
          const [schoolsRes, playersRes, coachesRes] = await Promise.all([
            supabase
              .from("schools")
              .select("id, slug, name, city, state")
              .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
              .is("deleted_at", null)
              .order("name")
              .limit(15),
            supabase
              .from("players")
              .select("id, slug, name, college, pro_team, primary_school_id, schools:schools!players_primary_school_id_fkey(name, slug)")
              .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
              .is("deleted_at", null)
              .order("name")
              .limit(15),
            supabase
              .from("coaches")
              .select("id, slug, name")
              .or(`name.ilike.${sanitizedQuery}%,name.ilike.% ${sanitizedQuery}%`)
              .is("deleted_at", null)
              .order("name")
              .limit(10),
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

          return results.slice(0, limit);
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SEARCH_ALL",
    { query, limit }
  );
}

/**
 * Get all coaches with their coaching stints
 */
export async function getAllCoaches(limit = 100) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("coaches")
            .select("*, coaching_stints(school_id, sport_id, start_year, end_year, role, record_wins, record_losses, record_ties, championships, schools(name, slug), sports(name))")
            .is("deleted_at", null)
            .order("name")
            .limit(limit);
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_ALL_COACHES",
    { limit }
  );
}

/**
 * Get coaches for a specific sport
 */
export async function getCoachesBySport(sportId: string, limit = 50) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("coaching_stints")
            .select("*, coaches(id, name, slug, bio, photo_url), schools(name, slug), sports(name)")
            .eq("sport_id", sportId)
            .order("championships", { ascending: false })
            .limit(limit);
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_COACHES_BY_SPORT",
    { sportId, limit }
  );
}

/**
 * Get total count of coaches
 */
export async function getCoachCount() {
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
}

/**
 * Get tracked alumni ("Our Guys" - next level tracking)
 */
export async function getTrackedAlumni(filters?: { level?: string; sport?: string; featured?: boolean }, limit = 100) {
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
}

/**
 * Get social posts from tracked alumni
 */
export async function getSocialPosts(limit = 20) {
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
}

/**
 * Get featured alumni
 */
export async function getFeaturedAlumni(limit = 5) {
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
}

/**
 * Get counts of alumni across different levels
 */
export async function getAlumniCounts() {
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
}

/**
 * Get recruiting profiles with optional filters
 */
export async function getRecruits(filters?: { sportId?: string; classYear?: number; status?: string }, limit = 50) {
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
}

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
 * Get teams with records for a sport
 */
export async function getTeamsWithRecords(sportId: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("team_seasons")
            .select("*, schools(name, slug), seasons(label)")
            .eq("sport_id", sportId)
            .order("wins", { ascending: false })
            .order("losses")
            .order("ties");
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_TEAMS_WITH_RECORDS",
    { sportId }
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

export async function getLeaderboard(stat: StatCategory, limit = 25) {
  const mapping = STAT_TABLE_MAP[stat];
  if (!mapping) return [];
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
            .limit(limit);
          return (data ?? []).map((row: any, i: number) => ({
            rank: i + 1,
            value: row[mapping.column as keyof typeof row] as number,
            player: row.players,
            school: row.schools,
            season: row.seasons,
            sport: mapping.sport,
            stat,
          }));
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

/**
 * Get football leaders by stat (rushing, passing, receiving, scoring)
 */
export async function getFootballLeaders(stat: string, limit = 50) {
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
            .select("*, players(name, slug, schools:schools!players_primary_school_id_fkey(name, slug)), seasons(label, year_start)")
            .not(orderCol, "is", null)
            .gt(orderCol, 0)
            .order(orderCol, { ascending: false, nullsFirst: false })
            .limit(limit);

          // Flatten school from players.schools to top-level for template
          return (data ?? []).map((row: any) => ({
            ...row,
            schools: row.players?.schools || row.schools || null,
          }));
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_FOOTBALL_LEADERS",
    { stat, limit }
  );
}

/**
 * Get basketball leaders by stat (points, ppg, rebounds, assists)
 */
export async function getBasketballLeaders(stat: string, limit = 50) {
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
            .select("*, players(name, slug, schools:schools!players_primary_school_id_fkey(name, slug)), seasons(label, year_start)")
            .not(orderCol, "is", null)
            .gt(orderCol, 0)
            .order(orderCol, { ascending: false, nullsFirst: false })
            .limit(limit);

          // Flatten school from players.schools to top-level for template
          return (data ?? []).map((row: any) => ({
            ...row,
            schools: row.players?.schools || row.schools || null,
          }));
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_BASKETBALL_LEADERS",
    { stat, limit }
  );
}
