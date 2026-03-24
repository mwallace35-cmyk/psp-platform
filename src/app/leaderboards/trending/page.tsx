import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingPlayersWidget } from '@/components/stats/TrendingPlayersWidget';

export const revalidate = 3600;
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: 'Trending Players | PhillySportsPack',
  description: "See who's hot right now across Philadelphia high school sports.",
  alternates: { canonical: 'https://phillysportspack.com/leaderboards/trending' },
};

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="bg-gradient-to-b from-[#0a1628] to-[#0f1e30] border-b border-[#f0a500]/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#f0a500] text-sm font-semibold uppercase tracking-widest mb-2">Leaderboards</p>
          <h1 className="text-4xl font-black text-white mb-3">Trending This Week</h1>
          <p className="text-gray-300 text-lg">Top performers across Philadelphia high school sports right now.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Football</h2>
            <Link href="/football/leaderboards" className="text-[#f0a500] text-sm hover:underline">Full Leaderboard</Link>
          </div>
          <TrendingPlayersWidget sport="football" limit={5} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Basketball</h2>
            <Link href="/basketball/leaderboards" className="text-[#f0a500] text-sm hover:underline">Full Leaderboard</Link>
          </div>
          <TrendingPlayersWidget sport="basketball" limit={5} />
        </section>

        <section className="bg-gradient-to-r from-[#f0a500]/10 to-[#0f1e30] border border-[#f0a500]/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Advanced Stats</h3>
            <p className="text-gray-300 text-sm">YPC, completion %, TD:INT ratio, yards per target — efficiency metrics for football.</p>
          </div>
          <Link href="/football/leaderboards/efficiency" className="flex-shrink-0 px-5 py-2.5 bg-[#f0a500] text-[#0a1628] font-bold rounded-lg hover:bg-[#f0a500]/90 transition-colors text-sm">
            View Efficiency Stats
          </Link>
        </section>
      </div>
    </div>
  );
}
