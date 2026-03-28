"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// Curated records from database
interface CuratedRecord {
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

// Computed records from stats tables
interface ComputedRecord {
  stat_category: string;
  stat_name: string;
  scope: "career" | "season";
  rank: number;
  value: number;
  display_value: string;
  player_name: string;
  player_slug: string;
  school_name: string;
  school_slug: string;
  season_label: string | null;
  year: number | null;
  source: "computed";
}

// School record book
interface SchoolRecordBook {
  school_name: string;
  school_slug: string;
  records: ComputedRecord[];
}

interface RecordsViewProps {
  curatedRecords: CuratedRecord[];
  computedByCategory: Record<string, ComputedRecord[]>;
  sport: string;
  sportName: string;
  sportColor: string;
  sportEmoji: string;
}

// Sport-specific categories
const SPORT_CATEGORIES: Record<string, string[]> = {
  football: ["Rushing", "Passing", "Receiving", "Scoring", "Kicking", "Defense", "Special Teams", "Miscellaneous"],
  basketball: ["Scoring", "Rebounds", "Assists", "Steals", "Blocks", "Shooting", "Team Records"],
  baseball: ["Batting", "Pitching", "Team Records"],
};

// Scope labels and display (Fix #2: normalize "city" to "city-title")
const SCOPE_LABELS: Record<string, string> = {
  game: "Game",
  season: "Season",
  career: "Career",
  city: "City Title",
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

// Era grouping for filtering
const YEAR_ERAS = [
  { label: "All Time", min: 1900, max: 2099 },
  { label: "2020s", min: 2020, max: 2029 },
  { label: "2010s", min: 2010, max: 2019 },
  { label: "2000s", min: 2000, max: 2009 },
  { label: "1990s", min: 1990, max: 1999 },
  { label: "1980s", min: 1980, max: 1989 },
  { label: "Pre-1980", min: 1900, max: 1979 },
];

// Team category detection
const TEAM_CATEGORIES = new Set(["Team", "Team Records"]);

// Helper: date-based seed for "Record of the Day"
function getRecordOfTheDayIndex(records: CuratedRecord[]): number {
  if (records.length === 0) return 0;
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % records.length;
}

// Helper: format scope label
function scopeLabel(scope: string | null): string {
  if (!scope) return "Record";
  return SCOPE_LABELS[scope] || scope;
}

// Helper: get scope color
function scopeColor(scope: string | null): string {
  if (!scope) return "#6b7280";
  return SCOPE_COLORS[scope] || "#6b7280";
}

// Fix #2: Normalize scope ("city" → "city-title")
function normalizeScope(scope: string | null): string {
  if (!scope) return "other";
  if (scope === "city") return "city-title";
  return scope;
}

export default function RecordsView({
  curatedRecords,
  computedByCategory,
  sport,
  sportName,
  sportColor,
  sportEmoji,
}: RecordsViewProps) {
  // Flatten computedByCategory into a single array for filtering
  const allComputedRecords = useMemo(() => {
    return Object.values(computedByCategory).flat();
  }, [computedByCategory]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeStat, setActiveStat] = useState<string | null>(null);
  const [activeScope, setActiveScope] = useState<string | null>(null);
  const [eraFilter, setEraFilter] = useState("All Time");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [curatedPage, setCuratedPage] = useState(1);
  const RECORDS_PER_PAGE = 25;

  // Get sport-specific categories
  const categories = SPORT_CATEGORIES[sport] || SPORT_CATEGORIES.football;
  const initialCategory = activeCategory || categories[0];

  // Initialize category on first render
  if (!activeCategory && categories.length > 0 && typeof window !== "undefined") {
    if (typeof document !== "undefined" && document.readyState !== "loading") {
      setActiveCategory(categories[0]);
    }
  }

  // Record of the Day (deterministic per day)
  const recordOfTheDay = useMemo(() => {
    const filteredByDesc = curatedRecords.filter((r) => r.description && r.description.length > 20);
    if (filteredByDesc.length === 0) return curatedRecords[0] || null;
    const idx = getRecordOfTheDayIndex(filteredByDesc);
    return filteredByDesc[idx] || null;
  }, [curatedRecords]);

  // Filter records by era
  const era = YEAR_ERAS.find((e) => e.label === eraFilter) || YEAR_ERAS[0];
  const recordsInEra = useMemo(() => {
    return curatedRecords.filter((r) => {
      const year = r.year_set || 2000;
      return year >= era.min && year <= era.max;
    });
  }, [curatedRecords, era]);

  const computedInEra = useMemo(() => {
    return allComputedRecords.filter((r) => {
      const year = r.year || 2000;
      return year >= era.min && year <= era.max;
    });
  }, [allComputedRecords, era]);

  // Fix #1: Extract unique stat names for the active category, filtered by scope
  const statsInCategory = useMemo(() => {
    const records = computedInEra.filter((r) => {
      if (r.stat_category !== initialCategory) return false;
      // If user selected a computed scope (career/season), filter by it
      if (activeScope === "career" || activeScope === "season") {
        return r.scope === activeScope;
      }
      return true;
    });
    const statNames = [...new Set(records.map((r) => r.stat_name))];
    return statNames.sort();
  }, [computedInEra, initialCategory, activeScope]);

  // Initialize active stat when category changes
  const activeStatForDisplay = activeStat || statsInCategory[0] || null;

  // Fix #1: Filter leaderboard by active stat AND scope
  const leaderboardRecords = useMemo(() => {
    const records = computedInEra.filter((r) => {
      if (r.stat_category !== initialCategory) return false;
      if (r.stat_name !== activeStatForDisplay) return false;
      // If user selected a computed scope (career/season), filter by it
      if (activeScope === "career" || activeScope === "season") {
        return r.scope === activeScope;
      }
      return true;
    });
    return records.sort((a, b) => a.rank - b.rank).slice(0, 25);
  }, [computedInEra, initialCategory, activeStatForDisplay, activeScope]);

  // Get normalized scopes for current category from BOTH curated and computed records
  const availableScopes = useMemo(() => {
    const scopes = new Set<string>();
    // Scopes from curated records
    recordsInEra
      .filter((r) => r.category === initialCategory)
      .forEach((r) => {
        if (r.scope) {
          scopes.add(normalizeScope(r.scope));
        }
      });
    // Scopes from computed records (career / season)
    computedInEra
      .filter((r) => r.stat_category === initialCategory)
      .forEach((r) => {
        if (r.scope) {
          scopes.add(r.scope);
        }
      });
    return Array.from(scopes).sort();
  }, [recordsInEra, computedInEra, initialCategory]);

  // Initialize scope on category change
  const currentScope = activeScope || (availableScopes.length > 0 ? availableScopes[0] : null);

  // Curated records for current category and scope
  const curatedForCategory = useMemo(() => {
    return recordsInEra
      .filter((r) => {
        const normalizedRecordScope = normalizeScope(r.scope);
        return r.category === initialCategory && (!currentScope || normalizedRecordScope === currentScope);
      })
      .sort((a, b) => {
        return (b.year_set || 0) - (a.year_set || 0);
      });
  }, [recordsInEra, initialCategory, currentScope]);

  // Derive school record books from computed records
  const schoolRecordBooks = useMemo((): SchoolRecordBook[] => {
    const schoolMap = new Map<string, { name: string; slug: string; records: ComputedRecord[] }>();
    for (const rec of allComputedRecords) {
      if (!schoolMap.has(rec.school_slug)) {
        schoolMap.set(rec.school_slug, { name: rec.school_name, slug: rec.school_slug, records: [] });
      }
      // Keep only rank-1 records per stat for each school
      const school = schoolMap.get(rec.school_slug)!;
      const existingStat = school.records.find((r) => r.stat_name === rec.stat_name);
      if (!existingStat || rec.value > existingStat.value) {
        school.records = school.records.filter((r) => r.stat_name !== rec.stat_name);
        school.records.push(rec);
      }
    }
    return Array.from(schoolMap.values())
      .filter((s) => s.records.length >= 2)
      .sort((a, b) => b.records.length - a.records.length)
      .slice(0, 50)
      .map((s) => ({ school_name: s.name, school_slug: s.slug, records: s.records }));
  }, [allComputedRecords]);

  // School record books (for school records tab)
  const filteredSchoolBooks = useMemo(() => {
    if (!schoolSearch.trim()) return schoolRecordBooks;
    const q = schoolSearch.toLowerCase();
    return schoolRecordBooks.filter((s) => s.school_name.toLowerCase().includes(q));
  }, [schoolRecordBooks, schoolSearch]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      const curatedCount = recordsInEra.filter((r) => r.category === cat).length;
      const computedCount = computedInEra.filter((r) => r.stat_category === cat).length;
      counts[cat] = curatedCount + computedCount;
    }
    return counts;
  }, [categories, recordsInEra, computedInEra]);

