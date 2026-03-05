"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type TabKey = "schedule" | "roster" | "stats" | "awards";

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
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "schedule", label: "Schedule", icon: "📅" },
  { key: "roster", label: "Roster", icon: "👥" },
  { key: "stats", label: "Stats", icon: "📊" },
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
}: TeamPageTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("schedule");
  const [selectedSeason, setSelectedSeason] = useState(seasonLabels[0] || "");

  const data = useMemo(() => seasonsData[selectedSeason] || null, [seasonsData, selectedSeason]);
  const ts = data?.teamSeason;

  return (
    <>
      {/* Tab Bar */}
      <div className="school-tab-bar" style={{ "--school-color": sportColor } as React.CSSProperties}>
        <div className="stb-inner">
          {/* Season Dropdown */}
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

          {/* Tab Buttons */}
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`stb-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="stb-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Season Summary Bar */}
      {ts && (
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
        {!data ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--g400)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{sportEmoji}</div>
            <div style={{ fontWeight: 600 }}>No data for {selectedSeason}</div>
          </div>
        ) : (
          <>
            {activeTab === "schedule" && <ScheduleTab data={data} schoolSlug={schoolSlug} sportId={sportId} sportColor={sportColor} />}
            {activeTab === "roster" && <RosterTab data={data} sportId={sportId} sportColor={sportColor} />}
            {activeTab === "stats" && <StatsTab data={data} sportId={sportId} sportName={sportName} sportColor={sportColor} />}
            {activeTab === "awards" && <AwardsTab data={data} sportId={sportId} sportColor={sportColor} />}
          </>
        )}
      </div>
    </>
  );
}

// ============================================================================
// SCHEDULE TAB
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
// ROSTER TAB
// ============================================================================
function RosterTab({ data, sportId, sportColor }: { data: SeasonData; sportId: string; sportColor: string }) {
  if (!data.roster.length) {
    return <EmptyState icon="👥" text="No roster data for this season" />;
  }

  // Sport-specific column definitions
  const getColumns = () => {
    switch (sportId) {
      case "football":
        return [
          { key: "name", label: "Player", align: "left" as const },
          { key: "positions", label: "Pos", align: "center" as const },
          { key: "graduation_year", label: "Class", align: "center" as const },
          { key: "rushing_yards", label: "Rush", align: "right" as const },
          { key: "passing_yards", label: "Pass", align: "right" as const },
          { key: "receiving_yards", label: "Rec", align: "right" as const },
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

  // Smart column hiding: only show stat columns that have at least one non-null value
  const columns = allColumns.filter((col) => {
    // Always show core columns
    if (col.key === "name" || col.key === "positions" || col.key === "graduation_year") return true;
    // For stat columns, check if ANY player has a non-null, non-zero value
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
                // Generic numeric stat
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
// STATS TAB
// ============================================================================
function StatsTab({ data, sportId, sportName, sportColor }: { data: SeasonData; sportId: string; sportName: string; sportColor: string }) {
  const ts = data.teamSeason;
  const totalGames = (ts?.wins || 0) + (ts?.losses || 0) + (ts?.ties || 0);
  const winPct = totalGames > 0 ? (((ts?.wins || 0) / totalGames) * 100).toFixed(1) : null;

  // Stat leaders from roster
  const getLeaders = () => {
    if (!data.roster.length) return [];
    switch (sportId) {
      case "football":
        return [
          { label: "Rushing Leader", player: [...data.roster].sort((a: any, b: any) => (b.rushing_yards || 0) - (a.rushing_yards || 0))[0], stat: "rushing_yards", unit: "yds" },
          { label: "Passing Leader", player: [...data.roster].sort((a: any, b: any) => (b.passing_yards || 0) - (a.passing_yards || 0))[0], stat: "passing_yards", unit: "yds" },
          { label: "Receiving Leader", player: [...data.roster].sort((a: any, b: any) => (b.receiving_yards || 0) - (a.receiving_yards || 0))[0], stat: "receiving_yards", unit: "yds" },
          { label: "TD Leader", player: [...data.roster].sort((a: any, b: any) => (b.total_td || 0) - (a.total_td || 0))[0], stat: "total_td", unit: "TD" },
        ];
      case "basketball":
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

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Team Record Card */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--g400)", marginBottom: 12, letterSpacing: 1 }}>
          Team Record
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16 }}>
          <StatBlock label="Overall" value={`${ts?.wins || 0}-${ts?.losses || 0}${ts?.ties ? `-${ts.ties}` : ""}`} color="var(--text)" />
          {winPct && <StatBlock label="Win %" value={`${winPct}%`} color={sportColor} />}
          {ts?.league_wins != null && (
            <StatBlock label="League" value={`${ts.league_wins}-${ts.league_losses}`} color="var(--text)" />
          )}
          {ts?.points_for != null && <StatBlock label="Points For" value={String(ts.points_for)} color="var(--text)" />}
          {ts?.points_against != null && <StatBlock label="Points Against" value={String(ts.points_against)} color="var(--text)" />}
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
// AWARDS TAB
// ============================================================================
function AwardsTab({ data, sportId, sportColor }: { data: SeasonData; sportId: string; sportColor: string }) {
  const hasAwards = data.awards.length > 0;
  const hasChamps = data.championships.length > 0;

  if (!hasAwards && !hasChamps) {
    return <EmptyState icon="🏆" text="No awards or championships for this season" />;
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Championships */}
      {hasChamps && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--psp-gold)", marginBottom: 12, letterSpacing: 1 }}>
            Championships
          </h3>
          <div style={{ display: "grid", gap: 8 }}>
            {data.championships.map((c: any, i: number) => (
              <div key={c.id || i} style={{ padding: "10px 14px", background: "rgba(240, 165, 0, 0.08)", border: "1px solid var(--psp-gold)", borderRadius: 6, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🥇</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--psp-gold)" }}>{c.level} Championship</div>
                  <div style={{ fontSize: 11, color: "var(--g400)" }}>
                    {c.score && `${c.score} `}
                    {c.opponent?.name && `vs ${c.opponent.name}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Awards */}
      {hasAwards && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", color: "var(--g400)", marginBottom: 12, letterSpacing: 1 }}>
            Individual Awards ({data.awards.length})
          </h3>
          <div style={{ display: "grid", gap: 6 }}>
            {data.awards.map((a: any, i: number) => (
              <div key={a.id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--g100)" }}>
                <span style={{ fontSize: 16 }}>🏅</span>
                <div style={{ flex: 1 }}>
                  {a.players?.slug ? (
                    <Link href={`/${sportId}/players/${a.players.slug}`} style={{ fontWeight: 600, fontSize: 13, color: "var(--psp-blue)", textDecoration: "none" }}>
                      {a.players.name}
                    </Link>
                  ) : (
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{a.player_name || "Unknown"}</span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: sportColor, fontWeight: 600 }}>{a.award_type || a.award_name || "Award"}</span>
                <span style={{ fontSize: 11, color: "var(--g400)" }}>{a.designation || ""}</span>
              </div>
            ))}
          </div>
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
