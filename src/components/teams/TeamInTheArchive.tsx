import Link from "next/link";
import { getSchoolMentionStories } from "@/lib/data/stories";

interface Props {
  schoolId: number;
  schoolName: string;
  limit?: number;
}

/**
 * "In the Archive" — surfaces Ted Silary archive stories that mention a school,
 * deduped by story and grouped by year.
 *
 * Renders nothing if the school has no mentions.
 */
export default async function TeamInTheArchive({ schoolId, schoolName, limit = 12 }: Props) {
  const mentions = await getSchoolMentionStories(schoolId, limit);
  if (!mentions || mentions.length === 0) return null;

  // Group by year
  const byYear = new Map<number, typeof mentions>();
  for (const m of mentions) {
    const list = byYear.get(m.year);
    if (list) list.push(m);
    else byYear.set(m.year, [m]);
  }
  const years = Array.from(byYear.keys()).sort((a, b) => b - a);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 border-t border-gray-200">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="psp-h3" style={{ color: "var(--psp-navy)" }}>
          {schoolName} in the Ted Silary Archive
        </h2>
        <Link
          href={`/stories?byline=&category=`}
          className="text-sm font-medium hover:underline"
          style={{ color: "var(--psp-navy)" }}
        >
          Browse all stories →
        </Link>
      </div>

      <div className="space-y-6">
        {years.map((yr) => (
          <div key={yr}>
            <h3 className="font-heading text-lg mb-2" style={{ color: "var(--psp-navy)" }}>
              {yr}
              <span className="text-gray-400 text-sm font-normal ml-2">
                {byYear.get(yr)!.length} {byYear.get(yr)!.length === 1 ? "story" : "stories"}
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {byYear.get(yr)!.map((m) => (
                <Link
                  key={m.story_id}
                  href={`/stories/${m.year}/${m.slug}`}
                  className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-[var(--psp-gold)] hover:shadow-sm transition"
                >
                  <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--psp-gold)" }}>
                    {m.byline ?? "Archive"}
                    {m.column_name && m.column_name !== m.title && (
                      <span className="text-gray-400 font-normal normal-case tracking-normal"> · {m.column_name}</span>
                    )}
                  </div>
                  <div className="font-heading text-base leading-tight" style={{ color: "var(--psp-navy)" }}>
                    {m.title}
                  </div>
                  {m.snippet && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 italic">
                      &ldquo;{m.snippet.replace(/\s+/g, " ").trim()}&rdquo;
                    </p>
                  )}
                  <div className="text-[11px] text-gray-400 mt-2">
                    {m.mention_date
                      ? new Date(m.mention_date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                      : `${m.year} season`}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
