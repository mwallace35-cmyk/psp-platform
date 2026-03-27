// v2: Real stats from game_player_stats

interface StatLeader {
  playerName: string;
  statValue: number;
  statLabel: string;
  gamesPlayed: number;
}

interface StatLeadersData {
  totalRushYards: number;
  totalPassYards: number;
  totalRecYards: number;
  totalPoints: number;
  gamesWithStats: number;
  rushLeader: StatLeader | null;
  passLeader: StatLeader | null;
  recLeader: StatLeader | null;
  scoringLeader: StatLeader | null;
}

interface TeamStatsProps {
  team: {
    currentRecord: { wins: number; losses: number; ties: number };
    pointsFor: number;
    pointsAgainst: number;
  };
  statLeaders?: StatLeadersData | null;
}

export default function TeamStats({ team, statLeaders }: TeamStatsProps) {
  const pointDiff = team.pointsFor - team.pointsAgainst;
  const hasStatData = statLeaders && statLeaders.gamesWithStats > 0;

  // Build team summary stats
  const summaryStats = [
    { label: "Record", value: `${team.currentRecord.wins}-${team.currentRecord.losses}${team.currentRecord.ties > 0 ? `-${team.currentRecord.ties}` : ""}` },
    { label: "Points For", value: team.pointsFor.toLocaleString() },
    { label: "Points Against", value: team.pointsAgainst.toLocaleString() },
    {
      label: "Point Differential",
      value: `${pointDiff > 0 ? "+" : ""}${pointDiff}`,
      color: pointDiff > 0 ? "#16a34a" : pointDiff < 0 ? "#ef4444" : undefined,
    },
  ];

  // Add game_player_stats totals if available
  const yardageStats = hasStatData
    ? [
        { label: "Total Rushing Yards", value: statLeaders.totalRushYards.toLocaleString() },
        { label: "Total Passing Yards", value: statLeaders.totalPassYards.toLocaleString() },
        { label: "Total Receiving Yards", value: statLeaders.totalRecYards.toLocaleString() },
        { label: "Total Points Scored", value: statLeaders.totalPoints.toLocaleString() },
        { label: "Games with Box Scores", value: statLeaders.gamesWithStats.toString() },
      ]
    : [];

  // Collect individual leaders
  const leaders: { category: string; name: string; stat: string; games: number }[] = [];
  if (hasStatData) {
    if (statLeaders.rushLeader) {
      leaders.push({
        category: "Rushing Leader",
        name: statLeaders.rushLeader.playerName,
        stat: `${statLeaders.rushLeader.statValue.toLocaleString()} yards`,
        games: statLeaders.rushLeader.gamesPlayed,
      });
    }
    if (statLeaders.passLeader) {
      leaders.push({
        category: "Passing Leader",
        name: statLeaders.passLeader.playerName,
        stat: `${statLeaders.passLeader.statValue.toLocaleString()} yards`,
        games: statLeaders.passLeader.gamesPlayed,
      });
    }
    if (statLeaders.recLeader) {
      leaders.push({
        category: "Receiving Leader",
        name: statLeaders.recLeader.playerName,
        stat: `${statLeaders.recLeader.statValue.toLocaleString()} yards`,
        games: statLeaders.recLeader.gamesPlayed,
      });
    }
    if (statLeaders.scoringLeader) {
      leaders.push({
        category: "Scoring Leader",
        name: statLeaders.scoringLeader.playerName,
        stat: `${statLeaders.scoringLeader.statValue.toLocaleString()} points`,
        games: statLeaders.scoringLeader.gamesPlayed,
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Team Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="psp-h3 mb-4" style={{ color: "var(--psp-navy)" }}>
          Season Record
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Team season record">
            <caption className="sr-only">Team season record</caption>
            <tbody>
              {summaryStats.map((stat, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-2.5 font-medium" style={{ color: "var(--psp-navy)" }}>
                    {stat.label}
                  </td>
                  <td
                    className="py-2.5 text-right font-bold"
                    style={{ color: stat.color || "var(--psp-navy)" }}
                  >
                    {stat.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Yardage Totals */}
      {yardageStats.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="psp-h3 mb-4" style={{ color: "var(--psp-navy)" }}>
            Team Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {yardageStats.map((stat, idx) => (
              <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold" style={{ color: "var(--psp-navy)" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Leaders */}
      {leaders.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="psp-h3 mb-4" style={{ color: "var(--psp-navy)" }}>
            Statistical Leaders
          </h2>
          <div className="space-y-3">
            {leaders.map((leader, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 rounded-lg"
                style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div>
                  <div className="font-bold text-sm" style={{ color: "var(--psp-navy)" }}>
                    {leader.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {leader.category} ({leader.games} games)
                  </div>
                </div>
                <span className="font-bold text-sm" style={{ color: "var(--psp-gold)" }}>
                  {leader.stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="psp-h3 mb-4" style={{ color: "var(--psp-navy)" }}>
            Statistical Leaders
          </h2>
          <p className="text-sm text-gray-400 text-center py-4">
            No individual game statistics available for this season yet.
          </p>
        </div>
      )}
    </div>
  );
}
