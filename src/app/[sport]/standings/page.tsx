import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import SkeletonTable from "@/components/ui/SkeletonTable";
import SeasonSelector from "./SeasonSelector";
import {
  SPORT_META,
  getLeagueStandings,
  getAvailableStandingsSeasons,
  type Standing,
} from "@/lib/data";
import type { Metadata } from "next";
import StandingsTable from "./StandingsTable";

export const revalidate = 3600;
export const dynamic = "force-dynamic";
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  return {
    title: `Standings — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `League standings for Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}. View season records, win percentages, and championship teams.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/standings`,
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

/**
 * Async data loader component
 */
async function StandingsLoader({ sport, season }: { sport: string; season?: string }) {
  const allSeasons = await getAvailableStandingsSeasons(sport);

  // Filter out future seasons — only show seasons that have started
  // For school year "2025-26", year_start=2025 which started fall 2025
  // For school year "2026-27", year_start=2026 which hasn't started yet (starts fall 2026)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed
  // If before August, the current school year started last calendar year
  const currentSchoolYearStart = currentMonth < 7 ? currentYear - 1 : currentYear;
  const availableSeasons = allSeasons.filter(s => {
    const yearStart = parseInt(s.split('-')[0]);
    return yearStart <= currentSchoolYearStart;
  });

  // Default to most recent completed season
  const defaultSeason = season || availableSeasons[0];

  if (!defaultSeason) {
    return (
      <div className="rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-6 text-center text-gray-300">
        No standings data available yet.
      </div>
    );
  }

  let standings = await getLeagueStandings(sport, defaultSeason);

  // Filter out "Other" league (schools with no league_id — non-league opponents)
  standings = standings.filter(lg => lg.league_name !== 'Other' && lg.league_id !== 0);

  if (!standings || standings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-6 text-center text-gray-300">
        No standings data available for {defaultSeason}.
      </div>
    );
  }

  return (
    <>
      {/* Season Selector */}
      {availableSeasons.length > 1 && (
        <SeasonSelector sport={sport} currentSeason={defaultSeason} availableSeasons={availableSeasons} />
      )}

      {/* Standings Table */}
      <StandingsTable standings={standings} sport={sport} />
    </>
  );
}

export default async function StandingsPage({ params, searchParams }: { params: Promise<PageParams>; searchParams: Promise<{ season?: string }> }) {
  const sport = await validateSportParam(params);
  const { season } = await searchParams;
  const meta = SPORT_META[sport];

  const jsonLdItems = [
    { name: "Home", url: "https://phillysportspack.com" },
    { name: meta.name, url: `https://phillysportspack.com/${sport}` },
    { name: "Standings", url: `https://phillysportspack.com/${sport}/standings` },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: meta.name, href: `/${sport}` },
    { label: "Standings", href: `/${sport}/standings` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={jsonLdItems} />

      <div className="min-h-screen bg-[#0a1628]">
        {/* Hero Section */}
        <div className="border-b-4 border-[var(--psp-gold)] px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-8 max-w-7xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {meta.name} <span className="text-[var(--psp-gold)]">Standings</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              League standings, win percentages, and championship teams.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Standings Column */}
          <div className="lg:col-span-3">
            <Suspense
              fallback={<SkeletonTable rows={8} columns={5} />}
            >
              <StandingsLoader sport={sport} season={season} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <div className="rounded-lg border border-[var(--psp-gold)] bg-[var(--psp-navy-mid)] p-6 shadow-lg">
              <div className="text-xs font-bold text-[var(--psp-gold)] uppercase mb-3">📊 How to Read</div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>🏆 <span className="font-semibold">Champion</span> — League champion (highest seed)</li>
                <li><span className="font-semibold">W-L-T</span> — Wins, losses, ties</li>
                <li><span className="font-semibold">Win %</span> — Winning percentage (ties count as 0.5)</li>
                <li><span className="font-semibold">PF-PA</span> — Points for / points against</li>
              </ul>
            </div>

            {/* PSP Promo */}
            <PSPPromo size="sidebar" />

            {/* Info Card */}
            <div className="rounded-lg bg-gray-900 p-6">
              <div className="text-sm font-bold text-gray-300 uppercase mb-3">About Standings</div>
              <p className="text-sm text-gray-300">
                Standings show final-season records for each team. Teams are sorted by wins, then ties, then winning percentage.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <DataSourceBadge source="PhillySportsPack Database" />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
