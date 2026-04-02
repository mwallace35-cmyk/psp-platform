"use client";

import { LEAGUE_COLORS } from "@/lib/data/schedule";

interface Props {
  leagueName: string;
  leagueId: number | null;
  division?: string | null;
  gameCount: number;
  /** Render as a sub-section (division) vs top-level (league) */
  level?: "league" | "division";
}

/**
 * Section header for league/division groups in the schedule.
 * Uses league-specific accent colors.
 */
export default function LeagueGroupHeader({
  leagueName,
  leagueId,
  division,
  gameCount,
  level = "league",
}: Props) {
  const accentColor = LEAGUE_COLORS[leagueId ?? 0] ?? "#6b7280";

  if (level === "division") {
    return (
      <div className="flex items-center gap-2 py-2 mt-3 mb-2">
        <div className="w-3 h-0.5 rounded" style={{ backgroundColor: accentColor }} />
        <h3 className="text-sm font-semibold text-gray-600">
          {division ?? "General"}
        </h3>
        <span className="text-[10px] text-gray-400 ml-1">
          {gameCount} game{gameCount !== 1 ? "s" : ""}
        </span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="mb-4 mt-6 first:mt-0">
      <div
        className="flex items-center gap-3 pb-2 border-b-2"
        style={{ borderColor: `${accentColor}40` }}
      >
        <div
          className="w-1.5 h-6 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <h2 className="font-bebas text-xl tracking-wider text-[var(--psp-navy)]">
          {leagueName}
        </h2>
        <span className="text-xs text-gray-400 ml-auto">
          {gameCount} game{gameCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
