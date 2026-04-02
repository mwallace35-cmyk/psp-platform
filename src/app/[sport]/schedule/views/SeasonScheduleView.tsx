"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type {
  ScheduleGame,
  ScheduleSeason,
  ScheduleTeam,
  LeagueSchoolEntry,
} from "@/lib/data/schedule";
import {
  groupByWeek,
  groupByDay,
  LEAGUE_DISPLAY_ORDER,
  LEAGUE_COLORS,
} from "@/lib/data/schedule";
import {
  GameCard,
  WeekHeader,
  DateHeader,
  EmptyState,
} from "@/components/schedule";
import ScheduleToolbar, {
  FilterPills,
  TeamSelector,
  LeagueFilter,
} from "@/components/schedule/ScheduleToolbar";
import { SPORT_META } from "@/lib/sports";
import type { SportId } from "@/lib/sports";

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
// Component
// ============================================================================

export default function SeasonScheduleView({
  games,
  teams,
  seasons,
  leagueMap: leagueMapArr,
  sport,
  seasonLabel,
  lastSeasonWithData,
  isGameDay,
}: Props) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [leagueFilter, setLeagueFilter] = useState("all");

  // Sport metadata
  const meta = SPORT_META[sport as SportId] ?? {
    name: sport,
    emoji: "",
    color: "#6b7280",
  };
  const accentColor = meta.color;

  // Reconstruct Map from serialized array
  const leagueMap = useMemo(() => {
    const map = new Map<number, LeagueSchoolEntry>();
    for (const entry of leagueMapArr) {
      map.set(entry.schoolId, entry);
    }
    return map;
  }, [leagueMapArr]);

  // Core teams (3+ games — lower threshold for soccer/lacrosse)
  const coreTeams = useMemo(
    () => teams.filter((t) => t.gameCount >= 3),
    [teams]
  );

  // Unique leagues from the league map
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
      const lid = parseInt(leagueFilter);
      result = result.filter((g) => {
        const homeLeague = g.home_school
          ? leagueMap.get(g.home_school.id)
          : null;
        const awayLeague = g.away_school
          ? leagueMap.get(g.away_school.id)
          : null;
        return (
          homeLeague?.league_id === lid || awayLeague?.league_id === lid
        );
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

    return result;
  }, [games, selectedTeam, leagueFilter, timeFilter, leagueMap]);

  // ========== GROUPED DATA ==========
  const weekGrouped = useMemo(
    () => groupByWeek(filteredGames),
    [filteredGames]
  );

  // Clear all filters
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
        sportName={meta.name}
        sportEmoji={meta.emoji}
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
      </ScheduleToolbar>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {filteredGames.length === 0 ? (
          <EmptyState
            sport={sport}
            sportName={meta.name}
            sportEmoji={meta.emoji}
            seasonLabel={seasonLabel}
            showClearFilters
            onClearFilters={clearFilters}
          />
        ) : (
          <WeeklyView
            weekGrouped={weekGrouped}
            sport={sport}
            seasonLabel={seasonLabel}
            accentColor={accentColor}
            sportName={meta.name}
            sportEmoji={meta.emoji}
            highlightTeam={selectedTeam !== "all" ? selectedTeam : undefined}
            totalFiltered={filteredGames.length}
            totalWeeks={weekGrouped.length}
          />
        )}
      </div>
    </>
  );
}

// ============================================================================
// WEEKLY VIEW — Primary layout: games grouped by week, then by day
// ============================================================================

function WeeklyView({
  weekGrouped,
  sport,
  seasonLabel,
  accentColor,
  sportName,
  sportEmoji,
  highlightTeam,
  totalFiltered,
  totalWeeks,
}: {
  weekGrouped: ReturnType<typeof groupByWeek>;
  sport: string;
  seasonLabel: string;
  accentColor: string;
  sportName: string;
  sportEmoji: string;
  highlightTeam?: string;
  totalFiltered: number;
  totalWeeks: number;
}) {
  const currentWeekRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  // Auto-scroll to current or nearest upcoming week
  useEffect(() => {
    if (currentWeekRef.current) {
      // Small delay to let layout settle
      const timer = setTimeout(() => {
        currentWeekRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  // Find the current week index — week containing today, or the next upcoming week
  const currentWeekIndex = useMemo(() => {
    // First, try to find the week that contains today
    const todayIdx = weekGrouped.findIndex(({ weekKey }) => {
      const monday = new Date(weekKey + "T12:00:00");
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return today >= weekKey && today <= sunday.toISOString().slice(0, 10);
    });
    if (todayIdx !== -1) return todayIdx;

    // Otherwise, find the first week that starts after today (nearest upcoming)
    const nextIdx = weekGrouped.findIndex(({ weekKey }) => weekKey > today);
    if (nextIdx !== -1) return nextIdx;

    // If all weeks are in the past, highlight the last one
    return weekGrouped.length > 0 ? weekGrouped.length - 1 : -1;
  }, [weekGrouped, today]);

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500">
          <span className="font-bebas text-base tracking-wider text-[var(--psp-navy)]">
            {sportEmoji} {sportName} {seasonLabel}
          </span>
        </p>
        <p className="text-xs text-gray-400">
          {totalWeeks} week{totalWeeks !== 1 ? "s" : ""} &middot;{" "}
          {totalFiltered} game{totalFiltered !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Week sections */}
      {weekGrouped.map(({ weekLabel, weekKey, games: weekGames }, idx) => {
        const isCurrent = idx === currentWeekIndex;
        const dayGroups = groupByDay(weekGames);

        return (
          <section
            key={weekKey}
            ref={isCurrent ? currentWeekRef : undefined}
            className={`rounded-xl overflow-hidden border ${
              isCurrent
                ? "border-[var(--psp-gold)]/50 shadow-md shadow-[var(--psp-gold)]/10"
                : "border-gray-200"
            }`}
          >
            {/* Week header with accent stripe */}
            <div
              className="px-4 py-3 bg-white flex items-center gap-3"
              style={{ borderLeft: `4px solid ${accentColor}` }}
            >
              <div className="flex-1 min-w-0">
                <WeekHeader
                  weekLabel={weekLabel}
                  gameCount={weekGames.length}
                  weekNumber={idx + 1}
                />
              </div>
              {isCurrent && (
                <span className="text-[10px] font-bold bg-[var(--psp-gold)] text-[var(--psp-navy)] px-2 py-0.5 rounded-full flex-shrink-0">
                  CURRENT
                </span>
              )}
            </div>

            {/* Day sub-groups within the week */}
            <div className="bg-white px-4 pb-4">
              {dayGroups.map(({ dateLabel, dateKey, games: dayGames }) => {
                const isToday = dateKey === today;

                return (
                  <div key={dateKey}>
                    <DateHeader
                      dateLabel={dateLabel}
                      dateKey={dateKey}
                      gameCount={dayGames.length}
                      accentColor={accentColor}
                      isToday={isToday}
                    />
                    <div className="space-y-1.5">
                      {dayGames.map((game) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          sport={sport}
                          seasonLabel={seasonLabel}
                          highlightTeam={highlightTeam}
                          compact
                          showGameType={false}
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

      {/* Footer count */}
      <p className="text-center text-gray-300 text-xs pt-4">
        {totalFiltered} game{totalFiltered !== 1 ? "s" : ""} across{" "}
        {totalWeeks} week{totalWeeks !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
