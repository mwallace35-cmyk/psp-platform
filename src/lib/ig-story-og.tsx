/**
 * Shared design tokens and sub-components for IG Story OG images.
 *
 * IG Story format: 1080 x 1920 portrait.
 *
 * All routes use the same brand shell: navy background, gold accent ribbon
 * at top, sport-colored accent glow, PSP wordmark in the footer. The content
 * block in the middle is per-route.
 */

import React from "react";
import { SPORT_EMOJI } from "@/lib/sports";

export const IG_STORY_WIDTH = 1080;
export const IG_STORY_HEIGHT = 1920;

export const IG_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, s-maxage=2592000",
  "Content-Type": "image/png",
};

export const SPORT_COLORS: Record<
  string,
  { accent: string; glow: string; label: string }
> = {
  football: { accent: "#16a34a", glow: "#22c55e", label: "FOOTBALL" },
  basketball: { accent: "#3b82f6", glow: "#60a5fa", label: "BASKETBALL" },
  "girls-basketball": { accent: "#ec4899", glow: "#f472b6", label: "GIRLS BASKETBALL" },
  baseball: { accent: "#dc2626", glow: "#ef4444", label: "BASEBALL" },
  soccer: { accent: "#059669", glow: "#10b981", label: "SOCCER" },
  lacrosse: { accent: "#0891b2", glow: "#06b6d4", label: "LACROSSE" },
  "track-field": { accent: "#7c3aed", glow: "#a78bfa", label: "TRACK & FIELD" },
  wrestling: { accent: "#ca8a04", glow: "#eab308", label: "WRESTLING" },
};

export const DEFAULT_SPORT = {
  accent: "#3b82f6",
  glow: "#60a5fa",
  label: "PHILLY HS SPORTS",
};

export function getSport(sport: string | undefined | null) {
  if (!sport) return DEFAULT_SPORT;
  return SPORT_COLORS[sport] ?? DEFAULT_SPORT;
}

export function StoryShell({
  sport,
  children,
  topLabel,
}: {
  sport?: string | null;
  children: React.ReactNode;
  topLabel?: string;
}) {
  const colors = getSport(sport);
  const emoji = sport ? SPORT_EMOJI[sport] ?? "🏅" : "🏅";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a1628",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Gradient accent strip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 16,
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.glow}, #f0a500)`,
        }}
      />

      {/* Giant decorative emoji */}
      <div
        style={{
          position: "absolute",
          top: 120,
          right: -120,
          fontSize: 720,
          opacity: 0.05,
          display: "flex",
        }}
      >
        {emoji}
      </div>

      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          bottom: -240,
          left: -240,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: colors.accent,
          opacity: 0.12,
        }}
      />

      {/* Top label row */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 64 }}>{emoji}</span>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 700,
            color: colors.glow,
            letterSpacing: "0.25em",
          }}
        >
          {topLabel ?? colors.label}
        </div>
      </div>

      {/* Main content block */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "240px 80px 320px",
          zIndex: 20,
        }}
      >
        {children}
      </div>

      {/* Footer branding bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 60px 72px",
          background: "rgba(0, 0, 0, 0.5)",
          gap: 12,
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: "0.18em",
          }}
        >
          <span style={{ color: "#ffffff" }}>PHILLY</span>
          <span style={{ color: "#f0a500" }}>SPORTS</span>
          <span style={{ color: "#ffffff" }}>PACK</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#cbd5e1",
            fontWeight: 500,
            letterSpacing: "0.08em",
          }}
        >
          phillysportspack.com
        </div>
      </div>
    </div>
  );
}

export function StoryErrorFallback() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a1628",
        color: "#f0a500",
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: "0.15em",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      PHILLY SPORTS PACK
    </div>
  );
}
