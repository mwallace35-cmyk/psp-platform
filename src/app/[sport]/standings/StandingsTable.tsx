'use client';

import { useState } from "react";
import Link from "next/link";
import type { LeagueStandings, Standing } from "@/lib/data";

export default function StandingsTable({ standings, sport }: { standings: LeagueStandings[]; sport: string }) {
  const [selectedLeagueIdx, setSelectedLeagueIdx] = useState(0);
  const currentLeague = standings[selectedLeagueIdx];

  if (!currentLeague) {
    return (
      <div className="rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-6 text-center text-gray-400">
        No standings data available
      </div>
    );
  }

  const data = currentLeague.standings;
  const hasPointsData = data.some((s) => s.points_for !== undefined);

  return (
    <div>
      {/* League Tabs */}
      {standings.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {standings.map((league, idx) => (
            <button
              key={`${league.league_id}-${idx}`}
              onClick={() => setSelectedLeagueIdx(idx)}
              className={`rounded px-4 py-2 font-semibold text-sm transition-colors ${
                idx === selectedLeagueIdx
                  ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {league.league_name}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] shadow-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900">
              <th className="px-4 py-3 text-left font-semibold text-gray-300 w-12">#</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-300 flex-1">School</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-300 w-12">W</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-300 w-12">L</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-300 w-12">T</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-300 w-20">Win %</th>
              {hasPointsData && (
                <>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300 w-16">PF</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300 w-16">PA</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row: Standing, idx: number) => {
              const winPct = ((row.win_pct * 100).toFixed(1)) + "%";
              return (
                <tr
                  key={`${row.school.slug}-${idx}`}
                  className={`border-b border-gray-800 transition-colors hover:bg-gray-800 ${
                    row.is_champion ? "bg-yellow-950 bg-opacity-20" : idx % 2 === 0 ? "bg-gray-900" : ""
                  }`}
                >
                  {/* Rank */}
                  <td className="px-4 py-3 font-bold text-[var(--psp-gold)] w-12">
                    {row.is_champion ? "🏆" : row.rank}
                  </td>

                  {/* School */}
                  <td className="px-4 py-3 flex-1">
                    <Link
                      href={`/${sport}/schools/${row.school.slug}`}
                      className="font-semibold text-white hover:text-[var(--psp-gold)]"
                    >
                      {row.school.name}
                    </Link>
                    {row.is_champion && (
                      <span className="ml-2 inline-block rounded bg-[var(--psp-gold)] px-2 py-0.5 text-xs font-bold text-[var(--psp-navy)]">
                        Champion
                      </span>
                    )}
                  </td>

                  {/* W-L-T */}
                  <td className="px-4 py-3 text-white w-12">{row.wins}</td>
                  <td className="px-4 py-3 text-white w-12">{row.losses}</td>
                  <td className="px-4 py-3 text-white w-12">{row.ties}</td>

                  {/* Win % */}
                  <td className="px-4 py-3 font-semibold text-white w-20">{winPct}</td>

                  {/* PF/PA if available */}
                  {hasPointsData && (
                    <>
                      <td className="px-4 py-3 text-gray-300 w-16">{row.points_for ?? "-"}</td>
                      <td className="px-4 py-3 text-gray-300 w-16">{row.points_against ?? "-"}</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p>Showing standings for {currentLeague.season_label}</p>
      </div>
    </div>
  );
}
