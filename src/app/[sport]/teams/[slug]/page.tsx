"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META } from "@/lib/sports";
import AdPlaceholder, { LeaderboardAd, InContentAd } from "@/components/ads/AdPlaceholder";

// Team detail data structure
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

interface PlayerRoster {
  name: string;
  position: string;
  class: "Fr" | "So" | "Jr" | "Sr";
  height: string;
  weight: string;
  slug?: string;
}

interface ScheduleGame {
  date: string;
  opponent: string;
  homeAway: "H" | "A";
  result?: "W" | "L";
  score?: string;
  leagueGame: boolean;
}

// Team database
const TEAMS_DATABASE: Record<string, Record<string, TeamDetail>> = {
  football: {
    "st-josephs-prep": {
      id: "1",
      name: "St. Joseph's Prep",
      slug: "st-josephs-prep",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1851,
      coach: "Walt Snacks",
      currentRecord: { wins: 8, losses: 2, ties: 0 },
      pointsFor: 245,
      pointsAgainst: 89,
      championships: 9,
      recentChampionships: ["2024", "2023", "2021"],
    },
    "la-salle-college": {
      id: "2",
      name: "La Salle College High School",
      slug: "la-salle-college",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1890,
      coach: "John Blaine",
      currentRecord: { wins: 7, losses: 3, ties: 0 },
      pointsFor: 210,
      pointsAgainst: 115,
      championships: 3,
      recentChampionships: ["2019", "2015"],
    },
    "roman-catholic": {
      id: "3",
      name: "Roman Catholic High School",
      slug: "roman-catholic",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1890,
      coach: "Jody Hewitt",
      currentRecord: { wins: 6, losses: 4, ties: 0 },
      pointsFor: 198,
      pointsAgainst: 145,
      championships: 2,
      recentChampionships: ["2011"],
    },
    "archbishop-wood": {
      id: "4",
      name: "Archbishop Wood High School",
      slug: "archbishop-wood",
      city: "Warminster",
      state: "PA",
      league: "Catholic League",
      founded_year: 1968,
      coach: "Brett Heinrichs",
      currentRecord: { wins: 7, losses: 3, ties: 0 },
      pointsFor: 238,
      pointsAgainst: 98,
      championships: 5,
      recentChampionships: ["2020", "2019", "2014"],
    },
    "father-judge": {
      id: "5",
      name: "Father Judge High School",
      slug: "father-judge",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1959,
      coach: "Ed Butler",
      currentRecord: { wins: 5, losses: 5, ties: 0 },
      pointsFor: 156,
      pointsAgainst: 167,
      championships: 1,
      recentChampionships: [],
    },
    "bonner-prendie": {
      id: "6",
      name: "Bonner-Prendie High School",
      slug: "bonner-prendie",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1952,
      coach: "Jason Dershewitz",
      currentRecord: { wins: 4, losses: 6, ties: 0 },
      pointsFor: 134,
      pointsAgainst: 178,
      championships: 1,
      recentChampionships: [],
    },
    "neumann-goretti": {
      id: "7",
      name: "Neumann-Goretti High School",
      slug: "neumann-goretti",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1945,
      coach: "Curtis Young",
      currentRecord: { wins: 6, losses: 4, ties: 0 },
      pointsFor: 189,
      pointsAgainst: 112,
      championships: 3,
      recentChampionships: ["2022"],
    },
    "lansdale-catholic": {
      id: "8",
      name: "Lansdale Catholic High School",
      slug: "lansdale-catholic",
      city: "Lansdale",
      state: "PA",
      league: "Catholic League",
      founded_year: 1914,
      coach: "Kevin Blott",
      currentRecord: { wins: 5, losses: 5, ties: 0 },
      pointsFor: 167,
      pointsAgainst: 156,
      championships: 0,
      recentChampionships: [],
    },
    "imhotep-charter": {
      id: "9",
      name: "Imhotep Charter High School",
      slug: "imhotep-charter",
      city: "Philadelphia",
      state: "PA",
      league: "Public League",
      founded_year: 2000,
      coach: "Andre Johnson",
      currentRecord: { wins: 8, losses: 2, ties: 0 },
      pointsFor: 267,
      pointsAgainst: 76,
      championships: 2,
      recentChampionships: ["2024", "2023"],
    },
    "mlk": {
      id: "10",
      name: "Martin Luther King Jr. High School",
      slug: "mlk",
      city: "Philadelphia",
      state: "PA",
      league: "Public League",
      founded_year: 1972,
      coach: "J.C. Jackson",
      currentRecord: { wins: 5, losses: 5, ties: 0 },
      pointsFor: 145,
      pointsAgainst: 156,
      championships: 0,
      recentChampionships: [],
    },
    "northeast": {
      id: "11",
      name: "Northeast High School",
      slug: "northeast",
      city: "Philadelphia",
      state: "PA",
      league: "Public League",
      founded_year: 1906,
      coach: "Mike Catanese",
      currentRecord: { wins: 4, losses: 6, ties: 0 },
      pointsFor: 123,
      pointsAgainst: 189,
      championships: 0,
      recentChampionships: [],
    },
    "frankford": {
      id: "12",
      name: "Frankford High School",
      slug: "frankford",
      city: "Philadelphia",
      state: "PA",
      league: "Public League",
      founded_year: 1903,
      coach: "Marcus Townes",
      currentRecord: { wins: 3, losses: 7, ties: 0 },
      pointsFor: 98,
      pointsAgainst: 211,
      championships: 0,
      recentChampionships: [],
    },
  },
  basketball: {
    "st-josephs-prep": {
      id: "1",
      name: "St. Joseph's Prep",
      slug: "st-josephs-prep",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1851,
      coach: "Jack Ramsay III",
      currentRecord: { wins: 18, losses: 4, ties: 0 },
      pointsFor: 847,
      pointsAgainst: 612,
      championships: 2,
      recentChampionships: ["2022"],
    },
    "la-salle-college": {
      id: "2",
      name: "La Salle College High School",
      slug: "la-salle-college",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1890,
      coach: "Tom Markel",
      currentRecord: { wins: 20, losses: 2, ties: 0 },
      pointsFor: 912,
      pointsAgainst: 541,
      championships: 2,
      recentChampionships: ["2019"],
    },
    "roman-catholic": {
      id: "3",
      name: "Roman Catholic High School",
      slug: "roman-catholic",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1890,
      coach: "Sean O'Connell",
      currentRecord: { wins: 17, losses: 5, ties: 0 },
      pointsFor: 823,
      pointsAgainst: 598,
      championships: 4,
      recentChampionships: ["2017", "2013"],
    },
    "archbishop-wood": {
      id: "4",
      name: "Archbishop Wood High School",
      slug: "archbishop-wood",
      city: "Warminster",
      state: "PA",
      league: "Catholic League",
      founded_year: 1968,
      coach: "Mike Carey",
      currentRecord: { wins: 15, losses: 7, ties: 0 },
      pointsFor: 734,
      pointsAgainst: 654,
      championships: 1,
      recentChampionships: [],
    },
    "father-judge": {
      id: "5",
      name: "Father Judge High School",
      slug: "father-judge",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1959,
      coach: "Mark Piper",
      currentRecord: { wins: 14, losses: 8, ties: 0 },
      pointsFor: 689,
      pointsAgainst: 612,
      championships: 1,
      recentChampionships: ["2025"],
    },
    "bonner-prendie": {
      id: "6",
      name: "Bonner-Prendie High School",
      slug: "bonner-prendie",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1952,
      coach: "Pete Dougherty",
      currentRecord: { wins: 12, losses: 10, ties: 0 },
      pointsFor: 589,
      pointsAgainst: 623,
      championships: 0,
      recentChampionships: [],
    },
    "neumann-goretti": {
      id: "7",
      name: "Neumann-Goretti High School",
      slug: "neumann-goretti",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1945,
      coach: "Hoops Weaver",
      currentRecord: { wins: 16, losses: 6, ties: 0 },
      pointsFor: 834,
      pointsAgainst: 567,
      championships: 10,
      recentChampionships: ["2024", "2023", "2022", "2021", "2020"],
    },
    "lansdale-catholic": {
      id: "8",
      name: "Lansdale Catholic High School",
      slug: "lansdale-catholic",
      city: "Lansdale",
      state: "PA",
      league: "Catholic League",
      founded_year: 1914,
      coach: "Dan Magarity",
      currentRecord: { wins: 13, losses: 9, ties: 0 },
      pointsFor: 567,
      pointsAgainst: 591,
      championships: 0,
      recentChampionships: [],
    },
    "imhotep-charter": {
      id: "9",
      name: "Imhotep Charter High School",
      slug: "imhotep-charter",
      city: "Philadelphia",
      state: "PA",
      league: "Public League",
      founded_year: 2000,
      coach: "Omar Burgess",
      currentRecord: { wins: 20, losses: 2, ties: 0 },
      pointsFor: 945,
      pointsAgainst: 478,
      championships: 6,
      recentChampionships: ["2024", "2023", "2022", "2021", "2020"],
    },
    "mlk": {
      id: "10",
      name: "Martin Luther King Jr. High School",
      slug: "mlk",
      city: "Philadelphia",
      state: "PA",
      league: "Public League",
      founded_year: 1972,
      coach: "Tommy Butler",
      currentRecord: { wins: 14, losses: 8, ties: 0 },
      pointsFor: 612,
      pointsAgainst: 534,
      championships: 0,
      recentChampionships: [],
    },
    "northeast": {
      id: "11",
      name: "Northeast High School",
      slug: "northeast",
      city: "Philadelphia",
      state: "PA",
      league: "Public League",
      founded_year: 1906,
      coach: "Steve Reff",
      currentRecord: { wins: 11, losses: 11, ties: 0 },
      pointsFor: 534,
      pointsAgainst: 567,
      championships: 0,
      recentChampionships: [],
    },
    "frankford": {
      id: "12",
      name: "Frankford High School",
      slug: "frankford",
      city: "Philadelphia",
      state: "PA",
      league: "Public League",
      founded_year: 1903,
      coach: "Devon Akers",
      currentRecord: { wins: 9, losses: 13, ties: 0 },
      pointsFor: 423,
      pointsAgainst: 534,
      championships: 0,
      recentChampionships: [],
    },
  },
  baseball: {
    "la-salle-college": {
      id: "2",
      name: "La Salle College High School",
      slug: "la-salle-college",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1890,
      coach: "Adrian Beltré",
      currentRecord: { wins: 12, losses: 8, ties: 0 },
      pointsFor: 245,
      pointsAgainst: 187,
      championships: 3,
      recentChampionships: ["2021", "2014", "2012"],
    },
    "father-judge": {
      id: "5",
      name: "Father Judge High School",
      slug: "father-judge",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1959,
      coach: "Pat Burrell",
      currentRecord: { wins: 14, losses: 6, ties: 0 },
      pointsFor: 267,
      pointsAgainst: 145,
      championships: 1,
      recentChampionships: ["2023"],
    },
    "roman-catholic": {
      id: "3",
      name: "Roman Catholic High School",
      slug: "roman-catholic",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1890,
      coach: "Joe Carter",
      currentRecord: { wins: 11, losses: 9, ties: 0 },
      pointsFor: 198,
      pointsAgainst: 212,
      championships: 0,
      recentChampionships: [],
    },
    "neumann-goretti": {
      id: "7",
      name: "Neumann-Goretti High School",
      slug: "neumann-goretti",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1945,
      coach: "Jimmy Rollins",
      currentRecord: { wins: 13, losses: 7, ties: 0 },
      pointsFor: 234,
      pointsAgainst: 156,
      championships: 3,
      recentChampionships: ["2024", "2017", "2016"],
    },
    "archbishop-wood": {
      id: "4",
      name: "Archbishop Wood High School",
      slug: "archbishop-wood",
      city: "Warminster",
      state: "PA",
      league: "Catholic League",
      founded_year: 1968,
      coach: "Curt Simmons",
      currentRecord: { wins: 10, losses: 10, ties: 0 },
      pointsFor: 167,
      pointsAgainst: 178,
      championships: 0,
      recentChampionships: [],
    },
    "bonner-prendie": {
      id: "6",
      name: "Bonner-Prendie High School",
      slug: "bonner-prendie",
      city: "Philadelphia",
      state: "PA",
      league: "Catholic League",
      founded_year: 1952,
      coach: "Roy Halladay",
      currentRecord: { wins: 9, losses: 11, ties: 0 },
      pointsFor: 145,
      pointsAgainst: 198,
      championships: 0,
      recentChampionships: [],
    },
    "penn-charter": {
      id: "13",
      name: "Penn Charter",
      slug: "penn-charter",
      city: "Philadelphia",
      state: "PA",
      league: "Inter-Ac League",
      founded_year: 1751,
      coach: "Mike Piazza",
      currentRecord: { wins: 12, losses: 8, ties: 0 },
      pointsFor: 267,
      pointsAgainst: 145,
      championships: 6,
      recentChampionships: ["2015", "2012"],
    },
    "haverford-school": {
      id: "14",
      name: "Haverford School",
      slug: "haverford-school",
      city: "Haverford",
      state: "PA",
      league: "Inter-Ac League",
      founded_year: 1884,
      coach: "Ryan Howard",
      currentRecord: { wins: 10, losses: 10, ties: 0 },
      pointsFor: 187,
      pointsAgainst: 201,
      championships: 2,
      recentChampionships: [],
    },
    "episcopal-academy": {
      id: "15",
      name: "Episcopal Academy",
      slug: "episcopal-academy",
      city: "Newtown",
      state: "PA",
      league: "Inter-Ac League",
      founded_year: 1785,
      coach: "Gavvy Cravath",
      currentRecord: { wins: 11, losses: 9, ties: 0 },
      pointsFor: 201,
      pointsAgainst: 178,
      championships: 0,
      recentChampionships: [],
    },
    "malvern-prep": {
      id: "16",
      name: "Malvern Prep",
      slug: "malvern-prep",
      city: "Malvern",
      state: "PA",
      league: "Independent",
      founded_year: 1842,
      coach: "Tug McGraw",
      currentRecord: { wins: 14, losses: 6, ties: 0 },
      pointsFor: 289,
      pointsAgainst: 134,
      championships: 1,
      recentChampionships: ["2011"],
    },
  },
};

