"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ── Types ── */

export interface CoachEntry {
  id: number;
  name: string;
  slug: string;
  school_name: string;
  school_slug: string;
  school_colors: Record<string, string> | null;
  league_id: string | null;
  league_name: string | null;
  sport_id: string;
  sport_name: string;
  start_year: number;
  end_year: number | null;
  role: string;
  record_wins: number;
  record_losses: number;
  record_ties: number;
  championships: number;
}

/* ── Constants ── */

const SPORT_EMOJI: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  "track-field": "🏃",
  lacrosse: "🥍",
  wrestling: "🤼",
  soccer: "⚽",
};

const LEAGUE_SHORT: Record<string, string> = {
  "Philadelphia Catholic League": "Catholic League",
  "Philadelphia Public League": "Public League",
  "Inter-Academic League": "Inter-Ac League",
};

const LEAGUE_ORDER = [
  "Philadelphia Catholic League",
  "Philadelphia Public League",
  "Inter-Academic League",
  "__other__",
];

/* ── Component ── */

export default function CoachesDirectory({ coaches }: { coaches: CoachEntry[] }) {
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique sports from data
  const sports = useMemo(() => {
    const set = new Set(coaches.map((c) => c.sport_id));
    return Array.from(set).sort();
  }, [coaches]);

  // Filter
  const filtered = useMemo(() => {
    let result = coaches;
    if (sportFilter !== "all") {
      result = result.filter((c) => c.sport_id === sportFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.school_name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [coaches, sportFilter, searchQuery]);

  // Group by league
  const grouped = useMemo(() => {
    const groups: Record<string, CoachEntry[]> = {};
    for (const c of filtered) {
      const key = c.league_name ?? "__other__";
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    }
    // Sort within each group by school name then coach name
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.school_name.localeCompare(b.school_name) || a.name.localeCompare(b.name));
    }
    return groups;
  }, [filtered]);

  // Ordered league keys
  const orderedKeys = useMemo(() => {
    return LEAGUE_ORDER.filter((k) => {
      if (k === "__other__") return !!grouped["__other__"];
      return !!grouped[k];
    });
  }, [grouped]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by coach name or school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>

        {/* Sport filter pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSportFilter("all")}
            className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${
              sportFilter === "all"
                ? "bg-navy text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Sports
          </button>
          {sports.map((s) => (
            <button
              key={s}
              onClick={() => setSportFilter(s)}
              className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${
                sportFilter === s
                  ? "bg-navy text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {SPORT_EMOJI[s] || ""} {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " & ")}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Showing {filtered.length} {filtered.length === 1 ? "coach" : "coaches"}
        {sportFilter !== "all" && (
          <span>
            {" "}in{" "}
            <span className="font-medium text-navy">
              {sportFilter.charAt(0).toUpperCase() + sportFilter.slice(1).replace("-", " & ")}
            </span>
          </span>
        )}
      </p>

      {/* League sections */}
      {orderedKeys.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-3xl mb-3">📋</p>
          <p className="text-gray-700 font-medium">No coaches found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or sport filter.</p>
        </div>
      ) : (
        orderedKeys.map((leagueKey) => {
          const leagueCoaches = grouped[leagueKey] || [];
          const displayName =
            leagueKey === "__other__"
              ? "Other / Independent"
              : LEAGUE_SHORT[leagueKey] || leagueKey;

          return (
            <section key={leagueKey}>
              {/* League header */}
              <div className="flex items-center gap-3 mb-3">
                <h2 className="psp-h3 text-navy">{displayName}</h2>
                <span className="text-xs text-gray-400 font-medium">
                  {leagueCoaches.length} {leagueCoaches.length === 1 ? "coach" : "coaches"}
                </span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* Coach cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {leagueCoaches.map((coach) => {
                  const primary = coach.school_colors?.primary || "#0a1628";
                  const sportSlug = coach.sport_id;
                  const emoji = SPORT_EMOJI[sportSlug] || "📋";
                  const yearRange = coach.end_year
                    ? `${coach.start_year}–${coach.end_year}`
                    : `${coach.start_year}–present`;

                  return (
                    <Link
                      key={coach.id}
                      href={`/${sportSlug}/coaches/${coach.slug}`}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-gold/40 transition group"
                    >
                      {/* Color accent bar */}
                      <div className="h-1.5" style={{ backgroundColor: primary }} />

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-navy group-hover:text-gold transition-colors truncate">
                              {coach.name}
                            </h3>
                            <Link
                              href={`/${sportSlug}/schools/${coach.school_slug}`}
                              className="text-xs text-gray-500 hover:text-blue-600 truncate block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {coach.school_name}
                            </Link>
                          </div>
                          <span className="text-lg ml-2 flex-shrink-0">{emoji}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy/10 text-navy font-medium">
                            {coach.role}
                          </span>
                          <span className="text-[10px] text-gray-400">{yearRange}</span>
                        </div>

                        {(coach.record_wins > 0 || coach.championships > 0) && (
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                            {coach.record_wins > 0 && (
                              <div>
                                <span className="text-xs font-bold text-navy">
                                  {coach.record_wins}-{coach.record_losses}
                                  {coach.record_ties > 0 ? `-${coach.record_ties}` : ""}
                                </span>
                                <span className="text-[10px] text-gray-400 ml-1">Record</span>
                              </div>
                            )}
                            {coach.championships > 0 && (
                              <div>
                                <span className="text-xs font-bold text-gold">
                                  {coach.championships}
                                </span>
                                <span className="text-[10px] text-gray-400 ml-1">
                                  {coach.championships === 1 ? "Title" : "Titles"}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
