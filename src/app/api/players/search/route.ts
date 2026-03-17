import { createClient } from '@/lib/data/common';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  const sport = request.nextUrl.searchParams.get('sport') ?? '';
  if (!q) return NextResponse.json({ error: 'missing q' }, { status: 400 });
  if (!['football','basketball'].includes(sport)) return NextResponse.json({ error: 'bad sport' }, { status: 400 });
  try {
    const supabase = await createClient();
    const r1 = await supabase.from('players').select('id, name, slug').ilike('name', '%' + q + '%').limit(5);
    const sportTable = sport === 'football' ? 'football_player_seasons' : 'basketball_player_seasons';
    const r2 = await supabase.from(sportTable).select('player_id').limit(3);
    return NextResponse.json({ players_query: { data: r1.data, error: r1.error, count: r1.data?.length }, sport_table_sample: { data: r2.data, error: r2.error } });
  } catch (e: any) {
    return NextResponse.json({ thrown: String(e) }, { status: 500 });
  }
}