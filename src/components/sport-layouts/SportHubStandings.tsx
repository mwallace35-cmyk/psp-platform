"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface StandingsTeam {
  id: number;
  wins: number;
  losses: number;
  ties?: number;
  division?: string | null;
  schools?: {
    name: string;
    slug: string;
    league_id?: number | null;
    leagues?: { id: number; name: string } | null;
  } | null;
  seasons?: { label: string } | null;
}

interface SportHubStandingsProps {
  standings: StandingsTeam[];
  sport: string;
  sportName: string;
  sportColorHex: string;
}

// Map league names to short tab labels
const LEAGUE_TAB_LABELS: Record<string, string> = {
  "Philadelphia Catholic League": "Catholic League",
  "Catholic League": "Catholic League",
  "PCL": "Catholic League",
  "Philadelphia Public League": "Public League",
  "Public League": "Public League",
  "PPL": "Public League",
  "Inter-Ac League": "Inter-Ac",
  "Inter-Academic League": "Inter-Ac",
  "Inter-Ac": "Inter-Ac",
};

// Canonical order for division sub-headers — sport-specific
const DIVISION_ORDER_BY_SPORT: Record<string, Record<string, string[]>> = {
  football: {
    "Catholic League": ["Red", "Blue", "Independent"],
    "Public League": ["A", "B", "C", "D", "E"],
  },
  basketball: {
    // PCL basketball is a single league (no Red/Blue divisions)
    "Catholic League": [],
    // PPL basketball uses geographic divisions
    "Public League": ["American", "National", "Independence", "Liberty", "A", "B", "C", "D", "E"],
  },
};

function getDivisionOrder(sport: string): Record<string, string[]> {
  return DIVISION_ORDER_BY_SPORT[sport] || DIVISION_ORDER_BY_SPORT.football;
}

const MAX_OVERALL_TEAMS = 15;

function getTabLabel(leagueName: string): string {
  return LEAGUE_TAB_LABELS[leagueName] || leagueName;
}

function getWinPct(w: number, l: number): number {
  return w + l > 0 ? w / (w + l) : 0;
}

