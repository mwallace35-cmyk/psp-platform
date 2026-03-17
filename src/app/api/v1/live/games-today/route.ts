import { NextRequest, NextResponse } from "next/server";
import { getTodaysGames } from "@/lib/data/live-scores";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get("sport") || undefined;

    const games = await getTodaysGames(sport || undefined);

    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching today's games:", error);
    return NextResponse.json(
      { error: "Failed to fetch today's games" },
      { status: 500 }
    );
  }
}
