"use client";

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RosterPlayer {
  jersey: string;
  name: string;
  school: string;
  position: string;
  height?: string;
  weight?: string;
}

interface Touchdown {
  year: number;
  scorer: string;
  school: string;
  method: string;
  team: string;
}

interface TdPass {
  year: number;
  passer: string;
  passer_school: string;
  receiver: string;
  receiver_school: string;
  distance?: string;
  team: string;
}

interface GameData {
  year: number;
  score: string;
  mvps?: Array<{ name: string; position?: string; school?: string; stats?: string }>;
  notables?: string[];
  highlights?: string[];
  recap?: string;
  venue?: string;
  attendance?: number;
  touchdowns?: Touchdown[];
  td_passes?: TdPass[];
  rosters?: {
    public?: RosterPlayer[];
    non_public?: RosterPlayer[];
  };
  team_stats?: Record<string, Record<string, string | number>>;
  rushing?: Array<{ team: string; name: string; school?: string | null; carries_yards: string }>;
  passing?: Array<{ team: string; name: string; school?: string | null; completions_attempts_yards: string }>;
  receiving?: Array<{ team: string; name: string; school?: string | null; catches_yards: string }>;
}

interface TdLeader {
  name: string;
  school: string;
  tds: number;
  years: number[];
  methods: string[];
}

interface RecordHolder {
  value: string | number;
  player?: string;
  players?: Array<{ name: string; school?: string; year?: number }>;
  school?: string;
  year?: number;
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
  tdLeaders?: TdLeader[];
  rosters?: Record<number, { public?: RosterPlayer[]; non_public?: RosterPlayer[] }>;
}

type TabType = "year-by-year" | "records" | "td-scorers" | "rosters";

const DECADES = [
  { label: "All", start: 1975, end: 2019 },
  { label: "1970s", start: 1975, end: 1979 },
  { label: "1980s", start: 1980, end: 1989 },
  { label: "1990s", start: 1990, end: 1999 },
  { label: "2000s", start: 2000, end: 2009 },
  { label: "2010s", start: 2010, end: 2019 },
];

// ─── Score Parser ─────────────────────────────────────────────────────────────

function parseScore(score: string): {
  winner: string;
  loser: string;
  winnerScore: number;
  loserScore: number;
} | null {
  const scoreUpper = score.toUpperCase();
  const parts = scoreUpper.split(",").map((p) => p.trim());
  if (parts.length !== 2) return null;

  const firstWords = parts[0].split(" ");
  const secondWords = parts[1].split(" ");
  const firstScore = parseInt(firstWords[firstWords.length - 1] || "0", 10);
  const secondScore = parseInt(secondWords[secondWords.length - 1] || "0", 10);
  const firstName = firstWords.slice(0, -1).join(" ");
  const secondName = secondWords.slice(0, -1).join(" ");

  if (firstScore >= secondScore) {
    return { winner: firstName, loser: secondName, winnerScore: firstScore, loserScore: secondScore };
  }
  return { winner: secondName, loser: firstName, winnerScore: secondScore, loserScore: firstScore };
}

// ─── Game Card ────────────────────────────────────────────────────────────────

