"use client";

import type { SpotlightData } from "./RecapBoard";

// Format stat line based on sport
function formatStatLine(stats: Record<string, number>, sport: string): string {
  const parts: string[] = [];
  if (sport === "football") {
    if (stats.rush_yds || stats.rushingYards) parts.push(`${stats.rush_yds || stats.rushingYards} rush yds`);
    if (stats.rush_td || stats.rushingTouchdowns) parts.push(`${stats.rush_td || stats.rushingTouchdowns} rush TD`);
    if (stats.pass_yds || stats.passingYards) parts.push(`${stats.pass_yds || stats.passingYards} pass yds`);
    if (stats.pass_td || stats.passingTouchdowns) parts.push(`${stats.pass_td || stats.passingTouchdowns} pass TD`);
    if (stats.rec_yds || stats.receivingYards) parts.push(`${stats.rec_yds || stats.receivingYards} rec yds`);
    if (stats.rec_td) parts.push(`${stats.rec_td} rec TD`);
    if (stats.carries) parts.push(`${stats.carries} car`);
    if (stats.receptions) parts.push(`${stats.receptions} rec`);
  } else if (sport === "basketball" || sport === "girls-basketball") {
    if (stats.pts || stats.points) parts.push(`${stats.pts || stats.points} pts`);
    if (stats.reb || stats.rebounds) parts.push(`${stats.reb || stats.rebounds} reb`);
    if (stats.ast || stats.assists) parts.push(`${stats.ast || stats.assists} ast`);
    if (stats.stl || stats.steals) parts.push(`${stats.stl || stats.steals} stl`);
    if (stats.blk || stats.blocks) parts.push(`${stats.blk || stats.blocks} blk`);
  } else if (sport === "baseball") {
    if (stats.hits !== undefined) parts.push(`${stats.hits} H`);
    if (stats.rbi) parts.push(`${stats.rbi} RBI`);
    if (stats.hr) parts.push(`${stats.hr} HR`);
    if (stats.sb) parts.push(`${stats.sb} SB`);
    if (stats.ip) parts.push(`${stats.ip} IP`);
    if (stats.k_pitched || stats.strikeouts) parts.push(`${stats.k_pitched || stats.strikeouts} K`);
  }
  return parts.join(" · ") || "Active";
}

interface SpotlightCardProps {
  player: SpotlightData;
}

export function SpotlightCard({ player }: SpotlightCardProps) {
  return (
    <div
      className="psp-fade-in-up"
      style={{
        background: "#111827",
        borderRadius: "12px",
        borderLeft: "3px solid rgba(240, 165, 0, 0.5)",
        padding: "20px",
        boxShadow: "0 0 20px rgba(240, 165, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gold ambient glow */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(ellipse at top left, rgba(240, 165, 0, 0.04) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* Player header */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h4 style={{
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontSize: "18px",
              fontWeight: 700,
              color: "#f5f0e8",
              marginBottom: "2px",
            }}>
              {player.playerName}
            </h4>
            <div style={{
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#9ca3af",
            }}>
              {player.highSchool && <span style={{ color: "#f0a500" }}>{player.highSchool}</span>}
              {player.highSchool && " · "}
              {player.teamName}
            </div>
          </div>
          <div style={{
            fontSize: "12px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "9999px",
            background: player.gameResult.startsWith("W") ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
            color: player.gameResult.startsWith("W") ? "#22c55e" : "#ef4444",
          }}>
            {player.gameResult}
          </div>
        </div>
      </div>

      {/* AI Narrative */}
      {player.narrative && (
        <p style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: "15px",
          lineHeight: 1.6,
          color: "#d1d5db",
          marginBottom: "16px",
          fontStyle: "italic",
          position: "relative",
        }}>
          {player.narrative}
        </p>
      )}

      {/* Stat line */}
      <div style={{
        fontFamily: "var(--font-dm-mono, 'DM Sans', monospace)",
        fontSize: "14px",
        fontWeight: 600,
        color: "#f5f0e8",
        letterSpacing: "0.02em",
        marginBottom: "12px",
      }}>
        {formatStatLine(player.stats, player.sport)}
      </div>

      {/* vs opponent */}
      <div style={{
        fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
        fontSize: "12px",
        color: "#6b7280",
        marginBottom: "12px",
      }}>
        vs {player.opponent}
      </div>

      {/* Social links */}
      <div style={{ display: "flex", gap: "8px" }}>
        {player.socialTwitter && (
          <a
            href={`https://twitter.com/${player.socialTwitter.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              textDecoration: "none",
            }}
            title="Twitter"
          >
            @{player.socialTwitter.replace("@", "")}
          </a>
        )}
        {player.socialInstagram && (
          <a
            href={`https://instagram.com/${player.socialInstagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              textDecoration: "none",
            }}
            title="Instagram"
          >
            IG
          </a>
        )}
      </div>
    </div>
  );
}
