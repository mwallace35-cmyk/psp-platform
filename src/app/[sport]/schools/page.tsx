import { createStaticClient } from '@/lib/supabase/static';
import { validateSportParam, validateSportParamForMetadata } from '@/lib/validateSport';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';
import SchoolLogo from '@/components/ui/SchoolLogo';
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

const LEAGUE_ABBREV: Record<string, string> = {
  'Philadelphia Catholic League': 'PCL',
  'Philadelphia Public League': 'PPL',
  'Inter-Academic League': 'Inter-Ac',
  'Suburban One League': 'SOL',
  'Bicentennial Athletic League': 'BAL',
  'Del Val League': 'DVL',
  'Independent': 'IND',
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
  const supabase = createStaticClient();

  // Fetch directory, logos, games, team_seasons, and current-season records in parallel
  const [dirRes, logosRes, gamesRes, tsRes, currentRecordsRes] = await Promise.all([
    supabase.from('school_directory_mv').select('*').order('name'),
    supabase.from('schools').select('id, logo_url').not('logo_url', 'is', null),
    supabase
      .from('games')
      .select('home_school_id, away_school_id')
      .eq('sport_id', sport)
      .limit(10000),
    supabase
      .from('team_seasons')
      .select('school_id')
      .eq('sport_id', sport),
    // Get current season records for this sport
    supabase
      .from('team_seasons')
      .select('school_id, wins, losses, ties, seasons!inner(is_current)')
      .eq('sport_id', sport)
      .eq('seasons.is_current', true),
  ]);

  // Build logo lookup
  const logoMap = new Map<number, string>();
  for (const row of logosRes.data || []) {
    if (row.logo_url) logoMap.set(row.id, row.logo_url);
  }

  // Build current record lookup
  const recordMap = new Map<number, string>();
  for (const row of (currentRecordsRes.data || []) as any[]) {
    const w = row.wins ?? 0;
    const l = row.losses ?? 0;
    const t = row.ties ?? 0;
    const record = t > 0 ? `${w}-${l}-${t}` : `${w}-${l}`;
    recordMap.set(row.school_id, record);
  }

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
    leagueAbbrev: string | null;
    logoUrl: string | null;
    closed_year: number | null;
    record: string | null;
  }>();

  for (const row of dirRes.data || []) {
    if (!sportSchoolIds.has(row.id)) continue;
    if (!row.league_name) continue;
    schoolMap.set(row.id, {
      id: row.id,
      name: row.name,
      slug: row.slug,
      city: row.city || '',
      league: row.league_name || null,
      leagueAbbrev: LEAGUE_ABBREV[row.league_name] || null,
      logoUrl: logoMap.get(row.id) || null,
      closed_year: row.closed_year || null,
      record: recordMap.get(row.id) || null,
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

        <h1 className="psp-h1 text-white mt-4 mb-2">
          {sportLabel} Schools
        </h1>
        <p className="text-gray-300 text-sm mb-8">
          {schools.length} active {sportLabel.toLowerCase()} programs{closedSchools.length > 0 ? ` + ${closedSchools.length} historical` : ''}
        </p>

        {sortedLeagues.map(([league, leagueSchools]) => {
          const abbrev = LEAGUE_ABBREV[league] || '';
          return (
            <div key={league} className="mb-10">
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-700/50">
                <h2 className="psp-h3 text-white">
                  {league}
                </h2>
                {abbrev && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: 'var(--psp-gold)', color: 'var(--psp-navy)' }}
                  >
                    {abbrev}
                  </span>
                )}
                <span className="text-xs text-gray-500">({leagueSchools.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {leagueSchools.map((school) => (
                  <Link
                    key={school.id}
                    href={`/${sport}/teams/${school.slug}`}
                    className="group flex items-center gap-3 rounded-lg p-3 bg-white/[0.04] border border-white/[0.08] transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.16] hover:shadow-lg hover:shadow-black/20 focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--psp-navy)] focus-visible:outline-none"
                  >
                    <SchoolLogo
                      logoUrl={school.logoUrl}
                      name={school.name}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-semibold text-sm block truncate group-hover:text-[var(--psp-gold)] transition-colors" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
                        {school.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {school.city && (
                          <span className="text-gray-400 text-xs">{school.city}</span>
                        )}
                        {school.city && school.leagueAbbrev && (
                          <span className="text-gray-600 text-xs">&#183;</span>
                        )}
                        {school.leagueAbbrev && (
                          <span className="text-xs font-medium px-1.5 py-px rounded bg-white/[0.06] text-gray-300">
                            {school.leagueAbbrev}
                          </span>
                        )}
                      </div>
                    </div>
                    {school.record && (
                      <span className="text-sm font-bold text-[var(--psp-gold)] tabular-nums shrink-0">
                        {school.record}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Historical / Closed Programs */}
        {closedSchools.length > 0 && (
          <div className="mb-8 mt-4">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-700/40">
              <h2 className="psp-h3 text-gray-400">
                Historical Programs
              </h2>
              <span className="text-xs text-gray-600">({closedSchools.length} closed)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {closedSchools.map((school) => (
                <Link
                  key={school.id}
                  href={`/${sport}/schools/${school.slug}`}
                  className="group flex items-center gap-3 rounded-lg p-2.5 opacity-60 hover:opacity-100 transition-all bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--psp-navy)] focus-visible:outline-none"
                >
                  <SchoolLogo
                    logoUrl={school.logoUrl}
                    name={school.name}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-gray-300 text-xs font-medium truncate block">
                      {school.name}
                    </span>
                    <span className="text-gray-600 text-xs">
                      Closed {school.closed_year}
                    </span>
                  </div>
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
