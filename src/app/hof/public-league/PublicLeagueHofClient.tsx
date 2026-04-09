"use client";

import { useState, useMemo, useEffect } from "react";
import type { PublicLeagueInductee } from "./page";
import InducteeCard from "./InducteeCard";
import PublicLeagueHero from "./PublicLeagueHero";

type ViewMode = "grid" | "school";

/* ─── Props ─── */
interface Props {
  inductees: PublicLeagueInductee[];
  sports: string[];
  schools: string[];
  decades: string[];
}

export default function PublicLeagueHofClient({
  inductees,
  sports,
  schools,
  decades,
}: Props) {
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [decadeFilter, setDecadeFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleCount, setVisibleCount] = useState(24);

  /* Reset visible count when any filter changes */
  useEffect(() => {
    setVisibleCount(24);
  }, [search, sportFilter, schoolFilter, decadeFilter]);

  const filtered = useMemo(() => {
    let list = inductees;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.high_school && i.high_school.toLowerCase().includes(q)) ||
          (i.school_name && i.school_name.toLowerCase().includes(q))
      );
    }

    if (sportFilter) {
      list = list.filter((i) => i.sport === sportFilter);
    }

    if (schoolFilter) {
      list = list.filter(
        (i) =>
          i.school_name === schoolFilter || i.high_school === schoolFilter
      );
    }

    if (decadeFilter) {
      const decadeStart = parseInt(decadeFilter.replace("s", ""), 10);
      list = list.filter(
        (i) =>
          (i.graduation_year ?? 0) >= decadeStart &&
          (i.graduation_year ?? 0) < decadeStart + 10
      );
    }

    return list;
  }, [inductees, search, sportFilter, schoolFilter, decadeFilter]);

  /* Group by school for "By School" view */
  const groupedBySchool = useMemo(() => {
    if (viewMode !== "school") return new Map<string, PublicLeagueInductee[]>();
    const map = new Map<string, PublicLeagueInductee[]>();
    for (const ind of filtered) {
      const key = ind.school_name ?? ind.high_school ?? "Unknown School";
      const arr = map.get(key);
      if (arr) {
        arr.push(ind);
      } else {
        map.set(key, [ind]);
      }
    }
    /* Sort groups by count desc, then alpha */
    const sorted = [...map.entries()].sort((a, b) => {
      if (b[1].length !== a[1].length) return b[1].length - a[1].length;
      return a[0].localeCompare(b[0]);
    });
    return new Map(sorted);
  }, [filtered, viewMode]);

  const hasData = inductees.length > 0;
  const hasFiltered = filtered.length > 0;
  const activeFilterCount =
    [sportFilter, schoolFilter, decadeFilter].filter(Boolean).length +
    (search ? 1 : 0);

  return (
    <div style={{ background: "var(--psp-navy)", minHeight: "100vh" }}>
      <PublicLeagueHero />

      {/* ══════════ FILTER BAR ══════════ */}
      {hasData && (
        <section
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "2.5rem 1rem 0",
            position: "sticky",
            top: "64px",
            zIndex: 10,
            background: "var(--psp-navy)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            {/* Search */}
            <div style={{ flex: "1 1 220px", minWidth: "180px" }}>
              <input
                type="text"
                placeholder="Search by name or school..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.625rem 1rem",
                  borderRadius: "var(--radius-md, 8px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "var(--psp-navy-mid)",
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
              />
            </div>

            {/* Sport */}
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Sports</option>
              {sports.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* School */}
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Schools</option>
              {schools.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Decade */}
            <select
              value={decadeFilter}
              onChange={(e) => setDecadeFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Decades</option>
              {decades.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Reset */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setSearch("");
                  setSportFilter("");
                  setSchoolFilter("");
                  setDecadeFilter("");
                }}
                style={{
                  padding: "0.625rem 1rem",
                  borderRadius: "var(--radius-md, 8px)",
                  border: "1px solid rgba(240, 165, 0, 0.3)",
                  background: "transparent",
                  color: "var(--psp-gold)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Result count + view toggle row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
            {/* Prominent result count */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.5rem",
                  color: "var(--psp-gold)",
                  lineHeight: 1,
                }}
              >
                {filtered.length}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                }}
              >
                inductee{filtered.length !== 1 ? "s" : ""}
                {activeFilterCount > 0 && (
                  <span style={{ color: "#64748b" }}>
                    {" "}
                    of {inductees.length} total
                  </span>
                )}
              </span>
            </div>

            {/* View toggle */}
            <div
              style={{
                display: "flex",
                borderRadius: "var(--radius-md, 8px)",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  padding: "0.4rem 0.85rem",
                  background:
                    viewMode === "grid"
                      ? "rgba(240, 165, 0, 0.2)"
                      : "var(--psp-navy-mid)",
                  color:
                    viewMode === "grid" ? "var(--psp-gold)" : "#64748b",
                  border: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    verticalAlign: "middle",
                    marginRight: "0.35rem",
                  }}
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                Grid
              </button>
              <button
                onClick={() => setViewMode("school")}
                style={{
                  padding: "0.4rem 0.85rem",
                  background:
                    viewMode === "school"
                      ? "rgba(240, 165, 0, 0.2)"
                      : "var(--psp-navy-mid)",
                  color:
                    viewMode === "school" ? "var(--psp-gold)" : "#64748b",
                  border: "none",
                  borderLeft: "1px solid rgba(255,255,255,0.12)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    verticalAlign: "middle",
                    marginRight: "0.35rem",
                  }}
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                By School
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ══════════ INDUCTEE GRID / SCHOOL VIEW ══════════ */}
      <section
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "1.5rem 1rem 3rem",
        }}
      >
        {hasData && hasFiltered && viewMode === "grid" && (
          <>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "#64748b",
                margin: "0 0 0.75rem",
              }}
            >
              Showing {Math.min(visibleCount, filtered.length)} of{" "}
              {filtered.length} inductee{filtered.length !== 1 ? "s" : ""}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1rem",
              }}
            >
              {filtered.slice(0, visibleCount).map((inductee) => (
                <InducteeCard key={inductee.id} inductee={inductee} />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  onClick={() => setVisibleCount((c) => c + 24)}
                  style={{
                    padding: "0.75rem 2rem",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "1px solid rgba(240, 165, 0, 0.3)",
                    background: "rgba(240, 165, 0, 0.1)",
                    color: "var(--psp-gold)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}

        {hasData && hasFiltered && viewMode === "school" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[...groupedBySchool.entries()].map(([schoolName, members]) => (
              <div key={schoolName}>
                {/* School group header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                    paddingBottom: "0.5rem",
                    borderBottom: "1px solid rgba(240, 165, 0, 0.2)",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.35rem",
                      color: "var(--psp-gold)",
                      letterSpacing: "0.03em",
                      margin: 0,
                    }}
                  >
                    {schoolName}
                  </h2>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#94a3b8",
                      background: "rgba(255,255,255,0.06)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {members.length}
                  </span>
                </div>
                {/* School group grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {members.map((inductee) => (
                    <InducteeCard key={inductee.id} inductee={inductee} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {hasData && !hasFiltered && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1rem",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.1rem",
                color: "#94a3b8",
                marginBottom: "0.5rem",
              }}
            >
              No inductees match your filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSportFilter("");
                setSchoolFilter("");
                setDecadeFilter("");
              }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                color: "var(--psp-gold)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Empty State ── */}
        {!hasData && (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 1rem",
              maxWidth: "540px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(240, 165, 0, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                fontSize: "1.5rem",
              }}
            >
              {"\uD83C\uDFC6"}
            </div>
            <h2
              className="psp-h2"
              style={{
                color: "#fff",
                marginBottom: "1rem",
              }}
            >
              Coming Soon
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                color: "#94a3b8",
                lineHeight: 1.7,
              }}
            >
              We&rsquo;re building the most comprehensive Public League Hall of
              Fame database. Check back soon &mdash; or help us by submitting
              names.
            </p>
          </div>
        )}
      </section>

      {/* ══════════ DISCLAIMER ══════════ */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "2rem 1rem 3rem",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8rem",
            color: "#64748b",
            textAlign: "center",
            maxWidth: "640px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          PSP displays athletes only. Coaches honored in the original Public
          League HOF are acknowledged but not profiled here.
        </p>
      </section>

      {/* ══════════ SCOPED STYLES ══════════ */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .pl-hof-card {
              transition: border-color 0.2s ease, box-shadow 0.2s ease;
            }
            .pl-hof-card:hover {
              border-color: var(--psp-gold) !important;
              box-shadow: 0 0 16px rgba(240, 165, 0, 0.08);
            }
          `,
        }}
      />
    </div>
  );
}

/* ─── Shared select style ─── */
const selectStyle: React.CSSProperties = {
  padding: "0.625rem 1rem",
  borderRadius: "var(--radius-md, 8px)",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "var(--psp-navy-mid)",
  color: "#fff",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.875rem",
  outline: "none",
  minWidth: "140px",
  cursor: "pointer",
};
