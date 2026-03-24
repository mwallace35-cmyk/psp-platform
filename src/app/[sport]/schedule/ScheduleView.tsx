"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface School {
  id: number;
  name: string;
  slug: string;
  colors: Record<string, string> | null;
}

interface GameRow {
  id: number;
  game_date: string;
  game_time: string | null;
  game_type: string | null;
  home_score: number | null;
  away_score: number | null;
  notes: string | null;
  home_school: School | null;
  away_school: School | null;
}

interface ScrimmageGroup {
  id: string;
  game_date: string;
  game_time: string | null;
  notes: string;
  teams: School[];
  gameIds: number[];
}

type WeekItem =
  | { type: "game"; game: GameRow }
  | { type: "scrimmageGroup"; group: ScrimmageGroup };

interface TeamInfo {
  id: number;
  name: string;
  slug: string;
  colors: Record<string, string> | null;
  gameCount: number;
}

interface Props {
  games: GameRow[];
  teams: TeamInfo[];
  sport: string;
  seasonLabel: string;
}

const GAME_TYPE_MAP: Record<string, { label: string; cls: string }> = {
  scrimmage: { label: "Scrimmage", cls: "bg-gray-200 text-gray-600" },
  "non-league": { label: "Non-League", cls: "bg-blue-100 text-blue-700" },
  regular: { label: "League", cls: "bg-emerald-100 text-emerald-700" },
  league: { label: "League", cls: "bg-emerald-100 text-emerald-700" },
  playoff: { label: "Playoff", cls: "bg-amber-100 text-amber-700" },
  championship: {
    label: "Championship",
    cls: "bg-gold text-navy font-bold",
  },
};

type ViewMode = "week" | "team";
type GameTypeFilter = "all" | "scrimmage" | "non-league" | "regular";

