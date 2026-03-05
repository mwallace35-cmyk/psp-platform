import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidSport, SPORT_META, getGameById, getGameBoxScore, getRelatedGames } from '@/lib/data';
import { Breadcrumb } from '@/components/ui';
import PSPPromo from '@/components/ads/PSPPromo';
import GameHeader from './GameHeader';
import BoxScore from './BoxScore';
import type { Metadata } from 'next';

export const revalidate = 3600;

type PageParams = { sport: string; id: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, id } = await params;
  if (!isValidSport(sport)) return {};

  const gameId = parseInt(id, 10);
  if (isNaN(gameId)) return {};

  const game = await getGameById(gameId);
  if (!game) return {};

  const homeTeam = (game as any).home_school?.name || 'Home Team';
  const awayTeam = (game as any).away_school?.name || 'Away Team';
  const homeScore = game.home_score ?? '—';
  const awayScore = game.away_score ?? '—';
  const meta = SPORT_META[sport as keyof typeof SPORT_META];

  return {
    title: `${awayTeam} vs ${homeTeam} — ${meta?.name || sport} — PhillySportsPack`,
    description: `${awayTeam} ${awayScore}, ${homeTeam} ${homeScore}. Full box score and game recap from ${game.seasons?.label || 'the season'}.`,
  };
}

