import { Suspense } from 'react';
import { createStaticClient } from '@/lib/supabase/static';
import { captureError } from '@/lib/error-tracking';
import { Breadcrumb } from '@/components/ui';
import SchoolsDirectory from './SchoolsDirectory';
import type { Metadata } from 'next';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'School Directory — PhillySportsPack',
  description: 'Browse all Philadelphia-area high schools. Filter by league, search by name, and explore championship histories across Catholic League, Public League, Inter-Ac, and more.',
  alternates: {
    canonical: 'https://phillysportspack.com/schools',
  },
};

interface SchoolData {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  league: string | null;
  colors: string | null;
  secondary_color: string | null;
  championships_count: number;
  total_wins: number;
  total_losses: number;
  has_data: boolean;
  sports: string[];
  award_count: number;
  closed_year: number | null;
  player_count: number;
  pro_count: number;
  game_count: number;
  sport_count: number;
  win_pct: number | null;
}

const CORE_LEAGUES = [
  'Philadelphia Catholic League',
  'Philadelphia Public League',
  'Inter-Academic League',
];

export default async function SchoolsPage() {
  let schools: SchoolData[] = [];
  let risingPrograms: { id: number; slug: string; name: string; league: string; recentTitles: number }[] = [];
  let fetchFailed = false;

  try {
    const supabase = createStaticClient();

    // Single fast query against the pre-aggregated materialized view
    const { data, error } = await supabase
      .from('school_directory_mv')
      .select('*')
      .in('league_name', CORE_LEAGUES)
      .order('name', { ascending: true });

    if (error) {
      captureError(error, { function: 'schools_page', context: 'schools_fetch' });
      console.error('[PSP] Schools directory fetch failed:', error.message);
      fetchFailed = true;
    } else if (data && Array.isArray(data)) {
      schools = data.map((row: any) => {
        const colors = row.colors && typeof row.colors === 'object' && 'primary' in row.colors
          ? (row.colors as { primary?: string }).primary || null
          : null;
        const secondaryColor = row.colors && typeof row.colors === 'object' && 'secondary' in row.colors
          ? (row.colors as { secondary?: string }).secondary || null
          : null;

        const hasData = !!row.league_name || row.player_count > 0 || row.championships_count > 0;

        // Infer sports from available data
        const sports: string[] = [];
        if (row.player_count > 0 || row.team_season_count > 0) {
          sports.push('football', 'basketball', 'baseball');
        }

        return {
          id: row.id,
          slug: row.slug,
          name: row.name,
          city: row.city || '',
          state: row.state || 'PA',
          league: row.league_name,
          colors,
          secondary_color: secondaryColor,
          championships_count: row.championships_count,
          total_wins: row.total_wins,
          total_losses: row.total_losses,
          has_data: hasData,
          sports,
          award_count: row.award_count,
          closed_year: row.closed_year,
          player_count: row.player_count,
          pro_count: row.pro_count,
          game_count: 0,
          sport_count: sports.length,
          win_pct: row.win_pct ? Number(row.win_pct) : null,
        };
      });

      // Rising programs = schools with recent championships (since 2020)
      risingPrograms = data
        .filter((row: any) => row.recent_championships > 0)
        .map((row: any) => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          league: row.league_name || 'Unknown',
          recentTitles: row.recent_championships,
        }))
        .sort((a, b) => b.recentTitles - a.recentTitles);
    }
  } catch (error) {
    captureError(error, { function: 'SchoolsPage', context: 'schools_directory' });
    fetchFailed = true;
  }

  const leagues = CORE_LEAGUES;

  // Aggregate stats for the hero section
  const schoolsWithData = schools.filter(s => s.has_data);
  const aggregateStats = {
    totalSchools: schoolsWithData.length,
    totalPlayers: schools.reduce((sum, s) => sum + s.player_count, 0),
    totalChampionships: schools.reduce((sum, s) => sum + s.championships_count, 0),
    totalPros: schools.reduce((sum, s) => sum + s.pro_count, 0),
    totalGames: schools.reduce((sum, s) => sum + s.game_count, 0),
    totalAwards: schools.reduce((sum, s) => sum + s.award_count, 0),
    yearsOfData: 85, // 1937-2025
  };

  // Top schools by championships for the showcase
  const topSchools = [...schoolsWithData]
    .filter(s => s.championships_count > 0 && !s.closed_year)
    .sort((a, b) => b.championships_count - a.championships_count)
    .slice(0, 6)
    .map(s => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      league: s.league,
      colors: s.colors,
      secondary_color: s.secondary_color,
      championships_count: s.championships_count,
      win_pct: s.win_pct,
      total_wins: s.total_wins,
      total_losses: s.total_losses,
      pro_count: s.pro_count,
      player_count: s.player_count,
    }));

  if (fetchFailed && schools.length === 0) {
    return (
      <>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
          <Breadcrumb items={[{ label: 'Schools' }]} />
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{'\u26A0\uFE0F'}</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: 'var(--psp-navy)', marginBottom: '0.75rem' }}>
            Unable to load school directory
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', color: '#64748b', lineHeight: 1.6 }}>
            The school directory could not be loaded right now. Please try refreshing the page.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <Breadcrumb items={[{ label: 'Schools' }]} />
      </div>
      <Suspense fallback={
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#94a3b8' }}>Loading school directory...</p>
        </div>
      }>
        <SchoolsDirectory
          schools={schools}
          leagues={leagues}
          risingPrograms={risingPrograms}
          aggregateStats={aggregateStats}
          topSchools={topSchools}
        />
      </Suspense>
    </>
  );
}
