import Link from "next/link";
import PSPPromo from "@/components/ads/PSPPromo";

interface SportLayoutAProps {
  sport: string;
  sportColor: string;
  meta: { name: string; emoji: string; color: string; statCategories: string[] };
  overview: { players: number; schools: number; seasons: number; championships: number };
  champions: any[];
  schools: any[];
  featured: any[];
  freshness: any;
}

export default function SportLayoutA({ sport, sportColor, meta, overview, champions, schools, featured, freshness }: SportLayoutAProps) {
  const topStory = featured?.[0];
  const moreStories = featured?.slice(1) || [];

  return (
    <div className="espn-container">
      <main>
        {/* Full-Width Featured Story Hero */}
        {topStory ? (
          <Link href={`/articles/${topStory.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div
              style={{
                position: "relative",
                height: 320,
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 20,
                background: topStory.featured_image_url
                  ? `url(${topStory.featured_image_url}) center / cover`
                  : `linear-gradient(135deg, ${meta.color}cc 0%, var(--psp-navy) 100%)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(0deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.2) 50%, transparent 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  background: sportColor,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "4px 10px",
                  borderRadius: 3,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                FEATURED
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1.15,
                    marginBottom: 8,
                    fontFamily: '"Bebas Neue", sans-serif',
                    maxWidth: 600,
                  }}
                >
                  {topStory.title}
                </h2>
                {topStory.excerpt && (
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,.7)", maxWidth: 500, lineHeight: 1.4 }}>
                    {topStory.excerpt}
                  </p>
                )}
                <div style={{ fontSize: 11, color: "var(--psp-gold)", fontWeight: 700, marginTop: 8 }}>
                  {topStory.published_at
                    ? new Date(topStory.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : ""}
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="hero-card">
            <div className="hero-tag">{meta.name}</div>
            <div className="hero-img" style={{ background: `linear-gradient(180deg, ${meta.color}88 0%, rgba(10,22,40,.95) 100%)` }}>
              <div>
                <h2>Philadelphia High School {meta.name}</h2>
                <div className="hero-sub">{overview.players.toLocaleString()} players, {overview.schools.toLocaleString()} schools tracked</div>
              </div>
            </div>
          </div>
        )}

        {/* Story Grid (2-column) */}
        {moreStories.length > 0 && (
          <>
            <div className="sec-head">
              <h2>Latest {meta.name} Stories</h2>
              <Link href="/articles" className="more">All Articles &#8594;</Link>
            </div>
            <div className="stories">
              {moreStories.map((article: any) => (
                <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="story">
                    <div
                      className="s-img"
                      style={{
                        background: article.featured_image_url
                          ? `url(${article.featured_image_url}) center / cover`
                          : `linear-gradient(135deg, ${meta.color}66, var(--psp-navy))`,
                      }}
                    />
                    <div className="s-body">
                      <div className="s-tag" style={{ color: sportColor }}>{meta.name}</div>
                      <h4>{article.title}</h4>
                      <p>{article.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Recent Champions */}
        {champions.length > 0 && (
          <>
            <div className="sec-head">
              <h2>Recent Champions</h2>
              <Link href={`/${sport}/championships`} className="more">All Championships &#8594;</Link>
            </div>
            <div className="rank-table">
              <div className="rt-head">Championship History</div>
              {champions.map((champ: any, i: number) => (
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

        {/* Quick Nav Cards */}
        <div className="sec-head"><h2>Explore {meta.name}</h2></div>
        <div className="ldr-grid">
          <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Leaderboards</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📊</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Top performers by stat</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>{meta.statCategories.join(", ")}</div>
            </div>
          </Link>
          <Link href={`/${sport}/records`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Records</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🏅</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>All-time records</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>Single-season and career milestones</div>
            </div>
          </Link>
          <Link href={`/${sport}/championships`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Championships</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🏆</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Title history</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>League, state, and national titles</div>
            </div>
          </Link>
        </div>

        {/* Schools */}
        {schools.length > 0 && (
          <>
            <div className="sec-head"><h2>Schools</h2></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
              {schools.map((school: any) => (
                <Link
                  key={school.id}
                  href={`/${sport}/schools/${school.slug}`}
                  style={{
                    display: "inline-block",
                    padding: "5px 12px",
                    background: "#fff",
                    border: "1px solid var(--g100)",
                    borderRadius: 3,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text)",
                    textDecoration: "none",
                  }}
                >
                  {school.name}
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
          <div className="w-head">{meta.emoji} Quick Stats</div>
          <div className="w-body">
            <div className="w-row"><span className="name">Players</span><span className="val">{overview.players.toLocaleString()}</span></div>
            <div className="w-row"><span className="name">Schools</span><span className="val">{overview.schools.toLocaleString()}</span></div>
            <div className="w-row"><span className="name">Seasons</span><span className="val">{overview.seasons.toLocaleString()}</span></div>
            <div className="w-row"><span className="name">Championships</span><span className="val">{overview.championships.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Mini Leaderboard */}
        <div className="widget">
          <div className="w-head">📊 Top Performers</div>
          <div className="w-body">
            <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="w-link">&#8594; {meta.statCategories[0]} Leaders</Link>
            {meta.statCategories[1] && (
              <Link href={`/${sport}/leaderboards/${meta.statCategories[1]}`} className="w-link">&#8594; {meta.statCategories[1]} Leaders</Link>
            )}
          </div>
        </div>

        <div className="widget">
          <div className="w-head">{meta.emoji} Tools</div>
          <div className="w-body">
            <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="w-link">&#8594; Leaderboards</Link>
            <Link href={`/${sport}/championships`} className="w-link">&#8594; Championship History</Link>
            <Link href={`/${sport}/records`} className="w-link">&#8594; Records</Link>
            <Link href={`/search?sport=${sport}`} className="w-link">&#8594; Player Search</Link>
            <Link href="/compare" className="w-link">&#8594; Compare Players</Link>
          </div>
        </div>

        <PSPPromo size="sidebar" variant={1} />
        <PSPPromo size="sidebar" variant={2} />
      </aside>
    </div>
  );
}
