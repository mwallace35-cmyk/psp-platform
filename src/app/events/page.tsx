import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';
import PulseNav from '@/components/pulse/PulseNav';
import GotwVoteButton from '@/components/pulse/GotwVoteButton';

export const revalidate = 300; // 5 min ISR

export const metadata: Metadata = {
  title: 'The Pulse | PhillySportsPack.com',
  description: 'The Pulse — your community hub for Philadelphia high school sports. Track alumni, vote for POTW & GOTW, follow transfers, talk trash, and stay connected.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/events' },
  openGraph: {
    title: 'The Pulse | PhillySportsPack.com',
    description: 'The Pulse — your community hub for Philadelphia high school sports.',
    url: 'https://phillysportspack.com/events',
    siteName: 'PhillySportsPack.com',
    images: [{ url: 'https://phillysportspack.com/og-default.png', width: 1200, height: 630, alt: 'PhillySportsPack.com' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'The Pulse | PhillySportsPack.com', description: 'The Pulse — your community hub for Philadelphia high school sports.', images: ['https://phillysportspack.com/og-default.png'] },
  robots: { index: true, follow: true },
};

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  sport_id: string;
  type: string;
  registration_url?: string;
}

interface AlumniRecord {
  id: string;
  person_name: string;
  current_level: string;
  current_org: string | null;
  current_role: string | null;
  pro_league: string | null;
  sport_id: string | null;
  status: string | null;
  featured: boolean;
  schools?: { name: string; slug: string } | null;
}

interface GotwRecord {
  id: string;
  home_school_name: string;
  away_school_name: string;
  sport_id: string;
  week_label: string;
  game_date: string | null;
  venue: string | null;
  description: string | null;
  vote_count: number;
  is_winner: boolean;
}

interface PotwRecord {
  id: string;
  player_name: string;
  school_name: string;
  sport_id: string;
  week_label: string;
  stat_line: string | null;
  votes: number;
  is_winner: boolean;
}

interface TransferRecord {
  id: string;
  transfer_year: number | null;
  sport_id: string | null;
  reason: string | null;
  verified: boolean;
  players?: { name: string; slug: string; graduation_year: number | null } | null;
  from_school?: { name: string; slug: string } | null;
  to_school?: { name: string; slug: string } | null;
}

interface ForumPostRecord {
  id: string;
  author_name: string;
  author_school_flair: string | null;
  title: string;
  category: string;
  sport_id: string | null;
  reply_count: number;
  like_count: number;
  view_count: number;
  created_at: string;
  last_reply_at: string | null;
}

interface RankingRecord {
  id: string;
  sport_id: string;
  week_label: string;
  rank_position: number;
  previous_rank: number | null;
  record_display: string | null;
  blurb: string | null;
  schools?: { name: string; slug: string; colors: Record<string, string> | null } | null;
}

const LEVEL_BADGES: Record<string, { label: string; color: string }> = {
  pro: { label: 'PRO', color: 'bg-gold text-navy' },
  college: { label: 'COLLEGE', color: 'bg-blue-600 text-white' },
  coaching: { label: 'COACH', color: 'bg-green-700 text-white' },
};

const LEAGUE_ICONS: Record<string, string> = {
  NFL: '🏈', NBA: '🏀', MLB: '⚾', MLS: '⚽',
};

