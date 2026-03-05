import Link from "next/link";
import { Suspense } from "react";
import HeaderWithScores from "@/components/layout/HeaderWithScores";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PSPPromo from "@/components/ads/PSPPromo";
import CompareSearch from "@/components/ui/CompareSearch";
import { getPlayerBySlug, getFootballPlayerStats, getBasketballPlayerStats, getBaseballPlayerStats } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Players — PhillySportsPack",
  description: "Compare Philadelphia high school athletes side by side — career stats, records, and achievements.",
};

const FOOTBALL_STATS = [
  { key: "totalYards", label: "Total Yards" },
  { key: "totalTd", label: "Total TDs" },
  { key: "rushYards", label: "Rush Yards" },
  { key: "rushTd", label: "Rush TDs" },
  { key: "passYards", label: "Pass Yards" },
  { key: "passTd", label: "Pass TDs" },
  { key: "seasons", label: "Seasons" },
];

const BASKETBALL_STATS = [
  { key: "points", label: "Career Points" },
  { key: "games", label: "Games Played" },
  { key: "ppg", label: "PPG" },
  { key: "rebounds", label: "Rebounds" },
  { key: "assists", label: "Assists" },
  { key: "seasons", label: "Seasons" },
];

const BASEBALL_STATS = [
  { key: "games", label: "Games Played" },
  { key: "seasons", label: "Seasons" },
];

