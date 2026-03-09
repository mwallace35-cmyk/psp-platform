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

interface SchoolRow {
  id: number;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  league_id: number | null;
  closed_year: number | null;
  colors: Record<string, unknown> | null;
  leagues: { name: string } | { name: string }[] | null;
}

interface SchoolData {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  league: string | null;
  colors: string | null;
  championships_count: number;
  total_wins: number;
  total_losses: number;
  has_data: boolean;
  sports: string[];
  award_count: number;
  closed_year: number | null;
}

async function fetchSchools() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('schools')
      .select('id, slug, name, city, state, league_id, closed_year, colors, leagues(name)')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      captureError(error, { function: 'fetchSchools', context: 'schools_directory' });
      return [];
    }
    return (data || []) as SchoolRow[];
  } catch (error) {
    captureError(error, { function: 'fetchSchools', context: 'schools_directory' });
    return [];
  }
}

async function fetchSchoolsWithTeamSeasons() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('team_seasons')
      .select('school_id');

    if (error) return new Set<number>();

    const schoolIds = new Set<number>();
    (data || []).forEach((row: { school_id: number | null }) => {
      if (row.school_id) schoolIds.add(row.school_id);
    });
    return schoolIds;
  } catch {
    return new Set<number>();
  }
}

async function fetchSchoolsWithChampionships() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('championships')
      .select('school_id');

    if (error) return new Set<number>();

    const schoolIds = new Set<number>();
    (data || []).forEach((row: { school_id: number | null }) => {
      if (row.school_id) schoolIds.add(row.school_id);
    });
    return schoolIds;
  } catch {
    return new Set<number>();
  }
}

async function fetchSchoolsWithFootball() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('football_player_seasons')
      .select('school_id');

    if (error) return new Set<number>();

    const schoolIds = new Set<number>();
    (data || []).forEach((row: { school_id: number | null }) => {
      if (row.school_id) schoolIds.add(row.school_id);
    });
    return schoolIds;
  } catch {
    return new Set<number>();
  }
}

async function fetchSchoolsWithBasketball() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('basketball_player_seasons')
      .select('school_id');

    if (error) return new Set<number>();

    const schoolIds = new Set<number>();
    (data || []).forEach((row: { school_id: number | null }) => {
      if (row.school_id) schoolIds.add(row.school_id);
    });
    return schoolIds;
  } catch {
    return new Set<number>();
  }
}

async function fetchSchoolsWithBaseball() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('baseball_player_seasons')
      .select('school_id');

    if (error) return new Set<number>();

    const schoolIds = new Set<number>();
    (data || []).forEach((row: { school_id: number | null }) => {
      if (row.school_id) schoolIds.add(row.school_id);
    });
    return schoolIds;
  } catch {
    return new Set<number>();
  }
}

async function fetchChampionshipCounts() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('championships')
      .select('school_id');

    if (error) return {};

    const counts: Record<number, number> = {};
    (data || []).forEach((row: { school_id: number | null }) => {
      if (row.school_id) {
        counts[row.school_id] = (counts[row.school_id] || 0) + 1;
      }
    });
    return counts;
  } catch {
    return {};
  }
}

async function fetchTeamSeasonWinLoss() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('team_seasons')
      .select('school_id, wins, losses');

    if (error) return {};

    const winLoss: Record<number, { wins: number; losses: number }> = {};
    (data || []).forEach((row: { school_id: number | null; wins: number | null; losses: number | null }) => {
      if (row.school_id) {
        if (!winLoss[row.school_id]) {
          winLoss[row.school_id] = { wins: 0, losses: 0 };
        }
        winLoss[row.school_id].wins += row.wins || 0;
        winLoss[row.school_id].losses += row.losses || 0;
      }
    });
    return winLoss;
  } catch {
    return {};
  }
}

async function fetchAwardCounts() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('awards')
      .select('school_id');

    if (error) return {};

    const counts: Record<number, number> = {};
    (data || []).forEach((row: { school_id: number | null }) => {
      if (row.school_id) {
        counts[row.school_id] = (counts[row.school_id] || 0) + 1;
      }
    });
    return counts;
  } catch {
    return {};
  }
}

async function fetchTopSchoolsByChampionships() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('championships')
      .select('school_id, season_id, schools(id, slug, name, leagues(name)), seasons(year_start)')
      .order('season_id', { ascending: false });

    if (error) return [];

    const recentCounts: Record<number, { count: number; school: any }> = {};
    (data || []).forEach((row: any) => {
      const sid = row.school_id;
      const yearStart = row.seasons?.year_start;
      if (sid && row.schools && yearStart && yearStart >= 2020) {
        if (!recentCounts[sid]) {
          recentCounts[sid] = { count: 0, school: row.schools };
        }
        recentCounts[sid].count++;
      }
    });

    return Object.entries(recentCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([id, data]) => ({
        id: Number(id),
        slug: data.school.slug,
        name: data.school.name,
        league: Array.isArray(data.school.leagues) ? data.school.leagues[0]?.name : data.school.leagues?.name || 'Unknown',
        recentTitles: data.count,
      }));
  } catch {
    return [];
  }
}

export default async function SchoolsPage() {
  const [
    schoolRows,
    champCounts,
    risingPrograms,
    teamSeasonSchools,
    championshipSchools,
    footballSchools,
    basketballSchools,
    baseballSchools,
    winLossData,
    awardCounts,
  ] = await Promise.all([
    fetchSchools(),
    fetchChampionshipCounts(),
    fetchTopSchoolsByChampionships(),
    fetchSchoolsWithTeamSeasons(),
    fetchSchoolsWithChampionships(),
    fetchSchoolsWithFootball(),
    fetchSchoolsWithBasketball(),
    fetchSchoolsWithBaseball(),
    fetchTeamSeasonWinLoss(),
    fetchAwardCounts(),
  ]);

  const schools: SchoolData[] = schoolRows.map((s) => {
    const leagueName = s.leagues
      ? Array.isArray(s.leagues) ? s.leagues[0]?.name : s.leagues.name
      : null;

    const sports: string[] = [];
    if (footballSchools.has(s.id)) sports.push('football');
    if (basketballSchools.has(s.id)) sports.push('basketball');
    if (baseballSchools.has(s.id)) sports.push('baseball');

    const hasTeamSeasons = teamSeasonSchools.has(s.id);
    const hasChampionships = championshipSchools.has(s.id);
    const hasAwards = (awardCounts[s.id] || 0) > 0;
    const hasPlayerStats = sports.length > 0;

    const hasData = hasTeamSeasons || hasChampionships || hasAwards || hasPlayerStats;

    const wl = winLossData[s.id];

    return {
      id: s.id,
      slug: s.slug,
      name: s.name,
      city: s.city || '',
      state: s.state || 'PA',
      league: leagueName || null,
      colors: s.colors && typeof s.colors === 'object' && 'primary' in s.colors
        ? (s.colors as { primary?: string }).primary || null
        : null,
      championships_count: champCounts[s.id] || 0,
      total_wins: wl?.wins || 0,
      total_losses: wl?.losses || 0,
      has_data: hasData,
      sports,
      award_count: awardCounts[s.id] || 0,
      closed_year: s.closed_year || null,
    };
  });

  const leagueSet = new Set<string>();
  schools.forEach((s) => { if (s.league) leagueSet.add(s.league); });
  const leagues = Array.from(leagueSet).sort();

  return (
    <>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <Breadcrumb items={[{ label: 'Schools' }]} />
      </div>
      <SchoolsDirectory
        schools={schools}
        leagues={leagues}
        risingPrograms={risingPrograms}
      />
    </>
  );
}
