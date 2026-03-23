import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

// Helper function to format time ago
function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface DisplayArticle {
  slug: string;
  title: string;
  excerpt: string;
  sport_id: string;
  featured_image_url: string;
  published_at: string;
}

interface DisplayAlumnus {
  emoji: string;
  name: string;
  team: string;
  role?: string;
  hs: string;
}

interface DisplayScore {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  gameDate: string;
  status: string;
  sportId: string;
}

interface DisplayPotwNominee {
  id: string;
  playerName: string;
  schoolName: string;
  sportId: string;
  statLine: string;
  votes: number;
}

interface DisplayHotTake {
  id: string;
  userHandle: string;
  content: string;
  type: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

interface HomePageClientProps {
  stats: {
    schools: number;
    players: number;
    seasons: number;
    championships: number;
  };
  articles: DisplayArticle[];
  alumni: DisplayAlumnus[];
  recentScores: DisplayScore[];
  potwNominees: DisplayPotwNominee[];
  hotTakes: DisplayHotTake[];
  websiteJsonLd: Record<string, unknown>;
}

export default function HomePageClient({ stats, articles, alumni, recentScores, potwNominees, hotTakes, websiteJsonLd }: HomePageClientProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Header />

      <ErrorBoundary>
        <main id="main-content" className="flex-1 w-full">
          <div id="content-updates" aria-live="polite" aria-atomic="true" className="sr-only"></div>

        {/* ============ HERO SECTION ============ */}
        <section className="w-full px-5 py-20 md:py-40 bg-gradient-to-br from-[var(--psp-navy)] to-[#1a4d8f] text-white text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>
              Philadelphia&apos;s Home for High School Sports
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
              Track the stats, celebrate the champions, and discover tomorrow&apos;s stars
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/search"
                className="px-8 py-3 bg-[var(--psp-gold)] text-[var(--psp-navy)] rounded-lg font-semibold text-base transition-all duration-300 hover:bg-[var(--psp-gold-light)] hover:-translate-y-1"
              >
                Explore Database
              </Link>
              <Link
                href="/football"
                className="px-8 py-3 transparent text-white rounded-lg font-semibold text-base border-2 border-white transition-all duration-300 hover:bg-white hover:text-[var(--psp-navy)]"
              >
                View Sports
              </Link>
            </div>
          </div>
          <div
            className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full z-0"
            style={{ backgroundColor: "rgba(240, 165, 0, 0.1)" }}
          />
        </section>

        {/* ============ SOCIAL PROOF BAR ============ */}
        <section className="w-full px-5 py-10 bg-gray-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-[var(--psp-navy)]" style={{ fontFamily: "var(--font-bebas)" }}>
                {stats.players.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600 mt-2">Players Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--psp-navy)]" style={{ fontFamily: "var(--font-bebas)" }}>
                {stats.schools.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600 mt-2">Schools</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--psp-navy)]" style={{ fontFamily: "var(--font-bebas)" }}>3</div>
              <div className="text-sm text-gray-600 mt-2">Sports Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--psp-navy)]" style={{ fontFamily: "var(--font-bebas)" }}>50+</div>
              <div className="text-sm text-gray-600 mt-2">Years of Data</div>
            </div>
          </div>
        </section>

        {/* ============ RECENT SCORES TICKER ============ */}
        <section className="w-full px-5 py-10 bg-[var(--psp-navy)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white" style={{ fontFamily: "var(--font-bebas)" }}>
              Recent Scores
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-3" style={{ WebkitOverflowScrolling: "touch" }}>
              {recentScores.length > 0 ? (
                recentScores.map((score) => {
                  const isHomeWin = score.homeScore > score.awayScore;
                  return (
                    <div
                      key={score.id}
                      className="flex-shrink-0 w-72 p-4 rounded-lg border flex flex-col gap-3"
                      style={{
                        backgroundColor: "rgba(240, 165, 0, 0.1)",
                        borderColor: "rgba(240, 165, 0, 0.3)",
                      }}
                    >
                      <div className="text-xs font-semibold text-[var(--psp-gold)] uppercase tracking-wider">
                        {score.sportId}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className={`text-sm font-${isHomeWin ? 'bold' : 'medium'} text-white mb-1 overflow-hidden text-ellipsis whitespace-nowrap`}>
                            {score.homeTeam}
                          </div>
                          <div className={`text-sm font-${!isHomeWin ? 'bold' : 'medium'} text-white overflow-hidden text-ellipsis whitespace-nowrap`}>
                            {score.awayTeam}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold mb-1 ${isHomeWin ? 'text-[var(--psp-gold)]' : 'text-white'}`}>
                            {score.homeScore}
                          </div>
                          <div className={`text-2xl font-bold ${!isHomeWin ? 'text-[var(--psp-gold)]' : 'text-white'}`}>
                            {score.awayScore}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-white/70 pt-2 border-t border-[rgba(240,165,0,0.2)]">
                        {formatTimeAgo(score.gameDate)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-white text-sm px-4 py-6">
                  No recent scores available
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============ FEATURED CONTENT GRID ============ */}
        <section className="w-full px-5 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-[var(--psp-navy)]" style={{ fontFamily: "var(--font-bebas)" }}>
              Latest Coverage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, idx) => (
                <Link
                  key={idx}
                  href={`/articles/${article.slug}`}
                  className="flex flex-col rounded-xl overflow-hidden bg-white border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  <div
                    className="w-full h-48 bg-gray-200 bg-cover bg-center"
                    style={{
                      backgroundImage: article.featured_image_url ? `url(${article.featured_image_url})` : undefined,
                    }}
                  />
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-[var(--psp-gold)] uppercase mb-2">
                      {article.sport_id}
                    </span>
                    <h3 className="text-lg font-semibold mb-2 text-[var(--psp-navy)] leading-relaxed">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed flex-1">
                      {article.excerpt}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(article.published_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SPORT NAVIGATION CARDS ============ */}
        <section className="w-full px-5 py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-[var(--psp-navy)]" style={{ fontFamily: "var(--font-bebas)" }}>
              Explore by Sport
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Football", color: "#16a34a", icon: "🏈", href: "/football", desc: "120+ schools, 5,000+ players tracked" },
                { name: "Basketball", color: "#ea580c", icon: "🏀", href: "/basketball", desc: "120+ schools, 5,000+ players tracked" },
                { name: "Baseball", color: "#dc2626", icon: "⚾", href: "/baseball", desc: "120+ schools, 5,000+ players tracked" },
              ].map((sport, idx) => (
                <Link
                  key={idx}
                  href={sport.href}
                  className="px-6 py-10 rounded-xl text-white text-center flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg min-h-52"
                  style={{ backgroundColor: sport.color }}
                >
                  <span className="text-6xl">{sport.icon}</span>
                  <h3 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-bebas)" }}>
                    {sport.name}
                  </h3>
                  <p className="text-sm opacity-90">
                    {sport.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ POTW SPOTLIGHT ============ */}
        <section className="w-full px-5 py-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-[var(--psp-navy)]" style={{ fontFamily: "var(--font-bebas)" }}>
              Player of the Week Spotlight
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {potwNominees.length > 0 ? (
                potwNominees.map((nominee) => (
                  <div
                    key={nominee.id}
                    className="p-6 bg-white border-2 border-[var(--psp-gold)] rounded-xl flex flex-col gap-4 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1 text-[var(--psp-navy)]">
                          {nominee.playerName}
                        </h3>
                        <p className="text-sm text-[var(--psp-gold)] mb-1 font-medium">
                          {nominee.schoolName}
                        </p>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {nominee.sportId}
                        </span>
                      </div>
                      <div className="text-right min-w-fit">
                        <div className="text-2xl font-bold text-[var(--psp-gold)]">
                          {nominee.votes}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          votes
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-[var(--psp-navy)] italic">
                        {nominee.statLine}
                      </p>
                    </div>
                    <Link
                      href="/potw"
                      className="px-4 py-2 bg-[var(--psp-gold)] text-[var(--psp-navy)] rounded-lg font-semibold text-sm text-center transition-all duration-300 hover:bg-[var(--psp-gold-light)] hover:-translate-y-1"
                    >
                      Vote Now
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-600">
                  <p className="text-sm">No POTW nominees available at this time</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <Link
                href="/potw"
                className="px-7 py-3 bg-[var(--psp-navy)] text-white rounded-lg font-semibold inline-block transition-all duration-300 hover:bg-[#1a4d8f] hover:-translate-y-1"
              >
                View All Nominees
              </Link>
            </div>
          </div>
        </section>

        {/* ============ NEWSLETTER CTA ============ */}
        <section className="w-full px-5 py-12 bg-gradient-to-br from-[var(--psp-navy)] to-[#1a4d8f] text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-bebas)" }}>
              Stay Updated
            </h2>
            <p className="text-base mb-8 opacity-95 leading-relaxed">
              Get the latest Philadelphia high school sports news, rankings, and player highlights delivered to your inbox
            </p>
            <div className="flex gap-3 max-w-md mx-auto flex-col sm:flex-row justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-4 py-3 rounded-lg border-none text-base bg-white text-[var(--psp-navy)]"
              />
              <button className="px-8 py-3 bg-[var(--psp-gold)] text-[var(--psp-navy)] rounded-lg font-semibold text-base transition-all duration-300 hover:bg-[var(--psp-gold-light)] hover:-translate-y-1">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* ============ QUICK COMMUNITY PULSE ============ */}
        <section className="w-full px-5 py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-[var(--psp-navy)]" style={{ fontFamily: "var(--font-bebas)" }}>
              Community Hot Takes
            </h2>
            <p className="text-sm text-gray-600 mb-8 max-w-2xl">
              What the community is talking about this week. Share your takes and join the conversation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {hotTakes.map((take) => {
                return (
                  <div
                    key={take.id}
                    className="p-5 bg-white rounded-xl border border-gray-200 flex flex-col gap-4 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {take.type === "take" ? "🔥" : take.type === "prediction" ? "🔮" : "💬"}
                      </span>
                      <span className="text-sm font-semibold text-[var(--psp-navy)]">
                        {take.userHandle}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--psp-navy)] leading-relaxed">
                      {take.content}
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>👍 {take.upvotes}</span>
                        <span>👎 {take.downvotes}</span>
                      </div>
                      <div className="ml-auto text-xs text-gray-500">
                        {formatTimeAgo(take.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <Link
                href="/pulse/forum"
                className="px-7 py-3 bg-[var(--psp-navy)] text-white rounded-lg font-semibold inline-block transition-all duration-300 hover:bg-[#1a4d8f] hover:-translate-y-1"
              >
                Join The Pulse
              </Link>
            </div>
          </div>
        </section>

        {/* ============ PHILLY EVERYWHERE (ALUMNI) ============ */}
        <section className="w-full px-5 py-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-[var(--psp-navy)]" style={{ fontFamily: "var(--font-bebas)" }}>
              Philly Everywhere
            </h2>
            <p className="text-base text-gray-600 mb-8 max-w-2xl">
              Track Philadelphia&apos;s next-level athletes competing at the highest levels of college and professional sports
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {alumni.slice(0, 12).map((alumnus, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center"
                >
                  <div className="text-4xl mb-2">{alumnus.emoji}</div>
                  <h4 className="text-sm font-semibold text-[var(--psp-navy)] mb-1 truncate">
                    {alumnus.name}
                  </h4>
                  <p className="text-xs text-[var(--psp-gold)] mb-1 font-medium">
                    {alumnus.team}
                  </p>
                  <p className="text-xs text-gray-600">
                    {alumnus.hs}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/search"
                className="px-6 py-3 bg-[var(--psp-navy)] text-white rounded-lg font-semibold inline-block transition-all duration-300 hover:bg-[#1a4d8f] hover:-translate-y-1"
              >
                View All Alumni
              </Link>
            </div>
          </div>
        </section>
        </main>
      </ErrorBoundary>

      <OrganizationJsonLd />
      <Footer />
    </div>
  );
}
