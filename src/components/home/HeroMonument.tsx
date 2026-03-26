"use client";

import Link from "next/link";

interface HeroProps {
  playerCount: number;
  gameCount: number;
  schoolCount: number;
}

export default function HeroMonument({ playerCount, gameCount, schoolCount }: HeroProps) {
  return (
    <section className="relative" style={{ background: "var(--psp-navy)" }}>
      {/* Neon gold top line */}
      <div className="h-0.5 relative">
        <div className="h-full bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent blur-sm opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left — branding + tagline */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-heading text-white" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1 }}>
                PHILLY<span style={{ color: "var(--psp-gold)" }}>SPORTS</span>PACK
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: "var(--psp-gray-400)" }}>
                {playerCount.toLocaleString()} players &bull; {gameCount.toLocaleString()} games &bull; {schoolCount.toLocaleString()} schools
              </p>
            </div>
          </div>

          {/* Right — search + CTA */}
          <div className="flex items-center gap-3">
            <form action="/search" className="relative hidden sm:block">
              <input
                type="text"
                name="q"
                placeholder="Search players, schools..."
                aria-label="Search"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 pl-9 text-xs text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-[var(--psp-gold)] transition w-56"
              />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
            <Link
              href="/football"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]"
              style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
            >
              Football
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/basketball"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition-all hover:scale-[1.02]"
              style={{ borderColor: "var(--psp-gold)", color: "var(--psp-gold)" }}
            >
              Basketball
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom amber line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(240,165,0,0.2)] to-transparent" />
    </section>
  );
}
