import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import { SPORT_META, getAllCityByYear, getAllCitySummary, type AwardRecord } from "@/lib/data";
import AllCityArchive from "./AllCityArchive";
import type { Metadata } from "next";

export const revalidate = 86400; // 24 hours
export const dynamic = "force-dynamic";
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];
  return {
    title: `All-City Teams — ${meta.name} — PhillySportsPack`,
    description: `Complete archive of Philadelphia All-City and All-Scholastic ${meta.name.toLowerCase()} team selections spanning decades.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/all-city`,
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

export default async function AllCityPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);

  const meta = SPORT_META[sport];
  const awards = (await getAllCityByYear(sport)) || [];
  const summary = await getAllCitySummary(sport);

  // Group awards by year (skip awards with no valid season)
  const byYear: Record<string, { label: string; yearStart: number; awards: AwardRecord[] }> = {};
  for (const award of awards) {
    const season = award.seasons;
    if (!season?.year_start) continue; // Skip awards with no season data
    const yearKey = season.year_start.toString();
    if (!byYear[yearKey]) {
      byYear[yearKey] = {
        label: season.label || yearKey,
        yearStart: season.year_start,
        awards: [],
      };
    }
    byYear[yearKey].awards.push(award);
  }

  // Sort by year descending
  const sortedYears = Object.values(byYear).sort((a, b) => b.yearStart - a.yearStart);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0f2040]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] border-b-4 border-[#f0a500]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "All-City Teams" },
            ]}
          />
          <div className="mt-4 flex items-start gap-4">
            <div className="flex-1">
              <h1 className="psp-h1 text-white mb-2">
                All-City Teams
              </h1>
              <p className="text-gray-300 text-lg">
                Complete archive of Philadelphia All-City and All-Scholastic selections
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
                {summary.totalSelections.toLocaleString()}
              </div>
              <div className="text-gray-300 text-sm">Total Selections</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-2xl font-bold">
                {summary.yearsSpanned.max - summary.yearsSpanned.min + 1}
              </div>
              <div className="text-gray-300 text-sm">Years Spanned</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl font-bold">
                {summary.schoolsRepresented}
              </div>
              <div className="text-gray-300 text-sm">Schools Represented</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 text-2xl font-bold">
                {summary.yearsSpanned.min}-{summary.yearsSpanned.max}
              </div>
              <div className="text-gray-300 text-sm">Timeline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {awards.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-300 text-lg">
                  No All-City selections data available for {meta.name.toLowerCase()}.
                </p>
              </div>
            ) : (
              <AllCityArchive years={sortedYears} sport={sport} />
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Top Schools */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
              <div className="bg-[#0a1628] border-b border-[#f0a500] px-4 py-3">
                <h2 className="psp-h3 text-white">Top Schools</h2>
              </div>
              <div className="p-4 space-y-3">
                {summary.topSchools.map((school, idx) => (
                  <div key={school.name} className="flex items-center gap-2">
                    <span className="text-[#f0a500] font-bold w-6">{idx + 1}.</span>
                    <Link
                      href={`/${sport}/schools/${school.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-blue-400 hover:text-blue-300 flex-1"
                    >
                      {school.name}
                    </Link>
                    <span className="text-gray-300 text-sm">{school.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-[#0a1628] border-b border-[#f0a500] px-4 py-3">
                <h2 className="psp-h3 text-white">About</h2>
              </div>
              <div className="p-4 space-y-3 text-sm text-gray-300">
                <p>
                  This archive contains All-City and All-Scholastic team selections for Philadelphia high school sports.
                </p>
                <p>
                  Pre-1969 selections are typically listed as "All-Scholastic" without offense/defense splits. Post-1969 selections typically include offense and defense positions.
                </p>
                <p className="text-xs text-gray-300 mt-4">
                  Data compiled from historical archives and verified sources.
                </p>
                <p className="text-xs text-blue-400 mt-2">
                  Source: <span className="text-gray-300">Ted Silary Archives</span>
                </p>
              </div>
            </div>

            {/* Promo */}
            <div className="mt-6">
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
          { name: "All-City Teams", url: `https://phillysportspack.com/${sport}/all-city` },
        ]}
      />
    </div>
  );
}
