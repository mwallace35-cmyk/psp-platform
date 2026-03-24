"use client";

import { useState } from "react";
import Link from "next/link";

interface StatLeader {
  rank: number;
  playerName: string;
  schoolName: string;
  schoolSlug: string;
  statValue: number | string;
}

interface StatCategory {
  key: string;
  label: string;
  leaders: StatLeader[];
}

interface StatLeadersSidebarProps {
  sport: string;
  sportColor: string;
  statCategories: StatCategory[];
}

// Sample Philadelphia high school data - TODO: Replace with real Supabase data
const SAMPLE_DATA: Record<string, StatCategory[]> = {
  football: [
    {
      key: "rushing",
      label: "Rushing Yards",
      leaders: [
        {
          rank: 1,
          playerName: "Marcus Johnson",
          schoolName: "St. Joseph's Prep",
          schoolSlug: "st-josephs-prep",
          statValue: 1247,
        },
        {
          rank: 2,
          playerName: "Jaylen Davis",
          schoolName: "Roman Catholic",
          schoolSlug: "roman-catholic",
          statValue: 1189,
        },
        {
          rank: 3,
          playerName: "DeShawn Williams",
          schoolName: "La Salle College High",
          schoolSlug: "la-salle-college-high",
          statValue: 1102,
        },
        {
          rank: 4,
          playerName: "Terrance Brown",
          schoolName: "Archbishop Wood",
          schoolSlug: "archbishop-wood",
          statValue: 987,
        },
        {
          rank: 5,
          playerName: "Andre Thompson",
          schoolName: "Imhotep Charter",
          schoolSlug: "imhotep-charter",
          statValue: 945,
        },
      ],
    },
    {
      key: "passing",
      label: "Passing Yards",
      leaders: [
        {
          rank: 1,
          playerName: "Brandon Pierce",
          schoolName: "St. Joseph's Prep",
          schoolSlug: "st-josephs-prep",
          statValue: 2456,
        },
        {
          rank: 2,
          playerName: "Chris Rodriguez",
          schoolName: "Neumann-Goretti",
          schoolSlug: "neumann-goretti",
          statValue: 2189,
        },
        {
          rank: 3,
          playerName: "Tyler McKenzie",
          schoolName: "La Salle College High",
          schoolSlug: "la-salle-college-high",
          statValue: 1998,
        },
        {
          rank: 4,
          playerName: "Kevin Nelson",
          schoolName: "Roman Catholic",
          schoolSlug: "roman-catholic",
          statValue: 1847,
        },
        {
          rank: 5,
          playerName: "Michael Garcia",
          schoolName: "Archbishop Wood",
          schoolSlug: "archbishop-wood",
          statValue: 1756,
        },
      ],
    },
    {
      key: "touchdowns",
      label: "Touchdowns",
      leaders: [
        {
          rank: 1,
          playerName: "Marcus Johnson",
          schoolName: "St. Joseph's Prep",
          schoolSlug: "st-josephs-prep",
          statValue: 18,
        },
        {
          rank: 2,
          playerName: "Jaylen Davis",
          schoolName: "Roman Catholic",
          schoolSlug: "roman-catholic",
          statValue: 16,
        },
        {
          rank: 3,
          playerName: "Brandon Pierce",
          schoolName: "St. Joseph's Prep",
          schoolSlug: "st-josephs-prep",
          statValue: 15,
        },
        {
          rank: 4,
          playerName: "Chris Rodriguez",
          schoolName: "Neumann-Goretti",
          schoolSlug: "neumann-goretti",
          statValue: 14,
        },
        {
          rank: 5,
          playerName: "DeShawn Williams",
          schoolName: "La Salle College High",
          schoolSlug: "la-salle-college-high",
          statValue: 12,
        },
      ],
    },
  ],
  basketball: [
    {
      key: "ppg",
      label: "Points Per Game",
      leaders: [
        {
          rank: 1,
          playerName: "Jamal Murray",
          schoolName: "La Salle College High",
          schoolSlug: "la-salle-college-high",
          statValue: "24.5",
        },
        {
          rank: 2,
          playerName: "Jalen Harris",
          schoolName: "Roman Catholic",
          schoolSlug: "roman-catholic",
          statValue: "22.8",
        },
        {
          rank: 3,
          playerName: "Darius Brown",
          schoolName: "Neumann-Goretti",
          schoolSlug: "neumann-goretti",
          statValue: "21.3",
        },
        {
          rank: 4,
          playerName: "Isiah Washington",
          schoolName: "St. Joseph's Prep",
          schoolSlug: "st-josephs-prep",
          statValue: "19.7",
        },
        {
          rank: 5,
          playerName: "Marcus Green",
          schoolName: "Archbishop Wood",
          schoolSlug: "archbishop-wood",
          statValue: "18.9",
        },
      ],
    },
    {
      key: "rpg",
      label: "Rebounds Per Game",
      leaders: [
        {
          rank: 1,
          playerName: "Andre Bates",
          schoolName: "Roman Catholic",
          schoolSlug: "roman-catholic",
          statValue: "12.4",
        },
        {
          rank: 2,
          playerName: "Jamal Brown",
          schoolName: "La Salle College High",
          schoolSlug: "la-salle-college-high",
          statValue: "11.8",
        },
        {
          rank: 3,
          playerName: "DeAndre Jackson",
          schoolName: "Neumann-Goretti",
          schoolSlug: "neumann-goretti",
          statValue: "10.9",
        },
        {
          rank: 4,
          playerName: "Kevin Smith",
          schoolName: "Imhotep Charter",
          schoolSlug: "imhotep-charter",
          statValue: "10.2",
        },
        {
          rank: 5,
          playerName: "Tyler Richards",
          schoolName: "St. Joseph's Prep",
          schoolSlug: "st-josephs-prep",
          statValue: "9.7",
        },
      ],
    },
    {
      key: "apg",
      label: "Assists Per Game",
      leaders: [
        {
          rank: 1,
          playerName: "Jalen Harris",
          schoolName: "Roman Catholic",
          schoolSlug: "roman-catholic",
          statValue: "7.2",
        },
        {
          rank: 2,
          playerName: "Isiah Washington",
          schoolName: "St. Joseph's Prep",
          schoolSlug: "st-josephs-prep",
          statValue: "6.8",
        },
        {
          rank: 3,
          playerName: "Marcus Green",
          schoolName: "Archbishop Wood",
          schoolSlug: "archbishop-wood",
          statValue: "6.1",
        },
        {
          rank: 4,
          playerName: "Jamal Murray",
          schoolName: "La Salle College High",
          schoolSlug: "la-salle-college-high",
          statValue: "5.9",
        },
        {
          rank: 5,
          playerName: "Darius Brown",
          schoolName: "Neumann-Goretti",
          schoolSlug: "neumann-goretti",
          statValue: "5.3",
        },
      ],
    },
  ],
  baseball: [
    {
      key: "batting_avg",
      label: "Batting Average",
      leaders: [
        {
          rank: 1,
          playerName: "Anthony Rizzo",
          schoolName: "St. Joseph's Prep",
          schoolSlug: "st-josephs-prep",
          statValue: ".387",
        },
        {
          rank: 2,
          playerName: "Kyle Schwarber",
          schoolName: "La Salle College High",
          schoolSlug: "la-salle-college-high",
          statValue: ".375",
        },
        {
          rank: 3,
          playerName: "Miguel Santos",
          schoolName: "Roman Catholic",
          schoolSlug: "roman-catholic",
          statValue: ".368",
        },
        {
          rank: 4,
          playerName: "Luis Garcia",
          schoolName: "Neumann-Goretti",
          schoolSlug: "neumann-goretti",
          statValue: ".352",
        },
        {
          rank: 5,
          playerName: "David Chen",
          schoolName: "Archbishop Wood",
          schoolSlug: "archbishop-wood",
          statValue: ".348",
        },
      ],
    },
    {
      key: "home_runs",
      label: "Home Runs",
      leaders: [
        {
          rank: 1,
          playerName: "Anthony Rizzo",
          schoolName: "St. Joseph's Prep",
          schoolSlug: "st-josephs-prep",
          statValue: 14,
        },
        {
          rank: 2,
          playerName: "Kyle Schwarber",
          schoolName: "La Salle College High",
          schoolSlug: "la-salle-college-high",
          statValue: 12,
        },
        {
          rank: 3,
          playerName: "Brandon Lopez",
          schoolName: "Roman Catholic",
          schoolSlug: "roman-catholic",
          statValue: 11,
        },
        {
          rank: 4,
          playerName: "Miguel Santos",
          schoolName: "Neumann-Goretti",
          schoolSlug: "neumann-goretti",
          statValue: 9,
        },
        {
          rank: 5,
          playerName: "Jose Martinez",
          schoolName: "Imhotep Charter",
          schoolSlug: "imhotep-charter",
          statValue: 8,
        },
      ],
    },
    {
      key: "era",
      label: "ERA",
      leaders: [
        {
          rank: 1,
          playerName: "Lucas Perez",
          schoolName: "St. Joseph's Prep",
          schoolSlug: "st-josephs-prep",
          statValue: "1.82",
        },
        {
          rank: 2,
          playerName: "Aaron Nola",
          schoolName: "La Salle College High",
          schoolSlug: "la-salle-college-high",
          statValue: "2.14",
        },
        {
          rank: 3,
          playerName: "Zack Wheeler",
          schoolName: "Roman Catholic",
          schoolSlug: "roman-catholic",
          statValue: "2.48",
        },
        {
          rank: 4,
          playerName: "Bryce Harper",
          schoolName: "Archbishop Wood",
          schoolSlug: "archbishop-wood",
          statValue: "2.67",
        },
        {
          rank: 5,
          playerName: "Ranger Suarez",
          schoolName: "Neumann-Goretti",
          schoolSlug: "neumann-goretti",
          statValue: "2.91",
        },
      ],
    },
  ],
};

