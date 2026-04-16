import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const revalidate = 0;

/**
 * GET /api/rankings/vote?ranking_ids=id1,id2,...
 * Returns aggregated agree/disagree counts per ranking.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rankingIdsParam = searchParams.get('ranking_ids');

    if (!rankingIdsParam) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: ranking_ids' },
        { status: 400 }
      );
    }

    const rankingIds = rankingIdsParam.split(',').map((id) => id.trim()).filter(Boolean);

    if (rankingIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid ranking IDs provided' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('ranking_votes')
      .select('ranking_id, vote_type')
      .in('ranking_id', rankingIds);

    if (error) {
      console.error('[rankings/vote] GET error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch votes' },
        { status: 500 }
      );
    }

    // Aggregate counts per ranking_id
    const counts: Record<string, { agree: number; disagree: number; total: number }> = {};
    for (const id of rankingIds) {
      counts[id] = { agree: 0, disagree: 0, total: 0 };
    }
    for (const row of data ?? []) {
      if (!counts[row.ranking_id]) {
        counts[row.ranking_id] = { agree: 0, disagree: 0, total: 0 };
      }
      if (row.vote_type === 'agree') {
        counts[row.ranking_id].agree++;
      } else if (row.vote_type === 'disagree') {
        counts[row.ranking_id].disagree++;
      }
      counts[row.ranking_id].total++;
    }

    return NextResponse.json(
      { success: true, data: counts },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (err) {
    console.error('[rankings/vote] GET unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rankings/vote
 * Body: { ranking_id: string, vote_type: 'agree' | 'disagree', fingerprint: string }
 * Inserts a vote with a hashed voter identity. Returns 409 on duplicate.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ranking_id, vote_type, fingerprint } = body;

    if (!ranking_id || !vote_type || !fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: ranking_id, vote_type, fingerprint' },
        { status: 400 }
      );
    }

    if (vote_type !== 'agree' && vote_type !== 'disagree') {
      return NextResponse.json(
        { success: false, error: 'vote_type must be "agree" or "disagree"' },
        { status: 400 }
      );
    }

    // Get IP for voter hash
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    // Compute voter_hash using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const voter_hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const supabase = await createClient();

    const { error: insertError } = await supabase
      .from('ranking_votes')
      .insert({
        ranking_id,
        vote_type,
        voter_hash,
      });

    if (insertError) {
      // Unique constraint violation — already voted
      if (insertError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Already voted' },
          { status: 409 }
        );
      }
      console.error('[rankings/vote] POST insert error:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to record vote' },
        { status: 500 }
      );
    }

    // Return updated counts for this ranking
    const { data: votes } = await supabase
      .from('ranking_votes')
      .select('vote_type')
      .eq('ranking_id', ranking_id);

    const counts = { agree: 0, disagree: 0, total: 0 };
    for (const row of votes ?? []) {
      if (row.vote_type === 'agree') counts.agree++;
      else if (row.vote_type === 'disagree') counts.disagree++;
      counts.total++;
    }

    return NextResponse.json({ success: true, data: counts });
  } catch (err) {
    console.error('[rankings/vote] POST unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
