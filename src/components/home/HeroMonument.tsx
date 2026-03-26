"use client";

import Link from "next/link";

interface HeroMonumentProps {
  playerCount: number;
  gameCount: number;
  schoolCount: number;
}

export default function HeroMonument({ playerCount, gameCount, schoolCount }: HeroMonumentProps) {
  return (
    <section className="relative overflow-hidden" style={{ background: "#0a1628", minHeight: "85vh" }}>
      {/* Layered background effects */}

      {/* Diagonal gold slash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, transparent 40%, rgba(240,165,0,0.04) 40%, rgba(240,165,0,0.04) 42%, transparent 42%)",
        }}
      />

      {/* Radial warm glow from center */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[200px] pointer-events-none"
        style={{ background: "rgba(240,165,0,0.06)" }}
      />

      {/* Subtle diagonal line texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 60px,
            rgba(240,165,0,0.3) 60px,
            rgba(240,165,0,0.3) 61px
          )`,
        }}
      />

      {/* Gold line accents */}
      <div className="absolute top-0 left-0 right-0 h-1">
        <div className="h-full bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent blur-sm opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Top bar — "THE DEFINITIVE DATABASE" seal */}
        <div className="pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-[var(--psp-gold)]" />
            <span
              className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{ color: "var(--psp-gold)", textShadow: "0 0 20px rgba(240,165,0,0.3)" }}
            >
              The Definitive Database
            </span>
            <div className="w-8 h-px bg-[var(--psp-gold)]" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 hidden md:block">
            Est. Philadelphia, PA
          </span>
        </div>

        {/* MONUMENT — Stacked stat typography */}
        <div className="py-8 md:py-12">
          {/* Line 1 */}
          <div className="overflow-hidden">
            <div className="animate-[slideUp_0.8s_ease-out_0.1s_both]">
              <div className="flex items-baseline gap-4 md:gap-6">
                <span
                  className="font-heading"
                  style={{
                    fontSize: "clamp(3.5rem, 12vw, 9rem)",
                    color: "var(--psp-gold)",
                    lineHeight: 0.85,
                    textShadow: "0 0 60px rgba(240,165,0,0.15), 0 4px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {playerCount.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm md:text-lg font-medium uppercase tracking-[0.15em]">
                  Players
                </span>
              </div>
            </div>
          </div>

          {/* Line 2 */}
          <div className="overflow-hidden">
            <div className="animate-[slideUp_0.8s_ease-out_0.3s_both]">
              <div className="flex items-baseline gap-4 md:gap-6">
                <span
                  className="font-heading"
                  style={{
                    fontSize: "clamp(3.5rem, 12vw, 9rem)",
                    color: "#fff",
                    lineHeight: 0.85,
                    textShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {gameCount.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm md:text-lg font-medium uppercase tracking-[0.15em]">
                  Games
                </span>
              </div>
            </div>
          </div>

          {/* Line 3 */}
          <div className="overflow-hidden">
            <div className="animate-[slideUp_0.8s_ease-out_0.5s_both]">
              <div className="flex items-baseline gap-4 md:gap-6">
                <span
                  className="font-heading"
                  style={{
                    fontSize: "clamp(3.5rem, 12vw, 9rem)",
                    color: "var(--psp-gold)",
                    lineHeight: 0.85,
                    textShadow: "0 0 60px rgba(240,165,0,0.15), 0 4px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {schoolCount.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm md:text-lg font-medium uppercase tracking-[0.15em]">
                  Schools
                </span>
              </div>
            </div>
          </div>

          {/* Line 4 — "25+ YEARS" accent */}
          <div className="overflow-hidden mt-2">
            <div className="animate-[slideUp_0.8s_ease-out_0.7s_both]">
              <div className="flex items-baseline gap-4 md:gap-6">
                <span
                  className="font-heading"
                  style={{
                    fontSize: "clamp(2rem, 6vw, 4.5rem)",
                    color: "rgba(255,255,255,0.15)",
                    lineHeight: 0.85,
                  }}
                >
                  25+ YEARS
                </span>
                <span className="text-gray-600 text-sm font-medium uppercase tracking-[0.15em]">
                  of History
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row — tagline + search + CTA */}
        <div className="animate-[fadeIn_1s_ease-out_0.9s_both] pb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Left — tagline */}
            <div>
              <p className="text-gray-400 text-base md:text-lg max-w-md leading-relaxed">
                Every stat. Every champion. Every player.<br />
                <span style={{ color: "var(--psp-gold)" }}>Philadelphia high school sports, preserved.</span>
              </p>
            </div>

            {/* Right — search + CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <form action="/search" className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="Search players, schools..."
                  aria-label="Search"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-10 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-[var(--psp-gold)] focus:ring-1 focus:ring-[var(--psp-gold)] transition w-full sm:w-72"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
              <Link
                href="/football"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "var(--psp-gold)",
                  color: "var(--psp-navy)",
                  boxShadow: "0 0 20px rgba(240,165,0,0.2)",
                }}
              >
                Explore Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(240,165,0,0.3)] to-transparent" />

      {/* CSS keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </section>
  );
}
