/**
 * GET /api/v1/schools
 *
 * Fetch schools with filtering, searching, and pagination
 *
 * Query Parameters:
 * - sport?: string - Filter by sport (e.g., "football", "basketball")
 * - league?: number - Filter by league ID
 * - page?: number - Page number (default: 1)
 * - per_page?: number - Items per page (default: 50, max: 250)
 * - search?: string - Search school name
 * - order_by?: string - Sort field (default: "name"), can be "name" or "championships"
 *
 * Response:
 * - 200: Successful response with schools array
 * - 400: Bad request (invalid parameters)
 * - 429: Too many requests
 * - 500: Internal server error
 *
 * @example
 * ```
 * GET /api/v1/schools?sport=football&league=1&page=1&per_page=50
 * ```
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizePostgREST } from "@/lib/data/common";
import { captureError } from "@/lib/error-tracking";
import { VALID_SPORTS } from "@/lib/sports";
import { withOptionalApiAuth, type ApiKeyInfo } from "@/lib/api-auth";

interface SchoolResponse {
  id: number;
  slug: string;
  name: string;
  short_name?: string;
  city?: string;
  state?: string;
  mascot?: string;
  founded_year?: number;
  closed_year?: number;
  league?: {
    id: number;
    name: string;
    short_name?: string;
  };
  stats?: {
    championships: number;
    seasons: number;
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

async function getSchoolsHandler(
  request: NextRequest,
  apiKey: ApiKeyInfo | null
): Promise<NextResponse<ApiResponse<SchoolResponse[]>>> {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const startTime = Date.now();

  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get("sport")?.toLowerCase();
    const league = searchParams.get("league");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(250, Math.max(1, parseInt(searchParams.get("per_page") || "50")));
    const search = searchParams.get("search");
    const orderBy = searchParams.get("order_by") || "name";

    // Validate sport if provided
    if (sport && !VALID_SPORTS.includes(sport as typeof VALID_SPORTS[number])) {
      const response = NextResponse.json<ApiResponse<SchoolResponse[]>>(
        {
          success: false,
          error: `Invalid sport. Must be one of: ${VALID_SPORTS.join(", ")}`,
        },
        { status: 400 }
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Set cache headers for public API
    const cacheControl = sport ? "public, max-age=3600, stale-while-revalidate=86400" : "public, max-age=600, stale-while-revalidate=3600";

    const supabase = await createClient();
    const offset = (page - 1) * perPage;

    // Build query
    let query = supabase
      .from("schools")
      .select(
        `
        id,
        slug,
        name,
        short_name,
        city,
        state,
        mascot,
        founded_year,
        closed_year,
        leagues(id, name, short_name)
      `,
        { count: "exact" }
      )
      .is("deleted_at", null);

    // Filter by league if provided
    if (league) {
      query = query.eq("league_id", parseInt(league));
    }

    // Filter by sport if provided (join with team_seasons)
    if (sport) {
      query = query.eq("team_seasons.sport_id", sport);
    }

    // Search by name if provided
    if (search) {
      const sanitized = sanitizePostgREST(search);
      query = query.ilike("name", `%${sanitized}%`);
    }

    // Sort
    if (orderBy === "championships") {
      // Note: For proper championship counting, would need aggregation
      query = query.order("name", { ascending: true });
    } else {
      query = query.order(orderBy as string, { ascending: true });
    }

    // Paginate
    query = query.range(offset, offset + perPage - 1);

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    const schools: SchoolResponse[] = (data || []).map((school: any) => ({
      id: school.id,
      slug: school.slug,
      name: school.name,
      short_name: school.short_name,
      city: school.city,
      state: school.state,
      mascot: school.mascot,
      founded_year: school.founded_year,
      closed_year: school.closed_year,
      league: school.leagues
        ? {
            id: (school.leagues as any).id,
            name: (school.leagues as any).name,
            short_name: (school.leagues as any).short_name,
          }
        : undefined,
    }));

    const total = count || 0;
    const hasMore = offset + perPage < total;

    const response = NextResponse.json<ApiResponse<SchoolResponse[]>>(
      {
        success: true,
        data: schools,
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
          "Cache-Control": cacheControl,
          "x-request-id": requestId,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/v1/schools" , requestId, method: "GET" });

    const response = NextResponse.json<ApiResponse<SchoolResponse[]>>(
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

export const GET = withOptionalApiAuth(getSchoolsHandler);
