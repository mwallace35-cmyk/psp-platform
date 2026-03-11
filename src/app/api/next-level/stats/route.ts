import { getProAthleteStats } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = await getProAthleteStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching pro athlete stats:", error);
    return NextResponse.json({ nfl: 0, nba: 0, mlb: 0, wnba: 0, total: 0 }, { status: 500 });
  }
}
