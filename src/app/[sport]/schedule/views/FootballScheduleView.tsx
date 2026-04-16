"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import type {
  ScheduleGame,
  ScheduleSeason,
  ScheduleTeam,
  LeagueSchoolEntry,
} from "@/lib/data/schedule";
import {
  groupByWeek,
  groupByLeague,
  LEAGUE_DISPLAY_ORDER,
} from "@/lib/data/schedule";
import {
  GameCard,
  LeagueGroupHeader,
  WeekHeader,
  EmptyState,
} from "@/components/schedule";
import ScheduleToolbar, {
  ViewToggle,
  FilterPills,
  TeamSelector,
  LeagueFilter,
} from "@/components/schedule/ScheduleToolbar";
import FootballGameDay from "./FootballGameDay";

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

type ViewMode = "league" | "week" | "team";
type TimeFilter = "all" | "upcoming" | "results";
type GameTypeFilter = "all" | "league" | "playoff" | "scrimmage" | "non-league";

// ============================================================================
// Component
// ============================================================================

export default function FootballScheduleView({
  games,
  teams,
  seasons,
  leagueMap: leagueMapArr,
  sport,
  seasonLabel,
  lastSeasonWithData,
  isGameDay,
}: Props) {
  const [view, setView] = useState<ViewMode>("league");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [gameTypeFilter, setGameTypeFilter] = useState<GameTypeFilter>("all");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [showGameDay, setShowGameDay] = useState(isGameDay);

  // Reconstruct Map from serialized array
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

    // Game type filter
    if (gameTypeFilter !== "all") {
      if (gameTypeFilter === "league") {
        result = result.filter(
          (g) =>
            !g.game_type ||
            g.game_type === "regular" ||
            g.game_type === "league"
        );
      } else if (gameTypeFilter === "playoff") {
        result = result.filter(
          (g) =>
            g.game_type === "playoff" || g.game_type === "championship"
        );
      } else {
        result = result.filter((g) => g.game_type === gameTypeFilter);
      }
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
  }, [games, selectedTeam, leagueFilter, gameTypeFilter, timeFilter, leagueMap]);

  // ========== GROUPED DATA ==========
  const leagueGrouped = useMemo(
    () => groupByLeague(filteredGames, leagueMap),
    [filteredGames, leagueMap]
  );

  const weekGrouped = useMemo(
    () => groupByWeek(filteredGames),
    [filteredGames]
  );

  // Team view data
  const teamGrouped = useMemo(() => {
    return coreTeams
      .map((team) => {
        const teamGames = filteredGames.filter(
          (g) =>
            g.home_school?.slug === team.slug ||
            g.away_school?.slug === team.slug
        );
        return { team, games: teamGames };
      })
      .filter((t) => t.games.length > 0);
  }, [coreTeams, filteredGames]);

  // Check for Game Day eligibility
  const gameDayEligible = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const month = today.getMonth();
    // Football season: Aug (7) through Dec (11), Fridays (5) or Saturdays (6)
    return (
      (dayOfWeek === 5 || dayOfWeek === 6) &&
      month >= 7 &&
      month <= 11
    );
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setSelectedTeam("all");
    setLeagueFilter("all");
    setGameTypeFilter("all");
    setTimeFilter("all");
  };

  // ========== GAME DAY MODE ==========
  if (showGameDay) {
    return (
      <FootballGameDay
        games={games}
        leagueMap={leagueMap}
        seasonLabel={seasonLabel}
        onExit={() => setShowGameDay(false)}
      />
    );
  }

  // ========== EMPTY STATE ==========
  if (games.length === 0) {
    return (
      <EmptyState
        sport={sport}
        sportName="Football"
        sportEmoji="football"
        seasonLabel={seasonLabel}
        lastSeasonLabel={lastSeasonWithData ?? undefined}
      />
    );
  }

  return (
    <>
      {/* Toolbar */}
      <ScheduleToolbar>
        {/* View toggle */}
        <ViewToggle
          options={[
            { value: "league", label: "By League" },
            { value: "week", label: "By Week" },
            { value: "team", label: "By Team" },
          ]}
          selected={view}
          onChange={(v) => setView(v as ViewMode)}
        />

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

        {/* League filter (in week and team views) */}
        {view !== "league" && availableLeagues.length > 1 && (
          <LeagueFilter
            leagues={availableLeagues}
            selected={leagueFilter}
            onChange={setLeagueFilter}
          />
        )}

        {/* Team selector (in week and league views) */}
        {view !== "team" && (
          <TeamSelector
            teams={coreTeams}
            selected={selectedTeam}
            onChange={setSelectedTeam}
          />
        )}

        {/* Game type filter */}
        <FilterPills
          options={[
            { value: "all", label: "All Types" },
            { value: "league", label: "League" },
            { value: "playoff", label: "Playoff" },
            { value: "non-league", label: "Non-League" },
          ]}
          selected={gameTypeFilter}
          onChange={(v) => setGameTypeFilter(v as GameTypeFilter)}
          className="ml-auto"
        />

        {/* Game Day button */}
        {gameDayEligible && (
          <button
            onClick={() => setShowGameDay(true)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[var(--psp-gold)] text-[var(--psp-navy)] hover:bg-[var(--psp-gold-light)] transition animate-pulse hover:animate-none"
          >
            GAME DAY
          </button>
        )}
      </ScheduleToolbar>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {filteredGames.length === 0 ? (
          <EmptyState
            sport={sport}
            sportName="Football"
            sportEmoji="football"
            seasonLabel={seasonLabel}
            showClearFilters
            onClearFilters={clearFilters}
          />
        ) : view === "league" ? (
          <LeagueView
            leagueGrouped={leagueGrouped}
            sport={sport}
            seasonLabel={seasonLabel}
            highlightTeam={selectedTeam !== "all" ? selectedTeam : undefined}
            totalFiltered={filteredGames.length}
          />
        ) : view === "week" ? (
          <WeeklyView
            weekGrouped={weekGrouped}
            sport={sport}
            seasonLabel={seasonLabel}
            highlightTeam={selectedTeam !== "all" ? selectedTeam : undefined}
            totalFiltered={filteredGames.length}
          />
        ) : (
          <TeamView
            teamGrouped={teamGrouped}
            sport={sport}
            seasonLabel={seasonLabel}
            totalFiltered={filteredGames.length}
          />
        )}
      </div>
    </>
  );
}

