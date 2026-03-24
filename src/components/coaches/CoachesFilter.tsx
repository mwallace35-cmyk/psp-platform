"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Coach {
  id: number;
  slug: string;
  name: string;
  school: string;
  sport: string;
  sportName: string;
  record?: string;
  championships: number;
  yearsCoaching: string;
  bio?: string;
  pipelineCount?: number;
  coachingTimeline?: Array<{
    year: number;
    milestone: string;
  }>;
}

// Dynasty indicator styles
const DYNASTY_STYLES = `
  @keyframes dynasty-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(212, 168, 67, 0.7);
    }
    50% {
      box-shadow: 0 0 0 6px rgba(212, 168, 67, 0);
    }
  }

  @keyframes elite-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(192, 192, 192, 0.7);
    }
    50% {
      box-shadow: 0 0 0 6px rgba(192, 192, 192, 0);
    }
  }

  @keyframes champion-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(205, 127, 50, 0.7);
    }
    50% {
      box-shadow: 0 0 0 6px rgba(205, 127, 50, 0);
    }
  }

  .dynasty-badge {
    animation: dynasty-pulse 2s infinite;
  }

  .elite-badge {
    animation: elite-pulse 2s infinite;
  }

  .champion-badge {
    animation: champion-pulse 2s infinite;
  }
`;

interface SportTab {
  id: string;
  label: string;
}

interface CoachesFilterProps {
  coaches: (Coach | null)[];
  sportTabs: SportTab[];
  sportEmojis: Record<string, string>;
}

function getDynastyBadge(championships: number): {
  label: string;
  className: string;
  bgColor: string;
  textColor: string;
} | null {
  if (championships >= 5) {
    return {
      label: "👑 DYNASTY",
      className: "dynasty-badge",
      bgColor: "linear-gradient(135deg, #d4a843, #b8922f)",
      textColor: "#fff",
    };
  }
  if (championships >= 3) {
    return {
      label: "⭐ ELITE",
      className: "elite-badge",
      bgColor: "linear-gradient(135deg, #c0c0c0, #a8a8a8)",
      textColor: "#000",
    };
  }
  if (championships >= 1) {
    return {
      label: "🏅 CHAMPION",
      className: "champion-badge",
      bgColor: "linear-gradient(135deg, #cd7f32, #b86f1f)",
      textColor: "#fff",
    };
  }
  return null;
}

export default function CoachesFilter({
  coaches,
  sportTabs,
  sportEmojis,
}: CoachesFilterProps) {
  const [selectedSport, setSelectedSport] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out nulls
  const validCoaches = coaches.filter((c) => c !== null) as Coach[];

  const filteredCoaches = useMemo(() => {
    let result = validCoaches;
    if (selectedSport !== "all") {
      result = result.filter((c) => c.sport === selectedSport);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.school.toLowerCase().includes(q)
      );
    }
    return result;
  }, [validCoaches, selectedSport, searchQuery]);

  return (
    <>
      <style>{DYNASTY_STYLES}</style>
      {/* Sport Tabs */}
      <div className="subnav">
        <div className="subnav-inner">
          {sportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSport(tab.id)}
              className={selectedSport === tab.id ? "active" : ""}
              style={{
                padding: "12px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: selectedSport === tab.id ? "var(--psp-navy)" : "var(--g500)",
                background: "transparent",
                border: "none",
                borderBottom:
                  selectedSport === tab.id
                    ? "3px solid var(--psp-navy)"
                    : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main>
        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Search coaches by name or school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
            style={{ width: "100%", padding: "10px 14px", fontSize: 13 }}
          />
        </div>

        {/* Results Header */}
        <div className="sec-head">
          <h2>
            {selectedSport === "all"
              ? "All"
              : sportTabs.find((t) => t.id === selectedSport)?.label}{" "}
            Coaches
          </h2>
          <span style={{ fontSize: 11, color: "var(--g400)", marginLeft: "auto" }}>
            {filteredCoaches.length} {filteredCoaches.length === 1 ? "coach" : "coaches"}
          </span>
        </div>

        {/* Coach Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {filteredCoaches.map((coach) => (
            <Link
              key={coach.id}
              href={`/${coach.sport}/coaches/${coach.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "var(--psp-white)",
                  border: "1px solid var(--g100)",
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: ".15s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* Header */}
                <div style={{ background: "var(--psp-navy)", padding: 16, color: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>
                      {sportEmojis[coach.sport] || "📋"}
                    </span>
                    <h3
                      className="psp-h4"
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {coach.name}
                    </h3>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)" }}>
                    {coach.school}
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      marginTop: 6,
                      padding: "2px 8px",
                      borderRadius: 10,
                      fontSize: 10,
                      fontWeight: 700,
                      background: "rgba(255,255,255,.15)",
                      color: "var(--psp-gold)",
                    }}
                  >
                    {coach.sportName}
                  </div>
                </div>

                {/* Dynasty Badge - Top Right Corner */}
                {getDynastyBadge(coach.championships) && (() => {
                  const badge = getDynastyBadge(coach.championships)!;
                  return (
                    <div
                      className={badge.className}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "50px",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        background: badge.bgColor,
                        color: badge.textColor,
                        zIndex: 10,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {badge.label}
                    </div>
                  );
                })()}

                {/* Body */}
                <div
                  style={{
                    padding: 16,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {coach.bio && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        marginBottom: 12,
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {coach.bio}
                    </p>
                  )}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      paddingTop: 12,
                      borderTop: "1px solid var(--g100)",
                    }}
                  >
                    {coach.record && (
                      <div>
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--g400)",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          Record
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--psp-navy)",
                          }}
                        >
                          {coach.record}
                        </div>
                      </div>
                    )}
                    {coach.championships !== undefined && (
                      <div>
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--g400)",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          Titles
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--psp-gold)",
                          }}
                        >
                          {coach.championships}
                        </div>
                      </div>
                    )}
                    {coach.yearsCoaching && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--g400)",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          Years
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--text)",
                          }}
                        >
                          {coach.yearsCoaching}
                        </div>
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 9, color: "var(--g400)", textTransform: "uppercase", marginBottom: 4 }}>
                        Pipeline
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--psp-navy)" }}>
                        {coach.pipelineCount ?? 0} at next level
                      </div>
                    </div>
                  </div>

                  {/* Coaching Timeline */}
                  {coach.coachingTimeline && coach.coachingTimeline.length > 0 && (
                    <div style={{ gridColumn: "1 / -1", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--g100)" }}>
                      <div style={{ fontSize: 9, color: "var(--g400)", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>
                        Timeline
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {coach.coachingTimeline.map((event, idx) => (
                          <div key={idx} style={{ fontSize: 11, color: "var(--text)", display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ fontWeight: 700, color: "var(--psp-gold)", minWidth: 40 }}>{event.year}:</span>
                            <span>{event.milestone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCoaches.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--g400)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            <div style={{ fontWeight: 600 }}>No coaches found</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Try adjusting your search or sport filter.
            </div>
          </div>
        )}
      </main>
    </>
  );
}
