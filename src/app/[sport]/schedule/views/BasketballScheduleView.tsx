"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type {
  ScheduleGame,
  ScheduleSeason,
  ScheduleTeam,
  LeagueSchoolEntry,
} from "@/lib/data/schedule";
import {
  groupByDay,
  LEAGUE_DISPLAY_ORDER,
  LEAGUE_COLORS,
  formatGameTime,
  getWinnerSide,
} from "@/lib/data/schedule";
import {
  GameCard,
  DateHeader,
  EmptyState,
} from "@/components/schedule";
import ScheduleToolbar, {
  FilterPills,
  TeamSelector,
  LeagueFilter,
} from "@/components/schedule/ScheduleToolbar";

// ============================================================================
// Types
// ============================================================================

interface Props {
  games: ScheduleGame[];
  teams: ScheduleTeam[];
  seasons: ScheduleSeason[];
  leagueMap: (LeagueSchoolEntry & { schoolId: number })[];
  sport: string;
  seasonLabel: string;
  lastSeasonWithData: string | null;
  isGameDay: boolean;
}

type TimeFilter = "all" | "upcoming" | "results";

// ============================================================================
// Helpers
// ============================================================================

/** Normalize basketball game_type variants */
function normalizeGameType(gt: string | null): string {
  if (!gt) return "regular";
  const lower = gt.toLowerCase();
  if (lower === "game" || lower === "regular_season" || lower === "league") return "regular";
  if (lower === "playoff" || lower === "postseason") return "playoff";
  if (lower === "championship") return "championship";
  if (lower === "non-league") return "non-league";
  return lower;
}

// ============================================================================
// Component
// ============================================================================

