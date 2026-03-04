import { createClient } from "@/lib/supabase/server";

// Re-export constants from sports.ts (for server components that import from data.ts)
export { VALID_SPORTS, SPORT_META, isValidSport } from "@/lib/sports";
export type { SportId } from "@/lib/sports";

export async function getSportOverview(sportId: string) {
  try {
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
  } catch {
    return { schools: 0, players: 0, seasons: 0, championships: 0 };
  }
}

export async function getSchoolsBySport(sportId: string, limit = 50) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
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
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAllSchools() {
  try {
    const supabase = await createClient();

    // Query schools with league assignments (filters out opponent stubs and junk entries)
    const { data: schools, error } = await supabase
      .from("schools")
      .select(`
        id, slug, name, short_name, city, state, mascot, league_id, colors, logo_url, address,
        leagues(name, short_name)
      `)
      .is("deleted_at", null)
      .not("league_id", "is", null)
      .order("name")
      .limit(200);

    if (error) {
      console.error("[getAllSchools] Supabase error:", error.message, error.details, error.hint);
      return [];
    }

    if (!schools || schools.length === 0) {
      console.log("[getAllSchools] No schools returned from query");
      return [];
    }

    // Count championships per school separately (avoids FK ambiguity)
    const schoolIds = schools.map((s: any) => s.id);
    const { data: champs, error: champError } = await supabase
      .from("championships")
      .select("school_id")
      .in("school_id", schoolIds);

    if (champError) {
      console.error("[getAllSchools] Championships query error:", champError.message);
    }

    const champCounts = new Map<number, number>();
    (champs ?? []).forEach((c: any) => {
      champCounts.set(c.school_id, (champCounts.get(c.school_id) || 0) + 1);
    });

    return schools.map((s: any) => ({
      ...s,
      championships_count: champCounts.get(s.id) ?? 0,
    }));
  } catch (err) {
    console.error("[getAllSchools] Exception:", err);
    return [];
  }
}

export async function getSchoolBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("schools")
      .select("*, leagues(name, short_name)")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function getSchoolTeamSeasons(schoolId: number, sportId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("team_seasons")
      .select("*, seasons(year_start, year_end, label), coaches(name, slug)")
      .eq("school_id", schoolId)
      .eq("sport_id", sportId)
      .order("created_at", { ascending: false });
    // Sort by season year client-side
    return (data ?? []).sort((a: any, b: any) => {
      const aYear = a.seasons?.year_start ?? 0;
      const bYear = b.seasons?.year_start ?? 0;
      return bYear - aYear;
    });
  } catch {
    return [];
  }
}

export async function getSchoolChampionships(schoolId: number, sportId?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("championships")
      .select("*, seasons(year_start, year_end, label), leagues(name), opponent:schools!championships_opponent_id_fkey(name)")
      .eq("school_id", schoolId);
    if (sportId) query = query.eq("sport_id", sportId);
    const { data } = await query.order("created_at", { ascending: false });
    // Sort by season year client-side
    return (data ?? []).sort((a: any, b: any) => {
      const aYear = a.seasons?.year_start ?? 0;
      const bYear = b.seasons?.year_start ?? 0;
      return bYear - aYear;
    });
  } catch {
    return [];
  }
}

export async function getPlayerBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("players")
      .select("*, schools:schools!players_primary_school_id_fkey(name, slug)")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function getFootballPlayerStats(playerId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("football_player_seasons")
      .select("*, seasons(year_start, year_end, label), schools!football_player_seasons_school_id_fkey(name, slug)")
      .eq("player_id", playerId)
      .order("created_at", { ascending: true });
    // Sort by season year client-side
    return (data ?? []).sort((a: any, b: any) => (a.seasons?.year_start ?? 0) - (b.seasons?.year_start ?? 0));
  } catch {
    return [];
  }
}

