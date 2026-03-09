"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface RecordItem {
  id: number;
  category: string;
  subcategory: string | null;
  scope: string | null;
  record_value: string | null;
  record_number: number | null;
  holder_name: string | null;
  holder_school: string | null;
  year_set: number | null;
  description: string | null;
  player_name: string | null;
  player_slug: string | null;
  school_name: string | null;
  school_slug: string | null;
  season_label: string | null;
}

interface RecordsViewProps {
  records: RecordItem[];
  sport: string;
  sportColor: string;
}

// Which scopes go in which tab
const SCOPE_TABS: Record<string, string[]> = {
  "All-Time": ["game", "season", "career", "city"],
  Postseason: ["postseason"],
  "City Title": ["city-title"],
};

const SCOPE_LABELS: Record<string, string> = {
  game: "Game",
  season: "Season",
  career: "Career",
  city: "All-Time",
  postseason: "Postseason",
  "city-title": "City Title",
};

const SCOPE_COLORS: Record<string, string> = {
  game: "#3b82f6",
  season: "#10b981",
  career: "#f59e0b",
  city: "#8b5cf6",
  postseason: "#ef4444",
  "city-title": "#f0a500",
};

// Categories that are actually leaderboards (many entries per subcategory+scope)
const LEADERBOARD_SUBCATS = new Set(["Yards"]);

function scopeBadge(scope: string | null) {
  if (!scope) return null;
  const label = SCOPE_LABELS[scope] || scope;
  const color = SCOPE_COLORS[scope] || "#6b7280";
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 4,
        background: `${color}18`,
        color,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </span>
  );
}

