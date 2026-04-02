"use client";

import Link from "next/link";
import type {
  ScheduleGame,
  ScheduleSeason,
  ScheduleTeam,
  LeagueSchoolEntry,
} from "@/lib/data/schedule";
import { EmptyState } from "@/components/schedule";

// ============================================================================
// Types
// ============================================================================

interface Props {
  games: ScheduleGame[];
  teams: ScheduleTeam[];
  seasons: ScheduleSeason[];
  leagueMap: (LeagueSchoolEntry & { schoolId: number })[];
  sport: string;
  seasonLabel: string;
  lastSeasonWithData: string | null;
  isGameDay: boolean;
}

// ============================================================================
// Component
// ============================================================================

export default function TrackFieldScheduleView({
  games,
  teams,
  seasons,
  leagueMap,
  sport,
  seasonLabel,
  lastSeasonWithData,
  isGameDay,
}: Props) {
  /* If there happen to be games, fall back to EmptyState */
  if (games.length > 0) {
    return (
      <EmptyState
        sport={sport}
        sportName="Track &amp; Field"
        sportEmoji="\u{1F3C3}"
        seasonLabel={seasonLabel}
        lastSeasonLabel={lastSeasonWithData ?? undefined}
      />
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-lg w-full p-10 text-center">
        {/* Accent bar */}
        <div
          className="mx-auto mb-6 h-1 w-16 rounded-full"
          style={{ backgroundColor: "#7c3aed" }}
        />

        {/* Emoji */}
        <span className="text-5xl block mb-4" aria-hidden="true">
          {"\u{1F3C3}"}
        </span>

        {/* Heading */}
        <h2
          className="font-bebas text-2xl tracking-wider mb-3"
          style={{ color: "#7c3aed" }}
        >
          Track &amp; Field &mdash; Coming Soon
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Track &amp; Field meet schedule is coming soon. Meet results, event
          times, and distances will appear here.
        </p>

        {/* Future concept pill */}
        <span
          className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-6"
          style={{ backgroundColor: "#7c3aed15", color: "#7c3aed" }}
        >
          Meets &amp; event results
        </span>

        {/* Navigation links */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
          <Link
            href={`/${sport}`}
            className="text-sm font-medium hover:underline"
            style={{ color: "#7c3aed" }}
          >
            &larr; Track &amp; Field Hub
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/scores"
            className="text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline"
          >
            All Scores
          </Link>
        </div>
      </div>
    </div>
  );
}
