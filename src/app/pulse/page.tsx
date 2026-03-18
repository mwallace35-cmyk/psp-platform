import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META, getCurrentSeasonLabel } from '@/lib/sports';
import GotwVoteButton from '@/components/pulse/GotwVoteButton';
import SocialFeed from '@/components/pulse/SocialFeed';
import { getSocialFeedPosts } from '@/lib/data/social';

export const revalidate = 300; // 5 min ISR

export const metadata: Metadata = {
  title: 'The Pulse | PhillySportsPack.com',
  description: 'The Pulse — your community hub for Philadelphia high school sports. Game schedules, alumni tracker, voting, and more.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/pulse' },
  openGraph: {
    title: 'The Pulse | PhillySportsPack.com',
    description: 'The Pulse — your community hub for Philadelphia high school sports.',
    url: 'https://phillysportspack.com/pulse',
    siteName: 'PhillySportsPack.com',
    images: [{ url: 'https://phillysportspack.com/og-default.png', width: 1200, height: 630, alt: 'PhillySportsPack.com' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'The Pulse | PhillySportsPack.com', description: 'The Pulse — your community hub for Philadelphia high school sports.', images: ['https://phillysportspack.com/og-default.png'] },
  robots: { index: true, follow: true },
};

/* ────── Types ────── */

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
  schools?: { name: string; slug: string; colors: Record<string, string> | null } | null;
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

interface GameRecord {
  id: string;
  game_date: string;
  game_time: string | null;
  game_type: string | null;
  sport_id: string;
  home_school: { name: string; slug: string; colors: Record<string, string> | null } | null;
  away_school: { name: string; slug: string; colors: Record<string, string> | null } | null;
}

interface PollRecord {
  id: string;
  question: string;
  sport_id: string | null;
  options: { label: string; votes: number }[];
  total_votes: number;
  ends_at: string | null;
}

interface TopProgram {
  id: string;
  name: string;
  slug: string;
  colors: Record<string, string> | null;
  championship_count: number;
}

interface ArticleRecord {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  author_name: string | null;
  sport_id: string | null;
  featured_image_url: string | null;
  published_at: string | null;
}

/* ────── Constants ────── */

const LEVEL_BADGES: Record<string, { label: string; color: string }> = {
  pro: { label: 'PRO', color: 'bg-gold text-navy' },
  college: { label: 'COLLEGE', color: 'bg-blue-600 text-white' },
  coaching: { label: 'COACH', color: 'bg-green-700 text-white' },
};

const LEAGUE_ICONS: Record<string, string> = {
  NFL: '🏈', NBA: '🏀', MLB: '⚾', MLS: '⚽',
};

const SUB_NAV = [
  { label: 'Hub', href: '/pulse' },
  { label: 'Recruiting', href: '/pulse/recruiting' },
  { label: 'Our Guys', href: '/pulse/our-guys' },
  { label: 'Rankings', href: '/pulse/rankings' },
  { label: 'Outside the 215', href: '/pulse/outside-the-215' },
  { label: 'Calendar', href: '/pulse/calendar' },
];

/* ────── Page ────── */

export default async function PulsePage() {
  const supabase = createStaticClient();
  const seasonLabel = getCurrentSeasonLabel();

  // Look up current season ID dynamically
  const { data: seasonRow } = await supabase
    .from('seasons')
    .select('id')
    .eq('label', seasonLabel)
    .single();
  const currentSeasonId = seasonRow?.id;

  const [
    alumniRes,
    alumniCountsRes,
    potwRes,
    gotwRes,
    gamesRes,
    pollRes,
    topProgramsRes,
    totalPlayersRes,
    totalGamesRes,
    totalSeasonsRes,
    articlesRes,
  ] = await Promise.all([
    // Featured alumni — pros first, then college
    supabase
      .from('next_level_tracking')
      .select('id, person_name, current_level, current_org, current_role, pro_league, sport_id, status, featured, schools:high_school_id(name, slug, colors)')
      .not('current_org', 'is', null)
      .order('pro_league', { ascending: false, nullsFirst: false })
      .order('featured', { ascending: false })
      .order('person_name')
      .limit(8),
    // Alumni counts
    Promise.all([
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).not('pro_league', 'is', null).eq('pro_league', 'NFL'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).not('pro_league', 'is', null).eq('pro_league', 'NBA'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).not('pro_league', 'is', null).eq('pro_league', 'MLB'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('current_level', 'college'),
    ]),
    // POTW nominees
    supabase.from('potw_nominees').select('*').order('votes', { ascending: false }).limit(5),
    // GOTW nominees
    supabase.from('gotw_nominees').select('*').order('vote_count', { ascending: false }).limit(4),
    // Upcoming games (current season)
    currentSeasonId
      ? supabase
          .from('games')
          .select('id, game_date, game_time, game_type, sport_id, home_school:home_school_id(name, slug, colors), away_school:away_school_id(name, slug, colors)')
          .eq('season_id', currentSeasonId)
          .gte('game_date', new Date().toISOString().split('T')[0])
          .order('game_date', { ascending: true })
          .order('game_time', { ascending: true })
          .limit(6)
      : Promise.resolve({ data: [], error: null }),
    // Active daily poll
    supabase.from('daily_polls').select('*').eq('active', true).limit(1).single(),
    // Top programs by championship count (raw query, aggregate client-side)
    supabase
      .from('championships')
      .select('school_id, schools!championships_school_id_fkey(id, name, slug, colors)')
      .not('school_id', 'is', null)
      .limit(1000),
    // Stats for Data Spotlight
    supabase.from('players').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('games').select('id', { count: 'exact', head: true }),
    supabase.from('seasons').select('id', { count: 'exact', head: true }),
    // Top articles across all sports
    supabase
      .from('articles')
      .select('id, slug, title, excerpt, author_name, sport_id, featured_image_url, published_at')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(12),
  ]);

  // Fetch social feed posts
  const socialPosts = await getSocialFeedPosts(8);

  // Process articles
  const articles = (articlesRes.data ?? []) as ArticleRecord[];

  // Process alumni
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

  const potwNominees = (potwRes.data ?? []) as PotwRecord[];
  const gotwNominees = (gotwRes.data ?? []) as GotwRecord[];

  // Process games
  const upcomingGames = (gamesRes.data ?? []).map((g: Record<string, unknown>) => ({
    ...g,
    home_school: Array.isArray(g.home_school) ? g.home_school[0] : g.home_school,
    away_school: Array.isArray(g.away_school) ? g.away_school[0] : g.away_school,
  })) as GameRecord[];

  // Process poll
  const activePoll = pollRes.data as PollRecord | null;

  // Aggregate championship counts by school
  const topPrograms: TopProgram[] = [];
  if (topProgramsRes.data && !topProgramsRes.error) {
    const counts: Record<string, { name: string; slug: string; colors: Record<string, string> | null; count: number }> = {};
    for (const r of topProgramsRes.data as Record<string, unknown>[]) {
      const school = (Array.isArray(r.schools) ? r.schools[0] : r.schools) as { id: string; name: string; slug: string; colors: Record<string, string> | null } | null;
      if (!school) continue;
      const key = school.id;
      if (!counts[key]) counts[key] = { name: school.name, slug: school.slug, colors: school.colors, count: 0 };
      counts[key].count++;
    }
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8);
    for (const [id, d] of sorted) {
      topPrograms.push({ id, name: d.name, slug: d.slug, colors: d.colors, championship_count: d.count });
    }
  }

  const totalPotwVotes = potwNominees.reduce((sum, n) => sum + n.votes, 0);
  const totalGotwVotes = gotwNominees.reduce((sum, n) => sum + n.vote_count, 0);

  // Data Spotlight facts
  const totalPlayers = totalPlayersRes.count ?? 46000;
  const totalGamesCount = totalGamesRes.count ?? 51000;
  const totalSeasonsCount = totalSeasonsRes.count ?? 141;
  const proCount = alumniCounts.nfl + alumniCounts.nba + alumniCounts.mlb;

  const spotlightFacts = [
    { value: totalPlayers.toLocaleString(), label: 'Players Tracked', icon: '👤' },
    { value: totalGamesCount.toLocaleString(), label: 'Game Results', icon: '📊' },
    { value: `${proCount}+`, label: 'Pro Athletes', icon: '⭐' },
    { value: `${totalSeasonsCount}`, label: 'Seasons of Data', icon: '📅' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas text-white tracking-wide mb-2">The Pulse</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Your community hub for Philly HS sports. Game schedules, alumni tracker, voting, and more.
          </p>

          {/* Quick Stats */}
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

      {/* ── Inline Sub-Nav ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto py-2 -mb-px" aria-label="Pulse sections">
            {SUB_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  item.href === '/pulse'
                    ? 'bg-navy text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-navy'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* === LEFT COLUMN (2/3) === */}
          <div className="lg:col-span-2 space-y-8">

            {/* 0. TOP STORIES — Scrolling Articles */}
            {articles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bebas text-navy flex items-center gap-2">
                    Top Stories <span className="text-lg">📰</span>
                  </h2>
                  <Link href="/articles" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    All Articles &rarr;
                  </Link>
                </div>

                {/* Featured hero article */}
                {articles[0] && (
                  <Link
                    href={`/articles/${articles[0].slug}`}
                    className="block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-gold/40 transition group mb-4"
                  >
                    {articles[0].featured_image_url && (
                      <div className="h-48 bg-navy-mid overflow-hidden">
                        <img
                          src={articles[0].featured_image_url}
                          alt={articles[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {articles[0].sport_id && SPORT_META[articles[0].sport_id as keyof typeof SPORT_META] && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-navy/10 text-navy font-medium">
                            {SPORT_META[articles[0].sport_id as keyof typeof SPORT_META].emoji} {SPORT_META[articles[0].sport_id as keyof typeof SPORT_META].name}
                          </span>
                        )}
                        {articles[0].published_at && (
                          <span className="text-xs text-gray-400">
                            {new Date(articles[0].published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-navy group-hover:text-gold transition-colors line-clamp-2">{articles[0].title}</h3>
                      {articles[0].excerpt && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{articles[0].excerpt}</p>
                      )}
                      {articles[0].author_name && (
                        <p className="text-xs text-gray-400 mt-2">By {articles[0].author_name}</p>
                      )}
                    </div>
                  </Link>
                )}

                {/* Horizontally scrolling article cards */}
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
                    {articles.slice(1).map((article) => {
                      const sportMeta = article.sport_id ? SPORT_META[article.sport_id as keyof typeof SPORT_META] : null;
                      return (
                        <Link
                          key={article.id}
                          href={`/articles/${article.slug}`}
                          className="flex-shrink-0 w-64 bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-gold/40 transition group snap-start"
                        >
                          {article.featured_image_url ? (
                            <div className="h-32 bg-gray-100 overflow-hidden">
                              <img
                                src={article.featured_image_url}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="h-32 bg-gradient-to-br from-navy to-navy-mid flex items-center justify-center">
                              <span className="text-4xl opacity-30">{sportMeta?.emoji || '📰'}</span>
                            </div>
                          )}
                          <div className="p-3">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              {sportMeta && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy/10 text-navy font-medium">
                                  {sportMeta.emoji} {sportMeta.name}
                                </span>
                              )}
                              {article.published_at && (
                                <span className="text-[10px] text-gray-400">
                                  {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-navy group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                              {article.title}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  {/* Scroll fade hint */}
                  <div className="absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
                </div>
              </section>
            )}

            {/* 1. GAME SCHEDULE */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bebas text-navy flex items-center gap-2">
                  Upcoming Games <span className="text-lg">🏟️</span>
                </h2>
                <Link href="/pulse/calendar" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Full Schedule &rarr;
                </Link>
              </div>

              {upcomingGames.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-2xl mb-2">🏈</p>
                  <p className="text-gray-700 font-medium">{seasonLabel} Season Schedule Loaded</p>
                  <p className="text-gray-500 text-sm mt-1">Games ready. Check back soon for upcoming matchups.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingGames.map((g) => {
                    const d = new Date(g.game_date + 'T12:00:00');
                    const homeColors = g.home_school?.colors;
                    const homePrimary = homeColors?.primary || '#0a1628';
                    const isScrim = g.game_type === 'scrimmage';
                    return (
                      <div key={g.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 hover:border-gold/60 transition group">
                        {/* Date block */}
                        <div className="rounded-lg p-2 text-center w-14 flex-shrink-0" style={{ backgroundColor: homePrimary, color: '#fff' }}>
                          <p className="text-lg font-bold leading-tight">{d.getDate()}</p>
                          <p className="text-[10px] font-medium uppercase opacity-80">{d.toLocaleDateString('en-US', { month: 'short' })}</p>
                        </div>
                        {/* Matchup */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-navy text-sm">
                            {g.away_school?.name || 'TBD'} <span className="text-gray-400 mx-1">@</span> {g.home_school?.name || 'TBD'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {g.game_time && (
                              <span className="text-xs text-gray-500">{g.game_time.slice(0, 5).replace(/^0/, '')}</span>
                            )}
                            {isScrim && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium uppercase">Scrimmage</span>
                            )}
                          </div>
                        </div>
                        {/* Link to team */}
                        {g.home_school?.slug && (
                          <Link
                            href={`/football/teams/${g.home_school.slug}/${seasonLabel}`}
                            className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition font-medium"
                          >
                            Preview
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 2. VOTING — POTW + GOTW */}
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
                  </div>
                </div>
              </div>
            </section>

            {/* 3. OUR GUYS — Featured Alumni */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bebas text-navy flex items-center gap-2">
                  Our Guys <span className="text-lg">🌟</span>
                </h2>
                <Link href="/pulse/our-guys" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All &rarr;
                </Link>
              </div>

              {alumni.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">Alumni tracking coming soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {alumni.map((a) => {
                    const badge = LEVEL_BADGES[a.current_level] || LEVEL_BADGES.college;
                    const leagueIcon = a.pro_league ? LEAGUE_ICONS[a.pro_league] || '' : '';
                    const schoolColors = a.schools?.colors;
                    const borderColor = schoolColors?.primary || '#e5e7eb';
                    return (
                      <div
                        key={a.id}
                        className="bg-white rounded-lg border-l-4 border border-gray-200 p-4 hover:shadow-sm transition"
                        style={{ borderLeftColor: borderColor }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-navy truncate">{leagueIcon} {a.person_name}</p>
                            <p className="text-sm text-gray-600 truncate">
                              {a.current_org && <span className="font-medium">{a.current_org}</span>}
                              {a.current_role && <span className="text-gray-400"> &middot; {a.current_role}</span>}
                            </p>
                            {a.schools && (
                              <Link
                                href={`/football/schools/${a.schools.slug}`}
                                className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                              >
                                {a.schools.name}
                              </Link>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 ml-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${badge.color}`}>
                              {badge.label}
                            </span>
                            {a.pro_league && (
                              <span className="text-[10px] text-gray-400 font-medium">{a.pro_league}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 4. SOCIAL FEED */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bebas text-navy flex items-center gap-2">
                  Social Feed <span className="text-lg">𝕏</span>
                </h2>
              </div>
              <SocialFeed posts={socialPosts} />
            </section>

            {/* 5. DATA SPOTLIGHT */}
            <section>
              <h2 className="text-2xl font-bebas text-navy mb-4 flex items-center gap-2">
                Data Spotlight <span className="text-lg">📊</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {spotlightFacts.map((fact) => (
                  <div key={fact.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-2xl mb-1">{fact.icon}</p>
                    <p className="text-2xl font-bebas text-gold">{fact.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{fact.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-gradient-to-r from-navy to-navy-mid rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-bebas text-lg">Explore the Database</p>
                  <p className="text-gray-400 text-sm">25 years of Philly HS sports data — searchable and free.</p>
                </div>
                <Link href="/search" className="px-4 py-2 bg-gold text-navy text-sm font-bold rounded hover:bg-gold/90 transition flex-shrink-0">
                  Search
                </Link>
              </div>
            </section>
          </div>

          {/* === RIGHT COLUMN (1/3) === */}
          <div className="space-y-6">

            {/* DAILY POLL */}
            {activePoll && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-navy px-4 py-3">
                  <h3 className="text-gold font-bebas text-lg">Daily Poll</h3>
                </div>
                <div className="p-4">
                  <p className="font-medium text-navy text-sm mb-3">{activePoll.question}</p>
                  <div className="space-y-2">
                    {activePoll.options.map((opt, idx) => {
                      const pct = activePoll.total_votes > 0
                        ? Math.round((opt.votes / activePoll.total_votes) * 100)
                        : 0;
                      return (
                        <div key={idx} className="relative">
                          <div className="flex items-center justify-between text-sm py-2 px-3 rounded bg-gray-50 relative z-10">
                            <span className="text-gray-700">{opt.label}</span>
                            <span className="font-bold text-navy">{pct}%</span>
                          </div>
                          <div
                            className="absolute top-0 left-0 h-full bg-gold/15 rounded transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    {activePoll.total_votes.toLocaleString()} votes
                    {activePoll.ends_at && ` � Ends ${new Date(activePoll.ends_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                  </p>
                </div>
              </div>
            )}

            {/* OUTSIDE THE 215 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-navy px-4 py-3 flex items-center justify-between">
                <h3 className="text-gold font-bebas text-lg">Outside the 215</h3>
                <Link href="/pulse/outside-the-215" className="text-xs text-gray-400 hover:text-gold transition">
                  View All &rarr;
                </Link>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">
                  Tracking Philly-area kids playing outside the city leagues. Know someone? <Link href="/pulse/outside-the-215" className="text-blue-600 hover:text-blue-800">Submit a tip</Link>.
                </p>
                <div className="text-center py-4">
                  <p className="text-3xl mb-2">📍</p>
                  <p className="text-sm text-gray-500">Coming soon — be the first to contribute.</p>
                </div>
              </div>
            </div>

            {/* TOP PROGRAMS */}
            {topPrograms.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-navy px-4 py-3">
                  <h3 className="text-gold font-bebas text-lg">Top Programs</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {topPrograms.slice(0, 8).map((prog, idx) => {
                    const primary = prog.colors?.primary || '#6b7280';
                    return (
                      <Link
                        key={prog.id}
                        href={`/football/schools/${prog.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition"
                      >
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: primary }} />
                        <span className="text-sm text-navy font-medium flex-1 truncate">{prog.name}</span>
                        <span className="text-xs text-gray-400">{prog.championship_count} titles</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUICK LINKS */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bebas text-navy text-lg mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/potw" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>🏆</span> Player of the Week
                </Link>
                <Link href="/pulse/our-guys" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>🌟</span> Our Guys in the Pros
                </Link>
                <Link href="/pulse/outside-the-215" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>📍</span> Outside the 215
                </Link>
                <Link href="/search" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>🔍</span> Search Database
                </Link>
                <Link href="/football" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>🏈</span> Football Hub
                </Link>
                <Link href="/basketball" className="flex items-center gap-2 text-sm text-gray-700 hover:text-navy transition">
                  <span>🏀</span> Basketball Hub
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
