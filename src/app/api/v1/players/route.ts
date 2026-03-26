/**
 * GET /api/v1/players
 *
 * Fetch players with filtering, searching, and pagination
 *
 * Query Parameters:
 * - sport?: string - Filter by sport (e.g., "football", "basketball")
 * - school_id?: number - Filter by school ID
 * - school_slug?: string - Filter by school slug
 * - search?: string - Search player name
 * - page?: number - Page number (default: 1)
 * - per_page?: number - Items per page (default: 50, max: 250)
 * - order_by?: string - Sort field (default: "name"), can be "name" or "pro_team"
 *
 * Response:
 * - 200: Successful response with players array
 * - 400: Bad request
 * - 429: Rate limit exceeded
 * - 500: Internal server error
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizePostgREST } from "@/lib/data/common";
import { captureError } from "@/lib/error-tracking";
import { VALID_SPORTS } from "@/lib/sports";
import { withOptionalApiAuth, type ApiKeyInfo } from "@/lib/api-auth";

interface PlayerResponse {
  id: number;
  slug: string;
  name: string;
  college?: string;
  pro_team?: string;
  graduation_year?: number;
  positions?: string[];
  school?: {
    id: number;
    name: string;
    slug: string;
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

async function getPlayersHandler(
  request: NextRequest,
  apiKey: ApiKeyInfo | null
): Promise<NextResponse<ApiResponse<PlayerResponse[]>>> {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get("sport")?.toLowerCase();
    const schoolId = searchParams.get("school_id");
    const schoolSlug = searchParams.get("school_slug");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(250, Math.max(1, parseInt(searchParams.get("per_page") || "50")));
    const ALLOWED_ORDER_BY = ["name", "pro_team", "graduation_year"];
    const rawOrderBy = searchParams.get("order_by") || "name";
    const orderBy = ALLOWED_ORDER_BY.includes(rawOrderBy.toLowerCase()) ? rawOrderBy.toLowerCase() : "name";

    // Validate sport if provided
    if (sport && !VALID_SPORTS.includes(sport as typeof VALID_SPORTS[number])) {
      const response = NextResponse.json<ApiResponse<PlayerResponse[]>>(
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

    // Start with players query
    let query = supabase
      .from("players")
      .select(
        `
        id,
        slug,
        name,
        college,
        pro_team,
        graduation_year,
        positions,
        schools!players_primary_school_id_fkey(id, name, slug)
      `,
        { count: "exact" }
      )
      .is("deleted_at", null);

    // Filter by school if provided
    if (schoolId) {
      // Filter by school ID (using player_seasons tables)
      if (sport) {
        const statTable = {
          football: "football_player_seasons",
          basketball: "basketball_player_seasons",
          baseball: "baseball_player_seasons",
        }[sport as string];

        if (statTable) {
          query = query.eq(statTable + ".school_id", parseInt(schoolId));
        }
      }
    }

    if (schoolSlug && !schoolId) {
      // Get school ID from slug first
      const { data: schoolData } = await supabase
        .from("schools")
        .select("id")
        .eq("slug", schoolSlug)
        .single();

      if (schoolData) {
        if (sport) {
          const statTable = {
            football: "football_player_seasons",
            basketball: "basketball_player_seasons",
            baseball: "baseball_player_seasons",
          }[sport as string];

          if (statTable) {
            query = query.eq(statTable + ".school_id", schoolData.id);
          }
        }
      }
    }

    // Search by name
    if (search) {
      const sanitized = sanitizePostgREST(search);
      query = query.ilike("name", `%${sanitized}%`);
    }

    // Sort
    query = query.order(orderBy as string, { ascending: orderBy === "name" });

    // Paginate
    query = query.range(offset, offset + perPage - 1);

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    const players: PlayerResponse[] = (data || []).map((player: unknown) => {
      const p = player as PlayerResponse & { schools?: PlayerResponse["school"] };
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        college: p.college,
        pro_team: p.pro_team,
        graduation_year: p.graduation_year,
        positions: p.positions,
        school: p.schools
          ? {
              id: p.schools.id,
              name: p.schools.name,
              slug: p.schools.slug,
            }
          : undefined,
      };
    });

    const total = count || 0;
    const hasMore = offset + perPage < total;

    const response = NextResponse.json<ApiResponse<PlayerResponse[]>>(
      {
        success: true,
        data: players,
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
          "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
          "x-request-id": requestId,
        },
      }
    );

    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/v1/players" , requestId, method: "GET" });

    const response = NextResponse.json<ApiResponse<PlayerResponse[]>>(
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

export const GET = withOptionalApiAuth(getPlayersHandler);
