import Link from "next/link";
import Image from "next/image";
import HeroSearch from "./HeroSearch";

export default function HeroMonument() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--psp-navy)" }}>
      {/* Gold top accent */}
      <div className="h-1 relative z-10">
        <div className="h-full bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent blur-sm opacity-60" />
      </div>

      {/* Banner image with overlay */}
      <div className="relative" style={{ minHeight: "320px", maxHeight: "480px" }}>
        <Image
          src="/images/hero-banner.png"
          alt="Philadelphia high school sports - basketball court meets football field under Friday night lights"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.85) 50%, rgba(10,22,40,0.95) 100%)",
          }}
        />

        {/* Content overlay */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 md:py-16 flex flex-col items-center text-center" style={{ minHeight: "320px", justifyContent: "center" }}>
          {/* Overline */}
          <p
            className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--psp-gold)" }}
          >
            The Definitive Database
          </p>

          {/* Main title */}
          <h1 className="psp-h1 text-white leading-none mb-2">
            <span
              className="font-heading block"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Philadelphia High School Sports
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm md:text-base mb-6 max-w-lg">
            Every stat, every champion, every player. Find your school, check the leaderboards, explore the history.
          </p>

          {/* Search bar — the main CTA */}
          <div className="w-full max-w-xl mb-6">
            <HeroSearch />
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/schools"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
            >
              Find Your School
            </Link>
            <Link
              href="/football/leaderboards"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white hover:border-white/40 transition"
            >
              Leaderboards
            </Link>
            <Link
              href="/hof"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white hover:border-white/40 transition"
            >
              Hall of Fame
            </Link>
            <Link
              href="/scores"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white hover:border-white/40 transition"
            >
              Scores
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gold accent */}
      <div className="h-0.5 relative z-10">
        <div className="h-full bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent opacity-40" />
      </div>
    </section>
  );
}
