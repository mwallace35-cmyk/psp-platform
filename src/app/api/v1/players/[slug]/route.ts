/**
 * GET /api/v1/players/[slug]
 *
 * Fetch detailed player information with career stats
 *
 * Path Parameters:
 * - slug: string - Player slug (e.g., "joe-montana-belmont-abbey")
 *
 * Response:
 * - 200: Successful response with player details and stats
 * - 404: Player not found
 * - 500: Internal server error
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { captureError } from "@/lib/error-tracking";

interface CareerStats {
  sport: string;
  school: {
    id: number;
    name: string;
    slug: string;
  };
  seasons: Array<{
    year: string;
    stats: Record<string, number | string | null>;
  }>;
}

interface PlayerDetailResponse {
  id: number;
  slug: string;
  name: string;
  college?: string;
  pro_team?: string;
  graduation_year?: number;
  positions?: string[];
  height?: string;
  birth_date?: string;
  is_multi_sport?: boolean;
  pro_draft_info?: string;
  primary_school?: {
    id: number;
    name: string;
    slug: string;
  };
  career_stats: CareerStats[];
  awards: Array<{
    id: number;
    award_name?: string;
    award_type?: string;
    category?: string;
    year: number;
  }>;
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
): Promise<NextResponse<ApiResponse<PlayerDetailResponse>>> {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const { slug } = await params;

  try {
    const supabase = await createClient();

    // Fetch player details
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select("*, schools!players_primary_school_id_fkey(id, name, slug)")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();

    if (playerError || !playerData) {
      const response = NextResponse.json<ApiResponse<PlayerDetailResponse>>(
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
    const [footballStats, basketballStats, baseballStats, playerAwards] = await Promise.all([
      supabase
        .from("football_player_seasons")
        .select("*, seasons(year_start, year_end, label), schools(id, name, slug)")
        .eq("player_id", playerData.id),
      supabase
        .from("basketball_player_seasons")
        .select("*, seasons(year_start, year_end, label), schools(id, name, slug)")
        .eq("player_id", playerData.id),
      supabase
        .from("baseball_player_seasons")
        .select("*, seasons(year_start, year_end, label), schools(id, name, slug)")
        .eq("player_id", playerData.id),
      supabase
        .from("awards")
        .select("id, award_name, award_type, category, seasons(year_start)")
        .eq("player_id", playerData.id),
    ]);

    // Construct career stats from each sport
    const careerStats: CareerStats[] = [];

    if (footballStats.data && footballStats.data.length > 0) {
      const grouped = new Map<number, any[]>();
      footballStats.data.forEach((stat: any) => {
        const schoolId = stat.school_id;
        if (!grouped.has(schoolId)) grouped.set(schoolId, []);
        grouped.get(schoolId)!.push(stat);
      });

      grouped.forEach((stats, schoolId) => {
        const firstSchool = stats[0].schools;
        careerStats.push({
          sport: "football",
          school: {
            id: firstSchool.id,
            name: firstSchool.name,
            slug: firstSchool.slug,
          },
          seasons: stats
            .sort((a: any, b: any) => {
              const aYear = (a.seasons as any)?.year_start || 0;
              const bYear = (b.seasons as any)?.year_start || 0;
              return aYear - bYear;
            })
            .map((stat: any) => ({
              year: (stat.seasons as any)?.label || "",
              stats: {
                rush_yards: stat.rush_yards,
                rush_td: stat.rush_td,
                pass_yards: stat.pass_yards,
                pass_td: stat.pass_td,
                rec_yards: stat.rec_yards,
                rec_td: stat.rec_td,
                total_yards: stat.total_yards,
                total_td: stat.total_td,
              },
            })),
        });
      });
    }

    if (basketballStats.data && basketballStats.data.length > 0) {
      const grouped = new Map<number, any[]>();
      basketballStats.data.forEach((stat: any) => {
        const schoolId = stat.school_id;
        if (!grouped.has(schoolId)) grouped.set(schoolId, []);
        grouped.get(schoolId)!.push(stat);
      });

      grouped.forEach((stats, schoolId) => {
        const firstSchool = stats[0].schools;
        careerStats.push({
          sport: "basketball",
          school: {
            id: firstSchool.id,
            name: firstSchool.name,
            slug: firstSchool.slug,
          },
          seasons: stats
            .sort((a: any, b: any) => {
              const aYear = (a.seasons as any)?.year_start || 0;
              const bYear = (b.seasons as any)?.year_start || 0;
              return aYear - bYear;
            })
            .map((stat: any) => ({
              year: (stat.seasons as any)?.label || "",
              stats: {
                games_played: stat.games_played,
                points: stat.points,
                ppg: stat.ppg,
                rebounds: stat.rebounds,
                assists: stat.assists,
                steals: stat.steals,
                blocks: stat.blocks,
              },
            })),
        });
      });
    }

    if (baseballStats.data && baseballStats.data.length > 0) {
      const grouped = new Map<number, any[]>();
      baseballStats.data.forEach((stat: any) => {
        const schoolId = stat.school_id;
        if (!grouped.has(schoolId)) grouped.set(schoolId, []);
        grouped.get(schoolId)!.push(stat);
      });

      grouped.forEach((stats, schoolId) => {
        const firstSchool = stats[0].schools;
        careerStats.push({
          sport: "baseball",
          school: {
            id: firstSchool.id,
            name: firstSchool.name,
            slug: firstSchool.slug,
          },
          seasons: stats
            .sort((a: any, b: any) => {
              const aYear = (a.seasons as any)?.year_start || 0;
              const bYear = (b.seasons as any)?.year_start || 0;
              return aYear - bYear;
            })
            .map((stat: any) => ({
              year: (stat.seasons as any)?.label || "",
              stats: {
                batting_avg: stat.batting_avg,
                home_runs: stat.home_runs,
                era: stat.era,
              },
            })),
        });
      });
    }

    // Format awards
    const awards = (playerAwards.data || []).map((award: any) => ({
      id: award.id,
      award_name: award.award_name,
      award_type: award.award_type,
      category: award.category,
      year: (award.seasons as any)?.year_start || 0,
    }));

    const playerDetail: PlayerDetailResponse = {
      id: playerData.id,
      slug: playerData.slug,
      name: playerData.name,
      college: playerData.college,
      pro_team: playerData.pro_team,
      graduation_year: playerData.graduation_year,
      positions: playerData.positions,
      height: playerData.height,
      birth_date: playerData.birth_date,
      is_multi_sport: playerData.is_multi_sport,
      pro_draft_info: playerData.pro_draft_info,
      primary_school: playerData.schools
        ? {
            id: (playerData.schools as any).id,
            name: (playerData.schools as any).name,
            slug: (playerData.schools as any).slug,
          }
        : undefined,
      career_stats: careerStats,
      awards,
    };

    const response = NextResponse.json<ApiResponse<PlayerDetailResponse>>(
      {
        success: true,
        data: playerDetail,
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
    captureError(error, { endpoint: "/api/v1/players/[slug]" , requestId, slug, method: "GET" });

    const response = NextResponse.json<ApiResponse<PlayerDetailResponse>>(
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
