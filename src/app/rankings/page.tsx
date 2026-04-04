import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';
import { Breadcrumb } from '@/components/ui';
import RankingsClient from './RankingsClient';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Power Rankings \u2014 The Pulse | PhillySportsPack.com',
  description: 'Weekly power rankings for Philadelphia high school sports \u2014 football, basketball, baseball, and more.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/rankings' },
  robots: { index: true, follow: true },
};

const RANKED_SPORTS = ['football', 'basketball', 'baseball'];

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const params = await searchParams;
  const activeSport = params.sport || 'football';
  const supabase = createStaticClient();

  // === Primary query: all rankings for active sport (all weeks) ===
  const rankingsPromise = supabase
    .from('power_rankings')
    .select('*, schools(name, slug, colors, mascot)')
    .eq('sport_id', activeSport)
    .order('published_at', { ascending: false })
    .order('rank_position', { ascending: true })
    .limit(200);

  // === Showcase data: for #1 team per category, get game stats + key player ===
  // We'll compute this after we have rankings
  const [rankingsResult] = await Promise.all([rankingsPromise]);

  const rankings = rankingsResult.data ?? [];

  const rankedData = rankings.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    sport_id: r.sport_id as string,
    school_id: r.school_id as number,
    season_id: r.season_id as number | null,
    week_label: r.week_label as string,
    ranking_type: (r.ranking_type as string) || 'in_season',
    ranking_category: (r.ranking_category as string) || 'city',
    rank_position: r.rank_position as number,
    previous_rank: r.previous_rank as number | null,
    record_display: r.record_display as string | null,
    blurb: r.blurb as string | null,
    published_at: r.published_at as string,
    schools: r.schools as { name: string; slug: string; colors: Record<string, string> | null; mascot: string | null } | null,
  }));

  // Determine current week rankings for additional queries
  const weekDates: Record<string, string> = {};
  rankedData.forEach(r => {
    if (!weekDates[r.week_label] || r.published_at > weekDates[r.week_label]) {
      weekDates[r.week_label] = r.published_at;
    }
  });
  const weeks = Object.keys(weekDates).sort((a, b) => weekDates[b].localeCompare(weekDates[a]));
  const currentWeekLabel = weeks[0] || '';
  const currentWeekRankings = rankedData.filter(r => r.week_label === currentWeekLabel);
  const currentWeekIds = currentWeekRankings.map(r => r.id);

  // Find #1 teams per category for showcase data
  const topTeams: Record<string, typeof rankedData[0]> = {};
  for (const r of currentWeekRankings) {
    const cat = r.ranking_category || 'city';
    if (!topTeams[cat] || r.rank_position < topTeams[cat].rank_position) {
      topTeams[cat] = r;
    }
  }

  // === Additional queries using Promise.allSettled ===
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const additionalQueries: Record<string, PromiseLike<any>> = {};

  // Showcase data for each #1 team: game stats
  for (const [cat, team] of Object.entries(topTeams)) {
    const schoolId = team.school_id;
    if (!schoolId) continue;

    // Game stats: wins, losses, avg points scored, avg points allowed
    additionalQueries[`showcase_home_${cat}`] = supabase
      .from('games')
      .select('home_score, away_score')
      .eq('home_school_id', schoolId)
      .eq('sport_id', activeSport)
      .not('home_score', 'is', null)
      .not('away_score', 'is', null);

    additionalQueries[`showcase_away_${cat}`] = supabase
      .from('games')
      .select('home_score, away_score')
      .eq('away_school_id', schoolId)
      .eq('sport_id', activeSport)
      .not('home_score', 'is', null)
      .not('away_score', 'is', null);

    // Key player: top scorer for that school this season
    if (activeSport === 'basketball' && team.season_id) {
      additionalQueries[`showcase_player_${cat}`] = supabase
        .from('basketball_player_seasons')
        .select('ppg, players(name, slug)')
        .eq('school_id', schoolId)
        .eq('season_id', team.season_id)
        .order('ppg', { ascending: false })
        .limit(1);
    } else if (activeSport === 'football' && team.season_id) {
      additionalQueries[`showcase_player_${cat}`] = (supabase as any)
        .from('football_player_seasons')
        .select('rush_yards, pass_yards, rec_yards, rush_td, pass_td, rec_td, players(name, slug)')
        .eq('school_id', schoolId)
        .eq('season_id', team.season_id)
        .order('rush_yards', { ascending: false })
        .limit(3);
    }
  }

  // Cross-tier spotlight: upcoming games where both teams are ranked in different categories
  additionalQueries['spotlight_games'] = supabase
    .from('games')
    .select('id, game_date, home_school_id, away_school_id, home_score, away_score, schools!games_home_school_id_fkey(name, slug), away_school:schools!games_away_school_id_fkey(name, slug)')
    .eq('sport_id', activeSport)
    .gte('game_date', new Date().toISOString().split('T')[0])
    .is('home_score', null)
    .order('game_date', { ascending: true })
    .limit(50);

  // Snub poll: query for current sport + most recent week
  additionalQueries['snub_poll'] = (supabase as any)
    .from('snub_polls')
    .select('id')
    .eq('sport_id', activeSport)
    .eq('week_label', currentWeekLabel)
    .order('created_at', { ascending: false })
    .limit(1);

  // Vote counts: aggregated by ranking_id for current week
  additionalQueries['vote_counts'] = (supabase as any)
    .from('ranking_votes')
    .select('ranking_id, vote_type')
    .in('ranking_id', currentWeekIds.length > 0 ? currentWeekIds : ['__none__']);

  // Execute all additional queries in parallel (wrap PromiseLike into real Promises)
  const queryKeys = Object.keys(additionalQueries);
  const queryResults = await Promise.allSettled(
    Object.values(additionalQueries).map(q => Promise.resolve(q))
  );

  const settled: Record<string, unknown> = {};
  queryKeys.forEach((key, i) => {
    const result = queryResults[i];
    if (result.status === 'fulfilled') {
      const val = result.value as { data?: unknown };
      settled[key] = val?.data ?? null;
    } else {
      settled[key] = null;
    }
  });

  // === Build showcase data per category ===
  const showcaseData: Record<string, { ppg: number; margin: number; win_pct: number; key_player?: { name: string; slug: string; stats_line: string } } | null> = {};

  for (const [cat, team] of Object.entries(topTeams)) {
    const homeGames = (settled[`showcase_home_${cat}`] as { home_score: number; away_score: number }[] | null) ?? [];
    const awayGames = (settled[`showcase_away_${cat}`] as { home_score: number; away_score: number }[] | null) ?? [];

    const allGames = [
      ...homeGames.map(g => ({ scored: g.home_score, allowed: g.away_score, won: g.home_score > g.away_score })),
      ...awayGames.map(g => ({ scored: g.away_score, allowed: g.home_score, won: g.away_score > g.home_score })),
    ];

    if (allGames.length === 0) {
      showcaseData[cat] = null;
      continue;
    }

    const totalScored = allGames.reduce((s, g) => s + g.scored, 0);
    const totalAllowed = allGames.reduce((s, g) => s + g.allowed, 0);
    const wins = allGames.filter(g => g.won).length;
    const ppg = totalScored / allGames.length;
    const margin = (totalScored - totalAllowed) / allGames.length;
    const win_pct = wins / allGames.length;

    let key_player: { name: string; slug: string; stats_line: string } | undefined;

    if (activeSport === 'basketball') {
      const playerData = settled[`showcase_player_${cat}`] as Array<{ ppg: number; players: { name: string; slug: string } | { name: string; slug: string }[] | null }> | null;
      if (playerData && playerData.length > 0) {
        const p = playerData[0];
        const player = Array.isArray(p.players) ? p.players[0] : p.players;
        if (player) {
          key_player = {
            name: player.name,
            slug: player.slug,
            stats_line: `${p.ppg?.toFixed(1) ?? '0'} PPG`,
          };
        }
      }
    } else if (activeSport === 'football') {
      const playerData = settled[`showcase_player_${cat}`] as Array<{ rush_yards: number; pass_yards: number; rec_yards: number; rush_td: number; pass_td: number; rec_td: number; players: { name: string; slug: string } | { name: string; slug: string }[] | null }> | null;
      if (playerData && playerData.length > 0) {
        // Pick the player with most total yards
        let best = playerData[0];
        let bestYards = (best.rush_yards || 0) + (best.pass_yards || 0) + (best.rec_yards || 0);
        for (const p of playerData) {
          const total = (p.rush_yards || 0) + (p.pass_yards || 0) + (p.rec_yards || 0);
          if (total > bestYards) { best = p; bestYards = total; }
        }
        const player = Array.isArray(best.players) ? best.players[0] : best.players;
        if (player) {
          const totalTds = (best.rush_td || 0) + (best.pass_td || 0) + (best.rec_td || 0);
          key_player = {
            name: player.name,
            slug: player.slug,
            stats_line: `${bestYards} total yds, ${totalTds} TD`,
          };
        }
      }
    }

    showcaseData[cat] = { ppg, margin, win_pct, key_player };
  }

  // === Build cross-tier spotlight games ===
  const rankedSchoolMap = new Map<number, { rank: number; category: string; name: string; slug: string; record: string }>();
  for (const r of currentWeekRankings) {
    if (r.school_id) {
      rankedSchoolMap.set(r.school_id, {
        rank: r.rank_position,
        category: r.ranking_category || 'city',
        name: r.schools?.name || 'Unknown',
        slug: r.schools?.slug || '',
        record: r.record_display || '',
      });
    }
  }

  interface SpotlightGame {
    homeTeam: { name: string; slug: string; rank: number; category: string; record: string };
    awayTeam: { name: string; slug: string; rank: number; category: string; record: string };
    gameDate: string;
  }

  const spotlightGames: SpotlightGame[] = [];
  const rawSpotlightGames = (settled['spotlight_games'] as Array<Record<string, unknown>> | null) ?? [];

  for (const g of rawSpotlightGames) {
    const homeId = g.home_school_id as number;
    const awayId = g.away_school_id as number;
    const homeInfo = rankedSchoolMap.get(homeId);
    const awayInfo = rankedSchoolMap.get(awayId);

    if (homeInfo && awayInfo && homeInfo.category !== awayInfo.category) {
      const gameDate = new Date(g.game_date as string).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
      });

      spotlightGames.push({
        homeTeam: homeInfo,
        awayTeam: awayInfo,
        gameDate,
      });
    }

    if (spotlightGames.length >= 3) break;
  }

  // === Snub poll ID ===
  const snubPollRaw = (settled['snub_poll'] as Array<{ id: string }> | null) ?? [];
  const snubPollId: string | null = snubPollRaw.length > 0 ? snubPollRaw[0].id : null;

  // === Vote counts ===
  const voteCountsRaw = (settled['vote_counts'] as Array<{ ranking_id: string; vote_type: string }> | null) ?? [];
  const voteCounts: Record<string, { agree: number; disagree: number; total: number }> = {};
  for (const v of voteCountsRaw) {
    if (!voteCounts[v.ranking_id]) {
      voteCounts[v.ranking_id] = { agree: 0, disagree: 0, total: 0 };
    }
    if (v.vote_type === 'agree') voteCounts[v.ranking_id].agree++;
    else if (v.vote_type === 'disagree') voteCounts[v.ranking_id].disagree++;
    voteCounts[v.ranking_id].total++;
  }

  const sportMeta = SPORT_META[activeSport as keyof typeof SPORT_META];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="psp-h1 text-white mb-2">Power Rankings</h1>
          <p className="text-gray-300 text-lg">Weekly school rankings across Philly HS sports</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={[{ label: 'Rankings' }]} />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Sport Tabs */}
        <div className="flex gap-2 mb-8">
          {RANKED_SPORTS.map(sport => {
            const meta = SPORT_META[sport as keyof typeof SPORT_META];
            return (
              <Link
                key={sport}
                href={`/rankings?sport=${sport}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  sport === activeSport
                    ? 'bg-navy text-gold'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-navy'
                }`}
              >
                {meta?.emoji} {meta?.name || sport}
              </Link>
            );
          })}
        </div>

        {/* Rankings Client Component */}
        <RankingsClient
          rankings={rankedData}
          activeSport={activeSport}
          sportMeta={sportMeta ? { name: sportMeta.name, emoji: sportMeta.emoji } : null}
          showcaseData={showcaseData}
          spotlightGames={spotlightGames}
          snubPollId={snubPollId}
          voteCounts={voteCounts}
        />

        <div className="mt-8">
          <PSPPromo size="banner" variant={4} />
        </div>
      </div>
    </div>
  );
}
