import { createClient } from "@/lib/data/common";
import { TickerCrawl } from "./TickerCrawl";

export interface TickerGame {
  id: number;
  espnEventId: string;
  league: string;
  gameDate: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  hasPhillyConnection: boolean;
  phillyPlayerIds: number[];
}

export async function ScoreTicker() {
  // Fetch latest games from game_scores_cache, grouped by league
  // Get the most recent game_date per league and fetch all games for that date
  const supabase = await createClient();

  const { data: games } = await (supabase as any)
    .from("game_scores_cache")
    .select("id, espn_event_id, league, game_date, home_team_name, away_team_name, home_score, away_score, status, has_philly_connection, philly_player_ids, fetched_at")
    .order("game_date", { ascending: false })
    .limit(100);

  if (!games || games.length === 0) {
    return null; // Don't render ticker if no games
  }

  // Check if data is stale (older than 24 hours)
  const latestFetchedAt = games[0]?.fetched_at
    ? new Date(games[0].fetched_at)
    : null;
  const isStale =
    latestFetchedAt &&
    Date.now() - latestFetchedAt.getTime() > 24 * 60 * 60 * 1000;

  const tickerGames: TickerGame[] = games.map((g: any) => ({
    id: g.id,
    espnEventId: g.espn_event_id,
    league: g.league,
    gameDate: g.game_date,
    homeTeamName: g.home_team_name,
    awayTeamName: g.away_team_name,
    homeScore: g.home_score,
    awayScore: g.away_score,
    status: g.status,
    hasPhillyConnection: g.has_philly_connection,
    phillyPlayerIds: g.philly_player_ids || [],
  }));

  // Group by league for the filter pills
  const leagues = [...new Set(tickerGames.map(g => g.league))];

  return (
    <section className="ticker-section w-full" aria-label="Game Score Ticker">
      <TickerCrawl games={tickerGames} leagues={leagues} />
      {isStale && latestFetchedAt && (
        <div style={{
          textAlign: "center",
          padding: "4px 0",
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: "11px",
          color: "var(--bar-text-muted, #6b7280)",
          background: "var(--bar-surface, #111827)",
        }}>
          Last updated: {latestFetchedAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} at {latestFetchedAt.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
      )}
    </section>
  );
}
