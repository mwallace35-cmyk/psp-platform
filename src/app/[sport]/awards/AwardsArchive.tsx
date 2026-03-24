"use client";

import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import type { AwardRecord } from "@/lib/data";

interface TabData {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  count: number;
  awards: AwardRecord[];
}

interface AwardsArchiveProps {
  tabs: TabData[];
  sport: string;
}

// ─── Cleaner category labels ────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, { label: string; shortLabel: string; emoji: string }> = {
  "all-city":      { label: "All-City",           shortLabel: "All-City",  emoji: "🏅" },
  "all-catholic":  { label: "All-Catholic League", shortLabel: "Catholic",  emoji: "✝️" },
  "all-public":    { label: "All-Public League",   shortLabel: "Public",    emoji: "🏫" },
  "all-inter-ac":  { label: "All-Inter-Ac League", shortLabel: "Inter-Ac",  emoji: "🎓" },
  "all-state":     { label: "All-State (PA)",      shortLabel: "All-State", emoji: "⭐" },
  "poty":          { label: "Player of the Year",  shortLabel: "POTY",      emoji: "👑" },
  "all-era":       { label: "All-Decade Teams",    shortLabel: "Decades",   emoji: "📜" },
  "stat-leaders":  { label: "Leaders & All-League", shortLabel: "Leaders",  emoji: "📊" },
};

// ─── Tier badges ────────────────────────────────────────────────────────────
const TIER_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  "First Team":       { label: "1ST TEAM",     bg: "bg-[#f0a500]/15", text: "text-[#f0a500]", border: "border-[#f0a500]/30" },
  "Second Team":      { label: "2ND TEAM",     bg: "bg-blue-500/15",  text: "text-blue-400",  border: "border-blue-500/30" },
  "Third Team":       { label: "3RD TEAM",     bg: "bg-gray-500/15",  text: "text-gray-400",  border: "border-gray-500/30" },
  "Honorable Mention": { label: "HON. MENTION", bg: "bg-gray-600/15",  text: "text-gray-500",  border: "border-gray-600/30" },
};

function TierBadge({ tier }: { tier: string }) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG["Honorable Mention"];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
}

function PositionPill({ position }: { position: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-gray-400 bg-gray-700/50 rounded">
      {position}
    </span>
  );
}

function PlayerRow({ award, sport }: { award: AwardRecord; sport: string }) {
  const hasLink = !!award.players?.slug;
  const name = award.displayName;
  const school = award.school;
  const position = award.position;
  const isNameMissing = name === "Name Not Available";

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/5 transition-colors">
      {position && <PositionPill position={position} />}
      <div className="flex-1 min-w-0">
        {hasLink ? (
          <Link
            href={`/${sport}/players/${award.players!.slug}`}
            className="text-blue-400 hover:text-blue-300 font-medium text-sm truncate block"
          >
            {name}
          </Link>
        ) : (
          <span className={`font-medium text-sm truncate block ${isNameMissing ? "text-gray-500 italic" : "text-gray-200"}`}>
            {name}
          </span>
        )}
      </div>
      {school && (
        <Link
          href={`/${sport}/schools/${school.slug}`}
          className="text-gray-500 hover:text-gray-400 text-xs truncate max-w-[140px] hidden sm:block"
        >
          {school.name}
        </Link>
      )}
    </div>
  );
}

