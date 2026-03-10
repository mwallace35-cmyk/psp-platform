import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';
import PulseNav from '@/components/pulse/PulseNav';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Power Rankings — The Pulse | PhillySportsPack.com',
  description: 'Weekly power rankings for Philadelphia high school sports — football, basketball, baseball, and more.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/events/rankings' },
  robots: { index: true, follow: true },
};

interface RankingRow {
  id: string;
  sport_id: string;
  week_label: string;
  rank_position: number;
  previous_rank: number | null;
  record_display: string | null;
  blurb: string | null;
  published_at: string;
  schools?: { name: string; slug: string; colors: Record<string, string> | null; mascot: string | null } | null;
}

const RANKED_SPORTS = ['football', 'basketball', 'baseball'];

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const params = await searchParams;
  const activeSport = params.sport || 'football';
  const supabase = createStaticClient();

  // Get rankings for active sport
  const { data: rankings } = await supabase
    .from('power_rankings')
    .select('*, schools(name, slug, colors, mascot)')
    .eq('sport_id', activeSport)
    .order('published_at', { ascending: false })
    .order('rank_position', { ascending: true })
    .limit(50);

  const rankedData = (rankings ?? []) as RankingRow[];

  // Group by week
  const byWeek: Record<string, RankingRow[]> = {};
  rankedData.forEach(r => {
    if (!byWeek[r.week_label]) byWeek[r.week_label] = [];
    byWeek[r.week_label].push(r);
  });
  const weeks = Object.keys(byWeek);
  const currentWeek = weeks[0];
  const currentRankings = currentWeek ? byWeek[currentWeek] : [];

  const sportMeta = SPORT_META[activeSport as keyof typeof SPORT_META];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas text-white mb-2">Power Rankings</h1>
          <p className="text-gray-300 text-lg">Weekly school rankings across Philly HS sports</p>
        </div>
      </div>

      <PulseNav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Sport Tabs */}
        <div className="flex gap-2 mb-8">
          {RANKED_SPORTS.map(sport => {
            const meta = SPORT_META[sport as keyof typeof SPORT_META];
            return (
              <Link
                key={sport}
                href={`/events/rankings?sport=${sport}`}
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

        {currentRankings.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-gray-700 text-xl font-medium mb-2">
              {sportMeta?.name} Rankings Coming Soon
            </p>
            <p className="text-gray-500">
              Power rankings will be published weekly during the season. Check back when {sportMeta?.name?.toLowerCase()} season kicks off!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bebas text-navy">
                {sportMeta?.emoji} {sportMeta?.name} — {currentWeek}
              </h2>
              {currentRankings[0]?.published_at && (
                <p className="text-xs text-gray-500">
                  Published {new Date(currentRankings[0].published_at).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {currentRankings.map((r, idx) => {
                const rankChange = r.previous_rank !== null ? r.previous_rank - r.rank_position : 0;
                const primaryColor = r.schools?.colors?.primary;

                return (
                  <div
                    key={r.id}
                    className={`flex items-center gap-4 px-5 py-4 ${idx > 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50 transition`}
                  >
                    {/* Rank */}
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold ${
                      r.rank_position <= 3 ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {r.rank_position}
                    </div>

                    {/* School color bar */}
                    {primaryColor && (
                      <div className="w-1 h-10 rounded-full" style={{ backgroundColor: primaryColor }} />
                    )}

                    {/* School info */}
                    <div className="flex-1 min-w-0">
                      {r.schools ? (
                        <Link href={`/${activeSport}/schools/${r.schools.slug}`} className="font-bold text-navy hover:text-blue-600 transition">
                          {r.schools.name}
                          {r.schools.mascot && <span className="text-gray-400 font-normal text-sm ml-1">{r.schools.mascot}</span>}
                        </Link>
                      ) : (
                        <span className="font-bold text-navy">Unknown School</span>
                      )}
                      {r.record_display && (
                        <p className="text-sm text-gray-500">{r.record_display}</p>
                      )}
                      {r.blurb && (
                        <p className="text-sm text-gray-600 mt-1">{r.blurb}</p>
                      )}
                    </div>

                    {/* Rank Change */}
                    <div className="flex-shrink-0 w-12 text-center">
                      {rankChange > 0 && (
                        <span className="text-green-600 text-sm font-bold">&#9650; {rankChange}</span>
                      )}
                      {rankChange < 0 && (
                        <span className="text-red-500 text-sm font-bold">&#9660; {Math.abs(rankChange)}</span>
                      )}
                      {rankChange === 0 && r.previous_rank !== null && (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                      {r.previous_rank === null && (
                        <span className="text-blue-500 text-xs font-bold">NEW</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Previous weeks */}
            {weeks.length > 1 && (
              <div className="mt-8">
                <h3 className="font-bebas text-navy text-lg mb-3">Previous Weeks</h3>
                <div className="flex flex-wrap gap-2">
                  {weeks.slice(1).map(week => (
                    <span key={week} className="px-3 py-1 bg-white border border-gray-200 rounded text-sm text-gray-600">
                      {week}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <PSPPromo size="banner" variant={4} />
        </div>
      </div>
    </div>
  );
}
