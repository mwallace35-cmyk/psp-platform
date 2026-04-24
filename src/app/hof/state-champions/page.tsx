"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { ALL_STATE_CHAMPIONSHIPS, type StateChampionship } from "@/lib/data/state-champions";
import { SPORT_EMOJI } from "@/lib/sports";
import { BarChart3, Trophy } from "lucide-react";

const SPORT_COLORS: Record<string, string> = {
  football: "var(--psp-gold)",
  basketball: "#3b82f6",
  baseball: "#16a34a",
};

type SportFilter = "all" | "football" | "basketball" | "baseball";

function ChampCard({ champ }: { champ: StateChampionship }) {
  const sportColor = SPORT_COLORS[champ.sport] ?? "var(--psp-gold)";

  return (
    <Link href={`/hof/state-champions/${champ.slug}`} className="block group">
      <div className="rounded-xl border border-white/10 bg-[var(--psp-navy-mid)] overflow-hidden transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5 group-hover:border-[var(--psp-gold)]">
        {/* Sport color bar */}
        <div style={{ height: "4px", background: sportColor }} />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{SPORT_EMOJI[champ.sport]}</span>
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: sportColor }}
                >
                  {champ.sport} &middot; {champ.classification}
                </span>
              </div>

              <h3 className="font-heading text-xl text-white leading-tight group-hover:text-[var(--psp-gold)] transition-colors">
                {champ.school}
              </h3>

              <p className="text-sm text-white/60 mt-1">
                vs. {champ.opponent}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="font-heading text-3xl text-white">
                {champ.year}
              </div>
              <div className="text-sm font-bold text-[var(--psp-gold)]">
                {champ.score}
              </div>
            </div>
          </div>

          {/* Coach */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
            <span className="text-xs text-white/60">
              Coach: <strong className="text-white/80">{champ.coach}</strong>
            </span>
            {champ.seasonRecord && (
              <span className="text-xs text-white/40">
                &middot; {champ.seasonRecord}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function StateChampionsPage() {
  const [sportFilter, setSportFilter] = useState<SportFilter>("all");

  const filtered =
    sportFilter === "all"
      ? ALL_STATE_CHAMPIONSHIPS
      : ALL_STATE_CHAMPIONSHIPS.filter((c) => c.sport === sportFilter);

  // Sort by year descending
  const sorted = [...filtered].sort((a, b) => b.year - a.year);

  // Dynasty stats for sidebar
  const schoolTitles = ALL_STATE_CHAMPIONSHIPS.reduce(
    (acc, c) => {
      const key = c.school;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const dynasties = Object.entries(schoolTitles)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const sportCounts = {
    football: ALL_STATE_CHAMPIONSHIPS.filter((c) => c.sport === "football").length,
    basketball: ALL_STATE_CHAMPIONSHIPS.filter((c) => c.sport === "basketball").length,
    baseball: ALL_STATE_CHAMPIONSHIPS.filter((c) => c.sport === "baseball").length,
  };

  return (
    <div className="min-h-screen bg-[var(--psp-navy)]">
      {/* Hero */}
      <section className="bg-[var(--psp-navy)] border-b border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Hall of Fame", href: "/hof" },
              { label: "State Champions" },
            ]}
            className="text-white/60 mb-4"
          />

          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            State Champions
          </h1>

          <p className="text-white/70 mt-2 text-lg max-w-2xl">
            Championship celebration pages by Ted Silary. Every title game, every
            roster, every stat.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--psp-gold)]/20 text-[var(--psp-gold)] text-sm font-semibold">
              {ALL_STATE_CHAMPIONSHIPS.length} Championships
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold">
              {SPORT_EMOJI.football} {sportCounts.football} Football
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold">
              {SPORT_EMOJI.basketball} {sportCounts.basketball} Basketball
            </span>
            {sportCounts.baseball > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold">
                {SPORT_EMOJI.baseball} {sportCounts.baseball} Baseball
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div>
            {/* Sport filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(["all", "football", "basketball", "baseball"] as SportFilter[]).map(
                (sport) => (
                  <button
                    key={sport}
                    onClick={() => setSportFilter(sport)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      sportFilter === sport
                        ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                        : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {sport !== "all" && SPORT_EMOJI[sport]}{" "}
                    {sport === "all" ? "All Sports" : sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </button>
                )
              )}
            </div>

            <p className="text-sm text-white/60 mb-4">
              {sorted.length} championship{sorted.length !== 1 ? "s" : ""}
            </p>

            {/* Card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sorted.map((champ) => (
                <ChampCard key={champ.slug} champ={champ} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Dynasty leaders */}
            <div className="bg-[var(--psp-navy-mid)] rounded-xl border border-white/10 overflow-hidden">
              <div className="bg-[var(--psp-navy)] border-b border-[var(--psp-gold)]/40 px-5 py-3">
                <h3 className="font-heading text-sm text-[var(--psp-gold)] uppercase tracking-wider">
                  Most State Titles
                </h3>
              </div>
              <div className="p-4">
                {dynasties.map(([school, count], i) => (
                  <div
                    key={school}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-sm text-white/80">
                      <span className="text-white/40 font-mono text-xs mr-2">
                        {i + 1}.
                      </span>
                      {school}
                    </span>
                    <span className="text-sm font-bold text-[var(--psp-gold)]">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* More HOF */}
            <div className="bg-[var(--psp-navy-mid)] rounded-xl border border-white/10 overflow-hidden">
              <div className="bg-[var(--psp-navy)] border-b border-[var(--psp-gold)]/40 px-5 py-3">
                <h3 className="font-heading text-sm text-[var(--psp-gold)] uppercase tracking-wider">
                  More from the Hall of Fame
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href="/hof/legends"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Trophy className="w-5 h-5 inline text-[var(--psp-gold)]" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Legends
                    </p>
                    <p className="text-xs text-white/60">
                      Coach tributes by Ted Silary
                    </p>
                  </div>
                </Link>
                <Link
                  href="/hof/legends/records"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 inline text-[var(--psp-gold)]" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Coaching Records
                    </p>
                    <p className="text-xs text-white/60">
                      100-win club, best pct, most years
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
            name: "State Champions",
            description:
              "Championship celebration pages by Ted Silary for Philadelphia-area PIAA state champions.",
            url: "https://phillysportspack.com/hof/state-champions",
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
