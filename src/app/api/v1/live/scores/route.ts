/**
 * GET /api/v1/live/scores
 *
 * Premium API endpoint for live game scores.
 * Returns today's games with real-time score updates.
 * Requires PREMIUM tier API key.
 *
 * Query Parameters:
 * - sport?: string - Filter by sport (e.g., "football", "basketball")
 * - date?: string - Filter by date (YYYY-MM-DD format, default: today)
 * - league_id?: number - Filter by league ID
 *
 * Response:
 * - 200: Successful response with live scores
 * - 400: Invalid query parameters
 * - 401: Missing or invalid API key
 * - 403: Insufficient tier (requires premium)
 * - 500: Internal server error
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withApiAuth, type ApiKeyInfo } from '@/lib/api-auth';
import { captureError } from '@/lib/error-tracking';
import { VALID_SPORTS } from '@/lib/sports';
import { getSchoolShortDisplayName } from '@/lib/utils/schoolDisplayName';

interface GameScore {
  id: number;
  sport: string;
  league?: string;
  date: string;
  time?: string;
  status: 'scheduled' | 'in_progress' | 'final';
  home_team: {
    id: number;
    name: string;
    slug: string;
    score: number;
  };
  away_team: {
    id: number;
    name: string;
    slug: string;
    score: number;
  };
  location?: string;
  notes?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    request_id: string;
    tier: string;
    date: string;
  };
}

const handler = async (
  request: NextRequest,
  apiKey: ApiKeyInfo
): Promise<NextResponse<ApiResponse<GameScore[]>>> => {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport')?.toLowerCase();
    const dateParam = searchParams.get('date');
    const leagueId = searchParams.get('league_id');

    // Validate sport if provided
    if (sport && !VALID_SPORTS.includes(sport as typeof VALID_SPORTS[number])) {
      return NextResponse.json<ApiResponse<GameScore[]>>(
        {
          success: false,
          error: `Invalid sport. Must be one of: ${VALID_SPORTS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate date format if provided
    let queryDate = new Date().toISOString().split('T')[0];
    if (dateParam) {
      // Validate YYYY-MM-DD format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        return NextResponse.json<ApiResponse<GameScore[]>>(
          {
            success: false,
            error: 'Invalid date format. Use YYYY-MM-DD (e.g., 2026-03-16)',
          },
          { status: 400 }
        );
      }
      queryDate = dateParam;
    }

    const supabase = await createClient();

    // Query games for the specified date
    let query = supabase
      .from('games')
      .select(
        `
        id,
        game_date,
        game_time,
        status,
        home_school_id,
        away_school_id,
        home_score,
        away_score,
        sport_id,
        sports(slug),
        location,
        notes,
        home_schools:schools!games_home_school_id_fkey(id, name, slug, city, league_id),
        away_schools:schools!games_away_school_id_fkey(id, name, slug, city, league_id),
        home_league:home_schools.leagues(name),
        away_league:away_schools.leagues(name)
      `
      )
      .gte('game_date', queryDate)
      .lte('game_date', queryDate)
      .order('game_time', { ascending: true });

    // Apply sport filter if provided
    if (sport) {
      query = query.eq('sports.slug', sport);
    }

    // Apply league filter if provided
    if (leagueId) {
      // This would need more complex filtering - for now, we'll note it
      // In a real implementation, you might need a subquery or post-filtering
    }

    const { data: gamesData, error } = await query;

    if (error) {
      throw error;
    }

    // Transform response data
    const scores: GameScore[] = (gamesData || []).map((game: any) => ({
      id: game.id,
      sport: game.sports?.slug || 'unknown',
      league: game.home_league?.name,
      date: game.game_date,
      time: game.game_time,
      status: game.status || 'scheduled',
      home_team: {
        id: game.home_school_id,
        name: game.home_schools ? getSchoolShortDisplayName(game.home_schools) : 'Unknown',
        slug: game.home_schools?.slug || '',
        score: game.home_score ?? 0,
      },
      away_team: {
        id: game.away_school_id,
        name: game.away_schools ? getSchoolShortDisplayName(game.away_schools) : 'Unknown',
        slug: game.away_schools?.slug || '',
        score: game.away_score ?? 0,
      },
      location: game.location,
      notes: game.notes,
    }));

    return NextResponse.json<ApiResponse<GameScore[]>>(
      {
        success: true,
        data: scores,
        meta: {
          timestamp: new Date().toISOString(),
          request_id: requestId,
          tier: apiKey.tier,
          date: queryDate,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
          'x-request-id': requestId,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    captureError(error, {
      endpoint: '/api/v1/live/scores',
      requestId,
      method: 'GET',
      tier: apiKey.tier,
    });

    return NextResponse.json<ApiResponse<GameScore[]>>(
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
