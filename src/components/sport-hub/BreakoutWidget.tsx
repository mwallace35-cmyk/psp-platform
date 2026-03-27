import Link from "next/link";
import { getBreakoutPlayers } from "@/lib/data";

interface BreakoutWidgetProps {
  sport: string;
  title?: string;
}

export default async function BreakoutWidget({
  sport,
  title = "🔥 Breakout Alerts",
}: BreakoutWidgetProps) {
  const breakouts = await getBreakoutPlayers(sport, 3);

  if (!breakouts || breakouts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[var(--psp-gold)] bg-[var(--psp-navy-mid)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <Link
          href={`/${sport}/breakouts`}
          className="text-xs font-bold text-[var(--psp-blue)] hover:text-[var(--psp-gold)] transition"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-3">
        {breakouts.map((alert, idx) => (
          <Link
            key={idx}
            href={`/${sport}/players/${alert.player_slug}`}
            className="block rounded bg-gray-900 p-3 hover:bg-opacity-80 transition border border-gray-700 hover:border-[var(--psp-gold)]"
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <div className="font-bold text-[var(--psp-gold)]" style={{ display: "block" }}>
                  {alert.player_name}
                </div>
                <div className="text-xs text-gray-300" style={{ display: "block", marginTop: "2px" }}>
                  {alert.school_name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[var(--psp-gold)]">
                  +{alert.pct_increase}%
                </div>
              </div>
            </div>
            <div className="flex gap-2 text-xs text-gray-300">
              <span>
                {alert.previous_stat} → {alert.current_stat}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href={`/${sport}/breakouts`}
        className="mt-4 block w-full rounded bg-[var(--psp-blue)] py-2 text-center text-sm font-bold text-white hover:bg-opacity-90 transition"
      >
        See All Breakouts
      </Link>
    </div>
  );
}
