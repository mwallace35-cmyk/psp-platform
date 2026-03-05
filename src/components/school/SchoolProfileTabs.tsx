"use client";

import { useState } from "react";
import Link from "next/link";
import PSPPromo from "@/components/ads/PSPPromo";

type TabKey = "overview" | "schedule" | "roster" | "stats" | "championships" | "news";

interface SchoolProfileTabsProps {
  school: any;
  activeSports: string[];
  allTimeRecord: { w: number; l: number; t: number; pf: number; pa: number };
  winPct: string | null;
  primaryColor: string;
  sportMeta: Record<string, any>;
  // Grouped data
  gamesBySport: Record<string, any[]>;
  champsBySport: Record<string, any[]>;
  playersBySport: Record<string, any[]>;
  seasonsBySport: Record<string, any[]>;
  awards: any[];
  proPlayers: any[];
  championships: any[];
  players: any[];
  teamSeasons: any[];
  recentGames: any[];
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "🏠" },
  { key: "schedule", label: "Schedule", icon: "📅" },
  { key: "roster", label: "Roster", icon: "👥" },
  { key: "stats", label: "Stats", icon: "📊" },
  { key: "championships", label: "Titles", icon: "🏆" },
  { key: "news", label: "News", icon: "📰" },
];

// Helper functions to replace server-side function props
function getSportName(sportMeta: Record<string, any>, id: string): string {
  return sportMeta[id]?.name || id.charAt(0).toUpperCase() + id.slice(1);
}
function getSportEmoji(sportMeta: Record<string, any>, id: string): string {
  return sportMeta[id]?.emoji || "🏅";
}

