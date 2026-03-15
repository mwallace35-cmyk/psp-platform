import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import AllStarArchive from "./AllStarArchive";

export const revalidate = 86400; // 24 hours - static historical data

interface GameData {
  year: number;
  score: string;
  mvps?: Array<{ name: string; position?: string; school?: string }>;
  notables?: string[];
  team_stats?: Record<
    string,
    Record<string, string | number>
  >;
  rushing?: Array<{ team: string; name: string; school?: string | null; carries_yards: string }>;
  passing?: Array<{ team: string; name: string; school?: string | null; completions_attempts_yards: string }>;
  receiving?: Array<{ team: string; name: string; school?: string | null; catches_yards: string }>;
}

interface CombinedData {
  metadata: {
    title: string;
    total_games: number;
    year_range: { start: number; end: number };
  };
  games: GameData[];
}

interface RecordsData {
  individual_records?: {
    rushing?: Record<string, unknown>;
    passing?: Record<string, unknown>;
    receiving?: Record<string, unknown>;
    kicking?: Record<string, unknown>;
    miscellaneous?: Record<string, unknown>;
  };
}

type PageParams = Record<string, never>;

export const metadata: Metadata = {
  title: "City All-Star Game — Philadelphia Football — PhillySportsPack",
  description:
    "Complete history of the Philadelphia City All-Star Game (Public League vs. Non-Public, 1975-2019). Game recaps, box scores, records, and standout performances.",
  alternates: {
    canonical: "https://phillysportspack.com/football/city-all-star-game",
  },
  openGraph: {
    title: "City All-Star Game",
    description: "Philadelphia City All-Star Game (1975-2019) - Public League vs. Non-Public",
    type: "website",
  },
};

export default async function CityAllStarGamePage() {
  // Load game data at build time
  const gamesPath = path.join(
    process.cwd(),
    "public/data/city-allstar-games.json"
  );
  const recordsPath = path.join(
    process.cwd(),
    "public/data/city-allstar-records.json"
  );

  let gamesData: CombinedData = {
    metadata: { title: "", total_games: 0, year_range: { start: 0, end: 0 } },
    games: [],
  };
  let recordsData: RecordsData = {};

  try {
    const gamesRaw = fs.readFileSync(gamesPath, "utf-8");
    gamesData = JSON.parse(gamesRaw);
  } catch (e) {
    console.warn("Failed to load games data:", e);
  }

  try {
    const recordsRaw = fs.readFileSync(recordsPath, "utf-8");
    recordsData = JSON.parse(recordsRaw);
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
      const firstTeam = parts[0].split(" ")[0];
      const firstScore = parseInt(
        parts[0].split(" ").pop() || "0",
        10
      );
      const secondScore = parseInt(parts[1].split(" ").pop() || "0", 10);

      if (firstScore > secondScore) {
        if (firstTeam === "PUBLIC") publicWins++;
        else if (firstTeam === "NON-PUBLIC") nonPublicWins++;
      } else if (secondScore > firstScore) {
        if (firstTeam === "PUBLIC") nonPublicWins++;
        else if (firstTeam === "NON-PUBLIC") publicWins++;
      } else {
        ties++;
      }
    }
  }

  // Quick stats
  const totalGames = gamesData.games.length;
  const yearRange = gamesData.metadata.year_range || {
    start: 1975,
    end: 2019,
  };

  const breadcrumbs = [
    { name: "Home", url: "https://phillysportspack.com/" },
    { name: "Football", url: "https://phillysportspack.com/" },
    { name: "City All-Star Game", url: "https://phillysportspack.com/football/city-all-star-game" },
  ];

  return (
    <main className="min-h-screen bg-[var(--psp-navy)] text-white">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Breadcrumbs */}
      <div className="border-b border-[var(--psp-gold)]/20">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbs.map(b => ({ label: b.name, href: b.url }))} />
        </div>
      </div>

      {/* Hero Section */}
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
              The Philadelphia City All-Star Game is an annual exhibition football
              game between the Public League's best and the Non-Public League's
              finest. For 45 years, this matchup showcased elite talent from the
              region's premier high schools.
            </p>
          </div>
        </div>
      </section>

      {/* Series Record Summary */}
      <section className="border-b border-[var(--psp-gold)]/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-6">
              <p className="text-[var(--psp-gold)] text-sm font-semibold mb-2">
                SERIES RECORD
              </p>
              <p className="font-bebas-neue text-3xl font-bold">
                {nonPublicWins}–{publicWins}
                {ties > 0 ? `–${ties}` : ""}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Non-Public leads
              </p>
            </div>

            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-6">
              <p className="text-[var(--psp-gold)] text-sm font-semibold mb-2">
                TOTAL GAMES
              </p>
              <p className="font-bebas-neue text-3xl font-bold">
                {totalGames}
              </p>
              <p className="text-gray-400 text-sm mt-1">1975–2019</p>
            </div>

            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-6">
              <p className="text-[var(--psp-gold)] text-sm font-semibold mb-2">
                PUBLIC WINS
              </p>
              <p className="font-bebas-neue text-3xl font-bold">
                {publicWins}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {((publicWins / totalGames) * 100).toFixed(1)}%
              </p>
            </div>

            <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-6">
              <p className="text-[var(--psp-gold)] text-sm font-semibold mb-2">
                NON-PUBLIC WINS
              </p>
              <p className="font-bebas-neue text-3xl font-bold">
                {nonPublicWins}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {((nonPublicWins / totalGames) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Archive Component */}
      <section className="container mx-auto px-4 py-12">
        <AllStarArchive
          games={gamesData.games}
          records={recordsData.individual_records as any}
        />
      </section>

      {/* Back to Football */}
      <section className="border-t border-[var(--psp-gold)]/30 mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--psp-blue)] hover:text-[var(--psp-gold)] transition-colors font-semibold"
          >
            ← Back to Football
          </Link>
        </div>
      </section>
    </main>
  );
}
