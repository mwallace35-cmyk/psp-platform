import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import {
  SPORT_META,
  getGameById,
  getGameBoxScore,
  getTeamSeasonStats,
  type GamePlayerStat,
  type TeamSeasonStats,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import GameFilmSection from "@/components/highlights/GameFilmSection";
import HeadToHeadBadge from "@/components/game/HeadToHeadBadge";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";
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

function FootballBoxScore({
  stats,
  homeSchoolId,
  awaySchoolId,
  homeName,
  awayName,
  sport,
}: {
  stats: GamePlayerStat[];
  homeSchoolId: number | null;
  awaySchoolId: number | null;
  homeName: string;
  awayName: string;
  sport: string;
}) {
  const homeStats = stats.filter((s) => s.school_id === homeSchoolId);
  const awayStats = stats.filter((s) => s.school_id === awaySchoolId);

  // Determine which teams have data
  const teams: { stats: GamePlayerStat[]; label: string; schoolId: number | null }[] = [];
  // Home team first (or whichever has data)
  if (homeStats.length > 0) teams.push({ stats: homeStats, label: homeName, schoolId: homeSchoolId });
  if (awayStats.length > 0) teams.push({ stats: awayStats, label: awayName, schoolId: awaySchoolId });
  // If neither matched (single school data), use all stats
  if (teams.length === 0 && stats.length > 0) {
    teams.push({ stats, label: stats[0]?.schools?.name ?? "Team", schoolId: stats[0]?.school_id ?? null });
  }

  const onlyOneTeam = teams.length === 1;

  // Helper: get value from stats_json
  function getJson(s: GamePlayerStat, key: string): number | null {
    const json = s.stats_json as Record<string, unknown> | null;
    const val = json?.[key];
    return typeof val === "number" ? val : null;
  }

  // Get TDs from stats_json (game-level) or season-avg fallback
  function getTD(s: GamePlayerStat, type: "rush" | "pass" | "rec"): number | null {
    const json = s.stats_json as Record<string, unknown> | null;
    // Game-level TDs from stats_json
    if (type === "rush") {
      const td = json?.rush_tds as number | null ?? json?.rushing_tds as number | null;
      if (td != null) return td;
    }
    if (type === "pass") {
      const td = json?.pass_tds as number | null ?? json?.passing_tds as number | null;
      if (td != null) return td;
    }
    if (type === "rec") {
      const td = json?.rec_tds as number | null ?? json?.receiving_tds as number | null;
      if (td != null) return td;
    }
    // Season average fallback
    const seasonKey = type === "rush" ? "season_rush_td" : type === "pass" ? "season_pass_td" : "season_rec_td";
    const seasonTd = json?.[seasonKey] as number | null;
    const gp = json?.games_played as number | null;
    if (seasonTd != null && gp && gp > 0) return Math.round((seasonTd / gp) * 10) / 10;
    return null;
  }

  // Filter helpers
  function getRushers(teamStats: GamePlayerStat[]) {
    return teamStats.filter((s) => s.rush_carries != null && (s.rush_carries > 0 || (s.rush_yards ?? 0) !== 0));
  }
  function getPassers(teamStats: GamePlayerStat[]) {
    return teamStats.filter((s) => s.pass_completions != null || (s.pass_yards != null && s.pass_yards !== 0));
  }
  function getReceivers(teamStats: GamePlayerStat[]) {
    return teamStats.filter((s) => s.rec_catches != null && (s.rec_catches > 0 || (s.rec_yards ?? 0) !== 0));
  }
  function getScorers(teamStats: GamePlayerStat[]) {
    return teamStats.filter((s) => s.points != null && s.points > 0);
  }

  // Team stats summary
  function computeTeamTotals(teamStats: GamePlayerStat[]) {
    const rushYds = teamStats.reduce((t, s) => t + (s.rush_yards ?? 0), 0);
    const passYds = teamStats.reduce((t, s) => t + (s.pass_yards ?? 0), 0);
    return { rushYds, passYds, totalYds: rushYds + passYds };
  }

  // Player link helper
  function PlayerName({ s }: { s: GamePlayerStat }) {
    return s.players?.slug ? (
      <Link href={`/${sport}/players/${s.players.slug}`} className="text-[var(--psp-blue)] hover:underline">
        {s.player_name}
      </Link>
    ) : (
      <span className="text-gray-200">{s.player_name}</span>
    );
  }

  // ---- Team Stats Comparison ----
  const teamTotals = teams.map((t) => ({ label: t.label, ...computeTeamTotals(t.stats) }));

  // ---- Stat Section: renders one table for all teams in a stat group ----
  function StatSection({
    title,
    getPlayers,
    headers,
    renderRow,
  }: {
    title: string;
    getPlayers: (stats: GamePlayerStat[]) => GamePlayerStat[];
    headers: React.ReactNode;
    renderRow: (s: GamePlayerStat) => React.ReactNode;
  }) {
    const hasAny = teams.some((t) => getPlayers(t.stats).length > 0);
    if (!hasAny) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-bold text-[var(--psp-gold)] px-4 py-2 bg-[var(--psp-navy)] rounded-t-lg font-heading uppercase tracking-wider border-b border-[var(--psp-gold)]/30">
          {title}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label={`${title} statistics`}>
            {teams.map((team, idx) => {
              const players = getPlayers(team.stats);
              if (players.length === 0 && !onlyOneTeam) return null;
              return (
                <tbody key={team.schoolId ?? idx}>
                  {/* Team sub-header */}
                  <tr className="bg-[var(--psp-navy)]">
                    <th colSpan={99} className="text-left px-4 py-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-gray-700">
                      {team.label}
                    </th>
                  </tr>
                  {/* Column headers */}
                  <tr className="bg-[var(--psp-navy-mid)] text-gray-400 text-xs uppercase">
                    {headers}
                  </tr>
                  {/* Player rows */}
                  {players.length > 0 ? (
                    players.map((s) => (
                      <tr key={s.id} className="border-b border-gray-800/50 hover:bg-[var(--psp-navy-mid)]/60 text-gray-200">
                        {renderRow(s)}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={99} className="px-4 py-3 text-gray-500 text-xs italic">
                        No {title.toLowerCase()} stats available
                      </td>
                    </tr>
                  )}
                  {/* Spacer between teams */}
                  {idx < teams.length - 1 && (
                    <tr><td colSpan={99} className="h-1"></td></tr>
                  )}
                </tbody>
              );
            })}
          </table>
        </div>
      </div>
    );
  }

  // Check if any team has TD data per group
  const allRushers = teams.flatMap((t) => getRushers(t.stats));
  const allPassers = teams.flatMap((t) => getPassers(t.stats));
  const allReceivers = teams.flatMap((t) => getReceivers(t.stats));
  const allScorers = teams.flatMap((t) => getScorers(t.stats));
  const hasRushTd = allRushers.some((s) => getTD(s, "rush") != null);
  const hasPassTd = allPassers.some((s) => getTD(s, "pass") != null);
  const hasPassAttempts = allPassers.some((s) => getJson(s, "pass_attempts") != null);
  const hasINT = allPassers.some((s) => getJson(s, "interceptions") != null);
  const hasRecTd = allReceivers.some((s) => getTD(s, "rec") != null);

  return (
    <div className="space-y-6">
      {/* Team Stats Comparison */}
      {teamTotals.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-2">
          {[
            { label: "Total Yards", key: "totalYds" as const },
            { label: "Rush Yards", key: "rushYds" as const },
            { label: "Pass Yards", key: "passYds" as const },
          ].map(({ label, key }) => (
            <div key={key} className="bg-[var(--psp-navy-mid)] rounded-lg p-3 text-center border border-gray-700/50">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</div>
              <div className="flex items-center justify-center gap-3">
                {teamTotals.map((t, i) => (
                  <span key={i} className={`text-lg font-bold font-heading ${i === 0 ? "text-white" : "text-gray-400"}`}>
                    {t[key]}
                    {i < teamTotals.length - 1 && <span className="text-gray-600 ml-3">-</span>}
                  </span>
                ))}
              </div>
              {teamTotals.length > 1 && (
                <div className="flex justify-between text-[10px] text-gray-500 mt-1 px-2">
                  <span>{teamTotals[0].label.split(" ")[0]}</span>
                  <span>{teamTotals[1].label.split(" ")[0]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RUSHING */}
      <StatSection
        title="Rushing"
        getPlayers={getRushers}
        headers={
          <>
            <th className="text-left px-4 py-2 w-[40%]">Player</th>
            <th className="text-right px-3 py-2">CAR</th>
            <th className="text-right px-3 py-2">YDS</th>
            <th className="text-right px-3 py-2">AVG</th>
            {hasRushTd && <th className="text-right px-3 py-2">TD</th>}
          </>
        }
        renderRow={(s) => {
          const avg = s.rush_carries && s.rush_carries > 0 ? ((s.rush_yards ?? 0) / s.rush_carries).toFixed(1) : "0.0";
          const td = getTD(s, "rush");
          return (
            <>
              <td className="px-4 py-2"><PlayerName s={s} /></td>
              <td className="text-right px-3 py-2 text-gray-300">{s.rush_carries ?? 0}</td>
              <td className="text-right px-3 py-2 font-semibold text-white">{s.rush_yards ?? 0}</td>
              <td className="text-right px-3 py-2 text-gray-400">{avg}</td>
              {hasRushTd && (
                <td className="text-right px-3 py-2" style={{ color: (td ?? 0) > 0 ? "var(--psp-gold)" : "inherit" }}>
                  {td ?? "-"}
                </td>
              )}
            </>
          );
        }}
      />

      {/* PASSING */}
      <StatSection
        title="Passing"
        getPlayers={getPassers}
        headers={
          <>
            <th className="text-left px-4 py-2 w-[40%]">Player</th>
            <th className="text-right px-3 py-2">{hasPassAttempts ? "C/ATT" : "COMP"}</th>
            <th className="text-right px-3 py-2">YDS</th>
            {hasPassTd && <th className="text-right px-3 py-2">TD</th>}
            {hasINT && <th className="text-right px-3 py-2">INT</th>}
          </>
        }
        renderRow={(s) => {
          const att = getJson(s, "pass_attempts");
          const td = getTD(s, "pass");
          const int = getJson(s, "interceptions");
          return (
            <>
              <td className="px-4 py-2"><PlayerName s={s} /></td>
              <td className="text-right px-3 py-2 text-gray-300">
                {hasPassAttempts && att != null ? `${s.pass_completions ?? 0}/${att}` : (s.pass_completions ?? 0)}
              </td>
              <td className="text-right px-3 py-2 font-semibold text-white">{s.pass_yards ?? 0}</td>
              {hasPassTd && (
                <td className="text-right px-3 py-2" style={{ color: (td ?? 0) > 0 ? "var(--psp-gold)" : "inherit" }}>
                  {td ?? "-"}
                </td>
              )}
              {hasINT && (
                <td className="text-right px-3 py-2 text-gray-400">{int ?? "-"}</td>
              )}
            </>
          );
        }}
      />

      {/* RECEIVING */}
      <StatSection
        title="Receiving"
        getPlayers={getReceivers}
        headers={
          <>
            <th className="text-left px-4 py-2 w-[40%]">Player</th>
            <th className="text-right px-3 py-2">REC</th>
            <th className="text-right px-3 py-2">YDS</th>
            <th className="text-right px-3 py-2">AVG</th>
            {hasRecTd && <th className="text-right px-3 py-2">TD</th>}
          </>
        }
        renderRow={(s) => {
          const avg = s.rec_catches && s.rec_catches > 0 ? ((s.rec_yards ?? 0) / s.rec_catches).toFixed(1) : "0.0";
          const td = getTD(s, "rec");
          return (
            <>
              <td className="px-4 py-2"><PlayerName s={s} /></td>
              <td className="text-right px-3 py-2 text-gray-300">{s.rec_catches ?? 0}</td>
              <td className="text-right px-3 py-2 font-semibold text-white">{s.rec_yards ?? 0}</td>
              <td className="text-right px-3 py-2 text-gray-400">{avg}</td>
              {hasRecTd && (
                <td className="text-right px-3 py-2" style={{ color: (td ?? 0) > 0 ? "var(--psp-gold)" : "inherit" }}>
                  {td ?? "-"}
                </td>
              )}
            </>
          );
        }}
      />

      {/* SCORING */}
      {allScorers.length > 0 && (
        <StatSection
          title="Scoring"
          getPlayers={getScorers}
          headers={
            <>
              <th className="text-left px-4 py-2 w-[60%]">Player</th>
              <th className="text-right px-3 py-2">PTS</th>
            </>
          }
          renderRow={(s) => (
            <>
              <td className="px-4 py-2"><PlayerName s={s} /></td>
              <td className="text-right px-3 py-2 font-semibold text-[var(--psp-gold)]">{s.points ?? 0}</td>
            </>
          )}
        />
      )}

      {/* Note when only one team has data */}
      {onlyOneTeam && (
        <p className="text-gray-500 text-xs italic text-center mt-2">
          Opponent individual stats not available
        </p>
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
  sport,
}: {
  stats: GamePlayerStat[];
  homeSchoolId: number | null;
  awaySchoolId: number | null;
  homeScore: number | null;
  awayScore: number | null;
  sport: string;
}) {
  const homeStats = stats.filter((s) => s.school_id === homeSchoolId);
  const awayStats = stats.filter((s) => s.school_id === awaySchoolId);

  const getStat = (s: GamePlayerStat, key: string): number | null => {
    const json = s.stats_json as Record<string, unknown> | null;
    const val = json?.[key];
    return typeof val === "number" ? val : null;
  };

  const fmtShot = (s: GamePlayerStat, madeKey: string, attKey: string): string => {
    const made = getStat(s, madeKey);
    const att = getStat(s, attKey);
    if (made == null && att == null) return "-";
    return `${made ?? 0}-${att ?? 0}`;
  };

  const sumStat = (rows: GamePlayerStat[], key: string): number =>
    rows.reduce((t, s) => t + (getStat(s, key) ?? 0), 0);

  const sumShot = (rows: GamePlayerStat[], madeKey: string, attKey: string): string =>
    `${sumStat(rows, madeKey)}-${sumStat(rows, attKey)}`;

  /** True when at least one row in the array has real box score data */
  const hasRealBoxScore = (rows: GamePlayerStat[]): boolean =>
    rows.some((s) => s.source_type != null && s.source_type !== "season_average");

  /* ---- Estimated / season-average table (3 columns) ---- */
  function TeamScoring({
    teamStats,
    label,
    gameScore,
  }: {
    teamStats: GamePlayerStat[];
    label: string;
    gameScore?: number | null;
  }) {
    const displayPts = gameScore ?? teamStats.reduce((sum, s) => sum + (s.points ?? 0), 0);

    return (
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[var(--psp-gold)] mb-3 font-heading uppercase">
          {label} {displayPts > 0 && <span className="text-white">({displayPts} pts)</span>}
        </h3>
        <p className="text-xs text-gray-400 mb-2 italic">Player Stats (Season Averages)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-200" aria-label={`${label} scoring statistics`}>
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="text-left px-3 py-2">Player</th>
                <th className="text-center px-3 py-2">#</th>
                <th className="text-right px-3 py-2">Pts</th>
              </tr>
            </thead>
            <tbody>
              {teamStats
                .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
                .map((s) => (
                  <tr key={s.id} className="border-b border-gray-800 hover:bg-[var(--psp-navy-mid)] transition-colors duration-200">
                    <td className="px-3 py-2">
                      {s.players?.slug ? (
                        <Link
                          href={`/${sport}/players/${s.players.slug}`}
                          className="text-[var(--psp-blue)] hover:underline"
                        >
                          {s.player_name}
                        </Link>
                      ) : (
                        <span className="text-gray-200">{s.player_name}</span>
                      )}
                    </td>
                    <td className="text-center px-3 py-2 text-gray-300">
                      {s.jersey_number ?? ""}
                    </td>
                    <td className="text-right px-3 py-2 font-semibold text-[var(--psp-gold)]">
                      {s.points ?? 0}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {teamStats.length === 0 && (
          <p className="text-gray-400 text-sm italic">No individual stats available</p>
        )}
      </div>
    );
  }

  /* ---- Full box score table (13 columns) ---- */
  function TeamBoxScore({
    teamStats,
    label,
    gameScore,
  }: {
    teamStats: GamePlayerStat[];
    label: string;
    gameScore?: number | null;
  }) {
    const displayPts = gameScore ?? teamStats.reduce((sum, s) => sum + (s.points ?? 0), 0);
    const sorted = [...teamStats].sort((a, b) => (getStat(b, "min") ?? 0) - (getStat(a, "min") ?? 0));

    return (
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[var(--psp-gold)] mb-3 font-heading uppercase">
          {label} {displayPts > 0 && <span className="text-white">({displayPts} pts)</span>}
        </h3>
        <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Game Box Score</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-gray-200 whitespace-nowrap" aria-label={`${label} box score`}>
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="text-left px-2 py-2 sticky left-0 bg-[var(--psp-navy)] z-10">Player</th>
                <th className="text-center px-2 py-2">#</th>
                <th className="text-center px-2 py-2">MIN</th>
                <th className="text-center px-2 py-2">FG</th>
                <th className="text-center px-2 py-2">3PT</th>
                <th className="text-center px-2 py-2">FT</th>
                <th className="text-center px-2 py-2">REB</th>
                <th className="text-center px-2 py-2">AST</th>
                <th className="text-center px-2 py-2">STL</th>
                <th className="text-center px-2 py-2">BLK</th>
                <th className="text-center px-2 py-2">TO</th>
                <th className="text-center px-2 py-2">PF</th>
                <th className="text-center px-2 py-2 text-[var(--psp-gold)] font-semibold">PTS</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.id} className="border-b border-gray-800 hover:bg-[var(--psp-navy-mid)] transition-colors duration-200">
                  <td className="px-2 py-2 sticky left-0 bg-[var(--psp-navy)] z-10">
                    {s.players?.slug ? (
                      <Link
                        href={`/${sport}/players/${s.players.slug}`}
                        className="text-[var(--psp-blue)] hover:underline"
                      >
                        {s.player_name}
                      </Link>
                    ) : (
                      <span className="text-gray-200">{s.player_name}</span>
                    )}
                  </td>
                  <td className="text-center px-2 py-2 text-gray-300">{s.jersey_number ?? ""}</td>
                  <td className="text-center px-2 py-2">{getStat(s, "min") ?? getStat(s, "minutes") ?? getStat(s, "MinutesPlayed") ?? "-"}</td>
                  <td className="text-center px-2 py-2">{fmtShot(s, "fgm", "fga") !== "-" ? fmtShot(s, "fgm", "fga") : fmtShot(s, "fg_made", "fg_attempted")}</td>
                  <td className="text-center px-2 py-2">{fmtShot(s, "tpm", "tpa") !== "-" ? fmtShot(s, "tpm", "tpa") : fmtShot(s, "fg3m", "fg3a") !== "-" ? fmtShot(s, "fg3m", "fg3a") : fmtShot(s, "three_made", "three_attempted")}</td>
                  <td className="text-center px-2 py-2">{fmtShot(s, "ftm", "fta") !== "-" ? fmtShot(s, "ftm", "fta") : fmtShot(s, "ft_made", "ft_attempted")}</td>
                  <td className="text-center px-2 py-2">{getStat(s, "reb") ?? getStat(s, "rebounds") ?? getStat(s, "total_rebounds") ?? "-"}</td>
                  <td className="text-center px-2 py-2">{getStat(s, "ast") ?? getStat(s, "assists") ?? "-"}</td>
                  <td className="text-center px-2 py-2">{getStat(s, "stl") ?? getStat(s, "steals") ?? "-"}</td>
                  <td className="text-center px-2 py-2">{getStat(s, "blk") ?? getStat(s, "blocks") ?? "-"}</td>
                  <td className="text-center px-2 py-2">{getStat(s, "to") ?? getStat(s, "tov") ?? getStat(s, "turnovers") ?? "-"}</td>
                  <td className="text-center px-2 py-2">{getStat(s, "pf") ?? getStat(s, "fouls") ?? getStat(s, "personal_fouls") ?? "-"}</td>
                  <td className="text-center px-2 py-2 font-semibold text-[var(--psp-gold)]">{s.points ?? 0}</td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="border-t-2 border-gray-600 font-semibold text-white">
                <td className="px-2 py-2 sticky left-0 bg-[var(--psp-navy)] z-10 uppercase text-gray-300">Totals</td>
                <td className="text-center px-2 py-2"></td>
                <td className="text-center px-2 py-2"></td>
                <td className="text-center px-2 py-2">{sumShot(teamStats, "fgm", "fga")}</td>
                <td className="text-center px-2 py-2">{sumShot(teamStats, "fg3m", "fg3a")}</td>
                <td className="text-center px-2 py-2">{sumShot(teamStats, "ftm", "fta")}</td>
                <td className="text-center px-2 py-2">{sumStat(teamStats, "reb") + sumStat(teamStats, "rebounds")}</td>
                <td className="text-center px-2 py-2">{sumStat(teamStats, "ast") + sumStat(teamStats, "assists")}</td>
                <td className="text-center px-2 py-2">{sumStat(teamStats, "stl") + sumStat(teamStats, "steals")}</td>
                <td className="text-center px-2 py-2">{sumStat(teamStats, "blk") + sumStat(teamStats, "blocks")}</td>
                <td className="text-center px-2 py-2">{sumStat(teamStats, "tov") + sumStat(teamStats, "turnovers")}</td>
                <td className="text-center px-2 py-2">{sumStat(teamStats, "pf") + sumStat(teamStats, "fouls")}</td>
                <td className="text-center px-2 py-2 text-[var(--psp-gold)]">{teamStats.reduce((t, s) => t + (s.points ?? 0), 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {teamStats.length === 0 && (
          <p className="text-gray-400 text-sm italic">No individual stats available</p>
        )}
      </div>
    );
  }

  // If all stats are from one school (team_page source), show just that school
  const schoolIds = [...new Set(stats.map((s) => s.school_id))];

  if (schoolIds.length === 1) {
    const schoolName = stats[0]?.schools?.name ?? "Team";
    const singleScore = stats[0]?.school_id === homeSchoolId ? homeScore : awayScore;
    const useFullBox = hasRealBoxScore(stats);
    return useFullBox
      ? <TeamBoxScore teamStats={stats} label={schoolName} gameScore={singleScore} />
      : <TeamScoring teamStats={stats} label={schoolName} gameScore={singleScore} />;
  }

  const awayReal = hasRealBoxScore(awayStats);
  const homeReal = hasRealBoxScore(homeStats);
  const AwayComp = awayReal ? TeamBoxScore : TeamScoring;
  const HomeComp = homeReal ? TeamBoxScore : TeamScoring;

  return (
    <div className={awayReal || homeReal ? "space-y-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
      <AwayComp
        teamStats={awayStats}
        label={stats.find((s) => s.school_id === awaySchoolId)?.schools?.name ?? "Away"}
        gameScore={awayScore}
      />
      <HomeComp
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
  const sport = await validateSportParam(params);
  const { gameId: gameIdStr } = await params;

  const gameId = Number(gameIdStr);
  if (isNaN(gameId)) notFound();

  const [game, boxScore] = await Promise.all([
    getGameById(gameId),
    getGameBoxScore(gameId),
  ]);

  if (!game || game.sport_id !== sport) notFound();

  // Fetch team season stats as fallback when no box score exists
  const teamSeasonData = boxScore.length === 0
    ? await getTeamSeasonStats(sport, game.season_id, game.home_school_id, game.away_school_id)
    : null;

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
            {Object.entries(game.period_scores as Record<string, any>).map(([period, scores]) => {
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
              ) : sport === "basketball" ? (
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
                          {sport === "basketball" && (
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
                            {sport === "basketball" && (
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

      {/* Game Film Section */}
      <GameFilmSection gameId={gameId} sportSlug={sport} />
    </main>
  );
}
