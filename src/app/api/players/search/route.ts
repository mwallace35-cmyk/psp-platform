import { createClient, withErrorHandling, withRetry } from '@/lib/data/common';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const sport = request.nextUrl.searchParams.get('sport');

  if (!q || q.trim().length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  return withErrorHandling(
    async () =>
      withRetry(
        async () => {
          const supabase = await createClient();

          let query = supabase
            .from('players')
            .select('id, name, slug, sport, grad_year, schools:schools!players_primary_school_id_fkey(name, slug)')
            .ilike('name', `%${q.trim()}%`)
            .limit(10);

          if (sport && ['football', 'basketball', 'baseball', 'soccer', 'lacrosse', 'wrestling', 'track'].includes(sport)) {
            query = query.eq('sport', sport);
          }

          const { data, error } = await query;

          if (error) {
            return NextResponse.json({ error: 'Search failed' }, { status: 500 });
          }

          const results = (data ?? []).map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            sport: p.sport,
            grad_year: p.grad_year,
            school_name: p.schools?.name ?? 'Unknown School',
            school_slug: p.schools?.slug ?? '',
          }));

          return NextResponse.json(results, {
            status: 200,
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
          });
        },
        { maxRetries: 2, baseDelay: 300 }
      ),
    NextResponse.json([], { status: 200 }),
    'API_PLAYERS_SEARCH',
    { q, sport }
  );
}
