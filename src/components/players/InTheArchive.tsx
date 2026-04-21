import Link from "next/link";
import { getPlayerMentionStories } from "@/lib/data/stories";

interface Props {
  playerId: number;
  limit?: number;
}

/**
 * "In the Archive" — surfaces Ted Silary archive stories that mention a player,
 * ranked by mention confidence (then date).
 *
 * Renders nothing if the player has no mentions, so it's safe to drop into
 * every player profile.
 */
export default async function InTheArchive({ playerId, limit = 6 }: Props) {
  const mentions = await getPlayerMentionStories(playerId, limit);
  if (!mentions || mentions.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
          In the Archive
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-gray-500">
          Ted Silary archive
        </span>
      </div>
      <div className="space-y-2">
        {mentions.map((m) => (
          <Link
            key={`${m.story_id}-${m.mention_date ?? ""}`}
            href={`/stories/${m.year}/${m.slug}`}
            className="block bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-4 py-3 hover:border-[var(--psp-gold)]/40 transition group"
          >
            <div className="flex items-start gap-3">
              <span className="text-[10px] uppercase tracking-wider text-[var(--psp-gold)] font-semibold shrink-0 mt-0.5">
                {m.year}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-200 font-medium group-hover:text-[var(--psp-gold)] transition line-clamp-2">
                  {m.title}
                </p>
                {m.snippet && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 italic">
                    &ldquo;{m.snippet.replace(/\s+/g, " ").trim()}&rdquo;
                  </p>
                )}
                <p className="text-[11px] text-gray-500 mt-1">
                  {m.byline ? `By ${m.byline}` : "Archive"}
                  {m.column_name && m.column_name !== m.title && (
                    <> · <span className="italic">{m.column_name}</span></>
                  )}
                  {m.mention_date && (
                    <> · {new Date(m.mention_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
