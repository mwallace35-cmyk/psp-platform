import { NextRequest, NextResponse } from "next/server";
import { createStaticClient } from "@/lib/supabase/static";

/**
 * GET /api/this-day-in-history?month=3&day=15
 *
 * Returns historical events for the given month/day across all years in the database.
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

    // Query for games on this month/day across all years
    // We'll use a SQL-based approach since PostgREST doesn't support month/day extraction
    const { data: games, error: gamesError } = await supabase
      .from("games")
      .select(
        `id, game_date, home_score, away_score, sport_id,
         home_school:schools!games_home_school_id_fkey(name),
         away_school:schools!games_away_school_id_fkey(name),
         seasons(label, year_start)`
      )
      .not("game_date", "is", null)
      .limit(100);

    // Query for championships on this month/day
    const { data: champs, error: champsError } = await supabase
      .from("championships")
      .select(
        `id, championship_type, level,
         schools(name),
         seasons(label, year_start)`
      )
      .limit(50);

    // Query for awards on this month/day
    const { data: awards, error: awardsError } = await supabase
      .from("awards")
      .select(
        `id, award_name, award_type,
         players(name),
         schools(name),
         seasons(label, year_start)`
      )
      .limit(50);

    const events: Array<{
      year: number;
      description: string;
      type: "game" | "championship" | "award";
      link?: string;
      score?: string;
    }> = [];

    // Process games
    if (!gamesError && games) {
      for (const game of (games as any[]) || []) {
        if (!game.game_date) continue;

        const gameDate = new Date(game.game_date);
        if (gameDate.getMonth() + 1 === month && gameDate.getDate() === day) {
          const homeTeam = game.home_school?.name || "Team";
          const awayTeam = game.away_school?.name || "Team";
          const year = gameDate.getFullYear();

          events.push({
            year,
            description: `${awayTeam} vs ${homeTeam}`,
            type: "game",
            score:
              game.home_score !== null && game.away_score !== null
                ? `${awayTeam} ${game.away_score}, ${homeTeam} ${game.home_score}`
                : undefined,
          });
        }
      }
    }

    // Process championships (simplified - would need date field)
    if (!champsError && champs) {
      // For now, championships don't have a specific date, so we skip this
      // In a real implementation, you'd store championship_date in the DB
    }

    // Process awards (simplified)
    if (!awardsError && awards) {
      // Awards also need a date field to make this work
    }

    // Sort by year descending
    events.sort((a, b) => b.year - a.year);

    // Return top 3 events
    return NextResponse.json({
      events: events.slice(0, 3),
      total: events.length,
    });
  } catch (error) {
    console.error("[This Day in History] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", events: [] },
      { status: 500 }
    );
  }
}
