"use client";

import { useState, useMemo } from "react";

interface GameData {
  year: number;
  score: string;
  mvps?: Array<{ name: string; position?: string; school?: string }>;
  notables?: string[];
  team_stats?: Record<string, Record<string, string | number>>;
  rushing?: Array<{
    team: string;
    name: string;
    school?: string | null;
    carries_yards: string;
  }>;
  passing?: Array<{
    team: string;
    name: string;
    school?: string | null;
    completions_attempts_yards: string;
  }>;
  receiving?: Array<{
    team: string;
    name: string;
    school?: string | null;
    catches_yards: string;
  }>;
}

interface RecordHolder {
  value: string | number;
  player?: string;
  players?: Array<{ name: string; school?: string; year?: number }>;
  school?: string;
  year?: number;
  division?: string;
}

interface IndividualRecords {
  rushing?: Record<string, RecordHolder>;
  passing?: Record<string, RecordHolder>;
  receiving?: Record<string, RecordHolder>;
  kicking?: Record<string, RecordHolder>;
  miscellaneous?: Record<string, RecordHolder>;
}

interface AllStarArchiveProps {
  games: GameData[];
  records?: IndividualRecords;
}

type TabType = "overview" | "year-by-year" | "records" | "td-leaders";

const DECADES = [
  { label: "1970s", start: 1975, end: 1979 },
  { label: "1980s", start: 1980, end: 1989 },
  { label: "1990s", start: 1990, end: 1999 },
  { label: "2000s", start: 2000, end: 2009 },
  { label: "2010s", start: 2010, end: 2019 },
];

function parseScore(score: string): {
  winner: string;
  winnerScore: number;
  loserScore: number;
} | null {
  const scoreUpper = score.toUpperCase();
  const parts = scoreUpper.split(",").map((p) => p.trim());

  if (parts.length !== 2) return null;

  const firstTeam = parts[0].split(" ")[0];
  const firstScore = parseInt(parts[0].split(" ").pop() || "0", 10);
  const secondScore = parseInt(parts[1].split(" ").pop() || "0", 10);

  if (firstScore > secondScore) {
    return { winner: firstTeam, winnerScore: firstScore, loserScore: secondScore };
  } else if (secondScore > firstScore) {
    return {
      winner: parts[1].split(" ")[0],
      winnerScore: secondScore,
      loserScore: firstScore,
    };
  }

  return { winner: "TIE", winnerScore: firstScore, loserScore: secondScore };
}

