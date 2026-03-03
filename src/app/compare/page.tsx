import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPlayerBySlug, getFootballPlayerStats, getBasketballPlayerStats } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Players — PhillySportsPack",
  description: "Compare Philadelphia high school athletes side by side.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ players?: string; sport?: string }>;
}) {
  const { players: playerSlugs, sport = "football" } = await searchParams;

  const slugs = playerSlugs ? playerSlugs.split(",").slice(0, 4) : [];
  const playersData: any[] = [];

  for (const slug of slugs) {
    const player = await getPlayerBySlug(slug.trim());
    if (player) {
      let stats: any[] = [];
      if (sport === "football") stats = await getFootballPlayerStats(player.id);
      else if (sport === "basketball") stats = await getBasketballPlayerStats(player.id);

      const totals = sport === "football" ? {
        rushYards: stats.reduce((s: number, r: any) => s + (r.rush_yards || 0), 0),
        rushTd: stats.reduce((s: number, r: any) => s + (r.rush_td || 0), 0),
        passYards: stats.reduce((s: number, r: any) => s + (r.pass_yards || 0), 0),
        passTd: stats.reduce((s: number, r: any) => s + (r.pass_td || 0), 0),
        totalTd: stats.reduce((s: number, r: any) => s + (r.total_td || 0), 0),
        totalYards: stats.reduce((s: number, r: any) => s + (r.total_yards || 0), 0),
        seasons: stats.length,
      } : sport === "basketball" ? {
        points: stats.reduce((s: number, r: any) => s + (r.points || 0), 0),
        games: stats.reduce((s: number, r: any) => s + (r.games_played || 0), 0),
        rebounds: stats.reduce((s: number, r: any) => s + (r.rebounds || 0), 0),
        assists: stats.reduce((s: number, r: any) => s + (r.assists || 0), 0),
        seasons: stats.length,
      } : { seasons: stats.length };

      playersData.push({ ...player, stats, totals });
    }
  }

  const footballCompareStats = [
    { key: "totalYards", label: "Total Yards" },
    { key: "totalTd", label: "Total TDs" },
    { key: "rushYards", label: "Rush Yards" },
    { key: "rushTd", label: "Rush TDs" },
    { key: "passYards", label: "Pass Yards" },
    { key: "passTd", label: "Pass TDs" },
    { key: "seasons", label: "Seasons" },
  ];

  const basketballCompareStats = [
    { key: "points", label: "Career Points" },
    { key: "games", label: "Games Played" },
    { key: "rebounds", label: "Rebounds" },
    { key: "assists", label: "Assists" },
    { key: "seasons", label: "Seasons" },
  ];

  const compareStats = sport === "football" ? footballCompareStats : basketballCompareStats;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl text-white tracking-wider" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            Compare Players
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Add players via URL: /compare?players=slug1,slug2&sport=football
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {playersData.length >= 2 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Stat</th>
                  {playersData.map((p: any) => (
                    <th key={p.slug} className="text-center">
                      <Link href={`/${sport}/players/${p.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                        {p.name}
                      </Link>
                      <div className="text-xs font-normal" style={{ color: "var(--psp-gray-400)" }}>
                        {(p as any).schools?.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareStats.map((stat) => {
                  const values = playersData.map((p: any) => p.totals?.[stat.key] || 0);
                  const maxVal = Math.max(...values);
                  return (
                    <tr key={stat.key}>
                      <td className="font-medium" style={{ color: "var(--psp-navy)" }}>{stat.label}</td>
                      {playersData.map((p: any, idx: number) => {
                        const val = p.totals?.[stat.key] || 0;
                        const isMax = val === maxVal && val > 0;
                        return (
                          <td key={p.slug} className="text-center">
                            <span className={`font-bold ${isMax ? "" : ""}`} style={{ color: isMax ? "var(--psp-gold)" : "var(--psp-navy)" }}>
                              {typeof val === "number" ? val.toLocaleString() : val}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-lg font-medium mb-2" style={{ color: "var(--psp-navy)" }}>
              Compare Players Side by Side
            </h3>
            <p className="text-sm mb-6">Select 2-4 players to compare their career statistics.</p>
            <p className="text-xs" style={{ color: "var(--psp-gray-400)" }}>
              Example: <code className="bg-gray-100 px-2 py-1 rounded">/compare?players=player-slug-1,player-slug-2&sport=football</code>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
