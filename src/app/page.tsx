import { createStaticClient } from '@/lib/supabase/static';
import { getCurrentSeasonId } from '@/lib/data/seasons';
import type { Metadata } from 'next';
import Link from 'next/link';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import SportNavigationGrid from '@/components/home/SportNavigationGrid';
import PotwHomepageWidget from '@/components/pulse/PotwHomepageWidget';
import { getSchoolDisplayName } from '@/lib/utils/schoolDisplayName';

export const revalidate = 300; // 5 min ISR — live content
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PhillySportsPack.com — Philadelphia High School Sports Database',
  description: 'The definitive source for Philadelphia high school sports. Scores, stats, rankings, player profiles, and recruiting across football, basketball, baseball, and more.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com' },
  openGraph: {
    title: 'PhillySportsPack.com — Philadelphia High School Sports',
    description: 'Scores, stats, rankings, and player profiles for 7 sports across 1,300+ schools.',
    url: 'https://phillysportspack.com',
    siteName: 'PhillySportsPack.com',
    images: [{ url: 'https://phillysportspack.com/og-default.png', width: 1200, height: 630, alt: 'PhillySportsPack.com' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'PhillySportsPack.com', description: 'The definitive source for Philadelphia high school sports.', images: ['https://phillysportspack.com/og-default.png'] },
  robots: { index: true, follow: true },
};

export default async function HomePage() {
  const supabase = createStaticClient();

  // Get current season for season-aware queries
  const currentSeasonId = await getCurrentSeasonId();

  // Parallel data fetching — lightweight queries only
  const [articlesRes, recentGamesRes, alumniRes, potwRes, pickemCountRes] = await Promise.all([
    supabase
      .from('articles')
      .select('id, slug, title, excerpt, author_name, sport_id, published_at, content_type')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(6),

    // Recent completed games (last 7 days)
    supabase
      .from('games')
      .select('id, game_date, sport_id, home_score, away_score, home_school:home_school_id(name, slug, city, league_id), away_school:away_school_id(name, slug, city, league_id)')
      .not('home_score', 'is', null)
      .gte('game_date', new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10))
      .order('game_date', { ascending: false })
      .limit(8),

    // Featured active alumni
    supabase
      .from('next_level_tracking')
      .select('id, person_name, current_org, pro_league, sport_id, status, schools:high_school_id(name, slug)')
      .eq('featured', true)
      .eq('status', 'active')
      .limit(6),

    // POTW nominees — current week
    supabase
      .from('potw_nominees')
      .select('id, player_name, school_name, sport_id, stat_line, votes, is_winner')
      .eq('is_winner', false)
      .order('votes', { ascending: false })
      .limit(6),

    // Active Pick'em games (game_date >= today)
    supabase
      .from('pickem_games')
      .select('id, games!inner(game_date)', { count: 'exact', head: true })
      .gte('games.game_date', new Date().toISOString().slice(0, 10)),
  ]);

  // Season-aware scores fallback: if no games in last 7 days,
  // show most recent completed games from the current season
  let seasonFallbackGamesRes: typeof recentGamesRes | null = null;
  let scoresLabel: 'this-week' | 'recent' = 'this-week';

  if ((recentGamesRes.data ?? []).length === 0) {
    seasonFallbackGamesRes = await supabase
      .from('games')
      .select('id, game_date, sport_id, home_score, away_score, home_school:home_school_id(name, slug, city, league_id), away_school:away_school_id(name, slug, city, league_id)')
      .not('home_score', 'is', null)
      .eq('season_id', currentSeasonId)
      .or('home_score.gt.0,away_score.gt.0')
      .order('game_date', { ascending: false })
      .limit(8);
    scoresLabel = 'recent';
  }

  const articles = articlesRes.data ?? [];
  const rawGames = (recentGamesRes.data ?? []).length > 0
    ? (recentGamesRes.data ?? [])
    : (seasonFallbackGamesRes?.data ?? []);
  const recentGames = rawGames.map((g: Record<string, unknown>) => ({
    ...g,
    home_school: Array.isArray(g.home_school) ? g.home_school[0] : g.home_school,
    away_school: Array.isArray(g.away_school) ? g.away_school[0] : g.away_school,
  }));
  const featuredAlumni = (alumniRes.data ?? []).map((a: Record<string, unknown>) => ({
    ...a,
    schools: Array.isArray(a.schools) ? a.schools[0] : a.schools,
  }));
  const potwNominees = (potwRes.data ?? []).map((n: Record<string, unknown>) => ({
    id: String(n.id),
    player_name: (n.player_name as string) || '',
    school_name: (n.school_name as string) || '',
    sport_id: (n.sport_id as string) || '',
    stat_line: (n.stat_line as string) || null,
    votes: (n.votes as number) || 0,
    is_winner: (n.is_winner as boolean) || false,
  }));
  const activePickemCount = pickemCountRes.count ?? 0;

  const SPORT_EMOJI: Record<string, string> = {
    football: '🏈', basketball: '🏀', baseball: '⚾', soccer: '⚽',
    lacrosse: '🥍', 'track-field': '🏃', wrestling: '🤼',
  };

  const SPORT_COLOR: Record<string, string> = {
    football: '#16a34a', basketball: '#3b82f6', baseball: '#ea580c',
    soccer: '#059669', lacrosse: '#0891b2', 'track-field': '#7c3aed', wrestling: '#ca8a04',
  };

  const LEAGUE_BADGES: Record<string, { icon: string; bg: string }> = {
    NFL: { icon: '🏈', bg: 'bg-green-700' },
    NBA: { icon: '🏀', bg: 'bg-orange-600' },
    MLB: { icon: '⚾', bg: 'bg-blue-700' },
    MLS: { icon: '⚽', bg: 'bg-emerald-600' },
    NHL: { icon: '🏒', bg: 'bg-slate-600' },
  };

  // Compute the "This Week" date range label
  const now = new Date();
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const weekRangeLabel = `${weekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <div className="min-h-screen bg-[var(--psp-navy)]">
      <OrganizationJsonLd />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[var(--psp-navy)] to-[var(--psp-navy-mid)] pt-10 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bebas text-white tracking-wide">
            PHILLY<span className="text-[var(--psp-gold)]">SPORTS</span>PACK
          </h1>
          <p className="text-gray-300 text-sm md:text-base mt-2 font-medium tracking-wide">
            Scores &bull; Stats &bull; Rankings &bull; 7 Sports &bull; 1,300+ Schools
          </p>

          {/* Search Bar */}
          <form action="/search" className="mt-5 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search players, schools, teams..."
                className="w-full bg-[var(--psp-navy-mid)] border border-gray-600 rounded-full px-5 py-3 pl-12 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-[var(--psp-gold)] focus:ring-1 focus:ring-[var(--psp-gold)] transition"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
        </div>
      </div>

      {/* Sport Navigation */}
      <div className="max-w-7xl mx-auto px-4 -mt-2 mb-6">
        <SportNavigationGrid sports={[
          { id: 'football', name: 'Football', slug: 'football', playerCount: 0 },
          { id: 'basketball', name: 'Basketball', slug: 'basketball', playerCount: 0 },
          { id: 'baseball', name: 'Baseball', slug: 'baseball', playerCount: 0 },
          { id: 'soccer', name: 'Soccer', slug: 'soccer', playerCount: 0 },
          { id: 'lacrosse', name: 'Lacrosse', slug: 'lacrosse', playerCount: 0 },
          { id: 'track-field', name: 'Track & Field', slug: 'track-field', playerCount: 0 },
          { id: 'wrestling', name: 'Wrestling', slug: 'wrestling', playerCount: 0 },
        ]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recent Scores */}
            <section>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bebas text-gray-100 tracking-wider">
                  {scoresLabel === 'this-week' ? 'This Week' : 'Recent Scores'}
                </h2>
                <Link href="/scores" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition">
                  All Scores →
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
                        className="flex items-center bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-4 py-3 hover:border-[var(--psp-gold)]/30 hover:bg-[var(--psp-navy-mid)]/80 transition group"
                      >
                        <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">{SPORT_EMOJI[(game.sport_id as string) || '']}</span>
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
                        <div className="flex flex-col items-end ml-3 shrink-0">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">Final</span>
                          <span className="text-[10px] text-gray-500 mt-1">
                            {new Date(game.game_date as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-4 py-6 text-center">
                  <p className="text-sm text-gray-400">No recent games to show right now.</p>
                  <Link href="/scores" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] mt-2 inline-block transition">
                    Browse all scores →
                  </Link>
                </div>
              )}
            </section>

            {/* Latest Articles */}
            {articles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bebas text-gray-100 tracking-wider">Latest Stories</h2>
                  <Link href="/articles" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition">
                    All Stories →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articles.slice(0, 4).map((article: Record<string, unknown>) => {
                    const sportId = (article.sport_id as string) || '';
                    const dotColor = SPORT_COLOR[sportId] || '#6b7280';
                    const excerptText = (article.excerpt as string)
                      ? (article.excerpt as string)
                      : (article.title as string).length > 100
                        ? (article.title as string).slice(0, 100) + '...'
                        : null;
                    return (
                      <Link
                        key={article.id as number}
                        href={`/articles/${article.slug}`}
                        className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 p-4 hover:border-[var(--psp-gold)]/30 hover:bg-[var(--psp-navy-mid)]/80 transition group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                          <span className="text-sm">{SPORT_EMOJI[sportId] || '📰'}</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {(article.content_type as string) || 'article'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-100 group-hover:text-[var(--psp-gold)] transition line-clamp-2">
                          {article.title as string}
                        </h3>
                        {excerptText && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{excerptText}</p>
                        )}
                        <p className="text-[10px] text-gray-500 mt-2">
                          {article.author_name as string} · {new Date(article.published_at as string).toLocaleDateString()}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* POTW Voting Widget */}
            <PotwHomepageWidget nominees={potwNominees} />

            {/* Rankings link */}
            <Link href="/rankings" className="group flex items-center gap-4 bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 p-5 hover:border-[var(--psp-gold)]/50 hover:shadow-lg hover:shadow-[var(--psp-gold)]/5 transition-all">
              <div className="text-3xl group-hover:scale-110 transition-transform">📊</div>
              <div>
                <h3 className="text-sm font-bold text-gray-100 group-hover:text-[var(--psp-gold)] transition">Power Rankings</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">See who&apos;s on top this week</p>
              </div>
              <svg className="w-4 h-4 text-gray-500 ml-auto group-hover:text-[var(--psp-gold)] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Alumni */}
            {featuredAlumni.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bebas text-gray-100 tracking-wider">Our Guys</h2>
                  <Link href="/our-guys" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition">
                    View All →
                  </Link>
                </div>
                <div className="space-y-2">
                  {featuredAlumni.slice(0, 5).map((a: Record<string, unknown>) => {
                    const school = a.schools as Record<string, unknown> | null;
                    const league = (a.pro_league as string) ? LEAGUE_BADGES[a.pro_league as string] : null;
                    return (
                      <div key={a.id as string} className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-3 py-2.5 hover:border-gray-600 transition">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm text-gray-100 font-medium">{a.person_name as string}</p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {a.current_org as string} · {school?.name as string}
                            </p>
                          </div>
                          {league ? (
                            <span className={`shrink-0 text-[10px] font-bold text-white px-2 py-0.5 rounded ${league.bg}`}>
                              {league.icon} {a.pro_league as string}
                            </span>
                          ) : (a.pro_league as string) ? (
                            <span className="shrink-0 text-[10px] font-bold text-[var(--psp-gold)] bg-[var(--psp-gold)]/10 px-2 py-0.5 rounded">
                              {a.pro_league as string}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Pick'em Promo — only if active games exist */}
            {activePickemCount > 0 && (
              <Link
                href="/pickem"
                className="group flex items-center gap-4 bg-gradient-to-br from-[var(--psp-navy-mid)] to-[#0d1a30] rounded-lg border border-[var(--psp-gold)]/30 p-4 hover:border-[var(--psp-gold)]/60 hover:shadow-lg hover:shadow-[var(--psp-gold)]/10 transition-all"
              >
                <div className="text-3xl group-hover:scale-110 transition-transform shrink-0">🏈</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[var(--psp-gold)] group-hover:text-[var(--psp-gold-light)] transition">Pick&apos;em</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Make your picks for this week&apos;s games</p>
                </div>
                <svg className="w-4 h-4 text-[var(--psp-gold)]/50 group-hover:text-[var(--psp-gold)] transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            {/* Leaderboard links */}
            <section className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Leaderboards</h3>
              <div className="space-y-2">
                <Link href="/football/leaderboards" className="block text-sm text-gray-200 hover:text-[var(--psp-gold)] transition">🏈 Football Leaders</Link>
                <Link href="/basketball/leaderboards" className="block text-sm text-gray-200 hover:text-[var(--psp-gold)] transition">🏀 Basketball Leaders</Link>
                <Link href="/baseball/leaderboards" className="block text-sm text-gray-200 hover:text-[var(--psp-gold)] transition">⚾ Baseball Leaders</Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
