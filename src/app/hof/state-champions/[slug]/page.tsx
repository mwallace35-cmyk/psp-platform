import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { ALL_STATE_CHAMPIONSHIPS } from "@/lib/data/state-champions";
import { SPORT_EMOJI } from "@/lib/sports";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_STATE_CHAMPIONSHIPS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const champ = ALL_STATE_CHAMPIONSHIPS.find((c) => c.slug === slug);
  if (!champ) return { title: "Championship Not Found" };

  return {
    title: `${champ.school} ${champ.year} ${champ.classification} State Champions`,
    description: `${champ.school} defeated ${champ.opponent} ${champ.score} to win the ${champ.year} PIAA ${champ.classification} ${champ.sport} state championship.`,
    alternates: {
      canonical: `https://phillysportspack.com/hof/state-champions/${champ.slug}`,
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
    .replace(/\n\n/g, "</p><p>");
}

export default async function ChampionshipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const champ = ALL_STATE_CHAMPIONSHIPS.find((c) => c.slug === slug);
  if (!champ) notFound();

  // Related championships (same school, different years)
  const related = ALL_STATE_CHAMPIONSHIPS
    .filter((c) => c.schoolSlug === champ.schoolSlug && c.slug !== champ.slug)
    .sort((a, b) => b.year - a.year);

  const sportEmoji = SPORT_EMOJI[champ.sport] ?? "";

  return (
    <div className="min-h-screen bg-[var(--psp-cream)]">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[var(--psp-navy)] to-[var(--psp-navy-mid)] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Hall of Fame", href: "/hof" },
              { label: "State Champions", href: "/hof/state-champions" },
              { label: `${champ.school} ${champ.year}` },
            ]}
            className="text-white/60 mb-4"
          />

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--psp-gold)]/20 text-[var(--psp-gold)]">
              {sportEmoji} {champ.sport.charAt(0).toUpperCase() + champ.sport.slice(1)} &middot; {champ.classification}
            </span>
            <span className="text-white/40 text-sm">PIAA State Champions</span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl text-white leading-tight">
            {champ.school} &mdash; {champ.year}
          </h1>

          <p className="text-white/70 mt-2 text-lg">
            Defeated {champ.opponent}, <span className="text-[var(--psp-gold)] font-bold">{champ.score}</span>
            {champ.venue && <> at {champ.venue}</>}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-white/60">
              Coach:{" "}
              {champ.coachLegendSlug ? (
                <Link
                  href={`/hof/legends/${champ.coachLegendSlug}`}
                  className="text-[var(--psp-gold)] font-semibold hover:underline"
                >
                  {champ.coach}
                </Link>
              ) : (
                <strong className="text-white">{champ.coach}</strong>
              )}
            </span>
            {champ.seasonRecord && (
              <span className="text-sm text-white/60">
                Record: <strong className="text-white">{champ.seasonRecord}</strong>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Main column */}
          <div>
            {/* Highlights */}
            {champ.highlights.length > 0 && (
              <div className="bg-[var(--psp-gold)]/5 border border-[var(--psp-gold)]/20 rounded-xl p-5 mb-8">
                <h3 className="font-heading text-sm uppercase tracking-wider text-[var(--psp-gold)] mb-3">
                  Key Performances
                </h3>
                <ul className="space-y-1.5">
                  {champ.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="text-sm text-[var(--psp-gray-700)] flex items-start gap-2"
                    >
                      <span className="text-[var(--psp-gold)] mt-0.5 flex-shrink-0">&#9670;</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Game-by-game results */}
            {champ.gameByGame && champ.gameByGame.length > 0 && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden mb-8">
                <div className="bg-[var(--psp-navy)] px-5 py-3">
                  <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                    Season Results
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--psp-gray-50)] text-xs uppercase tracking-wider text-[var(--psp-gray-500)]">
                        <th className="px-4 py-2 text-left">Opponent</th>
                        <th className="px-4 py-2 text-center">Result</th>
                        <th className="px-4 py-2 text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {champ.gameByGame.map((g, i) => (
                        <tr key={i} className="border-b border-[var(--psp-gray-100)]">
                          <td className="px-4 py-2 text-[var(--psp-gray-700)]">
                            {g.opponent}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                g.result === "W"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {g.result}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center font-mono text-[var(--psp-gray-700)]">
                            {g.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Narrative */}
            <article>
              <div
                className="text-[var(--psp-gray-700)] leading-relaxed space-y-4 text-[15px]"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(champ.narrative),
                }}
              />
            </article>

            {/* Attribution */}
            <div className="mt-10 pt-6 border-t border-[var(--psp-gray-200)]">
              <p className="text-sm text-[var(--psp-gray-500)] italic">
                Written by <strong>Ted Silary</strong>. Originally published on
                TedSilary.com. Preserved and republished by PhillySportsPack.
              </p>
              <p className="text-xs text-[var(--psp-gray-400)] mt-1">
                Source: {champ.sourceFile}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* School link */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
              <div className="bg-[var(--psp-navy)] px-5 py-3">
                <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                  School Profile
                </h3>
              </div>
              <div className="p-4">
                <Link
                  href={`/schools/${champ.schoolSlug}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--psp-gray-50)] transition-colors"
                >
                  <span className="text-lg">{sportEmoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--psp-navy)]">
                      {champ.school}
                    </p>
                    <p className="text-xs text-[var(--psp-gray-500)]">
                      View full school profile
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Other titles by this school */}
            {related.length > 0 && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
                <div className="bg-[var(--psp-navy)] px-5 py-3">
                  <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                    More Titles: {champ.school}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/hof/state-champions/${r.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--psp-gray-50)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{SPORT_EMOJI[r.sport]}</span>
                        <span className="text-sm font-semibold text-[var(--psp-navy)]">
                          {r.year}
                        </span>
                        <span className="text-xs text-[var(--psp-gray-400)]">
                          {r.classification}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--psp-gray-500)]">
                        {r.score}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Coach legend link */}
            {champ.coachLegendSlug && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
                <div className="bg-[var(--psp-navy)] px-5 py-3">
                  <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                    Coach Profile
                  </h3>
                </div>
                <div className="p-4">
                  <Link
                    href={`/hof/legends/${champ.coachLegendSlug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--psp-gray-50)] transition-colors"
                  >
                    <span className="text-lg">🏆</span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--psp-navy)]">
                        {champ.coach}
                      </p>
                      <p className="text-xs text-[var(--psp-gray-500)]">
                        Full tribute by Ted Silary
                      </p>
                    </div>
                  </Link>
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
            "@type": "SportsEvent",
            name: `${champ.year} PIAA ${champ.classification} ${champ.sport.charAt(0).toUpperCase() + champ.sport.slice(1)} State Championship`,
            description: `${champ.school} defeated ${champ.opponent} ${champ.score}`,
            url: `https://phillysportspack.com/hof/state-champions/${champ.slug}`,
            location: champ.venue ? { "@type": "Place", name: champ.venue } : undefined,
          }),
        }}
      />
    </div>
  );
}