export default function RecordsView({ records, sport, sportColor }: RecordsViewProps) {
  const [activeTab, setActiveTab] = useState("All-Time");

  // Separate records vs leaderboard entries
  const { tabRecords, leaderboardEntries } = useMemo(() => {
    const tabRec: RecordItem[] = [];
    const leaders: RecordItem[] = [];

    for (const r of records) {
      if (LEADERBOARD_SUBCATS.has(r.subcategory || "")) {
        leaders.push(r);
      } else {
        tabRec.push(r);
      }
    }
    return { tabRecords: tabRec, leaderboardEntries: leaders };
  }, [records]);

  // Filter by active tab
  const scopeSet = new Set(SCOPE_TABS[activeTab] || []);
  const filtered = useMemo(() => {
    return tabRecords.filter((r) => scopeSet.has(r.scope || ""));
  }, [tabRecords, activeTab]);

  // Group by category, then subcategory
  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, RecordItem[]>>();
    for (const r of filtered) {
      const cat = r.category || "Other";
      const sub = r.subcategory || "General";
      if (!map.has(cat)) map.set(cat, new Map());
      const subMap = map.get(cat)!;
      if (!subMap.has(sub)) subMap.set(sub, []);
      subMap.get(sub)!.push(r);
    }
    return map;
  }, [filtered]);

  // Sort categories in a sensible order
  const CATEGORY_ORDER = [
    "Rushing",
    "Passing",
    "Receiving",
    "Scoring",
    "Kicking",
    "Defense",
    "Longest TD",
    "Return Touchdowns",
    "Team",
    "Team Records",
    "Misc",
    "Miscellaneous",
  ];

  const sortedCategories = useMemo(() => {
    return Array.from(grouped.keys()).sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [grouped]);

  // Leaderboard summary (top 3 per category+scope for All-Time tab)
  const leaderboardSummary = useMemo(() => {
    if (activeTab !== "All-Time") return new Map<string, Map<string, RecordItem[]>>();
    const map = new Map<string, Map<string, RecordItem[]>>();
    for (const r of leaderboardEntries) {
      if (!scopeSet.has(r.scope || "")) continue;
      const cat = r.category || "Other";
      const key = `${r.scope || "unknown"}`;
      if (!map.has(cat)) map.set(cat, new Map());
      const scopeMap = map.get(cat)!;
      if (!scopeMap.has(key)) scopeMap.set(key, []);
      const arr = scopeMap.get(key)!;
      if (arr.length < 3) {
        arr.push(r);
      }
    }
    return map;
  }, [leaderboardEntries, activeTab]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tab of Object.keys(SCOPE_TABS)) {
      const scopes = new Set(SCOPE_TABS[tab]);
      counts[tab] = tabRecords.filter((r) => scopes.has(r.scope || "")).length;
    }
    return counts;
  }, [tabRecords]);

  return (
    <div>
      {/* Tab navigation */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "2px solid #e5e7eb",
          marginBottom: 32,
          overflowX: "auto",
        }}
      >
        {Object.keys(SCOPE_TABS).map((tab) => {
          const isActive = activeTab === tab;
          const count = tabCounts[tab] || 0;
          if (count === 0 && tab !== "All-Time") return null;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? sportColor : "#6b7280",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? `3px solid ${sportColor}` : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                marginBottom: -2,
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              }}
            >
              {tab}
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 12,
                  color: isActive ? sportColor : "#9ca3af",
                }}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && activeTab !== "All-Time" ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <p>No {activeTab.toLowerCase()} records available yet.</p>
        </div>
      ) : (
        <>
          {sortedCategories.map((category) => {
            const subcatMap = grouped.get(category)!;
            const subcats = Array.from(subcatMap.keys()).sort();

            return (
              <section key={category} style={{ marginBottom: 40 }}>
                {/* Category header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                    paddingBottom: 8,
                    borderBottom: `2px solid ${sportColor}33`,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "var(--psp-navy, #0a1628)",
                      fontFamily: "var(--font-heading, 'Bebas Neue', sans-serif)",
                      margin: 0,
                    }}
                  >
                    {category}
                  </h2>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>
                    {Array.from(subcatMap.values()).reduce((n, arr) => n + arr.length, 0)} records
                  </span>
                </div>

                {/* Records grouped by subcategory */}
                <div style={{ display: "grid", gap: 8 }}>
                  {subcats.map((subcat) => {
                    const items = subcatMap.get(subcat)!;
                    // Sort by record_number desc, then year desc
                    const sorted = [...items].sort((a, b) => {
                      if (a.record_number !== null && b.record_number !== null)
                        return b.record_number - a.record_number;
                      if (a.record_number !== null) return -1;
                      if (b.record_number !== null) return 1;
                      return (b.year_set || 0) - (a.year_set || 0);
                    });

                    // If only one record in this subcategory+scope combo, show compact
                    const showAsTable = sorted.length > 2;

                    if (showAsTable) {
                      return (
                        <div key={subcat} style={{ marginBottom: 16 }}>
                          <h3
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: "#374151",
                              marginBottom: 8,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            {subcat}
                            {sorted[0]?.scope && scopeBadge(sorted[0].scope)}
                          </h3>
                          <div style={{ overflowX: "auto" }}>
                            <table className="data-table" style={{ width: "100%", fontSize: 14 }}>
                              <thead>
                                <tr>
                                  <th style={{ width: 40 }}>#</th>
                                  <th>Player</th>
                                  <th>School</th>
                                  <th>Year</th>
                                  <th style={{ textAlign: "right" }}>Record</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sorted.map((rec, i) => (
                                  <RecordRow key={rec.id} rec={rec} rank={i + 1} sport={sport} sportColor={sportColor} />
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={subcat}>
                        {sorted.map((rec) => (
                          <RecordCard key={rec.id} rec={rec} subcat={subcat} sport={sport} sportColor={sportColor} />
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Show leaderboard summary if exists for this category */}
                {leaderboardSummary.has(category) && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: 16,
                      background: "#f9fafb",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>
                      📊 Stat Leaders
                    </h3>
                    {Array.from(leaderboardSummary.get(category)!.entries()).map(([scopeKey, items]) => (
                      <div key={scopeKey} style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>
                          Top {SCOPE_LABELS[scopeKey] || scopeKey} {category === "Passing" ? "Passers" : category === "Rushing" ? "Rushers" : "Receivers"} (Yards)
                        </div>
                        {items.map((r, i) => (
                          <div
                            key={r.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "4px 0",
                              fontSize: 13,
                              borderBottom: i < items.length - 1 ? "1px solid #f3f4f6" : "none",
                            }}
                          >
                            <span>
                              <span style={{ color: i === 0 ? "#f59e0b" : "#9ca3af", fontWeight: 600, marginRight: 8 }}>
                                {i + 1}.
                              </span>
                              {r.player_slug ? (
                                <Link href={`/${sport}/players/${r.player_slug}`} style={{ color: "var(--psp-navy)", fontWeight: 500 }}>
                                  {r.player_name || r.holder_name}
                                </Link>
                              ) : (
                                <span style={{ fontWeight: 500 }}>{r.holder_name || r.player_name || "—"}</span>
                              )}
                              {" — "}
                              <span style={{ color: "#6b7280", fontSize: 12 }}>
                                {r.school_name || r.holder_school || ""}
                                {r.year_set ? ` (${r.year_set})` : ""}
                              </span>
                            </span>
                            <span style={{ fontWeight: 700, color: sportColor }}>
                              {r.record_value || r.record_number?.toLocaleString() || "—"}
                            </span>
                          </div>
                        ))}
                        <Link
                          href={`/${sport}/leaderboards/${category.toLowerCase()}-yards`}
                          style={{
                            display: "inline-block",
                            marginTop: 4,
                            fontSize: 12,
                            color: "var(--psp-blue, #3b82f6)",
                            fontWeight: 500,
                          }}
                        >
                          View full leaderboard →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}

function RecordCard({
  rec,
  subcat,
  sport,
  sportColor,
}: {
  rec: RecordItem;
  subcat: string;
  sport: string;
  sportColor: string;
}) {
  const playerName = rec.player_name || rec.holder_name || "Unknown";
  const schoolName = rec.school_name || rec.holder_school || "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        marginBottom: 6,
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 auto", minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{subcat}</span>
          {scopeBadge(rec.scope)}
        </div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          {rec.player_slug ? (
            <Link
              href={`/${sport}/players/${rec.player_slug}`}
              style={{ color: "var(--psp-navy)", fontWeight: 500 }}
            >
              {playerName}
            </Link>
          ) : (
            <span style={{ fontWeight: 500, color: "var(--psp-navy)" }}>{playerName}</span>
          )}
          {schoolName && (
            <>
              {" — "}
              {rec.school_slug ? (
                <Link
                  href={`/${sport}/schools/${rec.school_slug}`}
                  style={{ color: "var(--psp-gold, #f0a500)" }}
                >
                  {schoolName}
                </Link>
              ) : (
                <span>{schoolName}</span>
              )}
            </>
          )}
          {rec.year_set && <span style={{ color: "#9ca3af" }}> ({rec.year_set})</span>}
        </div>
        {rec.description && (
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{rec.description}</div>
        )}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: sportColor,
          whiteSpace: "nowrap",
          fontFamily: "var(--font-heading, 'Bebas Neue', sans-serif)",
        }}
      >
        {rec.record_value || rec.record_number?.toLocaleString() || "—"}
      </div>
    </div>
  );
}

function RecordRow({
  rec,
  rank,
  sport,
  sportColor,
}: {
  rec: RecordItem;
  rank: number;
  sport: string;
  sportColor: string;
}) {
  const playerName = rec.player_name || rec.holder_name || "—";
  const schoolName = rec.school_name || rec.holder_school || "—";

  return (
    <tr>
      <td style={{ fontWeight: 700, color: rank === 1 ? "#f59e0b" : "#9ca3af" }}>{rank}</td>
      <td>
        {rec.player_slug ? (
          <Link
            href={`/${sport}/players/${rec.player_slug}`}
            className="hover:underline"
            style={{ color: "var(--psp-navy)", fontWeight: 500 }}
          >
            {playerName}
          </Link>
        ) : (
          <span style={{ fontWeight: 500 }}>{playerName}</span>
        )}
        {rec.description && (
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{rec.description}</div>
        )}
      </td>
      <td>
        {rec.school_slug ? (
          <Link
            href={`/${sport}/schools/${rec.school_slug}`}
            className="hover:underline"
            style={{ color: "var(--psp-gold, #f0a500)", fontSize: 13 }}
          >
            {schoolName}
          </Link>
        ) : (
          <span style={{ fontSize: 13 }}>{schoolName}</span>
        )}
      </td>
      <td style={{ fontSize: 13, color: "#6b7280" }}>{rec.year_set || "—"}</td>
      <td style={{ textAlign: "right", fontWeight: 700, color: sportColor }}>
        {rec.record_value || rec.record_number?.toLocaleString() || "—"}
      </td>
    </tr>
  );
}
