import Link from 'next/link';
import { notFound } from 'next/navigation';
import { validateSportParam, validateSportParamForMetadata } from '@/lib/validateSport';
import {
  SPORT_META,
  getTopRivalries,
  getRivalryDetail,
  getRivalryGames,
  getSchoolBySlug,
  type RivalryRecord,
} from '@/lib/data';
import { Breadcrumb } from '@/components/ui';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import PSPPromo from '@/components/ads/PSPPromo';
import type { Metadata } from 'next';

export const revalidate = 86400; // ISR: daily

type PageParams = { sport: string; rivalry: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { sport, rivalry } = await params;
  const validSport = await validateSportParamForMetadata({ sport });
  if (!validSport) return {};

  const [school1Slug, school2Slug] = rivalry.split('-vs-');
  if (!school1Slug || !school2Slug) return {};

  return {
    title: `${school1Slug} vs ${school2Slug} Rivalry — ${SPORT_META[validSport].name} — PhillySportsPack`,
    description: `Head-to-head rivalry record and game history between ${school1Slug} and ${school2Slug} in Philadelphia high school ${SPORT_META[validSport].name.toLowerCase()}.`,
    alternates: {
      canonical: `https://phillysportspack.com/${validSport}/rivalries/${rivalry}`,
    },
  };
}

