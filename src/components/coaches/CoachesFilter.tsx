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
}

interface SportTab {
  id: string;
  label: string;
}

interface CoachesFilterProps {
  coaches: (Coach | null)[];
  sportTabs: SportTab[];
  sportEmojis: Record<string, string>;
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
                }}
              >
                {/* Header */}
                <div style={{ background: "var(--psp-navy)", padding: 16, color: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>
                      {sportEmojis[coach.sport] || "📋"}
                    </span>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "'Bebas Neue', sans-serif",
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
                  </div>
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
