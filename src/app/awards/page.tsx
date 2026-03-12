import { Metadata } from "next";
import Link from "next/link";
import {
  getAwardsSummary,
  getRecentAwards,
  getTopAwardedSchools,
  getAwardsByType,
} from "@/lib/data/awards-hub";
import { SPORT_META, VALID_SPORTS } from "@/lib/sports";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import SportIcon from "@/components/ui/SportIcon";

export const metadata: Metadata = {
  title: "Awards & Honors | PhillySportsPack",
  description:
    "Philadelphia high school sports awards, All-City selections, Hall of Famers, and athlete honors across all sports.",
  openGraph: {
    title: "Awards & Honors | PhillySportsPack",
    description: "Discover award-winning athletes and honors in Philadelphia high school sports.",
    url: "https://phillysportspack.com/awards",
  },
};

export const revalidate = 3600; // 1 hour

interface AwardsPageProps {
  searchParams: Promise<{
    type?: string;
    sport?: string;
    year?: string;
    page?: string;
  }>;
}

export default async function AwardsPage({ searchParams }: AwardsPageProps) {
  const params = await searchParams;
  const selectedType = params.type || "all-city";
  const selectedSport = params.sport || "football";
  const selectedYear = params.year ? parseInt(params.year) : undefined;
  const page = parseInt(params.page || "1");

  // Fetch data
  const [summary, topSchools, awards] = await Promise.all([
    getAwardsSummary(),
    getTopAwardedSchools(15),
    getAwardsByType(selectedType, selectedSport, 100),
  ]);

  // Filter by year if specified
  const filteredAwards = selectedYear
    ? awards.filter((a) => a.seasons?.year_start === selectedYear)
    : awards;

  // Paginate
  const pageSize = 50;
  const totalPages = Math.ceil(filteredAwards.length / pageSize);
  const paginatedAwards = filteredAwards.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const awardTypeLabel =
    selectedType === "all-city"
      ? "All-City"
      : selectedType === "player-of-year"
        ? "Player of the Year"
        : selectedType === "hall-of-fame"
          ? "Hall of Fame"
          : selectedType === "all-league"
            ? "All-League"
            : selectedType;

  return (
    <main id="main-content" className="flex-1">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: "Awards", url: "https://phillysportspack.com/awards" },
      ]} />
      <Breadcrumb items={[{ label: "Awards", href: "/awards" }]} />

      {/* Hero Section */}
      <div
        className="text-center py-8 px-4 mb-8"
        style={{
          background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a3a52 100%)",
        }}
      >
        <h1 className="text-4xl font-bebas mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
          Awards &amp; Honors
        </h1>
        <p className="text-lg text-gray-400 mb-4">
          Celebrating elite athletes across Philadelphia high school sports
        </p>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-6">
          <div className="p-4 rounded-lg" style={{ background: "rgba(240, 165, 0, 0.1)" }}>
            <div className="text-3xl font-bold" style={{ color: "var(--psp-gold)" }}>
              {summary.total.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 mt-1">Total Awards</div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: "rgba(240, 165, 0, 0.1)" }}>
            <div className="text-3xl font-bold" style={{ color: "var(--psp-gold)" }}>
              {Object.keys(summary.byType).length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Award Types</div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: "rgba(240, 165, 0, 0.1)" }}>
            <div className="text-3xl font-bold" style={{ color: "var(--psp-gold)" }}>
              {summary.yearRange.max - summary.yearRange.min + 1}
            </div>
            <div className="text-xs text-gray-600 mt-1">Years Covered</div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 px-4">
        {/* Main Content */}
        <div>
          {/* Award Type Tabs */}
          <div className="mb-8">
            <h2 className="text-xl font-bebas mb-4 text-gray-300" style={{ fontFamily: "var(--font-bebas)" }}>
              Award Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all-city", label: "All-City" },
                { value: "all-league", label: "All-League" },
                { value: "player-of-year", label: "Player of the Year" },
                { value: "hall-of-fame", label: "Hall of Fame" },
              ].map((tab) => (
                <Link
                  key={tab.value}
                  href={`/awards?type=${tab.value}&sport=${selectedSport}`}
                  className="px-5 py-3 rounded text-sm font-semibold transition-all duration-200"
                  style={{
                    border: `2px solid ${selectedType === tab.value ? "var(--psp-gold)" : "#333"}`,
                    background:
                      selectedType === tab.value
                        ? "var(--psp-gold)"
                        : "transparent",
                    color:
                      selectedType === tab.value
                        ? "var(--psp-navy)"
                        : "var(--psp-gold)",
                  }}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Sport Filter Pills */}
          <div className="mb-8">
            <h3 className="text-sm text-gray-500 mb-3 font-semibold uppercase">
              Filter by Sport
            </h3>
            <div className="flex flex-wrap gap-2">
              {VALID_SPORTS.map((sport) => (
                <Link
                  key={sport}
                  href={`/awards?type=${selectedType}&sport=${sport}`}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2"
                  style={{
                    border: `1px solid ${SPORT_COLORS_HEX[sport] || "var(--psp-gold)"}`,
                    background:
                      selectedSport === sport
                        ? SPORT_COLORS_HEX[sport]
                        : "transparent",
                    color:
                      selectedSport === sport
                        ? "white"
                        : SPORT_COLORS_HEX[sport],
                  }}
                >
                  <SportIcon sport={sport} size="sm" />
                  {SPORT_META[sport]?.name || sport}
                </Link>
              ))}
            </div>
          </div>

          {/* Awards Table */}
          <div className="mb-8">
            {paginatedAwards.length === 0 ? (
              <div className="text-center p-8 bg-gray-900 rounded-lg text-gray-500">
                <p>No awards found for this filter.</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-700">
                        <th className="p-4 text-left text-sm font-semibold" style={{ color: "var(--psp-gold)" }}>
                          Player
                        </th>
                        <th className="p-4 text-left text-sm font-semibold" style={{ color: "var(--psp-gold)" }}>
                          School
                        </th>
                        <th className="p-4 text-left text-sm font-semibold" style={{ color: "var(--psp-gold)" }}>
                          Year
                        </th>
                        <th className="p-4 text-left text-sm font-semibold" style={{ color: "var(--psp-gold)" }}>
                          Award
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAwards.map((award) => (
                        <tr key={award.id} className="border-b border-gray-800">
                          <td className="p-4 text-gray-300">
                            {award.players ? (
                              <Link
                                href={`/${award.sport_id}/players/${award.players.slug}`}
                                className="font-medium"
                                style={{ color: "var(--psp-gold)" }}
                              >
                                {award.players.name}
                              </Link>
                            ) : (
                              <span>Unknown</span>
                            )}
                          </td>
                          <td className="p-4 text-gray-300">
                            {award.players?.schools ? (
                              <Link
                                href={`/${award.sport_id}/schools/${award.players.schools.slug}`}
                                className="text-gray-300"
                              >
                                {award.players.schools.name}
                              </Link>
                            ) : (
                              <span>—</span>
                            )}
                          </td>
                          <td className="p-4 text-gray-500 text-sm">
                            {award.seasons?.year_start || "—"}
                          </td>
                          <td className="p-4 text-gray-300 text-sm">
                            <span
                              className="inline-block px-3 py-1 rounded text-xs font-semibold"
                              style={{
                                background: "rgba(240, 165, 0, 0.15)",
                                color: "var(--psp-gold)",
                              }}
                            >
                              {award.award_name || award.award_type || "Award"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/awards?type=${selectedType}&sport=${selectedSport}&page=${p}`}
                        className="px-3 py-2 rounded text-sm"
                        style={{
                          border:
                            page === p
                              ? "2px solid var(--psp-gold)"
                              : "1px solid #333",
                          background:
                            page === p
                              ? "var(--psp-gold)"
                              : "transparent",
                          color: page === p ? "var(--psp-navy)" : "#ccc",
                          fontWeight: page === p ? 600 : 500,
                        }}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="grid gap-6">
          {/* Top Schools Widget */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3
              className="text-lg mb-4 pb-2 border-b border-gray-700 uppercase"
              style={{
                fontFamily: "var(--font-bebas)",
                color: "var(--psp-gold)",
              }}
            >
              TOP SCHOOLS
            </h3>
            <div className="grid gap-3">
              {topSchools.slice(0, 10).map((school, idx) => (
                <Link
                  key={school.id}
                  href={`/${selectedSport}/schools/${school.slug}`}
                  className="flex justify-between items-center py-2 text-gray-300 transition-colors duration-200"
                  style={{
                    borderBottom: idx < 9 ? "1px solid #222" : "none",
                  }}
                >
                  <span className="font-medium">{school.name}</span>
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      background: "rgba(240, 165, 0, 0.2)",
                      color: "var(--psp-gold)",
                    }}
                  >
                    {school.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Award Stats Widget */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3
              className="text-lg mb-4 pb-2 border-b border-gray-700 uppercase"
              style={{
                fontFamily: "var(--font-bebas)",
                color: "var(--psp-gold)",
              }}
            >
              AWARD TYPES
            </h3>
            <div className="grid gap-2 text-sm">
              {Object.entries(summary.byType)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 8)
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="flex justify-between text-gray-500 capitalize"
                  >
                    <span>
                      {type.replace(/-/g, " ")}
                    </span>
                    <span className="font-semibold" style={{ color: "var(--psp-gold)" }}>
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
