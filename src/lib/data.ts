import { createClient } from "@/lib/supabase/server";

// Re-export constants from sports.ts (for server components that import from data.ts)
export { VALID_SPORTS, SPORT_META, isValidSport } from "@/lib/sports";
export type { SportId } from "@/lib/sports";

export async function getSportOverview(sportId: string) {
  try {
    const supabase = await createClient();
    const [schoolsRes, playersRes, seasonsRes, champsRes] = await Promise.all([
      supabase.from("team_seasons").select("school_id", { count: "exact", head: true }).eq("sport_id", sportId),
      supabase.from("football_player_seasons").select("player_id", { count: "exact", head: true }),
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
      .order("seasons(year_start)", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getSchoolChampionships(schoolId: number, sportId?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("championships")
      .select("*, seasons(year_start, year_end, label), leagues(name), schools!championships_opponent_id_fkey(name)")
      .eq("school_id", schoolId);
    if (sportId) query = query.eq("sport_id", sportId);
    const { data } = await query.order("seasons(year_start)", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPlayerBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("players")
      .select("*, schools(name, slug)")
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
      .select("*, seasons(year_start, year_end, label), schools(name, slug)")
      .eq("player_id", playerId)
      .order("seasons(year_start)", { ascending: true });
    return data ?? [];
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
      .order("seasons(year_start)", { ascending: true });
    return data ?? [];
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
      .order("seasons(year_start)", { ascending: true });
    return data ?? [];
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
      .order("seasons(year_start)", { ascending: false });
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
      .select("*, schools(name, slug), seasons(year_start, year_end, label), leagues(name)")
      .eq("sport_id", sportId)
      .order("seasons(year_start)", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getChampionshipsBySport(sportId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("championships")
      .select(
        `*, schools(name, slug), seasons(year_start, year_end, label), leagues(name), 
         schools!championships_opponent_id_fkey(name)`
      )
      .eq("sport_id", sportId)
      .order("seasons(year_start)", { ascending: false });
    return data ?? [];
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
      .select("*, players(name, slug), schools(name, slug), seasons(label, year_start)")
      .order(orderCol, { ascending: false })
      .limit(limit);
    return data ?? [];
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
      .select("*, players(name, slug), schools(name, slug), seasons(label, year_start)")
      .order(orderCol, { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function searchAll(query: string, limit = 30) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("search_index")
      .select("*")
      .ilike("search_text", `%${query}%`)
      .order("popularity", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    // Fallback: search schools and players directly
    try {
      const supabase = await createClient();
      const [schoolsRes, playersRes] = await Promise.all([
        supabase
          .from("schools")
          .select("id, slug, name, city")
          .ilike("name", `%${query}%`)
          .is("deleted_at", null)
          .limit(10),
        supabase
          .from("players")
          .select("id, slug, name, college, pro_team")
          .ilike("name", `%${query}%`)
          .is("deleted_at", null)
          .limit(10),
      ]);
      return [
        ...(schoolsRes.data ?? []).map((s: any) => ({
          entity_type: "school",
          entity_id: s.id,
          display_name: s.name,
          context: s.city,
          url_path: `/football/schools/${s.slug}`,
        })),
        ...(playersRes.data ?? []).map((p: any) => ({
          entity_type: "player",
          entity_id: p.id,
          display_name: p.name,
          context: p.college || p.pro_team || "",
          url_path: `/football/players/${p.slug}`,
        })),
      ];
    } catch {
      return [];
    }
  }
}
