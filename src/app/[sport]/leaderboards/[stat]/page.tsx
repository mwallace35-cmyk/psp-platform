import Link from "next/link";
import { notFound } from "next/navigation";
import {
  isValidSport,
  SPORT_META,
  getFootballLeaders,
  getBasketballLeaders,
  getFootballCareerLeaders,
  getBasketballCareerLeaders,
} from "@/lib/data";
import type { CareerLeaderRow } from "@/lib/data/events";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import SortableTable, { SortableColumn } from "@/components/ui/SortableTable";
import PSPPromo from "@/components/ads/PSPPromo";
import ShareButtons from "@/components/social/ShareButtons";
import type { Metadata } from "next";
import type React from "react";

export const revalidate = 3600;

type PageParams = { sport: string; stat: string };

export function generateStaticParams() {
  return [
    { sport: "football", stat: "rushing" },
    { sport: "football", stat: "passing" },
    { sport: "football", stat: "receiving" },
    { sport: "football", stat: "scoring" },
    { sport: "basketball", stat: "scoring" },
    { sport: "basketball", stat: "ppg" },
    { sport: "basketball", stat: "rebounds" },
    { sport: "basketball", stat: "assists" },
    { sport: "baseball", stat: "batting" },
    { sport: "baseball", stat: "pitching" },
    { sport: "baseball", stat: "home-runs" },
  ];
}

export async function generateMetadata({ params, searchParams }: { params: Promise<PageParams>; searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const { sport, stat } = await params;
  const sp = await searchParams;
  const isCareer = sp?.mode === "career";
  if (!isValidSport(sport)) return {};
  const meta = SPORT_META[sport];
  const prefix = isCareer ? "Career " : "";
  return {
    title: `${prefix}${stat.charAt(0).toUpperCase() + stat.slice(1)} Leaders — ${meta.name} — PhillySportsPack`,
    description: `Top ${isCareer ? "all-time career " : ""}${stat} leaders in Philadelphia high school ${meta.name.toLowerCase()}.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/leaderboards/${stat}${isCareer ? "?mode=career" : ""}`,
    },
  };
}

interface StatConfig {
  key: string;
  label: string;
  cols: string[];
  careerCols?: string[];
  hasData?: boolean;
  hasCareerData?: boolean;
}

const FOOTBALL_STATS: StatConfig[] = [
  {
    key: "rushing", label: "Rushing",
    cols: ["rush_yards", "rush_carries", "rush_td", "rush_ypc"],
    careerCols: ["career_rush_yards", "career_rush_carries", "career_rush_td", "seasons_played"],
    hasCareerData: true,
  },
  {
    key: "passing", label: "Passing",
    cols: ["pass_yards", "pass_comp", "pass_att", "pass_td", "pass_int"],
    careerCols: ["career_pass_yards", "career_pass_comp", "career_pass_att", "career_pass_td", "career_pass_int", "seasons_played"],
    hasCareerData: true,
  },
  {
    key: "receiving", label: "Receiving",
    cols: ["rec_yards", "receptions", "rec_td"],
    careerCols: ["career_rec_yards", "career_receptions", "career_rec_td", "seasons_played"],
    hasCareerData: true,
  },
  {
    key: "scoring", label: "Scoring",
    cols: ["total_td", "points"],
    careerCols: ["career_total_td", "career_points", "seasons_played"],
    hasCareerData: true,
  },
];

const BASKETBALL_STATS: StatConfig[] = [
  {
    key: "scoring", label: "Scoring",
    cols: ["points", "ppg", "games_played"],
    careerCols: ["career_points", "career_ppg", "career_games", "seasons_played"],
    hasData: true, hasCareerData: true,
  },
  {
    key: "ppg", label: "PPG",
    cols: ["ppg", "points", "games_played"],
    careerCols: ["career_ppg", "career_points", "career_games", "seasons_played"],
    hasData: true, hasCareerData: true,
  },
  { key: "rebounds", label: "Rebounds", cols: ["rebounds", "rpg", "games_played"], hasData: false },
  { key: "assists", label: "Assists", cols: ["assists", "apg", "games_played"], hasData: false },
];

interface RawLeader {
  id: string;
  players?: {
    name: string;
    slug: string;
    pro_team?: string | null;
    schools?: { name: string; slug: string } | null;
  } | null;
  schools?: { name: string; slug: string } | null;
  seasons?: { label: string; year_start: number } | null;
  [key: string]: unknown;
}

