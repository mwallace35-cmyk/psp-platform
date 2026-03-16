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

const ALL_SPORTS = [
  { href: "/football", label: "Football", color: "var(--fb)" },
  { href: "/basketball", label: "Basketball", color: "var(--bb)" },
  { href: "/baseball", label: "Baseball", color: "var(--base)" },
  { href: "/track-field", label: "Track & Field", color: "var(--track)" },
  { href: "/lacrosse", label: "Lacrosse", color: "var(--lac)" },
  { href: "/wrestling", label: "Wrestling", color: "var(--wrest)" },
  { href: "/soccer", label: "Soccer", color: "var(--soccer)" },
];

const PULSE_ITEMS = [
  { href: "/pulse", label: "The Pulse Hub" },
  { href: "/pulse/recruiting", label: "Recruiting" },
  { href: "/pulse/our-guys", label: "Our Guys" },
  { href: "/pulse/rankings", label: "Power Rankings" },
  { href: "/pulse/forum", label: "Forum" },
  { href: "/potw", label: "Player of the Week" },
];

const MORE_ITEMS = [
  { href: "/coaches", label: "Coaches" },
  { href: "/compare", label: "Compare Players" },
  { href: "/glossary", label: "Glossary" },
  { href: "/challenge", label: "Stats Challenge" },
];

const ACCOUNT_ITEMS = [
  { href: "/signup", label: "Sign Up" },
  { href: "/login", label: "Log In" },
  { href: "/profile", label: "My Profile" },
  { href: "/profile/schools", label: "My Schools" },
  { href: "/profile/settings", label: "Settings" },
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
            {/* Sports Dropdown */}
            <div className="nav-dd">
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "sports"}
                aria-label="Sports menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "sports")}
                onClick={() => handleDropdownToggle("sports")}
                onBlur={handleDropdownClose}
              >
                Sports &#9662;
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="Sports menu"
                style={{ display: openDropdown === "sports" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {ALL_SPORTS.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem" aria-current={isActive(item.href) ? "page" : undefined}>
                    <span className="nav-dot" style={{ background: item.color }} />
                    {item.label}
                  </Link>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "4px 0" }} />
                {ALL_SPORTS.slice(0, 3).map((item) => (
                  <Link key={`${item.href}/awards`} href={`${item.href}/awards`} role="menuitem" style={{ fontSize: "0.85em", opacity: 0.85 }}>
                    🏆 {item.label} Awards
                  </Link>
                ))}
              </div>
            </div>

            {/* Awards Link */}
            <Link href="/awards" className={`nav-link ${isActive("/awards") ? "active" : ""}`} aria-current={isActive("/awards") ? "page" : undefined}>
              Awards
            </Link>

            {/* Schools Link */}
            <Link href="/schools" className={`nav-link ${isActive("/schools") ? "active" : ""}`} aria-current={isActive("/schools") ? "page" : undefined}>
              Schools
            </Link>

            {/* Scores Link */}
            <Link href="/scores" className={`nav-link ${isActive("/scores") ? "active" : ""}`} aria-current={isActive("/scores") ? "page" : undefined}>
              Scores
            </Link>

            {/* News Link */}
            <Link href="/articles" className={`nav-link ${isActive("/articles") ? "active" : ""}`} aria-current={isActive("/articles") ? "page" : undefined}>
              News
            </Link>

            {/* The Pulse Dropdown */}
            <div className="nav-dd">
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "pulse"}
                aria-label="The Pulse menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "pulse")}
                onClick={() => handleDropdownToggle("pulse")}
                onBlur={handleDropdownClose}
              >
                The Pulse &#9662;
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="The Pulse menu"
                style={{ display: openDropdown === "pulse" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {PULSE_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem" aria-current={isActive(item.href) ? "page" : undefined}>
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
