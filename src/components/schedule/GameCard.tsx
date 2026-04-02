"use client";

import Link from "next/link";
import type { ScheduleGame } from "@/lib/data/schedule";
import { formatGameDate, formatGameTime, getWinnerSide } from "@/lib/data/schedule";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";
import BoxScoreIndicator from "./BoxScoreIndicator";

interface Props {
  game: ScheduleGame;
  sport: string;
  seasonLabel: string;
  /** Highlight a specific team (slug) in the matchup */
  highlightTeam?: string;
  /** Show the date (useful in league-grouped views where date isn't in a header) */
  showDate?: boolean;
  /** Compact mode for dense views like basketball daily */
  compact?: boolean;
  /** Show game type badge */
  showGameType?: boolean;
}

const GAME_TYPE_BADGES: Record<string, { label: string; cls: string }> = {
  scrimmage: { label: "Scrimmage", cls: "bg-gray-100 text-gray-500" },
  "non-league": { label: "Non-League", cls: "bg-blue-50 text-blue-600" },
  regular: { label: "League", cls: "bg-emerald-50 text-emerald-600" },
  league: { label: "League", cls: "bg-emerald-50 text-emerald-600" },
  playoff: { label: "Playoff", cls: "bg-amber-50 text-amber-700" },
  championship: { label: "Championship", cls: "bg-[var(--psp-gold)]/20 text-[var(--psp-navy)] font-bold" },
};

