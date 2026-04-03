import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentSeasonLabel } from "@/lib/sports";
import { Breadcrumb, Badge, SchoolLogo } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import ShareButtons from "@/components/social/ShareButtons";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import RelatedArticles from "@/components/articles/RelatedArticles";
import SchoolTabHub from "@/components/school/SchoolTabHub";
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
  getSchoolCoaches,
  getSchoolAwards,
  getSchoolRecentGames,
  getSchoolCurrentSeasons,
  getSchoolRecords,
  type SchoolSportStats,
  type NextLevelAthlete,
  type SchoolChampionshipData,
  type RecentSeasonData,
  type SchoolCoach,
  type SchoolAward,
  type SchoolGame,
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
  let coaches: SchoolCoach[] = [];
  let awards: SchoolAward[] = [];
  let recentGames: SchoolGame[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentSeasons: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let records: any[] = [];

  try {
    const results = await Promise.allSettled([
      getSchoolAllSportsStats(school.id),
      getSchoolNextLevel(school.id),
      getSchoolAllChampionships(school.id),
      getSchoolRecentSeasons(school.id, 20),
      getSchoolCoaches(school.id),
      getSchoolAwards(school.id, 30),
      getSchoolRecentGames(school.id, 15),
      getSchoolCurrentSeasons(school.id),
      getSchoolRecords(school.id),
    ]);

    if (results[0].status === "fulfilled") sportsStats = results[0].value;
    if (results[1].status === "fulfilled") nextLevelAthletes = results[1].value;
    if (results[2].status === "fulfilled") championships = results[2].value;
    if (results[3].status === "fulfilled") recentSeasons = results[3].value;
    if (results[4].status === "fulfilled") coaches = results[4].value;
    if (results[5].status === "fulfilled") awards = results[5].value;
    if (results[6].status === "fulfilled") recentGames = results[6].value;
    if (results[7].status === "fulfilled") currentSeasons = results[7].value;
    if (results[8].status === "fulfilled") records = results[8].value;

    results.forEach((result, idx) => {
      if (result.status === "rejected") {
        captureError(result.reason, {
          slug,
          fetch: ["sportsStats", "nextLevel", "championships", "recentSeasons", "coaches", "awards", "recentGames", "currentSeasons", "records"][idx],
        });
      }
    });
  } catch (error) {
    captureError(error, { slug, context: "school_hub_data_fetching" });
  }

  // Check for upcoming schedule
  let upcomingGameCount = 0;
  const upcomingSport = "football";
  const seasonLabel = getCurrentSeasonLabel();
  try {
    const supabase = createStaticClient();

    // Get the season ID for current season
    const { data: seasonData } = await supabase
      .from("seasons")
      .select("id")
      .eq("label", seasonLabel)
      .single();

    const seasonId = seasonData?.id ?? 145; // fallback to 145 if not found

    const { count } = await supabase
      .from("games")
      .select("id", { count: "exact", head: true })
      .eq("season_id", seasonId)
      .or(`home_school_id.eq.${school.id},away_school_id.eq.${school.id}`);
    upcomingGameCount = count ?? 0;
  } catch {
    // silently fail
  }

  // Calculate aggregate stats for hero
  const totalWins = sportsStats.reduce((sum, s) => sum + s.wins, 0);
  const totalLosses = sportsStats.reduce((sum, s) => sum + s.losses, 0);
  const totalTies = sportsStats.reduce((sum, s) => sum + s.ties, 0);
  const totalChampionships = championships.length;
  const totalNextLevel = nextLevelAthletes.length;
  const totalGames = totalWins + totalLosses + totalTies;
  const winPct = totalGames > 0 ? Math.round((totalWins / totalGames) * 1000) / 10 : null;

  // Sort pros first in next level
  const sortedNextLevel = [...nextLevelAthletes].sort((a, b) => {
    if (a.pro_league && !b.pro_league) return -1;
    if (!a.pro_league && b.pro_league) return 1;
    return a.person_name.localeCompare(b.person_name);
  });

  // Extract school colors
  const primaryColor = school.colors && typeof school.colors === "object"
    ? (school.colors as Record<string, string>).primary || null
    : null;
  const secondaryColor = school.colors && typeof school.colors === "object"
    ? (school.colors as Record<string, string>).secondary || null
    : null;

  const heroGradient = primaryColor
    ? `linear-gradient(135deg, ${primaryColor} 0%, #0a1628 50%, ${primaryColor}15 100%)`
    : "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, var(--psp-blue)22 100%)";

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
      <section className="py-10 md:py-14" style={{ background: heroGradient }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Schools" },
              { label: school.name },
            ]}
          />

          <div className="flex items-start gap-5 mt-5">
            {/* School logo or color swatch */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              {school.logo_url ? (
                <SchoolLogo logoUrl={school.logo_url} name={school.name} size="lg" />
              ) : (
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl border-4"
                  style={{
                    background: primaryColor || "rgba(240, 165, 0, 0.1)",
                    borderColor: secondaryColor || primaryColor || "var(--psp-gold)",
                  }}
                >
                  🏫
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="psp-h1 text-white mb-2">
                {school.name}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {school.mascot && (
                  <Badge variant="info" className="bg-white/10 text-white">
                    {school.mascot}
                  </Badge>
                )}
                {school.leagues && (
                  <Badge variant="info" className="bg-white/15 text-white font-medium">
                    {school.leagues.name}
                  </Badge>
                )}
                {school.school_type && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-gray-200">
                    {school.school_type}
                  </span>
                )}
                {school.piaa_class && (
                  <Badge variant="info" className="text-xs bg-amber-500/20 text-amber-200">
                    Class {school.piaa_class}
                  </Badge>
                )}
                {school.closed_year && (
                  <Badge variant="error" className="bg-red-500/20 text-red-200">
                    Closed {school.closed_year}
                  </Badge>
                )}
              </div>

              {/* Location */}
              <div className="text-sm text-gray-300 mb-4">
                {school.city}, {school.state}
                {school.founded_year && <span className="ml-3 text-gray-300">Est. {school.founded_year}</span>}
              </div>

              {/* Stat Strip */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="psp-h2 text-white">
                    {totalChampionships}
                  </div>
                  <div className="text-xs text-gray-300 uppercase tracking-wider">Championships</div>
                </div>
                <div>
                  <div className="psp-h2 text-white">
                    {totalWins}-{totalLosses}{totalTies > 0 ? `-${totalTies}` : ""}
                  </div>
                  <div className="text-xs text-gray-300 uppercase tracking-wider">All-Time Record</div>
                </div>
                {winPct !== null && (
                  <div>
                    <div className="psp-h2" style={{ color: "var(--psp-gold)" }}>
                      {winPct}%
                    </div>
                    <div className="text-xs text-gray-300 uppercase tracking-wider">Win %</div>
                  </div>
                )}
                <div>
                  <div className="psp-h2 text-white">
                    {sportsStats.length}
                  </div>
                  <div className="text-xs text-gray-300 uppercase tracking-wider">Sports</div>
                </div>
                {totalNextLevel > 0 && (
                  <div>
                    <div className="psp-h2" style={{ color: "var(--psp-blue)" }}>
                      {totalNextLevel}
                    </div>
                    <div className="text-xs text-gray-300 uppercase tracking-wider">Next Level</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="mt-4">
            <ShareButtons
              url={`/schools/${slug}`}
              title={`${school.name} — PhillySportsPack`}
              description={`Check out ${school.name}'s athletics profile on PhillySportsPack.com`}
            />
          </div>
        </div>
      </section>

      {/* Upcoming Schedule Banner */}
      {upcomingGameCount > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <Link
            href={`/${upcomingSport}/teams/${slug}/${seasonLabel}`}
            className="block bg-gradient-to-r from-[var(--psp-navy)] to-[#0f2040] rounded-xl p-4 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--psp-gold)]/20 flex items-center justify-center text-2xl flex-shrink-0">
                📅
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--psp-gold)] font-bebas text-xl">{seasonLabel} Schedule Available</p>
                <p className="text-gray-300 text-sm">{upcomingGameCount} game{upcomingGameCount !== 1 ? "s" : ""} scheduled — view the full {upcomingSport} schedule</p>
              </div>
              <span className="text-[var(--psp-gold)] text-sm font-medium group-hover:translate-x-1 group-focus-visible:translate-x-1 transition-transform flex-shrink-0 hidden sm:block">
                View Schedule →
              </span>
            </div>
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content — Tabbed Hub */}
          <div className="lg:col-span-3 space-y-6">
            <SchoolTabHub
              school={school}
              sports={sportsStats}
              currentSeasons={currentSeasons}
              recentGames={recentGames}
              championships={championships}
              nextLevel={sortedNextLevel}
              coaches={coaches}
              awards={awards}
              recentSeasons={recentSeasons}
              records={records}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* School Details Card */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3
                className="font-bold text-sm uppercase tracking-wider mb-4"
                style={{ color: "var(--psp-gray-400)" }}
              >
                School Info
              </h3>
              <div className="space-y-3">
                {school.address && (
                  <div className="text-sm">
                    <div className="text-gray-300 text-xs uppercase tracking-wider mb-0.5">Address</div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(school.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: "var(--psp-blue)" }}
                    >
                      {school.address}
                    </a>
                  </div>
                )}
                {school.phone && (
                  <div className="text-sm">
                    <div className="text-gray-300 text-xs uppercase tracking-wider mb-0.5">Phone</div>
                    <a href={`tel:${school.phone}`} className="text-gray-700 hover:text-[var(--psp-navy)]">
                      {school.phone}
                    </a>
                  </div>
                )}
                {school.website_url && (
                  <div className="text-sm">
                    <div className="text-gray-300 text-xs uppercase tracking-wider mb-0.5">Website</div>
                    <a
                      href={school.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: "var(--psp-blue)" }}
                    >
                      Visit School Site →
                    </a>
                  </div>
                )}
                {school.principal && (
                  <div className="text-sm">
                    <div className="text-gray-300 text-xs uppercase tracking-wider mb-0.5">Principal</div>
                    <div className="text-gray-700">{school.principal}</div>
                  </div>
                )}
                {school.athletic_director && (
                  <div className="text-sm">
                    <div className="text-gray-300 text-xs uppercase tracking-wider mb-0.5">Athletic Director</div>
                    <div className="text-gray-700">{school.athletic_director}</div>
                  </div>
                )}
                {school.enrollment && (
                  <div className="text-sm">
                    <div className="text-gray-300 text-xs uppercase tracking-wider mb-0.5">Enrollment</div>
                    <div className="text-gray-700">{school.enrollment.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3
                className="font-bold text-sm uppercase tracking-wider mb-4"
                style={{ color: "var(--psp-gray-400)" }}
              >
                Explore
              </h3>
              <div className="space-y-2">
                {sportsStats.map((sport) => (
                  <Link
                    key={sport.sport_id}
                    href={`/${sport.sport_id}/schools/${slug}`}
                    className="flex items-center justify-between text-sm py-1.5 group"
                  >
                    <span className="group-hover:underline" style={{ color: "var(--psp-navy)" }}>
                      {sport.sport_emoji} {sport.sport_name}
                    </span>
                    <span className="text-xs text-gray-300">
                      {sport.championship_count > 0 ? `${sport.championship_count} 🏆` : `${sport.season_count} seasons`}
                    </span>
                  </Link>
                ))}
                <div className="border-t border-gray-100 pt-2 mt-2 space-y-2">
                  {sportsStats.some((s) => s.sport_id === "football") && (
                    <Link
                      href="/football/awards"
                      className="block text-sm py-1 hover:underline"
                      style={{ color: "var(--psp-blue)" }}
                    >
                      📰 All-City Teams Archive
                    </Link>
                  )}
                  <Link
                    href={`/search?q=${encodeURIComponent(school.name)}`}
                    className="block text-sm py-1 hover:underline"
                    style={{ color: "var(--psp-blue)" }}
                  >
                    🔍 Search Players & Articles
                  </Link>
                  {sportsStats.length > 0 && (
                    <Link
                      href={`/${sportsStats[0].sport_id}/leaderboards/rushing?school=${slug}`}
                      className="block text-sm py-1 hover:underline"
                      style={{ color: "var(--psp-blue)" }}
                    >
                      📊 Stat Leaders
                    </Link>
                  )}
                </div>
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
