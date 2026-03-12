"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { AwardRecord } from "@/lib/data";

interface YearData {
  label: string;
  yearStart: number;
  awards: AwardRecord[];
}

interface AllCityArchiveProps {
  years: YearData[];
  sport: string;
}

/** Tier badge colors and labels */
const TIER_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  "First Team": { label: "1ST TEAM", bg: "bg-[#f0a500]/15", text: "text-[#f0a500]", border: "border-[#f0a500]/30" },
  "Second Team": { label: "2ND TEAM", bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  "Third Team": { label: "3RD TEAM", bg: "bg-gray-500/15", text: "text-gray-400", border: "border-gray-500/30" },
  "Honorable Mention": { label: "HON. MENTION", bg: "bg-gray-600/15", text: "text-gray-500", border: "border-gray-600/30" },
};

/** Readable position labels */
const POSITION_LABELS: Record<string, string> = {
  QB: "Quarterback", RB: "Running Back", HB: "Halfback", FB: "Fullback",
  WR: "Wide Receiver", TE: "Tight End", OL: "Offensive Line",
  T: "Tackle", G: "Guard", C: "Center", E: "End",
  L: "Lineman", B: "Back", IL: "Interior Line",
  DL: "Defensive Line", LB: "Linebacker", ILB: "Inside Linebacker",
  DB: "Defensive Back", DE: "Defensive End", DT: "Defensive Tackle",
  K: "Kicker", P: "Punter", KR: "Kick Returner",
  MP: "Multi-Purpose", AP: "All-Purpose", ATH: "Athlete",
  "MULTI-PURPOSE": "Multi-Purpose", SPEC: "Specialist",
  "Rec": "Receiver", "Rec.": "Receiver",
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

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/5 transition-colors">
      {/* Position */}
      {position && <PositionPill position={position} />}

      {/* Player name */}
      <div className="flex-1 min-w-0">
        {hasLink ? (
          <Link
            href={`/${sport}/players/${award.players!.slug}`}
            className="text-blue-400 hover:text-blue-300 font-medium text-sm truncate block"
          >
            {name}
          </Link>
        ) : (
          <span className="text-gray-200 font-medium text-sm truncate block">
            {name}
          </span>
        )}
      </div>

      {/* School */}
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

export default function AllCityArchive({ years, sport }: AllCityArchiveProps) {
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);

  // Generate decade options (filter out invalid years < 1900)
  const decades = useMemo(() => {
    const validYears = years.filter((y) => y.yearStart >= 1900);
    if (validYears.length === 0) return [];
    const minYear = Math.min(...validYears.map((y) => y.yearStart));
    const maxYear = Math.max(...validYears.map((y) => y.yearStart));

    const decadeList: { decade: string; start: number; end: number }[] = [];
    for (let d = Math.floor(minYear / 10) * 10; d <= maxYear; d += 10) {
      decadeList.push({
        decade: `${d}s`,
        start: d,
        end: d + 9,
      });
    }
    return decadeList.reverse(); // Most recent first
  }, [years]);

  // Filter years by decade
  const filteredYears = useMemo(() => {
    if (!selectedDecade) return years;
    const [start, end] = selectedDecade.split("-").map(Number);
    return years.filter((y) => y.yearStart >= start && y.yearStart <= end);
  }, [years, selectedDecade]);

  // Group awards by tier within a year
  const groupByTier = (awards: AwardRecord[]) => {
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

    // Return ordered groups + ungrouped at end
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
  };

  // Group awards by award_type for mixed years
  const groupByAwardType = (awards: AwardRecord[]) => {
    const groups: Record<string, AwardRecord[]> = {};
    for (const award of awards) {
      const key = award.award_type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(award);
    }
    return groups;
  };

  const AWARD_TYPE_LABELS: Record<string, string> = {
    "all-city": "All-City",
    "all-scholastic": "All-Scholastic",
    "all-state": "All-State",
    "all-catholic": "All-Catholic",
    "all-public": "All-Public",
    "all-inter-ac": "All-Inter-Ac",
    "all-decade": "All-Decade",
    "all-era": "All-Era",
  };

  return (
    <div>
      {/* Decade Filter Pills */}
      {decades.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDecade(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedDecade === null
                ? "bg-[#f0a500] text-[#0a1628]"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All Years
          </button>
          {decades.map((d) => (
            <button
              key={d.decade}
              onClick={() => setSelectedDecade(`${d.start}-${d.end}`)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedDecade === `${d.start}-${d.end}`
                  ? "bg-[#f0a500] text-[#0a1628]"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {d.decade}
            </button>
          ))}
        </div>
      )}

      {/* Years Accordion */}
      <div className="space-y-3">
        {filteredYears.map((yearData) => {
          const awardTypeGroups = groupByAwardType(yearData.awards);
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
                    {yearData.awards.length} selections
                  </span>
                </div>
                <span className="text-[#f0a500] text-sm group-open:rotate-180 transition-transform duration-200">
                  ▼
                </span>
              </summary>

              <div className="border-t border-gray-700/50 bg-[#0a1628]/40">
                {/* If multiple award types in this year, show sub-headers */}
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
                          {tierGroups.map(({ tier, awards }, idx) => (
                            <TierSection key={tier || `ungrouped-${idx}`} tier={tier} awards={awards} sport={sport} />
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 pb-4">
                    {groupByTier(yearData.awards).map(({ tier, awards }, idx) => (
                      <TierSection key={tier || `ungrouped-${idx}`} tier={tier} awards={awards} sport={sport} />
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
          <p className="text-gray-300">No All-City selections for this decade.</p>
        </div>
      )}
    </div>
  );
}

/** Section for a single tier (First Team, Second Team, etc.) */
function TierSection({ tier, awards, sport }: { tier: string | null; awards: AwardRecord[]; sport: string }) {
  return (
    <div className="mt-3">
      {/* Tier header */}
      {tier && (
        <div className="flex items-center gap-2 mb-2">
          <TierBadge tier={tier} />
          <div className="flex-1 h-px bg-gray-700/50" />
          <span className="text-gray-600 text-xs">{awards.length}</span>
        </div>
      )}

      {/* Player grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {awards.map((award) => (
          <PlayerRow key={award.id} award={award} sport={sport} />
        ))}
      </div>
    </div>
  );
}
