import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

const SPORTS = [
  { id: "football", name: "Football", icon: "🏈", color: "#16a34a", desc: "Rushing, passing, receiving stats & more" },
  { id: "basketball", name: "Basketball", icon: "🏀", color: "#ea580c", desc: "Scoring leaders, PPG, season records" },
  { id: "baseball", name: "Baseball", icon: "⚾", color: "#dc2626", desc: "Team standings, awards, championships" },
  { id: "track-field", name: "Track & Field", icon: "🏃", color: "#7c3aed", desc: "Event results, team championships" },
  { id: "lacrosse", name: "Lacrosse", icon: "🥍", color: "#0891b2", desc: "State champions, PAISAA results" },
  { id: "wrestling", name: "Wrestling", icon: "🤼", color: "#ca8a04", desc: "Team and individual results" },
  { id: "soccer", name: "Soccer", icon: "⚽", color: "#059669", desc: "League standings, playoff results" },
];

const FEATURED_SCHOOLS = [
  { name: "St. Joseph's Prep", stat: "9 state football titles", sport: "football", slug: "saint-josephs-prep" },
  { name: "Neumann-Goretti", stat: "10 state basketball titles", sport: "basketball", slug: "neumann-goretti" },
  { name: "Roman Catholic", stat: "34 Catholic League basketball titles", sport: "basketball", slug: "roman-catholic" },
  { name: "Imhotep Charter", stat: "8 state basketball titles", sport: "basketball", slug: "imhotep-charter" },
  { name: "La Salle College HS", stat: "3 state baseball titles", sport: "baseball", slug: "la-salle-college-hs" },
  { name: "Archbishop Wood", stat: "5 state football titles", sport: "football", slug: "archbishop-wood" },
];

async function getOverviewStats() {
  try {
    const supabase = await createClient();
    const [schools, players, seasons, championships] = await Promise.all([
      supabase.from("schools").select("id", { count: "exact", head: true }),
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("seasons").select("id", { count: "exact", head: true }),
      supabase.from("championships").select("id", { count: "exact", head: true }),
    ]);
    return {
      schools: schools.count ?? 0,
      players: players.count ?? 0,
      seasons: seasons.count ?? 0,
      championships: championships.count ?? 0,
    };
  } catch {
    // Fallback to seed file counts when DB not connected
    return { schools: 405, players: 10057, seasons: 76, championships: 713 };
  }
}

export default async function HomePage() {
  const stats = await getOverviewStats();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero section */}
      <section
        className="relative py-20 md:py-32"
        style={{
          background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 50%, #162a50 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1
            className="text-5xl md:text-7xl text-white mb-3 tracking-wider"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            PhillySportsPack
          </h1>
          <p className="text-lg md:text-xl mb-2" style={{ color: "var(--psp-gold)" }}>
            The Definitive Philadelphia High School Sports Database
          </p>
          <p className="text-sm text-gray-400 mb-10 max-w-lg mx-auto">
            Decades of football, basketball, baseball, and more — every stat, every champion, every player.
            <br />
            <span style={{ color: "var(--psp-gold)" }}>Data compiled by Ted Silary</span>
          </p>

          {/* Quick stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10">
            {[
              { label: "Schools", value: stats.schools, icon: "🏫" },
              { label: "Players", value: stats.players, icon: "🏈" },
              { label: "Seasons", value: stats.seasons, icon: "📅" },
              { label: "Championships", value: stats.championships, icon: "🏆" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "Bebas Neue, sans-serif" }}
                >
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/search" className="btn-primary px-6 py-2.5">
              Search Players & Schools
            </Link>
            <Link href="/football/leaderboards/rushing" className="btn-outline text-white border-white/20 hover:bg-white/10 hover:border-white/40 px-6 py-2.5">
              View Leaderboards
            </Link>
          </div>
        </div>
      </section>

      {/* Sport cards grid */}
      <section className="py-16" style={{ background: "var(--psp-gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
          >
            Explore by Sport
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: "var(--psp-gray-500)" }}>
            Deep data coverage across 7 Philadelphia high school sports
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SPORTS.map((sport) => (
              <Link
                key={sport.id}
                href={`/${sport.id}`}
                className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4"
                  style={{ background: `${sport.color}15` }}
                >
                  {sport.icon}
                </div>
                <h3
                  className="text-xl font-bold mb-1 group-hover:text-[var(--psp-gold)] transition-colors"
                  style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                >
                  {sport.name}
                </h3>
                <p className="text-xs" style={{ color: "var(--psp-gray-500)" }}>
                  {sport.desc}
                </p>
              </Link>
            ))}

            {/* "All Sports" card */}
            <Link
              href="/search"
              className="bg-[var(--psp-navy)] rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-center items-center text-center"
            >
              <div className="text-3xl mb-3">🔍</div>
              <h3
                className="text-xl font-bold mb-1 text-white"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                Search All
              </h3>
              <p className="text-xs text-gray-400">
                Find any player, school, or coach
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured content — top programs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
          >
            Powerhouse Programs
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: "var(--psp-gray-500)" }}>
            The schools that define Philadelphia high school sports
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_SCHOOLS.map((school) => (
              <Link
                key={school.slug}
                href={`/${school.sport}/schools/${school.slug}`}
                className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-5 hover:shadow-md transition-all duration-200 flex items-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "var(--psp-navy)", color: "var(--psp-gold)" }}
                >
                  🏆
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: "var(--psp-navy)" }}>
                    {school.name}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--psp-gray-500)" }}>
                    {school.stat}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent data highlights */}
      <section className="py-16" style={{ background: "var(--psp-gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
          >
            Data Highlights
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: "var(--psp-gray-500)" }}>
            Recent additions and notable records
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <div className="text-sm font-semibold mb-3" style={{ color: "var(--psp-gold)" }}>
                PRO ATHLETES
              </div>
              <div className="text-4xl font-bold mb-1" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                72+
              </div>
              <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                NFL, NBA, and MLB players documented from Philadelphia high schools, including 8 Hall of Famers.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <div className="text-sm font-semibold mb-3" style={{ color: "var(--psp-gold)" }}>
                FOOTBALL STATS
              </div>
              <div className="text-4xl font-bold mb-1" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                13,763
              </div>
              <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                Individual player-season stat records covering rushing, passing, receiving, and scoring.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <div className="text-sm font-semibold mb-3" style={{ color: "var(--psp-gold)" }}>
                COVERAGE
              </div>
              <div className="text-4xl font-bold mb-1" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                25 Years
              </div>
              <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                Data spanning from 2000 to 2025, sourced from original archives and verified against external records.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
