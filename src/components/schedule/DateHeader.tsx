"use client";

interface Props {
  dateLabel: string;
  dateKey: string;
  gameCount: number;
  /** Optional: sport accent color for the left indicator */
  accentColor?: string;
  /** Whether this date is "today" */
  isToday?: boolean;
}

/**
 * Day-level grouping header for basketball/baseball daily views.
 */
export default function DateHeader({
  dateLabel,
  gameCount,
  accentColor,
  isToday = false,
}: Props) {
  return (
    <div
      className={`flex items-center gap-3 py-2 mb-2 mt-4 first:mt-0 border-b ${
        isToday
          ? "border-[var(--psp-gold)]/40 bg-[var(--psp-gold)]/5 -mx-3 px-3 rounded-t-lg"
          : "border-gray-100"
      }`}
      id={`date-${dateLabel.replace(/\s/g, "-").toLowerCase()}`}
    >
      {accentColor && (
        <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
      )}
      <h3
        className={`text-sm font-semibold ${
          isToday ? "text-[var(--psp-navy)]" : "text-gray-600"
        }`}
      >
        {dateLabel}
      </h3>
      {isToday && (
        <span className="text-[10px] font-bold bg-[var(--psp-gold)] text-[var(--psp-navy)] px-2 py-0.5 rounded-full">
          TODAY
        </span>
      )}
      <span className="text-[10px] text-gray-400 ml-auto">
        {gameCount} game{gameCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
