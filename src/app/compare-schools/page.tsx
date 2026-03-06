import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Compare Schools — PhillySportsPack",
  description: "Side-by-side comparison of Philadelphia high school sports programs — records, championships, pro alumni, and head-to-head history.",
};

interface SchoolStats {
  id: number;
  slug: string;
  name: string;
  short_name: string | null;
  city: string | null;
  mascot: string | null;
  league: string | null;
  totalWins: number;
  totalLosses: number;
  totalTies: number;
  winPct: number;
  championships: number;
  proAlumni: number;
  sports: string[];
  seasons: number;
}

async function getSchoolComparison(slug: string): Promise<SchoolStats | null> {
  try {
    const supabase = await createClient();

    const { data: school } = await supabase
      .from("schools")
      .select("id, slug, name, short_name, city, mascot, leagues(name)")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();

    if (!school) return null;

    const [teamSeasonsRes, champsRes, proRes] = await Promise.all([
      supabase
        .from("team_seasons")
        .select("sport_id, wins, losses, ties")
        .eq("school_id", school.id),
      supabase
        .from("championships")
        .select("id")
        .eq("school_id", school.id),
      supabase
        .from("players")
        .select("id")
        .eq("primary_school_id", school.id)
        .not("pro_team", "is", null),
    ]);

    const teamSeasons = teamSeasonsRes.data ?? [];
    const totalWins = teamSeasons.reduce((s, r) => s + (r.wins || 0), 0);
    const totalLosses = teamSeasons.reduce((s, r) => s + (r.losses || 0), 0);
    const totalTies = teamSeasons.reduce((s, r) => s + (r.ties || 0), 0);
    const totalGames = totalWins + totalLosses + totalTies;
    const sports = [...new Set(teamSeasons.map(r => r.sport_id).filter(Boolean))];

    return {
      id: school.id,
      slug: school.slug,
      name: school.name,
      short_name: school.short_name,
      city: school.city,
      mascot: school.mascot,
      league: (school.leagues as any)?.name || null,
      totalWins,
      totalLosses,
      totalTies,
      winPct: totalGames > 0 ? +(totalWins / totalGames * 100).toFixed(1) : 0,
      championships: champsRes.data?.length ?? 0,
      proAlumni: proRes.data?.length ?? 0,
      sports,
      seasons: teamSeasons.length,
    };
  } catch {
    return null;
  }
}

async function getHeadToHead(schoolA: number, schoolB: number) {
  try {
    const supabase = await createClient();
    const { data: games } = await supabase
      .from("games")
      .select("sport_id, game_date, home_school_id, away_school_id, home_score, away_score, game_type")
      .or(`and(home_school_id.eq.${schoolA},away_school_id.eq.${schoolB}),and(home_school_id.eq.${schoolB},away_school_id.eq.${schoolA})`)
      .not("home_score", "is", null)
      .not("away_score", "is", null)
      .order("game_date", { ascending: false })
      .limit(50);

    if (!games || games.length === 0) return { wins: 0, losses: 0, ties: 0, games: [] };

    let wins = 0, losses = 0, ties = 0;
    for (const g of games) {
      const aIsHome = g.home_school_id === schoolA;
      const aScore = aIsHome ? g.home_score : g.away_score;
      const bScore = aIsHome ? g.away_score : g.home_score;
      if (aScore > bScore) wins++;
      else if (bScore > aScore) losses++;
      else ties++;
    }

    return { wins, losses, ties, games: games.slice(0, 10) };
  } catch {
    return { wins: 0, losses: 0, ties: 0, games: [] };
  }
}

async function getAllSchoolSlugs() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("schools")
      .select("slug, name")
      .is("deleted_at", null)
      .not("league_id", "is", null)
      .order("name")
      .limit(300);
    return data ?? [];
  } catch {
    return [];
  }
}

const SPORT_EMOJI: Record<string, string> = {
  football: "🏈", basketball: "🏀", baseball: "⚾",
  soccer: "⚽", lacrosse: "🥍", wrestling: "🤼", "track-field": "🏃",
};

