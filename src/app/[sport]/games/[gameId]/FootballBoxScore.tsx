import Link from "next/link";
import type { GamePlayerStat } from "@/lib/data";

export default function FootballBoxScore({
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
  const hasINT = allPassers.some((s) => getJson(s, "pass_int") != null || getJson(s, "pass_interceptions") != null);
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
          const int = getJson(s, "pass_int") ?? getJson(s, "pass_interceptions");
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

      {/* DEFENSIVE INTERCEPTIONS */}
      {(() => {
        const allDefInt = stats.filter((s) => {
          const sj = s.stats_json as Record<string, unknown> | null;
          return sj && (Number(sj.def_interceptions) > 0 || Number(sj.interceptions) > 0);
        });
        if (allDefInt.length === 0) return null;
        const getDefInt = (playerStats: GamePlayerStat[]) =>
          playerStats.filter((s) => {
            const sj = s.stats_json as Record<string, unknown> | null;
            return sj && (Number(sj.def_interceptions) > 0 || Number(sj.interceptions) > 0);
          }).sort((a, b) => {
              const aInt = Number((a.stats_json as Record<string, unknown>)?.def_interceptions ?? (a.stats_json as Record<string, unknown>)?.interceptions ?? 0);
              const bInt = Number((b.stats_json as Record<string, unknown>)?.def_interceptions ?? (b.stats_json as Record<string, unknown>)?.interceptions ?? 0);
              return bInt - aInt;
            });
        return (
          <StatSection
            title="Interceptions"
            getPlayers={getDefInt}
            headers={
              <>
                <th className="text-left px-4 py-2 w-[60%]">Player</th>
                <th className="text-right px-3 py-2">INT</th>
              </>
            }
            renderRow={(s) => {
              const sj = s.stats_json as Record<string, unknown> | null;
              const ints = Number(sj?.def_interceptions ?? sj?.interceptions ?? 0);
              return (
                <>
                  <td className="px-4 py-2"><PlayerName s={s} /></td>
                  <td className="text-right px-3 py-2 font-semibold text-[var(--psp-gold)]">{ints}</td>
                </>
              );
            }}
          />
        );
      })()}

      {/* Note when only one team has data */}
      {onlyOneTeam && (
        <p className="text-gray-500 text-xs italic text-center mt-2">
          Opponent individual stats not available
        </p>
      )}
    </div>
  );
}
