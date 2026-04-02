"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface QuickResult {
  type: "school" | "player";
  name: string;
  detail: string;
  href: string;
}

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuickResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          const items: QuickResult[] = (data.data?.results || []).slice(0, 6).map((r: Record<string, string>) => ({
            type: r.entity_type === "school" ? "school" : "player",
            name: r.display_name,
            detail: r.context || "",
            href: r.url_path || "/search?q=" + encodeURIComponent(query),
          }));
          setResults(items);
          setIsOpen(items.length > 0);
          setSelectedIndex(-1);
        }
      } catch {
        // Silently fail — user can still press Enter
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      router.push(results[selectedIndex].href);
    } else if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search players, schools, coaches..."
            className="w-full pl-12 pr-4 py-3.5 md:py-4 rounded-xl text-base bg-white/95 text-gray-900 placeholder-gray-500 border-2 border-transparent focus:border-[var(--psp-gold)] focus:outline-none shadow-lg backdrop-blur-sm transition"
            autoComplete="off"
            aria-label="Search players, schools, and coaches"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--psp-gold)] rounded-full animate-spin" />
            </div>
          )}
        </div>
      </form>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          role="listbox"
        >
          {results.map((r, i) => (
            <button
              key={`${r.type}-${r.name}-${i}`}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition ${
                i === selectedIndex ? "bg-gray-100" : ""
              }`}
              onClick={() => {
                router.push(r.href);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={i === selectedIndex}
            >
              <span className="text-lg shrink-0">
                {r.type === "school" ? "\uD83C\uDFEB" : "\uD83C\uDFC3"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                {r.detail && (
                  <p className="text-xs text-gray-500 truncate">{r.detail}</p>
                )}
              </div>
              <span className="text-[10px] font-medium text-gray-400 uppercase shrink-0">
                {r.type}
              </span>
            </button>
          ))}
          <button
            className="w-full px-4 py-2.5 text-sm text-center font-medium text-[var(--psp-gold)] bg-gray-50 hover:bg-gray-100 transition border-t border-gray-200"
            onClick={() => {
              router.push(`/search?q=${encodeURIComponent(query)}`);
              setIsOpen(false);
            }}
          >
            View all results for &ldquo;{query}&rdquo;
          </button>
        </div>
      )}
    </div>
  );
}