export default function ScheduleView({
  games,
  teams,
  sport,
  seasonLabel,
}: Props) {
  const [view, setView] = useState<ViewMode>("week");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [gameTypeFilter, setGameTypeFilter] =
    useState<GameTypeFilter>("all");

  // Core teams = 5+ games (the actual Philly area teams, not one-off opponents)
  const coreTeams = useMemo(
    () => teams.filter((t) => t.gameCount >= 5),
    [teams]
  );

  // Filter games
  const filteredGames = useMemo(() => {
    let result = games;
    if (selectedTeam !== "all") {
      result = result.filter(
        (g) =>
          g.home_school?.slug === selectedTeam ||
          g.away_school?.slug === selectedTeam
      );
    }
    if (gameTypeFilter !== "all") {
      if (gameTypeFilter === "regular") {
        result = result.filter(
          (g) =>
            !g.game_type ||
            g.game_type === "regular" ||
            g.game_type === "league"
        );
      } else {
        result = result.filter((g) => g.game_type === gameTypeFilter);
      }
    }
    return result;
  }, [games, selectedTeam, gameTypeFilter]);

  // Group multi-team scrimmages by shared notes
  const weekItems = useMemo(() => {
    // Separate scrimmages with group notes from regular games
    const scrimmageGroups = new Map<string, GameRow[]>();
    const regularGames: GameRow[] = [];

    for (const g of filteredGames) {
      if (g.game_type === "scrimmage" && g.notes && (g.notes.includes("-team") || g.notes.includes("scrimmage"))) {
        const key = `${g.game_date}|${g.game_time ?? ""}|${g.notes}`;
        if (!scrimmageGroups.has(key)) scrimmageGroups.set(key, []);
        scrimmageGroups.get(key)!.push(g);
      } else {
        regularGames.push(g);
      }
    }

    // Build WeekItems
    const items: WeekItem[] = regularGames.map((g) => ({ type: "game" as const, game: g }));

    for (const [, groupGames] of scrimmageGroups) {
      // Collect unique teams from all pairings
      const teamMap = new Map<number, School>();
      for (const g of groupGames) {
        if (g.home_school) teamMap.set(g.home_school.id, g.home_school);
        if (g.away_school) teamMap.set(g.away_school.id, g.away_school);
      }
      const teams = [...teamMap.values()].sort((a, b) => a.name.localeCompare(b.name));
      const first = groupGames[0];
      items.push({
        type: "scrimmageGroup" as const,
        group: {
          id: `scrimmage-${first.id}`,
          game_date: first.game_date,
          game_time: first.game_time,
          notes: first.notes!,
          teams,
          gameIds: groupGames.map((g) => g.id),
        },
      });
    }

    // Sort all items by date then time
    items.sort((a, b) => {
      const dateA = a.type === "game" ? a.game.game_date : a.group.game_date;
      const dateB = b.type === "game" ? b.game.game_date : b.group.game_date;
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      const timeA = (a.type === "game" ? a.game.game_time : a.group.game_time) ?? "";
      const timeB = (b.type === "game" ? b.game.game_time : b.group.game_time) ?? "";
      return timeA.localeCompare(timeB);
    });

    return items;
  }, [filteredGames]);

  // Group by week (Mon-Sun)
  const gamesByWeek = useMemo(() => {
    const groups: { weekLabel: string; weekKey: string; items: WeekItem[] }[] = [];
    const map = new Map<string, WeekItem[]>();
    const keyOrder: string[] = [];

    for (const item of weekItems) {
      const dateStr = item.type === "game" ? item.game.game_date : item.group.game_date;
      const d = new Date(dateStr + "T12:00:00");
      const day = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((day + 6) % 7));
      const key = monday.toISOString().slice(0, 10);
      if (!map.has(key)) {
        map.set(key, []);
        keyOrder.push(key);
      }
      map.get(key)!.push(item);
    }

    for (const key of keyOrder) {
      const monday = new Date(key + "T12:00:00");
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const label = `${monday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} – ${sunday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
      groups.push({ weekLabel: label, weekKey: key, items: map.get(key)! });
    }

    return groups;
  }, [weekItems]);

  // Group by team
  const gamesByTeam = useMemo(() => {
    const teamGames = new Map<
      string,
      { team: TeamInfo; games: GameRow[] }
    >();

    for (const t of coreTeams) {
      const tGames = filteredGames.filter(
        (g) =>
          g.home_school?.slug === t.slug ||
          g.away_school?.slug === t.slug
      );
      if (tGames.length > 0) {
        teamGames.set(t.slug, { team: t, games: tGames });
      }
    }

    return [...teamGames.values()].sort((a, b) =>
      a.team.name.localeCompare(b.team.name)
    );
  }, [coreTeams, filteredGames]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string | null) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    if (hour === 0) return "12:" + m + " AM";
    if (hour < 12) return hour + ":" + m + " AM";
    if (hour === 12) return "12:" + m + " PM";
    return hour - 12 + ":" + m + " PM";
  };

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* View toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setView("week")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  view === "week"
                    ? "bg-navy text-white shadow-sm"
                    : "text-gray-600 hover:text-navy"
                }`}
              >
                By Week
              </button>
              <button
                onClick={() => setView("team")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  view === "team"
                    ? "bg-navy text-white shadow-sm"
                    : "text-gray-600 hover:text-navy"
                }`}
              >
                By Team
              </button>
            </div>

            {/* Team filter (only in week view) */}
            {view === "week" && (
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-navy focus:ring-2 focus:ring-gold/50 focus:border-gold"
              >
                <option value="all">All Teams</option>
                <optgroup label="Core Teams">
                  {coreTeams.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name} ({t.gameCount})
                    </option>
                  ))}
                </optgroup>
              </select>
            )}

            {/* Game type filter */}
            <div className="flex gap-1 ml-auto">
              {(
                [
                  ["all", "All"],
                  ["regular", "League"],
                  ["non-league", "Non-League"],
                  ["scrimmage", "Scrimmage"],
                ] as [GameTypeFilter, string][]
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setGameTypeFilter(val)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    gameTypeFilter === val
                      ? "bg-navy text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {filteredGames.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-3xl mb-3">🏈</p>
            <p className="text-gray-500 text-lg">
              No games match your filters.
            </p>
            <button
              onClick={() => {
                setSelectedTeam("all");
                setGameTypeFilter("all");
              }}
              className="mt-3 text-blue-600 text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : view === "week" ? (
          /* ======================== WEEK VIEW ======================== */
          <div className="space-y-8">
            {gamesByWeek.map(({ weekLabel, weekKey, items: weekItems }) => (
              <section key={weekKey}>
                <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-gold/40">
                  <h2 className="text-lg font-bebas text-navy">
                    <span className="text-gold">Week</span> {weekLabel}
                  </h2>
                  <span className="text-xs text-gray-400 ml-auto">
                    {weekItems.length} event
                    {weekItems.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-2">
                  {weekItems.map((item) =>
                    item.type === "game" ? (
                      <GameCard
                        key={item.game.id}
                        game={item.game}
                        sport={sport}
                        seasonLabel={seasonLabel}
                        highlightTeam={
                          selectedTeam !== "all" ? selectedTeam : undefined
                        }
                      />
                    ) : (
                      <ScrimmageGroupCard
                        key={item.group.id}
                        group={item.group}
                        sport={sport}
                        seasonLabel={seasonLabel}
                      />
                    )
                  )}
                </div>
              </section>
            ))}
            <p className="text-center text-gray-400 text-xs pt-4">
              {filteredGames.length} game
              {filteredGames.length !== 1 ? "s" : ""} shown
            </p>
          </div>
        ) : (
          /* ======================== TEAM VIEW ======================== */
          <div className="space-y-6">
            {gamesByTeam.map(({ team, games: teamGames }) => {
              const primary = team.colors?.primary || "#0a1628";
              const leagueCount = teamGames.filter(
                (g) =>
                  !g.game_type ||
                  g.game_type === "regular" ||
                  g.game_type === "league"
              ).length;
              const nlCount = teamGames.filter(
                (g) => g.game_type === "non-league"
              ).length;
              const scrCount = teamGames.filter(
                (g) => g.game_type === "scrimmage"
              ).length;

              return (
                <section
                  key={team.slug}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  {/* Team header */}
                  <div
                    className="px-5 py-4 flex items-center gap-4"
                    style={{
                      borderLeft: `5px solid ${primary}`,
                    }}
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
                        className="font-bebas text-xl text-navy hover:text-blue-600 transition"
                      >
                        {team.name}
                      </Link>
                      <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                        <span>{teamGames.length} games</span>
                        {leagueCount > 0 && (
                          <span>{leagueCount} league</span>
                        )}
                        {nlCount > 0 && (
                          <span>{nlCount} non-league</span>
                        )}
                        {scrCount > 0 && (
                          <span>{scrCount} scrimmage</span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/${sport}/teams/${team.slug}/${seasonLabel}`}
                      className="text-xs text-blue-600 font-medium hover:underline flex-shrink-0 hidden sm:block"
                    >
                      Full Preview →
                    </Link>
                  </div>

                  {/* Team schedule table */}
                  <div className="border-t border-gray-100">
                    <table className="w-full text-sm text-gray-200">
                      <thead>
                        <tr className="text-xs text-gray-500 uppercase bg-gray-50">
                          <th className="px-4 py-2 text-left w-8">#</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Opponent</th>
                          <th className="px-4 py-2 text-left hidden sm:table-cell">
                            Type
                          </th>
                          <th className="px-4 py-2 text-left hidden sm:table-cell">
                            Time
                          </th>
                          <th className="px-4 py-2 text-center">H/A</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamGames.map((g, i) => {
                          const isHome =
                            g.home_school?.slug === team.slug;
                          const opponent = isHome
                            ? g.away_school
                            : g.home_school;
                          const typeInfo = g.game_type
                            ? GAME_TYPE_MAP[g.game_type]
                            : null;

                          return (
                            <tr
                              key={g.id}
                              className="border-t border-gray-50 hover:bg-gold/5 transition"
                            >
                              <td className="px-4 py-2 text-gray-400 text-xs">
                                {i + 1}
                              </td>
                              <td className="px-4 py-2 text-navy font-medium whitespace-nowrap">
                                {formatDate(g.game_date)}
                              </td>
                              <td className="px-4 py-2">
                                {opponent ? (
                                  <Link
                                    href={`/${sport}/teams/${opponent.slug}/${seasonLabel}`}
                                    className="text-navy hover:text-blue-600 transition font-medium"
                                  >
                                    {opponent.name}
                                  </Link>
                                ) : (
                                  <span className="text-gray-400">
                                    TBD
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 hidden sm:table-cell">
                                {typeInfo && (
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeInfo.cls}`}
                                  >
                                    {typeInfo.label}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                                {formatTime(g.game_time)}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <span
                                  className={`inline-block w-6 text-xs font-bold rounded ${
                                    isHome
                                      ? "bg-navy text-white"
                                      : "bg-gray-200 text-gray-600"
                                  }`}
                                >
                                  {isHome ? "H" : "A"}
                                </span>
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
            <p className="text-center text-gray-400 text-xs pt-4">
              {gamesByTeam.length} team
              {gamesByTeam.length !== 1 ? "s" : ""} •{" "}
              {filteredGames.length} game
              {filteredGames.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ======================== GameCard component ======================== */
function GameCard({
  game: g,
  sport,
  seasonLabel,
  highlightTeam,
}: {
  game: GameRow;
  sport: string;
  seasonLabel: string;
  highlightTeam?: string;
}) {
  const d = new Date(g.game_date + "T12:00:00");
  const dayStr = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = g.game_time
    ? (() => {
        const [h, m] = g.game_time.split(":");
        const hour = parseInt(h);
        if (hour === 0) return "12:" + m + " AM";
        if (hour < 12) return hour + ":" + m + " AM";
        if (hour === 12) return "12:" + m + " PM";
        return hour - 12 + ":" + m + " PM";
      })()
    : null;
  const typeInfo = g.game_type ? GAME_TYPE_MAP[g.game_type] : null;
  const homePrimary = g.home_school?.colors?.primary || "#0a1628";
  const hasScore = g.home_score !== null && g.away_score !== null;

  // Determine which school to highlight
  const awayBold =
    highlightTeam && g.away_school?.slug === highlightTeam;
  const homeBold =
    highlightTeam && g.home_school?.slug === highlightTeam;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gold/50 transition group">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Date + time */}
        <div className="w-24 flex-shrink-0 text-center">
          <p className="text-xs font-medium text-gray-500">{dayStr}</p>
          {timeStr && (
            <p className="text-[11px] text-gray-400">{timeStr}</p>
          )}
        </div>

        {/* Color bar */}
        <div
          className="w-1 h-10 rounded-full flex-shrink-0"
          style={{ backgroundColor: homePrimary }}
        />

        {/* Matchup */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-navy">
            {g.away_school ? (
              <Link
                href={`/${sport}/teams/${g.away_school.slug}/${seasonLabel}`}
                className={`hover:text-blue-600 transition ${
                  awayBold ? "font-bold" : "font-medium"
                }`}
              >
                {g.away_school.name}
              </Link>
            ) : (
              <span className="text-gray-400">TBD</span>
            )}
            <span className="text-gray-400 mx-2">@</span>
            {g.home_school ? (
              <Link
                href={`/${sport}/teams/${g.home_school.slug}/${seasonLabel}`}
                className={`hover:text-blue-600 transition ${
                  homeBold ? "font-bold" : "font-medium"
                }`}
              >
                {g.home_school.name}
              </Link>
            ) : (
              <span className="text-gray-400">TBD</span>
            )}
          </p>
          {typeInfo && (
            <span
              className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${typeInfo.cls}`}
            >
              {typeInfo.label}
            </span>
          )}
        </div>

        {/* Score or Preview link */}
        {hasScore ? (
          <Link
            href={`/${sport}/games/${g.id}`}
            className="text-right flex-shrink-0 hover:text-blue-600 transition"
          >
            <p className="text-sm font-bold text-navy">
              {g.away_score} – {g.home_score}
            </p>
          </Link>
        ) : (
          g.home_school?.slug && (
            <Link
              href={`/${sport}/teams/${g.home_school.slug}/${seasonLabel}`}
              className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition flex-shrink-0"
            >
              Preview →
            </Link>
          )
        )}
      </div>
    </div>
  );
}

/* ======================== ScrimmageGroupCard component ======================== */
function ScrimmageGroupCard({
  group,
  sport,
  seasonLabel,
}: {
  group: ScrimmageGroup;
  sport: string;
  seasonLabel: string;
}) {
  const d = new Date(group.game_date + "T12:00:00");
  const dayStr = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = group.game_time
    ? (() => {
        const [h, m] = group.game_time.split(":");
        const hour = parseInt(h);
        if (hour === 0) return "12:" + m + " AM";
        if (hour < 12) return hour + ":" + m + " AM";
        if (hour === 12) return "12:" + m + " PM";
        return hour - 12 + ":" + m + " PM";
      })()
    : null;

  // Location from notes (e.g. "4-team scrimmage at SPSS")
  const atMatch = group.notes.match(/at\s+(.+)$/i);
  const location = atMatch ? atMatch[1] : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gold/50 transition">
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Date + time */}
        <div className="w-24 flex-shrink-0 text-center pt-1">
          <p className="text-xs font-medium text-gray-500">{dayStr}</p>
          {timeStr && (
            <p className="text-[11px] text-gray-400">{timeStr}</p>
          )}
        </div>

        {/* Multi-color bar */}
        <div className="flex flex-col gap-0.5 flex-shrink-0 pt-1">
          {group.teams.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className="w-1 h-2.5 rounded-full"
              style={{ backgroundColor: t.colors?.primary || "#0a1628" }}
            />
          ))}
        </div>

        {/* Teams list */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-navy">
            {group.teams.map((t, i) => (
              <span key={t.id}>
                {i > 0 && <span className="text-gray-400">{i === group.teams.length - 1 ? " & " : ", "}</span>}
                <Link
                  href={`/${sport}/teams/${t.slug}/${seasonLabel}`}
                  className="font-medium hover:text-blue-600 transition"
                >
                  {t.name}
                </Link>
              </span>
            ))}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-gray-200 text-gray-600">
              {group.teams.length}-Team Scrimmage
            </span>
            {location && (
              <span className="text-[10px] text-gray-400">
                📍 {location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
