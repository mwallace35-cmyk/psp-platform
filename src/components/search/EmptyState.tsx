import Link from "next/link";
import { SearchX, TrendingUp } from "lucide-react";

interface EmptyStateProps {
  query?: string;
  trendingSearches?: { display_name: string; entity_type: string; url_path: string }[];
}

const BROWSE_SPORTS = [
  { label: "Football", href: "/football", color: "#16a34a", emoji: "🏈" },
  { label: "Basketball", href: "/basketball", color: "#3b82f6", emoji: "🏀" },
  { label: "Baseball", href: "/baseball", color: "#dc2626", emoji: "⚾" },
];

const SUGGESTED_SEARCHES = [
  "St. Joseph's Prep",
  "Roman Catholic",
  "Imhotep Charter",
  "Neumann-Goretti",
  "La Salle",
  "Archbishop Wood",
];

export default function EmptyState({ query, trendingSearches = [] }: EmptyStateProps) {
  /* Minimum characters state */
  if (!query || query.length < 2) {
    return (
      <div className="text-center py-16 px-4">
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background: "var(--psp-gray-100)" }}
        >
          <TrendingUp size={28} style={{ color: "var(--psp-gray-400)" }} />
        </div>
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--psp-navy)" }}
        >
          Search the Database
        </h3>
        <p className="text-sm mb-6" style={{ color: "var(--psp-gray-500)" }}>
          Enter at least 2 characters to search players, schools, and coaches.
        </p>

        {/* Trending or suggested */}
        <div className="flex flex-wrap justify-center gap-2">
          {(trendingSearches.length > 0
            ? trendingSearches.map((t) => ({ label: t.display_name }))
            : SUGGESTED_SEARCHES.map((s) => ({ label: s }))
          ).map(({ label }) => (
            <Link
              key={label}
              href={`/search?q=${encodeURIComponent(label)}`}
              className="px-3.5 py-2 rounded-full text-sm border transition-colors"
              style={{
                borderColor: "var(--psp-gray-200)",
                color: "var(--psp-navy)",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  /* No results state */
  return (
    <div className="text-center py-16 px-4">
      <div
        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ background: "var(--psp-gray-100)" }}
      >
        <SearchX size={28} style={{ color: "var(--psp-gray-400)" }} />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--psp-navy)" }}
      >
        No results for &ldquo;{query}&rdquo;
      </h3>
      <p className="text-sm mb-8" style={{ color: "var(--psp-gray-500)" }}>
        Try a different spelling or browse by category below.
      </p>

      {/* Suggested searches */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {SUGGESTED_SEARCHES.map((term) => (
          <Link
            key={term}
            href={`/search?q=${encodeURIComponent(term)}`}
            className="px-3.5 py-2 rounded-full text-sm border transition-colors"
            style={{
              borderColor: "var(--psp-gray-200)",
              color: "var(--psp-navy)",
            }}
          >
            {term}
          </Link>
        ))}
      </div>

      {/* Browse by sport */}
      <div className="flex justify-center gap-3">
        {BROWSE_SPORTS.map((sport) => (
          <Link
            key={sport.href}
            href={sport.href}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-100 text-sm font-medium transition-all hover:shadow-sm hover:-translate-y-0.5"
            style={{ color: "var(--psp-navy)" }}
          >
            <span className="text-lg">{sport.emoji}</span>
            {sport.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
