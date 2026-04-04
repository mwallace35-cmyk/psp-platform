import { NextRequest, NextResponse } from 'next/server';
import { createStaticClient } from '@/lib/supabase/static';

export const runtime = 'nodejs';
export const revalidate = 600;

interface TeamResumeResponse {
  stats: {
    record: string;
    win_pct: number;
    ppg: number;
    opp_ppg: number;
    avg_margin: number;
  };
  key_results: {
    type: 'best_win' | 'worst_loss' | 'notable';
    result: 'W' | 'L';
    opponent: string;
    opponent_slug: string;
    score: string;
  }[];
  key_players: {
    name: string;
    slug: string;
    position: string;
    stats_line: string;
  }[];
  upcoming: {
    date: string;
    opponent: string;
    opponent_slug: string;
    opponent_rank: number | null;
  }[];
}

/**
 * GET /api/rankings/team-resume?school_id=X&sport=Y&season_id=Z
 * Returns a team resume for rankings context: record, key results, top players, upcoming.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('school_id');
    const sport = searchParams.get('sport');
    const seasonId = searchParams.get('season_id');

    if (!schoolId || !sport || !seasonId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: school_id, sport, season_id' },
        { status: 400 }
      );
    }

    const supabase = createStaticClient();
    const now = new Date().toISOString();

    // Run all queries in parallel
    const [statsResult, keyResultsResult, keyPlayersResult, upcomingResult] = await Promise.allSettled([
      // a. Stats: record, ppg, opp_ppg, margin from games
      supabase
        .from('games')
        .select('home_school_id, away_school_id, home_score, away_score')
        .eq('season_id', seasonId)
        .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`),

      // b. Key results: all games for this school/season (we'll sort client-side)
      supabase
        .from('games')
        .select('home_school_id, away_school_id, home_score, away_score, game_date, home_school:schools!games_home_school_id_fkey(name, slug), away_school:schools!games_away_school_id_fkey(name, slug)')
        .eq('season_id', seasonId)
        .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
        .not('home_score', 'is', null)
        .not('away_score', 'is', null)
        .order('game_date', { ascending: false }),

      // c. Key players: top 3 from sport-specific season table
      sport === 'football'
        ? supabase
            .from('football_player_seasons')
            .select('player_id, rush_yards, pass_yards, rec_yards, rush_td, pass_td, rec_td, players(name, slug, positions)')
            .eq('season_id', seasonId)
            .eq('school_id', schoolId)
            .order('rush_yards', { ascending: false })
            .limit(3)
        : supabase
            .from('basketball_player_seasons')
            .select('player_id, points, ppg, rebounds, assists, games_played, players(name, slug, positions)')
            .eq('season_id', seasonId)
            .eq('school_id', schoolId)
            .order('ppg', { ascending: false })
            .limit(3),

      // d. Upcoming games
      supabase
        .from('games')
        .select('game_date, home_school_id, away_school_id, home_school:schools!games_home_school_id_fkey(name, slug), away_school:schools!games_away_school_id_fkey(name, slug)')
        .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
        .gt('game_date', now)
        .order('game_date', { ascending: true })
        .limit(2),
    ]);

    // Process stats
    let stats: TeamResumeResponse['stats'] = {
      record: '0-0',
      win_pct: 0,
      ppg: 0,
      opp_ppg: 0,
      avg_margin: 0,
    };

    if (statsResult.status === 'fulfilled' && statsResult.value.data) {
      const games = statsResult.value.data;
      let wins = 0;
      let losses = 0;
      let totalPf = 0;
      let totalPa = 0;
      let counted = 0;

      for (const g of games) {
        if (g.home_score == null || g.away_score == null) continue;
        counted++;
        const isHome = String(g.home_school_id) === schoolId;
        const pf = isHome ? g.home_score : g.away_score;
        const pa = isHome ? g.away_score : g.home_score;
        totalPf += pf;
        totalPa += pa;
        if (pf > pa) wins++;
        else if (pa > pf) losses++;
      }

      const total = wins + losses;
      stats = {
        record: `${wins}-${losses}`,
        win_pct: total > 0 ? Math.round((wins / total) * 1000) / 1000 : 0,
        ppg: counted > 0 ? Math.round((totalPf / counted) * 10) / 10 : 0,
        opp_ppg: counted > 0 ? Math.round((totalPa / counted) * 10) / 10 : 0,
        avg_margin: counted > 0 ? Math.round(((totalPf - totalPa) / counted) * 10) / 10 : 0,
      };
    }

    // Process key results: top 3 best wins (largest margin) + worst loss
    const keyResults: TeamResumeResponse['key_results'] = [];
    if (keyResultsResult.status === 'fulfilled' && keyResultsResult.value.data) {
      const games = keyResultsResult.value.data;

      const processed = games.map((g) => {
        const isHome = String(g.home_school_id) === schoolId;
        const pf = isHome ? g.home_score! : g.away_score!;
        const pa = isHome ? g.away_score! : g.home_score!;
        const won = pf > pa;
        const margin = pf - pa;
        const oppSchool = isHome
          ? (Array.isArray(g.away_school) ? g.away_school[0] : g.away_school)
          : (Array.isArray(g.home_school) ? g.home_school[0] : g.home_school);

        return {
          result: (won ? 'W' : 'L') as 'W' | 'L',
          opponent: oppSchool?.name ?? 'Unknown',
          opponent_slug: oppSchool?.slug ?? '',
          score: `${pf}-${pa}`,
          margin,
        };
      });

      // Best wins: top 3 by margin (positive = win)
      const wins = processed.filter((g) => g.result === 'W').sort((a, b) => b.margin - a.margin);
      for (const w of wins.slice(0, 3)) {
        keyResults.push({
          type: 'best_win',
          result: w.result,
          opponent: w.opponent,
          opponent_slug: w.opponent_slug,
          score: w.score,
        });
      }

      // Worst loss: smallest (most negative) margin
      const losses = processed.filter((g) => g.result === 'L').sort((a, b) => a.margin - b.margin);
      if (losses.length > 0) {
        const worst = losses[0];
        keyResults.push({
          type: 'worst_loss',
          result: worst.result,
          opponent: worst.opponent,
          opponent_slug: worst.opponent_slug,
          score: worst.score,
        });
      }
    }

    // Process key players
    const keyPlayers: TeamResumeResponse['key_players'] = [];
    if (keyPlayersResult.status === 'fulfilled' && keyPlayersResult.value.data) {
      const players = keyPlayersResult.value.data;

      for (const p of players) {
        const player = Array.isArray(p.players) ? p.players[0] : p.players;
        if (!player) continue;

        const positions = Array.isArray(player.positions) ? player.positions : [];
        const position = positions[0] ?? '';

        let statsLine = '';
        if (sport === 'football') {
          const fp = p as { rush_yards?: number; pass_yards?: number; rec_yards?: number; rush_td?: number; pass_td?: number; rec_td?: number };
          const totalYards = (fp.rush_yards || 0) + (fp.pass_yards || 0) + (fp.rec_yards || 0);
          const totalTds = (fp.rush_td || 0) + (fp.pass_td || 0) + (fp.rec_td || 0);
          statsLine = `${totalYards} yds, ${totalTds} TD`;
        } else {
          const bp = p as { ppg?: number; rebounds?: number; assists?: number };
          statsLine = `${bp.ppg ?? 0} ppg, ${bp.rebounds ?? 0} reb, ${bp.assists ?? 0} ast`;
        }

        keyPlayers.push({
          name: player.name,
          slug: player.slug,
          position,
          stats_line: statsLine,
        });
      }
    }

    // Process upcoming games
    const upcoming: TeamResumeResponse['upcoming'] = [];
    if (upcomingResult.status === 'fulfilled' && upcomingResult.value.data) {
      for (const g of upcomingResult.value.data) {
        const isHome = String(g.home_school_id) === schoolId;
        const oppSchool = isHome
          ? (Array.isArray(g.away_school) ? g.away_school[0] : g.away_school)
          : (Array.isArray(g.home_school) ? g.home_school[0] : g.home_school);

        // Check if opponent is ranked
        const oppId = isHome ? g.away_school_id : g.home_school_id;
        let oppRank: number | null = null;

        const { data: rankData } = await supabase
          .from('power_rankings')
          .select('rank_position')
          .eq('school_id', oppId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (rankData) {
          oppRank = rankData.rank_position;
        }

        upcoming.push({
          date: g.game_date,
          opponent: oppSchool?.name ?? 'Unknown',
          opponent_slug: oppSchool?.slug ?? '',
          opponent_rank: oppRank,
        });
      }
    }

    const response: TeamResumeResponse = {
      stats,
      key_results: keyResults,
      key_players: keyPlayers,
      upcoming,
    };

    return NextResponse.json(
      { success: true, data: response },
      {
        headers: {
          'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600',
        },
      }
    );
  } catch (err) {
    console.error('[rankings/team-resume] GET unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