type ColumnConfig = SortableColumn;

interface TableRow {
  id: string;
  rank: number;
  playerName: string;
  playerSlug: string;
  schoolName: string;
  schoolSlug: string;
  seasonLabel: string;
  pro_team?: string | null;
  [key: string]: unknown;
}

const COL_LABELS: Record<string, string> = {
  rush_yards: "Rush Yds", rush_carries: "Carries", rush_td: "Rush TD", rush_ypc: "YPC",
  pass_yards: "Pass Yds", pass_comp: "Comp", pass_att: "Att", pass_td: "Pass TD", pass_int: "INT",
  rec_yards: "Rec Yds", receptions: "Rec", rec_td: "Rec TD",
  total_td: "Total TD", points: "Points",
  ppg: "PPG", games_played: "GP", rebounds: "REB", rpg: "RPG", assists: "AST", apg: "APG",
  // Career columns
  career_rush_yards: "Rush Yds", career_rush_carries: "Carries", career_rush_td: "Rush TD",
  career_pass_yards: "Pass Yds", career_pass_comp: "Comp", career_pass_att: "Att",
  career_pass_td: "Pass TD", career_pass_int: "INT",
  career_rec_yards: "Rec Yds", career_receptions: "Rec", career_rec_td: "Rec TD",
  career_total_td: "Total TD", career_points: "Points", career_total_yards: "Total Yds",
  career_ppg: "PPG", career_games: "GP",
  seasons_played: "Seasons",
};

