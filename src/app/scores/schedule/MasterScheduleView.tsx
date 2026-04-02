"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ScheduleGame } from "@/lib/data/schedule";
import { groupByDay, formatGameTime, getWinnerSide } from "@/lib/data/schedule";
import { SPORT_META } from "@/lib/sports";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";

interface Props {
  games: ScheduleGame[];
  selectedSport: string;
}

/**
 * Client component for the Master Schedule — "This Week in Philly Sports."
 * Games grouped by day, then by sport within each day.
 */
export default function MasterScheduleView({ games, selectedSport }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  // Group by day
  const dayGroups = useMemo(() => groupByDay(games), [games]);

  return (
    <div className="space-y-6">
      {dayGroups.map((day) => {
        const isToday = day.dateKey === today;

        // Sub-group by sport
        const sportGroups = groupBySport(day.games);

        return (
          <section key={day.dateKey}>
            {/* Day header */}
            <div
              className={`flex items-center gap-3 py-2 mb-3 border-b ${
                isToday
                  ? "border-[var(--psp-gold)]/40"
                  : "border-gray-200"
              }`}
            >
              <h2
                className={`font-bebas text-lg tracking-wider ${
                  isToday ? "text-[var(--psp-navy)]" : "text-gray-600"
                }`}
              >
                {day.dateLabel}
              </h2>
              {isToday && (
                <span className="text-[10px] font-bold bg-[var(--psp-gold)] text-[var(--psp-navy)] px-2 py-0.5 rounded-full">
                  TODAY
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {day.games.length} game{day.games.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Sport sections */}
            <div className="space-y-4">
              {sportGroups.map((sg) => {
                const meta =
                  SPORT_META[sg.sportSlug as keyof typeof SPORT_META];
                const color = SPORT_COLORS_HEX[sg.sportSlug] || "#6b7280";

                return (
                  <div key={sg.sportSlug}>
                    {/* Sport header (only if multiple sports this day) */}
                    {sportGroups.length > 1 && (
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-1 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-semibold text-gray-500">
                          {meta?.emoji} {meta?.name || sg.sportSlug}
                        </span>
                        <span className="text-[10px] text-gray-300">
                          {sg.games.length} game
                          {sg.games.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex-1 h-px bg-gray-100" />
                        <Link
                          href={`/${sg.sportSlug}/schedule`}
                          className="text-[10px] text-[var(--psp-blue)] font-medium hover:underline"
                        >
                          Full Schedule
                        </Link>
                      </div>
                    )}

                    {/* Games */}
                    <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                      {sg.games.map((game) => (
                        <MasterGameRow
                          key={game.id}
                          game={game}
                          sportSlug={sg.sportSlug}
                          sportColor={color}
                          showSportBadge={sportGroups.length === 1}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <p className="text-center text-gray-300 text-xs pt-2">
        {games.length} game{games.length !== 1 ? "s" : ""} this week
      </p>
    </div>
  );
}

// ============================================================================
// Game Row
// ============================================================================

function MasterGameRow({
  game,
  sportSlug,
  sportColor,
  showSportBadge,
}: {
  game: ScheduleGame;
  sportSlug: string;
  sportColor: string;
  showSportBadge: boolean;
}) {
  const winner = getWinnerSide(game);
  const isComplete = game.home_score !== null && game.away_score !== null;
  const homeWon = winner === "home";
  const awayWon = winner === "away";
  const meta = SPORT_META[sportSlug as keyof typeof SPORT_META];

  const homeName = game.home_school
    ? getSchoolDisplayName(game.home_school)
    : "TBD";
  const awayName = game.away_school
    ? getSchoolDisplayName(game.away_school)
    : "TBD";

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition">
      {/* Sport color bar */}
      <div
        className="w-1 h-8 rounded-full flex-shrink-0"
        style={{ backgroundColor: sportColor }}
      />

      {/* Sport badge (when single-sport day) */}
      {showSportBadge && (
        <span className="text-xs flex-shrink-0 hidden sm:inline" title={meta?.name}>
          {meta?.emoji}
        </span>
      )}

      {/* Away team */}
      <div className="flex-1 min-w-0">
        {game.away_school ? (
          <Link
            href={`/${sportSlug}/teams/${game.away_school.slug}`}
            className={`text-sm truncate block transition ${
              awayWon
                ? "font-bold text-[var(--psp-navy)]"
                : isComplete
                ? "text-gray-400"
                : "text-gray-700 hover:text-[var(--psp-navy)]"
            }`}
          >
            {awayName}
          </Link>
        ) : (
          <span className="text-sm text-gray-400">TBD</span>
        )}
      </div>

      {/* Score or time */}
      <div className="text-center min-w-[70px] flex-shrink-0">
        {isComplete ? (
          <span className="font-mono tabular-nums text-sm">
            <span className={awayWon ? "font-bold text-[var(--psp-navy)]" : "text-gray-400"}>
              {game.away_score}
            </span>
            <span className="text-gray-300 mx-1">-</span>
            <span className={homeWon ? "font-bold text-[var(--psp-navy)]" : "text-gray-400"}>
              {game.home_score}
            </span>
          </span>
        ) : (
          <span className="text-xs text-gray-400 font-medium">
            {formatGameTime(game.game_time) || "TBD"}
          </span>
        )}
      </div>

      {/* @ */}
      <span className="text-[10px] text-gray-300 font-medium flex-shrink-0">@</span>

      {/* Home team */}
      <div className="flex-1 min-w-0">
        {game.home_school ? (
          <Link
            href={`/${sportSlug}/teams/${game.home_school.slug}`}
            className={`text-sm truncate block transition ${
              homeWon
                ? "font-bold text-[var(--psp-navy)]"
                : isComplete
                ? "text-gray-400"
                : "text-gray-700 hover:text-[var(--psp-navy)]"
            }`}
          >
            {homeName}
          </Link>
        ) : (
          <span className="text-sm text-gray-400">TBD</span>
        )}
      </div>

      {/* Box score / Final indicator */}
      <div className="flex-shrink-0 w-[50px] text-right">
        {isComplete ? (
          game.has_box_score ? (
            <Link
              href={`/${sportSlug}/games/${game.id}`}
              className="text-[10px] font-bold text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition"
            >
              BOX
            </Link>
          ) : (
            <span className="text-[10px] text-gray-300 font-medium">Final</span>
          )
        ) : (
          game.venue && (
            <span className="text-[9px] text-gray-300 truncate block">
              {game.venue}
            </span>
          )
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Group games by sport
// ============================================================================

function groupBySport(
  games: ScheduleGame[]
): { sportSlug: string; games: ScheduleGame[] }[] {
  const map = new Map<string, ScheduleGame[]>();
  const order: string[] = [];

  // Sport display order
  const SPORT_ORDER: Record<string, number> = {
    football: 0,
    basketball: 1,
    baseball: 2,
    soccer: 3,
    lacrosse: 4,
    "track-field": 5,
    wrestling: 6,
  };

  for (const g of games) {
    const sid = (g.sport_id as string) || "unknown";
    if (!map.has(sid)) {
      map.set(sid, []);
      order.push(sid);
    }
    map.get(sid)!.push(g);
  }

  return order
    .sort((a, b) => (SPORT_ORDER[a] ?? 99) - (SPORT_ORDER[b] ?? 99))
    .map((sid) => ({ sportSlug: sid, games: map.get(sid)! }));
}
