"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PSPPromo from "@/components/ads/PSPPromo";

interface Alumni {
  id: number;
  person_name: string;
  current_level: string;
  current_org?: string;
  current_role?: string;
  college?: string;
  pro_team?: string;
  pro_league?: string;
  draft_info?: string;
  bio_note?: string;
  featured?: boolean;
  sport_id?: string;
  high_school_name?: string;
  social_twitter?: string;
  social_instagram?: string;
}

interface SocialPost {
  id: number;
  platform: string;
  post_url: string;
  post_embed_html?: string;
  caption_preview?: string;
  curated_at?: string;
  next_level_tracking?: {
    person_name: string;
    current_org?: string;
    current_role?: string;
  };
}

interface Counts {
  nfl: number;
  nba: number;
  mlb: number;
  college: number;
  coaching: number;
}

interface OurGuysClientProps {
  alumni: Alumni[];
  socialPosts: SocialPost[];
  featuredAlumni: Alumni | null;
  counts: Counts;
}

const FILTER_TABS = [
  { key: "all", label: "All", icon: "🌟" },
  { key: "nfl", label: "NFL", icon: "🏈" },
  { key: "nba", label: "NBA", icon: "🏀" },
  { key: "mlb", label: "MLB", icon: "⚾" },
  { key: "college", label: "College", icon: "🎓" },
  { key: "coaching", label: "Coaching", icon: "📋" },
];

const LEAGUE_META: Record<string, { color: string; emoji: string; label: string }> = {
  NFL: { color: "#16a34a", emoji: "🏈", label: "NFL" },
  NBA: { color: "#ea580c", emoji: "🏀", label: "NBA" },
  MLB: { color: "#dc2626", emoji: "⚾", label: "MLB" },
};

