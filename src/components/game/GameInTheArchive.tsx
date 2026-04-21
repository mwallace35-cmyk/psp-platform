import Link from "next/link";
import { getGameStories } from "@/lib/data/stories";

interface Props {
  homeSchoolId: number;
  awaySchoolId: number;
  gameDate: string | null;
  seasonYear: number;
}

/**
 * "Ted's write-up" — finds the Ted Silary archive story(ies) most likely
 * covering this specific game, based on:
 *  - both schools mentioned in the same story
 *  - mention/publish date within ~7 days of game_date
 *  - high confidence on both sides
 *
 * Renders nothing if no match. Shows top candidate as a featured panel,
 * with any additional matches as compact links underneath.
 */
export default async function GameInTheArchive({
  homeSchoolId,
  awaySchoolId,
  gameDate,
  seasonYear,
}: Props) {
  const stories = await getGameStories(homeSchoolId, awaySchoolId, gameDate, seasonYear, 3);
  if (!stories || stories.length === 0) return null;

  const [featured, ...rest] = stories;

  // Only show the featured panel if we have a reasonable match
  //   — high score means close date + high confidence on both sides
  const hasStrongFeatured = featured.score >= 80;

  return (
    <section className="mt-8 bg-[var(--psp-navy-mid)] border border-[var(--psp-gold)]/40 rounded-xl p-5 md:p-6">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-heading text-xl md:text-2xl text-[var(--psp-gold)]">
          {hasStrongFeatured ? "Ted's Write-up" : "From the Archive"}
        </h2>
        <span className="text-[10px] uppercase tracking-wider text-gray-400">
          Ted Silary archive
        </span>
      </div>

      <Link
        href={`/stories/${featured.year}/${featured.slug}`}
        className="block group"
      >
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--psp-gold)] mb-1">
          {featured.byline ?? "Archive"}
          {featured.column_name && featured.column_name !== featured.title && (
            <span className="text-gray-400 font-normal normal-case tracking-normal"> · {featured.column_name}</span>
          )}
        </div>
        <div className="font-heading text-lg md:text-xl text-white leading-tight group-hover:text-[var(--psp-gold)] transition">
          {featured.title}
        </div>
        {featured.snippet && (
          <p className="text-sm text-gray-300 mt-2 italic line-clamp-3">
            &ldquo;{featured.snippet.replace(/\s+/g, " ").trim()}&rdquo;
          </p>
        )}
        <div className="text-xs text-gray-500 mt-2">
          {featured.published_at
            ? new Date(featured.published_at + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : `${featured.year} season`}
          {featured.days_off !== null && featured.days_off <= 3 && (
            <span className="ml-2 text-[var(--psp-gold)]">· same week as this game</span>
          )}
        </div>
      </Link>

      {rest.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
            Also in the archive
          </div>
          <ul className="space-y-1.5 text-sm">
            {rest.map((s) => (
              <li key={s.story_id}>
                <Link
                  href={`/stories/${s.year}/${s.slug}`}
                  className="text-gray-300 hover:text-[var(--psp-gold)] transition"
                >
                  {s.title}
                  <span className="text-gray-500 text-xs ml-2">
                    {s.byline ? `· ${s.byline}` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
