import Link from "next/link";
import type { RosterPlayer } from "@/lib/data";

type School = {
  id: number;
  slug: string;
};

interface RosterStatsTableProps {
  roster: RosterPlayer[];
  school: School;
  sport: string;
  season: string;
}

export default function RosterStatsTable({ roster, school, sport, season }: RosterStatsTableProps) {
  return (
    <section id="roster" className="mb-8 scroll-mt-16">
      {/* Stats anchor */}
      <div id="stats" className="scroll-mt-16" />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="psp-h2 text-white mb-2">
            Roster & Stats
          </h2>
          <p className="text-sm text-gray-300">{roster.length} players on record</p>
        </div>
        <Link
          href={`/${sport}/teams/${school.slug}/roster?season=${season}`}
          className="px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          style={{
            background: "var(--psp-gold)",
            color: "var(--psp-navy)",
            textDecoration: "none",
          }}
        >
          View Full Roster →
        </Link>
      </div>

    {roster.length > 0 ? (
      <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700" aria-label="Team roster">
            {sport === "football" && (
              <>
                <thead>
                  <tr className="bg-[var(--psp-navy)]">
                    <th className="text-left py-3 px-4 text-white font-semibold sticky left-0 bg-[var(--psp-navy)]">#</th>
                    <th className="text-left py-3 px-4 text-white font-semibold sticky left-8 bg-[var(--psp-navy)]">Player</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold" colSpan={3} style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}>Rushing</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold" colSpan={3} style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}>Passing</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold" colSpan={2} style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}>Receiving</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold" colSpan={2} style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}>Scoring</th>
                  </tr>
                  <tr style={{ background: "var(--psp-navy-mid, #0f2040)" }}>
                    <th className="py-2 px-4 sticky left-0" style={{ background: "var(--psp-navy-mid, #0f2040)" }}></th>
                    <th className="py-2 px-4 sticky left-8" style={{ background: "var(--psp-navy-mid, #0f2040)" }}></th>
                    <th className="py-2 px-4 text-xs text-gray-300 text-right" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>CAR</th>
                    <th className="py-2 px-4 text-xs text-gray-300 text-right">YDS</th>
                    <th className="py-2 px-4 text-xs text-gray-300 text-right">TD</th>
                    <th className="py-2 px-4 text-xs text-gray-300 text-right" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>CMP/ATT</th>
                    <th className="py-2 px-4 text-xs text-gray-300 text-right">YDS</th>
                    <th className="py-2 px-4 text-xs text-gray-300 text-right">TD/INT</th>
                    <th className="py-2 px-4 text-xs text-gray-300 text-right" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>REC</th>
                    <th className="py-2 px-4 text-xs text-gray-300 text-right">YDS</th>
                    <th className="py-2 px-4 text-xs text-gray-300 text-right" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>TD</th>
                    <th className="py-2 px-4 text-xs text-gray-300 text-right">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {[...roster].sort((a: unknown, b: unknown) => {
                    const aNum = parseInt(String((a as Record<string, unknown>).jersey_number || '999'), 10);
                    const bNum = parseInt(String((b as Record<string, unknown>).jersey_number || '999'), 10);
                    return aNum - bNum;
                  }).map((player: unknown, idx: number) => {
                    // Roster API returns enriched data with stats beyond RosterPlayer type
                    const p = player as RosterPlayer & Record<string, unknown>;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const stats = p as any;
                    const hasRush = (stats.rush_yards as number | null) !== null && (stats.rush_yards as number) !== 0;
                    const hasPass = (stats.pass_yards as number | null) !== null && (stats.pass_yards as number) !== 0;
                    const hasRec = (stats.rec_yards as number | null) !== null && (stats.rec_yards as number) !== 0;
                    return (
                      <tr key={p.id || idx} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid var(--psp-gray-100, #f3f4f6)" }}>
                        <td className="py-3 px-4 text-xs font-bold text-gray-400 sticky left-0 bg-white">{p.jersey_number ?? '—'}</td>
                        <td className="py-3 px-4 font-medium sticky left-8 bg-white" style={{ color: "var(--psp-navy)" }}>
                          {p.players ? (
                            <Link href={`/${sport}/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                              {p.players.name}
                            </Link>
                          ) : "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-right text-sm" style={{ borderLeft: "1px solid var(--psp-gray-100, #f3f4f6)", color: hasRush ? "var(--psp-navy)" : "#ccc" }}>
                          {String(stats.rush_carries ?? "—")}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-medium" style={{ color: hasRush ? "var(--psp-navy)" : "#ccc" }}>
                          {hasRush ? String(stats.rush_yards) : "—"}
                        </td>
                        <td className="py-3 px-4 text-right text-sm" style={{ color: ((stats.rush_td ?? 0) as number) > 0 ? "var(--psp-gold)" : "#ccc" }}>
                          {String(stats.rush_td ?? "—")}
                        </td>
                        <td className="py-3 px-4 text-right text-sm" style={{ borderLeft: "1px solid var(--psp-gray-100, #f3f4f6)", color: hasPass ? "var(--psp-navy)" : "#ccc" }}>
                          {hasPass ? `${stats.pass_comp ?? 0}/${stats.pass_att ?? 0}` : "—"}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-medium" style={{ color: hasPass ? "var(--psp-navy)" : "#ccc" }}>
                          {hasPass ? String(stats.pass_yards) : "—"}
                        </td>
                        <td className="py-3 px-4 text-right text-sm" style={{ color: hasPass ? "var(--psp-navy)" : "#ccc" }}>
                          {hasPass ? `${String(stats.pass_td ?? 0)}/${String(stats.pass_int ?? 0)}` : "—"}
                        </td>
                        <td className="py-3 px-4 text-right text-sm" style={{ borderLeft: "1px solid var(--psp-gray-100, #f3f4f6)", color: hasRec ? "var(--psp-navy)" : "#ccc" }}>
                          {hasRec ? String(stats.receptions) : "—"}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-medium" style={{ color: hasRec ? "var(--psp-navy)" : "#ccc" }}>
                          {hasRec ? String(stats.rec_yards) : "—"}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-bold" style={{ borderLeft: "1px solid var(--psp-gray-100, #f3f4f6)", color: ((stats.total_td ?? 0) as number) > 0 ? "var(--psp-gold)" : "#ccc" }}>
                          {String(stats.total_td ?? "—")}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-bold" style={{ color: ((stats.points ?? 0) as number) > 0 ? "var(--psp-navy)" : "#ccc" }}>
                          {String(stats.points ?? "—")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}

            {(sport === "basketball" || sport === "girls-basketball") && (
              <>
                <thead>
                  <tr className="bg-[var(--psp-navy)]">
                    <th className="text-left py-3 px-4 text-white font-semibold">#</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Player</th>
                    <th className="text-center py-3 px-3 text-gray-300 font-semibold">GP</th>
                    <th className="text-right py-3 px-3 text-gray-300 font-semibold">PTS</th>
                    <th className="text-right py-3 px-3 text-gray-300 font-semibold">PPG</th>
                    <th className="text-right py-3 px-3 text-gray-300 font-semibold">REB</th>
                    <th className="text-right py-3 px-3 text-gray-300 font-semibold">AST</th>
                    <th className="text-right py-3 px-3 text-gray-300 font-semibold">STL</th>
                    <th className="text-right py-3 px-3 text-gray-300 font-semibold">BLK</th>
                    <th className="text-right py-3 px-3 text-gray-300 font-semibold">FG%</th>
                    <th className="text-right py-3 px-3 text-gray-300 font-semibold">3P%</th>
                    <th className="text-right py-3 px-3 text-gray-300 font-semibold">FT%</th>
                  </tr>
                </thead>
                <tbody>
                  {[...roster].sort((a: unknown, b: unknown) => {
                    const aNum = parseInt(String((a as Record<string, unknown>).jersey_number || '999'), 10);
                    const bNum = parseInt(String((b as Record<string, unknown>).jersey_number || '999'), 10);
                    return aNum - bNum;
                  }).map((player: unknown, idx: number) => {
                    const p = player as RosterPlayer & Record<string, unknown>;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const stats = p as any;
                    return (
                      <tr key={p.id || idx} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid var(--psp-gray-100, #f3f4f6)" }}>
                        <td className="py-3 px-4 text-xs font-bold text-gray-400">{p.jersey_number ?? '—'}</td>
                        <td className="py-3 px-4 font-medium" style={{ color: "var(--psp-navy)" }}>
                          {p.players ? (
                            <Link href={`/${sport}/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                              {p.players.name}
                            </Link>
                          ) : "Unknown"}
                        </td>
                        <td className="py-3 px-3 text-center" style={{ color: "var(--psp-navy)" }}>{String(stats.games_played ?? "—")}</td>
                      <td className="py-3 px-3 text-right font-bold" style={{ color: "var(--psp-navy)" }}>{String(stats.points ?? "—")}</td>
                      <td className="py-3 px-3 text-right font-medium" style={{ color: "var(--psp-gold)" }}>{stats.ppg ? Number(stats.ppg).toFixed(1) : "—"}</td>
                      <td className="py-3 px-3 text-right" style={{ color: ((stats.rebounds ?? 0) as number) > 0 ? "var(--psp-navy)" : "#ccc" }}>{String(stats.rebounds ?? "—")}</td>
                      <td className="py-3 px-3 text-right" style={{ color: ((stats.assists ?? 0) as number) > 0 ? "var(--psp-navy)" : "#ccc" }}>{String(stats.assists ?? "—")}</td>
                      <td className="py-3 px-3 text-right" style={{ color: ((stats.steals ?? 0) as number) > 0 ? "var(--psp-navy)" : "#ccc" }}>{String(stats.steals ?? "—")}</td>
                      <td className="py-3 px-3 text-right" style={{ color: ((stats.blocks ?? 0) as number) > 0 ? "var(--psp-navy)" : "#ccc" }}>{String(stats.blocks ?? "—")}</td>
                      <td className="py-3 px-3 text-right text-sm" style={{ color: stats.fg_pct ? "var(--psp-navy)" : "#ccc" }}>{stats.fg_pct ? `${(Number(stats.fg_pct) * 100).toFixed(0)}%` : "—"}</td>
                      <td className="py-3 px-3 text-right text-sm" style={{ color: stats.three_pct ? "var(--psp-navy)" : "#ccc" }}>{stats.three_pct ? `${(Number(stats.three_pct) * 100).toFixed(0)}%` : "—"}</td>
                        <td className="py-3 px-3 text-right text-sm" style={{ color: stats.ft_pct ? "var(--psp-navy)" : "#ccc" }}>{stats.ft_pct ? `${(Number(stats.ft_pct) * 100).toFixed(0)}%` : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}

            {sport === "baseball" && (
              <>
                <thead>
                  <tr className="bg-[var(--psp-navy)]">
                    <th className="text-left py-3 px-4 text-white font-semibold">#</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Player</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Award</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((p: RosterPlayer, idx: number) => (
                    <tr key={p.id || idx} className="hover:bg-gray-50 transition-colors duration-200" style={{ borderBottom: "1px solid var(--psp-gray-100, #f3f4f6)" }}>
                      <td className="py-3 px-4 text-xs text-gray-300">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium" style={{ color: "var(--psp-navy)" }}>
                        {p.players ? (
                          <Link href={`/${sport}/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                            {p.players.name}
                          </Link>
                        ) : "Unknown"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">{String((p as unknown as Record<string, unknown>).honor_level || "—")}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {!["football", "basketball", "baseball"].includes(sport) && (
              <>
                <thead>
                  <tr className="bg-[var(--psp-navy)]">
                    <th className="text-left py-3 px-4 text-white font-semibold">#</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Player</th>
                  </tr>
                </thead>
                <tbody>
                  {[...roster].sort((a: RosterPlayer, b: RosterPlayer) => {
                    const aNum = parseInt(String(a.jersey_number || '999'), 10);
                    const bNum = parseInt(String(b.jersey_number || '999'), 10);
                    return aNum - bNum;
                  }).map((p: RosterPlayer, idx: number) => (
                    <tr key={p.id || idx} className="hover:bg-gray-50 transition-colors duration-200" style={{ borderBottom: "1px solid var(--psp-gray-100, #f3f4f6)" }}>
                      <td className="py-3 px-4 text-xs font-bold text-gray-400">{p.jersey_number ?? '—'}</td>
                      <td className="py-3 px-4 font-medium" style={{ color: "var(--psp-navy)" }}>
                        {p.players ? (
                          <Link href={`/${sport}/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                            {p.players.name}
                          </Link>
                        ) : "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-8 text-center">
        <div className="text-3xl mb-3">📋</div>
        <p className="text-gray-400 font-medium">No individual player stats available for this season</p>
        <p className="text-sm text-gray-300 mt-1">
          Player stats are available for seasons 2001-2019. Try selecting an earlier season above.
        </p>
      </div>
    )}
    </section>
  );
}
