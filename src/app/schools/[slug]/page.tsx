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

              {/* Location */}
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

              {/* Contact info */}
              <div className="flex flex-wrap gap-4 text-sm mb-6">
                {school.website_url && (
                  <a
                    href={school.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-blue-100 underline"
                  >
                    School Website →
                  </a>
                )}
                {school.phone && (
                  <span className="text-gray-300">
                    📞 {school.phone}
                  </span>
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

          {/* Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-10 max-w-4xl">
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {totalChampionships}
              </div>
              <div className="text-xs text-gray-400">Championships</div>
            </div>

            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {totalWins}-{totalLosses}{totalTies > 0 ? `-${totalTies}` : ""}
              </div>
              <div className="text-xs text-gray-400">All-Time Record</div>
            </div>

            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {totalPlayers}
              </div>
              <div className="text-xs text-gray-400">Players</div>
            </div>

            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {totalNextLevel}
              </div>
              <div className="text-xs text-gray-400">Next Level</div>
            </div>

            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {sportsStats.length}
              </div>
              <div className="text-xs text-gray-400">Sports</div>
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* All Sports Section */}
            {sportsStats.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  Sports ({sportsStats.length})
                </h2>
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
                          className="text-lg font-bold flex-1"
                          style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                        >
                          {sport.sport_name}
                        </h3>
                        <span
                          className="text-lg font-bold tabular-nums"
                          style={{ color: "var(--psp-navy)" }}
                        >
                          {sport.wins}-{sport.losses}{sport.ties > 0 ? `-${sport.ties}` : ""}
                        </span>
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
                              <td className="text-center font-medium">{season.wins}</td>
                              <td className="text-center font-medium">{season.losses}</td>
                              <td className="text-center text-sm">{season.ties || "—"}</td>
                              <td className="text-xs">{season.playoff_result || `${winPct}%`}</td>
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
                            <th>Organization</th>
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
                                <div className="text-sm">
                                  {athlete.pro_team || athlete.college || "—"}
                                </div>
                                {athlete.pro_league && (
                                  <div className="text-xs" style={{ color: "var(--psp-gold)" }}>
                                    {athlete.pro_league}
                                  </div>
                                )}
                              </td>
                              <td className="text-sm capitalize">{athlete.sport_id || "—"}</td>
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
            {/* School Info Card */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3
                className="font-bold text-sm uppercase tracking-wider mb-4"
                style={{ color: "var(--psp-gray-400)" }}
              >
                School Info
              </h3>
              <dl className="space-y-4 text-sm">
                {school.address && (
                  <div>
                    <dt style={{ color: "var(--psp-gray-500)" }}>Address</dt>
                    <dd className="text-sm mt-1" style={{ color: "var(--psp-navy)" }}>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(school.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {school.address} 📍
                      </a>
                    </dd>
                  </div>
                )}
                {school.phone && (
                  <div>
                    <dt style={{ color: "var(--psp-gray-500)" }}>Phone</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                      <a href={`tel:${school.phone}`} className="hover:underline">
                        {school.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {school.principal && (
                  <div>
                    <dt style={{ color: "var(--psp-gray-500)" }}>Principal</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                      {school.principal}
                    </dd>
                  </div>
                )}
                {school.athletic_director && (
                  <div>
                    <dt style={{ color: "var(--psp-gray-500)" }}>Athletic Director</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                      {school.athletic_director}
                    </dd>
                  </div>
                )}
                {school.enrollment && (
                  <div>
                    <dt style={{ color: "var(--psp-gray-500)" }}>Enrollment</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                      {school.enrollment.toLocaleString()}
                    </dd>
                  </div>
                )}
                {school.founded_year && (
                  <div>
                    <dt style={{ color: "var(--psp-gray-500)" }}>Founded</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                      {school.founded_year}
                    </dd>
                  </div>
                )}
                {school.leagues && (
                  <div>
                    <dt style={{ color: "var(--psp-gray-500)" }}>League</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                      {school.leagues.name}
                    </dd>
                  </div>
                )}
              </dl>
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
