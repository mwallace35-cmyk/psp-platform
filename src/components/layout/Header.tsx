"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ui/ThemeToggle";

const MAIN_SPORTS = [
  { href: "/football", label: "Football", color: "var(--fb)" },
  { href: "/basketball", label: "Basketball", color: "var(--bb)" },
  { href: "/baseball", label: "Baseball", color: "var(--base)" },
];

const MORE_SPORTS = [
  { href: "/track-field", label: "Track & Field", color: "var(--track)" },
  { href: "/lacrosse", label: "Lacrosse", color: "var(--lac)" },
  { href: "/wrestling", label: "Wrestling", color: "var(--wrest)" },
  { href: "/soccer", label: "Soccer", color: "var(--soccer)" },
];

const RECENT_SCORES = [
  { home: "St. Joseph's Prep", away: "Pittsburgh CC", homeScore: 35, awayScore: 21, status: "Final · 6A State", homeWin: true, href: "/football/schools/saint-josephs-prep" },
  { home: "Neumann-Goretti", away: "Math Civics Sci", homeScore: 72, awayScore: 58, status: "Final · 4A State", homeWin: true, href: "/basketball/schools/neumann-goretti" },
  { home: "Imhotep Charter", away: "MLK", homeScore: 82, awayScore: 59, status: "Final · BBall", homeWin: true, href: "/basketball/schools/imhotep-charter" },
  { home: "Roman Catholic", away: "Father Judge", homeScore: 68, awayScore: 61, status: "Final · PCL", homeWin: true, href: "/basketball/schools/roman-catholic" },
  { home: "La Salle", away: "Bonner-Prendie", homeScore: 8, awayScore: 2, status: "Final · BSB", homeWin: true, href: "/baseball/schools/la-salle-college-hs" },
  { home: "Malvern Prep", away: "Episcopal", homeScore: 6, awayScore: 4, status: "Final · LAX", homeWin: true, href: "/lacrosse/schools/malvern-prep" },
  { home: "Arch. Wood", away: "O'Hara", homeScore: 28, awayScore: 14, status: "Final · FB", homeWin: true, href: "/football/schools/archbishop-wood" },
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
            <Link href="/glossary">Glossary</Link>
            <Link href="/search">Hall of Fame</Link>
            <span className="db-tag"><span className="dot" /> Supabase Live</span>
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
          {MAIN_SPORTS.map((sport) => (
            <Link
              key={sport.href}
              href={sport.href}
              className={`nav-link ${isActive(sport.href) ? "active" : ""}`}
            >
              <span className="nav-dot" style={{ background: sport.color }} />
              {sport.label}
            </Link>
          ))}

          {/* More Sports Dropdown */}
          <div className="nav-dd">
            <div className="nav-link">More &#9662;</div>
            <div className="dd-menu">
              {MORE_SPORTS.map((sport) => (
                <Link key={sport.href} href={sport.href}>
                  <span className="nav-dot" style={{ background: sport.color }} />
                  {sport.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Events Dropdown */}
          <div className="nav-dd">
            <Link href="/events" className="nav-link">Events &#9662;</Link>
            <div className="dd-menu">
              <Link href="/events">Upcoming Events</Link>
              <Link href="/events">Camps &amp; Showcases</Link>
            </div>
          </div>

          <Link href="/articles" className={`nav-link ${isActive("/articles") ? "active" : ""}`}>
            News
          </Link>
          <Link href="/potw" className={`nav-link ${isActive("/potw") ? "active" : ""}`}>
            POTW
          </Link>
          <Link href="/community" className={`nav-link ${isActive("/community") ? "active" : ""}`}>
            Community
          </Link>

          {/* Data & Recruiting Dropdown */}
          <div className="nav-dd">
            <div className="nav-link">More &#9662;</div>
            <div className="dd-menu">
              <Link href="/our-guys">🌟 Our Guys</Link>
              <Link href="/recruiting">⭐ Recruiting</Link>
              <Link href="/coaches">📋 Coaches</Link>
              <Link href="/compare">📊 Compare Players</Link>
            </div>
          </div>

          <div className="nav-right">
            <Link href="/search" className="nav-link">Schools</Link>
            <Link href="/search" className="nav-link">Search</Link>
            <Link href="/signup" className="nav-link" style={{ color: 'var(--psp-gold)' }}>Sign Up</Link>

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

      {/* Score Strip */}
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
              <span style={{ color: "var(--psp-gold)", fontWeight: 800, fontSize: 16 }}>Menu</span>
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
            <Link href="/search" onClick={() => setMobileOpen(false)}>Search</Link>
          </div>
        </>
      )}
    </header>
  );
}