export default async function CompareSchoolsPage({
  searchParams,
}: {
  searchParams: Promise<{ schools?: string }>;
}) {
  const params = await searchParams;
  const slugs = (params.schools || "").split(",").filter(Boolean).slice(0, 2);

  const allSchools = await getAllSchoolSlugs();
  const schools: (SchoolStats | null)[] = await Promise.all(
    slugs.map(slug => getSchoolComparison(slug))
  );

  const validSchools = schools.filter(Boolean) as SchoolStats[];
  const h2h = validSchools.length === 2
    ? await getHeadToHead(validSchools[0].id, validSchools[1].id)
    : null;

  const COMPARE_ROWS = [
    { label: "All-Time Record", key: "record" },
    { label: "Win %", key: "winPct" },
    { label: "Championships", key: "championships" },
    { label: "Pro Alumni", key: "proAlumni" },
    { label: "Seasons Played", key: "seasons" },
    { label: "Sports", key: "sports" },
    { label: "League", key: "league" },
    { label: "City", key: "city" },
  ];

  function getStatValue(school: SchoolStats, key: string): string | number {
    switch (key) {
      case "record": return `${school.totalWins}-${school.totalLosses}-${school.totalTies}`;
      case "winPct": return school.winPct;
      case "championships": return school.championships;
      case "proAlumni": return school.proAlumni;
      case "seasons": return school.seasons;
      case "sports": return school.sports.length;
      case "league": return school.league || "—";
      case "city": return school.city || "—";
      default: return "—";
    }
  }

  function getNumericValue(school: SchoolStats, key: string): number {
    switch (key) {
      case "winPct": return school.winPct;
      case "championships": return school.championships;
      case "proAlumni": return school.proAlumni;
      case "seasons": return school.seasons;
      case "sports": return school.sports.length;
      default: return 0;
    }
  }

  return (
    <>
      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Compare Schools" }]} />
          <h1 className="text-4xl md:text-5xl text-white tracking-wider mt-4" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
            Compare Schools
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Side-by-side program comparison — records, titles, and pro alumni
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* School Pickers */}
        <form className="flex flex-wrap gap-4 mb-8" method="GET" action="/compare-schools">
          <select
            name="school1"
            defaultValue={slugs[0] || ""}
            className="px-4 py-3 rounded-lg border text-sm flex-1 min-w-[200px]"
            style={{ borderColor: "var(--psp-navy)", color: "var(--psp-navy)" }}
          >
            <option value="">Select School 1...</option>
            {allSchools.map(s => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>

          <span className="self-center text-lg font-bold" style={{ color: "var(--psp-gold)" }}>VS</span>

          <select
            name="school2"
            defaultValue={slugs[1] || ""}
            className="px-4 py-3 rounded-lg border text-sm flex-1 min-w-[200px]"
            style={{ borderColor: "var(--psp-navy)", color: "var(--psp-navy)" }}
          >
            <option value="">Select School 2...</option>
            {allSchools.map(s => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg text-sm font-bold transition-colors"
            style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
            // JS needed to build the URL on submit
          >
            Compare
          </button>
        </form>

        {/* Client-side form handler */}
        <script dangerouslySetInnerHTML={{ __html: `
          document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            var s1 = this.querySelector('[name=school1]').value;
            var s2 = this.querySelector('[name=school2]').value;
            if (s1 && s2) window.location.href = '/compare-schools?schools=' + s1 + ',' + s2;
            else if (s1) window.location.href = '/compare-schools?schools=' + s1;
          });
        `}} />

        {validSchools.length === 2 ? (
          <>
            {/* School headers */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-6 rounded-lg" style={{ background: "var(--psp-navy)", color: "white" }}>
                <Link href={`/schools/${validSchools[0].slug}`} className="hover:underline">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                    {validSchools[0].name}
                  </h2>
                </Link>
                <p className="text-sm text-gray-400 mt-1">
                  {validSchools[0].city} {validSchools[0].mascot ? `• ${validSchools[0].mascot}` : ""}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-black" style={{ color: "var(--psp-gold)", fontFamily: "Barlow Condensed, sans-serif" }}>VS</span>
              </div>
              <div className="text-center p-6 rounded-lg" style={{ background: "var(--psp-navy)", color: "white" }}>
                <Link href={`/schools/${validSchools[1].slug}`} className="hover:underline">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                    {validSchools[1].name}
                  </h2>
                </Link>
                <p className="text-sm text-gray-400 mt-1">
                  {validSchools[1].city} {validSchools[1].mascot ? `• ${validSchools[1].mascot}` : ""}
                </p>
              </div>
            </div>

            {/* Head-to-Head */}
            {h2h && (h2h.wins + h2h.losses + h2h.ties) > 0 && (
              <div className="mb-8 p-6 rounded-lg border" style={{ borderColor: "var(--psp-gold)" }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                  Head-to-Head Record
                </h3>
                <div className="grid grid-cols-3 text-center">
                  <div>
                    <div className="text-3xl font-black" style={{ color: h2h.wins >= h2h.losses ? "var(--psp-gold)" : "var(--psp-gray-400)", fontFamily: "Barlow Condensed, sans-serif" }}>
                      {h2h.wins}
                    </div>
                    <div className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                      {validSchools[0].short_name || validSchools[0].name} Wins
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-black" style={{ color: "var(--psp-gray-400)", fontFamily: "Barlow Condensed, sans-serif" }}>
                      {h2h.ties}
                    </div>
                    <div className="text-sm" style={{ color: "var(--psp-gray-500)" }}>Ties</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black" style={{ color: h2h.losses >= h2h.wins ? "var(--psp-gold)" : "var(--psp-gray-400)", fontFamily: "Barlow Condensed, sans-serif" }}>
                      {h2h.losses}
                    </div>
                    <div className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                      {validSchools[1].short_name || validSchools[1].name} Wins
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stat comparison table */}
            <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              {COMPARE_ROWS.map((row, i) => {
                const valA = getStatValue(validSchools[0], row.key);
                const valB = getStatValue(validSchools[1], row.key);
                const numA = getNumericValue(validSchools[0], row.key);
                const numB = getNumericValue(validSchools[1], row.key);
                const aWins = numA > numB;
                const bWins = numB > numA;
                const isNumeric = ["winPct", "championships", "proAlumni", "seasons", "sports"].includes(row.key);

                return (
                  <div
                    key={row.key}
                    className="grid grid-cols-3 gap-4 items-center py-3 px-4"
                    style={{ borderBottom: i < COMPARE_ROWS.length - 1 ? "1px solid var(--border)" : "none", background: i % 2 === 0 ? "transparent" : "var(--bg-alt, rgba(0,0,0,0.02))" }}
                  >
                    <div
                      className="text-right font-bold text-lg"
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        color: isNumeric && aWins ? "var(--psp-gold)" : "var(--text)",
                      }}
                    >
                      {valA}
                    </div>
                    <div className="text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--psp-gray-400)" }}>
                      {row.label}
                    </div>
                    <div
                      className="text-left font-bold text-lg"
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        color: isNumeric && bWins ? "var(--psp-gold)" : "var(--text)",
                      }}
                    >
                      {valB}
                    </div>
                  </div>
                );
              })}
            </div>

            <PSPPromo size="banner" variant={2} />

            {/* Recent H2H Games */}
            {h2h && h2h.games.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                  Recent Matchups
                </h3>
                <div className="space-y-2">
                  {h2h.games.map((g: any, i: number) => {
                    const aIsHome = g.home_school_id === validSchools[0].id;
                    const aScore = aIsHome ? g.home_score : g.away_score;
                    const bScore = aIsHome ? g.away_score : g.home_score;
                    const emoji = SPORT_EMOJI[g.sport_id] || "🏅";
                    const isPlayoff = g.game_type && g.game_type !== "regular";

                    return (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg border" style={{ borderColor: "var(--border)" }}>
                        <span className="text-sm" style={{ color: "var(--psp-gray-400)" }}>
                          {g.game_date || "—"}
                        </span>
                        <span>{emoji}</span>
                        <span className="flex-1 font-medium" style={{ color: aScore > bScore ? "var(--psp-gold)" : "var(--text)" }}>
                          {validSchools[0].short_name || validSchools[0].name} {aScore}
                        </span>
                        <span className="text-sm" style={{ color: "var(--psp-gray-400)" }}>vs</span>
                        <span className="flex-1 font-medium text-right" style={{ color: bScore > aScore ? "var(--psp-gold)" : "var(--text)" }}>
                          {bScore} {validSchools[1].short_name || validSchools[1].name}
                        </span>
                        {isPlayoff && (
                          <span className="text-xs px-2 py-1 rounded" style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}>
                            Playoff
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
            <div className="text-6xl mb-4">🏫 vs 🏫</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
              Select two schools to compare
            </h3>
            <p className="text-sm mb-8">
              Pick any two schools above to see how their programs stack up — records, championships, pro alumni, and head-to-head history.
            </p>

            {/* Suggested Matchups */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { title: "Catholic League Classic", a: "st-josephs-prep", b: "la-salle-college-high-school", emoji: "⛪" },
                { title: "Public League Powerhouses", a: "imhotep-charter", b: "martin-luther-king-high-school", emoji: "🏙️" },
                { title: "Inter-Ac Rivalry", a: "haverford-school", b: "episcopal-academy", emoji: "🎓" },
              ].map(matchup => (
                <Link
                  key={matchup.title}
                  href={`/compare-schools?schools=${matchup.a},${matchup.b}`}
                  className="p-4 rounded-lg border hover:border-[var(--psp-gold)] transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="text-2xl mb-2">{matchup.emoji}</div>
                  <div className="font-bold text-sm" style={{ color: "var(--psp-navy)" }}>{matchup.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <PSPPromo size="banner" variant={4} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Compare Schools — PhillySportsPack",
            url: "https://phillysportspack.com/compare-schools",
          }),
        }}
      />
    </>
  );
}
