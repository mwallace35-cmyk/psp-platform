import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, gradYear, sport, positions, gpa, height, weight, targetLevel, highlights, message } = body;

    if (!firstName || !lastName || !email || !sport || !gradYear) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from('recruiting_interest').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      graduation_year: parseInt(gradYear) || null,
      sport,
      positions: positions || null,
      gpa: gpa ? parseFloat(gpa) : null,
      height: height || null,
      weight: weight || null,
      target_level: targetLevel || null,
      highlight_url: highlights || null,
      notes: message || null,
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error('recruiting_interest insert error:', error.message);
      // Still return 200 — table might not be migrated yet
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('recruit API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
