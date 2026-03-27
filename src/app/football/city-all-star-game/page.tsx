import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { createStaticClient } from "@/lib/supabase/static";
import AllStarArchive from "./AllStarArchive";

export const revalidate = 3600;

interface GameData {
  year: number;
  score: string;
  [key: string]: unknown;
}

interface CombinedData {
  metadata: {
    title: string;
    total_games: number;
    year_range: { start: number; end: number };
  };
  games: GameData[];
  td_leaders?: unknown[];
  rosters?: Record<string, unknown>;
}

interface RecordsData {
  individual_records?: Record<string, unknown>;
}

interface DbGame {
  id: number;
  year: number;
  game_number: number;
  public_score: number;
  nonpublic_score: number;
  winner: string;
  location: string | null;
  game_date: string | null;
  attendance: number | null;
  notes: string | null;
  silary_summary_url: string | null;
}

export const metadata: Metadata = {
  title:
    "Philadelphia City All-Star Football Game | PASFG | PhillySportsPack",
  description:
    "The Philadelphia City All-Star Football Game -- Public League vs Non-Public since 1975. $400,000+ in scholarships to 600+ students. Game history, rosters, records, and 2025 event info.",
  alternates: {
    canonical: "https://phillysportspack.com/football/city-all-star-game",
  },
  openGraph: {
    title: "Philadelphia City All-Star Football Game",
    description:
      "Public League vs Non-Public since 1975. $400,000+ in scholarships to 600+ students. Full game history, rosters, and records.",
    type: "website",
  },
};

async function getDbGames(): Promise<DbGame[]> {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("city_allstar_games")
      .select("*")
      .order("year", { ascending: false });

    if (error) {
      console.warn("[PSP] Failed to fetch city_allstar_games:", error.message);
      return [];
    }
    return (data as DbGame[]) || [];
  } catch {
    return [];
  }
}

