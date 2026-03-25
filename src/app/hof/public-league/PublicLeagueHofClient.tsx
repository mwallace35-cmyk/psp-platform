"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PublicLeagueInductee } from "./page";

/* ─── Sport emoji map (display names used in the DB sport column) ─── */
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

  const hasData = inductees.length > 0;
  const hasFiltered = filtered.length > 0;
  const activeFilterCount = [sportFilter, schoolFilter, decadeFilter].filter(Boolean).length + (search ? 1 : 0);

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
                placeholder="Search by name..."
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
          padding: "1.5rem 1rem 3rem",
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

/* ─── Inductee Card ─── */
function InducteeCard({ inductee }: { inductee: PublicLeagueInductee }) {
  const schoolDisplay = inductee.school_name ?? inductee.high_school;

  const card = (
    <div
      className="pl-hof-card"
      style={{
        background: "var(--psp-navy-mid)",
        borderRadius: "var(--radius-lg, 12px)",
        padding: "1.25rem 1.25rem 1.25rem 1.5rem",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: "4px solid #ea580c",
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
              color: "#ea580c",
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
