"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useFollowedSchools } from "@/hooks/useFollowedSchools";

/* ------------------------------------------------------------------ */
/*  Top 30 Philadelphia high school programs                          */
/* ------------------------------------------------------------------ */
interface SchoolEntry {
  slug: string;
  name: string;
  league: "PCL" | "Public";
}

const SCHOOLS: SchoolEntry[] = [
  // PCL
  { slug: "roman-catholic", name: "Roman Catholic", league: "PCL" },
  { slug: "st-josephs-prep", name: "St. Joseph's Prep", league: "PCL" },
  { slug: "archbishop-wood", name: "Archbishop Wood", league: "PCL" },
  { slug: "neumann-goretti", name: "Neumann-Goretti", league: "PCL" },
  { slug: "la-salle", name: "La Salle", league: "PCL" },
  { slug: "father-judge", name: "Father Judge", league: "PCL" },
  { slug: "archbishop-carroll", name: "Archbishop Carroll", league: "PCL" },
  { slug: "archbishop-ryan", name: "Archbishop Ryan", league: "PCL" },
  { slug: "west-catholic", name: "West Catholic", league: "PCL" },
  { slug: "cardinal-ohara", name: "Cardinal O'Hara", league: "PCL" },
  { slug: "bonner-prendergast", name: "Bonner-Prendergast", league: "PCL" },
  { slug: "devon-prep", name: "Devon Prep", league: "PCL" },
  { slug: "conwell-egan", name: "Conwell-Egan", league: "PCL" },
  { slug: "lansdale-catholic", name: "Lansdale Catholic", league: "PCL" },
  // Public League
  { slug: "imhotep-charter", name: "Imhotep Charter", league: "Public" },
  { slug: "martin-luther-king", name: "Martin Luther King", league: "Public" },
  { slug: "bartram", name: "Bartram", league: "Public" },
  { slug: "overbrook", name: "Overbrook", league: "Public" },
  { slug: "simon-gratz", name: "Simon Gratz", league: "Public" },
  { slug: "central", name: "Central", league: "Public" },
  { slug: "northeast", name: "Northeast", league: "Public" },
  { slug: "frankford", name: "Frankford", league: "Public" },
  { slug: "south-philadelphia", name: "South Philadelphia", league: "Public" },
  { slug: "abraham-lincoln", name: "Abraham Lincoln", league: "Public" },
  { slug: "george-washington", name: "George Washington", league: "Public" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function FollowSchoolsModal() {
  const { followedSchools, toggleSchool, hasOnboarded, setOnboarded } =
    useFollowedSchools();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Show modal on first visit (after hydration)
  useEffect(() => {
    if (!hasOnboarded) {
      setOpen(true);
    }
  }, [hasOnboarded]);

  // Sync open state with <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Focus the search input after opening
      requestAnimationFrame(() => searchRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Handle escape key (native dialog handles this, but we need to sync state)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      handleDone();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDone = useCallback(() => {
    setOnboarded();
    setOpen(false);
  }, [setOnboarded]);

  // Filter schools
  const query = search.toLowerCase().trim();
  const filtered = query
    ? SCHOOLS.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.league.toLowerCase().includes(query)
      )
    : SCHOOLS;

  // Group by league for display
  const pclSchools = filtered.filter((s) => s.league === "PCL");
  const publicSchools = filtered.filter((s) => s.league === "Public");

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Follow Your Schools"
      style={{
        position: "fixed",
        inset: 0,
        maxWidth: "640px",
        width: "calc(100% - 2rem)",
        maxHeight: "min(85vh, 720px)",
        margin: "auto",
        padding: 0,
        border: "none",
        borderRadius: "var(--radius-lg)",
        background: "var(--psp-navy)",
        color: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.5rem 1.5rem 0",
          flexShrink: 0,
        }}
      >
        <h2
          className="psp-h1 text-[var(--psp-gold)]"
        >
          Follow Your Schools
        </h2>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: "0.95rem",
            color: "var(--psp-gray-400)",
            margin: "0.5rem 0 1rem",
            lineHeight: 1.4,
          }}
        >
          Select the schools you care about to personalize your experience
        </p>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--psp-gray-400)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            placeholder="Search schools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search schools"
            style={{
              width: "100%",
              padding: "0.75rem 0.75rem 0.75rem 2.5rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--psp-navy-light)",
              background: "var(--psp-navy-mid)",
              color: "#fff",
              fontSize: "0.9rem",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--psp-gold)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--psp-navy-light)";
            }}
          />
        </div>
      </div>

      {/* Scrollable school list */}
      <div
        role="group"
        aria-label="School selection"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 1.5rem",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {pclSchools.length > 0 && (
          <SchoolGroup
            label="Philadelphia Catholic League"
            schools={pclSchools}
            followedSchools={followedSchools}
            onToggle={toggleSchool}
          />
        )}
        {publicSchools.length > 0 && (
          <SchoolGroup
            label="Public League"
            schools={publicSchools}
            followedSchools={followedSchools}
            onToggle={toggleSchool}
          />
        )}
        {filtered.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "var(--psp-gray-400)",
              padding: "2rem 0",
              fontSize: "0.9rem",
            }}
          >
            No schools match &ldquo;{search}&rdquo;
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid var(--psp-navy-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            color: "var(--psp-gray-400)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          }}
        >
          {followedSchools.length === 0
            ? "No schools selected"
            : `${followedSchools.length} school${followedSchools.length !== 1 ? "s" : ""} selected`}
        </span>
        <button
          onClick={handleDone}
          className="font-bebas tracking-wider"
          style={{
            padding: "0.75rem 2rem",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: "var(--psp-gold)",
            color: "var(--psp-navy)",
            fontSize: "1.15rem",
            cursor: "pointer",
            fontWeight: 400,
            transition: "background 0.15s ease, transform 0.1s ease",
            minHeight: "44px",
            minWidth: "44px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--psp-gold-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--psp-gold)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Done
        </button>
      </div>

      {/* Backdrop style for <dialog>::backdrop */}
      <style>{`
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
      `}</style>
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  School Group Section                                               */
/* ------------------------------------------------------------------ */
function SchoolGroup({
  label,
  schools,
  followedSchools,
  onToggle,
}: {
  label: string;
  schools: SchoolEntry[];
  followedSchools: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3
        className="font-bebas text-sm uppercase tracking-widest"
        style={{
          color: "var(--psp-gold)",
          margin: "0 0 0.5rem",
          paddingBottom: "0.35rem",
          borderBottom: "1px solid var(--psp-navy-light)",
        }}
      >
        {label}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {schools.map((school) => {
          const active = followedSchools.includes(school.slug);
          return (
            <button
              key={school.slug}
              role="checkbox"
              aria-checked={active}
              aria-label={`Follow ${school.name}`}
              onClick={() => onToggle(school.slug)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 0.75rem",
                borderRadius: "var(--radius-md)",
                border: `2px solid ${active ? "var(--psp-gold)" : "var(--psp-navy-light)"}`,
                background: active
                  ? "rgba(240, 165, 0, 0.12)"
                  : "var(--psp-navy-mid)",
                color: active ? "var(--psp-gold)" : "var(--psp-gray-300)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: "0.85rem",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
                textAlign: "left",
                lineHeight: 1.3,
                minHeight: "44px",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = "var(--psp-gray-400)";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = "var(--psp-navy-light)";
                  e.currentTarget.style.color = "var(--psp-gray-300)";
                }
              }}
            >
              {/* Checkbox indicator */}
              <span
                aria-hidden="true"
                style={{
                  width: "18px",
                  height: "18px",
                  flexShrink: 0,
                  borderRadius: "4px",
                  border: `2px solid ${active ? "var(--psp-gold)" : "var(--psp-gray-500)"}`,
                  background: active ? "var(--psp-gold)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s ease",
                }}
              >
                {active && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--psp-navy)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {school.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
