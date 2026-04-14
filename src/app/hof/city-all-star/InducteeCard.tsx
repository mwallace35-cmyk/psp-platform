"use client";

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

/* ─── Inductee Card ─── */
export default function InducteeCard({
  inductee,
}: {
  inductee: CityAllStarInductee;
}) {
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
