/**
 * GET /api/v1/schools/[slug]
 *
 * Fetch detailed school information with stats and history
 *
 * Path Parameters:
 * - slug: string - School slug (e.g., "saint-josephs-prep")
 *
 * Query Parameters:
 * - sport?: string - Include stats only for specific sport
 *
 * Response:
 * - 200: Successful response with school details
 * - 404: School not found
 * - 500: Internal server error
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { captureError } from "@/lib/error-tracking";
import { VALID_SPORTS } from "@/lib/sports";

interface SchoolStats {
  sport: string;
  total_championships: number;
  total_seasons: number;
  win_loss_tie?: string;
}

interface SchoolDetailResponse {
  id: number;
  slug: string;
  name: string;
  short_name?: string;
  city?: string;
  state?: string;
  mascot?: string;
  website_url?: string;
  founded_year?: number;
  closed_year?: number;
  league?: {
    id: number;
    name: string;
  };
  stats: {
    all_championships: number;
    all_seasons: number;
    by_sport: SchoolStats[];
  };
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<ApiResponse<SchoolDetailResponse>>> {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const { slug } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get("sport")?.toLowerCase();

    // Validate sport if provided
    if (sport && !VALID_SPORTS.includes(sport as typeof VALID_SPORTS[number])) {
      const response = NextResponse.json<ApiResponse<SchoolDetailResponse>>(
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

    // Fetch school details
    const { data: schoolData, error: schoolError } = await supabase
      .from("schools")
      .select("*, leagues(id, name)")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();

    if (schoolError || !schoolData) {
      const response = NextResponse.json<ApiResponse<SchoolDetailResponse>>(
        {
          success: false,
          error: "School not found",
        },
        { status: 404 }
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }

    // Fetch statistics by sport
    let statsQuery = supabase
      .from("team_seasons")
      .select("sport_id, championships:championships(count)", { count: "exact" })
      .eq("school_id", schoolData.id);

    if (sport) {
      statsQuery = statsQuery.eq("sport_id", sport);
    }

    const { data: statsData, error: statsError } = await statsQuery;

    if (statsError) {
      throw statsError;
    }

    // Calculate aggregate stats
    const allChampionships = statsData
      ? statsData.reduce((sum: number, row: any) => sum + (row.championships?.length || 0), 0)
      : 0;

    const byeSport: SchoolStats[] = [];
    if (statsData) {
      const sportGroups = new Map<string, any[]>();
      statsData.forEach((row: any) => {
        if (!sportGroups.has(row.sport_id)) {
          sportGroups.set(row.sport_id, []);
        }
        sportGroups.get(row.sport_id)!.push(row);
      });

      sportGroups.forEach((sportData, sportId) => {
        byeSport.push({
          sport: sportId,
          total_championships: sportData.reduce((sum, row) => sum + (row.championships?.length || 0), 0),
          total_seasons: sportData.length,
        });
      });
    }

    const schoolDetail: SchoolDetailResponse = {
      id: schoolData.id,
      slug: schoolData.slug,
      name: schoolData.name,
      short_name: schoolData.short_name,
      city: schoolData.city,
      state: schoolData.state,
      mascot: schoolData.mascot,
      website_url: schoolData.website_url,
      founded_year: schoolData.founded_year,
      closed_year: schoolData.closed_year,
      league: schoolData.leagues
        ? {
            id: (schoolData.leagues as any).id,
            name: (schoolData.leagues as any).name,
          }
        : undefined,
      stats: {
        all_championships: allChampionships,
        all_seasons: statsData?.length || 0,
        by_sport: byeSport,
      },
    };

    const response = NextResponse.json<ApiResponse<SchoolDetailResponse>>(
      {
        success: true,
        data: schoolDetail,
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
    captureError(error, { endpoint: "/api/v1/schools/[slug]" , requestId, slug, method: "GET" });

    const response = NextResponse.json<ApiResponse<SchoolDetailResponse>>(
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
