import { getProAthletes, getProAthleteStats } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const league = searchParams.get("league") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "50", 10);

    const result = await getProAthletes({
      league: league || undefined,
      search: search || undefined,
      page,
      pageSize,
    });

    return NextResponse.json({
      athletes: result.data,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error("Error fetching pro athletes:", error);
    return NextResponse.json({ athletes: [], total: 0, error: "Failed to fetch athletes" }, { status: 500 });
  }
}
