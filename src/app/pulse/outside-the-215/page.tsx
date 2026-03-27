import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';
import PulseNav from '@/components/pulse/PulseNav';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Outside the 215 — The Pulse | PhillySportsPack.com',
  description: 'Track player transfers in and out of Philadelphia high school sports programs.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/pulse/outside-the-215' },
  robots: { index: true, follow: true },
};

interface TransferRow {
  id: string;
  transfer_year: number | null;
  sport_id: string | null;
  reason: string | null;
  verified: boolean;
  source_url: string | null;
  players?: { name: string; slug: string; graduation_year: number | null; positions: string[] | null } | null;
  from_school?: { name: string; slug: string } | null;
  to_school?: { name: string; slug: string } | null;
}

export default async function TransfersPage() {
  const supabase = createStaticClient();

  const [transfersRes, countRes] = await Promise.all([
    supabase
      .from('transfers')
      .select('*, players(name, slug, graduation_year, positions), from_school:schools!transfers_from_school_id_fkey(name, slug), to_school:schools!transfers_to_school_id_fkey(name, slug)')
      .order('transfer_year', { ascending: false })
      .limit(100),
    supabase.from('transfers').select('id', { count: 'exact', head: true }),
  ]);

  const transfers = (transfersRes.data ?? []) as TransferRow[];

  // Group by year
  const byYear: Record<number, TransferRow[]> = {};
  transfers.forEach(t => {
    const year = t.transfer_year || 0;
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(t);
  });
  const sortedYears = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="psp-h1 text-white mb-2">Transfer Tracker</h1>
          <p className="text-gray-300 text-lg">Tracking player movement across Philadelphia high school programs</p>
          <p className="text-gold font-bold mt-4">{countRes.count ?? 0} transfers tracked</p>
        </div>
      </div>

      <PulseNav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {transfers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">🔄</p>
            <p className="text-gray-700 text-xl font-medium mb-2">Transfer Tracking Coming Soon</p>
            <p className="text-gray-400 max-w-md mx-auto">
              We&apos;re building a comprehensive transfer tracker to follow players who move between Philly-area programs.
              Know about a transfer? Let us know!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedYears.map(year => (
              <section key={year}>
                <h2 className="psp-h2 text-navy mb-4 pb-2 border-b-2 border-gold">
                  {year === 0 ? 'Year Unknown' : year}
                </h2>
                <div className="space-y-3">
                  {byYear[year].map(t => {
                    const sportMeta = t.sport_id ? SPORT_META[t.sport_id as keyof typeof SPORT_META] : null;
                    return (
                      <div key={t.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 hover:border-gold transition">
                        <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-gold text-lg flex-shrink-0">
                          🔄
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-navy">
                            {sportMeta?.emoji} {t.players?.name || 'Unknown Player'}
                            {t.players?.graduation_year && (
                              <span className="text-gray-300 text-sm font-normal ml-1">
                                &apos;{String(t.players.graduation_year).slice(-2)}
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {t.from_school ? (
                              <Link href={`/football/schools/${t.from_school.slug}`} className="text-blue-600 hover:text-blue-800">
                                {t.from_school.name}
                              </Link>
                            ) : (
                              <span className="text-gray-300">Unknown</span>
                            )}
                            <span className="mx-2 text-gold font-bold">&rarr;</span>
                            {t.to_school ? (
                              <Link href={`/football/schools/${t.to_school.slug}`} className="text-blue-600 hover:text-blue-800">
                                {t.to_school.name}
                              </Link>
                            ) : (
                              <span className="text-gray-300">Unknown</span>
                            )}
                          </p>
                          {t.reason && <p className="text-xs text-gray-400 mt-1">{t.reason}</p>}
                        </div>
                        <div className="flex-shrink-0">
                          {t.verified ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Verified</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-400 text-xs font-medium rounded">Unverified</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <PSPPromo size="banner" variant={5} />
      </div>
    </div>
  );
}
