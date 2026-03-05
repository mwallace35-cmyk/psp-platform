import Link from "next/link";
import HeaderWithScores from "@/components/layout/HeaderWithScores";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PSPPromo from "@/components/ads/PSPPromo";
import { searchEntitiesServer, searchArticles, getDatabaseStats, getTopSchoolsByChampionships, SPORT_META, VALID_SPORTS } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search the Database — PhillySportsPack",
  description: "Search 10,000+ players, 700+ schools, coaches, and 25 years of Philadelphia high school sports stats and records.",
};

export const revalidate = 3600;

const POPULAR_SEARCHES = [
  { label: "St. Joseph's Prep", q: "St. Joseph's Prep" },
  { label: "Roman Catholic", q: "Roman Catholic" },
  { label: "Neumann-Goretti", q: "Neumann-Goretti" },
  { label: "Imhotep Charter", q: "Imhotep Charter" },
  { label: "La Salle", q: "La Salle" },
  { label: "Malvern Prep", q: "Malvern Prep" },
  { label: "Father Judge", q: "Father Judge" },
  { label: "Archbishop Wood", q: "Archbishop Wood" },
];

const SPORT_BROWSE = [
  { sport: "football", emoji: "🏈", color: "#16a34a" },
  { sport: "basketball", emoji: "🏀", color: "#ea580c" },
  { sport: "baseball", emoji: "⚾", color: "#dc2626" },
  { sport: "lacrosse", emoji: "🥍", color: "#0891b2" },
  { sport: "track-field", emoji: "🏃", color: "#7c3aed" },
  { sport: "wrestling", emoji: "🤼", color: "#ca8a04" },
  { sport: "soccer", emoji: "⚽", color: "#059669" },
];

const typeLabels: Record<string, { label: string; icon: string; color: string }> = {
  school: { label: "Schools", icon: "🏫", color: "#3b82f6" },
  player: { label: "Players", icon: "👤", color: "#16a34a" },
  coach: { label: "Coaches", icon: "🧑‍🏫", color: "#ea580c" },
  season: { label: "Seasons", icon: "📅", color: "#7c3aed" },
  article: { label: "Articles", icon: "📰", color: "#f0a500" },
  other: { label: "Other", icon: "📋", color: "#6b7280" },
};

