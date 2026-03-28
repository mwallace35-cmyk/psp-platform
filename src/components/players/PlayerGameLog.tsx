"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { PlayerGameLog as PlayerGameLogEntry } from "@/lib/data/games";

interface PlayerGameLogProps {
  gameLog: PlayerGameLogEntry[];
  playerSchoolId: number | null;
}

interface SeasonGroup {
  label: string;
  games: PlayerGameLogEntry[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "--";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getResult(
  entry: PlayerGameLogEntry,
  playerSchoolId: number | null
): { text: string; isWin: boolean | null } {
  const game = entry.games;
  if (!game || game.home_score == null || game.away_score == null) {
    return { text: "--", isWin: null };
  }

  const schoolId = entry.school_id ?? playerSchoolId;
  const isHome = game.home_school_id === schoolId;
  const teamScore = isHome ? game.home_score : game.away_score;
  const oppScore = isHome ? game.away_score : game.home_score;

  if (teamScore > oppScore) return { text: `W ${teamScore}-${oppScore}`, isWin: true };
  if (teamScore < oppScore) return { text: `L ${teamScore}-${oppScore}`, isWin: false };
  return { text: `T ${teamScore}-${oppScore}`, isWin: null };
}

function getOpponent(
  entry: PlayerGameLogEntry,
  playerSchoolId: number | null
): { name: string; slug: string | null } {
  const game = entry.games;
  if (!game) return { name: "--", slug: null };

  const schoolId = entry.school_id ?? playerSchoolId;
  const isHome = game.home_school_id === schoolId;

  if (isHome) {
    return {
      name: game.away_school?.name ?? "Unknown",
      slug: game.away_school?.slug ?? null,
    };
  }
  return {
    name: `@ ${game.home_school?.name ?? "Unknown"}`,
    slug: game.home_school?.slug ?? null,
  };
}

function getStatsJson(entry: PlayerGameLogEntry): Record<string, number> {
  if (!entry.stats_json || typeof entry.stats_json !== "object") return {};
  const result: Record<string, number> = {};
  for (const [k, v] of Object.entries(entry.stats_json)) {
    if (typeof v === "number") result[k] = v;
  }
  return result;
}

function stat(val: number | null | undefined): string {
  if (val == null || val === 0) return "--";
  return String(val);
}

function groupBySeasons(gameLog: PlayerGameLogEntry[]): SeasonGroup[] {
  const map = new Map<string, PlayerGameLogEntry[]>();
  for (const entry of gameLog) {
    const label = entry.games?.seasons?.label ?? "Unknown Season";
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(entry);
  }
  return Array.from(map.entries()).map(([label, games]) => ({ label, games }));
}

// ─── Detect which stat columns a player actually has ─────────────
function detectFootballColumns(games: PlayerGameLogEntry[]) {
  let hasRush = false, hasPass = false, hasPassYds = false, hasRec = false;
  let hasPts = false, hasInt = false, hasPassTd = false, hasRushTd = false;
  for (const g of games) {
    const sj = getStatsJson(g);
    if (g.rush_carries != null && g.rush_carries > 0) hasRush = true;
    if (g.rush_yards != null && g.rush_yards !== 0) hasRush = true;
    if (g.pass_completions != null || sj.pass_attempts != null) hasPass = true;
    if ((g.pass_yards != null && g.pass_yards > 0) || (sj.pass_yards != null && sj.pass_yards > 0)) hasPassYds = true;
    if (g.rec_catches != null && g.rec_catches > 0) hasRec = true;
    if (g.rec_yards != null && g.rec_yards > 0) hasRec = true;
    if (g.points != null && g.points > 0) hasPts = true;
    if ((sj.def_interceptions != null && sj.def_interceptions > 0) || (sj.interceptions != null && sj.interceptions > 0)) hasInt = true;
    if (sj.pass_tds != null || sj.pass_td != null) hasPassTd = true;
    if (sj.rush_td != null || sj.rush_tds != null) hasRushTd = true;
  }
  return { hasRush, hasPass, hasPassYds, hasRec, hasPts, hasInt, hasPassTd, hasRushTd };
}

// ─── Football Table ───────────────────────────────────────────────
const FootballTable = React.memo(function FootballTable({
  games,
  playerSchoolId,
}: {
  games: PlayerGameLogEntry[];
  playerSchoolId: number | null;
}) {
  const cols = detectFootballColumns(games);

  return (
    <div className="overflow-x-auto">
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
        <thead>
          <tr
            style={{
              background: "var(--psp-navy, #0a1628)",
              color: "var(--psp-gold, #f0a500)",
            }}
          >
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Opponent</th>
            <th style={thStyle}>Result</th>
            {cols.hasPass && <th style={thStyleCenter}>C/ATT</th>}
            {cols.hasPassYds && <th style={thStyleCenter}>Pass Yds</th>}
            {cols.hasPassTd && <th style={thStyleCenter}>Pass TD</th>}
            {cols.hasInt && <th style={thStyleCenter}>INT</th>}
            {cols.hasRush && <th style={thStyleCenter}>Car</th>}
            {cols.hasRush && <th style={thStyleCenter}>Rush Yds</th>}
            {cols.hasRushTd && <th style={thStyleCenter}>Rush TD</th>}
            {cols.hasRec && <th style={thStyleCenter}>Rec</th>}
            {cols.hasRec && <th style={thStyleCenter}>Rec Yds</th>}
            {cols.hasPts && <th style={thStyleCenter}>Pts</th>}
          </tr>
        </thead>
        <tbody>
          {games.map((entry) => {
            const result = getResult(entry, playerSchoolId);
            const opp = getOpponent(entry, playerSchoolId);
            const sportId = entry.sport_id || "football";
            const gameLink = `/${sportId}/games/${entry.game_id}`;
            const sj = getStatsJson(entry);

            // Build comp/att string
            const comp = entry.pass_completions;
            const att = sj.pass_attempts ?? sj.pass_att;
            const compAtt = comp != null ? (att != null ? `${comp}/${att}` : String(comp)) : "--";

            return (
              <tr key={entry.id} style={rowStyle}>
                <td style={tdStyle}>{formatDate(entry.games?.game_date ?? null)}</td>
                <td style={tdStyle}>
                  <Link href={gameLink} style={linkStyle}>
                    {opp.name}
                  </Link>
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      color:
                        result.isWin === true
                          ? "var(--psp-success, #22c55e)"
                          : result.isWin === false
                          ? "var(--psp-danger, #ef4444)"
                          : "var(--psp-gray-400, #94a3b8)",
                      fontWeight: 600,
                    }}
                  >
                    {result.text}
                  </span>
                </td>
                {cols.hasPass && <td style={tdStyleCenter}>{compAtt}</td>}
                {cols.hasPassYds && <td style={tdStyleCenter}>{stat(entry.pass_yards ?? sj.pass_yards)}</td>}
                {cols.hasPassTd && <td style={tdStyleCenter}>{stat(sj.pass_tds ?? sj.pass_td)}</td>}
                {cols.hasInt && <td style={tdStyleCenter}>{stat(sj.def_interceptions ?? sj.interceptions)}</td>}
                {cols.hasRush && <td style={tdStyleCenter}>{stat(entry.rush_carries)}</td>}
                {cols.hasRush && <td style={tdStyleCenter}>{stat(entry.rush_yards)}</td>}
                {cols.hasRushTd && <td style={tdStyleCenter}>{stat(sj.rush_td ?? sj.rush_tds)}</td>}
                {cols.hasRec && <td style={tdStyleCenter}>{stat(entry.rec_catches)}</td>}
                {cols.hasRec && <td style={tdStyleCenter}>{stat(entry.rec_yards)}</td>}
                {cols.hasPts && <td style={tdStyleCenter}>{stat(entry.points)}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

// ─── Normalize basketball stats across different source formats ───
function normalizeBballStats(sj: Record<string, number>, entry: PlayerGameLogEntry) {
  return {
    min: sj.minutes ?? sj.min ?? sj.MinutesPlayed,
    pts: sj.points ?? entry.points,
    fgm: sj.fgm ?? sj.fg_made ?? sj.FieldGoalsMade,
    fga: sj.fga ?? sj.fg_attempted ?? sj.FieldGoalAttempts,
    tpm: sj.tpm ?? sj.three_made ?? sj.ThreePointsMade,
    tpa: sj.tpa ?? sj.three_attempted ?? sj.ThreePointAttempts,
    ftm: sj.ftm ?? sj.ft_made ?? sj.FreeThrowsMade,
    fta: sj.fta ?? sj.ft_attempted ?? sj.FreeThrowAttempts,
    reb: sj.reb ?? sj.rebounds ?? sj.total_rebounds ?? sj.Rebounds,
    oreb: sj.oreb ?? sj.off_reb ?? sj.off_rebounds ?? sj.OffensiveRebounds,
    dreb: sj.dreb ?? sj.def_reb ?? sj.def_rebounds ?? sj.DefensiveRebounds,
    ast: sj.ast ?? sj.assists ?? sj.Assists,
    stl: sj.stl ?? sj.steals ?? sj.Steals,
    blk: sj.blk ?? sj.blocks ?? sj.BlockedShots,
    to: sj.to ?? sj.turnovers ?? sj.Turnovers,
    pf: sj.pf ?? sj.fouls ?? sj.personal_fouls ?? sj.PersonalFouls,
  };
}

// ─── Basketball Table ─────────────────────────────────────────────
const BasketballTable = React.memo(function BasketballTable({
  games,
  playerSchoolId,
}: {
  games: PlayerGameLogEntry[];
  playerSchoolId: number | null;
}) {
  return (
    <div className="overflow-x-auto">
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
        <thead>
          <tr
            style={{
              background: "var(--psp-navy, #0a1628)",
              color: "var(--psp-gold, #f0a500)",
            }}
          >
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Opponent</th>
            <th style={thStyle}>Result</th>
            <th style={thStyleCenter}>Min</th>
            <th style={thStyleCenter}>Pts</th>
            <th style={thStyleCenter}>FG</th>
            <th style={thStyleCenter}>3P</th>
            <th style={thStyleCenter}>FT</th>
            <th style={thStyleCenter}>Reb</th>
            <th style={thStyleCenter}>Ast</th>
            <th style={thStyleCenter}>Stl</th>
            <th style={thStyleCenter}>Blk</th>
            <th style={thStyleCenter}>TO</th>
          </tr>
        </thead>
        <tbody>
          {games.map((entry) => {
            const result = getResult(entry, playerSchoolId);
            const opp = getOpponent(entry, playerSchoolId);
            const sportId = entry.sport_id || "basketball";
            const gameLink = `/${sportId}/games/${entry.game_id}`;
            const sj = getStatsJson(entry);
            const b = normalizeBballStats(sj, entry);

            const fgStr = b.fgm != null && b.fga != null ? `${b.fgm}-${b.fga}` : stat(b.fgm);
            const tpStr = b.tpm != null && b.tpa != null ? `${b.tpm}-${b.tpa}` : stat(b.tpm);
            const ftStr = b.ftm != null && b.fta != null ? `${b.ftm}-${b.fta}` : stat(b.ftm);

            return (
              <tr key={entry.id} style={rowStyle}>
                <td style={tdStyle}>{formatDate(entry.games?.game_date ?? null)}</td>
                <td style={tdStyle}>
                  <Link href={gameLink} style={linkStyle}>
                    {opp.name}
                  </Link>
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      color:
                        result.isWin === true
                          ? "var(--psp-success, #22c55e)"
                          : result.isWin === false
                          ? "var(--psp-danger, #ef4444)"
                          : "var(--psp-gray-400, #94a3b8)",
                      fontWeight: 600,
                    }}
                  >
                    {result.text}
                  </span>
                </td>
                <td style={tdStyleCenter}>{stat(b.min)}</td>
                <td style={tdStyleCenter}>{stat(b.pts)}</td>
                <td style={tdStyleCenter}>{fgStr}</td>
                <td style={tdStyleCenter}>{tpStr}</td>
                <td style={tdStyleCenter}>{ftStr}</td>
                <td style={tdStyleCenter}>{stat(b.reb)}</td>
                <td style={tdStyleCenter}>{stat(b.ast)}</td>
                <td style={tdStyleCenter}>{stat(b.stl)}</td>
                <td style={tdStyleCenter}>{stat(b.blk)}</td>
                <td style={tdStyleCenter}>{stat(b.to)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

// ─── Shared Styles ────────────────────────────────────────────────
const thStyle: React.CSSProperties = {
  padding: "0.6rem 0.5rem",
  textAlign: "left",
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "0.85rem",
  letterSpacing: "0.06em",
  whiteSpace: "nowrap",
};

const thStyleCenter: React.CSSProperties = {
  ...thStyle,
  textAlign: "center",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid var(--psp-gray-800, #1e293b)",
  whiteSpace: "nowrap",
  color: "var(--psp-gray-200, #e2e8f0)",
};

const tdStyleCenter: React.CSSProperties = {
  ...tdStyle,
  textAlign: "center",
};

const rowStyle: React.CSSProperties = {
  background: "var(--psp-navy-mid, #0f2040)",
};

const linkStyle: React.CSSProperties = {
  color: "var(--psp-gold, #f0a500)",
  textDecoration: "none",
  fontWeight: 500,
};

// ─── Main Component ───────────────────────────────────────────────
export default function PlayerGameLog({ gameLog, playerSchoolId }: PlayerGameLogProps) {
  const seasonGroups = groupBySeasons(gameLog);
  const [expandedSeasons, setExpandedSeasons] = useState<Set<string>>(
    () => new Set(seasonGroups.length > 0 ? [seasonGroups[0].label] : [])
  );

  const toggleSeason = (label: string) => {
    setExpandedSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  if (gameLog.length === 0) return null;

  // Determine sport from first entry
  const primarySport = gameLog[0]?.sport_id ?? "football";

  return (
    <div
      id="game-log"
      style={{
        background: "var(--psp-card-bg, #f8f9fc)",
        borderRadius: "12px",
        padding: "1.5rem",
        border: "1px solid var(--psp-gray-200, #e5e7eb)",
        marginTop: "1.5rem",
      }}
    >
      <h2
        className="font-heading"
        style={{
          color: "var(--psp-navy, #0a1628)",
          margin: "0 0 1rem",
          fontSize: "1.5rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {primarySport === "football" ? "\uD83C\uDFC8" : "\uD83C\uDFC0"} Game Log
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {seasonGroups.map((group) => {
          const isExpanded = expandedSeasons.has(group.label);
          const wins = group.games.filter(
            (g) => getResult(g, playerSchoolId).isWin === true
          ).length;
          const losses = group.games.filter(
            (g) => getResult(g, playerSchoolId).isWin === false
          ).length;

          return (
            <div
              key={group.label}
              style={{
                background: "var(--psp-navy, #0a1628)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {/* Season header / toggle */}
              <button
                onClick={() => toggleSeason(group.label)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                <span
                  className="font-heading"
                  style={{ fontSize: "1.1rem", letterSpacing: "0.05em" }}
                >
                  {group.label}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.8rem",
                  }}
                >
                  <span style={{ color: "var(--psp-gray-400, #94a3b8)" }}>
                    {group.games.length} games
                    {wins + losses > 0 && (
                      <>
                        {" \u00B7 "}
                        <span style={{ color: "var(--psp-success, #22c55e)" }}>{wins}W</span>
                        {" - "}
                        <span style={{ color: "var(--psp-danger, #ef4444)" }}>{losses}L</span>
                      </>
                    )}
                  </span>
                  <span
                    style={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      fontSize: "0.7rem",
                    }}
                  >
                    \u25BC
                  </span>
                </span>
              </button>

              {/* Reconstructed data disclaimer */}
              {isExpanded && group.games.some((g: any) => g.source_file === 'tedsilary-2015-reconstructed') && (
                <div style={{
                  margin: "0.5rem 0.25rem",
                  padding: "0.5rem 0.75rem",
                  background: "rgba(240, 165, 0, 0.08)",
                  borderLeft: "3px solid var(--psp-gold, #f0a500)",
                  borderRadius: "0 4px 4px 0",
                  fontSize: "0.7rem",
                  color: "var(--psp-gray-400, #94a3b8)",
                  lineHeight: 1.4,
                }}>
                  <span style={{ color: "var(--psp-gold, #f0a500)", fontWeight: 600 }}>Note:</span>{" "}
                  Stats for 2015-16 games were reconstructed from Ted Silary{"'"}s weekly cumulative leaders.
                  Individual game breakdowns may be approximate.
                </div>
              )}

              {/* Table content */}
              {isExpanded && (
                <div style={{ padding: "0 0.25rem 0.5rem" }}>
                  {primarySport === "basketball" ? (
                    <BasketballTable
                      games={group.games}
                      playerSchoolId={playerSchoolId}
                    />
                  ) : (
                    <FootballTable
                      games={group.games}
                      playerSchoolId={playerSchoolId}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
