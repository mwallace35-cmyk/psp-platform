import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { SPORT_META, type SportId } from '@/lib/sports';
import { Breadcrumb } from '@/components/ui';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import type { Metadata } from 'next';

export const revalidate = 3600; // ISR: hourly

export const metadata: Metadata = {
  title: 'Community — PhillySportsPack',
  description: 'Join the PhillySportsPack community. POTW history, top contributors, and more.',
  alternates: {
    canonical: 'https://phillysportspack.com/community',
  },
};

export default async function CommunityPage() {
  const supabase = await createClient();

  // Fetch POTW winners
  const { data: winners } = await supabase
    .from('potw_winners')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12);

  // Fetch recent corrections count
  const { count: correctionsCount } = await supabase
    .from('corrections')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  // Fetch article count
  const { count: articleCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  // Fetch comment count
  const { count: commentCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Community' }]} />

      {/* Hero */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)' }}
      >
        <h1
          className="text-5xl md:text-6xl text-white tracking-wider mb-4"
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
        >
          PSP Community
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Celebrating Philadelphia high school sports together. Vote, contribute, and connect with fellow fans.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold" style={{ color: 'var(--psp-gold)' }}>{articleCount || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Articles Published</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold" style={{ color: 'var(--psp-gold)' }}>{commentCount || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Comments</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold" style={{ color: 'var(--psp-gold)' }}>{correctionsCount || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Community Corrections</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold" style={{ color: 'var(--psp-gold)' }}>{winners?.length || 0}</p>
            <p className="text-sm text-gray-600 mt-1">POTW Winners</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* POTW History */}
          <div className="lg:col-span-2">
            <h2
              className="text-3xl font-bold mb-6 tracking-wider"
              style={{ color: 'var(--psp-navy)', fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Player of the Week History
            </h2>

            {winners && winners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {winners.map((w: any) => (
                  <div
                    key={w.id}
                    className="p-4 border rounded-lg hover:shadow-md transition"
                    style={{ borderColor: 'var(--psp-gold)', background: 'rgba(240, 165, 0, 0.03)' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{w.player_name}</p>
                        <p className="text-sm text-gray-600">{w.school_name}</p>
                      </div>
                      {w.sport_id && SPORT_META[w.sport_id as SportId] && (
                        <span className="text-lg">{SPORT_META[w.sport_id as SportId].emoji}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Week {w.week}, {w.year}</span>
                      <span className="font-semibold" style={{ color: 'var(--psp-gold)' }}>{w.vote_count} votes</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No POTW winners yet. Start voting!</p>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/potw"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition hover:opacity-90"
                style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)' }}
              >
                Vote for This Week's POTW →
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How to Contribute */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">How to Contribute</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-3">
                  <span className="text-lg">🗳️</span>
                  <div>
                    <p className="font-medium text-gray-900">Vote for POTW</p>
                    <p>Vote weekly for the best player performance.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg">✏️</span>
                  <div>
                    <p className="font-medium text-gray-900">Submit Corrections</p>
                    <p>Help us keep our data accurate with community corrections.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg">💬</span>
                  <div>
                    <p className="font-medium text-gray-900">Join Discussions</p>
                    <p>
                      <Link href="/signup" className="hover:underline" style={{ color: 'var(--psp-gold)' }}>
                        Create an account
                      </Link>{' '}
                      to comment on articles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </>
  );
}