const sportEmoji: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  lacrosse: "🥍",
  "track-field": "🏃",
  wrestling: "🤼",
  soccer: "⚽",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sport?: string }>;
}) {
  const { q = "", sport } = await searchParams;
  const hasQuery = q.length >= 2;
  const [results, articleResults] = hasQuery
    ? await Promise.all([searchEntitiesServer(q, sport || undefined), searchArticles(q, 10)])
    : [[], []];

  // Filter by sport if provided
  const filteredResults = sport && VALID_SPORTS.includes(sport as any)
    ? results.filter((r: any) => !r.sport_id || r.sport_id === sport)
    : results;

  // Filter articles by sport too
  const filteredArticles = sport && VALID_SPORTS.includes(sport as any)
    ? articleResults.filter((a: any) => !a.sport_id || a.sport_id === sport)
    : articleResults;

  // Group results by entity type
  const grouped: Record<string, any[]> = {};
  for (const r of filteredResults as any[]) {
    const type = r.entity_type || "other";
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(r);
  }

  // Add articles as their own group
  if (filteredArticles.length > 0) {
    grouped["article"] = filteredArticles.map((a: any) => ({
      display_name: a.title,
      url_path: `/articles/${a.slug}`,
      sport_id: a.sport_id,
      entity_type: "article",
      context: a.source_file ? "Archive" : (a.excerpt ? a.excerpt.substring(0, 80) + "..." : ""),
    }));
  }

  const allResultsCount = (filteredResults as any[]).length + filteredArticles.length;

  // Get data for empty state / sidebar
  const [dbStats, topSchools] = await Promise.all([
    getDatabaseStats(),
    getTopSchoolsByChampionships(8),
  ]);

  const totalRecords = dbStats.players + dbStats.schools + dbStats.teamSeasons + dbStats.championships + dbStats.games;

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithScores />
      <Breadcrumb items={[{ label: "Search Database" }]} />

      {/* ════════ HERO SEARCH BAR ════════ */}
      <div className="sport-hub-header" style={{ "--shh-color": "#3b82f6" } as React.CSSProperties}>
        <div className="shh-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>🔍</span>
            <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>
              Search the Database
            </h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 16 }}>
            {totalRecords.toLocaleString()} records across {dbStats.schools.toLocaleString()} schools and {dbStats.players.toLocaleString()} players
          </p>
          <form action="/search" method="GET" style={{ maxWidth: 640 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search players, schools, coaches..."
                autoComplete="off"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: "2px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 28px",
                  borderRadius: 8,
                  background: "var(--psp-gold)",
                  color: "#0a1628",
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Barlow Condensed, sans-serif",
                  letterSpacing: 0.5,
                }}
              >
                SEARCH
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ════════ SUB-NAV ════════ */}
      <nav className="hub-subnav">
        <Link href="/search">All Results</Link>
        <Link href="/compare">Compare Players</Link>
        <Link href="/glossary">Stats Glossary</Link>
        <Link href="/schools">All Schools</Link>
        <Link href="/archive">Archive</Link>
      </nav>

      {/* ════════ SPORT FILTER PILLS (when searching) ════════ */}
      {hasQuery && (
        <div style={{ padding: "0 20px", borderBottom: "1px solid var(--psp-gray-200)", background: "var(--psp-gray-50)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 0", display: "flex", gap: 8, overflow: "x auto", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--psp-gray-500)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
              Filter:
            </span>
            <Link
              href={`/search?q=${encodeURIComponent(q)}`}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: !sport ? "2px solid var(--psp-blue)" : "1px solid var(--psp-gray-200)",
                background: !sport ? "var(--psp-blue)" : "transparent",
                color: !sport ? "#fff" : "var(--psp-navy)",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              All
            </Link>
            {VALID_SPORTS.map((s: any) => {
              const meta = (SPORT_META as any)[s];
              return (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(q)}&sport=${s}`}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: sport === s ? "2px solid var(--psp-blue)" : "1px solid var(--psp-gray-200)",
                    background: sport === s ? "var(--psp-blue)" : "transparent",
                    color: sport === s ? "#fff" : "var(--psp-navy)",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {meta?.emoji} {meta?.name || s}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════ MAIN 2-COL LAYOUT ════════ */}
      <div className="hub-body">
        <div className="hub-main">
          {hasQuery ? (
            allResultsCount > 0 ? (
              /* ──── RESULTS VIEW ──── */
              <div>
                <div className="hub-sec-head">
                  <h3>{allResultsCount} result{allResultsCount !== 1 ? "s" : ""} for &quot;{q}&quot;{sport ? ` in ${(SPORT_META as any)[sport]?.name || sport}` : ""}</h3>
                </div>

                {Object.entries(grouped).map(([type, items]) => {
                  const meta = typeLabels[type] || typeLabels.other;
                  return (
                    <div key={type} style={{ marginBottom: 28 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        background: meta.color,
                        borderRadius: "6px 6px 0 0",
                        color: "#fff",
                        fontFamily: "Barlow Condensed, sans-serif",
                        fontSize: 15,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                      }}>
                        <span>{meta.icon}</span>
                        {meta.label} ({items.length})
                      </div>
                      <div style={{ border: "1px solid var(--psp-gray-200)", borderTop: "none", borderRadius: "0 0 6px 6px", overflow: "hidden" }}>
                        {items.map((item: any, idx: number) => (
                          <Link
                            key={idx}
                            href={item.url_path || "#"}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "10px 14px",
                              borderBottom: idx < items.length - 1 ? "1px solid var(--psp-gray-200)" : "none",
                              textDecoration: "none",
                              transition: "background 0.15s",
                            }}
                            className="search-result-row"
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                              {item.sport_id && (
                                <span style={{
                                  fontSize: 16,
                                  width: 28,
                                  height: 28,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 6,
                                  background: "var(--psp-gray-100)",
                                }}>
                                  {sportEmoji[item.sport_id] || "📋"}
                                </span>
                              )}
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--psp-navy)" }}>
                                  {item.display_name}
                                </div>
                                {item.context && (
                                  <div style={{ fontSize: 12, color: "var(--psp-gray-500)", marginTop: 1 }}>
                                    {item.context}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              {item.relevance && item.relevance > 0 && (
                                <span style={{
                                  fontSize: 11,
                                  color: "var(--psp-gray-400)",
                                  background: "var(--psp-gray-100)",
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  whiteSpace: "nowrap",
                                }}>
                                  {Math.round(item.relevance * 100)}% match
                                </span>
                              )}
                              <span style={{ fontSize: 12, color: "var(--psp-gray-400)" }}>→</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ──── NO RESULTS ──── */
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif", marginBottom: 8 }}>
                  No results for &quot;{q}&quot;
                </h3>
                <p style={{ fontSize: 14, color: "var(--psp-gray-500)", marginBottom: 24 }}>
                  Try a different search term or browse by sport below.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {POPULAR_SEARCHES.slice(0, 4).map((s) => (
                    <Link
                      key={s.q}
                      href={`/search?q=${encodeURIComponent(s.q)}`}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 20,
                        border: "1px solid var(--psp-gray-200)",
                        fontSize: 13,
                        color: "var(--psp-navy)",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          ) : (
            /* ──── EMPTY STATE: DISCOVERY ──── */
            <div>
              {/* Browse by Sport — Big 3 */}
              <div className="hub-sec-head">
                <h3>Browse by Sport</h3>
                <Link href="/schools" className="hub-more">All Schools →</Link>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 12,
              }}>
                {SPORT_BROWSE.slice(0, 3).map((s) => {
                  const meta = SPORT_META[s.sport as keyof typeof SPORT_META];
                  return (
                    <Link
                      key={s.sport}
                      href={`/${s.sport}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "24px 12px 20px",
                        borderRadius: 10,
                        background: `linear-gradient(135deg, ${s.color}20 0%, ${s.color}08 100%)`,
                        border: `2px solid ${s.color}40`,
                        textDecoration: "none",
                        transition: "transform 0.15s, box-shadow 0.15s",
                      }}
                      className="sport-browse-card"
                    >
                      <span style={{ fontSize: 38, marginBottom: 8 }}>{s.emoji}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif", letterSpacing: 0.5 }}>
                        {meta?.name || s.sport}
                      </span>
                    </Link>
                  );
                })}
              </div>
              {/* Other Sports — compact row */}
              <div style={{
                display: "flex",
                gap: 8,
                marginBottom: 28,
              }}>
                {SPORT_BROWSE.slice(3).map((s) => {
                  const meta = SPORT_META[s.sport as keyof typeof SPORT_META];
                  return (
                    <Link
                      key={s.sport}
                      href={`/${s.sport}`}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: "10px 8px",
                        borderRadius: 8,
                        border: "1px solid var(--psp-gray-200)",
                        textDecoration: "none",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--psp-gray-500)",
                        fontFamily: "Barlow Condensed, sans-serif",
                        letterSpacing: 0.3,
                        transition: "border-color 0.15s, color 0.15s",
                      }}
                      className="sport-browse-pill"
                    >
                      <span style={{ fontSize: 16 }}>{s.emoji}</span>
                      {meta?.name || s.sport}
                    </Link>
                  );
                })}
              </div>

              <PSPPromo size="banner" variant={2} />

              {/* Popular Searches */}
              <div style={{ marginTop: 28 }}>
                <div className="hub-sec-head">
                  <h3>Popular Searches</h3>
                </div>
                <div className="hub-performers">
                  <div className="hub-perf-list">
                    {POPULAR_SEARCHES.map((s, i) => (
                      <Link
                        key={s.q}
                        href={`/search?q=${encodeURIComponent(s.q)}`}
                        className="hub-perf-row"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="hp-rank" style={{ background: i < 3 ? "var(--psp-gold)" : undefined, color: i < 3 ? "#0a1628" : undefined }}>
                          {i + 1}
                        </span>
                        <span className="hp-name">{s.label}</span>
                        <span style={{ fontSize: 12, color: "var(--psp-gray-400)" }}>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynasty Tracker */}
              {topSchools.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <div className="hub-sec-head">
                    <h3>Top Programs by Championships</h3>
                    <Link href="/football/championships" className="hub-more">All Championships →</Link>
                  </div>
                  <div className="hub-dynasties">
                    <div className="hub-dynasty-grid">
                      {topSchools.map((school, i) => (
                        <Link
                          key={school.slug}
                          href={`/schools/${school.slug}`}
                          className="hub-dyn-card"
                          style={{ textDecoration: "none" }}
                        >
                          <span className="hdc-rank" style={{ background: i === 0 ? "var(--psp-gold)" : undefined, color: i === 0 ? "#0a1628" : undefined }}>
                            #{i + 1}
                          </span>
                          <span className="hdc-name">{school.name}</span>
                          <span className="hdc-val">{school.count} titles</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Tools */}
              <div style={{ marginTop: 28 }}>
                <div className="hub-sec-head">
                  <h3>Data Tools</h3>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}>
                  {[
                    { href: "/compare", icon: "📊", label: "Compare Players", desc: "Side-by-side stat comparison" },
                    { href: "/glossary", icon: "📖", label: "Stats Glossary", desc: "Every stat abbreviation explained" },
                    { href: "/football/leaderboards/rushing", icon: "🏆", label: "Leaderboards", desc: "All-time and seasonal leaders" },
                    { href: "/archive", icon: "📚", label: "Archive", desc: "25 years of Philly sports" },
                  ].map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "14px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--psp-gray-200)",
                        textDecoration: "none",
                        transition: "box-shadow 0.15s",
                      }}
                      className="tool-card-link"
                    >
                      <span style={{ fontSize: 22 }}>{tool.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                          {tool.label}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--psp-gray-500)", marginTop: 2 }}>
                          {tool.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside className="hub-sidebar">
          {/* Database Stats Widget */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: "#3b82f6" }}>Database Stats</div>
            <div className="hub-wb">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Players", value: dbStats.players, icon: "👤" },
                  { label: "Schools", value: dbStats.schools, icon: "🏫" },
                  { label: "Seasons", value: dbStats.teamSeasons, icon: "📅" },
                  { label: "Championships", value: dbStats.championships, icon: "🏆" },
                  { label: "Games", value: dbStats.games, icon: "🎮" },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: "center", padding: "8px 0" }}>
                    <div style={{ fontSize: 18 }}>{stat.icon}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                      {stat.value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--psp-gray-500)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {stat.label}
                    </div>
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
                { href: "/our-guys", label: "🌟 Our Guys (Pro Athletes)" },
                { href: "/recruiting", label: "📋 Recruiting Board" },
                { href: "/potw", label: "🗳️ Player of the Week" },
                { href: "/articles", label: "📰 Latest Articles" },
                { href: "/community", label: "💬 Community" },
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

          {/* Coverage Badge */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: "var(--psp-gold)", color: "#0a1628" }}>Coverage</div>
            <div className="hub-wb" style={{ textAlign: "center", padding: "16px 12px" }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                25
              </div>
              <div style={{ fontSize: 12, color: "var(--psp-gray-500)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                Years of Data
              </div>
              <div style={{ fontSize: 13, color: "var(--psp-gray-500)" }}>
                2000 — 2025
              </div>
              <div style={{ fontSize: 12, color: "var(--psp-gray-400)", marginTop: 4 }}>
                7 sports · All leagues
              </div>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={3} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
