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

// --- Local narrow types for Supabase rows ---

interface SchoolJoin {
  id: number;
  name: string;
  slug: string;
}

interface SeasonJoin {
  year_start: number | null;
  year_end: number | null;
  label: string | null;
}

interface PlayerRow {
  id: number;
  slug: string;
  name: string;
  college?: string | null;
  pro_team?: string | null;
  graduation_year?: number | null;
  positions?: string[] | null;
  height?: string | null;
  birth_date?: string | null;
  is_multi_sport?: boolean | null;
  pro_draft_info?: string | null;
  schools?: SchoolJoin | SchoolJoin[] | null;
}

interface BaseSeasonRow {
  school_id: number;
  seasons?: SeasonJoin | SeasonJoin[] | null;
  schools?: SchoolJoin | SchoolJoin[] | null;
}

interface FootballSeasonRow extends BaseSeasonRow {
  rush_yards?: number | null;
  rush_td?: number | null;
  pass_yards?: number | null;
  pass_td?: number | null;
  rec_yards?: number | null;
  rec_td?: number | null;
  total_yards?: number | null;
  total_td?: number | null;
}

interface BasketballSeasonRow extends BaseSeasonRow {
  games_played?: number | null;
  points?: number | null;
  ppg?: number | null;
  rebounds?: number | null;
  assists?: number | null;
  steals?: number | null;
  blocks?: number | null;
}

interface BaseballSeasonRow extends BaseSeasonRow {
  batting_avg?: number | null;
  home_runs?: number | null;
  era?: number | null;
}

interface AwardRow {
  id: number;
  award_name?: string | null;
  award_type?: string | null;
  category?: string | null;
  seasons?: { year_start: number | null } | { year_start: number | null }[] | null;
}

// Supabase joins can come back as either an object or a single-element array
// depending on FK cardinality inference. Normalize here.
function firstOrSelf<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
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
      const footballRows = footballStats.data as unknown as FootballSeasonRow[];
      const grouped = new Map<number, FootballSeasonRow[]>();
      footballRows.forEach((stat) => {
        const schoolId = stat.school_id;
        if (!grouped.has(schoolId)) grouped.set(schoolId, []);
        grouped.get(schoolId)!.push(stat);
      });

      grouped.forEach((stats) => {
        const firstSchool = firstOrSelf(stats[0].schools);
        if (!firstSchool) return;
        careerStats.push({
          sport: "football",
          school: {
            id: firstSchool.id,
            name: firstSchool.name,
            slug: firstSchool.slug,
          },
          seasons: stats
            .sort((a, b) => {
              const aYear = firstOrSelf(a.seasons)?.year_start || 0;
              const bYear = firstOrSelf(b.seasons)?.year_start || 0;
              return aYear - bYear;
            })
            .map((stat) => ({
              year: firstOrSelf(stat.seasons)?.label || "",
              stats: {
                rush_yards: stat.rush_yards ?? null,
                rush_td: stat.rush_td ?? null,
                pass_yards: stat.pass_yards ?? null,
                pass_td: stat.pass_td ?? null,
                rec_yards: stat.rec_yards ?? null,
                rec_td: stat.rec_td ?? null,
                total_yards: stat.total_yards ?? null,
                total_td: stat.total_td ?? null,
              },
            })),
        });
      });
    }

    if (basketballStats.data && basketballStats.data.length > 0) {
      const basketballRows = basketballStats.data as unknown as BasketballSeasonRow[];
      const grouped = new Map<number, BasketballSeasonRow[]>();
      basketballRows.forEach((stat) => {
        const schoolId = stat.school_id;
        if (!grouped.has(schoolId)) grouped.set(schoolId, []);
        grouped.get(schoolId)!.push(stat);
      });

      grouped.forEach((stats) => {
        const firstSchool = firstOrSelf(stats[0].schools);
        if (!firstSchool) return;
        careerStats.push({
          sport: "basketball",
          school: {
            id: firstSchool.id,
            name: firstSchool.name,
            slug: firstSchool.slug,
          },
          seasons: stats
            .sort((a, b) => {
              const aYear = firstOrSelf(a.seasons)?.year_start || 0;
              const bYear = firstOrSelf(b.seasons)?.year_start || 0;
              return aYear - bYear;
            })
            .map((stat) => ({
              year: firstOrSelf(stat.seasons)?.label || "",
              stats: {
                games_played: stat.games_played ?? null,
                points: stat.points ?? null,
                ppg: stat.ppg ?? null,
                rebounds: stat.rebounds ?? null,
                assists: stat.assists ?? null,
                steals: stat.steals ?? null,
                blocks: stat.blocks ?? null,
              },
            })),
        });
      });
    }

    if (baseballStats.data && baseballStats.data.length > 0) {
      const baseballRows = baseballStats.data as unknown as BaseballSeasonRow[];
      const grouped = new Map<number, BaseballSeasonRow[]>();
      baseballRows.forEach((stat) => {
        const schoolId = stat.school_id;
        if (!grouped.has(schoolId)) grouped.set(schoolId, []);
        grouped.get(schoolId)!.push(stat);
      });

      grouped.forEach((stats) => {
        const firstSchool = firstOrSelf(stats[0].schools);
        if (!firstSchool) return;
        careerStats.push({
          sport: "baseball",
          school: {
            id: firstSchool.id,
            name: firstSchool.name,
            slug: firstSchool.slug,
          },
          seasons: stats
            .sort((a, b) => {
              const aYear = firstOrSelf(a.seasons)?.year_start || 0;
              const bYear = firstOrSelf(b.seasons)?.year_start || 0;
              return aYear - bYear;
            })
            .map((stat) => ({
              year: firstOrSelf(stat.seasons)?.label || "",
              stats: {
                batting_avg: stat.batting_avg ?? null,
                home_runs: stat.home_runs ?? null,
                era: stat.era ?? null,
              },
            })),
        });
      });
    }

    // Format awards
    const awardRows = (playerAwards.data || []) as unknown as AwardRow[];
    const awards = awardRows.map((award) => ({
      id: award.id,
      award_name: award.award_name ?? undefined,
      award_type: award.award_type ?? undefined,
      category: award.category ?? undefined,
      year: firstOrSelf(award.seasons)?.year_start || 0,
    }));

    const player = playerData as unknown as PlayerRow;
    const primarySchool = firstOrSelf(player.schools);
    const playerDetail: PlayerDetailResponse = {
      id: player.id,
      slug: player.slug,
      name: player.name,
      college: player.college ?? undefined,
      pro_team: player.pro_team ?? undefined,
      graduation_year: player.graduation_year ?? undefined,
      positions: player.positions ?? undefined,
      height: player.height ?? undefined,
      birth_date: player.birth_date ?? undefined,
      is_multi_sport: player.is_multi_sport ?? undefined,
      pro_draft_info: player.pro_draft_info ?? undefined,
      primary_school: primarySchool
        ? {
            id: primarySchool.id,
            name: primarySchool.name,
            slug: primarySchool.slug,
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
