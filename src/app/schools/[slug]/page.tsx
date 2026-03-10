import Link from "next/link";
import { notFound } from "next/navigation";
import { SPORT_META, VALID_SPORTS } from "@/lib/sports";
import { Breadcrumb, AchievementBadge, Badge } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import ShareButtons from "@/components/social/ShareButtons";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import RelatedArticles from "@/components/articles/RelatedArticles";
import { captureError } from "@/lib/error-tracking";
import { buildOgImageUrl } from "@/lib/og-utils";
import type { Metadata } from "next";
import {
  getSchoolHubData,
  getSchoolAllSportsStats,
  getSchoolNextLevel,
  getSchoolAllChampionships,
  getSchoolRecentSeasons,
  getSchoolArticles,
  type SchoolSportStats,
  type NextLevelAthlete,
  type SchoolChampionshipData,
  type RecentSeasonData,
} from "@/lib/data/school-hub";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 3600; // ISR: 1 hour

type PageParams = { slug: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const school = await getSchoolHubData(slug);
  if (!school) return {};

  const ogImageUrl = buildOgImageUrl({
    title: school.name,
    subtitle: "School Profile",
    type: "school",
  });

  return {
    title: `${school.name} — PhillySportsPack`,
    description: `${school.name} athletics profile. View championships, sports records, next level athletes, and more on PhillySportsPack.`,
    alternates: {
      canonical: `https://phillysportspack.com/schools/${slug}`,
    },
    openGraph: {
      title: `${school.name} — PhillySportsPack`,
      description: `${school.name} athletics profile. View championships, sports records, next level athletes, and more.`,
      url: `https://phillysportspack.com/schools/${slug}`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${school.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${school.name} — PhillySportsPack`,
      description: `${school.name} athletics profile. View championships, sports records, next level athletes, and more.`,
      images: [ogImageUrl],
    },
  };
}

export default async function SchoolHubPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;

  const schoolData = await getSchoolHubData(slug);
  if (!schoolData) notFound();

  const school = schoolData;

  // Fetch all data in parallel with error handling
  let sportsStats: SchoolSportStats[] = [];
  let nextLevelAthletes: NextLevelAthlete[] = [];
  let championships: SchoolChampionshipData[] = [];
  let recentSeasons: RecentSeasonData[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let articles: any[] = [];

  try {
    const results = await Promise.allSettled([
      getSchoolAllSportsStats(school.id),
      getSchoolNextLevel(school.id),
      getSchoolAllChampionships(school.id),
      getSchoolRecentSeasons(school.id, 20),
      getSchoolArticles(school.id, 10),
    ]);

    if (results[0].status === "fulfilled") sportsStats = results[0].value;
    if (results[1].status === "fulfilled") nextLevelAthletes = results[1].value;
    if (results[2].status === "fulfilled") championships = results[2].value;
    if (results[3].status === "fulfilled") recentSeasons = results[3].value;
    if (results[4].status === "fulfilled") articles = results[4].value;

    results.forEach((result, idx) => {
      if (result.status === "rejected") {
        captureError(result.reason, { slug, fetch: ["sportsStats", "nextLevel", "championships", "recentSeasons", "articles"][idx] });
      }
    });
  } catch (error) {
    captureError(error, { slug, context: "school_hub_data_fetching" });
  }

  // Check for upcoming 2026-27 schedule
  let upcomingGameCount = 0;
  let upcomingSport = "football";
  try {
    const supabase = createStaticClient();
    const { count } = await supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .eq("season_id", 145)
      .or(`home_school_id.eq.${school.id},away_school_id.eq.${school.id}`);
    upcomingGameCount = count ?? 0;
  } catch {
    // silently fail
  }

  // Calculate aggregate stats
  const totalWins = sportsStats.reduce((sum, s) => sum + s.wins, 0);
  const totalLosses = sportsStats.reduce((sum, s) => sum + s.losses, 0);
  const totalTies = sportsStats.reduce((sum, s) => sum + s.ties, 0);
  const totalChampionships = championships.length;
  const totalPlayers = sportsStats.reduce((sum, s) => sum + s.player_count, 0);
  const totalNextLevel = nextLevelAthletes.length;

  // Extract color from JSONB colors field if available
  let heroGradient = "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, var(--psp-blue)22 100%)";
  if (school.colors && typeof school.colors === "object") {
    const colors = school.colors as Record<string, string>;
    if (colors.primary) {
      heroGradient = `linear-gradient(135deg, ${colors.primary} 0%, #0a1628 60%, ${colors.primary}22 100%)`;
    }
  }

  // Badge helpers
  const getBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      Public: "bg-blue-100 text-blue-900",
      Private: "bg-purple-100 text-purple-900",
      Charter: "bg-green-100 text-green-900",
    };
    return colors[type] || "bg-gray-100 text-gray-900";
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: "Schools", url: "https://phillysportspack.com/schools" },
          { name: school.name, url: `https://phillysportspack.com/schools/${slug}` },
        ]}
      />

      {/* Hero Section */}
      <section className="py-12 md:py-16" style={{ background: heroGradient }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Schools" },
              { label: school.name },
            ]}
          />

          <div className="flex items-start gap-6 mt-6">
            {/* School color badge */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 border-4"
              style={{
                background: school.colors && typeof school.colors === "object"
                  ? (school.colors as Record<string, string>).primary || "rgba(240, 165, 0, 0.1)"
                  : "rgba(240, 165, 0, 0.1)",
                borderColor: school.colors && typeof school.colors === "object"
                  ? (school.colors as Record<string, string>).primary || "var(--psp-gold)"
                  : "var(--psp-gold)",
              }}
            >
              🏫
            </div>

            <div className="flex-1">
              <h1
                className="text-4xl md:text-5xl text-white mb-3 tracking-wider"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {school.name}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {school.mascot && (
                  <Badge variant="info" className="bg-white/10 text-white">
                    {school.mascot}
                  </Badge>
                )}
                {school.school_type && (
                  <Badge variant="info" className={getBadgeColor(school.school_type)}>
                    {school.school_type}
                  </Badge>
                )}
                {school.piaa_class && (
                  <Badge variant="warning" className="bg-amber-100 text-amber-900">
                    Class {school.piaa_class}
                  </Badge>
                )}
                {school.closed_year && (
                  <Badge variant="error" className="bg-red-100 text-red-900">
                    Closed {school.closed_year}
                  </Badge>
                )}
              </div>

              {/* Location & League */}
              <div className="flex flex-wrap gap-4 text-sm mb-6">
                <span className="text-gray-200">
                  {school.city}, {school.state}
                </span>
                {school.leagues && (
                  <span style={{ color: "var(--psp-gold)" }}>
                    {school.leagues.name}
                  </span>
                )}
              </div>

              {/* School Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {school.address && (
                  <div className="text-sm">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Address</div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(school.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 hover:text-white underline"
                    >
                      {school.address}
                    </a>
                  </div>
                )}
                {school.phone && (
                  <div className="text-sm">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Phone</div>
                    <a
                      href={`tel:${school.phone}`}
                      className="text-gray-200 hover:text-white"
                    >
                      {school.phone}
                    </a>
                  </div>
                )}
                {school.website_url && (
                  <div className="text-sm">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Website</div>
                    <a
                      href={school.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-200 hover:text-blue-100 underline"
                    >
                      Visit →
                    </a>
                  </div>
                )}
                {school.principal && (
                  <div className="text-sm">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Principal</div>
                    <div className="text-gray-200">{school.principal}</div>
                  </div>
                )}
                {school.athletic_director && (
                  <div className="text-sm">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Athletic Director</div>
                    <div className="text-gray-200">{school.athletic_director}</div>
                  </div>
                )}
                {school.founded_year && (
                  <div className="text-sm">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Founded</div>
                    <div className="text-gray-200">{school.founded_year}</div>
                  </div>
                )}
                {school.enrollment && (
                  <div className="text-sm">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Enrollment</div>
                    <div className="text-gray-200">{school.enrollment.toLocaleString()}</div>
                  </div>
                )}
              </div>

              {/* Share buttons */}
              <ShareButtons
                url={`/schools/${slug}`}
                title={`${school.name} — PhillySportsPack`}
                description={`Check out ${school.name}'s athletics profile on PhillySportsPack.com`}
              />
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      {/* Upcoming Schedule Banner */}
      {upcomingGameCount > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <Link
            href={`/${upcomingSport}/teams/${slug}/2026-27`}
            className="block bg-gradient-to-r from-[var(--psp-navy)] to-[#0f2040] rounded-xl p-4 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--psp-gold)]/20 flex items-center justify-center text-2xl flex-shrink-0">
                📅
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--psp-gold)] font-bebas text-xl">2026-27 Schedule Available</p>
                <p className="text-gray-300 text-sm">{upcomingGameCount} game{upcomingGameCount !== 1 ? "s" : ""} scheduled — view the full {upcomingSport} schedule</p>
              </div>
              <span className="text-[var(--psp-gold)] text-sm font-medium group-hover:translate-x-1 transition-transform flex-shrink-0 hidden sm:block">
                View Schedule →
              </span>
            </div>
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* All Sports Section */}
            {sportsStats.length > 0 && (
              <div>
                <div className="mb-6">
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    Sports ({sportsStats.length})
                  </h2>
                  <p className="text-sm text-gray-600">
                    {totalChampionships} Championship{totalChampionships !== 1 ? "s" : ""} • {totalWins}-{totalLosses}{totalTies > 0 ? `-${totalTies}` : ""} All-Time • {totalPlayers} Player{totalPlayers !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sportsStats.map((sport) => (
                    <Link
                      key={sport.sport_id}
                      href={`/${sport.sport_id}/schools/${slug}`}
                      className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-5 hover:shadow-lg transition-shadow block"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{sport.sport_emoji}</span>
                        <h3
                          className="text-lg font-bold flex-1 truncate"
                          style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                        >
                          {sport.sport_name}
                        </h3>
                        {(sport.wins + sport.losses + sport.ties) > 0 ? (
                          <span
                            className="text-lg font-bold tabular-nums whitespace-nowrap"
                            style={{ color: "var(--psp-navy)" }}
                          >
                            {sport.wins}-{sport.losses}{sport.ties > 0 ? `-${sport.ties}` : ""}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400 whitespace-nowrap">
                            {sport.championship_count > 0 ? `${sport.championship_count} title${sport.championship_count !== 1 ? "s" : ""}` : "—"}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-4 text-center border-t border-gray-100 pt-3">
                        <div className="flex-1">
                          <div className="text-base font-bold" style={{ color: "var(--psp-gold)" }}>
                            {sport.championship_count}
                          </div>
                          <div className="text-[11px] text-gray-500">Titles</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-bold" style={{ color: "var(--psp-blue)" }}>
                            {sport.season_count}
                          </div>
                          <div className="text-[11px] text-gray-500">Seasons</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-bold text-gray-600">
                            {sport.player_count}
                          </div>
                          <div className="text-[11px] text-gray-500">Players</div>
                        </div>
                        <div className="flex-1 flex items-center justify-end">
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--psp-blue)" }}
                          >
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Championships Section */}
            {championships.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  Championships ({championships.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {championships.slice(0, 12).map((c) => (
                    <div
                      key={c.id}
                      className="bg-white rounded-lg border border-[var(--psp-gray-200)] px-4 py-3 flex items-center gap-3"
                    >
                      <span className="text-lg">🏆</span>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-medium text-sm truncate"
                          style={{ color: "var(--psp-navy)" }}
                        >
                          {c.year} {c.sport_name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {c.level}{c.league_name ? ` • ${c.league_name}` : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {championships.length > 12 && (
                  <p className="text-sm text-center mt-3" style={{ color: "var(--psp-blue)" }}>
                    + {championships.length - 12} more championships
                  </p>
                )}
              </div>
            )}

            {/* Recent Seasons Section */}
            {recentSeasons.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  Season History ({recentSeasons.length})
                </h2>
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Sport</th>
                          <th>Season</th>
                          <th className="text-center">W</th>
                          <th className="text-center">L</th>
                          <th className="text-center">T</th>
                          <th>Playoff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSeasons.map((season) => {
                          const totalGames = season.wins + season.losses + (season.ties || 0);
                          const winPct = totalGames > 0 ? (season.wins / totalGames * 100).toFixed(0) : "—";
                          const hasRecord = totalGames > 0;
                          return (
                            <tr key={season.id}>
                              <td>
                                <span className="font-medium">{season.sport_name}</span>
                              </td>
                              <td>
                                <Link
                                  href={`/${season.sport_id}/teams/${slug}/${season.season_label}`}
                                  className="hover:underline"
                                  style={{ color: "var(--psp-blue)" }}
                                >
                                  {season.season_label}
                                </Link>
                              </td>
                              <td className="text-center font-medium">{hasRecord ? season.wins : "—"}</td>
                              <td className="text-center font-medium">{hasRecord ? season.losses : "—"}</td>
                              <td className="text-center text-sm">{hasRecord ? (season.ties || "—") : "—"}</td>
                              <td className="text-xs">{season.playoff_result || (hasRecord ? `${winPct}%` : "—")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Next Level Alumni Section — collapsible, shows first 10 */}
            {nextLevelAthletes.length > 0 && (() => {
              // Sort: pros first, then college, alphabetical within
              const sorted = [...nextLevelAthletes].sort((a, b) => {
                if (a.pro_league && !b.pro_league) return -1;
                if (!a.pro_league && b.pro_league) return 1;
                return a.person_name.localeCompare(b.person_name);
              });
              const proCount = sorted.filter(a => a.pro_league).length;
              const INITIAL_SHOW = 10;

              return (
                <div>
                  <h2
                    className="text-2xl font-bold mb-1"
                    style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    Next Level Alumni ({nextLevelAthletes.length})
                  </h2>
                  {proCount > 0 && (
                    <p className="text-sm text-gray-500 mb-4">
                      Including {proCount} professional athlete{proCount !== 1 ? "s" : ""}
                    </p>
                  )}
                  <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Level</th>
                            <th>College / Organization</th>
                            <th>Sport</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sorted.slice(0, INITIAL_SHOW).map((athlete) => (
                            <tr
                              key={athlete.id}
                              className={athlete.pro_league ? "bg-amber-50" : ""}
                            >
                              <td className="font-medium">{athlete.person_name}</td>
                              <td>
                                <AchievementBadge
                                  type={athlete.pro_league ? "pro" : "college"}
                                  showLabel
                                />
                              </td>
                              <td>
                                {athlete.pro_league ? (
                                  <>
                                    <div className="text-sm font-medium">
                                      {athlete.pro_team || athlete.pro_league}
                                    </div>
                                    {athlete.pro_league && athlete.pro_team && (
                                      <div className="text-xs" style={{ color: "var(--psp-gold)" }}>
                                        {athlete.pro_league}
                                      </div>
                                    )}
                                    {athlete.college && (
                                      <div className="text-xs text-gray-400">
                                        via {athlete.college}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="text-sm">
                                    {athlete.college || "—"}
                                  </div>
                                )}
                              </td>
                              <td className="text-sm capitalize">
                                {athlete.sport_id?.replace("-", " ") || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {sorted.length > INITIAL_SHOW && (
                    <p className="text-sm text-center mt-3" style={{ color: "var(--psp-blue)" }}>
                      Showing {INITIAL_SHOW} of {sorted.length} alumni — view sport pages for full lists
                    </p>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* At a Glance Card */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3
                className="font-bold text-sm uppercase tracking-wider mb-4"
                style={{ color: "var(--psp-gray-400)" }}
              >
                At a Glance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--psp-gold)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    {totalChampionships}
                  </div>
                  <div className="text-xs text-gray-500">Championships</div>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    {totalWins}-{totalLosses}
                  </div>
                  <div className="text-xs text-gray-500">All-Time</div>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--psp-blue)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    {totalPlayers}
                  </div>
                  <div className="text-xs text-gray-500">Players</div>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    {totalNextLevel}
                  </div>
                  <div className="text-xs text-gray-500">Next Level</div>
                </div>
              </div>
              {school.leagues && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">League</div>
                  <div className="text-sm font-medium" style={{ color: "var(--psp-navy)" }}>
                    {school.leagues.name}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3
                className="font-bold text-sm uppercase tracking-wider mb-4"
                style={{ color: "var(--psp-gray-400)" }}
              >
                Sports
              </h3>
              <div className="space-y-2">
                {sportsStats.slice(0, 7).map((sport) => (
                  <Link
                    key={sport.sport_id}
                    href={`/${sport.sport_id}/schools/${slug}`}
                    className="block text-sm py-1 hover:underline"
                    style={{ color: "var(--psp-navy)" }}
                  >
                    {sport.sport_emoji} {sport.sport_name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Articles */}
            <RelatedArticles entityType="school" entityId={school.id} />

            <PSPPromo size="sidebar" variant={2} />
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: school.name,
            address: school.address
              ? {
                "@type": "PostalAddress",
                streetAddress: school.address,
                addressLocality: school.city,
                addressRegion: school.state,
              }
              : undefined,
            telephone: school.phone,
            url: school.website_url,
            foundingDate: school.founded_year ? `${school.founded_year}` : undefined,
          }),
        }}
      />
    </>
  );
}
