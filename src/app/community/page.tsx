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

interface POTWWinner {
  id: number;
  player_name: string;
  school_name: string;
  sport_id: string;
  week: number;
  year: number;
  vote_count: number;
}

interface RecruitingProfile {
  id: number;
  player_name: string;
  school_name: string;
  sport_id: string;
  class_year: string;
  position?: string;
  status: string;
}

interface Correction {
  id: number;
  title: string;
  description?: string;
  status: string;
  created_at: string;
}

export default async function CommunityPage() {
  const supabase = await createClient();

  // Fetch POTW winners
  let winners: POTWWinner[] = [];
  try {
    const { data } = await supabase
      .from('potw_winners')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12);
    winners = data || [];
  } catch (error) {
    console.error('Error fetching POTW winners:', error);
  }

  // Fetch recruiting profiles
  let recruitingProfiles: RecruitingProfile[] = [];
  try {
    const { data } = await supabase
      .from('recruiting_profiles')
      .select('id, player_name, school_name, sport_id, class_year, position, status')
      .order('created_at', { ascending: false })
      .limit(5);
    recruitingProfiles = data || [];
  } catch (error) {
    console.error('Error fetching recruiting profiles:', error);
  }

  // Fetch recent corrections
  let corrections: Correction[] = [];
  try {
    const { data } = await supabase
      .from('corrections')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(5);
    corrections = data || [];
  } catch (error) {
    console.error('Error fetching corrections:', error);
  }

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
        <div className="text-sm font-semibold mb-2" style={{ color: 'var(--psp-gold)' }}>
          THE PULSE
        </div>
        <h1
          className="text-5xl md:text-6xl text-white tracking-wider mb-4"
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
        >
          Community Hub
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Stay connected with the Philadelphia high school sports community. Vote for POTW, track recruiting updates, submit corrections, and celebrate your favorite athletes.
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* POTW History */}
            <div>
              <h2
                className="text-3xl font-bold mb-6 tracking-wider"
                style={{ color: 'var(--psp-navy)', fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Player of the Week
              </h2>

              {winners && winners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {winners.map((w) => (
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

            {/* Recruiting Updates */}
            <div>
              <h2
                className="text-3xl font-bold mb-6 tracking-wider"
                style={{ color: 'var(--psp-navy)', fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Recruiting Updates
              </h2>

              {recruitingProfiles && recruitingProfiles.length > 0 ? (
                <div className="space-y-3">
                  {recruitingProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">{profile.player_name}</p>
                            {profile.sport_id && SPORT_META[profile.sport_id as SportId] && (
                              <span className="text-lg">{SPORT_META[profile.sport_id as SportId].emoji}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{profile.school_name}</p>
                          <div className="flex gap-2 mt-2 text-xs text-gray-500">
                            {profile.position && <span>{profile.position}</span>}
                            {profile.class_year && <span>Class of {profile.class_year}</span>}
                          </div>
                        </div>
                        <div
                          className="px-3 py-1 rounded text-xs font-semibold whitespace-nowrap"
                          style={{
                            background: profile.status === 'committed' ? 'rgba(52, 168, 83, 0.1)' : 'rgba(180, 180, 180, 0.1)',
                            color: profile.status === 'committed' ? '#34a853' : '#666',
                          }}
                        >
                          {profile.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent recruiting updates.</p>
              )}
            </div>

            {/* Recent Corrections */}
            <div>
              <h2
                className="text-3xl font-bold mb-6 tracking-wider"
                style={{ color: 'var(--psp-navy)', fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Recent Corrections
              </h2>

              {corrections && corrections.length > 0 ? (
                <div className="space-y-3">
                  {corrections.map((correction) => (
                    <div
                      key={correction.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition bg-white"
                    >
                      <p className="font-bold text-gray-900 mb-1">{correction.title}</p>
                      {correction.description && (
                        <p className="text-sm text-gray-600 mb-2">{correction.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(correction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent corrections.</p>
              )}
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
