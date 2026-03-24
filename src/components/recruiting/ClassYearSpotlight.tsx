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
      <div className="flex gap-2 mb-6 flex-wrap">
        {classYears.map((year) => {
          const count = players.filter((p) => p.graduationYear === year).length;
          const isActive = year === activeYear;
          return (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
              style={{
                backgroundColor: isActive ? "#f0a500" : "#f3f4f6",
                color: isActive ? "#0a1628" : "#6b7280",
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "1.05rem",
                letterSpacing: "0.5px",
              }}
            >
              Class of {year}
              <span
                className="ml-2 text-xs font-normal px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isActive ? "rgba(10,22,40,0.15)" : "rgba(0,0,0,0.08)",
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
        <div className="text-center py-12 text-gray-400 text-sm">
          No college commitments tracked for the Class of {activeYear} yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((player, i) => {
            const sportColor = SPORT_COLORS_HEX[player.sportId || "football"] || "#16a34a";
            const sportEmoji = SPORT_EMOJI[player.sportId || "football"] || "\u{1F3C8}";
            const sportName = SPORT_NAMES[player.sportId || "football"] || "Football";
            return (
              <div
                key={`${player.personName}-${i}`}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                style={{ borderLeft: `4px solid ${sportColor}` }}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {player.playerSlug ? (
                        <Link
                          href={`/players/${player.playerSlug}`}
                          className="font-bold text-gray-900 hover:underline"
                          style={{ fontFamily: "DM Sans, sans-serif" }}
                        >
                          {player.personName}
                        </Link>
                      ) : (
                        <span className="font-bold text-gray-900" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {player.personName}
                        </span>
                      )}
                      {player.positions && player.positions.length > 0 && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {player.positions[0]}
                        </span>
                      )}
                    </div>
                    <span className="text-lg" title={sportName}>{sportEmoji}</span>
                  </div>

                  {player.schoolName && (
                    <div className="text-xs text-gray-500 mb-2">
                      {player.schoolSlug ? (
                        <Link href={`/schools/${player.schoolSlug}`} className="hover:underline">
                          {player.schoolName}
                        </Link>
                      ) : (
                        player.schoolName
                      )}
                    </div>
                  )}

                  {player.college && (
                    <div
                      className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${sportColor}15`,
                        color: sportColor,
                      }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
