"use client";

import { useState } from "react";
import Link from "next/link";
import {
  COACHES_100_WINS,
  COACHES_BEST_PCT,
  COACHES_MOST_YEARS,
} from "@/lib/data/coaching-records";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";

type Tab = "100-wins" | "best-pct" | "most-years";

const TABS: { id: Tab; label: string; description: string }[] = [
  { id: "100-wins", label: "100-Win Club", description: "Coaches who won 100+ games" },
  { id: "best-pct", label: "Best Winning %", description: "Highest career winning percentages" },
  { id: "most-years", label: "Most Years", description: "Longest coaching tenures" },
];

function CoachName({ name, legendSlug }: { name: string; legendSlug?: string }) {
  if (legendSlug) {
    return (
      <Link
        href={`/hof/legends/${legendSlug}`}
        className="text-[var(--psp-gold)] font-semibold hover:underline"
      >
        {name}
      </Link>
    );
  }
  return <span>{name}</span>;
}

export default function CoachingRecordsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("100-wins");

  return (
    <div className="min-h-screen bg-[var(--psp-cream)]">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[var(--psp-navy)] to-[var(--psp-navy-mid)] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Hall of Fame", href: "/hof" },
              { label: "Legends", href: "/hof/legends" },
              { label: "Coaching Records" },
            ]}
            className="text-white/60 mb-4"
          />

          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            Football Coaching Records
          </h1>

          <p className="text-white/70 mt-2 text-lg max-w-2xl">
            The definitive record book of Philadelphia high school football
            coaching. Data compiled by Ted Silary (through 2021).
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--psp-gold)]/20 text-[var(--psp-gold)] text-sm font-semibold">
              {COACHES_100_WINS.length} in 100-Win Club
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold">
              {COACHES_BEST_PCT.length} Career Records
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold">
              {COACHES_MOST_YEARS.length} Long Tenures
            </span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-[var(--psp-gray-200)] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-1 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--psp-gold)] text-[var(--psp-navy)]"
                    : "border-transparent text-[var(--psp-gray-500)] hover:text-[var(--psp-navy)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div>
            <p className="text-sm text-[var(--psp-gray-500)] mb-4">
              {TABS.find((t) => t.id === activeTab)?.description}
            </p>

            {/* 100-Win Coaches Table */}
            {activeTab === "100-wins" && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--psp-navy)] text-white text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 text-left">#</th>
                        <th className="px-4 py-3 text-left">Coach</th>
                        <th className="px-4 py-3 text-left">School(s)</th>
                        <th className="px-4 py-3 text-center">Years</th>
                        <th className="px-4 py-3 text-center">Wins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COACHES_100_WINS.map((c, i) => (
                        <tr
                          key={i}
                          className={`border-b border-[var(--psp-gray-100)] ${
                            i < 3 ? "bg-[var(--psp-gold)]/5 font-semibold" : ""
                          }`}
                        >
                          <td className="px-4 py-2.5 text-[var(--psp-gray-400)] font-mono text-xs">
                            {i + 1}
                          </td>
                          <td className="px-4 py-2.5">
                            <CoachName name={c.name} legendSlug={c.legendSlug} />
                          </td>
                          <td className="px-4 py-2.5 text-[var(--psp-gray-600)]">
                            {c.schools.join(", ")}
                          </td>
                          <td className="px-4 py-2.5 text-center text-[var(--psp-gray-600)]">
                            {c.years}
                          </td>
                          <td className="px-4 py-2.5 text-center font-bold text-[var(--psp-navy)]">
                            {c.wins}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Best Winning Percentage Table */}
            {activeTab === "best-pct" && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--psp-navy)] text-white text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 text-left">#</th>
                        <th className="px-4 py-3 text-left">Coach</th>
                        <th className="px-4 py-3 text-left">School(s)</th>
                        <th className="px-4 py-3 text-center">Record</th>
                        <th className="px-4 py-3 text-center">Pct</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COACHES_BEST_PCT.map((c, i) => (
                        <tr
                          key={i}
                          className={`border-b border-[var(--psp-gray-100)] ${
                            i < 3 ? "bg-[var(--psp-gold)]/5 font-semibold" : ""
                          }`}
                        >
                          <td className="px-4 py-2.5 text-[var(--psp-gray-400)] font-mono text-xs">
                            {i + 1}
                          </td>
                          <td className="px-4 py-2.5">
                            <CoachName name={c.name} legendSlug={c.legendSlug} />
                          </td>
                          <td className="px-4 py-2.5 text-[var(--psp-gray-600)]">
                            {c.schools.join(", ")}
                          </td>
                          <td className="px-4 py-2.5 text-center text-[var(--psp-gray-600)] font-mono text-xs">
                            {c.record}
                          </td>
                          <td className="px-4 py-2.5 text-center font-bold text-[var(--psp-navy)]">
                            .{Math.round(c.pct * 1000)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Most Years Coached Table */}
            {activeTab === "most-years" && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--psp-navy)] text-white text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 text-left">#</th>
                        <th className="px-4 py-3 text-center">Years</th>
                        <th className="px-4 py-3 text-left">Coach</th>
                        <th className="px-4 py-3 text-left">School(s) &amp; Seasons</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COACHES_MOST_YEARS.map((c, i) => (
                        <tr
                          key={i}
                          className={`border-b border-[var(--psp-gray-100)] ${
                            i < 3 ? "bg-[var(--psp-gold)]/5 font-semibold" : ""
                          }`}
                        >
                          <td className="px-4 py-2.5 text-[var(--psp-gray-400)] font-mono text-xs">
                            {i + 1}
                          </td>
                          <td className="px-4 py-2.5 text-center font-bold text-[var(--psp-navy)]">
                            {c.totalYears}
                          </td>
                          <td className="px-4 py-2.5">
                            <CoachName name={c.name} legendSlug={c.legendSlug} />
                          </td>
                          <td className="px-4 py-2.5 text-[var(--psp-gray-600)]">
                            {c.stints.map((s, j) => (
                              <span key={j}>
                                {s.school}{" "}
                                <span className="text-[var(--psp-gray-400)] text-xs">
                                  ({s.seasons})
                                </span>
                                {j < c.stints.length - 1 && " · "}
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
              <div className="bg-[var(--psp-navy)] px-5 py-3">
                <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                  About These Records
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-[var(--psp-gray-600)] leading-relaxed">
                  Data compiled by <strong>Ted Silary</strong> through the 2021
                  season. Covers all Philadelphia-area high school football
                  programs across Catholic League, Public League, Inter-Ac, and
                  independent schools.
                </p>
                <p className="text-xs text-[var(--psp-gray-400)] mt-3 italic">
                  Coaches highlighted in gold have tribute pages in our Legends
                  section.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
              <div className="bg-[var(--psp-navy)] px-5 py-3">
                <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                  More from Legends
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
                      Coach Tributes
                    </p>
                    <p className="text-xs text-[var(--psp-gray-500)]">
                      Full profiles by Ted Silary
                    </p>
                  </div>
                </Link>
                <Link
                  href="/hof/state-champions"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--psp-gray-50)] transition-colors"
                >
                  <span className="text-lg">🏟</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--psp-navy)]">
                      State Champions
                    </p>
                    <p className="text-xs text-[var(--psp-gray-500)]">
                      Championship celebration pages
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
            "@type": "DataCatalog",
            name: "Philadelphia Football Coaching Records",
            description:
              "The definitive record book of Philadelphia high school football coaching. Data compiled by Ted Silary.",
            url: "https://phillysportspack.com/hof/legends/records",
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
