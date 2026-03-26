"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PSPPromo from "@/components/ads/PSPPromo";
import TeamHeader from "@/components/team/TeamHeader";
import TeamSchedule from "@/components/team/TeamSchedule";
import TeamRoster from "@/components/team/TeamRoster";
import TeamStats from "@/components/team/TeamStats";

// Type definitions
interface TeamDetail {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  league: string;
  founded_year: number;
  coach: string;
  currentRecord: { wins: number; losses: number; ties: number };
  pointsFor: number;
  pointsAgainst: number;
  championships: number;
  recentChampionships: string[];
}

interface School {
  id: number;
  slug: string;
  name: string;
  short_name?: string;
  city?: string;
  state?: string;
  league_id?: number;
  mascot?: string;
  closed_year?: number;
  founded_year?: number;
  website_url?: string;
  leagues?: { name: string; short_name?: string } | null;
  primary_color?: string;
  secondary_color?: string;
}

interface TeamSeason {
  id: number;
  school_id: number;
  sport_id: string;
  season_id: number;
  wins?: number;
  losses?: number;
  ties?: number;
  points_for?: number;
  points_against?: number;
  playoff_result?: string;
  seasons?: { year_start: number; year_end: number; label: string };
  schools?: School;
  coaches?: { id: number; name: string; slug: string } | null;
}

interface Championship {
  id: number;
  school_id: number;
  season_id: number;
  sport_id: string;
  level?: string;
  result?: string;
  score?: string;
  opponent_id?: number;
  schools?: School;
  seasons?: { year_start: number; year_end: number; label: string };
  leagues?: { name: string };
  opponent?: { name: string };
}

interface Alumni {
  id: number;
  player_id: number;
  school_id: number;
  person_name?: string;
  current_org?: string;
  current_level?: string;
  pro_league?: string;
  destination_school?: string;
  destination_level?: string;
  graduation_year?: number;
}

interface SportMeta {
  name: string;
  color: string;
  emoji: string;
}

interface DBGame {
  id: number;
  game_date: string;
  home_school_id: number;
  away_school_id: number;
  home_score: number | null;
  away_score: number | null;
  home_school?: { name: string; slug: string } | null;
  away_school?: { name: string; slug: string } | null;
  notes?: string;
}

interface DBRosterEntry {
  id: number;
  player_id: number;
  jersey_number?: string;
  position?: string;
  class_year?: string;
  players?: { id: number; name: string; slug: string } | null;
}

interface DBArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string;
  published_at?: string;
  sport_id?: string;
}

interface TeamPageClientProps {
  team: TeamDetail;
  school: School;
  teamSeasons: TeamSeason[];
  championships: Championship[];
  alumni: Alumni[];
  sport: string;
  sportMeta: SportMeta;
  games: DBGame[];
  roster: DBRosterEntry[];
  articles: DBArticle[];
}

// Helper: format a game date string like "Sept 6"
function formatGameDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

// Helper: convert DB games to schedule format for TeamSchedule component
function gamesToSchedule(games: DBGame[], schoolId: number) {
  return games.map((g) => {
    const isHome = g.home_school_id === schoolId;
    const opponentSchool = isHome
      ? (Array.isArray(g.away_school) ? g.away_school[0] : g.away_school)
      : (Array.isArray(g.home_school) ? g.home_school[0] : g.home_school);
    const opponentName = opponentSchool?.name || "Unknown";
    const ourScore = isHome ? g.home_score : g.away_score;
    const theirScore = isHome ? g.away_score : g.home_score;
    const hasScore = ourScore !== null && theirScore !== null;
    const result = hasScore
      ? ourScore! > theirScore!
        ? "W"
        : ourScore! < theirScore!
        ? "L"
        : "T"
      : null;
    return {
      date: formatGameDate(g.game_date),
      opponent: opponentName,
      homeAway: isHome ? ("H" as const) : ("A" as const),
      result: (result || "--") as "W" | "L",
      score: hasScore ? `${ourScore}-${theirScore}` : "TBD",
      leagueGame: true,
    };
  });
}

