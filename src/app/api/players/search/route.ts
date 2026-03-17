import { createClient, withErrorHandling, withRetry } from '@/lib/data/common';
import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  school_name: string;
  school_slug: string;
  sport: string | null;
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

  const results = await withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const { data: players, error: pErr } = await supabase
            .from('players')
            .select('id, name, slug, position, grad_year, primary_school_id')
            .ilike('name', `%${q.trim()}%`)
            .limit(20);

          if (pErr) throw pErr;
          if (!players || players.length === 0) return [] as SearchResult[];

          const playerIds = players.map((p: any) => p.id);
          const { data: seasons } = await supabase
            .from('player_seasons')
            .select('player_id, sport')
            .in('player_id', playerIds)
            .eq('sport', sport);

          const validPlayerIds = new Set((seasons ?? []).map((s: any) => s.player_id));
          const filteredPlayers = players.filter((p: any) => validPlayerIds.has(p.id));

          if (filteredPlayers.length === 0) return [] as SearchResult[];

          const schoolIds = [...new Set(filteredPlayers.map((p: any) => p.primary_school_id).filter(Boolean))];
          let schoolMap: Record<string, { name: string; slug: string }> = {};

          if (schoolIds.length > 0) {
            const { data: schools } = await supabase
              .from('schools')
              .select('id, name, slug')
              .in('id', schoolIds);
            for (const s of schools ?? []) {
              schoolMap[s.id] = { name: s.name, slug: s.slug };
            }
          }

          return filteredPlayers.slice(0, 10).map((player: any) => ({
            id: player.id,
            name: player.name,
            slug: player.slug,
            sport: sport,
            position: player.position,
            grad_year: player.grad_year,
            school_name: schoolMap[player.primary_school_id]?.name ?? 'Unknown School',
            school_slug: schoolMap[player.primary_school_id]?.slug ?? '',
          })) as SearchResult[];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [] as SearchResult[],
    'PLAYERS_SEARCH',
    {}
  );

  return NextResponse.json(results, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