function GameCard({ game }: { game: GameData }) {
  const [expanded, setExpanded] = useState(false);
  const parsed = parseScore(game.score);

  if (!parsed) return null;

  const isPublicWin = parsed.winner === "PUBLIC";
  const winBadgeColor = isPublicWin
    ? "bg-blue-500/20 text-blue-300"
    : "bg-purple-500/20 text-purple-300";

  return (
    <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 hover:bg-white/10 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] w-16">
            {game.year}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">{game.score}</p>
            {game.mvps && game.mvps.length > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                MVP: {game.mvps.map((m) => m.name).join(", ")}
              </p>
            )}
          </div>
          <div className={`px-3 py-1 rounded text-sm font-semibold ${winBadgeColor}`}>
            {parsed.winner === "TIE" ? "TIE" : `${parsed.winner} WIN`}
          </div>
        </div>
        <span className="text-lg font-bold">
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-[var(--psp-gold)]/20 bg-white/5 p-4 space-y-4">
          {/* MVPs */}
          {game.mvps && game.mvps.length > 0 && (
            <div>
              <h4 className="font-semibold text-[var(--psp-gold)] mb-2">
                MVP{game.mvps.length > 1 ? "s" : ""}
              </h4>
              <div className="space-y-1">
                {game.mvps.map((mvp, idx) => (
                  <p key={idx} className="text-sm">
                    <span className="font-semibold">{mvp.name}</span>
                    {mvp.position && <span className="text-gray-400">, {mvp.position}</span>}
                    {mvp.school && <span className="text-gray-400"> ({mvp.school})</span>}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Stats Tables */}
          {game.rushing && game.rushing.length > 0 && (
            <div>
              <h4 className="font-semibold text-[var(--psp-gold)] mb-2">
                Rushing Leaders
              </h4>
              <div className="space-y-1 text-sm">
                {game.rushing.slice(0, 5).map((stat, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <span className="font-semibold">{stat.name}</span>
                      {stat.school && (
                        <span className="text-gray-400"> ({stat.school})</span>
                      )}
                    </div>
                    <span className="text-[var(--psp-gold)]">
                      {stat.carries_yards}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notables */}
          {game.notables && game.notables.length > 0 && (
            <div>
              <h4 className="font-semibold text-[var(--psp-gold)] mb-2">
                Notable Performances
              </h4>
              <ul className="text-sm space-y-1">
                {game.notables.map((note, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-2">
                    <span className="text-[var(--psp-gold)]">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RecordRow({
  label,
  record,
}: {
  label: string;
  record: RecordHolder | undefined;
}) {
  if (!record) return null;

  return (
    <tr className="border-b border-[var(--psp-gold)]/10 hover:bg-white/5">
      <td className="px-4 py-3 font-semibold text-[var(--psp-gold)]">{label}</td>
      <td className="px-4 py-3">
        <span className="font-bold text-lg">{record.value}</span>
      </td>
      <td className="px-4 py-3">
        {record.player && (
          <>
            <p className="font-semibold">{record.player}</p>
            {record.school && (
              <p className="text-sm text-gray-400">{record.school}</p>
            )}
            {record.year && (
              <p className="text-sm text-gray-400">{record.year}</p>
            )}
          </>
        )}
        {record.players && record.players.length > 0 && (
          <div className="space-y-1">
            {record.players.map((p, idx) => (
              <div key={idx}>
                <p className="font-semibold text-sm">{p.name}</p>
                {p.school && (
                  <p className="text-xs text-gray-400">{p.school}</p>
                )}
                {p.year && (
                  <p className="text-xs text-gray-400">{p.year}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}

export default function AllStarArchive({ games, records }: AllStarArchiveProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedDecade, setSelectedDecade] = useState(DECADES[4].label);

  const decadeGames = useMemo(() => {
    const decade = DECADES.find((d) => d.label === selectedDecade);
    if (!decade) return [];
    return games.filter((g) => g.year >= decade.start && g.year <= decade.end);
  }, [games, selectedDecade]);

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--psp-gold)]/30 pb-4">
        {(["overview", "year-by-year", "records", "td-leaders"] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "text-[var(--psp-gold)] border-b-2 border-[var(--psp-gold)]"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab === "year-by-year" ? "Year-by-Year" : tab === "td-leaders" ? "TD Leaders" : tab}
            </button>
          )
        )}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div>
            <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] mb-4 border-b border-[var(--psp-gold)]/30 pb-2">
              Series History
            </h3>
            <div className="space-y-4 text-gray-300">
              <p>
                The Philadelphia City All-Star Game has been a hallmark of local
                high school football since 1975. This annual exhibition features
                the best players from the Public League competing against the
                finest talent from the Non-Public and Catholic Leagues.
              </p>
              <p>
                Through 2019, the series record stands at Non-Public leading Public
                by a narrow margin. The game has served as a showcase for
                exceptional athletes, many of whom went on to play college and
                professional football.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] mb-4 border-b border-[var(--psp-gold)]/30 pb-2">
              Decade Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {DECADES.map((decade) => (
                <button
                  key={decade.label}
                  onClick={() => setActiveTab("year-by-year")}
                  className={`px-4 py-2 rounded font-semibold transition-colors ${
                    selectedDecade === decade.label
                      ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {decade.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Click a decade to view all games from that era below, or navigate
              to the Year-by-Year tab for detailed recaps and stats.
            </p>
          </div>
        </div>
      )}

      {/* Year-by-Year Tab */}
      {activeTab === "year-by-year" && (
        <div className="space-y-6">
          <div>
            <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] mb-4">
              {selectedDecade}
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {DECADES.map((decade) => (
                <button
                  key={decade.label}
                  onClick={() => setSelectedDecade(decade.label)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    selectedDecade === decade.label
                      ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {decade.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {decadeGames.length === 0 ? (
              <p className="text-gray-400">No games found for this decade.</p>
            ) : (
              decadeGames.map((game) => <GameCard key={game.year} game={game} />)
            )}
          </div>
        </div>
      )}

      {/* Records Tab */}
      {activeTab === "records" && (
        <div className="space-y-8">
          {/* Rushing Records */}
          {records?.rushing && (
            <div>
              <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] mb-4 border-b border-[var(--psp-gold)]/30 pb-2">
                Rushing Records
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody>
                    <RecordRow label="Most Carries" record={records.rushing.most_carries} />
                    <RecordRow label="Most Yards" record={records.rushing.most_yards} />
                    <RecordRow label="Most TDs" record={records.rushing.most_touchdowns} />
                    <RecordRow label="Longest TD" record={records.rushing.longest_touchdown} />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Passing Records */}
          {records?.passing && (
            <div>
              <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] mb-4 border-b border-[var(--psp-gold)]/30 pb-2">
                Passing Records
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody>
                    <RecordRow label="Most Attempts" record={records.passing.most_attempts} />
                    <RecordRow
                      label="Most Completions"
                      record={records.passing.most_completions}
                    />
                    <RecordRow label="Most Yards" record={records.passing.most_yards} />
                    <RecordRow label="Most TDs" record={records.passing.most_touchdowns} />
                    <RecordRow label="Longest TD" record={records.passing.longest_touchdown} />
                    <RecordRow
                      label="Best Completion %"
                      record={records.passing.best_completion_percentage_10_min}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Receiving Records */}
          {records?.receiving && (
            <div>
              <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] mb-4 border-b border-[var(--psp-gold)]/30 pb-2">
                Receiving Records
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody>
                    <RecordRow
                      label="Most Receptions"
                      record={records.receiving.most_receptions}
                    />
                    <RecordRow label="Most Yards" record={records.receiving.most_yards} />
                    <RecordRow label="Most TDs" record={records.receiving.most_touchdowns} />
                    <RecordRow label="Longest TD" record={records.receiving.longest_touchdown} />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Kicking Records */}
          {records?.kicking && (
            <div>
              <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] mb-4 border-b border-[var(--psp-gold)]/30 pb-2">
                Kicking Records
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody>
                    <RecordRow label="Most PATs" record={records.kicking.most_pat} />
                    <RecordRow
                      label="Most Field Goals"
                      record={records.kicking.most_field_goals}
                    />
                    <RecordRow label="Most Points" record={records.kicking.most_points} />
                    <RecordRow
                      label="Longest Field Goal"
                      record={records.kicking.longest_field_goal}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Defensive & Misc Records */}
          {records?.miscellaneous && (
            <div>
              <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] mb-4 border-b border-[var(--psp-gold)]/30 pb-2">
                Defensive & Special Teams Records
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody>
                    <RecordRow
                      label="Longest INT Return"
                      record={records.miscellaneous.longest_interception_return}
                    />
                    <RecordRow
                      label="Longest KO Return"
                      record={records.miscellaneous.longest_kickoff_return}
                    />
                    <RecordRow
                      label="Longest Fumble Return"
                      record={records.miscellaneous.longest_fumble_return}
                    />
                    <RecordRow
                      label="Most Interceptions"
                      record={records.miscellaneous.most_interceptions}
                    />
                    <RecordRow
                      label="Most Points Scored"
                      record={records.miscellaneous.most_points_scored}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TD Leaders Tab */}
      {activeTab === "td-leaders" && (
        <div>
          <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] mb-4 border-b border-[var(--psp-gold)]/30 pb-2">
            Career Touchdown Leaders
          </h3>
          <p className="text-gray-400 mb-6">
            Outstanding individual performances in City All-Star Game history.
          </p>
          <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-6">
            <p className="text-gray-400 text-center py-8">
              Detailed TD scorer data coming soon. See Records tab for individual game records.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
