"use client";

import { useState } from "react";
import Link from "next/link";
import type { AwardDetail, ChampionshipHubRecord } from "@/lib/data/awards-hub";
import { SPORT_META } from "@/lib/sports";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";

interface AwardsHubClientProps {
  recentAwards: AwardDetail[];
  recentChamps: ChampionshipHubRecord[];
  dynastyLeaders: { id: number; name: string; slug: string; count: number }[];
  topSchools: { id: number; name: string; slug: string; count: number }[];
}

type TabId = "recent" | "championships" | "poty" | "all-city";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "recent", label: "Recent Awards", icon: "🏅" },
  { id: "championships", label: "Championships", icon: "🏆" },
  { id: "poty", label: "Player of the Year", icon: "⭐" },
  { id: "all-city", label: "All-City Teams", icon: "📋" },
];

export default function AwardsHubClient({
  recentAwards,
  recentChamps,
  dynastyLeaders,
  topSchools,
}: AwardsHubClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("recent");

  // Filter POTY awards from recent
  const potyAwards = recentAwards.filter((a) =>
    ["player-of-year", "daily-news-player-of-year", "daily-news-pitcher-of-year", "pitcher-of-year", "coaches-mvp", "markward"].includes(
      a.award_type || ""
    )
  );

  // Filter All-City type awards
  const allCityAwards = recentAwards.filter((a) =>
    ["all-city", "football-all-city", "basketball-all-city", "baseball-all-city", "all-scholastic", "all-state", "all-public", "all-catholic", "all-inter-ac"].some(
      (t) => a.award_type?.includes(t)
    )
  );

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2"
            style={{
              border: `2px solid ${activeTab === tab.id ? "#f0a500" : "rgba(255,255,255,0.15)"}`,
              background:
                activeTab === tab.id
                  ? "linear-gradient(135deg, #f0a500, #d4940a)"
                  : "rgba(255,255,255,0.05)",
              color: activeTab === tab.id ? "#0a1628" : "rgba(255,255,255,0.8)",
              fontWeight: activeTab === tab.id ? 700 : 500,
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="rounded-lg overflow-hidden border"
        style={{
          backgroundColor: "rgba(10,22,40,0.6)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        {activeTab === "recent" && (
          <RecentAwardsTab awards={recentAwards} />
        )}
        {activeTab === "championships" && (
          <ChampionshipsTab champs={recentChamps} />
        )}
        {activeTab === "poty" && (
          <POTYTab awards={potyAwards} />
        )}
        {activeTab === "all-city" && (
          <AllCityTab awards={allCityAwards} />
        )}
      </div>
    </div>
  );
}

/* ─── Recent Awards Tab ─────────────────────────────────── */

function RecentAwardsTab({ awards }: { awards: AwardDetail[] }) {
  if (awards.length === 0) {
    return (
      <div className="p-8 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
        No recent awards data available.
      </div>
    );
  }

  return (
    <div>
      <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <h3
          className="text-lg uppercase font-bebas tracking-wider text-[#f0a500]"
        >
          Latest Award Selections
        </h3>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {awards.slice(0, 25).map((award) => (
          <AwardRow key={award.id} award={award} />
        ))}
      </div>
      <div className="px-5 py-4 text-center">
        <Link
          href="/football/awards"
          className="text-sm font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
          style={{
            color: "#3b82f6",
            border: "1px solid rgba(59,130,246,0.3)",
            background: "rgba(59,130,246,0.1)",
          }}
        >
          View All Sport-Specific Awards →
        </Link>
      </div>
    </div>
  );
}

/* ─── Championships Tab ─────────────────────────────────── */

function ChampionshipsTab({ champs }: { champs: ChampionshipHubRecord[] }) {
  if (champs.length === 0) {
    return (
      <div className="p-8 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
        No championship data available.
      </div>
    );
  }

  return (
    <div>
      <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <h3
          className="text-lg uppercase font-bebas tracking-wider text-[#f0a500]"
        >
          Recent Championships
        </h3>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {champs.map((champ) => {
          const sportMeta = SPORT_META[champ.sport_id as keyof typeof SPORT_META];
          const sportColor = SPORT_COLORS_HEX[champ.sport_id] || "#f0a500";
          return (
            <div key={champ.id} className="px-5 py-4 flex items-center gap-4">
              {/* Sport badge */}
              <span
                className="w-10 h-10 flex items-center justify-center rounded-lg text-lg"
                style={{ background: `${sportColor}20` }}
              >
                {sportMeta?.emoji || "🏆"}
              </span>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {champ.schools ? (
                    <Link
                      href={`/${champ.sport_id}/schools/${champ.schools.slug}`}
                      className="font-semibold text-sm hover:underline"
                      style={{ color: "#f0a500" }}
                    >
                      {champ.schools.name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-sm" style={{ color: "#f0a500" }}>
                      Unknown
                    </span>
                  )}
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: `${sportColor}20`,
                      color: sportColor,
                    }}
                  >
                    {sportMeta?.name || champ.sport_id}
                  </span>
                </div>
                <div className="text-xs mt-1 flex items-center gap-1 flex-wrap" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {champ.level && <span className="capitalize">{champ.level}</span>}
                  {champ.level && champ.championship_type && <span>{" \u00B7 "}</span>}
                  {champ.championship_type && (
                    <span className="capitalize">{champ.championship_type.replace(/-/g, " ")}</span>
                  )}
                  {champ.score && <span>{" \u00B7 "}{champ.score}</span>}
                </div>
              </div>
              {/* Season label */}
              <div
                className="text-sm font-bold shrink-0"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {champ.seasons?.label || champ.seasons?.year_start || "\u2014"}
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-5 py-4 text-center flex flex-wrap gap-3 justify-center">
        {(["football", "basketball", "baseball"] as const).map((sport) => (
          <Link
            key={sport}
            href={`/${sport}/championships`}
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
            style={{
              color: SPORT_COLORS_HEX[sport],
              border: `1px solid ${SPORT_COLORS_HEX[sport]}30`,
              background: `${SPORT_COLORS_HEX[sport]}10`,
            }}
          >
            {SPORT_META[sport].emoji} {SPORT_META[sport].name} Championships →
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Player of the Year Tab ─────────────────────────────────── */

function POTYTab({ awards }: { awards: AwardDetail[] }) {
  if (awards.length === 0) {
    return (
      <div className="p-8 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
        <p>Player of the Year data is available on sport-specific pages.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {(["football", "basketball", "baseball"] as const).map((sport) => (
            <Link
              key={sport}
              href={`/${sport}/awards`}
              className="text-sm font-semibold px-5 py-2 rounded-lg transition-colors duration-200"
              style={{
                color: SPORT_COLORS_HEX[sport],
                border: `1px solid ${SPORT_COLORS_HEX[sport]}30`,
                background: `${SPORT_COLORS_HEX[sport]}10`,
              }}
            >
              {SPORT_META[sport].emoji} {SPORT_META[sport].name} Awards
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <h3
          className="text-lg uppercase font-bebas tracking-wider text-[#f0a500]"
        >
          Player of the Year Honorees
        </h3>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {awards.slice(0, 25).map((award) => (
          <AwardRow key={award.id} award={award} showSport />
        ))}
      </div>
    </div>
  );
}

/* ─── All-City Teams Tab ─────────────────────────────────── */

function AllCityTab({ awards }: { awards: AwardDetail[] }) {
  return (
    <div>
      <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <h3
          className="text-lg uppercase font-bebas tracking-wider text-[#f0a500]"
        >
          All-City & All-League Selections
        </h3>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          For the complete archive, visit each sport&apos;s awards page
        </p>
      </div>
      {awards.length === 0 ? (
        <div className="p-8 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
          <p>All-City team archives are available on sport-specific pages.</p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {awards.slice(0, 25).map((award) => (
            <AwardRow key={award.id} award={award} showSport />
          ))}
        </div>
      )}
      <div className="px-5 py-4 text-center">
        <Link
          href="/football/all-city"
          className="text-sm font-semibold px-6 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
          style={{
            color: "#f0a500",
            border: "1px solid rgba(240,165,0,0.3)",
            background: "rgba(240,165,0,0.1)",
          }}
        >
          🏈 Full Football All-City Archive (1932–2018) →
        </Link>
      </div>
    </div>
  );
}

/* ─── Shared Award Row Component ─────────────────────────────── */

function AwardRow({
  award,
  showSport = false,
}: {
  award: AwardDetail;
  showSport?: boolean;
}) {
  const sportMeta = SPORT_META[award.sport_id as keyof typeof SPORT_META];
  const sportColor = SPORT_COLORS_HEX[award.sport_id] || "#f0a500";

  const playerName =
    award.players?.name || award.player_name || "Name not available";
  const playerSlug = award.players?.slug;
  const schoolName = award.players?.schools?.name;
  const schoolSlug = award.players?.schools?.slug;
  const year = (award.seasons as any)?.year_start;

  // Format award label: prefer award_name, clean up for display
  let awardLabel = award.award_name || award.award_type || "Award";
  // Strip sport prefix from award_type fallback
  awardLabel = awardLabel.replace(/^(football|basketball|baseball|soccer|lacrosse|wrestling|track-field)-/, "");
  // Strip year+tier suffix from baseball-style names
  awardLabel = awardLabel.replace(/\s+(First|Second|Third)\s+Team\s+\d{4}$/i, "");
  // Strip trailing tier info
  awardLabel = awardLabel.replace(/\s+(First|Second|Third)\s+Team$/i, "");
  // Convert remaining hyphens for award_type fallbacks
  if (!award.award_name) awardLabel = awardLabel.replace(/-/g, " ");

  return (
    <div className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
      {/* Sport icon (when showing multi-sport) */}
      {showSport && sportMeta && (
        <span
          className="w-8 h-8 flex items-center justify-center rounded text-sm shrink-0"
          style={{ background: `${sportColor}20` }}
        >
          {sportMeta.emoji}
        </span>
      )}

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {playerSlug ? (
            <Link
              href={`/${award.sport_id}/players/${playerSlug}`}
              className="font-medium text-sm hover:underline truncate"
              style={{ color: "#f0a500" }}
            >
              {playerName}
            </Link>
          ) : (
            <span className="font-medium text-sm truncate" style={{ color: "rgba(255,255,255,0.7)" }}>
              {playerName}
            </span>
          )}
          {schoolName && schoolSlug && (
            <Link
              href={`/${award.sport_id}/schools/${schoolSlug}`}
              className="text-xs hover:underline hidden sm:inline"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {schoolName}
            </Link>
          )}
        </div>
      </div>

      {/* Award badge + year */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="text-xs px-2 py-1 rounded capitalize hidden sm:inline-block"
          style={{
            background: "rgba(240,165,0,0.12)",
            color: "rgba(240,165,0,0.9)",
          }}
        >
          {awardLabel}
        </span>
        {year && (
          <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
            {year}
          </span>
        )}
      </div>

      {/* Year */}
      <span
        className="text-xs font-medium shrink-0"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {year || "—"}
      </span>
    </div>
  );
}
