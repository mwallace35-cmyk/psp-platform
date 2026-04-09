"use client";

import Link from "next/link";
import { useState } from "react";
import type { DecadePick } from "@/lib/data/decades";

interface DecadeSchoolChipsProps {
  picks: DecadePick[];
}

export default function DecadeSchoolChips({ picks }: DecadeSchoolChipsProps) {
  const [expanded, setExpanded] = useState(false);

  if (!picks || picks.length === 0) return null;

  // Group picks by school, sorted by count desc then alpha
  const schoolMap = new Map<string, DecadePick[]>();
  for (const pick of picks) {
    const school = pick.school || "Unknown";
    const bucket = schoolMap.get(school) ?? [];
    bucket.push(pick);
    schoolMap.set(school, bucket);
  }

  const schools = Array.from(schoolMap.entries()).sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]),
  );

  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 1.5rem 2.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <h2 className="psp-h2" style={{ color: "#fff", margin: 0 }}>
          By School
        </h2>
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "var(--psp-gold)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem 0",
          }}
        >
          {expanded ? "Collapse" : "Expand All"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {schools.map(([school, schoolPicks]) => (
          <SchoolBlock
            key={school}
            school={school}
            picks={schoolPicks}
            expanded={expanded}
          />
        ))}
      </div>
    </section>
  );
}

function SchoolBlock({
  school,
  picks,
  expanded,
}: {
  school: string;
  picks: DecadePick[];
  expanded: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isOpen = expanded || open;

  return (
    <div
      style={{
        background: "var(--psp-navy-mid)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.875rem 1.25rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Count badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "rgba(240,165,0,0.15)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "var(--psp-gold)",
            flexShrink: 0,
          }}
        >
          {picks.length}
        </span>

        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#fff",
            flex: 1,
          }}
        >
          {school}
        </span>

        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
            flexShrink: 0,
          }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Expanded picks */}
      {isOpen && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "0.75rem 1.25rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {picks.map((pick) => (
            <span
              key={pick.id}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "#cbd5e1",
                background: "rgba(255,255,255,0.04)",
                padding: "0.2rem 0.6rem",
                borderRadius: "4px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              {pick.playerSlug ? (
                <Link
                  href={`/football/players/${pick.playerSlug}`}
                  style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}
                >
                  {pick.playerName}
                </Link>
              ) : (
                <span style={{ fontWeight: 600 }}>{pick.playerName}</span>
              )}
              <span style={{ color: "#475569", fontSize: "0.7rem" }}>
                {pick.tier === "First Team"
                  ? "1st"
                  : pick.tier === "Second Team"
                  ? "2nd"
                  : "3rd"}{" "}
                · {pick.position}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
