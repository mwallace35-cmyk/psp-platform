"use client";

import { useMemo } from "react";

// ============================================================================
// Types
// ============================================================================

export interface BracketGame {
  id: number;
  round_name: string;
  round_number: number;
  game_number: number;
  team1_name: string | null;
  team1_score: number | null;
  team1_seed: number | null;
  team2_name: string | null;
  team2_score: number | null;
  team2_seed: number | null;
  winner_school_id: number | null;
  team1_school_id: number | null;
  team2_school_id: number | null;
}

interface Props {
  bracketName: string;
  games: BracketGame[];
  sportColor: string;
}

// ============================================================================
// Helpers
// ============================================================================

/** Group games by round, sorted by round_number then game_number */
function groupByRound(games: BracketGame[]) {
  const rounds = new Map<number, { name: string; games: BracketGame[] }>();
  for (const g of games) {
    if (!rounds.has(g.round_number)) {
      rounds.set(g.round_number, { name: g.round_name, games: [] });
    }
    rounds.get(g.round_number)!.games.push(g);
  }
  // Sort games within each round
  for (const r of rounds.values()) {
    r.games.sort((a, b) => a.game_number - b.game_number);
  }
  return Array.from(rounds.entries())
    .sort(([a], [b]) => a - b)
    .map(([num, data]) => ({ roundNumber: num, ...data }));
}

/** Check if a team won */
function isWinner(game: BracketGame, teamNum: 1 | 2): boolean {
  if (!game.winner_school_id) return false;
  const schoolId = teamNum === 1 ? game.team1_school_id : game.team2_school_id;
  return schoolId === game.winner_school_id;
}

/** Check if game is completed */
function isCompleted(game: BracketGame): boolean {
  return game.winner_school_id !== null;
}

// ============================================================================
// Sub-components
// ============================================================================

function TeamRow({
  name,
  seed,
  score,
  won,
  lost,
  sportColor,
  position,
}: {
  name: string | null;
  seed: number | null;
  score: number | null;
  won: boolean;
  lost: boolean;
  sportColor: string;
  position: "top" | "bottom";
}) {
  const displayName = name || "TBD";
  const isTBD = !name;

  return (
    <div
      className="bracket-team-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        borderBottom: position === "top" ? "1px solid rgba(255,255,255,0.08)" : "none",
        borderRadius: position === "top" ? "6px 6px 0 0" : "0 0 6px 6px",
        background: won ? "rgba(240,165,0,0.12)" : "transparent",
        opacity: lost ? 0.45 : 1,
        transition: "background 0.2s",
        minHeight: "32px",
      }}
    >
      {/* Seed */}
      {seed !== null && (
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: sportColor,
            minWidth: "16px",
            textAlign: "center",
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          }}
        >
          {seed}
        </span>
      )}

      {/* Team name */}
      <span
        style={{
          flex: 1,
          fontSize: "12px",
          fontWeight: won ? 700 : 400,
          color: isTBD
            ? "rgba(255,255,255,0.3)"
            : won
            ? "#f0a500"
            : "rgba(255,255,255,0.85)",
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontStyle: isTBD ? "italic" : "normal",
        }}
      >
        {displayName}
      </span>

      {/* Score */}
      <span
        style={{
          fontSize: "12px",
          fontWeight: won ? 700 : 500,
          color: won ? "#f0a500" : "rgba(255,255,255,0.6)",
          minWidth: "20px",
          textAlign: "right",
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
        }}
      >
        {score !== null ? score : isTBD ? "" : "-"}
      </span>
    </div>
  );
}

