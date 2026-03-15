"use client";

import { useRouter } from "next/navigation";

interface SeasonOption {
  label: string;
  year_start: number;
}

interface SeasonSelectorProps {
  seasons: SeasonOption[];
  currentSeason: string;
  sport: string;
  schoolSlug: string;
}

export default function SeasonSelector({
  seasons,
  currentSeason,
  sport,
  schoolSlug,
}: SeasonSelectorProps) {
  const router = useRouter();

  // Sort by year_start descending
  const sorted = [...seasons].sort((a, b) => b.year_start - a.year_start);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        flexWrap: "wrap",
      }}
    >
      <label
        htmlFor="season-nav"
        style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "1rem",
          color: "var(--psp-gold)",
          letterSpacing: "0.05em",
        }}
      >
        Season:
      </label>
      <select
        id="season-nav"
        value={currentSeason}
        onChange={(e) => {
          router.push(`/${sport}/teams/${schoolSlug}/${e.target.value}`);
        }}
        style={{
          background: "rgba(255,255,255,0.1)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "8px",
          padding: "0.5rem 2.5rem 0.5rem 0.75rem",
          fontSize: "1rem",
          fontWeight: 700,
          fontFamily: "Bebas Neue, sans-serif",
          letterSpacing: "0.05em",
          cursor: "pointer",
          appearance: "auto",
          minWidth: "140px",
        }}
      >
        {sorted.map((s) => (
          <option key={s.label} value={s.label} style={{ background: "#0a1628", color: "white" }}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Prev/Next arrows */}
      {(() => {
        const currentIdx = sorted.findIndex((s) => s.label === currentSeason);
        const prevSeason = currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null;
        const nextSeason = currentIdx > 0 ? sorted[currentIdx - 1] : null;

        return (
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {prevSeason && (
              <button
                onClick={() => router.push(`/${sport}/teams/${schoolSlug}/${prevSeason.label}`)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "6px",
                  color: "white",
                  padding: "0.4rem 0.6rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  lineHeight: 1,
                }}
                title={`Previous: ${prevSeason.label}`}
              >
                ◀
              </button>
            )}
            {nextSeason && (
              <button
                onClick={() => router.push(`/${sport}/teams/${schoolSlug}/${nextSeason.label}`)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "6px",
                  color: "white",
                  padding: "0.4rem 0.6rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  lineHeight: 1,
                }}
                title={`Next: ${nextSeason.label}`}
              >
                ▶
              </button>
            )}
          </div>
        );
      })()}
    </div>
  );
}
