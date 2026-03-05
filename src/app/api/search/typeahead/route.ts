import { getTopSearchEntities } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get limit from query params, default to 500
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "500", 10);

    // Fetch top search entities
    const entities = await getTopSearchEntities(limit);

    // Return with cache headers
    return NextResponse.json(
      { entities },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("[/api/search/typeahead] Error:", error);
    return NextResponse.json(
      { entities: [], error: "Failed to fetch search data" },
      { status: 500 }
    );
  }
}

export const revalidate = 3600;
