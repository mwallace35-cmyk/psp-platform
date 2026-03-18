/**
 * GET /api/v1/search
 *
 * Full-text search across schools, players, and coaches
 *
 * Query Parameters:
 * - q: string - Search query (required)
 * - type?: string - Entity type filter ("school", "player", "coach", all if not specified)
 * - sport?: string - Filter by sport
 * - limit?: number - Max results (default: 20, max: 100)
 *
 * Response:
 * - 200: Successful response with search results
 * - 400: Bad request (missing query)
 * - 500: Internal server error
 *
 * @example
 * ```
 * GET /api/v1/search?q=saint+josephs&type=school&limit=10
 * GET /api/v1/search?q=montana&type=player&sport=football
 * ```
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizePostgREST } from "@/lib/data/common";
import { captureError } from "@/lib/error-tracking";
import { VALID_SPORTS } from "@/lib/sports";

interface SchoolResult {
  type: "school";
  id: number;
  name: string;
  slug: string;
  context: string;
  url: string;
}

interface PlayerResult {
  type: "player";
  id: number;
  name: string;
  slug: string;
  context: string;
  school?: {
    name: string;
    slug: string;
  };
  url: string;
}

interface CoachResult {
  type: "coach";
  id: number;
  name: string;
  slug: string;
  context: string;
  sport?: string;
  school?: {
    name: string;
    slug: string;
  };
  url: string;
}

type SearchResult = SchoolResult | PlayerResult | CoachResult;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    request_id: string;
    query: string;
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<SearchResult[]>>> {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type");
    const sport = searchParams.get("sport");
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    // Query is required
    if (!query || query.trim().length === 0) {
      const response = NextResponse.json<ApiResponse<SearchResult[]>>(
        {
          success: false,
          error: "Search query (q) is required",
        },
        { status: 400 }
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Validate sport if provided
    if (sport && !VALID_SPORTS.includes(sport.toLowerCase() as typeof VALID_SPORTS[number])) {
      const response = NextResponse.json<ApiResponse<SearchResult[]>>(
        {
          success: false,
          error: `Invalid sport. Must be one of: ${VALID_SPORTS.join(", ")}`,
        },
        { status: 400 }
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const sanitized = sanitizePostgREST(query);
    const supabase = await createClient();
    const results: SearchResult[] = [];

    // Search schools
    if (!type || type === "school") {
      const { data: schools } = await supabase
        .from("schools")
        .select("id, name, slug, city, league_id, leagues(name)")
        .ilike("name", `%${sanitized}%`)
        .is("deleted_at", null)
        .limit(Math.ceil(limit / 3));

      if (schools) {
        schools.forEach((school: any) => {
          results.push({
            type: "school",
            id: school.id,
            name: school.name,
            slug: school.slug,
            context: school.city ? `${school.city}, ${school.leagues?.name || "Independent"}` : school.leagues?.name || "Independent",
            url: `/football/schools/${school.slug}`,
          });
        });
      }
    }

    // Search players
    if (!type || type === "player") {
      let playerQuery = supabase
        .from("players")
        .select("id, name, slug, schools!players_primary_school_id_fkey(name, slug)")
        .ilike("name", `%${sanitized}%`)
        .is("deleted_at", null)
        .limit(Math.ceil(limit / 3));

      const { data: players } = await playerQuery;

      if (players) {
        players.forEach((player: any) => {
          const school = player.schools as any;
          results.push({
            type: "player",
            id: player.id,
            name: player.name,
            slug: player.slug,
            context: school?.name ? `${school.name} � Player` : "Player",
            school: school
              ? {
                  name: school.name,
                  slug: school.slug,
                }
              : undefined,
            url: `/football/players/${player.slug}`,
          });
        });
      }
    }

    // Search coaches
    if (!type || type === "coach") {
      let coachQuery = supabase
        .from("coaches")
        .select("id, name, slug, sport_id, schools!coaches_primary_school_id_fkey(name, slug)")
        .ilike("name", `%${sanitized}%`)
        .is("deleted_at", null)
        .limit(Math.ceil(limit / 3));

      if (sport) {
        coachQuery = coachQuery.eq("sport_id", sport);
      }

      const { data: coaches } = await coachQuery;

      if (coaches) {
        coaches.forEach((coach: any) => {
          const school = coach.schools as any;
          results.push({
            type: "coach",
            id: coach.id,
            name: coach.name,
            slug: coach.slug,
            context: school?.name ? `${school.name} � Coach` : "Coach",
            sport: coach.sport_id,
            school: school
              ? {
                  name: school.name,
                  slug: school.slug,
                }
              : undefined,
            url: `/${coach.sport_id}/coaches/${coach.slug}`,
          });
        });
      }
    }

    // Sort by relevance (exact match first, then prefix match, then contains)
    const queryLower = query.toLowerCase();
    results.sort((a, b) => {
      const aNameLower = a.name.toLowerCase();
      const bNameLower = b.name.toLowerCase();

      // Exact match
      if (aNameLower === queryLower) return -1;
      if (bNameLower === queryLower) return 1;

      // Starts with
      if (aNameLower.startsWith(queryLower)) return -1;
      if (bNameLower.startsWith(queryLower)) return 1;

      // Contains - earlier occurrence is better
      const aIndex = aNameLower.indexOf(queryLower);
      const bIndex = bNameLower.indexOf(queryLower);
      return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
    });

    // Trim to limit
    const trimmedResults = results.slice(0, limit);

    const response = NextResponse.json<ApiResponse<SearchResult[]>>(
      {
        success: true,
        data: trimmedResults,
        meta: {
          timestamp: new Date().toISOString(),
          request_id: requestId,
          query,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=1800",
          "x-request-id": requestId,
        },
      }
    );

    return response;
  } catch (error) {
    captureError(error, { endpoint: "/api/v1/search" , requestId, method: "GET" });

    const response = NextResponse.json<ApiResponse<SearchResult[]>>(
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
