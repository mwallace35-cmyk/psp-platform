import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const sport = request.nextUrl.searchParams.get("sport") || "football";

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const supabase = await createClient();

    // Search players by name using trigram similarity
    const { data: players } = await supabase
      .from("players")
      .select("id, name, slug, primary_school_id, schools:schools!players_primary_school_id_fkey(name)")
      .is("deleted_at", null)
      .ilike("name", `%${q}%`)
      .limit(20);

    if (!players || players.length === 0) {
      return NextResponse.json([]);
    }

    // Filter to players who have stats in the requested sport
    const playerIds = players.map((p: any) => p.id);
    const table = sport === "basketball" ? "basketball_player_seasons" : "football_player_seasons";

    const { data: statRows } = await supabase
      .from(table)
      .select("player_id")
      .in("player_id", playerIds);

    const playerIdsWithStats = new Set((statRows || []).map((r: any) => r.player_id));

    const results = players
      .filter((p: any) => playerIdsWithStats.has(p.id))
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        school: (p.schools as any)?.name || "Unknown",
      }))
      .slice(0, 10);

    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
