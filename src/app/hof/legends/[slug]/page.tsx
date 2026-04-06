import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getLegendBySlug,
  getLegendsByCategory,
  getAllLegends,
  SPORT_LABELS,
  SPORT_EMOJIS,
  CATEGORY_LABELS,
} from "@/lib/data/legends";
import { Breadcrumb } from "@/components/ui";
import Badge from "@/components/ui/Badge";
import PSPPromo from "@/components/ads/PSPPromo";
import CoachingRecordTable from "@/components/legends/CoachingRecordTable";
import AllStarList from "@/components/legends/AllStarList";
import ChampionshipTimeline from "@/components/legends/ChampionshipTimeline";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getLegendsByCategory("coach").map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const legend = getLegendBySlug(slug);
  if (!legend) return { title: "Legend Not Found" };

  return {
    title: `${legend.name} — Legends`,
    description: legend.excerpt,
    alternates: {
      canonical: `https://phillysportspack.com/hof/legends/${legend.slug}`,
    },
    openGraph: {
      title: `${legend.name} — Legends of Philly HS Sports`,
      description: legend.excerpt,
      type: "article",
      url: `https://phillysportspack.com/hof/legends/${legend.slug}`,
    },
  };
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^#### (.*?)$/gm, '<h4 class="font-heading text-lg text-[var(--psp-navy)] mt-6 mb-2">$1</h4>')
    .replace(/^### (.*?)$/gm, '<h3 class="font-heading text-xl text-[var(--psp-navy)] mt-8 mb-3">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="font-heading text-2xl text-[var(--psp-navy)] mt-10 mb-4 pb-2 border-b border-[var(--psp-gray-200)]">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="font-heading text-3xl text-[var(--psp-navy)] mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hp])/gm, "")
    .replace(/(<p>)\s*(<h[1-4])/g, "$2")
    .replace(/(<\/h[1-4]>)\s*(<\/p>)/g, "$1");
}

