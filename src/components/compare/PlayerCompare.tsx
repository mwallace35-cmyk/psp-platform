"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface SearchResult {
  entity_type: string;
  entity_id: number;
  display_name: string;
  context: string;
  url_path: string;
}

interface PlayerStats {
  player: { id: number; name: string; slug: string; positions?: string[]; graduation_year?: number; college?: string; pro_team?: string; schools?: { name: string; slug: string } };
  stats: Record<string, number | string>;
  sport: string;
}

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
  const [copied, setCopied] = useState(false);

  const searchPlayers = useCallback(async (query: string, setResults: (r: SearchResult[]) => void) => {
    if (query.length < 2) { setResults([]); return; }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=player`);
      const data = await res.json();
      const results = data.data?.results ?? data.results ?? [];
      setResults(results.filter((r: SearchResult) => r.entity_type === "player"));
    } catch {
      setResults([]);
    }
  }, []);

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

  const statKeys = player1?.stats ? Object.keys(player1.stats) : player2?.stats ? Object.keys(player2.stats) : [];

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

          return (
            <div key={slot} className="relative">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--psp-navy)" }}>
                Player {slot}
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  searchPlayers(e.target.value, setResults);
                }}
                placeholder="Search by player name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Search for player ${slot}`}
              />
              {results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {results.map((r) => (
                    <button
                      key={r.entity_id}
                      onClick={() => selectPlayer(r, slot as 1 | 2)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-sm">{r.display_name}</div>
                      <div className="text-xs text-gray-400">{r.context}</div>
                    </button>
                  ))}
                </div>
              )}
              {loading && <div className="mt-2 text-sm text-gray-300">Loading stats...</div>}
              {player && !loading && (
                <div className="mt-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="font-bold" style={{ color: "var(--psp-navy)" }}>{player.player.name}</div>
                  <div className="text-xs text-gray-400">
                    {player.player.schools?.name} {player.player.graduation_year ? `• Class of ${player.player.graduation_year}` : ""}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      {player1 && player2 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" aria-label="Player comparison">
              <caption className="sr-only">Player comparison</caption>
              <thead>
                <tr>
                  <th scope="col" className="text-left px-4 py-3 bg-gray-100 font-medium text-sm" style={{ color: "var(--psp-navy)" }}>Stat</th>
                  <th scope="col" className="text-right px-4 py-3 bg-blue-50 font-medium text-sm" style={{ color: "var(--psp-navy)" }}>{player1.player.name}</th>
                  <th scope="col" className="text-right px-4 py-3 bg-green-50 font-medium text-sm" style={{ color: "var(--psp-navy)" }}>{player2.player.name}</th>
                </tr>
              </thead>
              <tbody>
                {statKeys.map((key) => {
                  const v1 = player1.stats[key];
                  const v2 = player2.stats[key];
                  const n1 = typeof v1 === "number" ? v1 : 0;
                  const n2 = typeof v2 === "number" ? v2 : 0;
                  const highlight1 = n1 > n2 ? "font-bold" : "";
                  const highlight2 = n2 > n1 ? "font-bold" : "";
                  return (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm capitalize" style={{ color: "var(--psp-gray-500)" }}>
                        {key.replace(/_/g, " ")}
                      </td>
                      <td className={`text-right px-4 py-3 text-sm ${highlight1}`} style={{ color: "var(--psp-navy)" }}>
                        {v1 ?? "—"}
                      </td>
                      <td className={`text-right px-4 py-3 text-sm ${highlight2}`} style={{ color: "var(--psp-navy)" }}>
                        {v2 ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Copy Comparison Link Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--psp-navy)", color: "white" }}
            >
              {copied ? "Link Copied!" : "Copy Comparison Link"}
            </button>
          </div>
        </>
      )}

      {/* Empty state */}
      {!player1 && !player2 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-4xl mb-4" aria-hidden="true">📊</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
            Select Two Players
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Use the search boxes above to find and compare any two Philadelphia high school athletes side-by-side.
          </p>
        </div>
      )}
    </div>
  );
}
