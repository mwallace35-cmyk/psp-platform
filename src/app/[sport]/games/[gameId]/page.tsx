import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import {
  SPORT_META,
  getGameById,
  getGameBoxScore,
  getTeamSeasonStats,
  getAdjacentGames,
  type GamePlayerStat,
  type TeamSeasonStats,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import GameFilmSection from "@/components/highlights/GameFilmSection";
import MediaGallery from "@/components/media/MediaGallery";
import HeadToHeadBadge from "@/components/game/HeadToHeadBadge";
import ShareButtons from "@/components/social/ShareButtons";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";
import { buildGameCaption } from "@/lib/ig-caption";
import FootballBoxScore from "./FootballBoxScore";
import BasketballBoxScore from "./BasketballBoxScore";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: hourly (games get new box scores frequently)
type PageParams = { sport: string; gameId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { gameId } = await params;
  const sport = await validateSportParamForMetadata(params);
  const game = await getGameById(Number(gameId));
  if (!game) return { title: "Game Not Found" };

  const home = game.home_school ? getSchoolDisplayName(game.home_school) : "Home";
  const awayName = game.away_school ? getSchoolDisplayName(game.away_school)
    : (game.notes ? game.notes.replace(/^Opponent:\s*/i, "").replace(/\s*\(.*\)\s*$/, "").trim() : null)
    ?? "Away";
  const away = awayName;
  const score =
    game.home_score != null && game.away_score != null
      ? ` ${game.home_score}-${game.away_score}`
      : "";
  const season = game.seasons?.label ?? "";

  const { sport: sportSlug } = await params;
  return {
    title: `${away} at ${home}${score} | ${season} ${(sport) ? SPORT_META[sport].name : "Game"}`,
    description: `Box score and game details for ${away} vs ${home}${score}. ${season} Philadelphia high school${sport ? ` ${SPORT_META[sport].name}` : ""}.`,
    alternates: { canonical: `https://phillysportspack.com/${sportSlug}/games/${gameId}` },
  };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Date TBD";
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return "";
  try {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return timeStr;
  }
}

function formatGameType(gameType: string | null): string {
  if (!gameType) return "";
  const mapping: Record<string, string> = {
    regular: "Regular Season",
    playoff: "Playoff",
    championship: "Championship",
    state: "State Championship",
    league: "League Game",
  };
  return mapping[gameType] || gameType;
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const sport = await validateSportParam(params);
  const { gameId: gameIdStr } = await params;

  const gameId = Number(gameIdStr);
  if (isNaN(gameId)) notFound();

  const [game, boxScore] = await Promise.all([
    getGameById(gameId),
    getGameBoxScore(gameId),
  ]);

  if (!game || game.sport_id !== sport) notFound();

  // Fetch team season stats as fallback when no box score exists, plus adjacent games for nav
  const [teamSeasonData, adjacentGames] = await Promise.all([
    boxScore.length === 0
      ? getTeamSeasonStats(sport, game.season_id, game.home_school_id, game.away_school_id)
      : Promise.resolve(null),
    getAdjacentGames(gameId, sport, game.season_id, game.home_school_id),
  ]);

  const meta = SPORT_META[sport];
  const home = game.home_school;
  const away = game.away_school;
  const hasScore = game.home_score != null && game.away_score != null;
  const season = game.seasons;

  // Extract opponent name from notes for games without away school (award-import pattern)
  const opponentFromNotes = !away && game.notes
    ? game.notes.replace(/^Opponent:\s*/i, "").replace(/\s*\(.*\)\s*$/, "").trim()
    : null;

  // Determine winner
  let homeWon = false;
  let awayWon = false;
  if (hasScore) {
    homeWon = (game.home_score ?? 0) > (game.away_score ?? 0);
    awayWon = (game.away_score ?? 0) > (game.home_score ?? 0);
  }

  const breadcrumbs = [
    { label: meta?.name ?? sport, href: `/${sport}` },
    {
      label: season?.label ?? "Season",
      href: home ? `/${sport}/schools/${home.slug}` : `/${sport}`,
    },
    { label: `${opponentFromNotes ?? away?.name ?? "Away"} vs ${home?.name ?? "Home"}` },
  ];

  const h1Away = opponentFromNotes ?? (away ? getSchoolDisplayName(away) : "Away");
  const h1Home = home ? getSchoolDisplayName(home) : "Home";
  const h1Score = hasScore ? ` ${game.away_score}-${game.home_score}` : "";

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbs} />

      <h1 className="sr-only">{`${h1Away} vs ${h1Home}${h1Score} — ${season?.label ?? ""} ${meta?.name ?? sport}`}</h1>

      {/* ESPN-Style Score Banner */}
      <div className="bg-[var(--psp-navy)] rounded-xl overflow-hidden mb-8 border border-gray-700">
        {/* Game context bar */}
        <div className="px-4 py-2 flex items-center justify-between text-xs bg-[var(--psp-navy-mid)] border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-[var(--psp-gold)] font-semibold uppercase tracking-wider font-heading">
              {meta?.name ?? sport}
            </span>
            {(game.game_type || game.playoff_round) && (
              <>
                <span className="text-gray-600">|</span>
                <span className="text-gray-300 font-medium">
                  {game.playoff_round ?? formatGameType(game.game_type)}
                </span>
              </>
            )}
          </div>
          <div className="text-gray-400">
            {formatDate(game.game_date)}
            {game.game_time ? ` - ${formatTime(game.game_time)}` : ""}
          </div>
        </div>

        {/* Score body */}
        <div className="px-4 sm:px-8 py-6">
          <div className="flex flex-col items-center gap-4">
            {/* Scores row */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 w-full">
              {/* Away team + score */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-heading text-xl sm:text-3xl font-bold text-white shrink-0"
                  style={{ backgroundColor: awayWon ? "var(--psp-gold)" : "#374151" }}
                >
                  {(opponentFromNotes ?? away?.name ?? "A").charAt(0)}
                </div>
                {away ? (
                  <Link
                    href={`/${sport}/schools/${away.slug}`}
                    className="text-xs sm:text-sm font-bold text-white hover:text-[var(--psp-gold)] transition-colors font-heading text-center truncate max-w-[180px] sm:max-w-[280px]"
                  >
                    {getSchoolDisplayName(away)}
                  </Link>
                ) : opponentFromNotes ? (
                  <span className="text-xs sm:text-sm font-bold text-gray-300 font-heading text-center truncate max-w-[180px] sm:max-w-[280px]">
                    {opponentFromNotes}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm font-bold text-gray-300 text-center">Away</span>
                )}
                {awayWon && (
                  <span className="text-[10px] text-[var(--psp-gold)] font-semibold uppercase tracking-wider">Winner</span>
                )}
              </div>

              {/* Scores center */}
              <div className="flex items-center gap-3 sm:gap-6 shrink-0">
              {hasScore ? (
                <>
                  <span className={`text-4xl sm:text-6xl font-bold font-heading tabular-nums ${awayWon ? "text-white" : "text-gray-500"}`}>
                    {game.away_score}
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="text-[var(--psp-gold)] text-xs sm:text-sm font-bold uppercase tracking-wider">
                      {hasScore ? "Final" : "vs"}
                    </span>
                    {season && (
                      <span className="text-gray-500 text-[10px] mt-0.5">{season.label}</span>
                    )}
                  </div>
                  <span className={`text-4xl sm:text-6xl font-bold font-heading tabular-nums ${homeWon ? "text-white" : "text-gray-500"}`}>
                    {game.home_score}
                  </span>
                </>
              ) : (
                <span className="text-gray-400 text-lg font-heading">vs</span>
              )}
            </div>

              {/* Home team + score */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-heading text-xl sm:text-3xl font-bold text-white shrink-0"
                  style={{ backgroundColor: homeWon ? "var(--psp-gold)" : "#374151" }}
                >
                  {(home?.name ?? "H").charAt(0)}
                </div>
                {home ? (
                  <Link
                    href={`/${sport}/schools/${home.slug}`}
                    className="text-xs sm:text-sm font-bold text-white hover:text-[var(--psp-gold)] transition-colors font-heading text-center truncate max-w-[180px] sm:max-w-[280px]"
                  >
                    {getSchoolDisplayName(home)}
                  </Link>
                ) : (
                  <span className="text-xs sm:text-sm font-bold text-gray-300 text-center">Home</span>
                )}
                {homeWon ? (
                  <span className="text-[10px] text-[var(--psp-gold)] font-semibold uppercase tracking-wider">Winner</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share buttons */}
      {(() => {
        const shareDateRaw = game.game_date ? (() => {
          try {
            const d = new Date(game.game_date + "T12:00:00");
            return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
          } catch {
            return "";
          }
        })() : "";
        const igQs = new URLSearchParams({
          home: h1Home,
          away: h1Away,
          ...(hasScore ? { homeScore: String(game.home_score), awayScore: String(game.away_score) } : {}),
          sport,
          ...(shareDateRaw ? { date: shareDateRaw } : {}),
        }).toString();
        const igImageUrl = `/api/og/ig-story/game?${igQs}`;
        const igCaption = buildGameCaption({
          home: h1Home,
          away: h1Away,
          homeScore: hasScore ? game.home_score : null,
          awayScore: hasScore ? game.away_score : null,
          sport,
          date: shareDateRaw,
          url: `https://phillysportspack.com/${sport}/games/${gameIdStr}`,
        });
        return (
          <div className="mb-6 flex justify-end">
            <ShareButtons
              url={`/${sport}/games/${gameIdStr}`}
              title={`${h1Away} vs ${h1Home}${h1Score} | PhillySportsPack`}
              description={`Box score and game details for ${h1Away} vs ${h1Home}${h1Score}.`}
              igImageUrl={igImageUrl}
              igCaption={igCaption}
            />
          </div>
        );
      })()}

      {/* Head-to-Head Badge */}
      {game.home_school_id && game.away_school_id && (
        <div className="mb-6">
          <HeadToHeadBadge
            homeSchoolId={game.home_school_id}
            awaySchoolId={game.away_school_id}
            sportId={sport}
          />
        </div>
      )}

      {/* Period Scores (if available) */}
      {game.period_scores && typeof game.period_scores === "object" && Object.keys(game.period_scores).length > 0 && (
        <div className="bg-[var(--psp-navy)] rounded-xl border border-gray-700 p-4 mb-6">
          <h2 className="text-sm font-semibold text-[var(--psp-gold)] uppercase mb-3">Scoring by Period</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(game.period_scores as Record<string, { home?: number; away?: number } | number>).map(([period, scores]) => {
              const scoreObj = typeof scores === "object" ? scores : { home: scores };
              return (
                <div key={period} className="border border-gray-700 rounded p-3 text-center">
                  <div className="text-xs text-gray-300 uppercase tracking-wide mb-2">{period}</div>
                  {scoreObj.home !== undefined && scoreObj.away !== undefined ? (
                    <>
                      <div className="text-sm text-gray-300">{scoreObj.home}</div>
                      <div className="text-xs text-gray-400 my-1">—</div>
                      <div className="text-sm text-gray-300">{scoreObj.away}</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-300">{JSON.stringify(scores)}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Box Score */}
      {(() => {
        const realBoxScore = boxScore.filter((s: GamePlayerStat) => s.source_type !== 'season_average');
        const hasRealStats = realBoxScore.length > 0;

        return hasRealStats ? (
          <section className="mt-6">
            <h2 className="text-2xl font-bold text-[var(--psp-gold)] mb-3 font-heading uppercase tracking-wide">BOX SCORE</h2>
            <div className="bg-[var(--psp-navy)] rounded-xl border border-gray-700 p-6">
              {sport === "football" ? (
                <FootballBoxScore
                  stats={realBoxScore}
                  homeSchoolId={game.home_school_id}
                  awaySchoolId={game.away_school_id}
                  homeName={home ? getSchoolDisplayName(home) : "Home"}
                  awayName={opponentFromNotes ?? (away ? getSchoolDisplayName(away) : "Away")}
                  sport={sport}
                />
              ) : sport === "basketball" || sport === "girls-basketball" ? (
                <BasketballBoxScore
                  stats={realBoxScore}
                  homeSchoolId={game.home_school_id}
                  awaySchoolId={game.away_school_id}
                  homeScore={game.home_score}
                  awayScore={game.away_score}
                  sport={sport}
                />
              ) : (
                <p className="text-gray-300 text-sm">
                  Box score display not yet available for {meta?.name ?? sport}.
                </p>
              )}
              <p className="text-xs text-gray-500 mt-4 border-t border-gray-700 pt-3">
                Source: Ted Silary Archive &middot; PhillySportsPack.com
              </p>
            </div>
          </section>
        ) : (
          <section className="mt-6">
            <h2 className="text-2xl font-bold text-[var(--psp-gold)] mb-3 font-heading uppercase tracking-wide">BOX SCORE</h2>
            <div className="bg-[var(--psp-navy)] rounded-xl border border-gray-700 p-8 text-center">
              <p className="text-3xl mb-3" aria-hidden="true">📊</p>
              <p className="text-gray-300 text-base font-medium mb-1">No box score available for this game</p>
              <p className="text-gray-400 text-sm mb-4">Were you at this game? Help us build the most complete Philly HS sports database.</p>
              <Link
                href="/scores/report"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
                style={{ backgroundColor: 'var(--psp-gold)', color: 'var(--psp-navy)' }}
              >
                Submit Stats for This Game
              </Link>
            </div>
          </section>
        );
      })()}
      {teamSeasonData && (teamSeasonData.home?.players.length || teamSeasonData.away?.players.length) && (
        <section className="mt-6">
          <h2 className="text-2xl font-bold text-[var(--psp-gold)] mb-3 font-heading uppercase tracking-wide">
            Season Stats
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            {season?.label ?? ""} season statistics for players on each team
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[teamSeasonData.away, teamSeasonData.home].filter(Boolean).map((team) => {
              const t = team as TeamSeasonStats;
              return (
                <div key={t.schoolId} className="bg-[var(--psp-navy)] rounded-xl border border-gray-700 p-5">
                  <h3 className="text-lg font-bold text-[var(--psp-gold)] mb-3 font-heading uppercase">
                    <Link href={`/${sport}/schools/${t.schoolSlug}`} className="hover:underline">
                      {t.schoolName}
                    </Link>
                  </h3>
                  {t.players.length > 0 ? (
                    <table className="w-full text-sm text-gray-200" aria-label={`${t.schoolName} season statistics`}>
                      <thead>
                        <tr className="text-gray-300 border-b border-gray-700">
                          <th className="text-left py-1 pr-2">Player</th>
                          {(sport === "basketball" || sport === "girls-basketball") && (
                            <>
                              <th className="text-right py-1 px-1">GP</th>
                              <th className="text-right py-1 px-1">Pts</th>
                              <th className="text-right py-1 px-1">PPG</th>
                              <th className="text-right py-1 pl-1">Reb</th>
                            </>
                          )}
                          {sport === "football" && (
                            <>
                              <th className="text-right py-1 px-1">Rush</th>
                              <th className="text-right py-1 px-1">Pass</th>
                              <th className="text-right py-1 pl-1">Rec</th>
                            </>
                          )}
                          {sport === "baseball" && (
                            <>
                              <th className="text-right py-1 px-1">AVG</th>
                              <th className="text-right py-1 px-1">H</th>
                              <th className="text-right py-1 px-1">RBI</th>
                              <th className="text-right py-1 pl-1">HR</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {t.players.map((p) => (
                          <tr key={p.player_id} className="border-b border-gray-800 hover:bg-[var(--psp-navy-mid)] transition-colors duration-200">
                            <td className="py-1.5 pr-2">
                              {p.player_slug ? (
                                <Link href={`/${sport}/players/${p.player_slug}`} className="text-[var(--psp-blue)] hover:underline">
                                  {p.player_name}
                                </Link>
                              ) : (
                                <span className="text-gray-200">{p.player_name}</span>
                              )}
                            </td>
                            {(sport === "basketball" || sport === "girls-basketball") && (
                              <>
                                <td className="text-right py-1.5 px-1 text-gray-300">{p.games_played ?? "-"}</td>
                                <td className="text-right py-1.5 px-1 font-semibold text-[var(--psp-gold)]">{p.points ?? "-"}</td>
                                <td className="text-right py-1.5 px-1">{p.ppg != null ? p.ppg.toFixed(1) : "-"}</td>
                                <td className="text-right py-1.5 pl-1 text-gray-300">{p.rebounds ?? "-"}</td>
                              </>
                            )}
                            {sport === "football" && (
                              <>
                                <td className="text-right py-1.5 px-1">{p.rush_yards != null ? `${p.rush_yards}` : "-"}</td>
                                <td className="text-right py-1.5 px-1">{p.pass_yards != null ? `${p.pass_yards}` : "-"}</td>
                                <td className="text-right py-1.5 pl-1">{p.rec_yards != null ? `${p.rec_yards}` : "-"}</td>
                              </>
                            )}
                            {sport === "baseball" && (
                              <>
                                <td className="text-right py-1.5 px-1">{p.batting_avg != null ? p.batting_avg.toFixed(3) : "-"}</td>
                                <td className="text-right py-1.5 px-1">{p.hits ?? "-"}</td>
                                <td className="text-right py-1.5 px-1">{p.rbi ?? "-"}</td>
                                <td className="text-right py-1.5 pl-1">{p.home_runs ?? "-"}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-400 text-sm italic">No season stats available</p>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-600 mt-4">
            Showing season-level stats, not game-specific box score &middot; Source: PhillySportsPack.com
          </p>
        </section>
      )}
      {!(teamSeasonData && (teamSeasonData.home?.players.length || teamSeasonData.away?.players.length)) && boxScore.length === 0 && (
        <div className="bg-[var(--psp-navy)] rounded-xl border border-gray-700 p-8 text-center">
          <p className="text-gray-300 font-semibold">No detailed statistics available for this game.</p>
          <p className="text-gray-400 text-sm mt-2 mb-4">
            {hasScore ? (
              <>Final score: <span className="text-[var(--psp-gold)] font-semibold">{game.away_score} - {game.home_score}</span></>
            ) : (
              "Score information is not yet available."
            )}
          </p>
          {home && sport && (
            <div className="mt-4">
              <Link
                href={`/${sport}/schools/${home.slug}`}
                className="text-xs px-3 py-2 rounded inline-block border border-gray-700 text-[var(--psp-blue)] hover:bg-gray-800 transition"
              >
                View {home.name} Profile
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Game Media Gallery */}
      <MediaGallery gameId={gameId} sport={sport} showUpload />

      {/* Game Film Section */}
      <GameFilmSection gameId={gameId} sportSlug={sport} />

      {/* Prev/Next Game Navigation */}
      {(adjacentGames.prev || adjacentGames.next) && (
        <nav className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700" aria-label="Game navigation">
          {adjacentGames.prev ? (
            <Link
              href={`/${sport}/games/${adjacentGames.prev.id}`}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-[var(--psp-gold)] transition group"
            >
              <svg className="w-4 h-4 text-gray-500 group-hover:text-[var(--psp-gold)] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <div>
                <div className="text-xs text-gray-500">Previous Game</div>
                <div className="font-medium">vs {adjacentGames.prev.opponent}</div>
              </div>
            </Link>
          ) : <div />}
          {adjacentGames.next ? (
            <Link
              href={`/${sport}/games/${adjacentGames.next.id}`}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-[var(--psp-gold)] transition group text-right"
            >
              <div>
                <div className="text-xs text-gray-500">Next Game</div>
                <div className="font-medium">vs {adjacentGames.next.opponent}</div>
              </div>
              <svg className="w-4 h-4 text-gray-500 group-hover:text-[var(--psp-gold)] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          ) : <div />}
        </nav>
      )}
    </main>
  );
}
