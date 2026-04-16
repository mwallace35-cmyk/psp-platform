"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";

// Computed records from stats tables
interface ComputedRecord {
  stat_category: string;
  stat_name: string;
  scope: "career" | "season";
  rank: number;
  value: number;
  display_value: string;
  player_name: string;
  player_slug: string;
  school_name: string;
  school_slug: string;
  season_label: string | null;
  year: number | null;
  source: "computed";
}

const SCOPE_COLORS: Record<string, string> = {
  game: "#3b82f6",
  season: "#10b981",
  career: "#f59e0b",
  city: "#8b5cf6",
  postseason: "#ef4444",
  "city-title": "#f0a500",
};

// Helper: get scope color
function scopeColor(scope: string | null): string {
  if (!scope) return "#6b7280";
  return SCOPE_COLORS[scope] || "#6b7280";
}

export default function LeaderboardTable({
  leaderboardRecords,
  initialCategory,
  activeStatForDisplay,
  sport,
  sportColor,
}: {
  leaderboardRecords: ComputedRecord[];
  initialCategory: string;
  activeStatForDisplay: string | null;
  sport: string;
  sportColor: string;
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h3 className="psp-h3" style={{ marginBottom: 12 }}>
        {activeStatForDisplay ? `${activeStatForDisplay} Leaderboard` : `${initialCategory} Leaderboard`}
      </h3>
      {leaderboardRecords.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table aria-label="Season and career records leaderboard" style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--psp-navy, #0a1628)" }}>
                <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#6b7280", fontSize: 11 }}>
                  #
                </th>
                <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#6b7280", fontSize: 11 }}>
                  Player
                </th>
                <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#6b7280", fontSize: 11 }}>
                  School
                </th>
                {/* Fix #3: Show actual stat name instead of "Value" */}
                <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#6b7280", fontSize: 11 }}>
                  Scope
                </th>
                <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: "#6b7280", fontSize: 11 }}>
                  {activeStatForDisplay || "Value"}
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardRecords.map((rec, idx) => {
                const rank = idx + 1;
                const bgColor =
                  rank === 1 ? "rgba(240, 165, 0, 0.1)" : rank === 2 ? "rgba(192, 192, 192, 0.05)" : rank === 3 ? "rgba(205, 127, 50, 0.05)" : "transparent";
                return (
                  <tr key={`${rec.player_slug}-${rec.scope}-${rec.rank}`} style={{ borderBottom: "1px solid #f3f4f6", background: bgColor }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: rank <= 3 ? sportColor : "#9ca3af" }}>
                      {rank <= 3 ? (["🥇", "🥈", "🥉"][rank - 1] + " ") : ""}
                      {rank}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <Link
                        href={`/${sport}/players/${rec.player_slug}`}
                        style={{ color: "var(--psp-navy, #0a1628)", textDecoration: "none", fontWeight: 500 }}
                      >
                        {rec.player_name}
                      </Link>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280" }}>
                      <Link
                        href={`/${sport}/schools/${rec.school_slug}`}
                        style={{ color: "var(--psp-gold, #f0a500)", textDecoration: "none" }}
                      >
                        {rec.school_name}
                      </Link>
                    </td>
                    {/* Fix #5: Add career/season scope badge */}
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 6px",
                          background: `${scopeColor(rec.scope)}20`,
                          color: scopeColor(rec.scope),
                          borderRadius: 3,
                          textTransform: "uppercase",
                        }}
                      >
                        {rec.scope}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: sportColor }}>
                      {rec.display_value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af" }}>
          <BarChart3 className="w-12 h-12" />
          <p>No records available for this stat</p>
        </div>
      )}
      <span
        style={{
          display: "inline-block",
          fontSize: 11,
          fontWeight: 600,
          padding: "4px 8px",
          background: "#3b82f618",
          color: "#3b82f6",
          borderRadius: 4,
          marginTop: 12,
          textTransform: "uppercase",
        }}
      >
        Stats DB
      </span>
    </div>
  );
}
