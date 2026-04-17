import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const revalidate = 0;

interface PollOption {
  label: string;
}

/**
 * GET /api/weekly-poll
 * Returns the currently active weekly poll (most recent active row in daily_polls,
 * ends_at in future) with per-option vote counts aggregated from poll_votes.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: polls, error: pollErr } = await (supabase as any)
      .from('daily_polls')
      .select('id, question, options, starts_at, ends_at')
      .eq('active', true)
      .gte('ends_at', new Date().toISOString())
      .order('starts_at', { ascending: false })
      .limit(1);

    if (pollErr) {
      console.error('[weekly-poll] GET poll error:', pollErr);
      return NextResponse.json({ success: false, error: 'Failed to fetch poll' }, { status: 500 });
    }
    if (!polls || polls.length === 0) {
      return NextResponse.json({ success: false, error: 'No active poll' }, { status: 404 });
    }

    const poll = polls[0];
    const options: PollOption[] = Array.isArray(poll.options) ? poll.options : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: votes } = await (supabase as any)
      .from('poll_votes')
      .select('option_index')
      .eq('poll_id', poll.id);

    const counts: number[] = options.map(() => 0);
    for (const v of votes ?? []) {
      const idx = typeof v.option_index === 'number' ? v.option_index : -1;
      if (idx >= 0 && idx < counts.length) counts[idx]++;
    }
    const total = counts.reduce((a, b) => a + b, 0);

    return NextResponse.json({
      success: true,
      data: {
        poll_id: poll.id,
        question: poll.question,
        ends_at: poll.ends_at,
        options: options.map((o, i) => ({ index: i, label: o.label, votes: counts[i] })),
        total_votes: total,
      },
    });
  } catch (err) {
    console.error('[weekly-poll] GET unexpected error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/weekly-poll
 * Body: { poll_id: string, option_index: number, fingerprint: string }
 * Duplicate vote by same fingerprint on same poll returns 409.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { poll_id, option_index, fingerprint } = body;

    if (!poll_id || typeof option_index !== 'number' || !fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: poll_id, option_index, fingerprint' },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(ip + fingerprint));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const voter_fingerprint = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const supabase = await createClient();

    // Validate poll exists + option_index in range
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: poll, error: pollErr } = await (supabase as any)
      .from('daily_polls')
      .select('id, options, ends_at')
      .eq('id', poll_id)
      .single();
    if (pollErr || !poll) {
      return NextResponse.json({ success: false, error: 'Poll not found' }, { status: 404 });
    }
    if (new Date(poll.ends_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Poll closed' }, { status: 410 });
    }
    const options: PollOption[] = Array.isArray(poll.options) ? poll.options : [];
    if (option_index < 0 || option_index >= options.length) {
      return NextResponse.json({ success: false, error: 'Invalid option_index' }, { status: 400 });
    }

    // Check for duplicate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('poll_votes')
      .select('id')
      .eq('poll_id', poll_id)
      .eq('voter_fingerprint', voter_fingerprint)
      .limit(1);
    if (existing && existing.length > 0) {
      return NextResponse.json({ success: false, error: 'Already voted' }, { status: 409 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertErr } = await (supabase as any)
      .from('poll_votes')
      .insert({ poll_id, option_index, voter_fingerprint });
    if (insertErr) {
      if (insertErr.code === '23505') {
        return NextResponse.json({ success: false, error: 'Already voted' }, { status: 409 });
      }
      console.error('[weekly-poll] POST insert error:', insertErr);
      return NextResponse.json({ success: false, error: 'Failed to record vote' }, { status: 500 });
    }

    // Return updated counts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: votes } = await (supabase as any)
      .from('poll_votes')
      .select('option_index')
      .eq('poll_id', poll_id);
    const counts: number[] = options.map(() => 0);
    for (const v of votes ?? []) {
      const idx = typeof v.option_index === 'number' ? v.option_index : -1;
      if (idx >= 0 && idx < counts.length) counts[idx]++;
    }
    const total = counts.reduce((a, b) => a + b, 0);

    return NextResponse.json({
      success: true,
      data: {
        poll_id,
        options: options.map((o, i) => ({ index: i, label: o.label, votes: counts[i] })),
        total_votes: total,
      },
    });
  } catch (err) {
    console.error('[weekly-poll] POST unexpected error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