  // Check if there's any data at all
  const hasAnyData = curatedRecords.length > 0 || allComputedRecords.length > 0;

  if (!hasAnyData) {
    return (
      <div style={{
        textAlign: "center",
        padding: "64px 24px",
        borderRadius: 12,
        border: "2px solid rgba(240, 165, 0, 0.2)",
        background: "#0a1628",
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
        <h3 className="psp-h3 text-white" style={{ marginBottom: 12 }}>
          Coming Soon
        </h3>
        <p style={{
          fontSize: 18,
          color: "#d1d5db",
          marginBottom: 24,
          maxWidth: 500,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          We're building out {sportName.toLowerCase()} records. Check back soon!
        </p>
        <Link
          href={`/${sport}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            background: sportColor,
            color: "var(--psp-navy, #0a1628)",
            textDecoration: "none",
            transition: "opacity 200ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Back to {sportName} Hub
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Record of the Day Hero */}
      {recordOfTheDay && <RecordOfTheDayHero record={recordOfTheDay} sport={sport} sportColor={sportColor} />}

      {/* Category Pills Navigation */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          overflowX: "auto",
          paddingBottom: 8,
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        {categories.map((cat) => {
          const count = categoryCounts[cat] || 0;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveStat(null);
                setActiveScope(null);
                setCuratedPage(1);
              }}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: isActive ? "var(--psp-navy, #0a1628)" : "var(--psp-navy, #0a1628)",
                background: isActive ? "var(--psp-gold, #f0a500)" : "#f3f4f6",
                border: `2px solid ${isActive ? "var(--psp-gold, #f0a500)" : "transparent"}`,
                borderRadius: 20,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 200ms ease",
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              }}
            >
              {cat} <span style={{ marginLeft: 6, opacity: 0.85 }}>({count})</span>
            </button>
          );
        })}
        <button
          onClick={() => { setActiveCategory("__schools__"); setCuratedPage(1); }}
          style={{
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 600,
            color: activeCategory === "__schools__" ? "var(--psp-navy, #0a1628)" : "var(--psp-navy, #0a1628)",
            background: activeCategory === "__schools__" ? "var(--psp-gold, #f0a500)" : "#f3f4f6",
            border: `2px solid ${activeCategory === "__schools__" ? "var(--psp-gold, #f0a500)" : "transparent"}`,
            borderRadius: 20,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 200ms ease",
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          }}
        >
          🏫 School Records ({schoolRecordBooks.length})
        </button>
      </div>

      {/* Filters Bar (Era) */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          padding: "12px 16px",
          background: "#f9fafb",
          borderRadius: 8,
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginRight: 8, textTransform: "uppercase" }}>
            Era
          </label>
          <select
            value={eraFilter}
            onChange={(e) => { setEraFilter(e.target.value); setCuratedPage(1); }}
            style={{
              padding: "6px 10px",
              fontSize: 13,
              border: "1px solid #e5e7eb",
              borderRadius: 4,
              background: "#fff",
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            }}
          >
            {YEAR_ERAS.map((e) => (
              <option key={e.label} value={e.label}>
                {e.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* School Records Tab */}
      {activeCategory === "__schools__" && (
        <SchoolRecordsTab
          schoolBooks={filteredSchoolBooks}
          totalSchools={schoolRecordBooks.length}
          searchValue={schoolSearch}
          onSearch={setSchoolSearch}
          sport={sport}
          sportColor={sportColor}
        />
      )}

      {/* Regular Records Display */}
      {activeCategory && activeCategory !== "__schools__" && (
        <>
          {/* Fix #1: Stat sub-tabs within category */}
          {statsInCategory.length > 1 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase" }}>
                Stat
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", overflowX: "auto", paddingBottom: 4 }}>
                {statsInCategory.map((stat) => {
                  const isActive = activeStatForDisplay === stat;
                  return (
                    <button
                      key={stat}
                      onClick={() => { setActiveStat(stat); setCuratedPage(1); }}
                      style={{
                        padding: "6px 12px",
                        fontSize: 12,
                        fontWeight: 500,
                        color: isActive ? "var(--psp-navy, #0a1628)" : "#6b7280",
                        background: isActive ? "var(--psp-gold, #f0a500)" : "#f3f4f6",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        transition: "all 150ms ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {stat}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scope Filter Pills (for curated records) */}
          {availableScopes.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase" }}>
                Scope
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {availableScopes.map((scope) => {
                  const isActive = currentScope === scope;
                  return (
                    <button
                      key={scope}
                      onClick={() => { setActiveScope(scope); setActiveStat(null); setCuratedPage(1); }}
                      style={{
                        padding: "6px 12px",
                        fontSize: 12,
                        fontWeight: 500,
                        color: isActive ? "#fff" : "#6b7280",
                        background: isActive ? scopeColor(scope) : "#f3f4f6",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        transition: "all 150ms ease",
                      }}
                    >
                      {scopeLabel(scope)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fix #4: Sequential layout (Leaderboard first, Archive below) */}
          {/* Computed Leaderboards */}
          <div style={{ marginBottom: 40 }}>
            <h3 className="psp-h3" style={{ marginBottom: 12 }}>
              {activeStatForDisplay ? `${activeStatForDisplay} Leaderboard` : `${initialCategory} Leaderboard`}
            </h3>
            {leaderboardRecords.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--psp-navy, #0a1628)" }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#6b7280", fontSize: 11 }}>
                        #
                      </th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#6b7280", fontSize: 11 }}>
                        Player
                      </th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#6b7280", fontSize: 11 }}>
                        School
                      </th>
                      {/* Fix #3: Show actual stat name instead of "Value" */}
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#6b7280", fontSize: 11 }}>
                        Scope
                      </th>
                      <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: "#6b7280", fontSize: 11 }}>
                        {activeStatForDisplay || "Value"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardRecords.map((rec, idx) => {
                      const rank = idx + 1;
                      const bgColor =
                        rank === 1 ? "rgba(240, 165, 0, 0.1)" : rank === 2 ? "rgba(192, 192, 192, 0.05)" : rank === 3 ? "rgba(205, 127, 50, 0.05)" : "transparent";
                      return (
                        <tr key={`${rec.player_slug}-${rec.scope}-${rec.rank}`} style={{ borderBottom: "1px solid #f3f4f6", background: bgColor }}>
                          <td style={{ padding: "10px 12px", fontWeight: 700, color: rank <= 3 ? sportColor : "#9ca3af" }}>
                            {rank <= 3 ? (["🥇", "🥈", "🥉"][rank - 1] + " ") : ""}
                            {rank}
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <Link
                              href={`/${sport}/players/${rec.player_slug}`}
                              style={{ color: "var(--psp-navy, #0a1628)", textDecoration: "none", fontWeight: 500 }}
                            >
                              {rec.player_name}
                            </Link>
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280" }}>
                            <Link
                              href={`/${sport}/schools/${rec.school_slug}`}
                              style={{ color: "var(--psp-gold, #f0a500)", textDecoration: "none" }}
                            >
                              {rec.school_name}
                            </Link>
                          </td>
                          {/* Fix #5: Add career/season scope badge */}
                          <td style={{ padding: "10px 12px" }}>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                padding: "2px 6px",
                                background: `${scopeColor(rec.scope)}20`,
                                color: scopeColor(rec.scope),
                                borderRadius: 3,
                                textTransform: "uppercase",
                              }}
                            >
                              {rec.scope}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: sportColor }}>
                            {rec.display_value}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
                <p>No records available for this stat</p>
              </div>
            )}
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 8px",
                background: "#3b82f618",
                color: "#3b82f6",
                borderRadius: 4,
                marginTop: 12,
                textTransform: "uppercase",
              }}
            >
              Stats DB
            </span>
          </div>

          {/* Curated Archive Records */}
          <div>
            <h3 className="psp-h3" style={{ marginBottom: 12 }}>
              Archive Records
            </h3>
            {curatedForCategory.length > 0 ? (
              <>
                <div style={{ display: "grid", gap: 12 }}>
                  {curatedForCategory
                    .slice((curatedPage - 1) * RECORDS_PER_PAGE, curatedPage * RECORDS_PER_PAGE)
                    .map((rec) => (
                      <CuratedRecordCard key={rec.id} record={rec} sport={sport} sportColor={sportColor} />
                    ))}
                </div>
                {curatedForCategory.length > RECORDS_PER_PAGE && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24 }}>
                    <button
                      onClick={() => setCuratedPage((p) => Math.max(1, p - 1))}
                      disabled={curatedPage === 1}
                      style={{
                        padding: "8px 20px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: curatedPage === 1 ? "#9ca3af" : "#fff",
                        background: curatedPage === 1 ? "#e5e7eb" : "var(--psp-navy, #0a1628)",
                        border: "none",
                        borderRadius: 6,
                        cursor: curatedPage === 1 ? "not-allowed" : "pointer",
                        transition: "all 200ms ease",
                        fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                      }}
                    >
                      Prev
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--psp-navy, #0a1628)" }}>
                      Page{" "}
                      <span style={{ color: "var(--psp-gold, #f0a500)" }}>{curatedPage}</span>
                      {" "}of {Math.ceil(curatedForCategory.length / RECORDS_PER_PAGE)}
                    </span>
                    <button
                      onClick={() => setCuratedPage((p) => Math.min(Math.ceil(curatedForCategory.length / RECORDS_PER_PAGE), p + 1))}
                      disabled={curatedPage >= Math.ceil(curatedForCategory.length / RECORDS_PER_PAGE)}
                      style={{
                        padding: "8px 20px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: curatedPage >= Math.ceil(curatedForCategory.length / RECORDS_PER_PAGE) ? "#9ca3af" : "#fff",
                        background: curatedPage >= Math.ceil(curatedForCategory.length / RECORDS_PER_PAGE) ? "#e5e7eb" : "var(--psp-navy, #0a1628)",
                        border: "none",
                        borderRadius: 6,
                        cursor: curatedPage >= Math.ceil(curatedForCategory.length / RECORDS_PER_PAGE) ? "not-allowed" : "pointer",
                        transition: "all 200ms ease",
                        fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📜</div>
                <p>No archive records available</p>
              </div>
            )}
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 8px",
                background: "#f0a50018",
                color: "#f0a500",
                borderRadius: 4,
                marginTop: 12,
                textTransform: "uppercase",
              }}
            >
              Archive
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// Record of the Day Hero
function RecordOfTheDayHero({
  record,
  sport,
  sportColor,
}: {
  record: CuratedRecord;
  sport: string;
  sportColor: string;
}) {
  const playerName = record.player_name || record.holder_name || "Unknown";
  const schoolName = record.school_name || record.holder_school || "Unknown";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, var(--psp-navy, #0a1628) 0%, var(--psp-navy, #0a1628) 80%, var(--psp-blue, #3b82f6) 100%)",
        border: `3px solid var(--psp-gold, #f0a500)`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 32,
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--psp-gold, #f0a500)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            📜 Record of the Day
          </div>
          <h2 className="psp-h1" style={{ margin: "0 0 12px 0" }}>
            {record.record_value || record.record_number?.toLocaleString() || "Record"}
          </h2>
          <div style={{ fontSize: 16, marginBottom: 12 }}>
            {record.player_slug ? (
              <Link
                href={`/${sport}/players/${record.player_slug}`}
                style={{ color: "white", textDecoration: "none", fontWeight: 600, cursor: "pointer" }}
              >
                {playerName}
              </Link>
            ) : (
              <span style={{ fontWeight: 600 }}>{playerName}</span>
            )}
            <span style={{ color: "rgba(255,255,255,0.7)" }}> — </span>
            <Link
              href={`/${sport}/schools/${record.school_slug}`}
              style={{ color: "var(--psp-gold, #f0a500)", textDecoration: "none", fontWeight: 600 }}
            >
              {schoolName}
            </Link>
            {record.year_set && <span style={{ color: "rgba(255,255,255,0.7)" }}> ({record.year_set})</span>}
          </div>
          {record.description && (
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
              {record.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Curated Record Card
function CuratedRecordCard({
  record,
  sport,
  sportColor,
}: {
  record: CuratedRecord;
  sport: string;
  sportColor: string;
}) {
  const playerName = record.player_name || record.holder_name || "Unknown";
  const schoolName = record.school_name || record.holder_school || "";
  const isTeam = TEAM_CATEGORIES.has(record.category || "");

  return (
    <div
      style={{
        padding: 12,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        fontSize: 13,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: "var(--psp-navy, #0a1628)", marginBottom: 4 }}>
            {record.subcategory || record.category}
            {record.scope && (
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 6px",
                  background: `${scopeColor(record.scope)}18`,
                  color: scopeColor(record.scope),
                  borderRadius: 3,
                  textTransform: "uppercase",
                }}
              >
                {scopeLabel(record.scope)}
              </span>
            )}
          </div>
          <div style={{ color: "#6b7280", marginBottom: 4 }}>
            {isTeam ? (
              <>
                {record.school_slug ? (
                  <Link href={`/${sport}/schools/${record.school_slug}`} style={{ color: "var(--psp-navy)", fontWeight: 500, textDecoration: "none" }}>
                    {schoolName}
                  </Link>
                ) : (
                  <span style={{ fontWeight: 500 }}>{schoolName}</span>
                )}
              </>
            ) : (
              <>
                {record.player_slug ? (
                  <Link href={`/${sport}/players/${record.player_slug}`} style={{ color: "var(--psp-navy)", fontWeight: 500, textDecoration: "none" }}>
                    {playerName}
                  </Link>
                ) : (
                  <span style={{ fontWeight: 500 }}>{playerName}</span>
                )}
                {schoolName && " — "}
                {schoolName && (
                  <Link href={`/${sport}/schools/${record.school_slug}`} style={{ color: "var(--psp-gold, #f0a500)", textDecoration: "none" }}>
                    {schoolName}
                  </Link>
                )}
              </>
            )}
            {record.year_set && <span style={{ color: "#9ca3af" }}> ({record.year_set})</span>}
          </div>
          {record.description && <div style={{ fontSize: 11, color: "#9ca3af" }}>{record.description}</div>}
        </div>
        <div className="font-bebas text-lg tracking-wide" style={{ color: sportColor, whiteSpace: "nowrap" }}>
          {record.record_value || record.record_number?.toLocaleString() || "—"}
        </div>
      </div>
    </div>
  );
}

// School Records Tab
function SchoolRecordsTab({
  schoolBooks,
  totalSchools,
  searchValue,
  onSearch,
  sport,
  sportColor,
}: {
  schoolBooks: SchoolRecordBook[];
  totalSchools: number;
  searchValue: string;
  onSearch: (v: string) => void;
  sport: string;
  sportColor: string;
}) {
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
            {schoolBooks.length} of {totalSchools} schools
          </span>
        )}
      </div>

      {/* School cards grid */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {schoolBooks.map((schoolBook) => (
          <div key={schoolBook.school_slug} style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            {/* Header */}
            <div
              style={{
                padding: "12px 16px",
                background: "var(--psp-navy, #0a1628)",
                borderBottom: `3px solid ${sportColor}`,
              }}
            >
              <h3 className="psp-h4 text-white">
                <Link href={`/${sport}/schools/${schoolBook.school_slug}`} style={{ color: "#fff", textDecoration: "none" }}>
                  {schoolBook.school_name} →
                </Link>
              </h3>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{schoolBook.records.length} records</span>
            </div>

            {/* Record table */}
            <div style={{ padding: "8px 0" }}>
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <th style={{ padding: "6px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>
                      Stat
                    </th>
                    <th style={{ padding: "6px 12px", textAlign: "right", fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schoolBook.records.slice(0, 5).map((rec) => (
                    <tr key={`${rec.player_slug}-${rec.scope}`} style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "6px 12px" }}>
                        <span style={{ fontWeight: 500 }}>{rec.stat_name}</span>
                      </td>
                      <td style={{ padding: "6px 12px", textAlign: "right", fontWeight: 700, color: sportColor }}>
                        {rec.display_value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {schoolBooks.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <p>No schools match "{searchValue}"</p>
        </div>
      )}
    </div>
  );
}
