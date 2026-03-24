import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { createStaticClient } from "@/lib/supabase/static";
import { SkeletonCard } from "@/components/ui/Skeleton";
import ClassYearSpotlight from "@/components/recruiting/ClassYearSpotlight";
import type { ClassYearPlayer } from "@/components/recruiting/ClassYearSpotlight";
import AllAmericansSpotlight from "@/components/recruiting/AllAmericansSpotlight";
import type { AllAmericanAward } from "@/components/recruiting/AllAmericansSpotlight";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Philly Recruiting Central - PhillySportsPack",
  description:
    "Tracking every Philadelphia athlete's path to the next level. College commits, school pipelines, class rankings, and destination boards.",
  alternates: {
    canonical: "https://phillysportspack.com/recruiting",
  },
};

/* ============================================================================
   SPORT HELPERS
============================================================================ */

const SPORT_EMOJI: Record<string, string> = {
  football: "\u{1F3C8}",
  basketball: "\u{1F3C0}",
  baseball: "\u26BE",
  "track-field": "\u{1F3C3}",
  lacrosse: "\u{1F94D}",
  wrestling: "\u{1F93C}",
  soccer: "\u26BD",
};

const SPORT_NAMES: Record<string, string> = {
  football: "Football",
  basketball: "Basketball",
  baseball: "Baseball",
  "track-field": "Track & Field",
  lacrosse: "Lacrosse",
  wrestling: "Wrestling",
  soccer: "Soccer",
};

const SPORT_COLORS_CSS: Record<string, string> = {
  football: "var(--fb)",
  basketball: "var(--bb)",
  baseball: "var(--base)",
  "track-field": "var(--track)",
  lacrosse: "var(--lac)",
  wrestling: "var(--wrest)",
  soccer: "var(--soccer)",
};

const SPORT_COLORS_HEX: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

/* ============================================================================
   DATA FETCHING
============================================================================ */

