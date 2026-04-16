import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const revalidate = 0;

/**
 * GET /api/rankings/snub-vote?poll_id=X
 * Returns poll options with vote counts.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get('poll_id');

    if (!pollId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: poll_id' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch poll options with school info
    const { data: options, error: optionsError } = await (supabase as any)
      .from('snub_poll_options')
      .select('id, school_id, schools(name, slug)')
      .eq('poll_id', pollId);

    if (optionsError) {
      console.error('[rankings/snub-vote] GET options error:', optionsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch poll options' },
        { status: 500 }
      );
    }

    if (!options || options.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Poll not found' },
        { status: 404 }
      );
    }

    // Fetch vote counts for all options in this poll
    const optionIds = options.map((o: any) => o.id);
    const { data: votes, error: votesError } = await (supabase as any)
      .from('snub_poll_votes')
      .select('option_id')
      .in('option_id', optionIds);

    if (votesError) {
      console.error('[rankings/snub-vote] GET votes error:', votesError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch vote counts' },
        { status: 500 }
      );
    }

    // Count votes per option
    const voteCounts: Record<string, number> = {};
    for (const vote of votes ?? []) {
      voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
    }

    let totalVotes = 0;
    const formattedOptions = options.map((opt: any) => {
      const school = Array.isArray(opt.schools) ? opt.schools[0] : opt.schools;
      const voteCount = voteCounts[opt.id] || 0;
      totalVotes += voteCount;
      return {
        id: opt.id,
        school_name: school?.name ?? 'Unknown',
        school_slug: school?.slug ?? '',
        vote_count: voteCount,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        poll_id: pollId,
        options: formattedOptions,
        total_votes: totalVotes,
      },
    });
  } catch (err) {
    console.error('[rankings/snub-vote] GET unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rankings/snub-vote
 * Body: { poll_id: string, option_id: string, fingerprint: string }
 * Inserts a vote with a hashed voter identity. Returns 409 on duplicate.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { poll_id, option_id, fingerprint } = body;

    if (!poll_id || !option_id || !fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: poll_id, option_id, fingerprint' },
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

    const { error: insertError } = await (supabase as any)
      .from('snub_poll_votes')
      .insert({
        poll_id,
        option_id,
        voter_hash,
      });

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Already voted' },
          { status: 409 }
        );
      }
      console.error('[rankings/snub-vote] POST insert error:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to record vote' },
        { status: 500 }
      );
    }

    // Return updated counts for this poll
    const { data: options } = await (supabase as any)
      .from('snub_poll_options')
      .select('id, school_id, schools(name, slug)')
      .eq('poll_id', poll_id);

    const optionIds = (options ?? []).map((o: any) => o.id);
    const { data: votes } = await (supabase as any)
      .from('snub_poll_votes')
      .select('option_id')
      .in('option_id', optionIds);

    const voteCounts: Record<string, number> = {};
    for (const vote of votes ?? []) {
      voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
    }

    let totalVotes = 0;
    const formattedOptions = (options ?? []).map((opt: any) => {
      const school = Array.isArray(opt.schools) ? opt.schools[0] : opt.schools;
      const voteCount = voteCounts[opt.id] || 0;
      totalVotes += voteCount;
      return {
        id: opt.id,
        school_name: school?.name ?? 'Unknown',
        school_slug: school?.slug ?? '',
        vote_count: voteCount,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        poll_id,
        options: formattedOptions,
        total_votes: totalVotes,
      },
    });
  } catch (err) {
    console.error('[rankings/snub-vote] POST unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
