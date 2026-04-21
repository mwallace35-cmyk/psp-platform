import { getPlayerRecruitingCommits } from "@/lib/data/dispatches";

interface Props {
  playerId: number;
}

/**
 * "Committed" badge — shows if Ted tracked a college commit for this player.
 * Pulls from the recruiting_commits table (extracted from Ted's homepage alerts).
 */
export default async function RecruitingCommitBadge({ playerId }: Props) {
  const commits = await getPlayerRecruitingCommits(playerId);
  if (!commits || commits.length === 0) return null;

  // Use the highest-confidence + dated commit as the featured one
  const featured = commits[0];

  return (
    <div className="mt-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
        College Commitment
      </h3>
      <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/60 border border-emerald-500/40 rounded-lg px-4 py-3">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400">
            Committed
          </span>
          {featured.commit_date && (
            <span className="text-[10px] text-gray-400">
              {new Date(featured.commit_date + "T12:00:00").toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </span>
          )}
        </div>
        <div className="font-heading text-xl text-white leading-tight">
          {featured.destination_college}
        </div>
        <div className="text-xs text-gray-300 mt-1">
          {featured.sport && <span>{featured.sport}</span>}
          {featured.position && <span> · {featured.position}</span>}
          {featured.class_year && <span> · {featured.class_year}</span>}
        </div>
        {featured.snippet && (
          <p className="text-xs text-gray-400 mt-2 italic line-clamp-2">
            &ldquo;{featured.snippet.replace(/\s+/g, " ").trim()}&rdquo;
          </p>
        )}
        <p className="text-[10px] text-gray-500 mt-2">Source: Ted Silary archive</p>
      </div>

      {commits.length > 1 && (
        <div className="mt-2 text-[11px] text-gray-500">
          +{commits.length - 1} more commit reference{commits.length - 1 === 1 ? "" : "s"} on file.
        </div>
      )}
    </div>
  );
}
