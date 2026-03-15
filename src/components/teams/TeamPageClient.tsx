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
  destination_school?: string;
  destination_level?: string;
  graduation_year?: number;
}

interface SportMeta {
  name: string;
  color: string;
  emoji: string;
}

interface TeamPageClientProps {
  team: TeamDetail;
  school: School;
  teamSeasons: TeamSeason[];
  championships: Championship[];
  alumni: Alumni[];
  sport: string;
  sportMeta: SportMeta;
}

// Sample roster data for different sports
const FOOTBALL_ROSTER = [
  // Offense
  { name: "James Martinez", position: "QB", class: "Sr" as const, height: '6\'2"', weight: "210", slug: "james-martinez" },
  { name: "DeShawn Johnson", position: "RB", class: "Sr" as const, height: '5\'10"', weight: "195", slug: "deshawn-johnson" },
  { name: "Marcus White", position: "WR", class: "Jr" as const, height: '6\'1"', weight: "185", slug: "marcus-white" },
  { name: "Eric Torres", position: "WR", class: "Jr" as const, height: '6\'0"', weight: "180", slug: "eric-torres" },
  { name: "Kevin Brown", position: "OL", class: "Sr" as const, height: '6\'3"', weight: "295", slug: "kevin-brown" },
  { name: "David Lee", position: "OL", class: "Jr" as const, height: '6\'4"', weight: "305", slug: "david-lee" },
  { name: "Joseph Adams", position: "OL", class: "So" as const, height: '6\'2"', weight: "280", slug: "joseph-adams" },
  { name: "Alex Garcia", position: "TE", class: "So" as const, height: '6\'4"', weight: "235", slug: "alex-garcia" },
  // Defense
  { name: "Tyler Jackson", position: "DE", class: "Sr" as const, height: '6\'2"', weight: "245", slug: "tyler-jackson" },
  { name: "Marcus Johnson", position: "DL", class: "Jr" as const, height: '6\'0"', weight: "265", slug: "marcus-johnson" },
  { name: "Michael Davis", position: "LB", class: "Jr" as const, height: '6\'0"', weight: "225", slug: "michael-davis" },
  { name: "Christopher Miller", position: "DB", class: "Sr" as const, height: '5\'11"', weight: "190", slug: "christopher-miller" },
  { name: "Brandon Wilson", position: "DB", class: "Jr" as const, height: '5\'10"', weight: "185", slug: "brandon-wilson" },
  { name: "Anthony Santos", position: "S", class: "So" as const, height: '5\'11"', weight: "195", slug: "anthony-santos" },
  // Special Teams
  { name: "Lucas Perez", position: "K", class: "Sr" as const, height: '5\'11"', weight: "185", slug: "lucas-perez" },
  { name: "Nathan White", position: "P", class: "Jr" as const, height: '6\'1"', weight: "195", slug: "nathan-white" },
];

const BASKETBALL_ROSTER = [
  // Guards
  { name: "Michael Johnson", position: "PG", class: "Sr" as const, height: '6\'2"', weight: "185", slug: "michael-johnson" },
  { name: "David Chen", position: "SG", class: "Jr" as const, height: '6\'3"', weight: "195", slug: "david-chen" },
  { name: "Tyler Rodriguez", position: "SG", class: "Sr" as const, height: '6\'1"', weight: "190", slug: "tyler-rodriguez" },
  // Forwards
  { name: "James Williams", position: "SF", class: "Jr" as const, height: '6\'6"', weight: "215", slug: "james-williams" },
  { name: "Marcus Thompson", position: "PF", class: "So" as const, height: '6\'7"', weight: "235", slug: "marcus-thompson" },
  { name: "Anthony Davis", position: "PF", class: "Sr" as const, height: '6\'8"', weight: "245", slug: "anthony-davis" },
  // Centers
  { name: "DeAndre Jordan", position: "C", class: "Sr" as const, height: '6\'11"', weight: "265", slug: "deandre-jordan" },
  { name: "Jamal Murray", position: "C", class: "Jr" as const, height: '7\'0"', weight: "280", slug: "jamal-murray" },
];

