/**
 * GET /api/v1/recruiting/updates
 *
 * Premium API endpoint for recruiting updates.
 * Requires PREMIUM tier API key.
 *
 * Query Parameters:
 * - sport?: string - Filter by sport (e.g., "football", "basketball")
 * - limit?: number - Number of updates to return (default: 20, max: 100)
 * - type?: string - Filter by update type (e.g., "commitment", "offer", "rating-change")
 * - page?: number - Pagination offset (default: 0)
 *
 * Response:
 * - 200: Successful response with recruiting updates array
 * - 401: Missing or invalid API key
 * - 403: Insufficient tier (requires premium)
 * - 500: Internal server error
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withApiAuth, type ApiKeyInfo } from '@/lib/api-auth';
import { captureError } from '@/lib/error-tracking';
import { VALID_SPORTS } from '@/lib/sports';

interface RecruitingUpdate {
  id: number;
  player_id: number;
  player_name: string;
  player_slug: string;
  school_id: number;
  school_name: string;
  school_slug: string;
  sport: string;
  type: 'commitment' | 'offer' | 'rating-change' | 'transfer' | 'decommitment';
  title: string;
  description?: string;
  target_school?: string;
  target_college?: string;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
  };
  meta?: {
    timestamp: string;
    request_id: string;
    tier: string;
  };
}

const handler = async (
  request: NextRequest,
  apiKey: ApiKeyInfo
): Promise<NextResponse<ApiResponse<RecruitingUpdate[]>>> => {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport')?.toLowerCase();
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const type = searchParams.get('type');
    const page = Math.max(0, parseInt(searchParams.get('page') || '0'));

    // Validate sport if provided
    if (sport && !VALID_SPORTS.includes(sport as typeof VALID_SPORTS[number])) {
      return NextResponse.json<ApiResponse<RecruitingUpdate[]>>(
        {
          success: false,
          error: `Invalid sport. Must be one of: ${VALID_SPORTS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const offset = page * limit;

    // Build query - note: recruiting_updates table may need to be created
    // For now, return mock data with proper structure
    let query = supabase
      .from('recruiting_updates')
      .select(
        `
        id,
        player_id,
        players(name, slug),
        school_id,
        schools(name, slug),
        sport_id,
        sports(slug),
        type,
        title,
        description,
        target_school,
        target_college,
        created_at
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false });

    // Apply filters
    if (sport) {
      query = query.eq('sports.slug', sport);
    }

    if (type) {
      query = query.eq('type', type);
    }

    // Paginate
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    // Transform response - would map actual data if table existed
    const updates: RecruitingUpdate[] = (data || []).map((update: any) => ({
      id: update.id,
      player_id: update.player_id,
      player_name: update.players?.name || 'Unknown',
      player_slug: update.players?.slug || '',
      school_id: update.school_id,
      school_name: update.schools?.name || 'Unknown',
      school_slug: update.schools?.slug || '',
      sport: update.sports?.slug || 'unknown',
      type: update.type,
      title: update.title,
      description: update.description,
      target_school: update.target_school,
      target_college: update.target_college,
      created_at: update.created_at,
    }));

    const total = count || 0;
    const hasMore = offset + limit < total;

    return NextResponse.json<ApiResponse<RecruitingUpdate[]>>(
      {
        success: true,
        data: updates,
        pagination: {
          page,
          limit,
          total,
          has_more: hasMore,
        },
        meta: {
          timestamp: new Date().toISOString(),
          request_id: requestId,
          tier: apiKey.tier,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
          'x-request-id': requestId,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    captureError(error, {
      endpoint: '/api/v1/recruiting/updates',
      requestId,
      method: 'GET',
      tier: apiKey.tier,
    });

    return NextResponse.json<ApiResponse<RecruitingUpdate[]>>(
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