export async function getBasketballPlayerStats(playerId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("basketball_player_seasons")
      .select("*, seasons(year_start, year_end, label), schools(name, slug)")
      .eq("player_id", playerId)
      .order("created_at", { ascending: true });
    return (data ?? []).sort((a: any, b: any) => (a.seasons?.year_start ?? 0) - (b.seasons?.year_start ?? 0));
  } catch {
    return [];
  }
}

export async function getBaseballPlayerStats(playerId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("baseball_player_seasons")
      .select("*, seasons(year_start, year_end, label), schools(name, slug)")
      .eq("player_id", playerId)
      .order("created_at", { ascending: true });
    return (data ?? []).sort((a: any, b: any) => (a.seasons?.year_start ?? 0) - (b.seasons?.year_start ?? 0));
  } catch {
    return [];
  }
}

export async function getPlayerAwards(playerId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("awards")
      .select("*, seasons(year_start, year_end, label)")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getRecentChampions(sportId: string, limit = 5) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("championships")
      .select("*, schools!championships_school_id_fkey(name, slug), seasons(year_start, year_end, label), leagues(name)")
      .eq("sport_id", sportId)
      .not("season_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getChampionshipsBySport(sportId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("championships")
      .select(
        `*, schools!championships_school_id_fkey(name, slug), seasons(year_start, year_end, label), leagues(name),
         opponent:schools!championships_opponent_id_fkey(name)`
      )
      .eq("sport_id", sportId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Championships query error:", error);
      return [];
    }
    // Sort by season year_start client-side (more reliable than ordering by join)
    return (data ?? []).sort((a: any, b: any) => {
      const aYear = a.seasons?.year_start ?? 0;
      const bYear = b.seasons?.year_start ?? 0;
      return bYear - aYear;
    });
  } catch {
    return [];
  }
}

export async function getRecordsBySport(sportId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("records")
      .select("*, players(name, slug), schools(name, slug), seasons(label)")
      .eq("sport_id", sportId)
      .order("category")
      .order("record_number", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getFootballLeaders(stat: string, limit = 50) {
  try {
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
  } catch {
    return [];
  }
}

export async function getBasketballLeaders(stat: string, limit = 50) {
  try {
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
  } catch {
    return [];
  }
}

export async function searchAll(query: string, limit = 30) {
  try {
    const supabase = await createClient();

    // Search schools, players, and coaches directly (search_index may be empty)
    const [schoolsRes, playersRes, coachesRes] = await Promise.all([
      supabase
        .from("schools")
        .select("id, slug, name, city, state")
        .ilike("name", `%${query}%`)
        .is("deleted_at", null)
        .order("name")
        .limit(15),
      supabase
        .from("players")
        .select("id, slug, name, college, pro_team, primary_school_id, schools:schools!players_primary_school_id_fkey(name, slug)")
        .ilike("name", `%${query}%`)
        .is("deleted_at", null)
        .order("name")
        .limit(15),
      supabase
        .from("coaches")
        .select("id, slug, name")
        .ilike("name", `%${query}%`)
        .is("deleted_at", null)
        .order("name")
        .limit(10),
    ]);

    const results: any[] = [];

    // Schools
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
    for (const p of playersRes.data ?? []) {
      const school = (p as any).schools;
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
  } catch {
    return [];
  }
}

// ============================================================================
// ARTICLE FUNCTIONS (Blueprint Rec #1)
// ============================================================================

export async function getFeaturedArticles(sportId?: string, limit = 5) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("articles")
      .select("id, slug, title, excerpt, author_name, sport_id, featured_image_url, published_at, featured_at, schools(name, slug), players(name, slug)")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("featured_at", { ascending: false, nullsFirst: false })
      .order("published_at", { ascending: false })
      .limit(limit);
    if (sportId) query = query.eq("sport_id", sportId);
    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("articles")
      .select("*, schools(name, slug), players(name, slug), championships(level, score, seasons(label))")
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function getArticlesForEntity(entityType: string, entityId: number, limit = 10) {
  try {
    const supabase = await createClient();
    const { data: mentions } = await supabase
      .from("article_mentions")
      .select("article_id")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId);
    if (!mentions?.length) return [];
    const articleIds = mentions.map(m => m.article_id);
    const { data } = await supabase
      .from("articles")
      .select("id, slug, title, excerpt, sport_id, published_at, featured_image_url")
      .in("id", articleIds)
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

// ============================================================================
// CROSS-SPORT ABSTRACTION (Blueprint Rec #6)
// ============================================================================

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
  try {
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
      value: row[mapping.column],
      player: row.players,
      school: row.schools,
      season: row.seasons,
      sport: mapping.sport,
      stat,
    }));
  } catch {
    return [];
  }
}

