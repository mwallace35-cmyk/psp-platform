"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
type GameTypeFilter = "all" | "league" | "playoff" | "city-title";

interface MonthTab {
  key: string; // "2026-03"
  label: string; // "Mar"
  fullLabel: string; // "March 2026"
  gameCount: number;
}

// ============================================================================
// Constants
// ============================================================================

const BASEBALL_ACCENT = "#dc2626";

const MONTH_ABBR: Record<number, string> = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const MONTH_FULL: Record<number, string> = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

// ============================================================================
// Helpers
// ============================================================================

/** Normalize baseball game_type variants */
function normalizeGameType(gt: string | null): string {
  if (!gt) return "regular";
  const lower = gt.toLowerCase().trim();
  if (lower === "game" || lower === "regular_season" || lower === "league" || lower === "regular")
    return "regular";
  if (lower === "playoff" || lower === "postseason") return "playoff";
  if (lower === "city title" || lower === "city_title" || lower === "championship")
    return "city-title";
  return lower;
}

/** Extract month key (YYYY-MM) from a game date string */
function getMonthKey(gameDate: string): string {
  return gameDate.slice(0, 7);
}

/** Derive unique month tabs from games, sorted chronologically */
function deriveMonthTabs(games: ScheduleGame[]): MonthTab[] {
  const monthMap = new Map<string, number>();

  for (const g of games) {
    const key = getMonthKey(g.game_date);
    monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
  }

  return [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => {
      const [yearStr, monthStr] = key.split("-");
      const monthNum = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      return {
        key,
        label: MONTH_ABBR[monthNum] ?? monthStr,
        fullLabel: `${MONTH_FULL[monthNum] ?? monthStr} ${year}`,
        gameCount: count,
      };
    });
}

/** Find the best default month: closest to today, or latest month if season is over */
function getDefaultMonth(tabs: MonthTab[]): string {
  if (tabs.length === 0) return "";

  const todayKey = new Date().toISOString().slice(0, 7);

  // Exact match for current month
  const exact = tabs.find((t) => t.key === todayKey);
  if (exact) return exact.key;

  // Find the closest month after today (upcoming games)
  const upcoming = tabs.find((t) => t.key > todayKey);
  if (upcoming) return upcoming.key;

  // All months are in the past -- use the latest (most recent games)
  return tabs[tabs.length - 1].key;
}

// ============================================================================
// Component
// ============================================================================

