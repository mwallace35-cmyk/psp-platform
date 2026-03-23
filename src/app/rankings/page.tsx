import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';
import PulseNav from '@/components/pulse/PulseNav';
import RankingsClient from './RankingsClient';

export const revalidate = 3600;
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: 'Power Rankings — The Pulse | PhillySportsPack.com',
  description: 'Weekly power rankings for Philadelphia high school sports — football, basketball, baseball, and more.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/rankings' },
  robots: { index: true, follow: true },
};

const RANKED_SPORTS = ['football', 'basketball', 'baseball'];

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const params = await searchParams;
  const activeSport = params.sport || 'football';
  const supabase = createStaticClient();

  // Get all rankings for active sport (all weeks)
  const { data: rankings } = await supabase
    .from('power_rankings')
    .select('*, schools(name, slug, colors, mascot)')
    .eq('sport_id', activeSport)
    .order('published_at', { ascending: false })
    .order('rank_position', { ascending: true })
    .limit(200);

  const rankedData = (rankings ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    sport_id: r.sport_id as string,
    week_label: r.week_label as string,
    ranking_type: (r.ranking_type as string) || 'in_season',
    ranking_category: (r.ranking_category as string) || 'city',
    rank_position: r.rank_position as number,
    previous_rank: r.previous_rank as number | null,
    record_display: r.record_display as string | null,
    blurb: r.blurb as string | null,
    published_at: r.published_at as string,
    schools: r.schools as { name: string; slug: string; colors: Record<string, string> | null; mascot: string | null } | null,
  }));

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
                href={`/rankings?sport=${sport}`}
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

        {/* Rankings Client Component */}
        <RankingsClient
          rankings={rankedData}
          activeSport={activeSport}
          sportMeta={sportMeta ? { name: sportMeta.name, emoji: sportMeta.emoji } : null}
        />

        <div className="mt-8">
          <PSPPromo size="banner" variant={4} />
        </div>
      </div>
    </div>
  );
}
