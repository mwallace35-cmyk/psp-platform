import type { Metadata } from 'next';
import Link from 'next/link';
import { createStaticClient } from '@/lib/supabase/static';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Players | Philadelphia High School Sports Stats',
  description: 'Browse Philadelphia high school athletes across football, basketball, baseball, and more. Career stats, player profiles, and college recruiting information.',
  alternates: { canonical: 'https://phillysportspack.com/players' },
  openGraph: {
    title: 'Players | PhillySportsPack.com',
    description: 'Philadelphia high school athletes — stats and profiles.',
    images: [{ url: 'https://www.phillysportspack.com/opengraph-image', width: 1200, height: 630 }],
  },
};

const SPORTS = [
  { name: 'Football',      slug: 'football',    emoji: '\uD83C\uDFC8', color: 'var(--fb)' },
  { name: 'Basketball',    slug: 'basketball',  emoji: '\uD83C\uDFC0', color: 'var(--psp-blue)' },
  { name: 'Baseball',      slug: 'baseball',    emoji: '\u26BE',        color: 'var(--bb)' },
  { name: 'Soccer',        slug: 'soccer',      emoji: '\u26BD',        color: 'var(--soccer)' },
  { name: 'Lacrosse',      slug: 'lacrosse',    emoji: '\uD83E\uDD4D', color: 'var(--lac)' },
  { name: 'Track & Field', slug: 'track-field', emoji: '\uD83C\uDFC3', color: 'var(--track)' },
  { name: 'Wrestling',     slug: 'wrestling',    emoji: '\uD83E\uDD3C', color: 'var(--wrest)' },
];

export default async function PlayersPage() {
  const supabase = createStaticClient();

  // Fetch notable players: most-awarded recent players
  const { data: featuredRaw } = await supabase
    .from('awards')
    .select('player_id, players!inner(name, slug, graduation_year, schools:primary_school_id(name))')
    .gte('year', 2020)
    .not('player_id', 'is', null)
    .order('year', { ascending: false })
    .limit(100);

  // Deduplicate by player_id, count awards, pick top 12
  const playerMap = new Map<number, { name: string; slug: string; school: string; gradYear: number | null; awards: number }>();
  for (const row of (featuredRaw ?? []) as any[]) {
    const pid = row.player_id;
    const p = Array.isArray(row.players) ? row.players[0] : row.players;
    if (!p?.slug) continue;
    const existing = playerMap.get(pid);
    if (existing) {
      existing.awards++;
    } else {
      const school = Array.isArray(p.schools) ? p.schools[0] : p.schools;
      playerMap.set(pid, {
        name: p.name,
        slug: p.slug,
        school: school?.name ?? '',
        gradYear: p.graduation_year,
        awards: 1,
      });
    }
  }
  const featured = Array.from(playerMap.values())
    .sort((a, b) => b.awards - a.awards)
    .slice(0, 12);

  return (
    <div className="min-h-screen" style={{ background: 'var(--psp-navy)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
          <Link href="/" className="text-[var(--psp-gold)] hover:underline">Home</Link>
          <span className="text-gray-500"> › </span>
          <span className="text-gray-400">Players</span>
        </nav>

        <h1 className="psp-h1 text-white mb-2">PLAYERS</h1>
        <p className="text-gray-400 text-base max-w-xl mb-8">
          Search 55,000+ Philadelphia high school athletes across all sports. Find stats, profiles, and recruiting info.
        </p>

        {/* Search CTA */}
        <Link
          href="/search"
          className="flex items-center gap-3 w-full max-w-xl px-4 py-3.5 rounded-xl border border-gray-600 bg-[var(--psp-navy-mid)] text-gray-400 hover:border-[var(--psp-gold)]/50 hover:text-gray-300 transition mb-10"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search players by name, school, or sport...</span>
        </Link>

        {/* Browse by Sport */}
        <h2 className="psp-h4 text-gray-100 mb-4">BROWSE BY SPORT</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
          {SPORTS.map((sport) => (
            <Link
              key={sport.slug}
              href={`/${sport.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-700/50 bg-[var(--psp-navy-mid)] hover:border-[var(--psp-gold)]/40 hover:shadow-lg hover:shadow-[var(--psp-gold)]/5 transition group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{sport.emoji}</span>
              <span className="text-sm font-semibold text-gray-200 group-hover:text-[var(--psp-gold)] transition">{sport.name}</span>
            </Link>
          ))}
        </div>

        {/* Featured Players */}
        {featured.length > 0 && (
          <>
            <h2 className="psp-h4 text-gray-100 mb-4">MOST-DECORATED PLAYERS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
              {featured.map((p) => (
                <Link
                  key={p.slug}
                  href={`/football/players/${p.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-700/50 bg-[var(--psp-navy-mid)] hover:border-gray-600 transition group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)' }}>
                    {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-100 group-hover:text-[var(--psp-gold)] transition truncate">{p.name}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {p.school}{p.gradYear ? ` · '${String(p.gradYear).slice(2)}` : ''}
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(240,165,0,0.15)', color: 'var(--psp-gold)' }}>
                    {p.awards} award{p.awards !== 1 ? 's' : ''}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Leaderboard Links */}
        <h2 className="psp-h4 text-gray-100 mb-4">STAT LEADERBOARDS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SPORTS.slice(0, 3).map((sport) => (
            <Link
              key={sport.slug}
              href={`/${sport.slug}/leaderboards`}
              className="group flex items-center gap-3 p-4 rounded-xl border border-gray-700/50 bg-[var(--psp-navy-mid)] hover:border-[var(--psp-gold)]/40 transition"
            >
              <span className="text-2xl">{sport.emoji}</span>
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-100 group-hover:text-[var(--psp-gold)] transition">{sport.name} Leaders</div>
                <div className="text-xs text-gray-400">Top statistical performers</div>
              </div>
              <svg className="w-4 h-4 text-gray-500 group-hover:text-[var(--psp-gold)] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
