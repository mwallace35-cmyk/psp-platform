"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ShareStatButton from "@/components/ui/ShareStatButton";

/* ── Types ─────────────────────────────────────────── */

interface SearchResult {
  entity_type: string;
  entity_id: number;
  display_name: string;
  context: string;
  url_path: string;
}

interface PlayerStats {
  player: {
    id: number;
    name: string;
    slug: string;
    positions?: string[];
    graduation_year?: number;
    college?: string;
    pro_team?: string;
    schools?: { name: string; slug: string };
  };
  stats: Record<string, number | string>;
  sport: string;
}

/* ── Stat Display Config ──────────────────────────── */

interface StatConfig {
  key: string;
  label: string;
  category: string;
  suffix: string;
  isRate?: boolean;
  lowerBetter?: boolean;
}

const FOOTBALL_STAT_ORDER: StatConfig[] = [
  { key: "rush_yards", label: "Rush Yards", category: "Rushing", suffix: "yds" },
  { key: "rush_td", label: "Rush TDs", category: "Rushing", suffix: "TDs" },
  { key: "pass_yards", label: "Pass Yards", category: "Passing", suffix: "yds" },
  { key: "pass_td", label: "Pass TDs", category: "Passing", suffix: "TDs" },
  { key: "rec_yards", label: "Rec Yards", category: "Receiving", suffix: "yds" },
  { key: "rec_td", label: "Rec TDs", category: "Receiving", suffix: "TDs" },
  { key: "total_yards", label: "Total Yards", category: "Overall", suffix: "yds" },
  { key: "total_td", label: "Total TDs", category: "Overall", suffix: "TDs" },
];

const BASKETBALL_STAT_ORDER: StatConfig[] = [
  { key: "games_played", label: "Games Played", category: "General", suffix: "GP" },
  { key: "points", label: "Career Points", category: "Scoring", suffix: "pts" },
  { key: "ppg", label: "Points Per Game", category: "Scoring", suffix: "ppg", isRate: true },
  { key: "rebounds", label: "Rebounds", category: "Rebounds", suffix: "rebs" },
  { key: "assists", label: "Assists", category: "Playmaking", suffix: "asts" },
  { key: "steals", label: "Steals", category: "Defense", suffix: "stls" },
  { key: "blocks", label: "Blocks", category: "Defense", suffix: "blks" },
];

const BASEBALL_STAT_ORDER: StatConfig[] = [
  { key: "batting_avg", label: "Batting Avg", category: "Batting", suffix: "", isRate: true },
  { key: "home_runs", label: "Home Runs", category: "Batting", suffix: "HRs" },
  { key: "era", label: "ERA", category: "Pitching", suffix: "ERA", isRate: true, lowerBetter: true },
];

function getStatOrder(sport: string) {
  if (sport === "football") return FOOTBALL_STAT_ORDER;
  if (sport === "basketball") return BASKETBALL_STAT_ORDER;
  if (sport === "baseball") return BASEBALL_STAT_ORDER;
  return [];
}

function formatStatValue(val: number | string | undefined, suffix: string, isRate?: boolean): string {
  if (val === undefined || val === null) return "\u2014";
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return String(val);
  if (isRate && suffix === "ppg") return num.toFixed(1);
  if (isRate && suffix === "ERA") return num.toFixed(2);
  if (isRate && suffix === "") return num.toFixed(3);
  return num.toLocaleString();
}

/* ── Stat Comparison Bar ──────────────────────────── */

