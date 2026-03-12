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

const MAIN_SPORTS = [
  { href: "/football", label: "Football", color: "var(--fb)" },
  { href: "/basketball", label: "Basketball", color: "var(--bb)" },
  { href: "/baseball", label: "Baseball", color: "var(--base)" },
];

const MINOR_SPORTS = [
  { href: "/track-field", label: "Track & Field", color: "var(--track)" },
  { href: "/lacrosse", label: "Lacrosse", color: "var(--lac)" },
  { href: "/wrestling", label: "Wrestling", color: "var(--wrest)" },
  { href: "/soccer", label: "Soccer", color: "var(--soccer)" },
];

const PULSE_ITEMS = [
  { href: "/pulse", label: "The Pulse Hub" },
  { href: "/potw", label: "Player of the Week" },
  { href: "/pulse/calendar", label: "Master Schedule" },
  { href: "/pulse/forum", label: "Forum" },
  { href: "/pulse/rankings", label: "Power Rankings" },
  { href: "/pulse/our-guys", label: "Our Guys" },
  { href: "/pulse/outside-the-215", label: "Outside the 215" },
];

const CONTENT_ITEMS = [
  { href: "/articles", label: "News" },
  { href: "/recruiting", label: "Recruiting" },
  { href: "/next-level", label: "Next Level (Pro)" },
  { href: "/coaches", label: "Coaches" },
  { href: "/philly-everywhere", label: "Philly Everywhere" },
];

const DATA_TOOLS = [
  { href: "/search", label: "Search" },
  { href: "/scores", label: "Scores & Schedules" },
  { href: "/awards", label: "Awards" },
  { href: "/compare", label: "Compare Players" },
  { href: "/challenge", label: "Stats Challenge" },
  { href: "/glossary", label: "Glossary" },
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
            {/* Main Sports */}
            {MAIN_SPORTS.map((sport) => (
              <Link
                key={sport.href}
                href={sport.href}
                className={`nav-link ${isActive(sport.href) ? "active" : ""}`}
                aria-current={isActive(sport.href) ? "page" : undefined}
              >
                <span className="nav-dot" style={{ background: sport.color }} />
                {sport.label}
              </Link>
            ))}

            {/* More Sports Dropdown */}
            <div className="nav-dd">
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "sports"}
                aria-label="More sports menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "sports")}
                onClick={() => handleDropdownToggle("sports")}
                onBlur={handleDropdownClose}
              >
                More Sports &#9662;
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="More sports menu"
                style={{ display: openDropdown === "sports" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {MINOR_SPORTS.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem" aria-current={isActive(item.href) ? "page" : undefined}>
                    <span className="nav-dot" style={{ background: item.color }} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Schools */}
            <Link href="/schools" className={`nav-link ${isActive("/schools") ? "active" : ""}`} aria-current={isActive("/schools") ? "page" : undefined}>
              Schools
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

            {/* Content Dropdown */}
            <div className="nav-dd">
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "content"}
                aria-label="Content menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "content")}
                onClick={() => handleDropdownToggle("content")}
                onBlur={handleDropdownClose}
              >
                Content &#9662;
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="Content menu"
                style={{ display: openDropdown === "content" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {CONTENT_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem" aria-current={isActive(item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Data & Tools Dropdown */}
            <div className="nav-dd">
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "tools"}
                aria-label="Data tools menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "tools")}
                onClick={() => handleDropdownToggle("tools")}
                onBlur={handleDropdownClose}
              >
                Tools &#9662;
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="Data tools menu"
                style={{ display: openDropdown === "tools" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {DATA_TOOLS.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem" aria-current={isActive(item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/signup" className="nav-link" style={{ color: 'var(--psp-gold)' }} aria-current={isActive("/signup") ? "page" : undefined}>
              Sign Up
            </Link>
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
              {MAIN_SPORTS.map((sport) => (
                <Link key={sport.href} href={sport.href} onClick={handleMobileToggle}>
                  <span className="nav-dot" style={{ background: sport.color }} />
                  {sport.label}
                </Link>
              ))}
              {MINOR_SPORTS.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleMobileToggle}>
                  <span className="nav-dot" style={{ background: item.color }} />
                  {item.label}
                </Link>
              ))}
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

            {/* Content Section */}
            <div style={{ borderBottom: "1px solid #333", margin: "12px 0" }}>
              <div style={{ color: "var(--psp-gray-400)", fontSize: "0.8rem", fontWeight: "700", padding: "8px 0", textTransform: "uppercase" }}>Content</div>
              {CONTENT_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleMobileToggle}>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Data & Tools Section */}
            <div style={{ borderBottom: "1px solid #333", margin: "12px 0" }}>
              <div style={{ color: "var(--psp-gray-400)", fontSize: "0.8rem", fontWeight: "700", padding: "8px 0", textTransform: "uppercase" }}>Data &amp; Tools</div>
              <Link href="/schools" onClick={handleMobileToggle}>Schools</Link>
              {DATA_TOOLS.map((item) => (
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

            <Link href="/signup" onClick={handleMobileToggle} style={{ color: 'var(--psp-gold)', fontWeight: 700, display: "block", paddingTop: "12px" }}>
              Sign Up
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