export default function BasketballScheduleView({
  games,
  teams,
  leagueMap: leagueMapArr,
  sport,
  seasonLabel,
  lastSeasonWithData,
}: Props) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [selectedDateIdx, setSelectedDateIdx] = useState<number | null>(null);

  const dateStripRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Reconstruct league Map
  const leagueMap = useMemo(() => {
    const map = new Map<number, LeagueSchoolEntry>();
    for (const entry of leagueMapArr) {
      map.set(entry.schoolId, entry);
    }
    return map;
  }, [leagueMapArr]);

  // Core teams (5+ games)
  const coreTeams = useMemo(
    () => teams.filter((t) => t.gameCount >= 5),
    [teams]
  );

  // Available leagues
  const availableLeagues = useMemo(() => {
    const seen = new Map<number, { id: number; name: string; short: string }>();
    for (const entry of leagueMapArr) {
      if (!seen.has(entry.league_id)) {
        seen.set(entry.league_id, {
          id: entry.league_id,
          name: entry.league_name,
          short: entry.league_short,
        });
      }
    }
    return [...seen.values()].sort(
      (a, b) =>
        (LEAGUE_DISPLAY_ORDER[a.id] ?? 99) -
        (LEAGUE_DISPLAY_ORDER[b.id] ?? 99)
    );
  }, [leagueMapArr]);

  // ========== FILTERING ==========
  const filteredGames = useMemo(() => {
    let result = games;

    if (selectedTeam !== "all") {
      result = result.filter(
        (g) =>
          g.home_school?.slug === selectedTeam ||
          g.away_school?.slug === selectedTeam
      );
    }

    if (leagueFilter !== "all") {
      const lid = parseInt(leagueFilter);
      result = result.filter((g) => {
        const homeLeague = g.home_school ? leagueMap.get(g.home_school.id) : null;
        const awayLeague = g.away_school ? leagueMap.get(g.away_school.id) : null;
        return homeLeague?.league_id === lid || awayLeague?.league_id === lid;
      });
    }

    if (timeFilter === "upcoming") {
      const today = new Date().toISOString().slice(0, 10);
      result = result.filter(
        (g) =>
          (g.home_score === null && g.away_score === null) ||
          g.game_date >= today
      );
    } else if (timeFilter === "results") {
      result = result.filter(
        (g) => g.home_score !== null && g.away_score !== null
      );
    }

    return result;
  }, [games, selectedTeam, leagueFilter, timeFilter, leagueMap]);

  // ========== DAY GROUPS ==========
  const dayGroups = useMemo(() => groupByDay(filteredGames), [filteredGames]);

  // Find today's index
  const today = new Date().toISOString().slice(0, 10);
  const todayIdx = useMemo(
    () => dayGroups.findIndex((d) => d.dateKey === today),
    [dayGroups, today]
  );

  // Find nearest date (today, or most recent past date with games)
  const nearestIdx = useMemo(() => {
    if (todayIdx >= 0) return todayIdx;
    // Find the last date before today
    for (let i = dayGroups.length - 1; i >= 0; i--) {
      if (dayGroups[i].dateKey <= today) return i;
    }
    return 0;
  }, [dayGroups, todayIdx, today]);

  // Initialize selected date
  useEffect(() => {
    if (selectedDateIdx === null && dayGroups.length > 0) {
      setSelectedDateIdx(nearestIdx);
    }
  }, [nearestIdx, dayGroups.length, selectedDateIdx]);

  // Scroll date strip to selected date
  useEffect(() => {
    if (selectedDateIdx !== null && dateStripRef.current) {
      const strip = dateStripRef.current;
      const items = strip.querySelectorAll("[data-date-idx]");
      const target = items[selectedDateIdx] as HTMLElement | undefined;
      if (target) {
        const stripRect = strip.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const scrollLeft =
          target.offsetLeft - stripRect.width / 2 + targetRect.width / 2;
        strip.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [selectedDateIdx]);

  // Scroll to selected day in content
  const scrollToDay = useCallback((dateKey: string) => {
    const el = dayRefs.current.get(dateKey);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleDateClick = (idx: number) => {
    setSelectedDateIdx(idx);
    scrollToDay(dayGroups[idx].dateKey);
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedTeam("all");
    setLeagueFilter("all");
    setTimeFilter("all");
  };

  // ========== EMPTY STATE ==========
  if (games.length === 0) {
    return (
      <EmptyState
        sport={sport}
        sportName="Basketball"
        sportEmoji="basketball"
        seasonLabel={seasonLabel}
        lastSeasonLabel={lastSeasonWithData ?? undefined}
      />
    );
  }

  return (
    <>
      {/* Toolbar */}
      <ScheduleToolbar>
        {/* Time filter */}
        <FilterPills
          options={[
            { value: "all", label: "All" },
            { value: "upcoming", label: "Upcoming" },
            { value: "results", label: "Results" },
          ]}
          selected={timeFilter}
          onChange={(v) => setTimeFilter(v as TimeFilter)}
        />

        {/* League filter */}
        {availableLeagues.length > 1 && (
          <LeagueFilter
            leagues={availableLeagues}
            selected={leagueFilter}
            onChange={setLeagueFilter}
          />
        )}

        {/* Team selector */}
        <TeamSelector
          teams={coreTeams}
          selected={selectedTeam}
          onChange={setSelectedTeam}
        />

        {/* Game count */}
        <span className="text-xs text-gray-400 ml-auto hidden sm:inline">
          {filteredGames.length} games across {dayGroups.length} days
        </span>
      </ScheduleToolbar>

      {/* Date strip — horizontal scrollable date navigation */}
      {dayGroups.length > 0 && (
        <div className="bg-white border-b border-gray-100 overflow-hidden">
          <div
            ref={dateStripRef}
            className="flex overflow-x-auto scrollbar-hide gap-0.5 px-4 py-2 max-w-6xl mx-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {dayGroups.map((day, idx) => {
              const d = new Date(day.dateKey + "T12:00:00");
              const isSelected = idx === selectedDateIdx;
              const isToday = day.dateKey === today;
              const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
              const dateNum = d.getDate();
              const month = d.toLocaleDateString("en-US", { month: "short" });

              return (
                <button
                  key={day.dateKey}
                  data-date-idx={idx}
                  onClick={() => handleDateClick(idx)}
                  className={`flex-shrink-0 flex flex-col items-center px-3 py-1.5 rounded-lg transition min-w-[52px] ${
                    isSelected
                      ? "bg-[var(--psp-navy)] text-white"
                      : isToday
                      ? "bg-[var(--psp-gold)]/10 text-[var(--psp-navy)]"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}
                >
                  <span className="text-[9px] font-medium uppercase">{weekday}</span>
                  <span className={`text-sm font-bold ${isSelected ? "text-white" : ""}`}>
                    {dateNum}
                  </span>
                  <span className="text-[9px]">{month}</span>
                  {/* Game count dot */}
                  <div className="flex gap-0.5 mt-0.5">
                    {day.games.length <= 5 ? (
                      [...Array(Math.min(day.games.length, 5))].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? "bg-[var(--psp-gold)]" : "bg-gray-300"
                          }`}
                        />
                      ))
                    ) : (
                      <span
                        className={`text-[8px] font-bold ${
                          isSelected ? "text-[var(--psp-gold)]" : "text-gray-300"
                        }`}
                      >
                        {day.games.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content — Daily scoreboard */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {filteredGames.length === 0 ? (
          <EmptyState
            sport={sport}
            sportName="Basketball"
            sportEmoji="basketball"
            seasonLabel={seasonLabel}
            showClearFilters
            onClearFilters={clearFilters}
          />
        ) : (
          <div className="space-y-2">
            {dayGroups.map((day) => {
              const isToday = day.dateKey === today;

              // Sub-group by league within each day
              const leagueGrouped = groupDayByLeague(day.games, leagueMap);

              return (
                <div
                  key={day.dateKey}
                  ref={(el) => {
                    if (el) dayRefs.current.set(day.dateKey, el);
                  }}
                  className="scroll-mt-32"
                >
                  <DateHeader
                    dateLabel={day.dateLabel}
                    dateKey={day.dateKey}
                    gameCount={day.games.length}
                    accentColor="#3b82f6"
                    isToday={isToday}
                  />

                  {/* Games as compact scoreboard rows */}
                  {leagueGrouped.length === 1 && !leagueGrouped[0].league_name ? (
                    // No league grouping needed — just list games
                    <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
                      {day.games.map((game) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          sport={sport}
                          seasonLabel={seasonLabel}
                          compact
                          showDate={false}
                        />
                      ))}
                    </div>
                  ) : (
                    // League sub-groups
                    <div className="space-y-2">
                      {leagueGrouped.map((lg) => (
                        <div key={lg.league_name || "other"}>
                          {lg.league_name && (
                            <div className="flex items-center gap-2 mb-1 mt-2">
                              <div
                                className="w-1 h-3.5 rounded-full"
                                style={{
                                  backgroundColor: LEAGUE_COLORS[lg.league_id ?? 0] ?? "#6b7280",
                                }}
                              />
                              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                {lg.league_name}
                              </span>
                            </div>
                          )}
                          <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
                            {lg.games.map((game) => (
                              <GameCard
                                key={game.id}
                                game={game}
                                sport={sport}
                                seasonLabel={seasonLabel}
                                compact
                                showDate={false}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <p className="text-center text-gray-300 text-xs pt-4">
              {filteredGames.length} game{filteredGames.length !== 1 ? "s" : ""} across{" "}
              {dayGroups.length} day{dayGroups.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================================
// Group a day's games by league
// ============================================================================

function groupDayByLeague(
  games: ScheduleGame[],
  leagueMap: Map<number, LeagueSchoolEntry>
): { league_id: number | null; league_name: string | null; games: ScheduleGame[] }[] {
  if (games.length <= 3) {
    // Too few games to bother with league sub-grouping
    return [{ league_id: null, league_name: null, games }];
  }

  const groups = new Map<
    string,
    { league_id: number | null; league_name: string | null; games: ScheduleGame[] }
  >();

  for (const g of games) {
    const homeLeague = g.home_school ? leagueMap.get(g.home_school.id) : null;
    const awayLeague = g.away_school ? leagueMap.get(g.away_school.id) : null;

    // If both teams share a league, group under that league
    let key = "other";
    let league_id: number | null = null;
    let league_name: string | null = null;

    const norm = normalizeGameType(g.game_type);
    if (norm === "playoff" || norm === "championship") {
      key = "playoff";
      league_id = -1;
      league_name = "Playoffs";
    } else if (homeLeague && awayLeague && homeLeague.league_id === awayLeague.league_id) {
      key = String(homeLeague.league_id);
      league_id = homeLeague.league_id;
      league_name = homeLeague.league_name;
    } else {
      key = "non-league";
      league_id = 0;
      league_name = "Non-League";
    }

    if (!groups.has(key)) {
      groups.set(key, { league_id, league_name, games: [] });
    }
    groups.get(key)!.games.push(g);
  }

  return [...groups.values()].sort(
    (a, b) =>
      (LEAGUE_DISPLAY_ORDER[a.league_id ?? 99] ?? 99) -
      (LEAGUE_DISPLAY_ORDER[b.league_id ?? 99] ?? 99)
  );
}
