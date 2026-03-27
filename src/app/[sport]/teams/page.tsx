import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META, getSchoolTeamStats, getDiscontinuedSchools } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: hourly
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} Teams — PhillySportsPack`,
    description: `All Philadelphia area ${meta.name.toLowerCase()} teams — records, championships, and season-by-season results.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/teams`,
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

const LEAGUE_COLORS: Record<string, string> = {
  "Catholic League": "#dc2626",
  "Public League": "#16a34a",
  "Inter-Ac League": "#2563eb",
  "Central League": "#7c3aed",
  "Del Val League": "#ea580c",
  "Ches-Mont League": "#0891b2",
  "Suburban One": "#4f46e5",
  "Independent": "#6b7280",
};

export default async function TeamsPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);

  const meta = SPORT_META[sport];
  const [teamsResult, discontinuedSchools] = await Promise.all([
    getSchoolTeamStats(sport),
    getDiscontinuedSchools(sport),
  ]);
  const teams = teamsResult.data;

  // Separate active and closed schools
  const activeTeams = teams.filter((t) => !t.closedYear);
  const closedTeams = teams.filter((t) => t.closedYear);

  // Only show the three core Philly leagues
  const CORE_LEAGUES = ["Philadelphia Catholic League", "Philadelphia Public League", "Inter-Academic League"];

  // Group active teams by league (core leagues only)
  const leagueGroups: Record<string, typeof teams> = {};
  for (const team of activeTeams) {
    const league = team.league || "Independent";
    if (!CORE_LEAGUES.includes(league)) continue;
    if (!leagueGroups[league]) leagueGroups[league] = [];
    leagueGroups[league].push(team);
  }

  // Sort leagues: Catholic, Public, Inter-Ac
  const leagueOrder = CORE_LEAGUES;
  const sortedLeagues = Object.entries(leagueGroups)
    .sort((a, b) => leagueOrder.indexOf(a[0]) - leagueOrder.indexOf(b[0]));

  // Sort closed schools by closed year (most recent first), then name
  const sortedClosedTeams = [...closedTeams].sort((a, b) => {
    if (b.closedYear !== a.closedYear) return (b.closedYear || 0) - (a.closedYear || 0);
    return (a.school?.name || "").localeCompare(b.school?.name || "");
  });

  return (
    <main id="main-content">
      {/* Breadcrumb JSON-LD */}
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Teams", url: `https://phillysportspack.com/${sport}/teams` },
      ]} />

      {/* Header */}
      <section
        className="py-12 md:py-16"
        style={{ background: "var(--psp-navy)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: meta.name, href: `/${sport}` },
            { label: "Teams" },
          ]} />

          <div className="flex items-center gap-4 mt-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${meta.color}20` }}
            >
              {meta.emoji}
            </div>
            <div>
              <h1
                className="psp-h1 text-white"
              >
                {meta.name} Teams
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                {sortedLeagues.reduce((sum, [, t]) => sum + t.length, 0)} teams across {sortedLeagues.length} leagues
                {closedTeams.length > 0 && ` � ${closedTeams.length} closed programs`}
                {discontinuedSchools.length > 0 && ` � ${discontinuedSchools.length} discontinued`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {sortedLeagues.map(([league, leagueTeams]) => (
              <div key={league}>
                <h2
                  className="psp-h2 mb-4 pb-2 border-b-2"
                  style={{
                    color: "var(--psp-navy)",
                    borderColor: LEAGUE_COLORS[league] || "var(--psp-gold)",
                  }}
                >
                  {league}
                  <span className="text-sm font-normal ml-2" style={{ color: "var(--psp-gray-400)" }}>
                    ({leagueTeams.length} teams)
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {leagueTeams.map((team) => {
                    const school = team.school;
                    if (!school) return null;
                    const total = team.totalWins + team.totalLosses + team.totalTies;
                    const winPct = total > 0 ? ((team.totalWins / total) * 100).toFixed(0) : "0";

                    return (
                      <Link
                        key={school.id}
                        href={`/${sport}/schools/${school.slug}`}
                        className="group block bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-lg hover:border-[var(--psp-gold)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3
                              className="psp-h3 group-hover:text-[var(--psp-gold)] transition-colors"
                              style={{ color: "var(--psp-navy)" }}
                            >
                              {school.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">
                              {school.city}, {school.state}
                            </p>
                          </div>
                          <span style={{ opacity: 0.6, fontSize: "1.5rem" }}>{meta.emoji}</span>
                        </div>

                        <div
                          className="text-xs font-bold px-2 py-1 rounded inline-block mb-3"
                          style={{
                            background: `${LEAGUE_COLORS[league] || "var(--psp-gold)"}15`,
                            color: LEAGUE_COLORS[league] || "var(--psp-gold)",
                          }}
                        >
                          {league}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-gray-50 rounded p-2">
                            <div className="text-gray-400">All-Time</div>
                            <div className="font-bold text-sm mt-1" style={{ color: "var(--psp-navy)" }}>
                              {team.totalWins}-{team.totalLosses}
                              {team.totalTies > 0 ? `-${team.totalTies}` : ""}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="text-gray-400">Win %</div>
                            <div className="font-bold text-sm mt-1" style={{ color: "var(--psp-navy)" }}>
                              {winPct}%
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="text-gray-400">Titles</div>
                            <div className="font-bold text-sm mt-1" style={{ color: "var(--psp-gold)" }}>
                              {team.championships > 0 ? `🏆 ${team.championships}` : "—"}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-300 mt-2">
                          {team.seasonCount} seasons on record
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Closed Schools */}
            {sortedClosedTeams.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold mb-2 pb-2 border-b-2"
                  style={{
                    color: "var(--psp-gray-400)",
                    borderColor: "#9ca3af",
                  }}
                >
                  Closed Programs
                  <span className="text-sm font-normal ml-2" style={{ color: "var(--psp-gray-400)" }}>
                    ({sortedClosedTeams.length})
                  </span>
                </h2>
                <p className="text-xs text-gray-300 mb-4">
                  Schools no longer competing. Records preserved for historical reference.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedClosedTeams.map((team) => {
                    const school = team.school;
                    if (!school) return null;
                    const total = team.totalWins + team.totalLosses + team.totalTies;
                    const winPct = total > 0 ? ((team.totalWins / total) * 100).toFixed(0) : "0";

                    return (
                      <Link
                        key={school.id}
                        href={`/${sport}/schools/${school.slug}`}
                        className="group block rounded-lg border p-4 hover:shadow-lg transition-all focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:outline-none"
                        style={{
                          background: "var(--psp-gray-50, #f9fafb)",
                          borderColor: "var(--psp-gray-200, #e5e7eb)",
                          opacity: 0.85,
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3
                              className="psp-h3 group-hover:text-[var(--psp-gold)] transition-colors"
                              style={{ color: "var(--psp-gray-500, #6b7280)" }}
                            >
                              {school.name}
                            </h3>
                            <p className="text-xs text-gray-300 mt-1">
                              {school.city}, {school.state}
                              {team.closedYear && (
                                <span className="ml-2 text-red-400 font-semibold">
                                  Closed {team.closedYear}
                                </span>
                              )}
                            </p>
                          </div>
                          <span style={{ opacity: 0.3, fontSize: "1.5rem" }}>{meta.emoji}</span>
                        </div>

                        {team.league && team.league !== "Independent" && (
                          <div
                            className="text-xs font-bold px-2 py-1 rounded inline-block mb-3"
                            style={{
                              background: `${LEAGUE_COLORS[team.league] || "var(--psp-gold)"}10`,
                              color: LEAGUE_COLORS[team.league] || "#9ca3af",
                              opacity: 0.7,
                            }}
                          >
                            {team.league}
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded p-2" style={{ background: "var(--psp-gray-100, #f3f4f6)" }}>
                            <div className="text-gray-300">All-Time</div>
                            <div className="font-bold text-sm mt-1" style={{ color: "var(--psp-gray-500, #6b7280)" }}>
                              {team.totalWins}-{team.totalLosses}
                              {team.totalTies > 0 ? `-${team.totalTies}` : ""}
                            </div>
                          </div>
                          <div className="rounded p-2" style={{ background: "var(--psp-gray-100, #f3f4f6)" }}>
                            <div className="text-gray-300">Win %</div>
                            <div className="font-bold text-sm mt-1" style={{ color: "var(--psp-gray-500, #6b7280)" }}>
                              {winPct}%
                            </div>
                          </div>
                          <div className="rounded p-2" style={{ background: "var(--psp-gray-100, #f3f4f6)" }}>
                            <div className="text-gray-300">Titles</div>
                            <div className="font-bold text-sm mt-1" style={{ color: "var(--psp-gold)" }}>
                              {team.championships > 0 ? `🏆 ${team.championships}` : "—"}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-300 mt-2">
                          {team.seasonCount} seasons on record
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Discontinued Programs — schools that dropped this sport */}
            {discontinuedSchools.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold mb-2 pb-2 border-b-2"
                  style={{
                    color: "var(--psp-gray-400)",
                    borderColor: "#d97706",
                  }}
                >
                  No Longer Active
                  <span className="text-sm font-normal ml-2" style={{ color: "var(--psp-gray-400)" }}>
                    ({discontinuedSchools.length})
                  </span>
                </h2>
                <p className="text-xs text-gray-300 mb-4">
                  Schools that still exist but no longer field a {meta.name.toLowerCase()} team. Historical records preserved.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discontinuedSchools.map((school) => (
                    <Link
                      key={school.id}
                      href={`/${sport}/schools/${school.slug}`}
                      className="group block rounded-lg border p-4 hover:shadow-lg transition-all focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:outline-none"
                      style={{
                        background: "var(--psp-gray-50, #f9fafb)",
                        borderColor: "var(--psp-gray-200, #e5e7eb)",
                        opacity: 0.85,
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3
                            className="text-lg font-bold group-hover:text-[var(--psp-gold)] transition-colors font-bebas"
                            style={{ color: "var(--psp-gray-500, #6b7280)" }}
                          >
                            {school.name}
                          </h3>
                          <p className="text-xs text-gray-300 mt-1">
                            {school.city}, {school.state}
                            <span className="ml-2 text-amber-500 font-semibold">
                              Program Discontinued
                            </span>
                          </p>
                        </div>
                        <span style={{ opacity: 0.3, fontSize: "1.5rem" }}>{meta.emoji}</span>
                      </div>

                      {school.league && (
                        <div
                          className="text-xs font-bold px-2 py-1 rounded inline-block mb-3"
                          style={{
                            background: `${LEAGUE_COLORS[school.league] || "var(--psp-gold)"}10`,
                            color: LEAGUE_COLORS[school.league] || "#9ca3af",
                            opacity: 0.7,
                          }}
                        >
                          {school.league}
                        </div>
                      )}

                      <div className="text-xs text-gray-300 mt-1">
                        View historical records →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {teams.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">{meta.emoji}</div>
                <h2 className="text-lg font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
                  No teams found
                </h2>
                <p className="text-sm text-gray-400">
                  Team data for {meta.name.toLowerCase()} is being compiled.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* League Breakdown */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h2 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                League Breakdown
              </h2>
              <div className="space-y-2">
                {sortedLeagues.map(([league, leagueTeams]) => (
                  <div
                    key={league}
                    className="flex justify-between items-center p-2 rounded"
                    style={{ borderLeft: `3px solid ${LEAGUE_COLORS[league] || "var(--psp-gold)"}` }}
                  >
                    <span className="text-sm" style={{ color: "var(--psp-navy)" }}>{league}</span>
                    <span className="text-sm font-bold" style={{ color: LEAGUE_COLORS[league] || "var(--psp-gold)" }}>
                      {leagueTeams.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <PSPPromo size="sidebar" variant={2} />

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h2 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Quick Links
              </h2>
              <div className="space-y-2">
                <Link href={`/${sport}/leaderboards/${sport === "football" ? "rushing" : "scoring"}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  📊 Leaderboards
                </Link>
                <Link href={`/${sport}/championships`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  🏆 Championships
                </Link>
                <Link href={`/${sport}/records`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  📋 Records
                </Link>
                <Link href={`/${sport}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  ← Back to {meta.name}
                </Link>
              </div>
            </div>

            <PSPPromo size="sidebar" variant={4} />
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${meta.name} Teams`,
            url: `https://phillysportspack.com/${sport}/teams`,
            description: `Philadelphia area ${meta.name.toLowerCase()} teams directory`,
            numberOfItems: teams.length,
          }),
        }}
      />
    </main>
  );
}
