import Link from "next/link";
import type { StatLeaderEntry } from "@/lib/data/school-hub";

interface StatLeadersCardProps {
  title: string;
  leaders: StatLeaderEntry[];
  sport: string;
}

export default function StatLeadersCard({ title, leaders, sport }: StatLeadersCardProps) {
  if (!leaders || leaders.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-gray-50 border-b border-[var(--psp-gray-200)]">
        <h4
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--psp-navy)" }}
        >
          {title}
        </h4>
      </div>

      {/* Leaders list */}
      <div className="divide-y divide-gray-50">
        {leaders.slice(0, 5).map((leader, idx) => {
          const rank = idx + 1;
          const isTopThree = rank <= 3;

          return (
            <div
              key={`${leader.player_slug || leader.player_name}-${idx}`}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              {/* Rank */}
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: isTopThree
                    ? "rgba(240, 165, 0, 0.12)"
                    : "var(--psp-gray-100, #f3f4f6)",
                  color: isTopThree
                    ? "var(--psp-gold)"
                    : "var(--psp-gray-400, #9ca3af)",
                }}
              >
                {rank}
              </span>

              {/* Player name */}
              <div className="flex-1 min-w-0">
                {leader.player_slug ? (
                  <Link
                    href={`/${sport}/players/${leader.player_slug}`}
                    className="text-sm font-medium hover:underline truncate block"
                    style={{ color: "var(--psp-blue)" }}
                  >
                    {leader.player_name}
                  </Link>
                ) : (
                  <span className="text-sm font-medium truncate block">
                    {leader.player_name}
                  </span>
                )}
              </div>

              {/* Stat value */}
              <span
                className="text-sm font-bold tabular-nums flex-shrink-0"
                style={{ color: "var(--psp-navy)" }}
              >
                {typeof leader.value === "number"
                  ? leader.value % 1 !== 0
                    ? leader.value.toFixed(3).replace(/^0/, "")
                    : leader.value.toLocaleString()
                  : leader.value}
              </span>

              {/* Games played */}
              {leader.games_played !== null && leader.games_played !== undefined && (
                <span className="text-xs text-gray-300 flex-shrink-0">
                  {leader.games_played}G
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
