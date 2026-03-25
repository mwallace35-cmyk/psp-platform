"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { CityAllStarInductee } from "./page";

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

function getSportEmoji(sport: string | null): string {
  if (!sport) return "\uD83C\uDFC6";
  return SPORT_EMOJI[sport] ?? "\uD83C\uDFC6";
}

/* ─── Props ─── */
interface Props {
  inductees: CityAllStarInductee[];
  sports: string[];
  schools: string[];
  years: number[];
}

export default function CityAllStarClient({
  inductees,
  sports,
  schools,
  years,
}: Props) {
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

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

    if (yearFilter) {
      const yr = parseInt(yearFilter, 10);
      list = list.filter((i) => i.induction_year === yr);
    }

    return list;
  }, [inductees, search, sportFilter, schoolFilter, yearFilter]);

  const hasData = inductees.length > 0;
  const hasFiltered = filtered.length > 0;
  const activeFilterCount =
    [sportFilter, schoolFilter, yearFilter].filter(Boolean).length +
    (search ? 1 : 0);

  function clearFilters() {
    setSearch("");
    setSportFilter("");
    setSchoolFilter("");
    setYearFilter("");
  }

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
            background: "rgba(240, 165, 0, 0.15)",
            color: "#f0a500",
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
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          CITY ALL STAR
        </div>

        <h1
          className="psp-h1-lg"
          style={{
            color: "var(--psp-gold)",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          PA Sports HOF &mdash; City All Star Chapter
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
          The Philadelphia City All Star Chapter of the Pennsylvania Sports Hall
          of Fame, celebrating multi-sport excellence since 1992.
        </p>
      </section>

      {/* ══════════ ATHLETE-ONLY NOTICE ══════════ */}
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
          PSP displays athletes only. For the complete inductee roster including
          coaches and media, visit{" "}
          <a
            href="https://phillyhof.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--psp-gold)",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            phillyhof.org
          </a>
          .
        </p>
      </section>

      {/* ══════════ 2026 BANQUET MODULE ══════════ */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2rem 1rem 0",
        }}
      >
        <div
          style={{
            background: "var(--psp-navy-mid)",
            border: "2px solid rgba(240, 165, 0, 0.35)",
            borderRadius: "var(--radius-lg, 12px)",
            padding: "2rem 1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              color: "var(--psp-gold)",
              letterSpacing: "0.04em",
              margin: "0 0 0.75rem",
            }}
          >
            2026 Annual Banquet &mdash; April 16, 2026
          </p>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
              color: "#e2e8f0",
              margin: "0 0 0.5rem",
              lineHeight: 1.5,
            }}
          >
            Fraternal Order of Police Lodge 5, 11630 Caroline Road
          </p>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#94a3b8",
              margin: "0 0 0.5rem",
              lineHeight: 1.5,
            }}
          >
            Doors 5:30pm &middot; Cocktails 5:30-6:45pm &middot; Ceremony
            7:00pm
          </p>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#94a3b8",
              margin: "0 0 1.25rem",
              lineHeight: 1.5,
            }}
          >
            Tickets: $85 advance / $90 at door
          </p>

          <a
            href="https://phillyhof.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--psp-gold)",
              textDecoration: "none",
            }}
          >
            Visit phillyhof.org for tickets
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
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

            {/* Year */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
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

            {/* Reset */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
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

          {/* Result count */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              color: "#64748b",
              margin: "0.75rem 0 0",
            }}
          >
            {filtered.length} inductee{filtered.length !== 1 ? "s" : ""}
            {activeFilterCount > 0 && ` (filtered from ${inductees.length})`}
          </p>
        </section>
      )}

      {/* ══════════ INDUCTEE GRID ══════════ */}
      <section
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "1.5rem 1rem 2rem",
        }}
      >
        {hasData && hasFiltered && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {filtered.map((inductee) => (
              <InducteeCard key={inductee.id} inductee={inductee} />
            ))}
          </div>
        )}

        {hasData && !hasFiltered && (
          <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
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
              onClick={clearFilters}
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
              style={{ color: "#fff", marginBottom: "1rem" }}
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
              We&rsquo;re building the City All Star Chapter inductee database.
              Check back soon for the complete roster of athlete inductees from
              1992 to present.
            </p>
          </div>
        )}
      </section>

      {/* ══════════ CITY ALL-STAR FOOTBALL GAME MODULE ══════════ */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "0 1rem 2.5rem",
        }}
      >
        <Link
          href="/football/city-all-star-game"
          style={{ textDecoration: "none", display: "block" }}
        >
          <div
            className="cas-football-card"
            style={{
              background: "var(--psp-navy-mid)",
              border: "1px solid rgba(240, 165, 0, 0.2)",
              borderRadius: "var(--radius-lg, 12px)",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(22, 163, 100, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                flexShrink: 0,
              }}
            >
              {"\uD83C\uDFC8"}
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.15rem",
                  color: "#fff",
                  margin: "0 0 0.25rem",
                  letterSpacing: "0.03em",
                }}
              >
                City All-Star Football Game
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Rosters, results, and history of the annual City All-Star
                football showcase.
              </p>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--psp-gold)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Link>
      </section>

      {/* ══════════ DATA GAP NOTICE ══════════ */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "0 1rem 2.5rem",
        }}
      >
        <div
          style={{
            background: "rgba(240, 165, 0, 0.06)",
            border: "1px solid rgba(240, 165, 0, 0.15)",
            borderRadius: "var(--radius-md, 8px)",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              fontSize: "1rem",
              flexShrink: 0,
              marginTop: "1px",
            }}
          >
            {"\u26A0\uFE0F"}
          </span>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              color: "#94a3b8",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Records for inductee classes 2001&ndash;2009 are not published on
            the official website. If you have information about these classes,
            please{" "}
            <Link
              href="/support"
              style={{
                color: "var(--psp-gold)",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              contact us
            </Link>
            .
          </p>
        </div>
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
          PSP displays athletes only. Coaches, media, and contributors honored
          by the City All Star Chapter are acknowledged but not profiled here.
        </p>
      </section>

      {/* ══════════ SCOPED STYLES ══════════ */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .cas-hof-card {
              transition: border-color 0.2s ease, box-shadow 0.2s ease;
            }
            .cas-hof-card:hover {
              border-color: var(--psp-gold) !important;
              box-shadow: 0 0 16px rgba(240, 165, 0, 0.08);
            }
            .cas-football-card:hover {
              border-color: var(--psp-gold) !important;
              box-shadow: 0 0 16px rgba(240, 165, 0, 0.08);
            }
          `,
        }}
      />
    </div>
  );
}

/* ─── Inductee Card ─── */
function InducteeCard({ inductee }: { inductee: CityAllStarInductee }) {
  const schoolDisplay = inductee.school_name ?? inductee.high_school;

  const card = (
    <div
      className="cas-hof-card"
      style={{
        background: "var(--psp-navy-mid)",
        borderRadius: "var(--radius-lg, 12px)",
        padding: "1.25rem 1.25rem 1.25rem 1.5rem",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: "4px solid var(--psp-gold)",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {/* Top row: name + emoji */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {inductee.name}
        </h3>
        <span
          style={{ fontSize: "1.1rem", flexShrink: 0 }}
          title={inductee.sport ?? ""}
        >
          {getSportEmoji(inductee.sport)}
        </span>
      </div>

      {/* School */}
      {schoolDisplay && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem",
            color: "#94a3b8",
            margin: 0,
            lineHeight: 1.4,
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

      {/* Bottom row: sport + year */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          marginTop: "auto",
        }}
      >
        {inductee.sport && (
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--psp-gold)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {inductee.sport}
          </span>
        )}
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#64748b",
            marginLeft: "auto",
          }}
        >
          Inducted {inductee.induction_year}
        </span>
      </div>
    </div>
  );

  /* Wrap in link if player_id exists */
  if (inductee.player_id) {
    return (
      <Link
        href={`/players/${inductee.player_id}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        {card}
      </Link>
    );
  }

  return card;
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
