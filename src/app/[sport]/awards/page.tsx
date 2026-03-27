import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import { SPORT_META, getAwardsPageData } from "@/lib/data";
import AwardsArchive from "./AwardsArchive";
import AwardTierRoster from "@/components/awards/AwardTierRoster";
import { buildAwardTiers } from "@/lib/awards/categorize";
import type { Metadata } from "next";

export const revalidate = 86400; // 24 hours
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];
  return {
    title: `Awards & Honors — ${meta.name} — PhillySportsPack`,
    description: `Complete archive of Philadelphia ${meta.name.toLowerCase()} awards: All-City, All-Catholic, All-Public, All-Inter-Ac, All-State, Player of the Year, and more.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/awards`,
    },
  };
}

// export function generateStaticParams() {
//   return [
//     { sport: "football" },
//     { sport: "basketball" },
//     { sport: "baseball" },
//     { sport: "track-field" },
//     { sport: "lacrosse" },
//     { sport: "wrestling" },
//     { sport: "soccer" },
//   ];
// }

export default async function AwardsPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];
  const data = await getAwardsPageData(sport);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section — dark navy with gold border */}
      <section className="border-b-4 border-[var(--psp-gold)] py-10" style={{ background: '#0a1628', color: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Awards & Honors" },
            ]}
          />
          <h1 className="psp-h1 text-white mb-2 mt-4">
            {meta.emoji} {meta.name} Awards & Honors
          </h1>
          <p className="text-gray-300">
            Complete archive of Philadelphia {meta.name.toLowerCase()} awards and honors
          </p>
        </div>
      </section>

      {/* Sport-Specific Featured Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <div className="flex flex-wrap gap-3">
          {/* All Awards Hub link */}
          <Link
            href="/awards"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 border border-blue-500/30 bg-blue-500/[0.08] text-blue-500"
          >
            ← All Sports Awards
          </Link>
          {/* Championships link */}
          <Link
            href={`/${sport}/championships`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 border border-[#f0a500]/30 bg-[#f0a500]/[0.08] text-[#f0a500]"
          >
            🏆 Championships
          </Link>
          {/* Sport-specific deep links */}
          {sport === "football" && (
            <>
              <Link
                href="/football/awards"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 border border-emerald-600/30 bg-emerald-600/[0.08] text-emerald-600"
              >
                📋 All-City Archive (1932–2018)
              </Link>
              <Link
                href="/football/city-all-star-game"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 border border-purple-500/30 bg-purple-500/[0.08] text-purple-500"
              >
                🎯 City All-Star Game
              </Link>
            </>
          )}
          {sport === "basketball" && (
            <Link
              href="/basketball/leaderboards"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 border border-orange-600/30 bg-orange-600/[0.08] text-orange-600"
            >
              📊 Scoring Leaders
            </Link>
          )}
          {sport === "baseball" && (
            <Link
              href="/pros"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 border border-red-600/30 bg-red-600/[0.08] text-red-600"
            >
              ⚾ MLB Pipeline
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Pro Bowl-style tier roster for football and basketball */}
            {(sport === "football" || sport === "basketball") && data.tabs.length > 0 && (() => {
              const allAwards = data.tabs.flatMap(tab => tab.awards.map(a => ({
                award_name: a.award_name ?? a.award_type ?? null,
                player_name: a.displayName ?? a.players?.name ?? (a as any).player_name ?? null,
                player_slug: a.players?.slug || null,
                school_name: a.school?.name || a.players?.schools?.name || null,
                school_slug: a.school?.slug || a.players?.schools?.slug || null,
                position: a.position || null,
                year: (a as any).year ?? (a.seasons?.year_start) ?? null,
                graduation_year: (a.players as any)?.graduation_year ?? null,
              })));
              const tiers = buildAwardTiers(allAwards, sport);
              // Extract available years for the filter
              const yearSet = new Set<number>();
              allAwards.forEach(a => { if (a.year) yearSet.add(a.year); });
              const availableYears = Array.from(yearSet).sort((a, b) => b - a);
              return tiers.length > 0 ? (
                <AwardTierRoster tiers={tiers} sport={sport} availableYears={availableYears} />
              ) : null;
            })()}

            {/* Standard archive shown only for non-football/basketball sports */}
            {sport !== "football" && sport !== "basketball" && (
              data.tabs.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600 text-lg">
                    No award data available for {meta.name.toLowerCase()} yet.
                  </p>
                  <p className="text-gray-300 text-sm mt-2">
                    Check back soon or explore{" "}
                    <Link href="/awards" className="text-blue-400 hover:underline">
                      awards across all sports
                    </Link>.
                  </p>
                </div>
              ) : (
                <AwardsArchive tabs={data.tabs} sport={sport} />
              )
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Top Schools */}
            {data.topSchools.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
                <div className="bg-[#0a1628] border-b border-[#f0a500] px-4 py-3">
                  <h2 className="psp-h3 text-white">Most Honored Schools</h2>
                </div>
                <div className="p-4 space-y-3">
                  {data.topSchools.slice(0, 10).map((school, idx) => (
                    <div key={school.slug} className="flex items-center gap-2">
                      <span className="text-[#f0a500] font-bold w-6">{idx + 1}.</span>
                      <Link
                        href={`/${sport}/schools/${school.slug}`}
                        className="text-blue-400 hover:text-blue-300 flex-1 text-sm"
                      >
                        {school.name}
                      </Link>
                      <span className="text-gray-300 text-sm">{school.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Pages */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
              <div className="bg-[#0a1628] border-b border-[#f0a500] px-4 py-3">
                <h2 className="psp-h3 text-white">Related Pages</h2>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href={`/${sport}/championships`}
                  className="flex items-center gap-2 py-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span>🏆</span> {meta.name} Championships
                </Link>
                <Link
                  href={`/${sport}/records`}
                  className="flex items-center gap-2 py-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span>📈</span> {meta.name} Records
                </Link>
                <Link
                  href={`/${sport}/leaderboards/${meta.statCategories[0] || "scoring"}`}
                  className="flex items-center gap-2 py-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span>📊</span> {meta.name} Leaderboards
                </Link>
                <Link
                  href="/awards"
                  className="flex items-center gap-2 py-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span>🏅</span> All Sports Awards Hub
                </Link>
              </div>
            </div>

            {/* About */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
              <div className="bg-[#0a1628] border-b border-[#f0a500] px-4 py-3">
                <h2 className="psp-h3 text-white">About</h2>
              </div>
              <div className="p-4 space-y-3 text-sm text-gray-300">
                <p>
                  This archive contains all {meta.name.toLowerCase()} awards and honors
                  for Philadelphia-area high schools, spanning All-City, league, state,
                  and individual honors.
                </p>
                <p>
                  Browse by year or filter by award category. Use the year
                  dropdown to jump to a specific season, or decade pills to narrow the range.
                </p>
                <p className="text-xs text-gray-300 mt-4">
                  Data compiled from historical archives and verified sources.
                </p>
                <p className="text-xs text-blue-400 mt-2">
                  Source: <span className="text-gray-300">Ted Silary Archives, MaxPreps, PIAA</span>
                </p>
              </div>
            </div>

            {/* Promo */}
            <div>
              <PSPPromo size="sidebar" />
            </div>
          </aside>
        </div>
      </div>

      {/* JsonLD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: meta.name, url: `https://phillysportspack.com/${sport}` },
          { name: "Awards & Honors", url: `https://phillysportspack.com/${sport}/awards` },
        ]}
      />
    </div>
  );
}
