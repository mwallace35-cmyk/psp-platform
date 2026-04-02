"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { ScheduleSeason } from "@/lib/data/schedule";

interface Props {
  seasons: ScheduleSeason[];
  currentSeason: string;
  /** Additional info shown next to the dropdown */
  gameCount?: number;
}

/**
 * Season dropdown with prev/next arrows for schedule pages.
 * Updates URL search params (?season=2024-25) without full page reload.
 */
export default function ScheduleSeasonSelector({
  seasons,
  currentSeason,
  gameCount,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentIndex = seasons.findIndex((s) => s.label === currentSeason);
  const hasPrev = currentIndex < seasons.length - 1; // seasons are desc-ordered
  const hasNext = currentIndex > 0;

  const navigateToSeason = (label: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", label);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Prev arrow (older season) */}
      <button
        onClick={() => hasPrev && navigateToSeason(seasons[currentIndex + 1].label)}
        disabled={!hasPrev}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${
          hasPrev
            ? "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            : "text-gray-600 cursor-not-allowed"
        }`}
        aria-label="Previous season"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Season dropdown */}
      <select
        value={currentSeason}
        onChange={(e) => navigateToSeason(e.target.value)}
        className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-[var(--psp-gold)]/50 focus:border-[var(--psp-gold)] appearance-none pr-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
          backgroundSize: "16px",
        }}
      >
        {seasons.map((s) => (
          <option key={s.label} value={s.label} className="bg-[var(--psp-navy)] text-white">
            {s.label} ({s.game_count} games)
          </option>
        ))}
      </select>

      {/* Next arrow (newer season) */}
      <button
        onClick={() => hasNext && navigateToSeason(seasons[currentIndex - 1].label)}
        disabled={!hasNext}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${
          hasNext
            ? "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            : "text-gray-600 cursor-not-allowed"
        }`}
        aria-label="Next season"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Game count badge */}
      {gameCount !== undefined && (
        <span className="text-xs text-gray-400 ml-2 hidden sm:inline">
          {gameCount} games this season
        </span>
      )}
    </div>
  );
}
