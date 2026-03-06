import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidSport } from "@/lib/sports";

type EmbedType = "leaderboard" | "school" | "player" | "stat-card";

const STAT_TABLE_MAP: Record<
  string,
  { table: string; column: string; sport: string }
> = {
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

function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type") as EmbedType | null;
    const sport = searchParams.get("sport");
    const slug = searchParams.get("slug");
    const stat = searchParams.get("stat");
    const limitStr = searchParams.get("limit");
    const limit = limitStr ? Math.min(parseInt(limitStr, 10) || 10, 100) : 10;

    // Validate type
    if (!type || !["leaderboard", "school", "player", "stat-card"].includes(type)) {
      return addCorsHeaders(
        NextResponse.json(
          { error: "Invalid type. Must be: leaderboard, school, player, or stat-card" },
          { status: 400 }
        )
      );
    }

    const supabase = await createClient();

    // Leaderboard embed
    if (type === "leaderboard") {
      if (!stat || !STAT_TABLE_MAP[stat]) {
        return addCorsHeaders(
          NextResponse.json(
            { error: "Invalid stat. Available stats: " + Object.keys(STAT_TABLE_MAP).join(", ") },
            { status: 400 }
          )
        );
      }

      const mapping = STAT_TABLE_MAP[stat];
      const ascending = stat === "era";

      const { data } = await supabase
        .from(mapping.table)
        .select("*, players(id, name, slug), schools(name, slug), seasons(label)")
        .not(mapping.column, "is", null)
        .gt(mapping.column, 0)
        .order(mapping.column, { ascending })
        .limit(limit);

      const leaderboard = (data ?? []).map((row: any, i: number) => ({
        rank: i + 1,
        value: row[mapping.column],
        player: row.players,
        school: row.schools,
        season: row.seasons,
        stat,
      }));

      return addCorsHeaders(
        NextResponse.json({
          type: "leaderboard",
          stat,
          sport: mapping.sport,
          limit,
          data: leaderboard,
        })
      );
    }

    // School embed
    if (type === "school") {
      if (!slug) {
        return addCorsHeaders(
          NextResponse.json({ error: "slug parameter required" }, { status: 400 })
        );
      }

      const { data: schoolData } = await supabase
        .from("schools")
        .select("id, name, slug, city, mascot, logo_url")
        .eq("slug", slug)
        .is("deleted_at", null)
        .single();

      if (!schoolData) {
        return addCorsHeaders(
          NextResponse.json({ error: "School not found" }, { status: 404 })
        );
      }

      // Get team seasons for the sport (if specified)
      let teamSeasons: any[] = [];
      if (sport && isValidSport(sport)) {
        const { data } = await supabase
          .from("team_seasons")
          .select("wins, losses, ties, sport_id")
          .eq("school_id", schoolData.id)
          .eq("sport_id", sport)
          .order("created_at", { ascending: false })
          .limit(1);
        teamSeasons = data ?? [];
      }

      // Get championships
      const { count: champCount } = await supabase
        .from("championships")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolData.id)
        .is("deleted_at", null);

      const record = teamSeasons[0]
        ? {
            wins: teamSeasons[0].wins,
            losses: teamSeasons[0].losses,
            ties: teamSeasons[0].ties,
          }
        : null;

      return addCorsHeaders(
        NextResponse.json({
          type: "school",
          data: {
            id: schoolData.id,
            name: schoolData.name,
            slug: schoolData.slug,
            city: schoolData.city,
            mascot: schoolData.mascot,
            logoUrl: schoolData.logo_url,
            record,
            championships: champCount ?? 0,
            sport: sport && isValidSport(sport) ? sport : null,
          },
        })
      );
    }

    // Player embed
    if (type === "player") {
      if (!slug) {
        return addCorsHeaders(
          NextResponse.json({ error: "slug parameter required" }, { status: 400 })
        );
      }

      const { data: playerData } = await supabase
        .from("players")
        .select("id, name, slug, primary_school_id, schools:schools!players_primary_school_id_fkey(name, slug)")
        .eq("slug", slug)
        .is("deleted_at", null)
        .single();

      if (!playerData) {
        return addCorsHeaders(
          NextResponse.json({ error: "Player not found" }, { status: 404 })
        );
      }

      // Get stats for the player (if sport specified)
      let stats: any[] | null = null;
      if (sport && isValidSport(sport)) {
        const tables: Record<string, string> = {
          football: "football_player_seasons",
          basketball: "basketball_player_seasons",
          baseball: "baseball_player_seasons",
        };
        const table = tables[sport];

        if (table) {
          const { data } = await supabase
            .from(table)
            .select("*")
            .eq("player_id", playerData.id)
            .order("created_at", { ascending: false })
            .limit(5);

          if (data && data.length > 0) {
            stats = data;
          }
        }
      }

      return addCorsHeaders(
        NextResponse.json({
          type: "player",
          data: {
            id: playerData.id,
            name: playerData.name,
            slug: playerData.slug,
            school: playerData.schools,
            stats,
            sport: sport && isValidSport(sport) ? sport : null,
          },
        })
      );
    }

    // Stat card embed (aggregated counts)
    if (type === "stat-card") {
      const [schoolsRes, playersRes, champRes] = await Promise.all([
        supabase
          .from("schools")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null)
          .not("league_id", "is", null),
        supabase
          .from("players")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null),
        supabase
          .from("championships")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null),
      ]);

      return addCorsHeaders(
        NextResponse.json({
          type: "stat-card",
          data: {
            schools: schoolsRes.count ?? 0,
            players: playersRes.count ?? 0,
            championships: champRes.count ?? 0,
          },
        })
      );
    }

    return addCorsHeaders(
      NextResponse.json({ error: "Unknown error" }, { status: 500 })
    );
  } catch (error) {
    console.error("[embed/route] Error:", error);
    return addCorsHeaders(
      NextResponse.json(
        { error: "Failed to generate embed data" },
        { status: 500 }
      )
    );
  }
}
