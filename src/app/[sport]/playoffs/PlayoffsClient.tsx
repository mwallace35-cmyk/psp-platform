"use client";

import { useState } from "react";
import PlayoffBracket from "@/components/playoffs/PlayoffBracket";
import type { PlayoffBracketWithGames } from "@/lib/data";

interface Props {
  brackets: PlayoffBracketWithGames[];
  sportColor: string;
}

/** Display labels for bracket types */
const BRACKET_TYPE_LABELS: Record<string, string> = {
  pcl: "PCL",
  public_league: "Public League",
  piaa_6a: "PIAA 6A",
  piaa_5a: "PIAA 5A",
  piaa_4a: "PIAA 4A",
  piaa_3a: "PIAA 3A",
  district_12: "District 12",
};

export default function PlayoffsClient({ brackets, sportColor }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeBracket = brackets[activeIdx];

  if (!activeBracket) return null;

  return (
    <div>
      {/* Bracket selector tabs */}
      {brackets.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "20px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "4px",
          }}
          role="tablist"
          aria-label="Playoff bracket selector"
        >
          {brackets.map((bracket, idx) => {
            const isActive = idx === activeIdx;
            const label =
              BRACKET_TYPE_LABELS[bracket.bracket_type] || bracket.name;

            return (
              <button
                key={bracket.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIdx(idx)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  border: isActive
                    ? `2px solid ${sportColor}`
                    : "2px solid rgba(255,255,255,0.1)",
                  background: isActive
                    ? `${sportColor}20`
                    : "var(--psp-navy-mid, #0f2040)",
                  color: isActive ? sportColor : "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                }}
              >
                {label}
                {bracket.classification && (
                  <span
                    style={{
                      marginLeft: "6px",
                      fontSize: "11px",
                      opacity: 0.7,
                    }}
                  >
                    ({bracket.classification})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Active bracket */}
      <PlayoffBracket
        bracketName={activeBracket.name}
        games={activeBracket.games.map((g) => ({
          id: g.id,
          round_name: g.round_name,
          round_number: g.round_number,
          game_number: g.game_number,
          team1_name: g.team1_name,
          team1_score: g.team1_score,
          team1_seed: g.team1_seed,
          team2_name: g.team2_name,
          team2_score: g.team2_score,
          team2_seed: g.team2_seed,
          winner_school_id: g.winner_school_id,
          team1_school_id: g.team1_school_id,
          team2_school_id: g.team2_school_id,
        }))}
        sportColor={sportColor}
      />
    </div>
  );
}