function ComparisonBar({
  val1, val2, color1, color2, lowerBetter,
}: {
  val1: number; val2: number; color1: string; color2: string; lowerBetter?: boolean;
}) {
  const max = Math.max(val1, val2, 1);
  const pct1 = (val1 / max) * 100;
  const pct2 = (val2 / max) * 100;

  const better1 = lowerBetter ? val1 < val2 : val1 > val2;
  const better2 = lowerBetter ? val2 < val1 : val2 > val1;
  const tied = val1 === val2;

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Player 1 bar (right-aligned, grows left) */}
      <div className="flex-1 flex justify-end">
        <div
          className="h-5 rounded-l-full transition-all duration-500"
          style={{
            width: `${pct1}%`,
            minWidth: val1 > 0 ? "4px" : "0",
            background: better1 && !tied ? color1 : `${color1}60`,
          }}
        />
      </div>
      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 shrink-0" />
      {/* Player 2 bar (left-aligned, grows right) */}
      <div className="flex-1">
        <div
          className="h-5 rounded-r-full transition-all duration-500"
          style={{
            width: `${pct2}%`,
            minWidth: val2 > 0 ? "4px" : "0",
            background: better2 && !tied ? color2 : `${color2}60`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Player Info Card ─────────────────────────────── */

function PlayerInfoCard({ player, color }: { player: PlayerStats; color: string }) {
  const p = player.player;
  const initials = p.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
        style={{ background: color }}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <Link
          href={`/${player.sport}/players/${p.slug}`}
          className="font-bold text-sm hover:underline truncate block"
          style={{ color: "var(--psp-navy)" }}
        >
          {p.name}
        </Link>
        <div className="text-xs text-gray-500 truncate">
          {p.schools?.name}
          {p.graduation_year ? ` \u00B7 Class of ${p.graduation_year}` : ""}
        </div>
        {p.positions && p.positions.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {p.positions.slice(0, 3).map((pos) => (
              <span key={pos} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                {pos}
              </span>
            ))}
          </div>
        )}
        {(p.college || p.pro_team) && (
          <div className="text-[10px] text-gray-400 mt-0.5 truncate">
            {p.college && <span>{p.college}</span>}
            {p.college && p.pro_team && <span> \u2192 </span>}
            {p.pro_team && <span className="font-medium">{p.pro_team}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Edge Summary ─────────────────────────────────── */

function EdgeSummary({ player1, player2, sport }: { player1: PlayerStats; player2: PlayerStats; sport: string }) {
  const statOrder = getStatOrder(sport);
  let p1Wins = 0;
  let p2Wins = 0;
  let ties = 0;

  for (const stat of statOrder) {
    const v1 = typeof player1.stats[stat.key] === "number" ? (player1.stats[stat.key] as number) : 0;
    const v2 = typeof player2.stats[stat.key] === "number" ? (player2.stats[stat.key] as number) : 0;
    if (v1 === 0 && v2 === 0) continue;
    const better1 = stat.lowerBetter ? v1 < v2 : v1 > v2;
    const better2 = stat.lowerBetter ? v2 < v1 : v2 > v1;
    if (better1) p1Wins++;
    else if (better2) p2Wins++;
    else ties++;
  }

  return (
    <div className="flex items-center justify-center gap-6 py-4 px-6 rounded-xl bg-gray-50 border border-gray-200 mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold" style={{ color: "#3b82f6" }}>{p1Wins}</div>
        <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Categories Won</div>
      </div>
      <div className="text-center px-4 border-x border-gray-200">
        <div className="text-2xl font-bold text-gray-400">{ties}</div>
        <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Tied</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold" style={{ color: "#16a34a" }}>{p2Wins}</div>
        <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Categories Won</div>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────── */

export default function PlayerCompare() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [results1, setResults1] = useState<SearchResult[]>([]);
  const [results2, setResults2] = useState<SearchResult[]>([]);
  const [player1, setPlayer1] = useState<PlayerStats | null>(null);
  const [player2, setPlayer2] = useState<PlayerStats | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const searchPlayers = useCallback(
    async (query: string, setResults: (r: SearchResult[]) => void) => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=player`);
        const data = await res.json();
        const results = data.data?.results ?? data.results ?? [];
        setResults(results.filter((r: SearchResult) => r.entity_type === "player"));
      } catch {
        setResults([]);
      }
    },
    []
  );

  const loadPlayerById = async (id: number, slot: 1 | 2) => {
    const setLoading = slot === 1 ? setLoading1 : setLoading2;
    const setPlayer = slot === 1 ? setPlayer1 : setPlayer2;
    const setSearch = slot === 1 ? setSearch1 : setSearch2;

    setLoading(true);
    try {
      const res = await fetch(`/api/player/${id}`);
      const raw = await res.json();
      const data = raw.data ?? raw;
      setPlayer(data);
      setSearch(data.player?.name || "");
    } catch {
      setPlayer(null);
    }
    setLoading(false);
  };

  const selectPlayer = async (result: SearchResult, slot: 1 | 2) => {
    const setLoading = slot === 1 ? setLoading1 : setLoading2;
    const setPlayer = slot === 1 ? setPlayer1 : setPlayer2;
    const setSearch = slot === 1 ? setSearch1 : setSearch2;
    const setResults = slot === 1 ? setResults1 : setResults2;

    setLoading(true);
    setSearch(result.display_name);
    setResults([]);

    try {
      const res = await fetch(`/api/player/${result.entity_id}`);
      const raw = await res.json();
      const data = raw.data ?? raw;
      setPlayer(data);
    } catch {
      setPlayer(null);
    }
    setLoading(false);
  };

  // Auto-load from URL on mount
  useEffect(() => {
    const p1 = searchParams.get("p1");
    const p2 = searchParams.get("p2");
    if (p1) loadPlayerById(parseInt(p1), 1);
    if (p2) loadPlayerById(parseInt(p2), 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when players change
  useEffect(() => {
    if (player1 && player2) {
      const params = new URLSearchParams();
      params.set("p1", String(player1.player.id));
      params.set("p2", String(player2.player.id));
      router.replace(`/compare?${params.toString()}`, { scroll: false });
    }
  }, [player1, player2, router]);

  const sport = player1?.sport || player2?.sport || "";
  const statOrder = getStatOrder(sport);

  // Group stats by category
  const categories: { name: string; stats: typeof statOrder }[] = [];
  const seen = new Set<string>();
  for (const stat of statOrder) {
    if (!seen.has(stat.category)) {
      seen.add(stat.category);
      categories.push({ name: stat.category, stats: statOrder.filter((s) => s.category === stat.category) });
    }
  }

  // Build share text
  const shareText =
    player1 && player2
      ? `${player1.player.name} vs ${player2.player.name} \u2014 PhillySportsPack Compare`
      : "";

  const P1_COLOR = "#3b82f6";
  const P2_COLOR = "#16a34a";

  return (
    <div>
      {/* Search inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((slot) => {
          const search = slot === 1 ? search1 : search2;
          const setSearch = slot === 1 ? setSearch1 : setSearch2;
          const results = slot === 1 ? results1 : results2;
          const setResults = slot === 1 ? setResults1 : setResults2;
          const player = slot === 1 ? player1 : player2;
          const loading = slot === 1 ? loading1 : loading2;
          const color = slot === 1 ? P1_COLOR : P2_COLOR;

          return (
            <div key={slot} className="relative">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--psp-navy)" }}>
                Player {slot}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    searchPlayers(e.target.value, setResults);
                  }}
                  placeholder="Search by player name..."
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors"
                  style={{
                    borderColor: player ? color : "#e5e7eb",
                  }}
                  aria-label={`Search for player ${slot}`}
                />
                {player && (
                  <button
                    onClick={() => {
                      if (slot === 1) { setPlayer1(null); setSearch1(""); }
                      else { setPlayer2(null); setSearch2(""); }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                    aria-label="Clear player"
                  >
                    ×
                  </button>
                )}
              </div>

              {results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {results.map((r) => (
                    <button
                      key={r.entity_id}
                      onClick={() => selectPlayer(r, slot as 1 | 2)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-sm">{r.display_name}</div>
                      <div className="text-xs text-gray-600">{r.context}</div>
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="mt-3 p-4 rounded-lg border-2 border-dashed border-gray-200 animate-pulse">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-48 bg-gray-100 rounded" />
                </div>
              )}

              {player && !loading && (
                <div
                  className="mt-3 p-4 rounded-lg border-2"
                  style={{ borderColor: `${color}30`, background: `${color}08` }}
                >
                  <PlayerInfoCard player={player} color={color} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison results */}
      {player1 && player2 && (
        <div>
          {/* Edge Summary */}
          <EdgeSummary player1={player1} player2={player2} sport={sport} />

          {/* Visual Stat Comparison */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center bg-gray-50 border-b border-gray-200 px-4 py-3">
              <div className="text-right">
                <span className="font-bold text-sm" style={{ color: P1_COLOR }}>
                  {player1.player.name}
                </span>
              </div>
              <div className="px-4 text-xs font-medium uppercase tracking-wider text-gray-400">vs</div>
              <div>
                <span className="font-bold text-sm" style={{ color: P2_COLOR }}>
                  {player2.player.name}
                </span>
              </div>
            </div>

            {/* Stat rows by category */}
            {categories.map((cat) => (
              <div key={cat.name}>
                {/* Category header */}
                <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {cat.name}
                  </span>
                </div>

                {cat.stats.map((stat) => {
                  const v1raw = player1.stats[stat.key];
                  const v2raw = player2.stats[stat.key];
                  const v1 = typeof v1raw === "number" ? v1raw : typeof v1raw === "string" ? parseFloat(v1raw) : 0;
                  const v2 = typeof v2raw === "number" ? v2raw : typeof v2raw === "string" ? parseFloat(v2raw) : 0;

                  // Skip stats where both are 0
                  if (v1 === 0 && v2 === 0) return null;

                  const better1 = stat.lowerBetter ? v1 < v2 : v1 > v2;
                  const better2 = stat.lowerBetter ? v2 < v1 : v2 > v1;
                  const tied = v1 === v2;

                  return (
                    <div key={stat.key} className="border-b border-gray-100 last:border-0">
                      {/* Values row */}
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2">
                        <div className="text-right">
                          <span
                            className={`text-sm tabular-nums ${better1 && !tied ? "font-bold" : "text-gray-500"}`}
                            style={better1 && !tied ? { color: P1_COLOR } : undefined}
                          >
                            {formatStatValue(v1raw, stat.suffix, stat.isRate)}
                          </span>
                        </div>
                        <div className="px-3 text-center">
                          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                            {stat.label}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`text-sm tabular-nums ${better2 && !tied ? "font-bold" : "text-gray-500"}`}
                            style={better2 && !tied ? { color: P2_COLOR } : undefined}
                          >
                            {formatStatValue(v2raw, stat.suffix, stat.isRate)}
                          </span>
                        </div>
                      </div>

                      {/* Comparison bar */}
                      <div className="px-4 pb-2">
                        <ComparisonBar
                          val1={v1}
                          val2={v2}
                          color1={P1_COLOR}
                          color2={P2_COLOR}
                          lowerBetter={stat.lowerBetter}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Fallback: show raw stats if no sport-specific order */}
            {statOrder.length === 0 && (
              <>
                {Object.keys(player1.stats).map((key) => {
                  const v1raw = player1.stats[key];
                  const v2raw = player2.stats[key];
                  const v1 = typeof v1raw === "number" ? v1raw : 0;
                  const v2 = typeof v2raw === "number" ? v2raw : 0;
                  if (v1 === 0 && v2 === 0) return null;
                  const better1 = v1 > v2;
                  const better2 = v2 > v1;
                  const tied = v1 === v2;

                  return (
                    <div key={key} className="border-b border-gray-100 last:border-0">
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2">
                        <div className="text-right">
                          <span className={`text-sm tabular-nums ${better1 && !tied ? "font-bold" : "text-gray-500"}`}>
                            {v1raw ?? "\u2014"}
                          </span>
                        </div>
                        <div className="px-3 text-center">
                          <span className="text-xs font-medium text-gray-500 capitalize whitespace-nowrap">
                            {key.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div>
                          <span className={`text-sm tabular-nums ${better2 && !tied ? "font-bold" : "text-gray-500"}`}>
                            {v2raw ?? "\u2014"}
                          </span>
                        </div>
                      </div>
                      <div className="px-4 pb-2">
                        <ComparisonBar val1={v1} val2={v2} color1={P1_COLOR} color2={P2_COLOR} />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Share + Links */}
          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            <ShareStatButton
              url={`/compare?p1=${player1.player.id}&p2=${player2.player.id}`}
              title={shareText}
              statText={shareText}
            />
            <Link
              href={`/${sport}/players/${player1.player.slug}`}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
              style={{ color: P1_COLOR }}
            >
              View {player1.player.name.split(" ").pop()}'s Profile
            </Link>
            <Link
              href={`/${sport}/players/${player2.player.slug}`}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition"
              style={{ color: P2_COLOR }}
            >
              View {player2.player.name.split(" ").pop()}'s Profile
            </Link>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!player1 && !player2 && !loading1 && !loading2 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-5xl mb-4" aria-hidden="true">
            <span style={{ color: P1_COLOR }}>&#9646;</span>
            <span className="text-gray-300 mx-1">vs</span>
            <span style={{ color: P2_COLOR }}>&#9646;</span>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
            Select Two Players
          </h2>
          <p className="text-gray-600 max-w-md mx-auto text-sm">
            Use the search boxes above to find and compare any two Philadelphia high school athletes.
            See visual stat bars, head-to-head breakdowns, and share comparisons to social media.
          </p>
        </div>
      )}
    </div>
  );
}
