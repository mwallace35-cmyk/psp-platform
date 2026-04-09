import Link from "next/link";
import type { GamePlayerStat } from "@/lib/data";

export default function BasketballBoxScore({
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

  /* ---- Full box score table — auto-hides empty columns ---- */
  function TeamBoxScore({
    teamStats,
    label,
    gameScore,
    visibleCols,
  }: {
    teamStats: GamePlayerStat[];
    label: string;
    gameScore?: number | null;
    visibleCols?: Record<string, boolean>;
  }) {
    const displayPts = gameScore ?? teamStats.reduce((sum, s) => sum + (s.points ?? 0), 0);
    const sorted = [...teamStats].sort((a, b) => (getStat(b, "min") ?? 0) - (getStat(a, "min") ?? 0));

    // If visibleCols not passed, compute from this team's data
    const cols = visibleCols ?? (() => {
      const has = (keys: string[]) => teamStats.some((s) => keys.some((k) => getStat(s, k) != null));
      const hasShot = (m: string, a: string) => teamStats.some((s) => getStat(s, m) != null || getStat(s, a) != null);
      return {
        num: teamStats.some((s) => s.jersey_number != null),
        min: has(["min", "minutes", "MinutesPlayed"]),
        fg: hasShot("fgm", "fga") || hasShot("fg_made", "fg_attempted"),
        tpt: hasShot("tpm", "tpa") || hasShot("fg3m", "fg3a") || hasShot("three_made", "three_attempted"),
        ft: hasShot("ftm", "fta") || hasShot("ft_made", "ft_attempted"),
        reb: has(["reb", "rebounds", "total_rebounds"]),
        ast: has(["ast", "assists"]),
        stl: has(["stl", "steals"]),
        blk: has(["blk", "blocks"]),
        to: has(["to", "tov", "turnovers"]),
        pf: has(["pf", "fouls", "personal_fouls"]),
      };
    })();

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
                {cols.num && <th className="text-center px-2 py-2">#</th>}
                {cols.min && <th className="text-center px-2 py-2">MIN</th>}
                {cols.fg && <th className="text-center px-2 py-2">FG</th>}
                {cols.tpt && <th className="text-center px-2 py-2">3PT</th>}
                {cols.ft && <th className="text-center px-2 py-2">FT</th>}
                {cols.reb && <th className="text-center px-2 py-2">REB</th>}
                {cols.ast && <th className="text-center px-2 py-2">AST</th>}
                {cols.stl && <th className="text-center px-2 py-2">STL</th>}
                {cols.blk && <th className="text-center px-2 py-2">BLK</th>}
                {cols.to && <th className="text-center px-2 py-2">TO</th>}
                {cols.pf && <th className="text-center px-2 py-2">PF</th>}
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
                  {cols.num && <td className="text-center px-2 py-2 text-gray-300">{s.jersey_number ?? ""}</td>}
                  {cols.min && <td className="text-center px-2 py-2">{getStat(s, "min") ?? getStat(s, "minutes") ?? getStat(s, "MinutesPlayed") ?? "-"}</td>}
                  {cols.fg && <td className="text-center px-2 py-2">{fmtShot(s, "fgm", "fga") !== "-" ? fmtShot(s, "fgm", "fga") : fmtShot(s, "fg_made", "fg_attempted")}</td>}
                  {cols.tpt && <td className="text-center px-2 py-2">{fmtShot(s, "tpm", "tpa") !== "-" ? fmtShot(s, "tpm", "tpa") : fmtShot(s, "fg3m", "fg3a") !== "-" ? fmtShot(s, "fg3m", "fg3a") : fmtShot(s, "three_made", "three_attempted")}</td>}
                  {cols.ft && <td className="text-center px-2 py-2">{fmtShot(s, "ftm", "fta") !== "-" ? fmtShot(s, "ftm", "fta") : fmtShot(s, "ft_made", "ft_attempted")}</td>}
                  {cols.reb && <td className="text-center px-2 py-2">{getStat(s, "reb") ?? getStat(s, "rebounds") ?? getStat(s, "total_rebounds") ?? "-"}</td>}
                  {cols.ast && <td className="text-center px-2 py-2">{getStat(s, "ast") ?? getStat(s, "assists") ?? "-"}</td>}
                  {cols.stl && <td className="text-center px-2 py-2">{getStat(s, "stl") ?? getStat(s, "steals") ?? "-"}</td>}
                  {cols.blk && <td className="text-center px-2 py-2">{getStat(s, "blk") ?? getStat(s, "blocks") ?? "-"}</td>}
                  {cols.to && <td className="text-center px-2 py-2">{getStat(s, "to") ?? getStat(s, "tov") ?? getStat(s, "turnovers") ?? "-"}</td>}
                  {cols.pf && <td className="text-center px-2 py-2">{getStat(s, "pf") ?? getStat(s, "fouls") ?? getStat(s, "personal_fouls") ?? "-"}</td>}
                  <td className="text-center px-2 py-2 font-semibold text-[var(--psp-gold)]">{s.points ?? 0}</td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="border-t-2 border-gray-600 font-semibold text-white">
                <td className="px-2 py-2 sticky left-0 bg-[var(--psp-navy)] z-10 uppercase text-gray-300">Totals</td>
                {cols.num && <td className="text-center px-2 py-2"></td>}
                {cols.min && <td className="text-center px-2 py-2"></td>}
                {cols.fg && <td className="text-center px-2 py-2">{sumShot(teamStats, "fgm", "fga")}</td>}
                {cols.tpt && <td className="text-center px-2 py-2">{sumShot(teamStats, "fg3m", "fg3a")}</td>}
                {cols.ft && <td className="text-center px-2 py-2">{sumShot(teamStats, "ftm", "fta")}</td>}
                {cols.reb && <td className="text-center px-2 py-2">{sumStat(teamStats, "reb") + sumStat(teamStats, "rebounds")}</td>}
                {cols.ast && <td className="text-center px-2 py-2">{sumStat(teamStats, "ast") + sumStat(teamStats, "assists")}</td>}
                {cols.stl && <td className="text-center px-2 py-2">{sumStat(teamStats, "stl") + sumStat(teamStats, "steals")}</td>}
                {cols.blk && <td className="text-center px-2 py-2">{sumStat(teamStats, "blk") + sumStat(teamStats, "blocks")}</td>}
                {cols.to && <td className="text-center px-2 py-2">{sumStat(teamStats, "tov") + sumStat(teamStats, "turnovers")}</td>}
                {cols.pf && <td className="text-center px-2 py-2">{sumStat(teamStats, "pf") + sumStat(teamStats, "fouls")}</td>}
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

  // Compute shared column visibility across both teams so columns stay consistent
  const allBoxStats = [...(awayReal ? awayStats : []), ...(homeReal ? homeStats : [])];
  const has = (keys: string[]) => allBoxStats.some((s) => keys.some((k) => getStat(s, k) != null));
  const hasShot = (m: string, a: string) => allBoxStats.some((s) => getStat(s, m) != null || getStat(s, a) != null);
  const sharedCols = {
    num: allBoxStats.some((s) => s.jersey_number != null),
    min: has(["min", "minutes", "MinutesPlayed"]),
    fg: hasShot("fgm", "fga") || hasShot("fg_made", "fg_attempted"),
    tpt: hasShot("tpm", "tpa") || hasShot("fg3m", "fg3a") || hasShot("three_made", "three_attempted"),
    ft: hasShot("ftm", "fta") || hasShot("ft_made", "ft_attempted"),
    reb: has(["reb", "rebounds", "total_rebounds"]),
    ast: has(["ast", "assists"]),
    stl: has(["stl", "steals"]),
    blk: has(["blk", "blocks"]),
    to: has(["to", "tov", "turnovers"]),
    pf: has(["pf", "fouls", "personal_fouls"]),
  };

  return (
    <div className={awayReal || homeReal ? "space-y-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
      <AwayComp
        teamStats={awayStats}
        label={stats.find((s) => s.school_id === awaySchoolId)?.schools?.name ?? "Away"}
        gameScore={awayScore}
        {...(awayReal ? { visibleCols: sharedCols } : {})}
      />
      <HomeComp
        teamStats={homeStats}
        label={stats.find((s) => s.school_id === homeSchoolId)?.schools?.name ?? "Home"}
        gameScore={homeScore}
        {...(homeReal ? { visibleCols: sharedCols } : {})}
      />
    </div>
  );
}