export default function OurGuysClient({ alumni, socialPosts, featuredAlumni, counts }: OurGuysClientProps) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = alumni;
    if (filter !== "all") {
      if (filter === "nfl") result = result.filter(a => a.pro_league === "NFL");
      else if (filter === "nba") result = result.filter(a => a.pro_league === "NBA");
      else if (filter === "mlb") result = result.filter(a => a.pro_league === "MLB");
      else if (filter === "college") result = result.filter(a => a.current_level === "college");
      else if (filter === "coaching") result = result.filter(a => a.current_level === "coaching" || a.current_level === "staff");
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.person_name.toLowerCase().includes(q) ||
        a.current_org?.toLowerCase().includes(q) ||
        a.high_school_name?.toLowerCase().includes(q) ||
        a.college?.toLowerCase().includes(q) ||
        a.pro_team?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [alumni, filter, search]);

  const getCountForTab = (key: string): number => {
    if (key === "all") return alumni.length;
    return counts[key as keyof Counts] || 0;
  };

  // Group alumni by league for pro athlete sections
  const nflPlayers = alumni.filter(a => a.pro_league === "NFL");
  const nbaPlayers = alumni.filter(a => a.pro_league === "NBA");
  const mlbPlayers = alumni.filter(a => a.pro_league === "MLB");
  const collegePlayers = alumni.filter(a => a.current_level === "college");
  const coachingStaff = alumni.filter(a => a.current_level === "coaching" || a.current_level === "staff");

  // Schools pipeline: count how many pros each school produced
  const schoolCounts = new Map<string, { name: string; count: number; nfl: number; nba: number; mlb: number }>();
  for (const a of alumni) {
    if (!a.high_school_name) continue;
    const name = a.high_school_name;
    if (!schoolCounts.has(name)) schoolCounts.set(name, { name, count: 0, nfl: 0, nba: 0, mlb: 0 });
    const sc = schoolCounts.get(name)!;
    sc.count++;
    if (a.pro_league === "NFL") sc.nfl++;
    else if (a.pro_league === "NBA") sc.nba++;
    else if (a.pro_league === "MLB") sc.mlb++;
  }
  const topSchools = Array.from(schoolCounts.values()).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div className="hub-dashboard">
      {/* ════════ HIGHLIGHTS TICKER (ESPN scores-strip style) ════════ */}
      {alumni.length > 0 && (
        <div className="hub-scores-strip">
          <div className="hub-scores-inner">
            {alumni.filter(a => a.pro_league).slice(0, 16).map((a) => {
              const league = LEAGUE_META[a.pro_league || ""] || LEAGUE_META.NFL;
              return (
                <div key={a.id} className="hub-score-chip" style={{ "--sc": league.color } as React.CSSProperties}>
                  <div className="hsc-team hsc-w">
                    <span className="hsc-name">{a.person_name}</span>
                    <span className="hsc-num" style={{ fontSize: 10 }}>{league.emoji}</span>
                  </div>
                  <div className="hsc-team">
                    <span className="hsc-name">{a.current_org || a.pro_team || "—"}</span>
                  </div>
                  <div className="hsc-meta">{a.high_school_name || ""}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════ SUB-NAV ════════ */}
      <nav className="hub-subnav">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setFilter(tab.key); setSearch(""); }}
            className={filter === tab.key ? "hub-subnav-active" : ""}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: filter === tab.key ? "var(--psp-gold)" : "inherit",
              fontWeight: filter === tab.key ? 700 : 500,
              borderBottom: filter === tab.key ? "2px solid var(--psp-gold)" : "2px solid transparent",
              padding: "8px 14px", fontSize: 13,
              fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
            }}
          >
            {tab.icon} {tab.label} ({getCountForTab(tab.key)})
          </button>
        ))}
      </nav>

      {/* ════════ MAIN 2-COL LAYOUT ════════ */}
      <div className="hub-body">
        {/* ── LEFT: MAIN CONTENT ── */}
        <div className="hub-main">

          {/* SEARCH BAR */}
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search by name, school, team..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 6,
                border: "1px solid var(--g200)", background: "var(--card)",
                color: "var(--text)", fontSize: 13, boxSizing: "border-box",
              }}
            />
          </div>

          {/* FEATURED SPOTLIGHT */}
          {filter === "all" && !search && featuredAlumni ? (
            <div className="hub-featured">
              <div
                className="hub-featured-img"
                style={{
                  background: "linear-gradient(135deg, #f0a500cc 0%, var(--psp-navy) 100%)",
                }}
              >
                <span className="hub-featured-badge" style={{ background: "#f0a500" }}>SPOTLIGHT</span>
                <div className="hub-featured-overlay">
                  <h2>{featuredAlumni.person_name}</h2>
                  <p>
                    {featuredAlumni.current_org || featuredAlumni.pro_team || ""}
                    {featuredAlumni.college ? ` · ${featuredAlumni.college}` : ""}
                    {featuredAlumni.high_school_name ? ` · 🏫 ${featuredAlumni.high_school_name}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ) : filter === "all" && !search ? (
            <div className="hub-featured-placeholder" style={{ background: "linear-gradient(135deg, #f0a50088, var(--psp-navy))" }}>
              <div className="hub-fp-content">
                <span style={{ fontSize: 48 }}>🌟</span>
                <h2>Our Guys — Where They Are Now</h2>
                <p>{counts.nfl} NFL · {counts.nba} NBA · {counts.mlb} MLB players from Philadelphia high schools</p>
              </div>
            </div>
          ) : null}

          {/* ── FILTERED VIEW: Alumni table ── */}
          {(filter !== "all" || search) && (
            <div>
              {filtered.length === 0 ? (
                <div style={{
                  padding: 40, textAlign: "center", color: "var(--g400)",
                  background: "var(--card)", borderRadius: 8, border: "1px solid var(--g100)",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>No alumni found</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {search ? "Try a different search term." : "Alumni will appear here once added by admins."}
                  </div>
                </div>
              ) : (
                <div className="hub-performers">
                  <div className="hub-perf-list">
                    {filtered.map((a, i) => (
                      <div key={a.id} className={`hub-perf-row ${i < 3 ? "hub-perf-top" : ""}`}>
                        <span className="hub-perf-rank" style={i < 3 ? { background: "#f0a500", color: "#fff" } : undefined}>{i + 1}</span>
                        <div className="hub-perf-info">
                          <span className="hub-perf-name">{a.person_name}</span>
                          <span className="hub-perf-school">{a.high_school_name || ""}{a.college ? ` → ${a.college}` : ""}</span>
                        </div>
                        <span className="hub-perf-stat">
                          <strong>{a.current_org || a.pro_team || a.current_level}</strong>
                          <span>{a.pro_league || a.current_role || ""}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── DEFAULT VIEW: League roster tables ── */}
          {filter === "all" && !search && (
            <>
              {/* NFL ROSTER */}
              {nflPlayers.length > 0 && (
                <LeagueRosterSection
                  league="NFL"
                  color="#16a34a"
                  emoji="🏈"
                  players={nflPlayers}
                  onViewAll={() => setFilter("nfl")}
                />
              )}

              <PSPPromo size="banner" variant={1} />

              {/* NBA ROSTER */}
              {nbaPlayers.length > 0 && (
                <LeagueRosterSection
                  league="NBA"
                  color="#ea580c"
                  emoji="🏀"
                  players={nbaPlayers}
                  onViewAll={() => setFilter("nba")}
                />
              )}

              {/* MLB ROSTER */}
              {mlbPlayers.length > 0 && (
                <LeagueRosterSection
                  league="MLB"
                  color="#dc2626"
                  emoji="⚾"
                  players={mlbPlayers}
                  onViewAll={() => setFilter("mlb")}
                />
              )}

              {/* SCHOOLS PIPELINE — dynasty-grid style */}
              {topSchools.length > 0 && (
                <div className="hub-dynasties">
                  <div className="hub-sec-head">
                    <h3>Pro Pipeline — Top Schools</h3>
                    <Link href="/schools" className="hub-more">All Schools →</Link>
                  </div>
                  <div className="hub-dynasty-grid">
                    {topSchools.map((s, i) => (
                      <div key={s.name} className="hub-dynasty-card">
                        <span className="hub-dyn-rank" style={i < 3 ? { background: "#f0a500" } : undefined}>{i + 1}</span>
                        <span className="hub-dyn-name">{s.name}</span>
                        <span className="hub-dyn-count">{s.count} pros</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COLLEGE / COACHING quick lists */}
              {collegePlayers.length > 0 && (
                <div className="hub-performers">
                  <div className="hub-sec-head">
                    <h3>🎓 College Athletes</h3>
                    <button onClick={() => setFilter("college")} className="hub-more" style={{ background: "none", border: "none", cursor: "pointer" }}>View All →</button>
                  </div>
                  <div className="hub-perf-list">
                    {collegePlayers.slice(0, 5).map((a, i) => (
                      <div key={a.id} className="hub-perf-row">
                        <span className="hub-perf-rank">{i + 1}</span>
                        <div className="hub-perf-info">
                          <span className="hub-perf-name">{a.person_name}</span>
                          <span className="hub-perf-school">{a.high_school_name || ""}</span>
                        </div>
                        <span className="hub-perf-stat">
                          <strong>{a.current_org || "—"}</strong>
                          <span>{a.current_role || "Athlete"}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {coachingStaff.length > 0 && (
                <div className="hub-performers">
                  <div className="hub-sec-head">
                    <h3>📋 Coaching & Staff</h3>
                    <button onClick={() => setFilter("coaching")} className="hub-more" style={{ background: "none", border: "none", cursor: "pointer" }}>View All →</button>
                  </div>
                  <div className="hub-perf-list">
                    {coachingStaff.slice(0, 5).map((a, i) => (
                      <div key={a.id} className="hub-perf-row">
                        <span className="hub-perf-rank">{i + 1}</span>
                        <div className="hub-perf-info">
                          <span className="hub-perf-name">{a.person_name}</span>
                          <span className="hub-perf-school">{a.high_school_name || ""}</span>
                        </div>
                        <span className="hub-perf-stat">
                          <strong>{a.current_org || "—"}</strong>
                          <span>{a.current_role || "Coach"}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside className="hub-sidebar">
          {/* Pro Athletes Breakdown */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: "#f0a500" }}>🌟 Pro Athletes</div>
            <div className="hub-wb">
              <div className="hub-wr"><span>🏈 NFL</span><strong>{counts.nfl}</strong></div>
              <div className="hub-wr"><span>🏀 NBA</span><strong>{counts.nba}</strong></div>
              <div className="hub-wr"><span>⚾ MLB</span><strong>{counts.mlb}</strong></div>
              <div className="hub-wr"><span>🎓 College</span><strong>{counts.college}</strong></div>
              <div className="hub-wr"><span>📋 Coaching</span><strong>{counts.coaching}</strong></div>
              <div className="hub-wr" style={{ fontWeight: 700, borderTop: "2px solid var(--g200)" }}>
                <span>Total</span><strong style={{ color: "var(--psp-gold)" }}>{alumni.length}</strong>
              </div>
            </div>
          </div>

          {/* Hall of Famers / Notable */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: "#7c3aed" }}>👑 Hall of Famers</div>
            <div className="hub-wb hub-wb-tight">
              {alumni.filter(a => a.bio_note?.toLowerCase().includes("hall of fame")).length > 0 ? (
                alumni.filter(a => a.bio_note?.toLowerCase().includes("hall of fame")).slice(0, 5).map(a => (
                  <div key={a.id} style={{ padding: "8px 14px", borderBottom: "1px solid var(--g100)", fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>{a.person_name}</strong>
                      <span style={{ color: "#f0a500", fontSize: 10 }}>{a.pro_league}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--g400)" }}>{a.high_school_name} → {a.current_org || a.pro_team}</div>
                  </div>
                ))
              ) : (
                <>
                  {[
                    { name: "Wilt Chamberlain", school: "Overbrook", team: "NBA", note: "2× NBA Champion" },
                    { name: "Kobe Bryant", school: "Lower Merion", team: "NBA", note: "5× NBA Champion" },
                    { name: "Mike Piazza", school: "Phoenixville", team: "MLB", note: "12× All-Star" },
                    { name: "Reggie White", school: "Howard HS", team: "NFL", note: "2× NFL DPOY" },
                    { name: "Earl Monroe", school: "Bartram", team: "NBA", note: "1973 NBA Champion" },
                  ].map((h, i) => (
                    <div key={i} style={{ padding: "8px 14px", borderBottom: "1px solid var(--g100)", fontSize: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>{h.name}</strong>
                        <span style={{ color: "#f0a500", fontSize: 10 }}>{h.team}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "var(--g400)" }}>{h.school} · {h.note}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="hub-widget">
            <div className="hub-wh">Quick Links</div>
            <div className="hub-wb">
              <Link href="/recruiting" className="hub-ql">→ Recruiting Central</Link>
              <Link href="/coaches" className="hub-ql">→ Coaches Directory</Link>
              <Link href="/search" className="hub-ql">→ Search Players</Link>
              <Link href="/compare" className="hub-ql">→ Compare Players</Link>
              <Link href="/community" className="hub-ql">→ Community</Link>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={3} />

          {/* Social Feed */}
          {socialPosts.length > 0 && (
            <div className="hub-widget">
              <div className="hub-wh">📱 Social Feed</div>
              <div className="hub-wb hub-wb-tight">
                {socialPosts.slice(0, 5).map(post => (
                  <a key={post.id} href={post.post_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "block", padding: "8px 14px", borderBottom: "1px solid var(--g100)", textDecoration: "none", color: "inherit" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{post.next_level_tracking?.person_name || "Unknown"}</span>
                    </div>
                    {post.caption_preview && (
                      <p style={{ fontSize: 11, color: "var(--g500)", lineHeight: 1.4, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {post.caption_preview}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          <PSPPromo size="sidebar" variant={4} />
        </aside>
      </div>
    </div>
  );
}

/* ── League Roster Section Component ── */
function LeagueRosterSection({
  league, color, emoji, players, onViewAll,
}: {
  league: string; color: string; emoji: string;
  players: Alumni[]; onViewAll: () => void;
}) {
  return (
    <div className="hub-standings-section">
      <div className="hub-sec-head">
        <h3>{emoji} {league} Roster ({players.length})</h3>
        <button onClick={onViewAll} className="hub-more" style={{ background: "none", border: "none", cursor: "pointer" }}>View All →</button>
      </div>
      <div className="hub-league-table" style={{ width: "100%" }}>
        <div className="hub-lt-head" style={{ background: color }}>{league} Players from Philly</div>
        <div className="hub-lt-hdr">
          <span className="hub-lt-team">PLAYER</span>
          <span className="hub-lt-stat" style={{ flex: "1.2" }}>TEAM</span>
          <span className="hub-lt-stat" style={{ flex: "1.2" }}>SCHOOL</span>
        </div>
        {players.slice(0, 8).map((a, i) => (
          <div key={a.id} className={`hub-lt-row ${i === 0 ? "hub-lt-first" : ""}`}>
            <span className="hub-lt-team">{a.person_name}</span>
            <span className="hub-lt-stat" style={{ flex: "1.2" }}>{a.current_org || a.pro_team || "—"}</span>
            <span className="hub-lt-stat" style={{ flex: "1.2" }}>{a.high_school_name || "—"}</span>
          </div>
        ))}
      </div>
      {players.length > 8 && (
        <button
          onClick={onViewAll}
          style={{
            display: "block", width: "100%", padding: "10px", marginTop: 8,
            background: "var(--card)", border: "1px solid var(--g100)", borderRadius: 6,
            color: color, fontSize: 12, fontWeight: 700, cursor: "pointer",
            textAlign: "center", fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: 0.5, textTransform: "uppercase",
          }}
        >
          Show all {players.length} {league} players →
        </button>
      )}
    </div>
  );
}
