"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";

// ============================================================================
// Types
// ============================================================================

export interface RecruitRow {
  playerId: number;
  playerName: string;
  playerSlug: string;
  schoolName: string;
  schoolSlug: string;
  sport: string;
  position: string | null;
  classYear: number | null;
  leagueId: number | null;
  leagueName: string | null;
  awardsCount: number;
  // Football stats
  rushYards?: number | null;
  passYards?: number | null;
  recYards?: number | null;
  totalTd?: number | null;
  totalYards?: number | null;
  // Basketball stats
  ppg?: number | null;
  rpg?: number | null;
  apg?: number | null;
  points?: number | null;
  // Baseball stats
  battingAvg?: number | null;
  homeRuns?: number | null;
  rbi?: number | null;
  era?: number | null;
}

type SortKey = string;
type SortDir = "asc" | "desc";

// ============================================================================
// Constants
// ============================================================================

const SPORTS = [
  { value: "football", label: "Football", color: "var(--fb)" },
  { value: "basketball", label: "Basketball", color: "#3b82f6" },
  { value: "baseball", label: "Baseball", color: "var(--base)" },
];

const POSITIONS: Record<string, string[]> = {
  football: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K/P", "ATH"],
  basketball: ["PG", "SG", "SF", "PF", "C", "G", "F"],
  baseball: ["P", "C", "1B", "2B", "3B", "SS", "OF", "DH", "IF", "UT"],
};

const CLASS_YEARS = [2025, 2026, 2027, 2028];

const LEAGUES = [
  { value: "all", label: "All Leagues" },
  { value: "1", label: "PCL" },
  { value: "2", label: "Public League" },
  { value: "3", label: "Inter-Ac" },
];

// ============================================================================
// Component
// ============================================================================