export default function SchoolProfileTabs(props: SchoolProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const { school, primaryColor } = props;
  const sportName = (id: string) => getSportName(props.sportMeta, id);
  const sportEmoji = (id: string) => getSportEmoji(props.sportMeta, id);

  return (
    <>
      {/* Sticky Tab Bar */}
      <div className="school-tab-bar" style={{ "--school-color": primaryColor } as React.CSSProperties}>
        <div className="stb-inner">
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

      {/* Tab Content */}
      <div className="espn-container" style={{ paddingTop: 20 }}>
        <main>
          {activeTab === "overview" && <OverviewTab {...props} />}
          {activeTab === "schedule" && <ScheduleTab {...props} />}
          {activeTab === "roster" && <RosterTab {...props} />}
          {activeTab === "stats" && <StatsTab {...props} />}
          {activeTab === "championships" && <ChampionshipsTab {...props} />}
          {activeTab === "news" && <NewsTab school={school} />}
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* School Info Widget */}
          <div className="widget">
            <div className="w-head" style={{ background: primaryColor }}>
              {school.short_name || school.name}
            </div>
            <div className="w-body">
              <div className="w-row"><span className="name">Location</span><span className="val">{school.city}, {school.state}</span></div>
              {school.leagues && <div className="w-row"><span className="name">League</span><span className="val">{school.leagues?.name}</span></div>}
              {school.mascot && <div className="w-row"><span className="name">Mascot</span><span className="val">{school.mascot}</span></div>}
              <div className="w-row"><span className="name">Sports</span><span className="val">{props.activeSports.length}</span></div>
              <div className="w-row"><span className="name">Record</span><span className="val">{props.allTimeRecord.w}-{props.allTimeRecord.l}{props.allTimeRecord.t > 0 ? `-${props.allTimeRecord.t}` : ""}</span></div>
              {props.winPct && <div className="w-row"><span className="name">Win %</span><span className="val" style={{ color: Number(props.winPct) >= 60 ? "var(--psp-gold)" : "inherit" }}>{props.winPct}%</span></div>}
            </div>
          </div>

          {/* Next Level Alumni */}
          {props.proPlayers.length > 0 && (
            <div className="widget">
              <div className="w-head">Next Level Alumni</div>
              <div className="w-body" style={{ padding: 0 }}>
                {props.proPlayers.slice(0, 6).map((p: any) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderBottom: "1px solid var(--g100)", fontSize: 12 }}>
                    <span>{getSportEmoji(props.sportMeta, p.sport)}</span>
                    <Link href={`/${p.sport}/players/${p.slug}`} style={{ fontWeight: 600, color: "var(--link)", textDecoration: "none", flex: 1 }}>{p.name}</Link>
                    <span style={{ fontSize: 11, color: p.pro_team ? "var(--psp-gold)" : "var(--g400)" }}>{p.pro_team || p.college}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="widget">
            <div className="w-head">Quick Links</div>
            <div className="w-body">
              <Link href={`/search?q=${encodeURIComponent(school.name)}`} className="w-link">&#8594; Search Players</Link>
              <Link href="/schools" className="w-link">&#8594; All Schools</Link>
              {props.activeSports.map((sid: string) => (
                <Link key={sid} href={`/${sid}`} className="w-link">&#8594; {getSportName(props.sportMeta, sid)} Hub</Link>
              ))}
            </div>
          </div>

          <PSPPromo size="sidebar" variant={2} />
        </aside>
      </div>
    </>
  );
}

/* ─── OVERVIEW TAB ─── */
function OverviewTab(props: SchoolProfileTabsProps) {
  const { school, activeSports, allTimeRecord, winPct, primaryColor, sportMeta, gamesBySport, champsBySport, playersBySport, seasonsBySport, championships, awards } = props;
  const sportName = (id: string) => getSportName(sportMeta, id);
  const sportEmoji = (id: string) => getSportEmoji(sportMeta, id);

  return (
    <>
      {/* Stat Summary Cards */}
      <div className="hub-stat-row">
        {[
          { label: "All-Time Record", value: `${allTimeRecord.w}-${allTimeRecord.l}${allTimeRecord.t > 0 ? `-${allTimeRecord.t}` : ""}`, icon: "📊" },
          { label: "Championships", value: String(championships.length), icon: "🏆" },
          { label: "Sports", value: String(activeSports.length), icon: "🏅" },
          { label: "Win %", value: winPct ? `${winPct}%` : "—", icon: "📈" },
        ].map((stat) => (
          <div key={stat.label} className="hub-stat-card" style={{ borderTopColor: primaryColor }}>
            <div className="hub-stat-icon">{stat.icon}</div>
            <div className="hub-stat-value">{stat.value}</div>
            <div className="hub-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Per-Sport Summaries */}
      {activeSports.map((sid) => {
        const sportGames = gamesBySport[sid] || [];
        const sportChamps = champsBySport[sid] || [];
        const sportPlayers = playersBySport[sid] || [];
        const sportSeasons = seasonsBySport[sid] || [];
        const sportRecord = sportSeasons.reduce(
          (acc: { w: number; l: number; t: number }, ts: any) => ({
            w: acc.w + (ts.wins || 0), l: acc.l + (ts.losses || 0), t: acc.t + (ts.ties || 0),
          }), { w: 0, l: 0, t: 0 }
        );

        return (
          <div key={sid} className="sport-section" style={{ borderLeftColor: props.sportMeta[sid]?.color || primaryColor }}>
            <div className="sport-section-head">
              <span style={{ fontSize: 22 }}>{sportEmoji(sid)}</span>
              <h3>{sportName(sid)}</h3>
              <span className="sport-section-record">
                {sportRecord.w}-{sportRecord.l}{sportRecord.t > 0 ? `-${sportRecord.t}` : ""} all-time
              </span>
              {sportChamps.length > 0 && (
                <span className="sport-section-titles">🏆 {sportChamps.length}</span>
              )}
            </div>

            {/* Recent Games Preview */}
            {sportGames.length > 0 && (
              <div className="sport-section-body">
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--g400)", marginBottom: 8 }}>Recent Games</div>
                {sportGames.slice(0, 3).map((g: any) => {
                  const isHome = g.home_school_id === school.id;
                  const opp = isHome ? g.away_school : g.home_school;
                  const ourScore = isHome ? g.home_score : g.away_score;
                  const theirScore = isHome ? g.away_score : g.home_score;
                  const won = ourScore != null && theirScore != null ? ourScore > theirScore : null;
                  return (
                    <div key={g.id} className="game-mini-row">
                      <span className="gmr-date">{g.game_date ? new Date(g.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                      <span className={`gmr-result ${won === true ? "gmr-win" : won === false ? "gmr-loss" : ""}`}>{won === true ? "W" : won === false ? "L" : ""}</span>
                      <span className="gmr-opp">
                        {isHome ? "vs" : "@"}{" "}
                        {opp ? <Link href={`/schools/${opp.slug}`}>{opp.name}</Link> : "—"}
                      </span>
                      <span className="gmr-score">{ourScore ?? "-"}-{theirScore ?? "-"}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Top Players Preview */}
            {sportPlayers.length > 0 && (
              <div className="sport-section-body">
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--g400)", marginBottom: 8 }}>Notable Players</div>
                {sportPlayers.slice(0, 3).map((p: any) => (
                  <div key={p.id} className="player-mini-row">
                    <Link href={`/${sid}/players/${p.slug}`}>{p.name}</Link>
                    <span className="pmr-info">
                      {sid === "football" && p.total_stats?.total_td > 0 && `${p.total_stats.total_td} TDs`}
                      {sid === "basketball" && p.total_stats?.points > 0 && `${p.total_stats.points.toLocaleString()} pts`}
                    </span>
                    {(p.pro_team || p.college) && (
                      <span className="pmr-next">{p.pro_team || p.college}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Awards Summary */}
      {awards.length > 0 && (
        <>
          <div className="sec-head"><h2>Awards &amp; Honors ({awards.length})</h2></div>
          <div className="dynasty-bar">
            {awards.slice(0, 10).map((a: any, i: number) => (
              <div key={a.id || i} className="dynasty-item">
                <span className="dynasty-rank" style={{ background: "var(--psp-gold)", fontSize: 12 }}>🏅</span>
                <span className="dynasty-name" style={{ fontSize: 13 }}>
                  {a.award_name || a.award_type || a.category || "Award"}
                  {a.players?.name && (
                    <Link href={`/football/players/${a.players.slug}`} style={{ marginLeft: 6, fontSize: 12, color: "var(--link)" }}>{a.players.name}</Link>
                  )}
                </span>
                <span style={{ fontSize: 11, color: "var(--g400)" }}>{a.seasons?.label || ""}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ─── SCHEDULE TAB ─── */
function ScheduleTab(props: SchoolProfileTabsProps) {
  const { school, activeSports, gamesBySport, sportMeta } = props;
  const sportName = (id: string) => getSportName(sportMeta, id);
  const sportEmoji = (id: string) => getSportEmoji(sportMeta, id);

  return (
    <>
      {activeSports.map((sid) => {
        const games = gamesBySport[sid] || [];
        if (games.length === 0) return null;
        return (
          <div key={sid} style={{ marginBottom: 24 }}>
            <div className="sec-head"><h2>{sportEmoji(sid)} {sportName(sid)} Schedule</h2></div>
            <div className="schedule-list">
              {games.map((g: any, i: number) => {
                const isHome = g.home_school_id === school.id;
                const opp = isHome ? g.away_school : g.home_school;
                const ourScore = isHome ? g.home_score : g.away_score;
                const theirScore = isHome ? g.away_score : g.home_score;
                const won = ourScore != null && theirScore != null ? ourScore > theirScore : null;
                return (
                  <div key={g.id || i} className="sched-row">
                    <div className="sched-date">
                      {g.game_date ? new Date(g.game_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </div>
                    <div className="sched-matchup">
                      <span style={{ fontSize: 10, color: "var(--g400)", marginRight: 4 }}>{isHome ? "vs" : "@"}</span>
                      {opp ? <Link href={`/schools/${opp.slug}`} style={{ fontWeight: won ? 800 : 500, color: "var(--text)", textDecoration: "none" }}>{opp.name}</Link> : "—"}
                    </div>
                    <div className="sched-status">
                      {won !== null && (
                        <span style={{ fontWeight: 800, color: won ? "#22c55e" : "#ef4444", marginRight: 6 }}>{won ? "W" : "L"}</span>
                      )}
                      {ourScore ?? "-"}-{theirScore ?? "-"}
                      {g.seasons?.label ? ` · ${g.seasons.label}` : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ─── ROSTER TAB ─── */
function RosterTab(props: SchoolProfileTabsProps) {
  const { activeSports, playersBySport, sportMeta, primaryColor } = props;
  const sportName = (id: string) => getSportName(sportMeta, id);
  const sportEmoji = (id: string) => getSportEmoji(sportMeta, id);

  return (
    <>
      {activeSports.map((sid) => {
        const players = playersBySport[sid] || [];
        if (players.length === 0) return null;
        return (
          <div key={sid} style={{ marginBottom: 24 }}>
            <div className="sec-head"><h2>{sportEmoji(sid)} {sportName(sid)} Players ({players.length})</h2></div>
            <div className="standings-table">
              <div className="st-league-head" style={{ borderLeftColor: primaryColor }}>{sportName(sid)} Roster</div>
              <div className="st-header" style={{ gridTemplateColumns: "1fr 100px 80px 100px" }}>
                <span>Player</span>
                <span>Years</span>
                <span style={{ textAlign: "center" }}>Key Stat</span>
                <span>Next Level</span>
              </div>
              {players.map((p: any, i: number) => {
                let keyStat = "";
                if (sid === "football") {
                  const total = (p.total_stats?.rush_yards || 0) + (p.total_stats?.pass_yards || 0);
                  if (total > 0) keyStat = `${total.toLocaleString()} yds`;
                  if (p.total_stats?.total_td > 0) keyStat += ` / ${p.total_stats.total_td} TD`;
                } else if (sid === "basketball") {
                  if (p.total_stats?.points > 0) keyStat = `${p.total_stats.points.toLocaleString()} pts`;
                }
                return (
                  <div key={p.id} className={`st-row ${i < 3 ? "st-top" : ""}`} style={{ gridTemplateColumns: "1fr 100px 80px 100px", "--sport-color": primaryColor } as React.CSSProperties}>
                    <span className="st-team">
                      <Link href={`/${sid}/players/${p.slug}`}>{p.name}</Link>
                    </span>
                    <span style={{ fontSize: 11, color: "var(--g400)" }}>
                      {p.years?.length > 0 ? (p.years.length > 2 ? `${p.years[p.years.length - 1]}–${p.years[0]}` : p.years.join(", ")) : "—"}
                    </span>
                    <span style={{ textAlign: "center", fontSize: 12, fontWeight: 600 }}>{keyStat || "—"}</span>
                    <span style={{ fontSize: 11, color: p.pro_team ? "var(--psp-gold)" : "var(--g400)" }}>{p.pro_team || p.college || "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ─── STATS TAB ─── */
function StatsTab(props: SchoolProfileTabsProps) {
  const { school, activeSports, seasonsBySport, sportMeta, primaryColor } = props;
  const sportName = (id: string) => getSportName(sportMeta, id);
  const sportEmoji = (id: string) => getSportEmoji(sportMeta, id);

  return (
    <>
      {activeSports.map((sid) => {
        const seasons = seasonsBySport[sid] || [];
        if (seasons.length === 0) return null;
        return (
          <div key={sid} style={{ marginBottom: 24 }}>
            <div className="sec-head"><h2>{sportEmoji(sid)} {sportName(sid)} Season-by-Season</h2></div>
            <div className="standings-table">
              <div className="st-league-head" style={{ borderLeftColor: primaryColor }}>
                {sportName(sid)} Results ({seasons.length} seasons)
              </div>
              <div className="st-header" style={{ gridTemplateColumns: "100px 50px 50px 50px 60px 60px 1fr" }}>
                <span>Season</span>
                <span style={{ textAlign: "center" }}>W</span>
                <span style={{ textAlign: "center" }}>L</span>
                <span style={{ textAlign: "center" }}>T</span>
                <span style={{ textAlign: "center" }}>PF</span>
                <span style={{ textAlign: "center" }}>PA</span>
                <span>Playoff</span>
              </div>
              {seasons.map((ts: any, i: number) => (
                <div key={ts.id} className="st-row" style={{ gridTemplateColumns: "100px 50px 50px 50px 60px 60px 1fr" }}>
                  <span>
                    {ts.seasons?.label ? (
                      <Link href={`/schools/${school.slug}/${sid}/${ts.seasons.label}`} style={{ color: "var(--link)", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>{ts.seasons.label}</Link>
                    ) : "—"}
                  </span>
                  <span style={{ textAlign: "center" }}>{ts.wins ?? "—"}</span>
                  <span style={{ textAlign: "center" }}>{ts.losses ?? "—"}</span>
                  <span style={{ textAlign: "center" }}>{ts.ties ?? "—"}</span>
                  <span style={{ textAlign: "center" }}>{ts.points_for ?? "—"}</span>
                  <span style={{ textAlign: "center" }}>{ts.points_against ?? "—"}</span>
                  <span style={{ fontSize: 12, color: "var(--g400)" }}>{ts.playoff_result || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ─── CHAMPIONSHIPS TAB ─── */
function ChampionshipsTab(props: SchoolProfileTabsProps) {
  const { championships, primaryColor, activeSports, champsBySport, sportMeta } = props;
  const sportName = (id: string) => getSportName(sportMeta, id);
  const sportEmoji = (id: string) => getSportEmoji(sportMeta, id);

  if (championships.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--g400)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 22 }}>No championships recorded</h3>
        <p style={{ fontSize: 14 }}>Championship data will appear as records are verified.</p>
      </div>
    );
  }

  return (
    <>
      <div className="sec-head"><h2>🏆 {championships.length} Championships</h2></div>
      {activeSports.map((sid) => {
        const champs = champsBySport[sid] || [];
        if (champs.length === 0) return null;
        return (
          <div key={sid} style={{ marginBottom: 24 }}>
            <div className="rank-table">
              <div className="rt-head" style={{ background: primaryColor }}>
                {sportEmoji(sid)} {sportName(sid)} ({champs.length} titles)
              </div>
              {champs.map((c: any, i: number) => (
                <div key={c.id || i} className="rt-row">
                  <div className="rt-num" style={{ background: "var(--psp-gold)" }}>🏆</div>
                  <div className="rt-info">
                    <span className="rname">{c.seasons?.label || ""}</span>
                    <div className="rsub">
                      {c.level}
                      {c.leagues?.name ? ` — ${c.leagues.name}` : ""}
                      {c.score ? ` (${c.score})` : ""}
                      {c.opponent?.name ? ` vs ${c.opponent.name}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ─── NEWS TAB ─── */
function NewsTab({ school }: { school: any }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--g400)" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📰</div>
      <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 22 }}>School News</h3>
      <p style={{ fontSize: 14, marginBottom: 16 }}>Articles related to {school.name} will appear here.</p>
      <Link href={`/search?q=${encodeURIComponent(school.name)}`} style={{ color: "var(--link)", fontWeight: 700 }}>
        Search for {school.name} Articles &#8594;
      </Link>
    </div>
  );
}