async function getRecruitingData() {
  const supabase = createStaticClient();

  const [
    collegeCountRes,
    proCountRes,
    recentCommitsRes,
    pipelineRes,
    destinationsRes,
    sportBreakdownRes,
    classDataRes,
    allAmericansRes,
  ] = await Promise.allSettled([
    // 0: College count
    supabase
      .from("next_level_tracking")
      .select("id", { count: "exact", head: true })
      .eq("current_level", "college"),
    // 1: Pro count
    supabase
      .from("next_level_tracking")
      .select("id", { count: "exact", head: true })
      .eq("current_level", "pro"),
    // 2: Recent commits
    (supabase as any)
      .from("next_level_tracking")
      .select(
        "id, person_name, college, sport_id, status, created_at, schools:high_school_id(name, slug)"
      )
      .eq("current_level", "college")
      .order("created_at", { ascending: false })
      .limit(8),
    // 3: Pipeline data (all college+pro for grouping by school)
    (supabase as any)
      .from("next_level_tracking")
      .select(
        "high_school_id, current_level, sport_id, college, schools:high_school_id(name, slug)"
      )
      .in("current_level", ["college", "pro"])
      .limit(3000),
    // 4: Destinations
    supabase
      .from("next_level_tracking")
      .select("college, sport_id")
      .not("college", "is", null)
      .neq("college", "")
      .limit(3000),
    // 5: Sport breakdown
    supabase
      .from("next_level_tracking")
      .select("sport_id")
      .in("current_level", ["college", "pro"])
      .limit(3000),
    // 6: Class year data — Supabase default limit is 1000, must set higher
    (supabase as any)
      .from("next_level_tracking")
      .select(
        "person_name, college, sport_id, schools:high_school_id(name, slug), players:player_id(graduation_year, positions, slug)"
      )
      .eq("current_level", "college")
      .not("player_id", "is", null)
      .limit(2000),
    // 7: All-American game selections
    (supabase as any)
      .from("awards")
      .select(
        "player_name, award_name, year, sport_id, category, position, player_id, school_id, players:player_id(slug), schools:school_id(name, slug)"
      )
      .eq("award_type", "all-american-game")
      .order("year", { ascending: false })
      .limit(200),
  ]);

  /* --- Extract results safely --- */

  const collegeCount =
    collegeCountRes.status === "fulfilled"
      ? (collegeCountRes.value.count ?? 0)
      : 0;
  const proCount =
    proCountRes.status === "fulfilled"
      ? (proCountRes.value.count ?? 0)
      : 0;

  const recentCommits: any[] =
    recentCommitsRes.status === "fulfilled"
      ? (recentCommitsRes.value.data ?? [])
      : [];

  const pipelineRaw: any[] =
    pipelineRes.status === "fulfilled"
      ? (pipelineRes.value.data ?? [])
      : [];

  const destinationsRaw: any[] =
    destinationsRes.status === "fulfilled"
      ? (destinationsRes.value.data ?? [])
      : [];

  const sportBreakdownRaw: any[] =
    sportBreakdownRes.status === "fulfilled"
      ? (sportBreakdownRes.value.data ?? [])
      : [];

  const classDataRaw: any[] =
    classDataRes.status === "fulfilled"
      ? (classDataRes.value.data ?? [])
      : [];

  const allAmericansRaw: any[] =
    allAmericansRes.status === "fulfilled"
      ? (allAmericansRes.value.data ?? [])
      : [];

  /* --- Process pipeline rankings --- */
  const schoolMap = new Map<
    number,
    {
      name: string;
      slug: string;
      total: number;
      college: number;
      pro: number;
      sports: Set<string>;
      colleges: Set<string>;
    }
  >();

  for (const row of pipelineRaw) {
    const hsId = row.high_school_id;
    if (!hsId) continue;
    const school = Array.isArray(row.schools) ? row.schools[0] : row.schools;
    if (!school?.name) continue;

    if (!schoolMap.has(hsId)) {
      schoolMap.set(hsId, {
        name: school.name,
        slug: school.slug || "",
        total: 0,
        college: 0,
        pro: 0,
        sports: new Set(),
        colleges: new Set(),
      });
    }
    const entry = schoolMap.get(hsId)!;
    entry.total++;
    if (row.current_level === "college") entry.college++;
    if (row.current_level === "pro") entry.pro++;
    if (row.sport_id) entry.sports.add(row.sport_id);
    if (row.college) entry.colleges.add(row.college);
  }

  const pipelineRankings = Array.from(schoolMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  /* --- Process destinations --- */
  const destMap = new Map<
    string,
    { count: number; sports: Set<string> }
  >();
  for (const row of destinationsRaw) {
    if (!row.college) continue;
    if (!destMap.has(row.college)) {
      destMap.set(row.college, { count: 0, sports: new Set() });
    }
    const entry = destMap.get(row.college)!;
    entry.count++;
    if (row.sport_id) entry.sports.add(row.sport_id);
  }
  const topDestinations = Array.from(destMap.entries())
    .map(([college, data]) => ({
      college,
      count: data.count,
      sports: Array.from(data.sports),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  /* --- Process sport breakdown --- */
  const sportCountMap = new Map<string, number>();
  for (const row of sportBreakdownRaw) {
    if (!row.sport_id) continue;
    sportCountMap.set(row.sport_id, (sportCountMap.get(row.sport_id) || 0) + 1);
  }
  const sportBreakdown = Array.from(sportCountMap.entries())
    .map(([sport, count]) => ({ sport, count }))
    .sort((a, b) => b.count - a.count);

  /* --- Process class year data --- */
  const classPlayers: ClassYearPlayer[] = classDataRaw.map((row: any) => {
    const school = Array.isArray(row.schools) ? row.schools[0] : row.schools;
    const player = Array.isArray(row.players) ? row.players[0] : row.players;
    return {
      personName: row.person_name,
      college: row.college,
      sportId: row.sport_id,
      schoolName: school?.name ?? null,
      schoolSlug: school?.slug ?? null,
      graduationYear: player?.graduation_year ?? null,
      positions: player?.positions ?? null,
      playerSlug: player?.slug ?? null,
    };
  });

  // Keep all players with a valid graduation year
  const classPlayersWithYear = classPlayers.filter(
    (p) => p.graduationYear !== null
  );

  // Find the top 4 class years by count (most recent first among ties)
  const yearCounts = new Map<number, number>();
  for (const p of classPlayersWithYear) {
    yearCounts.set(p.graduationYear!, (yearCounts.get(p.graduationYear!) || 0) + 1);
  }
  const topClassYears = Array.from(yearCounts.entries())
    .sort((a, b) => b[1] - a[1] || b[0] - a[0])
    .slice(0, 4)
    .map(([year]) => year)
    .sort((a, b) => b - a); // Sort descending by year for display

  const classPlayersFiltered = classPlayersWithYear.filter(
    (p) => topClassYears.includes(p.graduationYear!)
  );

  /* --- Process All-American game selections --- */
  const allAmericanAwards: AllAmericanAward[] = allAmericansRaw.map((row: any) => {
    const player = Array.isArray(row.players) ? row.players[0] : row.players;
    const school = Array.isArray(row.schools) ? row.schools[0] : row.schools;
    return {
      playerName: row.player_name || "Unknown",
      playerSlug: player?.slug ?? null,
      schoolName: school?.name ?? null,
      schoolSlug: school?.slug ?? null,
      awardName: row.award_name || "All-American Game",
      year: row.year ?? null,
      sportId: row.sport_id || "basketball",
      category: row.category ?? null,
      position: row.position ?? null,
    };
  });

  /* --- Estimate D1 commits --- */
  const D1_KEYWORDS = [
    "Penn State", "Temple", "Villanova", "Pittsburgh", "Rutgers",
    "Maryland", "Syracuse", "Virginia", "North Carolina", "West Virginia",
    "Connecticut", "Boston College", "Miami", "Ohio State", "Michigan",
    "Alabama", "Georgia", "LSU", "Florida", "Clemson", "Oregon", "USC",
    "Notre Dame", "Oklahoma", "Texas", "Tennessee", "Iowa", "Wisconsin",
    "Minnesota", "Nebraska", "Indiana", "Purdue", "Illinois",
    "South Carolina", "Mississippi", "Arkansas", "Kentucky", "Missouri",
    "Arizona", "Colorado", "Utah", "Washington", "Stanford", "California",
    "Duke", "Wake Forest", "Louisville", "Cincinnati", "UCF", "Houston",
    "BYU", "Baylor", "TCU", "Kansas", "Oklahoma State", "Texas Tech",
    "James Madison", "Old Dominion", "Liberty", "Marshall", "Navy", "Army",
    "Air Force", "Tulane", "Memphis", "SMU",
  ];
  const d1Count = topDestinations
    .filter((d) =>
      D1_KEYWORDS.some((k) =>
        d.college.toLowerCase().includes(k.toLowerCase())
      )
    )
    .reduce((sum, d) => sum + d.count, 0);

  return {
    collegeCount,
    proCount,
    d1Count,
    totalAthletes: collegeCount + proCount,
    recentCommits,
    pipelineRankings,
    topDestinations,
    sportBreakdown,
    classPlayers: classPlayersFiltered,
    classYears: topClassYears,
    allAmericanAwards,
  };
}

/* ============================================================================
   PAGE COMPONENT
============================================================================ */

async function RecruitingContent() {
  const data = await getRecruitingData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ================================================================
          HERO SECTION
      ================================================================ */}
      <div
        className="rounded-2xl px-6 sm:px-10 py-10 sm:py-14 mb-10"
        style={{ backgroundColor: "var(--psp-navy)" }}
      >
        {/* Breadcrumb */}
        <nav className="text-sm mb-5">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <span className="text-gray-600 mx-2">&rsaquo;</span>
          <span className="text-gray-300">Recruiting Central</span>
        </nav>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3"
          style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "1px" }}
        >
          Philly Recruiting Central
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mb-8">
          Tracking every Philadelphia athlete&apos;s path to the next level
        </p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard value={data.collegeCount.toLocaleString()} label="College Athletes" />
          <StatCard value={data.d1Count.toLocaleString()} label="D1 Commits" accent />
          <StatCard value={data.proCount.toLocaleString()} label="Pro Athletes" />
        </div>
      </div>

      {/* ================================================================
          ALL-AMERICAN GAME SPOTLIGHT
      ================================================================ */}
      {data.allAmericanAwards.length > 0 && (
        <section className="mb-10">
          <AllAmericansSpotlight awards={data.allAmericanAwards} />
        </section>
      )}

      {/* ================================================================
          RECENT COMMITS
      ================================================================ */}
      <section className="mb-12">
        <SectionHeader title="Latest Recruiting Updates" />
        {data.recentCommits.length === 0 ? (
          <EmptyState message="No recent commits to display." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.recentCommits.map((commit: any) => {
              const school = Array.isArray(commit.schools)
                ? commit.schools[0]
                : commit.schools;
              const sportId = commit.sport_id || "football";
              const sportColor = SPORT_COLORS_CSS[sportId] || "var(--fb)";
              const sportHex = SPORT_COLORS_HEX[sportId] || "#16a34a";
              const emoji = SPORT_EMOJI[sportId] || "\u{1F3C8}";

              return (
                <div
                  key={commit.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  style={{ borderLeft: `4px solid ${sportHex}` }}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1.5">
                      <span
                        className="font-bold text-gray-900 text-sm"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      >
                        {commit.person_name}
                      </span>
                      <span className="text-base" title={SPORT_NAMES[sportId]}>
                        {emoji}
                      </span>
                    </div>
                    {school?.name && (
                      <div className="text-xs text-gray-500 mb-2">
                        {school.slug ? (
                          <Link
                            href={`/schools/${school.slug}`}
                            className="hover:underline"
                          >
                            {school.name}
                          </Link>
                        ) : (
                          school.name
                        )}
                      </div>
                    )}
                    {commit.college && (
                      <div
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${sportHex}15`,
                          color: sportHex,
                        }}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {commit.college}
                      </div>
                    )}
                    {commit.created_at && (
                      <div className="text-[10px] text-gray-400 mt-2">
                        {new Date(commit.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================================================================
          CLASS YEAR SPOTLIGHT
      ================================================================ */}
      <section className="mb-12">
        <SectionHeader title="Class Year Spotlight" />
        {data.classPlayers.length === 0 || data.classYears.length === 0 ? (
          <EmptyState message="No class year data available yet." />
        ) : (
          <ClassYearSpotlight players={data.classPlayers} classYears={data.classYears} />
        )}
      </section>

      {/* ================================================================
          SCHOOL PIPELINE RANKINGS
      ================================================================ */}
      <section className="mb-12">
        <SectionHeader title="Top Recruiting Pipelines" />
        {data.pipelineRankings.length === 0 ? (
          <EmptyState message="No pipeline data available." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.pipelineRankings.map((school, index) => {
              const isTop = index === 0;
              return (
                <div
                  key={school.slug || index}
                  className="rounded-xl overflow-hidden transition-shadow hover:shadow-lg"
                  style={{
                    backgroundColor: isTop ? "var(--psp-navy)" : "var(--psp-navy-mid, #0f2040)",
                    border: isTop ? "2px solid #f0a500" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="p-4">
                    {/* Rank badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: isTop ? "#f0a500" : "rgba(255,255,255,0.1)",
                          color: isTop ? "#0a1628" : "rgba(255,255,255,0.7)",
                          fontFamily: "Bebas Neue, sans-serif",
                          fontSize: "0.85rem",
                        }}
                      >
                        #{index + 1}
                      </span>
                      <span
                        className="text-xl font-bold"
                        style={{
                          color: isTop ? "#f0a500" : "rgba(255,255,255,0.9)",
                          fontFamily: "Bebas Neue, sans-serif",
                        }}
                      >
                        {school.total}
                      </span>
                    </div>

                    {/* School name */}
                    {school.slug ? (
                      <Link
                        href={`/schools/${school.slug}`}
                        className="text-sm font-bold text-white hover:underline block mb-2 leading-tight"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      >
                        {school.name}
                      </Link>
                    ) : (
                      <span
                        className="text-sm font-bold text-white block mb-2 leading-tight"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      >
                        {school.name}
                      </span>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-2">
                      <span>{school.college} college</span>
                      {school.pro > 0 && (
                        <span style={{ color: "#f0a500" }}>{school.pro} pro</span>
                      )}
                    </div>

                    {/* Sport dots */}
                    <div className="flex gap-1 flex-wrap">
                      {Array.from(school.sports).map((sport) => (
                        <span
                          key={sport}
                          className="text-xs"
                          title={SPORT_NAMES[sport] || sport}
                        >
                          {SPORT_EMOJI[sport] || sport}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================================================================
          COLLEGE DESTINATION BOARD
      ================================================================ */}
      <section className="mb-12">
        <SectionHeader title="Where Philly Athletes Go" />
        {data.topDestinations.length === 0 ? (
          <EmptyState message="No destination data available." />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {data.topDestinations.map((dest, index) => (
              <div
                key={dest.college}
                className="min-w-[200px] max-w-[220px] flex-shrink-0 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-bold text-gray-400"
                    style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "0.8rem" }}
                  >
                    #{index + 1}
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: index === 0 ? "#f0a500" : "var(--psp-navy)",
                      fontFamily: "Bebas Neue, sans-serif",
                    }}
                  >
                    {dest.count}
                  </span>
                </div>
                <div
                  className="font-bold text-gray-900 text-sm mb-2 leading-tight"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  {dest.college}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {dest.sports.map((sport) => (
                    <span
                      key={sport}
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${SPORT_COLORS_HEX[sport] || "#6b7280"}15`,
                        color: SPORT_COLORS_HEX[sport] || "#6b7280",
                      }}
                    >
                      {SPORT_NAMES[sport] || sport}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================================================================
          SPORT BREAKDOWN
      ================================================================ */}
      <section className="mb-12">
        <SectionHeader title="Recruiting by Sport" />
        {data.sportBreakdown.length === 0 ? (
          <EmptyState message="No sport data available." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.sportBreakdown.map(({ sport, count }) => {
              const sportHex = SPORT_COLORS_HEX[sport] || "#6b7280";
              const emoji = SPORT_EMOJI[sport] || "";
              const name = SPORT_NAMES[sport] || sport;
              return (
                <Link
                  key={sport}
                  href={`/sports/${sport}/pipeline`}
                  className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all text-center"
                  style={{ borderBottom: `3px solid ${sportHex}` }}
                >
                  <div className="text-3xl mb-2">{emoji}</div>
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{
                      color: sportHex,
                      fontFamily: "Bebas Neue, sans-serif",
                    }}
                  >
                    {count.toLocaleString()}
                  </div>
                  <div
                    className="text-sm font-semibold text-gray-700 group-hover:underline"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    {name}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    college + pro athletes
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ================================================================
          RECRUIT FINDER CTA
      ================================================================ */}
      <section className="mb-8">
        <div
          className="rounded-2xl p-8 sm:p-10 text-center"
          style={{ backgroundColor: "var(--psp-navy)" }}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "0.5px" }}
          >
            Find Any Recruit
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-lg mx-auto">
            Search by sport, position, class year, and stats across every
            Philadelphia high school athlete in our database.
          </p>
          <Link
            href="/recruit-finder"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-colors"
            style={{
              backgroundColor: "#f0a500",
              color: "#0a1628",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Open Recruit Finder
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ============================================================================
   SUB-COMPONENTS
============================================================================ */

function SectionHeader({ title }: { title: string }) {
  return (
    <h2
      className="text-2xl sm:text-3xl font-bold mb-6"
      style={{
        fontFamily: "Bebas Neue, sans-serif",
        color: "var(--psp-navy)",
        letterSpacing: "0.5px",
      }}
    >
      {title}
    </h2>
  );
}

function StatCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-5 text-center"
      style={{
        backgroundColor: accent
          ? "rgba(240,165,0,0.15)"
          : "rgba(255,255,255,0.08)",
        border: accent ? "1px solid rgba(240,165,0,0.3)" : "none",
      }}
    >
      <div
        className="text-3xl sm:text-4xl font-bold"
        style={{
          color: "#f0a500",
          fontFamily: "Bebas Neue, sans-serif",
        }}
      >
        {value}
      </div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 text-gray-400 text-sm bg-gray-50 rounded-xl">
      {message}
    </div>
  );
}

/* ============================================================================
   PAGE EXPORT
============================================================================ */

export default function RecruitingPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <SkeletonCard showImage={false} showTitle={true} />
          <div className="mt-8 space-y-4">
            <SkeletonCard showImage={false} />
            <SkeletonCard showImage={false} />
            <SkeletonCard showImage={false} />
          </div>
        </div>
      }
    >
      <RecruitingContent />
    </Suspense>
  );
}
