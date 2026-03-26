import { NextRequest, NextResponse } from "next/server";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 300; // 5 min ISR

/**
 * GET /api/did-you-know?sport=football&school_id=123
 *
 * Returns a random approved fact from the did_you_know table.
 * Optional filters: sport, school_id
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get("sport");
    const schoolId = searchParams.get("school_id");

    const supabase = createStaticClient();

    let query = supabase
      .from("did_you_know")
      .select("id, fact_text, sport, category, school_id, player_id")
      .eq("approved", true);

    if (sport) {
      query = query.eq("sport", sport);
    }

    if (schoolId) {
      query = query.eq("school_id", parseInt(schoolId, 10));
    }

    const { data, error } = await query;

    if (error) {
      console.error("[Did You Know] Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch fact" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No facts found", fact: null },
        { status: 404 }
      );
    }

    // Pick a random fact from the results
    const randomIndex = Math.floor(Math.random() * data.length);
    const fact = data[randomIndex];

    return NextResponse.json(fact);
  } catch (error) {
    console.error("[Did You Know] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
