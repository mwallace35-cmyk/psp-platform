"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  type: "player" | "school" | "coach" | "season";
  name: string;
  detail?: string;
  href: string;
  icon: string;
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
  const fuseRef = useRef<((q: string) => SearchResult[]) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Lazy load Fuse.js and search index
  useEffect(() => {
    async function loadFuse() {
      try {
        const Fuse = (await import("fuse.js")).default;
        // In production, this would fetch from /api/search-index
        // For now, use popular searches as the index
        const fuse = new Fuse(POPULAR_SEARCHES, {
          keys: ["name", "detail"],
          threshold: 0.3,
          includeScore: true,
        });
        fuseRef.current = (q: string) => fuse.search(q).map((r) => r.item);
      } catch {
        // Fallback to simple filter
        fuseRef.current = (q: string) =>
          POPULAR_SEARCHES.filter((s) =>
            s.name.toLowerCase().includes(q.toLowerCase())
          );
      }
    }
    loadFuse();
  }, []);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (q.length < 2) {
        setResults([]);
        setSelectedIndex(-1);
        return;
      }
      if (fuseRef.current) {
        const matched = fuseRef.current(q);
        setResults(matched.slice(0, 8));
        setSelectedIndex(-1);
      }
    },
    []
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    const items = query.length < 2 ? POPULAR_SEARCHES : results;

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
          router.push(items[selectedIndex].href);
          setIsOpen(false);
          setQuery("");
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

  const displayItems = query.length < 2 && isOpen ? POPULAR_SEARCHES : results;
  const showDropdown = isOpen && (displayItems.length > 0 || query.length < 2);

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
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:bg-white/15 focus:border-[var(--psp-gold)] focus:outline-none transition-colors"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-[var(--psp-gray-200)] overflow-hidden z-50">
          {query.length < 2 && (
            <div className="px-3 py-2 text-xs font-semibold text-[var(--psp-gray-400)] uppercase tracking-wider">
              Popular Searches
            </div>
          )}
          {displayItems.map((item, i) => (
            <button
              key={`${item.type}-${item.name}`}
              onClick={() => {
                router.push(item.href);
                setIsOpen(false);
                setQuery("");
              }}
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
          {query.length >= 2 && (
            <button
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(query)}`);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2.5 text-sm text-center border-t border-[var(--psp-gray-100)] text-[var(--psp-gray-500)] hover:bg-[var(--psp-gray-50)]"
            >
              Search all for &quot;<strong>{query}</strong>&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

