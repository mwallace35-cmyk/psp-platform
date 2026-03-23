import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import {
  SPORT_META,
  getBreakoutPlayers,
  type BreakoutAlert,
} from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour
export const dynamic = "force-dynamic";
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  return {
    title: `Breakout Alerts — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `Discover breakout players in Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}. Year-over-year stat jumps and emerging stars.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/breakouts`,
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
 * Breakout Alert Card
 */
function BreakoutCard({ alert }: { alert: BreakoutAlert }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] shadow-lg hover:border-[var(--psp-gold)] transition">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              href={`/${alert.sport_id}/players/${alert.player_slug}`}
              className="text-lg font-bold text-[var(--psp-gold)] hover:underline block"
            >
              {alert.player_name}
            </Link>
            <Link
              href={`/${alert.sport_id}/schools/${alert.school_slug}`}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              {alert.school_name}
            </Link>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[var(--psp-gold)]">
              +{alert.pct_increase}%
            </div>
            <div className="text-xs text-gray-400">Year-over-Year</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {/* Current Season */}
        <div className="rounded bg-gray-900 p-3">
          <div className="text-xs text-gray-400 mb-1">Current</div>
          <div className="text-2xl font-bold text-white">{alert.current_stat}</div>
          <div className="text-xs text-gray-500">{alert.current_season}</div>
        </div>

        {/* Previous Season */}
        <div className="rounded bg-gray-900 p-3">
          <div className="text-xs text-gray-400 mb-1">Previous</div>
          <div className="text-2xl font-bold text-gray-400">{alert.previous_stat}</div>
          <div className="text-xs text-gray-500">{alert.previous_season}</div>
        </div>

        {/* Per Game */}
        <div className="rounded bg-gray-900 p-3">
          <div className="text-xs text-gray-400 mb-1">Per Game</div>
          <div className="text-xl font-bold text-[var(--psp-blue)]">
            {alert.avg_per_game.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">PPG</div>
        </div>

        {/* Projected */}
        <div className="rounded bg-gray-900 p-3">
          <div className="text-xs text-gray-400 mb-1">Projected</div>
          <div className="text-xl font-bold text-[var(--psp-gold)]">
            {alert.projected_total}
          </div>
          <div className="text-xs text-gray-500">11-game season</div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 bg-gray-900 px-4 py-3">
        <Link
          href={`/${alert.sport_id}/players/${alert.player_slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--psp-blue)] hover:text-[var(--psp-gold)] transition"
        >
          View Profile
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default async function BreakoutsPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];

  const breakouts = await getBreakoutPlayers(sport, 15);

  if (!breakouts || breakouts.length === 0) {
    notFound();
  }

  const jsonLdItems = [
    { name: "Home", url: "https://phillysportspack.com" },
    { name: meta.name, url: `https://phillysportspack.com/${sport}` },
    { name: "Breakout Alerts", url: `https://phillysportspack.com/${sport}/breakouts` },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: meta.name, href: `/${sport}` },
    { label: "Breakout Alerts", href: `/${sport}/breakouts` },
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
              🔥 <span className="text-[var(--psp-gold)]">Breakout</span> Alerts
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Biggest year-over-year stat jumps in Philadelphia high school sports.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Content Area */}
          <div className="lg:col-span-2">
            {breakouts.length > 0 ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {breakouts.length} Players Breaking Out
                  </h2>
                  <span className="text-sm text-gray-400">
                    Minimum +100% increase
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {breakouts.map((alert, idx) => (
                    <BreakoutCard key={`${alert.player_id}-${idx}`} alert={alert} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-12 text-center">
                <p className="text-xl text-gray-400">No breakout alerts yet for this season.</p>
                <p className="mt-2 text-sm text-gray-500">
                  Players need at least 5 games and 100%+ stat increase.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="rounded-lg border border-[var(--psp-gold)] bg-[var(--psp-navy-mid)] p-6 shadow-lg">
              <div className="text-xs font-bold text-[var(--psp-gold)] uppercase mb-3">
                ⚡ What's a Breakout?
              </div>
              <p className="text-sm text-gray-300 mb-4">
                A breakout occurs when a player increases a key stat by 100% or more compared to their previous season.
              </p>
              <div className="space-y-3 text-xs text-gray-400 border-t border-gray-700 pt-4">
                <div>
                  <span className="font-semibold text-white">Min. 5 Games</span>
                  <p>Player must play in at least 5 games</p>
                </div>
                <div>
                  <span className="font-semibold text-white">Same School</span>
                  <p>Breakout tracked at the same school</p>
                </div>
                <div>
                  <span className="font-semibold text-white">Consecutive Seasons</span>
                  <p>Seasons must be back-to-back</p>
                </div>
              </div>
            </div>

            {/* PSP Promo */}
            <PSPPromo size="sidebar" />

            {/* Top Stats */}
            {breakouts.length > 0 && (
              <div className="rounded-lg bg-gray-900 p-6">
                <h3 className="mb-4 font-bold text-white">Top Breakouts</h3>
                <div className="space-y-2">
                  {breakouts.slice(0, 5).map((alert, idx) => (
                    <Link
                      key={idx}
                      href={`/${sport}/players/${alert.player_slug}`}
                      className="block rounded bg-[var(--psp-navy-mid)] p-3 hover:bg-opacity-80 transition"
                    >
                      <div className="font-semibold text-white">{idx + 1}.</div>
                      <div className="text-sm text-[var(--psp-gold)]">{alert.player_name}</div>
                      <div className="text-xs text-gray-400">+{alert.pct_increase}%</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Source Badge */}
            <div className="rounded-lg bg-gray-900 p-6">
              <div className="text-sm font-bold text-gray-400 uppercase mb-3">Data Source</div>
              <DataSourceBadge source="PhillySportsPack Database" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