export async function getPlayerStats(playerId: number, sportId: string) {
  try {
    const supabase = await createClient();
    const tables: Record<string, string> = {
      football: "football_player_seasons",
      basketball: "basketball_player_seasons",
      baseball: "baseball_player_seasons",
    };
    const table = tables[sportId] || "player_seasons_misc";
    let query = supabase
      .from(table)
      .select("*, seasons(label, year_start), schools(name, slug)")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false });
    if (table === "player_seasons_misc") {
      query = query.eq("sport_id", sportId);
    }
    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
}

// ============================================================================
// DATA FRESHNESS (Blueprint Rec #2)
// ============================================================================

export async function getDataFreshness(sportId: string) {
  try {
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
  } catch {
    return null;
  }
}

// ============================================================================
// TEAM SEASON DATA (Per-Year Team Pages)
// ============================================================================

export async function getTeamSeason(schoolId: number, sportId: string, seasonLabel: string) {
  try {
    const supabase = await createClient();
    // First look up the season by label
    const { data: seasonData } = await supabase
      .from("seasons")
      .select("id")
      .eq("label", seasonLabel)
      .single();
    if (!seasonData) return null;

    const { data } = await supabase
      .from("team_seasons")
      .select("*, seasons(id, year_start, year_end, label), coaches:coach_id(id, name, slug), schools(id, name, slug, city, state, league_id)")
      .eq("school_id", schoolId)
      .eq("sport_id", sportId)
      .eq("season_id", seasonData.id)
      .single();
    return data ? { ...data, season_id: seasonData.id } : null;
  } catch {
    return null;
  }
}

