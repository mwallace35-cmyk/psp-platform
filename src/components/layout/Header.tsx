"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
      aria-live="polite"
      aria-label="Search typeahead loading"
    />
  ),
  ssr: false,
});

// Mobile menu still uses ALL_SPORTS for the full sport listing
const ALL_SPORTS = [
  { href: "/football", label: "Football", color: "var(--fb)" },
  { href: "/basketball", label: "Basketball", color: "var(--bb)" },
  { href: "/baseball", label: "Baseball", color: "var(--base)" },
  { href: "/track-field", label: "Track & Field", color: "var(--track)" },
  { href: "/lacrosse", label: "Lacrosse", color: "var(--lac)" },
  { href: "/wrestling", label: "Wrestling", color: "var(--wrest)" },
  { href: "/soccer", label: "Soccer", color: "var(--soccer)" },
];

// Desktop: per-sport dropdown sub-items
const SPORT_SUB_ITEMS = [
  { suffix: "/standings", label: "Standings" },
  { suffix: "/leaderboards", label: "Leaderboards" },
  { suffix: "/schools", label: "Schools" },
  { suffix: "/championships", label: "Championships" },
  { suffix: "/playoffs", label: "Playoffs" },
  { suffix: "/records", label: "Records" },
];

// Desktop: "More Sports" dropdown — everything except Football & Basketball
const MORE_SPORTS = [
  { href: "/soccer", label: "Soccer", color: "var(--soccer)" },
  { href: "/lacrosse", label: "Lacrosse", color: "var(--lac)" },
  { href: "/track-field", label: "Track & Field", color: "var(--track)" },
  { href: "/wrestling", label: "Wrestling", color: "var(--wrest)" },
  { href: "/baseball", label: "Baseball", color: "var(--base)" },
];

