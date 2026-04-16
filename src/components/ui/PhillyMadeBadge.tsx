/**
 * PhillyMadeBadge — visual stamp for Philadelphia HS alumni.
 *
 * Renders a small pill with the Liberty Bell silhouette + "PHILLY MADE" text.
 * Uses existing PSP tokens (--psp-navy, --psp-gold).
 *
 * Pure presentational — no data fetching. Render only when you know the
 * player qualifies (all NLT entries qualify; players with non-Philly
 * primary_school_id should be filtered by the caller).
 */

interface PhillyMadeBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export default function PhillyMadeBadge({ size = "sm", className = "" }: PhillyMadeBadgeProps) {
  const dims = size === "sm"
    ? { padding: "2px 6px", fontSize: 8.5, iconSize: 10, letter: 0.6 }
    : { padding: "4px 10px", fontSize: 10, iconSize: 12, letter: 0.7 };

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: dims.padding,
        borderRadius: 999,
        background: "var(--psp-navy, #0a1628)",
        color: "var(--psp-gold, #f0a500)",
        fontSize: dims.fontSize,
        fontWeight: 800,
        letterSpacing: dims.letter,
        textTransform: "uppercase",
        border: "1px solid var(--psp-gold, #f0a500)",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
      aria-label="Philly Made — Philadelphia high school alumnus"
      title="Philly Made — Philadelphia high school alumnus"
    >
      {/* Liberty Bell silhouette */}
      <svg
        width={dims.iconSize}
        height={dims.iconSize}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2c-.55 0-1 .45-1 1v1h-2c-.55 0-1 .45-1 1s.45 1 1 1v2.5c0 3.5-2 5-2 8 0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2 0-3-2-4.5-2-8V6c.55 0 1-.45 1-1s-.45-1-1-1h-2V3c0-.55-.45-1-1-1h-2zm-1 17h2c0 .55-.45 1-1 1s-1-.45-1-1zm1 2c.83 0 1.5-.67 1.5-1.5h-3c0 .83.67 1.5 1.5 1.5z" />
      </svg>
      Philly Made
    </span>
  );
}
