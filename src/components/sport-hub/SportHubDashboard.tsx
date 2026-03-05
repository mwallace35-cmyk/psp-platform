"use client";

import Link from "next/link";
import PSPPromo from "@/components/ads/PSPPromo";

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
  leaders: any[];
}

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
  leaders,
}: SportHubDashboardProps) {
  // Group standings by league
  const leagueGroups: Record<string, any[]> = {};
  for (const team of standings) {
    const league = team.league || "Other";
    if (!leagueGroups[league]) leagueGroups[league] = [];
    leagueGroups[league].push(team);
  }
  for (const league of Object.keys(leagueGroups)) {
    leagueGroups[league].sort((a: any, b: any) => b.totalWins - a.totalWins);
  }
  const leagueNames = Object.keys(leagueGroups);

  // Dynasty tracker from champions
  const dynastyMap = new Map<string, { name: string; slug: string; count: number }>();
  for (const champ of champions) {
    const name = champ.schools?.name || "Unknown";
    const slug = champ.schools?.slug || "#";
    if (!dynastyMap.has(slug)) dynastyMap.set(slug, { name, slug, count: 0 });
    dynastyMap.get(slug)!.count++;
  }
  const dynasties = Array.from(dynastyMap.values()).sort((a, b) => b.count - a.count).slice(0, 8);

  const topStory = featured?.[0];
  const moreStories = featured?.slice(1, 5) || [];

  return (
    <div className="hub-dashboard">
      {/* ════════ SCORE STRIP ════════ */}
      {recentGames.length > 0 && (
        <div className="hub-scores-strip">
          <div className="hub-scores-inner">
            {recentGames.slice(0, 12).map((game: any, i: number) => {
              const homeWin = (game.home_score ?? 0) > (game.away_score ?? 0);
              return (
                <div key={game.id || i} className="hub-score-chip" style={{ "--sc": sportColor } as React.CSSProperties}>
                  <div className={`hsc-team ${homeWin ? "hsc-w" : ""}`}>
                    <span className="hsc-name">{game.home_school?.short_name || game.home_school?.name || "Home"}</span>
                    <span className="hsc-num">{game.home_score ?? "-"}</span>
                  </div>
                  <div className={`hsc-team ${!homeWin ? "hsc-w" : ""}`}>
                    <span className="hsc-name">{game.away_school?.short_name || game.away_school?.name || "Away"}</span>
                    <span className="hsc-num">{game.away_score ?? "-"}</span>
                  </div>
                  <div className="hsc-meta">
                    {game.game_date ? new Date(game.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                    {game.status === "final" ? " · Final" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════ SUB-NAV LINKS ════════ */}
      <nav className="hub-subnav">
        <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`}>Leaders</Link>
        <Link href={`/${sport}/championships`}>Championships</Link>
        <Link href={`/${sport}/records`}>Records</Link>
        <Link href={`/search?sport=${sport}`}>Players</Link>
        <Link href="/compare">Compare</Link>
        <Link href="/schools">Teams</Link>
      </nav>

      {/* ════════ MAIN 2-COL LAYOUT ════════ */}
      <div className="hub-body">
        {/* ── LEFT: MAIN CONTENT ── */}
        <div className="hub-main">

          {/* FEATURED STORY */}
          {topStory ? (
            <Link href={`/articles/${topStory.slug}`} className="hub-featured">
              <div
                className="hub-featured-img"
                style={{
                  background: topStory.featured_image_url
                    ? `url(${topStory.featured_image_url}) center / cover`
                    : `linear-gradient(135deg, ${sportColor}cc 0%, var(--psp-navy) 100%)`,
                }}
              >
                <span className="hub-featured-badge" style={{ background: sportColor }}>FEATURED</span>
                <div className="hub-featured-overlay">
                  <h2>{topStory.title}</h2>
                  {topStory.excerpt && <p>{topStory.excerpt}</p>}
                </div>
              </div>
            </Link>
          ) : (
            <div className="hub-featured-placeholder" style={{ background: `linear-gradient(135deg, ${sportColor}88, var(--psp-navy))` }}>
              <div className="hub-fp-content">
                <span style={{ fontSize: 48 }}>{meta.emoji}</span>
                <h2>Philadelphia {meta.name}</h2>
                <p>{overview.players.toLocaleString()} players · {overview.schools.toLocaleString()} schools · {overview.championships.toLocaleString()} titles</p>
              </div>
            </div>
          )}

          {/* HEADLINES */}
          {moreStories.length > 0 && (
            <div className="hub-headlines">
              <div className="hub-sec-head">
                <h3>Latest {meta.name} News</h3>
                <Link href="/articles" className="hub-more">View All →</Link>
              </div>
              {moreStories.map((article: any) => (
                <Link key={article.id} href={`/articles/${article.slug}`} className="hub-headline-row">
                  <span className="hub-hl-dot" style={{ background: sportColor }} />
                  <span className="hub-hl-title">{article.title}</span>
                  <span className="hub-hl-time">
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : ""}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <PSPPromo size="banner" variant={1} />

          {/* STANDINGS — side-by-side league tables */}
          {leagueNames.length > 0 && (
            <div className="hub-standings-section">
              <div className="hub-sec-head">
                <h3>{meta.name} Standings</h3>
                <Link href={`/${sport}/championships`} className="hub-more">Full Standings →</Link>
              </div>
              <div className="hub-standings-grid">
                {leagueNames.slice(0, 4).map((league) => (
                  <div key={league} className="hub-league-table">
                    <div className="hub-lt-head" style={{ background: sportColor }}>{league}</div>
                    <div className="hub-lt-hdr">
                      <span className="hub-lt-team">TEAM</span>
                      <span className="hub-lt-stat">W</span>
                      <span className="hub-lt-stat">L</span>
                      <span className="hub-lt-stat">PCT</span>
                    </div>
                    {(leagueGroups[league] || []).slice(0, 6).map((team: any, i: number) => {
                      const total = team.totalWins + team.totalLosses + (team.totalTies || 0);
                      const pct = total > 0 ? (team.totalWins / total).toFixed(3).substring(1) : ".000";
                      return (
                        <div key={team.school?.id || i} className={`hub-lt-row ${i === 0 ? "hub-lt-first" : ""}`}>
                          <span className="hub-lt-team">
                            <Link href={`/schools/${team.school?.slug || "#"}`}>{team.school?.name || "Unknown"}</Link>
                          </span>
                          <span className="hub-lt-stat">{team.totalWins}</span>
                          <span className="hub-lt-stat">{team.totalLosses}</span>
                          <span className="hub-lt-stat">{pct}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOP PERFORMERS (Leaders inline) */}
          {leaders.length > 0 && (
            <div className="hub-performers">
              <div className="hub-sec-head">
                <h3>Top Performers</h3>
                <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="hub-more">Full Leaderboard →</Link>
              </div>
              <div className="hub-perf-list">
                {leaders.slice(0, 10).map((row: any, i: number) => {
                  const playerName = row.players?.name || "Unknown";
                  const playerSlug = row.players?.slug || "#";
                  const schoolName = row.schools?.name || row.players?.schools?.name || "";
                  const mainStat = sport === "football"
                    ? (row.rush_yards || row.pass_yards || row.total_td || 0)
                    : (row.points || row.ppg || 0);
                  const statLabel = sport === "football"
                    ? (row.rush_yards ? "rush yds" : row.pass_yards ? "pass yds" : "TDs")
                    : (row.points ? "pts" : "ppg");

                  return (
                    <div key={row.id || i} className={`hub-perf-row ${i < 3 ? "hub-perf-top" : ""}`}>
                      <span className="hub-perf-rank" style={i < 3 ? { background: sportColor, color: "#fff" } : undefined}>{i + 1}</span>
                      <div className="hub-perf-info">
                        <Link href={`/${sport}/players/${playerSlug}`} className="hub-perf-name">{playerName}</Link>
                        <span className="hub-perf-school">{schoolName}</span>
                      </div>
                      <span className="hub-perf-stat">
                        <strong>{typeof mainStat === "number" ? mainStat.toLocaleString() : mainStat}</strong>
                        <span>{statLabel}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DYNASTY TRACKER */}
          {dynasties.length > 0 && (
            <div className="hub-dynasties">
              <div className="hub-sec-head">
                <h3>Championship Leaders</h3>
                <Link href={`/${sport}/championships`} className="hub-more">Full History →</Link>
              </div>
              <div className="hub-dynasty-grid">
                {dynasties.map((d, i) => (
                  <Link key={d.slug} href={`/schools/${d.slug}`} className="hub-dynasty-card hover-lift">
                    <span className="hub-dyn-rank" style={i < 3 ? { background: sportColor } : undefined}>{i + 1}</span>
                    <span className="hub-dyn-name">{d.name}</span>
                    <span className="hub-dyn-count">{d.count} titles</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* SCHOOLS GRID */}
          {schools.length > 0 && (
            <div className="hub-schools-section">
              <div className="hub-sec-head">
                <h3>{meta.name} Schools</h3>
                <Link href="/schools" className="hub-more">All Schools →</Link>
              </div>
              <div className="hub-school-grid">
                {schools.slice(0, 12).map((school: any) => (
                  <Link key={school.id} href={`/schools/${school.slug}`} className="hub-school-card hover-lift">
                    <div className="hub-sc-name">{school.name}</div>
                    <div className="hub-sc-meta">
                      {school.city || "Philadelphia"} · {school.leagues?.name || ""}
                    </div>
                  </Link>
                ))}
              </div>
              {schools.length > 12 && (
                <Link href="/schools" className="hub-schools-more">
                  View all {schools.length} schools →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside className="hub-sidebar">
          {/* Database Stats */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: sportColor }}>{meta.emoji} {meta.name} Database</div>
            <div className="hub-wb">
              <div className="hub-wr"><span>Players</span><strong>{overview.players.toLocaleString()}</strong></div>
              <div className="hub-wr"><span>Schools</span><strong>{overview.schools.toLocaleString()}</strong></div>
              <div className="hub-wr"><span>Seasons</span><strong>{overview.seasons.toLocaleString()}</strong></div>
              <div className="hub-wr"><span>Titles</span><strong>{overview.championships.toLocaleString()}</strong></div>
            </div>
          </div>

          {/* Leaderboard Mini */}
          {leaders.length > 0 && (
            <div className="hub-widget">
              <div className="hub-wh" style={{ background: sportColor }}>
                {sport === "football" ? "Rushing Leaders" : sport === "basketball" ? "Scoring Leaders" : "Top Players"}
              </div>
              <div className="hub-wb hub-wb-tight">
                <div className="hub-ldr-hdr">
                  <span>PLAYER</span>
                  <span>{sport === "football" ? "YARDS" : "PTS"}</span>
                </div>
                {leaders.slice(0, 5).map((row: any, i: number) => {
                  const val = sport === "football" ? (row.rush_yards || row.pass_yards || 0) : (row.points || 0);
                  return (
                    <div key={row.id || i} className="hub-ldr-row">
                      <span className="hub-ldr-rank" style={i < 3 ? { color: sportColor, fontWeight: 800 } : undefined}>{i + 1}</span>
                      <Link href={`/${sport}/players/${row.players?.slug || "#"}`} className="hub-ldr-name">
                        {row.players?.name || "Unknown"}
                        <small>{row.schools?.name || row.players?.schools?.name || ""}</small>
                      </Link>
                      <strong className="hub-ldr-val">{val.toLocaleString()}</strong>
                    </div>
                  );
                })}
                <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="hub-widget-link">
                  Full Leaderboard →
                </Link>
              </div>
            </div>
          )}

          {/* Recent Scores */}
          {recentGames.length > 0 && (
            <div className="hub-widget">
              <div className="hub-wh">Recent Scores</div>
              <div className="hub-wb hub-wb-tight">
                {recentGames.slice(0, 5).map((game: any, i: number) => {
                  const homeWin = (game.home_score ?? 0) > (game.away_score ?? 0);
                  return (
                    <div key={game.id || i} className="hub-score-row">
                      <div className="hub-sr-matchup">
                        <div className={homeWin ? "hub-sr-w" : ""}>
                          <Link href={`/schools/${game.home_school?.slug || "#"}`}>{game.home_school?.short_name || game.home_school?.name || "Home"}</Link>
                          <span>{game.home_score ?? "-"}</span>
                        </div>
                        <div className={!homeWin ? "hub-sr-w" : ""}>
                          <Link href={`/schools/${game.away_school?.slug || "#"}`}>{game.away_school?.short_name || game.away_school?.name || "Away"}</Link>
                          <span>{game.away_score ?? "-"}</span>
                        </div>
                      </div>
                      <div className="hub-sr-date">
                        {game.game_date ? new Date(game.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="hub-widget">
            <div className="hub-wh">Quick Links</div>
            <div className="hub-wb">
              <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="hub-ql">→ Leaderboards</Link>
              <Link href={`/${sport}/championships`} className="hub-ql">→ Championships</Link>
              <Link href={`/${sport}/records`} className="hub-ql">→ Records</Link>
              <Link href={`/search?sport=${sport}`} className="hub-ql">→ Search Players</Link>
              <Link href="/compare" className="hub-ql">→ Compare Players</Link>
              <Link href="/schools" className="hub-ql">→ All Schools</Link>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={2} />

          {/* Recent Champions */}
          {champions.length > 0 && (
            <div className="hub-widget">
              <div className="hub-wh" style={{ background: "var(--psp-gold)" }}>Recent Champions</div>
              <div className="hub-wb hub-wb-tight">
                {champions.slice(0, 5).map((c: any, i: number) => (
                  <div key={c.id || i} className="hub-champ-row">
                    <span className="hub-cr-year">{c.seasons?.label || ""}</span>
                    <Link href={`/schools/${c.schools?.slug || "#"}`} className="hub-cr-name">{c.schools?.name || "Unknown"}</Link>
                    <span className="hub-cr-level">{c.level || ""}</span>
                  </div>
                ))}
                <Link href={`/${sport}/championships`} className="hub-widget-link">
                  All Championships →
                </Link>
              </div>
            </div>
          )}

          <PSPPromo size="sidebar" variant={4} />
        </aside>
      </div>
    </div>
  );
}
