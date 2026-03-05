import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getTeamsWithRecords } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: hourly

type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} Teams — PhillySportsPack`,
    description: `All Philadelphia area ${meta.name.toLowerCase()} teams — records, championships, and season-by-season results.`,
  };
}

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
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const teams = await getTeamsWithRecords(sport);

  // Group by league
  const leagueGroups: Record<string, typeof teams> = {};
  for (const team of teams) {
    const league = team.league || "Independent";
    if (!leagueGroups[league]) leagueGroups[league] = [];
    leagueGroups[league].push(team);
  }

  // Sort leagues: bigger leagues first
  const sortedLeagues = Object.entries(leagueGroups)
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <>
      {/* Header */}
      <section
        className="py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, ${meta.color}22 100%)` }}
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
                className="text-4xl md:text-5xl text-white tracking-wider"
                style={{ fontFamily: "Barlow Condensed, sans-serif" }}
              >
                {meta.name} Teams
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {teams.length} teams across {sortedLeagues.length} leagues
              </p>
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {sortedLeagues.map(([league, leagueTeams]) => (
              <div key={league}>
                <h2
                  className="text-2xl font-bold mb-4 pb-2 border-b-2"
                  style={{
                    color: "var(--psp-navy)",
                    fontFamily: "Barlow Condensed, sans-serif",
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
                        href={`/schools/${school.slug}/${sport}`}
                        className="group block bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-lg hover:border-[var(--psp-gold)] transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3
                              className="text-lg font-bold group-hover:text-[var(--psp-gold)] transition-colors"
                              style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}
                            >
                              {school.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
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
                            <div className="text-gray-500">All-Time</div>
                            <div className="font-bold text-sm mt-1" style={{ color: "var(--psp-navy)" }}>
                              {team.totalWins}-{team.totalLosses}
                              {team.totalTies > 0 ? `-${team.totalTies}` : ""}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="text-gray-500">Win %</div>
                            <div className="font-bold text-sm mt-1" style={{ color: "var(--psp-navy)" }}>
                              {winPct}%
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="text-gray-500">Titles</div>
                            <div className="font-bold text-sm mt-1" style={{ color: "var(--psp-gold)" }}>
                              {team.championships > 0 ? `🏆 ${team.championships}` : "—"}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400 mt-2">
                          {team.seasonCount} seasons on record
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {teams.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">{meta.emoji}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
                  No teams found
                </h3>
                <p className="text-sm text-gray-500">
                  Team data for {meta.name.toLowerCase()} is being compiled.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* League Breakdown */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                League Breakdown
              </h3>
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
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Quick Links
              </h3>
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
    </>
  );
}
