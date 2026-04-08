/**
 * SportIcon — SVG glyph icon for each sport.
 *
 * Replaces the previous emoji-based renderer (audit CC-2). API is preserved
 * for backward compat: same props, same exports. The legacy SPORT_EMOJI map
 * is kept exported for any consumer that still depends on it (e.g. tests,
 * OG image generators) but the rendered output is now an inline SVG.
 *
 * Glyphs are intentionally simple, single-stroke designs that match the
 * mockup direction and read at every size from 16px to 64px.
 */

import type { SVGProps } from "react";

interface SportIconProps {
  sport: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Inline SVG glyphs                                                  */
/* ------------------------------------------------------------------ */

const baseSvg = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function FootballGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <ellipse cx="24" cy="24" rx="18" ry="11" transform="rotate(-20 24 24)" />
      <path d="M14 21l20 6M16 28l16-8M20 18v12M28 18v12" />
    </svg>
  );
}

function BasketballGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <circle cx="24" cy="24" r="17" />
      <path d="M7 24h34M24 7v34M10 13q14 22 28 0M10 35q14-22 28 0" />
    </svg>
  );
}

function BaseballGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <circle cx="24" cy="24" r="17" />
      <path d="M10 14q8 10 0 20M38 14q-8 10 0 20" strokeDasharray="2 3" />
    </svg>
  );
}

function SoccerGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <circle cx="24" cy="24" r="17" />
      <path d="m24 12 8 5-3 10h-10l-3-10zM24 12V7M32 17l5-2M29 27l4 7M19 27l-4 7M16 17l-5-2" />
    </svg>
  );
}

function LacrosseGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <path d="M8 40 24 24l6-6q4-4 8 0t0 8l-6 6L16 48" />
      <circle cx="20" cy="28" r="2" />
    </svg>
  );
}

function TrackFieldGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <path d="M12 36 22 20l6 4 8-12M30 14l6-2-2 6" />
      <circle cx="24" cy="14" r="2" />
    </svg>
  );
}

function WrestlingGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <circle cx="16" cy="12" r="4" />
      <circle cx="32" cy="12" r="4" />
      <path d="M12 22l4 8 4-4 4 4 4-4 4 4 4-8M10 40h28" />
    </svg>
  );
}

function SwimmingGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <circle cx="16" cy="14" r="3" />
      <path d="M6 24q6-4 12 0t12 0 12 0M6 32q6-4 12 0t12 0 12 0M6 40q6-4 12 0t12 0 12 0" />
    </svg>
  );
}

function GolfGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <path d="M22 6v28M22 6l14 4-14 4" />
      <circle cx="22" cy="38" r="3" />
      <path d="M10 44h28" />
    </svg>
  );
}

function TennisGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <circle cx="24" cy="24" r="17" />
      <path d="M10 14q8 10 0 20M38 14q-8 10 0 20" />
    </svg>
  );
}

function MedalGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseSvg} {...props}>
      <circle cx="24" cy="30" r="11" />
      <path d="M14 12l10 14M34 12L24 26M14 6h8M26 6h8" />
    </svg>
  );
}

const SPORT_GLYPHS: Record<string, (p: SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  football: FootballGlyph,
  basketball: BasketballGlyph,
  "boys-basketball": BasketballGlyph,
  "girls-basketball": BasketballGlyph,
  baseball: BaseballGlyph,
  "track-field": TrackFieldGlyph,
  track: TrackFieldGlyph,
  lacrosse: LacrosseGlyph,
  wrestling: WrestlingGlyph,
  soccer: SoccerGlyph,
  swimming: SwimmingGlyph,
  golf: GolfGlyph,
  tennis: TennisGlyph,
};

/* ------------------------------------------------------------------ */
/*  Legacy emoji map — kept for backward compat (tests, OG images)    */
/* ------------------------------------------------------------------ */

const SPORT_EMOJI: Record<string, string> = {
  football: "\u{1F3C8}",
  basketball: "\u{1F3C0}",
  baseball: "\u26BE",
  "track-field": "\u{1F3C3}",
  lacrosse: "\u{1F94D}",
  wrestling: "\u{1F93C}",
  soccer: "\u26BD",
  swimming: "\u{1F3CA}",
  golf: "\u26F3",
  tennis: "\u{1F3BE}",
};

const SPORT_COLORS: Record<string, string> = {
  football: "#16a34a",
  basketball: "#3b82f6",
  "boys-basketball": "#3b82f6",
  "girls-basketball": "#ec4899",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

const SPORT_LABELS: Record<string, string> = {
  football: "Football",
  basketball: "Basketball",
  "boys-basketball": "Boys Basketball",
  "girls-basketball": "Girls Basketball",
  baseball: "Baseball",
  "track-field": "Track and Field",
  track: "Track",
  lacrosse: "Lacrosse",
  wrestling: "Wrestling",
  soccer: "Soccer",
  swimming: "Swimming",
  golf: "Golf",
  tennis: "Tennis",
};

const sizeMap = {
  sm: { box: "w-8 h-8", glyph: 18 },
  md: { box: "w-12 h-12", glyph: 26 },
  lg: { box: "w-16 h-16", glyph: 36 },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SportIcon({ sport, size = "md", className = "" }: SportIconProps) {
  const Glyph = SPORT_GLYPHS[sport] || MedalGlyph;
  const color = SPORT_COLORS[sport] || "#64748b";
  const label = SPORT_LABELS[sport] || sport;
  const dims = sizeMap[size];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl ${dims.box} ${className}`}
      style={{ background: `${color}15`, color }}
      role="img"
      aria-label={label}
    >
      <Glyph width={dims.glyph} height={dims.glyph} aria-hidden="true" />
    </div>
  );
}

export { SPORT_EMOJI, SPORT_COLORS, SPORT_GLYPHS, SPORT_LABELS };
