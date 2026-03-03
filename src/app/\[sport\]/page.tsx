import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getSportOverview, getRecentChampions, getSchoolsBySport } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: revalidate hourly

type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} — PhillySportsPack`,
    description: `Philadelphia high school ${meta.name.toLowerCase()} stats, schools, leaderboards, records, and championships.`,
  };
}

export async function generateStaticParams() {
  return [
    { sport: "football" },
    { sport: "basketball" },
    { sport: "baseball" },
    { sport: "track-field" },
    { sport: "lacrosse" },
    { sport: "wrestling" },
    { sport: "soccer" },
  ];
}

export default async function SportHubPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const [overview, champions, schools] = await Promise.all([
    getSportOverview(sport),
    getRecentChampions(sport, 6),
    getSchoolsBySport(sport, 20),
  ]);

  const NAV_SECTIONS = [
    { href: `/${sport}/leaderboards/rushing`, label: "Leaderboards", icon: "📊", desc: "Top performers by stat category" },
    { href: `/${sport}/records`, label: "Records", icon: "🏅", desc: "All-time records and milestones" },
    { href: `/${sport}/championships`, label: "Championships", icon: "🏆", desc: "Championship history and dynasty tracker" },
    { href: `/search?sport=${sport}`, label: "Search", icon: "🔍", desc: "Find any player, school, or coach" },
  ];

  return (
    <>
      {/* Hero */}
      <section
        className="py-16 md:py-24"
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 50%, ${meta.color}22 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">{meta.emoji}</div>
          <h1
            className="text-5xl md:text-6xl text-white mb-3 tracking-wider"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            {meta.name}
          </h1>
          <p className="text-lg mb-8" style={{ color: "var(--psp-gold)" }}>
            Philadelphia High School {meta.name}
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { label: "Schools", value: overview.schools, icon: "🏫" },
              { label: "Players", value: overview.players, icon: "👤" },
              { label: "Seasons", value: overview.seasons, icon: "📅" },
              { label: "Championships", value: overview.championships, icon: "🏆" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-3xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="btn-primary px-6 py-2.5">
              View Leaderboards
            </Link>
            <Link href={`/${sport}/championships`} className="btn-outline text-white border-white/20 hover:bg-white/10 px-6 py-2.5">
              Championships
            </Link>
          </div>
        </div>
      </section>

      {/* Nav sections */}
      <section className="py-12" style={{ background: "var(--psp-gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {NAV_SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-3xl mb-3">{section.icon}</div>
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  {section.label}
                </h3>
                <p className="text-xs" style={{ color: "var(--psp-gray-500)" }}>
                  {section.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Champions */}
      {champions.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                Recent Champions
              </h2>
              <Link href={`/${sport}/championships`} className="text-sm font-medium" style={{ color: "var(--psp-gold)" }}>
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {champions.map((champ: any) => (
                <div
                  key={champ.id}
                  className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-5 flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: "var(--psp-navy)", color: "var(--psp-gold)" }}
                  >
                    🏆
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/${sport}/schools/${champ.schools?.slug}`}
                      className="font-bold text-sm hover:underline truncate block"
                      style={{ color: "var(--psp-navy)" }}
                    >
                      {champ.schools?.name}
                    </Link>
                    <p className="text-xs truncate" style={{ color: "var(--psp-gray-500)" }}>
                      {champ.seasons?.label} — {champ.level}{champ.score ? ` (${champ.score})` : ""}
                    </p>
                    {champ.leagues?.name && (
                      <p className="text-xs" style={{ color: "var(--psp-gray-400)" }}>{champ.leagues.name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schools listing */}
      {schools.length > 0 && (
        <section className="py-12" style={{ background: "var(--psp-gray-50)" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                Schools
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {schools.map((school: any) => (
                <Link
                  key={school.id}
                  href={`/${sport}/schools/${school.slug}`}
                  className="bg-white rounded-lg border border-[var(--psp-gray-200)] px-4 py-3 hover:shadow-md transition-all duration-200 flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${meta.color}15` }}
                  >
                    {meta.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate" style={{ color: "var(--psp-navy)" }}>
                      {school.name}
                    </div>
                    <div className="text-xs truncate" style={{ color: "var(--psp-gray-400)" }}>
                      {school.leagues?.name || school.city}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Philadelphia High School ${meta.name}`,
            description: `Comprehensive ${meta.name.toLowerCase()} database for Philadelphia area high schools.`,
            url: `https://phillysportspack.com/${sport}`,
            isPartOf: { "@type": "WebSite", name: "PhillySportsPack", url: "https://phillysportspack.com" },
          }),
        }}
      />
    </>
  );
}
