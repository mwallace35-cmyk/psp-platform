import Link from "next/link";
import nextDynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META, getSchoolBySlug, getSchoolTeamSeasons, getSchoolChampionships, getSchoolNotablePlayers, getCurrentSeasonData, type School, type TeamSeason, type Championship, type NotablePlayer } from "@/lib/data";
import CurrentSeasonBlock from "@/components/school/CurrentSeasonBlock";
import { Breadcrumb, TrendChart } from "@/components/ui";
import WinLossBar from "@/components/ui/WinLossBar";
import BookmarkButton from "@/components/ui/BookmarkButton";
import PSPPromo from "@/components/ads/PSPPromo";
import ShareButtons from "@/components/social/ShareButtons";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import RelatedArticles from "@/components/articles/RelatedArticles";
import WinLossTrendChart from "@/components/charts/WinLossTrendChartLazy";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import MethodologyNote from "@/components/ui/MethodologyNote";
import { captureError } from "@/lib/error-tracking";
import { buildOgImageUrl } from "@/lib/og-utils";
import { getSchoolRivalries } from "@/lib/data/games";
import RivalryRecord from "@/components/school/RivalryRecord";
import type { Metadata } from "next";
import type { SeasonRecord } from "@/components/viz/types";
import ClientDynastyTimeline from "@/components/viz/ClientDynastyTimeline";

// Dynamic import for heavy client component
const CorrectionForm = nextDynamic(() => import("@/components/corrections/CorrectionForm"), {
  loading: () => <div className="text-center py-4 text-gray-500 text-sm">Loading form...</div>,
});

export const revalidate = 86400; // ISR: daily
export const dynamic = "force-dynamic";
type PageParams = { sport: string; slug: string };

/**
 * Generate static params for popular schools
 *
 * Note: Generating static params for ALL schools would be computationally expensive
 * during build time and could significantly increase build duration. Instead, we
 * pre-render a curated set of high-traffic schools and rely on ISR (Incremental Static
 * Regeneration) with the revalidate setting above to handle other schools on-demand.
 *
 * Schools not in this list will be generated on first request and cached.
 */
