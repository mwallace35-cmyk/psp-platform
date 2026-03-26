import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import PulseNav from '@/components/pulse/PulseNav';
import OurGuysClient, { type AlumniRecord } from './OurGuysClient';
import OurGuysEditorialTop from '@/components/our-guys/OurGuysEditorialTop';
import AroundTheWeb from '@/components/our-guys/AroundTheWeb';
import SchoolPipelineRanking from '@/components/our-guys/SchoolPipelineRanking';
import type { FeaturedAthlete, DidYouKnowFact } from '@/components/our-guys/OurGuysEditorialTop';
import type { WeekendRecap } from '@/components/our-guys/ThisWeekendCard';

export const revalidate = 3600;
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: 'Our Guys — The Pulse | PhillySportsPack.com',
  description: 'Track Philadelphia high school alumni playing in the NFL, NBA, MLB, college, and coaching at the next level.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/our-guys' },
  robots: { index: true, follow: true },
};

/* ─── Sport emoji helper ─── */
const SPORT_EMOJI: Record<string, string> = {
  football: '\uD83C\uDFC8',
  basketball: '\uD83C\uDFC0',
  baseball: '\u26BE',
  soccer: '\u26BD',
  lacrosse: '\uD83E\uDD4D',
  'track-field': '\uD83C\uDFC3',
  wrestling: '\uD83E\uDD3C',
};

/* ─── League pill colors ─── */
const LEAGUE_STYLE: Record<string, { bg: string; text: string }> = {
  NFL:           { bg: 'bg-green-700',  text: 'text-white' },
  NBA:           { bg: 'bg-orange-600', text: 'text-white' },
  MLB:           { bg: 'bg-blue-700',   text: 'text-white' },
  WNBA:          { bg: 'bg-purple-700', text: 'text-white' },
  MLS:           { bg: 'bg-emerald-700',text: 'text-white' },
  'NBA G League':{ bg: 'bg-orange-500', text: 'text-white' },
  UFL:           { bg: 'bg-gray-600',   text: 'text-white' },
};

