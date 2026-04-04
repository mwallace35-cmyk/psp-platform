import Link from "next/link";
import { Suspense } from "react";
import { searchAll, SearchResult } from "@/lib/data";
import { createStaticClient } from "@/lib/supabase/static";
import { LeaderboardAd, InContentAd } from "@/components/ads/AdPlaceholder";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import SearchHero from "@/components/search/SearchHero";
import SearchResultCard from "@/components/search/SearchResultCard";
import EntityTypeTabs from "@/components/search/EntityTypeTabs";
import SearchFilters from "@/components/search/SearchFilters";
import EmptyState from "@/components/search/EmptyState";

export const metadata: Metadata = {
  title: "Search — PhillySportsPack",
  description:
    "Search players, schools, coaches, and seasons in the Philadelphia high school sports database.",
  alternates: { canonical: "https://phillysportspack.com/search" },
};

export const revalidate = 3600;

/* ── Sport config for discovery cards ── */
const SPORTS_DISCOVERY = [
  { slug: "football", name: "Football", emoji: "\u{1F3C8}", color: "#16a34a" },
  { slug: "basketball", name: "Basketball", emoji: "\u{1F3C0}", color: "#3b82f6" },
  { slug: "baseball", name: "Baseball", emoji: "\u26BE", color: "#dc2626" },
  { slug: "track-field", name: "Track", emoji: "\u{1F3C3}", color: "#7c3aed" },
  { slug: "lacrosse", name: "Lacrosse", emoji: "\u{1F94D}", color: "#0891b2" },
  { slug: "wrestling", name: "Wrestling", emoji: "\u{1F93C}", color: "#ca8a04" },
  { slug: "soccer", name: "Soccer", emoji: "\u26BD", color: "#059669" },
];

const LEAGUE_CARDS = [
  {
    name: "Catholic League",
    slug: "catholic",
    color: "var(--psp-gold)",
    description:
      "The PCL is the premier athletic conference in the Philadelphia area, fielding powerhouse programs across all sports.",
  },
  {
    name: "Public League",
    slug: "public",
    color: "#2563eb",
    description:
      "Philadelphia's public school league features deep talent pools and fierce rivalries across the city.",
  },
  {
    name: "Inter-Ac",
    slug: "inter-ac",
    color: "#7c3aed",
    description:
      "The Inter-Ac features prestigious independent schools with strong athletic traditions.",
  },
];