export default async function LegendDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const legend = getLegendBySlug(slug);
  if (!legend) notFound();

  const isMemoriam = legend.category === "in-memoriam";
  const isCoach = legend.category === "coach";

  // Related legends (same category, different person)
  const related = getAllLegends()
    .filter((l) => l.category === legend.category && l.slug !== legend.slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const totalWins = legend.stints?.reduce(
    (s, stint) => s + (stint.overallRecord?.wins ?? 0),
    0
  );
  const totalLosses = legend.stints?.reduce(
    (s, stint) => s + (stint.overallRecord?.losses ?? 0),
    0
  );

  return (
    <div className={`min-h-screen ${isMemoriam ? "bg-[var(--psp-gray-50)]" : "bg-[var(--psp-cream)]"}`}>
      {/* Hero */}
      <section
        className={`py-10 px-4 ${
          isMemoriam
            ? "bg-gradient-to-r from-[#1a1a2e] to-[#16213e]"
            : "bg-gradient-to-r from-[var(--psp-navy)] to-[var(--psp-navy-mid)]"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Hall of Fame", href: "/hof" },
              { label: "Legends", href: "/hof/legends" },
              { label: legend.name },
            ]}
            className="text-white/60 mb-4"
          />

          <div className="flex items-start gap-4">
            {/* Photo or initials */}
            {legend.photoUrl ? (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-3 border-[var(--psp-gold)]/40 flex-shrink-0">
                <img
                  src={legend.photoUrl}
                  alt={legend.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex-shrink-0 flex items-center justify-center text-2xl font-bold ${
                  isMemoriam
                    ? "bg-white/10 text-white/60"
                    : "bg-gradient-to-br from-[var(--psp-gold)] to-[var(--psp-gold)]/60 text-[var(--psp-navy)]"
                }`}
              >
                {legend.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            )}

            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="sport">
                  {SPORT_EMOJIS[legend.sport]} {SPORT_LABELS[legend.sport]}
                </Badge>
                <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">
                  {CATEGORY_LABELS[legend.category]}
                </span>
              </div>

              <h1 className="font-heading text-3xl md:text-4xl text-white leading-tight">
                {legend.name}
              </h1>

              <p className="text-white/70 mt-1">
                {legend.role}
                {legend.schools.length > 0 && (
                  <> &middot; {legend.schools.join(", ")}</>
                )}
                {legend.careerSpan && (
                  <span className="text-white/50"> ({legend.careerSpan})</span>
                )}
              </p>

              {/* Coach career summary */}
              {isCoach && totalWins ? (
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm font-bold text-[var(--psp-gold)]">
                    {totalWins}-{totalLosses} Career Record
                  </span>
                </div>
              ) : null}

              {/* Memorial date */}
              {isMemoriam && legend.died && (
                <p className="text-white/50 text-sm mt-2 italic">
                  In Memoriam &middot; {legend.died}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Main column */}
          <div>
            {/* Highlights */}
            {legend.highlights && legend.highlights.length > 0 && (
              <div className="bg-[var(--psp-gold)]/5 border border-[var(--psp-gold)]/20 rounded-xl p-5 mb-8">
                <h3 className="font-heading text-sm uppercase tracking-wider text-[var(--psp-gold)] mb-3">
                  Quick Facts
                </h3>
                <ul className="space-y-1.5">
                  {legend.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="text-sm text-[var(--psp-gray-700)] flex items-start gap-2"
                    >
                      <span className="text-[var(--psp-gold)] mt-0.5 flex-shrink-0">
                        &#9670;
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Narrative */}
            <article className="prose-psp">
              <div
                className="text-[var(--psp-gray-700)] leading-relaxed space-y-4 text-[15px]"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(legend.narrative),
                }}
              />
            </article>

            {/* Attribution */}
            <div className="mt-10 pt-6 border-t border-[var(--psp-gray-200)]">
              <p className="text-sm text-[var(--psp-gray-500)] italic">
                Written by <strong>Ted Silary</strong>. Originally published on
                TedSilary.com. Preserved and republished by PhillySportsPack.
              </p>
              {legend.sourceFiles.length > 0 && (
                <p className="text-xs text-[var(--psp-gray-400)] mt-1">
                  Source: {legend.sourceFiles.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Coaching records */}
            {isCoach && legend.stints && legend.stints.length > 0 && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
                <div className="bg-[var(--psp-navy)] px-5 py-3">
                  <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                    Coaching Record
                  </h3>
                </div>
                <div className="p-5">
                  <CoachingRecordTable stints={legend.stints} />
                </div>
              </div>
            )}

            {/* All-Stars */}
            {isCoach && legend.stints && legend.stints.some((s) => s.allStars?.length) && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
                <div className="bg-[var(--psp-navy)] px-5 py-3">
                  <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                    All-Star Selections
                  </h3>
                </div>
                <div className="p-5">
                  <AllStarList stints={legend.stints} />
                </div>
              </div>
            )}

            {/* Championships */}
            {isCoach && legend.stints && legend.stints.some((s) => s.championships?.length) && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
                <div className="bg-[var(--psp-navy)] px-5 py-3">
                  <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                    Championships
                  </h3>
                </div>
                <div className="p-5">
                  <ChampionshipTimeline stints={legend.stints} />
                </div>
              </div>
            )}

            {/* Related legends */}
            {related.length > 0 && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
                <div className="bg-[var(--psp-navy)] px-5 py-3">
                  <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                    More {CATEGORY_LABELS[legend.category]}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/hof/legends/${r.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--psp-gray-50)] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[var(--psp-gold)]/10 flex items-center justify-center text-xs font-bold text-[var(--psp-gold)]">
                        {r.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--psp-navy)]">
                          {r.name}
                        </p>
                        <p className="text-xs text-[var(--psp-gray-500)]">
                          {r.schools[0]}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <PSPPromo size="sidebar" />
          </aside>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: legend.name,
            description: legend.excerpt,
            author: {
              "@type": "Person",
              name: "Ted Silary",
            },
            publisher: {
              "@type": "Organization",
              name: "PhillySportsPack",
            },
            url: `https://phillysportspack.com/hof/legends/${legend.slug}`,
            about: {
              "@type": "Person",
              name: legend.name,
              jobTitle: legend.role,
            },
          }),
        }}
      />
    </div>
  );
}