const SUGGESTED_MATCHUPS = [
  {
    title: "Catholic League Rushers",
    desc: "SJP vs La Salle rushing battle",
    sport: "football",
    players: ["kyle-mccord", "samuel-brown"],
    icon: "🏈",
  },
  {
    title: "Public League Scorers",
    desc: "Top Philly Public basketball scorers",
    sport: "basketball",
    players: ["aaric-murray", "aaron-ross"],
    icon: "🏀",
  },
  {
    title: "Prep Passers",
    desc: "Who threw for more yards?",
    sport: "football",
    players: ["kyle-mccord", "anthony-russo"],
    icon: "🎯",
  },
];

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ players?: string; sport?: string }>;
}) {
  const { players: playerSlugs, sport = "football" } = await searchParams;
  const slugs = playerSlugs ? playerSlugs.split(",").slice(0, 4) : [];
  const playersData: any[] = [];

  for (const slug of slugs) {
    const player = await getPlayerBySlug(slug.trim());
    if (player) {
      let stats: any[] = [];
      if (sport === "football") stats = await getFootballPlayerStats(player.id);
      else if (sport === "basketball") stats = await getBasketballPlayerStats(player.id);
      else if (sport === "baseball") stats = await getBaseballPlayerStats(player.id);

      const totals = sport === "football" ? {
        rushYards: stats.reduce((s: number, r: any) => s + (r.rush_yards || 0), 0),
        rushTd: stats.reduce((s: number, r: any) => s + (r.rush_td || 0), 0),
        passYards: stats.reduce((s: number, r: any) => s + (r.pass_yards || 0), 0),
        passTd: stats.reduce((s: number, r: any) => s + (r.pass_td || 0), 0),
        totalTd: stats.reduce((s: number, r: any) => s + (r.total_td || 0), 0),
        totalYards: stats.reduce((s: number, r: any) => s + (r.total_yards || 0), 0),
        seasons: stats.length,
      } : sport === "basketball" ? {
        points: stats.reduce((s: number, r: any) => s + (r.points || 0), 0),
        games: stats.reduce((s: number, r: any) => s + (r.games_played || 0), 0),
        ppg: (() => {
          const pts = stats.reduce((s: number, r: any) => s + (r.points || 0), 0);
          const gp = stats.reduce((s: number, r: any) => s + (r.games_played || 0), 0);
          return gp > 0 ? (pts / gp).toFixed(1) : "0.0";
        })(),
        rebounds: stats.reduce((s: number, r: any) => s + (r.rebounds || 0), 0),
        assists: stats.reduce((s: number, r: any) => s + (r.assists || 0), 0),
        seasons: stats.length,
      } : {
        games: stats.reduce((s: number, r: any) => s + (r.games_played || 0), 0),
        seasons: stats.length,
      };

      playersData.push({ ...player, stats, totals });
    }
  }

  const compareStats = sport === "football" ? FOOTBALL_STATS
    : sport === "basketball" ? BASKETBALL_STATS
    : BASEBALL_STATS;

  const sportColor = sport === "football" ? "#16a34a" : sport === "basketball" ? "#ea580c" : "#dc2626";
  const sportEmoji = sport === "football" ? "🏈" : sport === "basketball" ? "🏀" : "⚾";
  const sportLabel = sport === "football" ? "Football" : sport === "basketball" ? "Basketball" : "Baseball";
  const hasResults = playersData.length >= 2;

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithScores />
      <Breadcrumb items={[{ label: "Compare Players" }]} />

      {/* ════════ HEADER BAR ════════ */}
      <div className="sport-hub-header" style={{ "--shh-color": sportColor } as React.CSSProperties}>
        <div className="shh-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>📊</span>
            <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>
              Compare Players
            </h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            Search and select 2-4 players to compare their career stats side by side.
          </p>
        </div>
      </div>

      {/* ════════ SUB-NAV ════════ */}
      <nav className="hub-subnav">
        <Link href="/search">Search Database</Link>
        <Link href="/compare" style={{ color: "var(--psp-gold)" }}>Compare Players</Link>
        <Link href="/glossary">Stats Glossary</Link>
        <Link href="/schools">All Schools</Link>
        <Link href="/football/leaderboards/rushing">Leaderboards</Link>
      </nav>

      {/* ════════ MAIN 2-COL LAYOUT ════════ */}
      <div className="hub-body">
        <div className="hub-main">
          {/* Player Picker */}
          <Suspense fallback={null}>
            <CompareSearch />
          </Suspense>

          {hasResults ? (
            /* ──── COMPARISON TABLE ──── */
            <div style={{ marginTop: 20 }}>
              <div className="hub-sec-head">
                <h3>{sportEmoji} {sportLabel} Comparison</h3>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{
                        textAlign: "left",
                        padding: "10px 14px",
                        background: sportColor,
                        color: "#fff",
                        fontFamily: "Barlow Condensed, sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        borderRadius: "6px 0 0 0",
                      }}>
                        STAT
                      </th>
                      {playersData.map((p: any, i: number) => (
                        <th key={p.slug} style={{
                          textAlign: "center",
                          padding: "10px 14px",
                          background: sportColor,
                          color: "#fff",
                          fontFamily: "Barlow Condensed, sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          borderRadius: i === playersData.length - 1 ? "0 6px 0 0" : undefined,
                        }}>
                          <Link href={`/${sport}/players/${p.slug}`} style={{ color: "#fff", textDecoration: "none" }}>
                            {p.name}
                          </Link>
                          <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 400 }}>
                            {(p as any).schools?.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareStats.map((stat, rowIdx) => {
                      const values = playersData.map((p: any) => {
                        const v = p.totals?.[stat.key];
                        return typeof v === "string" ? parseFloat(v) : (v || 0);
                      });
                      const maxVal = Math.max(...values);

                      return (
                        <tr key={stat.key} style={{ borderBottom: "1px solid var(--psp-gray-200)" }}>
                          <td style={{
                            padding: "10px 14px",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--psp-navy)",
                            fontFamily: "Barlow Condensed, sans-serif",
                            background: rowIdx % 2 === 0 ? "var(--psp-gray-50, #f9fafb)" : "#fff",
                          }}>
                            {stat.label}
                          </td>
                          {playersData.map((p: any, idx: number) => {
                            const raw = p.totals?.[stat.key];
                            const val = typeof raw === "string" ? parseFloat(raw) : (raw || 0);
                            const isMax = val === maxVal && val > 0;
                            const barWidth = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0;
                            return (
                              <td key={p.slug} style={{
                                padding: "10px 14px",
                                textAlign: "center",
                                background: rowIdx % 2 === 0 ? "var(--psp-gray-50, #f9fafb)" : "#fff",
                              }}>
                                <div style={{ fontSize: 16, fontWeight: 700, color: isMax ? "var(--psp-gold)" : "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                                  {typeof raw === "string" ? raw : val.toLocaleString()}
                                </div>
                                {stat.key !== "seasons" && (
                                  <div style={{ marginTop: 4, height: 4, borderRadius: 2, background: "var(--psp-gray-200)", overflow: "hidden" }}>
                                    <div style={{
                                      width: `${barWidth}%`,
                                      height: "100%",
                                      borderRadius: 2,
                                      background: isMax ? "var(--psp-gold)" : sportColor,
                                      transition: "width 0.3s ease",
                                    }} />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ──── EMPTY STATE: SUGGESTED MATCHUPS ──── */
            <div>
              <div style={{ textAlign: "center", padding: "32px 20px 24px" }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>⚖️</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif", marginBottom: 6 }}>
                  Pick 2-4 Players Above
                </h3>
                <p style={{ fontSize: 13, color: "var(--psp-gray-500)" }}>
                  Select a sport, search for players, and hit Compare to see career stats side by side.
                </p>
              </div>

              {/* Suggested Matchups */}
              <div className="hub-sec-head">
                <h3>Suggested Matchups</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28 }}>
                {SUGGESTED_MATCHUPS.map((m) => (
                  <Link
                    key={m.title}
                    href={`/compare?players=${m.players.join(",")}&sport=${m.sport}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "16px 14px",
                      borderRadius: 10,
                      border: "1px solid var(--psp-gray-200)",
                      textDecoration: "none",
                      transition: "box-shadow 0.15s, border-color 0.15s",
                    }}
                    className="tool-card-link"
                  >
                    <span style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                      {m.title}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--psp-gray-500)", marginTop: 2 }}>
                      {m.desc}
                    </span>
                  </Link>
                ))}
              </div>

              <PSPPromo size="banner" variant={1} />
            </div>
          )}
        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside className="hub-sidebar">
          {/* How It Works */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: sportColor }}>How It Works</div>
            <div className="hub-wb">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { step: "1", text: "Choose a sport (Football, Basketball, or Baseball)" },
                  { step: "2", text: "Search for players by name" },
                  { step: "3", text: "Select 2-4 players to compare" },
                  { step: "4", text: "Hit Compare to see stats side by side" },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: sportColor,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {item.step}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--psp-gray-600)", lineHeight: 1.4 }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="hub-widget">
            <div className="hub-wh">Quick Links</div>
            <div className="hub-wb" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { href: "/football/leaderboards/rushing", label: "🏈 Football Leaders" },
                { href: "/basketball/leaderboards/scoring", label: "🏀 Basketball Leaders" },
                { href: "/search", label: "🔍 Search Database" },
                { href: "/glossary", label: "📖 Stats Glossary" },
                { href: "/our-guys", label: "🌟 Our Guys" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: 13, color: "var(--psp-navy)", textDecoration: "none", padding: "4px 0", borderBottom: "1px solid var(--psp-gray-100)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <PSPPromo size="sidebar" variant={4} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
