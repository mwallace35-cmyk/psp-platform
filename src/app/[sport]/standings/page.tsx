import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import {
  SPORT_META,
  getLeagueStandings,
  getAvailableStandingsSeasons,
  type Standing,
} from "@/lib/data";
import type { Metadata } from "next";
import StandingsTable from "./StandingsTable";

export const revalidate = 3600;

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

/**
 * Async data loader component
 */
async function StandingsLoader({ sport }: { sport: string }) {
  const standings = await getLeagueStandings(sport);
  const availableSeasons = await getAvailableStandingsSeasons(sport);

  if (!standings || standings.length === 0) {
    notFound();
  }

  return (
    <>
      {/* Season Selector */}
      {availableSeasons.length > 1 && (
        <div className="mb-6 rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-4">
          <label className="block text-sm font-semibold text-gray-300 mb-2">Select Season</label>
          <select
            disabled
            value={availableSeasons[0]}
            className="w-full rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {availableSeasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-500">
            To view different seasons, refresh the page or check back soon.
          </p>
        </div>
      )}

      {/* Standings Table */}
      <StandingsTable standings={standings} sport={sport} />
    </>
  );
}

export default async function StandingsPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
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
        <div className="border-b-4 border-[var(--psp-gold)] px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-8 max-w-6xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {meta.name} <span className="text-[var(--psp-gold)]">Standings</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              League standings, win percentages, and championship teams.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Standings Column */}
          <div className="lg:col-span-2">
            <Suspense
              fallback={
                <div className="rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-6 text-center text-gray-400">
                  Loading standings...
                </div>
              }
            >
              <StandingsLoader sport={sport} />
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
              <div className="text-sm font-bold text-gray-400 uppercase mb-3">About Standings</div>
              <p className="text-sm text-gray-400">
                Standings show final-season records for each team. Teams are sorted by wins, then ties, then winning percentage.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <DataSourceBadge source="PhillySportsPack Database" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
