'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import type { LeagueStandings, Standing } from "@/lib/data";

// Extract the base league name (remove " — Division Name")
function getBaseLeague(name: string): string {
  return name.replace(/\s*—\s*.+$/, '').trim();
}

// Extract the division name (after " — ")
function getDivision(name: string): string | null {
  const match = name.match(/—\s*(.+)$/);
  return match ? match[1].trim() : null;
}

interface LeagueGroup {
  baseLeague: string;
  leagueId: number;
  divisions: { name: string | null; standings: LeagueStandings }[];
}

function StandingsSection({ data, sport, hasLeagueRecord, hasPointsData, leagueName, seasonLabel }: {
  data: Standing[];
  sport: string;
  hasLeagueRecord: boolean;
  hasPointsData: boolean;
  leagueName?: string;
  seasonLabel?: string;
}) {
  const ariaLabel = leagueName && seasonLabel
    ? `${leagueName} standings for ${seasonLabel}`
    : leagueName
      ? `${leagueName} standings`
      : "League standings";
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] shadow-lg">
      <table className="w-full text-sm text-gray-200" aria-label={ariaLabel}>
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
                </td>
                {hasLeagueRecord && (
                  <td className="px-3 py-3 text-center font-semibold text-[var(--psp-gold)]">
                    {leagueRecord || '-'}
                  </td>
                )}
                <td className="px-3 py-3 text-center text-white font-medium">{overallRecord}</td>
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
  );
}

export default function StandingsTable({ standings, sport }: { standings: LeagueStandings[]; sport: string }) {
  // Group standings by base league, with divisions nested inside
  const leagueGroups = useMemo(() => {
    const groupMap = new Map<string, LeagueGroup>();

    for (const lg of standings) {
      const base = getBaseLeague(lg.league_name);
      const div = getDivision(lg.league_name);

      if (!groupMap.has(base)) {
        groupMap.set(base, {
          baseLeague: base,
          leagueId: lg.league_id,
          divisions: [],
        });
      }
      groupMap.get(base)!.divisions.push({ name: div, standings: lg });
    }

    // Sort divisions within each league alphabetically
    for (const group of groupMap.values()) {
      group.divisions.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return Array.from(groupMap.values());
  }, [standings]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentGroup = leagueGroups[selectedIdx];

  if (!currentGroup) {
    return (
      <div className="rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-6 text-center text-gray-400">
        No standings data available
      </div>
    );
  }

  // Check data capabilities across all divisions in current group
  const allStandings = currentGroup.divisions.flatMap(d => d.standings.standings);
  const hasPointsData = allStandings.some((s) => s.points_for !== undefined && s.points_for > 0);
  const hasLeagueRecord = allStandings.some((s) => s.league_wins !== undefined && s.league_wins !== null);
  const hasDivisions = currentGroup.divisions.some(d => d.name !== null);

  return (
    <div>
      {/* League Tabs — only show base league names (3 tabs, not 9) */}
      {leagueGroups.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {leagueGroups.map((group, idx) => (
            <button
              key={group.baseLeague}
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-lg px-4 py-2 font-semibold text-sm transition-colors ${
                idx === selectedIdx
                  ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                  : "bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
              }`}
            >
              {group.baseLeague}
            </button>
          ))}
        </div>
      )}

      {/* Divisions within the selected league */}
      {hasDivisions ? (
        <div className="space-y-6">
          {currentGroup.divisions.map((div) => (
            <div key={div.name || 'main'}>
              {div.name && (
                <h2 className="psp-h3 text-white mb-3">
                  {div.name}
                </h2>
              )}
              <StandingsSection
                data={div.standings.standings}
                sport={sport}
                hasLeagueRecord={hasLeagueRecord}
                hasPointsData={hasPointsData}
                leagueName={div.name ? `${currentGroup.baseLeague} — ${div.name}` : currentGroup.baseLeague}
                seasonLabel={currentGroup.divisions[0]?.standings.season_label}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Single table when no divisions */
        <StandingsSection
          data={currentGroup.divisions[0]?.standings.standings || []}
          sport={sport}
          hasLeagueRecord={hasLeagueRecord}
          hasPointsData={hasPointsData}
          leagueName={currentGroup.baseLeague}
          seasonLabel={currentGroup.divisions[0]?.standings.season_label}
        />
      )}

      <div className="mt-4 text-sm text-gray-500">
        {currentGroup.divisions[0]?.standings.season_label} · {allStandings.length} teams
      </div>
    </div>
  );
}