const CATEGORY_STYLES: Record<string, { label: string; color: string }> = {
  general: { label: 'General', color: 'bg-gray-200 text-gray-700' },
  trashtalk: { label: 'Trashtalk', color: 'bg-red-100 text-red-700' },
  debate: { label: 'Debate', color: 'bg-purple-100 text-purple-700' },
  predictions: { label: 'Predictions', color: 'bg-blue-100 text-blue-700' },
  recruiting: { label: 'Recruiting', color: 'bg-green-100 text-green-700' },
  throwback: { label: 'Throwback', color: 'bg-amber-100 text-amber-700' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default async function PulsePage() {
  const supabase = createStaticClient();

  // Fetch all data in parallel
  const [
    alumniRes,
    alumniCountsRes,
    eventsRes,
    potwRes,
    gotwRes,
    transfersRes,
    forumRes,
    rankingsRes,
  ] = await Promise.all([
    // Featured alumni (Our Guys)
    supabase
      .from('next_level_tracking')
      .select('id, person_name, current_level, current_org, current_role, pro_league, sport_id, status, featured, schools:high_school_id(name, slug)')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('person_name')
      .limit(8),
    // Alumni counts by level
    Promise.all([
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'NFL'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'NBA'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'MLB'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('current_level', 'college'),
    ]),
    // Upcoming events
    supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(4),
    // POTW current nominees
    supabase
      .from('potw_nominees')
      .select('*')
      .order('votes', { ascending: false })
      .limit(5),
    // GOTW nominees
    supabase
      .from('gotw_nominees')
      .select('*')
      .order('vote_count', { ascending: false })
      .limit(4),
    // Recent transfers
    supabase
      .from('transfers')
      .select('*, players(name, slug, graduation_year), from_school:schools!transfers_from_school_id_fkey(name, slug), to_school:schools!transfers_to_school_id_fkey(name, slug)')
      .order('transfer_year', { ascending: false })
      .limit(5),
    // Hot forum topics
    supabase
      .from('forum_posts')
      .select('id, author_name, author_school_flair, title, category, sport_id, reply_count, like_count, view_count, created_at, last_reply_at')
      .is('deleted_at', null)
      .order('is_pinned', { ascending: false })
      .order('last_reply_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(6),
    // Power rankings (football default)
    supabase
      .from('power_rankings')
      .select('*, schools(name, slug, colors)')
      .eq('sport_id', 'football')
      .order('rank_position', { ascending: true })
      .limit(10),
  ]);

  const alumni = (alumniRes.data ?? []).map((a: Record<string, unknown>) => ({
    ...a,
    schools: Array.isArray(a.schools) ? a.schools[0] : a.schools,
  })) as AlumniRecord[];
  const [nfl, nba, mlb, college] = alumniCountsRes;
  const alumniCounts = {
    nfl: nfl.count ?? 0,
    nba: nba.count ?? 0,
    mlb: mlb.count ?? 0,
    college: college.count ?? 0,
  };
  const events = (eventsRes.data ?? []) as Event[];
  const potwNominees = (potwRes.data ?? []) as PotwRecord[];
  const gotwNominees = (gotwRes.data ?? []) as GotwRecord[];
  const transfers = (transfersRes.data ?? []) as TransferRecord[];
  const forumPosts = (forumRes.data ?? []) as ForumPostRecord[];
  const rankings = (rankingsRes.data ?? []) as RankingRecord[];

  const totalGotwVotes = gotwNominees.reduce((sum, n) => sum + n.vote_count, 0);
  const totalPotwVotes = potwNominees.reduce((sum, n) => sum + n.votes, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-bebas text-white tracking-wide">The Pulse</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">Live</span>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl">
            Your community hub for Philly HS sports. Track alumni in the pros, vote for the best, talk trash, and stay connected.
          </p>

          {/* Quick Stats Bar */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold text-xl">{alumniCounts.nfl}</span>
              <span className="text-gray-400">NFL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold text-xl">{alumniCounts.nba}</span>
              <span className="text-gray-400">NBA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold text-xl">{alumniCounts.mlb}</span>
              <span className="text-gray-400">MLB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold text-xl">{alumniCounts.college}</span>
              <span className="text-gray-400">College</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pulse Navigation Tabs */}
      <PulseNav />

      <PSPPromo size="banner" variant={1} />

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* === LEFT COLUMN (2/3) === */}
          <div className="lg:col-span-2 space-y-8">

            {/* OUR GUYS — Featured Alumni */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bebas text-navy flex items-center gap-2">
                  Our Guys <span className="text-lg">🌟</span>
                </h2>
                <Link href="/events/our-guys" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All &rarr;
                </Link>
              </div>

              {alumni.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">Alumni tracking coming soon. We&apos;re building the most comprehensive database of Philly HS athletes who made it to the next level.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {alumni.map((a) => {
                    const badge = LEVEL_BADGES[a.current_level] || LEVEL_BADGES.college;
                    const leagueIcon = a.pro_league ? LEAGUE_ICONS[a.pro_league] || '' : '';
                    return (
                      <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gold hover:shadow-sm transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-navy truncate">{leagueIcon} {a.person_name}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {a.current_org && <span>{a.current_org}</span>}
                              {a.current_role && <span> &middot; {a.current_role}</span>}
                            </p>
                            {a.schools && (
                              <p className="text-xs text-gray-400 mt-1">{a.schools.name}</p>
                            )}
                          </div>
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* VOTING — POTW + GOTW side by side */}
            <section>
              <h2 className="text-2xl font-bebas text-navy mb-4 flex items-center gap-2">
                Vote <span className="text-lg">🗳️</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* POTW */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-navy px-4 py-3">
                    <h3 className="text-gold font-bebas text-lg">Player of the Week</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {potwNominees.length === 0 ? (
                      <p className="text-gray-500 text-sm py-4 text-center">No active nominees this week.</p>
                    ) : (
                      potwNominees.slice(0, 3).map((nom, idx) => {
                        const sportMeta = SPORT_META[nom.sport_id as keyof typeof SPORT_META];
                        const pct = totalPotwVotes > 0 ? Math.round((nom.votes / totalPotwVotes) * 100) : 0;
                        return (
                          <div key={nom.id} className="flex items-center gap-3">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-600'}`}>
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-navy truncate">
                                {sportMeta?.emoji} {nom.player_name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{nom.school_name}</p>
                            </div>
                            <span className="text-xs font-bold text-navy">{pct}%</span>
                          </div>
                        );
                      })
                    )}
                    <Link href="/potw" className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium pt-2 border-t border-gray-100">
                      Vote Now &rarr;
                    </Link>
                  </div>
                </div>

                {/* GOTW */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-navy px-4 py-3">
                    <h3 className="text-gold font-bebas text-lg">Game of the Week</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {gotwNominees.length === 0 ? (
                      <p className="text-gray-500 text-sm py-4 text-center">No games nominated this week. Check back Friday!</p>
                    ) : (
                      gotwNominees.slice(0, 3).map((nom, idx) => {
                        const sportMeta = SPORT_META[nom.sport_id as keyof typeof SPORT_META];
                        const pct = totalGotwVotes > 0 ? Math.round((nom.vote_count / totalGotwVotes) * 100) : 0;
                        return (
                          <div key={nom.id} className="flex items-center gap-3">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-600'}`}>
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-navy truncate">
                                {sportMeta?.emoji} {nom.away_school_name} @ {nom.home_school_name}
                              </p>
                              {nom.game_date && (
                                <p className="text-xs text-gray-500">
                                  {new Date(nom.game_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                  {nom.venue && ` — ${nom.venue}`}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-navy">{pct}%</span>
                              <GotwVoteButton
                                nomineeId={nom.id}
                                matchupLabel={`${nom.away_school_name} at ${nom.home_school_name}`}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                    {gotwNominees.length === 0 && (
                      <p className="text-xs text-gray-400 text-center">Nominations open every Thursday</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* FORUM / TRASHTALK — Hot Topics */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bebas text-navy flex items-center gap-2">
                  Forum <span className="text-lg">💬</span>
                </h2>
                <Link href="/events/forum" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  All Topics &rarr;
                </Link>
              </div>

              {forumPosts.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-2xl mb-2">🗣️</p>
                  <p className="text-gray-700 font-medium mb-1">The Forum is Coming Soon</p>
                  <p className="text-gray-500 text-sm">Debate, predictions, trashtalk — all in one place. Sign up to be first in.</p>
                  <Link href="/signup" className="inline-block mt-4 px-5 py-2 bg-navy text-white rounded-md text-sm font-medium hover:bg-navy-mid transition">
                    Join the Community
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                  {forumPosts.map((post) => {
                    const catStyle = CATEGORY_STYLES[post.category] || CATEGORY_STYLES.general;
                    const sportMeta = post.sport_id ? SPORT_META[post.sport_id as keyof typeof SPORT_META] : null;
                    return (
                      <Link key={post.id} href={`/events/forum/${post.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${catStyle.color}`}>
                              {catStyle.label}
                            </span>
                            {sportMeta && <span className="text-sm">{sportMeta.emoji}</span>}
                          </div>
                          <p className="font-medium text-navy truncate">{post.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {post.author_name}
                            {post.author_school_flair && <span className="text-gray-400"> ({post.author_school_flair})</span>}
                            {' '}&middot;{' '}{timeAgo(post.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span title="Replies">💬 {post.reply_count}</span>
                          <span title="Views">👁 {post.view_count}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* UPCOMING EVENTS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bebas text-navy flex items-center gap-2">
                  Upcoming Events <span className="text-lg">📅</span>
                </h2>
                <Link href="/events/calendar" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Full Calendar &rarr;
                </Link>
              </div>

              {events.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <p className="text-gray-500">No upcoming events. Check back soon!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => {
                    const eventDate = new Date(event.date);
                    const sportMeta = SPORT_META[event.sport_id as keyof typeof SPORT_META];
                    return (
                      <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 hover:border-gold transition">
                        <div className="bg-gold text-navy rounded-lg p-2 text-center w-16 flex-shrink-0">
                          <p className="text-xl font-bold leading-tight">{eventDate.getDate()}</p>
                          <p className="text-xs font-medium uppercase">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-navy truncate">
                            {sportMeta?.emoji} {event.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">📍 {event.location}</p>
                        </div>
                        {event.registration_url && (
                          <a
                            href={event.registration_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1.5 bg-gold text-navy text-xs font-bold rounded hover:bg-gold/90 transition flex-shrink-0"
                          >
                            Register
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* === RIGHT COLUMN (1/3) === */}
          <div className="space-y-6">

            {/* POWER RANKINGS */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-navy px-4 py-3 flex items-center justify-between">
                <h3 className="text-gold font-bebas text-lg">Power Rankings</h3>
                <Link href="/events/rankings" className="text-xs text-gray-400 hover:text-gold transition">
                  All Sports &rarr;
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {rankings.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 text-sm">Rankings will be published weekly during the season.</p>
                  </div>
                ) : (
                  rankings.slice(0, 10).map((r) => {
                    const rankChange = r.previous_rank !== null ? r.previous_rank - r.rank_position : 0;
                    return (
                      <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                        <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${r.rank_position <= 3 ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-600'}`}>
                          {r.rank_position}
                        </span>
                        <div className="flex-1 min-w-0">
                          {r.schools ? (
                            <Link href={`/football/schools/${r.schools.slug}`} className="text-sm font-medium text-navy hover:text-blue-600 truncate block">
                              {r.schools.name}
                            </Link>
                          ) : (
                            <span className="text-sm font-medium text-navy truncate block">Unknown</span>
                          )}
                          {r.record_display && (
                            <p className="text-xs text-gray-500">{r.record_display}</p>
                          )}
                        </div>
                        {rankChange !== 0 && (
                          <span className={`text-xs font-bold ${rankChange > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {rankChange > 0 ? `+${rankChange}` : rankChange}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* TRANSFER WATCH */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-navy px-4 py-3 flex items-center justify-between">
                <h3 className="text-gold font-bebas text-lg">Transfer Watch</h3>
                <Link href="/events/transfers" className="text-xs text-gray-400 hover:text-gold transition">
                  View All &rarr;
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {transfers.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 text-sm">No recent transfers tracked yet.</p>
                  </div>
                ) : (
                  transfers.map((t) => (
                    <div key={t.id} className="px-4 py-3">
                      <p className="text-sm font-medium text-navy">
                        {t.players?.name || 'Unknown Player'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t.from_school?.name || '?'} → {t.to_school?.name || '?'}
                        {t.transfer_year && <span className="text-gray-400"> ({t.transfer_year})</span>}
                      </p>
                      {t.verified && (
                        <span className="text-xs text-green-600 font-medium">Verified</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <PSPPromo size="sidebar" variant={3} />

            {/* QUICK LINKS */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bebas text-navy text-lg mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/potw" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>🏆</span> Player of the Week
                </Link>
                <Link href="/events/forum?category=trashtalk" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>🗣️</span> Trashtalk Forum
                </Link>
                <Link href="/events/our-guys" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>🌟</span> Our Guys in the Pros
                </Link>
                <Link href="/events/transfers" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>🔄</span> Transfer Tracker
                </Link>
                <Link href="/community" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>👥</span> Community
                </Link>
                <Link href="/signup" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>📝</span> Sign Up
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
