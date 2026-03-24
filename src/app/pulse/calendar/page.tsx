import { createStaticClient } from '@/lib/supabase/static';
import { getCurrentSeasonLabel } from '@/lib/sports';
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600;
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: 'Game Schedule — The Pulse | PhillySportsPack.com',
  description: 'Full game schedule for Philadelphia high school sports. Football, basketball, baseball and more.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/pulse/calendar' },
  robots: { index: true, follow: true },
};

interface GameRecord {
  id: string;
  game_date: string;
  game_time: string | null;
  game_type: string | null;
  sport_id: string;
  home_score: number | null;
  away_score: number | null;
  home_school: { name: string; slug: string; colors: Record<string, string> | null } | null;
  away_school: { name: string; slug: string; colors: Record<string, string> | null } | null;
  seasons: { label: string } | null;
}

const GAME_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  scrimmage: { label: 'Scrimmage', color: 'bg-gray-100 text-gray-500' },
  'non-league': { label: 'Non-League', color: 'bg-blue-50 text-blue-600' },
  regular: { label: 'League', color: 'bg-navy/10 text-navy' },
  league: { label: 'League', color: 'bg-navy/10 text-navy' },
  playoff: { label: 'Playoff', color: 'bg-gold/20 text-amber-700' },
  championship: { label: 'Championship', color: 'bg-gold text-navy' },
};

const SUB_NAV = [
  { label: 'Hub', href: '/pulse' },
  { label: 'Our Guys', href: '/our-guys' },
  { label: 'Outside the 215', href: '/pulse/outside-the-215' },
  { label: 'Calendar', href: '/pulse/calendar' },
];

export default async function CalendarPage() {
  const supabase = createStaticClient();
  const seasonLabel = getCurrentSeasonLabel();

  // Get the current season ID
  const { data: seasonData } = await supabase
    .from('seasons')
    .select('id')
    .eq('label', seasonLabel)
    .single();

  const seasonId = seasonData?.id ?? 145; // fallback to 145 if not found

  // Fetch upcoming games for current season
  const { data: rawGames } = await supabase
    .from('games')
    .select('id, game_date, game_time, game_type, sport_id, home_score, away_score, home_school:home_school_id(name, slug, colors), away_school:away_school_id(name, slug, colors), seasons:season_id(label)')
    .eq('season_id', seasonId)
    .order('game_date', { ascending: true })
    .order('game_time', { ascending: true })
    .limit(200);

  const games = (rawGames ?? []).map((g: Record<string, unknown>) => ({
    ...g,
    home_school: Array.isArray(g.home_school) ? g.home_school[0] : g.home_school,
    away_school: Array.isArray(g.away_school) ? g.away_school[0] : g.away_school,
    seasons: Array.isArray(g.seasons) ? g.seasons[0] : g.seasons,
  })) as GameRecord[];

  // Group by week
  const gamesByWeek: Record<string, GameRecord[]> = {};
  for (const g of games) {
    const d = new Date(g.game_date + 'T12:00:00');
    // Group by week starting Monday
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const weekKey = `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    if (!gamesByWeek[weekKey]) gamesByWeek[weekKey] = [];
    gamesByWeek[weekKey].push(g);
  }

  const totalGames = games.length;
  const scrimmages = games.filter(g => g.game_type === 'scrimmage').length;
  const leagueGames = games.filter(g => !g.game_type || g.game_type === 'league' || g.game_type === 'regular').length;
  const nonLeague = games.filter(g => g.game_type === 'non-league').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="psp-h1 text-white mb-2">{seasonLabel} Game Schedule</h1>
          <p className="text-gray-300 text-lg">Full football schedule for Public League and area schools</p>
          <div className="flex flex-wrap gap-6 mt-4 text-sm">
            <div><span className="text-gold font-bold text-xl">{totalGames}</span> <span className="text-gray-400">Total Games</span></div>
            <div><span className="text-gold font-bold text-xl">{leagueGames}</span> <span className="text-gray-400">League</span></div>
            <div><span className="text-gold font-bold text-xl">{nonLeague}</span> <span className="text-gray-400">Non-League</span></div>
            <div><span className="text-gold font-bold text-xl">{scrimmages}</span> <span className="text-gray-400">Scrimmages</span></div>
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto py-2 -mb-px">
            {SUB_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  item.href === '/pulse/calendar'
                    ? 'bg-navy text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-navy'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Schedule */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {games.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">🏈</p>
            <p className="text-gray-500 text-lg">No games scheduled yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(gamesByWeek).map(([week, weekGames]) => (
              <section key={week}>
                <h2 className="psp-h4 text-navy mb-3 pb-1 border-b-2 border-gold/40 flex items-center gap-2">
                  <span className="text-gold">Week</span> {week}
                  <span className="text-xs font-sans text-gray-400 ml-auto">{weekGames.length} game{weekGames.length !== 1 ? 's' : ''}</span>
                </h2>
                <div className="space-y-2">
                  {weekGames.map((g) => {
                    const d = new Date(g.game_date + 'T12:00:00');
                    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    const typeInfo = g.game_type ? GAME_TYPE_LABELS[g.game_type] : null;
                    const homePrimary = g.home_school?.colors?.primary || '#0a1628';
                    const hasScore = g.home_score !== null && g.away_score !== null;

                    return (
                      <div key={g.id} className="bg-white rounded-lg border border-gray-200 hover:border-gold/50 transition group">
                        <div className="flex items-center gap-3 px-4 py-3">
                          {/* Date + time */}
                          <div className="w-24 flex-shrink-0 text-center">
                            <p className="text-xs font-medium text-gray-500">{dayStr}</p>
                            {g.game_time && (
                              <p className="text-xs text-gray-400">{g.game_time.slice(0, 5).replace(/^0/, '')}</p>
                            )}
                          </div>

                          {/* Color bar */}
                          <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: homePrimary }} />

                          {/* Matchup */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-navy text-sm">
                              {g.away_school ? (
                                <Link href={`/football/schools/${g.away_school.slug}`} className="hover:text-blue-600 transition">
                                  {g.away_school.name}
                                </Link>
                              ) : 'TBD'}
                              <span className="text-gray-400 mx-2">@</span>
                              {g.home_school ? (
                                <Link href={`/football/schools/${g.home_school.slug}`} className="hover:text-blue-600 transition">
                                  {g.home_school.name}
                                </Link>
                              ) : 'TBD'}
                            </p>
                            {typeInfo && (
                              <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${typeInfo.color}`}>
                                {typeInfo.label}
                              </span>
                            )}
                          </div>

                          {/* Score or Preview link */}
                          {hasScore ? (
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-navy">
                                {g.away_score} – {g.home_score}
                              </p>
                            </div>
                          ) : (
                            g.home_school?.slug && (
                              <Link
                                href={`/football/teams/${g.home_school.slug}/${seasonLabel}`}
                                className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                              >
                                Preview &rarr;
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