export default async function LeaderboardPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { sport, stat } = await params;
  const sp = await searchParams;
  const isCareer = sp?.mode === "career";

  if (!isValidSport(sport)) notFound();
  const meta = SPORT_META[sport];

  const allStats = sport === "football" ? FOOTBALL_STATS : sport === "basketball" ? BASKETBALL_STATS : [];
  const statConfig = allStats.find(s => s.key === stat) || allStats[0];
  if (!statConfig) notFound();

  // Determine if career mode is available for this stat
  const careerAvailable = !!statConfig.careerCols && statConfig.hasCareerData !== false;

  // Fetch the right data
  let seasonTableData: TableRow[] = [];
  let careerTableData: TableRow[] = [];

  if (isCareer && careerAvailable) {
    // Career mode
    let careerLeaders: CareerLeaderRow[] = [];
    if (sport === "football") {
      careerLeaders = await getFootballCareerLeaders(statConfig.key, 100);
    } else if (sport === "basketball") {
      careerLeaders = await getBasketballCareerLeaders(statConfig.key, 100);
    }

    careerTableData = careerLeaders.map((row, idx) => ({
      id: String(row.player_id),
      rank: idx + 1,
      playerName: row.player_name || "Unknown",
      playerSlug: row.player_slug || "",
      schoolName: row.school_name || "Unknown",
      schoolSlug: row.school_slug || "",
      seasonLabel: row.first_year && row.last_year
        ? `${row.first_year}–${String(row.last_year).slice(-2)}`
        : "—",
      pro_team: (row.pro_team as string | null) || null,
      graduation_year: row.graduation_year,
      ...(statConfig.careerCols || []).reduce((acc: Record<string, unknown>, col) => {
        const val = row[col];
        acc[col] = val != null ? (typeof val === "number" ? val.toLocaleString() : val) : "—";
        return acc;
      }, {}),
    }));
  } else {
    // Season mode
    let leaders: RawLeader[] = [];
    if (sport === "football") {
      leaders = await getFootballLeaders(statConfig.key, 100);
    } else if (sport === "basketball") {
      leaders = await getBasketballLeaders(statConfig.key, 100);
    }

    seasonTableData = leaders.map((row, idx) => ({
      id: row.id,
      rank: idx + 1,
      playerName: row.players?.name || "Unknown",
      playerSlug: row.players?.slug || "",
      schoolName: row.schools?.name || "Unknown",
      schoolSlug: row.schools?.slug || "",
      seasonLabel: row.seasons?.label || "Unknown",
      pro_team: row.players?.pro_team,
      ...statConfig.cols.reduce((acc: Record<string, unknown>, col) => ({
        ...acc,
        [col]: (row as unknown as Record<string, unknown>)[col],
      }), {}),
    }));
  }

  const tableData = isCareer ? careerTableData : seasonTableData;
  const activeCols = isCareer ? (statConfig.careerCols || []) : statConfig.cols;

  // Build columns
  const columns: ColumnConfig[] = [
    { key: "rank", label: "#", align: "center", sortable: false },
    {
      key: "playerName",
      label: "Player",
      sortable: true,
      primary: true,
      render: (value: unknown, row: Record<string, any>) => (
        <div className="flex items-center gap-2">
          {row?.pro_team && <span className="text-gold">⭐</span>}
          <Link
            href={`/${sport}/players/${row?.playerSlug || ""}`}
            className="font-medium text-sm hover:underline"
            style={{ color: "var(--psp-navy)" }}
          >
            {String(value)}
          </Link>
        </div>
      ),
    },
    {
      key: "schoolName",
      label: "School",
      sortable: true,
      render: (value: unknown, row: Record<string, any>) => (
        <Link
          href={`/${sport}/schools/${row?.schoolSlug || ""}`}
          className="hover:underline text-sm"
          style={{ color: "var(--psp-gray-500)" }}
        >
          {String(value)}
        </Link>
      ),
    },
    {
      key: "seasonLabel",
      label: isCareer ? "Years" : "Season",
      sortable: true,
      hideOnMobile: true,
    },
  ];

  for (const col of activeCols) {
    columns.push({
      key: col,
      label: COL_LABELS[col] || col,
      align: "right",
      sortable: true,
      hideOnMobile: false,
      render: (value: unknown) => String(value ?? "—"),
    });
  }

  // Extract filter values (season mode only)
  const uniqueSeasons = isCareer ? [] : Array.from(
    new Set(seasonTableData.map(r => r.seasonLabel).filter(Boolean))
  ).sort().reverse();

  const uniqueSchools = Array.from(
    new Set(tableData.map(r => r.schoolName).filter(s => s && s !== "Unknown"))
  ).sort();

  const modeLabel = isCareer ? "All-Time Career" : "Single Season";
  const subtitle = isCareer
    ? "All-time career statistical leaders across multiple seasons"
    : "Season-by-season statistical leaders";

  return (
    <main id="main-content">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Leaderboards", url: `https://phillysportspack.com/${sport}/leaderboards` },
        { name: `${isCareer ? "Career " : ""}${statConfig.label}`, url: `https://phillysportspack.com/${sport}/leaderboards/${stat}${isCareer ? "?mode=career" : ""}` },
      ]} />

      {/* Header */}
      <section className="py-10" style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Leaderboards" },
              { label: `${isCareer ? "Career " : ""}${statConfig.label}` },
            ]}
          />
          <h1 className="text-4xl md:text-5xl text-white tracking-wider mt-4" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            {isCareer && "Career "}{statConfig.label} Leaders
          </h1>
          <p className="text-sm text-gray-400 mt-2">{subtitle}</p>
          <div className="mt-6">
            <ShareButtons
              url={`/${sport}/leaderboards/${stat}${isCareer ? "?mode=career" : ""}`}
              title={`${isCareer ? "Career " : ""}${statConfig.label} Leaders | PhillySportsPack`}
              description={`Top ${isCareer ? "all-time career " : ""}${statConfig.label.toLowerCase()} leaders in Philadelphia high school ${meta.name.toLowerCase()}.`}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Season / Career toggle */}
        {careerAvailable && (
          <div className="flex items-center gap-1 mb-6 p-1 rounded-lg inline-flex" style={{ background: "var(--psp-gray-100, #f3f4f6)" }}>
            <Link
              href={`/${sport}/leaderboards/${stat}`}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                !isCareer ? "text-white shadow-sm" : "hover:bg-white/60"
              }`}
              style={!isCareer ? { background: "var(--psp-navy)" } : { color: "var(--psp-navy)" }}
            >
              Single Season
            </Link>
            <Link
              href={`/${sport}/leaderboards/${stat}?mode=career`}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                isCareer ? "text-white shadow-sm" : "hover:bg-white/60"
              }`}
              style={isCareer ? { background: "var(--psp-gold, #f0a500)" } : { color: "var(--psp-navy)" }}
            >
              Career
            </Link>
          </div>
        )}

        {/* Stat tabs */}
        {allStats.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {allStats.map((s) => {
              const isActive = s.key === stat;
              const href = `/${sport}/leaderboards/${s.key}${isCareer ? "?mode=career" : ""}`;
              const showComingSoon = isCareer ? !s.hasCareerData : s.hasData === false;
              return (
                <div key={s.key} className="relative">
                  <Link
                    href={href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-white"
                        : "bg-white border border-[var(--psp-gray-200)] hover:border-[var(--psp-gray-300)]"
                    }`}
                    style={isActive ? { background: "var(--psp-navy)", color: "white" } : { color: "var(--psp-navy)" }}
                  >
                    {s.label}
                  </Link>
                  {showComingSoon && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Soon
                    </span>
                  )}
                </div>
              );
            })}
            <span className="mx-1 text-gray-300">|</span>
            <Link
              href={`/${sport}/leaderboards/schools`}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:border-[var(--psp-gold)]"
              style={{ borderColor: "var(--psp-gold)", color: "var(--psp-gold)" }}
            >
              🏫 School Rankings
            </Link>
          </div>
        )}

        {/* Filter dropdowns (season mode only shows season filter) */}
        <div className="flex flex-wrap gap-3 mb-6">
          {!isCareer && uniqueSeasons.length > 0 && (
            <select
              className="px-3 py-2 rounded border text-sm"
              style={{ borderColor: "var(--psp-navy)", color: "var(--psp-navy)" }}
              defaultValue=""
            >
              <option value="">All Seasons</option>
              {uniqueSeasons.map((season) => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          )}
          {uniqueSchools.length > 0 && (
            <select
              className="px-3 py-2 rounded border text-sm"
              style={{ borderColor: "var(--psp-navy)", color: "var(--psp-navy)" }}
              defaultValue=""
            >
              <option value="">All Schools</option>
              {uniqueSchools.map((school) => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          )}
        </div>

        <PSPPromo size="banner" variant={1} />

        {/* Leaderboard table */}
        {tableData.length > 0 ? (
          <div className="my-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                Showing top {tableData.length} {modeLabel.toLowerCase()} {statConfig.label.toLowerCase()} leaders
              </p>
            </div>
            <SortableTable
              columns={columns}
              data={tableData}
              highlightTop3={true}
              mobileCardMode={true}
              emptyMessage="No leaderboard data available"
              ariaLabel={`${isCareer ? "Career " : ""}${statConfig.label} leaders leaderboard for Philadelphia high school ${meta.name}`}
            />
          </div>
        ) : (
          <div className="rounded-xl border p-8" style={{ borderColor: "var(--psp-gray-700, #374151)", background: "linear-gradient(135deg, rgba(10, 22, 40, 0.5) 0%, rgba(15, 32, 64, 0.3) 100%)" }}>
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                Coming Soon
              </h3>
              <p className="text-lg text-gray-300 mb-6 max-w-md mx-auto">
                We&apos;re building out {isCareer ? "career " : ""}{statConfig.label.toLowerCase()} leaderboards for {meta.name.toLowerCase()}. Check back soon!
              </p>
              <Link
                href={`/${sport}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition"
                style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
              >
                Back to {meta.name} Hub
              </Link>

              {allStats.filter(s => isCareer ? s.hasCareerData : s.hasData !== false).length > 0 && (
                <div className="mt-8 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <p className="text-sm font-medium mb-4 text-gray-300">
                    In the meantime, check out our available leaderboards:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {allStats
                      .filter(s => isCareer ? s.hasCareerData : s.hasData !== false)
                      .map(s => (
                        <Link
                          key={s.key}
                          href={`/${sport}/leaderboards/${s.key}${isCareer ? "?mode=career" : ""}`}
                          className="px-3 py-2 rounded text-sm font-medium transition-colors hover:opacity-90"
                          style={{ background: "rgba(240, 165, 0, 0.15)", color: "var(--psp-gold)", border: "1px solid rgba(240, 165, 0, 0.3)" }}
                        >
                          {s.label}
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
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
            name: `${meta.name} ${isCareer ? "Career " : ""}${statConfig.label} Leaders`,
            url: `https://phillysportspack.com/${sport}/leaderboards/${stat}${isCareer ? "?mode=career" : ""}`,
            numberOfItems: tableData.length,
          }),
        }}
      />
    </main>
  );
}