// Helper: convert DB roster to display format for TeamRoster component
function rosterToDisplay(roster: DBRosterEntry[]) {
  return roster.map((r) => {
    const player = Array.isArray(r.players) ? r.players[0] : r.players;
    return {
      name: player?.name || "Unknown",
      position: r.position || "--",
      class: (r.class_year || "--") as "Sr" | "Jr" | "So" | "Fr",
      height: "--",
      weight: "--",
      slug: player?.slug || "",
    };
  });
}

// Helper: get position groups based on sport
function getPositionGroups(sportId: string): Record<string, string[]> {
  if (sportId === "basketball") {
    return {
      Guards: ["PG", "SG", "G"],
      Forwards: ["SF", "PF", "F"],
      Centers: ["C"],
    };
  }
  if (sportId === "baseball") {
    return {
      Pitchers: ["P", "SP", "RP"],
      Catchers: ["C"],
      Infielders: ["1B", "2B", "3B", "SS", "INF"],
      Outfielders: ["LF", "CF", "RF", "OF"],
    };
  }
  return {
    Offense: ["QB", "RB", "WR", "OL", "TE", "FB"],
    Defense: ["DL", "DE", "DT", "LB", "DB", "CB", "S"],
    "Special Teams": ["K", "P", "LS"],
  };
}

// Helper: time ago display for articles
function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

// Era definitions for season history grouping
interface Era {
  key: string;
  label: string;
  range: string;
  minYear: number;
  maxYear: number;
}

const ERAS: Era[] = [
  { key: "modern", label: "Modern Era", range: "2016-Present", minYear: 2016, maxYear: 9999 },
  { key: "classification", label: "Classification Era", range: "2008-2015", minYear: 2008, maxYear: 2015 },
  { key: "division", label: "Division Era", range: "1999-2007", minYear: 1999, maxYear: 2007 },
  { key: "historic", label: "Historic Era", range: "Pre-1999", minYear: 0, maxYear: 1998 },
];

function getEraForYear(year: number): Era {
  return ERAS.find((e) => year >= e.minYear && year <= e.maxYear) || ERAS[ERAS.length - 1];
}

function getErasWithSeasons(seasons: TeamSeason[]): Era[] {
  const eraKeys = new Set<string>();
  for (const ts of seasons) {
    const year = ts.seasons?.year_start;
    if (year != null) {
      eraKeys.add(getEraForYear(year).key);
    }
  }
  return ERAS.filter((e) => eraKeys.has(e.key));
}

// Build a lookup: season_id -> Championship[] for badge rendering
function buildChampionshipMap(championships: Championship[]): Map<number, Championship[]> {
  const map = new Map<number, Championship[]>();
  for (const c of championships) {
    const list = map.get(c.season_id) || [];
    list.push(c);
    map.set(c.season_id, list);
  }
  return map;
}

// Format championship badge text from DB data
function formatChampionshipLabel(c: Championship): string {
  const leagueName = c.leagues?.name;
  const level = c.level;
  if (level === "state" || level === "State") {
    return leagueName ? `${leagueName} State Champion` : "State Champion";
  }
  if (level === "district" || level === "District") {
    return leagueName ? `${leagueName} District Champion` : "District Champion";
  }
  // League / conference championship
  if (leagueName) {
    return `${leagueName} Champion`;
  }
  if (level) {
    return `${level.charAt(0).toUpperCase() + level.slice(1)} Champion`;
  }
  return "Champion";
}

type TabType = "overview" | "stats" | "schedule" | "roster" | "news";

