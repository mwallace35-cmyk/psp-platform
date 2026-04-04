"use client";

import { useRef } from "react";
import Link from "next/link";
import { Search, Users, School, GraduationCap } from "lucide-react";

interface SearchHeroProps {
  query: string;
  stats: { players: number; schools: number; sports: number };
  trendingSearches: { display_name: string; entity_type: string; url_path: string }[];
}

const CATEGORY_PILLS = [
  { label: "Players", icon: Users, type: "player" },
  { label: "Schools", icon: School, type: "school" },
  { label: "Coaches", icon: GraduationCap, type: "coach" },
];

export default function SearchHero({ query, stats, trendingSearches }: SearchHeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Compact mode (active search) ── */
  if (query) {
    return (
      <section className="relative overflow-hidden" style={{ background: "var(--psp-navy)" }}>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 py-6">
          <form action="/search" method="GET" className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
                aria-hidden
              />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search players, schools, coaches..."
                aria-label="Search the archive"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-base bg-white/8 text-white placeholder-gray-400 border border-white/10 focus:bg-white/12 focus:border-[var(--psp-gold)] focus:ring-2 focus:ring-[var(--psp-gold)]/20 focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors"
              style={{
                background: "var(--psp-gold)",
                color: "var(--psp-navy)",
              }}
            >
              Search
            </button>
          </form>
        </div>
      </section>
    );
  }

  /* ── Landing mode (no query) ── */
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--psp-navy)" }}>
      {/* Turf texture overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Radial vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(15,32,64,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-14 md:pt-24 md:pb-20 text-center">
        {/* Headline */}
        <h1
          className="text-white tracking-tight leading-none animate-[fadeUp_0.5s_ease-out_both]"
          style={{
            fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
          }}
        >
          SEARCH THE ARCHIVE
        </h1>

        {/* Gold accent bar */}
        <div
          className="mx-auto mt-3 mb-5 rounded-full animate-[fadeUp_0.5s_ease-out_0.08s_both]"
          style={{
            width: 40,
            height: 3,
            background: "var(--psp-gold)",
          }}
        />

        {/* Subtext */}
        <p
          className="text-base md:text-lg mb-8 animate-[fadeUp_0.5s_ease-out_0.16s_both]"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          The definitive Philadelphia high school sports database
        </p>

        {/* Search input */}
        <form
          action="/search"
          method="GET"
          className="max-w-2xl mx-auto mb-5 animate-[fadeUp_0.5s_ease-out_0.24s_both]"
        >
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
                aria-hidden
              />
              <input
                ref={inputRef}
                type="text"
                name="q"
                placeholder={`Search ${stats.players.toLocaleString()}+ players, schools, coaches...`}
                aria-label="Search the archive"
                className="w-full pr-4 py-4 md:py-5 rounded-xl text-base md:text-lg bg-white/8 text-white placeholder-gray-400 border border-white/10 focus:bg-white/12 focus:border-[var(--psp-gold)] focus:ring-2 focus:ring-[var(--psp-gold)]/20 focus:outline-none transition-all backdrop-blur-sm"
                style={{ paddingLeft: "3.25rem" }}
              />
            </div>
            <button
              type="submit"
              className="px-5 md:px-8 py-4 md:py-5 rounded-xl font-bold text-sm md:text-base whitespace-nowrap transition-all hover:brightness-110"
              style={{
                background: "var(--psp-gold)",
                color: "var(--psp-navy)",
              }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Live database stats */}
        <p
          className="text-sm mb-6 animate-[fadeUp_0.5s_ease-out_0.32s_both]"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {stats.players.toLocaleString()} players{" "}
          <span className="mx-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
            &middot;
          </span>{" "}
          {stats.schools.toLocaleString()} schools{" "}
          <span className="mx-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
            &middot;
          </span>{" "}
          {stats.sports} sports{" "}
          <span className="mx-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
            &middot;
          </span>{" "}
          25+ years
        </p>

        {/* Category quick-access pills */}
        <div className="flex justify-center gap-2 mb-8 animate-[fadeUp_0.5s_ease-out_0.4s_both]">
          {CATEGORY_PILLS.map(({ label, icon: Icon, type }) => (
            <Link
              key={type}
              href={`/search?type=${type}`}
              className="search-hero-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all"
              style={{
                borderColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Trending searches */}
        {trendingSearches.length > 0 && (
          <div className="animate-[fadeUp_0.5s_ease-out_0.48s_both]">
            <p
              className="text-[10px] uppercase tracking-[0.15em] font-bold mb-3"
              style={{ color: "var(--psp-gold)" }}
            >
              Trending
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingSearches.map((item) => (
                <Link
                  key={item.url_path}
                  href={`/search?q=${encodeURIComponent(item.display_name)}`}
                  className="search-hero-chip px-3 py-1.5 rounded-full text-xs transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {item.display_name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .search-hero-pill:hover {
          border-color: var(--psp-gold) !important;
          color: var(--psp-gold) !important;
        }
        .search-hero-chip:hover {
          background: rgba(255,255,255,0.1) !important;
          color: rgba(255,255,255,0.8) !important;
        }
      `}</style>
    </section>
  );
}
