"use client";

import { useEffect, useState } from "react";
import type { TickerGame } from "./ScoreTicker";

interface PhillyPlayerStat {
  playerName: string;
  highSchool: string | null;
  stats: Record<string, number>;
  socialTwitter?: string | null;
  socialInstagram?: string | null;
}

interface GameDetailProps {
  game: TickerGame;
  onClose: () => void;
}

export function GameDetail({ game, onClose }: GameDetailProps) {
  const [players, setPlayers] = useState<PhillyPlayerStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Philly player stats for this game from our API
    async function fetchPlayers() {
      try {
        const res = await fetch(`/api/our-guys/game-stats?gameId=${game.id}`);
        if (res.ok) {
          const data = await res.json();
          setPlayers(data.players || []);
        }
      } catch {
        // Silently fail — show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, [game.id]);

  // Format stat line for display
  const formatStats = (stats: Record<string, number>) => {
    const parts: string[] = [];
    // Football
    if (stats.rush_yds) parts.push(`${stats.rush_yds} rush yds`);
    if (stats.rush_td) parts.push(`${stats.rush_td} rush TD`);
    if (stats.pass_yds) parts.push(`${stats.pass_yds} pass yds`);
    if (stats.pass_td) parts.push(`${stats.pass_td} pass TD`);
    if (stats.rec_yds) parts.push(`${stats.rec_yds} rec yds`);
    if (stats.rec_td) parts.push(`${stats.rec_td} rec TD`);
    // Basketball
    if (stats.pts) parts.push(`${stats.pts} pts`);
    if (stats.reb) parts.push(`${stats.reb} reb`);
    if (stats.ast) parts.push(`${stats.ast} ast`);
    // Baseball
    if (stats.hits) parts.push(`${stats.hits} H`);
    if (stats.rbi) parts.push(`${stats.rbi} RBI`);
    if (stats.hr) parts.push(`${stats.hr} HR`);
    if (stats.ip) parts.push(`${stats.ip} IP`);
    if (stats.k_pitched) parts.push(`${stats.k_pitched} K`);
    return parts.join(" \u00B7 ") || "Active";
  };

  return (
    <div style={{
      background: "#111827",
      borderTop: "2px solid rgba(240, 165, 0, 0.3)",
      padding: "16px",
    }}>
      {/* Game header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
      }}>
        <div>
          <span style={{
            color: "#f0a500",
            fontWeight: 700,
            fontSize: "15px",
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          }}>
            {game.awayTeamName} {game.awayScore} - {game.homeTeamName} {game.homeScore}
          </span>
          <span style={{
            color: "#9ca3af",
            fontSize: "12px",
            marginLeft: "8px",
            textTransform: "uppercase",
          }}>
            {game.status === "final" ? "Final" : game.status}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#9ca3af",
            cursor: "pointer",
            fontSize: "18px",
            padding: "4px 8px",
          }}
          aria-label="Close game detail"
        >
          {"\u2715"}
        </button>
      </div>

      {/* Philly players in this game */}
      {loading ? (
        <div style={{ color: "#9ca3af", fontSize: "13px" }}>Loading Philly stats...</div>
      ) : players.length === 0 ? (
        <div style={{ color: "#9ca3af", fontSize: "13px" }}>
          Philly guys were active in this game
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {players.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                background: "#1e293b",
                borderRadius: "8px",
                borderLeft: "3px solid rgba(240, 165, 0, 0.5)",
              }}
            >
              <div>
                <div style={{
                  color: "#f5f0e8",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                }}>
                  {p.playerName}
                </div>
                {p.highSchool && (
                  <div style={{
                    color: "#9ca3af",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    {p.highSchool}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  color: "#f5f0e8",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "var(--font-dm-sans, 'DM Sans', monospace)",
                }}>
                  {formatStats(p.stats)}
                </span>
                {/* Social links */}
                <div style={{ display: "flex", gap: "6px" }}>
                  {p.socialTwitter && (
                    <a
                      href={`https://twitter.com/${p.socialTwitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#9ca3af", fontSize: "14px" }}
                      title="Twitter"
                    >
                      {"\uD83D\uDC26"}
                    </a>
                  )}
                  {p.socialInstagram && (
                    <a
                      href={`https://instagram.com/${p.socialInstagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#9ca3af", fontSize: "14px" }}
                      title="Instagram"
                    >
                      {"\uD83D\uDCF8"}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
