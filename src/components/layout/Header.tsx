"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

// ALL_SPORTS moved to MobileBottomNav (sole mobile menu)

// Desktop: per-sport dropdown sub-items
const SPORT_SUB_ITEMS = [
  { suffix: "/standings", label: "Standings" },
  { suffix: "/leaderboards", label: "Leaderboards" },
  { suffix: "/schools", label: "Schools" },
  { suffix: "/championships", label: "Championships" },
  { suffix: "/playoffs", label: "Playoffs" },
  { suffix: "/records", label: "Records" },
  { suffix: "/rivalries", label: "Rivalries" },
  { suffix: "/position-leaders", label: "Position Leaders" },
];

// Desktop: "More Sports" dropdown — everything except Football & Basketball
const MORE_SPORTS = [
  { href: "/soccer", label: "Soccer", color: "var(--soccer)" },
  { href: "/lacrosse", label: "Lacrosse", color: "var(--lac)" },
  { href: "/track-field", label: "Track & Field", color: "var(--track)" },
  { href: "/wrestling", label: "Wrestling", color: "var(--wrest)" },
  { href: "/baseball", label: "Baseball", color: "var(--base)" },
];

// Desktop: "Tools" dropdown — Hall of Fame promoted to top-level (audit CC-5)
const TOOLS_ITEMS = [
  { href: "/events", label: "Events" },
  { href: "/recruiting", label: "Recruiting" },
  { href: "/recruit-finder", label: "Recruit Finder" },
  { href: "/compare", label: "Compare Players" },
  { href: "/coaches", label: "Coaches" },
  { href: "/pickem", label: "Pick'em" },
  { href: "/challenge", label: "Stats Challenge" },
];

