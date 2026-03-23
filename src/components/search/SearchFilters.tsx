"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface SearchFiltersProps {
  onFiltersChange?: () => void;
}

const SPORTS = [
  { id: "football", name: "Football", emoji: "🏈" },
  { id: "basketball", name: "Basketball", emoji: "🏀" },
  { id: "baseball", name: "Baseball", emoji: "⚾" },
  { id: "track-field", name: "Track & Field", emoji: "🏃" },
  { id: "lacrosse", name: "Lacrosse", emoji: "🥍" },
  { id: "wrestling", name: "Wrestling", emoji: "🤼" },
  { id: "soccer", name: "Soccer", emoji: "⚽" },
];

const ENTITY_TYPES = [
  { id: "player", name: "Players", icon: "👤" },
  { id: "school", name: "Schools", icon: "🏫" },
  { id: "coach", name: "Coaches", icon: "🧑‍🏫" },
];

const LEAGUES = [
  { id: "catholic", name: "Catholic League" },
  { id: "public", name: "Public League" },
  { id: "inter-ac", name: "Inter-Ac" },
  { id: "independent", name: "Independent" },
];

const ERAS = [
  { id: "2020s", name: "2020s", range: "2020-2029" },
  { id: "2010s", name: "2010s", range: "2010-2019" },
  { id: "2000s", name: "2000s", range: "2000-2009" },
  { id: "1990s", name: "1990s", range: "1990-1999" },
  { id: "earlier", name: "Earlier", range: "Before 1990" },
];

const FOOTBALL_POSITIONS = [
  "QB",
  "RB",
  "WR",
  "TE",
  "OL",
  "DE",
  "LB",
  "DB",
  "K",
];

const BASKETBALL_POSITIONS = ["PG", "SG", "SF", "PF", "C"];

const BASEBALL_POSITIONS = ["P", "C", "IF", "OF"];

export default function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [sport, setSport] = useState(searchParams.get("sport") || "");
  const [entityType, setEntityType] = useState(searchParams.get("type") || "");
  const [league, setLeague] = useState(searchParams.get("league") || "");
  const [era, setEra] = useState(searchParams.get("era") || "");
  const [position, setPosition] = useState(searchParams.get("position") || "");

  const getPositions = () => {
    if (sport === "football") return FOOTBALL_POSITIONS;
    if (sport === "basketball") return BASKETBALL_POSITIONS;
    if (sport === "baseball") return BASEBALL_POSITIONS;
    return [];
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);

    if (sport) params.set("sport", sport);
    else params.delete("sport");

    if (entityType) params.set("type", entityType);
    else params.delete("type");

    if (league) params.set("league", league);
    else params.delete("league");

    if (era) params.set("era", era);
    else params.delete("era");

    if (position && sport) params.set("position", position);
    else params.delete("position");

    const query = params.toString();
    router.push(`/search?${query}`);
    setIsOpen(false);
    onFiltersChange?.();
  };

  const handleClearFilters = () => {
    setSport("");
    setEntityType("");
    setLeague("");
    setEra("");
    setPosition("");
    router.push("/search");
    setIsOpen(false);
    onFiltersChange?.();
  };

  const hasActiveFilters =
    sport || entityType || league || era || position;

  const positions = getPositions();

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Mobile Toggle Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
          >
            <span>🔍 Filters {hasActiveFilters && `(${[sport, entityType, league, era, position].filter(Boolean).length})`}</span>
            <span>{isOpen ? "▼" : "▶"}</span>
          </button>
        </div>

        {/* Desktop & Expanded Mobile Filters */}
        <div
          className={`grid grid-cols-1 md:grid-cols-5 gap-4 ${
            !isOpen && "hidden md:grid"
          }`}
        >
          {/* Sport Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Sport
            </label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]"
            >
              <option value="">All Sports</option>
              {SPORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Entity Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Type
            </label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]"
            >
              <option value="">All Types</option>
              {ENTITY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* League Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              League
            </label>
            <select
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]"
            >
              <option value="">All Leagues</option>
              {LEAGUES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Era Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Era
            </label>
            <select
              value={era}
              onChange={(e) => setEra(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)]"
            >
              <option value="">All Eras</option>
              {ERAS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.range})
                </option>
              ))}
            </select>
          </div>

          {/* Position Filter (conditional) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              {sport ? "Position" : "Position"}
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={!sport}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--psp-gold)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {sport ? "All Positions" : "Select Sport First"}
              </option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`mt-4 flex gap-2 ${!isOpen && "hidden md:flex"}`}>
          <button
            onClick={handleApplyFilters}
            className="flex-1 md:flex-none px-6 py-2 bg-[var(--psp-gold)] text-[var(--psp-navy)] font-medium text-sm rounded-lg hover:bg-opacity-90 transition"
          >
            Apply Filters
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex-1 md:flex-none px-6 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
