import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import {
  SPORT_META,
  getTopRivalries,
  getRivalryGames,
  type RivalryRecord,
} from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 3600;
export const dynamic = "force-dynamic";
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  return {
    title: `Rivalries — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `Head-to-head rivalries in Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}. View records, recent meetings, and historic matchups.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/rivalries`,
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
 * Win percentage with 2 decimals
 */
function formatWinPct(wins: number, losses: number, ties: number): string {
  const total = wins + losses + ties;
  if (total === 0) return ".000";
  return ((wins + ties * 0.5) / total).toFixed(3);
}

/**
 * Rivalry Card Component
 */
function RivalryCard({ rivalry, sport }: { rivalry: RivalryRecord; sport: string }) {
  const school1WinPct = formatWinPct(rivalry.school1_wins, rivalry.school2_wins, rivalry.ties);
  const school2WinPct = formatWinPct(rivalry.school2_wins, rivalry.school1_wins, rivalry.ties);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/${sport}/schools/${rivalry.school1.slug}`}
            className="flex-1 text-right font-bold text-[var(--psp-gold)] hover:underline"
          >
            {rivalry.school1.name}
          </Link>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
            <span className="rounded bg-gray-700 px-2 py-1">vs</span>
          </div>
          <Link
            href={`/${sport}/schools/${rivalry.school2.slug}`}
            className="flex-1 font-bold text-[var(--psp-gold)] hover:underline"
          >
            {rivalry.school2.name}
          </Link>
        </div>
      </div>

      {/* Record */}
      <div className="grid grid-cols-3 gap-4 p-4 text-center">
        {/* School 1 Wins */}
        <div className="rounded bg-gray-900 p-3">
          <div className="text-xl font-bold text-white">{rivalry.school1_wins}</div>
          <div className="text-xs text-gray-300">Wins</div>
        </div>

        {/* Ties */}
        <div className="rounded bg-gray-900 p-3">
          <div className="text-xl font-bold text-white">{rivalry.ties}</div>
          <div className="text-xs text-gray-300">Ties</div>
        </div>

        {/* School 2 Wins */}
        <div className="rounded bg-gray-900 p-3">
          <div className="text-xl font-bold text-white">{rivalry.school2_wins}</div>
          <div className="text-xs text-gray-300">Wins</div>
        </div>
      </div>

      {/* Series Stats */}
      <div className="border-t border-gray-700 p-4 text-sm text-gray-300">
        <div className="mb-2">
          <span className="font-semibold">Total Games:</span> {rivalry.total_games}
        </div>
        {rivalry.latest_game_date && (
          <div>
            <span className="font-semibold">Latest Meeting:</span> {rivalry.latest_game_date} ({rivalry.latest_game_score})
          </div>
        )}
      </div>
    </div>
  );
}

export default async function RivalriesPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];

  const topRivalries = await getTopRivalries(sport, 12);

  if (!topRivalries || topRivalries.length === 0) {
    notFound();
  }

  // Get recent games for top rivalry
  const topRivalry = topRivalries[0];
  const recentGames = topRivalry ? await getRivalryGames(topRivalry.school1_id, topRivalry.school2_id, sport, 5) : [];

  const jsonLdItems = [
    { name: "Home", url: "https://phillysportspack.com" },
    { name: meta.name, url: `https://phillysportspack.com/${sport}` },
    { name: "Rivalries", url: `https://phillysportspack.com/${sport}/rivalries` },
  ];

  const breadcrumbItems = [
    { label: meta.name, href: `/${sport}` },
    { label: "Rivalries", href: `/${sport}/rivalries` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={jsonLdItems} />

      <div className="min-h-screen bg-[#0a1628]">
        {/* Hero Section */}
        <div className="border-b-4 border-[var(--psp-gold)] px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-8 max-w-7xl">
            <h1 className="psp-h1 text-white">
              {meta.name} <span className="text-[var(--psp-gold)]">Rivalries</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Explore head-to-head records, historic matchups, and fierce rivalries.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Featured Rivalry */}
          {topRivalry && (
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-white">🔥 Featured Rivalry</h2>
                <RivalryCard rivalry={topRivalry} sport={sport} />

                {/* Recent Games */}
                {recentGames.length > 0 && (
                  <div className="mt-6 rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-6">
                    <h3 className="mb-4 text-lg font-bold text-white">Recent Meetings</h3>
                    <div className="space-y-3">
                      {recentGames.map((game) => (
                        <div key={game.game_id} className="flex items-center justify-between border-b border-gray-700 pb-3">
                          <div className="flex-1">
                            <div className="text-sm text-gray-300">{game.game_date} | {game.season_label}</div>
                            <div className="text-sm font-semibold text-white">
                              {game.home_school.name} vs {game.away_school.name}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-[var(--psp-gold)]">
                            {game.home_score}-{game.away_score}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* All Rivalries Grid */}
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">All Rivalries</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {topRivalries.map((rivalry) => (
                    <RivalryCard key={`${rivalry.school1_id}-${rivalry.school2_id}`} rivalry={rivalry} sport={sport} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How to Use */}
            <div className="rounded-lg border border-[var(--psp-gold)] bg-[var(--psp-navy-mid)] p-6 shadow-lg">
              <div className="text-xs font-bold text-[var(--psp-gold)] uppercase mb-3">💡 Build Your Own</div>
              <p className="text-sm text-gray-300 mb-4">
                Want to compare two specific schools? Visit their profiles to see head-to-head records.
              </p>
              <Link href={`/${sport}/schools`} className="inline-block rounded bg-[var(--psp-gold)] px-4 py-2 text-sm font-bold text-[var(--psp-navy)] hover:bg-opacity-90">
                View Schools
              </Link>
            </div>

            {/* PSP Promo */}
            <PSPPromo size="sidebar" />

            {/* Info Card */}
            <div className="rounded-lg bg-gray-900 p-6">
              <div className="text-sm font-bold text-gray-300 uppercase mb-3">About Rivalries</div>
              <p className="text-sm text-gray-300">
                Rivalries are determined by the most games played between two schools across all seasons in our database.
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