// Sample roster data (same for all teams, just dummy data)
const SAMPLE_ROSTER: PlayerRoster[] = [
  { name: "James Martinez", position: "QB", class: "Sr", height: "6'2\"", weight: "210", slug: "james-martinez" },
  { name: "DeShawn Johnson", position: "RB", class: "Sr", height: "5'10\"", weight: "195", slug: "deshawn-johnson" },
  { name: "Marcus White", position: "WR", class: "Jr", height: "6'1\"", weight: "185", slug: "marcus-white" },
  { name: "Kevin Brown", position: "OL", class: "Sr", height: "6'3\"", weight: "295", slug: "kevin-brown" },
  { name: "David Lee", position: "OL", class: "Jr", height: "6'4\"", weight: "305", slug: "david-lee" },
  { name: "Alex Garcia", position: "TE", class: "So", height: "6'4\"", weight: "235", slug: "alex-garcia" },
  { name: "Tyler Jackson", position: "DE", class: "Sr", height: "6'2\"", weight: "245", slug: "tyler-jackson" },
  { name: "Michael Davis", position: "LB", class: "Jr", height: "6'0\"", weight: "225", slug: "michael-davis" },
  { name: "Christopher Miller", position: "DB", class: "Sr", height: "5'11\"", weight: "190", slug: "christopher-miller" },
  { name: "Brandon Wilson", position: "DB", class: "Jr", height: "5'10\"", weight: "185", slug: "brandon-wilson" },
  { name: "Ryan Anderson", position: "LB", class: "So", height: "6'1\"", weight: "215", slug: "ryan-anderson" },
  { name: "Jason Thomas", position: "DE", class: "So", height: "6'3\"", weight: "250", slug: "jason-thomas" },
  { name: "Justin Moore", position: "RB", class: "Fr", height: "5'9\"", weight: "190", slug: "justin-moore" },
  { name: "Ethan Harris", position: "WR", class: "Fr", height: "6'0\"", weight: "175", slug: "ethan-harris" },
  { name: "Jamal Lewis", position: "OL", class: "Fr", height: "6'2\"", weight: "280", slug: "jamal-lewis" },
];

