/**
 * GET /api/v1/rankings/power-index
 *
 * Premium API endpoint for PSP Power Index rankings.
 * Returns composite power rankings by sport based on historical performance.
 * Requires PREMIUM tier API key.
 *
 * Query Parameters:
 * - sport?: string - Filter by sport (e.g., "football", "basketball")
 * - limit?: number - Number of rankings to return (default: 25, max: 100)
 * - league_id?: number - Filter by league ID
 *
 * Response:
 * - 200: Successful response with power index rankings
 * - 401: Missing or invalid API key
 * - 403: Insufficient tier (requires premium)
 * - 500: Internal server error
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withApiAuth, type ApiKeyInfo } from '@/lib/api-auth';
import { captureError } from '@/lib/error-tracking';
import { VALID_SPORTS } from '@/lib/sports';

interface PowerRanking {
  rank: number;
  school_id: number;
  school_name: string;
  school_slug: string;
  sport: string;
  league?: string;
  power_score: number;
  championships: number;
  all_time_record: {
    wins: number;
    losses: number;
    ties?: number;
  };
  recent_seasons_record: {
    wins: number;
    losses: number;
    ties?: number;
  };
  state_titles: number;
  league_titles: number;
  last_updated: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    request_id: string;
    tier: string;
    sport?: string;
  };
}

const handler = async (
  request: NextRequest,
  apiKey: ApiKeyInfo
): Promise<NextResponse<ApiResponse<PowerRanking[]>>> => {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport')?.toLowerCase();
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25')));
    const leagueId = searchParams.get('league_id');

    // Validate sport if provided
    if (sport && !VALID_SPORTS.includes(sport as typeof VALID_SPORTS[number])) {
      return NextResponse.json<ApiResponse<PowerRanking[]>>(
        {
          success: false,
          error: `Invalid sport. Must be one of: ${VALID_SPORTS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Query to calculate power index rankings
    let query = supabase
      .from('schools')
      .select(
        `
        id,
        name,
        slug,
        league_id,
        leagues(name),
        team_seasons(
          id,
          season_id,
          sport_id,
          wins,
          losses,
          ties
        ),
        championships(
          id,
          sport_id,
          level
        )
      `,
        { count: 'exact' }
      )
      .is('deleted_at', null);

    if (leagueId) {
      query = query.eq('league_id', parseInt(leagueId));
    }

    const { data: schoolsData, error } = await query;

    if (error) {
      throw error;
    }

    // Calculate power index for each school
    const rankings: PowerRanking[] = (schoolsData || [])
      .map((school: any) => {
        // Filter by sport if specified
        const teamSeasons = (school.team_seasons || []).filter((ts: any) =>
          sport ? ts.sport_id === sport : true
        );

        const championships = (school.championships || []).filter((ch: any) =>
          sport ? ch.sport_id === sport : true
        );

        // Calculate all-time record
        const allTimeRecord = teamSeasons.reduce(
          (acc: any, ts: any) => ({
            wins: (acc.wins || 0) + (ts.wins || 0),
            losses: (acc.losses || 0) + (ts.losses || 0),
            ties: (acc.ties || 0) + (ts.ties || 0),
          }),
          { wins: 0, losses: 0, ties: 0 }
        );

        // Calculate recent 5 seasons record
        const recentSeasons = teamSeasons.slice(-5);
        const recentRecord = recentSeasons.reduce(
          (acc: any, ts: any) => ({
            wins: (acc.wins || 0) + (ts.wins || 0),
            losses: (acc.losses || 0) + (ts.losses || 0),
            ties: (acc.ties || 0) + (ts.ties || 0),
          }),
          { wins: 0, losses: 0, ties: 0 }
        );

        // Calculate championship counts by level
        const stateChampionships = championships.filter((ch: any) => ch.level === 'state').length;
        const leagueChampionships = championships.filter(
          (ch: any) => ch.level === 'league'
        ).length;

        // Power score calculation (weighted formula)
        const winPct = allTimeRecord.wins + allTimeRecord.losses > 0
          ? allTimeRecord.wins / (allTimeRecord.wins + allTimeRecord.losses)
          : 0;

        const recentWinPct = recentRecord.wins + recentRecord.losses > 0
          ? recentRecord.wins / (recentRecord.wins + recentRecord.losses)
          : 0;

        const powerScore =
          winPct * 40 + // Historical win percentage (40%)
          recentWinPct * 30 + // Recent form (30%)
          stateChampionships * 15 + // State titles (15%)
          leagueChampionships * 15; // League titles (15%)

        return {
          rank: 0, // Will be set after sorting
          school_id: school.id,
          school_name: school.name,
          school_slug: school.slug,
          sport: sport || 'all',
          league: school.leagues?.name,
          power_score: Math.round(powerScore * 100) / 100,
          championships: championships.length,
          all_time_record: allTimeRecord,
          recent_seasons_record: recentRecord,
          state_titles: stateChampionships,
          league_titles: leagueChampionships,
          last_updated: new Date().toISOString(),
        };
      })
      .filter((r: PowerRanking) => r.power_score > 0) // Filter out schools with no data
      .sort((a: PowerRanking, b: PowerRanking) => b.power_score - a.power_score)
      .slice(0, limit)
      .map((r: PowerRanking, idx: number) => ({
        ...r,
        rank: idx + 1,
      }));

    return NextResponse.json<ApiResponse<PowerRanking[]>>(
      {
        success: true,
        data: rankings,
        meta: {
          timestamp: new Date().toISOString(),
          request_id: requestId,
          tier: apiKey.tier,
          sport: sport || 'all',
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'x-request-id': requestId,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    captureError(error, {
      endpoint: '/api/v1/rankings/power-index',
      requestId,
      method: 'GET',
      tier: apiKey.tier,
    });

    return NextResponse.json<ApiResponse<PowerRanking[]>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
};

// Wrap with premium-tier authentication
export const GET = withApiAuth(handler, 'premium');
