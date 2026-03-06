"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type TabKey = "schedule" | "roster" | "stats" | "program" | "awards";

interface SeasonData {
  teamSeason: any;
  games: any[];
  roster: any[];
  awards: any[];
  championships: any[];
}

interface TeamPageTabsProps {
  schoolSlug: string;
  sportId: string;
  sportName: string;
  sportEmoji: string;
  sportColor: string;
  seasonLabels: string[]; // sorted newest first
  seasonsData: Record<string, SeasonData>;
  allChamps?: any[];
  allAwards?: any[];
  notableAlumni?: any[];
  seasonSummaries?: any[];
  topPlayers?: any[];
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "schedule", label: "Schedule", icon: "📅" },
  { key: "roster", label: "Roster", icon: "👥" },
  { key: "stats", label: "Stats", icon: "📊" },
  { key: "program", label: "Program", icon: "🏛️" },
  { key: "awards", label: "Awards", icon: "🏆" },
];

function formatDate(d: string | null) {
  if (!d) return "—";
  try {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return d;
  }
}

export default function TeamPageTabs({
  schoolSlug,
  sportId,
  sportName,
  sportEmoji,
  sportColor,
  seasonLabels,
  seasonsData,
  allChamps = [],
  allAwards = [],
  notableAlumni = [],
  seasonSummaries = [],
  topPlayers = [],
}: TeamPageTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("schedule");
  const [selectedSeason, setSelectedSeason] = useState(seasonLabels[0] || "");

  const data = useMemo(() => seasonsData[selectedSeason] || null, [seasonsData, selectedSeason]);
  const ts = data?.teamSeason;

  // Compute program-level stats from all seasons
  const programStats = useMemo(() => {
    let totalW = 0, totalL = 0, totalT = 0, totalPF = 0, totalPA = 0, totalGames = 0;
    let bestSeason: { label: string; wins: number; losses: number; ties: number; pct: number } | null = null;
    let worstSeason: { label: string; wins: number; losses: number; ties: number; pct: number } | null = null;
    let currentStreak = 0;
    let streakType: "W" | "L" | null = null;
    let longestWinStreak = 0;
    let playoffAppearances = 0;

    const timelineData: { label: string; wins: number; losses: number; ties: number; pct: number; playoffs: boolean }[] = [];

    // Use seasonSummaries if available, else fall back to seasonsData
    const source = seasonSummaries.length > 0
      ? seasonSummaries
      : seasonLabels.map(label => {
          const ts = seasonsData[label]?.teamSeason;
          return ts ? { ...ts, season_label: label } : null;
        }).filter(Boolean);

    for (const item of source) {
      const w = item.wins || 0;
      const l = item.losses || 0;
      const t = item.ties || 0;
      const games = w + l + t;
      if (games === 0) continue;

      const pct = games > 0 ? w / games : 0;
      const label = item.season_label || item.season || "";

      totalW += w;
      totalL += l;
      totalT += t;
      totalPF += item.points_for || 0;
      totalPA += item.points_against || 0;
      totalGames += games;

      if (item.playoff_result) playoffAppearances++;

      timelineData.push({ label, wins: w, losses: l, ties: t, pct, playoffs: !!item.playoff_result });

      // Only consider seasons with 3+ games for best/worst
      if (games >= 3) {
        if (!bestSeason || pct > bestSeason.pct || (pct === bestSeason.pct && w > bestSeason.wins)) {
          bestSeason = { label, wins: w, losses: l, ties: t, pct };
        }
        if (!worstSeason || pct < worstSeason.pct) {
          worstSeason = { label, wins: w, losses: l, ties: t, pct };
        }
      }
    }

    const winPct = totalGames > 0 ? ((totalW / totalGames) * 100).toFixed(1) : "0.0";

    return {
      totalW, totalL, totalT, totalPF, totalPA, totalGames,
      winPct, bestSeason, worstSeason, playoffAppearances,
      timelineData: timelineData.sort((a, b) => {
        const aY = parseInt(a.label.split("-")[0]) || 0;
        const bY = parseInt(b.label.split("-")[0]) || 0;
        return aY - bY;
      }),
    };
  }, [seasonSummaries, seasonLabels, seasonsData]);

  return (
    <>
      {/* Tab Bar */}
      <div className="school-tab-bar" style={{ "--school-color": sportColor } as React.CSSProperties}>
        <div className="stb-inner">
          {/* Season Dropdown — only shown for season-specific tabs */}
          {activeTab !== "program" && (
            <div style={{ display: "flex", alignItems: "center", marginRight: 8, borderRight: "1px solid rgba(255,255,255,0.15)", paddingRight: 12 }}>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 4,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                {seasonLabels.map((label) => {
                  const sd = seasonsData[label];
                  const ts = sd?.teamSeason;
                  const record = ts ? `${ts.wins || 0}-${ts.losses || 0}${ts.ties ? `-${ts.ties}` : ""}` : "";
                  return (
                    <option key={label} value={label} style={{ color: "#000" }}>
                      {label}{record ? ` (${record})` : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Tab Buttons */}
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`stb-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="stb-icon">{tab.icon}</span>
              {tab.label}
              {tab.key === "awards" && allChamps.length > 0 && (
                <span style={{ marginLeft: 4, fontSize: 10, background: "var(--psp-gold)", color: "var(--psp-navy)", borderRadius: 8, padding: "1px 6px", fontWeight: 700 }}>
                  {allChamps.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Season Summary Bar — only for season-specific tabs */}
      {activeTab !== "program" && ts && (
        <div style={{
          background: "var(--card-bg)",
          borderBottom: "1px solid var(--g100)",
          padding: "10px 20px",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", fontSize: 13 }}>
            <span style={{ fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16 }}>
              {selectedSeason}
            </span>
            <span>
              <strong>{ts.wins}-{ts.losses}{ts.ties ? `-${ts.ties}` : ""}</strong>
              <span style={{ color: "var(--g400)", marginLeft: 4 }}>Overall</span>
            </span>
            {(ts.league_wins !== null && ts.league_wins !== undefined) && (
              <span>
                <strong>{ts.league_wins}-{ts.league_losses}</strong>
                <span style={{ color: "var(--g400)", marginLeft: 4 }}>League</span>
              </span>
            )}
            {ts.points_for != null && (
              <span>
                <strong>{ts.points_for}</strong>
                <span style={{ color: "var(--g400)", marginLeft: 4 }}>PF</span>
                {" / "}
                <strong>{ts.points_against || 0}</strong>
                <span style={{ color: "var(--g400)", marginLeft: 4 }}>PA</span>
              </span>
            )}
            {ts.playoff_result && (
              <span style={{ color: sportColor, fontWeight: 600 }}>
                {ts.playoff_result}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 20px" }}>
        {activeTab === "program" ? (
          <ProgramTab
            programStats={programStats}
            allChamps={allChamps}
            notableAlumni={notableAlumni}
            topPlayers={topPlayers}
            sportId={sportId}
            sportName={sportName}
            sportColor={sportColor}
            sportEmoji={sportEmoji}
            seasonLabels={seasonLabels}
          />
        ) : !data ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--g400)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{sportEmoji}</div>
            <div style={{ fontWeight: 600 }}>No data for {selectedSeason}</div>
          </div>
        ) : (
          <>
            {activeTab === "schedule" && <ScheduleTab data={data} schoolSlug={schoolSlug} sportId={sportId} sportColor={sportColor} />}
            {activeTab === "roster" && <RosterTab data={data} sportId={sportId} sportColor={sportColor} />}
            {activeTab === "stats" && <StatsTab data={data} sportId={sportId} sportName={sportName} sportColor={sportColor} />}
            {activeTab === "awards" && <AwardsTab data={data} sportId={sportId} sportColor={sportColor} allChamps={allChamps} allAwards={allAwards} />}
          </>
        )}
      </div>
    </>
  );
}

// ============================================================================
// PROGRAM TAB (NEW)
// ============================================================================
function ProgramTab({
  programStats,
  allChamps,
  notableAlumni,
  topPlayers,
  sportId,
  sportName,
  sportColor,
  sportEmoji,
  seasonLabels,
}: {
  programStats: any;
  allChamps: any[];
  notableAlumni: any[];
  topPlayers: any[];
  sportId: string;
  sportName: string;
  sportColor: string;
  sportEmoji: string;
  seasonLabels: string[];
}) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* All-Time Record Summary */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--g400)", marginBottom: 16, letterSpacing: 1 }}>
          All-Time Program Summary
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 16 }}>
          <StatBlock label="All-Time Record" value={`${programStats.totalW}-${programStats.totalL}${programStats.totalT ? `-${programStats.totalT}` : ""}`} color="var(--text)" />
          <StatBlock label="Win %" value={`${programStats.winPct}%`} color={sportColor} />
          <StatBlock label="Championships" value={String(allChamps.length)} color="var(--psp-gold)" />
          <StatBlock label="Seasons" value={String(seasonLabels.length)} color="var(--text)" />
          <StatBlock label="Playoff Appearances" value={String(programStats.playoffAppearances)} color={sportColor} />
          {programStats.totalPF > 0 && (
            <StatBlock label="Total Points For" value={String(programStats.totalPF)} color="var(--text)" />
          )}
        </div>
        {/* Best / Worst Seasons */}
        <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
          {programStats.bestSeason && (
            <div style={{ flex: 1, minWidth: 200, padding: 12, background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#16a34a", letterSpacing: 0.5, marginBottom: 4 }}>Best Season</div>
              <div style={{ fontWeight: 700, fontSize: 18, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {programStats.bestSeason.wins}-{programStats.bestSeason.losses}{programStats.bestSeason.ties ? `-${programStats.bestSeason.ties}` : ""}
              </div>
              <div style={{ fontSize: 12, color: "var(--g500)" }}>{programStats.bestSeason.label} ({(programStats.bestSeason.pct * 100).toFixed(0)}%)</div>
            </div>
          )}
          {programStats.worstSeason && programStats.worstSeason.label !== programStats.bestSeason?.label && (
            <div style={{ flex: 1, minWidth: 200, padding: 12, background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#dc2626", letterSpacing: 0.5, marginBottom: 4 }}>Toughest Season</div>
              <div style={{ fontWeight: 700, fontSize: 18, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {programStats.worstSeason.wins}-{programStats.worstSeason.losses}{programStats.worstSeason.ties ? `-${programStats.worstSeason.ties}` : ""}
              </div>
              <div style={{ fontSize: 12, color: "var(--g500)" }}>{programStats.worstSeason.label} ({(programStats.worstSeason.pct * 100).toFixed(0)}%)</div>
            </div>
          )}
        </div>
      </div>

      {/* Season History Timeline */}
      {programStats.timelineData.length > 1 && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--g400)", marginBottom: 16, letterSpacing: 1 }}>
            Season History
          </h3>
          {/* Visual W-L bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, minHeight: 120, padding: "0 4px" }}>
            {programStats.timelineData.map((season: any, i: number) => {
              const maxGames = Math.max(...programStats.timelineData.map((s: any) => s.wins + s.losses + s.ties));
              const totalGames = season.wins + season.losses + season.ties;
              const barHeight = maxGames > 0 ? Math.max(8, (totalGames / maxGames) * 100) : 8;
              const greenPct = totalGames > 0 ? (season.wins / totalGames) * 100 : 0;

              return (
                <div
                  key={season.label}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    minWidth: 0,
                  }}
                  title={`${season.label}: ${season.wins}-${season.losses}${season.ties ? `-${season.ties}` : ""} (${(season.pct * 100).toFixed(0)}%)${season.playoffs ? " ★ Playoffs" : ""}`}
                >
                  {season.playoffs && (
                    <div style={{ fontSize: 8, color: "var(--psp-gold)" }}>★</div>
                  )}
                  <div style={{
                    width: "100%",
                    height: barHeight,
                    borderRadius: "3px 3px 0 0",
                    background: `linear-gradient(to top, #16a34a ${greenPct}%, #dc2626 ${greenPct}%)`,
                    opacity: 0.85,
                    transition: "opacity 0.15s",
                    cursor: "pointer",
                  }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "0.85"; }}
                  />
                  <div style={{
                    fontSize: 8,
                    color: "var(--g400)",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    whiteSpace: "nowrap",
                    maxHeight: 40,
                    overflow: "hidden",
                  }}>
                    {season.label.replace("20", "'").split("-")[0]}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 10, fontSize: 10, color: "var(--g400)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#16a34a" }} /> Wins
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#dc2626" }} /> Losses
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "var(--psp-gold)", fontSize: 12 }}>★</span> Playoffs
            </span>
          </div>

          {/* Season-by-season table */}
          <div style={{ marginTop: 16, maxHeight: 400, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--g200)", position: "sticky", top: 0, background: "var(--card-bg)" }}>
                  <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700 }}>Season</th>
                  <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700 }}>Record</th>
                  <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700 }}>Win %</th>
                  <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700 }}>Playoffs</th>
                </tr>
              </thead>
              <tbody>
                {[...programStats.timelineData].reverse().map((season: any) => (
                  <tr key={season.label} style={{ borderBottom: "1px solid var(--g100)" }}>
                    <td style={{ padding: "6px 10px", fontWeight: 600 }}>{season.label}</td>
                    <td style={{ padding: "6px 10px", textAlign: "center", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
                      {season.wins}-{season.losses}{season.ties ? `-${season.ties}` : ""}
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "center" }}>
                      <span style={{
                        color: season.pct >= 0.6 ? "#16a34a" : season.pct < 0.4 ? "#dc2626" : "var(--text)",
                        fontWeight: 600,
                      }}>
                        {(season.pct * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td style={{ padding: "6px 10px", textAlign: "center" }}>
                      {season.playoffs ? <span style={{ color: "var(--psp-gold)" }}>★</span> : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Championships */}
      {allChamps.length > 0 && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--psp-gold)", marginBottom: 12, letterSpacing: 1 }}>
            Championship History ({allChamps.length})
          </h3>
          <div style={{ display: "grid", gap: 8 }}>
            {allChamps.map((c: any, i: number) => (
              <div key={c.id || i} style={{
                padding: "10px 14px",
                background: "rgba(240, 165, 0, 0.06)",
                border: "1px solid rgba(240, 165, 0, 0.15)",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>🥇</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--psp-gold)" }}>
                    {c.season_label || c.year} {c.level} Championship
                  </div>
                  <div style={{ fontSize: 11, color: "var(--g400)" }}>
                    {c.score && `${c.score} `}
                    {c.opponent_name || (c.opponent?.name && `vs ${c.opponent.name}`) || ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notable Alumni */}
      {notableAlumni.length > 0 && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--g400)", marginBottom: 12, letterSpacing: 1 }}>
            Notable Alumni
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {notableAlumni.map((alum: any, i: number) => {
              const p = alum.players || alum;
              return (
                <div key={p.id || i} style={{
                  padding: "10px 14px",
                  background: `${sportColor}06`,
                  border: `1px solid ${sportColor}15`,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: `${sportColor}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0,
                  }}>
                    {p.pro_team ? "⭐" : p.college ? "🎓" : sportEmoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {p.slug ? (
                      <Link href={`/${sportId}/players/${p.slug}`} style={{ fontWeight: 700, fontSize: 13, color: "var(--psp-blue)", textDecoration: "none", display: "block" }}>
                        {p.name}
                      </Link>
                    ) : (
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                    )}
                    <div style={{ fontSize: 11, color: "var(--g400)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.pro_team && <span style={{ color: sportColor, fontWeight: 600 }}>{p.pro_team}</span>}
                      {p.pro_team && p.college && " · "}
                      {p.college && <span>{p.college}</span>}
                      {p.graduation_year && <span> · Class of {p.graduation_year}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All-Time Top Players */}
      {topPlayers.length > 0 && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--g400)", marginBottom: 12, letterSpacing: 1 }}>
            Top Players — All Time
          </h3>
          <TopPlayersTable players={topPlayers} sportId={sportId} sportColor={sportColor} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TOP PLAYERS TABLE (used in Program tab)
// ============================================================================
function TopPlayersTable({ players, sportId, sportColor }: { players: any[]; sportId: string; sportColor: string }) {
  const getCols = () => {
    switch (sportId) {
      case "football":
        return [
          { key: "name", label: "Player", align: "left" as const },
          { key: "seasons", label: "Seasons", align: "center" as const },
          { key: "rush_yards", label: "Rush Yds", align: "right" as const },
          { key: "pass_yards", label: "Pass Yds", align: "right" as const },
          { key: "rec_yards", label: "Rec Yds", align: "right" as const },
          { key: "total_td", label: "TD", align: "right" as const },
        ];
      case "basketball": case "girls-basketball":
        return [
          { key: "name", label: "Player", align: "left" as const },
          { key: "seasons", label: "Seasons", align: "center" as const },
          { key: "points", label: "PTS", align: "right" as const },
          { key: "ppg", label: "PPG", align: "right" as const },
          { key: "rebounds", label: "REB", align: "right" as const },
          { key: "assists", label: "AST", align: "right" as const },
        ];
      case "baseball": case "softball":
        return [
          { key: "name", label: "Player", align: "left" as const },
          { key: "seasons", label: "Seasons", align: "center" as const },
          { key: "batting_avg", label: "AVG", align: "right" as const },
          { key: "hits", label: "H", align: "right" as const },
          { key: "rbi", label: "RBI", align: "right" as const },
        ];
      default:
        return [
          { key: "name", label: "Player", align: "left" as const },
          { key: "seasons", label: "Seasons", align: "center" as const },
        ];
    }
  };

  const cols = getCols().filter(col => {
    if (col.key === "name" || col.key === "seasons") return true;
    if (col.key === "ppg") return players.some((p: any) => (p.points ?? 0) > 0 && (p.games_played ?? 0) > 0);
    return players.some((p: any) => p[col.key] != null && p[col.key] !== 0);
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--g200)" }}>
            <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700, width: 30 }}>#</th>
            {cols.map(col => (
              <th key={col.key} style={{ padding: "6px 10px", textAlign: col.align, fontWeight: 700 }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.slice(0, 20).map((player: any, i: number) => {
            const p = player.players || player;
            return (
              <tr key={p.id || i} style={{ borderBottom: "1px solid var(--g100)" }}>
                <td style={{ padding: "6px 10px", textAlign: "center", fontSize: 11, color: i < 3 ? "var(--psp-gold)" : "var(--g400)", fontWeight: i < 3 ? 700 : 400 }}>
                  {i + 1}
                </td>
                {cols.map(col => {
                  if (col.key === "name") {
                    return (
                      <td key={col.key} style={{ padding: "6px 10px" }}>
                        {p.slug ? (
                          <Link href={`/${sportId}/players/${p.slug}`} style={{ color: "var(--psp-blue)", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
                            {p.name}
                          </Link>
                        ) : (
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                        )}
                        {p.college && <span style={{ fontSize: 10, color: sportColor, marginLeft: 6 }}>→ {p.college}</span>}
                      </td>
                    );
                  }
                  if (col.key === "seasons") {
                    return (
                      <td key={col.key} style={{ padding: "6px 10px", textAlign: "center", fontSize: 11, color: "var(--g500)" }}>
                        {player.season_count || "—"}
                      </td>
                    );
                  }
                  if (col.key === "ppg") {
                    const pts = player.points ?? 0;
                    const gp = player.games_played ?? 1;
                    return (
                      <td key={col.key} style={{ padding: "6px 10px", textAlign: "right", fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {gp > 0 ? (pts / gp).toFixed(1) : "—"}
                      </td>
                    );
                  }
                  const val = player[col.key];
                  return (
                    <td key={col.key} style={{ padding: "6px 10px", textAlign: "right", fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {val != null && val !== 0 ? val.toLocaleString() : "—"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// SCHEDULE TAB (unchanged)
// ============================================================================
function ScheduleTab({ data, schoolSlug, sportId, sportColor }: { data: SeasonData; schoolSlug: string; sportId: string; sportColor: string }) {
  const ts = data.teamSeason;
  const schoolId = ts?.school_id || ts?.schools?.id;

  if (!data.games.length) {
    return <EmptyState icon="📅" text="No games recorded for this season" />;
  }

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--g50, rgba(0,0,0,0.03))", borderBottom: "2px solid var(--g200)" }}>
            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, width: 70 }}>Date</th>
            <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, width: 40 }}></th>
            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>Opponent</th>
            <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, width: 60 }}>Result</th>
            <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, width: 70 }}>Score</th>
            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>Type</th>
            <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {data.games.map((game: any, i: number) => {
            const isHome = game.home_school_id === schoolId;
            const opp = isHome ? game.away_school : game.home_school;
            const ourScore = isHome ? game.home_score : game.away_score;
            const theirScore = isHome ? game.away_score : game.home_score;
            const won = ourScore != null && theirScore != null && ourScore > theirScore;
            const lost = ourScore != null && theirScore != null && ourScore < theirScore;
            const resultLabel = won ? "W" : lost ? "L" : ourScore === theirScore ? "T" : "—";
            const hasScore = ourScore != null && theirScore != null;

            return (
              <tr key={game.id || i} style={{ borderBottom: "1px solid var(--g100)" }}>
                <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--g500)" }}>
                  {formatDate(game.game_date)}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 11, color: "var(--g400)" }}>
                  {isHome ? "vs" : "@"}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {opp?.slug ? (
                    <Link href={`/schools/${opp.slug}/${sportId}`} style={{ color: "var(--psp-blue)", textDecoration: "none", fontWeight: 600 }}>
                      {opp.name}
                    </Link>
                  ) : (
                    <span>{opp?.name || "TBD"}</span>
                  )}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                  <span style={{
                    display: "inline-block",
                    width: 22, height: 22, lineHeight: "22px",
                    borderRadius: "50%", textAlign: "center",
                    fontSize: 11, fontWeight: 700,
                    background: won ? "#16a34a" : lost ? "#dc2626" : "var(--g200)",
                    color: won || lost ? "#fff" : "var(--g500)",
                  }}>
                    {resultLabel}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {ourScore != null ? `${ourScore}-${theirScore}` : "—"}
                </td>
                <td style={{ padding: "10px 12px", fontSize: 11, color: "var(--g400)" }}>
                  {game.game_type === "playoff" || game.playoff_round
                    ? game.playoff_round || "Playoff"
                    : game.game_type || "Regular"}
                </td>
                <td style={{ padding: "10px 4px", textAlign: "center" }}>
                  {hasScore && game.id && (
                    <Link
                      href={`/${sportId}/games/${game.id}`}
                      style={{ fontSize: 11, color: sportColor, textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}
                      title="Box Score"
                    >
                      Box →
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// ROSTER TAB (unchanged)
// ============================================================================
function RosterTab({ data, sportId, sportColor }: { data: SeasonData; sportId: string; sportColor: string }) {
  if (!data.roster.length) {
    return <EmptyState icon="👥" text="No roster data for this season" />;
  }

  const getColumns = () => {
    switch (sportId) {
      case "football":
        return [
          { key: "name", label: "Player", align: "left" as const },
          { key: "positions", label: "Pos", align: "center" as const },
          { key: "graduation_year", label: "Class", align: "center" as const },
          { key: "rush_yards", label: "Rush", align: "right" as const },
          { key: "pass_yards", label: "Pass", align: "right" as const },
          { key: "rec_yards", label: "Rec", align: "right" as const },
          { key: "total_td", label: "TD", align: "right" as const },
        ];
      case "basketball":
        return [
          { key: "name", label: "Player", align: "left" as const },
          { key: "positions", label: "Pos", align: "center" as const },
          { key: "graduation_year", label: "Class", align: "center" as const },
          { key: "games_played", label: "GP", align: "right" as const },
          { key: "points", label: "PTS", align: "right" as const },
          { key: "ppg", label: "PPG", align: "right" as const },
          { key: "rebounds", label: "REB", align: "right" as const },
          { key: "assists", label: "AST", align: "right" as const },
        ];
      case "baseball":
        return [
          { key: "name", label: "Player", align: "left" as const },
          { key: "positions", label: "Pos", align: "center" as const },
          { key: "graduation_year", label: "Class", align: "center" as const },
          { key: "batting_avg", label: "AVG", align: "right" as const },
          { key: "hits", label: "H", align: "right" as const },
          { key: "rbi", label: "RBI", align: "right" as const },
          { key: "home_runs", label: "HR", align: "right" as const },
        ];
      default:
        return [
          { key: "name", label: "Player", align: "left" as const },
          { key: "positions", label: "Pos", align: "center" as const },
          { key: "graduation_year", label: "Class", align: "center" as const },
        ];
    }
  };

  const allColumns = getColumns();
  const columns = allColumns.filter((col) => {
    if (col.key === "name" || col.key === "positions" || col.key === "graduation_year") return true;
    if (col.key === "ppg") {
      return data.roster.some((p: any) => (p.points ?? 0) > 0 && (p.games_played ?? 0) > 0);
    }
    return data.roster.some((p: any) => p[col.key] != null && p[col.key] !== 0);
  });

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--g50, rgba(0,0,0,0.03))", borderBottom: "2px solid var(--g200)" }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: "8px 12px", textAlign: col.align, fontWeight: 600, fontSize: 12 }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.roster.map((player: any, i: number) => (
            <tr key={player.id || i} style={{ borderBottom: "1px solid var(--g100)" }}>
              {columns.map((col) => {
                if (col.key === "name") {
                  const p = player.players || player;
                  return (
                    <td key={col.key} style={{ padding: "10px 12px" }}>
                      {p.slug ? (
                        <Link href={`/${sportId}/players/${p.slug}`} style={{ color: "var(--psp-blue)", textDecoration: "none", fontWeight: 600 }}>
                          {p.name}
                        </Link>
                      ) : (
                        <span style={{ fontWeight: 600 }}>{p.name || "—"}</span>
                      )}
                      {p.college && (
                        <span style={{ fontSize: 10, color: sportColor, marginLeft: 6, fontWeight: 600 }}>
                          → {p.college}
                        </span>
                      )}
                    </td>
                  );
                }
                if (col.key === "positions") {
                  const pos = player.players?.positions || player.positions;
                  return (
                    <td key={col.key} style={{ padding: "10px 12px", textAlign: "center", fontSize: 11, color: "var(--g500)" }}>
                      {Array.isArray(pos) ? pos.join("/") : pos || "—"}
                    </td>
                  );
                }
                if (col.key === "graduation_year") {
                  const yr = player.players?.graduation_year || player.graduation_year;
                  return (
                    <td key={col.key} style={{ padding: "10px 12px", textAlign: "center", fontSize: 12 }}>
                      {yr || "—"}
                    </td>
                  );
                }
                if (col.key === "ppg") {
                  const pts = player.points ?? 0;
                  const gp = player.games_played ?? 1;
                  return (
                    <td key={col.key} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {gp > 0 ? (pts / gp).toFixed(1) : "—"}
                    </td>
                  );
                }
                const val = player[col.key];
                return (
                  <td key={col.key} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {val != null ? val : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// STATS TAB (UPGRADED — full individual stat tables + point differential)
// ============================================================================
function StatsTab({ data, sportId, sportName, sportColor }: { data: SeasonData; sportId: string; sportName: string; sportColor: string }) {
  const ts = data.teamSeason;
  const totalGames = (ts?.wins || 0) + (ts?.losses || 0) + (ts?.ties || 0);
  const winPct = totalGames > 0 ? (((ts?.wins || 0) / totalGames) * 100).toFixed(1) : null;
  const ptDiff = ts?.points_for != null && ts?.points_against != null
    ? ts.points_for - ts.points_against
    : null;
  const avgPF = ts?.points_for != null && totalGames > 0 ? (ts.points_for / totalGames).toFixed(1) : null;
  const avgPA = ts?.points_against != null && totalGames > 0 ? (ts.points_against / totalGames).toFixed(1) : null;

  // Stat leaders from roster
  const getLeaders = () => {
    if (!data.roster.length) return [];
    switch (sportId) {
      case "football":
        return [
          { label: "Rushing Leader", player: [...data.roster].sort((a: any, b: any) => (b.rush_yards || 0) - (a.rush_yards || 0))[0], stat: "rush_yards", unit: "yds" },
          { label: "Passing Leader", player: [...data.roster].sort((a: any, b: any) => (b.pass_yards || 0) - (a.pass_yards || 0))[0], stat: "pass_yards", unit: "yds" },
          { label: "Receiving Leader", player: [...data.roster].sort((a: any, b: any) => (b.rec_yards || 0) - (a.rec_yards || 0))[0], stat: "rec_yards", unit: "yds" },
          { label: "TD Leader", player: [...data.roster].sort((a: any, b: any) => (b.total_td || 0) - (a.total_td || 0))[0], stat: "total_td", unit: "TD" },
        ];
      case "basketball": case "girls-basketball":
        return [
          { label: "Scoring Leader", player: [...data.roster].sort((a: any, b: any) => (b.points || 0) - (a.points || 0))[0], stat: "points", unit: "pts" },
          { label: "Rebounds Leader", player: [...data.roster].sort((a: any, b: any) => (b.rebounds || 0) - (a.rebounds || 0))[0], stat: "rebounds", unit: "reb" },
          { label: "Assists Leader", player: [...data.roster].sort((a: any, b: any) => (b.assists || 0) - (a.assists || 0))[0], stat: "assists", unit: "ast" },
        ];
      default:
        return [];
    }
  };

  const leaders = getLeaders().filter((l) => l.player && l.player[l.stat]);

  // Full stat tables by category for football
  const getStatTables = () => {
    if (!data.roster.length) return [];
    switch (sportId) {
      case "football":
        return [
          {
            title: "Rushing",
            sortKey: "rush_yards",
            cols: [
              { key: "name", label: "Player", align: "left" as const },
              { key: "rush_carries", label: "ATT", align: "right" as const },
              { key: "rush_yards", label: "YDS", align: "right" as const },
              { key: "rush_td", label: "TD", align: "right" as const },
            ],
          },
          {
            title: "Passing",
            sortKey: "pass_yards",
            cols: [
              { key: "name", label: "Player", align: "left" as const },
              { key: "pass_comp", label: "CMP", align: "right" as const },
              { key: "pass_att", label: "ATT", align: "right" as const },
              { key: "pass_yards", label: "YDS", align: "right" as const },
              { key: "pass_td", label: "TD", align: "right" as const },
              { key: "pass_int", label: "INT", align: "right" as const },
            ],
          },
          {
            title: "Receiving",
            sortKey: "rec_yards",
            cols: [
              { key: "name", label: "Player", align: "left" as const },
              { key: "receptions", label: "REC", align: "right" as const },
              { key: "rec_yards", label: "YDS", align: "right" as const },
              { key: "rec_td", label: "TD", align: "right" as const },
            ],
          },
          {
            title: "Scoring",
            sortKey: "total_td",
            cols: [
              { key: "name", label: "Player", align: "left" as const },
              { key: "rush_td", label: "Rush TD", align: "right" as const },
              { key: "pass_td", label: "Pass TD", align: "right" as const },
              { key: "rec_td", label: "Rec TD", align: "right" as const },
              { key: "total_td", label: "Total TD", align: "right" as const },
            ],
          },
        ];
      case "basketball": case "girls-basketball":
        return [
          {
            title: "Scoring",
            sortKey: "points",
            cols: [
              { key: "name", label: "Player", align: "left" as const },
              { key: "games_played", label: "GP", align: "right" as const },
              { key: "points", label: "PTS", align: "right" as const },
              { key: "ppg", label: "PPG", align: "right" as const },
            ],
          },
        ];
      case "baseball": case "softball":
        return [
          {
            title: "Batting",
            sortKey: "hits",
            cols: [
              { key: "name", label: "Player", align: "left" as const },
              { key: "batting_avg", label: "AVG", align: "right" as const },
              { key: "hits", label: "H", align: "right" as const },
              { key: "rbi", label: "RBI", align: "right" as const },
              { key: "home_runs", label: "HR", align: "right" as const },
            ],
          },
        ];
      default:
        return [];
    }
  };

  const statTables = getStatTables();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Team Record Card (enhanced) */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--g400)", marginBottom: 12, letterSpacing: 1 }}>
          Team Record
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 16 }}>
          <StatBlock label="Overall" value={`${ts?.wins || 0}-${ts?.losses || 0}${ts?.ties ? `-${ts.ties}` : ""}`} color="var(--text)" />
          {winPct && <StatBlock label="Win %" value={`${winPct}%`} color={sportColor} />}
          {ts?.league_wins != null && (
            <StatBlock label="League" value={`${ts.league_wins}-${ts.league_losses}`} color="var(--text)" />
          )}
          {ts?.points_for != null && <StatBlock label="Points For" value={String(ts.points_for)} color="var(--text)" />}
          {ts?.points_against != null && <StatBlock label="Points Against" value={String(ts.points_against)} color="var(--text)" />}
          {ptDiff !== null && (
            <StatBlock
              label="Point Diff"
              value={`${ptDiff > 0 ? "+" : ""}${ptDiff}`}
              color={ptDiff > 0 ? "#16a34a" : ptDiff < 0 ? "#dc2626" : "var(--text)"}
            />
          )}
          {avgPF && <StatBlock label="Avg PF/Game" value={avgPF} color="var(--text)" />}
          {avgPA && <StatBlock label="Avg PA/Game" value={avgPA} color="var(--text)" />}
          {ts?.league_finish && <StatBlock label="League Finish" value={ts.league_finish} color="var(--g500)" />}
          {ts?.playoff_result && <StatBlock label="Playoffs" value={ts.playoff_result} color={sportColor} />}
          {ts?.ranking && <StatBlock label="Ranking" value={`#${ts.ranking}`} color="var(--psp-gold)" />}
        </div>
      </div>

      {/* Stat Leaders */}
      {leaders.length > 0 && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--g400)", marginBottom: 12, letterSpacing: 1 }}>
            Stat Leaders
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {leaders.map((leader, i) => {
              const p = leader.player.players || leader.player;
              return (
                <div key={i} style={{ padding: 12, background: `${sportColor}08`, border: `1px solid ${sportColor}20`, borderRadius: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--g400)", marginBottom: 4, letterSpacing: 0.5 }}>
                    {leader.label}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    {p.slug ? (
                      <Link href={`/${sportId}/players/${p.slug}`} style={{ fontWeight: 700, fontSize: 14, color: "var(--psp-blue)", textDecoration: "none" }}>
                        {p.name}
                      </Link>
                    ) : (
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                    )}
                    <span style={{ fontWeight: 700, fontSize: 18, fontFamily: "'Barlow Condensed', sans-serif", color: sportColor }}>
                      {leader.player[leader.stat]} <span style={{ fontSize: 11, color: "var(--g400)" }}>{leader.unit}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Individual Stat Tables */}
      {statTables.map((table) => {
        const sorted = [...data.roster]
          .filter((p: any) => p[table.sortKey] != null && p[table.sortKey] > 0)
          .sort((a: any, b: any) => (b[table.sortKey] || 0) - (a[table.sortKey] || 0));

        if (sorted.length === 0) return null;

        return (
          <div key={table.title} style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--g100)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--g400)", letterSpacing: 1, margin: 0 }}>
                {table.title}
              </h3>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "var(--g50, rgba(0,0,0,0.03))", borderBottom: "2px solid var(--g200)" }}>
                  <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700, width: 30 }}>#</th>
                  {table.cols.map(col => (
                    <th key={col.key} style={{ padding: "6px 10px", textAlign: col.align, fontWeight: 700 }}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 15).map((player: any, i: number) => {
                  const p = player.players || player;
                  return (
                    <tr key={p.id || i} style={{ borderBottom: "1px solid var(--g100)", background: i === 0 ? `${sportColor}06` : undefined }}>
                      <td style={{ padding: "6px 10px", textAlign: "center", fontSize: 11, color: i < 3 ? "var(--psp-gold)" : "var(--g400)", fontWeight: i < 3 ? 700 : 400 }}>
                        {i + 1}
                      </td>
                      {table.cols.map(col => {
                        if (col.key === "name") {
                          return (
                            <td key={col.key} style={{ padding: "6px 10px" }}>
                              {p.slug ? (
                                <Link href={`/${sportId}/players/${p.slug}`} style={{ color: "var(--psp-blue)", textDecoration: "none", fontWeight: 600 }}>
                                  {p.name}
                                </Link>
                              ) : (
                                <span style={{ fontWeight: 600 }}>{p.name}</span>
                              )}
                            </td>
                          );
                        }
                        if (col.key === "ppg") {
                          const pts = player.points ?? 0;
                          const gp = player.games_played ?? 1;
                          return (
                            <td key={col.key} style={{ padding: "6px 10px", textAlign: "right", fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif" }}>
                              {gp > 0 ? (pts / gp).toFixed(1) : "—"}
                            </td>
                          );
                        }
                        const val = player[col.key];
                        return (
                          <td key={col.key} style={{ padding: "6px 10px", textAlign: "right", fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif" }}>
                            {val != null ? val : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function StatBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", color }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--g400)", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

// ============================================================================
// AWARDS TAB (unchanged)
// ============================================================================
function AwardsTab({ data, sportId, sportColor, allChamps = [], allAwards = [] }: { data: SeasonData; sportId: string; sportColor: string; allChamps?: any[]; allAwards?: any[] }) {
  // Use per-season data if available, fall back to all-time data
  const seasonAwards = data.awards || [];
  const seasonChamps = data.championships || [];
  const awards = seasonAwards.length > 0 ? seasonAwards : allAwards;
  const champs = seasonChamps.length > 0 ? seasonChamps : allChamps;
  const isAllTime = seasonAwards.length === 0 && seasonChamps.length === 0;

  const hasAwards = awards.length > 0;
  const hasChamps = champs.length > 0;

  if (!hasAwards && !hasChamps) {
    return <EmptyState icon="🏆" text="No awards or championships on record" />;
  }

  // Normalize and group awards by type
  const normalizeAwardType = (type: string) => {
    const lower = type.toLowerCase().trim();
    if (lower === "all-city" || lower === "all-city selection") return "All-City";
    if (lower === "all-catholic") return "All-Catholic";
    if (lower === "all-public") return "All-Public";
    if (lower === "all-state") return "All-State";
    if (lower === "all-inter-ac") return "All-Inter-Ac";
    if (lower === "all-american") return "All-American";
    if (lower.includes("player of the year")) return "Player of the Year";
    if (lower.includes("pitcher of the year")) return "Pitcher of the Year";
    if (lower === "mvp") return "MVP";
    return type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  // Build group key: type + source for differentiation (e.g. "All-Catholic · Coaches" vs "All-Catholic · Daily News")
  const normalizeSource = (src: string | null) => {
    if (!src) return null;
    const lower = src.toLowerCase().trim();
    if (lower === "daily news" || lower === "philadelphia daily news") return "Daily News";
    if (lower === "catholic league") return "Coaches";
    if (lower === "public league") return "Coaches";
    if (lower.includes("football writers") || lower.includes("sports writers")) return src;
    return src;
  };

  const awardsByGroup: Record<string, { type: string; source: string | null; items: any[] }> = {};
  for (const a of awards) {
    const rawType = a.award_type || a.award_name || "Award";
    const type = normalizeAwardType(rawType);
    const source = normalizeSource(a.source);
    // Only append source to key when there are multiple sources for same type
    const groupKey = source ? `${type}|||${source}` : type;
    if (!awardsByGroup[groupKey]) awardsByGroup[groupKey] = { type, source, items: [] };
    awardsByGroup[groupKey].items.push(a);
  }

  // Sort groups: All-City first, then All-Catholic, All-Public, All-State, then alphabetical
  const typeOrder = ["All-City", "All-Catholic", "All-Public", "All-Inter-Ac", "All-State", "All-American", "Player of the Year", "Pitcher of the Year", "MVP"];
  const sortedGroupKeys = Object.keys(awardsByGroup).sort((a, b) => {
    const ga = awardsByGroup[a];
    const gb = awardsByGroup[b];
    const ai = typeOrder.indexOf(ga.type);
    const bi = typeOrder.indexOf(gb.type);
    if (ai !== -1 && bi !== -1) {
      if (ai !== bi) return ai - bi;
      // Same type, sort by source
      return (ga.source || "").localeCompare(gb.source || "");
    }
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return ga.type.localeCompare(gb.type);
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {isAllTime && (hasAwards || hasChamps) && (
        <div style={{ padding: "8px 14px", background: "rgba(59, 130, 246, 0.08)", border: "1px solid var(--psp-blue)", borderRadius: 6, fontSize: 12, color: "var(--psp-blue)", fontWeight: 600 }}>
          Showing all-time awards &amp; championships for this program
        </div>
      )}

      {hasChamps && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--psp-gold)", marginBottom: 12, letterSpacing: 1 }}>
            🏆 Championships ({champs.length})
          </h3>
          <div style={{ display: "grid", gap: 8 }}>
            {champs.map((c: any, i: number) => (
              <div key={c.id || i} style={{ padding: "10px 14px", background: "rgba(240, 165, 0, 0.08)", border: "1px solid rgba(240, 165, 0, 0.3)", borderRadius: 6, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🥇</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--psp-gold)" }}>{c.level || c.championship_type || "Championship"}</div>
                  <div style={{ fontSize: 11, color: "var(--g400)" }}>
                    {c.seasons?.label || c.year || ""}
                    {c.score && ` · ${c.score}`}
                    {(c.opponent?.name || c.opponent_name) && ` vs ${c.opponent?.name || c.opponent_name}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasAwards && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--g400)", marginBottom: 12, letterSpacing: 1 }}>
            🏅 Individual Awards ({awards.length})
          </h3>
          {sortedGroupKeys.map((groupKey) => {
            const group = awardsByGroup[groupKey];
            const displayLabel = group.source ? `${group.type} · ${group.source}` : group.type;
            return (
            <div key={groupKey} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: sportColor, textTransform: "uppercase", marginBottom: 6, letterSpacing: 0.5 }}>
                {displayLabel} ({group.items.length})
              </div>
              <div style={{ display: "grid", gap: 4 }}>
                {group.items.map((a: any, i: number) => (
                  <div key={a.id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--g100)" }}>
                    <div style={{ flex: 1 }}>
                      {a.players?.slug ? (
                        <Link href={`/${sportId}/players/${a.players.slug}`} style={{ fontWeight: 600, fontSize: 13, color: "var(--psp-blue)", textDecoration: "none" }}>
                          {a.players?.name || a.player_name}
                        </Link>
                      ) : (
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{a.player_name || a.players?.name || "Unknown"}</span>
                      )}
                      {a.position && (
                        <span style={{ fontSize: 10, color: "var(--g400)", marginLeft: 6 }}>{a.position}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: "var(--g500)", fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {a.seasons?.label || a.year || ""}
                    </span>
                    {a.award_tier ? (() => {
                      const tier = Number(a.award_tier);
                      const suffix = tier === 1 ? "st" : tier === 2 ? "nd" : tier === 3 ? "rd" : "th";
                      return (
                        <span style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontWeight: 700,
                          background: tier === 1 ? "rgba(240, 165, 0, 0.15)" : tier === 2 ? "rgba(59, 130, 246, 0.1)" : "var(--g100)",
                          color: tier === 1 ? "var(--psp-gold)" : tier === 2 ? "var(--psp-blue)" : "var(--g400)",
                        }}>
                          {tier}{suffix} Team
                        </span>
                      );
                    })() : a.category && (
                      <span style={{
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontWeight: 700,
                        background: a.category.includes("first") ? "rgba(240, 165, 0, 0.15)" : a.category.includes("second") ? "rgba(59, 130, 246, 0.1)" : "var(--g100)",
                        color: a.category.includes("first") ? "var(--psp-gold)" : a.category.includes("second") ? "var(--psp-blue)" : "var(--g400)",
                      }}>
                        {a.category.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    )}
                    {a.designation && (
                      <span style={{ fontSize: 11, color: "var(--g400)" }}>{a.designation}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================
function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ textAlign: "center", padding: 40, color: "var(--g400)", background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 600 }}>{text}</div>
    </div>
  );
}