// Sample schedule data
const SAMPLE_SCHEDULE: ScheduleGame[] = [
  { date: "Sept 6", opponent: "Local Team A", homeAway: "H", result: "W", score: "35-14", leagueGame: true },
  { date: "Sept 13", opponent: "Local Team B", homeAway: "A", result: "W", score: "28-21", leagueGame: true },
  { date: "Sept 20", opponent: "Local Team C", homeAway: "H", result: "W", score: "42-10", leagueGame: true },
  { date: "Sept 27", opponent: "Local Team D", homeAway: "A", result: "L", score: "17-20", leagueGame: true },
  { date: "Oct 4", opponent: "Local Team E", homeAway: "H", result: "W", score: "31-24", leagueGame: true },
  { date: "Oct 11", opponent: "Local Team F", homeAway: "H", result: "W", score: "38-7", leagueGame: false },
  { date: "Oct 18", opponent: "Local Team G", homeAway: "A", result: "W", score: "28-14", leagueGame: true },
  { date: "Oct 25", opponent: "Local Team H", homeAway: "H", result: "L", score: "21-24", leagueGame: true },
  { date: "Nov 1", opponent: "Local Team I", homeAway: "A", result: "W", score: "35-17", leagueGame: true },
  { date: "Nov 8", opponent: "Local Team J", homeAway: "H", result: "W", score: "42-28", leagueGame: false },
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

export default function TeamDetailPage() {
  const params = useParams();
  const sport = params.sport as string;
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (!isValidSport(sport)) notFound();

  const sportMeta = SPORT_META[sport as keyof typeof SPORT_META];
  const team = (TEAMS_DATABASE as any)[sport]?.[slug];

  if (!team) notFound();

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
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, ${sportMeta.color}22 100%)` }}
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
                style={{ fontFamily: "Barlow Condensed, sans-serif" }}
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
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                {team.currentRecord.wins}-{team.currentRecord.losses}
              </div>
              <div className="text-xs text-gray-400">Current Record</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                {winPct}%
              </div>
              <div className="text-xs text-gray-400">Win %</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                {team.championships}
              </div>
              <div className="text-xs text-gray-400">Championships</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold" style={{ color: pointDiff > 0 ? "#22c55e" : "#ef4444", fontFamily: "Barlow Condensed, sans-serif" }}>
                {pointDiff > 0 ? "+" : ""}{pointDiff}
              </div>
              <div className="text-xs text-gray-400">Point Diff</div>
            </div>
          </div>
        </div>
      </section>

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
                    style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}
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
                    style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}
                  >
                    Latest News
                  </h2>
                  <div className="space-y-4">
                    {SAMPLE_NEWS.slice(0, 3).map((article, idx) => (
                      <div key={idx} className="flex gap-4 bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-md transition-shadow">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />
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
                    style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}
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
                    style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}
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

            {/* News Tab */}
            {activeTab === "news" && (
              <div className="space-y-4">
                {SAMPLE_NEWS.map((article, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                    />
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
                  style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}
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
                      {team.recentChampionships.map((year: any) => (
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
            url: `https://phillysportspack.com/${sport}/teams/${slug}`,
            coach: team.coach,
          }),
        }}
      />
    </>
  );
}
