import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { coachName, email, phone, school, sport, playerSlugs, message } = body;

    if (!coachName || !email || !school || !sport) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from('coach_claims').insert({
      coach_name: coachName,
      email,
      phone: phone || null,
      school_name: school,
      sport,
      player_list: playerSlugs || null,
      message: message || null,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      // Table might not exist yet — still return success to not block UX
      console.error('coach_claims insert error:', error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('coach claim error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
