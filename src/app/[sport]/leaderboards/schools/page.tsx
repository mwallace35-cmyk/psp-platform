import Link from "next/link";
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
import { WinsTable, ChampionshipsTable, FootballStatsTable, BasketballStatsTable } from "./SchoolLeaderboardTables";
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
  const meta = SPORT_META[sport];
  const tab = (sp?.tab as string) || "wins";
  const tabLabel = TABS.find(t => t.key === tab)?.label || "Rankings";
  return {
    title: `School ${tabLabel} \u2014 ${meta.name} \u2014 PhillySportsPack`,
    description: `Top Philadelphia high school ${meta.name.toLowerCase()} programs ranked by ${tabLabel.toLowerCase()}.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/leaderboards/schools${tab !== "wins" ? `?tab=${tab}` : ""}`,
    },
  };
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
          <p className="text-sm text-gray-300 mt-2">
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
      <h2 className="text-lg font-medium mb-2" style={{ color: "var(--psp-navy)" }}>
        No school {tab} data available yet
      </h2>
      <p className="text-sm">
        We&apos;re working on gathering school-level data for this sport. Check back soon!
      </p>
    </div>
  );
}
