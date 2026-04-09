"use client";

import { useState } from "react";
import type { Accolade } from "@/lib/data/legacy";

interface Props {
  accolades: Accolade[];
}

type Filter = "all" | "player" | "coach";

const TIER_CONFIG = {
  hof: { label: "Hall of Fame", color: "#7c3aed", bg: "bg-purple-50", border: "border-purple-200" },
  championship: { label: "Championship", color: "#f0a500", bg: "bg-yellow-50", border: "border-yellow-200" },
  "all-city": { label: "All-City", color: "#0f2040", bg: "bg-blue-50", border: "border-blue-200" },
  milestone: { label: "Milestone", color: "#16a34a", bg: "bg-green-50", border: "border-green-200" },
} as const;

export default function AchievementsConstellation({ accolades }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = accolades.filter((a) => filter === "all" || a.kind === filter);

  const grouped = (["hof", "championship", "all-city", "milestone"] as const).map((tier) => ({
    tier,
    items: visible.filter((a) => a.tier === tier),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-['Bebas_Neue'] text-[var(--psp-navy)]">Achievements</h2>
        {/* Filter pills */}
        <div className="flex gap-2">
          {(["all", "player", "coach"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors ${
                filter === f
                  ? "bg-[var(--psp-navy)] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-gray-400 text-sm italic">No achievements to display.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ tier, items }) => {
            const cfg = TIER_CONFIG[tier];
            return (
              <div key={tier}>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: cfg.color }}
                >
                  {cfg.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((a) => (
                    <div
                      key={a.id}
                      className={`flex items-center gap-2 ${cfg.bg} ${cfg.border} border rounded-full px-3 py-1.5`}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                      <span className="text-sm font-medium text-gray-800">
                        {a.year ? <strong>{a.year} </strong> : null}
                        {a.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
