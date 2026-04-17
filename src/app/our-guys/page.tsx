import { createStaticClient } from '@/lib/supabase/static';
import { createClient } from '@/lib/data/common';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import PhillyMadeBadge from '@/components/ui/PhillyMadeBadge';
import LeagueTeamBreakdown from '@/components/our-guys/LeagueTeamBreakdown';
import WeeklyPoll from '@/components/our-guys/WeeklyPoll';
import { ScoreTicker } from '@/components/our-guys/ScoreTicker';
import { RecapBoard } from '@/components/our-guys/RecapBoard';
import { CoachCorner } from '@/components/our-guys/CoachCorner';
import { NewsRail } from '@/components/our-guys/NewsRail';
import { ReactiveDidYouKnow } from '@/components/our-guys/ReactiveDidYouKnow';
import SchoolPipelineRanking from '@/components/our-guys/SchoolPipelineRanking';
import { SPORT_EMOJI } from '@/lib/sports';
import './bar-theme.css';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Our Guys — The Philly Sports Bar | PhillySportsPack.com',
  description: 'Track Philadelphia high school alumni playing in the NFL, NBA, MLB, college, and coaching at the next level. Live scores, AI recaps, and the full directory.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/our-guys' },
  robots: { index: true, follow: true },
};


/* League pill colors — dark theme */
const LEAGUE_STYLE: Record<string, string> = {
  NFL:           'border-green-500/30 text-green-400',
  NBA:           'border-orange-500/30 text-orange-400',
  MLB:           'border-blue-500/30 text-blue-400',
  WNBA:          'border-purple-500/30 text-purple-400',
  MLS:           'border-emerald-500/30 text-emerald-400',
  'NBA G League':'border-orange-400/30 text-orange-300',
  UFL:           'border-gray-500/30 text-gray-300',
};

