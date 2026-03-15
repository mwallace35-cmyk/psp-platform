"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
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

/** Tier badge colors and labels */
const TIER_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  "First Team": { label: "1ST TEAM", bg: "bg-[#f0a500]/15", text: "text-[#f0a500]", border: "border-[#f0a500]/30" },
  "Second Team": { label: "2ND TEAM", bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  "Third Team": { label: "3RD TEAM", bg: "bg-gray-500/15", text: "text-gray-400", border: "border-gray-500/30" },
  "Honorable Mention": { label: "HON. MENTION", bg: "bg-gray-600/15", text: "text-gray-500", border: "border-gray-600/30" },
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

/** Section for a single tier (First Team, Second Team, etc.) */
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

/** Award type labels for sub-headers within a year */
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

/** Normalize an award_type by stripping sport prefix */
function stripSportPrefix(awardType: string, sport: string): string {
  const prefix = `${sport}-`;
  return awardType.startsWith(prefix) ? awardType.slice(prefix.length) : awardType;
}

/** Group awards by year, sorted descending */
function groupByYear(awards: AwardRecord[]) {
  const byYear: Record<string, { label: string; yearStart: number; awards: AwardRecord[] }> = {};
  for (const award of awards) {
    const season = award.seasons;
    if (!season?.year_start) continue;
    const yearKey = season.year_start.toString();
    if (!byYear[yearKey]) {
      byYear[yearKey] = {
        label: season.label || yearKey,
        yearStart: season.year_start,
        awards: [],
      };
    }
    byYear[yearKey].awards.push(award);
  }
  return Object.values(byYear).sort((a, b) => b.yearStart - a.yearStart);
}

/** Group awards by tier within a section */
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
    if (groups[tier]?.length) {
      result.push({ tier, awards: groups[tier] });
    }
  }
  if (noTier.length) {
    result.push({ tier: null, awards: noTier });
  }
  return result;
}

/** Group awards by their award_type (for mixed types in one year) */
function groupByAwardType(awards: AwardRecord[], sport: string) {
  const groups: Record<string, AwardRecord[]> = {};
  for (const award of awards) {
    const key = stripSportPrefix(award.award_type, sport);
    if (!groups[key]) groups[key] = [];
    groups[key].push(award);
  }
  return groups;
}

export default function AwardsArchive({ tabs, sport }: AwardsArchiveProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);

  const currentTab = tabs.find((t) => t.id === activeTab);
  const awards = currentTab?.awards || [];

  // Group awards by year
  const yearGroups = useMemo(() => groupByYear(awards), [awards]);

  // Generate decade options
  const decades = useMemo(() => {
    const validYears = yearGroups.filter((y) => y.yearStart >= 1900);
    if (validYears.length === 0) return [];
    const minYear = Math.min(...validYears.map((y) => y.yearStart));
    const maxYear = Math.max(...validYears.map((y) => y.yearStart));

    const decadeList: { decade: string; start: number; end: number }[] = [];
    for (let d = Math.floor(minYear / 10) * 10; d <= maxYear; d += 10) {
      decadeList.push({ decade: `${d}s`, start: d, end: d + 9 });
    }
    return decadeList.reverse();
  }, [yearGroups]);

  // Filter years by decade
  const filteredYears = useMemo(() => {
    if (!selectedDecade) return yearGroups;
    const [start, end] = selectedDecade.split("-").map(Number);
    return yearGroups.filter((y) => y.yearStart >= start && y.yearStart <= end);
  }, [yearGroups, selectedDecade]);

  // Reset decade when switching tabs
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedDecade(null);
  };

  return (
    <div>
      {/* Tab Bar */}
      <div className="mb-6 -mx-1">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-[#f0a500] text-[#0a1628] shadow-lg shadow-[#f0a500]/20"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span
                className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  activeTab === tab.id
                    ? "bg-[#0a1628]/20 text-[#0a1628]"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {tab.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Description */}
      {currentTab && (
        <p className="text-gray-400 text-sm mb-6">{currentTab.description}</p>
      )}

      {/* Decade Filter Pills */}
      {decades.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDecade(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedDecade === null
                ? "bg-[#f0a500] text-[#0a1628]"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All Years ({yearGroups.length})
          </button>
          {decades.map((d) => {
            const count = yearGroups.filter(
              (y) => y.yearStart >= d.start && y.yearStart <= d.end
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={d.decade}
                onClick={() => setSelectedDecade(`${d.start}-${d.end}`)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedDecade === `${d.start}-${d.end}`
                    ? "bg-[#f0a500] text-[#0a1628]"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {d.decade} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Years Accordion */}
      <div className="space-y-3">
        {filteredYears.map((yearData) => {
          const awardTypeGroups = groupByAwardType(yearData.awards, sport);
          const hasMultipleTypes = Object.keys(awardTypeGroups).length > 1;

          return (
            <details
              key={yearData.label}
              className="group bg-gray-800/80 border border-gray-700/60 rounded-lg overflow-hidden"
            >
              <summary className="cursor-pointer px-4 py-3 flex items-center justify-between hover:bg-gray-750/50 transition-all">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-bebas text-xl tracking-wide">{yearData.label}</h3>
                  <span className="text-gray-500 text-xs font-medium">
                    {yearData.awards.length} {yearData.awards.length === 1 ? "selection" : "selections"}
                  </span>
                </div>
                <span className="text-[#f0a500] text-sm group-open:rotate-180 transition-transform duration-200">
                  ▼
                </span>
              </summary>

              <div className="border-t border-gray-700/50 bg-[#0a1628]/40">
                {hasMultipleTypes ? (
                  Object.entries(awardTypeGroups).map(([type, typeAwards]) => {
                    const tierGroups = groupByTier(typeAwards);
                    return (
                      <div key={type} className="border-b border-gray-700/30 last:border-b-0">
                        <div className="px-4 py-2 bg-gray-800/40">
                          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                            {AWARD_TYPE_LABELS[type] || type}
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
                  <div className="px-4 pb-4">
                    {groupByTier(yearData.awards).map(({ tier, awards: tierAwards }, idx) => (
                      <TierSection key={tier || `ungrouped-${idx}`} tier={tier} awards={tierAwards} sport={sport} />
                    ))}
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>

      {filteredYears.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-300">
            No {currentTab?.label || "award"} selections for this time period.
          </p>
        </div>
      )}
    </div>
  );
}
