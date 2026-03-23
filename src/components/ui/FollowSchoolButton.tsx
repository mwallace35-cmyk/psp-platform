"use client";

import { useFollowedSchools } from "@/hooks/useFollowedSchools";

interface FollowSchoolButtonProps {
  schoolSlug: string;
  schoolName?: string;
  /** Compact renders just the icon; default shows icon + text */
  compact?: boolean;
}

/**
 * A small star toggle button that adds/removes a school from the
 * user's localStorage-based followed list. Works without auth.
 *
 * Place on school pages, team pages, standings rows, etc.
 */
export default function FollowSchoolButton({
  schoolSlug,
  schoolName,
  compact = false,
}: FollowSchoolButtonProps) {
  const { isFollowing, toggleSchool } = useFollowedSchools();
  const active = isFollowing(schoolSlug);

  const label = active
    ? `Unfollow ${schoolName || schoolSlug}`
    : `Follow ${schoolName || schoolSlug}`;

  return (
    <button
      onClick={() => toggleSchool(schoolSlug)}
      aria-label={label}
      aria-pressed={active}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? 0 : "0.35rem",
        padding: compact ? "0.4rem" : "0.4rem 0.7rem",
        borderRadius: "var(--radius-sm)",
        border: `1.5px solid ${active ? "var(--psp-gold)" : "var(--psp-gray-400)"}`,
        background: active ? "rgba(240, 165, 0, 0.12)" : "transparent",
        color: active ? "var(--psp-gold)" : "var(--psp-gray-400)",
        fontSize: "0.8rem",
        fontWeight: 600,
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        cursor: "pointer",
        transition: "all 0.15s ease",
        lineHeight: 1,
        minHeight: "36px",
        minWidth: "36px",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "var(--psp-gold)";
          e.currentTarget.style.color = "var(--psp-gold)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "var(--psp-gray-400)";
          e.currentTarget.style.color = "var(--psp-gray-400)";
        }
      }}
    >
      {/* Star icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {!compact && (
        <span>{active ? "Following" : "Follow"}</span>
      )}
    </button>
  );
}
