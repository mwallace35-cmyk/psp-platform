"use client";

import Link from "next/link";

interface Props {
  gameId: number;
  sport: string;
  compact?: boolean;
}

/**
 * Small badge/icon indicating a box score is available.
 * Links to the game detail page.
 */
export default function BoxScoreIndicator({ gameId, sport, compact = false }: Props) {
  if (compact) {
    return (
      <Link
        href={`/${sport}/games/${gameId}`}
        className="text-[10px] font-bold text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition"
        title="Box score available"
      >
        BOX
      </Link>
    );
  }

  return (
    <Link
      href={`/${sport}/games/${gameId}`}
      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--psp-blue)] hover:text-blue-700 transition"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Box Score
    </Link>
  );
}
