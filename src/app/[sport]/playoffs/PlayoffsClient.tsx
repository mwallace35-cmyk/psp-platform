"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlayoffBracket from "@/components/playoffs/PlayoffBracket";
import type { PlayoffBracketWithGames, PlayoffSeason } from "@/lib/data";

interface Props {
  brackets: PlayoffBracketWithGames[];
  sportColor: string;
  seasons: PlayoffSeason[];
  selectedSeasonId: number | null;
  selectedSeasonLabel: string;
  sport: string;
}

/** Display labels for bracket types */
const BRACKET_TYPE_LABELS: Record<string, string> = {
  pcl: "PCL",
  public_league: "Public League",
  piaa_6a: "PIAA 6A",
  piaa_5a: "PIAA 5A",
  piaa_4a: "PIAA 4A",
  piaa_3a: "PIAA 3A",
  piaa_2a: "PIAA 2A",
  piaa_1a: "PIAA 1A",
  district_12: "District 12",
};

export default function PlayoffsClient({
  brackets,
  sportColor,
  seasons,
  selectedSeasonId,
  selectedSeasonLabel,
  sport,
}: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();
  const activeBracket = brackets[activeIdx];

  function handleSeasonChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSeasonId = e.target.value;
    router.push(`/${sport}/playoffs?season=${newSeasonId}`);
  }

  return (
    <div>
      {/* Season selector */}
      {seasons.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <label
            htmlFor="season-select"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: "15px",
              letterSpacing: "0.08em",
              color: "#f0a500",
              textTransform: "uppercase",
            }}
          >
            Select Season
          </label>
          <select
            id="season-select"
            value={selectedSeasonId ?? ""}
            onChange={handleSeasonChange}
            style={{
              background: "#0a1628",
              color: "#fff",
              border: "2px solid #f0a500",
              borderRadius: "20px",
              padding: "8px 36px 8px 16px",
              fontSize: "14px",
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontWeight: 600,
              cursor: "pointer",
              appearance: "none",
              WebkitAppearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23f0a500' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
              minWidth: "160px",
              outline: "none",
            }}
          >
            {seasons.map((s) => (
              <option key={s.seasonId} value={s.seasonId}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Season title */}
      {selectedSeasonLabel && (
        <h2
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "28px",
            letterSpacing: "0.04em",
            color: "var(--psp-navy, #0a1628)",
            margin: "0 0 16px 0",
            textTransform: "uppercase",
          }}
        >
          {selectedSeasonLabel} {sport === "football" ? "Football" : ""} Playoffs
        </h2>
      )}

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
      {activeBracket ? (
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
      ) : (
        <div
          className="rounded-xl px-5 py-[40px] text-center"
          style={{ background: "var(--psp-navy, #0a1628)" }}
        >
          <p
            className="text-sm text-white/75 m-0"
            style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)" }}
          >
            No bracket data available for this season.
          </p>
        </div>
      )}
    </div>
  );
}
