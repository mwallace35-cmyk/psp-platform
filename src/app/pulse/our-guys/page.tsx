import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import PulseNav from '@/components/pulse/PulseNav';
import OurGuysClient, { type AlumniRecord } from './OurGuysClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Guys — The Pulse | PhillySportsPack.com',
  description: 'Track Philadelphia high school alumni playing in the NFL, NBA, MLB, college, and coaching at the next level.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/pulse/our-guys' },
  robots: { index: true, follow: true },
};

export default async function OurGuysPage() {
  const supabase = createStaticClient();

  const [alumniRes, countsRes] = await Promise.all([
    supabase
      .from('next_level_tracking')
      .select('id, person_name, player_id, slug, current_level, current_org, current_role, pro_league, sport_id, status, featured, bio_note, social_twitter, social_instagram, college, draft_info, schools:high_school_id(name, slug)')
      .order('featured', { ascending: false })
      .order('person_name')
      .limit(2500),
    Promise.all([
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('current_level', 'pro').eq('status', 'active'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('current_level', 'pro').neq('status', 'active'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('current_level', 'college'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'NFL'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'NBA'),
      supabase.from('next_level_tracking').select('id', { count: 'exact', head: true }).eq('pro_league', 'MLB'),
    ]),
  ]);

  const alumni = (alumniRes.data ?? []).map((a: Record<string, unknown>) => ({
    ...a,
    schools: Array.isArray(a.schools) ? a.schools[0] : a.schools,
  })) as AlumniRecord[];

  const [total, activePro, formerPro, college, nfl, nba, mlb] = countsRes;

  const counts = {
    total: total.count ?? 0,
    activePro: activePro.count ?? 0,
    formerPro: formerPro.count ?? 0,
    college: college.count ?? 0,
    nfl: nfl.count ?? 0,
    nba: nba.count ?? 0,
    mlb: mlb.count ?? 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas text-white mb-1">Our Guys</h1>
          <p className="text-gray-400">Philly HS alumni making it at the next level</p>
        </div>
      </div>

      <PulseNav />

      <OurGuysClient alumni={alumni} counts={counts} />
    </div>
  );
}
