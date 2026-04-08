import { createClient } from "@/lib/data/common";
import { SpotlightCard } from "./SpotlightCard";
import { BoxScoreLine } from "./BoxScoreLine";

// Types for the recap data
export interface SpotlightData {
  id: number;
  playerName: string;
  teamName: string;
  sport: string;
  stats: Record<string, number>;
  performanceScore: number;
  highSchool: string | null;
  narrative: string | null;
  socialTwitter: string | null;
  socialInstagram: string | null;
  gameResult: string;
  opponent: string;
}

export interface BoxScoreData {
  id: number;
  playerName: string;
  teamName: string;
  sport: string;
  stats: Record<string, number>;
  highSchool: string | null;
  gameResult: string; // "W" or "L"
}

export interface AlsoActiveData {
  playerName: string;
  teamName: string;
  gameResult: string;
}

export async function RecapBoard() {
  const supabase = await createClient();

  // Get the most recent game date via game_scores_cache join
  const { data: latestPerf } = await (supabase as any)
    .from("nlt_game_performances")
    .select("game_id, game_scores_cache!inner!game_id(game_date)")
    .order("game_scores_cache(game_date)", { ascending: false })
    .limit(1);

  if (!latestPerf || latestPerf.length === 0) {
    return (
      <section className="recap-board" style={{
        padding: "24px 16px",
        background: "var(--bar-surface, #111827)",
        borderRadius: "12px",
        margin: "16px",
      }}>
        <h2 style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: "clamp(20px, 5vw, 28px)",
          color: "#f0a500",
          letterSpacing: "0.05em",
          marginBottom: "12px",
        }}>
          LAST NIGHT AT THE BAR
        </h2>
        <p style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: "15px",
          color: "var(--bar-text-muted, #9ca3af)",
          lineHeight: 1.6,
        }}>
          No games recently. Check back when the season heats up!
        </p>
      </section>
    );
  }

  // Get the game date from the joined result
  const latestGameDate = latestPerf[0].game_scores_cache?.game_date;
  if (!latestGameDate) return null;

  // Check if data is older than 7 days (off-season)
  const daysSinceLastGame = Math.floor(
    (Date.now() - new Date(latestGameDate + "T12:00:00").getTime()) / (1000 * 60 * 60 * 24)
  );
  const isOffSeason = daysSinceLastGame > 7;

  // Fetch all performances for that game date via inner join
  const { data: performances } = await (supabase as any)
    .from("nlt_game_performances")
    .select(`
      id, nlt_id, game_id, player_name, team_name, sport, stats,
      recap_tier, performance_score, high_school, high_school_id,
      game_scores_cache!inner!game_id(game_date)
    `)
    .eq("game_scores_cache.game_date", latestGameDate)
    .order("performance_score", { ascending: false });

  if (!performances || performances.length === 0) return null;

  // Fetch AI recaps for spotlight players
  const spotlightPerfs = performances.filter((p: any) => p.recap_tier === 1);
  const boxScorePerfs = performances.filter((p: any) => p.recap_tier === 2);
  const alsoActivePerfs = performances.filter((p: any) => p.recap_tier === 3);

  // Get narratives from ai_recaps
  const spotlightIds = spotlightPerfs.map((p: any) => p.id);
  let narrativeMap: Record<number, string> = {};
  if (spotlightIds.length > 0) {
    const { data: recaps } = await (supabase as any)
      .from("ai_recaps")
      .select("performance_id, narrative")
      .in("performance_id", spotlightIds);
    if (recaps) {
      for (const r of recaps) {
        narrativeMap[r.performance_id] = r.narrative;
      }
    }
  }

  // Get social links for spotlight players
  const nltIds = spotlightPerfs.map((p: any) => p.nlt_id);
  let socialMap: Record<number, { twitter: string | null; instagram: string | null }> = {};
  if (nltIds.length > 0) {
    const { data: nltData } = await (supabase as any)
      .from("next_level_tracking")
      .select("id, social_twitter, social_instagram")
      .in("id", nltIds);
    if (nltData) {
      for (const n of nltData) {
        socialMap[n.id] = { twitter: n.social_twitter, instagram: n.social_instagram };
      }
    }
  }

  // Get game results for context
  const gameIds = [...new Set(performances.map((p: any) => p.game_id))];
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

  // Helper: get game result string for a player
  const getGameResult = (perf: any): string => {
    const game = gameMap[perf.game_id];
    if (!game) return "";
    const isHome = perf.team_name === game.homeTeam;
    const teamScore = isHome ? game.homeScore : game.awayScore;
    const oppScore = isHome ? game.awayScore : game.homeScore;
    const won = teamScore > oppScore;
    return `${won ? "W" : "L"} ${teamScore}-${oppScore}`;
  };

  const getOpponent = (perf: any): string => {
    const game = gameMap[perf.game_id];
    if (!game) return "";
    return perf.team_name === game.homeTeam ? game.awayTeam : game.homeTeam;
  };

  // Format date for display + relative-time freshness label (audit OG-1)
  const gameDateObj = new Date(latestGameDate + "T12:00:00");
  const baseDate = gameDateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const relativeLabel =
    daysSinceLastGame === 0
      ? "today"
      : daysSinceLastGame === 1
        ? "yesterday"
        : daysSinceLastGame < 7
          ? `${daysSinceLastGame} days ago`
          : `${Math.floor(daysSinceLastGame / 7)} week${daysSinceLastGame < 14 ? "" : "s"} ago`;
  const displayDate = `${baseDate} · ${relativeLabel}`;

  // Build spotlight data
  const spotlightData: SpotlightData[] = spotlightPerfs.map((p: any) => ({
    id: p.id,
    playerName: p.player_name,
    teamName: p.team_name,
    sport: p.sport,
    stats: p.stats || {},
    performanceScore: p.performance_score,
    highSchool: p.high_school,
    narrative: narrativeMap[p.id] || null,
    socialTwitter: socialMap[p.nlt_id]?.twitter || null,
    socialInstagram: socialMap[p.nlt_id]?.instagram || null,
    gameResult: getGameResult(p),
    opponent: getOpponent(p),
  }));

  const boxScoreData: BoxScoreData[] = boxScorePerfs.map((p: any) => ({
    id: p.id,
    playerName: p.player_name,
    teamName: p.team_name,
    sport: p.sport,
    stats: p.stats || {},
    highSchool: p.high_school,
    gameResult: getGameResult(p),
  }));

  const alsoActiveData: AlsoActiveData[] = alsoActivePerfs.map((p: any) => ({
    playerName: p.player_name,
    teamName: p.team_name,
    gameResult: getGameResult(p),
  }));

  if (isOffSeason) {
    return (
      <section className="recap-board" style={{
        padding: "24px 16px",
        background: "var(--bar-surface, #111827)",
        borderRadius: "12px",
        margin: "16px",
      }}>
        <h2 style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: "clamp(20px, 5vw, 28px)",
          color: "#f0a500",
          letterSpacing: "0.05em",
          marginBottom: "12px",
        }}>
          LAST NIGHT AT THE BAR
        </h2>
        <p style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: "15px",
          color: "var(--bar-text-muted, #9ca3af)",
          lineHeight: 1.6,
        }}>
          No games recently. Check back when the season heats up!
        </p>
      </section>
    );
  }

  return (
    <section className="recap-board" style={{ padding: "24px 16px" }}>
      {/* Section header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          fontSize: "clamp(20px, 5vw, 28px)",
          color: "#f0a500",
          letterSpacing: "0.05em",
          marginBottom: "4px",
        }}>
          LAST NIGHT AT THE BAR
        </h2>
        <p style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: "14px",
          color: "#9ca3af",
        }}>
          {displayDate}
        </p>
      </div>

      {/* Spotlight section */}
      {spotlightData.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "18px",
            color: "#f5f0e8",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span>SPOTLIGHT</span>
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {spotlightData.map((player) => (
              <SpotlightCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      )}

      {/* Box Score section */}
      {boxScoreData.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "18px",
            color: "#f5f0e8",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span>BOX SCORES</span>
          </h3>
          <div style={{
            background: "#111827",
            borderRadius: "12px",
            overflow: "hidden",
          }}>
            {boxScoreData.map((player, i) => (
              <BoxScoreLine key={player.id} player={player} isLast={i === boxScoreData.length - 1} />
            ))}
          </div>
        </div>
      )}

      {/* Also Active section -- collapsed by default, needs client component */}
      {alsoActiveData.length > 0 && (
        <AlsoActiveSection players={alsoActiveData} />
      )}
    </section>
  );
}

// Small server-rendered section for Also Active players
// Client-side expand/collapse can be layered on later
function AlsoActiveSection({ players }: { players: AlsoActiveData[] }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h3 style={{
        fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
        fontSize: "18px",
        color: "#f5f0e8",
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span>ALSO ACTIVE</span>
      </h3>
      <p style={{
        fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
        fontSize: "14px",
        color: "#9ca3af",
        marginBottom: "8px",
      }}>
        {players.length} more Philly guys were active
      </p>
      <div style={{
        background: "#111827",
        borderRadius: "12px",
        padding: "12px 16px",
      }}>
        {players.map((p, i) => (
          <div key={i} style={{
            padding: "6px 0",
            borderBottom: i < players.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            fontSize: "13px",
            color: "#9ca3af",
            display: "flex",
            justifyContent: "space-between",
          }}>
            <span>{p.playerName}</span>
            <span>
              {p.teamName} {p.gameResult}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
