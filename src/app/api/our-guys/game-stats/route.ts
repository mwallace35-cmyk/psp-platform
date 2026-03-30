import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/data/common";

export async function GET(request: NextRequest) {
  const gameId = request.nextUrl.searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "gameId required" }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    // Fetch performances for this game with NLT data
    const { data: performances, error } = await (supabase as any)
      .from("nlt_game_performances")
      .select(`
        player_name,
        team_name,
        sport,
        stats,
        high_school,
        recap_tier,
        performance_score,
        nlt_id
      `)
      .eq("game_id", parseInt(gameId))
      .order("performance_score", { ascending: false });

    if (error) {
      console.error("[game-stats] Error:", error);
      return NextResponse.json({ players: [] });
    }

    // Also fetch social links from next_level_tracking
    const nltIds = (performances || []).map((p: any) => p.nlt_id).filter(Boolean);
    let socialMap: Record<number, { twitter: string | null; instagram: string | null }> = {};

    if (nltIds.length > 0) {
      const { data: nltData } = await (supabase as any)
        .from("next_level_tracking")
        .select("id, social_twitter, social_instagram")
        .in("id", nltIds);

      if (nltData) {
        for (const n of nltData) {
          socialMap[n.id] = { twitter: n.social_twitter, instagram: n.social_instagram };
        }
      }
    }

    const players = (performances || []).map((p: any) => ({
      playerName: p.player_name,
      highSchool: p.high_school,
      stats: p.stats || {},
      socialTwitter: socialMap[p.nlt_id]?.twitter || null,
      socialInstagram: socialMap[p.nlt_id]?.instagram || null,
    }));

    return NextResponse.json({ players });
  } catch (error) {
    console.error("[game-stats] Unexpected error:", error);
    return NextResponse.json({ players: [] });
  }
}
