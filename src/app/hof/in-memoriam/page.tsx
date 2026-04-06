"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getLegendsByCategory,
  SPORT_LABELS,
  SPORT_EMOJIS,
  type LegendSport,
  type Legend,
} from "@/lib/data/legends";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";

function MemorialCard({ legend }: { legend: Legend }) {
  const initials = legend.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/hof/in-memoriam/${legend.slug}`} className="block group">
      <div className="rounded-xl border border-[var(--psp-gray-300)] bg-white p-5 transition-all duration-200 group-hover:shadow-md group-hover:border-[var(--psp-gold)]/40">
        <div className="flex items-start gap-4">
          {/* Initials circle */}
          <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold bg-[var(--psp-navy)] text-white/70">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg text-[var(--psp-navy)] leading-tight group-hover:text-[var(--psp-gold)] transition-colors">
              {legend.name}
            </h3>
            <p className="text-sm text-[var(--psp-gray-600)] mt-0.5">
              {legend.role}
            </p>
            <p className="text-sm text-[var(--psp-gray-500)] mt-0.5">
              {legend.schools.join(" · ")}
            </p>
          </div>
        </div>

        <p className="text-sm text-[var(--psp-gray-600)] mt-3 line-clamp-2">
          {legend.excerpt}
        </p>

        {legend.died && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--psp-gray-200)]">
            <span className="text-xs text-[var(--psp-gray-500)] italic">
              In Memoriam &middot; {legend.died}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function InMemoriamPage() {
  const [activeSport, setActiveSport] = useState<LegendSport | "all">("all");
  const memorials = getLegendsByCategory("in-memoriam");

  const filtered =
    activeSport === "all"
      ? memorials
      : memorials.filter((l) => l.sport === activeSport);

  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  // Get unique sports in this collection
  const availableSports = [
    ...new Set(memorials.map((m) => m.sport)),
  ] as LegendSport[];

  return (
    <div className="min-h-screen bg-[var(--psp-gray-50)]">
      {/* Hero — darker, more somber tone */}
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Hall of Fame", href: "/hof" },
              { label: "In Memoriam" },
            ]}
            className="text-white/60 mb-4"
          />

          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            In Memoriam
          </h1>

          <p className="text-white/60 mt-2 text-lg max-w-2xl">
            Honoring the players and figures taken too soon. Their stories live
            on through Ted Silary's words.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold">
              {memorials.length} Tributes
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main column */}
          <div>
            {/* Sport filter */}
            {availableSports.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveSport("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeSport === "all"
                      ? "bg-[var(--psp-navy)] text-white"
                      : "bg-[var(--psp-gray-100)] text-[var(--psp-gray-600)] hover:bg-[var(--psp-gray-200)]"
                  }`}
                >
                  All
                </button>
                {availableSports.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setActiveSport(sport)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      activeSport === sport
                        ? "bg-[var(--psp-navy)] text-white"
                        : "bg-[var(--psp-gray-100)] text-[var(--psp-gray-600)] hover:bg-[var(--psp-gray-200)]"
                    }`}
                  >
                    {SPORT_EMOJIS[sport]} {SPORT_LABELS[sport]}
                  </button>
                ))}
              </div>
            )}

            <p className="text-sm text-[var(--psp-gray-500)] mb-4">
              {sorted.length} tribute{sorted.length !== 1 ? "s" : ""}
            </p>

            {/* Card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sorted.map((legend) => (
                <MemorialCard key={legend.slug} legend={legend} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
              <div className="bg-[#1a1a2e] px-5 py-3">
                <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                  About These Tributes
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-[var(--psp-gray-600)] leading-relaxed">
                  These memorial pages were created by <strong>Ted Silary</strong>{" "}
                  to honor the young athletes and sports figures whose lives were
                  cut short. Originally published on TedSilary.com, they are
                  preserved here so their stories are never forgotten.
                </p>
              </div>
            </div>

            {/* More HOF sections */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
              <div className="bg-[var(--psp-navy)] px-5 py-3">
                <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                  More from the Hall of Fame
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href="/hof/legends"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--psp-gray-50)] transition-colors"
                >
                  <span className="text-lg">🏆</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--psp-navy)]">
                      Legends
                    </p>
                    <p className="text-xs text-[var(--psp-gray-500)]">
                      Coach tributes by Ted Silary
                    </p>
                  </div>
                </Link>
                <Link
                  href="/hof/spotlights"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--psp-gray-50)] transition-colors"
                >
                  <span className="text-lg">🔦</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--psp-navy)]">
                      Player Spotlights
                    </p>
                    <p className="text-xs text-[var(--psp-gray-500)]">
                      Record-breaking performances
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
            name: "In Memoriam",
            description:
              "Honoring the players and figures taken too soon. Their stories live on through Ted Silary's words.",
            url: "https://phillysportspack.com/hof/in-memoriam",
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
