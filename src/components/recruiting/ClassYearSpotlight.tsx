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
            return (
              <div
                key={`${player.personName}-${i}`}
                className="rounded-lg overflow-hidden transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderLeft: `3px solid ${sportColor}`,
                }}
              >
                <div className="px-3 py-2">
                  <div className="flex items-center gap-1.5 min-w-0 mb-0.5">
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
                        className="text-[10px] text-gray-500 shrink-0"
                      >
                        {player.positions[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    {player.schoolName && (
                      <>
                        {player.schoolSlug ? (
                          <Link
                            href={`/schools/${player.schoolSlug}`}
                            className="hover:underline"
                          >
                            {player.schoolName}
                          </Link>
                        ) : (
                          <span>{player.schoolName}</span>
                        )}
                      </>
                    )}
                    {player.college && player.schoolName && (
                      <span className="text-gray-600">&rarr;</span>
                    )}
                    {player.college && (
                      <span style={{ color: sportColor, fontWeight: 600 }}>
                        {player.college}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