export default function StatLeadersSidebar({
  sport,
  sportColor,
  statCategories,
}: StatLeadersSidebarProps) {
  // Use provided stat categories or fallback to sample data
  const categories =
    statCategories && statCategories.length > 0
      ? statCategories
      : SAMPLE_DATA[sport] || [];

  const [activeStat, setActiveStat] = useState(
    categories[0]?.key || "ppg"
  );

  const activeCategory = categories.find((cat) => cat.key === activeStat);

  if (!activeCategory || !categories.length) {
    return null;
  }

  return (
    <div
      style={{
        background: "var(--psp-white)",
        border: "1px solid var(--psp-gray-200)",
        borderRadius: 6,
        padding: 0,
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--psp-gray-200)",
          fontWeight: 700,
          fontSize: 13,
          color: "var(--psp-navy)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 16 }} aria-hidden="true">📊</span>
        Stat Leaders
      </div>

      {/* Tab Navigation - Horizontal Scroll */}
      {categories.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "8px 12px",
            borderBottom: "1px solid var(--psp-gray-100)",
            overflowX: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveStat(cat.key)}
              style={{
                padding: "6px 10px",
                fontSize: 11,
                fontWeight: activeStat === cat.key ? 600 : 500,
                color:
                  activeStat === cat.key
                    ? sportColor
                    : "var(--psp-gray-500)",
                background: "transparent",
                border: "none",
                borderBottom:
                  activeStat === cat.key
                    ? `2px solid ${sportColor}`
                    : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Leaders List */}
      <div style={{ padding: "12px 0" }}>
        {activeCategory.leaders.map((leader) => (
          <div
            key={`${leader.rank}-${leader.playerName}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderBottom: "1px solid var(--psp-gray-100)",
              fontSize: 12,
            }}
          >
            {/* Rank Circle - Sport Colored */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: sportColor,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              {leader.rank}
            </div>

            {/* Player and School Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--psp-navy)",
                  fontSize: 12,
                  marginBottom: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {leader.playerName}
              </div>
              <Link
                href={`/${sport}/schools/${leader.schoolSlug}`}
                style={{
                  fontSize: 11,
                  color: "var(--psp-gray-500)",
                  textDecoration: "none",
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = sportColor;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "var(--psp-gray-500)";
                }}
              >
                {leader.schoolName}
              </Link>
            </div>

            {/* Stat Value */}
            <div
              style={{
                fontWeight: 700,
                color: sportColor,
                fontSize: 13,
                minWidth: 50,
                textAlign: "right",
              }}
            >
              {leader.statValue}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link to Full Leaderboards */}
      <div
        style={{
          padding: "8px 12px",
          borderTop: "1px solid var(--psp-gray-100)",
          textAlign: "center",
        }}
      >
        <Link
          href={`/${sport}/leaderboards/${activeStat}`}
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: sportColor,
            textDecoration: "none",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.textDecoration = "none";
          }}
        >
          View All {activeCategory.label} ↗
        </Link>
      </div>
    </div>
  );
}
