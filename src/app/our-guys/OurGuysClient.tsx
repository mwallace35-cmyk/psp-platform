"use client";

import { useState, useMemo } from "react";
import AlumniCard from "@/components/our-guys/AlumniCard";
import SocialFeed from "@/components/our-guys/SocialFeed";
import SpotlightHero from "@/components/our-guys/SpotlightHero";
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

  // Find the latest social post for the featured alumni
  const featuredPost = featuredAlumni
    ? socialPosts.find(p => p.next_level_tracking?.person_name === featuredAlumni.person_name) || null
    : null;

  return (
    <>
      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)",
        padding: "32px 20px 24px",
        textAlign: "center",
        color: "#fff",
        marginBottom: 20,
        borderBottom: "3px solid #f0a500",
      }}>
        <h1 style={{ fontSize: 32, fontFamily: "'Bebas Neue', sans-serif", margin: "0 0 6px", letterSpacing: 1 }}>
          Our Guys
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 20px" }}>
          Where They Are Now — Philly Athletes Making It at the Next Level
        </p>

        {/* Count badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {counts.nfl > 0 && (
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "8px 14px", fontSize: 12 }}>
              <strong style={{ color: "#f0a500", fontSize: 18 }}>{counts.nfl}</strong>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>NFL</div>
            </div>
          )}
          {counts.nba > 0 && (
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "8px 14px", fontSize: 12 }}>
              <strong style={{ color: "#ea580c", fontSize: 18 }}>{counts.nba}</strong>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>NBA</div>
            </div>
          )}
          {counts.mlb > 0 && (
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "8px 14px", fontSize: 12 }}>
              <strong style={{ color: "#dc2626", fontSize: 18 }}>{counts.mlb}</strong>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>MLB</div>
            </div>
          )}
          {counts.college > 0 && (
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "8px 14px", fontSize: 12 }}>
              <strong style={{ color: "#16a34a", fontSize: 18 }}>{counts.college}</strong>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>College</div>
            </div>
          )}
          {counts.coaching > 0 && (
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "8px 14px", fontSize: 12 }}>
              <strong style={{ color: "#3b82f6", fontSize: 18 }}>{counts.coaching}</strong>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Coaching</div>
            </div>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="espn-container">
        <main>
          {/* Spotlight */}
          <SpotlightHero alumni={featuredAlumni} latestPost={featuredPost} />

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: filter === tab.key ? "2px solid #f0a500" : "2px solid var(--g200)",
                  background: filter === tab.key ? "#f0a500" : "var(--card)",
                  color: filter === tab.key ? "#0a1628" : "var(--text)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: ".15s",
                }}
              >
                {tab.icon} {tab.label}
                <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.7 }}>
                  ({getCountForTab(tab.key)})
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search by name, school, team..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid var(--g200)",
                background: "var(--card)",
                color: "var(--text)",
                fontSize: 13,
              }}
            />
          </div>

          {/* Alumni grid */}
          {filtered.length === 0 ? (
            <div style={{
              padding: 40,
              textAlign: "center",
              color: "var(--g400)",
              background: "var(--card)",
              borderRadius: 8,
              border: "1px solid var(--g100)",
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
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 12,
            }}>
              {filtered.map(a => (
                <AlumniCard key={a.id} person={a} />
              ))}
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside>
          {/* Social Feed */}
          <SocialFeed posts={socialPosts} />

          {/* Coaches Corner */}
          <div className="widget" style={{ marginTop: 16 }}>
            <div className="w-head">📋 Coaches Corner</div>
            <div className="w-body" style={{ padding: 14 }}>
              <p style={{ fontSize: 12, color: "var(--g500)", lineHeight: 1.5, margin: 0 }}>
                Former Philly players now coaching at the college and pro level.
              </p>
              <a
                href="/coaches"
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#3b82f6",
                  textDecoration: "none",
                }}
              >
                View Full Coaches Directory →
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="widget" style={{ marginTop: 16 }}>
            <div className="w-head">🔗 Quick Links</div>
            <div className="w-body">
              {[
                { href: "/recruiting", label: "Recruiting Central", icon: "⭐" },
                { href: "/search", label: "Search Players", icon: "🔍" },
                { href: "/coaches", label: "Coaches Directory", icon: "📋" },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "8px 14px",
                    borderBottom: "1px solid var(--g100)",
                    textDecoration: "none",
                    color: "var(--text)",
                    fontSize: 12,
                    fontWeight: 600,
                    transition: ".1s",
                  }}
                >
                  {link.icon} {link.label}
                </a>
              ))}
            </div>
          </div>

          <PSPPromo size="sidebar" />
        </aside>
      </div>
    </>
  );
}
