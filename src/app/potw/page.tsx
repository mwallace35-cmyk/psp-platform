import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import { SPORT_META } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';
import PotwVoteButton from '@/components/potw/PotwVoteButton';
import JoinCTA from '@/components/ui/JoinCTA';

export const metadata: Metadata = {
  title: 'Player of the Week | PhillySportsPack.com',
  description: 'Vote for Philadelphia high school Player of the Week. See current nominees and past winners.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/potw' },
  openGraph: {
    title: 'Player of the Week | PhillySportsPack.com',
    description: 'Vote for Philadelphia high school Player of the Week. See current nominees and past winners.',
    url: 'https://phillysportspack.com/potw',
    siteName: 'PhillySportsPack.com',
    images: [{ url: 'https://phillysportspack.com/og-default.png', width: 1200, height: 630, alt: 'PhillySportsPack.com' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Player of the Week | PhillySportsPack.com', description: 'Vote for Philadelphia high school Player of the Week. See current nominees and past winners.', images: ['https://phillysportspack.com/og-default.png'] },
  robots: { index: true, follow: true },
};

export const revalidate = 300; // Revalidate every 5 minutes for voting
export const dynamic = "force-dynamic";
export default async function PotwPage() {
  const supabase = createStaticClient();

  // Fetch current nominees
  const { data: nominees } = await supabase
    .from('potw_nominees')
    .select('*')
    .order('vote_count', { ascending: false });

  // Fetch past winners
  const { data: winners } = await supabase
    .from('potw_winners')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12);

  const hasNominees = nominees && nominees.length > 0;
  const totalVotes = nominees?.reduce((sum, n) => sum + (n.vote_count || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-navy-mid py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl md:text-5xl font-bebas text-white mb-4">Player of the Week</h1>
          <p className="text-gold text-lg">
            Vote for the top performer in Philadelphia high school sports
          </p>
          {hasNominees && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-full px-6 py-2">
              <span className="text-white text-sm font-medium">{totalVotes} total votes this week</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Nominees */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bebas text-navy mb-6">This Week&apos;s Nominees</h2>

            {!hasNominees ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-4xl mb-4">🗳️</div>
                <p className="text-gray-500 text-lg mb-2">No nominees yet this week</p>
                <p className="text-gray-400 text-sm">Check back soon for this week&apos;s candidates!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nominees.map((nominee, idx) => {
                  const sportMeta = SPORT_META[nominee.sport_id as keyof typeof SPORT_META];
                  const isLeading = idx === 0 && nominee.vote_count > 0;

                  return (
                    <div
                      key={nominee.id}
                      className={`relative p-6 rounded-lg border transition ${
                        isLeading
                          ? 'border-gold bg-gold/5 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gold/50'
                      }`}
                    >
                      {isLeading && (
                        <div className="absolute -top-3 left-4 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full">
                          LEADING
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl font-bold text-gold">#{idx + 1}</span>
                            <div>
                              <h3 className="text-xl font-bold text-navy">{nominee.player_name}</h3>
                              <p className="text-gray-600 text-sm">
                                {nominee.school_name}
                                {sportMeta && (
                                  <span className="ml-2">
                                    {sportMeta.emoji} {sportMeta.name}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {nominee.stat_line && (
                            <div className="mt-2 bg-navy/5 rounded px-3 py-2 text-sm text-navy font-medium inline-block">
                              📊 {nominee.stat_line}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                          <div className="text-center sm:text-right">
                            <div className="text-3xl font-bold text-navy">{nominee.vote_count || 0}</div>
                            <div className="text-xs text-gray-500">votes</div>
                          </div>
                          <PotwVoteButton nomineeId={nominee.id} />
                        </div>
                      </div>

                      {/* Vote percentage bar */}
                      {totalVotes > 0 && (
                        <div className="mt-4">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold rounded-full transition-all duration-500"
                              style={{ width: `${Math.round(((nominee.vote_count || 0) / totalVotes) * 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {totalVotes > 0 ? Math.round(((nominee.vote_count || 0) / totalVotes) * 100) : 0}%
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <JoinCTA action="vote" context="Player of the Week" />
              </div>
            )}
          </div>

          {/* Sidebar - Past Winners */}
          <div>
            <h2 className="text-2xl font-bebas text-navy mb-6">Past Winners</h2>

            {!winners || winners.length === 0 ? (
              <p className="text-gray-500 text-sm">No past winners yet.</p>
            ) : (
              <div className="space-y-3">
                {winners.map((winner) => {
                  const sportMeta = SPORT_META[winner.sport_id as keyof typeof SPORT_META];
                  return (
                    <div
                      key={winner.id}
                      className="p-4 border border-gold/30 rounded-lg bg-gold/5 hover:bg-gold/10 transition"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-bold text-navy text-sm">{winner.player_name}</p>
                          <p className="text-xs text-gray-600">{winner.school_name}</p>
                        </div>
                        {sportMeta && (
                          <span className="text-lg" title={sportMeta.name}>
                            {sportMeta.emoji}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                        <span>Week {winner.week}, {winner.year}</span>
                        <span>{winner.vote_count} votes</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <PSPPromo size="sidebar" variant={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