export async function getGamesByTeamSeason(schoolId: number, sportId: string, seasonId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("games")
      .select("*, seasons(label), home_school:schools!games_home_school_id_fkey(id, name, slug), away_school:schools!games_away_school_id_fkey(id, name, slug)")
      .eq("sport_id", sportId)
      .eq("season_id", seasonId)
      .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
      .order("game_date", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getTeamRosterBySeason(schoolId: number, sportId: string, seasonId: number) {
  try {
    const supabase = await createClient();
    const tables: Record<string, string> = {
      football: "football_player_seasons",
      basketball: "basketball_player_seasons",
      baseball: "baseball_player_seasons",
    };
    const table = tables[sportId];
    if (!table) {
      // Minor sports use player_seasons_misc
      const { data } = await supabase
        .from("player_seasons_misc")
        .select("*, players(id, name, slug)")
        .eq("school_id", schoolId)
        .eq("sport_id", sportId)
        .eq("season_id", seasonId)
        .order("created_at");
      return data ?? [];
    }
    // Sport-specific ordering
    const orderCol = sportId === "football" ? "total_td" : sportId === "basketball" ? "points" : "created_at";
    const { data } = await supabase
      .from(table)
      .select("*, players(id, name, slug)")
      .eq("school_id", schoolId)
      .eq("season_id", seasonId)
      .order(orderCol, { ascending: false, nullsFirst: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAvailableTeamSeasons(schoolId: number, sportId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("team_seasons")
      .select("seasons(label, year_start)")
      .eq("school_id", schoolId)
      .eq("sport_id", sportId)
      .order("created_at", { ascending: false });
    return (data ?? [])
      .map((d: any) => d.seasons)
      .filter(Boolean)
      .sort((a: any, b: any) => (b.year_start ?? 0) - (a.year_start ?? 0));
  } catch {
    return [];
  }
}

// ============================================================================
// COACHES FUNCTIONS
// ============================================================================

export async function getAllCoaches(limit = 100) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("coaches")
      .select("*, coaching_stints(school_id, sport_id, start_year, end_year, role, record_wins, record_losses, record_ties, championships, schools(name, slug), sports(name))")
      .is("deleted_at", null)
      .order("name")
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getCoachesBySport(sportId: string, limit = 50) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("coaching_stints")
      .select("*, coaches(id, name, slug, bio, photo_url), schools(name, slug), sports(name)")
      .eq("sport_id", sportId)
      .order("championships", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getCoachCount() {
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from("coaches")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null);
    return count ?? 0;
  } catch {
    return 0;
  }
}

// ============================================================================
// OUR GUYS (Next Level Tracking)
// ============================================================================

export async function getTrackedAlumni(filters?: { level?: string; sport?: string; featured?: boolean }, limit = 100) {
  try {
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
  } catch {
    return [];
  }
}

export async function getSocialPosts(limit = 20) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("social_posts")
      .select("*, next_level_tracking(person_name, current_org, current_role)")
      .order("curated_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getFeaturedAlumni(limit = 5) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("next_level_tracking")
      .select("*, schools:high_school_id(name, slug)")
      .eq("featured", true)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAlumniCounts() {
  try {
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
  } catch {
    return { nfl: 0, nba: 0, mlb: 0, college: 0, coaching: 0, total: 0 };
  }
}

// ============================================================================
// RECRUITING
// ============================================================================

export async function getRecruits(filters?: { sportId?: string; classYear?: number; status?: string }, limit = 50) {
  try {
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
  } catch {
    return [];
  }
}

export async function getRecruitsByClass(classYear: number, limit = 50) {
  return getRecruits({ classYear }, limit);
}

export async function getRecentCommitments(limit = 10) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("recruiting_profiles")
      .select("*, players(name, slug, schools:schools!players_primary_school_id_fkey(name, slug)), sports(name)")
      .eq("status", "committed")
      .not("committed_date", "is", null)
      .order("committed_date", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getTeamsWithRecords(sportId: string) {
  try {
    const supabase = await createClient();
    // Get all schools that have team_seasons for this sport
    const { data: teamSeasons } = await supabase
      .from("team_seasons")
      .select("school_id, wins, losses, ties, schools(id, name, slug, city, state, league_id, leagues(name, short_name)), seasons(year_start)")
      .eq("sport_id", sportId);

    if (!teamSeasons || teamSeasons.length === 0) return [];

    // Aggregate by school
    const schoolMap = new Map<number, {
      school: any;
      league: string;
      totalWins: number;
      totalLosses: number;
      totalTies: number;
      seasonCount: number;
      championships: number;
    }>();

    for (const ts of teamSeasons) {
      const schoolId = ts.school_id;
      if (!schoolMap.has(schoolId)) {
        schoolMap.set(schoolId, {
          school: (ts as any).schools,
          league: (ts as any).schools?.leagues?.name || "Independent",
          totalWins: 0,
          totalLosses: 0,
          totalTies: 0,
          seasonCount: 0,
          championships: 0,
        });
      }
      const entry = schoolMap.get(schoolId)!;
      entry.totalWins += ts.wins || 0;
      entry.totalLosses += ts.losses || 0;
      entry.totalTies += ts.ties || 0;
      entry.seasonCount += 1;
    }

    // Get championship counts per school for this sport
    const { data: champs } = await supabase
      .from("championships")
      .select("school_id")
      .eq("sport_id", sportId);

    if (champs) {
      for (const c of champs) {
        const entry = schoolMap.get(c.school_id);
        if (entry) entry.championships += 1;
      }
    }

    // Convert to array and group by league
    const schools = Array.from(schoolMap.values())
      .sort((a, b) => b.totalWins - a.totalWins);

    return schools;
  } catch {
    return [];
  }
}
