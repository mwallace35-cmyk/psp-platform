"use client";

import Link from "next/link";
import type { ScheduleGame } from "@/lib/data/schedule";
import { getWinnerSide } from "@/lib/data/schedule";

interface Props {
  game: ScheduleGame;
  sport: string;
  /** Show W/L/T badge next to the score */
  showBadge?: boolean;
  /** Which team's perspective for the badge (home or away slug) */
  perspectiveSlug?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

/**
 * Renders game score with winner bolded, optional W/L badge,
 * and links to box score when available.
 */
export default function ScoreDisplay({
  game,
  sport,
  showBadge = false,
  perspectiveSlug,
  size = "md",
}: Props) {
  const winner = getWinnerSide(game);
  const isComplete = game.home_score !== null && game.away_score !== null;

  if (!isComplete) {
    // Upcoming game — show time
    const time = game.game_time;
    if (!time) return <span className="text-gray-400 text-sm italic">TBD</span>;
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const display =
      hour === 0 ? `12:${m} AM` :
      hour < 12 ? `${hour}:${m} AM` :
      hour === 12 ? `12:${m} PM` :
      `${hour - 12}:${m} PM`;
    return <span className="text-gray-500 text-sm font-medium">{display}</span>;
  }

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  }[size];

  const homeWon = winner === "home";
  const awayWon = winner === "away";

  // Determine W/L/T badge from perspective
  let badge: "W" | "L" | "T" | null = null;
  if (showBadge && perspectiveSlug && winner) {
    const isHomePerspective = game.home_school?.slug === perspectiveSlug;
    if (winner === "tie") {
      badge = "T";
    } else if (isHomePerspective) {
      badge = homeWon ? "W" : "L";
    } else {
      badge = awayWon ? "W" : "L";
    }
  }

  const badgeColors = {
    W: "bg-emerald-100 text-emerald-700",
    L: "bg-red-100 text-red-700",
    T: "bg-gray-100 text-gray-500",
  };

  const scoreContent = (
    <span className={`font-mono tabular-nums ${sizeClasses} flex items-center gap-1.5`}>
      <span className={homeWon ? "font-bold text-[var(--psp-navy)]" : "text-gray-400"}>
        {game.home_score}
      </span>
      <span className="text-gray-300 mx-0.5">-</span>
      <span className={awayWon ? "font-bold text-[var(--psp-navy)]" : "text-gray-400"}>
        {game.away_score}
      </span>
      {badge && (
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeColors[badge]} ml-1`}
        >
          {badge}
        </span>
      )}
    </span>
  );

  // If box score available, wrap in link
  if (game.has_box_score) {
    return (
      <Link
        href={`/${sport}/games/${game.id}`}
        className="hover:bg-[var(--psp-gold)]/10 rounded px-1 -mx-1 transition inline-flex items-center gap-1 group"
        title="View box score"
      >
        {scoreContent}
        <svg
          className="w-3.5 h-3.5 text-gray-300 group-hover:text-[var(--psp-gold)] transition"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  }

  return scoreContent;
}
