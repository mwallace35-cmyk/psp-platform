import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { createStaticClient } from "@/lib/supabase/static";
import { SkeletonCard } from "@/components/ui/Skeleton";
import ClassYearSpotlight from "@/components/recruiting/ClassYearSpotlight";
import type { ClassYearPlayer } from "@/components/recruiting/ClassYearSpotlight";
import AllAmericansSpotlight from "@/components/recruiting/AllAmericansSpotlight";
import type { AllAmericanAward } from "@/components/recruiting/AllAmericansSpotlight";
import RecruitingSubNav from "@/components/recruiting/RecruitingSubNav";

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
    <>
      {/* ================================================================
          HERO SECTION — Compact
      ================================================================ */}
      <div
        className="px-4 sm:px-6 pt-4 pb-5"
        style={{ backgroundColor: "var(--psp-navy)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs mb-3">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-gray-600 mx-1.5">&rsaquo;</span>
            <span className="text-gray-300">Recruiting Central</span>
          </nav>

          <h1
            className="psp-h1 text-white mb-1"
          >
            Philly Recruiting Central
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mb-4">
            Tracking every Philadelphia athlete&apos;s path to the next level
          </p>

          {/* Stat Pills — inline horizontal row */}
          <div className="flex flex-wrap gap-2">
            <StatPill value={data.collegeCount.toLocaleString()} label="College" />
            <StatPill value={data.d1Count.toLocaleString()} label="D1" accent />
            <StatPill value={data.proCount.toLocaleString()} label="Pro" />
          </div>
        </div>
      </div>

      {/* ================================================================
          STICKY SUB-NAV
      ================================================================ */}
      <RecruitingSubNav />

      {/* ================================================================
          CONTENT
      ================================================================ */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* All-Americans */}
        {data.allAmericanAwards.length > 0 && (
          <section id="all-americans" className="mb-8 pb-8 scroll-mt-16 border-b border-gray-800">
            <AllAmericansSpotlight awards={data.allAmericanAwards} />
          </section>
        )}

        {/* Class Year Spotlight */}
        <section id="class-spotlight" className="mb-8 pb-8 scroll-mt-16 border-b border-gray-800">
          <SectionHeader title="Class Year Spotlight" />
          {data.classPlayers.length === 0 || data.classYears.length === 0 ? (
            <EmptyState message="No class year data available yet." />
          ) : (
            <ClassYearSpotlight players={data.classPlayers} classYears={data.classYears} />
          )}
        </section>

        {/* Pipeline Rankings — Horizontal Scroll */}
        <section id="pipeline" className="mb-8 pb-8 scroll-mt-16 border-b border-gray-800">
          <SectionHeader title="Top Recruiting Pipelines" />
          {data.pipelineRankings.length === 0 ? (
            <EmptyState message="No pipeline data available." />
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
              {data.pipelineRankings.map((school, index) => {
                const isTop = index === 0;
                return (
                  <div
                    key={school.slug || index}
                    className="w-[170px] flex-shrink-0 rounded-xl overflow-hidden transition-shadow hover:shadow-lg"
                    style={{
                      backgroundColor: isTop ? "rgba(240,165,0,0.08)" : "rgba(255,255,255,0.03)",
                      border: isTop ? "1.5px solid #f0a500" : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: isTop ? "#f0a500" : "rgba(255,255,255,0.1)",
                            color: isTop ? "#0a1628" : "rgba(255,255,255,0.7)",
                            fontSize: "0.8rem",
                          }}
                        >
                          #{index + 1}
                        </span>
                        <span
                          className="text-lg font-bold"
                          style={{
                            color: isTop ? "#f0a500" : "rgba(255,255,255,0.9)",
                          }}
                        >
                          {school.total}
                        </span>
                      </div>

                      {school.slug ? (
                        <Link
                          href={`/schools/${school.slug}`}
                          className="text-xs font-bold text-white hover:underline block mb-1.5 leading-tight"
                          style={{ fontFamily: "DM Sans, sans-serif" }}
                        >
                          {school.name}
                        </Link>
                      ) : (
                        <span
                          className="text-xs font-bold text-white block mb-1.5 leading-tight"
                          style={{ fontFamily: "DM Sans, sans-serif" }}
                        >
                          {school.name}
                        </span>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-300 mb-1.5">
                        <span>{school.college} col</span>
                        {school.pro > 0 && (
                          <span style={{ color: "#f0a500" }}>{school.pro} pro</span>
                        )}
                      </div>

                      <div className="flex gap-0.5 flex-wrap">
                        {Array.from(school.sports).map((sport) => (
                          <span
                            key={sport}
                            className="text-[10px]"
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

        {/* College Destinations — Horizontal Scroll Strip */}
        <section id="destinations" className="mb-8 pb-8 scroll-mt-16 border-b border-gray-800">
          <SectionHeader title="Where Philly Athletes Go" />
          {data.topDestinations.length === 0 ? (
            <EmptyState message="No destination data available." />
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
              {data.topDestinations.map((dest, index) => (
                <div
                  key={dest.college}
                  className="w-[170px] flex-shrink-0 rounded-xl p-3 hover:shadow-md transition-shadow"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: index === 0
                      ? "1.5px solid #f0a500"
                      : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="psp-micro text-gray-400"
                    >
                      #{index + 1}
                    </span>
                    <span
                      className="font-bold text-base"
                      style={{
                        color: index === 0 ? "#f0a500" : "rgba(255,255,255,0.9)",
                      }}
                    >
                      {dest.count}
                    </span>
                  </div>
                  <div
                    className="font-bold text-white text-xs mb-1.5 leading-tight"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    {dest.college}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {dest.sports.map((sport) => (
                      <span
                        key={sport}
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${SPORT_COLORS_HEX[sport] || "#6b7280"}20`,
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

        {/* Sport Breakdown — Compact horizontal pills */}
        <section className="mb-8">
          <SectionHeader title="By Sport" />
          {data.sportBreakdown.length === 0 ? (
            <EmptyState message="No sport data available." />
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.sportBreakdown.map(({ sport, count }) => {
                const sportHex = SPORT_COLORS_HEX[sport] || "#6b7280";
                const emoji = SPORT_EMOJI[sport] || "";
                const name = SPORT_NAMES[sport] || sport;
                return (
                  <Link
                    key={sport}
                    href={`/sports/${sport}/pipeline`}
                    className="group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition-all hover:scale-105 focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--psp-navy)] focus-visible:outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: `1px solid ${sportHex}40`,
                    }}
                  >
                    <span className="text-sm">{emoji}</span>
                    <span
                      className="font-bold text-sm" style={{ color: sportHex }}
                    >
                      {count.toLocaleString()}
                    </span>
                    <span
                      className="text-xs text-gray-300 group-hover:underline"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      {name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recruit Finder CTA — Gold gradient, prominent */}
        <section id="recruit-finder" className="mb-8 scroll-mt-16">
          <div
            className="rounded-2xl p-8 sm:p-10 text-center"
            style={{
              background: "linear-gradient(135deg, #f0a500 0%, #d4920a 100%)",
            }}
          >
            <h2
              className="psp-h1 mb-2"
              style={{
                color: "#0a1628",
              }}
            >
              Find Any Recruit
            </h2>
            <p
              className="text-sm sm:text-base mb-5 max-w-md mx-auto"
              style={{ color: "rgba(10,22,40,0.7)" }}
            >
              Search by sport, position, class year, and stats across every
              Philadelphia high school athlete in our database.
            </p>
            <Link
              href="/recruit-finder"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:outline-none"
              style={{
                backgroundColor: "#0a1628",
                color: "#f0a500",
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
    </>
  );
}

/* ============================================================================
   SUB-COMPONENTS
============================================================================ */

function SectionHeader({ title }: { title: string }) {
  return (
    <h2
      className="psp-h2 mb-4"
      style={{
        color: "rgba(255,255,255,0.9)",
      }}
    >
      {title}
    </h2>
  );
}

function StatPill({
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
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
      style={{
        backgroundColor: accent
          ? "rgba(240,165,0,0.15)"
          : "rgba(255,255,255,0.06)",
        border: accent
          ? "1px solid rgba(240,165,0,0.35)"
          : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <span
        className="font-bold text-base leading-none"
        style={{ color: "#f0a500", fontFamily: "var(--font-bebas)" }}
      >
        {value}
      </span>
      <span className="text-xs text-gray-300">{label}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="text-center py-8 text-gray-400 text-sm rounded-xl"
      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
    >
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <SkeletonCard showImage={false} showTitle={true} />
          <div className="mt-6 space-y-4">
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
