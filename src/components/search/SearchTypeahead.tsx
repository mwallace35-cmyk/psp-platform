"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";

interface SearchResult {
  type: "player" | "school" | "coach" | "season";
  name: string;
  detail?: string;
  href: string;
  icon: string;
  sport?: string;
}

const POPULAR_SEARCHES: SearchResult[] = [
  { type: "school", name: "St. Joseph's Prep", detail: "Catholic League", href: "/football/schools/saint-josephs-prep", icon: "🏫" },
  { type: "school", name: "Roman Catholic", detail: "Catholic League", href: "/basketball/schools/roman-catholic", icon: "🏫" },
  { type: "school", name: "Imhotep Charter", detail: "Public League", href: "/football/schools/imhotep-charter", icon: "🏫" },
  { type: "school", name: "Neumann-Goretti", detail: "Catholic League", href: "/basketball/schools/neumann-goretti", icon: "🏫" },
  { type: "school", name: "La Salle College HS", detail: "Catholic League", href: "/football/schools/la-salle-college-hs", icon: "🏫" },
];

export default function SearchTypeahead() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [closestMatch, setClosestMatch] = useState<{ item: SearchResult; score: number } | null>(null);
  const fuseRef = useRef<((q: string) => Array<{ item: SearchResult; score: number }>) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("psp_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // Silently ignore localStorage errors
    }
  }, []);

  // Lazy load Fuse.js and search index
  useEffect(() => {
    async function loadFuse() {
      try {
        const Fuse = (await import("fuse.js")).default;
        // In production, this would fetch from /api/search-index
        // For now, use popular searches as the index
        const fuse = new Fuse(POPULAR_SEARCHES, {
          keys: ["name", "detail"],
          threshold: 0.4,
          includeScore: true,
          ignoreLocation: true,
        });
        fuseRef.current = (q: string) => fuse.search(q).map(r => ({ item: r.item, score: r.score ?? 1 }));
      } catch {
        // Fallback to simple filter
        fuseRef.current = (q: string) =>
          POPULAR_SEARCHES.filter((s) =>
            s.name.toLowerCase().includes(q.toLowerCase())
          ).map((item) => ({ item, score: 0 }));
      }
    }
    loadFuse();
  }, []);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      setClosestMatch(null);

      if (q.length < 2) {
        setResults([]);
        setSelectedIndex(-1);
        return;
      }

      if (fuseRef.current) {
        const matched = fuseRef.current(q);

        // Extract instant preview results (max 3 schools + 3 players)
        const schools = matched.filter((r) => r.item.type === "school").slice(0, 3);
        const players = matched.filter((r) => r.item.type === "player").slice(0, 3);
        const instantResults = [...schools, ...players].map((r) => r.item);

        setResults(instantResults);

        // Find closest match for "Did you mean?" if no results
        if (matched.length === 0 && matched.length === 0) {
          // Try to find the closest match even if score is bad
          const allMatches = fuseRef.current(q);
          if (allMatches.length > 0 && allMatches[0].score < 0.6) {
            setClosestMatch(allMatches[0]);
          }
        }

        setSelectedIndex(-1);
      }
    },
    []
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    const items = query.length < 2
      ? recentSearches.length > 0
        ? recentSearches
        : POPULAR_SEARCHES
      : results;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          handleSelectResult(items[selectedIndex]);
        } else if (query.length >= 2) {
          router.push(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }

  function handleSelectResult(item: SearchResult) {
    // Save to recent searches
    const updatedRecent = [
      item,
      ...recentSearches.filter((r) => r.href !== item.href),
    ].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem("psp_recent_searches", JSON.stringify(updatedRecent));

    router.push(item.href);
    setIsOpen(false);
    setQuery("");
  }

  function removeRecentSearch(e: React.MouseEvent, href: string) {
    e.stopPropagation();
    const updated = recentSearches.filter((r) => r.href !== href);
    setRecentSearches(updated);
    localStorage.setItem("psp_recent_searches", JSON.stringify(updated));
  }

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayItems = query.length < 2 && isOpen
    ? recentSearches.length > 0
      ? recentSearches
      : POPULAR_SEARCHES
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

  // Group results by type for display
  const groupedResults = {
    schools: results.filter((r) => r.type === "school"),
    players: results.filter((r) => r.type === "player"),
  };
  const hasGroupedResults = groupedResults.schools.length > 0 || groupedResults.players.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search players, schools, coaches..."
          aria-label="Search for players, schools, and coaches"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-listbox"
          aria-autocomplete="list"
          aria-activedescendant={getActivedescendantId()}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:bg-white/15 focus:border-[var(--psp-gold)] focus:outline-none transition-colors"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* Dropdown */}
      {showDropdown && (
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
                  onClick={() => handleSelectResult(item)}
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
                    onClick={(e) => removeRecentSearch(e, item.href)}
                    className="text-[var(--psp-gray-300)] hover:text-[var(--psp-gray-500)] flex-shrink-0"
                  >
                    ×
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
                      onClick={() => handleSelectResult(item)}
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
                      onClick={() => handleSelectResult(item)}
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
              {POPULAR_SEARCHES.map((item, i) => (
                <button
                  key={`${item.type}-${item.name}`}
                  id={`search-popular-${i}`}
                  role="option"
                  aria-selected={i === selectedIndex}
                  onClick={() => handleSelectResult(item)}
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
                onClick={() => handleSelectResult(closestMatch.item)}
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
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                }}
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
      )}
    </div>
  );
}
