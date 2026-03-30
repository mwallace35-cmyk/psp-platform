import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import OurGuysClient, { type AlumniRecord } from '../OurGuysClient';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Our Guys Directory — PhillySportsPack.com',
  description: 'Full directory of 2,200+ Philadelphia high school alumni playing in the NFL, NBA, MLB, college, and coaching at the next level.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/our-guys/directory' },
  robots: { index: true, follow: true },
};

export default async function DirectoryPage() {
  const supabase = createStaticClient();

  const { data: alumniRes } = await supabase
    .from('next_level_tracking')
    .select('id, person_name, player_id, current_level, current_org, current_role, pro_league, sport_id, status, featured, bio_note, social_twitter, social_instagram, college, draft_info, bio_url, trajectory_label, schools:high_school_id(name, slug), players:player_id(slug)')
    .order('featured', { ascending: false })
    .order('person_name')
    .limit(2500);

  const alumni = (alumniRes ?? []).map((a: Record<string, unknown>) => {
    const playerJoin = Array.isArray(a.players) ? a.players[0] : a.players;
    return {
      ...a,
      schools: Array.isArray(a.schools) ? a.schools[0] : a.schools,
      slug: (playerJoin as Record<string, unknown> | null)?.slug as string | null ?? null,
    };
  }) as AlumniRecord[];

  /* Derive counts */
  let activePro = 0;
  let formerPro = 0;
  let college = 0;
  let nfl = 0;
  let nba = 0;
  let mlb = 0;

  for (const a of alumni) {
    if (a.current_level === 'pro' && a.status === 'active') activePro++;
    if (a.current_level === 'pro' && a.status !== 'active') formerPro++;
    if (a.current_level === 'college') college++;
    if (a.pro_league === 'NFL') nfl++;
    if (a.pro_league === 'NBA') nba++;
    if (a.pro_league === 'MLB') mlb++;
  }

  const counts = {
    total: alumni.length,
    activePro,
    formerPro,
    college,
    nfl,
    nba,
    mlb,
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)" }}>
          <Link href="/our-guys" style={{ color: '#f0a500', textDecoration: 'none' }}>
            Our Guys
          </Link>
          <span style={{ color: '#6b7280' }}>/</span>
          <span style={{ color: '#9ca3af' }}>Directory</span>
        </nav>
      </div>

      {/* Directory header */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <h1 style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: 'clamp(28px, 5vw, 40px)',
          color: '#f0a500',
          letterSpacing: '0.03em',
          marginBottom: '4px',
        }}>
          FULL ALUMNI DIRECTORY
        </h1>
        <p style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: '14px',
          color: '#9ca3af',
        }}>
          {counts.total.toLocaleString()} tracked athletes and coaches from Philly high schools
        </p>
      </div>

      {/* Full client-side filterable directory */}
      <OurGuysClient alumni={alumni} counts={counts} />
    </div>
  );
}
