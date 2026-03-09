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

// Which scopes go in which tab (School Records is special — handled separately)
const SCOPE_TABS: Record<string, string[]> = {
  "All-Time": ["game", "season", "career", "city"],
  "School Records": [], // special tab
  "Regular Season": ["regular-season"],
  "Catholic League": ["catholic-league"],
  Postseason: ["postseason", "playoff"],
  "City Title": ["city-title"],
};

const SCOPE_LABELS: Record<string, string> = {
  game: "Game",
  season: "Season",
  career: "Career",
  city: "All-Time",
  postseason: "Postseason",
  playoff: "Playoff",
  "city-title": "City Title",
  "regular-season": "Regular Season",
  "catholic-league": "Catholic League",
};

const SCOPE_COLORS: Record<string, string> = {
  game: "#3b82f6",
  season: "#10b981",
  career: "#f59e0b",
  city: "#8b5cf6",
  postseason: "#ef4444",
  playoff: "#ef4444",
  "city-title": "#f0a500",
  "regular-season": "#06b6d4",
  "catholic-league": "#7c3aed",
};

// Scope display priority (game → season → career → all-time)
const SCOPE_SORT_ORDER: Record<string, number> = {
  game: 0,
  season: 1,
  career: 2,
  city: 3,
  postseason: 0,
  playoff: 0,
  "city-title": 0,
  "regular-season": 0,
  "catholic-league": 0,
};

// Categories whose records are team records (no individual player)
const TEAM_CATEGORIES = new Set(["Team", "Team Records"]);

// Categories where scope=career actually means "all-time single play"
const SINGLE_PLAY_CATEGORIES = new Set(["Longest TD"]);

// Normalize category names for display
function normalizeCategory(cat: string): string {
  if (cat === "Misc") return "Miscellaneous";
  return cat;
}

// Categories that are actually leaderboards (many entries per subcategory+scope)
const LEADERBOARD_SUBCATS = new Set(["Yards"]);

