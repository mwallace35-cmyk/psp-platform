import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArchiveStoryBySlug, getStoryMentions } from "@/lib/data/stories";
import { Breadcrumb } from "@/components/ui";

export const revalidate = 3600; // 1h ISR

type PageParams = { year: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { year, slug } = await params;
  const yr = Number(year);
  if (!Number.isFinite(yr)) return { title: "Story Not Found" };
  const story = await getArchiveStoryBySlug(yr, slug);
  if (!story) return { title: "Story Not Found" };
  const byline = story.byline ?? "Ted Silary Archive";
  const desc = story.body_text.slice(0, 220).replace(/\s+/g, " ").trim() + "…";
  return {
    title: `${story.title} — ${byline} (${story.year}) | PhillySportsPack`,
    description: desc,
    alternates: { canonical: `https://phillysportspack.com/stories/${story.year}/${story.slug}` },
    openGraph: {
      title: story.title,
      description: desc,
      type: "article",
    },
  };
}


function formatDate(s: string | null): string {
  if (!s) return "";
  try {
    const d = new Date(s + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  } catch { return s; }
}


export default async function StoryPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { year, slug } = await params;
  const yr = Number(year);
  if (!Number.isFinite(yr)) notFound();

  const story = await getArchiveStoryBySlug(yr, slug);
  if (!story) notFound();

  const mentions = await getStoryMentions(story.id);

  // Dedupe mentions by entity for the sidebar (one row per unique entity)
  const playerMentions = new Map<number, { name: string; slug: string; count: number }>();
  const schoolMentions = new Map<number, { name: string; slug: string; count: number }>();
  const coachMentions  = new Map<number, { name: string; slug: string; count: number }>();
  for (const m of mentions) {
    if (m.entity_type === "player" && m.player_name) {
      const ex = playerMentions.get(m.entity_id);
      if (ex) ex.count += 1;
      else playerMentions.set(m.entity_id, { name: m.player_name, slug: m.player_slug ?? "", count: 1 });
    } else if (m.entity_type === "school" && m.school_name) {
      const ex = schoolMentions.get(m.entity_id);
      if (ex) ex.count += 1;
      else schoolMentions.set(m.entity_id, { name: m.school_name, slug: m.school_slug ?? "", count: 1 });
    } else if (m.entity_type === "coach" && m.coach_name) {
      const ex = coachMentions.get(m.entity_id);
      if (ex) ex.count += 1;
      else coachMentions.set(m.entity_id, { name: m.coach_name, slug: m.coach_slug ?? "", count: 1 });
    }
  }
  const sortedPlayers = Array.from(playerMentions.values()).sort((a, b) => b.count - a.count);
  const sortedSchools = Array.from(schoolMentions.values()).sort((a, b) => b.count - a.count);
  const sortedCoaches = Array.from(coachMentions.values()).sort((a, b) => b.count - a.count);

  return (
    <main className="min-h-screen bg-[var(--psp-navy)] text-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <Breadcrumb
          items={[
            { label: "Stories", href: "/stories" },
            { label: String(story.year), href: `/stories?year=${story.year}` },
            { label: story.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-6">
          {/* Main column — title + body */}
          <article>
            <header className="mb-6 pb-6 border-b border-gray-700/50">
              <h1 className="font-heading text-3xl md:text-5xl text-[var(--psp-gold)] leading-tight">
                {story.title}
              </h1>
              <div className="mt-3 text-sm md:text-base text-gray-300">
                {story.byline && (
                  <span className="font-semibold">By {story.byline}</span>
                )}
                {story.column_name && story.column_name !== story.title && (
                  <> · <span className="italic">{story.column_name}</span></>
                )}
                {story.published_at && (
                  <> · <span>{formatDate(story.published_at)}</span></>
                )}
                {!story.published_at && (
                  <> · <span>{story.year} {story.sport_id} season</span></>
                )}
              </div>
              {story.word_count && (
                <div className="mt-2 text-xs text-gray-500">
                  {story.word_count.toLocaleString()} words
                </div>
              )}
            </header>

            {/* Body — full HTML from the archive. Ted has granted permission to host. */}
            <div
              className="ted-archive-body prose prose-invert max-w-none
                prose-p:text-gray-200 prose-p:leading-relaxed
                prose-strong:text-white
                prose-a:text-[var(--psp-gold)] prose-a:no-underline hover:prose-a:underline
                prose-h1:font-heading prose-h1:text-white
                prose-h2:font-heading prose-h2:text-white prose-h2:border-b prose-h2:border-gray-700/50 prose-h2:pb-2
                prose-h3:font-heading prose-h3:text-white
                prose-blockquote:border-l-[var(--psp-gold)] prose-blockquote:text-gray-300
                prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: story.body_html }}
            />

            <footer className="mt-10 pt-6 border-t border-gray-700/50 text-sm text-gray-400">
              {story.original_url && (
                <p>
                  Original URL:{" "}
                  <a
                    href={`https://tedsilary.com/archive/${story.archive_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--psp-gold)] hover:underline break-all"
                  >
                    tedsilary.com/archive/{story.archive_path}
                  </a>
                </p>
              )}
              <p className="mt-2 text-xs">
                Preserved in the PSP archive with Ted Silary&apos;s permission.
              </p>
            </footer>
          </article>

          {/* Sidebar — mentions */}
          <aside className="space-y-6">
            {(sortedPlayers.length + sortedSchools.length + sortedCoaches.length) > 0 && (
              <div className="bg-[var(--psp-navy-mid)] rounded-lg p-4 border border-gray-700/50">
                <h2 className="font-heading text-xl text-[var(--psp-gold)] mb-3">
                  In this story
                </h2>

                {sortedPlayers.length > 0 && (
                  <section className="mb-4">
                    <h3 className="font-heading text-sm uppercase tracking-wider text-gray-400 mb-2">
                      Players · {sortedPlayers.length}
                    </h3>
                    <ul className="space-y-1.5 text-sm">
                      {sortedPlayers.map((p) => (
                        <li key={p.slug} className="flex justify-between items-baseline gap-2">
                          <Link
                            href={`/players/${p.slug}`}
                            className="text-gray-200 hover:text-[var(--psp-gold)] truncate"
                          >
                            {p.name}
                          </Link>
                          {p.count > 1 && (
                            <span className="text-xs text-gray-500">×{p.count}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {sortedSchools.length > 0 && (
                  <section className="mb-4">
                    <h3 className="font-heading text-sm uppercase tracking-wider text-gray-400 mb-2">
                      Schools · {sortedSchools.length}
                    </h3>
                    <ul className="space-y-1.5 text-sm">
                      {sortedSchools.map((s) => (
                        <li key={s.slug || s.name} className="flex justify-between items-baseline gap-2">
                          <Link
                            href={`/schools/${s.slug}`}
                            className="text-gray-200 hover:text-[var(--psp-gold)] truncate"
                          >
                            {s.name}
                          </Link>
                          {s.count > 1 && (
                            <span className="text-xs text-gray-500">×{s.count}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {sortedCoaches.length > 0 && (
                  <section>
                    <h3 className="font-heading text-sm uppercase tracking-wider text-gray-400 mb-2">
                      Coaches · {sortedCoaches.length}
                    </h3>
                    <ul className="space-y-1.5 text-sm">
                      {sortedCoaches.map((c) => (
                        <li key={c.slug || c.name}>
                          <Link
                            href={`/coaches/${c.slug}`}
                            className="text-gray-200 hover:text-[var(--psp-gold)]"
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            <div className="bg-[var(--psp-navy-mid)] rounded-lg p-4 border border-gray-700/50 text-xs text-gray-400">
              <div className="font-heading text-sm text-white mb-1">Archive provenance</div>
              <div>Sport: <span className="text-gray-200">{story.sport_id}</span></div>
              <div>Season: <span className="text-gray-200">{story.year}</span></div>
              {story.category && (
                <div>Type: <span className="text-gray-200">{story.category.replace("_", " ")}</span></div>
              )}
              <div className="mt-2 opacity-60 break-all">
                SHA-256: {story.archive_sha256.slice(0, 16)}…
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
