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
  baseball: '#ea580c',
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

  // Get all schools that have team_seasons for this sport
  const { data: teamSeasons } = await supabase
    .from('team_seasons')
    .select('school_id, schools!inner(id, name, slug, city, league_id, leagues:league_id(name), primary_color, closed_year)')
    .eq('sport_id', sport)
    .not('school_id', 'is', null)
    .order('school_id');

  // Dedupe schools and count seasons
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

  for (const ts of teamSeasons || []) {
    const school = Array.isArray(ts.schools) ? ts.schools[0] : ts.schools;
    if (!school) continue;
    const existing = schoolMap.get(school.id);
    if (existing) {
      existing.seasonCount++;
    } else {
      const league = Array.isArray(school.leagues) ? school.leagues[0] : school.leagues;
      schoolMap.set(school.id, {
        id: school.id,
        name: school.name,
        slug: school.slug,
        city: school.city || '',
        league: league?.name || null,
        color: school.primary_color || null,
        closed_year: school.closed_year || null,
        seasonCount: 1,
      });
    }
  }

  const schools = Array.from(schoolMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  // Group by league
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
          className="text-3xl md:text-4xl font-bold text-white mt-4 mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {sportLabel} Schools
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {schools.length} schools with {sportLabel.toLowerCase()} programs
        </p>

        {sortedLeagues.map(([league, leagueSchools]) => (
          <div key={league} className="mb-8">
            <h2
              className="text-lg font-bold mb-3 pb-2 border-b"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                color: sportColor,
                borderColor: `${sportColor}40`,
              }}
            >
              {league}
              <span className="ml-2 text-xs font-normal text-gray-500">({leagueSchools.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {leagueSchools.map((school) => (
                <Link
                  key={school.id}
                  href={`/${sport}/schools/${school.slug}`}
                  className="group rounded-lg p-3 transition hover:scale-[1.02]"
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
                    <p className="text-gray-500 text-xs ml-4">{school.city}, PA</p>
                  )}
                  {school.closed_year && (
                    <p className="text-red-400 text-[10px] ml-4">Closed {school.closed_year}</p>
                  )}
                  <p className="text-gray-600 text-[10px] ml-4 mt-1">
                    {school.seasonCount} season{school.seasonCount !== 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {schools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No {sportLabel.toLowerCase()} programs found</p>
            <Link href="/schools" className="text-blue-400 text-sm mt-2 inline-block hover:underline">
              View all schools
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
