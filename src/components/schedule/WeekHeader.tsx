"use client";

interface Props {
  weekLabel: string;
  gameCount: number;
  /** Optional week number (e.g., "Week 3") */
  weekNumber?: number;
}

/**
 * Week-level grouping header for football and other weekly-cadence sports.
 */
export default function WeekHeader({ weekLabel, gameCount, weekNumber }: Props) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-[var(--psp-gold)]/30">
      <h2 className="font-bebas text-lg tracking-wider text-[var(--psp-navy)]">
        {weekNumber !== undefined && (
          <span className="text-[var(--psp-gold)] mr-1">Week {weekNumber}</span>
        )}
        {weekLabel}
      </h2>
      <span className="text-xs text-gray-400 ml-auto">
        {gameCount} game{gameCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