export default function TeamPageClient({
  team,
  school,
  teamSeasons,
  championships,
  alumni,
  sport,
  sportMeta,
  games,
  roster,
  articles,
}: TeamPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Era selector for season history
  const availableEras = getErasWithSeasons(teamSeasons || []);
  const [selectedEra, setSelectedEra] = useState<string>(
    availableEras.length > 0 ? availableEras[0].key : "modern"
  );
  const currentEra = ERAS.find((e) => e.key === selectedEra) || ERAS[0];

  // Championship lookup by season_id
  const champMap = buildChampionshipMap(championships || []);

  const totalGames = team.currentRecord.wins + team.currentRecord.losses;
  const winPct = totalGames > 0 ? ((team.currentRecord.wins / totalGames) * 100).toFixed(1) : "0.0";

  // Transform DB data for display
  const schedule = gamesToSchedule(games || [], school.id);
  const rosterDisplay = rosterToDisplay(roster || []);
  const positionGroups = getPositionGroups(sport);

  // Find last completed game and next upcoming game from schedule
  const now = new Date();
  const sortedGames = [...(games || [])].sort(
    (a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime()
  );
  const lastCompletedGame = [...sortedGames]
    .reverse()
    .find((g) => g.home_score !== null && g.away_score !== null);
  const nextUpcomingGame = sortedGames.find(
    (g) => g.home_score === null || g.away_score === null
  );

  // Format "Right Now" data from real games
  const getGameOpponent = (g: DBGame | undefined) => {
    if (!g) return null;
    const isHome = g.home_school_id === school.id;
    const opp = isHome
      ? (Array.isArray(g.away_school) ? g.away_school[0] : g.away_school)
      : (Array.isArray(g.home_school) ? g.home_school[0] : g.home_school);
    return {
      name: opp?.name || "TBA",
      homeAway: isHome ? "Home" : "Away",
      date: formatGameDate(g.game_date),
    };
  };

  const lastGameInfo = getGameOpponent(lastCompletedGame);
  const nextGameInfo = getGameOpponent(nextUpcomingGame);

  // Tab styling
  const tabClasses = (tab: TabType) =>
    `px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
      activeTab === tab
        ? `border-[var(--psp-gold)] text-[var(--psp-navy)]`
        : "border-transparent text-gray-400 hover:text-gray-700"
    }`;

  return (
    <>
      {/* Team Header Component */}
      <TeamHeader
        team={team}
        school={school}
        sport={sport}
        sportMeta={sportMeta}
      />

      {/* Right Now Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-300">
          {/* Header with navy background */}
          <div
            className="bg-[var(--psp-navy)] px-5 py-3"
            style={{
              borderLeft: `4px solid ${school.primary_color || sportMeta.color}`,
            }}
          >
            <h3 className="psp-caption text-white">
              Right Now
            </h3>
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Last Game */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                  Last Game
                </div>
                {lastGameInfo ? (
                  <>
                    <div className="text-sm font-semibold text-[var(--psp-navy)] mb-1">
                      {lastGameInfo.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {lastGameInfo.homeAway} &bull; {lastGameInfo.date}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400">No games played yet</div>
                )}
              </div>

              {/* Current Record */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                  Season Record
                </div>
                <div className="psp-h3" style={{ color: school.primary_color || sportMeta.color }}>
                  {team.currentRecord.wins}-{team.currentRecord.losses}{team.currentRecord.ties > 0 ? `-${team.currentRecord.ties}` : ""}
                </div>
              </div>

              {/* League Standing */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                  League Standing
                </div>
                <div className="psp-h3 text-[var(--psp-gold)]">
                  TBA
                </div>
                <div className="text-xs text-gray-600 mt-1">in {team.league}</div>
              </div>

              {/* Next Opponent */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                  Next Opponent
                </div>
                {nextGameInfo ? (
                  <>
                    <div className="text-sm font-semibold text-[var(--psp-navy)] mb-1">
                      {nextGameInfo.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {nextGameInfo.homeAway} &bull; {nextGameInfo.date}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400">No upcoming games</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg border-b border-[var(--psp-gray-200)] flex overflow-x-auto">
              {(["overview", "stats", "schedule", "roster", "news"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={tabClasses(tab)}
                  style={{
                    borderBottomColor:
                      activeTab === tab ? "var(--psp-gold)" : "transparent",
                  }}
                >
                  {tab === "overview" && "Overview"}
                  {tab === "stats" && "Stats"}
                  {tab === "schedule" && "Schedule"}
                  {tab === "roster" && "Roster"}
                  {tab === "news" && "News"}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Season Summary Card */}
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-6">
                  <h2
                    className="psp-h3 mb-4" style={{ color: "var(--psp-navy)" }}
                  >
                    Season Summary
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
                        {team.currentRecord.wins}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
                        {team.currentRecord.losses}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Losses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: "var(--psp-gold)" }}>
                        {team.pointsFor}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Points For</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: "#ef4444" }}>
                        {team.pointsAgainst}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Points Against</div>
                    </div>
                  </div>
                </div>

                {/* Recent News */}
                <div>
                  <h2
                    className="psp-h3 mb-4" style={{ color: "var(--psp-navy)" }}
                  >
                    Latest News
                  </h2>
                  {articles && articles.length > 0 ? (
                    <div className="space-y-4">
                      {articles.slice(0, 3).map((article) => (
                        <Link
                          key={article.id}
                          href={`/articles/${article.slug}`}
                          className="flex gap-4 bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-md transition-shadow"
                        >
                          {article.featured_image_url && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={article.featured_image_url}
                                alt={article.title}
                                width={96}
                                height={96}
                                sizes="96px"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-bold text-sm truncate"
                              style={{ color: "var(--psp-navy)" }}
                            >
                              {article.title}
                            </h3>
                            {article.excerpt && (
                              <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                {article.excerpt}
                              </p>
                            )}
                            <p className="text-xs text-gray-300 mt-2">
                              {timeAgo(article.published_at)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-6 text-center">
                      <p className="text-sm text-gray-400">No articles yet for this team.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <TeamStats team={team} />
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              schedule.length > 0 ? (
                <TeamSchedule schedule={schedule} />
              ) : (
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-8 text-center">
                  <p className="text-sm text-gray-400">Schedule data not available for this season.</p>
                </div>
              )
            )}

            {/* Roster Tab */}
            {activeTab === "roster" && (
              rosterDisplay.length > 0 ? (
                <TeamRoster
                  roster={rosterDisplay}
                  positionGroups={positionGroups}
                  sportMeta={sportMeta}
                />
              ) : (
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-8 text-center">
                  <p className="text-sm text-gray-400">Roster data not available for this season.</p>
                </div>
              )
            )}

            {/* Alumni Pipeline */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 className="psp-h3" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--psp-navy)" }}>
                  Alumni Pipeline
                </h2>
                <Link href="/philly-everywhere" style={{ color: "var(--psp-navy)", textDecoration: "none", fontWeight: 700, fontSize: "0.875rem" }}>
                  Philly Everywhere &rarr;
                </Link>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 10,
                marginBottom: 20,
              }}>
                {alumni && alumni.length > 0 ? (
                  alumni.map((alum, i) => (
                    <div key={i} style={{
                      background: "var(--psp-white)",
                      border: "1px solid var(--g100)",
                      borderRadius: 6,
                      padding: "12px 14px",
                      borderTop: `3px solid var(--psp-gold)`,
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--psp-navy)" }}>{alum.person_name || `Alumni ${i + 1}`}</div>
                      <div style={{ fontSize: 11, color: "var(--g400)", marginTop: 2 }}>
                        {alum.current_org || alum.destination_school || "TBA"} {alum.pro_league ? `(${alum.pro_league})` : alum.current_level ? `\u2014 ${alum.current_level}` : ""}
                      </div>
                      {alum.graduation_year && (
                        <div style={{ fontSize: 10, color: "var(--psp-gold)", fontWeight: 600, marginTop: 4 }}>
                          Class of {alum.graduation_year}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{
                    background: "var(--psp-white)",
                    border: "1px solid var(--g100)",
                    borderRadius: 6,
                    padding: "12px 14px",
                    textAlign: "center",
                    gridColumn: "1 / -1",
                  }}>
                    <div style={{ fontSize: 11, color: "var(--g400)" }}>No alumni data available</div>
                  </div>
                )}
              </div>
            </div>

            {/* News Tab */}
            {activeTab === "news" && (
              articles && articles.length > 0 ? (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="flex gap-4 bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-md transition-shadow"
                    >
                      {article.featured_image_url && (
                        <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={article.featured_image_url}
                            alt={article.title}
                            width={128}
                            height={128}
                            sizes="128px"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-base"
                          style={{ color: "var(--psp-navy)" }}
                        >
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-sm text-gray-600 mt-2">
                            {article.excerpt}
                          </p>
                        )}
                        <p className="text-xs text-gray-300 mt-3">
                          {timeAgo(article.published_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-8 text-center">
                  <p className="text-sm text-gray-400">No articles yet for this team.</p>
                </div>
              )
            )}

            {/* Season History -- grouped by era with dropdown selector */}
            {teamSeasons && teamSeasons.length > 0 && (
              <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
                {/* Header with era dropdown */}
                <div
                  className="bg-[var(--psp-navy)] px-5 py-3 flex items-center justify-between"
                  style={{ borderLeft: "4px solid var(--psp-gold)" }}
                >
                  <h2 className="psp-caption text-white">Season History</h2>
                  {availableEras.length > 1 && (
                    <select
                      value={selectedEra}
                      onChange={(e) => setSelectedEra(e.target.value)}
                      className="text-xs font-semibold rounded px-3 py-1.5 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        color: "#fff",
                        fontFamily: "var(--font-dm-sans), sans-serif",
                      }}
                    >
                      {availableEras.map((era) => (
                        <option
                          key={era.key}
                          value={era.key}
                          style={{ color: "#0a1628", background: "#fff" }}
                        >
                          {era.label} ({era.range})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Era label bar */}
                <div className="px-5 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <span className="psp-micro font-bold uppercase tracking-wider" style={{ color: "var(--psp-navy)" }}>
                    {currentEra.label}
                  </span>
                  <span className="psp-micro text-gray-400">
                    {currentEra.range}
                  </span>
                </div>

                {/* Season rows filtered by era */}
                <div className="divide-y divide-gray-100">
                  {teamSeasons
                    .filter((ts) => {
                      const year = ts.seasons?.year_start;
                      return (
                        ts.seasons?.label &&
                        year != null &&
                        year >= currentEra.minYear &&
                        year <= currentEra.maxYear
                      );
                    })
                    .sort((a, b) => (b.seasons?.year_start || 0) - (a.seasons?.year_start || 0))
                    .map((ts) => {
                      const label = ts.seasons!.label;
                      const w = ts.wins ?? 0;
                      const l = ts.losses ?? 0;
                      const t = ts.ties ?? 0;
                      const total = w + l;
                      const pct = total > 0 ? ((w / total) * 100).toFixed(0) : "\u2014";
                      const seasonChamps = champMap.get(ts.season_id) || [];
                      return (
                        <Link
                          key={ts.id}
                          href={`/${sport}/teams/${team.slug}/${label}`}
                          className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className="font-semibold text-sm flex-shrink-0"
                              style={{ color: "var(--psp-navy)" }}
                            >
                              {label}
                            </span>
                            {/* Championship badges */}
                            {seasonChamps.map((c) => (
                              <span
                                key={c.id}
                                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{
                                  background: "var(--psp-gold)",
                                  color: "var(--psp-navy)",
                                }}
                                title={formatChampionshipLabel(c)}
                              >
                                <span role="img" aria-hidden="true">&#127942;</span>
                                <span className="hidden sm:inline truncate max-w-[160px]">
                                  {formatChampionshipLabel(c)}
                                </span>
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span
                              className="psp-small"
                              style={{ color: "var(--psp-navy)" }}
                            >
                              {w}-{l}{t > 0 ? `-${t}` : ""}
                            </span>
                            <span className="text-xs text-gray-300 w-10 text-right">
                              {pct}%
                            </span>
                            <span className="text-gray-300 group-hover:text-[var(--psp-gold)] transition-colors">
                              &rarr;
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/${sport}/schools/${team.slug}`}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: "var(--psp-navy)" }}
                  >
                    View full program profile &rarr;
                  </Link>
                  <span className="psp-micro text-gray-400">
                    {teamSeasons.filter((ts) => ts.seasons?.label).length} seasons
                  </span>
                </div>
              </div>
            )}

            {/* Program History Timeline */}
            <div style={{ marginTop: 20 }}>
              <h2 className="psp-h3" style={{ marginBottom: 16, color: "var(--psp-navy)" }}>Program History</h2>
              <div style={{
                position: "relative",
                paddingLeft: 24,
                borderLeft: `2px solid var(--g200)`,
                marginBottom: 20,
              }}>
                {(team.recentChampionships || []).map((year: string, i: number) => (
                  <div key={i} style={{ marginBottom: 16, position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      left: -31,
                      top: 4,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "var(--psp-gold)",
                      border: "3px solid var(--psp-white)",
                    }} />
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--psp-navy)" }}>{year} Championship</div>
                    <div style={{ fontSize: 11, color: "var(--g400)" }}>League champions</div>
                  </div>
                ))}
                <div style={{ position: "relative", marginBottom: 0 }}>
                  <div style={{
                    position: "absolute",
                    left: -31,
                    top: 4,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "var(--g300)",
                    border: "3px solid var(--psp-white)",
                  }} />
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--psp-navy)" }}>Founded {team.founded_year}</div>
                  <div style={{ fontSize: 11, color: "var(--g400)" }}>{team.league}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Info Card */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3
                className="font-bold text-sm uppercase tracking-wider mb-4"
                style={{ color: "var(--psp-gray-400)" }}
              >
                Team Info
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt style={{ color: "var(--psp-gray-500)" }}>League</dt>
                  <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                    {team.league}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--psp-gray-500)" }}>Location</dt>
                  <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                    {team.city}, {team.state}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--psp-gray-500)" }}>Head Coach</dt>
                  <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                    {team.coach}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--psp-gray-500)" }}>Founded</dt>
                  <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                    {team.founded_year}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Season Record Card */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3
                className="font-bold text-sm uppercase tracking-wider mb-4"
                style={{ color: "var(--psp-gray-400)" }}
              >
                Season Record
              </h3>
              <div className="text-center">
                <div
                  className="psp-h1 mb-2"
                  style={{ color: "var(--psp-navy)" }}
                >
                  {team.currentRecord.wins}-{team.currentRecord.losses}
                </div>
                <div className="text-sm text-gray-400">{winPct}% Win Rate</div>
              </div>
            </div>

            {/* Championships Card */}
            {team.championships > 0 && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
                <h3
                  className="font-bold text-sm uppercase tracking-wider mb-4"
                  style={{ color: "var(--psp-gray-400)" }}
                >
                  Championships
                </h3>
                <div className="text-center mb-4">
                  <div
                    className="text-3xl font-bold"
                    style={{ color: "var(--psp-gold)" }}
                  >
                    &#127942; {team.championships}
                  </div>
                </div>
                {team.recentChampionships.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-600 mb-2">
                      Recent Titles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {team.recentChampionships.map((year: string) => (
                        <span
                          key={year}
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{
                            background: "var(--psp-gold)",
                            color: "var(--psp-navy)",
                          }}
                        >
                          {year}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Promotional Content */}
            <PSPPromo size="sidebar" />

            {/* Related Teams */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3
                className="font-bold text-sm uppercase tracking-wider mb-4"
                style={{ color: "var(--psp-gray-400)" }}
              >
                League Teams
              </h3>
              <div className="space-y-2">
                <Link
                  href={`/${sport}/teams?league=${encodeURIComponent(team.league)}`}
                  className="block text-sm py-2 px-3 rounded hover:bg-gray-50 transition-colors"
                  style={{ color: "var(--psp-navy)" }}
                >
                  View all {team.league} teams &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            name: team.name,
            sport: sportMeta.name,
            location: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: team.city,
                addressRegion: team.state,
              },
            },
            url: `https://phillysportspack.com/${sport}/teams/${team.slug}`,
            coach: team.coach,
          }),
        }}
      />
    </>
  );
}
