"use client";

import { useState } from "react";
import TabGroup from "@/components/ui/TabGroup";
import OverviewTab from "./OverviewTab";
import SportTab from "./SportTab";
import LegacyTab from "./LegacyTab";
import type { SchoolHubData, SchoolSportStats, CurrentSeasonInfo, SchoolGame, SchoolChampionshipData, NextLevelAthlete, SchoolCoach, SchoolAward, RecentSeasonData, SchoolRecord } from "@/lib/data/school-hub";
import { SPORT_EMOJI } from "@/lib/sports";
import SportIcon from "@/components/ui/SportIcon";
import { BarChart3, Trophy } from "lucide-react";

interface SchoolTabHubProps {
  school: SchoolHubData;
  sports: SchoolSportStats[];
  currentSeasons: CurrentSeasonInfo[];
  recentGames: SchoolGame[];
  championships: SchoolChampionshipData[];
  nextLevel: NextLevelAthlete[];
  coaches: SchoolCoach[];
  awards: SchoolAward[];
  recentSeasons: RecentSeasonData[];
  records: SchoolRecord[];
}

export default function SchoolTabHub({
  school,
  sports,
  currentSeasons,
  recentGames,
  championships,
  nextLevel,
  coaches,
  awards,
  recentSeasons,
  records,
}: SchoolTabHubProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Build tabs: Overview, then each sport with seasons, then Legacy
  const sportTabs = sports
    .filter((s) => s.season_count > 0)
    .map((s) => ({
      key: s.sport_id,
      label: s.sport_name,
      icon: SPORT_EMOJI[s.sport_id] || "soccer",
    }));

  const tabs = [
    { key: "overview", label: "Overview", icon: "barchart3" },
    ...sportTabs,
    { key: "legacy", label: "Legacy", icon: "trophy" },
  ];

  return (
    <div>
      {/* Sticky tab bar */}
      <div
        className="sticky top-[60px] z-20 bg-white border-b border-[var(--psp-gray-200)] py-2 -mx-4 px-4"
      >
        <div className="overflow-x-auto">
          <TabGroup
            tabs={tabs}
            defaultTab="overview"
            onChange={(key) => setActiveTab(key)}
            variant="pills"
          />
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <OverviewTab
            school={school}
            sports={sports}
            currentSeasons={currentSeasons}
            recentGames={recentGames}
          />
        )}

        {activeTab === "legacy" && (
          <LegacyTab
            school={school}
            championships={championships}
            nextLevel={nextLevel}
            coaches={coaches}
            awards={awards}
            recentSeasons={recentSeasons}
            records={records}
          />
        )}

        {/* Sport tabs */}
        {sportTabs.some((t) => t.key === activeTab) && (
          <SportTab
            school={school}
            sportId={activeTab}
            sportName={
              sports.find((s) => s.sport_id === activeTab)?.sport_name ||
              activeTab
            }
            currentSeason={currentSeasons.find(
              (s) => s.sport_id === activeTab
            )}
            championships={championships}
            recentSeasons={recentSeasons}
            awards={awards}
            coaches={coaches}
          />
        )}
      </div>
    </div>
  );
}
