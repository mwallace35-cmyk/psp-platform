"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GreatestSeason } from "@/lib/data/greatest-seasons";

interface Props {
  seasons: GreatestSeason[];
  sport: string;
  sportName: string;
  sportColor: string;
  categories: string[];
}

export default function GreatestSeasonsView({
  seasons,
  sport,
  sportName,
  sportColor,
  categories,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter seasons by category
  const filteredSeasons = useMemo(() => {
    if (selectedCategory === "All") {
      return seasons;
    }
    return seasons.filter((s) => s.stat_category === selectedCategory);
  }, [seasons, selectedCategory]);

  // Group by category for table display
  const grouped = useMemo(() => {
    const groups: Record<string, GreatestSeason[]> = {};
    for (const season of filteredSeasons) {
      if (!groups[season.stat_category]) {
        groups[season.stat_category] = [];
      }
      groups[season.stat_category].push(season);
    }
    return groups;
  }, [filteredSeasons]);

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-yellow-500 text-black"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            style={
              selectedCategory === cat
                ? { backgroundColor: sportColor, color: "white" }
                : {}
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Seasons by Category */}
      {Object.entries(grouped).map(([category, categorySeasons]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-2xl font-bebas text-gray-900">{category}</h2>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm" aria-label="Greatest seasons">
              <thead>
                <tr
                  className="text-white"
                  style={{ backgroundColor: sportColor }}
                >
                  <th className="px-4 py-3 text-left font-semibold">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold">Player</th>
                  <th className="px-4 py-3 text-left font-semibold">School</th>
                  <th className="px-4 py-3 text-left font-semibold">Season</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    {category} Stat
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Dominance
                  </th>
                </tr>
              </thead>
              <tbody>
                {categorySeasons.slice(0, 25).map((season, idx) => {
                  const rank = idx + 1;
                  const getMedalColor = (r: number) => {
                    if (r === 1) return "🥇";
                    if (r === 2) return "🥈";
                    if (r === 3) return "🥉";
                    return `${r}`;
                  };

                  return (
                    <tr
                      key={`${season.player_id}-${season.season_id}`}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 font-bold text-gray-600">
                        {getMedalColor(rank)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/${sport}/players/${season.player_slug}`}
                          className="font-semibold hover:underline text-blue-600"
                        >
                          {season.player_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/${sport}/schools/${season.school_slug}`}
                          className="hover:underline text-blue-600"
                        >
                          {season.school_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {season.season_label}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {Math.round(season.stat_value)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-6 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${season.dominance_score}%`,
                                backgroundColor: sportColor,
                              }}
                            />
                          </div>
                          <span className="font-bold text-gray-900 w-10 text-right">
                            {Math.round(season.dominance_score)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
