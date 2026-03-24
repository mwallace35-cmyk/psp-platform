import Link from "next/link";
import type { FootballPlayerSeason, BasketballPlayerSeason, BaseballPlayerSeason } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  ESPN-style season-by-season stat table                            */
/*  Dark navy header, alternating rows, gold best-season highlight    */
/* ------------------------------------------------------------------ */

interface PlayerStatTableProps {
  sport: "football" | "basketball" | "baseball";
  stats: (FootballPlayerSeason | BasketballPlayerSeason | BaseballPlayerSeason)[];
  sportColor: string;
}

/* ---------- helpers ---------- */

function fmt(v: number | null | undefined, decimals = 0): string {
  if (v == null || v === 0) return "\u2014";
  return decimals > 0 ? v.toFixed(decimals) : v.toLocaleString();
}

/** Find the season index with the highest value for a given key */
function bestSeasonIdx(stats: Record<string, unknown>[], key: string): number {
  let best = -1;
  let bestVal = -Infinity;
  stats.forEach((s, i) => {
    const v = (s as Record<string, number>)[key];
    if (v != null && v > bestVal) {
      bestVal = v;
      best = i;
    }
  });
  return best;
}

/* ---------- column defs ---------- */

interface Col<T> {
  key: string;
  label: string;
  getValue: (s: T) => string;
  getRaw: (s: T) => number;
  align?: "left" | "right";
  hide?: (stats: T[]) => boolean;
}

const FB_COLS: Col<FootballPlayerSeason>[] = [
  { key: "gp", label: "GP", getValue: (s) => fmt(s.games_played), getRaw: (s) => s.games_played || 0, hide: (a) => a.every((s) => !s.games_played) },
  { key: "car", label: "CAR", getValue: (s) => fmt(s.rush_carries), getRaw: (s) => s.rush_carries || 0, hide: (a) => a.every((s) => !s.rush_carries) },
  { key: "rush_yds", label: "RUSH YDS", getValue: (s) => fmt(s.rush_yards), getRaw: (s) => s.rush_yards || 0, hide: (a) => a.every((s) => !s.rush_yards) },
  { key: "rush_td", label: "RUSH TD", getValue: (s) => fmt(s.rush_td), getRaw: (s) => s.rush_td || 0 },
  { key: "ypc", label: "YPC", getValue: (s) => s.rush_carries && s.rush_carries > 0 ? (((s.rush_yards || 0) / s.rush_carries)).toFixed(1) : "\u2014", getRaw: (s) => s.rush_carries && s.rush_carries > 0 ? (s.rush_yards || 0) / s.rush_carries : 0, hide: (a) => a.every((s) => !s.rush_carries) },
  { key: "pass_yds", label: "PASS YDS", getValue: (s) => fmt(s.pass_yards), getRaw: (s) => s.pass_yards || 0, hide: (a) => a.every((s) => !s.pass_yards) },
  { key: "pass_td", label: "PASS TD", getValue: (s) => fmt(s.pass_td), getRaw: (s) => s.pass_td || 0, hide: (a) => a.every((s) => !s.pass_td) },
  { key: "rec_yds", label: "REC YDS", getValue: (s) => fmt(s.rec_yards), getRaw: (s) => s.rec_yards || 0, hide: (a) => a.every((s) => !s.rec_yards) },
  { key: "rec_td", label: "REC TD", getValue: (s) => fmt(s.rec_td), getRaw: (s) => s.rec_td || 0, hide: (a) => a.every((s) => !s.rec_td) },
  { key: "int", label: "INT", getValue: (s) => fmt(s.interceptions), getRaw: (s) => s.interceptions || 0, hide: (a) => a.every((s) => !s.interceptions) },
  { key: "total_td", label: "TOTAL TD", getValue: (s) => fmt(s.total_td), getRaw: (s) => s.total_td || 0 },
];

