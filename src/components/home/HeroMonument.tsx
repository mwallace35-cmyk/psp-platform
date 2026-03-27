import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  playerCount: number;
  gameCount: number;
  schoolCount: number;
}

export default function HeroMonument({ playerCount, gameCount, schoolCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--psp-navy)" }}>
      {/* Gold top accent */}
      <div className="h-1 relative z-10">
        <div className="h-full bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent blur-sm opacity-60" />
      </div>

      {/* Banner image with overlay */}
      <div className="relative" style={{ minHeight: "280px", maxHeight: "420px" }}>
        <Image
          src="/images/hero-banner.png"
          alt="Philadelphia high school sports - basketball court meets football field under Friday night lights"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.5) 40%, rgba(10,22,40,0.3) 60%, rgba(10,22,40,0.5) 100%)",
          }}
        />
        {/* Bottom fade to navy */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: "linear-gradient(to top, var(--psp-navy), transparent)",
          }}
        />

        {/* Content overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-14 flex flex-col justify-center" style={{ minHeight: "280px" }}>
          {/* Overline */}
          <p
            className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--psp-gold)" }}
          >
            The Definitive Database
          </p>

          {/* Main title */}
          <h1 className="psp-h1 text-white leading-none">
            <span
              className="font-heading block"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
              aria-hidden="true"
            >
              PHILLY<span style={{ color: "var(--psp-gold)" }}>SPORTS</span>PACK
            </span>
            <span className="block text-sm md:text-base font-medium text-gray-300 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Philadelphia High School Sports Database
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm md:text-base mt-2 max-w-lg">
            Every stat, every champion, every player. Decades of Philadelphia high school sports history.
          </p>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-sm">
              <span style={{ color: "var(--psp-gold)" }}>{playerCount.toLocaleString()}</span> Players
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-sm">
              <span style={{ color: "var(--psp-gold)" }}>{gameCount.toLocaleString()}</span> Games
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-sm">
              <span style={{ color: "var(--psp-gold)" }}>{schoolCount.toLocaleString()}</span> Schools
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 mt-5">
            <Link
              href="/football"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
            >
              Football
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/basketball"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold border transition-all hover:scale-[1.02]"
              style={{ borderColor: "var(--psp-gold)", color: "var(--psp-gold)" }}
            >
              Basketball
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 transition-all hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
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
