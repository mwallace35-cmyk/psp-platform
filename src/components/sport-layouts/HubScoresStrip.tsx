"use client";

import { useRef, useState, useCallback } from "react";

export interface HubGame {
  id: number;
  home_score: number | null;
  away_score: number | null;
  game_date: string | null;
  game_type: string | null;
  playoff_round: string | null;
  home_school: { id: number; name: string; slug: string } | null;
  away_school: { id: number; name: string; slug: string } | null;
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
        {games.map((game) => {
          const homeName = game.home_school?.name ?? "TBD";
          const awayName = game.away_school?.name ?? "TBD";
          const homeScore = game.home_score ?? 0;
          const awayScore = game.away_score ?? 0;
          const homeWon = homeScore > awayScore;
          const awayWon = awayScore > homeScore;

          return (
            <div key={game.id} className="hub-score-chip">
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
            </div>
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