const BK_COLS: Col<BasketballPlayerSeason>[] = [
  { key: "gp", label: "GP", getValue: (s) => fmt(s.games_played), getRaw: (s) => s.games_played || 0 },
  { key: "pts", label: "PTS", getValue: (s) => fmt(s.points), getRaw: (s) => s.points || 0 },
  { key: "ppg", label: "PPG", getValue: (s) => fmt(s.ppg, 1), getRaw: (s) => s.ppg || 0 },
  { key: "reb", label: "REB", getValue: (s) => fmt(s.rebounds), getRaw: (s) => s.rebounds || 0, hide: (a) => a.every((s) => !s.rebounds) },
  { key: "ast", label: "AST", getValue: (s) => fmt(s.assists), getRaw: (s) => s.assists || 0, hide: (a) => a.every((s) => !s.assists) },
  { key: "stl", label: "STL", getValue: (s) => fmt(s.steals), getRaw: (s) => s.steals || 0, hide: (a) => a.every((s) => !s.steals) },
  { key: "blk", label: "BLK", getValue: (s) => fmt(s.blocks), getRaw: (s) => s.blocks || 0, hide: (a) => a.every((s) => !s.blocks) },
];

const BB_COLS: Col<BaseballPlayerSeason>[] = [
  { key: "avg", label: "AVG", getValue: (s) => s.batting_avg != null ? s.batting_avg.toFixed(3) : "\u2014", getRaw: (s) => s.batting_avg || 0 },
  { key: "hr", label: "HR", getValue: (s) => fmt(s.home_runs), getRaw: (s) => s.home_runs || 0 },
  { key: "era", label: "ERA", getValue: (s) => s.era != null ? s.era.toFixed(2) : "\u2014", getRaw: (s) => s.era || 0, hide: (a) => a.every((s) => !s.era) },
];

/* ---------- main column to highlight best season ---------- */
function primaryStatKey(sport: string): string {
  if (sport === "football") return "rush_yds";
  if (sport === "basketball") return "pts";
  return "avg";
}

/* ---------- component ---------- */