// Account items for desktop dropdown only
const ACCOUNT_ITEMS = [
  { href: "/my-schools", label: "My Schools" },
  { href: "/signup", label: "Sign Up / Log In" },
];

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const announcementRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = useCallback((href: string) => pathname === href || pathname.startsWith(href + "/"), [pathname]);
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

  // Close dropdowns on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!openDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Update aria-live announcement when dropdowns change
  useEffect(() => {
    if (openDropdown) {
      setAnnouncement(`${openDropdown} menu opened`);
    } else {
      setAnnouncement("Menu closed");
    }
  }, [openDropdown]);

  return (
    <header className="sticky top-0 z-50">
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
          <div className="hidden md:flex items-center gap-2" ref={desktopNavRef}>
            {/* Scores — direct link */}
            <Link href="/scores" className={`nav-link ${isActive("/scores") ? "active" : ""}`} aria-current={isActive("/scores") ? "page" : undefined}>
              Scores
            </Link>

            {/* Football Dropdown — clickable link + hover dropdown */}
            <div
              className="nav-dd"
              onMouseEnter={() => setOpenDropdown("football")}
              onMouseLeave={() => setOpenDropdown(prev => prev === "football" ? null : prev)}
            >
              <Link
                href="/football"
                className={`nav-link ${isActive("/football") ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
                aria-current={isActive("/football") ? "page" : undefined}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "football"}
                onFocus={() => setOpenDropdown("football")}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpenDropdown("football");
                    setTimeout(() => {
                      const menu = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement | null;
                      if (menu) menu.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
                    }, 0);
                  } else if (e.key === "Escape") {
                    handleDropdownClose();
                  }
                }}
              >
                Football <span style={{ fontSize: "0.7em" }}>&#9662;</span>
              </Link>
              <div
                className="dd-menu"
                role="menu"
                aria-label="Football menu"
                style={{ display: openDropdown === "football" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                <Link href="/football" role="menuitem" aria-current={isActive("/football") ? "page" : undefined} style={{ fontWeight: 600 }}>
                  Football Hub
                </Link>
                {SPORT_SUB_ITEMS.map((item) => (
                  <Link key={item.suffix} href={`/football${item.suffix}`} role="menuitem" aria-current={isActive(`/football${item.suffix}`) ? "page" : undefined}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Boys Basketball Dropdown — clickable link + hover dropdown */}
            <div
              className="nav-dd"
              onMouseEnter={() => setOpenDropdown("basketball")}
              onMouseLeave={() => setOpenDropdown(prev => prev === "basketball" ? null : prev)}
            >
              <Link
                href="/basketball"
                className={`nav-link ${isActive("/basketball") ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
                aria-current={isActive("/basketball") ? "page" : undefined}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "basketball"}
                onFocus={() => setOpenDropdown("basketball")}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpenDropdown("basketball");
                    setTimeout(() => {
                      const menu = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement | null;
                      if (menu) menu.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
                    }, 0);
                  } else if (e.key === "Escape") {
                    handleDropdownClose();
                  }
                }}
              >
                Boys Basketball <span style={{ fontSize: "0.7em" }}>&#9662;</span>
              </Link>
              <div
                className="dd-menu"
                role="menu"
                aria-label="Boys Basketball menu"
                style={{ display: openDropdown === "basketball" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                <Link href="/basketball" role="menuitem" aria-current={isActive("/basketball") ? "page" : undefined} style={{ fontWeight: 600 }}>
                  Boys Basketball Hub
                </Link>
                {SPORT_SUB_ITEMS.map((item) => (
                  <Link key={item.suffix} href={`/basketball${item.suffix}`} role="menuitem" aria-current={isActive(`/basketball${item.suffix}`) ? "page" : undefined}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Girls Basketball Dropdown — clickable link + hover dropdown */}
            <div
              className="nav-dd"
              onMouseEnter={() => setOpenDropdown("girls-basketball")}
              onMouseLeave={() => setOpenDropdown(prev => prev === "girls-basketball" ? null : prev)}
            >
              <Link
                href="/girls-basketball"
                className={`nav-link ${isActive("/girls-basketball") ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
                aria-current={isActive("/girls-basketball") ? "page" : undefined}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "girls-basketball"}
                onFocus={() => setOpenDropdown("girls-basketball")}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpenDropdown("girls-basketball");
                    setTimeout(() => {
                      const menu = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement | null;
                      if (menu) menu.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
                    }, 0);
                  } else if (e.key === "Escape") {
                    handleDropdownClose();
                  }
                }}
              >
                Girls Basketball <span style={{ fontSize: "0.7em" }}>&#9662;</span>
              </Link>
              <div
                className="dd-menu"
                role="menu"
                aria-label="Girls Basketball menu"
                style={{ display: openDropdown === "girls-basketball" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                <Link href="/girls-basketball" role="menuitem" aria-current={isActive("/girls-basketball") ? "page" : undefined} style={{ fontWeight: 600 }}>
                  Girls Basketball Hub
                </Link>
                {SPORT_SUB_ITEMS.map((item) => (
                  <Link key={item.suffix} href={`/girls-basketball${item.suffix}`} role="menuitem" aria-current={isActive(`/girls-basketball${item.suffix}`) ? "page" : undefined}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* More Sports Dropdown */}
            <div
              className="nav-dd"
              onMouseEnter={() => setOpenDropdown("moreSports")}
              onMouseLeave={() => setOpenDropdown(prev => prev === "moreSports" ? null : prev)}
            >
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "moreSports"}
                aria-label="More Sports menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "moreSports")}
                onClick={() => handleDropdownToggle("moreSports")}
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

            {/* Schools — direct link */}
            <Link href="/schools" className={`nav-link ${isActive("/schools") ? "active" : ""}`} aria-current={isActive("/schools") ? "page" : undefined}>
              Schools
            </Link>

            {/* Rankings — promoted to top-level */}
            <Link href="/rankings" className={`nav-link ${isActive("/rankings") ? "active" : ""}`} aria-current={isActive("/rankings") ? "page" : undefined}>
              Rankings
            </Link>

            {/* Our Guys — promoted to top-level */}
            <Link href="/our-guys" className={`nav-link ${isActive("/our-guys") ? "active" : ""}`} aria-current={isActive("/our-guys") ? "page" : undefined}>
              Our Guys
            </Link>

            {/* Hall of Fame — promoted to top-level (audit CC-5) */}
            <Link href="/hof" className={`nav-link ${isActive("/hof") ? "active" : ""}`} aria-current={isActive("/hof") ? "page" : undefined}>
              Hall of Fame
            </Link>

            {/* Tools Dropdown (was "More") */}
            <div
              className="nav-dd"
              onMouseEnter={() => setOpenDropdown("tools")}
              onMouseLeave={() => setOpenDropdown(prev => prev === "tools" ? null : prev)}
            >
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "tools"}
                aria-label="Tools menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "tools")}
                onClick={() => handleDropdownToggle("tools")}
              >
                Tools &#9662;
              </button>
              <div
                className="dd-menu"
                role="menu"
                aria-label="Tools menu"
                style={{ display: openDropdown === "tools" ? "block" : undefined }}
                onKeyDown={handleMenuKeyDown}
              >
                {TOOLS_ITEMS.map((item) => (
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
            <div
              className="nav-dd"
              onMouseEnter={() => setOpenDropdown("account")}
              onMouseLeave={() => setOpenDropdown(prev => prev === "account" ? null : prev)}
            >
              <button
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === "account"}
                aria-label="Account menu"
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, "account")}
                onClick={() => handleDropdownToggle("account")}
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

          {/* Mobile Search Icon (hamburger removed — bottom nav is sole mobile menu) */}
          <Link
            href="/search"
            className="md:hidden"
            style={{ color: "#fff", padding: 8 }}
            aria-label="Search"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Mobile menu removed — MobileBottomNav is the sole mobile navigation */}
    </header>
  );
}
