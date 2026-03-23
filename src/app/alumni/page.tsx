import Link from "next/link";
import { createStaticClient } from "@/lib/supabase/static";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { SPORT_META } from "@/lib/data";

export const revalidate = 3600; // ISR: hourly
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Alumni Tracker | PhillySportsPack.com",
  description: "Track Philadelphia high school sports alumni playing college and professional sports. See where your favorite players ended up.",
  metadataBase: new URL("https://phillysportspack.com"),
  alternates: { canonical: "https://phillysportspack.com/alumni" },
  openGraph: {
    title: "Alumni Tracker | PhillySportsPack.com",
    description: "Track Philadelphia high school sports alumni playing college and professional sports.",
    url: "https://phillysportspack.com/alumni",
    type: "website",
    images: [{ url: "https://phillysportspack.com/og-default.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

interface AlumniRecord {
  id: number;
  player_id: number;
  current_level: "college" | "pro" | "retired" | "coaching";
  current_org: string;
  current_role?: string;
  pro_team?: string;
  pro_league?: string;
  college?: string;
  college_sport?: string;
  featured?: boolean;
  players?: {
    id: number;
    name: string;
    slug: string;
    primary_school_id: number;
    schools?: { id: number; name: string; slug: string };
  };
}

export default async function AlumniPage() {
  const supabase = createStaticClient();

  // Fetch stats
  const [{ count: totalCount }, { count: proCount }, { count: collegeCount }] = await Promise.all([
    supabase
      .from("next_level_tracking")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("next_level_tracking")
      .select("id", { count: "exact", head: true })
      .eq("current_level", "pro"),
    supabase
      .from("next_level_tracking")
      .select("id", { count: "exact", head: true })
      .eq("current_level", "college"),
  ]);

  // Fetch pro athletes featured
  const { data: proAthletes } = await supabase
    .from("next_level_tracking")
    .select(`
      *,
      players:player_id(id, name, slug, primary_school_id, schools:primary_school_id(id, name, slug))
    `)
    .eq("current_level", "pro")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  // Fetch all alumni
  const { data: allAlumni } = await supabase
    .from("next_level_tracking")
    .select(`
      *,
      players:player_id(id, name, slug, primary_school_id, schools:primary_school_id(id, name, slug))
    `)
    .order("current_level", { ascending: true })
    .limit(100);

  const alumni = (allAlumni || []) as AlumniRecord[];
  const pros = (proAthletes || []) as AlumniRecord[];

  // Group by level
  const grouped = {
    pro: alumni.filter((a) => a.current_level === "pro"),
    college: alumni.filter((a) => a.current_level === "college"),
    retired: alumni.filter((a) => a.current_level === "retired"),
    coaching: alumni.filter((a) => a.current_level === "coaching"),
  };

  return (
    <>
      {/* Header */}
      <section
        className="py-12 md:py-16"
        style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, #f0a50020 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Alumni Tracker" }]} />

          <div className="flex items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ background: "rgba(240,165,0,0.2)" }}
            >
              🎓
            </div>
            <div className="flex-1">
              <h1
                className="text-4xl md:text-5xl text-white tracking-wider mb-2"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                Alumni Tracker
              </h1>
              <p className="text-gray-300">Where are they now? Follow Philadelphia HS athletes to college and pro</p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl">
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {totalCount || 0}
              </div>
              <div className="text-xs text-gray-300">Athletes Tracked</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {proCount || 0}
              </div>
              <div className="text-xs text-gray-300">Pro Athletes</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {collegeCount || 0}
              </div>
              <div className="text-xs text-gray-300">College Players</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                25+
              </div>
              <div className="text-xs text-gray-300">Years of Data</div>
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pro Athletes Featured */}
            {pros.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                    🏆 Professional Athletes
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pros.map((alumnus) => (
                    <div
                      key={alumnus.id}
                      className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div
                        className="h-32 flex items-center justify-center text-5xl"
                        style={{ background: `linear-gradient(135deg, var(--psp-gold)20 0%, var(--psp-gold)05 100%)` }}
                      >
                        ⭐
                      </div>
                      <div className="p-4">
                        <h3
                          className="font-bold text-lg"
                          style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                        >
                          {alumnus.players?.name || "Unknown"}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--psp-gray-600)" }}>
                          {alumnus.players?.schools?.name || "Unknown School"}
                        </p>

                        <div className="mt-3 pt-3 border-t border-[var(--psp-gray-200)]">
                          {alumnus.pro_team && (
                            <div className="text-sm" style={{ color: "var(--psp-gold)" }}>
                              <strong>{alumnus.pro_league || ""} • {alumnus.pro_team}</strong>
                            </div>
                          )}
                          {alumnus.current_org && (
                            <div className="text-sm mt-2" style={{ color: "var(--psp-gray-600)" }}>
                              {alumnus.current_org}
                              {alumnus.current_role && ` • ${alumnus.current_role}`}
                            </div>
                          )}
                        </div>

                        {alumnus.players?.slug && (
                          <Link
                            href={`/search?q=${encodeURIComponent(alumnus.players.name)}`}
                            className="inline-block text-xs font-semibold mt-3 text-blue-600 hover:underline"
                          >
                            View Profile →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Alumni by Level */}
            {grouped.college.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  College Athletes ({grouped.college.length})
                </h2>
                <div className="space-y-2">
                  {grouped.college.slice(0, 10).map((alumnus) => (
                    <div
                      key={alumnus.id}
                      className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 flex items-center justify-between hover:shadow transition-shadow"
                    >
                      <div>
                        <p className="font-medium" style={{ color: "var(--psp-navy)" }}>
                          {alumnus.players?.name || "Unknown"}
                        </p>
                        <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                          {alumnus.players?.schools?.name || "Unknown School"} •{" "}
                          {alumnus.college || "Unknown College"}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-900 font-semibold">
                        College
                      </span>
                    </div>
                  ))}
                </div>
                {grouped.college.length > 10 && (
                  <Link
                    href="/search?type=alumni&level=college"
                    className="inline-block text-sm font-semibold mt-4"
                    style={{ color: "var(--psp-gold)" }}
                  >
                    View All {grouped.college.length} College Athletes →
                  </Link>
                )}
              </div>
            )}

            {/* Retired / Coaching */}
            {(grouped.retired.length > 0 || grouped.coaching.length > 0) && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Retired & Coaching ({grouped.retired.length + grouped.coaching.length})
                </h2>
                <div className="space-y-2">
                  {[...grouped.retired, ...grouped.coaching].slice(0, 8).map((alumnus) => (
                    <div
                      key={alumnus.id}
                      className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm" style={{ color: "var(--psp-navy)" }}>
                          {alumnus.players?.name || "Unknown"}
                        </p>
                        <p className="text-xs" style={{ color: "var(--psp-gray-500)" }}>
                          {alumnus.current_org || "Unknown"}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-gray-300 text-gray-900 font-semibold">
                        {alumnus.current_level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Filter Alumni
              </h3>
              <div className="space-y-3">
                <Link
                  href="/alumni?level=pro"
                  className="block p-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: "rgba(240,165,0,0.1)",
                    color: "var(--psp-gold)",
                    border: "1px solid rgba(240,165,0,0.2)",
                  }}
                >
                  🏆 Professional ({grouped.pro.length})
                </Link>
                <Link
                  href="/alumni?level=college"
                  className="block p-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    color: "var(--psp-blue, #3b82f6)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  🎓 College ({grouped.college.length})
                </Link>
                <Link
                  href="/alumni?level=retired"
                  className="block p-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: "rgba(100,100,100,0.1)",
                    color: "var(--psp-navy)",
                    border: "1px solid rgba(100,100,100,0.2)",
                  }}
                >
                  🏅 Retired & Coaching ({grouped.retired.length + grouped.coaching.length})
                </Link>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                About Alumni Tracker
              </h3>
              <p className="text-sm" style={{ color: "var(--psp-gray-600)" }}>
                Follow Philadelphia high school sports alumni as they pursue college and professional opportunities. We track players from 25+ years of Philadelphia HS sports history.
              </p>
              <p className="text-xs mt-3" style={{ color: "var(--psp-gray-500)" }}>
                See a player missing from our database? Submit a correction or tip!
              </p>
            </div>

            <PSPPromo size="sidebar" variant={2} />
          </div>
        </div>
      </div>
    </>
  );
}