function TierSection({ tier, awards, sport }: { tier: string | null; awards: AwardRecord[]; sport: string }) {
  return (
    <div className="mt-3">
      {tier && (
        <div className="flex items-center gap-2 mb-2">
          <TierBadge tier={tier} />
          <div className="flex-1 h-px bg-gray-700/50" />
          <span className="text-gray-600 text-xs">{awards.length}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {awards.map((award) => (
          <PlayerRow key={award.id} award={award} sport={sport} />
        ))}
      </div>
    </div>
  );
}

// ─── Source label + badge helpers ────────────────────────────────────────────

function getSourceLabel(award: AwardRecord, sport: string): string {
  const name = award.award_name || "";
  const isTierOnly =
    /^(all-city|all-public|all-catholic|all-inter-ac|all-scholastic|all-state)\s*(first|second|third)\s*team$/i.test(name) ||
    /^(all-scholastic)\s+(first|second)\s+team$/i.test(name);

  const baseballYearMatch = name.match(/^(.+?)\s+(First|Second|Third)\s+Team\s+\d{4}$/i);
  if (baseballYearMatch) return baseballYearMatch[1];

  if (name && !isTierOnly) {
    const cleaned = name
      .replace(/\s+(Basketball|Football|Baseball|Soccer|Lacrosse|Wrestling|Track)\s+(First|Second|Third)\s+Team$/i, "")
      .replace(/\s+(First|Second|Third)\s+Team$/i, "")
      .trim();
    if (cleaned && cleaned.length > 3) return cleaned;
  }

  if (award.source && award.source !== "Archive" && award.source !== "tedsilary.com") {
    return award.source;
  }

  return "";
}

const SOURCE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Daily News":          { bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/20" },
  "Philadelphia Bulletin": { bg: "bg-amber-500/10", text: "text-amber-400",  border: "border-amber-500/20" },
  "Coaches":             { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20" },
  "Ted Silary":          { bg: "bg-purple-500/10",  text: "text-purple-400", border: "border-purple-500/20" },
};

function getSourceColors(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("daily news")) return SOURCE_COLORS["Daily News"];
  if (lower.includes("bulletin")) return SOURCE_COLORS["Philadelphia Bulletin"];
  if (lower.includes("coaches")) return SOURCE_COLORS["Coaches"];
  if (lower.includes("ted silary") || lower.includes("40-year") || lower.includes("30-year")) return SOURCE_COLORS["Ted Silary"];
  return { bg: "bg-gray-600/10", text: "text-gray-400", border: "border-gray-600/20" };
}

function SourceBadge({ label }: { label: string }) {
  const colors = getSourceColors(label);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wide rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
      {label}
    </span>
  );
}

const AWARD_TYPE_LABELS: Record<string, string> = {
  "all-city": "All-City",
  "all-scholastic": "All-Scholastic",
  "all-state": "All-State",
  "all-catholic": "All-Catholic",
  "all-public": "All-Public",
  "all-inter-ac": "All-Inter-Ac",
  "all-decade": "All-Decade",
  "all-era": "All-Era",
  "all-league": "All-League",
  "coaches-all-league": "Coaches All-League",
  "stat-leader": "Stat Leader",
  "player-of-year": "Player of the Year",
};

function stripSportPrefix(awardType: string, sport: string): string {
  const prefix = `${sport}-`;
  return awardType.startsWith(prefix) ? awardType.slice(prefix.length) : awardType;
}

function groupByTier(awards: AwardRecord[]) {
  const tierOrder = ["First Team", "Second Team", "Third Team", "Honorable Mention"];
  const groups: Record<string, AwardRecord[]> = {};
  const noTier: AwardRecord[] = [];

  for (const award of awards) {
    if (award.award_tier) {
      if (!groups[award.award_tier]) groups[award.award_tier] = [];
      groups[award.award_tier].push(award);
    } else {
      noTier.push(award);
    }
  }

  const result: { tier: string | null; awards: AwardRecord[] }[] = [];
  for (const tier of tierOrder) {
    if (groups[tier]?.length) result.push({ tier, awards: groups[tier] });
  }
  if (noTier.length) result.push({ tier: null, awards: noTier });
  return result;
}

function groupBySource(awards: AwardRecord[], sport: string) {
  const groups: Record<string, { label: string; awards: AwardRecord[] }> = {};

  for (const award of awards) {
    const sourceLabel = getSourceLabel(award, sport);
    const normalizedType = stripSportPrefix(award.award_type, sport);
    const key = sourceLabel || normalizedType;
    const displayLabel = sourceLabel || (AWARD_TYPE_LABELS[normalizedType] || normalizedType);

    if (!groups[key]) {
      groups[key] = { label: displayLabel, awards: [] };
    }
    groups[key].awards.push(award);
  }

  return Object.values(groups).sort((a, b) => a.label.localeCompare(b.label));
}

// ─── Year dropdown component ────────────────────────────────────────────────

