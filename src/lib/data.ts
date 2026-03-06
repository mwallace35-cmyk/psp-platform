import { createClient } from "@/lib/supabase/server";

// Re-export constants from sports.ts (for server components that import from data.ts)
export { VALID_SPORTS, SPORT_META, isValidSport } from "@/lib/sports";
export type { SportId } from "@/lib/sports";

// Deduplicate game records: same date + same two teams + same scores = same game
// Handles cases where the same game exists from both teams' schedule imports
function dedupeGames(games: any[]): any[] {
  const seen = new Set<string>();
  return games.filter((game: any) => {
    const idA = Math.min(game.home_school_id, game.away_school_id);
    const idB = Math.max(game.home_school_id, game.away_school_id);
    const scoreA = game.home_school_id === idA ? game.home_score : game.away_score;
    const scoreB = game.home_school_id === idA ? game.away_score : game.home_score;
    const key = `${game.game_date}|${idA}-${idB}|${scoreA}-${scoreB}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

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
        principal, athletic_director, athletic_director_email, phone, enrollment, school_type,
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

    // Get active sports per school (which sports they have team_seasons for)
    const { data: sportEntries } = await supabase
      .from("team_seasons")
      .select("school_id, sport_id")
      .in("school_id", schoolIds);

    const sportsBySchool = new Map<number, Set<string>>();
    (sportEntries ?? []).forEach((e: any) => {
      if (!sportsBySchool.has(e.school_id)) sportsBySchool.set(e.school_id, new Set());
      sportsBySchool.get(e.school_id)!.add(e.sport_id);
    });

    return schools.map((s: any) => ({
      ...s,
      championships_count: champCounts.get(s.id) ?? 0,
      active_sports: Array.from(sportsBySchool.get(s.id) ?? []),
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

export async function getSchoolPlayers(schoolId: number, sportId: string, limit = 20) {
  try {
    const supabase = await createClient();
    const STAT_TABLES: Record<string, string> = {
      football: "football_player_seasons",
      basketball: "basketball_player_seasons",
      baseball: "baseball_player_seasons",
    };
    const table = STAT_TABLES[sportId];
    if (!table) return [];

    const { data } = await supabase
      .from(table)
      .select("*, players!inner(id, name, slug, graduation_year, positions, college, pro_team), seasons(label, year_start)")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false })
      .limit(200);

    if (!data) return [];

    // Group by player, aggregate stats
    const playerMap = new Map<number, any>();
    for (const row of data as any[]) {
      const pid = row.players?.id;
      if (!pid) continue;
      if (!playerMap.has(pid)) {
        playerMap.set(pid, {
          ...row.players,
          seasons_count: 0,
          years: [] as string[],
          total_stats: {} as any,
        });
      }
      const p = playerMap.get(pid)!;
      p.seasons_count++;
      if (row.seasons?.label) p.years.push(row.seasons.label);

      // Accumulate key stats
      if (sportId === "football") {
        p.total_stats.rush_yards = (p.total_stats.rush_yards || 0) + (row.rush_yards || 0);
        p.total_stats.pass_yards = (p.total_stats.pass_yards || 0) + (row.pass_yards || 0);
        p.total_stats.rec_yards = (p.total_stats.rec_yards || 0) + (row.rec_yards || 0);
        p.total_stats.total_td = (p.total_stats.total_td || 0) + (row.total_td || 0);
      } else if (sportId === "basketball") {
        p.total_stats.points = (p.total_stats.points || 0) + (row.points || 0);
        p.total_stats.games = (p.total_stats.games || 0) + (row.games_played || 0);
        p.total_stats.ppg = p.total_stats.games > 0 ? +(p.total_stats.points / p.total_stats.games).toFixed(1) : 0;
      }
    }

    // Sort by most impressive stat
    const players = Array.from(playerMap.values());
    if (sportId === "football") {
      players.sort((a, b) => {
        const aTotal = (a.total_stats.rush_yards || 0) + (a.total_stats.pass_yards || 0) + (a.total_stats.rec_yards || 0);
        const bTotal = (b.total_stats.rush_yards || 0) + (b.total_stats.pass_yards || 0) + (b.total_stats.rec_yards || 0);
        return bTotal - aTotal;
      });
    } else if (sportId === "basketball") {
      players.sort((a, b) => (b.total_stats.points || 0) - (a.total_stats.points || 0));
    }

    return players.slice(0, limit);
  } catch {
    return [];
  }
}

export async function getSchoolAwards(schoolId: number, sportId?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("awards")
      .select("*, players(name, slug), seasons(label, year_start)")
      .eq("school_id", schoolId);
    if (sportId) query = query.eq("sport_id", sportId);
    const { data } = await query.order("created_at", { ascending: false });
    return (data ?? []).sort((a: any, b: any) => (b.seasons?.year_start ?? 0) - (a.seasons?.year_start ?? 0));
  } catch {
    return [];
  }
}

export async function getSchoolRecentGames(schoolId: number, sportId: string, limit = 10) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("games")
      .select("*, seasons(label), home_school:schools!games_home_school_id_fkey(id, name, slug), away_school:schools!games_away_school_id_fkey(id, name, slug)")
      .eq("sport_id", sportId)
      .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
      .order("game_date", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

// ─── Multi-sport school data (for /schools/[slug] page) ───

export async function getSchoolAllTeamSeasons(schoolId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("team_seasons")
      .select("*, seasons(year_start, year_end, label), coaches(name, slug), sports:sport_id(name, slug)")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false });
    return (data ?? []).sort((a: any, b: any) => {
      const aYear = a.seasons?.year_start ?? 0;
      const bYear = b.seasons?.year_start ?? 0;
      return bYear - aYear;
    });
  } catch {
    return [];
  }
}

export async function getSchoolAllRecentGames(schoolId: number, limit = 15) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("games")
      .select("*, seasons(label), sports:sport_id(name, slug), home_school:schools!games_home_school_id_fkey(id, name, slug), away_school:schools!games_away_school_id_fkey(id, name, slug)")
      .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
      .order("game_date", { ascending: false })
      .limit(limit * 2);
    return dedupeGames(data ?? []).slice(0, limit);
  } catch {
    return [];
  }
}

export async function getSchoolAllPlayers(schoolId: number, limit = 30) {
  const STAT_TABLES = ["football_player_seasons", "basketball_player_seasons", "baseball_player_seasons"] as const;
  const SPORT_MAP: Record<string, string> = {
    football_player_seasons: "football",
    basketball_player_seasons: "basketball",
    baseball_player_seasons: "baseball",
  };
  const allPlayers: any[] = [];

  for (const table of STAT_TABLES) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from(table)
        .select("*, players!inner(id, name, slug, graduation_year, positions, college, pro_team), seasons(label, year_start)")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false })
        .limit(200);
      if (!data) continue;

      const sportId = SPORT_MAP[table];
      const playerMap = new Map<number, any>();
      for (const row of data as any[]) {
        const pid = row.players?.id;
        if (!pid) continue;
        if (!playerMap.has(pid)) {
          playerMap.set(pid, { ...row.players, sport: sportId, seasons_count: 0, years: [] as string[], total_stats: {} as any });
        }
        const p = playerMap.get(pid)!;
        p.seasons_count++;
        if (row.seasons?.label) p.years.push(row.seasons.label);
        if (sportId === "football") {
          p.total_stats.rush_yards = (p.total_stats.rush_yards || 0) + (row.rush_yards || 0);
          p.total_stats.pass_yards = (p.total_stats.pass_yards || 0) + (row.pass_yards || 0);
          p.total_stats.rec_yards = (p.total_stats.rec_yards || 0) + (row.rec_yards || 0);
          p.total_stats.total_td = (p.total_stats.total_td || 0) + (row.total_td || 0);
        } else if (sportId === "basketball") {
          p.total_stats.points = (p.total_stats.points || 0) + (row.points || 0);
          p.total_stats.games = (p.total_stats.games || 0) + (row.games_played || 0);
          p.total_stats.ppg = p.total_stats.games > 0 ? +(p.total_stats.points / p.total_stats.games).toFixed(1) : 0;
        }
      }
      allPlayers.push(...Array.from(playerMap.values()));
    } catch { /* skip sport */ }
  }

  // Sort by total yards/points
  allPlayers.sort((a, b) => {
    const aVal = (a.total_stats.rush_yards || 0) + (a.total_stats.pass_yards || 0) + (a.total_stats.rec_yards || 0) + (a.total_stats.points || 0);
    const bVal = (b.total_stats.rush_yards || 0) + (b.total_stats.pass_yards || 0) + (b.total_stats.rec_yards || 0) + (b.total_stats.points || 0);
    return bVal - aVal;
  });
  return allPlayers.slice(0, limit);
}

export async function getPlayerBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("players")
      .select("*, schools:schools!players_primary_school_id_fkey(name, slug)")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();
    if (error) {
      console.error("[getPlayerBySlug] Supabase error for slug:", slug, error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("[getPlayerBySlug] Unexpected error for slug:", slug, err);
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

    // Detect sport for each player by checking stat tables
    const playerIds = (playersRes.data ?? []).map((p) => p.id);
    const sportMap = new Map<number, string>();
    if (playerIds.length > 0) {
      const [fbRes, bbRes, bsbRes] = await Promise.all([
        supabase.from("football_player_seasons").select("player_id").in("player_id", playerIds),
        supabase.from("basketball_player_seasons").select("player_id").in("player_id", playerIds),
        supabase.from("baseball_player_seasons").select("player_id").in("player_id", playerIds),
      ]);
      for (const r of fbRes.data ?? []) sportMap.set(r.player_id, "football");
      for (const r of bbRes.data ?? []) if (!sportMap.has(r.player_id)) sportMap.set(r.player_id, "basketball");
      for (const r of bsbRes.data ?? []) if (!sportMap.has(r.player_id)) sportMap.set(r.player_id, "baseball");
    }

    const results: any[] = [];

    // Schools
    for (const s of schoolsRes.data ?? []) {
      results.push({
        entity_type: "school",
        entity_id: s.id,
        display_name: s.name,
        context: [s.city, s.state].filter(Boolean).join(", "),
        url_path: `/schools/${s.slug}`,
      });
    }

    // Players — use detected sport for URL
    for (const p of playersRes.data ?? []) {
      const school = (p as any).schools;
      const sport = sportMap.get(p.id) || "football";
      results.push({
        entity_type: "player",
        entity_id: p.id,
        display_name: p.name,
        sport,
        context: [school?.name, p.college, p.pro_team].filter(Boolean).join(" · "),
        url_path: `/${sport}/players/${p.slug}`,
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

// Get database-wide counts for search page stats
export async function getDatabaseStats() {
  try {
    const supabase = await createClient();
    const [schools, players, teamSeasons, championships, games] = await Promise.all([
      supabase.from("schools").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("players").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("team_seasons").select("id", { count: "exact", head: true }),
      supabase.from("championships").select("id", { count: "exact", head: true }),
      supabase.from("games").select("id", { count: "exact", head: true }),
    ]);
    return {
      schools: schools.count ?? 0,
      players: players.count ?? 0,
      teamSeasons: teamSeasons.count ?? 0,
      championships: championships.count ?? 0,
      games: games.count ?? 0,
    };
  } catch {
    return { schools: 0, players: 0, teamSeasons: 0, championships: 0, games: 0 };
  }
}

// Get top schools by championship count
export async function getTopSchoolsByChampionships(limit = 8) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("championships")
      .select("school_id, schools(id, slug, name)")
      .is("schools.deleted_at", null);
    if (!data) return [];
    const counts = new Map<string, { slug: string; name: string; count: number }>();
    for (const row of data) {
      const school = (row as any).schools;
      if (!school) continue;
      const key = school.slug;
      if (!counts.has(key)) counts.set(key, { slug: school.slug, name: school.name, count: 0 });
      counts.get(key)!.count++;
    }
    return Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, limit);
  } catch {
    return [];
  }
}

// ============================================================================
// SCHOOL OVERHAUL FUNCTIONS
// ============================================================================

export async function getSchoolCoaches(schoolId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("coaching_stints")
      .select("*, coaches!inner(id, name, slug, photo_url, is_active), sports(name, id)")
      .eq("school_id", schoolId)
      .order("start_year", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getActiveSportsBySchool(schoolId: number) {
  try {
    const supabase = await createClient();
    // Get distinct sport_ids with the most recent season label
    const { data } = await supabase
      .from("team_seasons")
      .select("sport_id, wins, losses, ties, coach_id, seasons(label, year_start), coaches:coach_id(name, slug)")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false });
    if (!data) return [];

    // Group by sport, keep only the most recent season per sport
    const sportMap = new Map<string, any>();
    for (const ts of data as any[]) {
      if (!sportMap.has(ts.sport_id)) {
        sportMap.set(ts.sport_id, ts);
      }
    }
    return Array.from(sportMap.values());
  } catch {
    return [];
  }
}

const CURRENT_SEASON_LABEL = "2024-25";

export async function getCurrentTeamSeason(schoolId: number, sportSlug: string) {
  try {
    const supabase = await createClient();
    // Get the current season ID
    const { data: seasonData } = await supabase
      .from("seasons")
      .select("id")
      .eq("label", CURRENT_SEASON_LABEL)
      .single();
    if (!seasonData) return null;

    const { data } = await supabase
      .from("team_seasons")
      .select("*, seasons(id, year_start, year_end, label), coaches:coach_id(id, name, slug), schools(id, name, slug, city, state, league_id, mascot, colors, logo_url)")
      .eq("school_id", schoolId)
      .eq("sport_id", sportSlug)
      .eq("season_id", seasonData.id)
      .single();
    return data;
  } catch {
    return null;
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

export async function searchArticles(query: string, limit = 20) {
  try {
    const supabase = await createClient();
    const pattern = `%${query}%`;
    const { data } = await supabase
      .from("articles")
      .select("id, slug, title, excerpt, sport_id, published_at, source_file")
      .eq("status", "published")
      .is("deleted_at", null)
      .or(`title.ilike.${pattern},excerpt.ilike.${pattern}`)
      .order("published_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getEntitiesForArticle(articleId: number) {
  try {
    const supabase = await createClient();
    const { data: mentions } = await supabase
      .from("article_mentions")
      .select("entity_type, entity_id")
      .eq("article_id", articleId);
    if (!mentions?.length) return { schools: [], players: [] };

    const schoolIds = mentions.filter(m => m.entity_type === "school").map(m => m.entity_id);
    const playerIds = mentions.filter(m => m.entity_type === "player").map(m => m.entity_id);

    const [schoolsRes, playersRes] = await Promise.all([
      schoolIds.length > 0
        ? supabase.from("schools").select("id, name, slug, city, state").in("id", schoolIds).is("deleted_at", null)
        : { data: [] },
      playerIds.length > 0
        ? supabase.from("players").select("id, name, slug, sport_id").in("id", playerIds).is("deleted_at", null)
        : { data: [] },
    ]);

    return {
      schools: schoolsRes.data ?? [],
      players: playersRes.data ?? [],
    };
  } catch {
    return { schools: [], players: [] };
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

    return dedupeGames(data ?? []);
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
      .select("*, players(id, name, slug, graduation_year, positions, college, pro_team)")
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

export async function getRecentGamesBySport(sportId: string, limit = 20) {
  try {
    const supabase = await createClient();
    // Fetch extra to account for dedup removing duplicates
    const { data } = await supabase
      .from("games")
      .select("*, seasons(label), home_school:schools!games_home_school_id_fkey(id, name, slug), away_school:schools!games_away_school_id_fkey(id, name, slug)")
      .eq("sport_id", sportId)
      .order("game_date", { ascending: false })
      .limit(limit * 2);
    return dedupeGames(data ?? []).slice(0, limit);
  } catch {
    return [];
  }
}

export async function getRecentGamesAll(limit = 10) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("games")
      .select("id, sport_id, home_school_id, away_school_id, home_score, away_score, game_date, game_type, seasons(label), home_school:schools!games_home_school_id_fkey(id, name, short_name, slug), away_school:schools!games_away_school_id_fkey(id, name, short_name, slug)")
      .not("home_score", "is", null)
      .not("away_score", "is", null)
      .order("game_date", { ascending: false, nullsFirst: false })
      .limit(limit * 2);

    if (error) console.error("[getRecentGamesAll] Supabase error:", error.message);

    const games = data ?? [];

    // If FK joins failed (school objects null but IDs exist), fetch school names separately
    const missingSchoolIds = new Set<number>();
    for (const g of games) {
      if (!(g as any).home_school && (g as any).home_school_id) missingSchoolIds.add((g as any).home_school_id);
      if (!(g as any).away_school && (g as any).away_school_id) missingSchoolIds.add((g as any).away_school_id);
    }

    if (missingSchoolIds.size > 0) {
      const { data: schools } = await supabase
        .from("schools")
        .select("id, name, short_name, slug")
        .in("id", Array.from(missingSchoolIds));
      const schoolMap = new Map((schools ?? []).map((s: any) => [s.id, s]));
      for (const g of games) {
        if (!(g as any).home_school && (g as any).home_school_id) (g as any).home_school = schoolMap.get((g as any).home_school_id) || null;
        if (!(g as any).away_school && (g as any).away_school_id) (g as any).away_school = schoolMap.get((g as any).away_school_id) || null;
      }
    }

    return dedupeGames(games).slice(0, limit);
  } catch (err) {
    console.error("[getRecentGamesAll] Unexpected error:", err);
    return [];
  }
}

export async function getSeasonsBySport(sportId: string) {
  try {
    const supabase = await createClient();
    // Query seasons that have games with scores for this sport
    // Use inner join via team_seasons which is smaller, or query games with pagination
    // Approach: get all seasons, then for each check if games exist (but that's N+1)
    // Better: use a raw SQL approach via RPC, or paginate games
    // Simplest reliable approach: query games in batches to get all season_ids
    const allSeasonIds = new Set<number>();
    let offset = 0;
    const batchSize = 1000;
    while (true) {
      const { data: batch } = await supabase
        .from("games")
        .select("season_id")
        .eq("sport_id", sportId)
        .not("home_score", "is", null)
        .not("away_score", "is", null)
        .range(offset, offset + batchSize - 1);
      if (!batch || batch.length === 0) break;
      for (const row of batch) {
        if (row.season_id) allSeasonIds.add(row.season_id);
      }
      if (batch.length < batchSize) break;
      offset += batchSize;
    }
    if (allSeasonIds.size === 0) return [];
    const { data: seasons } = await supabase
      .from("seasons")
      .select("id, label, year_start, year_end")
      .in("id", Array.from(allSeasonIds))
      .order("year_start", { ascending: false });
    return seasons ?? [];
  } catch {
    return [];
  }
}

export async function getGamesBySportAndSeason(sportId: string, seasonLabel?: string | null) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("games")
      .select(
        "id, sport_id, home_school_id, away_school_id, home_score, away_score, game_date, game_type, venue, playoff_round, season_id, seasons(id, label), home_school:schools!games_home_school_id_fkey(id, name, short_name, slug, city, mascot), away_school:schools!games_away_school_id_fkey(id, name, short_name, slug, city, mascot)"
      )
      .eq("sport_id", sportId)
      .not("home_score", "is", null)
      .not("away_score", "is", null)
      .order("game_date", { ascending: false, nullsFirst: false });

    if (seasonLabel) {
      // Look up season id first
      const { data: seasonData } = await supabase
        .from("seasons")
        .select("id")
        .eq("label", seasonLabel)
        .single();
      if (seasonData) {
        query = query.eq("season_id", seasonData.id);
      }
    }

    const { data, error } = await query.limit(500);
    if (error) console.error("[getGamesBySportAndSeason] Supabase error:", error.message);

    const games = data ?? [];

    // If FK joins failed (school objects null but IDs exist), fetch school names separately
    const missingSchoolIds = new Set<number>();
    for (const g of games) {
      if (!(g as any).home_school && (g as any).home_school_id) missingSchoolIds.add((g as any).home_school_id);
      if (!(g as any).away_school && (g as any).away_school_id) missingSchoolIds.add((g as any).away_school_id);
    }

    if (missingSchoolIds.size > 0) {
      const { data: schools } = await supabase
        .from("schools")
        .select("id, name, short_name, slug, city, mascot")
        .in("id", Array.from(missingSchoolIds));
      const schoolMap = new Map((schools ?? []).map((s: any) => [s.id, s]));
      for (const g of games) {
        if (!(g as any).home_school && (g as any).home_school_id) (g as any).home_school = schoolMap.get((g as any).home_school_id) || null;
        if (!(g as any).away_school && (g as any).away_school_id) (g as any).away_school = schoolMap.get((g as any).away_school_id) || null;
      }
    }

    return dedupeGames(games);
  } catch (err) {
    console.error("[getGamesBySportAndSeason] Unexpected error:", err);
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

// ============================================================================
// TEAM PAGE: LEAGUE RIVALS + TOP PROGRAMS
// ============================================================================

export async function getLeagueTeams(leagueId: number | null, sportId: string, excludeSchoolId?: number, limit = 8) {
  try {
    if (!leagueId) return [];
    const supabase = await createClient();
    const { data } = await supabase
      .from("schools")
      .select("id, name, slug, mascot, city, league_id, team_seasons!inner(wins, losses, ties, sport_id, season_id, seasons(label, year_start))")
      .eq("league_id", leagueId)
      .eq("team_seasons.sport_id", sportId)
      .is("deleted_at", null)
      .limit(limit + 1); // +1 to exclude self
    if (!data) return [];
    return data
      .filter((s: any) => s.id !== excludeSchoolId)
      .slice(0, limit)
      .map((s: any) => {
        // Get most recent team_season
        const ts = (s.team_seasons || []).sort((a: any, b: any) => (b.seasons?.year_start ?? 0) - (a.seasons?.year_start ?? 0));
        const latest = ts[0];
        return {
          id: s.id, name: s.name, slug: s.slug, mascot: s.mascot, city: s.city,
          latestRecord: latest ? `${latest.wins}-${latest.losses}${latest.ties ? `-${latest.ties}` : ""}` : null,
          latestSeason: latest?.seasons?.label || null,
        };
      });
  } catch {
    return [];
  }
}

export async function getTopProgramsBySport(sportId: string, excludeSchoolId?: number, limit = 6) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("championships")
      .select("school_id, schools(id, name, slug, mascot, city)")
      .eq("sport_id", sportId)
      .is("deleted_at", null);
    if (!data) return [];
    // Count championships per school
    const counts = new Map<number, { school: any; count: number }>();
    for (const c of data as any[]) {
      if (!c.schools || c.school_id === excludeSchoolId) continue;
      const existing = counts.get(c.school_id);
      if (existing) { existing.count++; }
      else { counts.set(c.school_id, { school: c.schools, count: 1 }); }
    }
    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(({ school, count }) => ({
        id: school.id, name: school.name, slug: school.slug,
        mascot: school.mascot, city: school.city, championships: count,
      }));
  } catch {
    return [];
  }
}

// ============================================================================
// SPRINT 1: GAME PAGE FUNCTIONS
// ============================================================================

export async function getGameById(gameId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("games")
      .select(`
        *,
        seasons(label, year_start, year_end),
        home_school:schools!games_home_school_id_fkey(id, slug, name, short_name, city, mascot, logo_url, leagues(name, short_name)),
        away_school:schools!games_away_school_id_fkey(id, slug, name, short_name, city, mascot, logo_url, leagues(name, short_name))
      `)
      .eq("id", gameId)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function getGameBoxScore(gameId: number, sportId: string) {
  try {
    const supabase = await createClient();

    if (sportId === "football") {
      const { data } = await supabase
        .from("football_game_stats")
        .select(`
          *,
          players(id, slug, name, positions, graduation_year),
          schools(id, slug, name, short_name)
        `)
        .eq("game_id", gameId)
        .order("points", { ascending: false });
      return data ?? [];
    }

    if (sportId === "basketball") {
      const { data } = await supabase
        .from("basketball_game_stats")
        .select(`
          *,
          players(id, slug, name, positions, graduation_year),
          schools(id, slug, name, short_name)
        `)
        .eq("game_id", gameId)
        .order("points", { ascending: false });
      return data ?? [];
    }

    return [];
  } catch {
    return [];
  }
}

export async function getRelatedGames(gameId: number, sportId: string, homeSchoolId: number, awaySchoolId: number, limit = 5) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("games")
      .select(`
        id, game_date, home_score, away_score, game_type,
        seasons(label),
        home_school:schools!games_home_school_id_fkey(id, slug, name, short_name),
        away_school:schools!games_away_school_id_fkey(id, slug, name, short_name)
      `)
      .eq("sport_id", sportId)
      .or(`and(home_school_id.eq.${homeSchoolId},away_school_id.eq.${awaySchoolId}),and(home_school_id.eq.${awaySchoolId},away_school_id.eq.${homeSchoolId})`)
      .neq("id", gameId)
      .order("game_date", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getGameArticle(gameId: number) {
  try {
    const supabase = await createClient();
    // Check article_mentions for articles linked to this game
    const { data } = await supabase
      .from("article_mentions")
      .select(`
        articles(id, slug, title, excerpt, published_at, featured_image_url)
      `)
      .eq("entity_type", "game")
      .eq("entity_id", gameId)
      .limit(1)
      .single();
    return data?.articles ?? null;
  } catch {
    return null;
  }
}

export async function getGamesWithBoxScores(sportId: string, limit = 50, offset = 0) {
  try {
    const supabase = await createClient();

    const statTable = sportId === "football" ? "football_game_stats" : sportId === "basketball" ? "basketball_game_stats" : null;
    if (!statTable) return [];

    // Get game IDs that have box score data
    const { data: statGameIds } = await supabase
      .from(statTable)
      .select("game_id")
      .limit(5000);

    if (!statGameIds?.length) return [];

    const uniqueGameIds = [...new Set(statGameIds.map((s: any) => s.game_id))];

    const { data } = await supabase
      .from("games")
      .select(`
        id, game_date, home_score, away_score, game_type, playoff_round,
        seasons(label),
        home_school:schools!games_home_school_id_fkey(id, slug, name, short_name),
        away_school:schools!games_away_school_id_fkey(id, slug, name, short_name)
      `)
      .eq("sport_id", sportId)
      .in("id", uniqueGameIds.slice(offset, offset + limit))
      .order("game_date", { ascending: false });

    return data ?? [];
  } catch {
    return [];
  }
}

// ============================================================================
// SPRINT 1: RIVALRY FUNCTIONS
// ============================================================================

export async function getRivalryBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("rivalries")
      .select(`
        *,
        school_a:schools!rivalries_school_a_id_fkey(id, slug, name, short_name, city, mascot, logo_url, leagues(name, short_name)),
        school_b:schools!rivalries_school_b_id_fkey(id, slug, name, short_name, city, mascot, logo_url, leagues(name, short_name))
      `)
      .eq("slug", slug)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function getRivalryRecord(rivalryId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("rivalry_records")
      .select("*")
      .eq("rivalry_id", rivalryId)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function getRivalryGames(schoolAId: number, schoolBId: number, sportId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("games")
      .select(`
        id, game_date, home_score, away_score, game_type, playoff_round, venue,
        seasons(label),
        home_school:schools!games_home_school_id_fkey(id, slug, name, short_name),
        away_school:schools!games_away_school_id_fkey(id, slug, name, short_name)
      `)
      .eq("sport_id", sportId)
      .or(`and(home_school_id.eq.${schoolAId},away_school_id.eq.${schoolBId}),and(home_school_id.eq.${schoolBId},away_school_id.eq.${schoolAId})`)
      .order("game_date", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getRivalryNotes(rivalryId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("rivalry_notes")
      .select("*")
      .eq("rivalry_id", rivalryId)
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAllRivalries(sportId?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("rivalries")
      .select(`
        id, slug, display_name, subtitle, sport_id, featured,
        school_a:schools!rivalries_school_a_id_fkey(id, slug, name, short_name, logo_url),
        school_b:schools!rivalries_school_b_id_fkey(id, slug, name, short_name, logo_url)
      `)
      .order("featured", { ascending: false })
      .order("display_name");

    if (sportId) query = query.eq("sport_id", sportId);

    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getRivalryTopPlayers(schoolId: number, sportId: string, limit = 5) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("player_career_summary")
      .select("*")
      .eq("school_id", schoolId)
      .eq("sport_id", sportId)
      .order("career_games", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getRivalryChampionships(schoolId: number, sportId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("championships")
      .select("*, seasons(label)")
      .eq("school_id", schoolId)
      .eq("sport_id", sportId)
      .order("year", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

// ============================================================================
// SPRINT 1: SERVER-SIDE SEARCH
// ============================================================================

export async function searchEntitiesServer(query: string, sport?: string, entityType?: string, limit = 30) {
  // Primary: direct table search (always works, no dependency on search_index population)
  const directResults = await searchAll(query, limit);
  if (directResults.length > 0) return directResults;

  // Fallback: try RPC if direct search returned nothing (search_index may have extra data)
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("search_entities", {
      query,
      p_sport: sport || null,
      p_entity_type: entityType || null,
      p_limit: limit,
    });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getTopSearchEntities(limit = 500) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("search_index")
      .select("entity_type, entity_id, sport_id, display_name, context, url_path, popularity, popularity_score")
      .order("popularity_score", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

// ============================================================================
// SPRINT 1: TEAM ALL-TIME RECORDS
// ============================================================================

export async function getTeamAlltimeRecords(sportId: string, limit = 100) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("team_alltime_records")
      .select("*")
      .eq("sport_id", sportId)
      .order("win_pct", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getSchoolAlltimeRecord(schoolId: number, sportId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("team_alltime_records")
      .select("*")
      .eq("school_id", schoolId)
      .eq("sport_id", sportId)
      .single();
    return data;
  } catch {
    return null;
  }
}

// ============================================================================
// EXISTING FUNCTION (unchanged)
// ============================================================================

export async function getAllTeamSeasonData(schoolId: number, sportId: string) {
  try {
    // Fetch all team_seasons with full details
    const teamSeasons = await getSchoolTeamSeasons(schoolId, sportId);
    if (!teamSeasons.length) return {};

    // For each season, fetch games + roster + awards + championships in parallel
    const result: Record<string, any> = {};
    await Promise.all(
      teamSeasons.map(async (ts: any) => {
        const seasonId = ts.season_id;
        const label = ts.seasons?.label;
        if (!label || !seasonId) return;

        const [games, roster, awards, champs] = await Promise.all([
          getGamesByTeamSeason(schoolId, sportId, seasonId),
          getTeamRosterBySeason(schoolId, sportId, seasonId),
          getSchoolAwards(schoolId, sportId),
          getSchoolChampionships(schoolId, sportId),
        ]);

        // Filter awards/champs to this specific season
        const seasonAwards = awards.filter((a: any) => a.seasons?.label === label);
        const seasonChamps = champs.filter((c: any) => c.seasons?.label === label);

        result[label] = {
          teamSeason: ts,
          games,
          roster,
          awards: seasonAwards,
          championships: seasonChamps,
        };
      })
    );
    return result;
  } catch {
    return {};
  }
}