export default function RecruitFinderClient({ initialData }: { initialData: RecruitRow[] }) {
  const [sport, setSport] = useState("football");
  const [position, setPosition] = useState("");
  const [classYear, setClassYear] = useState<number | "">("");
  const [league, setLeague] = useState("all");
  const [minStat, setMinStat] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalYards");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Filter data
  const filtered = useMemo(() => {
    let rows = initialData.filter((r) => r.sport === sport);

    if (position) {
      rows = rows.filter((r) => r.position && r.position.toUpperCase().includes(position.toUpperCase()));
    }
    if (classYear) {
      rows = rows.filter((r) => r.classYear === classYear);
    }
    if (league !== "all") {
      rows = rows.filter((r) => String(r.leagueId) === league);
    }
    if (minStat) {
      const threshold = parseFloat(minStat);
      if (!isNaN(threshold)) {
        rows = rows.filter((r) => {
          if (sport === "football") return (r.totalYards ?? 0) >= threshold;
          if (sport === "basketball") return (r.ppg ?? 0) >= threshold;
          if (sport === "baseball") return (r.battingAvg ?? 0) >= threshold;
          return true;
        });
      }
    }

    // Sort
    rows = [...rows].sort((a, b) => {
      const aVal = (a as any)[sortKey] ?? 0;
      const bVal = (b as any)[sortKey] ?? 0;
      const numA = typeof aVal === "number" ? aVal : parseFloat(aVal) || 0;
      const numB = typeof bVal === "number" ? bVal : parseFloat(bVal) || 0;
      return sortDir === "desc" ? numB - numA : numA - numB;
    });

    return rows;
  }, [initialData, sport, position, classYear, league, minStat, sortKey, sortDir]);

  // Handle column sort
  const handleSort = useCallback((key: string) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "desc" ? "asc" : "desc"));
        return prev;
      }
      setSortDir("desc");
      return key;
    });
  }, []);

  // Default sort when sport changes
  const handleSportChange = useCallback((newSport: string) => {
    setSport(newSport);
    setPosition("");
    setMinStat("");
    if (newSport === "football") setSortKey("totalYards");
    else if (newSport === "basketball") setSortKey("ppg");
    else if (newSport === "baseball") setSortKey("battingAvg");
    setSortDir("desc");
  }, []);

  // Export to clipboard
  const handleExport = useCallback(() => {
    const header = sport === "football"
      ? "Name,School,Position,Class,Rush Yds,Pass Yds,Rec Yds,Total TDs,Awards"
      : sport === "basketball"
      ? "Name,School,Position,Class,PPG,RPG,APG,Points,Awards"
      : "Name,School,Position,Class,AVG,HR,RBI,ERA,Awards";

    const csvRows = filtered.map((r) => {
      const base = `"${r.playerName}","${r.schoolName}","${r.position ?? ""}",${r.classYear ?? ""}`;
      if (sport === "football") return `${base},${r.rushYards ?? ""},${r.passYards ?? ""},${r.recYards ?? ""},${r.totalTd ?? ""},${r.awardsCount}`;
      if (sport === "basketball") return `${base},${r.ppg ?? ""},${r.rpg ?? ""},${r.apg ?? ""},${r.points ?? ""},${r.awardsCount}`;
      return `${base},${r.battingAvg ?? ""},${r.homeRuns ?? ""},${r.rbi ?? ""},${r.era ?? ""},${r.awardsCount}`;
    });

    const csv = [header, ...csvRows].join("\n");
    navigator.clipboard.writeText(csv).then(() => {
      alert(`Copied ${filtered.length} rows to clipboard as CSV`);
    });
  }, [filtered, sport]);

  // Get stat columns based on sport
  const statColumns = useMemo(() => {
    if (sport === "football") {
      return [
        { key: "rushYards", label: "Rush Yds" },
        { key: "passYards", label: "Pass Yds" },
        { key: "recYards", label: "Rec Yds" },
        { key: "totalTd", label: "TDs" },
        { key: "totalYards", label: "Total Yds" },
      ];
    }
    if (sport === "basketball") {
      return [
        { key: "ppg", label: "PPG" },
        { key: "rpg", label: "RPG" },
        { key: "apg", label: "APG" },
        { key: "points", label: "Total Pts" },
      ];
    }
    return [
      { key: "battingAvg", label: "AVG" },
      { key: "homeRuns", label: "HR" },
      { key: "rbi", label: "RBI" },
      { key: "era", label: "ERA" },
    ];
  }, [sport]);

  const sportColor = SPORTS.find((s) => s.value === sport)?.color ?? "var(--psp-gold)";
  const minStatPlaceholder = sport === "football" ? "Min total yards" : sport === "basketball" ? "Min PPG" : "Min batting avg";

  return (
    <div>
      {/* Sport Selector Pills */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {SPORTS.map((s) => (
          <button
            key={s.value}
            onClick={() => handleSportChange(s.value)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "999px",
              border: sport === s.value ? `2px solid ${s.color}` : "2px solid rgba(255,255,255,0.15)",
              background: sport === s.value ? s.color : "rgba(255,255,255,0.05)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <FilterSelect
          label="Position"
          value={position}
          onChange={setPosition}
          options={[{ value: "", label: "All" }, ...(POSITIONS[sport] ?? []).map((p) => ({ value: p, label: p }))]}
        />
        <FilterSelect
          label="Class Year"
          value={classYear === "" ? "" : String(classYear)}
          onChange={(v) => setClassYear(v ? Number(v) : "")}
          options={[{ value: "", label: "All" }, ...CLASS_YEARS.map((y) => ({ value: String(y), label: String(y) }))]}
        />
        <FilterSelect
          label="League"
          value={league}
          onChange={setLeague}
          options={LEAGUES}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Min Stat
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={minStat}
            onChange={(e) => setMinStat(e.target.value)}
            placeholder={minStatPlaceholder}
            style={{
              padding: "0.45rem 0.75rem",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: "0.85rem",
              width: "140px",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", margin: 0 }}>
          <span style={{ color: sportColor, fontWeight: 700 }}>{filtered.length}</span> players found
        </p>
        <button
          onClick={handleExport}
          style={{
            padding: "0.4rem 1rem",
            borderRadius: "6px",
            border: "1px solid var(--psp-gold)",
            background: "transparent",
            color: "var(--psp-gold)",
            fontWeight: 700,
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Results Table */}
      <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.05)" }}>
              <SortTh label="Player" sortKey="playerName" current={sortKey} dir={sortDir} onClick={handleSort} />
              <SortTh label="School" sortKey="schoolName" current={sortKey} dir={sortDir} onClick={handleSort} />
              <th style={thStyle}>Pos</th>
              <SortTh label="Class" sortKey="classYear" current={sortKey} dir={sortDir} onClick={handleSort} />
              {statColumns.map((col) => (
                <SortTh key={col.key} label={col.label} sortKey={col.key} current={sortKey} dir={sortDir} onClick={handleSort} />
              ))}
              <SortTh label="Awards" sortKey="awardsCount" current={sortKey} dir={sortDir} onClick={handleSort} />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5 + statColumns.length} style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.7)" }}>
                  No players match your filters. Try adjusting your criteria.
                </td>
              </tr>
            ) : (
              filtered.slice(0, 200).map((row, i) => (
                <tr
                  key={`${row.playerId}-${i}`}
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <td style={tdStyle}>
                    <Link
                      href={`/${row.sport}/players/${row.playerSlug}`}
                      style={{ color: "var(--psp-gold)", textDecoration: "none", fontWeight: 600 }}
                    >
                      {row.playerName}
                    </Link>
                  </td>
                  <td style={tdStyle}>
                    <Link
                      href={`/${row.sport}/schools/${row.schoolSlug}`}
                      style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}
                    >
                      {row.schoolName}
                    </Link>
                  </td>
                  <td style={tdStyle}>
                    {row.position && (
                      <span style={{
                        padding: "0.15rem 0.45rem",
                        borderRadius: "4px",
                        background: `${sportColor}22`,
                        color: sportColor,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}>
                        {row.position}
                      </span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{row.classYear ?? "-"}</td>
                  {statColumns.map((col) => (
                    <td key={col.key} style={{ ...tdStyle, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {formatStat((row as any)[col.key], col.key)}
                    </td>
                  ))}
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    {row.awardsCount > 0 && (
                      <span style={{
                        background: "var(--psp-gold)",
                        color: "var(--psp-navy)",
                        borderRadius: "999px",
                        padding: "0.1rem 0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                      }}>
                        {row.awardsCount}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 200 && (
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginTop: "0.75rem", textAlign: "center" }}>
          Showing top 200 of {filtered.length} results. Use filters to narrow your search.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "0.45rem 0.75rem",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.05)",
          color: "#fff",
          fontSize: "0.85rem",
          cursor: "pointer",
          outline: "none",
          minWidth: "110px",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: "#1a2744", color: "#fff" }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SortTh({
  label,
  sortKey: key,
  current,
  dir,
  onClick,
}: {
  label: string;
  sortKey: string;
  current: string;
  dir: SortDir;
  onClick: (key: string) => void;
}) {
  const isActive = current === key;
  return (
    <th
      onClick={() => onClick(key)}
      style={{
        ...thStyle,
        cursor: "pointer",
        userSelect: "none",
        color: isActive ? "var(--psp-gold)" : "rgba(255,255,255,0.75)",
        whiteSpace: "nowrap",
      }}
    >
      {label} {isActive ? (dir === "desc" ? "\u25BC" : "\u25B2") : ""}
    </th>
  );
}

// ============================================================================
// Styles & Utils
// ============================================================================

const thStyle: React.CSSProperties = {
  padding: "0.65rem 0.75rem",
  textAlign: "left",
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "rgba(255,255,255,0.75)",
};

const tdStyle: React.CSSProperties = {
  padding: "0.6rem 0.75rem",
  color: "rgba(255,255,255,0.85)",
  whiteSpace: "nowrap",
};

function formatStat(value: unknown, key: string): string {
  if (value == null) return "-";
  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(num)) return "-";
  if (key === "battingAvg") return num.toFixed(3);
  if (key === "era") return num.toFixed(2);
  if (key === "ppg" || key === "rpg" || key === "apg") return num.toFixed(1);
  return num.toLocaleString();
}
