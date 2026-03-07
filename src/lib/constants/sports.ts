/**
 * Centralized sport colors and metadata constants
 * Used across the application for consistent sport color mapping
 */

/**
 * CSS variable-based colors for server components
 * These map to CSS custom properties defined in global styles
 */
export const SPORT_COLORS: Record<string, string> = {
  football: "var(--fb)",
  basketball: "var(--bb)",
  baseball: "var(--base)",
  "track-field": "var(--track)",
  lacrosse: "var(--lac)",
  wrestling: "var(--wrest)",
  soccer: "var(--soccer)",
};

/**
 * Raw hex colors for client components (CSS vars don't work in JS)
 * Used in client-side rendering where CSS variables aren't accessible
 */
export const SPORT_COLORS_HEX: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};
