import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import AllStarArchive from "./AllStarArchive";

export const revalidate = 86400; // 24 hours - static historical data
export const dynamic = "force-dynamic";
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

export const metadata: Metadata = {
  title: "City All-Star Game — Philadelphia Football — PhillySportsPack",
  description:
    "Complete history of the Philadelphia City All-Star Game (Public League vs. Non-Public, 1975-2019). Game recaps, rosters, records, TD scorers, and standout performances across 45 games.",
  alternates: {
    canonical: "https://phillysportspack.com/football/city-all-star-game",
  },
  openGraph: {
    title: "City All-Star Game",
    description:
      "Philadelphia City All-Star Game (1975-2019) - Public League vs. Non-Public. 45 games, full recaps, rosters, and records.",
    type: "website",
  },
};

export default async function CityAllStarGamePage() {
  const gamesPath = path.join(process.cwd(), "public/data/city-allstar-games.json");
  const recordsPath = path.join(process.cwd(), "public/data/city-allstar-records.json");

  let gamesData: CombinedData = {
    metadata: { title: "", total_games: 0, year_range: { start: 1975, end: 2019 } },
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

  // Calculate series record
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
      const secondScore = parseInt(secondWords[secondWords.length - 1] || "0", 10);
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
  const rosterYears = gamesData.games.filter((g) => g.rosters).length;

  const breadcrumbs = [
    { name: "Home", url: "https://phillysportspack.com/" },
    { name: "Football", url: "https://phillysportspack.com/football" },
    {
      name: "City All-Star Game",
      url: "https://phillysportspack.com/football/city-all-star-game",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--psp-navy)] text-white">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Breadcrumbs */}
      <div className="border-b border-[var(--psp-gold)]/20">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbs.map((b) => ({ label: b.name, href: b.url }))} />
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-[var(--psp-gold)]/30 bg-gradient-to-b from-[var(--psp-navy-mid)] to-[var(--psp-navy)]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="font-bebas-neue text-5xl md:text-6xl font-bold mb-2">
              City All-Star Game
            </h1>
            <p className="text-[var(--psp-gold)] text-lg font-semibold mb-4">
              Public League vs Non-Public • 1975–2019 • 45 Games
            </p>
            <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
              The Daily News-Eagles City All-Star Football Game, first played in 1975,
              matches Public and Non-Public squads (seniors only) from Philadelphia&apos;s
              20 Public League schools and 10 Non-Public schools. For 45 years, this
              matchup showcased the region&apos;s elite talent — many of whom went on to
              play college and professional football.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-b border-[var(--psp-gold)]/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 text-center">
              <p className="text-[var(--psp-gold)] text-xs font-semibold mb-1">SERIES</p>
              <p className="font-bebas-neue text-2xl font-bold">
                {nonPublicWins}–{publicWins}{ties > 0 ? `–${ties}` : ""}
              </p>
              <p className="text-gray-400 text-xs">Non-Public leads</p>
            </div>
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 text-center">
              <p className="text-[var(--psp-gold)] text-xs font-semibold mb-1">GAMES</p>
              <p className="font-bebas-neue text-2xl font-bold">{totalGames}</p>
              <p className="text-gray-400 text-xs">1975–2019</p>
            </div>
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 text-center">
              <p className="text-blue-400 text-xs font-semibold mb-1">PUBLIC</p>
              <p className="font-bebas-neue text-2xl font-bold">{publicWins}</p>
              <p className="text-gray-400 text-xs">
                {totalGames > 0 ? ((publicWins / totalGames) * 100).toFixed(0) : 0}% win rate
              </p>
            </div>
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 text-center">
              <p className="text-purple-400 text-xs font-semibold mb-1">NON-PUBLIC</p>
              <p className="font-bebas-neue text-2xl font-bold">{nonPublicWins}</p>
              <p className="text-gray-400 text-xs">
                {totalGames > 0 ? ((nonPublicWins / totalGames) * 100).toFixed(0) : 0}% win rate
              </p>
            </div>
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 text-center">
              <p className="text-[var(--psp-gold)] text-xs font-semibold mb-1">TOUCHDOWNS</p>
              <p className="font-bebas-neue text-2xl font-bold">{totalTds}</p>
              <p className="text-gray-400 text-xs">All-time scored</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Archive Component */}
      <section className="container mx-auto px-4 py-12">
        <AllStarArchive
          games={gamesData.games as any}
          records={recordsData.individual_records as any}
          tdLeaders={gamesData.td_leaders as any}
          rosters={gamesData.rosters as any}
        />
      </section>

      {/* Footer */}
      <section className="border-t border-[var(--psp-gold)]/30 mt-12 py-8">
        <div className="container mx-auto px-4 text-center space-y-2">
          <Link
            href="/football"
            className="inline-flex items-center gap-2 text-[var(--psp-blue)] hover:text-[var(--psp-gold)] transition-colors font-semibold"
          >
            ← Back to Football
          </Link>
          <p className="text-gray-500 text-xs">
            Source: tedsilary.com — Philadelphia Scholastic Sports Archives
          </p>
        </div>
      </section>
    </main>
  );
}