export default async function OurGuysPage() {
  const supabase = createStaticClient();

  const [alumniRes, pipelineRes, recentRes] = await Promise.all([
    supabase
      .from('next_level_tracking')
      .select('id, person_name, player_id, current_level, current_org, current_role, pro_league, sport_id, status, featured, social_twitter, social_instagram, college, schools:high_school_id(name, slug), players:player_id(slug)')
      .order('featured', { ascending: false })
      .order('person_name')
      .limit(2500),

    // Active pros for counts + league breakdown + team breakdown
    supabase
      .from('next_level_tracking')
      .select('high_school_id, schools:high_school_id(name, slug), current_level, sport_id, pro_league, pro_team')
      .eq('current_level', 'pro')
      .eq('status', 'active'),

    // Featured/trending — players with recent recaps
    (async () => {
      const db = await createClient();
      const { data } = await (db as any)
        .from('nlt_game_performances')
        .select('nlt_id, player_name, team_name, sport, stats, performance_score, high_school, recap_tier')
        .order('created_at', { ascending: false })
        .limit(12);
      return data || [];
    })(),
  ]);

  /* ─── Derive alumni counts ─── */
  const alumni = alumniRes.data ?? [];
  let activePro = 0;
  let college = 0;

  for (const a of alumni as Record<string, unknown>[]) {
    if (a.current_level === 'pro' && a.status === 'active') activePro++;
    if (a.current_level === 'college') college++;
  }

  /* ─── League breakdown + per-team breakdown ─── */
  const leagueCounts = new Map<string, number>();
  const teamCountsByLeague = new Map<string, Map<string, number>>();
  for (const entry of (pipelineRes.data ?? []) as Record<string, unknown>[]) {
    const league = entry.pro_league as string | null;
    const team = entry.pro_team as string | null;
    if (!league) continue;
    leagueCounts.set(league, (leagueCounts.get(league) || 0) + 1);
    if (team && team.trim()) {
      const teamKey = team.trim();
      if (!teamCountsByLeague.has(league)) {
        teamCountsByLeague.set(league, new Map());
      }
      const teams = teamCountsByLeague.get(league)!;
      teams.set(teamKey, (teams.get(teamKey) || 0) + 1);
    }
  }
  const leagueOrder = ['NFL', 'NBA', 'MLB', 'WNBA', 'MLS', 'NBA G League', 'UFL'];
  const leagueBreakdown = leagueOrder
    .filter(l => (leagueCounts.get(l) || 0) > 0)
    .map(l => ({ league: l, count: leagueCounts.get(l) || 0 }));
  for (const [league, count] of leagueCounts) {
    if (!leagueOrder.includes(league) && count > 0) {
      leagueBreakdown.push({ league, count });
    }
  }
  const teamsByLeague: Record<string, { team: string; count: number }[]> = {};
  for (const [league, teams] of teamCountsByLeague) {
    teamsByLeague[league] = Array.from(teams.entries())
      .map(([team, count]) => ({ team, count }))
      .sort((a, b) => b.count - a.count || a.team.localeCompare(b.team));
  }

  /* ─── Directory preview: trending players from recent recaps ─── */
  const trendingNltIds = new Set<number>();
  const directoryPreview: Array<{ name: string; team: string; school: string | null; sport: string; statLine: string }> = [];

  for (const perf of recentRes as any[]) {
    if (trendingNltIds.has(perf.nlt_id)) continue;
    trendingNltIds.add(perf.nlt_id);

    const stats = perf.stats || {};
    const parts: string[] = [];
    if (stats.rush_yds) parts.push(`${stats.rush_yds} rush yds`);
    if (stats.pass_yds) parts.push(`${stats.pass_yds} pass yds`);
    if (stats.rec_yds) parts.push(`${stats.rec_yds} rec yds`);
    if (stats.total_td) parts.push(`${stats.total_td} TD`);
    if (stats.pts) parts.push(`${stats.pts} pts`);
    if (stats.reb) parts.push(`${stats.reb} reb`);
    if (stats.ast) parts.push(`${stats.ast} ast`);
    if (stats.hits) parts.push(`${stats.hits} H`);
    if (stats.rbi) parts.push(`${stats.rbi} RBI`);
    if (stats.hr) parts.push(`${stats.hr} HR`);

    directoryPreview.push({
      name: perf.player_name,
      team: perf.team_name,
      school: perf.high_school,
      sport: perf.sport,
      statLine: parts.slice(0, 3).join(', '),
    });

    if (directoryPreview.length >= 8) break;
  }

  return (
    <div className="bar-page">
      {/* ═══ Hero — "OUR GUYS" ═══ */}
      <header className="bar-hero">
        <p style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--bar-text-muted)',
          marginBottom: '4px',
        }}>
          PHILLY SPORTS PACK
        </p>
        <h1 className="bar-hero__title">OUR GUYS</h1>
        <p className="bar-hero__subtitle">
          {activePro} Active Pros &middot; {college.toLocaleString()} in College &middot; {alumni.length.toLocaleString()} Total Tracked
        </p>
      </header>

      {/* ═══ Score Ticker ═══ */}
      <Suspense fallback={
        <div style={{ background: 'var(--bar-ticker)', height: 48 }} />
      }>
        <ScoreTicker />
      </Suspense>

      {/* ═══ Main content ═══ */}
      <div className="bar-layout">
        <div className="bar-columns" style={{ paddingTop: '24px', paddingBottom: '48px' }}>

          {/* ═══ LEFT: Main column ═══ */}
          <div className="bar-main">

            {/* Recap Board — "Last Night at the Bar" */}
            <Suspense fallback={null}>
              <RecapBoard />
            </Suspense>

            <div className="bar-divider" />

            {/* Coach Corner */}
            <Suspense fallback={null}>
              <CoachCorner />
            </Suspense>

            <div className="bar-divider" />

            {/* News Rail — PSP Stories + Around the Web */}
            <Suspense fallback={null}>
              <NewsRail />
            </Suspense>

            <div className="bar-divider" />

            {/* School Pipeline */}
            <section style={{ padding: '24px 16px' }}>
              <h3 className="bar-section-header">
                SCHOOL PIPELINE
              </h3>
              <div className="bar-card" style={{ padding: '16px' }}>
                <SchoolPipelineRanking />
              </div>
            </section>

            <div className="bar-divider" />

            {/* Directory Preview — trending players */}
            <section style={{ padding: '24px 16px' }}>
              <h3 className="bar-section-header bar-section-header--gold">
                OUR GUYS
              </h3>

              {directoryPreview.length > 0 ? (
                <div className="bar-directory-preview">
                  {directoryPreview.map((player, i) => (
                    <div key={i} className="bar-directory-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'var(--bar-surface-elevated)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          flexShrink: 0,
                        }}>
                          {SPORT_EMOJI[player.sport] || '\uD83C\uDFC5'}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                            fontWeight: 700,
                            fontSize: '14px',
                            color: 'var(--bar-text)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {player.name}
                          </div>
                          <div style={{
                            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                            fontSize: '12px',
                            color: 'var(--bar-text-muted)',
                          }}>
                            {player.team}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center', marginBottom: '6px' }}>
                        {player.school && (
                          <span className="bar-school-badge">
                            {player.school}
                          </span>
                        )}
                        <PhillyMadeBadge size="sm" />
                      </div>
                      {player.statLine && (
                        <div style={{
                          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                          fontSize: '13px',
                          fontWeight: 500,
                          color: 'var(--bar-text-muted)',
                          marginTop: '4px',
                        }}>
                          {player.statLine}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontSize: '14px',
                  color: 'var(--bar-text-muted)',
                }}>
                  {alumni.length.toLocaleString()} Philly alumni tracked across college and pro sports.
                </p>
              )}

              <Link href="/our-guys/directory" className="bar-see-all" style={{ marginTop: '16px' }}>
                See All {alumni.length.toLocaleString()} Alumni &rarr;
              </Link>
            </section>
          </div>

          {/* ═══ RIGHT: Sidebar ("The Board") — desktop only ═══ */}
          <aside className="bar-sidebar" style={{ display: 'none' }}>
            {/* Reactive DYK */}
            <Suspense fallback={null}>
              <ReactiveDidYouKnow />
            </Suspense>

            <div style={{ height: '20px' }} />

            {/* Pro League Breakdown */}
            {leagueBreakdown.length > 0 && (
              <div className="bar-card" style={{ padding: '16px' }}>
                <LeagueTeamBreakdown
                  leagueBreakdown={leagueBreakdown}
                  teamsByLeague={teamsByLeague}
                  leagueStyle={LEAGUE_STYLE}
                  headerSize="sm"
                />
              </div>
            )}

            <div style={{ height: '20px' }} />

            {/* Weekly Poll */}
            <WeeklyPoll />
          </aside>
        </div>
      </div>

      {/* Desktop sidebar visibility */}
      <style>{`
        @media (min-width: 1024px) {
          .bar-sidebar { display: block !important; }
        }
      `}</style>

      {/* Mobile-only sections (shown below main content on small screens) */}
      <div className="bar-layout" style={{ paddingBottom: '48px' }}>
        <div className="lg:hidden">
          {/* DYK on mobile */}
          <div style={{ padding: '0 16px 24px' }}>
            <Suspense fallback={null}>
              <ReactiveDidYouKnow />
            </Suspense>
          </div>

          {/* League breakdown on mobile */}
          {leagueBreakdown.length > 0 && (
            <section style={{ padding: '0 16px 24px' }}>
              <LeagueTeamBreakdown
                leagueBreakdown={leagueBreakdown}
                teamsByLeague={teamsByLeague}
                leagueStyle={LEAGUE_STYLE}
                headerSize="lg"
              />
            </section>
          )}

          {/* Weekly Poll on mobile */}
          <section style={{ padding: '0 16px 24px' }}>
            <WeeklyPoll />
          </section>
        </div>
      </div>
    </div>
  );
}
