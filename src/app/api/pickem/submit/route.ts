import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PickemSchema = z.object({
  week_id: z.number().positive(),
  picks: z.array(
    z.object({
      game_id: z.number().positive(),
      picked_school_id: z.number().positive(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const validated = PickemSchema.parse(body);

    // Verify week exists and is open
    const { data: week, error: weekError } = await supabase
      .from("pickem_weeks")
      .select("id, is_open")
      .eq("id", validated.week_id)
      .single();

    if (weekError || !week || !week.is_open) {
      return NextResponse.json(
        { error: "Week not available for voting" },
        { status: 400 }
      );
    }

    // Insert or update picks
    const picksToInsert = validated.picks.map((pick) => ({
      week_id: validated.week_id,
      game_id: pick.game_id,
      user_id: user.id,
      picked_school_id: pick.picked_school_id,
    }));

    const { data: picks, error: insertError } = await supabase
      .from("pickem_picks")
      .upsert(picksToInsert, {
        onConflict: "week_id,game_id,user_id",
      })
      .select();

    if (insertError) throw insertError;

    return NextResponse.json(
      { picks, message: "Picks submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: (error as any).errors },
        { status: 400 }
      );
    }

    console.error("Error submitting picks:", error);
    return NextResponse.json(
      { error: "Failed to submit picks" },
      { status: 500 }
    );
  }
}
