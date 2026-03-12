"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { AwardRecord } from "@/lib/data";

interface YearData {
  label: string;
  yearStart: number;
  awards: AwardRecord[];
}

interface AllCityArchiveProps {
  years: YearData[];
  sport: string;
}

export default function AllCityArchive({ years, sport }: AllCityArchiveProps) {
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);

  // Generate decade options (filter out invalid years < 1900)
  const decades = useMemo(() => {
    const validYears = years.filter((y) => y.yearStart >= 1900);
    if (validYears.length === 0) return [];
    const minYear = Math.min(...validYears.map((y) => y.yearStart));
    const maxYear = Math.max(...validYears.map((y) => y.yearStart));

    const decadeList: { decade: string; start: number; end: number }[] = [];
    for (let d = Math.floor(minYear / 10) * 10; d <= maxYear; d += 10) {
      decadeList.push({
        decade: `${d}s`,
        start: d,
        end: d + 9,
      });
    }
    return decadeList.reverse(); // Most recent first
  }, [years]);

  // Filter years by decade
  const filteredYears = useMemo(() => {
    if (!selectedDecade) return years;
    const [start, end] = selectedDecade.split("-").map(Number);
    return years.filter((y) => y.yearStart >= start && y.yearStart <= end);
  }, [years, selectedDecade]);

  // Group awards by position/category
  const groupAwardsByCategory = (awards: AwardRecord[]) => {
    const groups: Record<string, AwardRecord[]> = {};
    for (const award of awards) {
      const key = award.position ? `${award.position}` : award.category || "Other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(award);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  };

  // Determine if this is pre-1969 (no offense/defense split)
  const hasOffenseDefenseSplit = (awards: AwardRecord[]) => {
    return awards.some((a) => a.position?.includes("Offense") || a.position?.includes("Defense"));
  };

  return (
    <div>
      {/* Decade Filter Pills */}
      {decades.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDecade(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedDecade === null
                ? "bg-[#f0a500] text-[#0a1628]"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All Years
          </button>
          {decades.map((d) => (
            <button
              key={d.decade}
              onClick={() => setSelectedDecade(`${d.start}-${d.end}`)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedDecade === `${d.start}-${d.end}`
                  ? "bg-[#f0a500] text-[#0a1628]"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {d.decade}
            </button>
          ))}
        </div>
      )}

      {/* Years Accordion */}
      <div className="space-y-4">
        {filteredYears.map((yearData) => {
          const offenseDefenseSplit = hasOffenseDefenseSplit(yearData.awards);
          const groupedAwards = groupAwardsByCategory(yearData.awards);

          return (
            <details
              key={yearData.label}
              className="group bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
            >
              <summary className="bg-gray-800 hover:bg-gray-750 cursor-pointer px-4 py-3 flex items-center justify-between transition-all">
                <h3 className="text-white font-bebas text-lg">{yearData.label}</h3>
                <span className="text-gray-400 text-sm group-open:hidden">
                  {yearData.awards.length} selections
                </span>
                <span className="text-[#f0a500] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div className="border-t border-gray-700 p-4 bg-black/20 space-y-6">
                {!offenseDefenseSplit ? (
                  // Pre-1969: Unified list
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {yearData.awards.map((award) => (
                        <div
                          key={award.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="text-[#f0a500]">•</span>
                          {award.players?.slug ? (
                            <Link
                              href={`/${sport}/players/${award.players.slug}`}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              {award.players.name}
                            </Link>
                          ) : (
                            <span className="text-gray-300">{award.award_name || "Player"}</span>
                          )}
                          {award.players?.schools && (
                            <>
                              <span className="text-gray-500">,</span>
                              <Link
                                href={`/${sport}/schools/${award.players.schools.slug}`}
                                className="text-gray-400 hover:text-gray-300 text-xs"
                              >
                                {award.players.schools.name}
                              </Link>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Post-1969: Offense/Defense split
                  groupedAwards.map(([category, categoryAwards]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        {category.includes("Offense") ? (
                          <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                            OFFENSE
                          </span>
                        ) : category.includes("Defense") ? (
                          <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                            DEFENSE
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-gray-600 text-white text-xs font-bold rounded">
                            {category.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                        {categoryAwards.map((award) => (
                          <div
                            key={award.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="text-[#f0a500]">•</span>
                            <div className="flex-1">
                              {award.players?.slug ? (
                                <Link
                                  href={`/${sport}/players/${award.players.slug}`}
                                  className="text-blue-400 hover:text-blue-300 font-medium"
                                >
                                  {award.players.name}
                                </Link>
                              ) : (
                                <span className="text-gray-300 font-medium">
                                  {award.award_name || "Player"}
                                </span>
                              )}
                              {award.players?.schools && (
                                <div className="text-gray-400 text-xs">
                                  <Link
                                    href={`/${sport}/schools/${award.players.schools.slug}`}
                                    className="hover:text-gray-300"
                                  >
                                    {award.players.schools.name}
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </details>
          );
        })}
      </div>

      {filteredYears.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-300">No All-City selections for this decade.</p>
        </div>
      )}
    </div>
  );
}