const BASEBALL_ROSTER = [
  // Pitchers
  { name: "Clayton Kershaw", position: "SP", class: "Sr" as const, height: '6\'3"', weight: "215", slug: "clayton-kershaw" },
  { name: "David Price", position: "SP", class: "Sr" as const, height: '6\'5"', weight: "225", slug: "david-price" },
  { name: "Aroldis Chapman", position: "RP", class: "Jr" as const, height: '6\'4"', weight: "210", slug: "aroldis-chapman" },
  // Catchers
  { name: "Buster Posey", position: "C", class: "Sr" as const, height: '6\'1"', weight: "205", slug: "buster-posey" },
  // Infielders
  { name: "Mike Trout", position: "SS", class: "Jr" as const, height: '6\'2"', weight: "235", slug: "mike-trout" },
  { name: "Jose Altuve", position: "2B", class: "Sr" as const, height: '5\'6"', weight: "165", slug: "jose-altuve" },
  { name: "Adrian Beltre", position: "3B", class: "Sr" as const, height: '6\'1"', weight: "210", slug: "adrian-beltre" },
  { name: "Joey Votto", position: "1B", class: "Sr" as const, height: '6\'3"', weight: "220", slug: "joey-votto" },
  // Outfielders
  { name: "Christian Yelich", position: "LF", class: "Jr" as const, height: '6\'3"', weight: "195", slug: "christian-yelich" },
  { name: "Mookie Betts", position: "CF", class: "Jr" as const, height: '5\'9"', weight: "180", slug: "mookie-betts" },
  { name: "Bryce Harper", position: "RF", class: "Sr" as const, height: '6\'3"', weight: "210", slug: "bryce-harper" },
];

// Helper function to get roster for sport
const getSampleRoster = (sportId: string) => {
  if (sportId === "basketball") return BASKETBALL_ROSTER;
  if (sportId === "baseball") return BASEBALL_ROSTER;
  return FOOTBALL_ROSTER; // Default to football
};

// Helper function to get position groups based on sport
const getPositionGroups = (sportId: string): Record<string, string[]> => {
  if (sportId === "basketball") {
    return {
      "Guards": ["PG", "SG"],
      "Forwards": ["SF", "PF"],
      "Centers": ["C"],
    };
  }
  if (sportId === "baseball") {
    return {
      "Pitchers": ["P", "SP", "RP"],
      "Catchers": ["C"],
      "Infielders": ["1B", "2B", "3B", "SS"],
      "Outfielders": ["LF", "CF", "RF"],
    };
  }
  // Football is default
  return {
    "Offense": ["QB", "RB", "WR", "OL", "TE"],
    "Defense": ["DL", "DE", "LB", "DB", "S"],
    "Special Teams": ["K", "P"],
  };
};

// Helper function to group roster by positions
const groupRosterByPosition = (roster: typeof FOOTBALL_ROSTER, positionGroups: Record<string, string[]>) => {
  const grouped: Record<string, typeof FOOTBALL_ROSTER> = {};

  Object.keys(positionGroups).forEach(group => {
    grouped[group] = roster.filter(player =>
      positionGroups[group].includes(player.position)
    );
  });

  return grouped;
};

// Sample schedule data
const SAMPLE_SCHEDULE = [
  { date: "Sept 6", opponent: "Local Team A", homeAway: "H" as const, result: "W" as const, score: "35-14", leagueGame: true },
  { date: "Sept 13", opponent: "Local Team B", homeAway: "A" as const, result: "W" as const, score: "28-21", leagueGame: true },
  { date: "Sept 20", opponent: "Local Team C", homeAway: "H" as const, result: "W" as const, score: "42-10", leagueGame: true },
  { date: "Sept 27", opponent: "Local Team D", homeAway: "A" as const, result: "L" as const, score: "17-20", leagueGame: true },
  { date: "Oct 4", opponent: "Local Team E", homeAway: "H" as const, result: "W" as const, score: "31-24", leagueGame: true },
  { date: "Oct 11", opponent: "Local Team F", homeAway: "H" as const, result: "W" as const, score: "38-7", leagueGame: false },
  { date: "Oct 18", opponent: "Local Team G", homeAway: "A" as const, result: "W" as const, score: "28-14", leagueGame: true },
  { date: "Oct 25", opponent: "Local Team H", homeAway: "H" as const, result: "L" as const, score: "21-24", leagueGame: true },
  { date: "Nov 1", opponent: "Local Team I", homeAway: "A" as const, result: "W" as const, score: "35-17", leagueGame: true },
  { date: "Nov 8", opponent: "Local Team J", homeAway: "H" as const, result: "W" as const, score: "42-28", leagueGame: false },
];