const sportSlugMap: Record<string, string> = {
  Football: "football",
  Basketball: "basketball",
  Baseball: "baseball",
  "Track & Field": "track-field",
  Lacrosse: "lacrosse",
  Wrestling: "wrestling",
  Soccer: "soccer",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; sport?: string; league?: string; era?: string; position?: string }>;
}) {
  const { q = "", type: activeType } = await searchParams;
  const supabase = createStaticClient();

  /* ── Search results (when query present) ── */
  const searchResponse =
    q.length >= 2
      ? await searchAll(q)
      : { data: [], total: 0, page: 1, pageSize: 30, hasMore: false };
  const allResults = searchResponse.data;

  /* Compute tab counts */
  const counts = {
    all: allResults.length,
    player: allResults.filter((r) => r.entity_type === "player").length,
    school: allResults.filter((r) => r.entity_type === "school").length,
    coach: allResults.filter((r) => r.entity_type === "coach").length,
  };

  /* Filter by active type tab */
  const filteredResults =
    activeType && activeType !== "all"
      ? allResults.filter((r) => r.entity_type === activeType)
      : allResults;

  /* ── Discovery data (no query) ── */
  let stats = { players: 55232, schools: 738, sports: 7 };
  let trendingSearches: { display_name: string; entity_type: string; url_path: string }[] = [];
  let leagueSchools: any[] = [];
  let risingPrograms: any[] = [];
  let leagueCounts: Record<string, number> = {};

  if (!q) {
    const [playerCountRes, schoolCountRes, trendingRes, leagueSchoolsRes, risingRes] =
      await Promise.all([
        supabase
          .from("players")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null),
        supabase
          .from("schools")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null),
        supabase
          .from("search_index")
          .select("display_name, entity_type, url_path")
          .not("url_path", "is", null)
          .limit(8),
        supabase
          .from("schools")
          .select("id, slug, name, league_id, leagues(id, name)")
          .is("deleted_at", null)
          .order("name")
          .limit(200),
        supabase
          .from("championships")
          .select("school_id, schools(id, name, slug), sports(emoji, name)")
          .is("schools.deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

    stats = {
      players: playerCountRes.count ?? 55232,
      schools: schoolCountRes.count ?? 738,
      sports: 7,
    };

    trendingSearches = (trendingRes.data ?? []).filter(
      (t) => t.display_name && t.url_path
    );

    leagueSchools = leagueSchoolsRes.data ?? [];

    // Compute league counts
    for (const s of leagueSchools) {
      const name = (s as any).leagues?.name || "Other";
      leagueCounts[name] = (leagueCounts[name] || 0) + 1;
    }

    // Rising programs (deduplicated)
    const seenSchools = new Set<number>();
    risingPrograms = (risingRes.data ?? [])
      .filter((c) => {
        if (!c.school_id || seenSchools.has(c.school_id)) return false;
        seenSchools.add(c.school_id);
        return true;
      })
      .slice(0, 6)
      .map((c) => {
        const school = Array.isArray(c.schools) ? c.schools[0] : c.schools;
        const sport = Array.isArray(c.sports) ? c.sports[0] : c.sports;
        return {
          id: c.school_id,
          name: school?.name || "Unknown",
          slug: school?.slug || "",
          sport: sport?.emoji || "",
          sportName: sport?.name || "Unknown",
        };
      });
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: "Search", url: "https://phillysportspack.com/search" },
        ]}
      />

      {/* ── Hero ── */}
      <SearchHero
        query={q}
        stats={stats}
        trendingSearches={
          trendingSearches.length > 0
            ? trendingSearches
            : [
                { display_name: "St. Joseph's Prep", entity_type: "school", url_path: "/football/schools/saint-josephs-prep" },
                { display_name: "Roman Catholic", entity_type: "school", url_path: "/basketball/schools/roman-catholic" },
                { display_name: "Imhotep Charter", entity_type: "school", url_path: "/football/schools/imhotep-charter" },
                { display_name: "Neumann-Goretti", entity_type: "school", url_path: "/basketball/schools/neumann-goretti" },
                { display_name: "La Salle", entity_type: "school", url_path: "/football/schools/la-salle-college-hs" },
                { display_name: "Archbishop Wood", entity_type: "school", url_path: "/football/schools/archbishop-wood" },
              ]
        }
      />

      {/* ══════════════════════════════════════════════
          DISCOVERY SECTION (no query)
         ══════════════════════════════════════════════ */}
      {!q && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          {/* ── Browse by Sport ── */}
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: "var(--psp-gray-500)" }}
          >
            Browse by Sport
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
            {SPORTS_DISCOVERY.map((sport) => (
              <Link
                key={sport.slug}
                href={`/${sport.slug}`}
                className="flex items-center gap-2.5 px-3.5 py-3 bg-white rounded-lg border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5 group"
                style={{ borderLeftWidth: 3, borderLeftColor: sport.color }}
              >
                <span className="text-xl" aria-hidden>
                  {sport.emoji}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--psp-navy)" }}
                >
                  {sport.name}
                </span>
              </Link>
            ))}
          </div>

          {/* ── Browse by League ── */}
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: "var(--psp-gray-500)" }}
          >
            Browse by League
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {LEAGUE_CARDS.map((league) => (
              <Link
                key={league.slug}
                href={`/schools?league=${league.slug}`}
                className="block bg-white rounded-xl border border-gray-100 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg group"
                style={{ borderTopWidth: 3, borderTopColor: league.color }}
              >
                <h3
                  className="font-bold text-lg mb-1"
                  style={{
                    fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif",
                    color: "var(--psp-navy)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {league.name.toUpperCase()}
                </h3>
                <p
                  className="text-xs leading-relaxed mb-3"
                  style={{ color: "var(--psp-gray-500)" }}
                >
                  {league.description}
                </p>
                <span
                  className="text-xs font-semibold inline-flex items-center gap-1"
                  style={{ color: league.color }}
                >
                  {leagueCounts[league.name] || 0} schools
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    &rarr;
                  </span>
                </span>
              </Link>
            ))}
          </div>

          {/* ── Rising Programs ── */}
          {risingPrograms.length > 0 && (
            <>
              <div
                className="rounded-xl p-6"
                style={{ background: "var(--psp-navy)" }}
              >
                <h3
                  className="text-[10px] font-bold uppercase tracking-[0.15em] mb-4"
                  style={{ color: "var(--psp-gold)" }}
                >
                  Rising Programs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {risingPrograms.map((school) => {
                    const sportSlug =
                      sportSlugMap[school.sportName] || "football";
                    return (
                      <Link
                        key={school.id}
                        href={`/${sportSlug}/schools/${school.slug}`}
                        className="block rounded-lg p-4 transition-all hover:bg-white/10"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          borderLeft: "3px solid var(--psp-gold)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{school.sport}</span>
                          <span className="text-sm font-bold text-white">
                            {school.name}
                          </span>
                        </div>
                        <span
                          className="text-[11px]"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          Recent champion
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SEARCH RESULTS SECTION (with query)
         ══════════════════════════════════════════════ */}
      {q.length >= 2 && (
        <>
          {/* Entity type tabs */}
          <Suspense>
            <EntityTypeTabs counts={counts} query={q} />
          </Suspense>

          {/* Filters */}
          <Suspense>
            <SearchFilters />
          </Suspense>

          {/* Results */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <LeaderboardAd id="psp-search-banner" />

            {filteredResults.length > 0 ? (
              <>
                {/* Results header */}
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--psp-gray-500)" }}
                >
                  {filteredResults.length} result
                  {filteredResults.length !== 1 ? "s" : ""} for &ldquo;
                  <strong style={{ color: "var(--psp-navy)" }}>{q}</strong>
                  &rdquo;
                </p>

                {/* Result cards */}
                <div className="space-y-2">
                  {filteredResults.map((result, idx) => (
                    <SearchResultCard key={idx} result={result} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState query={q} trendingSearches={trendingSearches} />
            )}

            <InContentAd id="psp-search-btm" />
          </div>
        </>
      )}

      {/* Short query / no query with results area */}
      {q && q.length < 2 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <EmptyState query={q} trendingSearches={trendingSearches} />
        </div>
      )}

      {/* JSON-LD for Search Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            name: "Search \u2014 PhillySportsPack",
            url: "https://phillysportspack.com/search",
            description:
              "Search the Philadelphia high school sports database for players, schools, coaches, and seasons.",
            isPartOf: {
              "@type": "WebSite",
              name: "PhillySportsPack",
              url: "https://phillysportspack.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://phillysportspack.com/search?q={search_term_string}",
                },
                query_input: "required name=search_term_string",
              },
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: allResults.length,
              itemListElement: allResults.slice(0, 10).map((result, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: result.display_name,
                url: result.url_path || "https://phillysportspack.com",
                description: result.context,
              })),
            },
          }),
        }}
      />
    </>
  );
}
