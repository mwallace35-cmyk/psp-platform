import { TeamSeason } from "@/lib/data";

interface StatisticsTabProps {
  teamSeason: TeamSeason;
  sport: string;
  schoolName: string;
}

function WinLossBar({ wins = 0, losses = 0, ties = 0 }: { wins: number; losses: number; ties: number }) {
  const total = wins + losses + ties;
  if (total === 0) return <div className="text-gray-500 text-sm">No data available</div>;

  const winPct = Math.round((wins / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex h-6 gap-1 rounded-full overflow-hidden bg-gray-200">
        <div
          className="bg-green-600"
          style={{ width: `${(wins / total) * 100}%` }}
        />
        <div
          className="bg-red-600"
          style={{ width: `${(losses / total) * 100}%` }}
        />
        {ties > 0 && (
          <div
            className="bg-gray-400"
            style={{ width: `${(ties / total) * 100}%` }}
          />
        )}
      </div>
      <div className="text-xs text-gray-600">
        {winPct}% Win Rate ({wins}W-{losses}L{ties > 0 ? `-${ties}T` : ""})
      </div>
    </div>
  );
}

export function StatisticsTab({
  teamSeason,
  sport,
  schoolName,
}: StatisticsTabProps) {
  const wins = teamSeason.wins || 0;
  const losses = teamSeason.losses || 0;
  const ties = teamSeason.ties || 0;
  const pointsFor = teamSeason.points_for || 0;
  const pointsAgainst = teamSeason.points_against || 0;
  const pointDiff = pointsFor - pointsAgainst;

  // Sport-specific stat labels
  const statLabels: Record<string, { name: string; abbr: string }> = {
    football: {
      name: "Points For/Against",
      abbr: "PF/PA",
    },
    basketball: {
      name: "Points For/Against",
      abbr: "PF/PA",
    },
    baseball: {
      name: "Runs For/Against",
      abbr: "RF/RA",
    },
    soccer: {
      name: "Goals For/Against",
      abbr: "GF/GA",
    },
    lacrosse: {
      name: "Goals For/Against",
      abbr: "GF/GA",
    },
  };

  const statLabel = statLabels[sport] || statLabels.football;

  return (
    <div className="space-y-6">
      {/* Season Record */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-[var(--psp-navy)] mb-4">
          Record & Performance
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-4xl font-bold text-[var(--psp-navy)]">
              {wins}
            </div>
            <div className="text-sm text-gray-600 mt-1">Wins</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-4xl font-bold text-red-600">{losses}</div>
            <div className="text-sm text-gray-600 mt-1">Losses</div>
          </div>
          {ties > 0 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-gray-600">{ties}</div>
              <div className="text-sm text-gray-600 mt-1">Ties</div>
            </div>
          )}
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-4xl font-bold text-blue-600">
              {Math.round((wins / (wins + losses + ties)) * 100)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Win Pct</div>
          </div>
        </div>

        {/* Win/Loss Visual */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Record Distribution
          </label>
          <WinLossBar wins={wins} losses={losses} ties={ties} />
        </div>
      </div>

      {/* Scoring Stats */}
      {(pointsFor > 0 || pointsAgainst > 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[var(--psp-navy)] mb-4">
            {statLabel.name}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-700">
                {pointsFor}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {sport === "baseball" ? "Runs For" : sport === "soccer" || sport === "lacrosse" ? "Goals For" : "Points For"}
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-700">
                {pointsAgainst}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {sport === "baseball" ? "Runs Against" : sport === "soccer" || sport === "lacrosse" ? "Goals Against" : "Points Against"}
              </div>
            </div>
            <div
              className={`p-4 rounded-lg ${
                pointDiff > 0 ? "bg-blue-50" : "bg-orange-50"
              }`}
            >
              <div
                className={`text-3xl font-bold ${
                  pointDiff > 0 ? "text-blue-700" : "text-orange-700"
                }`}
              >
                {pointDiff > 0 ? "+" : ""}{pointDiff}
              </div>
              <div className="text-xs text-gray-600 mt-1">Differential</div>
            </div>
          </div>

          {/* Average Points */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Avg Per Game</div>
                <div className="text-2xl font-bold text-gray-900">
                  {wins > 0 ? (pointsFor / (wins + losses + ties)).toFixed(1) : "0.0"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Allowed Per Game</div>
                <div className="text-2xl font-bold text-gray-900">
                  {wins > 0 ? (pointsAgainst / (wins + losses + ties)).toFixed(1) : "0.0"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Playoff Result */}
      {teamSeason.playoff_result && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[var(--psp-navy)] mb-4">
            Postseason
          </h3>
          <div className="text-center p-4 bg-[var(--psp-gold)]20 rounded-lg">
            <div className="text-lg font-bold text-[var(--psp-navy)]">
              {teamSeason.playoff_result}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {wins === 0 && losses === 0 && pointsFor === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">
            Statistical data not yet available for this season
          </p>
        </div>
      )}
    </div>
  );
}
