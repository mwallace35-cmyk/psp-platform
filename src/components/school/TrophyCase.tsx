"use client";

import { useState } from "react";

interface Championship {
  id: number;
  level?: string;
  score?: string;
  seasons?: { label: string };
  leagues?: { name: string };
}

interface TrophyCaseProps {
  championships: Championship[];
  sportColor: string;
}

export default function TrophyCase({ championships, sportColor }: TrophyCaseProps) {
  const [expanded, setExpanded] = useState(false);
  const INITIAL_COUNT = 6;

  // Sort newest first
  const sorted = [...championships].sort((a, b) => {
    const aYear = parseInt(a.seasons?.label?.substring(0, 4) || "0");
    const bYear = parseInt(b.seasons?.label?.substring(0, 4) || "0");
    return bYear - aYear;
  });

  const hasMore = sorted.length > INITIAL_COUNT;
  const visible = expanded ? sorted : sorted.slice(0, INITIAL_COUNT);

  // Group by level for the summary bar
  const levelCounts = championships.reduce<Record<string, number>>((acc, c) => {
    const level = c.level || "Other";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Summary bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(levelCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([level, count]) => (
            <span
              key={level}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: level.toLowerCase().includes("state")
                  ? `${sportColor}20`
                  : "rgba(240, 165, 0, 0.12)",
                color: level.toLowerCase().includes("state") ? sportColor : "var(--psp-gold)",
                border: `1px solid ${level.toLowerCase().includes("state") ? `${sportColor}40` : "rgba(240, 165, 0, 0.25)"}`,
              }}
            >
              🏆 {count} {level}
            </span>
          ))}
      </div>

      {/* Championship grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {visible.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-lg border border-[var(--psp-gray-200)] px-4 py-3 flex items-center gap-3"
          >
            <span className="text-lg flex-shrink-0">🏆</span>
            <div className="min-w-0">
              <span className="font-medium text-sm" style={{ color: "var(--psp-navy)" }}>
                {c.seasons?.label}
              </span>
              <span className="text-xs ml-2" style={{ color: "var(--psp-gray-500)" }}>
                {c.level}
                {c.leagues?.name ? ` — ${c.leagues.name}` : ""}
              </span>
              {c.score && (
                <span className="text-xs ml-2" style={{ color: "var(--psp-gray-400)" }}>
                  ({c.score})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Expand/collapse */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-2.5 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
          style={{
            background: expanded ? "var(--psp-gray-100, #f3f4f6)" : `${sportColor}12`,
            color: expanded ? "var(--psp-gray-500)" : sportColor,
            border: `1px solid ${expanded ? "var(--psp-gray-200)" : `${sportColor}30`}`,
          }}
        >
          {expanded
            ? "Show fewer"
            : `Show all ${championships.length} championships`}
        </button>
      )}
    </div>
  );
}
