"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ScheduleGame, LeagueSchoolEntry } from "@/lib/data/schedule";
import {
  getGameLeagueContext,
  formatGameTime,
  getWinnerSide,
  LEAGUE_COLORS,
  LEAGUE_DISPLAY_ORDER,
} from "@/lib/data/schedule";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";
import SportIcon from "@/components/ui/SportIcon";

interface Props {
  games: ScheduleGame[];
  leagueMap: Map<number, LeagueSchoolEntry>;
  seasonLabel: string;
  onExit: () => void;
}

/**
 * "Friday Night Lights" Game Day dashboard.
 * Full-width dark mode view showing all football games for today.
 */
export default function FootballGameDay({
  games,
  leagueMap,
  seasonLabel,
  onExit,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const dayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Filter to today's games only
  const todayGames = useMemo(
    () => games.filter((g) => g.game_date === today),
    [games, today]
  );

  // Group by league
  const leagueGroups = useMemo(() => {
    const groups = new Map<
      string,
      { league_id: number | null; league_name: string; games: ScheduleGame[] }
    >();

    for (const g of todayGames) {
      const ctx = getGameLeagueContext(g, leagueMap);
      const key = String(ctx.league_id ?? "other");
      if (!groups.has(key)) {
        groups.set(key, {
          league_id: ctx.league_id,
          league_name: ctx.league_name,
          games: [],
        });
      }
      groups.get(key)!.games.push(g);
    }

    return [...groups.values()].sort(
      (a, b) =>
        (LEAGUE_DISPLAY_ORDER[a.league_id ?? 99] ?? 99) -
        (LEAGUE_DISPLAY_ORDER[b.league_id ?? 99] ?? 99)
    );
  }, [todayGames, leagueMap]);

  // Stats
  const totalGames = todayGames.length;
  const completedGames = todayGames.filter(
    (g) => g.home_score !== null
  ).length;
  const upcomingGames = totalGames - completedGames;

  return (
    <div className="min-h-screen bg-[#060e1a]">
      {/* Game Day Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--psp-gold)]/10 via-transparent to-[var(--psp-gold)]/10" />
        <div className="max-w-7xl mx-auto px-4 py-8 relative">
          {/* Exit button */}
          <button
            onClick={onExit}
            className="absolute right-4 top-4 text-gray-500 hover:text-white text-sm transition flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Exit Game Day
          </button>

          {/* Title */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-12 h-0.5 bg-[var(--psp-gold)]" />
              <span className="text-[var(--psp-gold)] text-xs font-bold tracking-[0.3em] uppercase">
                Game Day
              </span>
              <div className="w-12 h-0.5 bg-[var(--psp-gold)]" />
            </div>
            <h1 className="font-bebas text-5xl sm:text-6xl text-white tracking-wider mb-2">
              Friday Night Lights
            </h1>
            <p className="text-gray-400 text-sm">{dayName}</p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-4">
              <div>
                <span className="text-[var(--psp-gold)] font-bebas text-3xl">
                  {totalGames}
                </span>
                <span className="text-gray-500 text-xs ml-1">Games</span>
              </div>
              {completedGames > 0 && (
                <div>
                  <span className="text-emerald-400 font-bebas text-3xl">
                    {completedGames}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">Final</span>
                </div>
              )}
              {upcomingGames > 0 && (
                <div>
                  <span className="text-blue-400 font-bebas text-3xl">
                    {upcomingGames}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">Upcoming</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gold border line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent" />
      </div>

      {/* Games grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {totalGames === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-4"><SportIcon sport="football" size="md" /></span>
            <p className="text-gray-500 text-lg">No games scheduled today.</p>
            <button
              onClick={onExit}
              className="mt-4 text-[var(--psp-gold)] text-sm hover:underline"
            >
              Back to full schedule
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {leagueGroups.map((group) => {
              const accentColor =
                LEAGUE_COLORS[group.league_id ?? 0] ?? "#6b7280";
              return (
                <section key={group.league_name}>
                  {/* League header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-1.5 h-6 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <h2 className="font-bebas text-xl text-white tracking-wider">
                      {group.league_name}
                    </h2>
                    <span className="text-xs text-gray-500">
                      {group.games.length} game
                      {group.games.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex-1 h-px bg-gray-800" />
                  </div>

                  {/* Games grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.games.map((game) => (
                      <GameDayCard
                        key={game.id}
                        game={game}
                        seasonLabel={seasonLabel}
                        accentColor={accentColor}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Game Day Card
// ============================================================================

function GameDayCard({
  game,
  seasonLabel,
  accentColor,
}: {
  game: ScheduleGame;
  seasonLabel: string;
  accentColor: string;
}) {
  const winner = getWinnerSide(game);
  const isComplete = game.home_score !== null && game.away_score !== null;
  const homeWon = winner === "home";
  const awayWon = winner === "away";

  const homeName = game.home_school
    ? getSchoolDisplayName(game.home_school)
    : "TBD";
  const awayName = game.away_school
    ? getSchoolDisplayName(game.away_school)
    : "TBD";
  const homeColor = game.home_school?.colors?.primary || "#374151";
  const awayColor = game.away_school?.colors?.primary || "#374151";

  return (
    <div className="bg-[#0f1a2e] rounded-xl border border-gray-800 hover:border-gray-700 transition overflow-hidden">
      {/* Status bar */}
      <div
        className="h-0.5"
        style={{
          backgroundColor: isComplete ? accentColor : "transparent",
          background: isComplete
            ? accentColor
            : `linear-gradient(90deg, ${accentColor}40, transparent)`,
        }}
      />

      <div className="p-4">
        {/* Status badge */}
        <div className="flex items-center justify-between mb-3">
          {isComplete ? (
            <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
              Final
            </span>
          ) : (
            <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {formatGameTime(game.game_time) || "TBD"}
            </span>
          )}
          {game.venue && (
            <span className="text-[10px] text-gray-600 truncate max-w-[120px]">
              {game.venue}
            </span>
          )}
        </div>

        {/* Matchup */}
        <div className="space-y-2">
          {/* Away team */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bebas text-xs flex-shrink-0"
              style={{ backgroundColor: awayColor }}
            >
              {(game.away_school?.name ?? "?")
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              {game.away_school ? (
                <Link
                  href={`/football/teams/${game.away_school.slug}/${seasonLabel}`}
                  className={`text-sm font-medium transition truncate block ${
                    awayWon ? "text-white font-bold" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {awayName}
                </Link>
              ) : (
                <span className="text-sm text-gray-500">TBD</span>
              )}
            </div>
            {isComplete && (
              <span
                className={`font-bebas text-2xl tabular-nums ${
                  awayWon ? "text-white" : "text-gray-600"
                }`}
              >
                {game.away_score}
              </span>
            )}
          </div>

          {/* Home team */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bebas text-xs flex-shrink-0"
              style={{ backgroundColor: homeColor }}
            >
              {(game.home_school?.name ?? "?")
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              {game.home_school ? (
                <Link
                  href={`/football/teams/${game.home_school.slug}/${seasonLabel}`}
                  className={`text-sm font-medium transition truncate block ${
                    homeWon ? "text-white font-bold" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {homeName}
                </Link>
              ) : (
                <span className="text-sm text-gray-500">TBD</span>
              )}
            </div>
            {isComplete && (
              <span
                className={`font-bebas text-2xl tabular-nums ${
                  homeWon ? "text-white" : "text-gray-600"
                }`}
              >
                {game.home_score}
              </span>
            )}
          </div>
        </div>

        {/* Box score link */}
        {game.has_box_score && (
          <div className="mt-3 pt-2 border-t border-gray-800">
            <Link
              href={`/football/games/${game.id}`}
              className="text-[10px] font-bold text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition tracking-wider uppercase flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Box Score
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