export default function BaseballScheduleView({
  games,
  teams,
  leagueMap: leagueMapArr,
  sport,
  seasonLabel,
  lastSeasonWithData,
}: Props) {
  // ---------- State ----------
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [gameTypeFilter, setGameTypeFilter] = useState<GameTypeFilter>("all");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [activeMonth, setActiveMonth] = useState<string>("");

  const dayRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ---------- Derived data ----------

  // Reconstruct league Map from serialized array
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

  // ---------- Filtering ----------

  const filteredGames = useMemo(() => {
    let result = games;

    // Team filter
    if (selectedTeam !== "all") {
      result = result.filter(
        (g) =>
          g.home_school?.slug === selectedTeam ||
          g.away_school?.slug === selectedTeam
      );
    }

    // League filter
    if (leagueFilter !== "all") {
      const lid = parseInt(leagueFilter, 10);
      result = result.filter((g) => {
        const homeLeague = g.home_school
          ? leagueMap.get(g.home_school.id)
          : null;
        const awayLeague = g.away_school
          ? leagueMap.get(g.away_school.id)
          : null;
        return homeLeague?.league_id === lid || awayLeague?.league_id === lid;
      });
    }

    // Time filter
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

    // Game type filter
    if (gameTypeFilter !== "all") {
      result = result.filter((g) => {
        const norm = normalizeGameType(g.game_type);
        switch (gameTypeFilter) {
          case "league":
            return norm === "regular";
          case "playoff":
            return norm === "playoff";
          case "city-title":
            return norm === "city-title";
          default:
            return true;
        }
      });
    }

    return result;
  }, [games, selectedTeam, leagueFilter, timeFilter, gameTypeFilter, leagueMap]);

  // ---------- Month tabs ----------

  const monthTabs = useMemo(() => deriveMonthTabs(filteredGames), [filteredGames]);

  // Initialize active month
  useEffect(() => {
    if (monthTabs.length > 0) {
      // If current activeMonth is still valid, keep it
      if (activeMonth && monthTabs.some((t) => t.key === activeMonth)) return;
      setActiveMonth(getDefaultMonth(monthTabs));
    } else {
      setActiveMonth("");
    }
  }, [monthTabs, activeMonth]);

  // Games for the active month
  const monthGames = useMemo(
    () =>
      activeMonth
        ? filteredGames.filter((g) => getMonthKey(g.game_date) === activeMonth)
        : filteredGames,
    [filteredGames, activeMonth]
  );

  // Day groups for the active month
  const dayGroups = useMemo(() => groupByDay(monthGames), [monthGames]);

  // Active month label
  const activeMonthLabel = useMemo(
    () => monthTabs.find((t) => t.key === activeMonth)?.fullLabel ?? "",
    [monthTabs, activeMonth]
  );

  // ---------- Handlers ----------

  const clearFilters = useCallback(() => {
    setSelectedTeam("all");
    setLeagueFilter("all");
    setTimeFilter("all");
    setGameTypeFilter("all");
  }, []);

  const scrollToDay = useCallback((dateKey: string) => {
    const el = dayRefs.current.get(dateKey);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // ---------- Empty state ----------

  if (games.length === 0) {
    return (
      <EmptyState
        sport={sport}
        sportName="Baseball"
        sportEmoji="&#9918;"
        seasonLabel={seasonLabel}
        lastSeasonLabel={lastSeasonWithData ?? undefined}
      />
    );
  }

  // ---------- Active filter count (for summary) ----------
  const activeFilterCount =
    (selectedTeam !== "all" ? 1 : 0) +
    (leagueFilter !== "all" ? 1 : 0) +
    (timeFilter !== "all" ? 1 : 0) +
    (gameTypeFilter !== "all" ? 1 : 0);

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

        {/* Game type filter */}
        <FilterPills
          options={[
            { value: "all", label: "All Types" },
            { value: "league", label: "League" },
            { value: "playoff", label: "Playoff" },
            { value: "city-title", label: "City Title" },
          ]}
          selected={gameTypeFilter}
          onChange={(v) => setGameTypeFilter(v as GameTypeFilter)}
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
          {filteredGames.length} game{filteredGames.length !== 1 ? "s" : ""}{" "}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-[var(--psp-blue)] hover:underline ml-1"
            >
              Clear filters
            </button>
          )}
        </span>
      </ScheduleToolbar>

      {/* Month navigation tabs */}
      {monthTabs.length > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto py-2">
              {monthTabs.map((tab) => {
                const isActive = tab.key === activeMonth;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveMonth(tab.key)}
                    className={`
                      flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg
                      text-sm font-semibold transition-all
                      ${
                        isActive
                          ? "text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }
                    `}
                    style={
                      isActive
                        ? { backgroundColor: BASEBALL_ACCENT }
                        : undefined
                    }
                  >
                    <span className="font-bebas text-base tracking-wide">
                      {tab.label}
                    </span>
                    <span
                      className={`
                        text-[10px] font-medium rounded-full px-1.5 py-0.5
                        ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-400"
                        }
                      `}
                    >
                      {tab.gameCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content -- Monthly calendar view */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Month heading */}
        {activeMonthLabel && (
          <h2 className="font-bebas text-2xl tracking-wide text-[var(--psp-navy)] mb-4">
            {activeMonthLabel}
            <span className="text-sm font-sans font-normal text-gray-400 ml-3">
              {monthGames.length} game{monthGames.length !== 1 ? "s" : ""} across{" "}
              {dayGroups.length} day{dayGroups.length !== 1 ? "s" : ""}
            </span>
          </h2>
        )}

        {filteredGames.length === 0 ? (
          <EmptyState
            sport={sport}
            sportName="Baseball"
            sportEmoji="&#9918;"
            seasonLabel={seasonLabel}
            showClearFilters
            onClearFilters={clearFilters}
          />
        ) : dayGroups.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No games in {activeMonthLabel}</p>
            <p className="text-sm mt-1">Try selecting a different month above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dayGroups.map((day) => {
              const today = new Date().toISOString().slice(0, 10);
              const isToday = day.dateKey === today;

              // Sub-group by league when 4+ games in a day
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
                    accentColor={BASEBALL_ACCENT}
                    isToday={isToday}
                  />

                  {/* Games -- league sub-grouped or flat list */}
                  {leagueGrouped.length === 1 && !leagueGrouped[0].league_name ? (
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
                    <div className="space-y-2">
                      {leagueGrouped.map((lg) => (
                        <div key={lg.league_name || "other"}>
                          {lg.league_name && (
                            <div className="flex items-center gap-2 mb-1 mt-2">
                              <div
                                className="w-1 h-3.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    LEAGUE_COLORS[lg.league_id ?? 0] ?? "#6b7280",
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
              {monthGames.length} game{monthGames.length !== 1 ? "s" : ""} in{" "}
              {activeMonthLabel}
              {activeFilterCount > 0 && (
                <span>
                  {" "}
                  ({filteredGames.length} total across all months)
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================================
// Group a day's games by league (only when 4+ games in a day)
// ============================================================================

function groupDayByLeague(
  games: ScheduleGame[],
  leagueMap: Map<number, LeagueSchoolEntry>
): {
  league_id: number | null;
  league_name: string | null;
  games: ScheduleGame[];
}[] {
  if (games.length < 4) {
    // Too few games to bother with league sub-grouping
    return [{ league_id: null, league_name: null, games }];
  }

  const groups = new Map<
    string,
    {
      league_id: number | null;
      league_name: string | null;
      games: ScheduleGame[];
    }
  >();

  for (const g of games) {
    const homeLeague = g.home_school
      ? leagueMap.get(g.home_school.id)
      : null;
    const awayLeague = g.away_school
      ? leagueMap.get(g.away_school.id)
      : null;

    let key = "other";
    let league_id: number | null = null;
    let league_name: string | null = null;

    const norm = normalizeGameType(g.game_type);
    if (norm === "playoff" || norm === "city-title") {
      key = norm === "city-title" ? "city-title" : "playoff";
      league_id = -1;
      league_name = norm === "city-title" ? "City Title" : "Playoffs";
    } else if (
      homeLeague &&
      awayLeague &&
      homeLeague.league_id === awayLeague.league_id
    ) {
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
