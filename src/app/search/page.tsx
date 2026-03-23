import Link from "next/link";
import { searchAll, SearchResult } from "@/lib/data";
import { createStaticClient } from "@/lib/supabase/static";
import { LeaderboardAd, InContentAd } from "@/components/ads/AdPlaceholder";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import SearchFilters from "@/components/search/SearchFilters";

export const metadata: Metadata = {
  title: "Search — PhillySportsPack",
  description: "Search players, schools, coaches, and seasons in the Philadelphia high school sports database.",
};

export const revalidate = 3600; // ISR: revalidate every hour
export const dynamic = "force-dynamic";
type GroupedResults = Partial<Record<SearchResult['entity_type'] | 'other', SearchResult[]>>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sport?: string }>;
}) {
  const { q = "", sport } = await searchParams;
  const searchResponse = q.length >= 2 ? await searchAll(q) : { data: [], total: 0, page: 1, pageSize: 30, hasMore: false };
  const results = searchResponse.data;

  // Group results by entity type with proper typing
  const grouped: GroupedResults = {};
  for (const r of results) {
    const type: SearchResult['entity_type'] | 'other' = r.entity_type || "other";
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type]?.push(r);
  }

  // Fetch discovery data only when no search query
  let leagueSchools: any[] = [];
  let risingPrograms: any[] = [];

  if (!q) {
    const supabase = createStaticClient();

    // Fetch schools grouped by league
    const { data: allLeagueSchools } = await supabase
      .from("schools")
      .select("id, slug, name, league_id, leagues(id, name)")
      .is("deleted_at", null)
      .order("name")
      .limit(200);

    leagueSchools = allLeagueSchools ?? [];

    // Fetch schools with recent championships for "Rising Programs"
    const { data: recentChamps } = await supabase
      .from("championships")
      .select("school_id, schools(id, name, slug), sports(emoji, name)")
      .is("schools.deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(50);

    // Deduplicate by school_id and get top 3
    const seenSchools = new Set<number>();
    risingPrograms = (recentChamps ?? [])
      .filter(c => {
        if (!c.school_id || seenSchools.has(c.school_id)) return false;
        seenSchools.add(c.school_id);
        return true;
      })
      .slice(0, 3)
      .map(c => {
        const school = Array.isArray(c.schools) ? c.schools[0] : c.schools;
        const sport = Array.isArray(c.sports) ? c.sports[0] : c.sports;
        return {
          id: c.school_id,
          name: school?.name || "Unknown",
          slug: school?.slug || "",
          sport: sport?.emoji || "📋",
          sportName: sport?.name || "Unknown",
        };
      });
  }

  const typeLabels: Record<string, { label: string; icon: string }> = {
    school: { label: "Schools", icon: "🏫" },
    player: { label: "Players", icon: "👤" },
    coach: { label: "Coaches", icon: "🧑‍🏫" },
    season: { label: "Seasons", icon: "📅" },
    other: { label: "Other", icon: "📋" },
  };

  // Map sport names to URL slugs
  const sportSlugMap: Record<string, string> = {
    'Football': 'football',
    'Basketball': 'basketball',
    'Baseball': 'baseball',
    'Track & Field': 'track-field',
    'Lacrosse': 'lacrosse',
    'Wrestling': 'wrestling',
    'Soccer': 'soccer',
  };

  return (
    <main id="main-content">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: "Search", url: "https://phillysportspack.com/search" },
      ]} />

      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl text-white tracking-wider mb-4 font-bebas">
            Search
          </h1>
          <form action="/search" method="GET">
            <div className="flex gap-2 max-w-2xl">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search players, schools, coaches..."
                className="flex-1 px-4 py-3 rounded-lg text-sm bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:bg-white/15 focus:border-[var(--psp-gold)] focus:outline-none"
              />
              <button type="submit" className="btn-primary px-6 py-3">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* School Discovery Section */}
      {!q && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
          <div className="sec-head">
            <h2>Discover Schools</h2>
          </div>

          {/* Rising Programs Spotlight */}
          <div style={{
            background: "linear-gradient(135deg, var(--psp-navy), #0f1a2e)",
            borderRadius: 8,
            padding: "20px 24px",
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--psp-gold)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              🔥 Rising Programs
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {risingPrograms.length > 0 ? (
                risingPrograms.map((school, i) => {
                  const sportSlug = sportSlugMap[school.sportName] || 'football';
                  return (
                    <Link key={school.id} href={`/${sportSlug}/schools/${school.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        background: "rgba(255,255,255,.08)",
                        borderRadius: 6,
                        padding: "14px 16px",
                        borderLeft: `3px solid var(--psp-gold)`,
                        transition: ".15s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <span>{school.sport}</span>
                          <span style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{school.name}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>Recent champion</div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", gridColumn: "1 / -1", padding: "10px 0" }}>
                  No recent champions yet
                </div>
              )}
            </div>
          </div>

          {/* League Sections */}
          {Object.entries(
            leagueSchools.reduce((acc: Record<string, any[]>, school: any) => {
              const leagueName = school.leagues?.name || "Other";
              if (!acc[leagueName]) acc[leagueName] = [];
              acc[leagueName].push(school);
              return acc;
            }, {})
          ).map(([leagueName, schools], idx) => {
            const leagueColors = {
              "Catholic League": "var(--psp-gold)",
              "Public League": "#2563eb",
              "Inter-Ac": "#7c3aed",
              "Other": "#666",
            };
            const color = (leagueColors as Record<string, string>)[leagueName] || "#666";
            const descriptions = {
              "Catholic League": "The PCL is the premier athletic conference in the Philadelphia area, fielding powerhouse programs across all sports.",
              "Public League": "Philadelphia's public school league features deep talent pools and fierce rivalries across the city.",
              "Inter-Ac": "The Inter-Ac features prestigious independent schools with strong athletic traditions.",
            };
            const description = (descriptions as Record<string, string>)[leagueName] || "Schools in this league";

            return (
              <div key={leagueName} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 4, height: 20, background: color, borderRadius: 2 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--psp-navy)", fontFamily: "'Bebas Neue', sans-serif" }}>
                    {leagueName}
                  </h3>
                </div>
                <p style={{ fontSize: 12, color: "var(--psp-gray-500)", marginBottom: 12, paddingLeft: 12 }}>
                  {description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 12 }}>
                  {schools.slice(0, 20).map((school: any) => (
                    <Link
                      key={school.id}
                      href={`/football/schools/${school.slug}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 14px",
                        background: "var(--psp-white)",
                        border: "1px solid var(--g100)",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--psp-navy)",
                        textDecoration: "none",
                        transition: ".15s",
                      }}
                    >
                      🏫 {school.name}
                    </Link>
                  ))}
                  {schools.length > 20 && (
                    <div style={{ fontSize: 12, color: "var(--psp-gray-400)", paddingTop: 8 }}>
                      +{schools.length - 20} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Sport Switcher */}
          <div style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            padding: "16px 0",
            borderTop: "1px solid var(--g100)",
            marginTop: 8,
          }}>
            {[
              { label: "Football", href: "/football", emoji: "🏈", color: "#16a34a" },
              { label: "Basketball", href: "/basketball", emoji: "🏀", color: "#ea580c" },
              { label: "Baseball", href: "/baseball", emoji: "⚾", color: "#dc2626" },
              { label: "Track", href: "/track-field", emoji: "🏃", color: "#7c3aed" },
              { label: "Lacrosse", href: "/lacrosse", emoji: "🥍", color: "#0891b2" },
              { label: "Wrestling", href: "/wrestling", emoji: "🤼", color: "#ca8a04" },
              { label: "Soccer", href: "/soccer", emoji: "⚽", color: "#059669" },
            ].map((sport) => (
              <Link
                key={sport.href}
                href={sport.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--g100)",
                  textDecoration: "none",
                  transition: ".15s",
                  minWidth: 70,
                }}
              >
                <span style={{ fontSize: 22 }}>{sport.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--psp-navy)" }}>{sport.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {q.length >= 2 && <SearchFilters />}

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <LeaderboardAd id="psp-search-banner" />
        {q.length >= 2 ? (
          results.length > 0 ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                  {results.length} result{results.length !== 1 ? "s" : ""} for &quot;<strong>{q}</strong>&quot;
                </p>
                <div className="flex gap-1 text-xs">
                  {Object.entries(grouped).map(([type, items]) => (
                    <span
                      key={type}
                      className="px-2 py-1 rounded-full"
                      style={{
                        background: "rgba(240, 165, 0, 0.1)",
                        color: "var(--psp-gold)",
                      }}
                    >
                      {typeLabels[type]?.icon} {items.length}
                    </span>
                  ))}
                </div>
              </div>
              {Object.entries(grouped).map(([type, items]) => (
                <div key={type}>
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                    <span>{typeLabels[type]?.icon || "📋"}</span>
                    {typeLabels[type]?.label || type} ({items.length})
                  </h2>
                  <div className="space-y-2">
                    {items?.map((item, idx: number) => (
                      <Link
                        key={idx}
                        href={item.url_path || "#"}
                        className="block bg-white rounded-lg border border-[var(--psp-gray-200)] px-4 py-3 hover:shadow-md transition-all"
                      >
                        <div className="font-medium text-sm" style={{ color: "var(--psp-navy)" }}>
                          {item.display_name}
                        </div>
                        {item.context && (
                          <div className="text-xs mt-0.5" style={{ color: "var(--psp-gray-500)" }}>
                            {item.context}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium mb-2" style={{ color: "var(--psp-navy)" }}>
                No results found for &quot;{q}&quot;
              </h3>
              <p className="text-sm">Try a different search term or browse by sport.</p>
            </div>
          )
        ) : (
          <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2" style={{ color: "var(--psp-navy)" }}>
              Search the Database
            </h3>
            <p className="text-sm">Enter at least 2 characters to search players, schools, and coaches.</p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {["St. Joseph's Prep", "Roman Catholic", "Neumann-Goretti", "Imhotep Charter"].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 rounded-full text-sm border border-[var(--psp-gray-200)] hover:border-[var(--psp-gray-300)] transition-colors"
                  style={{ color: "var(--psp-navy)" }}
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
        <InContentAd id="psp-search-btm" />
      </main>

      {/* JSON-LD for Search Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            name: "Search — PhillySportsPack",
            url: "https://phillysportspack.com/search",
            description: "Search the Philadelphia high school sports database for players, schools, coaches, and seasons.",
            isPartOf: {
              "@type": "WebSite",
              name: "PhillySportsPack",
              url: "https://phillysportspack.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://phillysportspack.com/search?q={search_term_string}",
                },
                query_input: "required name=search_term_string",
              },
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: results.length,
              itemListElement: results.slice(0, 10).map((result, idx) => ({
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
    </main>
  );
}
