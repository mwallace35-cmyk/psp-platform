/**
 * GET /api/v1/leaderboards/[sport]/[stat]
 *
 * Fetch leaderboard data for a specific sport and stat
 *
 * Path Parameters:
 * - sport: string - Sport ID (e.g., "football", "basketball")
 * - stat: string - Stat name (e.g., "rushing-yards", "points")
 *
 * Query Parameters:
 * - season?: string - Filter by season (e.g., "2024-25")
 * - limit?: number - Max results (default: 50, max: 250)
 * - offset?: number - Pagination offset (default: 0)
 *
 * Response:
 * - 200: Successful response with leaderboard entries
 * - 400: Bad request
 * - 404: Sport or stat not found
 * - 500: Internal server error
 *
 * @example
 * ```
 * GET /api/v1/leaderboards/football/rushing-yards?season=2024-25&limit=50
 * ```
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { captureError } from "@/lib/error-tracking";
import { VALID_SPORTS } from "@/lib/sports";

interface LeaderboardEntry {
  rank: number;
  value: number;
  player: {
    id: number;
    name: string;
    slug: string;
  };
  school: {
    id: number;
    name: string;
    slug: string;
  };
  season: {
    label: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    request_id: string;
    sport: string;
    stat: string;
  };
}

// Map stat slugs to database columns
const STAT_MAPPINGS: Record<string, Record<string, string>> = {
  football: {
    "rushing-yards": "rush_yards",
    "rushing-touchdowns": "rush_td",
    "passing-yards": "pass_yards",
    "passing-touchdowns": "pass_td",
    "receiving-yards": "rec_yards",
    "receiving-touchdowns": "rec_td",
    "total-yards": "total_yards",
    "total-touchdowns": "total_td",
  },
  basketball: {
    points: "points",
    "points-per-game": "ppg",
    rebounds: "rebounds",
    assists: "assists",
    steals: "steals",
    blocks: "blocks",
  },
  baseball: {
    "batting-average": "batting_avg",
    "home-runs": "home_runs",
    era: "era",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sport: string; stat: string }> }
): Promise<NextResponse<ApiResponse<LeaderboardEntry[]>>> {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const { sport: sportId, stat: statSlug } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season");
    const limit = Math.min(250, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0"));

    // Validate sport
    const normalizedSport = sportId.toLowerCase();
    if (!VALID_SPORTS.includes(normalizedSport as typeof VALID_SPORTS[number])) {
      const response = NextResponse.json<ApiResponse<LeaderboardEntry[]>>(
        {
          success: false,
          error: `Invalid sport. Must be one of: ${VALID_SPORTS.join(", ")}`,
        },
        { status: 400 }
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Get stat column name
    const statColumn = STAT_MAPPINGS[normalizedSport]?.[statSlug.toLowerCase()];
    if (!statColumn) {
      const validStats = Object.keys(STAT_MAPPINGS[normalizedSport] || {});
      const response = NextResponse.json<ApiResponse<LeaderboardEntry[]>>(
        {
          success: false,
          error: `Invalid stat for ${normalizedSport}. Valid stats: ${validStats.join(", ")}`,
        },
        { status: 400 }
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const supabase = await createClient();

    // Determine which table to query
    const tableMap: Record<string, string> = {
      football: "football_player_seasons",
      basketball: "basketball_player_seasons",
      baseball: "baseball_player_seasons",
    };

    const table = tableMap[normalizedSport];
    if (!table) {
      throw new Error(`No data available for sport: ${normalizedSport}`);
    }

    // Build query
    let query = supabase
      .from(table)
      .select(
        `
        ${statColumn},
        players(id, name, slug),
        schools!${table}_school_id_fkey(id, name, slug),
        seasons(label)
      `
      )
      .not(statColumn, "is", null)
      .order(statColumn, { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by season if provided
    if (season) {
      query = query.eq("seasons.label", season);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform response with rank numbering
    const entries: LeaderboardEntry[] = (data || [])
      .map((row: any, index: number) => ({
        rank: offset + index + 1,
        value: row[statColumn] ?? 0,
        player: row.players
          ? {
              id: (row.players as any).id,
              name: (row.players as any).name,
              slug: (row.players as any).slug,
            }
          : { id: 0, name: "Unknown", slug: "unknown" },
        school: row.schools
          ? {
              id: (row.schools as any).id,
              name: (row.schools as any).name,
              slug: (row.schools as any).slug,
            }
          : { id: 0, name: "Unknown", slug: "unknown" },
        season: row.seasons
          ? {
              label: (row.seasons as any).label,
            }
          : { label: "Unknown" },
      }))
      .filter((entry) => entry.value !== null && entry.value !== undefined);

    const response = NextResponse.json<ApiResponse<LeaderboardEntry[]>>(
      {
        success: true,
        data: entries,
        meta: {
          timestamp: new Date().toISOString(),
          request_id: requestId,
          sport: normalizedSport,
          stat: statSlug,
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
    captureError(error, { endpoint: "/api/v1/leaderboards/[sport]/[stat]", requestId, sport: sportId, stat: statSlug });

    const response = NextResponse.json<ApiResponse<LeaderboardEntry[]>>(
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
