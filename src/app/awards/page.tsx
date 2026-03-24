import { Metadata } from "next";
import Link from "next/link";
import {
  getAwardsSummary,
  getTopAwardedSchools,
  getChampionshipsSummary,
  getRecentChampionships,
  getDynastyTracker,
  getAwardsCountBySport,
  getProAthletesCount,
  getRecentAwards,
} from "@/lib/data/awards-hub";
import { SPORT_META, VALID_SPORTS } from "@/lib/sports";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import SportIcon from "@/components/ui/SportIcon";
import PSPPromo from "@/components/ads/PSPPromo";
import AwardsHubClient from "./AwardsHubClient";

export const metadata: Metadata = {
  title: "Awards & Honors Hub | PhillySportsPack",
  description:
    "The complete archive of Philadelphia high school sports honors — All-City teams, championships, Player of the Year, dynasties, and pro athletes across all sports since 1887.",
  alternates: { canonical: "https://phillysportspack.com/awards" },
  openGraph: {
    title: "Awards & Honors Hub | PhillySportsPack",
    description:
      "All-City teams, championships, Player of the Year, dynasties — the definitive archive of Philly HS sports honors.",
    url: "https://phillysportspack.com/awards",
  },
};

export const revalidate = 3600; // 1 hour
export const dynamic = 'force-dynamic';