function scopeBadge(scope: string | null, overrideLabel?: string) {
  if (!scope) return null;
  const label = overrideLabel || SCOPE_LABELS[scope] || scope;
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
  const [schoolSearch, setSchoolSearch] = useState("");

  // Separate records vs school records (per-school yard records)
  const { tabRecords, schoolRecords } = useMemo(() => {
    const tabRec: RecordItem[] = [];
    const schoolRec: RecordItem[] = [];

    for (const r of records) {
      if (LEADERBOARD_SUBCATS.has(r.subcategory || "")) {
        schoolRec.push(r);
      } else {
        tabRec.push(r);
      }
    }
    return { tabRecords: tabRec, schoolRecords: schoolRec };
  }, [records]);

  // Filter by active tab
  const scopeSet = new Set(SCOPE_TABS[activeTab] || []);
  const filtered = useMemo(() => {
    if (activeTab === "School Records") return [];
    return tabRecords.filter((r) => scopeSet.has(r.scope || ""));
  }, [tabRecords, activeTab]);

  // Group by normalized category → subcategory+scope key → records
  // Each unique (subcategory, scope) gets its own group so we never mix
  // game/season/career records in a single ranked table
  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, RecordItem[]>>();
    for (const r of filtered) {
      const cat = normalizeCategory(r.category || "Other");
      const scope = r.scope || "unknown";
      const sub = r.subcategory || "General";
      // Create a compound key: "subcategory||scope"
      const key = `${sub}||${scope}`;
      if (!map.has(cat)) map.set(cat, new Map());
      const subMap = map.get(cat)!;
      if (!subMap.has(key)) subMap.set(key, []);
      subMap.get(key)!.push(r);
    }
    return map;
  }, [filtered]);

  // Sort categories in a sensible order (uses normalized names)
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

  // School records grouped by canonical school name (prefer school_name from DB join)
  const schoolsByName = useMemo(() => {
    const map = new Map<string, RecordItem[]>();
    for (const r of schoolRecords) {
      const school = r.school_name || r.holder_school || "Unknown";
      if (!map.has(school)) map.set(school, []);
      map.get(school)!.push(r);
    }
    // Sort schools alphabetically
    return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  }, [schoolRecords]);

  // Filter schools by search
  const filteredSchools = useMemo(() => {
    if (!schoolSearch.trim()) return schoolsByName;
    const q = schoolSearch.toLowerCase();
    const filtered = new Map<string, RecordItem[]>();
    for (const [name, recs] of schoolsByName) {
      if (name.toLowerCase().includes(q)) {
        filtered.set(name, recs);
      }
    }
    return filtered;
  }, [schoolsByName, schoolSearch]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tab of Object.keys(SCOPE_TABS)) {
      if (tab === "School Records") {
        counts[tab] = schoolsByName.size;
        continue;
      }
      const scopes = new Set(SCOPE_TABS[tab]);
      counts[tab] = tabRecords.filter((r) => scopes.has(r.scope || "")).length;
    }
    return counts;
  }, [tabRecords, schoolsByName]);

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
                ({count}{tab === "School Records" ? " schools" : ""})
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === "School Records" ? (
        <SchoolRecordsTab
          schools={filteredSchools}
          totalSchools={schoolsByName.size}
          searchValue={schoolSearch}
          onSearch={setSchoolSearch}
          sport={sport}
          sportColor={sportColor}
        />
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <p>No {activeTab.toLowerCase()} records available yet.</p>
        </div>
      ) : (
        <>
          {sortedCategories.map((category) => {
            const subcatMap = grouped.get(category)!;
            const isTeamCategory = TEAM_CATEGORIES.has(category);
            const isSinglePlay = SINGLE_PLAY_CATEGORIES.has(category);

            // Sort compound keys: by subcategory name, then by scope order
            const sortedKeys = Array.from(subcatMap.keys()).sort((a, b) => {
              const [subA, scopeA] = a.split("||");
              const [subB, scopeB] = b.split("||");
              if (subA !== subB) return subA.localeCompare(subB);
              return (SCOPE_SORT_ORDER[scopeA] ?? 99) - (SCOPE_SORT_ORDER[scopeB] ?? 99);
            });

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

                {/* Records grouped by subcategory + scope */}
                <div style={{ display: "grid", gap: 8 }}>
                  {sortedKeys.map((compoundKey) => {
                    const [subcat, scope] = compoundKey.split("||");
                    const items = subcatMap.get(compoundKey)!;
                    // Sort by record_number desc, then year desc
                    const sorted = [...items].sort((a, b) => {
                      if (a.record_number !== null && b.record_number !== null)
                        return b.record_number - a.record_number;
                      if (a.record_number !== null) return -1;
                      if (b.record_number !== null) return 1;
                      return (b.year_set || 0) - (a.year_set || 0);
                    });

                    // Determine scope badge label
                    const badgeLabel = isSinglePlay && scope === "career" ? "All-Time" : undefined;

                    // Multiple records with same subcategory+scope → ranked table
                    const showAsTable = sorted.length > 2;

                    if (showAsTable) {
                      return (
                        <div key={compoundKey} style={{ marginBottom: 16 }}>
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
                            {scopeBadge(scope, badgeLabel)}
                          </h3>
                          <div style={{ overflowX: "auto" }}>
                            <table className="data-table" style={{ width: "100%", fontSize: 14 }}>
                              <thead>
                                <tr>
                                  <th style={{ width: 40 }}>#</th>
                                  <th>{isTeamCategory ? "School" : "Player"}</th>
                                  {!isTeamCategory && <th>School</th>}
                                  <th>Year</th>
                                  <th style={{ textAlign: "right" }}>Record</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sorted.map((rec, i) => (
                                  <RecordRow key={rec.id} rec={rec} rank={i + 1} sport={sport} sportColor={sportColor} isTeam={isTeamCategory} />
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={compoundKey}>
                        {sorted.map((rec) => (
                          <RecordCard key={rec.id} rec={rec} subcat={subcat} sport={sport} sportColor={sportColor} isTeam={isTeamCategory} scopeLabel={badgeLabel} />
                        ))}
                      </div>
                    );
                  })}
                </div>

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
  isTeam = false,
  scopeLabel,
}: {
  rec: RecordItem;
  subcat: string;
  sport: string;
  sportColor: string;
  isTeam?: boolean;
  scopeLabel?: string;
}) {
  const schoolName = rec.school_name || rec.holder_school || "";
  // For team records, show school as the main entity (no "Unknown" player)
  const hasPlayer = !isTeam && (rec.player_name || rec.holder_name);
  const playerName = rec.player_name || rec.holder_name || "";

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
          {scopeBadge(rec.scope, scopeLabel)}
        </div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          {isTeam ? (
            // Team record — show school as main entity
            <>
              {rec.school_slug ? (
                <Link
                  href={`/${sport}/schools/${rec.school_slug}`}
                  style={{ color: "var(--psp-navy)", fontWeight: 500 }}
                >
                  {schoolName}
                </Link>
              ) : schoolName ? (
                <span style={{ fontWeight: 500, color: "var(--psp-navy)" }}>{schoolName}</span>
              ) : null}
              {rec.year_set && <span style={{ color: "#9ca3af" }}> ({rec.year_set})</span>}
            </>
          ) : (
            // Individual record — show player + school
            <>
              {hasPlayer ? (
                rec.player_slug ? (
                  <Link
                    href={`/${sport}/players/${rec.player_slug}`}
                    style={{ color: "var(--psp-navy)", fontWeight: 500 }}
                  >
                    {playerName}
                  </Link>
                ) : (
                  <span style={{ fontWeight: 500, color: "var(--psp-navy)" }}>{playerName}</span>
                )
              ) : null}
              {schoolName && hasPlayer && " — "}
              {schoolName && (
                rec.school_slug ? (
                  <Link
                    href={`/${sport}/schools/${rec.school_slug}`}
                    style={{ color: "var(--psp-gold, #f0a500)" }}
                  >
                    {schoolName}
                  </Link>
                ) : (
                  <span>{schoolName}</span>
                )
              )}
              {rec.year_set && <span style={{ color: "#9ca3af" }}> ({rec.year_set})</span>}
            </>
          )}
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

function SchoolRecordsTab({
  schools,
  totalSchools,
  searchValue,
  onSearch,
  sport,
  sportColor,
}: {
  schools: Map<string, RecordItem[]>;
  totalSchools: number;
  searchValue: string;
  onSearch: (v: string) => void;
  sport: string;
  sportColor: string;
}) {
  const SCOPE_ORDER = ["game", "season", "career"];
  const CAT_LABELS: Record<string, string> = {
    Rushing: "Rush",
    Passing: "Pass",
    Receiving: "Rec",
  };

  return (
    <div>
      {/* Search box */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder={`Search ${totalSchools} schools...`}
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "10px 16px",
            fontSize: 14,
            border: "2px solid #e5e7eb",
            borderRadius: 8,
            outline: "none",
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          }}
          onFocus={(e) => (e.target.style.borderColor = sportColor)}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
        {searchValue && (
          <span style={{ marginLeft: 12, fontSize: 13, color: "#6b7280" }}>
            {schools.size} of {totalSchools} schools
          </span>
        )}
      </div>

      {/* School cards */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}>
        {Array.from(schools.entries()).map(([schoolName, recs]) => {
          // Group by scope then category
          const byScope = new Map<string, RecordItem[]>();
          for (const r of recs) {
            const s = r.scope || "unknown";
            if (!byScope.has(s)) byScope.set(s, []);
            byScope.get(s)!.push(r);
          }

          // Get school slug for linking (from any record in this group)
          const schoolSlug = recs[0]?.school_slug;

          return (
            <div
              key={schoolName}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {/* School header */}
              <div
                style={{
                  padding: "12px 16px",
                  background: "var(--psp-navy, #0a1628)",
                  borderBottom: `3px solid ${sportColor}`,
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "var(--font-heading, 'Bebas Neue', sans-serif)" }}>
                  {schoolSlug ? (
                    <Link href={`/${sport}/schools/${schoolSlug}`} style={{ color: "#fff", textDecoration: "none" }}>
                      {schoolName} →
                    </Link>
                  ) : (
                    schoolName
                  )}
                </h3>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>
                  {recs.length} records
                </span>
              </div>

              {/* Records table */}
              <div style={{ padding: "8px 0" }}>
                <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <th style={{ padding: "6px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Stat</th>
                      <th style={{ padding: "6px 8px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Record Holder</th>
                      <th style={{ padding: "6px 16px", textAlign: "right", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCOPE_ORDER.map((scope) => {
                      const scopeRecs = byScope.get(scope);
                      if (!scopeRecs) return null;
                      // Sort by category order
                      const sorted = [...scopeRecs].sort((a, b) => {
                        const cats = ["Rushing", "Passing", "Receiving"];
                        return cats.indexOf(a.category) - cats.indexOf(b.category);
                      });
                      return sorted.map((rec, i) => (
                        <tr key={rec.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                          <td style={{ padding: "6px 16px" }}>
                            <span style={{ fontWeight: 500 }}>{CAT_LABELS[rec.category] || rec.category}</span>
                            {i === 0 && (
                              <span style={{ marginLeft: 6 }}>{scopeBadge(scope)}</span>
                            )}
                          </td>
                          <td style={{ padding: "6px 8px", color: "#374151" }}>
                            {rec.holder_name || rec.player_name || "—"}
                            {rec.year_set && (
                              <span style={{ color: "#9ca3af", fontSize: 11 }}> ({rec.year_set})</span>
                            )}
                          </td>
                          <td style={{ padding: "6px 16px", textAlign: "right", fontWeight: 700, color: sportColor }}>
                            {rec.record_value || "—"}
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {schools.size === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <p>No schools match &ldquo;{searchValue}&rdquo;</p>
        </div>
      )}
    </div>
  );
}

function RecordRow({
  rec,
  rank,
  sport,
  sportColor,
  isTeam = false,
}: {
  rec: RecordItem;
  rank: number;
  sport: string;
  sportColor: string;
  isTeam?: boolean;
}) {
  const schoolName = rec.school_name || rec.holder_school || "—";

  if (isTeam) {
    // Team record row: show school as main entity, no player column
    return (
      <tr>
        <td style={{ fontWeight: 700, color: rank === 1 ? "#f59e0b" : "#9ca3af" }}>{rank}</td>
        <td>
          {rec.school_slug ? (
            <Link
              href={`/${sport}/schools/${rec.school_slug}`}
              className="hover:underline"
              style={{ color: "var(--psp-navy)", fontWeight: 500 }}
            >
              {schoolName}
            </Link>
          ) : (
            <span style={{ fontWeight: 500 }}>{schoolName}</span>
          )}
          {rec.description && (
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{rec.description}</div>
          )}
        </td>
        <td style={{ fontSize: 13, color: "#6b7280" }}>{rec.year_set || "—"}</td>
        <td style={{ textAlign: "right", fontWeight: 700, color: sportColor }}>
          {rec.record_value || rec.record_number?.toLocaleString() || "—"}
        </td>
      </tr>
    );
  }

  const playerName = rec.player_name || rec.holder_name || "—";

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
