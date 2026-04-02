"use client";

import { useRouter } from "next/navigation";

interface SeasonOption {
  label: string;
  yearStart: number;
}

interface SchoolSeasonDropdownProps {
  seasons: SeasonOption[];
  sport: string;
  schoolSlug: string;
  sportColor: string;
}

export default function SchoolSeasonDropdown({
  seasons,
  sport,
  schoolSlug,
  sportColor,
}: SchoolSeasonDropdownProps) {
  const router = useRouter();

  if (seasons.length === 0) return null;

  // Sort newest first
  const sorted = [...seasons].sort((a, b) => b.yearStart - a.yearStart);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label
        htmlFor="school-season-nav"
        className="font-bebas text-sm tracking-wider"
        style={{ color: "var(--psp-gold)" }}
      >
        Jump to Season:
      </label>
      <select
        id="school-season-nav"
        className="font-bebas tracking-wider"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) {
            router.push(`/${sport}/teams/${schoolSlug}/${e.target.value}`);
          }
        }}
        style={{
          background: "rgba(255,255,255,0.1)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "8px",
          padding: "0.4rem 2.5rem 0.4rem 0.75rem",
          fontSize: "0.9rem",
          fontWeight: 700,
          cursor: "pointer",
          appearance: "auto",
          minWidth: "140px",
        }}
      >
        <option value="" disabled style={{ background: "#0a1628", color: "#999" }}>
          Select a season...
        </option>
        {sorted.map((s) => (
          <option key={s.label} value={s.label} style={{ background: "#0a1628", color: "white" }}>
            {s.label}
          </option>
        ))}
      </select>
      <span className="text-xs text-gray-400">
        {sorted.length} season{sorted.length !== 1 ? "s" : ""} on record
      </span>
    </div>
  );
}
