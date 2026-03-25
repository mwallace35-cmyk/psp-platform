"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PublicLeagueInductee } from "./page";

/* ─── Sport emoji map ─── */
const SPORT_EMOJI: Record<string, string> = {
  Football: "\uD83C\uDFC8",
  Basketball: "\uD83C\uDFC0",
  Baseball: "\u26BE",
  Track: "\uD83C\uDFC3",
  "Track & Field": "\uD83C\uDFC3",
  "Track and Field": "\uD83C\uDFC3",
  Soccer: "\u26BD",
  Lacrosse: "\uD83E\uDD4D",
  Wrestling: "\uD83E\uDD3C",
  Swimming: "\uD83C\uDFCA",
  Tennis: "\uD83C\uDFBE",
  Golf: "\u26F3",
  Volleyball: "\uD83C\uDFD0",
  Softball: "\uD83E\uDD4E",
  "Cross Country": "\uD83C\uDFC3",
  Boxing: "\uD83E\uDD4A",
};

/* ─── Sport color map for avatar backgrounds ─── */
const SPORT_COLOR: Record<string, string> = {
  Football: "#16a34a",
  Basketball: "#3b82f6",
  Baseball: "#ea580c",
  Track: "#7c3aed",
  "Track & Field": "#7c3aed",
  "Track and Field": "#7c3aed",
  Soccer: "#059669",
  Lacrosse: "#0891b2",
  Wrestling: "#ca8a04",
  Swimming: "#0ea5e9",
  Tennis: "#84cc16",
  Golf: "#22c55e",
  Volleyball: "#f59e0b",
  Softball: "#f97316",
  "Cross Country": "#8b5cf6",
  Boxing: "#dc2626",
};

function getSportEmoji(sport: string | null): string {
  if (!sport) return "\uD83C\uDFC6";
  return SPORT_EMOJI[sport] ?? "\uD83C\uDFC6";
}

function getSportColor(sport: string | null): string {
  if (!sport) return "#ea580c";
  return SPORT_COLOR[sport] ?? "#ea580c";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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
          i.induction_year >= decadeStart &&
          i.induction_year < decadeStart + 10
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
      {/* ══════════ HERO ══════════ */}
      <section
        style={{
          background:
            "linear-gradient(180deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)",
          position: "relative",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "var(--psp-gold)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            background: "rgba(234, 88, 12, 0.15)",
            color: "#ea580c",
            padding: "0.375rem 0.875rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "1.25rem",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2 L15 8 L22 8 L17 13 L19 20 L12 16 L5 20 L7 13 L2 8 L9 8 Z" />
          </svg>
          PUBLIC LEAGUE LEGEND
        </div>

        <h1
          className="psp-h1-lg"
          style={{
            color: "var(--psp-gold)",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Public League Hall of Fame
        </h1>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
            color: "#e2e8f0",
            maxWidth: "640px",
            margin: "1rem auto 0",
            lineHeight: 1.6,
          }}
        >
          Built on the original Hall of Fame created by Jon &ldquo;Duck&rdquo;
          Gray and maintained by Ted Silary
        </p>
      </section>

      {/* ══════════ TED SILARY TRIBUTE CARD ══════════ */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2.5rem 1rem 0",
        }}
      >
        <div
          style={{
            background: "var(--psp-navy-mid)",
            border: "1px solid rgba(240, 165, 0, 0.25)",
            borderRadius: "var(--radius-lg, 12px)",
            padding: "2rem 1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
              color: "var(--psp-gold)",
              letterSpacing: "0.04em",
              margin: "0 0 0.5rem",
            }}
          >
            Ted Silary
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              color: "#94a3b8",
              margin: "0 0 1.25rem",
              lineHeight: 1.5,
            }}
          >
            Philadelphia Daily News, 1977&ndash;2013 &mdash; City All Star
            Chapter Inductee 1993
          </p>

          <div
            style={{
              width: "40px",
              height: "2px",
              background: "var(--psp-gold)",
              margin: "0 auto 1.25rem",
              borderRadius: "2px",
            }}
          />

          <blockquote
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              fontStyle: "italic",
              color: "#e2e8f0",
              lineHeight: 1.7,
              margin: 0,
              padding: 0,
              borderLeft: "none",
              maxWidth: "520px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            &ldquo;He went to every game, remembered every name, and made every
            kid feel like they mattered.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ══════════ ATTRIBUTION ══════════ */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2rem 1rem 0",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            color: "#94a3b8",
            lineHeight: 1.7,
            textAlign: "left",
            maxWidth: "640px",
            margin: "0 auto",
            borderLeft: "3px solid var(--psp-gold)",
            paddingLeft: "1rem",
          }}
        >
          The PSP Public League Hall of Fame is built on the original Hall of
          Fame created by Jon &ldquo;Duck&rdquo; Gray and maintained by
          legendary Philadelphia Daily News sportswriter Ted Silary.
        </p>
      </section>

      {/* ══════════ FILTER BAR ══════════ */}
      {hasData && (
        <section
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "2.5rem 1rem 0",
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1rem",
            }}
          >
            {filtered.map((inductee) => (
              <InducteeCard key={inductee.id} inductee={inductee} />
            ))}
          </div>
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
                      "repeat(auto-fill, minmax(340px, 1fr))",
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

