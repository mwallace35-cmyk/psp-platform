"use client";

import { useState, useMemo, useRef } from "react";
import { GameDetail } from "./GameDetail";
import type { TickerGame } from "./ScoreTicker";

// League emoji mapping
const LEAGUE_EMOJI: Record<string, string> = {
  NFL: "\u{1F3C8}",
  CFB: "\u{1F3C8}",
  NBA: "\u{1F3C0}",
  CBB: "\u{1F3C0}",
  MLB: "\u26BE",
};

interface TickerCrawlProps {
  games: TickerGame[];
  leagues: string[];
}

export function TickerCrawl({ games, leagues }: TickerCrawlProps) {
  const [activeLeague, setActiveLeague] = useState<string | null>(null);
  const [expandedGame, setExpandedGame] = useState<TickerGame | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Filter games by selected league
  const filteredGames = useMemo(() => {
    if (!activeLeague) return games;
    return games.filter(g => g.league === activeLeague);
  }, [games, activeLeague]);

  // Format a single game for the crawl
  const formatGame = (game: TickerGame) => {
    const isPhilly = game.hasPhillyConnection;
    const score = game.status === "final"
      ? `${game.awayTeamName} ${game.awayScore} - ${game.homeTeamName} ${game.homeScore}`
      : `${game.awayTeamName} vs ${game.homeTeamName}`;
    return { text: score, isPhilly, game };
  };

  const formattedGames = filteredGames.map(formatGame);
  // Duplicate for seamless loop
  const crawlItems = [...formattedGames, ...formattedGames];

  const handleGameClick = (game: TickerGame) => {
    if (game.hasPhillyConnection) {
      setExpandedGame(prev => prev?.id === game.id ? null : game);
      setIsPaused(true);
    }
  };

  const handleTickerInteraction = () => {
    if (!expandedGame) {
      setIsPaused(prev => !prev);
    }
  };

  // Calculate animation duration based on content
  const duration = Math.max(30, filteredGames.length * 4);

  return (
    <div className="ticker-wrapper">
      {/* League filter pills */}
      <div className="ticker-pills" style={{
        display: "flex",
        gap: "8px",
        padding: "8px 16px",
        background: "#050d1a",
        borderBottom: "1px solid rgba(240, 165, 0, 0.15)",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}>
        <button
          onClick={() => setActiveLeague(null)}
          className={`ticker-pill ${!activeLeague ? 'active' : ''}`}
          style={{
            padding: "4px 12px",
            borderRadius: "9999px",
            fontSize: "13px",
            fontWeight: 600,
            border: "1px solid",
            borderColor: !activeLeague ? "#f0a500" : "rgba(255,255,255,0.15)",
            background: !activeLeague ? "rgba(240,165,0,0.15)" : "transparent",
            color: !activeLeague ? "#f0a500" : "#9ca3af",
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          }}
        >
          ALL
        </button>
        {leagues.map(league => (
          <button
            key={league}
            onClick={() => setActiveLeague(league === activeLeague ? null : league)}
            className={`ticker-pill ${activeLeague === league ? 'active' : ''}`}
            style={{
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 600,
              border: "1px solid",
              borderColor: activeLeague === league ? "#f0a500" : "rgba(255,255,255,0.15)",
              background: activeLeague === league ? "rgba(240,165,0,0.15)" : "transparent",
              color: activeLeague === league ? "#f0a500" : "#9ca3af",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            }}
          >
            {LEAGUE_EMOJI[league] || ""} {league}
          </button>
        ))}
      </div>

      {/* The crawling ticker */}
      <div
        ref={tickerRef}
        onClick={handleTickerInteraction}
        onTouchStart={handleTickerInteraction}
        style={{
          background: "#050d1a",
          overflow: "hidden",
          cursor: "pointer",
          padding: "10px 0",
          position: "relative",
        }}
        aria-label="Score ticker — tap to pause"
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: `ticker-crawl ${duration}s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {crawlItems.map((item, i) => (
            <span
              key={`${item.game.id}-${i}`}
              onClick={(e) => {
                e.stopPropagation();
                handleGameClick(item.game);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 16px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                color: item.isPhilly ? "#f0a500" : "#f5f0e8",
                background: item.isPhilly
                  ? "linear-gradient(90deg, rgba(240, 165, 0, 0.12) 0%, transparent 100%)"
                  : "transparent",
                borderRadius: item.isPhilly ? "4px" : "0",
                cursor: item.isPhilly ? "pointer" : "default",
                transition: "background 0.2s",
              }}
            >
              <span style={{ marginRight: "8px", opacity: 0.5 }}>{"\u25B8\u25B8"}</span>
              {item.text}
              {item.isPhilly && (
                <span style={{ marginLeft: "6px" }} title="Philly connection">{"\uD83D\uDD14"}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded game detail (Philly connection) */}
      {expandedGame && (
        <div className="psp-expand-in" style={{ overflow: "hidden" }}>
          <GameDetail
            game={expandedGame}
            onClose={() => {
              setExpandedGame(null);
              setIsPaused(false);
            }}
          />
        </div>
      )}

      {/* CSS for the ticker animation */}
      <style jsx global>{`
        @keyframes ticker-crawl {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
