import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import {
  SPORT_META,
  getSchoolWinsLeaderboard,
  getSchoolChampionshipLeaderboard,
  getSchoolStatProduction,
} from "@/lib/data";
import type { SchoolWinsRow, SchoolChampionshipRow, SchoolStatProductionRow } from "@/lib/data";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import SortableTable, { SortableColumn } from "@/components/ui/SortableTable";
import PSPPromo from "@/components/ads/PSPPromo";
import ShareButtons from "@/components/social/ShareButtons";
import type { Metadata } from "next";
import type React from "react";

export const revalidate = 3600;
export const dynamic = "force-dynamic";
type PageParams = { sport: string };

const TABS = [
  { key: "wins", label: "Wins & Records" },
  { key: "championships", label: "Championships" },
  { key: "stats", label: "Stat Production" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export async function generateMetadata({ params, searchParams }: {
  params: Promise<PageParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const sp = await searchParams;
  // Validate sport param
  const meta = SPORT_META[sport];
  const tab = (sp?.tab as string) || "wins";
  const tabLabel = TABS.find(t => t.key === tab)?.label || "Rankings";
  return {
    title: `School ${tabLabel} — ${meta.name} — PhillySportsPack`,
    description: `Top Philadelphia high school ${meta.name.toLowerCase()} programs ranked by ${tabLabel.toLowerCase()}.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/leaderboards/schools${tab !== "wins" ? `?tab=${tab}` : ""}`,
    },
  };
}

function formatNum(n: unknown): string {
  if (n == null) return "—";
  const num = typeof n === "string" ? parseFloat(n) : (n as number);
  if (isNaN(num)) return "—";
  return num.toLocaleString();
}

function formatPct(n: unknown): string {
  if (n == null) return "—";
  const num = typeof n === "string" ? parseFloat(n) : (n as number);
  if (isNaN(num)) return "—";
  return (num * 100).toFixed(1) + "%";
}

function SchoolLink({ name, slug, sport }: { name: string; slug: string; sport: string }) {
  return (
    <Link
      href={`/${sport}/schools/${slug}`}
      className="font-medium text-sm hover:underline"
      style={{ color: "var(--psp-navy)" }}
    >
      {name}
    </Link>
  );
}

// ─── Wins Tab ──────────────────────────────────────────────
function WinsTable({ data, sport }: { data: SchoolWinsRow[]; sport: string }) {
  const columns: SortableColumn[] = [
    { key: "rank", label: "#", align: "center", sortable: false },
    {
      key: "school_name", label: "School", sortable: true, primary: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row?.logo_url && (
            <img src={row.logo_url as string} alt={`${String(value)} logo`} className="w-6 h-6 rounded" loading="lazy" />
          )}
          <div>
            <SchoolLink name={String(value)} slug={row?.school_slug as string} sport={sport} />
            {row?.league_name && (
              <div className="text-xs" style={{ color: "var(--psp-gray-400)" }}>{row.league_name as string}</div>
            )}
          </div>
        </div>
      ),
    },
    { key: "total_wins", label: "W", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_losses", label: "L", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_ties", label: "T", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "win_pct", label: "Win%", align: "right", sortable: true, render: (v) => formatPct(v) },
    { key: "total_seasons", label: "Seasons", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "championship_count", label: "Titles", align: "right", sortable: true, render: (v) => {
      const n = Number(v);
      return n > 0 ? <span style={{ color: "var(--psp-gold)" }} className="font-semibold">{n}</span> : "0";
    }},
    { key: "total_points_for", label: "PF", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
  ];

  const tableData = data.map((row, idx) => ({
    id: String(row.school_id),
    rank: idx + 1,
    ...row,
  }));

  return (
    <SortableTable
      columns={columns}
      data={tableData}
      highlightTop3={true}
      mobileCardMode={true}
      emptyMessage="No school records available"
      ariaLabel="School wins leaderboard"
    />
  );
}

// ─── Championships Tab ─────────────────────────────────────
function ChampionshipsTable({ data, sport }: { data: SchoolChampionshipRow[]; sport: string }) {
  const columns: SortableColumn[] = [
    { key: "rank", label: "#", align: "center", sortable: false },
    {
      key: "school_name", label: "School", sortable: true, primary: true,
      render: (value, row) => <SchoolLink name={String(value)} slug={row?.school_slug as string} sport={sport} />,
    },
    {
      key: "total_championships", label: "Total", align: "right", sortable: true,
      render: (v) => <span className="font-bold" style={{ color: "var(--psp-gold)" }}>{formatNum(v)}</span>,
    },
    { key: "fb_champs", label: "FB", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "bb_champs", label: "BB", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "base_champs", label: "BSB", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "other_champs", label: "Other", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
  ];

  const tableData = data.map((row, idx) => ({
    id: String(row.school_id),
    rank: idx + 1,
    ...row,
  }));

  return (
    <SortableTable
      columns={columns}
      data={tableData}
      highlightTop3={true}
      mobileCardMode={true}
      emptyMessage="No championship data available"
      ariaLabel="School championships leaderboard"
    />
  );
}

// ─── Stat Production Tab ───────────────────────────────────
function FootballStatsTable({ data, sport }: { data: SchoolStatProductionRow[]; sport: string }) {
  const columns: SortableColumn[] = [
    { key: "rank", label: "#", align: "center", sortable: false },
    {
      key: "school_name", label: "School", sortable: true, primary: true,
      render: (value, row) => <SchoolLink name={String(value)} slug={row?.school_slug as string} sport={sport} />,
    },
    { key: "total_players", label: "Players", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_rush_yards", label: "Rush Yds", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_pass_yards", label: "Pass Yds", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_yards", label: "Total Yds", align: "right", sortable: true, render: (v) => {
      return <span className="font-semibold">{formatNum(v)}</span>;
    }},
    { key: "total_td", label: "Total TD", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "total_points", label: "Points", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
  ];

  const tableData = data.map((row, idx) => ({
    id: String(row.school_id),
    rank: idx + 1,
    ...row,
  }));

  return (
    <SortableTable
      columns={columns}
      data={tableData}
      highlightTop3={true}
      mobileCardMode={true}
      emptyMessage="No stat production data available"
      ariaLabel="School stat production leaderboard"
    />
  );
}

function BasketballStatsTable({ data, sport }: { data: SchoolStatProductionRow[]; sport: string }) {
  const columns: SortableColumn[] = [
    { key: "rank", label: "#", align: "center", sortable: false },
    {
      key: "school_name", label: "School", sortable: true, primary: true,
      render: (value, row) => <SchoolLink name={String(value)} slug={row?.school_slug as string} sport={sport} />,
    },
    { key: "total_players", label: "Players", align: "right", sortable: true, render: (v) => formatNum(v) },
    {
      key: "total_points", label: "Total Points", align: "right", sortable: true,
      render: (v) => <span className="font-semibold">{formatNum(v)}</span>,
    },
    { key: "total_games", label: "Games", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
  ];

  const tableData = data.map((row, idx) => ({
    id: String(row.school_id),
    rank: idx + 1,
    ...row,
  }));

  return (
    <SortableTable
      columns={columns}
      data={tableData}
      highlightTop3={true}
      mobileCardMode={true}
      emptyMessage="No stat production data available"
      ariaLabel="School stat production leaderboard"
    />
  );
}

// ─── Main Page ─────────────────────────────────────────────
export default async function SchoolLeaderboardPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sport = await validateSportParam(params);
  const sp = await searchParams;

  // Sport param validated by validateSportParam
  const meta = SPORT_META[sport];

  const tab = ((sp?.tab as string) || "wins") as TabKey;
  const validTab = TABS.find(t => t.key === tab) ? tab : "wins";

  // Fetch data based on active tab
  let winsData: SchoolWinsRow[] = [];
  let champsData: SchoolChampionshipRow[] = [];
  let statsData: SchoolStatProductionRow[] = [];

  if (validTab === "wins") {
    winsData = await getSchoolWinsLeaderboard(sport, "total_wins", 50);
  } else if (validTab === "championships") {
    champsData = await getSchoolChampionshipLeaderboard(sport === "football" || sport === "basketball" || sport === "baseball" ? sport : undefined, 50);
  } else if (validTab === "stats") {
    statsData = await getSchoolStatProduction(sport, "total_yards", 50);
  }

  const tabLabel = TABS.find(t => t.key === validTab)?.label || "Rankings";

  return (
    <main id="main-content">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Leaderboards", url: `https://phillysportspack.com/${sport}/leaderboards/rushing` },
        { name: "School Rankings", url: `https://phillysportspack.com/${sport}/leaderboards/schools` },
      ]} />

      {/* Header */}
      <section className="py-10" style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: meta.name, href: `/${sport}` },
            { label: "Leaderboards", href: `/${sport}/leaderboards/rushing` },
            { label: "School Rankings" },
          ]} />
          <h1 className="psp-h1 text-white mt-4">
            School Rankings
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Top {meta.name.toLowerCase()} programs ranked by {tabLabel.toLowerCase()}
          </p>
          <div className="mt-6">
            <ShareButtons
              url={`/${sport}/leaderboards/schools${validTab !== "wins" ? `?tab=${validTab}` : ""}`}
              title={`School ${tabLabel} | ${meta.name} | PhillySportsPack`}
              description={`Top Philadelphia high school ${meta.name.toLowerCase()} programs ranked by ${tabLabel.toLowerCase()}.`}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Link back to player leaderboards */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/${sport}/leaderboards/rushing`}
            className="text-sm hover:underline"
            style={{ color: "var(--psp-blue, #3b82f6)" }}
          >
            &larr; Player Leaderboards
          </Link>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 p-1 rounded-lg inline-flex mb-8" style={{ background: "var(--psp-gray-100, #f3f4f6)" }}>
          {TABS.map((t) => {
            const isActive = t.key === validTab;
            // Only show stats tab for football and basketball (where we have individual stat data)
            if (t.key === "stats" && sport !== "football" && sport !== "basketball") return null;
            return (
              <Link
                key={t.key}
                href={`/${sport}/leaderboards/schools${t.key !== "wins" ? `?tab=${t.key}` : ""}`}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive ? "text-white shadow-sm" : "hover:bg-white/60"
                }`}
                style={isActive ? { background: "var(--psp-navy)" } : { color: "var(--psp-navy)" }}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        <PSPPromo size="banner" variant={2} />

        {/* Table for active tab */}
        <div className="my-8">
          {validTab === "wins" && winsData.length > 0 && (
            <>
              <p className="text-sm mb-4" style={{ color: "var(--psp-gray-500)" }}>
                Showing top {winsData.length} {meta.name.toLowerCase()} programs by all-time wins
              </p>
              <WinsTable data={winsData} sport={sport} />
            </>
          )}
          {validTab === "wins" && winsData.length === 0 && (
            <EmptyState sport={sport} tab={validTab} />
          )}

          {validTab === "championships" && champsData.length > 0 && (
            <>
              <p className="text-sm mb-4" style={{ color: "var(--psp-gray-500)" }}>
                Showing top {champsData.length} schools by total championships
                {sport !== "football" && sport !== "basketball" && sport !== "baseball"
                  ? " (all sports)"
                  : ` (${meta.name.toLowerCase()})`}
              </p>
              <ChampionshipsTable data={champsData} sport={sport} />
            </>
          )}
          {validTab === "championships" && champsData.length === 0 && (
            <EmptyState sport={sport} tab={validTab} />
          )}

          {validTab === "stats" && statsData.length > 0 && (
            <>
              <p className="text-sm mb-4" style={{ color: "var(--psp-gray-500)" }}>
                Showing top {statsData.length} schools by total {sport === "football" ? "offensive yards" : "points"} produced across all players
              </p>
              {sport === "football" ? (
                <FootballStatsTable data={statsData} sport={sport} />
              ) : (
                <BasketballStatsTable data={statsData} sport={sport} />
              )}
            </>
          )}
          {validTab === "stats" && statsData.length === 0 && (
            <EmptyState sport={sport} tab={validTab} />
          )}
        </div>

        <PSPPromo size="banner" variant={4} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${meta.name} School ${tabLabel}`,
            url: `https://phillysportspack.com/${sport}/leaderboards/schools`,
            numberOfItems: Math.max(winsData.length, champsData.length, statsData.length),
          }),
        }}
      />
    </main>
  );
}

function EmptyState({ sport, tab }: { sport: string; tab: string }) {
  return (
    <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
      <div className="text-4xl mb-4">🏫</div>
      <h3 className="text-lg font-medium mb-2" style={{ color: "var(--psp-navy)" }}>
        No school {tab} data available yet
      </h3>
      <p className="text-sm">
        We&apos;re working on gathering school-level data for this sport. Check back soon!
      </p>
    </div>
  );
}
