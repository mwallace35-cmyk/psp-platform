"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AlumniCard from "@/components/our-guys/AlumniCard";
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

const PLATFORM_ICONS: Record<string, { icon: string; label: string }> = {
  twitter: { icon: "𝕏", label: "X" },
  instagram: { icon: "📷", label: "IG" },
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

  const LEVEL_LABELS: Record<string, string> = {
    pro: "Professional", college: "Collegiate", coaching: "Coaching", staff: "Staff",
  };

  return (
    <div className="hub-dashboard">
      {/* ════════ SUB-NAV LINKS ════════ */}
      <nav className="hub-subnav">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
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

          {/* FEATURED SPOTLIGHT */}
          {featuredAlumni ? (
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
                    {LEVEL_LABELS[featuredAlumni.current_level] || featuredAlumni.current_level}
                    {featuredAlumni.current_org ? ` — ${featuredAlumni.current_org}` : ""}
                    {featuredAlumni.college ? ` · ${featuredAlumni.college}` : ""}
                    {featuredAlumni.high_school_name ? ` · 🏫 ${featuredAlumni.high_school_name}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="hub-featured-placeholder" style={{ background: "linear-gradient(135deg, #f0a50088, var(--psp-navy))" }}>
              <div className="hub-fp-content">
                <span style={{ fontSize: 48 }}>🌟</span>
                <h2>Our Guys — Where They Are Now</h2>
                <p>{counts.nfl} NFL · {counts.nba} NBA · {counts.mlb} MLB players from Philadelphia high schools</p>
              </div>
            </div>
          )}

          {/* SEARCH */}
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

          {/* ALUMNI GRID */}
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
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}>
              {filtered.map(a => (
                <AlumniCard key={a.id} person={a as any} />
              ))}
            </div>
          )}

          <PSPPromo size="banner" variant={1} />

        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside className="hub-sidebar">
          {/* Pro Athletes Count */}
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

          {/* Social Feed */}
          {socialPosts.length > 0 ? (
            <div className="hub-widget">
              <div className="hub-wh">📱 Social Feed</div>
              <div className="hub-wb hub-wb-tight">
                {socialPosts.slice(0, 5).map(post => {
                  const platform = PLATFORM_ICONS[post.platform] || PLATFORM_ICONS.twitter;
                  return (
                    <a key={post.id} href={post.post_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "block", padding: "8px 14px", borderBottom: "1px solid var(--g100)", textDecoration: "none", color: "inherit" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 12 }}>{platform.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 700 }}>{post.next_level_tracking?.person_name || "Unknown"}</span>
                        <span style={{ fontSize: 9, color: "var(--g400)", marginLeft: "auto" }}>{platform.label}</span>
                      </div>
                      {post.caption_preview && (
                        <p style={{ fontSize: 11, color: "var(--g500)", lineHeight: 1.4, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {post.caption_preview}
                        </p>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="hub-widget">
              <div className="hub-wh">📱 Social Feed</div>
              <div className="hub-wb" style={{ padding: 16, textAlign: "center", color: "var(--g400)", fontSize: 12 }}>
                Social posts will appear here once curated by admins.
              </div>
            </div>
          )}

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

          {/* Coaches Corner */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: "#16a34a" }}>📋 Coaches Corner</div>
            <div className="hub-wb" style={{ padding: 14 }}>
              <p style={{ fontSize: 12, color: "var(--g500)", lineHeight: 1.5, margin: "0 0 10px" }}>
                Former Philly players now coaching at the college and pro level.
              </p>
              <Link href="/coaches" className="hub-widget-link">
                Full Coaches Directory →
              </Link>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={4} />
        </aside>
      </div>
    </div>
  );
}
