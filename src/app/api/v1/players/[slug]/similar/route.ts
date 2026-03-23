import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 3600;
export const dynamic = "force-dynamic";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sport = request.nextUrl.searchParams.get('sport') ?? null;

  // Step 1: Look up player by slug
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id, slug, name, positions, graduation_year')
    .eq('slug', slug)
    .single();

  if (!player) {
    return NextResponse.json(
      { error: 'Player not found', detail: playerError?.message },
      { status: 404 }
    );
  }

  // Step 2: Get career stats to determine sport and primary stat
  const [{ data: fbSeasons }, { data: bkSeasons }] = await Promise.all([
    supabase
      .from('football_player_seasons')
      .select('rush_yards, pass_yards, rec_yards')
      .eq('player_id', player.id),
    supabase
      .from('basketball_player_seasons')
      .select('points')
      .eq('player_id', player.id),
  ]);

  const hasFb = fbSeasons && fbSeasons.length > 0;
  const hasBk = bkSeasons && bkSeasons.length > 0;

  // Resolve sport — respect ?sport= param, fall back to football-first
  let resolvedSport: string;
  if (sport === 'basketball' && hasBk) {
    resolvedSport = 'basketball';
  } else if (sport === 'football' && hasFb) {
    resolvedSport = 'football';
  } else if (hasFb) {
    resolvedSport = 'football';
  } else if (hasBk) {
    resolvedSport = 'basketball';
  } else {
    return NextResponse.json(
      { error: 'No season data found for player' },
      { status: 404 }
    );
  }

  // Step 3: Compute primary stat for the RPC
  let rpcName: string;
  let primaryStat: number;

  if (resolvedSport === 'football') {
    const totalRush = (fbSeasons ?? []).reduce((sum, s) => sum + (s.rush_yards ?? 0), 0);
    const totalPass = (fbSeasons ?? []).reduce((sum, s) => sum + (s.pass_yards ?? 0), 0);
    const totalRec  = (fbSeasons ?? []).reduce((sum, s) => sum + (s.rec_yards  ?? 0), 0);
    primaryStat = Math.max(totalRush, totalPass, totalRec);
    rpcName = 'get_similar_football_players';
  } else {
    primaryStat = (bkSeasons ?? []).reduce((sum, s) => sum + (s.points ?? 0), 0);
    rpcName = 'get_similar_basketball_players';
  }

  // Step 4: Call the RPC
  const { data: similar, error: rpcError } = await supabase.rpc(rpcName, {
    target_player_id: player.id,
    target_positions: player.positions ?? [],
    target_primary_stat: primaryStat,
    target_graduation_year: player.graduation_year ?? 2000,
    result_limit: 5,
  });

  if (rpcError) {
    return NextResponse.json(
      { error: 'RPC error', detail: rpcError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    player: { id: player.id, slug: player.slug, name: player.name },
    sport: resolvedSport,
    primaryStat,
    similar: similar ?? [],
  });
}
