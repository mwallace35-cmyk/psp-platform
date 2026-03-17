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
      const { data: players, error: pErr } = await supabase.from('players').select('id, name, slug, position, grad_year, primary_school_id').ilike('name', '%' + q.trim() + '%').limit(20);
      if (pErr) throw pErr;
      if (!players || players.length === 0) return [] as SearchResult[];
      const sportTable = sport === 'football' ? 'football_player_seasons' : 'basketball_player_seasons';
      const { data: ss, error: sErr } = await supabase.from(sportTable).select('player_id').in('player_id', players.map((p: any) => p.id));
      if (sErr) throw sErr;
      const validIds = new Set((ss ?? []).map((s: any) => s.player_id));
      const fp = players.filter((p: any) => validIds.has(p.id));
      if (fp.length === 0) return [] as SearchResult[];
      const schoolIds = [...new Set(fp.map((p: any) => p.primary_school_id).filter(Boolean))];
      const sm: Record<string, { name: string; slug: string }> = {};
      if (schoolIds.length > 0) { const { data: schools } = await supabase.from('schools').select('id, name, slug').in('id', schoolIds); for (const s of schools ?? []) sm[s.id] = { name: s.name, slug: s.slug }; }
      return fp.slice(0, 10).map((p: any) => ({ id: p.id, name: p.name, slug: p.slug, sport, position: p.position, grad_year: p.grad_year, school_name: sm[p.primary_school_id]?.name ?? 'Unknown School', school_slug: sm[p.primary_school_id]?.slug ?? '' })) as SearchResult[];
    }, { maxRetries: 2, baseDelay: 500 });
  }, [] as SearchResult[], 'PLAYERS_SEARCH', {});
  return NextResponse.json(results, { status: 200, headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
}