export default function PlayerStatTable({ sport, stats, sportColor }: PlayerStatTableProps) {
  if (stats.length === 0) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cols: Col<any>[] =
    sport === "football" ? FB_COLS : sport === "basketball" ? BK_COLS : BB_COLS;

  const visibleCols = cols.filter((c) => !c.hide || !c.hide(stats as never[]));

  // Find best season for gold highlight
  const bestIdx = stats.length > 1
    ? bestSeasonIdx(
        stats.map((s) => {
          const col = visibleCols.find((c) => c.key === primaryStatKey(sport));
          return { _val: col ? col.getRaw(s as never) : 0 };
        }),
        "_val"
      )
    : -1;

  // Career totals row
  const totals: Record<string, number> = {};
  visibleCols.forEach((c) => {
    if (c.key === "ypc" || c.key === "ppg" || c.key === "avg" || c.key === "era") return;
    totals[c.key] = stats.reduce((sum, s) => sum + c.getRaw(s as never), 0);
  });

  // Compute career YPC / PPG / AVG for totals
  if (sport === "football" && totals["car"] > 0) {
    totals["ypc"] = totals["rush_yds"] / totals["car"];
  }
  if (sport === "basketball" && totals["gp"] > 0) {
    totals["ppg"] = totals["pts"] / totals["gp"];
  }

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm" aria-label="Season-by-season statistics">
          <thead>
            <tr style={{ background: "var(--psp-navy)" }}>
              <th
                className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-300 font-bebas tracking-[0.08em]"
              >
                Season
              </th>
              <th
                className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-300 font-bebas tracking-[0.08em]"
              >
                School
              </th>
              {visibleCols.map((col) => (
                <th
                  key={col.key}
                  className="text-right px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-300 font-bebas tracking-[0.08em]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => {
              const season = (s as { seasons?: { label?: string } }).seasons;
              const school = (s as { schools?: { name?: string; slug?: string } }).schools;
              const isBest = i === bestIdx;
              return (
                <tr
                  key={(s as { id: number }).id}
                  className="border-t border-gray-100 transition-colors hover:bg-gray-50"
                  style={{
                    background: isBest
                      ? "rgba(240, 165, 0, 0.08)"
                      : i % 2 === 0
                      ? "#fff"
                      : "#fafafa",
                  }}
                >
                  <td className="px-4 py-2.5 font-semibold whitespace-nowrap" style={{ color: "var(--psp-navy)" }}>
                    {isBest && (
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                        style={{ background: "var(--psp-gold)", verticalAlign: "middle" }}
                        title="Best season"
                      />
                    )}
                    {season?.label || "\u2014"}
                  </td>
                  <td className="px-3 py-2.5 text-xs">
                    {school?.slug ? (
                      <Link
                        href={`/${sport}/schools/${school.slug}`}
                        className="hover:underline font-medium"
                        style={{ color: sportColor }}
                      >
                        {school.name}
                      </Link>
                    ) : (
                      <span className="text-gray-400">\u2014</span>
                    )}
                  </td>
                  {visibleCols.map((col) => (
                    <td
                      key={col.key}
                      className="text-right px-3 py-2.5 tabular-nums"
                      style={{
                        fontWeight: col.key === "total_td" || col.key === "pts" ? 700 : 400,
                        color: isBest && (col.key === primaryStatKey(sport) || col.key === "total_td")
                          ? "var(--psp-gold)"
                          : "var(--psp-navy)",
                      }}
                    >
                      {col.getValue(s as never)}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Career Totals */}
            {stats.length > 1 && (
              <tr
                className="border-t-2"
                style={{ background: "var(--psp-navy)", borderColor: sportColor }}
              >
                <td
                  colSpan={2}
                  className="px-4 py-3 font-bold text-sm uppercase tracking-wider text-white font-bebas tracking-[0.08em]"
                >
                  Career Totals
                </td>
                {visibleCols.map((col) => {
                  const val = totals[col.key];
                  let display = "\u2014";
                  if (val != null && val > 0) {
                    if (col.key === "ypc" || col.key === "ppg") display = val.toFixed(1);
                    else if (col.key === "avg") display = val.toFixed(3);
                    else if (col.key === "era") display = val.toFixed(2);
                    else display = val.toLocaleString();
                  }
                  return (
                    <td
                      key={col.key}
                      className="text-right px-3 py-3 font-bold tabular-nums"
                      style={{ color: "var(--psp-gold)" }}
                    >
                      {display}
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {stats.map((s, i) => {
          const season = (s as { seasons?: { label?: string } }).seasons;
          const school = (s as { schools?: { name?: string; slug?: string } }).schools;
          const isBest = i === bestIdx;
          return (
            <div
              key={(s as { id: number }).id}
              className="rounded-lg border p-4"
              style={{
                background: isBest ? "rgba(240, 165, 0, 0.06)" : "#fff",
                borderColor: isBest ? "var(--psp-gold)" : "#e5e7eb",
                borderWidth: isBest ? "2px" : "1px",
              }}
            >
              <div className="flex justify-between items-baseline mb-3">
                <span className="font-bold text-sm font-bebas tracking-wider" style={{ color: "var(--psp-navy)" }}>
                  {isBest && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: "var(--psp-gold)", verticalAlign: "middle" }} />
                  )}
                  {season?.label || "\u2014"}
                </span>
                {school?.slug && (
                  <Link href={`/${sport}/schools/${school.slug}`} className="text-xs font-medium hover:underline" style={{ color: sportColor }}>
                    {school.name}
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {visibleCols.slice(0, 6).map((col) => (
                  <div key={col.key}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{col.label}</div>
                    <div
                      className="font-bold text-sm tabular-nums"
                      style={{
                        color: isBest && col.key === primaryStatKey(sport) ? "var(--psp-gold)" : "var(--psp-navy)",
                      }}
                    >
                      {col.getValue(s as never)}
                    </div>
                  </div>
                ))}
              </div>
              {visibleCols.length > 6 && (
                <div className="grid grid-cols-3 gap-2 text-center mt-2 pt-2 border-t border-gray-100">
                  {visibleCols.slice(6).map((col) => (
                    <div key={col.key}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{col.label}</div>
                      <div className="font-bold text-sm tabular-nums" style={{ color: "var(--psp-navy)" }}>
                        {col.getValue(s as never)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Mobile career totals */}
        {stats.length > 1 && (
          <div className="rounded-lg p-4" style={{ background: "var(--psp-navy)" }}>
            <div className="font-bold text-sm uppercase tracking-wider text-white mb-3 font-bebas">
              Career Totals
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {visibleCols.slice(0, 6).map((col) => {
                const val = totals[col.key];
                let display = "\u2014";
                if (val != null && val > 0) {
                  if (col.key === "ypc" || col.key === "ppg") display = val.toFixed(1);
                  else if (col.key === "avg") display = val.toFixed(3);
                  else display = val.toLocaleString();
                }
                return (
                  <div key={col.key}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{col.label}</div>
                    <div className="font-bold text-sm tabular-nums" style={{ color: "var(--psp-gold)" }}>{display}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
