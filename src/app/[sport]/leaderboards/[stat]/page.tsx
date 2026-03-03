import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getFootballLeaders, getBasketballLeaders } from "@/lib/data";
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

const FOOTBALL_STATS = [
  { key: "rushing", label: "Rushing", cols: ["rush_yards", "rush_carries", "rush_td", "rush_ypc"] },
  { key: "passing", label: "Passing", cols: ["pass_yards", "pass_comp", "pass_att", "pass_td", "pass_int"] },
  { key: "receiving", label: "Receiving", cols: ["rec_yards", "receptions", "rec_td"] },
  { key: "scoring", label: "Scoring", cols: ["total_td", "points"] },
];

const BASKETBALL_STATS = [
  { key: "scoring", label: "Scoring", cols: ["points", "ppg", "games_played"] },
  { key: "ppg", label: "PPG", cols: ["ppg", "points", "games_played"] },
  { key: "rebounds", label: "Rebounds", cols: ["rebounds", "rpg", "games_played"] },
  { key: "assists", label: "Assists", cols: ["assists", "apg", "games_played"] },
];

export default async function LeaderboardPage({ params }: { params: Promise<PageParams> }) {
  const { sport, stat } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  let leaders: any[] = [];
  let statConfig: { key: string; label: string; cols: string[] } | undefined;

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

  return (
    <>
      {/* Header */}
      <section className="py-10" style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href={`/${sport}`} className="hover:text-white transition-colors">{meta.name}</Link>
            <span>/</span>
            <span className="text-white">Leaderboards</span>
          </div>
          <h1 className="text-4xl md:text-5xl text-white tracking-wider" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
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
              <Link
                key={s.key}
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
            ))}
          </div>
        )}

        {/* Leaderboard table */}
        {leaders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-12 text-center">#</th>
                  <th>Player</th>
                  <th>School</th>
                  <th>Season</th>
                  {statConfig?.cols.map((col) => (
                    <th key={col} className="text-right">{colLabels[col] || col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaders.map((row: any, idx: number) => (
                  <tr key={row.id}>
                    <td className="text-center font-bold text-sm" style={{ color: idx < 3 ? "var(--psp-gold)" : "var(--psp-gray-400)" }}>
                      {idx + 1}
                    </td>
                    <td>
                      <Link href={`/${sport}/players/${row.players?.slug}`} className="font-medium text-sm hover:underline" style={{ color: "var(--psp-navy)" }}>
                        {row.players?.name}
                      </Link>
                    </td>
                    <td className="text-xs">
                      <Link href={`/${sport}/schools/${row.schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-gray-500)" }}>
                        {row.schools?.name}
                      </Link>
                    </td>
                    <td className="text-xs" style={{ color: "var(--psp-gray-400)" }}>{row.seasons?.label}</td>
                    {statConfig?.cols.map((col) => (
                      <td key={col} className="text-right font-medium">{row[col] ?? "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium mb-2" style={{ color: "var(--psp-navy)" }}>No leaderboard data yet</h3>
            <p className="text-sm">Check back soon as data is being loaded.</p>
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${meta.name} ${statConfig?.label || stat} Leaders`,
            url: `https://phillysportspack.com/${sport}/leaderboards/${stat}`,
            numberOfItems: leaders.length,
          }),
        }}
      />
    </>
  );
}
