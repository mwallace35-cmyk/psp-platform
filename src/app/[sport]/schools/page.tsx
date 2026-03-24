import { createStaticClient } from '@/lib/supabase/static';
import { validateSportParam, validateSportParamForMetadata } from '@/lib/validateSport';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';
import type { Metadata } from 'next';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

const SPORT_LABELS: Record<string, string> = {
  football: 'Football',
  basketball: 'Basketball',
  baseball: 'Baseball',
  soccer: 'Soccer',
  lacrosse: 'Lacrosse',
  'track-field': 'Track & Field',
  wrestling: 'Wrestling',
};

const SPORT_COLORS: Record<string, string> = {
  football: '#16a34a',
  basketball: '#3b82f6',
  baseball: '#dc2626',
  soccer: '#059669',
  lacrosse: '#0891b2',
  'track-field': '#7c3aed',
  wrestling: '#ca8a04',
};

type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return { title: 'Schools — PhillySportsPack' };
  const label = SPORT_LABELS[sport] || sport;
  return {
    title: `${label} Schools — PhillySportsPack`,
    description: `Browse Philadelphia-area high schools with ${label.toLowerCase()} programs. Filter by league and explore team histories.`,
  };
}

export default async function SportSchoolsPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
  if (!sport) notFound();

  const sportLabel = SPORT_LABELS[sport] || sport;
  const sportColor = SPORT_COLORS[sport] || '#6b7280';
  const supabase = createStaticClient();

  // Get all schools from the directory view + find which ones have data for this sport
  // Three sources of sport presence: games, team_seasons, and player_seasons
  const [dirRes, gamesRes, tsRes] = await Promise.all([
    supabase.from('school_directory_mv').select('*').order('name'),
    supabase
      .from('games')
      .select('home_school_id, away_school_id')
      .eq('sport_id', sport)
      .limit(10000),
    supabase
      .from('team_seasons')
      .select('school_id')
      .eq('sport_id', sport),
  ]);

  // Build set of all school IDs that have this sport
  const sportSchoolIds = new Set<number>();
  for (const g of gamesRes.data || []) {
    if (g.home_school_id) sportSchoolIds.add(g.home_school_id);
    if (g.away_school_id) sportSchoolIds.add(g.away_school_id);
  }
  for (const ts of tsRes.data || []) {
    if (ts.school_id) sportSchoolIds.add(ts.school_id);
  }

  const schoolMap = new Map<number, {
    id: number;
    name: string;
    slug: string;
    city: string;
    league: string | null;
    color: string | null;
    closed_year: number | null;
    seasonCount: number;
  }>();

  for (const row of dirRes.data || []) {
    if (!sportSchoolIds.has(row.id)) continue;
    // Only show schools that belong to a league (skip opponent stubs)
    if (!row.league_name) continue;
    const colors = row.colors && typeof row.colors === 'object' && 'primary' in row.colors
      ? (row.colors as { primary?: string }).primary || null
      : null;
    schoolMap.set(row.id, {
      id: row.id,
      name: row.name,
      slug: row.slug,
      city: row.city || '',
      league: row.league_name || null,
      color: colors,
      closed_year: row.closed_year || null,
      seasonCount: row.team_season_count || 1,
    });
  }

  const allSchools = Array.from(schoolMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const schools = allSchools.filter(s => !s.closed_year);
  const closedSchools = allSchools.filter(s => !!s.closed_year).sort((a, b) => (b.closed_year || 0) - (a.closed_year || 0));

  // Group active schools by league
  const leagueGroups = new Map<string, typeof schools>();
  for (const school of schools) {
    const league = school.league || 'Other';
    if (!leagueGroups.has(league)) leagueGroups.set(league, []);
    leagueGroups.get(league)!.push(school);
  }

  // Sort league groups: PCL first, Public League second, Inter-Ac third, then alphabetical
  const LEAGUE_ORDER = ['Philadelphia Catholic League', 'Philadelphia Public League', 'Inter-Academic League'];
  const sortedLeagues = Array.from(leagueGroups.entries()).sort((a, b) => {
    const ai = LEAGUE_ORDER.indexOf(a[0]);
    const bi = LEAGUE_ORDER.indexOf(b[0]);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a[0].localeCompare(b[0]);
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--psp-navy)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb
          items={[
            { label: sportLabel, href: `/${sport}` },
            { label: 'Schools' },
          ]}
        />

        <h1
          className="psp-h1 text-white mt-4 mb-2"
        >
          {sportLabel} Schools
        </h1>
        <p className="text-gray-300 text-sm mb-6">
          {schools.length} active {sportLabel.toLowerCase()} programs{closedSchools.length > 0 ? ` + ${closedSchools.length} historical` : ''}
        </p>

        {sortedLeagues.map(([league, leagueSchools]) => (
          <div key={league} className="mb-8">
            <h2
              className="psp-h4 mb-3 pb-2 border-b"
              style={{
                color: sportColor,
                borderColor: `${sportColor}40`,
              }}
            >
              {league}
              <span className="ml-2 text-xs font-normal text-gray-400">({leagueSchools.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {leagueSchools.map((school) => (
                <Link
                  key={school.id}
                  href={`/${sport}/schools/${school.slug}`}
                  className="group rounded-lg p-3 transition hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--psp-navy)] focus-visible:outline-none"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: school.color || sportColor }}
                    />
                    <span className="text-white text-sm font-semibold truncate group-hover:text-[#f0a500] transition">
                      {school.name}
                    </span>
                  </div>
                  {school.city && (
                    <p className="text-gray-400 text-xs ml-4">{school.city}, PA</p>
                  )}
                  {school.closed_year && (
                    <p className="text-red-400 text-xs ml-4">Closed {school.closed_year}</p>
                  )}
                  <p className="text-gray-600 text-xs ml-4 mt-1">
                    {school.seasonCount} season{school.seasonCount !== 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Historical / Closed Programs */}
        {closedSchools.length > 0 && (
          <div className="mb-8 mt-4">
            <h2
              className="text-lg font-bold mb-3 pb-2 border-b border-gray-700"
              style={{ color: '#9ca3af' }}
            >
              Historical Programs
              <span className="ml-2 text-xs font-normal text-gray-600">({closedSchools.length} closed)</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {closedSchools.map((school) => (
                <Link
                  key={school.id}
                  href={`/${sport}/schools/${school.slug}`}
                  className="group rounded-lg p-2 transition opacity-75 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--psp-navy)] focus-visible:outline-none"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <span className="text-gray-300 text-xs font-medium truncate block group-hover:text-gray-300 transition">
                    {school.name} <span className="text-gray-500">(Closed)</span>
                  </span>
                  <span className="text-gray-600 text-xs">
                    Closed {school.closed_year}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {allSchools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">No {sportLabel.toLowerCase()} programs found</p>
            <Link href="/schools" className="text-blue-400 text-sm mt-2 inline-block hover:underline">
              View all schools
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
