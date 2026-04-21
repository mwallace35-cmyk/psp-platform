import Link from "next/link";
import { getPlayerDispatches } from "@/lib/data/dispatches";

interface Props {
  playerId: number;
  limit?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  commit: "Commit",
  memoriam: "In memoriam",
  record: "Record",
  tedbit: "Tedbit",
  scrimmage: "Scrimmage",
  coaching: "Coaching",
  tournament: "Tournament",
  game_report: "Game report",
  other: "Alert",
};

const CATEGORY_COLORS: Record<string, string> = {
  commit: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  memoriam: "text-slate-300 bg-slate-500/10 border-slate-500/30",
  record: "text-[var(--psp-gold)] bg-[var(--psp-gold)]/10 border-[var(--psp-gold)]/30",
  tedbit: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  scrimmage: "text-sky-300 bg-sky-500/10 border-sky-500/30",
  coaching: "text-purple-300 bg-purple-500/10 border-purple-500/30",
  tournament: "text-rose-300 bg-rose-500/10 border-rose-500/30",
  game_report: "text-blue-300 bg-blue-500/10 border-blue-500/30",
  other: "text-gray-400 bg-gray-500/10 border-gray-500/30",
};

/**
 * "Ted's dispatches" — surfaces archive dispatches (homepage alerts) that
 * mention this player. Renders nothing if no mentions.
 */
export default async function PlayerDispatches({ playerId, limit = 6 }: Props) {
  const dispatches = await getPlayerDispatches(playerId, limit);
  if (!dispatches || dispatches.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Ted&apos;s Dispatches
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-gray-500">
          Homepage archive
        </span>
      </div>
      <div className="space-y-2">
        {dispatches.map((d) => {
          const cat = d.category ?? "other";
          const chip = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other;
          const href = d.story_slug
            ? `/stories/${d.story_year}/${d.story_slug}#d-${d.dispatch_id}`
            : `/dispatches#d-${d.dispatch_id}`;
          return (
            <Link
              key={d.dispatch_id}
              href={href}
              className="block bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-4 py-3 hover:border-[var(--psp-gold)]/40 transition group"
            >
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${chip}`}>
                  {CATEGORY_LABELS[cat] ?? cat}
                </span>
                <span className="text-[10px] text-gray-500">
                  {d.dispatch_date
                    ? new Date(d.dispatch_date + "T12:00:00").toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })
                    : "undated"}
                </span>
              </div>
              {d.title && (
                <p className="text-sm text-gray-200 font-medium group-hover:text-[var(--psp-gold)] transition line-clamp-2">
                  {d.title}
                </p>
              )}
              {d.body_preview && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 italic">
                  &ldquo;{d.body_preview}&rdquo;
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
