"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

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

  // Group results by type for display
  const groupedResults = {
    schools: results.filter((r) => r.type === "school"),
    players: results.filter((r) => r.type === "player"),
  };
  const hasGroupedResults = groupedResults.schools.length > 0 || groupedResults.players.length > 0;

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

  const handleSearchAll = useCallback(() => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
  }, [query, router]);

  // Announce search results count to screen readers
  const resultsAnnouncement = isOpen && query.length >= 2
    ? `${results.length} search results found`
    : '';

  return (
    <div ref={containerRef} className="relative">
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {resultsAnnouncement}
      </div>
      <SearchInput
        ref={inputRef}
        value={query}
        isOpen={isOpen}
        selectedIndex={selectedIndex}
        onSearch={handleSearch}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        getActivedescendantId={getActivedescendantId}
      />
      <SearchResults
        query={query}
        isOpen={isOpen}
        selectedIndex={selectedIndex}
        results={results}
        recentSearches={recentSearches}
        popularSearches={POPULAR_SEARCHES}
        closestMatch={closestMatch}
        groupedResults={groupedResults}
        hasGroupedResults={hasGroupedResults}
        onSelectResult={handleSelectResult}
        onRemoveRecent={removeRecentSearch}
        onSearchAll={handleSearchAll}
      />
    </div>
  );
}
