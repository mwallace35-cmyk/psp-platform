import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_PERIODS = ["Q1", "Q2", "Q3", "Q4", "H1", "H2", "OT", "F"];

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const {
      game_id,
      home_score,
      away_score,
      period,
    }: {
      game_id?: number;
      home_score?: number;
      away_score?: number;
      period?: string;
    } = await request.json();

    // Validation
    if (!game_id || typeof home_score !== "number" || typeof away_score !== "number" || !period) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (home_score < 0 || away_score < 0 || home_score > 200 || away_score > 200) {
      return NextResponse.json(
        { error: "Scores must be between 0 and 200" },
        { status: 400 }
      );
    }

    if (!VALID_PERIODS.includes(period)) {
      return NextResponse.json(
        { error: "Invalid period" },
        { status: 400 }
      );
    }

    // Check game exists
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("id, sport_id")
      .eq("id", game_id)
      .single();

    if (gameError || !game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    // Check rate limit: max 1 score report per game per user per 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: recentReports } = await supabase
      .from("live_scores")
      .select("id")
      .eq("game_id", game_id)
      .eq("reported_by", user.id)
      .gte("reported_at", twoMinutesAgo)
      .limit(1);

    if (recentReports && recentReports.length > 0) {
      return NextResponse.json(
        { error: "You've already reported a score for this game recently. Try again in 2 minutes." },
        { status: 429 }
      );
    }

    // Insert live score record
    const { data: liveScore, error: insertError } = await supabase
      .from("live_scores")
      .insert({
        game_id,
        period,
        home_score,
        away_score,
        is_final: period === "F",
        reported_by: user.id,
        reported_at: new Date().toISOString(),
        verified: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting live score:", insertError);
      return NextResponse.json(
        { error: "Failed to report score" },
        { status: 500 }
      );
    }

    // If final, update games table with final scores
    if (period === "F") {
      const { error: updateError } = await supabase
        .from("games")
        .update({
          home_score,
          away_score,
        })
        .eq("id", game_id);

      if (updateError) {
        console.error("Error updating game scores:", updateError);
        // Don't fail the request, live_scores record already inserted
      }
    }

    return NextResponse.json({
      success: true,
      live_score: liveScore,
    });
  } catch (error) {
    console.error("Error in score report endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