export default async function CityAllStarGamePage() {
  // Load JSON archive data
  const gamesPath = path.join(
    process.cwd(),
    "public/data/city-allstar-games.json"
  );
  const recordsPath = path.join(
    process.cwd(),
    "public/data/city-allstar-records.json"
  );

  let gamesData: CombinedData = {
    metadata: {
      title: "",
      total_games: 0,
      year_range: { start: 1975, end: 2019 },
    },
    games: [],
  };
  let recordsData: RecordsData = {};

  try {
    gamesData = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
  } catch (e) {
    console.warn("Failed to load games data:", e);
  }

  try {
    recordsData = JSON.parse(fs.readFileSync(recordsPath, "utf-8"));
  } catch (e) {
    console.warn("Failed to load records data:", e);
  }

  // Load DB games
  const dbGames = await getDbGames();

  // Calculate series record from JSON data
  let publicWins = 0;
  let nonPublicWins = 0;
  let ties = 0;

  for (const game of gamesData.games) {
    const scoreUpper = game.score.toUpperCase();
    const parts = scoreUpper.split(",").map((p) => p.trim());

    if (parts.length === 2) {
      const firstWords = parts[0].split(" ");
      const secondWords = parts[1].split(" ");
      const firstScore = parseInt(firstWords[firstWords.length - 1] || "0", 10);
      const secondScore = parseInt(
        secondWords[secondWords.length - 1] || "0",
        10
      );
      const firstName = firstWords.slice(0, -1).join(" ").trim();

      if (firstScore > secondScore) {
        if (firstName === "PUBLIC") publicWins++;
        else nonPublicWins++;
      } else if (secondScore > firstScore) {
        if (firstName === "PUBLIC") nonPublicWins++;
        else publicWins++;
      } else {
        ties++;
      }
    }
  }

  const totalGames = gamesData.games.length;
  const totalTds = gamesData.games.reduce(
    (sum, g) => sum + ((g.touchdowns as unknown[])?.length || 0),
    0
  );

  const breadcrumbs = [
    { name: "Home", url: "https://phillysportspack.com/" },
    { name: "Football", url: "https://phillysportspack.com/football" },
    {
      name: "City All-Star Game",
      url: "https://phillysportspack.com/football/city-all-star-game",
    },
  ];

  /* ── Season schedule ── */
  const schedule = [
    {
      date: "Feb 11",
      event: "Selection Night",
      detail: "Northeast HS, 6:30pm",
    },
    {
      date: "Mar 11",
      event: "Parent's Night",
      detail: "Lincoln HS, 6:30pm",
    },
    {
      date: "Apr 5",
      event: "Picture / Media Day",
      detail: "Lincoln HS, 8-11am",
    },
    { date: "May 2", event: "AD Book Deadline", detail: "" },
    { date: "May 6", event: "Banquet Money Deadline", detail: "" },
    {
      date: "May 12",
      event: "All-Star Banquet",
      detail: "FOP Lodge #5, 6:30pm",
    },
    {
      date: "May 17",
      event: "All-Star Game",
      detail: "Northeast HS, 1:00pm",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--psp-navy)] text-white">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Breadcrumbs */}
      <div className="border-b border-[var(--psp-gold)]/20">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb
            items={breadcrumbs.map((b) => ({ label: b.name, href: b.url }))}
          />
        </div>
      </div>

      {/* ══════════ 1. HERO ══════════ */}
      <section className="relative border-b border-[var(--psp-gold)]/30 overflow-hidden">
        {/* Gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--psp-gold)]" />

        {/* Turf texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 4px)",
          }}
        />

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--psp-gold)]/15 border border-[var(--psp-gold)]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[var(--psp-gold)] text-xs font-bold tracking-widest uppercase">
                PASFG
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--psp-gold)]" />
              <span className="text-[var(--psp-gold)] text-xs font-bold tracking-widest uppercase">
                Since 1975
              </span>
            </div>

            <h1
              className="psp-h1-lg text-white mb-3"
              style={{ lineHeight: 1.1 }}
            >
              The Philadelphia City All-Star Football Game
            </h1>

            <p
              className="text-[var(--psp-gold)] text-lg md:text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
            >
              Public vs. Non-Public Since 1975
            </p>

            <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
              Supporting Scholar Athletes &mdash; $400,000+ in Scholarships to
              600+ Students
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ 2. 2025 EVENT INFO ══════════ */}
      <section className="border-b border-[var(--psp-gold)]/30">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[var(--psp-navy-mid)] rounded-xl border border-[var(--psp-gold)]/30 overflow-hidden">
              {/* Header bar */}
              <div className="bg-[var(--psp-gold)] px-6 py-3">
                <h2
                  className="text-[var(--psp-navy)] text-center font-bold tracking-wide"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "1.5rem",
                    letterSpacing: "0.06em",
                  }}
                >
                  48th Annual City All-Star Game
                </h2>
              </div>

              <div className="p-6 md:p-8 text-center space-y-4">
                <div className="space-y-1">
                  <p
                    className="text-white text-2xl font-bold"
                    style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
                  >
                    Saturday, May 17, 2025
                  </p>
                  <p className="text-[var(--psp-gold)] text-lg font-semibold">
                    Kickoff at 1:00 PM
                  </p>
                </div>

                <div className="w-12 h-px bg-[var(--psp-gold)]/40 mx-auto" />

                <div className="space-y-1">
                  <p className="text-white font-semibold text-lg">
                    Charlie Martin Stadium
                  </p>
                  <p className="text-gray-400">Northeast High School</p>
                  <p className="text-gray-500 text-sm">
                    Gates open at noon
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded-full px-3 py-1 text-xs font-bold tracking-wide">
                    PUBLIC LEAGUE
                  </span>
                  <span className="text-gray-500 text-sm self-center">vs</span>
                  <span className="inline-flex items-center gap-1.5 bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded-full px-3 py-1 text-xs font-bold tracking-wide">
                    NON-PUBLIC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 3. SEASON SCHEDULE ══════════ */}
      <section className="border-b border-[var(--psp-gold)]/30">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-[var(--psp-gold)] mb-6 text-center"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.75rem",
                letterSpacing: "0.04em",
              }}
            >
              2025 Season Schedule (Completed)
            </h2>

            <p
              className="text-gray-400 text-sm text-center mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              2026 schedule will be announced soon.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--psp-gold)]/30">
                    <th className="px-4 py-3 text-[var(--psp-gold)] text-xs font-bold tracking-widest uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-[var(--psp-gold)] text-xs font-bold tracking-widest uppercase">
                      Event
                    </th>
                    <th className="px-4 py-3 text-[var(--psp-gold)] text-xs font-bold tracking-widest uppercase hidden sm:table-cell">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row, i) => {
                    const isGameDay = row.event === "All-Star Game";
                    return (
                      <tr
                        key={i}
                        className={`border-b border-white/5 transition-colors ${
                          isGameDay
                            ? "bg-[var(--psp-gold)]/10"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <td
                          className={`px-4 py-3 font-semibold text-sm whitespace-nowrap ${
                            isGameDay ? "text-[var(--psp-gold)]" : "text-white"
                          }`}
                        >
                          {row.date}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm ${
                            isGameDay
                              ? "text-[var(--psp-gold)] font-bold"
                              : "text-gray-200"
                          }`}
                        >
                          {row.event}
                          {row.detail && (
                            <span className="sm:hidden text-gray-400 block text-xs mt-0.5">
                              {row.detail}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400 hidden sm:table-cell">
                          {row.detail}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 4. HOW PLAYERS ARE SELECTED ══════════ */}
      <section className="border-b border-[var(--psp-gold)]/30">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-[var(--psp-gold)] mb-6 text-center"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.75rem",
                letterSpacing: "0.04em",
              }}
            >
              How Players Are Selected
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-5 text-center">
                <p
                  className="text-[var(--psp-gold)] text-3xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  100
                </p>
                <p className="text-white font-semibold text-sm mb-1">
                  Top Players Selected
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  The best senior football players from across Philadelphia
                </p>
              </div>

              <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-5 text-center">
                <p
                  className="text-[var(--psp-gold)] text-3xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  SCHOLAR
                </p>
                <p className="text-white font-semibold text-sm mb-1">
                  Academic Excellence
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Selected on grades, class rank, SAT/ACT scores
                </p>
              </div>

              <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-5 text-center">
                <p
                  className="text-blue-300 text-lg font-bold mb-0.5"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  PUBLIC
                </p>
                <p className="text-gray-500 text-xs mb-0.5">vs</p>
                <p
                  className="text-purple-300 text-lg font-bold mb-2"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  NON-PUBLIC
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Catholic League + Inter-Ac + private schools
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 5. SCHOLARSHIP IMPACT ══════════ */}
      <section className="border-b border-[var(--psp-gold)]/30 bg-[var(--psp-navy-mid)]">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-[var(--psp-gold)] mb-8"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.75rem",
                letterSpacing: "0.04em",
              }}
            >
              Scholarship Impact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="bg-[var(--psp-gold)]/10 border-2 border-[var(--psp-gold)]/40 rounded-xl p-6">
                <p
                  className="text-[var(--psp-gold)] text-4xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  $400,000+
                </p>
                <p className="text-gray-300 text-sm font-semibold">
                  In Scholarships
                </p>
              </div>

              <div className="bg-[var(--psp-gold)]/10 border-2 border-[var(--psp-gold)]/40 rounded-xl p-6">
                <p
                  className="text-[var(--psp-gold)] text-4xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  600+
                </p>
                <p className="text-gray-300 text-sm font-semibold">
                  Students Since 1975
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS STRIP ══════════ */}
      <section className="border-b border-[var(--psp-gold)]/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 text-center">
              <p className="text-[var(--psp-gold)] text-xs font-semibold mb-1">
                SERIES
              </p>
              <p className="font-bebas-neue text-2xl font-bold">
                {nonPublicWins}-{publicWins}
                {ties > 0 ? `-${ties}` : ""}
              </p>
              <p className="text-gray-300 text-xs">Non-Public leads</p>
            </div>
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 text-center">
              <p className="text-[var(--psp-gold)] text-xs font-semibold mb-1">
                GAMES
              </p>
              <p className="font-bebas-neue text-2xl font-bold">
                {totalGames}
              </p>
              <p className="text-gray-300 text-xs">1975-2019</p>
            </div>
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 text-center">
              <p className="text-blue-400 text-xs font-semibold mb-1">
                PUBLIC
              </p>
              <p className="font-bebas-neue text-2xl font-bold">
                {publicWins}
              </p>
              <p className="text-gray-300 text-xs">
                {totalGames > 0
                  ? ((publicWins / totalGames) * 100).toFixed(0)
                  : 0}
                % win rate
              </p>
            </div>
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 text-center">
              <p className="text-purple-400 text-xs font-semibold mb-1">
                NON-PUBLIC
              </p>
              <p className="font-bebas-neue text-2xl font-bold">
                {nonPublicWins}
              </p>
              <p className="text-gray-300 text-xs">
                {totalGames > 0
                  ? ((nonPublicWins / totalGames) * 100).toFixed(0)
                  : 0}
                % win rate
              </p>
            </div>
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 text-center">
              <p className="text-[var(--psp-gold)] text-xs font-semibold mb-1">
                TOUCHDOWNS
              </p>
              <p className="font-bebas-neue text-2xl font-bold">{totalTds}</p>
              <p className="text-gray-300 text-xs">All-time scored</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 6. HISTORICAL GAME RESULTS ══════════ */}
      <section className="container mx-auto px-4 py-12">
        <h2
          className="text-[var(--psp-gold)] mb-6 text-center"
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "1.75rem",
            letterSpacing: "0.04em",
          }}
        >
          Historical Game Results
        </h2>

        {/* DB Games (if any) */}
        {dbGames.length > 0 ? (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--psp-gold)]/30">
                    <th className="px-3 py-2 text-[var(--psp-gold)] text-xs font-bold tracking-widest uppercase">
                      Year
                    </th>
                    <th className="px-3 py-2 text-[var(--psp-gold)] text-xs font-bold tracking-widest uppercase">
                      Public
                    </th>
                    <th className="px-3 py-2 text-[var(--psp-gold)] text-xs font-bold tracking-widest uppercase">
                      Non-Public
                    </th>
                    <th className="px-3 py-2 text-[var(--psp-gold)] text-xs font-bold tracking-widest uppercase">
                      Winner
                    </th>
                    <th className="px-3 py-2 text-[var(--psp-gold)] text-xs font-bold tracking-widest uppercase hidden sm:table-cell">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dbGames.map((g) => (
                    <tr
                      key={g.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-3 py-2 font-bold text-white">
                        {g.year}
                      </td>
                      <td className="px-3 py-2 text-blue-300">
                        {g.public_score}
                      </td>
                      <td className="px-3 py-2 text-purple-300">
                        {g.nonpublic_score}
                      </td>
                      <td className="px-3 py-2 text-[var(--psp-gold)] font-semibold">
                        {g.winner}
                      </td>
                      <td className="px-3 py-2 text-gray-400 hidden sm:table-cell">
                        {g.location || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-6 text-center">
              <p className="text-gray-300 mb-2">
                Structured game history coming soon.
              </p>
              <p className="text-gray-500 text-sm">
                For detailed game summaries by Ted Silary, visit{" "}
                <a
                  href="http://phillyallstarfb.com/game-summaries.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] underline transition-colors"
                >
                  phillyallstarfb.com/game-summaries
                </a>
              </p>
            </div>
          </div>
        )}

        {/* JSON Archive (detailed game cards) */}
        {gamesData.games.length > 0 && (
          <AllStarArchive
            games={gamesData.games as any}
            records={recordsData.individual_records as any}
            tdLeaders={gamesData.td_leaders as any}
            rosters={gamesData.rosters as any}
          />
        )}
      </section>

      {/* ══════════ 7. HOF CROSS-LINK ══════════ */}
      <section className="border-t border-b border-[var(--psp-gold)]/30 bg-[var(--psp-navy-mid)]">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[var(--psp-navy)] rounded-xl border border-[var(--psp-gold)]/30 p-6 md:p-8">
              {/* HOF badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-[var(--psp-gold)]/15 border border-[var(--psp-gold)]/30 rounded-full px-3 py-1 text-xs font-bold tracking-wider text-[var(--psp-gold)] uppercase">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Hall of Fame
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                This game is organized in partnership with the Philadelphia City
                All Star Chapter of the PA Sports Hall of Fame. Explore the
                inductees who have been honored for their athletic excellence
                across Philadelphia.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/hof/city-all-star"
                  className="inline-flex items-center gap-2 bg-[var(--psp-gold)] hover:bg-[var(--psp-gold-light)] text-[var(--psp-navy)] font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
                >
                  City All-Star HOF Inductees
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>

                <Link
                  href="/hof"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors border border-white/10"
                >
                  Ted Silary Hall of Fame
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 8. CONTACT & SOCIAL ══════════ */}
      <section className="border-b border-[var(--psp-gold)]/30">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-[var(--psp-gold)] mb-6 text-center"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.75rem",
                letterSpacing: "0.04em",
              }}
            >
              Contact &amp; Social
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organization */}
              <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-5">
                <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wide">
                  Organization
                </h3>
                <p className="text-gray-300 text-sm mb-1">
                  Philadelphia All Star Football Game (PASFG)
                </p>
                <p className="text-gray-400 text-sm mb-2">
                  Contact: Doug Macauley
                </p>
                <a
                  href="http://phillyallstarfb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--psp-gold)] text-sm hover:text-[var(--psp-gold-light)] transition-colors underline"
                >
                  phillyallstarfb.com
                </a>
              </div>

              {/* Social */}
              <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-5">
                <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wide">
                  Social Media
                </h3>
                <div className="space-y-2">
                  <a
                    href="https://twitter.com/PASFG215"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-[var(--psp-gold)] transition-colors text-sm"
                  >
                    <span className="w-5 text-center">X</span>
                    @PASFG215
                  </a>
                  <a
                    href="https://facebook.com/PASFG215"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-[var(--psp-gold)] transition-colors text-sm"
                  >
                    <span className="w-5 text-center">f</span>
                    Facebook @PASFG215
                  </a>
                  <a
                    href="https://instagram.com/PASFG215"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-[var(--psp-gold)] transition-colors text-sm"
                  >
                    <span className="w-5 text-center">IG</span>
                    Instagram @PASFG215
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER NAV ══════════ */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center space-y-2">
          <Link
            href="/football"
            className="inline-flex items-center gap-2 text-[var(--psp-blue)] hover:text-[var(--psp-gold)] transition-colors font-semibold"
          >
            &larr; Back to Football
          </Link>
          <p className="text-gray-400 text-xs">
            Source: tedsilary.com &mdash; Philadelphia Scholastic Sports Archives
          </p>
        </div>
      </section>
    </main>
  );
}
