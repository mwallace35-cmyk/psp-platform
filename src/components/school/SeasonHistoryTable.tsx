"use client";

import { useState } from "react";
import Link from "next/link";

interface TeamSeason {
  id: number;
  wins?: number;
  losses?: number;
  ties?: number;
  points_for?: number;
  points_against?: number;
  playoff_result?: string;
  seasons?: { label: string };
  coaches?: { name: string; slug: string } | null;
}

interface SeasonHistoryTableProps {
  teamSeasons: TeamSeason[];
  championships: { seasons?: { label: string } }[];
  sport: string;
  slug: string;
  sportColor: string;
}

export default function SeasonHistoryTable({
  teamSeasons,
  championships,
  sport,
  slug,
  sportColor,
}: SeasonHistoryTableProps) {
  const [expanded, setExpanded] = useState(false);
  const INITIAL_COUNT = 5;

  // Sort newest first so collapsed view shows recent seasons
  const sorted = [...teamSeasons].sort((a, b) => {
    const aYear = parseInt(a.seasons?.label?.substring(0, 4) || "0");
    const bYear = parseInt(b.seasons?.label?.substring(0, 4) || "0");
    return bYear - aYear;
  });

  const hasMore = sorted.length > INITIAL_COUNT;
  const visible = expanded ? sorted : sorted.slice(0, INITIAL_COUNT);

  // Hide columns that are entirely empty across all seasons
  const hasAnyPlayoff = teamSeasons.some((ts) => ts.playoff_result);
  const hasAnyCoach = teamSeasons.some((ts) => ts.coaches);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Season</th>
              <th className="text-center">W</th>
              <th className="text-center">L</th>
              <th className="text-center">T</th>
              <th className="text-center">PF</th>
              <th className="text-center">PA</th>
              {hasAnyPlayoff && <th>Playoff</th>}
              {hasAnyCoach && <th>Coach</th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((ts) => {
              const hasChampionship = championships.some(
                (c) => c.seasons?.label === ts.seasons?.label
              );
              return (
                <tr key={ts.id} style={{ fontWeight: hasChampionship ? "600" : "normal" }}>
                  <td className="font-medium">
                    {ts.seasons?.label ? (
                      <>
                        {hasChampionship && (
                          <span className="mr-1.5" aria-label="Championship">
                            🏆
                          </span>
                        )}
                        <Link
                          href={`/${sport}/teams/${slug}/${ts.seasons.label}`}
                          className="hover:underline"
                          style={{ color: "var(--psp-blue, #3b82f6)" }}
                        >
                          {ts.seasons.label}
                        </Link>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="text-center">{ts.wins ?? "—"}</td>
                  <td className="text-center">{ts.losses ?? "—"}</td>
                  <td className="text-center">{ts.ties ?? "—"}</td>
                  <td className="text-center">{ts.points_for ?? "—"}</td>
                  <td className="text-center">{ts.points_against ?? "—"}</td>
                  {hasAnyPlayoff && (
                    <td className="text-xs">{ts.playoff_result || "—"}</td>
                  )}
                  {hasAnyCoach && (
                    <td className="text-xs">
                      {ts.coaches ? (
                        <Link
                          href={`/${sport}/coaches/${ts.coaches.slug}`}
                          className="hover:underline"
                          style={{ color: "var(--psp-gold)" }}
                        >
                          {ts.coaches.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-2.5 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
          style={{
            background: expanded ? "var(--psp-gray-100, #f3f4f6)" : `${sportColor}12`,
            color: expanded ? "var(--psp-gray-500)" : sportColor,
            border: `1px solid ${expanded ? "var(--psp-gray-200)" : `${sportColor}30`}`,
          }}
        >
          {expanded
            ? "Show recent seasons only"
            : `Show all ${teamSeasons.length} seasons`}
        </button>
      )}
    </div>
  );
}
