"use client";

import Link from "next/link";
import SportIcon from "@/components/ui/SportIcon";

interface Props {
  sport: string;
  sportName: string;
  sportEmoji: string;
  /** The season being viewed */
  seasonLabel: string;
  /** The most recent season with data (for redirect suggestion) */
  lastSeasonLabel?: string;
  /** Show "clear filters" button */
  showClearFilters?: boolean;
  onClearFilters?: () => void;
}

/**
 * Empty state for schedule pages.
 * Handles: off-season, no data for season, no games match filters.
 */
export default function EmptyState({
  sport,
  sportName,
  sportEmoji,
  seasonLabel,
  lastSeasonLabel,
  showClearFilters = false,
  onClearFilters,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-lg mx-auto mt-8">
      <div className="flex justify-center mb-4"><SportIcon sport={sport} size="lg" /></div>

      {lastSeasonLabel && lastSeasonLabel !== seasonLabel ? (
        // Off-season: current season has no games
        <>
          <h3 className="font-bebas text-xl text-[var(--psp-navy)] tracking-wider mb-2">
            Season hasn&apos;t started yet
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            The {seasonLabel} {sportName} season doesn&apos;t have any games scheduled yet.
          </p>
          <Link
            href={`/${sport}/schedule?season=${lastSeasonLabel}`}
            className="inline-flex items-center gap-2 bg-[var(--psp-navy)] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[var(--psp-navy-mid)] transition"
          >
            View {lastSeasonLabel} Results
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </>
      ) : showClearFilters ? (
        // No games match current filters
        <>
          <h3 className="font-bebas text-xl text-[var(--psp-navy)] tracking-wider mb-2">
            No games match your filters
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Try adjusting your filters to see more games.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="text-[var(--psp-blue)] text-sm font-medium hover:underline"
            >
              Clear all filters
            </button>
          )}
        </>
      ) : (
        // No data for this season at all
        <>
          <h3 className="font-bebas text-xl text-[var(--psp-navy)] tracking-wider mb-2">
            No schedule data
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            We don&apos;t have schedule data for {sportName} in {seasonLabel}.
          </p>
          <Link
            href={`/${sport}`}
            className="text-[var(--psp-blue)] text-sm font-medium hover:underline"
          >
            Back to {sportName} Hub
          </Link>
        </>
      )}
    </div>
  );
}