function GameCard({
  game,
  sportColor,
  isChampionship,
}: {
  game: BracketGame;
  sportColor: string;
  isChampionship: boolean;
}) {
  const completed = isCompleted(game);
  const team1Won = isWinner(game, 1);
  const team2Won = isWinner(game, 2);

  return (
    <div
      className="bracket-game-card"
      style={{
        width: isChampionship ? "200px" : "180px",
        background: "var(--psp-navy-mid, #0f2040)",
        border: isChampionship
          ? "2px solid #f0a500"
          : `1px solid ${completed ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "8px",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: isChampionship
          ? "0 0 20px rgba(240,165,0,0.2)"
          : "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Championship label */}
      {isChampionship && (
        <div
          style={{
            background: "linear-gradient(135deg, #f0a500, #f5c542)",
            color: "var(--psp-navy, #0a1628)",
            fontSize: "9px",
            fontWeight: 800,
            textAlign: "center",
            padding: "3px 0",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
          className="font-bebas"
        >
          CHAMPIONSHIP
        </div>
      )}

      <TeamRow
        name={game.team1_name}
        seed={game.team1_seed}
        score={game.team1_score}
        won={team1Won}
        lost={completed && !team1Won}
        sportColor={sportColor}
        position="top"
      />
      <TeamRow
        name={game.team2_name}
        seed={game.team2_seed}
        score={game.team2_score}
        won={team2Won}
        lost={completed && !team2Won}
        sportColor={sportColor}
        position="bottom"
      />
    </div>
  );
}

// ============================================================================
// Connector lines (SVG)
// ============================================================================

function RoundConnectors({
  gamesInRound,
  gamesInNextRound,
  cardHeight,
  sportColor,
}: {
  gamesInRound: number;
  gamesInNextRound: number;
  cardHeight: number;
  sportColor: string;
}) {
  if (gamesInNextRound === 0) return null;

  const gap = 16; // vertical gap between cards
  const connectorWidth = 32;
  const totalHeight = gamesInRound * cardHeight + (gamesInRound - 1) * gap;

  // Build paths: each pair of games feeds into one next-round game
  const paths: string[] = [];
  for (let i = 0; i < gamesInNextRound; i++) {
    const topGameIdx = i * 2;
    const bottomGameIdx = i * 2 + 1;

    if (bottomGameIdx >= gamesInRound) break;

    const topY = topGameIdx * (cardHeight + gap) + cardHeight / 2;
    const bottomY = bottomGameIdx * (cardHeight + gap) + cardHeight / 2;
    const midY = (topY + bottomY) / 2;
    const halfW = connectorWidth / 2;

    // Top game -> right -> down to mid
    paths.push(`M 0 ${topY} H ${halfW} V ${midY} H ${connectorWidth}`);
    // Bottom game -> right -> up to mid
    paths.push(`M 0 ${bottomY} H ${halfW} V ${midY}`);
  }

  return (
    <svg
      width={connectorWidth}
      height={totalHeight}
      style={{ flexShrink: 0, display: "block" }}
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={sportColor}
          strokeWidth={1.5}
          strokeOpacity={0.5}
        />
      ))}
    </svg>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function PlayoffBracket({ bracketName, games, sportColor }: Props) {
  const rounds = useMemo(() => groupByRound(games), [games]);

  if (games.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
        }}
      >
        <p style={{ fontSize: "16px", marginBottom: "8px" }}>No bracket data available yet.</p>
        <p style={{ fontSize: "13px" }}>Check back when the playoffs begin.</p>
      </div>
    );
  }

  // Find the championship round (highest round_number)
  const maxRound = Math.max(...rounds.map((r) => r.roundNumber));

  // Split rounds into left side and championship
  // For standard bracket: left rounds lead to the championship
  const leftRounds = rounds.filter((r) => r.roundNumber < maxRound);
  const championshipRound = rounds.find((r) => r.roundNumber === maxRound);

  // Card height estimate for connector positioning
  const cardHeight = 66; // ~two rows at 32px + border

  // Find champion
  const championshipGame = championshipRound?.games[0];
  const champion =
    championshipGame && championshipGame.winner_school_id
      ? championshipGame.team1_school_id === championshipGame.winner_school_id
        ? championshipGame.team1_name
        : championshipGame.team2_name
      : null;

  return (
    <div
      className="playoff-bracket-wrapper"
      style={{
        background: "var(--psp-navy, #0a1628)",
        borderRadius: "12px",
        padding: "24px",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Bracket title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <h3
          className="psp-h3 text-white"
        >
          {bracketName}
        </h3>
        {champion && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(240,165,0,0.15)",
              border: "1px solid rgba(240,165,0,0.3)",
              borderRadius: "20px",
              padding: "4px 14px",
            }}
          >
            <span style={{ fontSize: "14px" }} aria-hidden="true">
              &#127942;
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#f0a500",
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              }}
            >
              {champion}
            </span>
          </div>
        )}
      </div>

      {/* Bracket grid */}
      <div
        className="bracket-grid"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
          minWidth: "fit-content",
        }}
      >
        {/* Left rounds */}
        {leftRounds.map((round, roundIdx) => {
          const nextRound = leftRounds[roundIdx + 1] || championshipRound;
          const nextGamesCount = nextRound ? nextRound.games.length : 0;

          // Calculate vertical spacing to center games relative to their connections
          // Each round's games need more vertical space for earlier rounds
          const roundGap = 16 * Math.pow(2, roundIdx);

          return (
            <div
              key={round.roundNumber}
              style={{ display: "flex", alignItems: "center" }}
            >
              {/* Round column */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: `${roundGap}px`,
                }}
              >
                {/* Round label */}
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "8px",
                    fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  }}
                >
                  {round.name}
                </div>

                {/* Games in this round */}
                {round.games.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    sportColor={sportColor}
                    isChampionship={false}
                  />
                ))}
              </div>

              {/* Connector lines to next round */}
              {nextGamesCount > 0 && (
                <div style={{ padding: "0 4px", marginTop: "28px" }}>
                  <RoundConnectors
                    gamesInRound={round.games.length}
                    gamesInNextRound={nextGamesCount}
                    cardHeight={cardHeight + roundGap}
                    sportColor={sportColor}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Championship */}
        {championshipRound && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#f0a500",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "8px",
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              }}
            >
              {championshipRound.name}
            </div>
            {championshipRound.games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                sportColor={sportColor}
                isChampionship={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile scroll hint */}
      <div
        className="bracket-scroll-hint"
        style={{
          textAlign: "center",
          marginTop: "12px",
          fontSize: "11px",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
        }}
      >
        Scroll horizontally to see full bracket &#8594;
      </div>

      <style>{`
        .bracket-scroll-hint {
          display: none;
        }
        @media (max-width: 768px) {
          .bracket-scroll-hint {
            display: block !important;
          }
        }
        .bracket-game-card:hover {
          border-color: ${sportColor} !important;
          transition: border-color 0.2s;
        }
      `}</style>
    </div>
  );
}
