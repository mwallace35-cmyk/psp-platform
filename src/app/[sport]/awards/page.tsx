import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import { SPORT_META, getAwardsPageData } from "@/lib/data";
import AwardsArchive from "./AwardsArchive";
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

export function generateStaticParams() {
  return [
    { sport: "football" },
    { sport: "basketball" },
    { sport: "baseball" },
    { sport: "track-field" },
    { sport: "lacrosse" },
    { sport: "wrestling" },
    { sport: "soccer" },
  ];
}

export default async function AwardsPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];
  const data = await getAwardsPageData(sport);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0f2040]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] border-b-4 border-[#f0a500]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Awards & Honors" },
            ]}
          />
          <div className="mt-4 flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bebas text-white mb-2">
                Awards & Honors
              </h1>
              <p className="text-gray-300 text-lg">
                Complete archive of Philadelphia {meta.name.toLowerCase()} awards and honors
              </p>
            </div>
            <div className="text-[#f0a500] text-3xl mt-2">
              {meta.emoji}
            </div>
          </div>
        </div>
      </header>

      {/* Stats Strip */}
      <div className="bg-[#0f2040] border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-[#f0a500] text-2xl font-bold">
                {data.totalCount.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Total Awards</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-2xl font-bold">
                {data.tabs.length}
              </div>
              <div className="text-gray-400 text-sm">Award Categories</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl font-bold">
                {data.schoolsRepresented}
              </div>
              <div className="text-gray-400 text-sm">Schools Represented</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 text-2xl font-bold">
                {data.yearsSpanned.min > 0
                  ? `${data.yearsSpanned.min}–${data.yearsSpanned.max}`
                  : "—"}
              </div>
              <div className="text-gray-400 text-sm">Timeline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {data.tabs.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-300 text-lg">
                  No award data available for {meta.name.toLowerCase()} yet.
                </p>
              </div>
            ) : (
              <AwardsArchive tabs={data.tabs} sport={sport} />
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Top Schools */}
            {data.topSchools.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
                <div className="bg-[#0a1628] border-b border-[#f0a500] px-4 py-3">
                  <h3 className="text-white font-bebas text-xl">Most Honored Schools</h3>
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
                      <span className="text-gray-400 text-sm">{school.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
              <div className="bg-[#0a1628] border-b border-[#f0a500] px-4 py-3">
                <h3 className="text-white font-bebas text-xl">About</h3>
              </div>
              <div className="p-4 space-y-3 text-sm text-gray-300">
                <p>
                  This archive contains all {meta.name.toLowerCase()} awards and honors
                  for Philadelphia-area high schools, spanning All-City, league, state,
                  and individual honors.
                </p>
                <p>
                  Use the tabs to browse by award category. Each section is organized
                  by year with decade filter pills for quick navigation.
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  Data compiled from historical archives and verified sources.
                </p>
                <p className="text-xs text-blue-400 mt-2">
                  Source: <span className="text-gray-400">Ted Silary Archives, MaxPreps, PIAA</span>
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
