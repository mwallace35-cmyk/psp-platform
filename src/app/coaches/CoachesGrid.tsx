"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type CoachRow = {
  id: number;
  slug: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
  isActive: boolean;
  currentSchoolName: string;
  currentSchoolSlug: string;
  currentSport: string;
  currentSportName: string;
  sportIds: string[];
  totalWins: number;
  totalLosses: number;
  totalTies: number;
  totalChamps: number;
  stintsCount: number;
  isActivelyCoaching: boolean;
};

const SPORT_TABS = [
  { id: "all", label: "All Sports", emoji: "" },
  { id: "football", label: "Football", emoji: "🏈" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "baseball", label: "Baseball", emoji: "⚾" },
  { id: "track-field", label: "Track & Field", emoji: "🏃" },
  { id: "lacrosse", label: "Lacrosse", emoji: "🥍" },
  { id: "wrestling", label: "Wrestling", emoji: "🤼" },
  { id: "soccer", label: "Soccer", emoji: "⚽" },
];

const SPORT_EMOJIS: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  "track-field": "🏃",
  lacrosse: "🥍",
  wrestling: "🤼",
  soccer: "⚽",
};

export default function CoachesGrid({ coaches }: { coaches: CoachRow[] }) {
  const [selectedSport, setSelectedSport] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const filteredCoaches = useMemo(() => {
    let result = coaches;
    if (selectedSport !== "all") {
      result = result.filter((c) => c.sportIds.includes(selectedSport));
    }
    if (showActiveOnly) {
      result = result.filter((c) => c.isActivelyCoaching);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.currentSchoolName.toLowerCase().includes(q)
      );
    }
    // Sort: active coaches first, then by championships desc, then by wins desc
    result = [...result].sort((a, b) => {
      if (a.isActivelyCoaching !== b.isActivelyCoaching)
        return a.isActivelyCoaching ? -1 : 1;
      if (b.totalChamps !== a.totalChamps) return b.totalChamps - a.totalChamps;
      return b.totalWins - a.totalWins;
    });
    return result;
  }, [coaches, selectedSport, searchQuery, showActiveOnly]);

  return (
    <>
      {/* Sport Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          marginBottom: 12,
          borderBottom: "2px solid var(--g100)",
          paddingBottom: 0,
        }}
      >
        {SPORT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedSport(tab.id)}
            style={{
              padding: "10px 14px",
              fontSize: 12,
              fontWeight: 600,
              color:
                selectedSport === tab.id ? "var(--psp-navy)" : "var(--g500)",
              background: "transparent",
              border: "none",
              borderBottom:
                selectedSport === tab.id
                  ? "3px solid var(--psp-navy)"
                  : "3px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              marginBottom: -2,
            }}
          >
            {tab.emoji && <span style={{ marginRight: 4 }}>{tab.emoji}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Active Filter */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search coaches by name or school..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
          style={{ flex: 1, minWidth: 200, padding: "10px 14px", fontSize: 13 }}
        />
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--g500)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
            style={{ accentColor: "var(--psp-blue)" }}
          />
          Active only
        </label>
      </div>

      {/* Results Header */}
      <div className="sec-head" style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>
          {selectedSport === "all"
            ? "All"
            : SPORT_TABS.find((t) => t.id === selectedSport)?.label}{" "}
          Coaches
        </h2>
        <span
          style={{ fontSize: 11, color: "var(--g400)", marginLeft: "auto" }}
        >
          {filteredCoaches.length}{" "}
          {filteredCoaches.length === 1 ? "coach" : "coaches"}
        </span>
      </div>

      {/* Coach Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {filteredCoaches.map((coach) => {
          const record = `${coach.totalWins}-${coach.totalLosses}${coach.totalTies > 0 ? `-${coach.totalTies}` : ""}`;
          const totalGames =
            coach.totalWins + coach.totalLosses + coach.totalTies;
          const sportLink = coach.currentSport || coach.sportIds[0] || "football";

          return (
            <Link
              key={coach.id}
              href={`/${sportLink}/coaches/${coach.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--g100)",
                  borderRadius: 8,
                  overflow: "hidden",
                  transition: ".15s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    background: "var(--psp-navy)",
                    padding: "14px 16px",
                    color: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>
                      {SPORT_EMOJIS[sportLink] || "📋"}
                    </span>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "'Barlow Condensed', sans-serif",
                        flex: 1,
                      }}
                    >
                      {coach.name}
                    </h3>
                    {coach.isActivelyCoaching && (
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 10,
                          fontSize: 9,
                          fontWeight: 700,
                          background: "rgba(74, 222, 128, 0.2)",
                          color: "#4ade80",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  {coach.currentSchoolName && (
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)" }}>
                      {coach.currentSchoolName}
                    </div>
                  )}
                  {/* Sport badges */}
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {coach.sportIds.map((sid) => (
                      <span
                        key={sid}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 10,
                          fontSize: 10,
                          fontWeight: 600,
                          background: "rgba(255,255,255,.1)",
                          color: "var(--psp-gold)",
                        }}
                      >
                        {SPORT_EMOJIS[sid] || ""}{" "}
                        {SPORT_TABS.find((t) => t.id === sid)?.label || sid}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats row */}
                <div
                  style={{
                    padding: "12px 16px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                    borderTop: "1px solid var(--g100)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "var(--g400)",
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Record
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--text)",
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      {totalGames > 0 ? record : "—"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "var(--g400)",
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Titles
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color:
                          coach.totalChamps > 0
                            ? "var(--psp-gold)"
                            : "var(--text)",
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      {coach.totalChamps > 0 ? coach.totalChamps : "—"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "var(--g400)",
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Schools
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--text)",
                        fontFamily: "'Barlow Condensed', sans-serif",
                      }}
                    >
                      {coach.stintsCount}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredCoaches.length === 0 && (
        <div
          style={{ textAlign: "center", padding: 40, color: "var(--g400)" }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
          <div style={{ fontWeight: 600 }}>No coaches found</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            Try adjusting your search or sport filter.
          </div>
        </div>
      )}
    </>
  );
}