/* ─── Redesigned Inductee Card ─── */
function InducteeCard({ inductee }: { inductee: PublicLeagueInductee }) {
  const schoolDisplay = inductee.school_name ?? inductee.high_school;
  const avatarColor = getSportColor(inductee.sport);
  const initials = getInitials(inductee.name);
  const descriptionText = inductee.achievements ?? inductee.bio ?? null;

  /* Build the name element -- linked if player_id exists */
  const nameEl = inductee.player_id ? (
    <Link
      href={`/players/${inductee.player_id}`}
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "1.25rem",
        color: "#fff",
        letterSpacing: "0.02em",
        lineHeight: 1.2,
        textDecoration: "none",
      }}
    >
      {inductee.name}
    </Link>
  ) : (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "1.25rem",
        color: "#fff",
        letterSpacing: "0.02em",
        lineHeight: 1.2,
      }}
    >
      {inductee.name}
    </span>
  );

  return (
    <div
      className="pl-hof-card"
      style={{
        background: "var(--psp-navy-mid)",
        borderRadius: "var(--radius-lg, 12px)",
        padding: "1.25rem",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: "4px solid #ea580c",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        minHeight: "180px",
      }}
    >
      {/* ── Top row: Avatar + Details ── */}
      <div style={{ display: "flex", gap: "0.875rem" }}>
        {/* Initials avatar */}
        <div
          style={{
            width: "48px",
            height: "48px",
            minWidth: "48px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.1rem",
            color: "#fff",
            letterSpacing: "0.04em",
          }}
        >
          {initials}
        </div>

        {/* Right side details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {nameEl}
            {/* Legend badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.2rem",
                background: "rgba(234, 88, 12, 0.15)",
                color: "#ea580c",
                padding: "0.15rem 0.45rem",
                borderRadius: "4px",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
                flexShrink: 0,
                lineHeight: 1.4,
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              LEGEND
            </span>
          </div>

          {/* School */}
          {schoolDisplay && (
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem",
                color: "#94a3b8",
                margin: "0.25rem 0 0",
                lineHeight: 1.3,
              }}
            >
              {inductee.school_slug ? (
                <Link
                  href={`/schools/${inductee.school_slug}`}
                  style={{
                    color: "#94a3b8",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(148,163,184,0.3)",
                    textUnderlineOffset: "2px",
                  }}
                >
                  {schoolDisplay}
                </Link>
              ) : (
                schoolDisplay
              )}
            </p>
          )}

          {/* Sport + Position line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "0.35rem",
              flexWrap: "wrap",
            }}
          >
            {inductee.sport && (
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#ea580c",
                }}
              >
                {getSportEmoji(inductee.sport)}{" "}
                {inductee.sport}
              </span>
            )}
            {inductee.position && (
              <>
                <span style={{ color: "#475569", fontSize: "0.7rem" }}>
                  |
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.75rem",
                    color: "#cbd5e1",
                  }}
                >
                  {inductee.position}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Achievements / Bio snippet ── */}
      {descriptionText && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.78rem",
            color: "#94a3b8",
            margin: "0.75rem 0 0",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {descriptionText}
        </p>
      )}

      {/* ── Professional career ── */}
      {inductee.professional_career && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            color: "#3b82f6",
            margin: "0.4rem 0 0",
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {inductee.professional_career}
        </p>
      )}

      {/* ── Bottom row: Class of + Induction year ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          marginTop: "auto",
          paddingTop: "0.75rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {inductee.graduation_year ? (
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#cbd5e1",
            }}
          >
            Class of {inductee.graduation_year}
          </span>
        ) : (
          <span />
        )}
        <span
          style={{
            display: "inline-block",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#64748b",
            background: "rgba(255,255,255,0.05)",
            padding: "0.2rem 0.5rem",
            borderRadius: "4px",
            letterSpacing: "0.03em",
          }}
        >
          Inducted {inductee.induction_year}
        </span>
      </div>
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