function GameCard({ game }: { game: GameData }) {
  const [expanded, setExpanded] = useState(false);
  const parsed = parseScore(game.score);
  if (!parsed) return null;

  const isPublicWin = parsed.winner.includes("PUBLIC") && !parsed.winner.includes("NON");
  const winColor = isPublicWin ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300";

  return (
    <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 hover:bg-white/10 transition-colors flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] w-16 shrink-0">
            {game.year}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg">{game.score}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {game.mvps && game.mvps.length > 0 && (
                <p className="text-sm text-gray-400">
                  MVP: {game.mvps.map((m) => `${m.name}${m.school ? ` (${m.school})` : ""}`).join(", ")}
                </p>
              )}
              {game.venue && (
                <p className="text-sm text-gray-500">📍 {game.venue}</p>
              )}
            </div>
          </div>
          <div className={`px-3 py-1 rounded text-sm font-semibold ${winColor} shrink-0`}>
            {parsed.winnerScore === parsed.loserScore ? "TIE" : isPublicWin ? "PUB" : "N-P"}
          </div>
        </div>
        <span className="text-lg font-bold ml-3 shrink-0">{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <div className="border-t border-[var(--psp-gold)]/20 bg-white/5 p-4 space-y-5">
          {/* Recap */}
          {game.recap && (
            <div>
              <p className="text-gray-300 text-sm leading-relaxed">{game.recap}</p>
            </div>
          )}

          {/* MVPs */}
          {game.mvps && game.mvps.length > 0 && (
            <div>
              <h4 className="font-semibold text-[var(--psp-gold)] text-sm uppercase tracking-wide mb-2">
                MVP{game.mvps.length > 1 ? "s" : ""}
              </h4>
              <div className="space-y-1">
                {game.mvps.map((mvp, idx) => (
                  <p key={idx} className="text-sm">
                    <span className="font-semibold">{mvp.name}</span>
                    {mvp.school && <span className="text-gray-400"> ({mvp.school})</span>}
                    {mvp.stats && <span className="text-gray-400"> — {mvp.stats}</span>}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Touchdowns */}
          {game.touchdowns && game.touchdowns.length > 0 && (
            <div>
              <h4 className="font-semibold text-[var(--psp-gold)] text-sm uppercase tracking-wide mb-2">
                Touchdowns
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {game.touchdowns.map((td, idx) => (
                  <p key={idx} className="text-sm">
                    <span className="font-semibold">{td.scorer}</span>
                    <span className="text-gray-400"> ({td.school})</span>
                    {td.method && <span className="text-gray-500"> — {td.method}</span>}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* TD Passes */}
          {game.td_passes && game.td_passes.length > 0 && (
            <div>
              <h4 className="font-semibold text-[var(--psp-gold)] text-sm uppercase tracking-wide mb-2">
                TD Passes
              </h4>
              <div className="space-y-1">
                {game.td_passes.map((tdp, idx) => (
                  <p key={idx} className="text-sm">
                    <span className="font-semibold">{tdp.passer}</span>
                    {tdp.passer_school && <span className="text-gray-400"> ({tdp.passer_school})</span>}
                    <span className="text-gray-500"> to </span>
                    <span className="font-semibold">{tdp.receiver}</span>
                    {tdp.receiver_school && <span className="text-gray-400"> ({tdp.receiver_school})</span>}
                    {tdp.distance && <span className="text-gray-500"> — {tdp.distance}</span>}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {game.highlights && game.highlights.length > 0 && (
            <div>
              <h4 className="font-semibold text-[var(--psp-gold)] text-sm uppercase tracking-wide mb-2">
                Highlights
              </h4>
              <ul className="text-sm space-y-1">
                {game.highlights.map((note, idx) => (
                  <li key={idx} className="text-gray-300 flex gap-2">
                    <span className="text-[var(--psp-gold)] shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Attendance */}
          {game.attendance && (
            <p className="text-xs text-gray-500">Attendance: {game.attendance.toLocaleString()}</p>
          )}

          {/* Roster (if available for this year) */}
          {game.rosters && (
            <div>
              <h4 className="font-semibold text-[var(--psp-gold)] text-sm uppercase tracking-wide mb-3">
                Full Rosters
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(["non_public", "public"] as const).map((squad) => {
                  const players = game.rosters?.[squad];
                  if (!players || players.length === 0) return null;
                  return (
                    <div key={squad}>
                      <h5 className="font-semibold text-sm mb-2 px-2 py-1 rounded bg-white/10">
                        {squad === "non_public" ? "Non-Public" : "Public"} ({players.length} players)
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-gray-400 border-b border-white/10">
                              <th className="text-left px-1 py-1">#</th>
                              <th className="text-left px-1 py-1">Name</th>
                              <th className="text-left px-1 py-1">School</th>
                              <th className="text-left px-1 py-1">Pos</th>
                              <th className="text-left px-1 py-1">Ht</th>
                              <th className="text-left px-1 py-1">Wt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {players.map((p, idx) => (
                              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                                <td className="px-1 py-0.5 text-gray-500">{p.jersey}</td>
                                <td className="px-1 py-0.5 font-medium">{p.name}</td>
                                <td className="px-1 py-0.5 text-gray-400">{p.school}</td>
                                <td className="px-1 py-0.5 text-gray-400">{p.position}</td>
                                <td className="px-1 py-0.5 text-gray-500">{p.height}</td>
                                <td className="px-1 py-0.5 text-gray-500">{p.weight}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Record Row ───────────────────────────────────────────────────────────────

function RecordRow({ label, record }: { label: string; record: RecordHolder | undefined }) {
  if (!record) return null;
  return (
    <tr className="border-b border-[var(--psp-gold)]/10 hover:bg-white/5 transition-colors duration-200">
      <td className="px-4 py-3 font-semibold text-[var(--psp-gold)]">{label}</td>
      <td className="px-4 py-3">
        <span className="font-bold text-lg">{record.value}</span>
      </td>
      <td className="px-4 py-3">
        {record.player && (
          <>
            <p className="font-semibold">{record.player}</p>
            {record.school && <p className="text-sm text-gray-400">{record.school}</p>}
            {record.year && <p className="text-sm text-gray-400">{record.year}</p>}
          </>
        )}
        {record.players && record.players.length > 0 && (
          <div className="space-y-1">
            {record.players.map((p, idx) => (
              <div key={idx}>
                <p className="font-semibold text-sm">{p.name}</p>
                {p.school && <p className="text-xs text-gray-400">{p.school}</p>}
                {p.year && <p className="text-xs text-gray-400">{p.year}</p>}
              </div>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}

// ─── Records Section ──────────────────────────────────────────────────────────

function RecordsSection({ records }: { records: IndividualRecords }) {
  const sections: { title: string; key: keyof IndividualRecords; rows: { label: string; field: string }[] }[] = [
    {
      title: "Rushing Records", key: "rushing",
      rows: [
        { label: "Most Carries", field: "most_carries" },
        { label: "Most Yards", field: "most_yards" },
        { label: "Most TDs", field: "most_touchdowns" },
        { label: "Longest TD", field: "longest_touchdown" },
      ],
    },
    {
      title: "Passing Records", key: "passing",
      rows: [
        { label: "Most Attempts", field: "most_attempts" },
        { label: "Most Completions", field: "most_completions" },
        { label: "Most Yards", field: "most_yards" },
        { label: "Most TDs", field: "most_touchdowns" },
        { label: "Longest TD", field: "longest_touchdown" },
        { label: "Best Completion %", field: "best_completion_percentage_10_min" },
      ],
    },
    {
      title: "Receiving Records", key: "receiving",
      rows: [
        { label: "Most Receptions", field: "most_receptions" },
        { label: "Most Yards", field: "most_yards" },
        { label: "Most TDs", field: "most_touchdowns" },
        { label: "Longest TD", field: "longest_touchdown" },
      ],
    },
    {
      title: "Kicking Records", key: "kicking",
      rows: [
        { label: "Most PATs", field: "most_pat" },
        { label: "Most Field Goals", field: "most_field_goals" },
        { label: "Most Points", field: "most_points" },
        { label: "Longest Field Goal", field: "longest_field_goal" },
      ],
    },
    {
      title: "Defensive & Special Teams", key: "miscellaneous",
      rows: [
        { label: "Longest INT Return", field: "longest_interception_return" },
        { label: "Longest KO Return", field: "longest_kickoff_return" },
        { label: "Longest Fumble Return", field: "longest_fumble_return" },
        { label: "Most Interceptions", field: "most_interceptions" },
        { label: "Most Points Scored", field: "most_points_scored" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const data = records[section.key];
        if (!data) return null;
        return (
          <div key={section.key}>
            <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)] mb-4 border-b border-[var(--psp-gold)]/30 pb-2">
              {section.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {section.rows.map((row) => (
                    <RecordRow key={row.field} label={row.label} record={(data as any)[row.field]} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── TD Scorers Tab ───────────────────────────────────────────────────────────

function TdScorersTab({ games }: { games: GameData[] }) {
  const [teamFilter, setTeamFilter] = useState<"all" | "public" | "non-public">("all");

  // Collect all TDs across all games
  const allTds = useMemo(() => {
    const tds: (Touchdown & { gameScore: string })[] = [];
    for (const game of games) {
      if (game.touchdowns) {
        for (const td of game.touchdowns) {
          tds.push({ ...td, gameScore: game.score });
        }
      }
    }
    return tds.sort((a, b) => b.year - a.year);
  }, [games]);

  // Count by school
  const schoolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const td of allTds) {
      if (td.school) {
        counts[td.school] = (counts[td.school] || 0) + 1;
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [allTds]);

  const filteredTds = teamFilter === "all"
    ? allTds
    : allTds.filter((td) => td.team === teamFilter);

  // Group by year
  const byYear = useMemo(() => {
    const grouped: Record<number, typeof filteredTds> = {};
    for (const td of filteredTds) {
      if (!grouped[td.year]) grouped[td.year] = [];
      grouped[td.year].push(td);
    }
    return Object.entries(grouped)
      .map(([year, tds]) => ({ year: parseInt(year), tds }))
      .sort((a, b) => b.year - a.year);
  }, [filteredTds]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)]">
            All-Time TD Scorers
          </h3>
          <p className="text-gray-400 text-sm">{allTds.length} touchdowns across 45 games (1975–2019)</p>
        </div>
        <div className="flex gap-2">
          {(["all", "public", "non-public"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTeamFilter(f)}
              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                teamFilter === f
                  ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {f === "all" ? "All" : f === "public" ? "Public" : "Non-Public"}
            </button>
          ))}
        </div>
      </div>

      {/* Top Schools */}
      <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4">
        <h4 className="font-semibold text-sm text-[var(--psp-gold)] mb-3 uppercase tracking-wide">
          Most TDs by School
        </h4>
        <div className="flex flex-wrap gap-2">
          {schoolCounts.map(([school, count]) => (
            <span key={school} className="inline-flex items-center gap-1 bg-white/10 rounded px-2 py-1 text-sm">
              <span className="font-semibold">{school}</span>
              <span className="text-[var(--psp-gold)] font-bold">{count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Year-by-Year TDs */}
      <div className="space-y-4">
        {byYear.map(({ year, tds }) => (
          <div key={year} className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/10 p-3">
            <h4 className="font-bebas-neue text-xl font-bold text-[var(--psp-gold)] mb-2">{year}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {tds.map((td, idx) => (
                <p key={idx} className="text-sm">
                  <span className={`inline-block w-5 text-center rounded text-xs font-bold mr-1 ${
                    td.team === "public" ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"
                  }`}>
                    {td.team === "public" ? "P" : "N"}
                  </span>
                  <span className="font-semibold">{td.scorer}</span>
                  <span className="text-gray-400"> ({td.school})</span>
                  {td.method && <span className="text-gray-500"> — {td.method}</span>}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Rosters Tab ──────────────────────────────────────────────────────────────

function RostersTab({ games }: { games: GameData[] }) {
  const rosterYears = useMemo(
    () => games.filter((g) => g.rosters).sort((a, b) => b.year - a.year),
    [games]
  );

  if (rosterYears.length === 0) {
    return (
      <div className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-8 text-center">
        <p className="text-gray-400">No detailed roster data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bebas-neue text-2xl font-bold text-[var(--psp-gold)]">
          Game Rosters
        </h3>
        <p className="text-gray-400 text-sm">
          Full rosters with jersey numbers, positions, height, and weight for {rosterYears.length} games
        </p>
      </div>

      {rosterYears.map((game) => (
        <div key={game.year} className="space-y-4">
          <h4 className="font-bebas-neue text-2xl font-bold border-b border-[var(--psp-gold)]/30 pb-2">
            {game.year} — <span className="text-gray-400 text-lg">{game.score}</span>
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(["non_public", "public"] as const).map((squad) => {
              const players = game.rosters?.[squad];
              if (!players || players.length === 0) return null;
              return (
                <div key={squad}>
                  <h5 className="font-semibold mb-2 px-3 py-2 rounded bg-white/10">
                    {squad === "non_public" ? "🟣 Non-Public" : "🔵 Public"} — {players.length} Players
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 border-b border-white/20 text-xs uppercase tracking-wide">
                          <th className="text-left px-2 py-2">#</th>
                          <th className="text-left px-2 py-2">Name</th>
                          <th className="text-left px-2 py-2">School</th>
                          <th className="text-left px-2 py-2">Pos</th>
                          <th className="text-left px-2 py-2">Ht</th>
                          <th className="text-left px-2 py-2">Wt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {players.map((p, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                            <td className="px-2 py-1 text-gray-500 font-mono">{p.jersey}</td>
                            <td className="px-2 py-1 font-medium">{p.name}</td>
                            <td className="px-2 py-1 text-gray-400">{p.school}</td>
                            <td className="px-2 py-1">
                              <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">
                                {p.position}
                              </span>
                            </td>
                            <td className="px-2 py-1 text-gray-500">{p.height}</td>
                            <td className="px-2 py-1 text-gray-500">{p.weight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AllStarArchive({ games, records, tdLeaders, rosters }: AllStarArchiveProps) {
  const [activeTab, setActiveTab] = useState<TabType>("year-by-year");
  const [selectedDecade, setSelectedDecade] = useState("All");

  const filteredGames = useMemo(() => {
    if (selectedDecade === "All") return [...games].sort((a, b) => b.year - a.year);
    const decade = DECADES.find((d) => d.label === selectedDecade);
    if (!decade) return [];
    return games
      .filter((g) => g.year >= decade.start && g.year <= decade.end)
      .sort((a, b) => b.year - a.year);
  }, [games, selectedDecade]);

  const rosterCount = games.filter((g) => g.rosters).length;

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "year-by-year", label: "Year-by-Year", count: games.length },
    { id: "td-scorers", label: "TD Scorers" },
    { id: "records", label: "Records" },
    ...(rosterCount > 0 ? [{ id: "rosters" as TabType, label: "Rosters", count: rosterCount }] : []),
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--psp-gold)]/30 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? "text-[var(--psp-gold)] border-b-2 border-[var(--psp-gold)]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                activeTab === tab.id ? "bg-[var(--psp-gold)]/20" : "bg-white/10"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Year-by-Year Tab */}
      {activeTab === "year-by-year" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
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

          <div className="space-y-3">
            {filteredGames.length === 0 ? (
              <p className="text-gray-400">No games found for this period.</p>
            ) : (
              filteredGames.map((game) => <GameCard key={game.year} game={game} />)
            )}
          </div>
        </div>
      )}

      {/* TD Scorers Tab */}
      {activeTab === "td-scorers" && <TdScorersTab games={games} />}

      {/* Records Tab */}
      {activeTab === "records" && records && <RecordsSection records={records} />}

      {/* Rosters Tab */}
      {activeTab === "rosters" && <RostersTab games={games} />}
    </div>
  );
}
