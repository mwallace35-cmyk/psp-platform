import Link from "next/link";
import { getThisDayInHistory } from "@/lib/data";

const SPORT_EMOJI: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  lacrosse: "🥍",
  soccer: "⚽",
  wrestling: "🤼",
  "track-field": "🏃",
};

export default async function ThisDayInHistory() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const monthName = now.toLocaleDateString("en-US", { month: "long" });

  const { games, championships } = await getThisDayInHistory(month, day, 10);

  const hasContent = games.length > 0 || championships.length > 0;

  if (!hasContent) return null;

  return (
    <div className="sidebar-widget">
      <h3 className="sw-head">
        📅 This Day in History — {monthName} {day}
      </h3>
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {games.map((game: any) => {
          const home = game.home_school;
          const away = game.away_school;
          const homeName = home?.short_name || home?.name || "Home";
          const awayName = away?.short_name || away?.name || "Away";
          const homeWin = (game.home_score ?? 0) > (game.away_score ?? 0);
          const year = game.game_date?.split("-")[0];
          const emoji = SPORT_EMOJI[game.sport_id] || "🏅";
          const isPlayoff = game.game_type && game.game_type !== "regular";

          return (
            <Link
              key={game.id}
              href={`/${game.sport_id}/games/${game.id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  transition: "border-color 0.15s",
                  cursor: "pointer",
                }}
                className="hover-card"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--g400)", fontWeight: 600 }}>
                    {emoji} {year}
                    {isPlayoff && (
                      <span style={{ color: "var(--psp-gold)", marginLeft: 6 }}>
                        {game.game_type.charAt(0).toUpperCase() + game.game_type.slice(1)}
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--g400)" }}>Final</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: homeWin ? 700 : 400, color: homeWin ? "var(--text)" : "var(--g400)" }}>
                    {homeName}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", color: homeWin ? "var(--text)" : "var(--g400)" }}>
                    {game.home_score}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: !homeWin ? 700 : 400, color: !homeWin ? "var(--text)" : "var(--g400)" }}>
                    {awayName}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", color: !homeWin ? "var(--text)" : "var(--g400)" }}>
                    {game.away_score}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {championships.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--g400)", marginBottom: 6, paddingTop: 4, borderTop: "1px solid var(--border)" }}>
              Championships
            </div>
            {championships.map((champ: any) => {
              const school = (champ as any).schools;
              const emoji = SPORT_EMOJI[champ.sport_id] || "🏆";
              return (
                <div key={champ.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                  <span style={{ fontSize: 14 }}>🏆</span>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                      {school?.name || "Unknown"} — {champ.year}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--g400)", marginLeft: 6 }}>
                      {emoji} {champ.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
