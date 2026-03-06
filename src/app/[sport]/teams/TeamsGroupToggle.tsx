"use client";

import { useState } from "react";
import Link from "next/link";

type GroupMode = "league" | "division" | "classification";

interface Team {
  school: any;
  league: string;
  division: string | null;
  piaaClass: string | null;
  totalWins: number;
  totalLosses: number;
  totalTies: number;
  seasonCount: number;
  championships: number;
}

const LEAGUE_COLORS: Record<string, string> = {
  "Catholic League": "#dc2626",
  "Public League": "#16a34a",
  "Inter-Ac League": "#2563eb",
  "Central League": "#7c3aed",
  "Del Val League": "#ea580c",
  "Ches-Mont League": "#0891b2",
  "Suburban One": "#4f46e5",
  "Independent": "#6b7280",
};

const CLASS_COLORS: Record<string, string> = {
  "6A": "#dc2626",
  "5A": "#ea580c",
  "4A": "#f59e0b",
  "3A": "#16a34a",
  "2A": "#0891b2",
  "1A": "#7c3aed",
  "A": "#6b7280",
  "PAISAA": "#2563eb",
};

function getGroupColor(mode: GroupMode, key: string): string {
  if (mode === "classification") return CLASS_COLORS[key] || "#6b7280";
  return LEAGUE_COLORS[key] || "#6b7280";
}

function groupTeams(teams: Team[], mode: GroupMode): Record<string, Team[]> {
  const groups: Record<string, Team[]> = {};
  for (const team of teams) {
    let key: string;
    switch (mode) {
      case "division":
        key = team.division
          ? `${team.league} — ${team.division}`
          : team.league;
        break;
      case "classification":
        key = team.piaaClass || "Unclassified";
        break;
      default: // league
        key = team.league;
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(team);
  }

  // Sort within each group by wins desc
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => b.totalWins - a.totalWins);
  }

  return groups;
}

function sortGroupKeys(groups: Record<string, Team[]>, mode: GroupMode): string[] {
  if (mode === "classification") {
    const classOrder = ["6A", "5A", "4A", "3A", "2A", "1A", "A", "PAISAA", "Unclassified"];
    return Object.keys(groups).sort((a, b) => {
      const aIdx = classOrder.indexOf(a);
      const bIdx = classOrder.indexOf(b);
      if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
      if (aIdx >= 0) return -1;
      if (bIdx >= 0) return 1;
      return a.localeCompare(b);
    });
  }
  // League and division: sort by team count descending
  return Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);
}

export default function TeamsGroupToggle({
  teams,
  sport,
  sportEmoji,
}: {
  teams: Team[];
  sport: string;
  sportEmoji: string;
}) {
  const [mode, setMode] = useState<GroupMode>("league");

  const groups = groupTeams(teams, mode);
  const sortedKeys = sortGroupKeys(groups, mode);

  // Check if division/classification data exists
  const hasDivisions = teams.some((t) => t.division);
  const hasClassifications = teams.some((t) => t.piaaClass);

  return (
    <>
      {/* Toggle Bar */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 4,
          background: "var(--g50, #f8f9fa)",
          borderRadius: 8,
          marginBottom: 20,
          border: "1px solid var(--g100, #e5e7eb)",
          maxWidth: 400,
        }}
      >
        <button
          onClick={() => setMode("league")}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            background: mode === "league" ? "var(--psp-navy, #0a1628)" : "transparent",
            color: mode === "league" ? "#fff" : "var(--g400, #6b7280)",
            transition: "all .15s",
          }}
        >
          By League
        </button>
        {hasDivisions && (
          <button
            onClick={() => setMode("division")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: mode === "division" ? "var(--psp-navy, #0a1628)" : "transparent",
              color: mode === "division" ? "#fff" : "var(--g400, #6b7280)",
              transition: "all .15s",
            }}
          >
            By Division
          </button>
        )}
        {hasClassifications && (
          <button
            onClick={() => setMode("classification")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: mode === "classification" ? "var(--psp-navy, #0a1628)" : "transparent",
              color: mode === "classification" ? "#fff" : "var(--g400, #6b7280)",
              transition: "all .15s",
            }}
          >
            By PIAA Class
          </button>
        )}
      </div>

      {/* Grouped Teams */}
      {sortedKeys.map((groupKey) => {
        const groupTeams = groups[groupKey];
        const groupColor = getGroupColor(mode, mode === "division" ? groupKey.split(" — ").pop() || groupKey : groupKey);

        return (
          <div key={groupKey} style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text)",
                paddingBottom: 8,
                marginBottom: 12,
                borderBottom: `3px solid ${groupColor}`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: groupColor,
                  flexShrink: 0,
                }}
              />
              {groupKey}
              <span style={{ fontSize: 13, fontWeight: 400, color: "var(--g400)" }}>
                ({groupTeams.length} team{groupTeams.length !== 1 ? "s" : ""})
              </span>
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {groupTeams.map((team) => {
                const school = team.school;
                if (!school) return null;
                const total = team.totalWins + team.totalLosses + team.totalTies;
                const winPct = total > 0 ? ((team.totalWins / total) * 100).toFixed(0) : "0";
                const colors = school.colors as { primary?: string; secondary?: string } | null;
                const schoolColor = colors?.primary || groupColor;

                return (
                  <Link
                    key={school.id}
                    href={`/schools/${school.slug}/${sport}`}
                    style={{
                      display: "block",
                      padding: 14,
                      borderRadius: 8,
                      border: "1px solid var(--g100, #e5e7eb)",
                      background: "var(--card-bg, #fff)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "border-color .15s, box-shadow .15s",
                      borderLeft: `4px solid ${schoolColor}`,
                    }}
                    className="hover-lift"
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
                          {school.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--g400)", marginTop: 2 }}>
                          {school.city || "Philadelphia"}, {school.state || "PA"}
                          {team.piaaClass && mode !== "classification" && (
                            <span style={{ marginLeft: 6, padding: "1px 5px", borderRadius: 3, background: `${CLASS_COLORS[team.piaaClass] || "#6b7280"}15`, color: CLASS_COLORS[team.piaaClass] || "#6b7280", fontSize: 10, fontWeight: 600 }}>
                              {team.piaaClass}
                            </span>
                          )}
                          {team.division && mode !== "division" && (
                            <span style={{ marginLeft: 6, padding: "1px 5px", borderRadius: 3, background: "var(--g50, #f3f4f6)", color: "var(--g400)", fontSize: 10, fontWeight: 600 }}>
                              {team.division}
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{ opacity: 0.4, fontSize: 20 }}>{sportEmoji}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                      <div style={{ background: "var(--g50, #f8f9fa)", borderRadius: 4, padding: "4px 6px", textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "var(--g400)" }}>Record</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                          {team.totalWins}-{team.totalLosses}{team.totalTies > 0 ? `-${team.totalTies}` : ""}
                        </div>
                      </div>
                      <div style={{ background: "var(--g50, #f8f9fa)", borderRadius: 4, padding: "4px 6px", textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "var(--g400)" }}>Win%</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{winPct}%</div>
                      </div>
                      <div style={{ background: "var(--g50, #f8f9fa)", borderRadius: 4, padding: "4px 6px", textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "var(--g400)" }}>Titles</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: team.championships > 0 ? "var(--psp-gold)" : "var(--g300)" }}>
                          {team.championships > 0 ? team.championships : "—"}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