// ============================================================================
// LEAGUE VIEW
// ============================================================================

function LeagueView({
  leagueGrouped,
  sport,
  seasonLabel,
  highlightTeam,
  totalFiltered,
}: {
  leagueGrouped: ReturnType<typeof groupByLeague>;
  sport: string;
  seasonLabel: string;
  highlightTeam?: string;
  totalFiltered: number;
}) {
  return (
    <div className="space-y-2">
      {leagueGrouped.map((league) => {
        const totalLeagueGames = league.divisions.reduce(
          (sum, d) => sum + d.games.length,
          0
        );
        return (
          <section key={league.league_name}>
            <LeagueGroupHeader
              leagueName={league.league_name}
              leagueId={league.league_id}
              gameCount={totalLeagueGames}
              level="league"
            />

            {league.divisions.map((div) => (
              <div key={div.division ?? "general"}>
                {/* Only show division header if there are multiple divisions */}
                {league.divisions.length > 1 && (
                  <LeagueGroupHeader
                    leagueName={league.league_name}
                    leagueId={league.league_id}
                    division={div.division}
                    gameCount={div.games.length}
                    level="division"
                  />
                )}

                {/* Games within this division, sub-grouped by week */}
                <WeekSubGroups
                  games={div.games}
                  sport={sport}
                  seasonLabel={seasonLabel}
                  highlightTeam={highlightTeam}
                />
              </div>
            ))}
          </section>
        );
      })}

      <p className="text-center text-gray-300 text-xs pt-4">
        {totalFiltered} game{totalFiltered !== 1 ? "s" : ""} shown
      </p>
    </div>
  );
}

