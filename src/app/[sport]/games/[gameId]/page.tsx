import Link from "next/link";
import { notFound } from "next/navigation";
import {
  isValidSport,
  SPORT_META,
  getGameById,
  getGameBoxScore,
  type GamePlayerStat,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import type { Metadata } from "next";

export const revalidate = 86400; // ISR: daily

type PageParams = { sport: string; gameId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { sport, gameId } = await params;
  const game = await getGameById(Number(gameId));
  if (!game) return { title: "Game Not Found" };

  const home = game.home_school?.name ?? "Home";
  const awayName = game.away_school?.name
    ?? (game.notes ? game.notes.replace(/^Opponent:\s*/i, "").replace(/\s*\(.*\)\s*$/, "").trim() : null)
    ?? "Away";
  const away = awayName;
  const score =
    game.home_score != null && game.away_score != null
      ? ` ${game.home_score}-${game.away_score}`
      : "";
  const season = game.seasons?.label ?? "";

  return {
    title: `${away} at ${home}${score} | ${season} ${isValidSport(sport) ? SPORT_META[sport].name : sport}`,
    description: `Box score and game details for ${away} vs ${home}${score}. ${season} Philadelphia high school ${sport}.`,
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

function FootballBoxScore({
  stats,
  homeSchoolId,
  awaySchoolId,
}: {
  stats: GamePlayerStat[];
  homeSchoolId: number | null;
  awaySchoolId: number | null;
}) {
  const homeStats = stats.filter((s) => s.school_id === homeSchoolId);
  const awayStats = stats.filter((s) => s.school_id === awaySchoolId);

  function TeamStats({ teamStats, label }: { teamStats: GamePlayerStat[]; label: string }) {
    const rushers = teamStats.filter(
      (s) => s.rush_carries != null && (s.rush_carries > 0 || s.rush_yards !== 0)
    );
    const passers = teamStats.filter(
      (s) => s.pass_completions != null || (s.pass_yards != null && s.pass_yards !== 0)
    );
    const receivers = teamStats.filter(
      (s) => s.rec_catches != null && (s.rec_catches > 0 || (s.rec_yards != null && s.rec_yards !== 0))
    );

    return (
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[var(--psp-gold)] mb-3 font-heading uppercase">
          {label}
        </h3>

        {rushers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Rushing
            </h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-1 pr-2">Player</th>
                  <th className="text-center py-1 px-2">#</th>
                  <th className="text-right py-1 px-2">Car</th>
                  <th className="text-right py-1 pl-2">Yds</th>
                </tr>
              </thead>
              <tbody>
                {rushers
                  .sort((a, b) => (b.rush_yards ?? 0) - (a.rush_yards ?? 0))
                  .map((s) => (
                    <tr key={s.id} className="border-b border-gray-800 hover:bg-[var(--psp-navy-mid)]">
                      <td className="py-1.5 pr-2">
                        {s.players?.slug ? (
                          <Link
                            href={`/football/players/${s.players.slug}`}
                            className="text-[var(--psp-blue)] hover:underline"
                          >
                            {s.player_name}
                          </Link>
                        ) : (
                          <span className="text-gray-200">{s.player_name}</span>
                        )}
                      </td>
                      <td className="text-center py-1.5 px-2 text-gray-400">
                        {s.jersey_number ?? ""}
                      </td>
                      <td className="text-right py-1.5 px-2">{s.rush_carries ?? 0}</td>
                      <td className="text-right py-1.5 pl-2 font-semibold">
                        {s.rush_yards ?? 0}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {passers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Passing
            </h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-1 pr-2">Player</th>
                  <th className="text-center py-1 px-2">#</th>
                  <th className="text-right py-1 px-2">Comp</th>
                  <th className="text-right py-1 pl-2">Yds</th>
                </tr>
              </thead>
              <tbody>
                {passers
                  .sort((a, b) => (b.pass_yards ?? 0) - (a.pass_yards ?? 0))
                  .map((s) => (
                    <tr key={s.id} className="border-b border-gray-800 hover:bg-[var(--psp-navy-mid)]">
                      <td className="py-1.5 pr-2">
                        {s.players?.slug ? (
                          <Link
                            href={`/football/players/${s.players.slug}`}
                            className="text-[var(--psp-blue)] hover:underline"
                          >
                            {s.player_name}
                          </Link>
                        ) : (
                          <span className="text-gray-200">{s.player_name}</span>
                        )}
                      </td>
                      <td className="text-center py-1.5 px-2 text-gray-400">
                        {s.jersey_number ?? ""}
                      </td>
                      <td className="text-right py-1.5 px-2">{s.pass_completions ?? 0}</td>
                      <td className="text-right py-1.5 pl-2 font-semibold">
                        {s.pass_yards ?? 0}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {receivers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Receiving
            </h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-1 pr-2">Player</th>
                  <th className="text-center py-1 px-2">#</th>
                  <th className="text-right py-1 px-2">Rec</th>
                  <th className="text-right py-1 pl-2">Yds</th>
                </tr>
              </thead>
              <tbody>
                {receivers
                  .sort((a, b) => (b.rec_yards ?? 0) - (a.rec_yards ?? 0))
                  .map((s) => (
                    <tr key={s.id} className="border-b border-gray-800 hover:bg-[var(--psp-navy-mid)]">
                      <td className="py-1.5 pr-2">
                        {s.players?.slug ? (
                          <Link
                            href={`/football/players/${s.players.slug}`}
                            className="text-[var(--psp-blue)] hover:underline"
                          >
                            {s.player_name}
                          </Link>
                        ) : (
                          <span className="text-gray-200">{s.player_name}</span>
                        )}
                      </td>
                      <td className="text-center py-1.5 px-2 text-gray-400">
                        {s.jersey_number ?? ""}
                      </td>
                      <td className="text-right py-1.5 px-2">{s.rec_catches ?? 0}</td>
                      <td className="text-right py-1.5 pl-2 font-semibold">
                        {s.rec_yards ?? 0}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {teamStats.length === 0 && (
          <p className="text-gray-500 text-sm italic">No individual stats available</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TeamStats
        teamStats={awayStats.length > 0 ? awayStats : homeStats}
        label={
          awayStats.length > 0
            ? stats.find((s) => s.school_id === awaySchoolId)?.schools?.name ?? "Away"
            : stats[0]?.schools?.name ?? "Team"
        }
      />
      {awayStats.length > 0 && (
        <TeamStats
          teamStats={homeStats}
          label={stats.find((s) => s.school_id === homeSchoolId)?.schools?.name ?? "Home"}
        />
      )}
    </div>
  );
}

function BasketballBoxScore({
  stats,
  homeSchoolId,
  awaySchoolId,
  homeScore,
  awayScore,
}: {
  stats: GamePlayerStat[];
  homeSchoolId: number | null;
  awaySchoolId: number | null;
  homeScore: number | null;
  awayScore: number | null;
}) {
  const homeStats = stats.filter((s) => s.school_id === homeSchoolId);
  const awayStats = stats.filter((s) => s.school_id === awaySchoolId);

  function TeamScoring({
    teamStats,
    label,
    gameScore,
  }: {
    teamStats: GamePlayerStat[];
    label: string;
    gameScore?: number | null;
  }) {
    // Use actual game score when available, fall back to summed box score stats
    const displayPts = gameScore ?? teamStats.reduce((sum, s) => sum + (s.points ?? 0), 0);

    return (
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[var(--psp-gold)] mb-3 font-heading uppercase">
          {label} {displayPts > 0 && <span className="text-white">({displayPts} pts)</span>}
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-1 pr-2">Player</th>
              <th className="text-center py-1 px-2">#</th>
              <th className="text-right py-1 pl-2">Pts</th>
            </tr>
          </thead>
          <tbody>
            {teamStats
              .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
              .map((s) => (
                <tr key={s.id} className="border-b border-gray-800 hover:bg-[var(--psp-navy-mid)]">
                  <td className="py-1.5 pr-2">
                    {s.players?.slug ? (
                      <Link
                        href={`/basketball/players/${s.players.slug}`}
                        className="text-[var(--psp-blue)] hover:underline"
                      >
                        {s.player_name}
                      </Link>
                    ) : (
                      <span className="text-gray-200">{s.player_name}</span>
                    )}
                  </td>
                  <td className="text-center py-1.5 px-2 text-gray-400">
                    {s.jersey_number ?? ""}
                  </td>
                  <td className="text-right py-1.5 pl-2 font-semibold text-[var(--psp-gold)]">
                    {s.points ?? 0}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {teamStats.length === 0 && (
          <p className="text-gray-500 text-sm italic">No individual stats available</p>
        )}
      </div>
    );
  }

  // If all stats are from one school (team_page source), show just that school
  const schoolIds = [...new Set(stats.map((s) => s.school_id))];

  if (schoolIds.length === 1) {
    const schoolName = stats[0]?.schools?.name ?? "Team";
    const singleScore = stats[0]?.school_id === homeSchoolId ? homeScore : awayScore;
    return <TeamScoring teamStats={stats} label={schoolName} gameScore={singleScore} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TeamScoring
        teamStats={awayStats}
        label={stats.find((s) => s.school_id === awaySchoolId)?.schools?.name ?? "Away"}
        gameScore={awayScore}
      />
      <TeamScoring
        teamStats={homeStats}
        label={stats.find((s) => s.school_id === homeSchoolId)?.schools?.name ?? "Home"}
        gameScore={homeScore}
      />
    </div>
  );
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { sport, gameId: gameIdStr } = await params;

  if (!isValidSport(sport)) notFound();

  const gameId = Number(gameIdStr);
  if (isNaN(gameId)) notFound();

  const [game, boxScore] = await Promise.all([
    getGameById(gameId),
    getGameBoxScore(gameId),
  ]);

  if (!game || game.sport_id !== sport) notFound();

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

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbs} />

      {/* Game Header */}
      <div className="bg-[var(--psp-navy)] rounded-xl border border-gray-700 overflow-hidden mb-8">
        {/* Sport banner */}
        <div
          className="px-6 py-2 text-sm font-semibold uppercase tracking-wider"
          style={{ backgroundColor: meta?.color ?? "#0a1628", color: "#fff" }}
        >
          {meta?.emoji} {meta?.name ?? sport} &middot; {season?.label ?? ""}
        </div>

        {/* Score display */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-3 items-center text-center">
            {/* Away team / Opponent */}
            <div>
              {away ? (
                <Link
                  href={`/${sport}/schools/${away.slug}`}
                  className="text-lg md:text-xl font-bold text-white hover:text-[var(--psp-gold)] transition-colors font-heading"
                >
                  {away.name}
                </Link>
              ) : opponentFromNotes ? (
                <span className="text-lg md:text-xl font-bold text-gray-300 font-heading">
                  {opponentFromNotes}
                </span>
              ) : (
                <span className="text-lg md:text-xl font-bold text-gray-400">Away</span>
              )}
              {hasScore && (
                <div
                  className={`text-4xl md:text-5xl font-bold mt-2 font-heading ${
                    awayWon ? "text-[var(--psp-gold)]" : "text-gray-400"
                  }`}
                >
                  {game.away_score}
                </div>
              )}
            </div>

            {/* Center */}
            <div className="flex flex-col items-center gap-2">
              {hasScore ? (
                <span className="text-gray-500 text-sm uppercase tracking-wider">Final</span>
              ) : (
                <span className="text-gray-500 text-sm">vs</span>
              )}
              <span className="text-gray-500 text-xs">{formatDate(game.game_date)}</span>
            </div>

            {/* Home team */}
            <div>
              {home ? (
                <Link
                  href={`/${sport}/schools/${home.slug}`}
                  className="text-lg md:text-xl font-bold text-white hover:text-[var(--psp-gold)] transition-colors font-heading"
                >
                  {home.name}
                </Link>
              ) : (
                <span className="text-lg md:text-xl font-bold text-gray-400">Home</span>
              )}
              {hasScore && (
                <div
                  className={`text-4xl md:text-5xl font-bold mt-2 font-heading ${
                    homeWon ? "text-[var(--psp-gold)]" : "text-gray-400"
                  }`}
                >
                  {game.home_score}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Box Score */}
      {boxScore.length > 0 ? (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 font-heading uppercase">
            Box Score
          </h2>
          <div className="bg-[var(--psp-navy)] rounded-xl border border-gray-700 p-6">
            {sport === "football" ? (
              <FootballBoxScore
                stats={boxScore}
                homeSchoolId={game.home_school_id}
                awaySchoolId={game.away_school_id}
              />
            ) : sport === "basketball" ? (
              <BasketballBoxScore
                stats={boxScore}
                homeSchoolId={game.home_school_id}
                awaySchoolId={game.away_school_id}
                homeScore={game.home_score}
                awayScore={game.away_score}
              />
            ) : (
              <p className="text-gray-500 text-sm">
                Box score display not yet available for {meta?.name ?? sport}.
              </p>
            )}

            <p className="text-xs text-gray-600 mt-4 border-t border-gray-700 pt-3">
              Source: Ted Silary Archive &middot; PhillySportsPack.com
            </p>
          </div>
        </section>
      ) : (
        <div className="bg-[var(--psp-navy)] rounded-xl border border-gray-700 p-8 text-center">
          <p className="text-gray-400">No box score data available for this game.</p>
          <p className="text-gray-600 text-sm mt-2">
            Individual player statistics are available for select games from the archive.
          </p>
        </div>
      )}
    </main>
  );
}
