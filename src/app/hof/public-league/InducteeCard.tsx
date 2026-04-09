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

/* ─── Redesigned Inductee Card ─── */
export default function InducteeCard({ inductee }: { inductee: PublicLeagueInductee }) {
  const schoolDisplay = inductee.school_name ?? inductee.high_school;
  const avatarColor = getSportColor(inductee.sport);
  const initials = getInitials(inductee.name);
  const descriptionText = inductee.achievements ?? inductee.bio ?? null;

  /* Build the name element -- linked if player_id exists */
  const playerSlug = (inductee as unknown as { player_slug?: string }).player_slug;
  const sportSlug = inductee.sport?.toLowerCase().includes('basketball') ? 'basketball'
    : inductee.sport?.toLowerCase().includes('football') ? 'football'
    : inductee.sport?.toLowerCase().includes('baseball') ? 'baseball'
    : inductee.sport?.toLowerCase().includes('track') ? 'track-field'
    : 'football';
  const nameEl = playerSlug ? (
    <Link
      href={`/players/${playerSlug}`}
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
          {inductee.induction_year > 0 ? `Inducted ${inductee.induction_year}` : 'Public League Legend'}
        </span>
      </div>
    </div>
  );
}
