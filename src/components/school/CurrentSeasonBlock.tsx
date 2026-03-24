import Link from "next/link";
import type { CurrentSeasonData } from "@/lib/data";

interface CurrentSeasonBlockProps {
  data: CurrentSeasonData;
  schoolName: string;
  schoolSlug: string;
  sport: string;
  sportColor: string;
  sportName: string;
}

function formatGameDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function classYearAbbr(classYear: string | null): string {
  if (!classYear) return "";
  const map: Record<string, string> = {
    freshman: "FR",
    sophomore: "SO",
    junior: "JR",
    senior: "SR",
  };
  return map[classYear.toLowerCase()] || classYear;
}

export default function CurrentSeasonBlock({
  data,
  schoolName,
  schoolSlug,
  sport,
  sportColor,
  sportName,
}: CurrentSeasonBlockProps) {
  const { teamSeason, nextGame, roster, seasonLabel } = data;
  if (!teamSeason) return null;

  const record = `${teamSeason.wins}-${teamSeason.losses}${teamSeason.ties ? `-${teamSeason.ties}` : ""}`;
  const totalGames = teamSeason.wins + teamSeason.losses + (teamSeason.ties || 0);
  const winPct = totalGames > 0 ? ((teamSeason.wins / totalGames) * 100).toFixed(0) : null;

  // Determine if the game is upcoming (no scores) or a result
  const gameIsUpcoming = nextGame && (nextGame.home_score === null || nextGame.away_score === null);

  // Format game result
  let gameResultText = "";
  let gameResultColor = "";
  if (nextGame && !gameIsUpcoming) {
    const schoolScore = nextGame.isHome ? nextGame.home_score! : nextGame.away_score!;
    const oppScore = nextGame.isHome ? nextGame.away_score! : nextGame.home_score!;
    if (schoolScore > oppScore) {
      gameResultText = `W ${schoolScore}-${oppScore}`;
      gameResultColor = "#22c55e";
    } else if (schoolScore < oppScore) {
      gameResultText = `L ${schoolScore}-${oppScore}`;
      gameResultColor = "#ef4444";
    } else {
      gameResultText = `T ${schoolScore}-${oppScore}`;
      gameResultColor = "#a3a3a3";
    }
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--psp-navy)",
        border: `2px solid ${sportColor}33`,
      }}
    >
      {/* Header bar */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ background: `${sportColor}18` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: sportColor }}
          />
          <span
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: sportColor }}
          >
            {seasonLabel} Season
          </span>
        </div>
        <Link
          href={`/${sport}/teams/${schoolSlug}/${seasonLabel}`}
          className="text-xs font-semibold px-3 py-1 rounded-lg transition-opacity hover:opacity-80"
          style={{
            background: `${sportColor}20`,
            color: sportColor,
          }}
        >
          View Full Season
        </Link>
      </div>

      <div className="p-5">
        {/* Record + Standing row */}
        <div className="flex flex-wrap items-end gap-6 mb-5">
          {/* Big record */}
          <div>
            <div
              className="text-5xl md:text-6xl text-white tracking-wide leading-none font-bebas"
            >
              {record}
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Season Record
              {winPct && (
                <span className="ml-2" style={{ color: sportColor }}>
                  ({winPct}%)
                </span>
              )}
            </div>
          </div>

          {/* League standing badge */}
          {teamSeason.league_finish && (
            <div
              className="rounded-lg px-4 py-2"
              style={{ background: `${sportColor}15`, border: `1px solid ${sportColor}30` }}
            >
              <div
                className="text-lg font-bold font-bebas"
                style={{ color: sportColor }}
              >
                {teamSeason.league_finish}
              </div>
              <div className="text-xs text-gray-300">League Standing</div>
            </div>
          )}

          {/* Playoff result badge */}
          {teamSeason.playoff_result && (
            <div
              className="rounded-lg px-4 py-2"
              style={{ background: "rgba(240,165,0,0.1)", border: "1px solid rgba(240,165,0,0.25)" }}
            >
              <div
                className="text-lg font-bold font-bebas"
                style={{ color: "var(--psp-gold)" }}
              >
                {teamSeason.playoff_result}
              </div>
              <div className="text-xs text-gray-300">Playoffs</div>
            </div>
          )}

          {/* Coach */}
          {teamSeason.coach && (
            <div className="ml-auto text-right hidden md:block">
              <div className="text-xs text-gray-300">Head Coach</div>
              <Link
                href={`/${sport}/coaches/${teamSeason.coach.slug}`}
                className="text-sm font-medium hover:underline"
                style={{ color: "var(--psp-gold)" }}
              >
                {teamSeason.coach.name}
              </Link>
            </div>
          )}
        </div>

        {/* Recent/Next game */}
        {nextGame && (
          <div
            className="rounded-xl p-4 mb-5"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-300 mb-1">
                  {gameIsUpcoming ? "Next Game" : "Last Result"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">
                    {nextGame.isHome ? "vs" : "@"}
                  </span>
                  {nextGame.opponent.slug ? (
                    <Link
                      href={`/${sport}/schools/${nextGame.opponent.slug}`}
                      className="text-sm font-semibold text-white hover:underline"
                    >
                      {nextGame.opponent.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-white">
                      {nextGame.opponent.name}
                    </span>
                  )}
                  {nextGame.game_type && nextGame.game_type !== "regular" && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase"
                      style={{ background: "rgba(240,165,0,0.15)", color: "var(--psp-gold)" }}
                    >
                      {nextGame.game_type}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                {gameIsUpcoming ? (
                  <div
                    className="text-lg font-bold font-bebas"
                    style={{ color: sportColor }}
                  >
                    {formatGameDate(nextGame.game_date)}
                  </div>
                ) : (
                  <Link
                    href={`/${sport}/games/${nextGame.id}`}
                    className="hover:opacity-80 transition-opacity"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="text-lg font-bold font-bebas"
                      style={{ color: gameResultColor }}
                    >
                      {gameResultText}
                    </div>
                    <div className="text-xs text-gray-300">
                      {formatGameDate(nextGame.game_date)}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Roster Preview */}
        {roster.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--psp-gray-400)" }}
              >
                Roster Preview
              </h3>
              <Link
                href={`/${sport}/teams/${schoolSlug}/${seasonLabel}`}
                className="text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ color: sportColor }}
              >
                View All Players
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Current season roster">
                <caption className="sr-only">Current season roster</caption>
                <thead>
                  <tr className="text-left" style={{ color: "var(--psp-gray-400)" }}>
                    <th scope="col" className="pb-2 pr-3 font-medium text-xs">#</th>
                    <th scope="col" className="pb-2 pr-3 font-medium text-xs">Name</th>
                    <th scope="col" className="pb-2 pr-3 font-medium text-xs">Pos</th>
                    <th scope="col" className="pb-2 font-medium text-xs">Class</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      style={{
                        background: idx % 2 === 1 ? "rgba(255,255,255,0.03)" : "transparent",
                      }}
                    >
                      <td className="py-1.5 pr-3 text-gray-300 tabular-nums">
                        {entry.jersey_number || "--"}
                      </td>
                      <td className="py-1.5 pr-3">
                        <Link
                          href={`/${sport}/players/${entry.player.slug}`}
                          className="font-medium hover:underline"
                          style={{ color: "var(--psp-blue, #3b82f6)" }}
                        >
                          {entry.player.name}
                        </Link>
                      </td>
                      <td className="py-1.5 pr-3 text-gray-300">
                        {entry.position || "--"}
                      </td>
                      <td className="py-1.5 text-gray-300">
                        {classYearAbbr(entry.class_year) || "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA links */}
        <div className="flex flex-wrap gap-3 mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link
            href={`/${sport}/teams/${schoolSlug}/${seasonLabel}`}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: `${sportColor}20`, color: sportColor }}
          >
            View Full Roster
          </Link>
          <Link
            href={`/${sport}/leaderboards/rushing?school=${schoolSlug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "rgba(240,165,0,0.12)", color: "var(--psp-gold)" }}
          >
            Stat Leaders
          </Link>
        </div>
      </div>
    </div>
  );
}
