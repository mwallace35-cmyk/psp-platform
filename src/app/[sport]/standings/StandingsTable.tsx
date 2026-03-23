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
  const hasPointsData = data.some((s) => s.points_for !== undefined && s.points_for > 0);
  const hasLeagueRecord = data.some((s) => s.league_wins !== undefined && s.league_wins !== null);

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
        <table className="w-full text-sm text-gray-200">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900">
              <th className="px-3 py-3 text-left font-semibold text-gray-300 w-10">#</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-300">School</th>
              {hasLeagueRecord && (
                <th className="px-3 py-3 text-center font-semibold text-gray-300 w-20">
                  <span className="text-[var(--psp-gold)]">League</span>
                </th>
              )}
              <th className="px-3 py-3 text-center font-semibold text-gray-300 w-20">Overall</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-300 w-16">Win %</th>
              {hasPointsData && (
                <>
                  <th className="px-3 py-3 text-center font-semibold text-gray-300 w-14">PF</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-300 w-14">PA</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row: Standing, idx: number) => {
              const winPct = ((row.win_pct * 100).toFixed(1)) + "%";
              const leagueRecord = (row.league_wins !== undefined && row.league_wins !== null)
                ? `${row.league_wins}-${row.league_losses ?? 0}`
                : null;
              const overallRecord = `${row.wins}-${row.losses}${row.ties > 0 ? `-${row.ties}` : ''}`;

              return (
                <tr
                  key={`${row.school.slug}-${idx}`}
                  className={`border-b border-gray-800 transition-colors hover:bg-gray-800 ${
                    row.is_champion ? "bg-yellow-950/20" : idx % 2 === 0 ? "bg-gray-900/50" : ""
                  }`}
                >
                  <td className="px-3 py-3 font-bold text-[var(--psp-gold)] w-10">
                    {row.is_champion ? "🏆" : row.rank}
                  </td>

                  <td className="px-3 py-3">
                    <Link
                      href={`/${sport}/schools/${row.school.slug}`}
                      className="font-semibold text-white hover:text-[var(--psp-gold)] transition-colors"
                    >
                      {row.school.name}
                    </Link>
                    {row.is_champion && (
                      <span className="ml-2 inline-block rounded bg-[var(--psp-gold)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--psp-navy)]">
                        CHAMP
                      </span>
                    )}
                    {row.league_finish && (
                      <span className="ml-1 text-[10px] text-gray-500">{row.league_finish}</span>
                    )}
                  </td>

                  {hasLeagueRecord && (
                    <td className="px-3 py-3 text-center font-semibold text-[var(--psp-gold)]">
                      {leagueRecord || '-'}
                    </td>
                  )}

                  <td className="px-3 py-3 text-center text-white font-medium">
                    {overallRecord}
                  </td>

                  <td className="px-3 py-3 text-center text-gray-300">{winPct}</td>

                  {hasPointsData && (
                    <>
                      <td className="px-3 py-3 text-center text-gray-400">{row.points_for ?? "-"}</td>
                      <td className="px-3 py-3 text-center text-gray-400">{row.points_against ?? "-"}</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing standings for {currentLeague.season_label} · {data.length} teams
      </div>
    </div>
  );
}
