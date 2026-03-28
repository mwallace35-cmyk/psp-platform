"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

const CLASS_YEARS = ["2028", "2027", "2026", "2025"];

const SPORT_POSITIONS: Record<string, { value: string; label: string }[]> = {
  football: [
    { value: "QB", label: "QB" },
    { value: "RB", label: "RB" },
    { value: "WR", label: "WR" },
    { value: "TE", label: "TE" },
    { value: "OL", label: "OL" },
    { value: "DL", label: "DL" },
    { value: "LB", label: "LB" },
    { value: "DB", label: "DB" },
    { value: "K/P", label: "K/P" },
  ],
  basketball: [
    { value: "G", label: "G" },
    { value: "F", label: "F" },
    { value: "C", label: "C" },
  ],
  baseball: [
    { value: "P", label: "P" },
    { value: "C", label: "C" },
    { value: "IF", label: "IF" },
    { value: "OF", label: "OF" },
  ],
};

interface SeasonOption {
  id: number;
  label: string;
  is_current: boolean;
}

interface LeaderboardFiltersProps {
  sport: string;
  sportColor: string;
  seasons?: SeasonOption[];
}

export default function LeaderboardFilters({ sport, sportColor, seasons = [] }: LeaderboardFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentClass = searchParams.get("class") || "";
  const currentPosition = searchParams.get("position") || "";
  const currentSeason = searchParams.get("season") || "";
  const hasActiveFilters = !!(currentClass || currentPosition || currentSeason);

  const positions = SPORT_POSITIONS[sport] || [];

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("class");
    params.delete("position");
    params.delete("season");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  const selectStyle = (isActive: boolean): React.CSSProperties => ({
    appearance: "none",
    WebkitAppearance: "none",
    padding: "8px 32px 8px 14px",
    borderRadius: 999,
    border: isActive ? `2px solid ${sportColor}` : "2px solid #334155",
    background: isActive ? `${sportColor}18` : "var(--psp-navy-mid, #0f2040)",
    color: isActive ? sportColor : "#94a3b8",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    outline: "none",
    transition: "border-color 0.15s, background 0.15s",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      {/* Season dropdown */}
      {seasons.length > 0 && (
        <>
          <span
            className="font-bebas text-xs tracking-wider uppercase"
            style={{ color: "#64748b" }}
          >
            Season
          </span>
          <select
            value={currentSeason}
            onChange={(e) => updateParams("season", e.target.value)}
            style={selectStyle(!!currentSeason)}
          >
            <option value="">Current Season</option>
            <option value="all">All Seasons</option>
            {seasons.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.label}
              </option>
            ))}
          </select>
          <span style={{ width: 1, height: 20, background: "#334155", flexShrink: 0 }} />
        </>
      )}

      {/* Class Year label + dropdown */}
      <span
        className="font-bebas text-xs tracking-wider uppercase"
        style={{
          color: "#64748b",
        }}
      >
        Class
      </span>
      <select
        value={currentClass}
        onChange={(e) => updateParams("class", e.target.value)}
        style={selectStyle(!!currentClass)}
      >
        <option value="">All</option>
        {CLASS_YEARS.map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>

      {/* Position label + dropdown (only for sports with positions) */}
      {positions.length > 0 && (
        <>
          <span
            className="font-bebas text-xs tracking-wider uppercase"
            style={{
              color: "#64748b",
            }}
          >
            Position
          </span>
          <select
            value={currentPosition}
            onChange={(e) => updateParams("position", e.target.value)}
            style={selectStyle(!!currentPosition)}
          >
            <option value="">All</option>
            {positions.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Clear filters button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          style={{
            padding: "7px 14px",
            borderRadius: 999,
            border: "1px solid #475569",
            background: "transparent",
            color: "#94a3b8",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "color 0.15s, border-color 0.15s",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: "0.9rem" }}>&#x2715;</span>
          Clear filters
        </button>
      )}
    </div>
  );
}
