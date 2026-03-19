/**
 * GET /api/player/[id]
 *
 * Fetch detailed player information with career stats by player ID
 * Used by the player compare page.
 *
 * Path Parameters:
 * - id: number - Player ID
 *
 * Response:
 * - 200: Successful response with player details and stats
 * - 404: Player not found
 * - 500: Internal server error
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { captureError } from "@/lib/error-tracking";

interface PlayerStats {
  player: {
    id: number;
    name: string;
    slug: string;
    positions?: string[];
    graduation_year?: number;
    college?: string;
    pro_team?: string;
    schools?: { name: string; slug: string };
  };
  stats: Record<string, number | string>;
  sport: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    request_id: string;
  };
}

function aggregateStats(seasonData: any[], sport: string): Record<string, number | string> {
  const stats: Record<string, number | string> = {};

  if (sport === "football") {
    const totals = {
      rush_yards: 0,
      rush_td: 0,
      pass_yards: 0,
      pass_td: 0,
      rec_yards: 0,
      rec_td: 0,
      total_yards: 0,
      total_td: 0,
    };

    for (const season of seasonData) {
      totals.rush_yards += season.rush_yards || 0;
      totals.rush_td += season.rush_td || 0;
      totals.pass_yards += season.pass_yards || 0;
      totals.pass_td += season.pass_td || 0;
      totals.rec_yards += season.rec_yards || 0;
      totals.rec_td += season.rec_td || 0;
      totals.total_yards += season.total_yards || 0;
      totals.total_td += season.total_td || 0;
    }

    Object.assign(stats, totals);
  } else if (sport === "basketball") {
    const totals = {
      games_played: 0,
      points: 0,
      ppg: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
    };

    let totalPoints = 0;
    let totalGames = 0;

    for (const season of seasonData) {
      totals.games_played += season.games_played || 0;
      totals.points += season.points || 0;
      totals.rebounds += season.rebounds || 0;
      totals.assists += season.assists || 0;
      totals.steals += season.steals || 0;
      totals.blocks += season.blocks || 0;

      totalPoints += season.points || 0;
      totalGames += season.games_played || 0;
    }

    totals.ppg = totalGames > 0 ? parseFloat((totalPoints / totalGames).toFixed(1)) : 0;

    Object.assign(stats, totals);
  } else if (sport === "baseball") {
    const totals = {
      batting_avg: 0,
      home_runs: 0,
      era: 0,
    };

    let avgCount = 0;
    let eraCount = 0;

    for (const season of seasonData) {
      if (season.batting_avg) {
        totals.batting_avg += season.batting_avg;
        avgCount++;
      }
      totals.home_runs += season.home_runs || 0;
      if (season.era) {
        totals.era += season.era;
        eraCount++;
      }
    }

    if (avgCount > 0) {
      totals.batting_avg = parseFloat((totals.batting_avg / avgCount).toFixed(3));
    }
    if (eraCount > 0) {
      totals.era = parseFloat((totals.era / eraCount).toFixed(2));
    }

    Object.assign(stats, totals);
  }

  return stats;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<PlayerStats>>> {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const { id } = await params;

  const playerId = parseInt(id);
  if (isNaN(playerId)) {
    const response = NextResponse.json<ApiResponse<PlayerStats>>(
      {
        success: false,
        error: "Invalid player ID",
      },
      { status: 400 }
    );
    response.headers.set("x-request-id", requestId);
    return response;
  }

  try {
    const supabase = await createClient();

    // Fetch player details
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select("id, name, slug, positions, graduation_year, college, pro_team, schools!players_primary_school_id_fkey(name, slug)")
      .eq("id", playerId)
      .is("deleted_at", null)
      .single();

    if (playerError || !playerData) {
      const response = NextResponse.json<ApiResponse<PlayerStats>>(
        {
          success: false,
          error: "Player not found",
        },
        { status: 404 }
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Fetch all career stats in parallel
    const [footballStats, basketballStats, baseballStats] = await Promise.all([
      supabase
        .from("football_player_seasons")
        .select("rush_yards, rush_td, pass_yards, pass_td, rec_yards, rec_td, total_yards, total_td")
        .eq("player_id", playerId),
      supabase
        .from("basketball_player_seasons")
        .select("games_played, points, ppg, rebounds, assists, steals, blocks")
        .eq("player_id", playerId),
      supabase
        .from("baseball_player_seasons")
        .select("batting_avg, home_runs, era")
        .eq("player_id", playerId),
    ]);

    // Determine primary sport and aggregate stats
    let sport = "none";
    let stats: Record<string, number | string> = {};

    if (footballStats.data && footballStats.data.length > 0) {
      sport = "football";
      stats = aggregateStats(footballStats.data, "football");
    } else if (basketballStats.data && basketballStats.data.length > 0) {
      sport = "basketball";
      stats = aggregateStats(basketballStats.data, "basketball");
    } else if (baseballStats.data && baseballStats.data.length > 0) {
      sport = "baseball";
      stats = aggregateStats(baseballStats.data, "baseball");
    }

    const schoolRef = playerData.schools;
    const schools = Array.isArray(schoolRef) ? schoolRef[0] : schoolRef;

    const playerStats: PlayerStats = {
      player: {
        id: playerData.id,
        name: playerData.name,
        slug: playerData.slug,
        positions: playerData.positions,
        graduation_year: playerData.graduation_year,
        college: playerData.college,
        pro_team: playerData.pro_team,
        schools: schools || undefined,
      },
      stats,
      sport,
    };

    const response = NextResponse.json<ApiResponse<PlayerStats>>(
      {
        success: true,
        data: playerStats,
        meta: {
          timestamp: new Date().toISOString(),
          request_id: requestId,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          "x-request-id": requestId,
        },
      }
    );

    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/player/[id]", requestId, id, method: "GET" });

    const response = NextResponse.json<ApiResponse<PlayerStats>>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