export default async function AwardsHubPage() {
  // Fetch all data in parallel
  const [
    summary,
    topSchools,
    champSummary,
    recentChamps,
    dynastyLeaders,
    awardsBySport,
    proCount,
    recentAwards,
  ] = await Promise.all([
    getAwardsSummary(),
    getTopAwardedSchools(15),
    getChampionshipsSummary(),
    getRecentChampionships(20),
    getDynastyTracker(15),
    getAwardsCountBySport(),
    getProAthletesCount(),
    getRecentAwards(30),
  ]);

  // Build sport card data
  const sportCards = VALID_SPORTS.map((sport) => ({
    id: sport,
    name: SPORT_META[sport].name,
    emoji: SPORT_META[sport].emoji,
    color: SPORT_COLORS_HEX[sport] || "#f0a500",
    awardCount: awardsBySport[sport] || 0,
    champCount: champSummary.bySport[sport] || 0,
  })).filter((s) => s.awardCount > 0 || s.champCount > 0);

  // Compute years of history
  const yearsOfHistory =
    summary.yearRange.max > 0 && summary.yearRange.min > 0
      ? summary.yearRange.max - summary.yearRange.min + 1
      : 90;

  return (
    <main id="main-content" className="flex-1 min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0f2040]">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: "Awards & Honors", url: "https://phillysportspack.com/awards" },
        ]}
      />

      {/* Hero Section */}
      <header
        className="relative overflow-hidden border-b-4"
        style={{ borderColor: "#f0a500" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, #f0a500 0%, transparent 60%), radial-gradient(circle at 80% 60%, #3b82f6 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={[{ label: "Awards & Honors" }]} />
          <div className="mt-4 text-center">
            <h1
              className="psp-h1-lg text-[#f0a500] mb-3"
            >
              AWARDS &amp; HONORS
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              The definitive archive of Philadelphia high school sports excellence
            </p>
          </div>

          {/* Stats removed per design spec — data appears in context below */}
        </div>
      </header>

      {/* Sport Cards Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2
          className="psp-h2 text-[#f0a500] mb-6"
        >
          EXPLORE BY SPORT
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sportCards.map((sport) => (
            <Link
              key={sport.id}
              href={`/${sport.id}/awards`}
              className="group relative overflow-hidden rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:shadow-black/30"
              style={{
                borderColor: sport.color,
                backgroundColor: "#0a1628",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: sport.color }}
                aria-hidden="true"
              />
              <div className="relative p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{sport.emoji}</span>
                  <h3
                    className="psp-h4 group-hover:translate-x-1 group-focus-visible:translate-x-1 transition-transform duration-300"
                    style={{
                      color: sport.color,
                    }}
                  >
                    {sport.name}
                  </h3>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span
                      className="font-bold text-lg"
                      style={{ color: "#f0a500" }}
                    >
                      {sport.awardCount.toLocaleString()}
                    </span>
                    <span
                      className="ml-1"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      awards
                    </span>
                  </div>
                  {sport.champCount > 0 && (
                    <div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: "#3b82f6" }}
                      >
                        {sport.champCount}
                      </span>
                      <span
                        className="ml-1"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        titles
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="mt-3 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider group-hover:translate-x-1 group-focus-visible:translate-x-1 transition-transform duration-300"
                  style={{ color: "#3b82f6" }}
                >
                  View All Awards →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content: Tabs + Sidebar */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Tabbed Content */}
          <div>
            <AwardsHubClient
              recentAwards={recentAwards}
              recentChamps={recentChamps}
              dynastyLeaders={dynastyLeaders}
              topSchools={topSchools}
            />
          </div>

          {/* Sidebar */}
          <aside className="grid gap-6 content-start">
            {/* Dynasty Tracker */}
            {dynastyLeaders.length > 0 && (
              <div
                className="rounded-lg overflow-hidden border"
                style={{
                  backgroundColor: "rgba(10,22,40,0.8)",
                  borderColor: "rgba(240,165,0,0.3)",
                }}
              >
                <div
                  className="px-4 py-3 border-b"
                  style={{
                    background: "linear-gradient(135deg, #0a1628, #1a2a42)",
                    borderColor: "#f0a500",
                  }}
                >
                  <h3
                    className="psp-caption text-[#f0a500]"
                  >
                    Dynasty Tracker
                  </h3>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
                    Most championships all-time
                  </p>
                </div>
                <div className="p-4 space-y-2">
                  {dynastyLeaders.slice(0, 10).map((school, idx) => (
                    <Link
                      key={school.id}
                      href={`/football/schools/${school.slug}`}
                      className="flex items-center gap-3 py-2 transition-colors duration-200 hover:bg-white/5 rounded px-2 -mx-2"
                    >
                      <span
                        className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold"
                        style={{
                          background:
                            idx < 3
                              ? "linear-gradient(135deg, #f0a500, #d4940a)"
                              : "rgba(255,255,255,0.1)",
                          color: idx < 3 ? "#0a1628" : "#f0a500",
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span
                        className="flex-1 text-sm font-medium"
                        style={{ color: "rgba(255,255,255,0.9)" }}
                      >
                        {school.name}
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: "#f0a500" }}
                      >
                        {school.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div
              className="rounded-lg overflow-hidden border"
              style={{
                backgroundColor: "rgba(10,22,40,0.8)",
                borderColor: "rgba(240,165,0,0.3)",
              }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{
                  background: "linear-gradient(135deg, #0a1628, #1a2a42)",
                  borderColor: "#f0a500",
                }}
              >
                <h3
                  className="psp-caption text-[#f0a500]"
                >
                  Quick Links
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { href: "/football/all-city", label: "Football All-City Archive", emoji: "🏈" },
                  { href: "/football/championships", label: "Football Championships", emoji: "🏆" },
                  { href: "/basketball/championships", label: "Basketball Championships", emoji: "🏀" },
                  { href: "/baseball/awards", label: "Baseball Awards", emoji: "⚾" },
                  { href: "/potw", label: "Player of the Week", emoji: "⭐" },
                  { href: "/compare", label: "Compare Players", emoji: "📊" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 py-2 px-2 -mx-2 rounded transition-colors duration-200 hover:bg-white/5 text-sm"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    <span>{link.emoji}</span>
                    <span>{link.label}</span>
                    <span className="ml-auto" style={{ color: "#f0a500" }}>
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Most Honored Schools */}
            {topSchools.length > 0 && (
              <div
                className="rounded-lg overflow-hidden border"
                style={{
                  backgroundColor: "rgba(10,22,40,0.8)",
                  borderColor: "rgba(240,165,0,0.3)",
                }}
              >
                <div
                  className="px-4 py-3 border-b"
                  style={{
                    background: "linear-gradient(135deg, #0a1628, #1a2a42)",
                    borderColor: "#f0a500",
                  }}
                >
                  <h3
                    className="psp-caption text-[#f0a500]"
                  >
                    Most Honored Schools
                  </h3>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
                    By individual award count
                  </p>
                </div>
                <div className="p-4 space-y-2">
                  {topSchools.slice(0, 10).map((school, idx) => (
                    <div
                      key={school.id}
                      className="flex items-center gap-3 py-1 text-sm"
                    >
                      <span
                        className="font-bold w-5 text-right"
                        style={{
                          color: idx < 3 ? "#f0a500" : "rgba(255,255,255,0.7)",
                        }}
                      >
                        {idx + 1}.
                      </span>
                      <span
                        className="flex-1"
                        style={{ color: "rgba(255,255,255,0.85)" }}
                      >
                        {school.name}
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "#f0a500" }}
                      >
                        {school.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promo */}
            <PSPPromo size="sidebar" />
          </aside>
        </div>
      </section>
    </main>
  );
}
