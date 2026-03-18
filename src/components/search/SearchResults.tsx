"use client";

import { SPORT_COLORS_HEX } from "@/lib/constants/sports";

interface SearchResult {
  type: "player" | "school" | "coach" | "season";
  name: string;
  detail?: string;
  href: string;
  icon: string;
  sport?: string;
}

interface SearchResultsProps {
  query: string;
  isOpen: boolean;
  selectedIndex: number;
  results: SearchResult[];
  recentSearches: SearchResult[];
  popularSearches: SearchResult[];
  closestMatch: { item: SearchResult; score: number } | null;
  groupedResults: {
    schools: SearchResult[];
    players: SearchResult[];
  };
  hasGroupedResults: boolean;
  onSelectResult: (item: SearchResult) => void;
  onRemoveRecent: (e: React.MouseEvent, href: string) => void;
  onSearchAll: () => void;
}

export default function SearchResults({
  query,
  isOpen,
  selectedIndex,
  results,
  recentSearches,
  popularSearches,
  closestMatch,
  groupedResults,
  hasGroupedResults,
  onSelectResult,
  onRemoveRecent,
  onSearchAll,
}: SearchResultsProps) {
  const displayItems =
    query.length < 2 && isOpen
      ? recentSearches.length > 0
        ? recentSearches
        : popularSearches
      : results;
  const showDropdown = isOpen && (displayItems.length > 0 || query.length < 2 || closestMatch);

  // Helper function to get the correct aria-activedescendant ID based on context
  const getActivedescendantId = () => {
    if (selectedIndex < 0) return "";
    if (query.length < 2 && recentSearches.length > 0) {
      return `search-recent-${selectedIndex}`;
    }
    if (query.length >= 2 && hasGroupedResults) {
      const schools = groupedResults.schools;
      if (selectedIndex < schools.length) {
        return `search-school-${selectedIndex}`;
      }
      return `search-player-${selectedIndex - schools.length}`;
    }
    if (query.length < 2 && recentSearches.length === 0) {
      return `search-popular-${selectedIndex}`;
    }
    return "";
  };

  if (!showDropdown) {
    return null;
  }

  return (
    <div
      id="search-listbox"
      role="listbox"
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-[var(--psp-gray-200)] overflow-hidden z-50 max-h-96 overflow-y-auto"
    >
      {/* Recent Searches Section */}
      {query.length < 2 && recentSearches.length > 0 && (
        <>
          <div className="px-3 py-2 text-xs font-semibold text-[var(--psp-gray-400)] uppercase tracking-wider">
            Recent Searches
          </div>
          {recentSearches.map((item, i) => (
            <button
              key={`recent-${item.href}`}
              id={`search-recent-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              onClick={() => onSelectResult(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors ${
                i === selectedIndex
                  ? "bg-[var(--psp-gray-100)]"
                  : "hover:bg-[var(--psp-gray-50)]"
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[var(--psp-navy)] truncate">
                  {item.name}
                </div>
                {item.detail && (
                  <div className="text-xs text-[var(--psp-gray-400)] truncate">
                    {item.detail}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => onRemoveRecent(e, item.href)}
                className="text-[var(--psp-gray-300)] hover:text-[var(--psp-gray-500)] flex-shrink-0"
              >
                �
              </button>
            </button>
          ))}
          <div className="h-px bg-[var(--psp-gray-100)]" />
        </>
      )}

      {/* Popular Searches / Instant Results */}
      {query.length < 2 && recentSearches.length === 0 && (
        <div className="px-3 py-2 text-xs font-semibold text-[var(--psp-gray-400)] uppercase tracking-wider">
          Popular Searches
        </div>
      )}

      {query.length >= 2 && hasGroupedResults && (
        <>
          {groupedResults.schools.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-[var(--psp-gray-400)] uppercase tracking-wider">
                Schools
              </div>
              {groupedResults.schools.map((item, i) => (
                <button
                  key={`school-${item.href}`}
                  id={`search-school-${i}`}
                  role="option"
                  aria-selected={i === selectedIndex}
                  onClick={() => onSelectResult(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors ${
                    i === selectedIndex
                      ? "bg-[var(--psp-gray-100)]"
                      : "hover:bg-[var(--psp-gray-50)]"
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[var(--psp-navy)] truncate">
                      {item.name}
                    </div>
                    {item.detail && (
                      <div className="text-xs text-[var(--psp-gray-400)] truncate">
                        {item.detail}
                      </div>
                    )}
                  </div>
                  {item.sport && (
                    <span
                      className="text-xs px-2 py-1 rounded text-white flex-shrink-0"
                      style={{ backgroundColor: SPORT_COLORS_HEX[item.sport] || "#666" }}
                    >
                      {item.sport}
                    </span>
                  )}
                </button>
              ))}
            </>
          )}
          {groupedResults.players.length > 0 && (
            <>
              {groupedResults.schools.length > 0 && <div className="h-px bg-[var(--psp-gray-100)]" />}
              <div className="px-3 py-2 text-xs font-semibold text-[var(--psp-gray-400)] uppercase tracking-wider">
                Players
              </div>
              {groupedResults.players.map((item, i) => (
                <button
                  key={`player-${item.href}`}
                  id={`search-player-${i}`}
                  role="option"
                  aria-selected={i === selectedIndex}
                  onClick={() => onSelectResult(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors ${
                    i === selectedIndex
                      ? "bg-[var(--psp-gray-100)]"
                      : "hover:bg-[var(--psp-gray-50)]"
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[var(--psp-navy)] truncate">
                      {item.name}
                    </div>
                    {item.detail && (
                      <div className="text-xs text-[var(--psp-gray-400)] truncate">
                        {item.detail}
                      </div>
                    )}
                  </div>
                  {item.sport && (
                    <span
                      className="text-xs px-2 py-1 rounded text-white flex-shrink-0"
                      style={{ backgroundColor: SPORT_COLORS_HEX[item.sport] || "#666" }}
                    >
                      {item.sport}
                    </span>
                  )}
                </button>
              ))}
            </>
          )}
        </>
      )}

      {/* Default Popular Searches (when no query and no recents) */}
      {query.length < 2 && recentSearches.length === 0 && (
        <>
          {popularSearches.map((item, i) => (
            <button
              key={`${item.type}-${item.name}`}
              id={`search-popular-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              onClick={() => onSelectResult(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors ${
                i === selectedIndex
                  ? "bg-[var(--psp-gray-100)]"
                  : "hover:bg-[var(--psp-gray-50)]"
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <div className="font-medium text-[var(--psp-navy)] truncate">
                  {item.name}
                </div>
                {item.detail && (
                  <div className="text-xs text-[var(--psp-gray-400)] truncate">
                    {item.detail}
                  </div>
                )}
              </div>
              <span className="ml-auto text-xs text-[var(--psp-gray-300)] capitalize flex-shrink-0">
                {item.type}
              </span>
            </button>
          ))}
        </>
      )}

      {/* "Did you mean?" suggestion */}
      {query.length >= 2 && !hasGroupedResults && closestMatch && (
        <div className="px-3 py-2 text-xs text-[var(--psp-gray-500)]">
          Did you mean:
          <button
            onClick={() => onSelectResult(closestMatch.item)}
            className="block w-full mt-1 px-3 py-2 text-sm font-medium text-[var(--psp-navy)] hover:bg-[var(--psp-gray-50)] rounded transition-colors text-left"
          >
            <span className="mr-2">{closestMatch.item.icon}</span>
            {closestMatch.item.name}
          </button>
        </div>
      )}

      {/* "Search all" button */}
      {query.length >= 2 && hasGroupedResults && (
        <>
          <div className="h-px bg-[var(--psp-gray-100)]" />
          <button
            onClick={onSearchAll}
            className="w-full px-3 py-2.5 text-sm text-center text-[var(--psp-gray-500)] hover:bg-[var(--psp-gray-50)]"
          >
            Search all for &quot;<strong>{query}</strong>&quot;
          </button>
        </>
      )}

      {/* No results fallback */}
      {query.length >= 2 && !hasGroupedResults && !closestMatch && (
        <div className="px-3 py-4 text-sm text-center text-[var(--psp-gray-400)]">
          No results found
        </div>
      )}
    </div>
  );
}
