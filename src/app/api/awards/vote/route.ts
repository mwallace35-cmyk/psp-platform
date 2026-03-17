import { createClient } from "@/lib/supabase/server";
import { castAwardVote, hasUserVoted } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/awards/vote
 * Body: { awardId: number, nomineeIndex: number }
 * Cast a vote for an award nominee
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { awardId, nomineeIndex } = body;

    if (typeof awardId !== "number" || typeof nomineeIndex !== "number") {
      return NextResponse.json(
        { error: "awardId and nomineeIndex are required" },
        { status: 400 }
      );
    }

    // Cast the vote
    await castAwardVote(awardId, nomineeIndex, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vote API error:", error);

    if (error instanceof Error && error.message.includes("already voted")) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/awards/vote?awardId=1
 * Check if user has voted for an award
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { hasVoted: false },
        { status: 200 }
      );
    }

    const awardId = request.nextUrl.searchParams.get("awardId");

    if (!awardId) {
      return NextResponse.json(
        { error: "awardId is required" },
        { status: 400 }
      );
    }

    const hasVoted = await hasUserVoted(parseInt(awardId), user.id);

    return NextResponse.json({ hasVoted });
  } catch (error) {
    console.error("Vote check API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
