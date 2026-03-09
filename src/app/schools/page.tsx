import { createStaticClient } from '@/lib/supabase/static';
import { captureError } from '@/lib/error-tracking';
import { Breadcrumb } from '@/components/ui';
import SchoolsDirectory from './SchoolsDirectory';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

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
  metadata: Record<string, unknown> | null;
  leagues: { name: string } | { name: string }[] | null;
}

async function fetchSchools() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log(`[PSP Schools] ENV CHECK: URL=${url ? url.substring(0, 30) + '...' : 'MISSING'}, KEY=${key ? key.substring(0, 20) + '...' : 'MISSING'}`);

    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('schools')
      .select('id, slug, name, city, state, league_id, metadata, leagues(name)')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    console.log(`[PSP Schools] Query result: ${data?.length ?? 0} rows, error: ${error ? JSON.stringify(error) : 'none'}`);

    if (error) {
      captureError(error, { function: 'fetchSchools', context: 'schools_directory' });
      return [];
    }
    return (data || []) as SchoolRow[];
  } catch (error) {
    console.error(`[PSP Schools] Exception:`, error);
    captureError(error, { function: 'fetchSchools', context: 'schools_directory' });
    return [];
  }
}

async function fetchChampionshipCounts() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('championships')
      .select('school_id')
      .is('deleted_at', null);

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
    // Get schools with most recent championship wins for "Rising Programs"
    const { data, error } = await supabase
      .from('championships')
      .select('school_id, year, schools(id, slug, name, leagues(name))')
      .is('deleted_at', null)
      .gte('year', '2020')
      .order('year', { ascending: false });

    if (error) return [];

    // Count recent titles per school
    const recentCounts: Record<number, { count: number; school: any }> = {};
    (data || []).forEach((row: any) => {
      const sid = row.school_id;
      if (sid && row.schools) {
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
  const [schoolRows, champCounts, risingPrograms] = await Promise.all([
    fetchSchools(),
    fetchChampionshipCounts(),
    fetchTopSchoolsByChampionships(),
  ]);

  // Transform for client component
  const schools = schoolRows.map((s) => {
    const leagueName = s.leagues
      ? Array.isArray(s.leagues) ? s.leagues[0]?.name : s.leagues.name
      : null;

    return {
      id: s.id,
      slug: s.slug,
      name: s.name,
      city: s.city || '',
      state: s.state || 'PA',
      league: leagueName || null,
      championships_count: champCounts[s.id] || 0,
      colors: s.metadata && typeof s.metadata === 'object' && 'colors' in s.metadata
        ? (s.metadata as { colors?: { primary?: string } }).colors?.primary || null
        : null,
    };
  });

  // Get league list from actual data
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
