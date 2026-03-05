import Link from "next/link";
import { getRecentGamesAll, SPORT_META } from "@/lib/data";

const SPORT_ABBREV: Record<string, string> = {
  football: "FB",
  basketball: "BB",
  baseball: "BSB",
  lacrosse: "LAX",
  soccer: "SOC",
  "track-field": "TF",
  wrestling: "WR",
};

export default async function ScoreStrip() {
  const games = await getRecentGamesAll(12);

  // Fallback if no games in DB yet
  if (!games || games.length === 0) {
    return (
      <div className="scorestrip">
        <div className="ss-label">Scores</div>
        <div className="ss-scroll">
          <Link href="/scores" className="ss-promo" style={{ textDecoration: "none" }}>
            <span className="ss-promo-icon">📊</span>
            <span className="ss-promo-text"><strong>Scores:</strong> Browse all games</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="scorestrip">
      <div className="ss-label">Scores</div>
      <div className="ss-scroll">
        {games.map((game: any) => {
          const home = game.home_school;
          const away = game.away_school;
          const homeWin = (game.home_score ?? 0) >= (game.away_score ?? 0);
          const sportAbbrev = SPORT_ABBREV[game.sport_id] || game.sport_id?.toUpperCase();
          const gameType = game.game_type && game.game_type !== "regular"
            ? ` · ${game.game_type.charAt(0).toUpperCase() + game.game_type.slice(1)}`
            : "";

          return (
            <Link
              key={game.id}
              href={`/${game.sport_id}/games/${game.id}`}
              className="ss-game"
              style={{ textDecoration: "none" }}
            >
              <div className={`ss-team ${homeWin ? "winner" : ""}`}>
                <span className="name">{home?.short_name || home?.name || "Home"}</span>
                <span className="score">{game.home_score}</span>
              </div>
              <div className={`ss-team ${!homeWin ? "winner" : ""}`}>
                <span className="name">{away?.short_name || away?.name || "Away"}</span>
                <span className="score">{game.away_score}</span>
              </div>
              <div className="ss-status">Final · {sportAbbrev}{gameType}</div>
            </Link>
          );
        })}

        {/* Promos at end of ticker */}
        <Link href="/scores" className="ss-promo" style={{ textDecoration: "none" }}>
          <span className="ss-promo-icon">📊</span>
          <span className="ss-promo-text"><strong>All Scores</strong></span>
        </Link>
        <Link href="/potw" className="ss-promo" style={{ textDecoration: "none" }}>
          <span className="ss-promo-icon">🗳️</span>
          <span className="ss-promo-text"><strong>POTW:</strong> Vote Now</span>
        </Link>
      </div>
    </div>
  );
}