export default function SportHubStandings({
  standings,
  sport,
  sportName,
  sportColorHex,
}: SportHubStandingsProps) {
  const [activeTab, setActiveTab] = useState("Overall");
  const DIVISION_ORDER = getDivisionOrder(sport);

  // For basketball PCL, collapse divisions into single league
  const isPCLSingleLeague = sport === "basketball";

  // Derive tabs and grouped data from standings
  const { tabs, grouped } = useMemo(() => {
    if (!standings || standings.length === 0) return { tabs: ["Overall"], grouped: {} };

    // Collect unique league tab labels
    const leagueSet = new Set<string>();
    for (const team of standings) {
      const leagueName = team.schools?.leagues?.name;
      if (leagueName) {
        leagueSet.add(getTabLabel(leagueName));
      }
    }

    // Build tabs: Overall first, then leagues in a predictable order
    const leagueOrder = ["Catholic League", "Public League", "Inter-Ac"];
    const sortedLeagues = [...leagueSet].sort((a, b) => {
      const ai = leagueOrder.indexOf(a);
      const bi = leagueOrder.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    const tabList = ["Overall", ...sortedLeagues];

    // Group teams by tab -> division
    const groupMap: Record<string, Record<string, StandingsTeam[]>> = {};

    // Overall: only Philly-area schools (PCL=1, PPL=2, Inter-Ac=3), sorted by win%
    const phillyTeams = standings.filter(t => {
      const lid = t.schools?.league_id;
      return lid === 1 || lid === 2 || lid === 3;
    });
    groupMap["Overall"] = {
      "": [...phillyTeams]
        .sort((a, b) => getWinPct(b.wins, b.losses) - getWinPct(a.wins, a.losses))
        .slice(0, MAX_OVERALL_TEAMS),
    };

    // Per-league grouping
    for (const team of standings) {
      const leagueName = team.schools?.leagues?.name;
      if (!leagueName) continue;
      const tabLabel = getTabLabel(leagueName);

      if (!groupMap[tabLabel]) groupMap[tabLabel] = {};

      // For basketball PCL, collapse all divisions into one group
      const divKey = (isPCLSingleLeague && tabLabel === "Catholic League")
        ? ""
        : (team.division || "");
      if (!groupMap[tabLabel][divKey]) groupMap[tabLabel][divKey] = [];
      groupMap[tabLabel][divKey].push(team);
    }

    // Sort teams within each division by win%
    for (const tab of Object.keys(groupMap)) {
      for (const div of Object.keys(groupMap[tab])) {
        groupMap[tab][div].sort(
          (a, b) => getWinPct(b.wins, b.losses) - getWinPct(a.wins, a.losses)
        );
      }
    }

    return { tabs: tabList, grouped: groupMap };
  }, [standings, isPCLSingleLeague]);

  if (!standings || standings.length === 0) return null;

  // Get divisions for current tab, sorted in canonical order
  const currentGroup = grouped[activeTab] || {};
  const divisionKeys = Object.keys(currentGroup).sort((a, b) => {
    if (!a && !b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    const order = DIVISION_ORDER[activeTab];
    if (order) {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    }
    return a.localeCompare(b);
  });

  return (
    <section className="py-8 px-4" aria-label={`${sportName} standings`}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="psp-h2 text-white flex items-center gap-2">
            <span
              className="inline-block w-1 h-6 rounded-full"
              style={{ background: sportColorHex }}
            />
            Standings
          </h2>
          <Link
            href={`/${sport}/standings`}
            className="text-xs font-semibold uppercase tracking-wider hover:underline"
            style={{ color: sportColorHex }}
          >
            Full Standings &#8594;
          </Link>
        </div>

        {/* Tab buttons */}
        {tabs.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border"
                  style={{
                    background: isActive ? sportColorHex : "transparent",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                    borderColor: isActive ? sportColorHex : "rgba(255,255,255,0.15)",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}

        {/* Standings content */}
        <div className="rounded-lg border border-white/10 bg-[var(--psp-navy-mid)] overflow-hidden">
          {divisionKeys.map((divKey, divIdx) => {
            const teams = currentGroup[divKey] || [];
            const showDivisionHeader = divKey !== "";
            const divisionLabel =
              activeTab === "Catholic League"
                ? `${divKey.toUpperCase()} DIVISION`
                : activeTab === "Public League"
                ? (divKey.length === 1 ? `DIVISION ${divKey.toUpperCase()}` : `${divKey.toUpperCase()} CONFERENCE`)
                : divKey.toUpperCase();

            return (
              <div key={divKey || "__all"}>
                {/* Division sub-header */}
                {showDivisionHeader && (
                  <div
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-b border-white/10"
                    style={{
                      color: sportColorHex,
                      background:
                        divIdx > 0
                          ? "rgba(255,255,255,0.02)"
                          : "transparent",
                      borderTop:
                        divIdx > 0
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "none",
                    }}
                  >
                    {divisionLabel}
                  </div>
                )}

                {/* Column header (only for first division) */}
                {divIdx === 0 && (
                  <div className="flex items-center px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10">
                    <span className="w-8 text-center">#</span>
                    <span className="flex-1 pl-2">Team</span>
                    <span className="w-20 text-right pr-2">Record</span>
                  </div>
                )}

                {/* Team rows */}
                {teams.map((team, index) => {
                  const record = `${team.wins}-${team.losses}`;

                  return (
                    <div
                      key={team.id}
                      className="flex items-center px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      {/* Rank circle */}
                      <span
                        className="flex-shrink-0 text-center text-xs font-bold rounded-full flex items-center justify-center"
                        style={{
                          width: 24,
                          height: 24,
                          background:
                            index < 3
                              ? sportColorHex
                              : "rgba(255,255,255,0.1)",
                          color:
                            index < 3 ? "#fff" : "rgba(255,255,255,0.5)",
                          fontSize: 11,
                        }}
                      >
                        {index + 1}
                      </span>

                      {/* Team name */}
                      <div className="flex-1 pl-3 min-w-0">
                        {team.schools?.slug ? (
                          <Link
                            href={`/${sport}/schools/${team.schools.slug}`}
                            className="text-sm font-semibold text-white hover:text-[var(--psp-gold)] transition-colors truncate block"
                            style={{ textDecoration: "none" }}
                          >
                            {team.schools.name}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold text-white/70 truncate block">
                            {team.schools?.name || `Team ${team.id}`}
                          </span>
                        )}
                      </div>

                      {/* W-L record */}
                      <span className="w-20 text-right pr-2 text-sm font-bold text-white/80 tabular-nums">
                        {record}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Empty state */}
          {divisionKeys.length === 0 && (
            <div className="px-4 py-8 text-center text-white/40 text-sm">
              No standings data available for this grouping.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