// Dynamic — too many slug combos to pre-render
export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, slug } = await params;
  const sportValidated = await validateSportParamForMetadata({ sport });
  if (!sportValidated) return {};
  // Validate sport param
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  const ogImageUrl = buildOgImageUrl({
    title: school.name,
    subtitle: `${SPORT_META[sportValidated].name} — School Profile`,
    sport: sportValidated,
    type: "school",
  });
  return {
    title: `${school.name} ${SPORT_META[sportValidated].name} — PhillySportsPack`,
    description: `${school.name} ${SPORT_META[sportValidated].name.toLowerCase()} statistics, season results, championships, and notable players.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sportValidated}/schools/${slug}`,
    },
    openGraph: {
      title: `${school.name} ${SPORT_META[sportValidated].name} — PhillySportsPack`,
      description: `${school.name} ${SPORT_META[sportValidated].name.toLowerCase()} statistics, season results, championships, and notable players.`,
      url: `https://phillysportspack.com/${sportValidated}/schools/${slug}`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${school.name} ${SPORT_META[sportValidated].name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${school.name} ${SPORT_META[sportValidated].name} — PhillySportsPack`,
      description: `${school.name} ${SPORT_META[sportValidated].name.toLowerCase()} statistics, season results, championships, and notable players.`,
      images: [ogImageUrl],
    },
  };
}

export default async function SchoolProfilePage({ params }: { params: Promise<PageParams> }) {
  const { sport: sportRaw, slug } = await params;
  const sport = await validateSportParam({ sport: sportRaw });

  const schoolData = await getSchoolBySlug(slug);
  if (!schoolData) notFound();

  const school: School = {
    ...schoolData,
    leagues: Array.isArray(schoolData.leagues) ? schoolData.leagues[0] : schoolData.leagues,
  };

  const meta = SPORT_META[sport];

  // Get school data - use allSettled to prevent one failure from crashing the page
  let teamSeasons: TeamSeason[] = [];
  let championships: Championship[] = [];
  let notablePlayers: NotablePlayer[] = [];
  let rivalries: any[] = [];
  let currentSeasonData: Awaited<ReturnType<typeof getCurrentSeasonData>> = null;

  try {
    const results = await Promise.allSettled([
      getSchoolTeamSeasons(school.id, sport),
      getSchoolChampionships(school.id, sport),
      getSchoolNotablePlayers(school.id, sport, 10),
      getSchoolRivalries(school.id, sport),
      getCurrentSeasonData(school.id, sport),
    ]);

    if (results[0].status === "fulfilled") teamSeasons = results[0].value;
    if (results[1].status === "fulfilled") championships = results[1].value;
    if (results[2].status === "fulfilled") notablePlayers = results[2].value;
    if (results[3].status === "fulfilled") rivalries = results[3].value;
    if (results[4].status === "fulfilled") currentSeasonData = results[4].value;

    if (results[0].status === "rejected") captureError(results[0].reason, { sport, slug, fetch: "getSchoolTeamSeasons" });
    if (results[1].status === "rejected") captureError(results[1].reason, { sport, slug, fetch: "getSchoolChampionships" });
    if (results[2].status === "rejected") captureError(results[2].reason, { sport, slug, fetch: "getSchoolNotablePlayers" });
    if (results[3].status === "rejected") captureError(results[3].reason, { sport, slug, fetch: "getSchoolRivalries" });
    if (results[4].status === "rejected") captureError(results[4].reason, { sport, slug, fetch: "getCurrentSeasonData" });
  } catch (error) {
    captureError(error, { sport, slug, context: "data_fetching" });
  }

  // Compute all-time record
  const allTimeRecord = teamSeasons.reduce(
    (acc: { w: number; l: number; t: number }, ts: TeamSeason) => ({
      w: acc.w + (ts.wins || 0),
      l: acc.l + (ts.losses || 0),
      t: acc.t + (ts.ties || 0),
    }),
    { w: 0, l: 0, t: 0 }
  );

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Schools", url: `https://phillysportspack.com/${sport}/schools` },
        { name: school.name, url: `https://phillysportspack.com/${sport}/schools/${slug}` },
      ]} />
      {/* School header */}
      <section
        className="py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, ${meta.color}22 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: meta.name, href: `/${sport}` },
            { label: "Schools" },
            { label: school.name }
          ]} />

          <div className="flex items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ background: `${meta.color}20` }}
            >
              {meta.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1
                  className="psp-h1 text-white flex-1"
                >
                  {school.name}
                </h1>
                <BookmarkButton
                  schoolSlug={slug}
                  schoolName={school.name}
                  className="flex-shrink-0"
                />
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {school.leagues && (
                  <span style={{ color: "var(--psp-gold)" }}>{school.leagues?.name}</span>
                )}
                <span className="text-gray-400">{school.city}, {school.state}</span>
                {school.mascot && <span className="text-gray-400">Mascot: {school.mascot}</span>}
                {school.closed_year && (
                  <span className="text-red-400">Closed {school.closed_year}</span>
                )}
              </div>
              <div className="mt-4">
                <ShareButtons
                  url={`/${sport}/schools/${slug}`}
                  title={`${school.name} ${meta.name} — PhillySportsPack`}
                  description={`Check out ${school.name}'s ${meta.name.toLowerCase()} statistics and records on PhillySportsPack.com`}
                />
              </div>
            </div>
          </div>

          {/* Stat bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl">
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="psp-h2 text-white">
                {allTimeRecord.w}-{allTimeRecord.l}{allTimeRecord.t > 0 ? `-${allTimeRecord.t}` : ""}
              </div>
              <div className="text-xs text-gray-400">All-Time Record</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="psp-h2 text-white">
                {championships.length}
              </div>
              <div className="text-xs text-gray-400">Championships</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="psp-h2 text-white">
                {teamSeasons.length}
              </div>
              <div className="text-xs text-gray-400">Seasons on Record</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="psp-h2 text-white">
                {allTimeRecord.w + allTimeRecord.l + allTimeRecord.t > 0
                  ? ((allTimeRecord.w / (allTimeRecord.w + allTimeRecord.l + allTimeRecord.t)) * 100).toFixed(1) + "%"
                  : "—"}
              </div>
              <div className="text-xs text-gray-400">Win Percentage</div>
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Current Season Block - first visible section */}
            {currentSeasonData && (
              <CurrentSeasonBlock
                data={currentSeasonData}
                schoolName={school.name}
                schoolSlug={slug}
                sport={sport}
                sportColor={meta.color}
                sportName={meta.name}
              />
            )}

            {/* Data Source Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <DataSourceBadge
                source="Ted Silary Archives + MaxPreps"
                lastUpdated="2026-03-10"
                confidence="verified"
                detail="School historical data sourced from Ted Silary's archives and MaxPreps. Season records, championships, and statistics are aggregated from verified sources."
              />
            </div>

            {/* Dynasty Timeline */}
            {teamSeasons.length > 1 && (
              <ClientDynastyTimeline
                schoolName={school.name}
                seasons={teamSeasons.map((ts) => ({
                  year: parseInt(ts.seasons?.label?.substring(0, 4) || "0") || new Date().getFullYear(),
                  wins: ts.wins || 0,
                  losses: ts.losses || 0,
                  ties: ts.ties,
                  championships: championships
                    .filter((c) => c.seasons?.label === ts.seasons?.label)
                    .map((c) => c.level || "State"),
                  coach: ts.coaches?.name,
                }))}
                sport={sport}
              />
            )}


            {/* Win-Loss Trend */}
            {teamSeasons.length > 1 && (
              <TrendChart
                data={teamSeasons
                  .sort((a, b) => {
                    const aYear = parseInt(a.seasons?.label?.substring(0, 4) || "0");
                    const bYear = parseInt(b.seasons?.label?.substring(0, 4) || "0");
                    return aYear - bYear;
                  })
                  .map((ts) => ({
                    label: ts.seasons?.label || "",
                    value: (ts.wins || 0) + (ts.losses || 0) + (ts.ties || 0) > 0 
                      ? Math.round(((ts.wins || 0) / ((ts.wins || 0) + (ts.losses || 0) + (ts.ties || 0))) * 100)
                      : 0,
                  }))}
                title="Win Percentage by Season"
                unit="%"
                height={250}
              />
            )}

                        {/* Championships */}
            {championships.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="psp-h2" style={{ color: "var(--psp-navy)" }}>
                    Championships ({championships.length})
                  </h2>
                  <Link
                    href={`/${sport}/championships`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                    style={{
                      background: "rgba(59,130,246,0.1)",
                      color: "var(--psp-blue, #3b82f6)",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }}
                  >
                    All {meta.name} Championships →
                  </Link>
                </div>
                <div className="space-y-2">
                  {championships.map((c: Championship) => (
                    <div key={c.id} className="bg-white rounded-lg border border-[var(--psp-gray-200)] px-4 py-3 flex items-center gap-3">
                      <span className="text-xl">🏆</span>
                      <div>
                        <span className="font-medium text-sm" style={{ color: "var(--psp-navy)" }}>
                          {c.seasons?.label}
                        </span>
                        <span className="text-xs ml-2" style={{ color: "var(--psp-gray-500)" }}>
                          {c.level}{c.leagues?.name ? ` — ${c.leagues.name}` : ""}
                        </span>
                        {c.score && (
                          <span className="text-xs ml-2" style={{ color: "var(--psp-gray-400)" }}>
                            ({c.score})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Awards link */}
                <div className="mt-4">
                  <Link
                    href={`/${sport}/awards`}
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                    style={{ color: "var(--psp-gold)" }}
                  >
                    🏅 View {meta.name} Awards & Honors →
                  </Link>
                </div>
              </div>
            )}

            {/* Rivalries */}
            {rivalries.length > 0 && (
              <div id="rivalries">
                <h2 className="psp-h2 mb-4" style={{ color: "var(--psp-navy)" }}>
                  ⚔️ Head-to-Head Records ({rivalries.length})
                </h2>
                <RivalryRecord
                  rivalries={rivalries.map((r) => ({
                    opponentName: r.opponentName,
                    opponentSlug: r.opponentSlug,
                    wins: r.wins,
                    losses: r.losses,
                    ties: r.ties,
                    totalGames: r.totalGames,
                    lastResult: r.lastGameDate ? {
                      date: r.lastGameDate,
                      homeScore: r.lastGameHomeScore,
                      awayScore: r.lastGameAwayScore,
                      isHome: r.isLastGameHome,
                    } : undefined,
                  }))}
                  sport={sport}
                  schoolName={school.name}
                />
              </div>
            )}

            {/* Season-by-season results */}
            {teamSeasons.length > 0 && (
              <div>
                <h2 className="psp-h2 mb-4" style={{ color: "var(--psp-navy)" }}>
                  Season-by-Season Results
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Season</th>
                        <th className="text-center">W</th>
                        <th className="text-center">L</th>
                        <th className="text-center">T</th>
                        <th className="text-center">PF</th>
                        <th className="text-center">PA</th>
                        <th>Playoff</th>
                        <th>Coach</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamSeasons.map((ts: TeamSeason) => {
                        const hasChampionship = championships.some(c => c.seasons?.label === ts.seasons?.label);
                        return (
                        <tr key={ts.id} style={{ fontWeight: hasChampionship ? "600" : "normal" }}>
                          <td className="font-medium">
                            {ts.seasons?.label ? (
                              <>
                                {hasChampionship && <span className="mr-1.5" aria-label="Championship">🏆</span>}
                                <Link
                                  href={`/${sport}/teams/${slug}/${ts.seasons.label}`}
                                  className="hover:underline"
                                  style={{ color: "var(--psp-blue, #3b82f6)" }}
                                >
                                  {ts.seasons.label}
                                </Link>
                              </>
                            ) : "—"}
                          </td>
                          <td className="text-center">{ts.wins ?? "—"}</td>
                          <td className="text-center">{ts.losses ?? "—"}</td>
                          <td className="text-center">{ts.ties ?? "—"}</td>
                          <td className="text-center">{ts.points_for ?? "—"}</td>
                          <td className="text-center">{ts.points_against ?? "—"}</td>
                          <td className="text-xs">{ts.playoff_result || "—"}</td>
                          <td className="text-xs">
                            {ts.coaches ? (
                              <Link href={`/${sport}/coaches/${ts.coaches.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                                {ts.coaches.name}
                              </Link>
                            ) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* School info card */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                School Info
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt style={{ color: "var(--psp-gray-500)" }}>Location</dt>
                  <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{school.city}, {school.state}</dd>
                </div>
                {school.leagues && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>League</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{school.leagues?.name}</dd>
                  </div>
                )}
                {school.founded_year && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Founded</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{school.founded_year}</dd>
                  </div>
                )}
                {school.mascot && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Mascot</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{school.mascot}</dd>
                  </div>
                )}
                {school.website_url && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Website</dt>
                    <dd>
                      <a href={school.website_url} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: "var(--psp-gold)" }}>
                        Visit →
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link href={`/${sport}/leaderboards/rushing?school=${slug}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  📊 Stat Leaders at {school.name}
                </Link>
                <a href={`#championships`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  🏆 {championships.length} Championship{championships.length !== 1 ? 's' : ''} Won
                </a>
                <Link href={`/search?q=${encodeURIComponent(school.name)}&type=players`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  🔍 Search Players at {school.name}
                </Link>
                {rivalries.length > 0 && (
                  <a href={`#rivalries`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                    ⚔️ Head-to-Head Records ({rivalries.length})
                  </a>
                )}
                <Link href={`/next-level?school=${slug}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  🎓 Alumni Tracker
                </Link>
                <Link href={`/${sport}/schools/${slug}/staff/`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  👔 Coaching Staff
                </Link>
              </div>
            </div>

            {/* Notable Players */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Notable Players
              </h3>
              {notablePlayers.length > 0 ? (
                <ul className="space-y-3">
                  {notablePlayers.map((player: NotablePlayer) => (
                    <li key={player.id} className="text-sm">
                      <Link
                        href={`/${sport}/players/${player.slug}`}
                        className="font-medium hover:underline"
                        style={{ color: "var(--psp-blue, #3b82f6)" }}
                      >
                        {player.name}
                      </Link>
                      <div className="text-xs" style={{ color: "var(--psp-gray-500)" }}>
                        {(player.positions || player.graduation_year) && (
                          <span>
                            {player.positions && (
                              Array.isArray(player.positions)
                                ? player.positions.join(", ")
                                : player.positions
                            )}
                            {player.positions && player.graduation_year && " "}
                            {player.graduation_year && `${player.positions ? "• " : ""}Class of ${player.graduation_year}`}
                          </span>
                        )}
                      </div>
                      {(player.pro_team || player.college) && (
                        <div className="text-xs mt-1" style={{ color: "var(--psp-gold)" }}>
                          {player.pro_team && (
                            <span>
                              {player.pro_league ? `${player.pro_league} • ` : ""}{player.pro_team}
                            </span>
                          )}
                          {player.pro_team && player.college && " • "}
                          {player.college && !player.pro_team && <span>{player.college}</span>}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No notable players with next-level data yet.</p>
              )}
            </div>

            <RelatedArticles entityType="school" entityId={school.id} />

            <PSPPromo size="sidebar" variant={2} />
          </div>
        </div>
      </div>

      {/* Correction Form */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <CorrectionForm entityType="school" entityId={school.id} entityName={school.name} />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            name: school.name,
            sport: meta.name,
            location: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: school.city, addressRegion: school.state } },
            url: `https://phillysportspack.com/${sport}/schools/${slug}`,
          }),
        }}
      />
    </>
  );
}
