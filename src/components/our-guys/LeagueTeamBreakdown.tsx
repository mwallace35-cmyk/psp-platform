"use client";

import { useState } from "react";

interface LeagueBreakdownEntry {
  league: string;
  count: number;
}

interface TeamCount {
  team: string;
  count: number;
}

interface LeagueTeamBreakdownProps {
  leagueBreakdown: LeagueBreakdownEntry[];
  teamsByLeague: Record<string, TeamCount[]>;
  leagueStyle: Record<string, string>;
  headerSize?: "sm" | "lg";
}

/**
 * Pro breakdown with click-to-reveal team drill-down.
 *
 * Click a league pill → team row appears below with per-team Philly counts
 * (e.g., BUF · 2, KC · 3). Click again (or another league) to toggle.
 *
 * Used in desktop sidebar + mobile section on /our-guys.
 */
export default function LeagueTeamBreakdown({
  leagueBreakdown,
  teamsByLeague,
  leagueStyle,
  headerSize = "sm",
}: LeagueTeamBreakdownProps) {
  const [activeLeague, setActiveLeague] = useState<string | null>(null);
  const activeTeams = activeLeague ? teamsByLeague[activeLeague] ?? [] : [];

  const headerFontSize = headerSize === "lg" ? 18 : 16;
  const headerMargin = headerSize === "lg" ? 12 : 12;

  return (
    <div>
      <h3
        className="bar-section-header"
        style={{ fontSize: headerFontSize, marginBottom: headerMargin }}
      >
        PRO BREAKDOWN
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {leagueBreakdown.map(({ league, count }) => {
          const cls = leagueStyle[league] || "border-gray-500/30 text-gray-300";
          const active = activeLeague === league;
          const teams = teamsByLeague[league] ?? [];
          const hasDrill = teams.length > 0;
          return (
            <button
              key={league}
              type="button"
              className={`bar-league-pill ${cls}`}
              style={{
                cursor: hasDrill ? "pointer" : "default",
                background: active ? "rgba(240,165,0,0.12)" : undefined,
                outline: active ? "1px solid var(--psp-gold, #f0a500)" : undefined,
              }}
              onClick={() => {
                if (!hasDrill) return;
                setActiveLeague(active ? null : league);
              }}
              aria-pressed={active}
              aria-label={`${league}: ${count} Philly alumni${hasDrill ? " — click for teams" : ""}`}
            >
              {league}
              <span className="bar-league-count">{count}</span>
              {hasDrill && (
                <span
                  aria-hidden="true"
                  style={{
                    marginLeft: 4,
                    fontSize: 9,
                    opacity: 0.7,
                    transform: active ? "rotate(180deg)" : "none",
                    display: "inline-block",
                    transition: "transform .15s",
                  }}
                >
                  ▾
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeLeague && activeTeams.length > 0 && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid var(--psp-rule, rgba(245,235,214,0.12))",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              color: "var(--bar-text-muted)",
              marginBottom: 8,
            }}
          >
            {activeLeague} teams with Philly guys
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {activeTeams.map(({ team, count }) => (
              <span
                key={team}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 8px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  background: "var(--bar-surface-elevated, rgba(255,255,255,0.04))",
                  color: "var(--bar-text, #f5ebd6)",
                  border: "1px solid var(--psp-rule, rgba(245,235,214,0.15))",
                }}
              >
                {team}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--psp-gold, #f0a500)",
                    marginLeft: 2,
                  }}
                >
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
