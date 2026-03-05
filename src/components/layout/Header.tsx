"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ui/ThemeToggle";
import SearchOverlay from "../search/SearchOverlay";

const MAIN_SPORTS = [
  { href: "/football", label: "Football", color: "var(--fb)", emoji: "🏈" },
  { href: "/basketball", label: "Basketball", color: "var(--bb)", emoji: "🏀" },
  { href: "/baseball", label: "Baseball", color: "var(--base)", emoji: "⚾" },
];

const MORE_SPORTS = [
  { href: "/flag-football", label: "Flag Football", color: "#ec4899", emoji: "🏳️" },
  { href: "/girls-basketball", label: "Girls Basketball", color: "#f59e0b", emoji: "🏀" },
  { href: "/track-field", label: "Track & Field", color: "var(--track)", emoji: "🏃" },
  { href: "/lacrosse", label: "Lacrosse", color: "var(--lac)", emoji: "🥍" },
  { href: "/wrestling", label: "Wrestling", color: "var(--wrest)", emoji: "🤼" },
  { href: "/soccer", label: "Soccer", color: "var(--soccer)", emoji: "⚽" },
];


/* MaxPreps-style sport dropdown links — each sport gets the same structure */
const SPORT_DD_LINKS: Record<string, { label: string; href: string }[]> = {
  football: [
    { label: "Scores", href: "/football/scores" },
    { label: "News", href: "/football/news" },
    { label: "Teams", href: "/football/teams" },
    { label: "Leaderboards", href: "/football/leaderboards/rushing_yards" },
    { label: "Championships", href: "/football/championships" },
    { label: "Records", href: "/football/records" },
    { label: "Coaches", href: "/coaches" },
    { label: "Compare Players", href: "/compare" },
  ],
  basketball: [
    { label: "Scores", href: "/basketball/scores" },
    { label: "News", href: "/basketball/news" },
    { label: "Teams", href: "/basketball/teams" },
    { label: "Leaderboards", href: "/basketball/leaderboards/points" },
    { label: "Championships", href: "/basketball/championships" },
    { label: "Records", href: "/basketball/records" },
    { label: "Coaches", href: "/coaches" },
    { label: "Compare Players", href: "/compare" },
  ],
  baseball: [
    { label: "Scores", href: "/baseball/scores" },
    { label: "News", href: "/baseball/news" },
    { label: "Teams", href: "/baseball/teams" },
    { label: "Championships", href: "/baseball/championships" },
    { label: "Records", href: "/baseball/records" },
    { label: "Coaches", href: "/coaches" },
  ],
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

          {/* Football Dropdown */}
          <div className="nav-dd">
            <Link href="/football" className={`nav-link ${isActive("/football") ? "active" : ""}`}>
              <span className="nav-dot" style={{ background: "var(--fb)" }} />
              Football &#9662;
            </Link>
            <div className="mp-dropdown">
              {SPORT_DD_LINKS.football.map((link) => (
                <Link key={link.href + link.label} href={link.href}>{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Basketball Dropdown */}
          <div className="nav-dd">
            <Link href="/basketball" className={`nav-link ${isActive("/basketball") ? "active" : ""}`}>
              <span className="nav-dot" style={{ background: "var(--bb)" }} />
              Basketball &#9662;
            </Link>
            <div className="mp-dropdown">
              {SPORT_DD_LINKS.basketball.map((link) => (
                <Link key={link.href + link.label} href={link.href}>{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Baseball Dropdown */}
          <div className="nav-dd">
            <Link href="/baseball" className={`nav-link ${isActive("/baseball") ? "active" : ""}`}>
              <span className="nav-dot" style={{ background: "var(--base)" }} />
              Baseball &#9662;
            </Link>
            <div className="mp-dropdown">
              {SPORT_DD_LINKS.baseball.map((link) => (
                <Link key={link.href + link.label} href={link.href}>{link.label}</Link>
              ))}
            </div>
          </div>

          {/* More Sports Dropdown */}
          <div className="nav-dd">
            <div className="nav-link">More &#9662;</div>
            <div className="mp-dropdown mp-dropdown-sports">
              {MORE_SPORTS.map((sport) => (
                <Link key={sport.href} href={sport.href}>
                  <span style={{ marginRight: 8 }}>{sport.emoji}</span>
                  {sport.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/potw" className={`nav-link ${isActive("/potw") ? "active" : ""}`}>
            POTW
          </Link>

          <Link href="/gotw" className={`nav-link ${isActive("/gotw") ? "active" : ""}`}>
            GOTW
          </Link>

          <Link href="/our-guys" className={`nav-link ${isActive("/our-guys") ? "active" : ""}`}>
            Our Guys
          </Link>

          <Link href="/recruiting" className={`nav-link ${isActive("/recruiting") ? "active" : ""}`}>
            Recruiting
          </Link>

          {/* More Mega Menu */}
          <div className="nav-dd">
            <div className="nav-link">More &#9662;</div>
            <div className="espn-megamenu cols-2">
              <div className="mega-col">
                <div className="mega-col-head">Explore</div>
                <Link href="/scores">📊 Scores &amp; Box Scores</Link>
                <Link href="/search">🔍 Search Database</Link>
                <Link href="/compare">📊 Compare Players</Link>
                <Link href="/schools">🏫 All Schools</Link>
                <Link href="/rivalries">🔥 Rivalries</Link>
                <Link href="/glossary">📖 Stats Glossary</Link>
                <Link href="/archive">📁 Archive</Link>
              </div>
              <div className="mega-col">
                <div className="mega-col-head">Fan Zone</div>
                <Link href="/potw">🗳️ Player of the Week</Link>
                <Link href="/gotw">🎯 Game of the Week</Link>
                <Link href="/events">📅 Events &amp; Camps</Link>
                <Link href="/community">💬 Community</Link>
                <Link href="/articles">📰 Articles</Link>
              </div>
            </div>
          </div>

          <div className="nav-right">
            <button onClick={() => setSearchOpen(true)} className="nav-link" style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>🔍 Search</button>
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
            <Link href="/gotw" onClick={() => setMobileOpen(false)}>Game of the Week</Link>
            <Link href="/our-guys" onClick={() => setMobileOpen(false)}>Our Guys</Link>
            <Link href="/recruiting" onClick={() => setMobileOpen(false)}>Recruiting</Link>
            <Link href="/coaches" onClick={() => setMobileOpen(false)}>Coaches</Link>
            <Link href="/community" onClick={() => setMobileOpen(false)}>Community</Link>
            <Link href="/compare" onClick={() => setMobileOpen(false)}>Compare Players</Link>
            <Link href="/schools" onClick={() => setMobileOpen(false)}>All Schools</Link>
            <Link href="/rivalries" onClick={() => setMobileOpen(false)}>Rivalries</Link>
            <Link href="/search" onClick={() => setMobileOpen(false)}>Search</Link>
          </div>
        </>
      )}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