// Sample news articles
const SAMPLE_NEWS = [
  {
    title: "Team Wins Big on Road",
    image: "https://placehold.co/300x180/0a1628/f0a500?text=Game+Highlight",
    snippet: "Strong second-half performance leads to convincing victory.",
    date: "2 hours ago",
  },
  {
    title: "Star Player Named to All-League Team",
    image: "https://placehold.co/300x180/0a1628/f0a500?text=Player+Award",
    snippet: "Senior captain earns prestigious recognition for outstanding season.",
    date: "1 day ago",
  },
  {
    title: "Championship Run Continues",
    image: "https://placehold.co/300x180/0a1628/f0a500?text=Championship",
    snippet: "With latest victory, team keeps playoff hopes alive.",
    date: "3 days ago",
  },
  {
    title: "Coach Discusses Season Goals",
    image: "https://placehold.co/300x180/0a1628/f0a500?text=Coach+Interview",
    snippet: "Leadership talks strategy and team development plans.",
    date: "5 days ago",
  },
  {
    title: "New Training Facility Opens",
    image: "https://placehold.co/300x180/0a1628/f0a500?text=Facility",
    snippet: "State-of-the-art equipment enhances team preparation.",
    date: "1 week ago",
  },
  {
    title: "Student-Athletes Balance School and Sports",
    image: "https://placehold.co/300x180/0a1628/f0a500?text=Student+Life",
    snippet: "Team members excel both on field and in classroom.",
    date: "1 week ago",
  },
];

type TabType = "overview" | "stats" | "schedule" | "roster" | "news";

