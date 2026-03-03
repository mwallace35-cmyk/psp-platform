"use client";

import { useState } from "react";
import Link from "next/link";
import SearchTypeahead from "../search/SearchTypeahead";

const SPORT_NAV = [
  { href: "/football", label: "Football", icon: "🏈" },
  { href: "/basketball", label: "Basketball", icon: "🏀" },
  { href: "/baseball", label: "Baseball", icon: "⚾" },
  { href: "/track-field", label: "Track & Field", icon: "🏃" },
  { href: "/lacrosse", label: "Lacrosse", icon: "🥍" },
  { href: "/wrestling", label: "Wrestling", icon: "🤼" },
  { href: "/soccer", label: "Soccer", icon: "⚽" },
];

const MORE_NAV = [
  { href: "/championships", label: "Championships" },
  { href: "/records", label: "Records" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/compare", label: "Compare Players" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Main header bar */}
      <div style={{ background: "var(--psp-navy)" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
            >
              PSP
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-lg leading-tight tracking-wide" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                PhillySportsPack
              </div>
              <div className="text-xs" style={{ color: "var(--psp-gold)" }}>
                Philly HS Sports Data
              </div>
            </div>
          </Link>

          {/* Search bar — desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchTypeahead />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden text-white p-2"
              aria-label="Search"
            >
              🔍
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Sport nav bar — desktop */}
      <div
        className="hidden md:block border-b"
        style={{ background: "var(--psp-navy-mid)", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
          {SPORT_NAV.map((sport) => (
            <Link
              key={sport.href}
              href={sport.href}
              className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-t-lg transition-colors whitespace-nowrap"
            >
              <span className="mr-1.5">{sport.icon}</span>
              {sport.label}
            </Link>
          ))}
          <div className="w-px h-6 bg-gray-600 mx-2" />
          {MORE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-t-lg transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden p-4" style={{ background: "var(--psp-navy-mid)" }}>
          <SearchTypeahead />
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: "var(--psp-navy-mid)", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="p-4 space-y-1">
            {SPORT_NAV.map((sport) => (
              <Link
                key={sport.href}
                href={sport.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                <span className="mr-2">{sport.icon}</span>
                {sport.label}
              </Link>
            ))}
            <div className="border-t border-gray-700 my-2" />
            {MORE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
