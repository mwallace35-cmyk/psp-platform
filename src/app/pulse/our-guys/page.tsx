import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';
import PulseNav from '@/components/pulse/PulseNav';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Guys — The Pulse | PhillySportsPack.com',
  description: 'Track Philadelphia high school alumni playing in the NFL, NBA, MLB, college, and coaching at the next level.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/pulse/our-guys' },
  robots: { index: true, follow: true },
};

interface AlumniRecord {
  id: string;
  person_name: string;
  current_level: string;
  current_org: string | null;
  current_role: string | null;
  pro_league: string | null;
  sport_id: string | null;
  status: string | null;
  featured: boolean;
  bio_note: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  schools?: { name: string; slug: string } | null;
}

const LEVEL_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pro', label: 'Pro' },
  { key: 'college', label: 'College' },
  { key: 'coaching', label: 'Coaching' },
];

const LEAGUE_BADGES: Record<string, { icon: string; color: string }> = {
  NFL: { icon: '🏈', color: 'bg-green-700 text-white' },
  NBA: { icon: '🏀', color: 'bg-orange-600 text-white' },
  MLB: { icon: '⚾', color: 'bg-blue-700 text-white' },
  MLS: { icon: '⚽', color: 'bg-purple-700 text-white' },
};

export default async function OurGuysPage() {
  const supabase = createStaticClient();

  const [alumniRes, countsRes] = await Promise.all([
    supabase
      .from('next_level_tracking')
      .select('id, person_name, current_level, current_org, current_role, pro_league, sport_id, status, featured, bio_note, social_twitter, social_instagram, schools:high_school_id(name, slug)')
      .order('featured', { ascending: false })
      .order('person_name')
      .limit(200),
    Promise.all([
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'NFL'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'NBA'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'MLB'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('current_level', 'college'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('current_level', 'coaching'),
    ]),
  ]);

  const alumni = (alumniRes.data ?? []).map((a: Record<string, unknown>) => ({
    ...a,
    schools: Array.isArray(a.schools) ? a.schools[0] : a.schools,
  })) as AlumniRecord[];
  const [total, nfl, nba, mlb, college, coaching] = countsRes;

  // Group by level
  const proAlumni = alumni.filter(a => a.current_level === 'pro');
  const collegeAlumni = alumni.filter(a => a.current_level === 'college');
  const coachingAlumni = alumni.filter(a => a.current_level === 'coaching');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas text-white mb-2">Our Guys</h1>
          <p className="text-gray-300 text-lg">Philly HS alumni making it at the next level</p>

          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { label: 'Total Tracked', count: total.count ?? 0, color: 'text-white' },
              { label: 'NFL', count: nfl.count ?? 0, color: 'text-green-400' },
              { label: 'NBA', count: nba.count ?? 0, color: 'text-orange-400' },
              { label: 'MLB', count: mlb.count ?? 0, color: 'text-blue-400' },
              { label: 'College', count: college.count ?? 0, color: 'text-gold' },
              { label: 'Coaching', count: coaching.count ?? 0, color: 'text-gray-300' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PulseNav />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* PRO Section */}
        {proAlumni.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bebas text-navy mb-4 pb-2 border-b-2 border-gold">
              In the Pros
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {proAlumni.map((a) => {
                const league = a.pro_league ? LEAGUE_BADGES[a.pro_league] : null;
                return (
                  <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gold hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-navy text-lg">{a.person_name}</h3>
                      {league && (
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${league.color}`}>
                          {league.icon} {a.pro_league}
                        </span>
                      )}
                    </div>
                    {a.current_org && <p className="text-sm text-gray-700 font-medium">{a.current_org}</p>}
                    {a.current_role && <p className="text-sm text-gray-500">{a.current_role}</p>}
                    {a.schools && (
                      <Link href={`/football/schools/${a.schools.slug}`} className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block">
                        {a.schools.name}
                      </Link>
                    )}
                    {a.bio_note && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{a.bio_note}</p>}
                    <div className="flex gap-3 mt-3">
                      {a.social_twitter && (
                        <a href={`https://twitter.com/${a.social_twitter}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-700">
                          @{a.social_twitter}
                        </a>
                      )}
                      {a.social_instagram && (
                        <a href={`https://instagram.com/${a.social_instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-500 hover:text-pink-700">
                          IG: {a.social_instagram}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* COLLEGE Section */}
        {collegeAlumni.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bebas text-navy mb-4 pb-2 border-b-2 border-blue-500">
              In College
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collegeAlumni.map((a) => {
                const sportMeta = a.sport_id ? SPORT_META[a.sport_id as keyof typeof SPORT_META] : null;
                return (
                  <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-400 transition">
                    <p className="font-bold text-navy">{sportMeta?.emoji} {a.person_name}</p>
                    {a.current_org && <p className="text-sm text-gray-700">{a.current_org}</p>}
                    {a.current_role && <p className="text-xs text-gray-500">{a.current_role}</p>}
                    {a.schools && (
                      <p className="text-xs text-gray-400 mt-1">{a.schools.name}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* COACHING Section */}
        {coachingAlumni.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bebas text-navy mb-4 pb-2 border-b-2 border-green-600">
              Coaching
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coachingAlumni.map((a) => (
                <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-green-400 transition">
                  <p className="font-bold text-navy">{a.person_name}</p>
                  {a.current_org && <p className="text-sm text-gray-700">{a.current_org}</p>}
                  {a.current_role && <p className="text-xs text-gray-500">{a.current_role}</p>}
                  {a.schools && (
                    <p className="text-xs text-gray-400 mt-1">HS: {a.schools.name}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {alumni.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🌟</p>
            <p className="text-gray-700 text-xl font-medium mb-2">Coming Soon</p>
            <p className="text-gray-500">We&apos;re building the most comprehensive tracker of Philly HS athletes at the next level.</p>
          </div>
        )}

        <PSPPromo size="banner" variant={2} />
      </div>
    </div>
  );
}