// Desktop: "More" dropdown (Pulse + More combined)
const MORE_ITEMS = [
  { href: "/pulse/rankings", label: "Rankings" },
  { href: "/pulse/our-guys", label: "Our Guys" },
  { href: "/recruiting", label: "Recruiting" },
  { href: "/recruit-finder", label: "Recruit Finder" },
  { href: "/compare", label: "Compare" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/coaches", label: "Coaches" },
  { href: "/pickem", label: "Pick'em" },
];

// Mobile menu still uses PULSE_ITEMS
const PULSE_ITEMS = [
  { href: "/", label: "The Pulse Hub" },
  { href: "/recruiting", label: "Recruiting Central" },
  { href: "/pulse/our-guys", label: "Our Guys" },
  { href: "/pulse/rankings", label: "Power Rankings" },
  { href: "/pulse/forum", label: "Forum" },
  { href: "/potw", label: "Player of the Week" },
];

const ACCOUNT_ITEMS = [
  { href: "/my-schools", label: "My Schools" },
  { href: "/signup", label: "Sign Up / Log In" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = useCallback((href: string) => pathname === href || pathname.startsWith(href + "/"), [pathname]);

  const handleMobileToggle = useCallback(() => setMobileOpen(prev => !prev), []);
  const handleDropdownToggle = useCallback((name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  }, []);
  const handleDropdownClose = useCallback(() => setOpenDropdown(null), []);

  // Handle menu navigation with arrow keys
  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      handleDropdownClose();
      return;
    }

    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      return;
    }

    e.preventDefault();

    const menuDiv = e.currentTarget;
    const menuItems = Array.from(menuDiv.querySelectorAll<HTMLElement>('[role="menuitem"]'));

    if (menuItems.length === 0) return;

    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = menuItems.indexOf(activeElement);

    let nextIndex = currentIndex;

    switch (e.key) {
      case "ArrowDown":
        nextIndex = currentIndex < 0 || currentIndex === menuItems.length - 1 ? 0 : currentIndex + 1;
        break;
      case "ArrowUp":
        nextIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = menuItems.length - 1;
        break;
    }

    menuItems[nextIndex]?.focus();
  }, [handleDropdownClose]);

  // Handle arrow key from dropdown trigger button
  const handleDropdownTriggerKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, dropdownName: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDropdownToggle(dropdownName);
      // After opening, focus the first menu item
      setTimeout(() => {
        const nextSibling = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement | null;
        if (nextSibling) {
          const firstMenuItem = nextSibling.querySelector<HTMLElement>('[role="menuitem"]');
          firstMenuItem?.focus();
        }
      }, 0);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (openDropdown !== dropdownName) {
        setOpenDropdown(dropdownName);
        // After opening, focus the first menu item
        setTimeout(() => {
          const nextSibling = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement | null;
          if (nextSibling) {
            const firstMenuItem = nextSibling.querySelector<HTMLElement>('[role="menuitem"]');
            firstMenuItem?.focus();
          }
        }, 0);
      } else {
        // Menu already open, focus first item
        const nextSibling = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement | null;
        if (nextSibling) {
          const firstMenuItem = nextSibling.querySelector<HTMLElement>('[role="menuitem"]');
          firstMenuItem?.focus();
        }
      }
    } else if (e.key === "Escape") {
      handleDropdownClose();
    }
  }, [openDropdown, handleDropdownToggle, handleDropdownClose]);

  // Update aria-live announcement when dropdowns change
  useEffect(() => {
    if (openDropdown) {
      setAnnouncement(`${openDropdown} menu opened`);
    } else {
      setAnnouncement("Menu closed");
    }
  }, [openDropdown]);

  // Focus trap for mobile menu with focus return
  useEffect(() => {
    if (!mobileOpen) {
      // Return focus to hamburger button when menu closes
      hamburgerRef.current?.focus();
      return;
    }

    const panel = mobileMenuRef.current;
    if (!panel) return;

    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    firstEl?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        // Focus will return via the effect cleanup
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

      {/* Single-Tier Navigation */}
      <nav className="mainnav" aria-label="Main navigation">
        <div className="mainnav-inner">
          {/* Logo */}
          <Link href="/" className="logo-mark" style={{ textDecoration: "none" }}>
            PHILLY<span>SPORTS</span>PACK
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {/* Scores — direct link */}
            <Link href="/scores" className={`nav-link ${isActive("/scores") ? "active" : ""}`} aria-current={isActive("/scores") ? "page" : undefined}>
              Scores
            </Link>

            {/* Football Dropdown */}
            <div className="nav-dd">
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "football"}
                aria-label="Football menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "football")}
                onClick={() => handleDropdownToggle("football")}
                onBlur={handleDropdownClose}
              >
                Football &#9662;
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="Football menu"
                style={{ display: openDropdown === "football" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {SPORT_SUB_ITEMS.map((item) => (
                  <Link key={item.suffix} href={`/football${item.suffix}`} role="menuitem" aria-current={isActive(`/football${item.suffix}`) ? "page" : undefined}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Basketball Dropdown */}
            <div className="nav-dd">
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "basketball"}
                aria-label="Basketball menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "basketball")}
                onClick={() => handleDropdownToggle("basketball")}
                onBlur={handleDropdownClose}
              >
                Basketball &#9662;
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="Basketball menu"
                style={{ display: openDropdown === "basketball" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {SPORT_SUB_ITEMS.map((item) => (
                  <Link key={item.suffix} href={`/basketball${item.suffix}`} role="menuitem" aria-current={isActive(`/basketball${item.suffix}`) ? "page" : undefined}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* More Sports Dropdown */}
            <div className="nav-dd">
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "moreSports"}
                aria-label="More Sports menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "moreSports")}
                onClick={() => handleDropdownToggle("moreSports")}
                onBlur={handleDropdownClose}
              >
                More Sports &#9662;
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="More Sports menu"
                style={{ display: openDropdown === "moreSports" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {MORE_SPORTS.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem" aria-current={isActive(item.href) ? "page" : undefined}>
                    <span className="nav-dot" style={{ background: item.color }} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* More Dropdown */}
            <div className="nav-dd">
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "more"}
                aria-label="More menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "more")}
                onClick={() => handleDropdownToggle("more")}
                onBlur={handleDropdownClose}
              >
                More &#9662;
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="More menu"
                style={{ display: openDropdown === "more" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {MORE_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem" aria-current={isActive(item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Icon Button */}
            <Link href="/search" className="nav-link" aria-current={isActive("/search") ? "page" : undefined} title="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </Link>

            {/* Account Dropdown */}
            <div className="nav-dd">
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "account"}
                aria-label="Account menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "account")}
                onClick={() => handleDropdownToggle("account")}
                onBlur={handleDropdownClose}
                title="Account"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="Account menu"
                style={{ display: openDropdown === "account" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {ACCOUNT_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem" aria-current={isActive(item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            ref={hamburgerRef}
            onClick={handleMobileToggle}
            className="md:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 20 }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            min-height="44px"
            min-width="44px"
          >
            &#9776;
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <>
          <div
            className="mobile-nav-overlay open"
            onClick={handleMobileToggle}
          />
          <div className="mobile-nav-panel" id="mobile-menu" role="navigation" aria-label="Mobile navigation" aria-modal="true" ref={mobileMenuRef}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ color: "var(--psp-gold)", fontWeight: 800, fontSize: 16 }}>Menu</span>
              <button
                onClick={handleMobileToggle}
                style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}
                aria-label="Close navigation menu"
              >
                &#10005;
              </button>
            </div>

            {/* Sports Section */}
            <div style={{ borderBottom: "1px solid #333", margin: "12px 0" }}>
              <div style={{ color: "var(--psp-gray-400)", fontSize: "0.8rem", fontWeight: "700", padding: "8px 0", textTransform: "uppercase" }}>Sports</div>
              {ALL_SPORTS.map((sport) => (
                <Link key={sport.href} href={sport.href} onClick={handleMobileToggle}>
                  <span className="nav-dot" style={{ background: sport.color }} />
                  {sport.label}
                </Link>
              ))}
            </div>

            {/* Quick Links Section */}
            <div style={{ borderBottom: "1px solid #333", margin: "12px 0" }}>
              <div style={{ color: "var(--psp-gray-400)", fontSize: "0.8rem", fontWeight: "700", padding: "8px 0", textTransform: "uppercase" }}>Quick Links</div>
              <Link href="/awards" onClick={handleMobileToggle}>🏆 Awards &amp; Honors</Link>
              <Link href="/schools" onClick={handleMobileToggle}>Schools</Link>
              <Link href="/scores" onClick={handleMobileToggle}>Scores</Link>
              <Link href="/articles" onClick={handleMobileToggle}>News</Link>
            </div>

            {/* The Pulse Section */}
            <div style={{ borderBottom: "1px solid #333", margin: "12px 0" }}>
              <div style={{ color: "var(--psp-gray-400)", fontSize: "0.8rem", fontWeight: "700", padding: "8px 0", textTransform: "uppercase" }}>The Pulse</div>
              {PULSE_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleMobileToggle}>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* More Section */}
            <div style={{ borderBottom: "1px solid #333", margin: "12px 0" }}>
              <div style={{ color: "var(--psp-gray-400)", fontSize: "0.8rem", fontWeight: "700", padding: "8px 0", textTransform: "uppercase" }}>More</div>
              {MORE_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleMobileToggle}>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Account Section */}
            <div style={{ borderBottom: "1px solid #333", margin: "12px 0" }}>
              <div style={{ color: "var(--psp-gray-400)", fontSize: "0.8rem", fontWeight: "700", padding: "8px 0", textTransform: "uppercase" }}>Account</div>
              {ACCOUNT_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleMobileToggle}>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Settings Section */}
            <div style={{ padding: "12px 0" }}>
              <div style={{ color: "var(--psp-gray-400)", fontSize: "0.8rem", fontWeight: "700", padding: "8px 0", textTransform: "uppercase" }}>Settings</div>
              <div style={{ padding: "8px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Dark Mode</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
