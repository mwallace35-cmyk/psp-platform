// No "use client" -- server component

interface BoxScorePlayer {
  id: number;
  playerName: string;
  teamName: string;
  sport: string;
  stats: Record<string, number>;
  highSchool: string | null;
  gameResult: string;
}

interface BoxScoreLineProps {
  player: BoxScorePlayer;
  isLast: boolean;
}

function formatCompactStats(stats: Record<string, number>, sport: string): string {
  const parts: string[] = [];
  if (sport === "football") {
    if (stats.rush_yds || stats.rushingYards) parts.push(`${stats.rush_yds || stats.rushingYards} rush`);
    if (stats.pass_yds || stats.passingYards) parts.push(`${stats.pass_yds || stats.passingYards} pass`);
    if (stats.rec_yds || stats.receivingYards) parts.push(`${stats.rec_yds || stats.receivingYards} rec`);
    const tds = (stats.rush_td || 0) + (stats.pass_td || 0) + (stats.rec_td || 0);
    if (tds > 0) parts.push(`${tds} TD`);
  } else if (sport === "basketball" || sport === "girls-basketball") {
    if (stats.pts || stats.points) parts.push(`${stats.pts || stats.points} pts`);
    if (stats.reb || stats.rebounds) parts.push(`${stats.reb || stats.rebounds} reb`);
    if (stats.ast || stats.assists) parts.push(`${stats.ast || stats.assists} ast`);
  } else if (sport === "baseball") {
    if (stats.hits !== undefined) parts.push(`${stats.hits} H`);
    if (stats.rbi) parts.push(`${stats.rbi} RBI`);
    if (stats.ip) parts.push(`${stats.ip} IP`);
  }
  return parts.join(", ") || "Active";
}

export function BoxScoreLine({ player, isLast }: BoxScoreLineProps) {
  const isWin = player.gameResult.startsWith("W");

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 16px",
      borderBottom: isLast ? "none" : "1px solid rgba(255, 255, 255, 0.05)",
      fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
    }}>
      {/* Left: school badge + name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {player.highSchool && (
            <span style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              color: "#f0a500",
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}>
              {player.highSchool}
            </span>
          )}
          <span style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#f5f0e8",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {player.playerName}
          </span>
        </div>
      </div>

      {/* Middle: stat line */}
      <div style={{
        fontSize: "13px",
        fontWeight: 500,
        color: "#d1d5db",
        textAlign: "right",
        paddingLeft: "12px",
        flexShrink: 0,
      }}>
        {formatCompactStats(player.stats, player.sport)}
      </div>

      {/* Right: team + W/L pill */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        paddingLeft: "12px",
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: "12px",
          color: "#6b7280",
        }}>
          {player.teamName}
        </span>
        <span style={{
          fontSize: "11px",
          fontWeight: 700,
          padding: "2px 6px",
          borderRadius: "4px",
          background: isWin ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
          color: isWin ? "#22c55e" : "#ef4444",
        }}>
          {isWin ? "W" : "L"}
        </span>
      </div>
    </div>
  );
}
