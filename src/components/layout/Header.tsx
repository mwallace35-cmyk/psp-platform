"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ui/ThemeToggle";

const MAIN_SPORTS = [
  { href: "/football", label: "Football", color: "var(--fb)", emoji: "🏈" },
  { href: "/basketball", label: "Basketball", color: "var(--bb)", emoji: "🏀" },
  { href: "/baseball", label: "Baseball", color: "var(--base)", emoji: "⚾" },
];

const MORE_SPORTS = [
  { href: "/track-field", label: "Track & Field", color: "var(--track)", emoji: "🏃" },
  { href: "/lacrosse", label: "Lacrosse", color: "var(--lac)", emoji: "🥍" },
  { href: "/wrestling", label: "Wrestling", color: "var(--wrest)", emoji: "🤼" },
  { href: "/soccer", label: "Soccer", color: "var(--soccer)", emoji: "⚽" },
];

const RECENT_SCORES = [
  { home: "St. Joseph's Prep", away: "Pittsburgh CC", homeScore: 35, awayScore: 21, status: "Final · 6A State", homeWin: true, href: "/schools/saint-josephs-prep" },
  { home: "Neumann-Goretti", away: "Math Civics Sci", homeScore: 72, awayScore: 58, status: "Final · 4A State", homeWin: true, href: "/schools/neumann-goretti" },
  { home: "Imhotep Charter", away: "MLK", homeScore: 82, awayScore: 59, status: "Final · BBall", homeWin: true, href: "/schools/imhotep-charter" },
  { home: "Roman Catholic", away: "Father Judge", homeScore: 68, awayScore: 61, status: "Final · PCL", homeWin: true, href: "/schools/roman-catholic" },
  { home: "La Salle", away: "Bonner-Prendie", homeScore: 8, awayScore: 2, status: "Final · BSB", homeWin: true, href: "/schools/la-salle-college-hs" },
  { home: "Malvern Prep", away: "Episcopal", homeScore: 6, awayScore: 4, status: "Final · LAX", homeWin: true, href: "/schools/malvern-prep" },
];

const TICKER_PROMOS = [
  { icon: "🗳️", text: "<strong>POTW:</strong> Vote Now", href: "/potw" },
  { icon: "📅", text: "<strong>Friday:</strong> SJP vs La Salle", href: "/events" },
  { icon: "📰", text: "<strong>New:</strong> 2025 All-City Teams", href: "/articles" },
];

const FOOTBALL_SCHOOLS = [
  { name: "St. Joseph's Prep", slug: "saint-josephs-prep" },
  { name: "Imhotep Charter", slug: "imhotep-charter" },
  { name: "La Salle", slug: "la-salle-college-hs" },
  { name: "Arch. Wood", slug: "archbishop-wood" },
  { name: "Roman Catholic", slug: "roman-catholic" },
  { name: "Neumann-Goretti", slug: "neumann-goretti" },
];

