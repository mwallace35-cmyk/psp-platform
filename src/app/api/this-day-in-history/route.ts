import { NextRequest, NextResponse } from "next/server";
import { createStaticClient } from "@/lib/supabase/static";

/**
 * GET /api/this-day-in-history?month=4&day=2
 *
 * Returns notable games on this month/day across all years.
 * Uses server-side date filtering via Supabase RPC or raw filter.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get("month") || "0");
    const day = parseInt(searchParams.get("day") || "0");

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return NextResponse.json(
        { error: "Invalid month or day" },
        { status: 400 }
      );
    }

    const supabase = await createStaticClient();

    // Pad month/day for date matching
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    // PostgREST doesn't support LIKE on date columns or inline casts.
    // Build a list of exact dates for this month/day across a range of years.
    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    const dates: string[] = [];
    for (let y = startYear; y <= currentYear; y++) {
      // Only add valid dates (e.g., skip Feb 30)
      const d = new Date(y, month - 1, day);
      if (d.getMonth() === month - 1 && d.getDate() === day) {
        dates.push(`${y}-${mm}-${dd}`);
      }
    }

    const { data: games, error } = await (supabase as any)
      .from("games")
      .select(
        `id, game_date, home_score, away_score, sport_id,
         home_school:schools!games_home_school_id_fkey(name, slug),
         away_school:schools!games_away_school_id_fkey(name, slug)`
      )
      .in("game_date", dates)
      .not("home_score", "is", null)
      .not("away_score", "is", null)
      .order("game_date", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[On This Day] DB error:", error);
      return NextResponse.json({ events: [], total: 0 });
    }

    // Build events from games — prioritize close games and high scores
    const events = (games || []).map((game: any) => {
      const homeSchool = Array.isArray(game.home_school) ? game.home_school[0] : game.home_school;
      const awaySchool = Array.isArray(game.away_school) ? game.away_school[0] : game.away_school;
      const year = new Date(game.game_date).getFullYear();
      const margin = Math.abs((game.home_score || 0) - (game.away_score || 0));
      const totalPoints = (game.home_score || 0) + (game.away_score || 0);
      const isUpset = margin <= 3;

      return {
        year,
        gameId: game.id,
        sport: game.sport_id,
        homeTeam: homeSchool?.name || "Home",
        homeSlug: homeSchool?.slug || "",
        awayTeam: awaySchool?.name || "Away",
        awaySlug: awaySchool?.slug || "",
        homeScore: game.home_score,
        awayScore: game.away_score,
        margin,
        totalPoints,
        isUpset,
        link: `/${game.sport_id}/games/${game.id}`,
      };
    });

    // Score: prioritize close games, high-scoring games, variety of years
    const scored = events.map((e: any) => ({
      ...e,
      _score: (e.isUpset ? 50 : 0) + Math.min(e.totalPoints, 100) + (e.year < 2010 ? 20 : 0),
    }));
    scored.sort((a: any, b: any) => b._score - a._score);

    // Deduplicate by year — show at most 1 game per year for variety
    const seenYears = new Set<number>();
    const deduped = scored.filter((e: any) => {
      if (seenYears.has(e.year)) return false;
      seenYears.add(e.year);
      return true;
    });

    // Return top 5
    const top = deduped.slice(0, 5).map(({ _score, ...rest }: any) => rest);

    return NextResponse.json({
      events: top,
      total: events.length,
      month,
      day,
    });
  } catch (error) {
    console.error("[On This Day] Error:", error);
    return NextResponse.json({ error: "Internal server error", events: [] }, { status: 500 });
  }
}
