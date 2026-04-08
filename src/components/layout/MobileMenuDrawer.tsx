"use client";

/**
 * MobileMenuDrawer — slide-out full-nav drawer for mobile (audit CC-10).
 *
 * Pairs with the Header.tsx hamburger button. The bottom MobileBottomNav
 * still handles primary navigation (Home, Sports, Search, My Schools, Menu);
 * this drawer exposes the long tail (per-sport sub-pages, tools, account).
 */

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SportIcon from "@/components/ui/SportIcon";
import UIIcon from "@/components/ui/UIIcon";

interface MobileMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SPORTS = [
  { slug: "football",         label: "Football" },
  { slug: "basketball",       label: "Boys Basketball" },
  { slug: "girls-basketball", label: "Girls Basketball" },
  { slug: "baseball",         label: "Baseball" },
  { slug: "soccer",           label: "Soccer" },
  { slug: "lacrosse",         label: "Lacrosse" },
  { slug: "track-field",      label: "Track & Field" },
  { slug: "wrestling",        label: "Wrestling" },
];

const PRIMARY = [
  { href: "/schools",  label: "Schools",       icon: "school" as const },
  { href: "/rankings", label: "Power Rankings", icon: "zap" as const },
  { href: "/our-guys", label: "Our Guys",      icon: "users" as const },
  { href: "/hof",      label: "Hall of Fame",  icon: "trophy" as const },
];

const TOOLS = [
  { href: "/compare",        label: "Compare Players",  icon: "users" as const },
  { href: "/recruit-finder", label: "Recruit Finder",   icon: "search" as const },
  { href: "/coaches",        label: "Coaches",          icon: "users" as const },
  { href: "/pickem",         label: "Pick'em",          icon: "target" as const },
  { href: "/challenge",      label: "Stats Challenge",  icon: "chart" as const },
];

export default function MobileMenuDrawer({ open, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll while open + ESC to close
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer panel */}
      <nav
        className="relative ml-auto h-full w-[88vw] max-w-[360px] overflow-y-auto bg-[var(--psp-ink-deep)] border-l border-[var(--psp-rule-strong)] flex flex-col"
        aria-label="Mobile main menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--psp-rule)]">
          <Link href="/" onClick={onClose} className="psp-cream font-extrabold tracking-tight text-base">
            PHILLY<span className="text-[var(--psp-gold)]">SPORTS</span>PACK
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 inline-flex items-center justify-center border border-[var(--psp-rule-strong)] psp-cream hover:border-[var(--psp-gold)] hover:text-[var(--psp-gold)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sports section */}
        <section className="px-5 py-4 border-b border-[var(--psp-rule)]">
          <h3 className="text-[10px] uppercase tracking-widest psp-cream-muted font-bold mb-3">
            Sports
          </h3>
          <ul className="grid grid-cols-2 gap-2 list-none p-0 m-0">
            {SPORTS.map((sport) => (
              <li key={sport.slug}>
                <Link
                  href={`/${sport.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2 px-3 py-2.5 border border-[var(--psp-rule)] hover:border-[var(--psp-gold)] psp-cream text-sm font-semibold transition-colors"
                >
                  <SportIcon sport={sport.slug} size="sm" />
                  <span className="truncate">{sport.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Primary section */}
        <section className="px-5 py-4 border-b border-[var(--psp-rule)]">
          <h3 className="text-[10px] uppercase tracking-widest psp-cream-muted font-bold mb-3">
            Explore
          </h3>
          <ul className="flex flex-col gap-1 list-none p-0 m-0">
            {PRIMARY.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 psp-cream text-sm font-semibold hover:bg-white/5 transition-colors"
                >
                  <span className="w-6 inline-flex justify-center text-[var(--psp-gold)]">
                    <UIIcon name={item.icon} size={18} />
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Tools section */}
        <section className="px-5 py-4 border-b border-[var(--psp-rule)]">
          <h3 className="text-[10px] uppercase tracking-widest psp-cream-muted font-bold mb-3">
            Tools
          </h3>
          <ul className="flex flex-col gap-1 list-none p-0 m-0">
            {TOOLS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 psp-cream text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  <span className="w-6 inline-flex justify-center psp-cream-muted">
                    <UIIcon name={item.icon} size={16} />
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Account footer */}
        <section className="px-5 py-4 mt-auto border-t border-[var(--psp-rule)]">
          <Link
            href="/signup"
            onClick={onClose}
            className="block w-full text-center px-4 py-3 bg-[var(--psp-gold)] text-[var(--psp-navy)] text-sm font-extrabold uppercase tracking-wider hover:bg-[var(--psp-gold-light)] transition-colors"
          >
            Sign Up / Log In
          </Link>
        </section>
      </nav>
    </div>
  );
}
