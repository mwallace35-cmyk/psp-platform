import Link from 'next/link';
import { createStaticClient } from '@/lib/supabase/static';
import { getCurrentSeasonId } from '@/lib/data/seasons';
import { getSchoolDisplayName } from '@/lib/utils/schoolDisplayName';

/**
 * Build the most descriptive game label possible from available fields.
 * Priority: notes (most specific) > constructed from game_type + playoff_round + classification.
 * Returns null for regular-season games (unless notes contain playoff context).
 * Labels are UPPERCASE, max ~15 chars (truncated with ellipsis).
 */
function getGameLabel(game: Record<string, unknown>): string | null {
  const gt = ((game.game_type as string) ?? '').toLowerCase();
  const pr = ((game.playoff_round as string) ?? '').toLowerCase();
  const notes = ((game.notes as string) ?? '').trim();
  const home = game.home_school as Record<string, unknown> | null;
  const away = game.away_school as Record<string, unknown> | null;
  const cls = ((home?.piaa_class as string) ?? (away?.piaa_class as string) ?? '');

  if (gt === 'regular' || gt === '') {
    if (notes && notes.length <= 40 && /final|semi|quarter|playoff|champ|title|round|state|district|piaa|pcl/i.test(notes)) {
      return truncLabel(notes.toUpperCase());
    }
    return null;
  }

  if (notes && notes.length <= 30 && /final|semi|quarter|playoff|champ|round|state|district|piaa|pcl/i.test(notes)) {
    return truncLabel(notes.toUpperCase());
  }

  const roundMap: Record<string, string> = {
    final: 'FINAL', finals: 'FINAL', championship: 'FINAL',
    semifinal: 'SEMIFINAL', 'semi-final': 'SEMIFINAL', semis: 'SEMIFINAL',
    quarterfinal: 'QUARTERFINAL', 'quarter-final': 'QUARTERFINAL', quarters: 'QUARTERFINAL',
    round1: 'R1', 'round 1': 'R1', round2: 'R2', 'round 2': 'R2', round3: 'R3', 'round 3': 'R3',
  };
  const typeMap: Record<string, string> = {
    playoff: 'PLAYOFF', playoffs: 'PLAYOFF', championship: 'FINAL',
    district: 'DISTRICT', state: 'STATE',
  };

  const roundLabel = roundMap[pr] ?? (pr ? pr.toUpperCase() : '');
  const typeLabel = typeMap[gt] ?? gt.toUpperCase();

  let prefix = '';
  if (gt === 'state' || gt === 'piaa') prefix = 'PIAA';
  else if (gt === 'district') prefix = 'DISTRICT';
  else if (gt === 'league' || gt === 'pcl') prefix = 'PCL';

  const parts: string[] = [];
  if (prefix) parts.push(prefix);
  if (cls) parts.push(cls.toUpperCase());
  if (roundLabel) parts.push(roundLabel);
  else parts.push(typeLabel);

  const label = parts.join(' ');
  return truncLabel(label || gt.toUpperCase());
}

function truncLabel(s: string): string {
  if (s.length <= 15) return s;
  return s.slice(0, 14) + '\u2026';
}

export default async function HomeScoresSection() {
  const supabase = createStaticClient();
  const currentSeasonId = await getCurrentSeasonId();

  const recentGamesRes = await supabase
    .from('games')
    .select('id, game_date, sport_id, home_score, away_score, game_type, playoff_round, notes, home_school:home_school_id(name, slug, city, league_id, piaa_class), away_school:away_school_id(name, slug, city, league_id, piaa_class)')
    .not('home_score', 'is', null)
    .gte('game_date', new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10))
    .order('game_date', { ascending: false })
    .limit(8);

  let scoresLabel: 'this-week' | 'recent' = 'this-week';
  let rawGames = recentGamesRes.data ?? [];

  if (rawGames.length === 0) {
    const fallbackRes = await supabase
      .from('games')
      .select('id, game_date, sport_id, home_score, away_score, game_type, playoff_round, notes, home_school:home_school_id(name, slug, city, league_id, piaa_class), away_school:away_school_id(name, slug, city, league_id, piaa_class)')
      .not('home_score', 'is', null)
      .eq('season_id', currentSeasonId)
      .or('home_score.gt.0,away_score.gt.0')
      .order('game_date', { ascending: false })
      .limit(8);
    rawGames = fallbackRes.data ?? [];
    scoresLabel = 'recent';
  }

  const recentGames = rawGames.map((g: Record<string, unknown>) => ({
    ...g,
    home_school: Array.isArray(g.home_school) ? g.home_school[0] : g.home_school,
    away_school: Array.isArray(g.away_school) ? g.away_school[0] : g.away_school,
  }));

  const now = new Date();
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const weekRangeLabel = `${weekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} \u2013 ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <section>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bebas text-gray-100 tracking-wider">
          {scoresLabel === 'this-week' ? 'This Week' : 'Recent Scores'}
        </h2>
        <Link href="/scores" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition">
          All Scores &rarr;
        </Link>
      </div>
      {scoresLabel === 'this-week' ? (
        <p className="text-xs text-gray-300 mb-3">{weekRangeLabel}</p>
      ) : recentGames.length > 0 ? (
        <p className="text-xs text-gray-300 mb-3">No games this week — here are the latest results</p>
      ) : null}
      {recentGames.length > 0 ? (
        <div className="space-y-2">
          {recentGames.map((game: Record<string, unknown>) => {
            const home = game.home_school as Record<string, unknown> | null;
            const away = game.away_school as Record<string, unknown> | null;
            const homeWon = (game.home_score as number) > (game.away_score as number);
            const awayWon = (game.away_score as number) > (game.home_score as number);
            const contextLabel = getGameLabel(game);
            return (
              <Link
                key={game.id as string}
                href={`/${game.sport_id}/games/${game.id}`}
                className="flex flex-col bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-4 py-2.5 hover:border-[var(--psp-gold)]/30 transition group"
              >
                {contextLabel && (
                  <span
                    className="text-[10px] font-bold tracking-wide mb-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]"
                    style={{ color: '#D4A843', textTransform: 'uppercase' }}
                    title={contextLabel}
                  >
                    {contextLabel}
                  </span>
                )}
                <div className="flex items-center w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${awayWon ? 'text-gray-100' : 'text-gray-300'}`}>{away ? getSchoolDisplayName(away as { name: string; city?: string | null; league_id?: number | null }) : 'TBD'}</span>
                    <span className={`text-sm font-bold tabular-nums ${awayWon ? 'text-gray-100' : 'text-gray-300'}`}>{game.away_score as number}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${homeWon ? 'text-gray-100' : 'text-gray-300'}`}>{home ? getSchoolDisplayName(home as { name: string; city?: string | null; league_id?: number | null }) : 'TBD'}</span>
                    <span className={`text-sm font-bold tabular-nums ${homeWon ? 'text-gray-100' : 'text-gray-300'}`}>{game.home_score as number}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 ml-3 shrink-0">
                  {new Date(game.game_date as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-4 py-6 text-center">
          <p className="text-sm text-gray-300">No recent games to show right now.</p>
          <Link href="/scores" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] mt-2 inline-block transition">
            Browse all scores &rarr;
          </Link>
        </div>
      )}
    </section>
  );
}