export default function TeamPageClient({
  team,
  school,
  teamSeasons,
  championships,
  alumni,
  sport,
  sportMeta,
}: TeamPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const winPct = ((team.currentRecord.wins / (team.currentRecord.wins + team.currentRecord.losses)) * 100).toFixed(1);
  const pointDiff = team.pointsFor - team.pointsAgainst;

  // Dynamic school colors for hero gradient
  const heroGradient = school.primary_color
    ? `linear-gradient(135deg, ${school.primary_color} 0%, ${school.secondary_color || school.primary_color} 100%)`
    : `linear-gradient(135deg, var(--psp-navy) 0%, ${sportMeta.color}33 100%)`;

  // Tab styling
  const tabClasses = (tab: TabType) =>
    `px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
      activeTab === tab
        ? `border-[var(--psp-gold)] text-[var(--psp-navy)]`
        : "border-transparent text-gray-500 hover:text-gray-700"
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
            <h3 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Right Now
            </h3>
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* This Week's Game */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                  This Week's Game
                </div>
                <div className="text-sm font-semibold text-[var(--psp-navy)] mb-1">
                  {SAMPLE_SCHEDULE.length > 0 ? SAMPLE_SCHEDULE[0].opponent : "TBA"}
                </div>
                <div className="text-xs text-gray-600">
                  {SAMPLE_SCHEDULE.length > 0 ? `${SAMPLE_SCHEDULE[0].homeAway === "H" ? "Home" : "Away"} • ${SAMPLE_SCHEDULE[0].date}` : "Season hasn't started yet"}
                </div>
              </div>

              {/* Current Record */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                  Season Record
                </div>
                <div className="text-xl font-black" style={{ color: school.primary_color || sportMeta.color, fontFamily: "'Bebas Neue', sans-serif" }}>
                  {team.currentRecord.wins}-{team.currentRecord.losses}{team.currentRecord.ties > 0 ? `-${team.currentRecord.ties}` : ""}
                </div>
              </div>

              {/* League Standing */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                  League Standing
                </div>
                <div className="text-xl font-black text-[var(--psp-gold)]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  TBA
                </div>
                <div className="text-xs text-gray-600 mt-1">in {team.league}</div>
              </div>

              {/* Next Opponent */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                  Next Opponent
                </div>
                <div className="text-sm font-semibold text-[var(--psp-navy)] mb-1">
                  {SAMPLE_SCHEDULE.length > 1 ? SAMPLE_SCHEDULE[1].opponent : SAMPLE_SCHEDULE[0]?.opponent || "TBA"}
                </div>
                <div className="text-xs text-gray-600">
                  {SAMPLE_SCHEDULE.length > 1 ? SAMPLE_SCHEDULE[1].date : (SAMPLE_SCHEDULE[0]?.date || "TBA")}
                </div>
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
                    className="text-xl font-bold mb-4"
                    style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    2024-25 Season Summary
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
                        {team.currentRecord.wins}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
                        {team.currentRecord.losses}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Losses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: "var(--psp-gold)" }}>
                        {team.pointsFor}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Points For</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: "#ef4444" }}>
                        {team.pointsAgainst}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Points Against</div>
                    </div>
                  </div>
                </div>

                {/* Recent News */}
                <div>
                  <h2
                    className="text-xl font-bold mb-4"
                    style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    Latest News
                  </h2>
                  <div className="space-y-4">
                    {SAMPLE_NEWS.slice(0, 3).map((article, idx) => (
                      <div key={idx} className="flex gap-4 bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-md transition-shadow">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={article.image}
                            alt={article.title}
                            width={96}
                            height={96}
                            sizes="96px"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-bold text-sm truncate"
                            style={{ color: "var(--psp-navy)" }}
                          >
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                            {article.snippet}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">{article.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <TeamStats team={team} />
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <TeamSchedule schedule={SAMPLE_SCHEDULE} />
            )}

            {/* Roster Tab */}
            {activeTab === "roster" && (
              <TeamRoster
                roster={getSampleRoster(sport)}
                positionGroups={getPositionGroups(sport)}
                sportMeta={sportMeta}
              />
            )}

            {/* Alumni Pipeline */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: 6, color: "var(--psp-navy)", fontFamily: "'Bebas Neue', sans-serif" }}>
                  🌍 Alumni Pipeline
                </h2>
                <Link href="/philly-everywhere" style={{ color: "var(--psp-navy)", textDecoration: "none", fontWeight: 700, fontSize: "0.875rem" }}>
                  Philly Everywhere →
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
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--psp-navy)" }}>Alumni {i + 1}</div>
                      <div style={{ fontSize: 11, color: "var(--g400)", marginTop: 2 }}>
                        {alum.destination_school || "TBA"} · {alum.destination_level || "TBA"}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--psp-gold)", fontWeight: 600, marginTop: 4 }}>
                        Class of {alum.graduation_year || "TBA"}
                      </div>
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
              <div className="space-y-4">
                {SAMPLE_NEWS.map((article, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={128}
                        height={128}
                        sizes="128px"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-base"
                        style={{ color: "var(--psp-navy)" }}
                      >
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {article.snippet}
                      </p>
                      <p className="text-xs text-gray-400 mt-3">{article.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Season History — clickable links to each year */}
            {teamSeasons && teamSeasons.length > 0 && (
              <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
                <div className="bg-[var(--psp-navy)] px-5 py-3" style={{ borderLeft: `4px solid var(--psp-gold)` }}>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    Season History
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {teamSeasons
                    .filter((ts) => ts.seasons?.label)
                    .sort((a, b) => (b.seasons?.year_start || 0) - (a.seasons?.year_start || 0))
                    .map((ts) => {
                      const label = ts.seasons!.label;
                      const w = ts.wins ?? 0;
                      const l = ts.losses ?? 0;
                      const t = ts.ties ?? 0;
                      const total = w + l;
                      const pct = total > 0 ? ((w / total) * 100).toFixed(0) : "—";
                      const isChampYear = championships.some(
                        (c) => c.season_id === ts.season_id
                      );
                      return (
                        <Link
                          key={ts.id}
                          href={`/${sport}/teams/${team.slug}/${label}`}
                          className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {isChampYear && (
                              <span className="text-base" title="Championship season">🏆</span>
                            )}
                            <span className="font-semibold text-sm" style={{ color: "var(--psp-navy)" }}>
                              {label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold" style={{ color: "var(--psp-navy)", fontFamily: "'Bebas Neue', sans-serif" }}>
                              {w}-{l}{t > 0 ? `-${t}` : ""}
                            </span>
                            <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
                            <span className="text-gray-300 group-hover:text-[var(--psp-gold)] transition-colors">→</span>
                          </div>
                        </Link>
                      );
                    })}
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <Link
                    href={`/${sport}/schools/${team.slug}`}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: "var(--psp-navy)" }}
                  >
                    View full program profile →
                  </Link>
                </div>
              </div>
            )}

            {/* Program History Timeline */}
            <div style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: 16, color: "var(--psp-navy)", fontFamily: "'Bebas Neue', sans-serif" }}>Program History</h2>
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
                  className="text-4xl font-bold mb-2"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  {team.currentRecord.wins}-{team.currentRecord.losses}
                </div>
                <div className="text-sm text-gray-500">{winPct}% Win Rate</div>
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
                    🏆 {team.championships}
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
                  View all {team.league} teams →
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
