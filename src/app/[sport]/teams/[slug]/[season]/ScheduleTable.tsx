import Link from "next/link";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";
import type { Game } from "@/lib/data";

type School = {
  id: number;
  slug: string;
};

interface ScheduleTableProps {
  games: Game[];
  school: School;
  sport: string;
  season: string;
  isPreview: boolean;
  gamesWithBoxScores: Set<number>;
}

export default function ScheduleTable({ games, school, sport, season, isPreview, gamesWithBoxScores }: ScheduleTableProps) {
  // Helper to format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="schedule" className="mb-8 scroll-mt-16">
      <h2 className="psp-h2 text-white mb-6">
        {isPreview ? "Schedule" : "Schedule & Results"}
      </h2>
      {games.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-200" aria-label="Team schedule and results">
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Opponent</th>
                {!isPreview && (
                  <th className="text-center py-3 px-4 text-gray-300 font-semibold">Result</th>
                )}
                <th className="text-center py-3 px-4 text-gray-300 font-semibold">Score</th>
                <th className="text-center py-3 px-4 text-gray-300 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {games
                .filter((g: any) => {
                  // Filter out games with no opponent
                  const isHome = g.home_school_id === school.id;
                  const opp = isHome ? g.away_school : g.home_school;
                  if (opp == null) return false;
                  // Filter out past games with no scores (TBD placeholders)
                  const hasScores = g.home_score != null && g.away_score != null;
                  if (!hasScores && g.game_date && new Date(g.game_date) < new Date()) return false;
                  return true;
                })
                .filter((g: any, i: number, arr: any[]) => {
                  // Deduplicate: for same opponent+date, prefer the game with scores
                  const isHome = g.home_school_id === school.id;
                  const oppId = isHome ? g.away_school_id : g.home_school_id;
                  const hasScores = g.home_score != null && g.away_score != null;
                  const dupIdx = arr.findIndex((g2: any) => {
                    const isHome2 = g2.home_school_id === school.id;
                    const oppId2 = isHome2 ? g2.away_school_id : g2.home_school_id;
                    return oppId === oppId2 && g.game_date === g2.game_date;
                  });
                  if (dupIdx === i) return true;
                  // If this isn't the first occurrence, keep it only if it has scores and the first one doesn't
                  const firstDup = arr[dupIdx];
                  const firstHasScores = firstDup.home_score != null && firstDup.away_score != null;
                  return hasScores && !firstHasScores;
                })
                .map((gameRaw: any, idx: number) => {
                const game = gameRaw as Game & Record<string, any>;
                const isHome = game.home_school_id === school.id;
                const opponent = isHome ? game.away_school : game.home_school;
                const schoolScore = isHome ? game.home_score : game.away_score;
                const opponentScore = isHome ? game.away_score : game.home_score;
                const result = schoolScore !== null && opponentScore !== null
                  ? ((schoolScore as number) > (opponentScore as number) ? "W" : (schoolScore as number) < (opponentScore as number) ? "L" : "T")
                  : null;

                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: result === "W" ? `3px solid #10b981` : result === "L" ? `3px solid #ef4444` : "none",
                    }}
                  >
                    <td className="py-3 px-4 text-gray-300">{formatDate(game.game_date)}</td>
                    <td className="py-3 px-4">
                      {opponent ? (
                        <Link href={`/${sport}/teams/${opponent.slug}/${season}`} className="text-blue-400 hover:underline">
                          {isHome ? "vs " : "at "}{getSchoolDisplayName(opponent)}
                        </Link>
                      ) : (
                        <span className="text-gray-300">{isHome ? "vs" : "at"} TBD</span>
                      )}
                    </td>
                    {!isPreview && (
                      <td className="py-3 px-4 text-center">
                        {result ? (
                          <span
                            className="font-bold"
                            style={{ color: result === "W" ? "#10b981" : result === "L" ? "#ef4444" : "#f0a500" }}
                          >
                            {result}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    )}
                    <td className="py-3 px-4 text-center text-gray-300">
                      {schoolScore !== null && opponentScore !== null ? `${schoolScore}-${opponentScore}` : "—"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {(schoolScore !== null && opponentScore !== null) ? (
                        <Link
                          href={`/${sport}/games/${game.id}`}
                          className="text-xs font-medium px-2 py-1 rounded"
                          style={{
                            background: gamesWithBoxScores.has(game.id) ? "var(--psp-blue, #3b82f6)" : "rgba(59,130,246,0.3)",
                            color: "white"
                          }}
                        >
                          {gamesWithBoxScores.has(game.id) ? "Box Score" : "Game"}
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-gray-300 text-center">No {isPreview ? "schedule" : "game results"} available for this season</p>
        </div>
      )}
    </section>
  );
}