function YearDropdown({
  years,
  selectedYear,
  onSelect,
}: {
  years: { label: string; yearStart: number }[];
  selectedYear: number | null;
  onSelect: (year: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = selectedYear
    ? years.find((y) => y.yearStart === selectedYear)?.label || selectedYear.toString()
    : "Jump to Year";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 flex items-center gap-1.5"
      >
        <span>📅</span>
        <span>{selectedLabel}</span>
        <span className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto w-40">
          <button
            onClick={() => { onSelect(null); setOpen(false); }}
            className={`block w-full text-left px-3 py-1.5 text-sm transition-colors ${
              selectedYear === null ? "text-[#f0a500] font-semibold bg-[#f0a500]/10" : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            All Years
          </button>
          <div className="border-t border-gray-700" />
          {years.map((y) => (
            <button
              key={y.yearStart}
              onClick={() => { onSelect(y.yearStart); setOpen(false); }}
              className={`block w-full text-left px-3 py-1.5 text-sm transition-colors ${
                selectedYear === y.yearStart ? "text-[#f0a500] font-semibold bg-[#f0a500]/10" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {y.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Category badge for within-year grouping ────────────────────────────────

function CategoryBadge({ tabId }: { tabId: string }) {
  const info = CATEGORY_LABELS[tabId];
  if (!info) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-wide rounded bg-white/5 text-gray-300 border border-gray-600/40">
      <span>{info.emoji}</span> {info.shortLabel}
    </span>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function AwardsArchive({ tabs, sport }: AwardsArchiveProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Merge all awards across tabs, or filter to one category
  const allAwards = useMemo(() => {
    if (selectedCategory) {
      const tab = tabs.find((t) => t.id === selectedCategory);
      return tab?.awards || [];
    }
    // All categories — combine and dedupe by id
    const seen = new Set<number>();
    const combined: AwardRecord[] = [];
    for (const tab of tabs) {
      for (const award of tab.awards) {
        if (!seen.has(award.id)) {
          seen.add(award.id);
          combined.push(award);
        }
      }
    }
    return combined;
  }, [tabs, selectedCategory]);

  // Build award-to-tab mapping for category badges
  const awardTabMap = useMemo(() => {
    const map: Record<number, string> = {};
    for (const tab of tabs) {
      for (const award of tab.awards) {
        map[award.id] = tab.id;
      }
    }
    return map;
  }, [tabs]);

  // Group by year (+ collect undated awards)
  const { yearGroups, undatedAwards } = useMemo(() => {
    const byYear: Record<string, { label: string; yearStart: number; awards: AwardRecord[] }> = {};
    const undated: AwardRecord[] = [];
    for (const award of allAwards) {
      const season = award.seasons;
      if (!season?.year_start) {
        undated.push(award);
        continue;
      }
      const yearKey = season.year_start.toString();
      if (!byYear[yearKey]) {
        byYear[yearKey] = { label: season.label || yearKey, yearStart: season.year_start, awards: [] };
      }
      byYear[yearKey].awards.push(award);
    }
    const sorted = Object.values(byYear).sort((a, b) => b.yearStart - a.yearStart);
    return {
      yearGroups: sortOrder === "asc" ? [...sorted].reverse() : sorted,
      undatedAwards: undated,
    };
  }, [allAwards, sortOrder]);

  // Year list for dropdown (always desc for the picker)
  const yearList = useMemo(() => {
    const byYear: Record<string, { label: string; yearStart: number }> = {};
    for (const award of allAwards) {
      const season = award.seasons;
      if (!season?.year_start) continue;
      const yearKey = season.year_start.toString();
      if (!byYear[yearKey]) {
        byYear[yearKey] = { label: season.label || yearKey, yearStart: season.year_start };
      }
    }
    return Object.values(byYear).sort((a, b) => b.yearStart - a.yearStart);
  }, [allAwards]);

  // Filter to selected year
  const filteredYears = useMemo(() => {
    if (selectedYear === null) return yearGroups;
    return yearGroups.filter((y) => y.yearStart === selectedYear);
  }, [yearGroups, selectedYear]);

  // Decade pills
  const decades = useMemo(() => {
    const validYears = yearGroups.filter((y) => y.yearStart >= 1900);
    if (validYears.length === 0) return [];
    const minYear = Math.min(...validYears.map((y) => y.yearStart));
    const maxYear = Math.max(...validYears.map((y) => y.yearStart));
    const list: { decade: string; start: number; end: number }[] = [];
    for (let d = Math.floor(minYear / 10) * 10; d <= maxYear; d += 10) {
      list.push({ decade: `${d}s`, start: d, end: d + 9 });
    }
    return list.reverse();
  }, [yearGroups]);

  // Decade filter
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);

  const displayedYears = useMemo(() => {
    let years = filteredYears;
    if (selectedDecade && selectedYear === null) {
      const [start, end] = selectedDecade.split("-").map(Number);
      years = years.filter((y) => y.yearStart >= start && y.yearStart <= end);
    }
    return years;
  }, [filteredYears, selectedDecade, selectedYear]);

  // Total count for the current filter
  const totalFiltered = useMemo(
    () => displayedYears.reduce((sum, y) => sum + y.awards.length, 0) + (selectedYear === null && selectedDecade === null ? undatedAwards.length : 0),
    [displayedYears, undatedAwards, selectedYear, selectedDecade]
  );

  // Determine which categories are present in a given year's awards (for badges)
  function getCategoriesInYear(awards: AwardRecord[]) {
    const cats = new Set<string>();
    for (const a of awards) {
      const tabId = awardTabMap[a.id];
      if (tabId) cats.add(tabId);
    }
    return Array.from(cats);
  }

  return (
    <div>
      {/* Category Filter Bar */}
      <div className="mb-5">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => { setSelectedCategory(null); setSelectedYear(null); setSelectedDecade(null); }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              selectedCategory === null
                ? "bg-[#f0a500] text-[#0a1628] shadow-lg shadow-[#f0a500]/20"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            All Categories
            <span className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
              selectedCategory === null ? "bg-[#0a1628]/20 text-[#0a1628]" : "bg-gray-700 text-gray-400"
            }`}>
              {tabs.reduce((s, t) => s + t.count, 0).toLocaleString()}
            </span>
          </button>
          {tabs.map((tab) => {
            const info = CATEGORY_LABELS[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => { setSelectedCategory(tab.id); setSelectedYear(null); setSelectedDecade(null); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? "bg-[#f0a500] text-[#0a1628] shadow-lg shadow-[#f0a500]/20"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                {info && <span className="hidden sm:inline">{info.emoji}</span>}
                <span className="hidden sm:inline">{info?.label || tab.label}</span>
                <span className="sm:hidden">{info?.shortLabel || tab.shortLabel}</span>
                <span className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  selectedCategory === tab.id ? "bg-[#0a1628]/20 text-[#0a1628]" : "bg-gray-700 text-gray-400"
                }`}>
                  {tab.count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Year Controls: Sort + Jump-to-Year dropdown + Decade pills */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {/* Sort Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 flex items-center gap-1.5"
          title={sortOrder === "desc" ? "Showing newest first" : "Showing oldest first"}
        >
          {sortOrder === "desc" ? "↓ Newest First" : "↑ Oldest First"}
        </button>

        {/* Year Dropdown */}
        {yearList.length > 0 && (
          <YearDropdown years={yearList} selectedYear={selectedYear} onSelect={(y) => { setSelectedYear(y); if (y !== null) setSelectedDecade(null); }} />
        )}

        {/* Divider */}
        {decades.length > 1 && <span className="w-px h-5 bg-gray-600 mx-0.5" aria-hidden="true" />}

        {/* Decade pills (hidden when a specific year is selected) */}
        {decades.length > 1 && selectedYear === null && (
          <>
            <button
              onClick={() => setSelectedDecade(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedDecade === null ? "bg-[#f0a500] text-[#0a1628]" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              All
            </button>
            {decades.map((d) => {
              const count = yearGroups.filter((y) => y.yearStart >= d.start && y.yearStart <= d.end).length;
              if (count === 0) return null;
              return (
                <button
                  key={d.decade}
                  onClick={() => setSelectedDecade(`${d.start}-${d.end}`)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedDecade === `${d.start}-${d.end}` ? "bg-[#f0a500] text-[#0a1628]" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {d.decade}
                </button>
              );
            })}
          </>
        )}

        {/* Results count */}
        <span className="text-gray-500 text-xs ml-auto">
          {totalFiltered.toLocaleString()} awards across {displayedYears.length} {displayedYears.length === 1 ? "year" : "years"}
        </span>
      </div>

      {/* Year Cards */}
      <div className="space-y-3">
        {displayedYears.map((yearData) => {
          const sourceGroups = groupBySource(yearData.awards, sport);
          const hasMultipleSources = sourceGroups.length > 1;
          const catsInYear = selectedCategory === null ? getCategoriesInYear(yearData.awards) : [];

          return (
            <details
              key={yearData.label}
              className="group bg-gray-800/80 border border-gray-700/60 rounded-lg overflow-hidden"
              open={selectedYear !== null}
            >
              <summary className="cursor-pointer px-4 py-3 flex items-center justify-between hover:bg-gray-750/50 transition-all">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="psp-h3 text-white">{yearData.label}</h3>
                  <span className="text-gray-500 text-xs font-medium">
                    {yearData.awards.length} {yearData.awards.length === 1 ? "award" : "awards"}
                  </span>
                  {/* Show category badges when viewing all categories */}
                  {catsInYear.length > 0 && (
                    <span className="hidden sm:flex items-center gap-1">
                      {catsInYear.map((catId) => (
                        <CategoryBadge key={catId} tabId={catId} />
                      ))}
                    </span>
                  )}
                </div>
                <span className="text-[#f0a500] text-sm group-open:rotate-180 transition-transform duration-200">▼</span>
              </summary>

              <div className="border-t border-gray-700/50 bg-[#0a1628]/40">
                {hasMultipleSources ? (
                  sourceGroups.map((sg) => {
                    const tierGroups = groupByTier(sg.awards);
                    return (
                      <div key={sg.label} className="border-b border-gray-700/30 last:border-b-0">
                        <div className="px-4 py-2 bg-gray-800/40 flex items-center gap-2">
                          <SourceBadge label={sg.label} />
                          <span className="text-gray-600 text-[10px]">
                            {sg.awards.length} {sg.awards.length === 1 ? "selection" : "selections"}
                          </span>
                        </div>
                        <div className="px-4 pb-4">
                          {tierGroups.map(({ tier, awards: tierAwards }, idx) => (
                            <TierSection key={tier || `ungrouped-${idx}`} tier={tier} awards={tierAwards} sport={sport} />
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    {sourceGroups[0]?.label && sourceGroups[0].label !== "" && (
                      <div className="px-4 py-1.5">
                        <SourceBadge label={sourceGroups[0].label} />
                      </div>
                    )}
                    <div className="px-4 pb-4">
                      {groupByTier(yearData.awards).map(({ tier, awards: tierAwards }, idx) => (
                        <TierSection key={tier || `ungrouped-${idx}`} tier={tier} awards={tierAwards} sport={sport} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </details>
          );
        })}
      </div>

      {/* Undated Awards (All-Decade, All-Era, etc.) */}
      {undatedAwards.length > 0 && selectedYear === null && selectedDecade === null && (
        <details className="group bg-gray-800/80 border border-gray-700/60 rounded-lg overflow-hidden">
          <summary className="cursor-pointer px-4 py-3 flex items-center justify-between hover:bg-gray-750/50 transition-all">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="psp-h3 text-white">📜 All-Time / Multi-Era Selections</h3>
              <span className="text-gray-500 text-xs font-medium">
                {undatedAwards.length} {undatedAwards.length === 1 ? "award" : "awards"}
              </span>
            </div>
            <span className="text-[#f0a500] text-sm group-open:rotate-180 transition-transform duration-200">▼</span>
          </summary>
          <div className="border-t border-gray-700/50 bg-[#0a1628]/40">
            {(() => {
              const sourceGroups = groupBySource(undatedAwards, sport);
              return sourceGroups.map((sg) => {
                const tierGroups = groupByTier(sg.awards);
                return (
                  <div key={sg.label} className="border-b border-gray-700/30 last:border-b-0">
                    <div className="px-4 py-2 bg-gray-800/40 flex items-center gap-2">
                      <SourceBadge label={sg.label} />
                      <span className="text-gray-600 text-[10px]">
                        {sg.awards.length} {sg.awards.length === 1 ? "selection" : "selections"}
                      </span>
                    </div>
                    <div className="px-4 pb-4">
                      {tierGroups.map(({ tier, awards: tierAwards }, idx) => (
                        <TierSection key={tier || `ungrouped-${idx}`} tier={tier} awards={tierAwards} sport={sport} />
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </details>
      )}

      {displayedYears.length === 0 && undatedAwards.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-300">
            No awards found for this selection.
          </p>
          <button
            onClick={() => { setSelectedCategory(null); setSelectedYear(null); setSelectedDecade(null); }}
            className="mt-3 text-[#f0a500] hover:underline text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
