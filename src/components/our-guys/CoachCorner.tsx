import { createClient } from "@/lib/data/common";

interface CoachRecap {
  coachName: string;
  team: string;
  role: string | null;
  statFocus: string;
  positionGroup: string | null;
  teamStats: Record<string, number> | null;
  standoutPlayer: { name: string; stats: string } | null;
  gameResult: string;
  highSchool: string | null;
}

export async function CoachCorner() {
  const supabase = await createClient();

  // Get coaches with stat focus who had games recently
  // Join nlt_game_performances (where nlt_id matches coaching entries) with coach_stat_focus
  const { data: coachPerfs } = await (supabase as any)
    .from("nlt_game_performances")
    .select(`
      id, nlt_id, player_name, team_name, sport, stats, team_stats,
      high_school, game_id
    `)
    .not("team_stats", "is", null)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!coachPerfs || coachPerfs.length === 0) {
    return (
      <section style={{ padding: "24px 16px" }}>
        <h3 style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: "clamp(18px, 4vw, 24px)",
          color: "#f5f0e8",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          COACH CORNER
        </h3>
        <p style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: "14px",
          color: "var(--bar-text-muted, #9ca3af)",
        }}>
          No recent coaching stats. Coach recaps appear here during the season.
        </p>
      </section>
    );
  }

  // Get coach stat focus for these NLT IDs
  const nltIds = coachPerfs.map((p: any) => p.nlt_id);
  const { data: focuses } = await (supabase as any)
    .from("coach_stat_focus")
    .select("nlt_id, stat_focus, position_group, notes")
    .in("nlt_id", nltIds);

  const focusMap: Record<number, { statFocus: string; positionGroup: string | null }> = {};
  if (focuses) {
    for (const f of focuses) {
      focusMap[f.nlt_id] = { statFocus: f.stat_focus, positionGroup: f.position_group };
    }
  }

  // Get coaching roles from NLT
  const { data: nltCoaches } = await (supabase as any)
    .from("next_level_tracking")
    .select("id, current_role")
    .in("id", nltIds);

  const roleMap: Record<number, string | null> = {};
  if (nltCoaches) {
    for (const c of nltCoaches) {
      roleMap[c.id] = c.current_role;
    }
  }

  // Get game results
  const gameIds = [...new Set(coachPerfs.map((p: any) => p.game_id))];
  let gameMap: Record<number, { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }> = {};
  if (gameIds.length > 0) {
    const { data: games } = await (supabase as any)
      .from("game_scores_cache")
      .select("id, home_team_name, away_team_name, home_score, away_score")
      .in("id", gameIds);
    if (games) {
      for (const g of games) {
        gameMap[g.id] = {
          homeTeam: g.home_team_name,
          awayTeam: g.away_team_name,
          homeScore: g.home_score,
          awayScore: g.away_score,
        };
      }
    }
  }

  const getGameResult = (perf: any): string => {
    const game = gameMap[perf.game_id];
    if (!game) return "";
    const isHome = perf.team_name === game.homeTeam;
    const teamScore = isHome ? game.homeScore : game.awayScore;
    const oppScore = isHome ? game.awayScore : game.homeScore;
    const opp = isHome ? game.awayTeam : game.homeTeam;
    const won = teamScore > oppScore;
    return `${perf.team_name} ${teamScore}, ${opp} ${oppScore} (${won ? "W" : "L"})`;
  };

  // Format team stats into a readable line
  const formatTeamStats = (stats: Record<string, number> | null, focus: string): string => {
    if (!stats) return "";
    const parts: string[] = [];
    if (focus === "rushing") {
      if (stats.rush_yds) parts.push(`${stats.rush_yds} rush yds`);
      if (stats.ypc) parts.push(`${stats.ypc} ypc`);
      if (stats.rush_td) parts.push(`${stats.rush_td} TD`);
    } else if (focus === "passing") {
      if (stats.pass_yds) parts.push(`${stats.pass_yds} pass yds`);
      if (stats.pass_td) parts.push(`${stats.pass_td} TD`);
      if (stats.comp_pct) parts.push(`${stats.comp_pct}% comp`);
    } else if (focus === "defense") {
      if (stats.pts_allowed !== undefined) parts.push(`${stats.pts_allowed} pts allowed`);
      if (stats.sacks) parts.push(`${stats.sacks} sacks`);
      if (stats.ints) parts.push(`${stats.ints} INT`);
    } else {
      // Generic: show whatever's in the stats
      for (const [key, val] of Object.entries(stats)) {
        if (typeof val === "number" && val > 0) {
          parts.push(`${val} ${key.replace(/_/g, " ")}`);
        }
        if (parts.length >= 3) break;
      }
    }
    return parts.join(", ");
  };

  // Extract standout player from team_stats if present
  const getStandout = (teamStats: Record<string, any> | null): { name: string; stats: string } | null => {
    if (!teamStats?.standout_player) return null;
    const sp = teamStats.standout_player;
    return { name: sp.name || "Unknown", stats: sp.stats || "" };
  };

  const coaches: CoachRecap[] = coachPerfs.map((p: any) => ({
    coachName: p.player_name,
    team: p.team_name,
    role: roleMap[p.nlt_id] || null,
    statFocus: focusMap[p.nlt_id]?.statFocus || "general",
    positionGroup: focusMap[p.nlt_id]?.positionGroup || null,
    teamStats: p.team_stats,
    standoutPlayer: getStandout(p.team_stats),
    gameResult: getGameResult(p),
    highSchool: p.high_school,
  }));

  if (coaches.length === 0) return null;

  return (
    <section style={{ padding: "24px 16px" }}>
      <h3 style={{
        fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
        fontSize: "clamp(18px, 4vw, 24px)",
        color: "#f5f0e8",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span>🏈</span> COACH CORNER
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {coaches.map((coach, i) => (
          <div
            key={i}
            style={{
              background: "#111827",
              borderRadius: "12px",
              padding: "16px",
              borderLeft: "3px solid rgba(240, 165, 0, 0.3)",
            }}
          >
            {/* Coach header */}
            <div style={{ marginBottom: "8px" }}>
              <div style={{
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontWeight: 700,
                fontSize: "15px",
                color: "#f5f0e8",
              }}>
                {coach.coachName}
              </div>
              <div style={{
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontSize: "12px",
                color: "#9ca3af",
              }}>
                {coach.role && <span>{coach.role} · </span>}
                {coach.team}
                {coach.highSchool && (
                  <span style={{ color: "#f0a500" }}> · {coach.highSchool}</span>
                )}
              </div>
            </div>

            {/* Team/position stats */}
            {coach.teamStats && (
              <div style={{
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontSize: "14px",
                fontWeight: 500,
                color: "#d1d5db",
                marginBottom: "6px",
              }}>
                {coach.positionGroup ? `${coach.positionGroup}s` : coach.statFocus}: {formatTeamStats(coach.teamStats, coach.statFocus)}
              </div>
            )}

            {/* Standout player */}
            {coach.standoutPlayer && (
              <div style={{
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontSize: "13px",
                color: "#f0a500",
                marginBottom: "6px",
              }}>
                ★ {coach.standoutPlayer.name}: {coach.standoutPlayer.stats}
              </div>
            )}

            {/* Game result */}
            <div style={{
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontSize: "12px",
              color: "#6b7280",
            }}>
              {coach.gameResult}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
