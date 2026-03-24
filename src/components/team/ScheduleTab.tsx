import Link from "next/link";
import { Game } from "@/lib/data";

interface ScheduleTabProps {
  games: Game[];
  sport: string;
  schoolSlug: string;
}

export function ScheduleTab({ games, sport, schoolSlug }: ScheduleTabProps) {
  if (!games || games.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No games scheduled yet</p>
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="space-y-3">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-gray-200" aria-label="Team schedule">
          <caption className="sr-only">Team schedule</caption>
          <thead className="bg-[var(--psp-navy)] text-white">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Date</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">Opponent</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold">Result</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Score</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {games.map((game, idx) => {
              const gameDate = game.game_date ? new Date(game.game_date) : null;
              const isUpcoming = gameDate ? gameDate > now : false;
              const isHomeGame =
                game.home_school_id === parseInt(schoolSlug.split("-").pop() || "0");

              return (
                <tr
                  key={game.id}
                  className={`
                    ${isUpcoming ? "bg-blue-50" : ""}
                    ${isUpcoming ? "border-l-4 border-l-[var(--psp-gold)]" : ""}
                    hover:bg-gray-50
                  `}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {gameDate?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900 font-medium">
                      {isHomeGame ? `vs ${game.away_school?.name}` : `@ ${game.home_school?.name}`}
                    </div>
                    <div className="text-xs text-gray-400">
                      {isHomeGame ? "Home" : "Away"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {game.home_score !== null && game.home_score !== undefined && game.away_score !== null && game.away_score !== undefined ? (
                      <div className="text-sm font-semibold">
                        <span
                          className={
                            isHomeGame
                              ? game.home_score! > game.away_score!
                                ? "text-green-700"
                                : "text-red-600"
                              : game.away_score! > game.home_score!
                                ? "text-green-700"
                                : "text-red-600"
                          }
                        >
                          {isHomeGame
                            ? game.home_score! > game.away_score!
                              ? "W"
                              : "L"
                            : game.away_score! > game.home_score!
                              ? "W"
                              : "L"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">Upcoming</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {game.home_score !== null && game.home_score !== undefined && game.away_score !== null && game.away_score !== undefined ? (
                      <span className="font-bold text-gray-900">
                        {isHomeGame ? game.home_score : game.away_score}-
                        {isHomeGame ? game.away_score : game.home_score}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {game.id && (
                      <Link
                        href={`/${sport}/games/${game.id}`}
                        className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        Box Score
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {games.map((game) => {
          const gameDate = game.game_date ? new Date(game.game_date) : null;
          const isUpcoming = gameDate ? gameDate > now : false;
          const isHomeGame =
            game.home_school_id === parseInt(schoolSlug.split("-").pop() || "0");

          return (
            <div
              key={game.id}
              className={`
                rounded-lg border p-4
                ${isUpcoming ? "border-[var(--psp-gold)] bg-blue-50" : "border-gray-200"}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-gray-900">
                  {gameDate?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                  })}
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {isHomeGame ? "Home" : "Away"}
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-3">
                {isHomeGame ? `vs ${game.away_school?.name}` : `@ ${game.home_school?.name}`}
              </div>
              {game.home_score !== null && game.home_score !== undefined && game.away_score !== null && game.away_score !== undefined ? (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">
                    {isHomeGame ? game.home_score : game.away_score}-
                    {isHomeGame ? game.away_score : game.home_score}
                  </span>
                  {game.id && (
                    <Link
                      href={`/${sport}/games/${game.id}`}
                      className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700"
                    >
                      Box Score
                    </Link>
                  )}
                </div>
              ) : (
                <span className="text-xs text-gray-300">Upcoming</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
