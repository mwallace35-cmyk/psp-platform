"use client";

import React from "react";

/* ─── Shared select style ─── */
const selectStyle: React.CSSProperties = {
  padding: "0.625rem 1rem",
  borderRadius: "var(--radius-md, 8px)",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "var(--psp-navy-mid)",
  color: "#fff",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.875rem",
  outline: "none",
  minWidth: "140px",
  cursor: "pointer",
};

interface CityAllStarFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sportFilter: string;
  onSportFilterChange: (value: string) => void;
  schoolFilter: string;
  onSchoolFilterChange: (value: string) => void;
  yearFilter: string;
  onYearFilterChange: (value: string) => void;
  sports: string[];
  schools: string[];
  years: number[];
  activeFilterCount: number;
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
}

export default function CityAllStarFilters({
  search,
  onSearchChange,
  sportFilter,
  onSportFilterChange,
  schoolFilter,
  onSchoolFilterChange,
  yearFilter,
  onYearFilterChange,
  sports,
  schools,
  years,
  activeFilterCount,
  filteredCount,
  totalCount,
  onClearFilters,
}: CityAllStarFiltersProps) {
  return (
    <section
      style={{
        maxWidth: "80rem",
        margin: "0 auto",
        padding: "2.5rem 1rem 0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ flex: "1 1 220px", minWidth: "180px" }}>
          <input
            type="text"
            placeholder="Search by name or school..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: "100%",
              padding: "0.625rem 1rem",
              borderRadius: "var(--radius-md, 8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "var(--psp-navy-mid)",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
        </div>

        {/* Year */}
        <select
          value={yearFilter}
          onChange={(e) => onYearFilterChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>

        {/* School */}
        <select
          value={schoolFilter}
          onChange={(e) => onSchoolFilterChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Schools</option>
          {schools.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Sport */}
        <select
          value={sportFilter}
          onChange={(e) => onSportFilterChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Sports</option>
          {sports.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Reset */}
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "var(--radius-md, 8px)",
              border: "1px solid rgba(240, 165, 0, 0.3)",
              background: "transparent",
              color: "var(--psp-gold)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Result count */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.8rem",
          color: "#64748b",
          margin: "0.75rem 0 0",
        }}
      >
        {filteredCount} inductee{filteredCount !== 1 ? "s" : ""}
        {activeFilterCount > 0 && ` (filtered from ${totalCount})`}
      </p>
    </section>
  );
}
