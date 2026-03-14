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

export default async function SchoolsPage() {
  let schools: SchoolData[] = [];
  let risingPrograms: { id: number; slug: string; name: string; league: string; recentTitles: number }[] = [];

  try {
    const supabase = createStaticClient();

    // Two RPC calls replace 14 truncated PostgREST queries
    const [directoryResult, risingResult] = await Promise.all([
      supabase.rpc('get_school_directory'),
      supabase.rpc('get_rising_programs', { p_since_year: 2020 }),
    ]);

    if (directoryResult.error) {
      captureError(directoryResult.error, { function: 'get_school_directory', context: 'schools_page' });
      console.warn('[PSP] get_school_directory RPC failed:', directoryResult.error.message);
    } else {
      schools = (directoryResult.data ?? []).map((row: any) => {
        const wins = Number(row.total_wins) || 0;
        const losses = Number(row.total_losses) || 0;
        const totalGames = wins + losses;
        const winPct = totalGames > 0 ? Math.round((wins / totalGames) * 1000) / 10 : null;

        const sports: string[] = [];
        if (row.has_football) sports.push('football');
        if (row.has_basketball) sports.push('basketball');
        if (row.has_baseball) sports.push('baseball');

        const champCount = Number(row.championship_count) || 0;
        const awardCount = Number(row.award_count) || 0;
        const playerCount = Number(row.player_count) || 0;
        const sportCount = Number(row.sport_count) || 0;
        // A school needs real substance to show by default — not just game appearances as an opponent.
        // Require: league membership, player records, team season W-L, championships, or sport-specific stats.
        const hasData = !!row.league_name || playerCount > 0 || sportCount > 0 || champCount > 0 || sports.length > 0;

        const colors = row.colors && typeof row.colors === 'object' && 'primary' in row.colors
          ? (row.colors as { primary?: string }).primary || null
          : null;
        const secondaryColor = row.colors && typeof row.colors === 'object' && 'secondary' in row.colors
          ? (row.colors as { secondary?: string }).secondary || null
          : null;

        return {
          id: row.school_id,
          slug: row.school_slug,
          name: row.school_name,
          city: row.city || '',
          state: row.state || 'PA',
          league: row.league_name || null,
          colors,
          secondary_color: secondaryColor,
          championships_count: champCount,
          total_wins: wins,
          total_losses: losses,
          has_data: hasData,
          sports,
          award_count: awardCount,
          closed_year: row.closed_year || null,
          player_count: playerCount,
          pro_count: Number(row.pro_count) || 0,
          game_count: Number(row.game_count) || 0,
          sport_count: sportCount,
          win_pct: winPct,
        };
      });
    }

    if (risingResult.error) {
      console.warn('[PSP] get_rising_programs RPC failed:', risingResult.error.message);
    } else {
      risingPrograms = (risingResult.data ?? []).map((row: any) => ({
        id: row.school_id,
        slug: row.school_slug,
        name: row.school_name,
        league: row.league_name || 'Unknown',
        recentTitles: Number(row.recent_titles) || 0,
      }));
    }
  } catch (error) {
    captureError(error, { function: 'SchoolsPage', context: 'schools_directory' });
  }

  // Only show schools from the three core leagues
  const CORE_LEAGUES = [
    'Philadelphia Catholic League',
    'Philadelphia Public League',
    'Inter-Academic League',
  ];
  schools = schools.filter((s) => s.league && CORE_LEAGUES.includes(s.league));

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

  return (
    <>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <Breadcrumb items={[{ label: 'Schools' }]} />
      </div>
      <SchoolsDirectory
        schools={schools}
        leagues={leagues}
        risingPrograms={risingPrograms}
        aggregateStats={aggregateStats}
        topSchools={topSchools}
      />
    </>
  );
}
