"use client";

interface TeamSeason {
  wins?: number;
  losses?: number;
  ties?: number;
  points_for?: number;
  points_against?: number;
  seasons?: { label: string };
}

interface OffenseDefenseSummaryProps {
  teamSeasons: TeamSeason[];
  sportColor: string;
  sport: string;
}

export default function OffenseDefenseSummary({
  teamSeasons,
  sportColor,
  sport,
}: OffenseDefenseSummaryProps) {
  // Only include seasons with scoring data
  const withScoring = teamSeasons.filter(
    (ts) => (ts.points_for ?? 0) > 0 || (ts.points_against ?? 0) > 0
  );

  if (withScoring.length === 0) return null;

  const totalPF = withScoring.reduce((sum, ts) => sum + (ts.points_for ?? 0), 0);
  const totalPA = withScoring.reduce((sum, ts) => sum + (ts.points_against ?? 0), 0);
  const totalGames = withScoring.reduce(
    (sum, ts) => sum + (ts.wins ?? 0) + (ts.losses ?? 0) + (ts.ties ?? 0),
    0
  );
  const diff = totalPF - totalPA;

  const ppg = totalGames > 0 ? (totalPF / totalGames).toFixed(1) : "—";
  const oppPpg = totalGames > 0 ? (totalPA / totalGames).toFixed(1) : "—";
  const diffPpg = totalGames > 0 ? (diff / totalGames).toFixed(1) : "—";

  // Recent 5 seasons for mini-trend
  const recent = [...withScoring]
    .sort((a, b) => {
      const aY = parseInt(a.seasons?.label?.substring(0, 4) || "0");
      const bY = parseInt(b.seasons?.label?.substring(0, 4) || "0");
      return bY - aY;
    })
    .slice(0, 5);

  // Determine scoring label based on sport
  const label = sport === "basketball" ? "Points" : "Points";

  // Find best/worst offensive and defensive seasons
  const bestOffense = withScoring.reduce((best, ts) => {
    const games = (ts.wins ?? 0) + (ts.losses ?? 0) + (ts.ties ?? 0);
    const avg = games > 0 ? (ts.points_for ?? 0) / games : 0;
    const bestGames = (best.wins ?? 0) + (best.losses ?? 0) + (best.ties ?? 0);
    const bestAvg = bestGames > 0 ? (best.points_for ?? 0) / bestGames : 0;
    return avg > bestAvg ? ts : best;
  });
  const bestDefense = withScoring.reduce((best, ts) => {
    const games = (ts.wins ?? 0) + (ts.losses ?? 0) + (ts.ties ?? 0);
    const avg = games > 0 ? (ts.points_against ?? 0) / games : Infinity;
    const bestGames = (best.wins ?? 0) + (best.losses ?? 0) + (best.ties ?? 0);
    const bestAvg = bestGames > 0 ? (best.points_against ?? 0) / bestGames : Infinity;
    return avg < bestAvg ? ts : best;
  });

  const bestOffGames = (bestOffense.wins ?? 0) + (bestOffense.losses ?? 0) + (bestOffense.ties ?? 0);
  const bestDefGames = (bestDefense.wins ?? 0) + (bestDefense.losses ?? 0) + (bestDefense.ties ?? 0);

  // Bar width calculation (relative to max of PF or PA)
  const maxTotal = Math.max(totalPF, totalPA, 1);

  return (
    <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
      {/* Side by side big numbers */}
      <div className="grid grid-cols-2 divide-x divide-[var(--psp-gray-200)]">
        {/* Offense */}
        <div className="p-5">
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#16a34a" }}>
            Offense
          </div>
          <div className="font-bebas text-3xl md:text-4xl leading-none" style={{ color: "var(--psp-navy)" }}>
            {totalPF.toLocaleString()}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--psp-gray-500)" }}>
            Total {label} Scored
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-bebas text-2xl" style={{ color: "#16a34a" }}>
              {ppg}
            </span>
            <span className="text-xs" style={{ color: "var(--psp-gray-400)" }}>
              PPG avg
            </span>
          </div>
        </div>

        {/* Defense */}
        <div className="p-5">
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#ef4444" }}>
            Defense
          </div>
          <div className="font-bebas text-3xl md:text-4xl leading-none" style={{ color: "var(--psp-navy)" }}>
            {totalPA.toLocaleString()}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--psp-gray-500)" }}>
            Total {label} Allowed
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-bebas text-2xl" style={{ color: "#ef4444" }}>
              {oppPpg}
            </span>
            <span className="text-xs" style={{ color: "var(--psp-gray-400)" }}>
              PPG avg
            </span>
          </div>
        </div>
      </div>

      {/* Point differential bar */}
      <div className="px-5 py-4 border-t border-[var(--psp-gray-200)]" style={{ background: "var(--psp-gray-50, #f9fafb)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: "var(--psp-gray-500)" }}>
            Point Differential
          </span>
          <span
            className="font-bebas text-xl"
            style={{ color: diff >= 0 ? "#16a34a" : "#ef4444" }}
          >
            {diff >= 0 ? "+" : ""}{diff.toLocaleString()} ({diff >= 0 ? "+" : ""}{diffPpg}/g)
          </span>
        </div>
        {/* Visual bar */}
        <div className="flex h-3 rounded-full overflow-hidden" style={{ background: "var(--psp-gray-200)" }}>
          <div
            className="h-full rounded-l-full transition-all"
            style={{
              width: `${(totalPF / maxTotal) * 50}%`,
              background: "#16a34a",
            }}
          />
          <div
            className="h-full rounded-r-full transition-all ml-auto"
            style={{
              width: `${(totalPA / maxTotal) * 50}%`,
              background: "#ef4444",
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--psp-gray-400)" }}>
          <span>{label} Scored</span>
          <span>{label} Allowed</span>
        </div>
      </div>

      {/* Recent seasons mini-table */}
      {recent.length > 1 && (
        <div className="px-5 py-4 border-t border-[var(--psp-gray-200)]">
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--psp-gray-400)" }}>
            Recent Seasons
          </div>
          <div className="space-y-2">
            {recent.map((ts, i) => {
              const games = (ts.wins ?? 0) + (ts.losses ?? 0) + (ts.ties ?? 0);
              const pf = ts.points_for ?? 0;
              const pa = ts.points_against ?? 0;
              const seasonPpg = games > 0 ? (pf / games).toFixed(1) : "—";
              const seasonOppPpg = games > 0 ? (pa / games).toFixed(1) : "—";
              const seasonDiff = pf - pa;
              const barMax = Math.max(pf, pa, 1);
              return (
                <div key={ts.seasons?.label || i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium" style={{ color: "var(--psp-navy)" }}>
                      {ts.seasons?.label || "—"}
                    </span>
                    <span style={{ color: seasonDiff >= 0 ? "#16a34a" : "#ef4444" }}>
                      {seasonPpg} / {seasonOppPpg} PPG
                      <span className="ml-1.5 font-semibold">
                        ({seasonDiff >= 0 ? "+" : ""}{seasonDiff})
                      </span>
                    </span>
                  </div>
                  <div className="flex h-1.5 rounded-full overflow-hidden" style={{ background: "var(--psp-gray-100, #f3f4f6)" }}>
                    <div
                      className="h-full rounded-l-full"
                      style={{
                        width: `${(pf / barMax) * 50}%`,
                        background: "#16a34a",
                      }}
                    />
                    <div
                      className="h-full rounded-r-full ml-auto"
                      style={{
                        width: `${(pa / barMax) * 50}%`,
                        background: "#ef4444",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Best seasons callout */}
      <div className="grid grid-cols-2 divide-x divide-[var(--psp-gray-200)] border-t border-[var(--psp-gray-200)]">
        <div className="px-5 py-3">
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--psp-gray-400)" }}>
            Best Offense
          </div>
          <div className="text-sm font-semibold" style={{ color: "var(--psp-navy)" }}>
            {bestOffense.seasons?.label || "—"}
          </div>
          <div className="text-xs" style={{ color: "#16a34a" }}>
            {bestOffGames > 0
              ? `${((bestOffense.points_for ?? 0) / bestOffGames).toFixed(1)} PPG`
              : "—"}{" "}
            <span style={{ color: "var(--psp-gray-400)" }}>
              ({bestOffense.points_for?.toLocaleString()} pts)
            </span>
          </div>
        </div>
        <div className="px-5 py-3">
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--psp-gray-400)" }}>
            Best Defense
          </div>
          <div className="text-sm font-semibold" style={{ color: "var(--psp-navy)" }}>
            {bestDefense.seasons?.label || "—"}
          </div>
          <div className="text-xs" style={{ color: "#ef4444" }}>
            {bestDefGames > 0
              ? `${((bestDefense.points_against ?? 0) / bestDefGames).toFixed(1)} PPG allowed`
              : "—"}{" "}
            <span style={{ color: "var(--psp-gray-400)" }}>
              ({bestDefense.points_against?.toLocaleString()} pts)
            </span>
          </div>
        </div>
      </div>

      {/* Footer context */}
      <div className="px-5 py-2.5 text-[10px] border-t border-[var(--psp-gray-200)]" style={{ color: "var(--psp-gray-400)", background: "var(--psp-gray-50, #f9fafb)" }}>
        Based on {withScoring.length} season{withScoring.length !== 1 ? "s" : ""} with scoring data ({totalGames.toLocaleString()} games)
      </div>
    </div>
  );
}
