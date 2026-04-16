import Link from "next/link";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META, getSchoolTeamStats, getDiscontinuedSchools } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import SchoolLogo from "@/components/ui/SchoolLogo";
import { createStaticClient } from "@/lib/supabase/static";
import TeamsViewToggle from "./TeamsViewToggle";
import type { TeamCardData, DiscontinuedSchoolData } from "./TeamsViewToggle";
import type { Metadata } from "next";
import SportIcon from "@/components/ui/SportIcon";

export const revalidate = 3600; // ISR: hourly
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} Teams - PhillySportsPack`,
    description: `All Philadelphia area ${meta.name.toLowerCase()} teams - records, championships, and season-by-season results.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/teams`,
    },
  };
}

/* ── League / Division Config ──────────────────────────────────────── */

const LEAGUE_COLORS: Record<string, string> = {
  "Philadelphia Catholic League": "#dc2626",
  "Philadelphia Public League": "#16a34a",
  "Inter-Academic League": "#2563eb",
};

const DIVISION_ORDER: Record<string, string[]> = {
  "Philadelphia Catholic League": ["Red", "Blue"],
  "Philadelphia Public League": ["American", "Independence", "National", "Liberty"],
  "Inter-Academic League": [], // no divisions
};

const CORE_LEAGUES = [
  "Philadelphia Catholic League",
  "Philadelphia Public League",
  "Inter-Academic League",
];

/* ── Page ──────────────────────────────────────────────────────────── */

export default async function TeamsPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];
  const supabase = createStaticClient();

  // Parallel data fetches
  const [teamsResult, discontinuedSchools, sportRow, latestSeason] = await Promise.all([
    getSchoolTeamStats(sport),
    getDiscontinuedSchools(sport),
    supabase.from("sports").select("id").eq("slug", sport).single(),
    supabase.from("seasons").select("id, label").order("label", { ascending: false }).limit(1),
  ]);

  const teams = teamsResult.data;

  // Get school IDs for supplemental query
  const schoolIds = teams.map((t) => t.school.id);

  // Supplemental queries: school details + state champs
  const sportId = sportRow.data?.id ?? null;
  const latestSeasonId = latestSeason.data?.[0]?.id ?? null;
  const latestSeasonLabel = latestSeason.data?.[0]?.label ?? null;

  const [schoolDetailsRes, stateChampsRes] = await Promise.all([
    schoolIds.length > 0
      ? supabase
          .from("schools")
          .select("id, logo_url, colors, mascot, division")
          .in("id", schoolIds)
      : Promise.resolve({ data: [] as any[] }),
    sportId && latestSeasonId
      ? supabase
          .from("championships")
          .select("school_id, championship_type, notes")
          .eq("sport_id", sportId)
          .eq("season_id", latestSeasonId)
          .or("level.ilike.%state%,level.ilike.%piaa%")
      : Promise.resolve({ data: [] as any[] }),
  ]);

  // Build lookup maps
  const detailMap = new Map<number, { logoUrl: string | null; colors: any; mascot: string | null; division: string | null }>();
  for (const row of schoolDetailsRes.data ?? []) {
    detailMap.set(row.id, {
      logoUrl: row.logo_url || null,
      colors: row.colors,
      mascot: row.mascot || null,
      division: row.division || null,
    });
  }

  const stateChampIds: number[] = [];
  const stateChampMap: Record<number, string> = {};
  for (const row of stateChampsRes.data ?? []) {
    if (row.school_id) {
      stateChampIds.push(row.school_id);
      stateChampMap[row.school_id] = row.championship_type || "";
    }
  }

  // Also get details for discontinued schools
  const discIds = discontinuedSchools.map((s) => s.id);
  const discDetailsRes = discIds.length > 0
    ? await supabase.from("schools").select("id, logo_url, colors, mascot").in("id", discIds)
    : { data: [] as any[] };

  const discDetailMap = new Map<number, { logoUrl: string | null; colors: any; mascot: string | null }>();
  for (const row of discDetailsRes.data ?? []) {
    discDetailMap.set(row.id, {
      logoUrl: row.logo_url || null,
      colors: row.colors,
      mascot: row.mascot || null,
    });
  }

  // Helper to extract primary color
  function getPrimaryColor(colors: any): string | null {
    if (colors && typeof colors === "object") {
      return (colors as Record<string, string>).primary || null;
    }
    return null;
  }

  // Enrich teams with supplemental data
  function enrichTeam(team: typeof teams[0]): TeamCardData {
    const detail = detailMap.get(team.school.id);
    return {
      ...team,
      logoUrl: detail?.logoUrl || null,
      primaryColor: getPrimaryColor(detail?.colors),
      mascot: detail?.mascot || null,
      division: detail?.division || null,
    };
  }

  // Separate active and closed
  const activeTeams = teams.filter((t) => !t.closedYear).map(enrichTeam);
  const closedTeams = teams
    .filter((t) => t.closedYear)
    .map(enrichTeam)
    .sort((a, b) => {
      if (b.closedYear !== a.closedYear) return (b.closedYear || 0) - (a.closedYear || 0);
      return a.school.name.localeCompare(b.school.name);
    });

  // Enrich discontinued schools
  const enrichedDiscontinued: DiscontinuedSchoolData[] = discontinuedSchools.map((s) => {
    const detail = discDetailMap.get(s.id);
    return {
      ...s,
      logoUrl: detail?.logoUrl || null,
      primaryColor: getPrimaryColor(detail?.colors),
      mascot: detail?.mascot || null,
    };
  });

  // Group active teams by league -> division
  const leagueSections: { league: string; divisionGroups: { division: string; teams: TeamCardData[] }[] }[] = [];

  for (const league of CORE_LEAGUES) {
    const leagueTeams = activeTeams.filter((t) => t.league === league);
    if (leagueTeams.length === 0) continue;

    const divisions = DIVISION_ORDER[league] || [];
    const divisionGroups: { division: string; teams: TeamCardData[] }[] = [];

    if (divisions.length > 0) {
      // Group by division
      for (const div of divisions) {
        const divTeams = leagueTeams.filter((t) => {
          const d = t.division?.toLowerCase() || "";
          return d.includes(div.toLowerCase());
        });
        if (divTeams.length > 0) {
          divisionGroups.push({
            division: `${div} Division`,
            teams: divTeams.sort((a, b) => a.school.name.localeCompare(b.school.name)),
          });
        }
      }

      // Remaining teams without a recognized division
      const assignedIds = new Set(divisionGroups.flatMap((g) => g.teams.map((t) => t.school.id)));
      const otherTeams = leagueTeams.filter((t) => !assignedIds.has(t.school.id));
      if (otherTeams.length > 0) {
        divisionGroups.push({
          division: `Other ${league.replace("Philadelphia ", "").replace("Inter-Academic ", "Inter-Ac ")} Programs`,
          teams: otherTeams.sort((a, b) => a.school.name.localeCompare(b.school.name)),
        });
      }
    } else {
      // No divisions (e.g. Inter-Ac)
      divisionGroups.push({
        division: "",
        teams: leagueTeams.sort((a, b) => a.school.name.localeCompare(b.school.name)),
      });
    }

    leagueSections.push({ league, divisionGroups });
  }

  // Counts
  const totalActive = leagueSections.reduce((s, l) => s + l.divisionGroups.reduce((s2, g) => s2 + g.teams.length, 0), 0);

  // State champs for sidebar
  const stateChampTeams = activeTeams.filter((t) => stateChampIds.includes(t.school.id));

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
              <SportIcon sport={sport} size="sm" />
            </div>
            <div>
              <h1 className="psp-h1 text-white">
                {meta.name} Teams
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                {totalActive} active teams across {leagueSections.length} leagues
                {closedTeams.length > 0 && ` \u00B7 ${closedTeams.length} closed programs`}
                {enrichedDiscontinued.length > 0 && ` \u00B7 ${enrichedDiscontinued.length} discontinued`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3">
            {teams.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4"><SportIcon sport={sport} size="lg" /></div>
                <h2 className="text-lg font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
                  No teams found
                </h2>
                <p className="text-sm text-gray-400">
                  Team data for {meta.name.toLowerCase()} is being compiled.
                </p>
              </div>
            ) : (
              <TeamsViewToggle
                sport={sport}
                leagueSections={leagueSections}
                closedTeams={closedTeams}
                discontinuedSchools={enrichedDiscontinued}
                stateChampIds={stateChampIds}
                stateChampMap={stateChampMap}
                latestSeasonLabel={latestSeasonLabel}
                leagueColors={LEAGUE_COLORS}
              />
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
                {leagueSections.map(({ league, divisionGroups }) => {
                  const count = divisionGroups.reduce((s, g) => s + g.teams.length, 0);
                  return (
                    <div
                      key={league}
                      className="flex justify-between items-center p-2 rounded"
                      style={{ borderLeft: `3px solid ${LEAGUE_COLORS[league] || "var(--psp-gold)"}` }}
                    >
                      <span className="text-sm" style={{ color: "var(--psp-navy)" }}>{league}</span>
                      <span className="text-sm font-bold" style={{ color: LEAGUE_COLORS[league] || "var(--psp-gold)" }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* State Champions */}
            {stateChampTeams.length > 0 && latestSeasonLabel && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
                <h2 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                  {latestSeasonLabel} State Champions
                </h2>
                <div className="space-y-3">
                  {stateChampTeams.map((team) => (
                    <Link
                      key={team.school.id}
                      href={`/${sport}/schools/${team.school.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <SchoolLogo logoUrl={team.logoUrl} name={team.school.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold group-hover:text-[var(--psp-gold)] transition-colors truncate" style={{ color: "var(--psp-navy)" }}>
                          {team.school.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {stateChampMap[team.school.id] ? `Class ${stateChampMap[team.school.id]}` : "State Champion"}
                        </div>
                      </div>
                      <span className="text-lg shrink-0">&#127942;</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <PSPPromo size="sidebar" variant={2} />

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h2 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Quick Links
              </h2>
              <div className="space-y-2">
                <Link href={`/${sport}/leaderboards/${sport === "football" ? "rushing" : "scoring"}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  Leaderboards
                </Link>
                <Link href={`/${sport}/championships`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  Championships
                </Link>
                <Link href={`/${sport}/records`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  Records
                </Link>
                <Link href={`/${sport}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  &larr; Back to {meta.name}
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