export default async function GamePage({ params }: { params: Promise<PageParams> }) {
  const { sport, id } = await params;
  if (!isValidSport(sport)) notFound();

  const gameId = parseInt(id, 10);
  if (isNaN(gameId)) notFound();

  const game = await getGameById(gameId);
  if (!game) notFound();

  // Verify game belongs to this sport
  if (game.sport_id !== sport) notFound();

  const meta = SPORT_META[sport as keyof typeof SPORT_META];
  const boxScore = await getGameBoxScore(gameId, sport);
  const relatedGames = await getRelatedGames(
    gameId,
    sport,
    game.home_school_id,
    game.away_school_id,
    5
  );

  const homeTeam = (game as any).home_school;
  const awayTeam = (game as any).away_school;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumb
          items={[
            { label: meta.name, href: `/${sport}` },
            { label: 'Games' },
            { label: `${awayTeam?.short_name || awayTeam?.name} @ ${homeTeam?.short_name || homeTeam?.name}` },
          ]}
        />
      </div>

      {/* Game Header Hero */}
      <GameHeader game={game} sportId={sport} />

      <PSPPromo size="banner" variant={2} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Box Score Section */}
            {boxScore && boxScore.length > 0 && (
              <div>
                <h2 className="espn-section-head">Box Score</h2>
                <BoxScore
                  boxScore={boxScore}
                  sportId={sport}
                  homeSchoolId={game.home_school_id}
                  awaySchoolId={game.away_school_id}
                />
              </div>
            )}

            {/* Play-by-Play Section (if available) */}
            {game.play_by_play && Array.isArray(game.play_by_play) && game.play_by_play.length > 0 && (
              <div>
                <h2 className="espn-section-head">Play-by-Play</h2>
                <div className="space-y-3">
                  {(game.play_by_play as any[]).map((play: any, idx: number) => (
                    <div
                      key={idx}
                      className="border-l-4 border-gold pl-4 py-2 bg-gray-50 rounded"
                    >
                      {play.period && <div className="text-xs font-semibold text-gray-500 uppercase">Q{play.period}</div>}
                      {play.time && <div className="text-sm text-gray-600">{play.time}</div>}
                      <div className="text-sm mt-1">{play.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Games Section */}
            {relatedGames && relatedGames.length > 0 && (
              <div>
                <h2 className="espn-section-head">Head-to-Head History</h2>
                <div className="space-y-3">
                  {relatedGames.map((relGame: any) => {
                    const relHome = (relGame as any).home_school;
                    const relAway = (relGame as any).away_school;
                    const relDate = relGame.game_date
                      ? new Date(relGame.game_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: '2-digit',
                        })
                      : 'Date TBD';

                    return (
                      <Link
                        key={relGame.id}
                        href={`/${sport}/games/${relGame.id}`}
                        className="block border border-gray-200 rounded-lg p-4 hover:border-gold hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-sm text-gray-500">{relDate}</div>
                          <div className="flex-1 text-center">
                            <div className="text-sm font-semibold">{relAway?.short_name || relAway?.name}</div>
                          </div>
                          <div className="w-16 text-center">
                            <div className="text-lg font-bold text-navy">
                              {relGame.away_score} - {relGame.home_score}
                            </div>
                          </div>
                          <div className="flex-1 text-center">
                            <div className="text-sm font-semibold">{relHome?.short_name || relHome?.name}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Info Card */}
            <div className="sidebar-widget">
              <h3 className="sw-head">Game Info</h3>
              <dl className="sw-dl">
                <div className="sw-row">
                  <dt>Date</dt>
                  <dd>
                    {game.game_date
                      ? new Date(game.game_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'TBD'}
                  </dd>
                </div>
                {game.venue && (
                  <div className="sw-row">
                    <dt>Venue</dt>
                    <dd>{game.venue}</dd>
                  </div>
                )}
                {game.seasons?.label && (
                  <div className="sw-row">
                    <dt>Season</dt>
                    <dd>{game.seasons.label}</dd>
                  </div>
                )}
                {homeTeam?.leagues?.name && (
                  <div className="sw-row">
                    <dt>League</dt>
                    <dd>{homeTeam.leagues.name}</dd>
                  </div>
                )}
                {game.game_type && game.game_type !== 'regular' && (
                  <div className="sw-row">
                    <dt>Game Type</dt>
                    <dd className="capitalize">{game.game_type.replace(/-/g, ' ')}</dd>
                  </div>
                )}
              </dl>
            </div>

            <PSPPromo size="sidebar" variant={4} />

            {/* School Info Cards */}
            {homeTeam && (
              <div className="sidebar-widget">
                <h3 className="sw-head">{homeTeam.name}</h3>
                <dl className="sw-dl">
                  {homeTeam.city && (
                    <div className="sw-row">
                      <dt>Location</dt>
                      <dd>{homeTeam.city}, {homeTeam.state || 'PA'}</dd>
                    </div>
                  )}
                  {homeTeam.mascot && (
                    <div className="sw-row">
                      <dt>Mascot</dt>
                      <dd>{homeTeam.mascot}</dd>
                    </div>
                  )}
                  <div className="sw-row mt-4">
                    <Link
                      href={`/schools/${homeTeam.slug}/${sport}`}
                      className="btn-primary"
                      style={{ display: 'block', textAlign: 'center', padding: '8px 12px', borderRadius: 6 }}
                    >
                      View Profile →
                    </Link>
                  </div>
                </dl>
              </div>
            )}

            {awayTeam && (
              <div className="sidebar-widget">
                <h3 className="sw-head">{awayTeam.name}</h3>
                <dl className="sw-dl">
                  {awayTeam.city && (
                    <div className="sw-row">
                      <dt>Location</dt>
                      <dd>{awayTeam.city}, {awayTeam.state || 'PA'}</dd>
                    </div>
                  )}
                  {awayTeam.mascot && (
                    <div className="sw-row">
                      <dt>Mascot</dt>
                      <dd>{awayTeam.mascot}</dd>
                    </div>
                  )}
                  <div className="sw-row mt-4">
                    <Link
                      href={`/schools/${awayTeam.slug}/${sport}`}
                      className="btn-primary"
                      style={{ display: 'block', textAlign: 'center', padding: '8px 12px', borderRadius: 6 }}
                    >
                      View Profile →
                    </Link>
                  </div>
                </dl>
              </div>
            )}

            <PSPPromo size="sidebar" variant={3} />
          </div>
        </div>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsEvent',
            name: `${awayTeam?.name} vs ${homeTeam?.name}`,
            description: `${meta.name} game between ${awayTeam?.name} and ${homeTeam?.name}`,
            startDate: game.game_date,
            homeTeam: {
              '@type': 'SportsTeam',
              name: homeTeam?.name,
              url: `https://phillysportspack.com/schools/${homeTeam?.slug}/${sport}`,
            },
            awayTeam: {
              '@type': 'SportsTeam',
              name: awayTeam?.name,
              url: `https://phillysportspack.com/schools/${awayTeam?.slug}/${sport}`,
            },
            sport: meta.name,
            ...(game.venue && {
              location: {
                '@type': 'Place',
                name: game.venue,
              },
            }),
            ...(game.home_score !== null && game.away_score !== null && {
              result: {
                '@type': 'SportsEventResult',
                homeTeamScore: game.home_score,
                awayTeamScore: game.away_score,
              },
            }),
          }),
        }}
      />
    </>
  );
}
