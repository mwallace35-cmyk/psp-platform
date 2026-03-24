"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PositionLeader } from "@/lib/data/position-leaders";

interface Props {
  leaders: PositionLeader[];
  sport: string;
  position: string;
  positionName: string;
  sportName: string;
  sportColor: string;
}

export default function PositionLeadersView({
  leaders,
  sport,
  position,
  positionName,
  sportName,
  sportColor,
}: Props) {
  const [selectedLeague, setSelectedLeague] = useState<string>("All");

  // Get unique leagues
  const leagues = useMemo(() => {
    const unique = new Set<string | undefined>(["All"]);
    leaders.forEach((l) => {
      if (l.league) unique.add(l.league);
    });
    return Array.from(unique).filter((l) => l) as string[];
  }, [leaders]);

  // Filter by league
  const filtered = useMemo(() => {
    if (selectedLeague === "All") {
      return leaders;
    }
    return leaders.filter((l) => l.league === selectedLeague);
  }, [leaders, selectedLeague]);

  // Get stat label based on position
  const getStatLabel = (sport: string, position: string): string => {
    if (sport === "football") {
      if (position === "QB") return "Pass Yards";
      if (position === "RB") return "Rush Yards";
      if (["WR", "TE"].includes(position)) return "Rec Yards";
      return "Games Played";
    }
    if (sport === "basketball") {
      if (position === "PG") return "Assists";
      if (position === "C" || position === "PF") return "Rebounds";
      return "Points";
    }
    return "Stat";
  };

  const statLabel = getStatLabel(sport, position);

  return (
    <div className="space-y-8">
      {/* League Filter */}
      {leagues.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {leagues.map((league) => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedLeague === league
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              style={
                selectedLeague === league
                  ? { backgroundColor: sportColor, color: "white" }
                  : {}
              }
            >
              {league}
            </button>
          ))}
        </div>
      )}

      {/* Leaders Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm" aria-label="Position leaders">
          <caption className="sr-only">Position leaders</caption>
          <thead>
            <tr className="text-white" style={{ backgroundColor: sportColor }}>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Rank</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Player</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">School</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold">Seasons</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Career</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Per Season</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((leader, idx) => {
              const rank = idx + 1;
              const getMedalEmoji = (r: number) => {
                if (r === 1) return "🥇";
                if (r === 2) return "🥈";
                if (r === 3) return "🥉";
                return null;
              };

              return (
                <tr
                  key={leader.player_id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 font-bold text-gray-600">
                    {getMedalEmoji(rank) || rank}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/${sport}/players/${leader.player_slug}`}
                      className="font-semibold hover:underline text-blue-600"
                    >
                      {leader.player_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/${sport}/schools/${leader.school_slug}`}
                      className="hover:underline text-blue-600"
                    >
                      {leader.school_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {leader.career_seasons}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-lg">
                    {Math.round(leader.career_stat_value)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {leader.season_average.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="text-sm text-gray-600 border-l-4 pl-4" style={{ borderColor: sportColor }}>
        <p className="font-semibold mb-2">Legend</p>
        <p><strong>Career:</strong> Total {statLabel} across all seasons</p>
        <p><strong>Per Season:</strong> Average {statLabel} per season</p>
      </div>
    </div>
  );
}
