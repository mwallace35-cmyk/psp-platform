"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const SPORT_COLORS_HEX: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

const SPORT_EMOJI: Record<string, string> = {
  football: "\u{1F3C8}",
  basketball: "\u{1F3C0}",
  baseball: "\u26BE",
  "track-field": "\u{1F3C3}",
  lacrosse: "\u{1F94D}",
  wrestling: "\u{1F93C}",
  soccer: "\u26BD",
};

const SPORT_NAMES: Record<string, string> = {
  football: "Football",
  basketball: "Basketball",
  baseball: "Baseball",
  "track-field": "Track & Field",
  lacrosse: "Lacrosse",
  wrestling: "Wrestling",
  soccer: "Soccer",
};

export interface ClassYearPlayer {
  personName: string;
  college: string | null;
  sportId: string | null;
  schoolName: string | null;
  schoolSlug: string | null;
  graduationYear: number | null;
  positions: string[] | null;
  playerSlug: string | null;
}

interface ClassYearSpotlightProps {
  players: ClassYearPlayer[];
  classYears: number[];
}

export default function ClassYearSpotlight({ players, classYears }: ClassYearSpotlightProps) {
  const [activeYear, setActiveYear] = useState(classYears[0] ?? 2026);

  const filtered = useMemo(() => {
    return players.filter((p) => p.graduationYear === activeYear);
  }, [players, activeYear]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {classYears.map((year) => {
          const count = players.filter((p) => p.graduationYear === year).length;
          const isActive = year === activeYear;
          return (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className="px-4 py-1.5 rounded-full font-semibold text-sm transition-all"
              style={{
                backgroundColor: isActive ? "#f0a500" : "rgba(255,255,255,0.06)",
                color: isActive ? "#0a1628" : "rgba(255,255,255,0.5)",
                border: isActive ? "none" : "1px solid rgba(255,255,255,0.1)",
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "0.95rem",
                letterSpacing: "0.5px",
              }}
            >
              Class of {year}
              <span
                className="ml-1.5 text-[10px] font-normal px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isActive ? "rgba(10,22,40,0.15)" : "rgba(255,255,255,0.08)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Player Grid */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-8 text-gray-500 text-sm rounded-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
        >
          No college commitments tracked for the Class of {activeYear} yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((player, i) => {
            const sportColor = SPORT_COLORS_HEX[player.sportId || "football"] || "#16a34a";
            const sportEmoji = SPORT_EMOJI[player.sportId || "football"] || "\u{1F3C8}";
            const sportName = SPORT_NAMES[player.sportId || "football"] || "Football";
            return (
              <div
                key={`${player.personName}-${i}`}
                className="rounded-xl overflow-hidden transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderLeft: `3px solid ${sportColor}`,
                }}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {player.playerSlug ? (
                        <Link
                          href={`/players/${player.playerSlug}`}
                          className="font-bold text-white text-sm hover:underline truncate"
                          style={{ fontFamily: "DM Sans, sans-serif" }}
                        >
                          {player.personName}
                        </Link>
                      ) : (
                        <span
                          className="font-bold text-white text-sm truncate"
                          style={{ fontFamily: "DM Sans, sans-serif" }}
                        >
                          {player.personName}
                        </span>
                      )}
                      {player.positions && player.positions.length > 0 && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          {player.positions[0]}
                        </span>
                      )}
                    </div>
                    <span className="text-sm shrink-0 ml-1" title={sportName}>
                      {sportEmoji}
                    </span>
                  </div>

                  {player.schoolName && (
                    <div className="text-[11px] text-gray-400 mb-1.5">
                      {player.schoolSlug ? (
                        <Link
                          href={`/schools/${player.schoolSlug}`}
                          className="hover:underline"
                        >
                          {player.schoolName}
                        </Link>
                      ) : (
                        player.schoolName
                      )}
                    </div>
                  )}

                  {player.college && (
                    <div
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${sportColor}20`,
                        color: sportColor,
                      }}
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {player.college}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