export default function GameCard({
  game,
  sport,
  seasonLabel,
  highlightTeam,
  showDate = true,
  compact = false,
  showGameType = true,
}: Props) {
  const winner = getWinnerSide(game);
  const isComplete = game.home_score !== null && game.away_score !== null;
  const homeWon = winner === "home";
  const awayWon = winner === "away";
  const typeInfo = game.game_type ? GAME_TYPE_BADGES[game.game_type] : null;

  const homeName = game.home_school
    ? getSchoolDisplayName(game.home_school)
    : "TBD";
  const awayName = game.away_school
    ? getSchoolDisplayName(game.away_school)
    : "TBD";

  const homeColor = game.home_school?.colors?.primary || "#6b7280";
  const awayColor = game.away_school?.colors?.primary || "#6b7280";

  const isHomeHighlighted = highlightTeam && game.home_school?.slug === highlightTeam;
  const isAwayHighlighted = highlightTeam && game.away_school?.slug === highlightTeam;

  if (compact) {
    // Compact: single-line row for dense views (basketball daily)
    return (
      <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 transition rounded-lg group">
        {/* Away team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: awayColor }} />
          {game.away_school ? (
            <Link
              href={`/${sport}/teams/${game.away_school.slug}/${seasonLabel}`}
              className={`text-sm truncate transition ${
                isAwayHighlighted ? "font-bold text-[var(--psp-navy)]" :
                awayWon ? "font-semibold text-[var(--psp-navy)]" :
                isComplete ? "text-gray-400" : "text-gray-700 hover:text-[var(--psp-navy)]"
              }`}
            >
              {awayName}
            </Link>
          ) : (
            <span className="text-sm text-gray-400">{awayName}</span>
          )}
        </div>

        {/* Score / Time */}
        <div className="text-center min-w-[60px]">
          {isComplete ? (
            <span className="font-mono tabular-nums text-sm">
              <span className={awayWon ? "font-bold" : "text-gray-400"}>{game.away_score}</span>
              <span className="text-gray-300 mx-1">-</span>
              <span className={homeWon ? "font-bold" : "text-gray-400"}>{game.home_score}</span>
            </span>
          ) : (
            <span className="text-xs text-gray-400">{formatGameTime(game.game_time) || "TBD"}</span>
          )}
        </div>

        {/* @ */}
        <span className="text-[10px] text-gray-300 font-medium">@</span>

        {/* Home team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: homeColor }} />
          {game.home_school ? (
            <Link
              href={`/${sport}/teams/${game.home_school.slug}/${seasonLabel}`}
              className={`text-sm truncate transition ${
                isHomeHighlighted ? "font-bold text-[var(--psp-navy)]" :
                homeWon ? "font-semibold text-[var(--psp-navy)]" :
                isComplete ? "text-gray-400" : "text-gray-700 hover:text-[var(--psp-navy)]"
              }`}
            >
              {homeName}
            </Link>
          ) : (
            <span className="text-sm text-gray-400">{homeName}</span>
          )}
        </div>

        {/* Box score indicator */}
        {game.has_box_score && (
          <BoxScoreIndicator gameId={game.id} sport={sport} compact />
        )}
      </div>
    );
  }

  // Full card layout
  return (
    <div
      className={`bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition overflow-hidden ${
        game.game_type === "championship" ? "ring-1 ring-[var(--psp-gold)]/30" : ""
      }`}
    >
      <div className="flex items-stretch">
        {/* Left color accent — winner indicator */}
        <div
          className="w-1 flex-shrink-0"
          style={{
            backgroundColor: isComplete
              ? homeWon
                ? homeColor
                : awayWon
                ? awayColor
                : "#d1d5db"
              : "#e5e7eb",
          }}
        />

        <div className="flex-1 px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Date + Game type */}
            <div className="flex-shrink-0 w-[90px]">
              {showDate && (
                <p className="text-xs font-medium text-gray-500">
                  {formatGameDate(game.game_date)}
                </p>
              )}
              {showGameType && typeInfo && (
                <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 ${typeInfo.cls}`}>
                  {typeInfo.label}
                </span>
              )}
            </div>

            {/* Matchup */}
            <div className="flex-1 min-w-0">
              {/* Away team row */}
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: awayColor }}
                />
                {game.away_school ? (
                  <Link
                    href={`/${sport}/teams/${game.away_school.slug}/${seasonLabel}`}
                    className={`text-sm truncate transition ${
                      isAwayHighlighted
                        ? "font-bold text-[var(--psp-navy)] underline decoration-[var(--psp-gold)]"
                        : awayWon
                        ? "font-bold text-[var(--psp-navy)]"
                        : isComplete
                        ? "text-gray-400"
                        : "text-gray-700 hover:text-[var(--psp-navy)]"
                    }`}
                  >
                    {awayName}
                  </Link>
                ) : (
                  <span className="text-sm text-gray-400">{awayName}</span>
                )}
                {isComplete && (
                  <span className={`ml-auto font-mono tabular-nums text-sm ${awayWon ? "font-bold text-[var(--psp-navy)]" : "text-gray-400"}`}>
                    {game.away_score}
                  </span>
                )}
                {awayWon && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1 rounded">
                    W
                  </span>
                )}
              </div>

              {/* Home team row */}
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: homeColor }}
                />
                {game.home_school ? (
                  <Link
                    href={`/${sport}/teams/${game.home_school.slug}/${seasonLabel}`}
                    className={`text-sm truncate transition ${
                      isHomeHighlighted
                        ? "font-bold text-[var(--psp-navy)] underline decoration-[var(--psp-gold)]"
                        : homeWon
                        ? "font-bold text-[var(--psp-navy)]"
                        : isComplete
                        ? "text-gray-400"
                        : "text-gray-700 hover:text-[var(--psp-navy)]"
                    }`}
                  >
                    {homeName}
                  </Link>
                ) : (
                  <span className="text-sm text-gray-400">{homeName}</span>
                )}
                {isComplete && (
                  <span className={`ml-auto font-mono tabular-nums text-sm ${homeWon ? "font-bold text-[var(--psp-navy)]" : "text-gray-400"}`}>
                    {game.home_score}
                  </span>
                )}
                {homeWon && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1 rounded">
                    W
                  </span>
                )}
              </div>
            </div>

            {/* Right: Time or Box Score */}
            <div className="flex-shrink-0 text-right ml-3">
              {isComplete ? (
                game.has_box_score ? (
                  <BoxScoreIndicator gameId={game.id} sport={sport} />
                ) : (
                  <span className="text-[10px] text-gray-300 uppercase font-medium">Final</span>
                )
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {formatGameTime(game.game_time) || "TBD"}
                  </p>
                  {game.venue && (
                    <p className="text-[10px] text-gray-400 truncate max-w-[100px]">
                      {game.venue}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
