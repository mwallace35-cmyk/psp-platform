import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SPORT_META } from "@/lib/data";

const SPORT_EMOJIS: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  soccer: "⚽",
  lacrosse: "🥍",
  "track-field": "🏃",
  wrestling: "🤼",
};

interface OtherSportStats {
  sport: string;
  slug: string;
  statLine: string;
}

async function getOtherSportStats(
  playerName: string,
  schoolId: number,
  currentSport: string
): Promise<OtherSportStats[]> {
  const supabase = await createClient();
  const results: OtherSportStats[] = [];

  // Find same player in other sports
  const { data: players } = await supabase
    .from("players")
    .select("id, slug")
    .eq("name", playerName)
    .eq("primary_school_id", schoolId)
    .is("deleted_at", null);

  if (!players || players.length === 0) return [];

  const playerIds = players.map((p) => p.id);
  const slugMap = Object.fromEntries(players.map((p) => [p.id, p.slug]));

  // Check football
  if (currentSport !== "football") {
    const { data: fb } = await supabase
      .from("football_player_seasons")
      .select("player_id, games_played, rush_yards, pass_yards, rec_yards, total_td")
      .in("player_id", playerIds)
      .order("season_id", { ascending: false })
      .limit(1);
    if (fb && fb.length > 0 && fb[0].games_played > 0) {
      const s = fb[0];
      const parts: string[] = [];
      if (s.rush_yards > 50) parts.push(`${s.rush_yards} Rush Yds`);
      if (s.pass_yards > 50) parts.push(`${s.pass_yards} Pass Yds`);
      if (s.rec_yards > 50) parts.push(`${s.rec_yards} Rec Yds`);
      if (s.total_td > 0) parts.push(`${s.total_td} TDs`);
      if (parts.length === 0) parts.push(`${s.games_played} games`);
      results.push({
        sport: "football",
        slug: slugMap[s.player_id] || "",
        statLine: parts.join(", "),
      });
    }
  }

  // Check basketball
  if (currentSport !== "basketball") {
    const { data: bb } = await supabase
      .from("basketball_player_seasons")
      .select("player_id, games_played, ppg, rpg, apg, points")
      .in("player_id", playerIds)
      .order("season_id", { ascending: false })
      .limit(1);
    if (bb && bb.length > 0 && bb[0].games_played > 0) {
      const s = bb[0];
      const parts: string[] = [];
      if (s.ppg > 0) parts.push(`${s.ppg} PPG`);
      if (s.rpg > 0) parts.push(`${s.rpg} RPG`);
      if (s.apg > 0) parts.push(`${s.apg} APG`);
      if (parts.length === 0 && s.points > 0) parts.push(`${s.points} Pts`);
      if (parts.length === 0) parts.push(`${s.games_played} games`);
      results.push({
        sport: "basketball",
        slug: slugMap[s.player_id] || "",
        statLine: parts.join(", "),
      });
    }
  }

  // Check baseball
  if (currentSport !== "baseball") {
    const { data: bsb } = await supabase
      .from("baseball_player_seasons")
      .select("player_id, games_played, batting_avg, hits, rbi, home_runs")
      .in("player_id", playerIds)
      .order("season_id", { ascending: false })
      .limit(1);
    if (bsb && bsb.length > 0 && bsb[0].games_played > 0) {
      const s = bsb[0];
      const parts: string[] = [];
      if (s.batting_avg > 0) parts.push(`.${Math.round(s.batting_avg * 1000)} AVG`);
      if (s.hits > 0) parts.push(`${s.hits} H`);
      if (s.rbi > 0) parts.push(`${s.rbi} RBI`);
      if (s.home_runs > 0) parts.push(`${s.home_runs} HR`);
      if (parts.length === 0) parts.push(`${s.games_played} games`);
      results.push({
        sport: "baseball",
        slug: slugMap[s.player_id] || "",
        statLine: parts.join(", "),
      });
    }
  }

  return results;
}

export default async function MultiSportBanner({
  playerName,
  schoolId,
  currentSport,
  schoolName,
}: {
  playerName: string;
  schoolId: number;
  currentSport: string;
  schoolName?: string;
}) {
  const otherSports = await getOtherSportStats(playerName, schoolId, currentSport);

  if (otherSports.length === 0) return null;

  const currentEmoji = SPORT_EMOJIS[currentSport] || "🏅";
  const sportCount = otherSports.length + 1; // current + others

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(240,165,0,0.12) 0%, rgba(240,165,0,0.04) 100%)",
        border: "1px solid rgba(240,165,0,0.25)",
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <span style={{ fontSize: "1.2rem" }}>
          {currentEmoji}
          {otherSports.map((os) => SPORT_EMOJIS[os.sport] || "🏅").join("")}
        </span>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            color: "var(--psp-gold)",
            fontWeight: 700,
          }}
        >
          {sportCount}-SPORT ATHLETE
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {otherSports.map((os) => (
          <div key={os.sport} style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
              {playerName} also plays{" "}
              <strong style={{ color: "white" }}>
                {SPORT_META[os.sport as keyof typeof SPORT_META]?.name || os.sport}
              </strong>
              {schoolName ? ` at ${schoolName}` : ""}
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.8rem",
                padding: "2px 8px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "4px",
              }}
            >
              {os.statLine}
            </span>
            <Link
              href={`/${os.sport}/players/${os.slug}`}
              style={{
                color: "var(--psp-gold)",
                fontSize: "0.8rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View {SPORT_META[os.sport as keyof typeof SPORT_META]?.name || os.sport} Profile →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