export default async function OurGuysPage() {
  const supabase = createStaticClient();

  const [alumniRes, pipelineRes, recentRes, featuredRes, dykRes, weekendRes] = await Promise.all([
    // Main alumni fetch — all counts derived from this array
    supabase
      .from('next_level_tracking')
      .select('id, person_name, player_id, current_level, current_org, current_role, pro_league, sport_id, status, featured, bio_note, social_twitter, social_instagram, college, draft_info, bio_url, trajectory_label, schools:high_school_id(name, slug), players:player_id(slug)')
      .order('featured', { ascending: false })
      .order('person_name')
      .limit(2500),

    // School pipeline: active pros grouped by school (also used for league breakdown)
    supabase
      .from('next_level_tracking')
      .select('high_school_id, schools:high_school_id(name, slug), current_level, sport_id, pro_league')
      .eq('current_level', 'pro')
      .eq('status', 'active'),

    // Recently added
    supabase
      .from('next_level_tracking')
      .select('id, person_name, current_level, current_org, pro_league, sport_id, status, created_at, schools:high_school_id(name, slug)')
      .order('created_at', { ascending: false })
      .limit(6),

    // Featured pro athletes for editorial grid (NFL/NBA/MLB)
    supabase
      .from('next_level_tracking')
      .select('id, person_name, current_org, pro_league, sport_id, college, current_role, schools:high_school_id(name)')
      .eq('current_level', 'pro')
      .in('pro_league', ['NFL', 'NBA', 'MLB'])
      .order('person_name')
      .limit(50),

    // Did You Know facts
    supabase
      .from('did_you_know')
      .select('id, fact_text, sport, category')
      .eq('approved', true),

    // Weekend recaps — most recent week
    supabase
      .from('weekend_recaps')
      .select('id, player_name, team, sport, stat_line, result, game_date, week_label')
      .order('game_date', { ascending: false })
      .limit(8),
  ]);

  /* ─── Process alumni ─── */
  const alumni = (alumniRes.data ?? []).map((a: Record<string, unknown>) => {
    const playerJoin = Array.isArray(a.players) ? a.players[0] : a.players;
    return {
      ...a,
      schools: Array.isArray(a.schools) ? a.schools[0] : a.schools,
      slug: (playerJoin as Record<string, unknown> | null)?.slug as string | null ?? null,
    };
  }) as AlumniRecord[];

  /* ─── Counts — derived from actual alumni array to avoid discrepancies ─── */
  let derivedActivePro = 0;
  let derivedFormerPro = 0;
  let derivedCollege = 0;
  let derivedCoaching = 0;
  let derivedNfl = 0;
  let derivedNba = 0;
  let derivedMlb = 0;

  for (const a of alumni) {
    if (a.current_level === 'pro' && a.status === 'active') derivedActivePro++;
    if (a.current_level === 'pro' && a.status !== 'active') derivedFormerPro++;
    if (a.current_level === 'college') derivedCollege++;
    if (a.current_level === 'coaching' || a.current_level === 'coach' || a.current_level === 'referee' ||
        (a.current_role && typeof a.current_role === 'string' && a.current_role.toLowerCase().includes('coach'))) derivedCoaching++;
    if (a.pro_league === 'NFL') derivedNfl++;
    if (a.pro_league === 'NBA') derivedNba++;
    if (a.pro_league === 'MLB') derivedMlb++;
  }

  const counts = {
    total: alumni.length,
    activePro: derivedActivePro,
    formerPro: derivedFormerPro,
    college: derivedCollege,
    nfl: derivedNfl,
    nba: derivedNba,
    mlb: derivedMlb,
  };

  const coachingCount = derivedCoaching;

  /* ─── League breakdown data (from pipeline = active pros only) ─── */
  const leagueCounts = new Map<string, number>();
  for (const entry of (pipelineRes.data ?? []) as Record<string, unknown>[]) {
    const league = entry.pro_league as string | null;
    if (league) leagueCounts.set(league, (leagueCounts.get(league) || 0) + 1);
  }
  const leagueOrder = ['NFL', 'NBA', 'MLB', 'WNBA', 'MLS', 'NBA G League', 'UFL'];
  const leagueBreakdown = leagueOrder
    .filter(l => (leagueCounts.get(l) || 0) > 0)
    .map(l => ({ league: l, count: leagueCounts.get(l) || 0 }));
  // Include any leagues not in the predefined order
  for (const [league, count] of leagueCounts) {
    if (!leagueOrder.includes(league) && count > 0) {
      leagueBreakdown.push({ league, count });
    }
  }

  /* ─── Recently added ─── */
  const recentlyAdded = ((recentRes.data ?? []) as Record<string, unknown>[]).map(r => {
    const school = Array.isArray(r.schools) ? r.schools[0] : r.schools;
    return {
      id: r.id as string,
      person_name: r.person_name as string,
      current_level: r.current_level as string,
      current_org: r.current_org as string | null,
      pro_league: r.pro_league as string | null,
      sport_id: r.sport_id as string | null,
      status: r.status as string | null,
      created_at: r.created_at as string | null,
      school: school as { name: string; slug: string } | null,
    };
  });

  /* ─── Featured athletes for editorial grid ─── */
  const allFeaturedPros = ((featuredRes.data ?? []) as Record<string, unknown>[]).map(r => {
    const school = Array.isArray(r.schools) ? r.schools[0] : r.schools;
    return {
      id: r.id as string,
      person_name: r.person_name as string,
      current_org: r.current_org as string | null,
      pro_league: r.pro_league as string | null,
      sport_id: r.sport_id as string | null,
      college: r.college as string | null,
      current_role: r.current_role as string | null,
      school_name: (school as { name?: string } | null)?.name ?? null,
    } satisfies FeaturedAthlete;
  });
  // Pick 2 random featured athletes (different each revalidation)
  const shuffledPros = allFeaturedPros.sort(() => Math.random() - 0.5);
  const editorialFeatured = shuffledPros.slice(0, 2);

  /* ─── Did You Know facts ─── */
  const didYouKnowFacts: DidYouKnowFact[] = ((dykRes.data ?? []) as Record<string, unknown>[]).map(r => ({
    id: r.id as number,
    fact_text: r.fact_text as string,
    sport: r.sport as string | null,
    category: r.category as string | null,
  }));
  // Shuffle so the initial fact is random each revalidation
  didYouKnowFacts.sort(() => Math.random() - 0.5);

  /* ─── Weekend recaps ─── */
  const weekendRecaps: WeekendRecap[] = ((weekendRes.data ?? []) as Record<string, unknown>[]).map(r => ({
    id: r.id as number,
    player_name: r.player_name as string,
    team: r.team as string | null,
    sport: r.sport as string,
    stat_line: r.stat_line as string,
    result: r.result as string | null,
    game_date: r.game_date as string,
    week_label: r.week_label as string | null,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══ Editorial Top — Hero + Featured + DYK ═══ */}
      <OurGuysEditorialTop
        counts={{ total: counts.total, activePro: counts.activePro, college: counts.college }}
        featuredAthletes={editorialFeatured}
        didYouKnowFacts={didYouKnowFacts}
        weekendRecaps={weekendRecaps}
      />

      <PulseNav />

      {/* ═══ Server-rendered hub sections ═══ */}
      <div className="max-w-7xl mx-auto px-4">

        {/* ─── School Pipeline Rankings (graded table) ─── */}
        <SchoolPipelineRanking />

        {/* ─── Recently Added Section ─── */}
        {recentlyAdded.length > 0 && (
          <section className="py-4 pb-8">
            <h2 className="psp-h2 text-navy mb-1">
              Latest Additions to Our Guys
            </h2>
            <p className="text-gray-400 text-sm mb-5">Newly tracked athletes and coaches</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentlyAdded.map(person => {
                const levelLabel = person.current_level === 'pro'
                  ? (person.pro_league || 'Pro')
                  : person.current_level === 'college'
                  ? 'College'
                  : person.current_level === 'coaching'
                  ? 'Coach'
                  : person.current_level;
                const emoji = SPORT_EMOJI[person.sport_id || ''] || '';

                return (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3.5 hover:border-gold/50 hover:shadow-sm transition"
                  >
                    {/* Sport circle */}
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shrink-0">
                      {emoji || '\uD83C\uDFC5'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-navy truncate">{person.person_name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-navy/5 text-navy/60 shrink-0">
                          {levelLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        {person.school && (
                          <Link href={`/schools/${person.school.slug}`} className="hover:text-blue-600 truncate">
                            {person.school.name}
                          </Link>
                        )}
                        {person.current_org && (
                          <>
                            {person.school && <span className="text-gray-300">|</span>}
                            <span className="truncate">{person.current_org}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── Around the Web ─── */}
        <AroundTheWeb />

        {/* ─── Pro League Breakdown ─── */}
        {leagueBreakdown.length > 0 && (
          <section className="py-4 pb-8">
            <h2 className="psp-h2 text-navy mb-1">
              Pro League Breakdown
            </h2>
            <p className="text-gray-400 text-sm mb-5">Active Philly pros by league</p>

            <div className="flex flex-wrap gap-2.5">
              {leagueBreakdown.map(({ league, count }) => {
                const style = LEAGUE_STYLE[league] || { bg: 'bg-gray-500', text: 'text-white' };
                return (
                  <span
                    key={league}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm ${style.bg} ${style.text} shadow-sm`}
                  >
                    {league}
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{count}</span>
                  </span>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ═══ The Directory ═══ */}
      <OurGuysClient alumni={alumni} counts={counts} />
    </div>
  );
}
