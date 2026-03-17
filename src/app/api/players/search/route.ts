import { createClient, withErrorHandling, withRetry } from '@/lib/data/common';
import { NextRequest, NextResponse } from 'next/server';
interface SearchResult { id: string; name: string; slug: string; school_name: string; school_slug: string; sport: string; position?: string; grad_year?: number; }
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const sport = request.nextUrl.searchParams.get('sport');
  if (!q || q.trim().length === 0) return NextResponse.json([], { status: 200 });
  if (!sport || !['football', 'basketball'].includes(sport)) return NextResponse.json({ error: 'Invalid sport parameter. Use football or basketball.' }, { status: 400 });
  const results = await withErrorHandling(async () => {
    return withRetry(async () => {
      const supabase = await createClient();
      const sportTable = sport === 'football' ? 'football_player_seasons' : 'basketball_player_seasons';
      const { data, error } = await supabase.from(sportTable).select('player_id, players!inner(id, name, slug, position, grad_year, schools:schools!players_primary_school_id_fkey(name, slug))').ilike('players.name', '%' + q.trim() + '%').limit(20);
      if (error) throw error;
      if (!data || data.length === 0) return [] as SearchResult[];
      const seen = new Set<string>();
      const unique: SearchResult[] = [];
      for (const row of data) {
        const p = (row as any).players;
        if (!p || seen.has(row.player_id)) continue;
        seen.add(row.player_id);
        unique.push({ id: p.id, name: p.name, slug: p.slug, sport, position: p.position, grad_year: p.grad_year, school_name: p.schools?.name ?? 'Unknown School', school_slug: p.schools?.slug ?? '' });
        if (unique.length >= 10) break;
      }
      return unique;
    }, { maxRetries: 2, baseDelay: 500 });
  }, [] as SearchResult[], 'PLAYERS_SEARCH', {});
  return NextResponse.json(results, { status: 200, headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
}