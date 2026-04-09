import type { DecadeSlug } from "@/lib/data/decades";

interface DecadeHeroProps {
  slug: DecadeSlug;
  label: string;
  years: string;
  headline?: string;
  pullQuote?: string;
  sourceUrl?: string | null;
}

const SLUG_COLORS: Record<DecadeSlug, { accent: string; secondary: string }> = {
  "30-year": { accent: "#f0a500", secondary: "#f5c542" },
  "1970s":   { accent: "#a78bfa", secondary: "#c4b5fd" },
  "1980s":   { accent: "#f87171", secondary: "#fca5a5" },
  "1990s":   { accent: "#34d399", secondary: "#6ee7b7" },
  "2000s":   { accent: "#60a5fa", secondary: "#93c5fd" },
};

export default function DecadeHero({
  slug,
  label,
  years,
  headline,
  pullQuote,
  sourceUrl,
}: DecadeHeroProps) {
  const colors = SLUG_COLORS[slug];

  return (
    <section
      style={{
        position: "relative",
        background: `linear-gradient(160deg, var(--psp-navy) 60%, ${colors.accent}18 100%)`,
        padding: "4rem 1.5rem 3rem",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`,
        }}
      />

      {/* Decorative large text watermark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          right: "-2rem",
          transform: "translateY(-50%)",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(6rem, 16vw, 14rem)",
          color: `${colors.accent}0a`,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {slug === "30-year" ? "30" : slug.replace("s", "")}
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        {/* Attribution badge */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: `${colors.accent}20`,
              border: `1px solid ${colors.accent}40`,
              color: colors.accent,
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 L15 8 L22 8 L17 13 L19 20 L12 16 L5 20 L7 13 L2 8 L9 8 Z" />
            </svg>
            Ted Silary Canon
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="psp-h1-lg"
          style={{ color: "#fff", maxWidth: "700px", marginBottom: "0.5rem" }}
        >
          {label}
        </h1>

        {/* Years */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1.1rem",
            color: colors.accent,
            fontWeight: 700,
            letterSpacing: "0.06em",
            marginBottom: headline ? "1.25rem" : "0",
          }}
        >
          {years}
        </p>

        {/* Headline */}
        {headline && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              color: "#e2e8f0",
              maxWidth: "600px",
              lineHeight: 1.6,
              marginBottom: pullQuote ? "1.5rem" : "0",
            }}
          >
            {headline}
          </p>
        )}

        {/* Pull quote */}
        {pullQuote && (
          <blockquote
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              fontStyle: "italic",
              color: "#94a3b8",
              borderLeft: `3px solid ${colors.accent}`,
              paddingLeft: "1rem",
              maxWidth: "520px",
              margin: "0",
              lineHeight: 1.6,
            }}
          >
            {pullQuote}
          </blockquote>
        )}

        {/* Source link */}
        {sourceUrl && (
          <p style={{ marginTop: "1.5rem" }}>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem",
                color: "#64748b",
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              Source: tedsilary.com ↗
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
