import Link from "next/link";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Championship } from "@/lib/data/types";

interface FeaturedArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string | null;
}

interface DataFreshness {
  lastUpdated?: string;
  source?: string;
  lastVerified?: string;
}

type SchoolData = { name: string; slug: string; city?: string; state?: string; id?: number; mascot?: string; leagues?: { name?: string; short_name?: string } | null };

interface SportLayoutCProps {
  sport: string;
  sportColor: string;
  meta: { name: string; emoji: string; color: string; statCategories: string[] };
  overview: { players: number; schools: number; seasons: number; championships: number };
  champions: Championship[];
  schools: SchoolData[];
  featured: FeaturedArticle[];
  freshness: DataFreshness | null;
}

// Group schools by league name
function groupByLeague(schools: SchoolData[]): Record<string, SchoolData[]> {
  const groups: Record<string, SchoolData[]> = {};
  for (const school of schools) {
    const league = school.leagues?.name || school.leagues?.short_name || "Independent";
    if (!groups[league]) groups[league] = [];
    groups[league].push(school);
  }
  // Sort groups: Catholic League first, then Public, then alphabetical
  const priority = ["Catholic League", "Philadelphia Catholic League", "Public League", "Philadelphia Public League", "Inter-Ac League"];
  const sorted: Record<string, SchoolData[]> = {};
  for (const p of priority) {
    for (const key of Object.keys(groups)) {
      if (key.includes(p.split(" ")[0]) && !sorted[key]) {
        sorted[key] = groups[key];
      }
    }
  }
  for (const key of Object.keys(groups).sort()) {
    if (!sorted[key]) sorted[key] = groups[key];
  }
  return sorted;
}

const LEAGUE_COLORS: Record<string, string> = {
  Catholic: "#7c3aed",
  Public: "#059669",
  "Inter-Ac": "#0891b2",
  Central: "#ea580c",
  SOL: "#16a34a",
  "Del Val": "#dc2626",
  Independent: "#94a3b8",
};

function getLeagueColor(leagueName: string): string {
  for (const [key, color] of Object.entries(LEAGUE_COLORS)) {
    if (leagueName.includes(key)) return color;
  }
  return "#64748b";
}

