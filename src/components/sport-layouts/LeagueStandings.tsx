"use client";

import { useState } from "react";
import Link from "next/link";

interface TeamRecord {
  id: number;
  wins: number;
  losses: number;
  ties?: number;
  schools?: { name: string; slug: string } | null;
  league?: string; // Optional league field for grouping
  season?: string; // Optional season field
}

interface LeagueStandingsProps {
  standings: TeamRecord[];
  sport: string;
  sportColor: string;
  metaName?: string;
}

interface LeagueGroup {
  name: string;
  teams: TeamRecord[];
}

export default function LeagueStandings({
  standings,
  sport,
  sportColor,
  metaName = "Standings",
}: LeagueStandingsProps) {
  // Group standings by league if available, otherwise group all together
  const groupedByLeague: LeagueGroup[] = groupStandingsByLeague(standings);

  const [activeLeague, setActiveLeague] = useState(
    groupedByLeague[0]?.name || "All"
  );

  const activeStandings =
    groupedByLeague.find((g) => g.name === activeLeague)?.teams || [];

  return (
    <div style={{ marginBottom: 20 }}>
      {/* League Tabs */}
      {groupedByLeague.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 0,
            marginBottom: 16,
            borderBottom: "2px solid var(--psp-gray-200)",
            overflowX: "auto",
          }}
        >
          {groupedByLeague.map((league) => (
            <button
              key={league.name}
              onClick={() => setActiveLeague(league.name)}
              style={{
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: activeLeague === league.name ? 700 : 500,
                color:
                  activeLeague === league.name
                    ? sportColor
                    : "var(--psp-gray-500)",
                background: "transparent",
                border: "none",
                borderBottom:
                  activeLeague === league.name
                    ? `3px solid ${sportColor}`
                    : "3px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                marginBottom: -2,
              }}
            >
              {league.name}
            </button>
          ))}
        </div>
      )}

      {/* Standings Table */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 8,
            borderBottom: "2px solid var(--psp-gray-200)",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--psp-gray-600)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {activeLeague} {metaName}
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: sportColor,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            W-L{activeStandings[0]?.ties ? "-T" : ""}
          </div>
        </div>

        {activeStandings.length > 0 ? (
          <div>
            {activeStandings.map((team, index) => (
              <div
                key={team.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--psp-gray-100)",
                  fontSize: 13,
                }}
              >
                {/* Rank Number - Sport Colored */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: index < 3 ? sportColor : "var(--psp-gray-300)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>

                {/* Team Name */}
                <div style={{ flex: 1 }}>
                  {team.schools?.slug ? (
                    <Link
                      href={`/${sport}/schools/${team.schools.slug}`}
                      style={{
                        fontWeight: 600,
                        color: "var(--psp-blue)",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.textDecoration =
                          "underline";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.textDecoration = "none";
                      }}
                    >
                      {team.schools.name}
                    </Link>
                  ) : (
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>
                      {team.schools?.name || `Team ${team.id}`}
                    </span>
                  )}
                </div>

                {/* Record */}
                <div
                  style={{
                    fontWeight: 700,
                    color: "var(--psp-navy)",
                    minWidth: 60,
                    textAlign: "right",
                  }}
                >
                  {team.wins}-{team.losses}
                  {team.ties ? `-${team.ties}` : ""}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--psp-gray-400)",
              fontSize: 13,
            }}
          >
            No standings data available
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Groups standings by league.
 * If standings have a league field, uses that for grouping.
 * Otherwise, checks for school.leagues relationship.
 * If no league data exists, returns all teams in a single group.
 */
function groupStandingsByLeague(standings: TeamRecord[]): LeagueGroup[] {
  const leagueMap = new Map<string, TeamRecord[]>();

  standings.forEach((team) => {
    // Try to get league name from multiple sources
    let leagueName = team.league;

    // If no explicit league field, try to get from schools.leagues relationship
    if (!leagueName && team.schools?.name) {
      // Extract league info from school if available in future
      // For now, just use a default
      leagueName = "League"; // Default fallback
    }

    // Default to generic group if no league found
    leagueName = leagueName || "All Teams";

    if (!leagueMap.has(leagueName)) {
      leagueMap.set(leagueName, []);
    }
    leagueMap.get(leagueName)!.push(team);
  });

  // Sort league groups alphabetically and return as array
  return Array.from(leagueMap.entries())
    .sort((a, b) => {
      // Put "All Teams" first if it exists
      if (a[0] === "All Teams") return -1;
      if (b[0] === "All Teams") return 1;
      return a[0].localeCompare(b[0]);
    })
    .map(([name, teams]) => ({ name, teams }));
}
