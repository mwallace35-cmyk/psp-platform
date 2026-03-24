import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import PulseNav from '@/components/pulse/PulseNav';
import OurGuysClient, { type AlumniRecord } from './OurGuysClient';

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

  const [alumniRes, countsRes, pipelineRes, recentRes] = await Promise.all([
    // Main alumni fetch
    supabase
      .from('next_level_tracking')
      .select('id, person_name, player_id, current_level, current_org, current_role, pro_league, sport_id, status, featured, bio_note, social_twitter, social_instagram, college, draft_info, bio_url, schools:high_school_id(name, slug), players:player_id(slug)')
      .order('featured', { ascending: false })
      .order('person_name')
      .limit(2500),

    // Count queries
    Promise.all([
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('current_level', 'pro').eq('status', 'active'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('current_level', 'pro').neq('status', 'active'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('current_level', 'college'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'NFL'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'NBA'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'MLB'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).in('current_level', ['coaching', 'coach', 'referee']),
    ]),

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

  /* ─── Counts ─── */
  const [total, activePro, formerPro, college, nfl, nba, mlb, coaching] = countsRes;

  const counts = {
    total: total.count ?? 0,
    activePro: activePro.count ?? 0,
    formerPro: formerPro.count ?? 0,
    college: college.count ?? 0,
    nfl: nfl.count ?? 0,
    nba: nba.count ?? 0,
    mlb: mlb.count ?? 0,
  };

  const coachingCount = coaching.count ?? 0;

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

  /* ─── School pipeline ─── */
  const schoolMap = new Map<string, { name: string; slug: string; count: number; sports: Set<string> }>();
  for (const entry of (pipelineRes.data ?? []) as Record<string, unknown>[]) {
    const school = Array.isArray(entry.schools) ? entry.schools[0] : entry.schools;
    const s = school as { name?: string; slug?: string } | null;
    if (!s?.name) continue;
    if (!schoolMap.has(s.name)) schoolMap.set(s.name, { name: s.name, slug: s.slug ?? '', count: 0, sports: new Set() });
    const rec = schoolMap.get(s.name)!;
    rec.count++;
    if (entry.sport_id) rec.sports.add(entry.sport_id as string);
  }
  const topSchools = Array.from(schoolMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map(s => ({ ...s, sports: Array.from(s.sports) }));

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══ Hero ═══ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-blue-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto">
          <h1 className="psp-h1-lg text-white mb-2">Our Guys</h1>
          <p className="text-gray-300 text-lg mb-5">Philly HS alumni making it at the next level</p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-2xl font-bebas text-gold">{counts.activePro}</span>
              <span className="text-sm text-gray-300">Active Pros</span>
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-2xl font-bebas text-gold">{counts.college}</span>
              <span className="text-sm text-gray-300">College Athletes</span>
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-2xl font-bebas text-gold">{coachingCount}</span>
              <span className="text-sm text-gray-300">Coaches</span>
            </span>
          </div>
        </div>
      </div>

      <PulseNav />

      {/* ═══ Server-rendered hub sections ═══ */}
      <div className="max-w-7xl mx-auto px-4">

        {/* ─── School Pipeline Section ─── */}
        {topSchools.length > 0 && (
          <section className="py-8">
            <div className="rounded-2xl bg-gradient-to-br from-navy via-navy-mid to-[#0d1b30] p-6 md:p-8">
              <h2 className="psp-h2 text-white mb-1">
                Which Schools Produce the Most Pros?
              </h2>
              <p className="text-gray-300 text-sm mb-6">The Philly high schools sending the most athletes to the pros</p>

              <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                {topSchools.map((school, i) => (
                  <Link
                    key={school.slug}
                    href={`/schools/${school.slug}`}
                    className={`flex-shrink-0 w-44 md:w-52 rounded-xl p-4 transition hover:scale-[1.02] ${
                      i === 0
                        ? 'bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/40'
                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Rank badge */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-3 ${
                      i === 0 ? 'bg-gold text-navy' : 'bg-white/10 text-gray-300'
                    }`}>
                      #{i + 1}
                    </div>

                    <h3 className={`font-bold text-sm leading-tight mb-2 line-clamp-2 ${
                      i === 0 ? 'text-gold' : 'text-white'
                    }`}>
                      {school.name}
                    </h3>

                    <div className="flex items-baseline gap-1 mb-2">
                      <span className={`text-2xl font-bebas ${i === 0 ? 'text-gold' : 'text-white'}`}>
                        {school.count}
                      </span>
                      <span className="text-xs text-gray-300">active pros</span>
                    </div>

                    {/* Sport breakdown dots */}
                    <div className="flex gap-1.5 flex-wrap">
                      {school.sports.map(sportId => (
                        <span key={sportId} className="text-sm" title={sportId}>
                          {SPORT_EMOJI[sportId] || ''}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

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