export default function SportLayoutC({ sport, sportColor, meta, overview, champions, schools, featured, freshness }: SportLayoutCProps) {
  const leagueGroups = groupByLeague(schools);
  const leagueNames = Object.keys(leagueGroups);

  // Featured school spotlight: pick the first school from champions
  const spotlightSchool = champions[0]?.schools;

  return (
    <div className="espn-container">
      <main>
        {/* Featured School Spotlight */}
        {spotlightSchool && (
          <Link href={`/${sport}/schools/${spotlightSchool.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div
              style={{
                background: `linear-gradient(135deg, ${sportColor}dd, var(--psp-navy))`,
                borderRadius: 6,
                padding: 24,
                marginBottom: 20,
                color: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "var(--psp-gold)",
                  color: "var(--psp-navy)",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "4px 10px",
                  borderRadius: 3,
                  textTransform: "uppercase",
                }}
              >
                REIGNING CHAMPION
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                School Spotlight
              </div>
              <h2 className="psp-h2 text-white" style={{ marginBottom: 6 }}>
                {spotlightSchool.name}
              </h2>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.7)" }}>
                {champions[0]?.seasons?.label} {champions[0]?.level} Champion
                {champions[0]?.score ? ` (${champions[0].score})` : ""}
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 20, fontSize: 12 }}>
                <span><strong style={{ color: "var(--psp-gold)" }}>{overview.championships.toLocaleString()}</strong> total titles</span>
                <span><strong style={{ color: "var(--psp-gold)" }}>{overview.schools.toLocaleString()}</strong> schools</span>
                <span><strong style={{ color: "var(--psp-gold)" }}>{overview.players.toLocaleString()}</strong> players</span>
              </div>
            </div>
          </Link>
        )}

        {/* League Sections */}
        {leagueNames.map((league) => {
          const leagueColor = getLeagueColor(league);
          const leagueSchools = leagueGroups[league];

          return (
            <div key={league} style={{ marginBottom: 24 }}>
              <div className="sec-head">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: leagueColor, flexShrink: 0 }} />
                  <h2>{league}</h2>
                </div>
                <span style={{ fontSize: 11, color: "var(--g400)", marginLeft: "auto" }}>
                  {leagueSchools.length} {leagueSchools.length === 1 ? "school" : "schools"}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 10,
                }}
              >
                {leagueSchools.map((school) => (
                  <Link
                    key={school.id}
                    href={`/${sport}/schools/${school.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        background: "var(--psp-white)",
                        border: "1px solid var(--g100)",
                        borderRadius: 4,
                        borderLeft: `3px solid ${leagueColor}`,
                        padding: "12px 14px",
                        transition: ".15s",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
                        {school.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--g400)" }}>
                        {school.city || "Philadelphia"}{school.mascot ? ` � ${school.mascot}` : ""}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Championship History */}
        {champions.length > 0 && (
          <>
            <div className="sec-head">
              <h2>Recent Champions</h2>
              <Link href={`/${sport}/championships`} className="more">All Championships &#8594;</Link>
            </div>
            <div className="rank-table">
              <div className="rt-head">Title History</div>
              {champions.map((champ, i: number) => (
                <div key={champ.id} className="rt-row">
                  <div className="rt-num" style={{ background: i < 3 ? sportColor : "var(--g300)" }}>{i + 1}</div>
                  <div className="rt-info">
                    <Link href={`/${sport}/schools/${champ.schools?.slug}`} className="rname" style={{ color: "var(--link)" }}>
                      {champ.schools?.name}
                    </Link>
                    <div className="rsub">{champ.seasons?.label} &mdash; {champ.level}{champ.score ? ` (${champ.score})` : ""}</div>
                  </div>
                  <div className="rt-rec">🏆</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Quick Nav */}
        <div className="sec-head"><h2>Explore {meta.name}</h2></div>
        <div className="ldr-grid">
          <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Leaderboards</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📊</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Top performers</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>{meta.statCategories.join(", ")}</div>
            </div>
          </Link>
          <Link href={`/${sport}/records`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Records</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🏅</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>All-time records</div>
            </div>
          </Link>
          <Link href={`/${sport}/championships`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Championships</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🏆</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Title history</div>
            </div>
          </Link>
          <Link href={`/${sport}/rivalries`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Rivalries</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🔥</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Head-to-head</div>
            </div>
          </Link>
          <Link href={`/${sport}/eras`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: "var(--psp-blue)" }}>Statistical Eras</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📊</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Stat trends</div>
            </div>
          </Link>
          <Link href={`/${sport}/breakouts`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: "var(--psp-gold)" }}>Breakout Alerts</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>⚡</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Rising stars</div>
            </div>
          </Link>
        </div>

        {/* Featured Stories */}
        {featured && featured.length > 0 && (
          <>
            <div className="sec-head">
              <h2>Latest News</h2>
              <Link href="/articles" className="more">All Articles &#8594;</Link>
            </div>
            <div className="headline-list">
              {featured.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="hl-item">
                    <div
                      className="hl-img"
                      style={{
                        background: article.featured_image_url
                          ? `url(${article.featured_image_url}) center / cover`
                          : `linear-gradient(135deg, ${meta.color}66, var(--psp-navy))`,
                      }}
                    />
                    <div className="hl-text">
                      <h3>{article.title}</h3>
                      <p>{article.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Sidebar */}
      <aside className="sidebar">
        {freshness && (
          <div style={{ padding: "8px 12px", background: "#f3f4f6", borderLeft: "3px solid var(--psp-gold)", marginBottom: 16, borderRadius: 3 }}>
            <div style={{ fontSize: 10, color: "var(--psp-gray-400)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>
              {freshness.source ? `Data source: ${freshness.source}` : "Data updated"}
            </div>
          </div>
        )}

        <div className="widget">
          <div className="w-head">{meta.emoji} Leagues</div>
          <div className="w-body">
            {leagueNames.map((league) => (
              <div key={league} className="w-row">
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: getLeagueColor(league), flexShrink: 0 }} />
                <span className="name">{league}</span>
                <span className="val">{leagueGroups[league].length}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="widget">
          <div className="w-head">📊 Quick Stats</div>
          <div className="w-body">
            <div className="w-row"><span className="name">Players</span><span className="val">{overview.players.toLocaleString()}</span></div>
            <div className="w-row"><span className="name">Schools</span><span className="val">{overview.schools.toLocaleString()}</span></div>
            <div className="w-row"><span className="name">Championships</span><span className="val">{overview.championships.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="widget">
          <div className="w-head">{meta.emoji} Tools</div>
          <div className="w-body">
            <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="w-link">&#8594; Leaderboards</Link>
            <Link href={`/${sport}/championships`} className="w-link">&#8594; Championship History</Link>
            <Link href={`/${sport}/records`} className="w-link">&#8594; Records</Link>
            <Link href={`/${sport}/rivalries`} className="w-link">&#8594; Rivalries</Link>
            <Link href={`/${sport}/eras`} className="w-link">&#8594; Statistical Eras</Link>
            <Link href={`/${sport}/breakouts`} className="w-link">&#8594; Breakout Alerts</Link>
            <Link href={`/search?sport=${sport}`} className="w-link">&#8594; Player Search</Link>
            <Link href="/compare" className="w-link">&#8594; Compare Players</Link>
          </div>
        </div>

        <PSPPromo size="sidebar" variant={1} />
      </aside>
    </div>
  );
}
