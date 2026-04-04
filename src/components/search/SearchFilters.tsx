"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const SPORTS = [
  { id: "football", name: "Football" },
  { id: "basketball", name: "Basketball" },
  { id: "baseball", name: "Baseball" },
  { id: "track-field", name: "Track & Field" },
  { id: "lacrosse", name: "Lacrosse" },
  { id: "wrestling", name: "Wrestling" },
  { id: "soccer", name: "Soccer" },
];

const LEAGUES = [
  { id: "catholic", name: "Catholic League" },
  { id: "public", name: "Public League" },
  { id: "inter-ac", name: "Inter-Ac" },
  { id: "independent", name: "Independent" },
];

const ERAS = [
  { id: "2020s", name: "2020s" },
  { id: "2010s", name: "2010s" },
  { id: "2000s", name: "2000s" },
  { id: "1990s", name: "1990s" },
  { id: "earlier", name: "Earlier" },
];

const POSITIONS: Record<string, string[]> = {
  football: ["QB", "RB", "WR", "TE", "OL", "DE", "LB", "DB", "K"],
  basketball: ["PG", "SG", "SF", "PF", "C"],
  baseball: ["P", "C", "IF", "OF"],
};

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [sport, setSport] = useState(searchParams.get("sport") || "");
  const [league, setLeague] = useState(searchParams.get("league") || "");
  const [era, setEra] = useState(searchParams.get("era") || "");
  const [position, setPosition] = useState(searchParams.get("position") || "");

  const positions = sport ? POSITIONS[sport] || [] : [];
  const activeCount = [sport, league, era, position].filter(Boolean).length;

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    sport ? params.set("sport", sport) : params.delete("sport");
    league ? params.set("league", league) : params.delete("league");
    era ? params.set("era", era) : params.delete("era");
    sport && position ? params.set("position", position) : params.delete("position");
    router.push(`/search?${params.toString()}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSport("");
    setLeague("");
    setEra("");
    setPosition("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sport");
    params.delete("league");
    params.delete("era");
    params.delete("position");
    router.push(`/search?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      {/* Toggle row */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
          style={{
            borderColor: activeCount ? "var(--psp-gold)" : "var(--psp-gray-200)",
            color: activeCount ? "var(--psp-gold)" : "var(--psp-gray-600)",
            background: activeCount ? "rgba(240,165,0,0.06)" : "transparent",
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && (
            <span
              className="ml-0.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
              style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
            >
              {activeCount}
            </span>
          )}
        </button>

        {/* Active filter pills summary */}
        {activeCount > 0 && !isOpen && (
          <>
            {sport && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {SPORTS.find((s) => s.id === sport)?.name}
              </span>
            )}
            {league && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {LEAGUES.find((l) => l.id === league)?.name}
              </span>
            )}
            {era && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {era}
              </span>
            )}
            <button
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear all filters"
            >
              <X size={14} />
            </button>
          </>
        )}
      </div>

      {/* Expanded filters */}
      {isOpen && (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Sport
            </label>
            <select
              value={sport}
              onChange={(e) => { setSport(e.target.value); setPosition(""); }}
              className="px-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]/30 focus:border-[var(--psp-gold)]"
            >
              <option value="">All Sports</option>
              {SPORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              League
            </label>
            <select
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              className="px-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]/30 focus:border-[var(--psp-gold)]"
            >
              <option value="">All Leagues</option>
              {LEAGUES.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Era
            </label>
            <select
              value={era}
              onChange={(e) => setEra(e.target.value)}
              className="px-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]/30 focus:border-[var(--psp-gold)]"
            >
              <option value="">All Eras</option>
              {ERAS.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {positions.length > 0 && (
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="px-3 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]/30 focus:border-[var(--psp-gold)]"
              >
                <option value="">All Positions</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
            style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
          >
            Apply
          </button>

          {activeCount > 0 && (
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
