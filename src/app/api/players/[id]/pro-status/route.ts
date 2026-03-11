import { createClient } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const playerId = parseInt(id, 10);

    if (isNaN(playerId)) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data } = await supabase
      .from("next_level_tracking")
      .select(
        "id, person_name, current_level, pro_team, pro_league, draft_info, college, college_sport"
      )
      .eq("player_id", playerId)
      .single();

    if (!data) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      id: data.id,
      personName: data.person_name,
      currentLevel: data.current_level,
      proTeam: data.pro_team,
      proLeague: data.pro_league,
      draftInfo: data.draft_info,
      college: data.college,
      collegeSport: data.college_sport,
    });
  } catch (error) {
    console.error("Error fetching player pro status:", error);
    return NextResponse.json(
      { error: "Failed to fetch pro status" },
      { status: 500 }
    );
  }
}
