import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import SportNavigationGrid from '@/components/home/SportNavigationGrid';

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

  // Parallel data fetching — lightweight queries only
  const [articlesRes, recentGamesRes, alumniRes] = await Promise.all([
    supabase
      .from('articles')
      .select('id, slug, title, excerpt, author_name, sport_id, published_at, content_type')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(6),

    // Recent completed games (last 7 days)
    supabase
      .from('games')
      .select('id, game_date, sport_id, home_score, away_score, home_school:home_school_id(name, slug), away_school:away_school_id(name, slug)')
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
  ]);

  const articles = articlesRes.data ?? [];
  const recentGames = (recentGamesRes.data ?? []).map((g: Record<string, unknown>) => ({
    ...g,
    home_school: Array.isArray(g.home_school) ? g.home_school[0] : g.home_school,
    away_school: Array.isArray(g.away_school) ? g.away_school[0] : g.away_school,
  }));
  const featuredAlumni = (alumniRes.data ?? []).map((a: Record<string, unknown>) => ({
    ...a,
    schools: Array.isArray(a.schools) ? a.schools[0] : a.schools,
  }));

  const SPORT_EMOJI: Record<string, string> = {
    football: '🏈', basketball: '🏀', baseball: '⚾', soccer: '⚽',
    lacrosse: '🥍', 'track-field': '🏃', wrestling: '🤼',
  };

  return (
    <div className="min-h-screen bg-[var(--psp-navy)]">
      <OrganizationJsonLd />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[var(--psp-navy)] to-[var(--psp-navy-mid)] pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas text-white tracking-wide">
            PHILLY<span className="text-[var(--psp-gold)]">SPORTS</span>PACK
          </h1>
          <p className="text-gray-400 text-sm mt-1">Philadelphia High School Sports — Scores, Stats, Rankings</p>
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
            {recentGames.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bebas text-white tracking-wider">Recent Scores</h2>
                  <Link href="/scores" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)]">
                    All Scores →
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentGames.map((game: Record<string, unknown>) => {
                    const home = game.home_school as Record<string, unknown> | null;
                    const away = game.away_school as Record<string, unknown> | null;
                    return (
                      <Link
                        key={game.id as string}
                        href={`/${game.sport_id}/games/${game.id}`}
                        className="flex items-center justify-between bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-4 py-3 hover:border-[var(--psp-gold)]/30 transition"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-lg">{SPORT_EMOJI[(game.sport_id as string) || '']}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white font-medium">{(away?.name as string) || 'TBD'}</span>
                              <span className="text-sm font-bold text-white">{game.away_score as number}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white font-medium">{(home?.name as string) || 'TBD'}</span>
                              <span className="text-sm font-bold text-white">{game.home_score as number}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 ml-3">
                          {new Date(game.game_date as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Latest Articles */}
            {articles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bebas text-white tracking-wider">Latest Stories</h2>
                  <Link href="/articles" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)]">
                    All Stories →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articles.slice(0, 4).map((article: Record<string, unknown>) => (
                    <Link
                      key={article.id as number}
                      href={`/articles/${article.slug}`}
                      className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 p-4 hover:border-[var(--psp-gold)]/30 transition group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{SPORT_EMOJI[(article.sport_id as string) || ''] || '📰'}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                          {(article.content_type as string) || 'article'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[var(--psp-gold)] transition line-clamp-2">
                        {article.title as string}
                      </h3>
                      {(article.excerpt as string) ? (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{article.excerpt as string}</p>
                      ) : null}
                      <p className="text-[10px] text-gray-600 mt-2">
                        {article.author_name as string} · {new Date(article.published_at as string).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* POTW + Rankings links */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/potw" className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 p-5 hover:border-[var(--psp-gold)]/30 transition text-center">
                <span className="text-3xl mb-2 block">🏆</span>
                <h3 className="text-sm font-bold text-white">Player of the Week</h3>
                <p className="text-[10px] text-gray-400 mt-1">Vote for this week&apos;s top performer</p>
              </Link>
              <Link href="/pulse/rankings" className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 p-5 hover:border-[var(--psp-gold)]/30 transition text-center">
                <span className="text-3xl mb-2 block">📊</span>
                <h3 className="text-sm font-bold text-white">Power Rankings</h3>
                <p className="text-[10px] text-gray-400 mt-1">See who&apos;s on top this week</p>
              </Link>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Alumni */}
            {featuredAlumni.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bebas text-white tracking-wider">Our Guys</h2>
                  <Link href="/pulse/our-guys" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)]">
                    View All →
                  </Link>
                </div>
                <div className="space-y-2">
                  {featuredAlumni.slice(0, 5).map((a: Record<string, unknown>) => {
                    const school = a.schools as Record<string, unknown> | null;
                    return (
                      <div key={a.id as string} className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-3 py-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white font-medium">{a.person_name as string}</p>
                            <p className="text-[10px] text-gray-400">
                              {a.current_org as string} · {school?.name as string}
                            </p>
                          </div>
                          {(a.pro_league as string) ? (
                            <span className="text-[10px] font-bold text-[var(--psp-gold)] bg-[var(--psp-gold)]/10 px-2 py-0.5 rounded">
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

            {/* Quick Links */}
            <section className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/pulse/rankings" className="block text-sm text-gray-300 hover:text-[var(--psp-gold)]">Power Rankings</Link>
                <Link href="/pulse/our-guys" className="block text-sm text-gray-300 hover:text-[var(--psp-gold)]">Our Guys — Next Level</Link>
                <Link href="/compare" className="block text-sm text-gray-300 hover:text-[var(--psp-gold)]">Compare Players</Link>
                <Link href="/search" className="block text-sm text-gray-300 hover:text-[var(--psp-gold)]">Player Search</Link>
                <Link href="/about" className="block text-sm text-gray-300 hover:text-[var(--psp-gold)]">About PSP</Link>
              </div>
            </section>

            {/* Leaderboard links */}
            <section className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Leaderboards</h3>
              <div className="space-y-2">
                <Link href="/football/leaderboards" className="block text-sm text-gray-300 hover:text-[var(--psp-gold)]">🏈 Football Leaders</Link>
                <Link href="/basketball/leaderboards" className="block text-sm text-gray-300 hover:text-[var(--psp-gold)]">🏀 Basketball Leaders</Link>
                <Link href="/baseball/leaderboards" className="block text-sm text-gray-300 hover:text-[var(--psp-gold)]">⚾ Baseball Leaders</Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
