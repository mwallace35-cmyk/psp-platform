"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ============================================================================
   TYPES
============================================================================ */

export interface AllAmericanAward {
  playerName: string;
  playerSlug: string | null;
  schoolName: string | null;
  schoolSlug: string | null;
  awardName: string;
  year: number | null;
  sportId: string;
  category: string | null;
  position: string | null;
}

/** Grouped by player+school so multiple awards show on one card */
interface PlayerCard {
  playerName: string;
  playerSlug: string | null;
  schoolName: string | null;
  schoolSlug: string | null;
  sportId: string;
  position: string | null;
  canceled: boolean;
  awards: { awardName: string; year: number | null }[];
}

interface AllAmericansSpotlightProps {
  awards: AllAmericanAward[];
}

/* ============================================================================
   CONSTANTS
============================================================================ */

const SPORT_TABS: { id: string; label: string; color: string }[] = [
  { id: "basketball", label: "Basketball", color: "#3b82f6" },
  { id: "football", label: "Football", color: "#16a34a" },
];

const SPORT_COLORS: Record<string, string> = {
  basketball: "#3b82f6",
  football: "#16a34a",
};

/* ============================================================================
   COMPONENT
============================================================================ */

export default function AllAmericansSpotlight({ awards }: AllAmericansSpotlightProps) {
  const [activeSport, setActiveSport] = useState("basketball");

  /* --- Count per sport --- */
  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = { basketball: 0, football: 0 };
    for (const a of awards) {
      if (counts[a.sportId] !== undefined) counts[a.sportId]++;
    }
    return counts;
  }, [awards]);

  /* --- Filter + group into cards --- */
  const cards: PlayerCard[] = useMemo(() => {
    const filtered = awards.filter((a) => a.sportId === activeSport);

    // Group by playerName + schoolName
    const map = new Map<string, PlayerCard>();
    for (const a of filtered) {
      const key = `${a.playerName}||${a.schoolName || ""}`;
      if (!map.has(key)) {
        map.set(key, {
          playerName: a.playerName,
          playerSlug: a.playerSlug,
          schoolName: a.schoolName,
          schoolSlug: a.schoolSlug,
          sportId: a.sportId,
          position: a.position,
          canceled: a.category === "selected-not-played",
          awards: [],
        });
      }
      const card = map.get(key)!;
      card.awards.push({ awardName: a.awardName, year: a.year });
      // If ANY award for this player is played, card is not dimmed
      if (a.category !== "selected-not-played") {
        card.canceled = false;
      }
      // Prefer the first non-null position
      if (!card.position && a.position) {
        card.position = a.position;
      }
      // Prefer a non-null slug
      if (!card.playerSlug && a.playerSlug) {
        card.playerSlug = a.playerSlug;
      }
      if (!card.schoolSlug && a.schoolSlug) {
        card.schoolSlug = a.schoolSlug;
      }
    }

    // Sort by most recent year first, then alphabetically
    return Array.from(map.values()).sort((a, b) => {
      const aYear = Math.max(...a.awards.map((aw) => aw.year ?? 0));
      const bYear = Math.max(...b.awards.map((aw) => aw.year ?? 0));
      if (bYear !== aYear) return bYear - aYear;
      return a.playerName.localeCompare(b.playerName);
    });
  }, [awards, activeSport]);

  const sportColor = SPORT_COLORS[activeSport] || "#3b82f6";

  return (
    <div
      className="rounded-2xl px-6 sm:px-10 py-10"
      style={{ backgroundColor: "#0a1628" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">&#11088;</span>
        <h2
          className="text-2xl sm:text-3xl font-bold text-white font-bebas tracking-wide"
        >
          All-American Game Selections
        </h2>
      </div>
      <p className="text-gray-300 text-sm mb-6">
        Philadelphia athletes selected for the nation&apos;s most prestigious
        high school all-star games
      </p>

      {/* Sport Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {SPORT_TABS.map((tab) => {
          const isActive = tab.id === activeSport;
          const count = sportCounts[tab.id] ?? 0;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSport(tab.id)}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all font-bebas tracking-wide"
              style={{
                backgroundColor: isActive ? tab.color : "rgba(255,255,255,0.08)",
                color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                fontSize: "1.05rem",
              }}
            >
              {tab.label}
              <span
                className="ml-2 text-xs font-normal px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.06)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card Grid */}
      {cards.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No All-American game selections found for this sport.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <div
              key={`${card.playerName}-${i}`}
              className="rounded-xl overflow-hidden transition-shadow hover:shadow-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                opacity: card.canceled ? 0.55 : 1,
              }}
            >
              <div className="p-4">
                {/* Top row: star + name + year */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="text-lg flex-shrink-0"
                      style={{ color: "#f0a500" }}
                    >
                      &#9733;
                    </span>
                    <div className="min-w-0">
                      {card.playerSlug ? (
                        <Link
                          href={`/players/${card.playerSlug}`}
                          className="font-bold text-white hover:underline block truncate"
                          style={{ fontFamily: "DM Sans, sans-serif" }}
                        >
                          {card.playerName}
                        </Link>
                      ) : (
                        <span
                          className="font-bold text-white block truncate"
                          style={{ fontFamily: "DM Sans, sans-serif" }}
                        >
                          {card.playerName}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Year(s) */}
                  <span
                    className="text-sm font-bold flex-shrink-0 ml-2 font-bebas"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {Array.from(new Set(card.awards.map((a) => a.year).filter(Boolean)))
                      .sort((a, b) => (b ?? 0) - (a ?? 0))
                      .join(", ")}
                  </span>
                </div>

                {/* School */}
                {card.schoolName && (
                  <div className="text-xs text-gray-300 mb-3 ml-7">
                    {card.schoolSlug ? (
                      <Link
                        href={`/schools/${card.schoolSlug}`}
                        className="hover:underline hover:text-gray-300 transition-colors"
                      >
                        {card.schoolName}
                      </Link>
                    ) : (
                      card.schoolName
                    )}
                  </div>
                )}

                {/* Award badges + position */}
                <div className="flex flex-wrap gap-2 ml-7">
                  {card.awards.map((aw, j) => (
                    <span
                      key={j}
                      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(240,165,0,0.15)",
                        color: "#f0a500",
                      }}
                    >
                      {aw.awardName}
                    </span>
                  ))}

                  {card.position && (
                    <span
                      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${sportColor}20`,
                        color: sportColor,
                      }}
                    >
                      {card.position}
                    </span>
                  )}
                </div>

                {/* COVID / Canceled note */}
                {card.canceled && (
                  <div
                    className="text-xs mt-2 ml-7 italic"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    (COVID/Canceled)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roman Catholic callout */}
      <div
        className="mt-8 rounded-xl px-5 py-4 flex items-center gap-3"
        style={{
          backgroundColor: "rgba(240,165,0,0.1)",
          border: "1px solid rgba(240,165,0,0.25)",
        }}
      >
        <span className="text-xl flex-shrink-0" style={{ color: "#f0a500" }}>
          &#127942;
        </span>
        <p
          className="text-sm font-semibold"
          style={{ color: "#f0a500", fontFamily: "DM Sans, sans-serif" }}
        >
          Roman Catholic leads all Philly schools with 6 McDonald&apos;s
          All-Americans
        </p>
      </div>
    </div>
  );
}