export async function generateStaticParams() {
  const params: Array<{ sport: string; rivalry: string }> = [];

  const sports = ['football', 'basketball', 'baseball', 'soccer', 'lacrosse'];

  for (const sport of sports) {
    try {
      const rivalries = await getTopRivalries(sport, 20);
      for (const r of rivalries) {
        const slug1 = r.school1.slug;
        const slug2 = r.school2.slug;
        if (slug1 && slug2) {
          params.push({
            sport,
            rivalry: `${slug1}-vs-${slug2}`,
          });
        }
      }
    } catch {
      // Skip if getTopRivalries fails
    }
  }

  return params;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Date TBD';
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function SeriesBar({
  school1Wins,
  school2Wins,
  ties,
}: {
  school1Wins: number;
  school2Wins: number;
  ties: number;
}) {
  const total = school1Wins + school2Wins + ties;
  if (total === 0) return null;

  const school1Pct = (school1Wins / total) * 100;
  const school2Pct = (school2Wins / total) * 100;
  const tiesPct = (ties / total) * 100;

  return (
    <div className="flex gap-1 h-6 rounded-lg overflow-hidden border border-gray-700">
      {school1Wins > 0 && (
        <div
          className="bg-[var(--psp-gold)]"
          style={{ width: `${school1Pct}%` }}
          title={`${school1Wins} wins`}
        />
      )}
      {ties > 0 && (
        <div
          className="bg-gray-600"
          style={{ width: `${tiesPct}%` }}
          title={`${ties} ties`}
        />
      )}
      {school2Wins > 0 && (
        <div
          className="bg-[var(--psp-blue)]"
          style={{ width: `${school2Pct}%` }}
          title={`${school2Wins} wins`}
        />
      )}
    </div>
  );
}

export default async function RivalryDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const sport = await validateSportParam(params);
  const { rivalry } = await params;

  // Parse rivalry slug: school1-vs-school2
  const [school1Slug, , school2Slug] = rivalry.split('-');
  if (!school1Slug || !school2Slug) {
    notFound();
  }

  // Fetch both schools
  const [school1Data, school2Data] = await Promise.all([
    getSchoolBySlug(school1Slug),
    getSchoolBySlug(school2Slug),
  ]);

  if (!school1Data || !school2Data) {
    notFound();
  }

  // Get rivalry detail and game history
  const [rivalryRecord, games] = await Promise.all([
    getRivalryDetail(school1Data.id, school2Data.id, sport),
    getRivalryGames(school1Data.id, school2Data.id, sport, 50),
  ]);

  if (!rivalryRecord) {
    notFound();
  }

  const meta = SPORT_META[sport];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://phillysportspack.com' },
          { name: meta.name, url: `https://phillysportspack.com/${sport}` },
          {
            name: 'Rivalries',
            url: `https://phillysportspack.com/${sport}/rivalries`,
          },
          {
            name: `${school1Data.name} vs ${school2Data.name}`,
            url: `https://phillysportspack.com/${sport}/rivalries/${rivalry}`,
          },
        ]}
      />

      {/* Hero Section */}
      <section
        className="py-12 md:py-16 border-b border-gray-700"
        style={{
          background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, ${meta.color}22 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: 'Rivalries', href: `/${sport}/rivalries` },
              { label: `${school1Data.name} vs ${school2Data.name}` },
            ]}
          />

          <div className="mt-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-heading">
              {school1Data.name}
            </h1>
            <div className="text-2xl text-gray-400 mb-6">vs</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 font-heading">
              {school2Data.name}
            </h1>

            {/* Series Record Bar */}
            <div className="max-w-md mx-auto mb-6">
              <SeriesBar
                school1Wins={rivalryRecord.school1_wins}
                school2Wins={rivalryRecord.school2_wins}
                ties={rivalryRecord.ties}
              />
            </div>

            {/* Series Record Display */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-white mb-2 font-heading">
                {rivalryRecord.school1_wins}-{rivalryRecord.school2_wins}
                {rivalryRecord.ties > 0 && <span className="text-lg">, {rivalryRecord.ties}T</span>}
              </div>
              <p className="text-gray-400">
                {rivalryRecord.total_games} games |{' '}
                {rivalryRecord.latest_game_date
                  ? `Last: ${formatDate(rivalryRecord.latest_game_date)}`
                  : 'No recent data'}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
            <div className="bg-[var(--psp-navy-mid)] rounded-lg p-4 border border-gray-700">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Total Games</div>
              <div className="text-2xl font-bold text-white font-heading">
                {rivalryRecord.total_games}
              </div>
            </div>
            <div className="bg-[var(--psp-navy-mid)] rounded-lg p-4 border border-gray-700">
              <div className="text-xs text-gray-400 uppercase tracking-wide">{school1Data.name}</div>
              <div className="text-2xl font-bold text-[var(--psp-gold)] font-heading">
                {rivalryRecord.school1_wins} W
              </div>
            </div>
            <div className="bg-[var(--psp-navy-mid)] rounded-lg p-4 border border-gray-700">
              <div className="text-xs text-gray-400 uppercase tracking-wide">{school2Data.name}</div>
              <div className="text-2xl font-bold text-[var(--psp-blue)] font-heading">
                {rivalryRecord.school2_wins} W
              </div>
            </div>
            <div className="bg-[var(--psp-navy-mid)] rounded-lg p-4 border border-gray-700">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Ties</div>
              <div className="text-2xl font-bold text-gray-300 font-heading">
                {rivalryRecord.ties}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Game History Table */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 font-heading">Game History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-3 text-gray-400">Date</th>
                      <th className="text-left py-2 px-3 text-gray-400">Season</th>
                      <th className="text-left py-2 px-3 text-gray-400">Away</th>
                      <th className="text-center py-2 px-3 text-gray-400">Score</th>
                      <th className="text-left py-2 px-3 text-gray-400">Home</th>
                      <th className="text-center py-2 px-3 text-gray-400">Box Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game) => {
                      const away = game.away_school;
                      const home = game.home_school;
                      const hasScore =
                        game.away_score != null && game.home_score != null;
                      const away_won =
                        hasScore && game.away_score !== undefined && game.home_score !== undefined && game.away_score > game.home_score;
                      const home_won =
                        hasScore && game.away_score !== undefined && game.home_score !== undefined && game.home_score > game.away_score;

                      return (
                        <tr
                          key={game.game_id}
                          className="border-b border-gray-800 hover:bg-[var(--psp-navy-mid)]"
                        >
                          <td className="py-3 px-3 text-gray-300">
                            {formatDate(game.game_date)}
                          </td>
                          <td className="py-3 px-3 text-gray-400">
                            {game.season_label}
                          </td>
                          <td className="py-3 px-3">
                            {away ? (
                              <Link
                                href={`/${sport}/schools/${away.slug}`}
                                className="text-[var(--psp-blue)] hover:underline"
                              >
                                {away.name}
                              </Link>
                            ) : (
                              'Away'
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-bold">
                            {hasScore ? (
                              <>
                                <span
                                  className={
                                    away_won
                                      ? 'text-[var(--psp-gold)]'
                                      : 'text-gray-400'
                                  }
                                >
                                  {game.away_score}
                                </span>
                                <span className="text-gray-500 mx-1">–</span>
                                <span
                                  className={
                                    home_won
                                      ? 'text-[var(--psp-gold)]'
                                      : 'text-gray-400'
                                  }
                                >
                                  {game.home_score}
                                </span>
                              </>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {home ? (
                              <Link
                                href={`/${sport}/schools/${home.slug}`}
                                className="text-[var(--psp-blue)] hover:underline"
                              >
                                {home.name}
                              </Link>
                            ) : (
                              'Home'
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {hasScore && (
                              <Link
                                href={`/${sport}/games/${game.game_id}`}
                                className="inline-block px-2 py-1 text-xs bg-[var(--psp-blue)]/10 border border-[var(--psp-blue)] text-[var(--psp-blue)] rounded hover:bg-[var(--psp-blue)]/20 transition"
                              >
                                Box
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {games.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No games found between these schools
                </div>
              )}
            </section>

            {/* Decade Breakdown Chart (CSS-based) */}
            {games.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">
                  Wins by Decade
                </h2>
                <div className="space-y-3">
                  {(() => {
                    // Group games by decade
                    const byDecade: Record<
                      string,
                      { school1: number; school2: number; ties: number }
                    > = {};

                    for (const game of games) {
                      if (!game.game_date) continue;
                      const year = parseInt(game.game_date.substring(0, 4));
                      const decade = `${Math.floor(year / 10) * 10}s`;

                      if (!byDecade[decade]) {
                        byDecade[decade] = { school1: 0, school2: 0, ties: 0 };
                      }

                      if (game.winner_id === rivalryRecord.school1_id) {
                        byDecade[decade].school1++;
                      } else if (game.winner_id === rivalryRecord.school2_id) {
                        byDecade[decade].school2++;
                      } else if (
                        game.home_score != null &&
                        game.away_score != null &&
                        game.home_score === game.away_score
                      ) {
                        byDecade[decade].ties++;
                      }
                    }

                    return Object.entries(byDecade)
                      .sort()
                      .reverse()
                      .map(([decade, record]) => {
                        const total =
                          record.school1 + record.school2 + record.ties;
                        const s1Pct = (record.school1 / total) * 100;
                        const tiesPct = (record.ties / total) * 100;
                        const s2Pct = (record.school2 / total) * 100;

                        return (
                          <div key={decade}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-semibold text-white">
                                {decade}
                              </span>
                              <span className="text-xs text-gray-400">
                                {record.school1}–{record.school2}
                                {record.ties > 0 && `, ${record.ties}T`}
                              </span>
                            </div>
                            <div className="flex gap-1 h-6 rounded-lg overflow-hidden border border-gray-700">
                              {record.school1 > 0 && (
                                <div
                                  className="bg-[var(--psp-gold)]"
                                  style={{ width: `${s1Pct}%` }}
                                />
                              )}
                              {record.ties > 0 && (
                                <div
                                  className="bg-gray-600"
                                  style={{ width: `${tiesPct}%` }}
                                />
                              )}
                              {record.school2 > 0 && (
                                <div
                                  className="bg-[var(--psp-blue)]"
                                  style={{ width: `${s2Pct}%` }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      });
                  })()}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* School Cards */}
            <div className="space-y-4">
              {[
                { school: school1Data, wins: rivalryRecord.school1_wins },
                { school: school2Data, wins: rivalryRecord.school2_wins },
              ].map(({ school, wins }) => (
                <Link
                  key={school.id}
                  href={`/${sport}/schools/${school.slug}`}
                  className="block bg-[var(--psp-navy)] rounded-lg border border-gray-700 p-4 hover:border-[var(--psp-gold)] transition-colors"
                >
                  <h3 className="font-bold text-white mb-2">{school.name}</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-400">Series W</div>
                      <div className="font-bold text-[var(--psp-gold)]">
                        {wins}
                      </div>
                    </div>
                    {school.city && (
                      <div>
                        <div className="text-gray-400">City</div>
                        <div className="font-semibold text-white">
                          {school.city}
                        </div>
                      </div>
                    )}
                    {school.league_id && (
                      <div>
                        <div className="text-gray-400">League</div>
                        <div className="font-semibold text-white text-xs">Assigned</div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Legend */}
            <div className="bg-[var(--psp-navy)] rounded-lg border border-gray-700 p-4">
              <h4 className="font-bold text-white mb-3 text-sm">Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[var(--psp-gold)] rounded" />
                  <span className="text-gray-300">{school1Data.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded" />
                  <span className="text-gray-300">Ties</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[var(--psp-blue)] rounded" />
                  <span className="text-gray-300">{school2Data.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
