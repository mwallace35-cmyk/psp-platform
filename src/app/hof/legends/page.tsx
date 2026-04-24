"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getLegendsByCategory,
  SPORT_LABELS,
  SPORT_EMOJIS,
  type LegendSport,
} from "@/lib/data/legends";
import LegendCard from "@/components/legends/LegendCard";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { BarChart3 } from "lucide-react";

const SPORT_FILTERS: { id: LegendSport | "all"; label: string }[] = [
  { id: "all", label: "All Sports" },
  { id: "football", label: "Football" },
  { id: "basketball", label: "Basketball" },
  { id: "baseball", label: "Baseball" },
  { id: "track-field", label: "Track & Field" },
  { id: "multi", label: "Multi-Sport" },
];

export default function LegendsHubPage() {
  const [activeSport, setActiveSport] = useState<LegendSport | "all">("all");

  const coaches = getLegendsByCategory("coach");

  const filtered =
    activeSport === "all"
      ? coaches
      : coaches.filter((l) => l.sport === activeSport);

  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-[var(--psp-navy)]">
      {/* Hero */}
      <section className="bg-[var(--psp-navy)] border-b border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Hall of Fame", href: "/hof" },
              { label: "Legends" },
            ]}
            className="text-white/60 mb-4"
          />

          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            Legends
          </h1>

          <p className="text-white/70 mt-2 text-lg max-w-2xl">
            Tributes to the coaches who built Philadelphia high school sports.
            Written by Ted Silary.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--psp-gold)]/20 text-[var(--psp-gold)] text-sm font-semibold">
              {coaches.length} Coaches
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main column */}
          <div>
            {/* Coaching Records banner */}
            <Link
              href="/hof/legends/records"
              className="flex items-center justify-between bg-[var(--psp-navy)] rounded-xl p-4 mb-6 group hover:bg-[var(--psp-navy-mid)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 inline" />
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-[var(--psp-gold)] transition-colors">
                    Football Coaching Records
                  </p>
                  <p className="text-xs text-white/60">
                    100-Win Club &middot; Best Winning % &middot; Most Years Coached
                  </p>
                </div>
              </div>
              <svg className="w-5 h-5 text-[var(--psp-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            {/* Sport filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {SPORT_FILTERS.map((sf) => (
                <button
                  key={sf.id}
                  onClick={() => setActiveSport(sf.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeSport === sf.id
                      ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                      : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {sf.id !== "all" && SPORT_EMOJIS[sf.id as LegendSport]}{" "}
                  {sf.label}
                </button>
              ))}
            </div>

            {/* Results count */}
            <p className="text-sm text-white/60 mb-4">
              Showing {sorted.length} legend{sorted.length !== 1 ? "s" : ""}
            </p>

            {/* Card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {sorted.map((legend) => (
                <LegendCard key={legend.slug} legend={legend} />
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="text-center py-16">
                <p className="text-white/40 text-lg">
                  No legends found for this sport.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Ted Silary credit */}
            <div className="bg-[var(--psp-navy-mid)] rounded-xl border border-white/10 overflow-hidden">
              <div className="bg-[var(--psp-navy)] border-b border-[var(--psp-gold)]/40 px-5 py-3">
                <h3 className="font-heading text-sm text-[var(--psp-gold)] uppercase tracking-wider">
                  About These Tributes
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-white/70 leading-relaxed">
                  These coach tribute pages were originally written and compiled
                  by <strong>Ted Silary</strong>, legendary Philadelphia high
                  school sports journalist, on TedSilary.com. They have been
                  preserved and republished here to honor the coaches who shaped
                  Philly sports history.
                </p>
              </div>
            </div>

            {/* More HOF sections */}
            <div className="bg-[var(--psp-navy-mid)] rounded-xl border border-white/10 overflow-hidden">
              <div className="bg-[var(--psp-navy)] border-b border-[var(--psp-gold)]/40 px-5 py-3">
                <h3 className="font-heading text-sm text-[var(--psp-gold)] uppercase tracking-wider">
                  More from the Hall of Fame
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href="/hof/in-memoriam"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg">🕊</span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      In Memoriam
                    </p>
                    <p className="text-xs text-white/60">
                      Remembering those taken too soon
                    </p>
                  </div>
                </Link>
                <Link
                  href="/hof/spotlights"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg">🔦</span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Player Spotlights
                    </p>
                    <p className="text-xs text-white/60">
                      Record-breaking performances
                    </p>
                  </div>
                </Link>
                <Link
                  href="/hof/public-league"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg">⭐</span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Public League HOF
                    </p>
                    <p className="text-xs text-white/60">
                      165 inductees and counting
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            <PSPPromo size="sidebar" />
          </aside>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Legends -- Coaching Tributes",
            description:
              "Tributes to the coaches who built Philadelphia high school sports. Written by Ted Silary.",
            url: "https://phillysportspack.com/hof/legends",
            publisher: {
              "@type": "Organization",
              name: "PhillySportsPack",
            },
          }),
        }}
      />
    </div>
  );
}
