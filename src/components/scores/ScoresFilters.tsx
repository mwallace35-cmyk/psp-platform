"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";

interface SchoolOption {
  id: number;
  name: string;
  slug: string;
}

interface ScoresFiltersProps {
  seasons: string[];
  schools: SchoolOption[];
  sports: { id: string; name: string; color: string }[];
  currentSeason: string;
  currentSport: string;
  currentSchool: string;
}

export default function ScoresFilters({
  seasons,
  schools,
  sports,
  currentSeason,
  currentSport,
  currentSchool,
}: ScoresFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [schoolSearch, setSchoolSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSchoolName = schools.find((s) => s.slug === currentSchool)?.name || "";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buildUrl = useCallback(
    (overrides: { season?: string; sport?: string; school?: string }) => {
      const params = new URLSearchParams();
      const season = overrides.season ?? currentSeason;
      const sport = overrides.sport ?? currentSport;
      const school = overrides.school ?? currentSchool;

      if (season && season !== "all") params.set("season", season);
      if (sport && sport !== "all") params.set("sport", sport);
      if (school) params.set("school", school);

      const qs = params.toString();
      return `/scores${qs ? `?${qs}` : ""}`;
    },
    [currentSeason, currentSport, currentSchool]
  );

  const filteredSchools = schoolSearch.length >= 2
    ? schools
        .filter((s) => s.name.toLowerCase().includes(schoolSearch.toLowerCase()))
        .slice(0, 8)
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
      {/* Sport Filter Pills */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => router.push(buildUrl({ sport: "all" }))}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            border: "1px solid var(--psp-gold)",
            background: currentSport === "all" ? "var(--psp-gold)" : "transparent",
            color: currentSport === "all" ? "var(--psp-navy)" : "var(--psp-gold)",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          All Sports
        </button>
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => router.push(buildUrl({ sport: sport.id }))}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: `1px solid ${sport.color}`,
              background: currentSport === sport.id ? sport.color : "transparent",
              color: currentSport === sport.id ? "white" : sport.color,
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {sport.name}
          </button>
        ))}
      </div>

      {/* Season + School Filters */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Season Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label
            htmlFor="season-select"
            style={{ color: "#999", fontSize: "0.85rem", fontWeight: 600 }}
          >
            Season:
          </label>
          <select
            id="season-select"
            value={currentSeason}
            onChange={(e) => router.push(buildUrl({ season: e.target.value }))}
            style={{
              background: "#1a1a1a",
              color: "white",
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "0.5rem 2rem 0.5rem 0.75rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              appearance: "auto",
            }}
          >
            <option value="all">All Seasons</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* School Search */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label
              htmlFor="school-search"
              style={{ color: "#999", fontSize: "0.85rem", fontWeight: 600 }}
            >
              Team:
            </label>
            <input
              id="school-search"
              type="text"
              placeholder={currentSchoolName || "Search school..."}
              value={schoolSearch}
              onChange={(e) => {
                setSchoolSearch(e.target.value);
                setShowDropdown(e.target.value.length >= 2);
              }}
              onFocus={() => {
                if (schoolSearch.length >= 2) setShowDropdown(true);
              }}
              style={{
                background: "#1a1a1a",
                color: "white",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "0.5rem 0.75rem",
                fontSize: "0.9rem",
                width: "200px",
              }}
            />
            {currentSchool && (
              <button
                onClick={() => {
                  setSchoolSearch("");
                  router.push(buildUrl({ school: "" }));
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#999",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "0 4px",
                }}
                title="Clear school filter"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown Results */}
          {showDropdown && filteredSchools.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                right: "0",
                marginTop: "4px",
                background: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "8px",
                overflow: "hidden",
                zIndex: 50,
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              {filteredSchools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => {
                    setSchoolSearch("");
                    setShowDropdown(false);
                    router.push(buildUrl({ school: school.slug }));
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.6rem 0.75rem",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid #333",
                    color: "white",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  {school.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active filter badges */}
      {(currentSchool || (currentSeason !== "all" && currentSeason)) && (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {currentSchoolName && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "12px",
                background: "var(--psp-gold)",
                color: "var(--psp-navy)",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {currentSchoolName}
              <button
                onClick={() => router.push(buildUrl({ school: "" }))}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--psp-navy)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  padding: 0,
                  marginLeft: "2px",
                }}
              >
                ×
              </button>
            </span>
          )}
          {currentSeason !== "all" && currentSeason && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "12px",
                background: "var(--psp-blue)",
                color: "white",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {currentSeason}
              <button
                onClick={() => router.push(buildUrl({ season: "all" }))}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  padding: 0,
                  marginLeft: "2px",
                }}
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
