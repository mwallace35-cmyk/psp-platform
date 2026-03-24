import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import {
  SPORT_META,
  getStatByEra,
  getStatTypes,
  getEraSummary,
  type EraStatistic,
} from "@/lib/data";
import type { Metadata } from "next";
import EraChart from "./EraChart";

export const revalidate = 86400; // 1 day
export const dynamic = "force-dynamic";
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  return {
    title: `Statistical Eras — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `See how Philadelphia high school ${SPORT_META[sport].name.toLowerCase()} has evolved over decades. View stat trends, historical averages, and era comparisons.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/eras`,
    },
  };
}

// export function generateStaticParams() {
//   return [
//     { sport: "football" },
//     { sport: "basketball" },
//     { sport: "baseball" },
//   ];
// }

/**
 * Format trend arrow and percentage
 */
function TrendBadge({ trend, pct }: { trend?: "up" | "down" | "stable"; pct?: number }) {
  if (!trend || pct === undefined) return null;

  const color =
    trend === "up" ? "text-red-400" : trend === "down" ? "text-green-400" : "text-gray-400";
  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-bold ${color}`}>
      {arrow} {Math.abs(pct)}%
    </span>
  );
}

/**
 * Statistical Era Stats Table
 */
function EraStatsTable({ eras, statType }: { eras: EraStatistic[]; statType: string }) {
  if (eras.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-8 text-center">
        <p className="text-gray-400">No era data available for this stat type.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)]">
      <table className="w-full text-sm text-gray-200" aria-label="Era champions">
        <thead className="border-b border-gray-700 bg-gray-900">
          <tr>
            <th className="px-4 py-3 text-left font-bold text-white">Era</th>
            <th className="px-4 py-3 text-right font-bold text-white">Avg</th>
            <th className="px-4 py-3 text-right font-bold text-white">Max</th>
            <th className="px-4 py-3 text-right font-bold text-white">Samples</th>
            <th className="px-4 py-3 text-right font-bold text-white">Trend</th>
          </tr>
        </thead>
        <tbody>
          {eras.map((era, idx) => (
            <tr
              key={era.decade}
              className={idx % 2 === 0 ? "bg-[var(--psp-navy-mid)]" : "bg-gray-900"}
            >
              <td className="px-4 py-3 font-semibold text-[var(--psp-gold)]">
                {era.decade_label}
              </td>
              <td className="px-4 py-3 text-right text-white">
                {era.avg_value.toFixed(1)}
              </td>
              <td className="px-4 py-3 text-right text-gray-300">
                {era.max_value}
              </td>
              <td className="px-4 py-3 text-right text-gray-400">
                {era.sample_size.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right">
                <TrendBadge trend={era.trend} pct={era.trend_pct} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ErasPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];

  const statTypes = getStatTypes(sport);

  if (statTypes.length === 0) {
    notFound();
  }

  // Load data for first stat type by default
  const defaultStatType = statTypes[0];
  const eras = await getStatByEra(sport, defaultStatType.key);

  if (!eras || eras.length === 0) {
    notFound();
  }

  const summary = getEraSummary(sport, defaultStatType.key, eras);

  const jsonLdItems = [
    { name: "Home", url: "https://phillysportspack.com" },
    { name: meta.name, url: `https://phillysportspack.com/${sport}` },
    { name: "Statistical Eras", url: `https://phillysportspack.com/${sport}/eras` },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: meta.name, href: `/${sport}` },
    { label: "Statistical Eras", href: `/${sport}/eras` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={jsonLdItems} />

      <div className="min-h-screen bg-[#0a1628]">
        {/* Hero Section */}
        <div className="border-b-4 border-[var(--psp-gold)] px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-8 max-w-7xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              How the Game <span className="text-[var(--psp-gold)]">Changed</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Explore statistical trends across decades of Philadelphia high school sports.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stat Type Selector */}
            <div className="rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-6">
              <h2 className="mb-4 text-lg font-bold text-white">Select Statistic</h2>
              <div className="flex flex-wrap gap-2">
                {statTypes.map((statType) => (
                  <Link
                    key={statType.key}
                    href={`/${sport}/eras?stat=${statType.key}`}
                    className={`rounded px-4 py-2 text-sm font-bold transition ${
                      statType.key === defaultStatType.key
                        ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {statType.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-6">
              <h2 className="mb-4 text-xl font-bold text-white">
                {defaultStatType.label} Over Time
              </h2>
              <EraChart eras={eras} statType={defaultStatType} />
            </div>

            {/* Summary */}
            {summary && (
              <div className="rounded-lg border-l-4 border-[var(--psp-gold)] bg-gray-900 p-6">
                <p className="text-gray-300 italic">{summary}</p>
              </div>
            )}

            {/* Stats Table */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-white">Era Statistics</h2>
              <EraStatsTable eras={eras} statType={defaultStatType.key} />
            </div>

            {/* Context */}
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
              <h3 className="mb-3 text-lg font-bold text-white">About Statistical Eras</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong>Eras</strong> are grouped by decade (1960s, 1970s, etc.)</li>
                <li>• <strong>Average</strong> shows mean stat value per player in that era</li>
                <li>• <strong>Trend</strong> compares current era to previous decade</li>
                <li>• <strong>Samples</strong> indicates how many player-seasons contributed</li>
                <li>• Stats reflect players with recorded data in our database</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="rounded-lg border border-[var(--psp-gold)] bg-[var(--psp-navy-mid)] p-6 shadow-lg">
              <div className="text-xs font-bold text-[var(--psp-gold)] uppercase mb-3">
                📊 Quick Insights
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <div className="font-semibold text-white mb-1">Peak Era</div>
                  <div>
                    {eras[0]?.decade_label || "N/A"} averaged{" "}
                    <span className="text-[var(--psp-gold)] font-bold">
                      {eras[0]?.avg_value.toFixed(1) || "—"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Sample Size</div>
                  <div>{eras.reduce((sum, e) => sum + e.sample_size, 0).toLocaleString()} players</div>
                </div>
                {eras[0]?.trend && (
                  <div>
                    <div className="font-semibold text-white mb-1">Current Trend</div>
                    <div>
                      {eras[0].trend === "up"
                        ? "📈 Increasing"
                        : eras[0].trend === "down"
                          ? "📉 Decreasing"
                          : "➡️ Stable"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PSP Promo */}
            <PSPPromo size="sidebar" />

            {/* Compare Link */}
            <div className="rounded-lg bg-gray-900 p-6">
              <h3 className="mb-3 font-bold text-white">Explore More</h3>
              <div className="space-y-2">
                <Link
                  href={`/${sport}/leaderboards/rush_yards`}
                  className="block rounded bg-[var(--psp-blue)] px-3 py-2 text-sm font-bold text-white hover:bg-opacity-90"
                >
                  Leaderboards
                </Link>
                <Link
                  href={`/${sport}/records`}
                  className="block rounded bg-gray-700 px-3 py-2 text-sm font-bold text-white hover:bg-gray-600"
                >
                  Records
                </Link>
              </div>
            </div>

            {/* Source Badge */}
            <div className="rounded-lg bg-gray-900 p-6">
              <div className="text-sm font-bold text-gray-400 uppercase mb-3">Data Source</div>
              <DataSourceBadge source="PhillySportsPack Database" />
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
