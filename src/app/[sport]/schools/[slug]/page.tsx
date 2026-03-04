import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getSchoolBySlug, getSchoolTeamSeasons, getSchoolChampionships } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import CorrectionForm from "@/components/corrections/CorrectionForm";
import RelatedArticles from "@/components/articles/RelatedArticles";
import type { Metadata } from "next";

export const revalidate = 86400; // ISR: daily

type PageParams = { sport: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) return {};
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  return {
    title: `${school.name} ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `${school.name} ${SPORT_META[sport].name.toLowerCase()} statistics, season results, championships, and notable players.`,
  };
}

export default async function SchoolProfilePage({ params }: { params: Promise<PageParams> }) {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) notFound();

  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const meta = SPORT_META[sport];
  const [teamSeasons, championships] = await Promise.all([
    getSchoolTeamSeasons(school.id, sport),
    getSchoolChampionships(school.id, sport),
  ]);

  // Compute all-time record
  const allTimeRecord = teamSeasons.reduce(
    (acc: { w: number; l: number; t: number }, ts: any) => ({
      w: acc.w + (ts.wins || 0),
      l: acc.l + (ts.losses || 0),
      t: acc.t + (ts.ties || 0),
    }),
    { w: 0, l: 0, t: 0 }
  );

  return (
    <>
      {/* School header */}
      <section
        className="py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, ${meta.color}22 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: meta.name, href: `/${sport}` },
            { label: "Schools" },
            { label: school.name }
          ]} />

          <div className="flex items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ background: `${meta.color}20` }}
            >
              {meta.emoji}
            </div>
            <div>
              <h1
                className="text-4xl md:text-5xl text-white mb-2 tracking-wider"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {school.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                {school.leagues && (
                  <span style={{ color: "var(--psp-gold)" }}>{(school as any).leagues?.name}</span>
                )}
                <span className="text-gray-400">{school.city}, {school.state}</span>
                {school.mascot && <span className="text-gray-400">Mascot: {school.mascot}</span>}
                {school.closed_year && (
                  <span className="text-red-400">Closed {school.closed_year}</span>
                )}
              </div>
            </div>
          </div>

          {/* Stat bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl">
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {allTimeRecord.w}-{allTimeRecord.l}{allTimeRecord.t > 0 ? `-${allTimeRecord.t}` : ""}
              </div>
              <div className="text-xs text-gray-400">All-Time Record</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {championships.length}
              </div>
              <div className="text-xs text-gray-400">Championships</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {teamSeasons.length}
              </div>
              <div className="text-xs text-gray-400">Seasons on Record</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {allTimeRecord.w + allTimeRecord.l + allTimeRecord.t > 0
                  ? ((allTimeRecord.w / (allTimeRecord.w + allTimeRecord.l + allTimeRecord.t)) * 100).toFixed(1) + "%"
                  : "—"}
              </div>
              <div className="text-xs text-gray-400">Win Percentage</div>
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Championships */}
            {championships.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Championships ({championships.length})
                </h2>
                <div className="space-y-2">
                  {championships.map((c: any) => (
                    <div key={c.id} className="bg-white rounded-lg border border-[var(--psp-gray-200)] px-4 py-3 flex items-center gap-3">
                      <span className="text-xl">🏆</span>
                      <div>
                        <span className="font-medium text-sm" style={{ color: "var(--psp-navy)" }}>
                          {c.seasons?.label}
                        </span>
                        <span className="text-xs ml-2" style={{ color: "var(--psp-gray-500)" }}>
                          {c.level}{c.leagues?.name ? ` — ${c.leagues.name}` : ""}
                        </span>
                        {c.score && (
                          <span className="text-xs ml-2" style={{ color: "var(--psp-gray-400)" }}>
                            ({c.score})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Season-by-season results */}
            {teamSeasons.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Season-by-Season Results
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Season</th>
                        <th className="text-center">W</th>
                        <th className="text-center">L</th>
                        <th className="text-center">T</th>
                        <th className="text-center">PF</th>
                        <th className="text-center">PA</th>
                        <th>Playoff</th>
                        <th>Coach</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamSeasons.map((ts: any) => (
                        <tr key={ts.id}>
                          <td className="font-medium">
                            {ts.seasons?.label ? (
                              <Link
                                href={`/${sport}/teams/${slug}/${ts.seasons.label}`}
                                className="hover:underline"
                                style={{ color: "var(--psp-blue, #3b82f6)" }}
                              >
                                {ts.seasons.label}
                              </Link>
                            ) : "—"}
                          </td>
                          <td className="text-center">{ts.wins ?? "—"}</td>
                          <td className="text-center">{ts.losses ?? "—"}</td>
                          <td className="text-center">{ts.ties ?? "—"}</td>
                          <td className="text-center">{ts.points_for ?? "—"}</td>
                          <td className="text-center">{ts.points_against ?? "—"}</td>
                          <td className="text-xs">{ts.playoff_result || "—"}</td>
                          <td className="text-xs">
                            {ts.coaches ? (
                              <Link href={`/${sport}/coaches/${ts.coaches.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                                {ts.coaches.name}
                              </Link>
                            ) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* School info card */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                School Info
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt style={{ color: "var(--psp-gray-500)" }}>Location</dt>
                  <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{school.city}, {school.state}</dd>
                </div>
                {school.leagues && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>League</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{(school as any).leagues?.name}</dd>
                  </div>
                )}
                {school.founded_year && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Founded</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{school.founded_year}</dd>
                  </div>
                )}
                {school.mascot && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Mascot</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{school.mascot}</dd>
                  </div>
                )}
                {school.website_url && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Website</dt>
                    <dd>
                      <a href={school.website_url} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: "var(--psp-gold)" }}>
                        Visit →
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link href={`/${sport}/leaderboards/rushing?school=${slug}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  📊 Stat Leaders
                </Link>
                <Link href={`/${sport}/championships`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  🏆 All Championships
                </Link>
                <Link href={`/search?q=${encodeURIComponent(school.name)}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--psp-navy)" }}>
                  🔍 Search Players
                </Link>
              </div>
            </div>

            {/* Notable Alumni */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Notable Alumni
              </h3>
              <p className="text-sm text-gray-400">Notable players from {school.name} coming soon.</p>
            </div>

            <RelatedArticles entityType="school" entityId={school.id} />

            <PSPPromo size="sidebar" variant={2} />
          </div>
        </div>
      </div>

      {/* Correction Form */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <CorrectionForm entityType="school" entityId={school.id} entityName={school.name} />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            name: school.name,
            sport: meta.name,
            location: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: school.city, addressRegion: school.state } },
            url: `https://phillysportspack.com/${sport}/schools/${slug}`,
          }),
        }}
      />
    </>
  );
}
