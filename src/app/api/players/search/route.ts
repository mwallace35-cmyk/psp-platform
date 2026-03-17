import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  school_name: string;
  school_slug: string;
  sport: string;
  position?: string;
  grad_year?: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const sport = searchParams.get('sport');

  if (!q || q.trim().length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  if (!sport || !['football', 'basketball'].includes(sport)) {
    return NextResponse.json(
      { error: 'Invalid sport parameter. Use football or basketball.' },
      { status: 400 }
    );
  }

  try {
    // Use direct Supabase client — the @/lib/data/common createClient() is
    // designed for ISR/static Server Components and hangs in API route context.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // The players table has NO 'sport' column.
    // Sport membership is determined by rows in football_player_seasons /
    // basketball_player_seasons. Use PostgREST !inner to INNER JOIN and
    // filter players to only those present in the target sport's season table.
    const seasonTable =
      sport === 'football'
        ? 'football_player_seasons'
        : 'basketball_player_seasons';

    const { data: players, error: pErr } = await supabase
      .from('players')
      .select(
        `id, name, slug, graduation_year, positions, primary_school_id, ${seasonTable}!inner(player_id)`
      )
      .ilike('name', `%${q.trim()}%`)
      .is('deleted_at', null)
      .limit(10);

    if (pErr) throw pErr;
    if (!players || players.length === 0) {
      return NextResponse.json([], {
        status: 200,
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
      });
    }

    // Step 2: Fetch school names for matched players
    const schoolIds = [
      ...new Set(players.map((p: any) => p.primary_school_id).filter(Boolean)),
    ];
    const schoolMap: Record<string, { name: string; slug: string }> = {};

    if (schoolIds.length > 0) {
      const { data: schools } = await supabase
        .from('schools')
        .select('id, name, slug')
        .in('id', schoolIds);

      for (const s of schools ?? []) {
        schoolMap[s.id] = { name: s.name, slug: s.slug };
      }
    }

    const results: SearchResult[] = players.map((player: any) => ({
      id: player.id,
      name: player.name,
      slug: player.slug,
      sport,
      // positions is TEXT[] — take first entry for display
      position: Array.isArray(player.positions)
        ? player.positions[0]
        : player.positions ?? undefined,
      // DB column is graduation_year; SearchResult field is grad_year
      grad_year: player.graduation_year ?? undefined,
      school_name: schoolMap[player.primary_school_id]?.name ?? 'Unknown School',
      school_slug: schoolMap[player.primary_school_id]?.slug ?? '',
    }));

    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err: any) {
    console.error('PLAYERS_SEARCH error:', err);
    return NextResponse.json(
      { error: 'Search failed', detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
