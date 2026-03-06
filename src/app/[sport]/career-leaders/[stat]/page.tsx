import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getFootballCareerLeaders, getBasketballCareerLeaders } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import LeaderboardTable from "@/components/ui/LeaderboardTable";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { sport: string; stat: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, stat } = await params;
  if (!isValidSport(sport)) return {};
  const meta = SPORT_META[sport];
  const statLabel = stat.charAt(0).toUpperCase() + stat.slice(1);
  return {
    title: `Career ${statLabel} Leaders — ${meta.name} — PhillySportsPack`,
    description: `All-time career ${stat} leaders in Philadelphia high school ${meta.name.toLowerCase()}. Multi-season totals and derived stats.`,
  };
}

interface StatConfig {
  key: string;
  label: string;
  cols: string[];
  careerCols: string[];
  hasData?: boolean;
}

const FOOTBALL_CAREER_STATS: StatConfig[] = [
  { key: "rushing", label: "Rushing", cols: ["career_rush_yards", "career_rush_carries", "career_rush_td", "career_rush_ypc"], careerCols: ["career_rush_yards"] },
  { key: "passing", label: "Passing", cols: ["career_pass_yards", "career_pass_comp", "career_pass_att", "career_comp_pct", "career_pass_td", "career_pass_int"], careerCols: ["career_pass_yards"] },
  { key: "receiving", label: "Receiving", cols: ["career_rec_yards", "career_receptions", "career_rec_td"], careerCols: ["career_rec_yards"] },
  { key: "scoring", label: "Scoring", cols: ["career_total_td", "career_total_yards", "career_points", "career_yds_per_game"], careerCols: ["career_total_td"] },
];

const BASKETBALL_CAREER_STATS: StatConfig[] = [
  { key: "scoring", label: "Scoring", cols: ["career_points", "career_ppg", "career_games", "seasons_played"], careerCols: ["career_points"], hasData: true },
  { key: "ppg", label: "PPG", cols: ["career_ppg", "career_points", "career_games"], careerCols: ["career_ppg"], hasData: true },
  { key: "rebounds", label: "Rebounds", cols: ["career_rebounds", "career_rpg", "career_games"], careerCols: ["career_rebounds"], hasData: false },
  { key: "assists", label: "Assists", cols: ["career_assists", "career_apg", "career_games"], careerCols: ["career_assists"], hasData: false },
];

const CAREER_COL_LABELS: Record<string, string> = {
  career_rush_yards: "Rush Yds", career_rush_carries: "Carries", career_rush_td: "Rush TD", career_rush_ypc: "YPC",
  career_pass_yards: "Pass Yds", career_pass_comp: "Comp", career_pass_att: "Att", career_comp_pct: "Comp%",
  career_pass_td: "Pass TD", career_pass_int: "INT",
  career_rec_yards: "Rec Yds", career_receptions: "Rec", career_rec_td: "Rec TD",
  career_total_td: "Total TD", career_total_yards: "Total Yds", career_points: "Points", career_yds_per_game: "YPG",
  career_ppg: "PPG", career_games: "Games", career_rebounds: "REB", career_rpg: "RPG",
  career_assists: "AST", career_apg: "APG", career_steals: "STL", career_blocks: "BLK",
  seasons_played: "Seasons",
};

export default async function CareerLeaderboardPage({ params }: { params: Promise<PageParams> }) {
  const { sport, stat } = await params;
  if (!isValidSport(sport)) notFound();
  if (sport !== "football" && sport !== "basketball") notFound();

  const meta = SPORT_META[sport];
  let leaders: any[] = [];
  let statConfig: StatConfig | undefined;

  if (sport === "football") {
    statConfig = FOOTBALL_CAREER_STATS.find(s => s.key === stat) || FOOTBALL_CAREER_STATS[0];
    leaders = await getFootballCareerLeaders(statConfig.key, 100);
  } else if (sport === "basketball") {
    statConfig = BASKETBALL_CAREER_STATS.find(s => s.key === stat) || BASKETBALL_CAREER_STATS[0];
    leaders = await getBasketballCareerLeaders(statConfig.key, 100);
  }

  const availableStats = sport === "football" ? FOOTBALL_CAREER_STATS : BASKETBALL_CAREER_STATS;

  // Transform for LeaderboardTable
  const tableData = leaders.map((row: any, idx: number) => ({
    id: row.player_id || idx,
    rank: idx + 1,
    playerName: row.player_name || "Unknown",
    playerSlug: row.player_slug || "",
    schoolName: row.school_name || "Unknown",
    schoolSlug: row.school_slug || "",
    seasonLabel: row.seasons_played ? `${row.seasons_played} season${row.seasons_played !== 1 ? "s" : ""}` : "—",
    pro_team: row.pro_team,
    ...statConfig?.cols.reduce((acc: any, col) => ({ ...acc, [col]: row[col] }), {}),
  }));

  return (
    <>
      {/* Header */}
      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Career Leaders" },
              { label: statConfig?.label || stat },
            ]}
          />
          <h1 className="text-4xl md:text-5xl text-white tracking-wider mt-4" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
            Career {statConfig?.label || stat} Leaders
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            All-time career totals across all seasons
          </p>

          {/* Season / Career toggle */}
          <div className="flex gap-2 mt-4">
            <Link
              href={`/${sport}/leaderboards/${stat}`}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              Season Leaders
            </Link>
            <span
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
            >
              Career Leaders
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stat tabs */}
        {availableStats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {availableStats.map((s) => (
              <div key={s.key} className="relative">
                <Link
                  href={`/${sport}/career-leaders/${s.key}`}
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

        <PSPPromo size="banner" variant={2} />

        {/* Leaderboard table */}
        {tableData.length > 0 ? (
          <div className="my-8">
            <LeaderboardTable
              sport={sport}
              statCols={statConfig?.cols || []}
              colLabels={CAREER_COL_LABELS}
              data={tableData}
            />
          </div>
        ) : (
          <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium mb-4" style={{ color: "var(--psp-navy)" }}>
              Career {statConfig?.label} data is being compiled
            </h3>
            <p className="text-sm mb-6">
              We&apos;re aggregating career totals. Check back soon!
            </p>
            {availableStats.filter(s => s.hasData !== false).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 inline-block">
                <p className="text-sm font-medium mb-3" style={{ color: "var(--psp-navy)" }}>
                  Check out our available career leaderboards:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {availableStats.filter(s => s.hasData !== false).map(s => (
                    <Link
                      key={s.key}
                      href={`/${sport}/career-leaders/${s.key}`}
                      className="px-3 py-2 rounded bg-white border text-sm hover:bg-gray-100 transition-colors"
                      style={{ borderColor: "var(--psp-navy)", color: "var(--psp-navy)", fontWeight: "500" }}
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
            name: `Career ${meta.name} ${statConfig?.label || stat} Leaders — All-Time`,
            url: `https://phillysportspack.com/${sport}/career-leaders/${stat}`,
            numberOfItems: tableData.length,
          }),
        }}
      />
    </>
  );
}
