"use client";

import Link from "next/link";
import { useRef, useState, useCallback } from "react";

export interface HubGame {
  id: number;
  home_score: number | null;
  away_score: number | null;
  game_date: string | null;
  game_type: string | null;
  playoff_round: string | null;
  home_school: { id: number; name: string; slug: string; league?: string } | null;
  away_school: { id: number; name: string; slug: string; league?: string } | null;
  seasons: { label: string } | null;
}

interface HubScoresStripProps {
  games: HubGame[];
  sportColor: string;
  sport: string;
}

/**
 * Horizontal scrolling score banner for sport hub pages.
 * Shows recent game results with team names and scores.
 * Handles null school names gracefully (shows "TBD" instead of "Home"/"Away").
 * Detects rivalry games, upsets, and marks first game as "Game of the Week".
 */
export default function HubScoresStrip({ games, sportColor, sport }: HubScoresStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  }, [checkScroll]);

  const isRivalryGame = (game: HubGame): boolean => {
    if (game.game_type === "rivalry") return true;

    // Check if teams are from different leagues (Catholic vs Public)
    const homeLeague = game.home_school?.league;
    const awayLeague = game.away_school?.league;

    if (homeLeague && awayLeague && homeLeague !== awayLeague) {
      return true;
    }

    return false;
  };

  const isUpset = (game: HubGame): boolean => {
    if (game.home_score === null || game.away_score === null) return false;
    // Upset when away team wins
    return game.away_score > game.home_score;
  };

  if (!games || games.length === 0) return null;

  return (
    <div className="hub-scores-strip">
      {canScrollLeft && (
        <button
          className="hub-scores-nav hub-scores-nav-left"
          onClick={() => scroll("left")}
          aria-label="Scroll scores left"
        >
          ‹
        </button>
      )}

      <div
        className="hub-scores-inner"
        ref={scrollRef}
        onScroll={checkScroll}
      >
        {games.map((game, index) => {
          const homeName = game.home_school?.name ?? "TBD";
          const awayName = game.away_school?.name ?? "TBD";
          const homeScore = game.home_score ?? 0;
          const awayScore = game.away_score ?? 0;
          const homeWon = homeScore > awayScore;
          const awayWon = awayScore > homeScore;
          const isRivalry = isRivalryGame(game);
          const isUpsettingWin = isUpset(game);
          const isFirstGame = index === 0;
          const borderColor = isRivalry ? "#D4A843" : sportColor;

          return (
            <Link
              key={game.id}
              href={`/${sport}/games/${game.id}`}
              className="hub-score-chip"
              style={{
                borderLeftColor: borderColor,
                borderLeftWidth: "4px",
                borderLeftStyle: "solid",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {isFirstGame && (
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#D4A843",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  GAME OF THE WEEK
                </div>
              )}
              <div className={`hsc-team${homeWon ? " hsc-w" : ""}`}>
                <span className="hsc-name" title={homeName}>{homeName}</span>
                <span className="hsc-score" style={homeWon ? { color: sportColor } : undefined}>
                  {homeScore}
                </span>
              </div>
              <div className={`hsc-team${awayWon ? " hsc-w" : ""}`}>
                <span className="hsc-name" title={awayName}>{awayName}</span>
                <span className="hsc-score" style={awayWon ? { color: sportColor } : undefined}>
                  {awayScore}
                </span>
              </div>
              {isUpsettingWin && (
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    marginTop: "4px",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                  }}
                >
                  UPSET
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {canScrollRight && (
        <button
          className="hub-scores-nav hub-scores-nav-right"
          onClick={() => scroll("right")}
          aria-label="Scroll scores right"
        >
          ›
        </button>
      )}
    </div>
  );
}
