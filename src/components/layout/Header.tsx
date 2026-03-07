"use client";

import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ui/ThemeToggle";

// Lazy load SearchTypeahead since it's a heavy client component
const SearchTypeahead = dynamic(() => import("../search/SearchTypeahead"), {
  loading: () => (
    <input
      type="text"
      placeholder="Search..."
      disabled
      className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white/10 text-white placeholder-gray-400 border border-white/10"
    />
  ),
  ssr: false,
});

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

// TODO: Migrate to database — fetch from games table with most recent results
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = useCallback((href: string) => pathname === href || pathname.startsWith(href + "/"), [pathname]);

  const handleMobileToggle = useCallback(() => setMobileOpen(prev => !prev), []);
  const handleMoreOpen = useCallback(() => setMoreOpen(prev => !prev), []);
  const handleMoreClose = useCallback(() => setMoreOpen(false), []);
  const handleEventsOpen = useCallback(() => setEventsOpen(prev => !prev), []);
  const handleEventsClose = useCallback(() => setEventsOpen(false), []);
  const handleDataOpen = useCallback(() => setDataOpen(prev => !prev), []);
  const handleDataClose = useCallback(() => setDataOpen(false), []);

  // Update aria-live announcement when dropdowns change
  useEffect(() => {
    if (moreOpen) {
      setAnnouncement("More sports submenu opened");
    } else if (eventsOpen) {
      setAnnouncement("Events submenu opened");
    } else if (dataOpen) {
      setAnnouncement("Data submenu opened");
    } else if (moreOpen === false && eventsOpen === false && dataOpen === false) {
      setAnnouncement("Submenu closed");
    }
  }, [moreOpen, eventsOpen, dataOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!mobileOpen) return;

    const panel = mobileMenuRef.current;
    if (!panel) return;

    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    // Focus the close button
    firstEl?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:px-4 focus-visible:py-2 focus-visible:bg-blue-600 focus-visible:text-white focus-visible:font-semibold focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Skip to main content
      </a>
      <div
        aria-live="polite"
        aria-atomic="true"
        id="psp-announcements"
        ref={announcementRef}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
        }}
      >
        {announcement}
      </div>
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
            <span className="db-tag" style={{ color: "var(--psp-gray-600)" }}><span className="dot" /> Supabase Live</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Nav - Desktop */}
      <nav className="mainnav" aria-label="Main navigation">
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
            <div
              className="nav-link"
              role="button"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMoreOpen();
                } else if (e.key === "Escape") {
                  handleMoreClose();
                }
              }}
              onClick={handleMoreOpen}
              onBlur={handleMoreClose}
            >
              More &#9662;
            </div>
            <div
              className="dd-menu"
              aria-label="More sports"
              style={{ display: moreOpen ? "block" : undefined }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setMoreOpen(false);
                }
              }}
            >
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
            <div
              className="nav-link"
              role="button"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={eventsOpen}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleEventsOpen();
                } else if (e.key === "Escape") {
                  handleEventsClose();
                }
              }}
              onClick={handleEventsOpen}
              onBlur={handleEventsClose}
            >
              Events &#9662;
            </div>
            <div
              className="dd-menu"
              aria-label="Events"
              style={{ display: eventsOpen ? "block" : undefined }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setEventsOpen(false);
                }
              }}
            >
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
            <div
              className="nav-link"
              role="button"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={dataOpen}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleDataOpen();
                } else if (e.key === "Escape") {
                  handleDataClose();
                }
              }}
              onClick={handleDataOpen}
              onBlur={handleDataClose}
            >
              Data &#9662;
            </div>
            <div
              className="dd-menu"
              aria-label="Data & Recruiting"
              style={{ display: dataOpen ? "block" : undefined }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setDataOpen(false);
                }
              }}
            >
              <Link href="/our-guys"><span role="img" aria-label="star">🌟</span> Our Guys</Link>
              <Link href="/recruiting"><span role="img" aria-label="star">⭐</span> Recruiting</Link>
              <Link href="/coaches"><span role="img" aria-label="clipboard">📋</span> Coaches</Link>
              <Link href="/compare"><span role="img" aria-label="chart">📊</span> Compare Players</Link>
            </div>
          </div>

          <div className="nav-right">
            <Link href="/search" className="nav-link">Schools</Link>
            <Link href="/search" className="nav-link" aria-label="Search players and teams">Search</Link>
            <Link href="/signup" className="nav-link" style={{ color: 'var(--psp-gold)' }}>Sign Up</Link>

            {/* Mobile hamburger */}
            <button
              onClick={handleMobileToggle}
              className="block md:hidden"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 18 }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              &#9776;
            </button>
          </div>
        </div>
      </nav>

      {/* Score Strip */}
      <div className="scorestrip" aria-label="Score results">
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
            onClick={handleMobileToggle}
          />
          <div className="mobile-nav-panel" id="mobile-menu" role="navigation" aria-label="Mobile navigation" ref={mobileMenuRef}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ color: "var(--psp-gold)", fontWeight: 800, fontSize: 16 }}>Menu</span>
              <button
                onClick={handleMobileToggle}
                style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}
                aria-label="Close menu"
              >
                &#10005;
              </button>
            </div>
            <Link href="/" onClick={handleMobileToggle}>Home</Link>
            {[...MAIN_SPORTS, ...MORE_SPORTS].map((sport) => (
              <Link key={sport.href} href={sport.href} onClick={handleMobileToggle}>
                <span className="nav-dot" style={{ background: sport.color }} />
                {sport.label}
              </Link>
            ))}
            <Link href="/events" onClick={handleMobileToggle}>Events</Link>
            <Link href="/articles" onClick={handleMobileToggle}>News</Link>
            <Link href="/potw" onClick={handleMobileToggle}>Player of the Week</Link>
            <Link href="/our-guys" onClick={handleMobileToggle}>Our Guys</Link>
            <Link href="/recruiting" onClick={handleMobileToggle}>Recruiting</Link>
            <Link href="/coaches" onClick={handleMobileToggle}>Coaches</Link>
            <Link href="/search" onClick={handleMobileToggle}>Search</Link>
          </div>
        </>
      )}
    </header>
  );
}