const BASKETBALL_SCHOOLS = [
  { name: "Neumann-Goretti", slug: "neumann-goretti" },
  { name: "Roman Catholic", slug: "roman-catholic" },
  { name: "Imhotep Charter", slug: "imhotep-charter" },
  { name: "Father Judge", slug: "father-judge" },
  { name: "La Salle", slug: "la-salle-college-hs" },
  { name: "Arch. Wood", slug: "archbishop-wood" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="logo-mark" style={{ textDecoration: "none" }}>
            PHILLY<span>SPORTS</span>PACK
          </Link>
          <div className="topbar-links" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/articles">Articles</Link>
            <Link href="/community">Community</Link>
            <Link href="/glossary">Glossary</Link>
            <span className="db-tag"><span className="dot" /> Live</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Nav - Desktop */}
      <nav className="mainnav">
        <div className="mainnav-inner">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>

          {/* Football Mega Menu */}
          <div className="nav-dd">
            <Link href="/football" className={`nav-link ${isActive("/football") ? "active" : ""}`}>
              <span className="nav-dot" style={{ background: "var(--fb)" }} />
              Football &#9662;
            </Link>
            <div className="espn-megamenu cols-3">
              <div className="mega-col">
                <div className="mega-col-head">Quick Links</div>
                <Link href="/football">Overview</Link>
                <Link href="/football/leaderboards/rushing_yards">Leaderboards</Link>
                <Link href="/football/championships">Championships</Link>
                <Link href="/football/records">Records</Link>
                <Link href="/compare">Compare Players</Link>
              </div>
              <div className="mega-col">
                <div className="mega-col-head">Top Schools</div>
                {FOOTBALL_SCHOOLS.map((s) => (
                  <Link key={s.slug} href={`/schools/${s.slug}`}>{s.name}</Link>
                ))}
                <Link href="/schools" style={{ color: "var(--psp-gold)", marginTop: 4 }}>All Schools →</Link>
              </div>
              <div className="mega-featured">
                <div className="mf-tag">Featured</div>
                <div className="mf-img" style={{ background: "linear-gradient(135deg, #16a34a 0%, #0a1628 100%)" }} />
                <h4>SJP: 9× State Champions</h4>
                <p>The Prep&apos;s dynasty continues as Philly&apos;s top football program.</p>
              </div>
            </div>
          </div>

          {/* Basketball Mega Menu */}
          <div className="nav-dd">
            <Link href="/basketball" className={`nav-link ${isActive("/basketball") ? "active" : ""}`}>
              <span className="nav-dot" style={{ background: "var(--bb)" }} />
              Basketball &#9662;
            </Link>
            <div className="espn-megamenu cols-3">
              <div className="mega-col">
                <div className="mega-col-head">Quick Links</div>
                <Link href="/basketball">Overview</Link>
                <Link href="/basketball/leaderboards/points">Leaderboards</Link>
                <Link href="/basketball/championships">Championships</Link>
                <Link href="/basketball/records">Records</Link>
                <Link href="/compare">Compare Players</Link>
              </div>
              <div className="mega-col">
                <div className="mega-col-head">Top Schools</div>
                {BASKETBALL_SCHOOLS.map((s) => (
                  <Link key={s.slug} href={`/schools/${s.slug}`}>{s.name}</Link>
                ))}
                <Link href="/schools" style={{ color: "var(--psp-gold)", marginTop: 4 }}>All Schools →</Link>
              </div>
              <div className="mega-featured">
                <div className="mf-tag">Featured</div>
                <div className="mf-img" style={{ background: "linear-gradient(135deg, #ea580c 0%, #0a1628 100%)" }} />
                <h4>N-G: 10 State Titles</h4>
                <p>Neumann-Goretti leads all Philly schools in PIAA basketball championships.</p>
              </div>
            </div>
          </div>

          {/* Baseball — simple link */}
          <Link href="/baseball" className={`nav-link ${isActive("/baseball") ? "active" : ""}`}>
            <span className="nav-dot" style={{ background: "var(--base)" }} />
            Baseball
          </Link>

          {/* More Sports Mega Menu */}
          <div className="nav-dd">
            <div className="nav-link">More &#9662;</div>
            <div className="espn-megamenu cols-4" style={{ minWidth: 520 }}>
              {MORE_SPORTS.map((sport) => (
                <div className="mega-col" key={sport.href} style={{ textAlign: "center", padding: "20px 12px" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{sport.emoji}</div>
                  <Link href={sport.href} style={{ fontWeight: 700, fontSize: 14 }}>{sport.label}</Link>
                </div>
              ))}
            </div>
          </div>

          <Link href="/potw" className={`nav-link ${isActive("/potw") ? "active" : ""}`}>
            POTW
          </Link>

          {/* Data & Tools Dropdown */}
          <div className="nav-dd">
            <div className="nav-link">Tools &#9662;</div>
            <div className="espn-megamenu cols-2" style={{ minWidth: 360 }}>
              <div className="mega-col">
                <div className="mega-col-head">Data</div>
                <Link href="/search">🔍 Search</Link>
                <Link href="/compare">📊 Compare Players</Link>
                <Link href="/glossary">📖 Stats Glossary</Link>
                <Link href="/our-guys">🌟 Our Guys</Link>
              </div>
              <div className="mega-col">
                <div className="mega-col-head">More</div>
                <Link href="/recruiting">⭐ Recruiting</Link>
                <Link href="/coaches">📋 Coaches</Link>
                <Link href="/events">📅 Events</Link>
                <Link href="/community">💬 Community</Link>
              </div>
            </div>
          </div>

          <div className="nav-right">
            <Link href="/schools" className={`nav-link ${isActive("/schools") ? "active" : ""}`}>Schools</Link>
            <Link href="/search" className="nav-link">Search</Link>
            <Link href="/signup" className="nav-link" style={{ color: "var(--psp-gold)" }}>Sign Up</Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="nav-link"
              style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 18 }}
              aria-label="Menu"
            >
              &#9776;
            </button>
          </div>
        </div>
      </nav>

      {/* Score Strip — Mixed Content */}
      <div className="scorestrip">
        <div className="ss-label">Scores</div>
        <div className="ss-scroll">
          {RECENT_SCORES.map((game, i) => (
            <Link key={i} href={game.href} className="ss-game" style={{ textDecoration: "none" }}>
              <div className={`ss-team ${game.homeWin ? "winner" : ""}`}>
                <span className="name">{game.home}</span>
                <span className="score">{game.homeScore}</span>
              </div>
              <div className={`ss-team ${!game.homeWin ? "winner" : ""}`}>
                <span className="name">{game.away}</span>
                <span className="score">{game.awayScore}</span>
              </div>
              <div className="ss-status">{game.status}</div>
            </Link>
          ))}
          {/* Mixed ticker items */}
          {TICKER_PROMOS.map((promo, i) => (
            <Link key={`promo-${i}`} href={promo.href} className="ss-promo" style={{ textDecoration: "none" }}>
              <span className="ss-promo-icon">{promo.icon}</span>
              <span className="ss-promo-text" dangerouslySetInnerHTML={{ __html: promo.text }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <>
          <div
            className="mobile-nav-overlay open"
            onClick={() => setMobileOpen(false)}
          />
          <div className="mobile-nav-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ color: "var(--psp-gold)", fontWeight: 800, fontSize: 16, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" as const, letterSpacing: 1 }}>Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}
              >
                &#10005;
              </button>
            </div>
            <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
            {[...MAIN_SPORTS, ...MORE_SPORTS].map((sport) => (
              <Link key={sport.href} href={sport.href} onClick={() => setMobileOpen(false)}>
                <span className="nav-dot" style={{ background: sport.color }} />
                {sport.label}
              </Link>
            ))}
            <Link href="/events" onClick={() => setMobileOpen(false)}>Events</Link>
            <Link href="/articles" onClick={() => setMobileOpen(false)}>News</Link>
            <Link href="/potw" onClick={() => setMobileOpen(false)}>Player of the Week</Link>
            <Link href="/our-guys" onClick={() => setMobileOpen(false)}>Our Guys</Link>
            <Link href="/recruiting" onClick={() => setMobileOpen(false)}>Recruiting</Link>
            <Link href="/coaches" onClick={() => setMobileOpen(false)}>Coaches</Link>
            <Link href="/community" onClick={() => setMobileOpen(false)}>Community</Link>
            <Link href="/compare" onClick={() => setMobileOpen(false)}>Compare Players</Link>
            <Link href="/schools" onClick={() => setMobileOpen(false)}>All Schools</Link>
            <Link href="/search" onClick={() => setMobileOpen(false)}>Search</Link>
          </div>
        </>
      )}
    </header>
  );
}
