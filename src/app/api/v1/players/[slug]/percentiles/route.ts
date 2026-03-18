import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const revalidate = 3600;

interface RouteParams { params: Promise<{ slug: string }> }

function percentile(value: number, allValues: number[]): number {
  if (allValues.length === 0) return 0;
  const below = allValues.filter(v => v < value).length;
  return Math.round((below / allValues.length) * 100);
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Step 1: look up the player by slug only (no embedded joins to avoid FK ambiguity)
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id, slug')
    .eq('slug', slug)
    .single();

  if (!player) {
    return NextResponse.json({ error: 'Player not found', detail: playerError?.message }, { status: 404 });
  }

  // Step 2: fetch football and basketball seasons separately by player_id
  const [{ data: fbSeasons, error: fbErr }, { data: bkSeasons, error: bkErr }] = await Promise.all([
    supabase
      .from('football_player_seasons')
      .select('rush_yards, rush_tds, pass_yards, pass_tds, rec_yards, rec_tds')
      .eq('player_id', player.id),
    supabase
      .from('basketball_player_seasons')
      .select('points, ppg, rebounds, rpg, assists, apg, games_played')
      .eq('player_id', player.id),
  ]);

  type FbRow = { rush_yards: number; rush_tds: number; pass_yards: number; pass_tds: number; rec_yards: number; rec_tds: number };
  type BkRow = { points: number; ppg: number; rebounds: number; rpg: number; assists: number; apg: number; games_played: number };

  const fb = (fbSeasons as FbRow[] | null) ?? [];
  const bk = (bkSeasons as BkRow[] | null) ?? [];

  if (fb.length > 0) {
    const { data: allFb } = await supabase
      .from('football_player_seasons')
      .select('player_id, rush_yards, rush_tds, pass_yards, pass_tds, rec_yards, rec_tds')
      .gt('rush_yards', 0);

    if (!allFb) return NextResponse.json({ error: 'Could not load data' }, { status: 500 });

    type FbTotal = { rush_yards: number; rush_tds: number; pass_yards: number; pass_tds: number; rec_yards: number; rec_tds: number };
    const totals: Record<string, FbTotal> = {};
    for (const row of allFb) {
      const pid = String(row.player_id);
      if (!totals[pid]) totals[pid] = { rush_yards: 0, rush_tds: 0, pass_yards: 0, pass_tds: 0, rec_yards: 0, rec_tds: 0 };
      totals[pid].rush_yards += row.rush_yards ?? 0;
      totals[pid].rush_tds += row.rush_tds ?? 0;
      totals[pid].pass_yards += row.pass_yards ?? 0;
      totals[pid].pass_tds += row.pass_tds ?? 0;
      totals[pid].rec_yards += row.rec_yards ?? 0;
      totals[pid].rec_tds += row.rec_tds ?? 0;
    }
    const allPlayers = Object.values(totals);
    const myTotal = fb.reduce((a, s) => ({
      rush_yards: a.rush_yards + (s.rush_yards ?? 0),
      rush_tds: a.rush_tds + (s.rush_tds ?? 0),
      pass_yards: a.pass_yards + (s.pass_yards ?? 0),
      pass_tds: a.pass_tds + (s.pass_tds ?? 0),
      rec_yards: a.rec_yards + (s.rec_yards ?? 0),
      rec_tds: a.rec_tds + (s.rec_tds ?? 0),
    }), { rush_yards: 0, rush_tds: 0, pass_yards: 0, pass_tds: 0, rec_yards: 0, rec_tds: 0 });

    return NextResponse.json({
      sport: 'football',
      totalPlayers: allPlayers.length,
      percentiles: {
        rushYards: percentile(myTotal.rush_yards, allPlayers.map(p => p.rush_yards)),
        rushTDs: percentile(myTotal.rush_tds, allPlayers.map(p => p.rush_tds)),
        passYards: percentile(myTotal.pass_yards, allPlayers.map(p => p.pass_yards)),
        passTDs: percentile(myTotal.pass_tds, allPlayers.map(p => p.pass_tds)),
        recYards: percentile(myTotal.rec_yards, allPlayers.map(p => p.rec_yards)),
        recTDs: percentile(myTotal.rec_tds, allPlayers.map(p => p.rec_tds)),
      },
      careerTotals: myTotal,
    });
  }

  if (bk.length > 0) {
    const { data: allBk } = await supabase
      .from('basketball_player_seasons')
      .select('player_id, points, ppg, rebounds, rpg, assists, apg, games_played')
      .gt('points', 0);

    if (!allBk) return NextResponse.json({ error: 'Could not load data' }, { status: 500 });

    type BkTotal = { points: number; rebounds: number; assists: number; games: number; bestPpg: number };
    const totals: Record<string, BkTotal> = {};
    for (const row of allBk) {
      const pid = String(row.player_id);
      if (!totals[pid]) totals[pid] = { points: 0, rebounds: 0, assists: 0, games: 0, bestPpg: 0 };
      totals[pid].points += row.points ?? 0;
      totals[pid].rebounds += row.rebounds ?? 0;
      totals[pid].assists += row.assists ?? 0;
      totals[pid].games += row.games_played ?? 0;
      totals[pid].bestPpg = Math.max(totals[pid].bestPpg, row.ppg ?? 0);
    }
    const allPlayers = Object.values(totals);
    const myTotal = bk.reduce((a, s) => ({
      points: a.points + (s.points ?? 0),
      rebounds: a.rebounds + (s.rebounds ?? 0),
      assists: a.assists + (s.assists ?? 0),
      games: a.games + (s.games_played ?? 0),
      bestPpg: Math.max(a.bestPpg, s.ppg ?? 0),
    }), { points: 0, rebounds: 0, assists: 0, games: 0, bestPpg: 0 });

    return NextResponse.json({
      sport: 'basketball',
      totalPlayers: allPlayers.length,
      percentiles: {
        careerPoints: percentile(myTotal.points, allPlayers.map(p => p.points)),
        careerRebounds: percentile(myTotal.rebounds, allPlayers.map(p => p.rebounds)),
        careerAssists: percentile(myTotal.assists, allPlayers.map(p => p.assists)),
        bestPpg: percentile(myTotal.bestPpg, allPlayers.map(p => p.bestPpg)),
      },
      careerTotals: myTotal,
    });
  }

  return NextResponse.json({ sport: 'none', percentiles: {}, totalPlayers: 0, _debug: { playerId: player.id, playerSlug: player.slug, fbErr: fbErr?.message, bkErr: bkErr?.message, fbCount: fb.length, bkCount: bk.length } });
}
