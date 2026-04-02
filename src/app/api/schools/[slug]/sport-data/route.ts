import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/data/common";
import { captureError } from "@/lib/error-tracking";
import { getCurrentSeasonLabel } from "@/lib/sports";
import {
  getSchoolRoster,
  getSchoolStatLeaders,
  getSchoolGamesWithStats,
} from "@/lib/data/school-hub";
import { getSchoolRivalries } from "@/lib/data/rivalries";

const VALID_SPORTS = [
  "football",
  "basketball",
  "baseball",
  "soccer",
  "lacrosse",
  "wrestling",
  "track",
  "cross-country",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const requestId =
    request.headers.get("x-request-id") || crypto.randomUUID();

  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get("sport")?.toLowerCase();
    const season = searchParams.get("season") || getCurrentSeasonLabel();

    if (!sport || !VALID_SPORTS.includes(sport)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing sport parameter" },
        { status: 400, headers: { "x-request-id": requestId } }
      );
    }

    // Look up school ID from slug
    const supabase = await createClient();
    const { data: school } = await supabase
      .from("schools")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!school) {
      return NextResponse.json(
        { success: false, error: "School not found" },
        { status: 404, headers: { "x-request-id": requestId } }
      );
    }

    // Fetch all sport-specific data in parallel
    const [roster, statLeaders, games, rivalries] = await Promise.all([
      getSchoolRoster(school.id, sport, season),
      getSchoolStatLeaders(school.id, sport, season),
      getSchoolGamesWithStats(school.id, sport, season),
      getSchoolRivalries(school.id, sport),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: { roster, statLeaders, games, rivalries },
        meta: {
          sport,
          season,
          timestamp: new Date().toISOString(),
          request_id: requestId,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
          "x-request-id": requestId,
        },
      }
    );
  } catch (error) {
    captureError(error, {
      endpoint: "schools/sport-data",
      requestId,
      method: "GET",
    });
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500, headers: { "x-request-id": requestId } }
    );
  }
}
