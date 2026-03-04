import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getFootballLeaders, getBasketballLeaders } from "@/lib/data";
import Breadcrumb from "@/components/ui/Breadcrumb";
import LeaderboardTable from "@/components/ui/LeaderboardTable";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { sport: string; stat: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, stat } = await params;
  if (!isValidSport(sport)) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${stat.charAt(0).toUpperCase() + stat.slice(1)} Leaders — ${meta.name} — PhillySportsPack`,
    description: `Top ${stat} leaders in Philadelphia high school ${meta.name.toLowerCase()}.`,
  };
}

interface StatConfig {
  key: string;
  label: string;
  cols: string[];
  hasData?: boolean;
}

const FOOTBALL_STATS: StatConfig[] = [
  { key: "rushing", label: "Rushing", cols: ["rush_yards", "rush_carries", "rush_td", "rush_ypc"] },
  { key: "passing", label: "Passing", cols: ["pass_yards", "pass_comp", "pass_att", "pass_td", "pass_int"] },
  { key: "receiving", label: "Receiving", cols: ["rec_yards", "receptions", "rec_td"] },
  { key: "scoring", label: "Scoring", cols: ["total_td", "points"] },
];

const BASKETBALL_STATS: StatConfig[] = [
  { key: "scoring", label: "Scoring", cols: ["points", "ppg", "games_played"], hasData: true },
  { key: "ppg", label: "PPG", cols: ["ppg", "points", "games_played"], hasData: true },
  { key: "rebounds", label: "Rebounds", cols: ["rebounds", "rpg", "games_played"], hasData: false },
  { key: "assists", label: "Assists", cols: ["assists", "apg", "games_played"], hasData: false },
];

interface RawLeader {
  id: string;
  players?: {
    name: string;
    slug: string;
    pro_team?: string | null;
  };
  schools?: {
    name: string;
    slug: string;
  };
  seasons?: {
    label: string;
    year_start: number;
  };
  [key: string]: any;
}

export default async function LeaderboardPage({ params }: { params: Promise<PageParams> }) {
  const { sport, stat } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  let leaders: RawLeader[] = [];
  let statConfig: { key: string; label: string; cols: string[]; hasData?: boolean } | undefined;

  if (sport === "football") {
    statConfig = FOOTBALL_STATS.find(s => s.key === stat) || FOOTBALL_STATS[0];
    leaders = await getFootballLeaders(statConfig.key, 100);
  } else if (sport === "basketball") {
    statConfig = BASKETBALL_STATS.find(s => s.key === stat) || BASKETBALL_STATS[0];
    leaders = await getBasketballLeaders(statConfig.key, 100);
  }

  const availableStats = sport === "football" ? FOOTBALL_STATS : sport === "basketball" ? BASKETBALL_STATS : [];

  const colLabels: Record<string, string> = {
    rush_yards: "Rush Yds", rush_carries: "Carries", rush_td: "Rush TD", rush_ypc: "YPC",
    pass_yards: "Pass Yds", pass_comp: "Comp", pass_att: "Att", pass_td: "Pass TD", pass_int: "INT",
    rec_yards: "Rec Yds", receptions: "Rec", rec_td: "Rec TD",
    total_td: "Total TD", points: "Points",
    ppg: "PPG", games_played: "GP", rebounds: "REB", rpg: "RPG", assists: "AST", apg: "APG",
  };

  // Extract all unique seasons and schools for filtering
  const uniqueSeasons = Array.from(
    new Set(leaders.map((row: any) => row.seasons?.label).filter(Boolean))
  ).sort().reverse();

  const uniqueSchools = Array.from(
    new Set(leaders.map((row: any) => row.schools?.name).filter(Boolean))
  ).sort() as string[];

  const uniqueLeagues = Array.from(
    new Set(leaders.map((row: any) => (row.schools as any)?.league || "").filter(Boolean))
  ).sort() as string[];

  // Transform leaders data for LeaderboardTable
  const tableData = leaders.map((row: any, idx: number) => ({
    id: row.id,
    rank: idx + 1,
    playerName: row.players?.name || "Unknown",
    playerSlug: row.players?.slug || "",
    schoolName: row.schools?.name || "Unknown",
    schoolSlug: row.schools?.slug || "",
    seasonLabel: row.seasons?.label || "Unknown",
    pro_team: row.players?.pro_team,
    ...statConfig?.cols.reduce((acc: any, col) => ({ ...acc, [col]: row[col] }), {}),
  }));

  return (
    <>
      {/* Header */}
      <section className="py-10" style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Leaderboards" },
              { label: statConfig?.label || stat },
            ]}
          />
          <h1 className="text-4xl md:text-5xl text-white tracking-wider mt-4" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            {statConfig?.label || stat} Leaders
          </h1>
          <p className="text-sm text-gray-400 mt-2">Season-by-season statistical leaders</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stat tabs */}
        {availableStats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {availableStats.map((s) => (
              <div key={s.key} className="relative">
                <Link
                  href={`/${sport}/leaderboards/${s.key}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    s.key === stat
                      ? "text-white"
                      : "bg-white border border-[var(--psp-gray-200)] hover:border-[var(--psp-gray-300)]"
                  }`}
                  style={s.key === stat ? { background: "var(--psp-navy)", color: "white" } : { color: "var(--psp-navy)" }}
                >
                  {s.label}
                </Link>
                {s.hasData === false && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Filter dropdowns */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            className="px-3 py-2 rounded border text-sm"
            style={{ borderColor: "var(--psp-navy)", color: "var(--psp-navy)" }}
            defaultValue=""
          >
            <option value="">All Seasons</option>
            {uniqueSeasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded border text-sm"
            style={{ borderColor: "var(--psp-navy)", color: "var(--psp-navy)" }}
            defaultValue=""
          >
            <option value="">All Leagues</option>
            {uniqueLeagues.map((league) => (
              <option key={league} value={league}>
                {league}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded border text-sm"
            style={{ borderColor: "var(--psp-navy)", color: "var(--psp-navy)" }}
            defaultValue=""
          >
            <option value="">All Schools</option>
            {uniqueSchools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>

        <PSPPromo size="banner" variant={1} />

        {/* Leaderboard table */}
        {tableData.length > 0 ? (
          <div className="my-8">
            <LeaderboardTable
              sport={sport}
              statCols={statConfig?.cols || []}
              colLabels={colLabels}
              data={tableData}
            />
          </div>
        ) : (
          <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium mb-4" style={{ color: "var(--psp-navy)" }}>
              {statConfig?.label} data is being collected
            </h3>
            <p className="text-sm mb-6">
              We're working on gathering {statConfig?.label.toLowerCase()} statistics. Check back soon!
            </p>

            {/* Links to available stats */}
            {availableStats.filter(s => s.hasData !== false).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 inline-block">
                <p className="text-sm font-medium mb-3" style={{ color: "var(--psp-navy)" }}>
                  In the meantime, check out our available leaderboards:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {availableStats
                    .filter(s => s.hasData !== false)
                    .map(s => (
                      <Link
                        key={s.key}
                        href={`/${sport}/leaderboards/${s.key}`}
                        className="px-3 py-2 rounded bg-white border text-sm hover:bg-gray-100 transition-colors"
                        style={{
                          borderColor: "var(--psp-navy)",
                          color: "var(--psp-navy)",
                          fontWeight: "500"
                        }}
                      >
                        {s.label}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        <PSPPromo size="banner" variant={3} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${meta.name} ${statConfig?.label || stat} Leaders`,
            url: `https://phillysportspack.com/${sport}/leaderboards/${stat}`,
            numberOfItems: tableData.length,
          }),
        }}
      />
    </>
  );
}