/**
 * Sub-group games within a league/division by week for additional structure.
 */
function WeekSubGroups({
  games,
  sport,
  seasonLabel,
  highlightTeam,
}: {
  games: ScheduleGame[];
  sport: string;
  seasonLabel: string;
  highlightTeam?: string;
}) {
  const weeks = useMemo(() => groupByWeek(games), [games]);

  return (
    <div className="space-y-4 mb-4">
      {weeks.map(({ weekLabel, weekKey, games: weekGames }) => (
        <div key={weekKey}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-400">{weekLabel}</span>
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] text-gray-300">
              {weekGames.length} game{weekGames.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-1.5">
            {weekGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                sport={sport}
                seasonLabel={seasonLabel}
                highlightTeam={highlightTeam}
                showDate
                showGameType={false}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// WEEKLY VIEW
// ============================================================================

function WeeklyView({
  weekGrouped,
  sport,
  seasonLabel,
  highlightTeam,
  totalFiltered,
}: {
  weekGrouped: ReturnType<typeof groupByWeek>;
  sport: string;
  seasonLabel: string;
  highlightTeam?: string;
  totalFiltered: number;
}) {
  // Scroll to current/most recent week
  const currentWeekRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (currentWeekRef.current) {
      currentWeekRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  // Find the current week index
  const currentWeekIndex = weekGrouped.findIndex(({ weekKey }) => {
    const monday = new Date(weekKey + "T12:00:00");
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return today >= weekKey && today <= sunday.toISOString().slice(0, 10);
  });

  return (
    <div className="space-y-8">
      {weekGrouped.map(({ weekLabel, weekKey, games: weekGames }, idx) => (
        <section
          key={weekKey}
          ref={idx === currentWeekIndex ? currentWeekRef : undefined}
        >
          <WeekHeader
            weekLabel={weekLabel}
            gameCount={weekGames.length}
            weekNumber={idx + 1}
          />
          <div className="space-y-1.5">
            {weekGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                sport={sport}
                seasonLabel={seasonLabel}
                highlightTeam={highlightTeam}
                showDate
              />
            ))}
          </div>
        </section>
      ))}

      <p className="text-center text-gray-300 text-xs pt-4">
        {totalFiltered} game{totalFiltered !== 1 ? "s" : ""} shown
      </p>
    </div>
  );
}

// ============================================================================
// TEAM VIEW
// ============================================================================

function TeamView({
  teamGrouped,
  sport,
  seasonLabel,
  totalFiltered,
}: {
  teamGrouped: { team: ScheduleTeam; games: ScheduleGame[] }[];
  sport: string;
  seasonLabel: string;
  totalFiltered: number;
}) {
  return (
    <div className="space-y-6">
      {teamGrouped.map(({ team, games: teamGames }) => {
        const primary = team.colors?.primary || "#0a1628";
        const wins = teamGames.filter((g) => {
          if (g.home_score === null || g.away_score === null) return false;
          const isHome = g.home_school?.slug === team.slug;
          return isHome
            ? g.home_score > g.away_score
            : g.away_score > g.home_score;
        }).length;
        const losses = teamGames.filter((g) => {
          if (g.home_score === null || g.away_score === null) return false;
          const isHome = g.home_school?.slug === team.slug;
          return isHome
            ? g.home_score < g.away_score
            : g.away_score < g.home_score;
        }).length;
        const completed = teamGames.filter(
          (g) => g.home_score !== null
        ).length;

        return (
          <section
            key={team.slug}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* Team header */}
            <div
              className="px-5 py-4 flex items-center gap-4"
              style={{ borderLeft: `5px solid ${primary}` }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bebas text-lg flex-shrink-0"
                style={{ backgroundColor: primary }}
              >
                {team.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/${sport}/teams/${team.slug}/${seasonLabel}`}
                  className="font-bebas text-xl text-[var(--psp-navy)] hover:text-[var(--psp-blue)] transition tracking-wider"
                >
                  {team.name}
                </Link>
                <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                  {completed > 0 && (
                    <span className="font-medium">
                      {wins}-{losses}
                      {completed < teamGames.length &&
                        ` (${teamGames.length - completed} remaining)`}
                    </span>
                  )}
                  {team.division && (
                    <span className="text-gray-300">
                      {team.division} Division
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/${sport}/teams/${team.slug}/${seasonLabel}`}
                className="text-xs text-[var(--psp-blue)] font-medium hover:underline flex-shrink-0 hidden sm:block"
              >
                Full Preview
              </Link>
            </div>

            {/* Team schedule table */}
            <div className="border-t border-gray-100 overflow-x-auto">
              <table
                className="w-full text-sm"
                aria-label={`${team.name} schedule`}
              >
                <thead>
                  <tr className="text-[10px] text-gray-400 uppercase bg-gray-50">
                    <th className="px-4 py-2 text-left w-8">#</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Opponent</th>
                    <th className="px-4 py-2 text-center hidden sm:table-cell">
                      Type
                    </th>
                    <th className="px-4 py-2 text-center">Result</th>
                    <th className="px-4 py-2 text-center w-10">H/A</th>
                    <th className="px-4 py-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {teamGames.map((g, i) => {
                    const isHome = g.home_school?.slug === team.slug;
                    const opponent = isHome ? g.away_school : g.home_school;
                    const hasScore =
                      g.home_score !== null && g.away_score !== null;
                    const teamScore = isHome ? g.home_score : g.away_score;
                    const oppScore = isHome ? g.away_score : g.home_score;
                    const won =
                      hasScore && (teamScore ?? 0) > (oppScore ?? 0);
                    const lost =
                      hasScore && (teamScore ?? 0) < (oppScore ?? 0);

                    return (
                      <tr
                        key={g.id}
                        className={`border-t border-gray-50 hover:bg-[var(--psp-gold)]/5 transition ${
                          won
                            ? "bg-emerald-50/30"
                            : lost
                            ? "bg-red-50/20"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-2.5 text-gray-300 text-xs">
                          {i + 1}
                        </td>
                        <td className="px-4 py-2.5 text-[var(--psp-navy)] font-medium whitespace-nowrap text-sm">
                          {new Date(g.game_date + "T12:00:00").toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-2.5">
                          {opponent ? (
                            <Link
                              href={`/${sport}/teams/${opponent.slug}/${seasonLabel}`}
                              className="text-sm text-[var(--psp-navy)] hover:text-[var(--psp-blue)] transition"
                            >
                              {isHome ? "" : "@ "}
                              {opponent.name}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-400">
                              {g.notes ?? "TBD"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center hidden sm:table-cell">
                          {g.game_type && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                g.game_type === "playoff" ||
                                g.game_type === "championship"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {g.game_type === "regular" || g.game_type === "league"
                                ? "LG"
                                : g.game_type === "playoff"
                                ? "PO"
                                : g.game_type === "championship"
                                ? "CHAMP"
                                : g.game_type.slice(0, 3).toUpperCase()}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {hasScore ? (
                            <span className="font-mono tabular-nums text-sm">
                              <span
                                className={
                                  won
                                    ? "font-bold text-emerald-600"
                                    : lost
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }
                              >
                                {won ? "W" : lost ? "L" : "T"}{" "}
                                {teamScore}-{oppScore}
                              </span>
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center text-[10px] text-gray-400 font-medium">
                          {isHome ? "H" : "A"}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {g.has_box_score && (
                            <Link
                              href={`/${sport}/games/${g.id}`}
                              className="text-[10px] font-bold text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)]"
                            >
                              BOX
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <p className="text-center text-gray-300 text-xs pt-4">
        {totalFiltered} game{totalFiltered !== 1 ? "s" : ""} across{" "}
        {teamGrouped.length} team{teamGrouped.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
