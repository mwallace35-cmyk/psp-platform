import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { searchAll } from "@/lib/data";
import { LeaderboardAd, InContentAd } from "@/components/ads/AdPlaceholder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search — PhillySportsPack",
  description: "Search players, schools, coaches, and seasons in the Philadelphia high school sports database.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sport?: string }>;
}) {
  const { q = "", sport } = await searchParams;
  const results = q.length >= 2 ? await searchAll(q) : [];

  // Group results by entity type
  const grouped: Record<string, any[]> = {};
  for (const r of results) {
    const type = r.entity_type || "other";
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(r);
  }

  const typeLabels: Record<string, { label: string; icon: string }> = {
    school: { label: "Schools", icon: "🏫" },
    player: { label: "Players", icon: "👤" },
    coach: { label: "Coaches", icon: "🧑‍🏫" },
    season: { label: "Seasons", icon: "📅" },
    other: { label: "Other", icon: "📋" },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl text-white tracking-wider mb-4" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
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

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <LeaderboardAd id="psp-search-banner" />
        {q.length >= 2 ? (
          results.length > 0 ? (
            <div className="space-y-8">
              <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                {results.length} result{results.length !== 1 ? "s" : ""} for &quot;<strong>{q}</strong>&quot;
              </p>
              {Object.entries(grouped).map(([type, items]) => (
                <div key={type}>
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                    <span>{typeLabels[type]?.icon || "📋"}</span>
                    {typeLabels[type]?.label || type} ({items.length})
                  </h2>
                  <div className="space-y-2">
                    {items.map((item: any, idx: number) => (
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

      <Footer />
    </div>
  );
}
