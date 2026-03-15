import Link from "next/link";
import { notFound } from "next/navigation";
import { SPORT_META, getCurrentSeasonLabel } from "@/lib/sports";
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
  getSchoolCoaches,
  getSchoolAwards,
  getSchoolRecentGames,
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

const SPORT_EMOJI: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  "track-field": "🏃",
  lacrosse: "🥍",
  wrestling: "🤼",
  soccer: "⚽",
};

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
  let articles: any[] = [];

  try {
    const results = await Promise.allSettled([
      getSchoolAllSportsStats(school.id),
      getSchoolNextLevel(school.id),
      getSchoolAllChampionships(school.id),
      getSchoolRecentSeasons(school.id, 20),
      getSchoolArticles(school.id, 10),
      getSchoolCoaches(school.id),
      getSchoolAwards(school.id, 30),
      getSchoolRecentGames(school.id, 15),
    ]);

    if (results[0].status === "fulfilled") sportsStats = results[0].value;
    if (results[1].status === "fulfilled") nextLevelAthletes = results[1].value;
    if (results[2].status === "fulfilled") championships = results[2].value;
    if (results[3].status === "fulfilled") recentSeasons = results[3].value;
    if (results[4].status === "fulfilled") articles = results[4].value;
    if (results[5].status === "fulfilled") coaches = results[5].value;
    if (results[6].status === "fulfilled") awards = results[6].value;
    if (results[7].status === "fulfilled") recentGames = results[7].value;

    results.forEach((result, idx) => {
      if (result.status === "rejected") {
        captureError(result.reason, {
          slug,
          fetch: ["sportsStats", "nextLevel", "championships", "recentSeasons", "articles", "coaches", "awards", "recentGames"][idx],
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

  // Calculate aggregate stats
  const totalWins = sportsStats.reduce((sum, s) => sum + s.wins, 0);
  const totalLosses = sportsStats.reduce((sum, s) => sum + s.losses, 0);
  const totalTies = sportsStats.reduce((sum, s) => sum + s.ties, 0);
  const totalChampionships = championships.length;
  const totalPlayers = sportsStats.reduce((sum, s) => sum + s.player_count, 0);
  const totalNextLevel = nextLevelAthletes.length;
  const totalGames = totalWins + totalLosses + totalTies;
  const winPct = totalGames > 0 ? Math.round((totalWins / totalGames) * 1000) / 10 : null;

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

  // Group championships by sport for display
  const champsBySport = new Map<string, SchoolChampionshipData[]>();
  championships.forEach((c) => {
    if (!champsBySport.has(c.sport_id)) champsBySport.set(c.sport_id, []);
    champsBySport.get(c.sport_id)!.push(c);
  });

  // Sort pros first in next level
  const sortedNextLevel = [...nextLevelAthletes].sort((a, b) => {
    if (a.pro_league && !b.pro_league) return -1;
    if (!a.pro_league && b.pro_league) return 1;
    return a.person_name.localeCompare(b.person_name);
  });
  const proCount = sortedNextLevel.filter((a) => a.pro_league).length;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: "Schools", url: "https://phillysportspack.com/schools" },
          { name: school.name, url: `https://phillysportspack.com/schools/${slug}` },
        ]}
      />

      {/* ── Hero Section ── */}
      <section className="py-10 md:py-14" style={{ background: heroGradient }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Schools" },
              { label: school.name },
            ]}
          />

          <div className="flex items-start gap-5 mt-5">
            {/* School color swatch */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl border-4"
                style={{
                  background: primaryColor || "rgba(240, 165, 0, 0.1)",
                  borderColor: secondaryColor || primaryColor || "var(--psp-gold)",
                }}
              >
                🏫
              </div>
              {primaryColor && (
                <div className="flex gap-1 mt-1">
                  <div className="w-4 h-4 rounded-full border border-white/30" style={{ background: primaryColor }} title="Primary" />
                  {secondaryColor && (
                    <div className="w-4 h-4 rounded-full border border-white/30" style={{ background: secondaryColor }} title="Secondary" />
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1
                className="text-3xl md:text-5xl text-white mb-2 tracking-wider"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-200">
                    Class {school.piaa_class}
                  </span>
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
                {school.founded_year && <span className="ml-3 text-gray-400">Est. {school.founded_year}</span>}
              </div>

              {/* Stat Strip */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    {totalChampionships}
                  </div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-wider">Championships</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    {totalWins}-{totalLosses}{totalTies > 0 ? `-${totalTies}` : ""}
                  </div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-wider">All-Time Record</div>
                </div>
                {winPct !== null && (
                  <div>
                    <div className="text-xl md:text-2xl font-bold" style={{ color: "var(--psp-gold)", fontFamily: "Bebas Neue, sans-serif" }}>
                      {winPct}%
                    </div>
                    <div className="text-[11px] text-gray-400 uppercase tracking-wider">Win %</div>
                  </div>
                )}
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    {sportsStats.length}
                  </div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-wider">Sports</div>
                </div>
                {totalNextLevel > 0 && (
                  <div>
                    <div className="text-xl md:text-2xl font-bold" style={{ color: "var(--psp-blue)", fontFamily: "Bebas Neue, sans-serif" }}>
                      {totalNextLevel}
                    </div>
                    <div className="text-[11px] text-gray-400 uppercase tracking-wider">Next Level</div>
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
              <span className="text-[var(--psp-gold)] text-sm font-medium group-hover:translate-x-1 transition-transform flex-shrink-0 hidden sm:block">
                View Schedule →
              </span>
            </div>
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── Sports Programs ── */}
            {sportsStats.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  Sports Programs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sportsStats.map((sport) => (
                    <Link
                      key={sport.sport_id}
                      href={`/${sport.sport_id}/schools/${slug}`}
                      className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-5 hover:shadow-lg hover:border-[var(--psp-gold)]/40 transition block group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{sport.sport_emoji}</span>
                        <h3
                          className="text-lg font-bold flex-1 truncate group-hover:text-[var(--psp-gold)] transition-colors"
                          style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                        >
                          {sport.sport_name}
                        </h3>
                        {(sport.wins + sport.losses + sport.ties) > 0 && (
                          <span
                            className="text-lg font-bold tabular-nums whitespace-nowrap"
                            style={{ color: "var(--psp-navy)" }}
                          >
                            {sport.wins}-{sport.losses}{sport.ties > 0 ? `-${sport.ties}` : ""}
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
                            className="text-xs font-medium group-hover:translate-x-0.5 transition-transform"
                            style={{ color: "var(--psp-blue)" }}
                          >
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Championships ── */}
            {championships.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    Championships ({championships.length})
                  </h2>
                </div>

                {/* Group by sport */}
                {Array.from(champsBySport.entries())
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([sportId, sportChamps]) => (
                    <div key={sportId} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{SPORT_EMOJI[sportId] || "🏆"}</span>
                        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--psp-navy)" }}>
                          {sportChamps[0]?.sport_name || sportId} ({sportChamps.length})
                        </h3>
                        <Link
                          href={`/${sportId}/championships`}
                          className="text-xs ml-auto hover:underline"
                          style={{ color: "var(--psp-blue)" }}
                        >
                          All {sportChamps[0]?.sport_name} Championships →
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sportChamps.map((c) => (
                          <Link
                            key={c.id}
                            href={`/${c.sport_id}/schools/${slug}`}
                            className="inline-flex items-center gap-1.5 bg-white border border-[var(--psp-gray-200)] rounded-full px-3 py-1.5 text-sm hover:border-[var(--psp-gold)]/50 hover:shadow-sm transition"
                          >
                            <span className="text-xs">🏆</span>
                            <span className="font-bold tabular-nums" style={{ color: "var(--psp-navy)" }}>
                              {c.year}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {c.level}
                            </span>
                            {c.league_name && (
                              <span className="text-gray-400 text-xs hidden sm:inline">
                                • {c.league_name}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
              </section>
            )}

            {/* ── Coaches ── */}
            {coaches.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  Coaching Staff
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {coaches.map((coach) => {
                    const yearRange = coach.end_year
                      ? `${coach.start_year}–${coach.end_year}`
                      : `${coach.start_year}–present`;
                    const hasRecord = coach.record_wins > 0 || coach.record_losses > 0;

                    return (
                      <Link
                        key={`${coach.id}-${coach.sport_id}`}
                        href={`/${coach.sport_id}/coaches/${coach.slug}`}
                        className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-md hover:border-[var(--psp-gold)]/40 transition group"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold group-hover:text-[var(--psp-gold)] transition-colors truncate" style={{ color: "var(--psp-navy)" }}>
                              {coach.name}
                            </h3>
                            <div className="text-xs text-gray-500">{coach.role} • {yearRange}</div>
                          </div>
                          <span className="text-lg ml-2 flex-shrink-0">{SPORT_EMOJI[coach.sport_id] || "📋"}</span>
                        </div>
                        {(hasRecord || coach.championships > 0) && (
                          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
                            {hasRecord && (
                              <div className="text-xs">
                                <span className="font-bold" style={{ color: "var(--psp-navy)" }}>
                                  {coach.record_wins}-{coach.record_losses}{coach.record_ties > 0 ? `-${coach.record_ties}` : ""}
                                </span>
                                <span className="text-gray-400 ml-1">Record</span>
                              </div>
                            )}
                            {coach.championships > 0 && (
                              <div className="text-xs">
                                <span className="font-bold" style={{ color: "var(--psp-gold)" }}>
                                  {coach.championships}
                                </span>
                                <span className="text-gray-400 ml-1">{coach.championships === 1 ? "Title" : "Titles"}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Recent Games ── */}
            {recentGames.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  Recent Results
                </h2>
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {recentGames.map((game) => {
                      const isHome = game.home_school_id === school.id;
                      const schoolScore = isHome ? game.home_score : game.away_score;
                      const oppScore = isHome ? game.away_score : game.home_score;
                      const oppName = isHome ? game.away_school_name : game.home_school_name;
                      const oppSlug = isHome ? game.away_school_slug : game.home_school_slug;
                      const won = schoolScore !== null && oppScore !== null && schoolScore > oppScore;
                      const lost = schoolScore !== null && oppScore !== null && schoolScore < oppScore;
                      const resultLabel = won ? "W" : lost ? "L" : "T";
                      const resultColor = won ? "text-green-600" : lost ? "text-red-500" : "text-gray-500";
                      const dateStr = game.game_date
                        ? new Date(game.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "";

                      return (
                        <Link
                          key={game.id}
                          href={`/${game.sport_id}/games/${game.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                        >
                          <span className="text-base flex-shrink-0">{SPORT_EMOJI[game.sport_id] || "⚽"}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold ${resultColor}`}>{resultLabel}</span>
                              <span className="text-sm font-medium truncate" style={{ color: "var(--psp-navy)" }}>
                                {isHome ? "vs" : "@"} {oppName}
                              </span>
                            </div>
                            {dateStr && <div className="text-[11px] text-gray-400">{dateStr}</div>}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-bold tabular-nums" style={{ color: "var(--psp-navy)" }}>
                              {schoolScore}–{oppScore}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-2 text-center">
                  {sportsStats.length > 0 && (
                    <Link
                      href={`/${sportsStats[0].sport_id}/schools/${slug}`}
                      className="text-xs hover:underline"
                      style={{ color: "var(--psp-blue)" }}
                    >
                      View full game history →
                    </Link>
                  )}
                </div>
              </section>
            )}

            {/* ── Season History ── */}
            {recentSeasons.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  Season History
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
                          const totalSeasonGames = season.wins + season.losses + (season.ties || 0);
                          const seasonWinPct = totalSeasonGames > 0 ? (season.wins / totalSeasonGames * 100).toFixed(0) : "—";
                          const hasRecord = totalSeasonGames > 0;
                          // Check if this season has a championship
                          const isChampSeason = championships.some(
                            (c) => c.sport_id === season.sport_id && c.season_label === season.season_label
                          );
                          return (
                            <tr key={season.id} className={isChampSeason ? "bg-amber-50" : ""}>
                              <td>
                                <span className="font-medium">
                                  {isChampSeason && <span className="mr-1">🏆</span>}
                                  {season.sport_name}
                                </span>
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
                              <td className="text-xs">{season.playoff_result || (hasRecord ? `${seasonWinPct}%` : "—")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* ── Awards ── */}
            {awards.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    Awards & Honors ({awards.length})
                  </h2>
                  {sportsStats.some((s) => s.sport_id === "football") && (
                    <Link
                      href="/football/awards"
                      className="text-xs hover:underline"
                      style={{ color: "var(--psp-blue)" }}
                    >
                      All-City Archive →
                    </Link>
                  )}
                </div>
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Player</th>
                          <th>Award</th>
                          <th>Sport</th>
                          <th className="text-center">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {awards.slice(0, 20).map((award) => (
                          <tr key={award.id}>
                            <td>
                              {award.player_slug ? (
                                <Link
                                  href={`/${award.sport_id}/players/${award.player_slug}`}
                                  className="font-medium hover:underline"
                                  style={{ color: "var(--psp-blue)" }}
                                >
                                  {award.player_name}
                                </Link>
                              ) : (
                                <span className="font-medium">{award.player_name}</span>
                              )}
                            </td>
                            <td className="text-sm">
                              {award.award_name}
                              {award.tier && (
                                <span className="text-xs text-gray-400 ml-1">({award.tier})</span>
                              )}
                            </td>
                            <td className="text-sm">
                              <span className="mr-1">{SPORT_EMOJI[award.sport_id] || ""}</span>
                              {SPORT_META[award.sport_id as keyof typeof SPORT_META]?.name || award.sport_id}
                            </td>
                            <td className="text-center tabular-nums text-sm">{award.year || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {awards.length > 20 && (
                    <div className="text-center py-3 border-t border-gray-100">
                      <span className="text-sm" style={{ color: "var(--psp-blue)" }}>
                        + {awards.length - 20} more awards — explore sport pages for full lists
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── Next Level Alumni ── */}
            {sortedNextLevel.length > 0 && (
              <section>
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  Next Level Alumni ({sortedNextLevel.length})
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
                        {sortedNextLevel.slice(0, 15).map((athlete) => (
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
                  {sortedNextLevel.length > 15 && (
                    <div className="text-center py-3 border-t border-gray-100">
                      <span className="text-sm" style={{ color: "var(--psp-blue)" }}>
                        Showing 15 of {sortedNextLevel.length} alumni — explore sport pages for full lists
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar ── */}
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
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Address</div>
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
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Phone</div>
                    <a href={`tel:${school.phone}`} className="text-gray-700 hover:text-[var(--psp-navy)]">
                      {school.phone}
                    </a>
                  </div>
                )}
                {school.website_url && (
                  <div className="text-sm">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Website</div>
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
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Principal</div>
                    <div className="text-gray-700">{school.principal}</div>
                  </div>
                )}
                {school.athletic_director && (
                  <div className="text-sm">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Athletic Director</div>
                    <div className="text-gray-700">{school.athletic_director}</div>
                  </div>
                )}
                {school.enrollment && (
                  <div className="text-sm">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Enrollment</div>
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
                    <span className="text-xs text-gray-400">
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
