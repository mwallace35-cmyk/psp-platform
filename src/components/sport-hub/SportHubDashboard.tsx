"use client";

import { useState } from "react";
import Link from "next/link";
import PSPPromo from "@/components/ads/PSPPromo";

type TabType = "home" | "standings" | "leaders" | "schedule" | "schools" | "championships";

interface SportHubDashboardProps {
  sport: string;
  sportColor: string;
  meta: { name: string; emoji: string; color: string; statCategories: string[] };
  overview: { players: number; schools: number; seasons: number; championships: number };
  champions: any[];
  schools: any[];
  featured: any[];
  freshness: any;
  standings: any[];
  recentGames: any[];
}

const TABS: { key: TabType; label: string; icon: string }[] = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "standings", label: "Standings", icon: "📊" },
  { key: "leaders", label: "Leaders", icon: "🏅" },
  { key: "schedule", label: "Schedule", icon: "📅" },
  { key: "schools", label: "Schools", icon: "🏫" },
  { key: "championships", label: "Titles", icon: "🏆" },
];

export default function SportHubDashboard({
  sport,
  sportColor,
  meta,
  overview,
  champions,
  schools,
  featured,
  freshness,
  standings,
  recentGames,
}: SportHubDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  return (
    <>
      {/* Tab Navigation */}
      <div className="hub-tabs">
        <div className="hub-tabs-inner">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`hub-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              style={{ "--sport-color": sportColor } as React.CSSProperties}
            >
              <span className="hub-tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="espn-container">
        <main>
          {activeTab === "home" && (
            <HomeTab
              sport={sport}
              sportColor={sportColor}
              meta={meta}
              overview={overview}
              champions={champions}
              schools={schools}
              featured={featured}
              standings={standings}
              recentGames={recentGames}
            />
          )}
          {activeTab === "standings" && (
            <StandingsTab sport={sport} sportColor={sportColor} meta={meta} standings={standings} />
          )}
          {activeTab === "leaders" && (
            <LeadersTab sport={sport} sportColor={sportColor} meta={meta} />
          )}
          {activeTab === "schedule" && (
            <ScheduleTab sport={sport} sportColor={sportColor} meta={meta} recentGames={recentGames} />
          )}
          {activeTab === "schools" && (
            <SchoolsTab sport={sport} sportColor={sportColor} meta={meta} schools={schools} standings={standings} />
          )}
          {activeTab === "championships" && (
            <ChampionshipsTab sport={sport} sportColor={sportColor} meta={meta} champions={champions} />
          )}
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          {freshness && (
            <div style={{ padding: "8px 12px", background: "var(--g100)", borderLeft: `3px solid ${sportColor}`, marginBottom: 16, borderRadius: 3 }}>
              <div style={{ fontSize: 10, color: "var(--g400)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>
                {freshness.source ? `Source: ${freshness.source}` : "Data updated"}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="widget">
            <div className="w-head" style={{ background: sportColor }}>{meta.emoji} {meta.name} Database</div>
            <div className="w-body">
              <div className="w-row"><span className="name">Players</span><span className="val">{overview.players.toLocaleString()}</span></div>
              <div className="w-row"><span className="name">Schools</span><span className="val">{overview.schools.toLocaleString()}</span></div>
              <div className="w-row"><span className="name">Seasons</span><span className="val">{overview.seasons.toLocaleString()}</span></div>
              <div className="w-row"><span className="name">Championships</span><span className="val">{overview.championships.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Recent Scores Widget */}
          {recentGames.length > 0 && (
            <div className="widget">
              <div className="w-head">Recent Scores</div>
              <div className="w-body" style={{ padding: 0 }}>
                {recentGames.slice(0, 5).map((game: any, i: number) => {
                  const homeWin = (game.home_score ?? 0) > (game.away_score ?? 0);
                  return (
                    <div key={game.id || i} className="score-mini">
                      <div className={`score-team ${homeWin ? "winner" : ""}`}>
                        <Link href={`/schools/${game.home_school?.slug || "#"}`}>{game.home_school?.name || "Home"}</Link>
                        <span className="score-num">{game.home_score ?? "-"}</span>
                      </div>
                      <div className={`score-team ${!homeWin ? "winner" : ""}`}>
                        <Link href={`/schools/${game.away_school?.slug || "#"}`}>{game.away_school?.name || "Away"}</Link>
                        <span className="score-num">{game.away_score ?? "-"}</span>
                      </div>
                      {game.game_date && (
                        <div className="score-date">
                          {new Date(game.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="widget">
            <div className="w-head">Quick Links</div>
            <div className="w-body">
              <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="w-link">&#8594; Leaderboards</Link>
              <Link href={`/${sport}/championships`} className="w-link">&#8594; Championships</Link>
              <Link href={`/${sport}/records`} className="w-link">&#8594; Records</Link>
              <Link href={`/search?sport=${sport}`} className="w-link">&#8594; Search Players</Link>
              <Link href="/compare" className="w-link">&#8594; Compare Players</Link>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={1} />
        </aside>
      </div>
    </>
  );
}

/* ─── HOME TAB ─── */
function HomeTab({
  sport,
  sportColor,
  meta,
  overview,
  champions,
  schools,
  featured,
  standings,
  recentGames,
}: {
  sport: string;
  sportColor: string;
  meta: any;
  overview: any;
  champions: any[];
  schools: any[];
  featured: any[];
  standings: any[];
  recentGames: any[];
}) {
  const topStory = featured?.[0];
  const moreStories = featured?.slice(1) || [];

  // Group standings by league for mini-standings
  const leagueGroups: Record<string, any[]> = {};
  for (const team of standings) {
    const league = team.league || "Other";
    if (!leagueGroups[league]) leagueGroups[league] = [];
    leagueGroups[league].push(team);
  }
  // Sort each league by wins desc
  for (const league of Object.keys(leagueGroups)) {
    leagueGroups[league].sort((a: any, b: any) => b.totalWins - a.totalWins);
  }
  const topLeague = Object.keys(leagueGroups)[0];

  return (
    <>
      {/* Stat Cards Row */}
      <div className="hub-stat-row">
        {[
          { label: "Players", value: overview.players, icon: "👤" },
          { label: "Schools", value: overview.schools, icon: "🏫" },
          { label: "Seasons", value: overview.seasons, icon: "📅" },
          { label: "Titles", value: overview.championships, icon: "🏆" },
        ].map((stat) => (
          <div key={stat.label} className="hub-stat-card" style={{ borderTopColor: sportColor }}>
            <div className="hub-stat-icon">{stat.icon}</div>
            <div className="hub-stat-value">{stat.value.toLocaleString()}</div>
            <div className="hub-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Featured Story */}
      {topStory ? (
        <Link href={`/articles/${topStory.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="hub-hero" style={{
            background: topStory.featured_image_url
              ? `url(${topStory.featured_image_url}) center / cover`
              : `linear-gradient(135deg, ${meta.color}cc 0%, var(--psp-navy) 100%)`,
          }}>
            <div className="hub-hero-overlay" />
            <div className="hub-hero-tag" style={{ background: sportColor }}>FEATURED</div>
            <div className="hub-hero-content">
              <h2>{topStory.title}</h2>
              {topStory.excerpt && <p>{topStory.excerpt}</p>}
              <div className="hub-hero-date">
                {topStory.published_at
                  ? new Date(topStory.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : ""}
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="hub-hero" style={{ background: `linear-gradient(180deg, ${meta.color}88 0%, var(--psp-navy) 100%)` }}>
          <div className="hub-hero-overlay" />
          <div className="hub-hero-content">
            <h2>Philadelphia High School {meta.name}</h2>
            <p>{overview.players.toLocaleString()} players and {overview.schools.toLocaleString()} schools tracked</p>
          </div>
        </div>
      )}

      {/* Game Carousel */}
      {recentGames.length > 0 && (
        <>
          <div className="sec-head"><h2>Recent Scores</h2></div>
          <div className="game-carousel">
            {recentGames.slice(0, 8).map((game: any, i: number) => {
              const homeWin = (game.home_score ?? 0) > (game.away_score ?? 0);
              return (
                <div key={game.id || i} className="game-card" style={{ borderTopColor: sportColor }}>
                  <div className={`gc-team ${homeWin ? "gc-winner" : ""}`}>
                    <Link href={`/schools/${game.home_school?.slug || "#"}`}>{game.home_school?.name || "Home"}</Link>
                    <span className="gc-score">{game.home_score ?? "-"}</span>
                  </div>
                  <div className={`gc-team ${!homeWin ? "gc-winner" : ""}`}>
                    <Link href={`/schools/${game.away_school?.slug || "#"}`}>{game.away_school?.name || "Away"}</Link>
                    <span className="gc-score">{game.away_score ?? "-"}</span>
                  </div>
                  <div className="gc-meta">
                    {game.game_date
                      ? new Date(game.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : ""}
                    {game.status === "final" ? " · Final" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Mini Standings Snippet */}
      {topLeague && leagueGroups[topLeague] && (
        <>
          <div className="sec-head">
            <h2>{topLeague} Standings</h2>
            <button className="more" onClick={() => {/* handled by parent tab switch */}} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--link)", fontWeight: 600, fontSize: 12 }}>
              Full Standings &#8594;
            </button>
          </div>
          <div className="standings-mini">
            <div className="sm-header">
              <span className="sm-rank">#</span>
              <span className="sm-name">Team</span>
              <span className="sm-stat">W</span>
              <span className="sm-stat">L</span>
              <span className="sm-stat">T</span>
            </div>
            {leagueGroups[topLeague].slice(0, 8).map((team: any, i: number) => (
              <div key={team.school?.id || i} className="sm-row">
                <span className="sm-rank" style={{ color: i < 3 ? sportColor : "var(--g400)" }}>{i + 1}</span>
                <span className="sm-name">
                  <Link href={`/schools/${team.school?.slug || "#"}`}>{team.school?.name || "Unknown"}</Link>
                </span>
                <span className="sm-stat">{team.totalWins}</span>
                <span className="sm-stat">{team.totalLosses}</span>
                <span className="sm-stat">{team.totalTies || 0}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* More Stories */}
      {moreStories.length > 0 && (
        <>
          <div className="sec-head">
            <h2>Latest {meta.name} Stories</h2>
            <Link href="/articles" className="more">All Articles &#8594;</Link>
          </div>
          <div className="stories">
            {moreStories.map((article: any) => (
              <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="story">
                  <div className="s-img" style={{
                    background: article.featured_image_url
                      ? `url(${article.featured_image_url}) center / cover`
                      : `linear-gradient(135deg, ${meta.color}66, var(--psp-navy))`,
                  }} />
                  <div className="s-body">
                    <div className="s-tag" style={{ color: sportColor }}>{meta.name}</div>
                    <h4>{article.title}</h4>
                    <p>{article.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Quick Nav Cards */}
      <div className="sec-head"><h2>Explore {meta.name}</h2></div>
      <div className="ldr-grid">
        <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="ldr-card hover-lift" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="ldr-head" style={{ background: sportColor }}>Leaderboards</div>
          <div style={{ padding: "12px" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>📊</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Top performers by stat</div>
            <div style={{ fontSize: 11, color: "var(--g400)" }}>{meta.statCategories.join(", ")}</div>
          </div>
        </Link>
        <Link href={`/${sport}/records`} className="ldr-card hover-lift" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="ldr-head" style={{ background: sportColor }}>Records</div>
          <div style={{ padding: "12px" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🏅</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>All-time records</div>
            <div style={{ fontSize: 11, color: "var(--g400)" }}>Single-season &amp; career</div>
          </div>
        </Link>
        <Link href={`/${sport}/championships`} className="ldr-card hover-lift" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="ldr-head" style={{ background: sportColor }}>Championships</div>
          <div style={{ padding: "12px" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🏆</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Title history</div>
            <div style={{ fontSize: 11, color: "var(--g400)" }}>League, state, national</div>
          </div>
        </Link>
      </div>

      {/* Schools Quick Access */}
      {schools.length > 0 && (
        <>
          <div className="sec-head"><h2>Schools</h2></div>
          <div className="school-pills">
            {schools.slice(0, 20).map((school: any) => (
              <Link key={school.id} href={`/schools/${school.slug}`} className="school-pill">
                {school.name}
              </Link>
            ))}
            {schools.length > 20 && (
              <span className="school-pill" style={{ color: "var(--psp-gold)", borderColor: "var(--psp-gold)" }}>
                +{schools.length - 20} more
              </span>
            )}
          </div>
        </>
      )}
    </>
  );
}

/* ─── STANDINGS TAB ─── */
function StandingsTab({ sport, sportColor, meta, standings }: { sport: string; sportColor: string; meta: any; standings: any[] }) {
  // Group by league
  const leagueGroups: Record<string, any[]> = {};
  for (const team of standings) {
    const league = team.league || "Other";
    if (!leagueGroups[league]) leagueGroups[league] = [];
    leagueGroups[league].push(team);
  }
  for (const league of Object.keys(leagueGroups)) {
    leagueGroups[league].sort((a: any, b: any) => b.totalWins - a.totalWins);
  }

  if (standings.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--g400)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
        <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 22 }}>No standings data available</h3>
        <p style={{ fontSize: 14 }}>Standings will appear as team season records are added.</p>
      </div>
    );
  }

  return (
    <>
      <div className="sec-head"><h2>{meta.name} Standings</h2></div>
      {Object.entries(leagueGroups).map(([league, teams]) => (
        <div key={league} className="standings-table" style={{ marginBottom: 24 }}>
          <div className="st-league-head" style={{ borderLeftColor: sportColor }}>
            {league}
            <span className="st-count">{teams.length} teams</span>
          </div>
          <div className="st-header">
            <span className="st-rank">#</span>
            <span className="st-team">Team</span>
            <span className="st-w">W</span>
            <span className="st-l">L</span>
            <span className="st-t">T</span>
            <span className="st-pct">Win%</span>
            <span className="st-champ">🏆</span>
          </div>
          {teams.map((team: any, i: number) => {
            const total = team.totalWins + team.totalLosses + team.totalTies;
            const pct = total > 0 ? ((team.totalWins / total) * 100).toFixed(1) : "0.0";
            return (
              <div key={team.school?.id || i} className={`st-row ${i < 3 ? "st-top" : ""}`} style={i < 3 ? { "--sport-color": sportColor } as React.CSSProperties : undefined}>
                <span className="st-rank">{i + 1}</span>
                <span className="st-team">
                  <Link href={`/schools/${team.school?.slug || "#"}`}>{team.school?.name || "Unknown"}</Link>
                  {team.school?.city && <span className="st-city">{team.school.city}</span>}
                </span>
                <span className="st-w">{team.totalWins}</span>
                <span className="st-l">{team.totalLosses}</span>
                <span className="st-t">{team.totalTies || 0}</span>
                <span className="st-pct">{pct}%</span>
                <span className="st-champ">{team.championships > 0 ? team.championships : ""}</span>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}

/* ─── LEADERS TAB ─── */
function LeadersTab({ sport, sportColor, meta }: { sport: string; sportColor: string; meta: any }) {
  return (
    <>
      <div className="sec-head"><h2>{meta.name} Stat Leaders</h2></div>
      <div className="leaders-grid">
        {meta.statCategories.map((cat: string) => (
          <Link
            key={cat}
            href={`/${sport}/leaderboards/${cat}`}
            className="leader-card hover-lift"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="lc-header" style={{ background: sportColor }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ")}
            </div>
            <div className="lc-body">
              <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ")} Leaders
              </div>
              <div style={{ fontSize: 12, color: "var(--g400)", marginTop: 4 }}>
                View full leaderboard &#8594;
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Link href={`/${sport}/records`} style={{ fontWeight: 700, fontSize: 14, color: "var(--link)" }}>
          View All-Time Records &#8594;
        </Link>
      </div>
    </>
  );
}

/* ─── SCHEDULE TAB ─── */
function ScheduleTab({ sport, sportColor, meta, recentGames }: { sport: string; sportColor: string; meta: any; recentGames: any[] }) {
  if (recentGames.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--g400)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
        <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 22 }}>No game data available</h3>
        <p style={{ fontSize: 14 }}>Game scores will appear as data is added.</p>
      </div>
    );
  }

  return (
    <>
      <div className="sec-head"><h2>Recent {meta.name} Games</h2></div>
      <div className="schedule-list">
        {recentGames.map((game: any, i: number) => {
          const homeWin = (game.home_score ?? 0) > (game.away_score ?? 0);
          const gameDate = game.game_date
            ? new Date(game.game_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
            : "";
          return (
            <div key={game.id || i} className="sched-row">
              <div className="sched-date">{gameDate}</div>
              <div className="sched-matchup">
                <div className={`sched-team ${homeWin ? "sched-winner" : ""}`}>
                  <Link href={`/schools/${game.home_school?.slug || "#"}`}>{game.home_school?.name || "Home"}</Link>
                  <span className="sched-score">{game.home_score ?? "-"}</span>
                </div>
                <div className="sched-vs">vs</div>
                <div className={`sched-team ${!homeWin ? "sched-winner" : ""}`}>
                  <Link href={`/schools/${game.away_school?.slug || "#"}`}>{game.away_school?.name || "Away"}</Link>
                  <span className="sched-score">{game.away_score ?? "-"}</span>
                </div>
              </div>
              <div className="sched-status">
                {game.status === "final" ? "Final" : game.status || ""}
                {game.seasons?.label ? ` · ${game.seasons.label}` : ""}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─── SCHOOLS TAB ─── */
function SchoolsTab({ sport, sportColor, meta, schools, standings }: { sport: string; sportColor: string; meta: any; schools: any[]; standings: any[] }) {
  // Build a record lookup from standings
  const recordMap = new Map<number, { wins: number; losses: number; ties: number; championships: number }>();
  for (const t of standings) {
    if (t.school?.id) {
      recordMap.set(t.school.id, { wins: t.totalWins, losses: t.totalLosses, ties: t.totalTies, championships: t.championships });
    }
  }

  return (
    <>
      <div className="sec-head"><h2>{meta.name} Schools</h2></div>
      <div className="schools-grid">
        {schools.map((school: any) => {
          const record = recordMap.get(school.id);
          return (
            <Link key={school.id} href={`/schools/${school.slug}`} className="school-card hover-lift" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="sc-header" style={{ borderLeftColor: sportColor }}>
                <h4>{school.name}</h4>
                <div className="sc-city">{school.city || "Philadelphia"}, {school.state || "PA"}</div>
              </div>
              {record && (
                <div className="sc-stats">
                  <div className="sc-stat">
                    <span className="sc-val">{record.wins}-{record.losses}{record.ties ? `-${record.ties}` : ""}</span>
                    <span className="sc-lbl">All-Time</span>
                  </div>
                  {record.championships > 0 && (
                    <div className="sc-stat">
                      <span className="sc-val" style={{ color: "var(--psp-gold)" }}>🏆 {record.championships}</span>
                      <span className="sc-lbl">Titles</span>
                    </div>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}

/* ─── CHAMPIONSHIPS TAB ─── */
function ChampionshipsTab({ sport, sportColor, meta, champions }: { sport: string; sportColor: string; meta: any; champions: any[] }) {
  // Group by level
  const levelGroups: Record<string, any[]> = {};
  for (const champ of champions) {
    const level = champ.level || "Other";
    if (!levelGroups[level]) levelGroups[level] = [];
    levelGroups[level].push(champ);
  }

  // Dynasty tracker: count titles per school
  const dynastyMap = new Map<string, { name: string; slug: string; count: number }>();
  for (const champ of champions) {
    const name = champ.schools?.name || "Unknown";
    const slug = champ.schools?.slug || "#";
    const key = slug;
    if (!dynastyMap.has(key)) dynastyMap.set(key, { name, slug, count: 0 });
    dynastyMap.get(key)!.count++;
  }
  const dynasties = Array.from(dynastyMap.values()).sort((a, b) => b.count - a.count).slice(0, 10);

  if (champions.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--g400)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <h3 style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 22 }}>No championship data available</h3>
        <p style={{ fontSize: 14 }}>Championship records will appear as data is added.</p>
      </div>
    );
  }

  return (
    <>
      {/* Dynasty Tracker */}
      <div className="sec-head"><h2>Dynasty Tracker</h2></div>
      <div className="dynasty-bar">
        {dynasties.map((d, i) => (
          <Link key={d.slug} href={`/schools/${d.slug}`} className="dynasty-item" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="dynasty-rank" style={{ background: i < 3 ? sportColor : "var(--g300)" }}>{i + 1}</span>
            <span className="dynasty-name">{d.name}</span>
            <span className="dynasty-count" style={{ color: sportColor }}>{d.count} 🏆</span>
          </Link>
        ))}
      </div>

      {/* Championships by Level */}
      {Object.entries(levelGroups).map(([level, champs]) => (
        <div key={level} style={{ marginBottom: 24 }}>
          <div className="sec-head"><h2>{level}</h2></div>
          <div className="rank-table">
            <div className="rt-head" style={{ background: sportColor }}>{level} Championships</div>
            {champs.map((champ: any, i: number) => (
              <div key={champ.id || i} className="rt-row">
                <div className="rt-num" style={{ background: i < 3 ? "var(--psp-gold)" : "var(--g300)" }}>
                  {champ.seasons?.label ? champ.seasons.label.split("-")[0] : ""}
                </div>
                <div className="rt-info">
                  <Link href={`/schools/${champ.schools?.slug || "#"}`} className="rname" style={{ color: "var(--link)" }}>
                    {champ.schools?.name || "Unknown"}
                  </Link>
                  <div className="rsub">
                    {champ.seasons?.label || ""}
                    {champ.score ? ` · ${champ.score}` : ""}
                    {champ.opponent?.name ? ` vs ${champ.opponent.name}` : ""}
                  </div>
                </div>
                <div className="rt-rec">🏆</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Link href={`/${sport}/championships`} style={{ fontWeight: 700, fontSize: 14, color: "var(--link)" }}>
          View Full Championship History &#8594;
        </Link>
      </div>
    </>
  );
}
