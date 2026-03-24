import Link from 'next/link';
import { createStaticClient } from '@/lib/supabase/static';
import { getCurrentSeasonId } from '@/lib/data/seasons';
import { getSchoolDisplayName } from '@/lib/utils/schoolDisplayName';


export default async function HomeScoresSection() {
  const supabase = createStaticClient();
  const currentSeasonId = await getCurrentSeasonId();

  const recentGamesRes = await supabase
    .from('games')
    .select('id, game_date, sport_id, home_score, away_score, home_school:home_school_id(name, slug, city, league_id), away_school:away_school_id(name, slug, city, league_id)')
    .not('home_score', 'is', null)
    .gte('game_date', new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10))
    .order('game_date', { ascending: false })
    .limit(8);

  let scoresLabel: 'this-week' | 'recent' = 'this-week';
  let rawGames = recentGamesRes.data ?? [];

  if (rawGames.length === 0) {
    const fallbackRes = await supabase
      .from('games')
      .select('id, game_date, sport_id, home_score, away_score, home_school:home_school_id(name, slug, city, league_id), away_school:away_school_id(name, slug, city, league_id)')
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
        <p className="text-[11px] text-gray-400 mb-3">{weekRangeLabel}</p>
      ) : recentGames.length > 0 ? (
        <p className="text-[11px] text-gray-400 mb-3">No games this week — here are the latest results</p>
      ) : null}
      {recentGames.length > 0 ? (
        <div className="space-y-2">
          {recentGames.map((game: Record<string, unknown>) => {
            const home = game.home_school as Record<string, unknown> | null;
            const away = game.away_school as Record<string, unknown> | null;
            const homeWon = (game.home_score as number) > (game.away_score as number);
            const awayWon = (game.away_score as number) > (game.home_score as number);
            return (
              <Link
                key={game.id as string}
                href={`/${game.sport_id}/games/${game.id}`}
                className="flex items-center bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-4 py-2.5 hover:border-[var(--psp-gold)]/30 transition group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${awayWon ? 'text-gray-100' : 'text-gray-400'}`}>{away ? getSchoolDisplayName(away as { name: string; city?: string | null; league_id?: number | null }) : 'TBD'}</span>
                    <span className={`text-sm font-bold tabular-nums ${awayWon ? 'text-gray-100' : 'text-gray-400'}`}>{game.away_score as number}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${homeWon ? 'text-gray-100' : 'text-gray-400'}`}>{home ? getSchoolDisplayName(home as { name: string; city?: string | null; league_id?: number | null }) : 'TBD'}</span>
                    <span className={`text-sm font-bold tabular-nums ${homeWon ? 'text-gray-100' : 'text-gray-400'}`}>{game.home_score as number}</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 ml-3 shrink-0">
                  {new Date(game.game_date as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-4 py-6 text-center">
          <p className="text-sm text-gray-400">No recent games to show right now.</p>
          <Link href="/scores" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] mt-2 inline-block transition">
            Browse all scores &rarr;
          </Link>
        </div>
      )}
    </section>
  );
}
