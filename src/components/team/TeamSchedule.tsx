interface Game {
  date: string;
  opponent: string;
  homeAway: "H" | "A";
  result: "W" | "L";
  score: string;
  leagueGame: boolean;
}

interface TeamScheduleProps {
  schedule: Game[];
}

export default function TeamSchedule({ schedule }: TeamScheduleProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-200" aria-label="Team schedule">
            <caption className="sr-only">Team schedule</caption>
            <thead>
              <tr className="bg-[var(--psp-navy)] text-white">
                <th scope="col" className="px-4 py-3 text-left font-bold">Date</th>
                <th scope="col" className="px-4 py-3 text-left font-bold">Opponent</th>
                <th scope="col" className="px-4 py-3 text-center font-bold">H/A</th>
                <th scope="col" className="px-4 py-3 text-center font-bold">Result</th>
                <th scope="col" className="px-4 py-3 text-right font-bold">Score</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((game, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-600">
                    {game.date}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[var(--psp-navy)]">
                      {game.opponent}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-bold">
                    {game.homeAway}
                  </td>
                  <td
                    className="px-4 py-3 text-center font-bold text-sm"
                    style={{
                      color: game.result === "W" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {game.result}
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {game.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
