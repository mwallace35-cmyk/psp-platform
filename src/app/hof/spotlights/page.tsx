"use client";

import Link from "next/link";
import {
  getLegendsByCategory,
  SPORT_LABELS,
  SPORT_EMOJIS,
  SPORT_ACCENT_COLORS,
  type Legend,
} from "@/lib/data/legends";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { Trophy } from "lucide-react";

function SpotlightCard({ legend }: { legend: Legend }) {
  const initials = legend.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const accent = SPORT_ACCENT_COLORS[legend.sport] ?? "#f0a500";

  return (
    <Link href={`/hof/spotlights/${legend.slug}`} className="block group">
      <div className="rounded-xl border border-white/10 bg-[var(--psp-navy-mid)] p-6 transition-all duration-200 group-hover:shadow-lg group-hover:border-[var(--psp-gold)]/40 group-hover:-translate-y-0.5">
        <div className="flex items-start gap-4">
          {/* Sport-colored initials circle */}
          <div
            className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold text-white"
            style={{ background: accent }}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: `${accent}1f`, color: accent }}
              >
                {SPORT_EMOJIS[legend.sport]} {SPORT_LABELS[legend.sport]}
              </span>
            </div>
            <h3 className="font-heading text-xl text-white leading-tight group-hover:text-[var(--psp-gold)] transition-colors">
              {legend.name}
            </h3>
            <p className="text-sm text-white/60 mt-0.5">
              {legend.schools.join(" · ")}
              {legend.careerSpan && (
                <span className="text-white/40">
                  {" "}
                  ({legend.careerSpan})
                </span>
              )}
            </p>
          </div>
        </div>

        <p className="text-sm text-white/70 mt-4 leading-relaxed">
          {legend.excerpt}
        </p>

        {/* Highlights preview */}
        {legend.highlights && legend.highlights.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <ul className="space-y-1">
              {legend.highlights.slice(0, 2).map((h, i) => (
                <li
                  key={i}
                  className="text-xs text-white/60 flex items-start gap-1.5"
                >
                  <span className="mt-0.5 flex-shrink-0" style={{ color: accent }}>
                    &#9670;
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function SpotlightsPage() {
  const spotlights = getLegendsByCategory("player-spotlight");
  const sorted = [...spotlights].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-[var(--psp-navy)]">
      {/* Hero */}
      <section className="bg-[var(--psp-navy)] border-b border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Hall of Fame", href: "/hof" },
              { label: "Player Spotlights" },
            ]}
            className="text-white/60 mb-4"
          />

          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            Player Spotlights
          </h1>

          <p className="text-white/70 mt-2 text-lg max-w-2xl">
            Record-breaking performances and remarkable stories from
            Philadelphia high school sports. Written by Ted Silary.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--psp-blue)]/20 text-[var(--psp-blue)] text-sm font-semibold">
              {spotlights.length} Spotlights
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main column */}
          <div className="space-y-5">
            {sorted.map((legend) => (
              <SpotlightCard key={legend.slug} legend={legend} />
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-[var(--psp-navy-mid)] rounded-xl border border-white/10 overflow-hidden">
              <div className="bg-[var(--psp-navy)] border-b border-[var(--psp-gold)]/40 px-5 py-3">
                <h3 className="font-heading text-sm text-[var(--psp-gold)] uppercase tracking-wider">
                  About These Stories
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-white/70 leading-relaxed">
                  These spotlight pages capture remarkable individual
                  performances and stories from Ted Silary's coverage of
                  Philadelphia high school sports. From Wilt Chamberlain's
                  Overbrook days to record-breaking three-point shooting nights.
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
            name: "Player Spotlights",
            description:
              "Record-breaking performances and remarkable stories from Philadelphia high school sports.",
            url: "https://phillysportspack.com/hof/spotlights",
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
