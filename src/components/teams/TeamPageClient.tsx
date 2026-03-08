"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdPlaceholder from "@/components/ads/AdPlaceholder";

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

// Sample roster data (same for all teams, just dummy data)
const SAMPLE_ROSTER = [
  { name: "James Martinez", position: "QB", class: "Sr" as const, height: '6\'2"', weight: "210", slug: "james-martinez" },
  { name: "DeShawn Johnson", position: "RB", class: "Sr" as const, height: '5\'10"', weight: "195", slug: "deshawn-johnson" },
  { name: "Marcus White", position: "WR", class: "Jr" as const, height: '6\'1"', weight: "185", slug: "marcus-white" },
  { name: "Kevin Brown", position: "OL", class: "Sr" as const, height: '6\'3"', weight: "295", slug: "kevin-brown" },
  { name: "David Lee", position: "OL", class: "Jr" as const, height: '6\'4"', weight: "305", slug: "david-lee" },
  { name: "Alex Garcia", position: "TE", class: "So" as const, height: '6\'4"', weight: "235", slug: "alex-garcia" },
  { name: "Tyler Jackson", position: "DE", class: "Sr" as const, height: '6\'2"', weight: "245", slug: "tyler-jackson" },
  { name: "Michael Davis", position: "LB", class: "Jr" as const, height: '6\'0"', weight: "225", slug: "michael-davis" },
  { name: "Christopher Miller", position: "DB", class: "Sr" as const, height: '5\'11"', weight: "190", slug: "christopher-miller" },
  { name: "Brandon Wilson", position: "DB", class: "Jr" as const, height: '5\'10"', weight: "185", slug: "brandon-wilson" },
];

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

  // Tab styling
  const tabClasses = (tab: TabType) =>
    `px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
      activeTab === tab
        ? `border-[var(--psp-gold)] text-[var(--psp-navy)]`
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`;

  return (
    <>
      {/* Team Header */}
      <section
        className="py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, ${sportMeta.color}33 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href={`/${sport}`} className="hover:text-white transition-colors">
              {sportMeta.name}
            </Link>
            <span>/</span>
            <Link href={`/${sport}/teams`} className="hover:text-white transition-colors">
              Teams
            </Link>
            <span>/</span>
            <span className="text-white">{team.name}</span>
          </div>

          <div className="flex items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ background: `${sportMeta.color}20` }}
            >
              {sportMeta.emoji}
            </div>
            <div>
              <h1
                className="text-4xl md:text-5xl text-white mb-2 tracking-wider"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {team.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <span style={{ color: "var(--psp-gold)" }}>{team.league}</span>

                <span className="text-gray-400">
                  {team.city}, {team.state}
                </span>
              </div>
            </div>
          </div>

          {/* Stat bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl">
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {team.currentRecord.wins}-{team.currentRecord.losses}
              </div>
              <div className="text-xs text-gray-400">Current Record</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {winPct}%
              </div>
              <div className="text-xs text-gray-400">Win %</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {team.championships}
              </div>
              <div className="text-xs text-gray-400">Championships</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold" style={{ color: pointDiff > 0 ? "#22c55e" : "#ef4444", fontFamily: "Bebas Neue, sans-serif" }}>
                {pointDiff > 0 ? "+" : ""}{pointDiff}
              </div>
              <div className="text-xs text-gray-400">Point Diff</div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Now Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div style={{
          background: "var(--psp-white)",
          border: "1px solid var(--g100)",
          borderRadius: 8,
          padding: "16px 20px",
          borderLeft: `4px solid ${sportMeta.color}`,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: sportMeta.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            Right Now
          </h3>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 2 }}>Current Record</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--psp-navy)", fontFamily: "'Bebas Neue', sans-serif" }}>
                {team.currentRecord.wins}-{team.currentRecord.losses}{team.currentRecord.ties > 0 ? `-${team.currentRecord.ties}` : ""}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 2 }}>Championships</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--psp-gold)", fontFamily: "'Bebas Neue', sans-serif" }}>
                {team.championships}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 2 }}>Points For/Against</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--psp-navy)", fontFamily: "'Bebas Neue', sans-serif" }}>
                {team.pointsFor}/{team.pointsAgainst}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 2 }}>Head Coach</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--psp-navy)" }}>
                {team.coach}
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
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-6">
                  <h2
                    className="text-xl font-bold mb-4"
                    style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    Team Statistics
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-[var(--psp-gray-200)]">
                          <td className="py-2 font-medium" style={{ color: "var(--psp-navy)" }}>
                            Record
                          </td>
                          <td className="py-2 text-right">
                            {team.currentRecord.wins}-{team.currentRecord.losses}
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--psp-gray-200)]">
                          <td className="py-2 font-medium" style={{ color: "var(--psp-navy)" }}>
                            Points For
                          </td>
                          <td className="py-2 text-right">{team.pointsFor}</td>
                        </tr>
                        <tr className="border-b border-[var(--psp-gray-200)]">
                          <td className="py-2 font-medium" style={{ color: "var(--psp-navy)" }}>
                            Points Against
                          </td>
                          <td className="py-2 text-right">{team.pointsAgainst}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium" style={{ color: "var(--psp-navy)" }}>
                            Point Differential
                          </td>
                          <td
                            className="py-2 text-right font-bold"
                            style={{
                              color: pointDiff > 0 ? "#22c55e" : "#ef4444",
                            }}
                          >
                            {pointDiff > 0 ? "+" : ""}{pointDiff}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Leaders */}
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-6">
                  <h2
                    className="text-xl font-bold mb-4"
                    style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    Statistical Leaders
                  </h2>
                  <div className="space-y-3">
                    {[
                      { name: "James Martinez", stat: "12 Passing TDs" },
                      { name: "DeShawn Johnson", stat: "156 Rushing Yards" },
                      { name: "Marcus White", stat: "8 Receiving Yards" },
                    ].map((leader, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span style={{ color: "var(--psp-navy)" }}>{leader.name}</span>
                        <span className="font-bold" style={{ color: "var(--psp-gold)" }}>
                          {leader.stat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: "var(--psp-navy)", color: "white" }}>
                          <th className="px-4 py-3 text-left font-bold">Date</th>
                          <th className="px-4 py-3 text-left font-bold">Opponent</th>
                          <th className="px-4 py-3 text-center font-bold">H/A</th>
                          <th className="px-4 py-3 text-center font-bold">Result</th>
                          <th className="px-4 py-3 text-right font-bold">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SAMPLE_SCHEDULE.map((game, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-[var(--psp-gray-200)] hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-gray-600">
                              {game.date}
                            </td>
                            <td className="px-4 py-3">
                              <span style={{ color: "var(--psp-navy)" }}>
                                {game.opponent}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-xs font-bold">
                              {game.homeAway}
                            </td>
                            <td
                              className="px-4 py-3 text-center font-bold text-sm"
                              style={{
                                color: game.result === "W" ? "#22c55e" : "#ef4444",
                              }}
                            >
                              {game.result}
                            </td>
                            <td className="px-4 py-3 text-right font-bold">
                              {game.score}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Roster Tab */}
            {activeTab === "roster" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: "var(--psp-navy)", color: "white" }}>
                          <th className="px-4 py-3 text-left font-bold">Name</th>
                          <th className="px-4 py-3 text-left font-bold">Position</th>
                          <th className="px-4 py-3 text-center font-bold">Class</th>
                          <th className="px-4 py-3 text-center font-bold">HT</th>
                          <th className="px-4 py-3 text-center font-bold">WT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SAMPLE_ROSTER.map((player, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-[var(--psp-gray-200)] hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium">
                              <Link
                                href={`/${sport}/players/${player.slug}`}
                                className="hover:underline"
                                style={{ color: "var(--psp-navy)" }}
                              >
                                {player.name}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {player.position}
                            </td>
                            <td className="px-4 py-3 text-center text-xs font-bold">
                              {player.class}
                            </td>
                            <td className="px-4 py-3 text-center text-xs">
                              {player.height}
                            </td>
                            <td className="px-4 py-3 text-center text-xs">
                              {player.weight}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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

            {/* Program History */}
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

            {/* Ad Space */}
            <AdPlaceholder size="sidebar-rect" id="psp-team-rail" />

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
