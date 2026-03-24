import { Suspense } from 'react';
import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import SportNavigationGrid from '@/components/home/SportNavigationGrid';
import PotwHomepageWidget from '@/components/pulse/PotwHomepageWidget';
import HomeScoresSection from '@/components/home/HomeScoresSection';
import HomeArticlesSection from '@/components/home/HomeArticlesSection';
import SkeletonCard from '@/components/ui/SkeletonCard';

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

  // Parallel data fetching — scores & articles handled by streamed async components
  const [alumniRes, potwRes, pickemCountRes] = await Promise.all([
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

  const LEAGUE_BADGES: Record<string, { icon: string; bg: string }> = {
    NFL: { icon: '\uD83C\uDFC8', bg: 'bg-green-700' },
    NBA: { icon: '\uD83C\uDFC0', bg: 'bg-orange-600' },
    MLB: { icon: '\u26BE', bg: 'bg-blue-700' },
    MLS: { icon: '\u26BD', bg: 'bg-emerald-600' },
    NHL: { icon: '\uD83C\uDFD2', bg: 'bg-slate-600' },
  };

  return (
    <div className="min-h-screen bg-[var(--psp-navy)]">
      <OrganizationJsonLd />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[var(--psp-navy)] to-[var(--psp-navy-mid)] pt-10 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="psp-h1-lg text-white">
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
                aria-label="Search players, schools, and teams"
                className="w-full bg-[var(--psp-navy-mid)] border border-gray-600 rounded-full px-5 py-3 pl-12 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-[var(--psp-gold)] focus:ring-1 focus:ring-[var(--psp-gold)] transition"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-3 space-y-6">

            {/* Recent Scores */}
            <Suspense fallback={<SkeletonCard />}>
              <HomeScoresSection />
            </Suspense>

            {/* Latest Articles */}
            <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><SkeletonCard /><SkeletonCard /></div>}>
              <HomeArticlesSection />
            </Suspense>

            {/* POTW Voting Widget */}
            <PotwHomepageWidget nominees={potwNominees} />

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Alumni */}
            {featuredAlumni.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="psp-h4 text-gray-100">Our Guys</h2>
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
                            <p className="text-xs text-gray-300 truncate">
                              {a.current_org as string} · {school?.name as string}
                            </p>
                          </div>
                          {league ? (
                            <span className={`shrink-0 text-xs font-bold text-white px-2 py-0.5 rounded ${league.bg}`}>
                              {league.icon} {a.pro_league as string}
                            </span>
                          ) : (a.pro_league as string) ? (
                            <span className="shrink-0 text-xs font-bold text-[var(--psp-gold)] bg-[var(--psp-gold)]/10 px-2 py-0.5 rounded">
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
                <div className="text-3xl group-hover:scale-110 transition-transform shrink-0" role="img" aria-label="football">🏈</div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-[var(--psp-gold)] group-hover:text-[var(--psp-gold-light)] transition">Pick&apos;em</h2>
                  <p className="text-xs text-gray-300 mt-0.5">Make your picks for this week&apos;s games</p>
                </div>
                <svg className="w-4 h-4 text-[var(--psp-gold)]/50 group-hover:text-[var(--psp-gold)] transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            {/* Power Rankings */}
            <Link href="/rankings" className="group flex items-center gap-3 bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 p-4 hover:border-[var(--psp-gold)]/50 hover:shadow-lg hover:shadow-[var(--psp-gold)]/5 transition-all">
              <div className="text-2xl group-hover:scale-110 transition-transform" role="img" aria-label="chart">📊</div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-gray-100 group-hover:text-[var(--psp-gold)] transition">Power Rankings</h2>
                <p className="text-xs text-gray-300 mt-0.5">See who&apos;s on top this week</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-[var(--psp-gold)] transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
