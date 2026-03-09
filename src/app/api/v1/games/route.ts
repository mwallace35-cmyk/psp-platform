/**
 * GET /api/v1/games
 *
 * Fetch games with filtering by sport, date range, and teams
 *
 * Query Parameters:
 * - sport?: string - Filter by sport (required for best performance)
 * - school_id?: number - Filter by school (home or away)
 * - school_slug?: string - Filter by school slug
 * - start_date?: string - ISO date (e.g., "2024-01-01")
 * - end_date?: string - ISO date
 * - status?: string - "finished", "scheduled", "cancelled"
 * - page?: number - Page number (default: 1)
 * - per_page?: number - Items per page (default: 50, max: 250)
 *
 * Response:
 * - 200: Successful response with games array
 * - 400: Bad request
 * - 500: Internal server error
 *
 * @example
 * ```
 * GET /api/v1/games?sport=football&start_date=2024-09-01&end_date=2024-12-31&page=1
 * ```
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { captureError } from "@/lib/error-tracking";
import { VALID_SPORTS } from "@/lib/sports";

interface GameResponse {
  id: number;
  sport_id: string;
  game_date: string;
  status: string;
  home_team: {
    id: number;
    name: string;
    slug: string;
  };
  away_team: {
    id: number;
    name: string;
    slug: string;
  };
  home_score?: number | null;
  away_score?: number | null;
  season?: {
    label: string;
    year_start: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
  meta?: {
    timestamp: string;
    request_id: string;
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<GameResponse[]>>> {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get("sport")?.toLowerCase();
    const schoolId = searchParams.get("school_id");
    const schoolSlug = searchParams.get("school_slug");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(250, Math.max(1, parseInt(searchParams.get("per_page") || "50")));

    // Sport is recommended for performance
    if (!sport) {
      const response = NextResponse.json<ApiResponse<GameResponse[]>>(
        {
          success: false,
          error: "sport parameter is required for optimal performance",
        },
        { status: 400 }
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    if (!VALID_SPORTS.includes(sport as typeof VALID_SPORTS[number])) {
      const response = NextResponse.json<ApiResponse<GameResponse[]>>(
        {
          success: false,
          error: `Invalid sport. Must be one of: ${VALID_SPORTS.join(", ")}`,
        },
        { status: 400 }
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const supabase = await createClient();
    const offset = (page - 1) * perPage;

    // Get school ID if slug provided
    let finalSchoolId = schoolId;
    if (schoolSlug && !schoolId) {
      const { data: school } = await supabase
        .from("schools")
        .select("id")
        .eq("slug", schoolSlug)
        .single();
      finalSchoolId = school?.id.toString();
    }

    // Build query
    let query = supabase
      .from("games")
      .select(
        `
        id,
        sport_id,
        game_date,
        status,
        home_score,
        away_score,
        home_school:schools!games_home_school_id_fkey(id, name, slug),
        away_school:schools!games_away_school_id_fkey(id, name, slug),
        seasons(label, year_start)
      `,
        { count: "exact" }
      )
      .eq("sport_id", sport)
      .is("deleted_at", null);

    // Filter by school if provided
    if (finalSchoolId) {
      const schoolIdNum = parseInt(finalSchoolId);
      // Get games where school is either home or away
      query = query.or(`home_school_id.eq.${schoolIdNum},away_school_id.eq.${schoolIdNum}`);
    }

    // Filter by date range
    if (startDate) {
      query = query.gte("game_date", startDate);
    }
    if (endDate) {
      query = query.lte("game_date", endDate);
    }

    // Filter by status
    if (status) {
      query = query.eq("status", status);
    }

    // Order by date descending
    query = query.order("game_date", { ascending: false });

    // Paginate
    query = query.range(offset, offset + perPage - 1);

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    const games: GameResponse[] = (data || []).map((game: any) => ({
      id: game.id,
      sport_id: game.sport_id,
      game_date: game.game_date,
      status: game.status,
      home_team: game.home_school
        ? {
            id: game.home_school.id,
            name: game.home_school.name,
            slug: game.home_school.slug,
          }
        : { id: 0, name: "Unknown", slug: "unknown" },
      away_team: game.away_school
        ? {
            id: game.away_school.id,
            name: game.away_school.name,
            slug: game.away_school.slug,
          }
        : { id: 0, name: "Unknown", slug: "unknown" },
      home_score: game.home_score,
      away_score: game.away_score,
      season: game.seasons
        ? {
            label: (game.seasons as any).label,
            year_start: (game.seasons as any).year_start,
          }
        : undefined,
    }));

    const total = count || 0;
    const hasMore = offset + perPage < total;

    const response = NextResponse.json<ApiResponse<GameResponse[]>>(
      {
        success: true,
        data: games,
        pagination: {
          page,
          per_page: perPage,
          total,
          has_more: hasMore,
        },
        meta: {
          timestamp: new Date().toISOString(),
          request_id: requestId,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": sport === "football" ? "public, max-age=600, stale-while-revalidate=3600" : "public, max-age=300, stale-while-revalidate=1800",
          "x-request-id": requestId,
        },
      }
    );

    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/v1/games" , requestId, method: "GET" });

    const response = NextResponse.json<ApiResponse<GameResponse[]>>(
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
