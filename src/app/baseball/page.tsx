import Link from "next/link";
import type { Metadata } from "next";
import AdPlaceholder from "@/components/ads/AdPlaceholder";
import { getSportOverview, getRecentChampions, getSchoolsBySport } from "@/lib/data";

export const revalidate = 3600;

const BASEBALL_COLOR = "var(--base)"; // #dc2626

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Baseball — PhillySportsPack",
    description:
      "Philadelphia high school baseball stats, schools, leaderboards, records, and championships. Featuring La Salle, Father Judge, Penn Charter, and more.",
    openGraph: {
      title: "Baseball — PhillySportsPack",
      description: "Philadelphia high school baseball stats and championships",
      url: "https://phillysportspack.com/baseball",
    },
  };
}

export default async function BaseballPage() {
  const [overview, champions, schools] = await Promise.all([
    getSportOverview("baseball"),
    getRecentChampions("baseball", 10),
    getSchoolsBySport("baseball", 40),
  ]);

  const SUB_NAV = [
    { href: "/baseball", label: "Home" },
    { href: "/baseball/leaderboards/batting", label: "Leaders" },
    { href: "/baseball/championships", label: "Championships" },
    { href: "/baseball/records", label: "Records" },
    { href: "/search?sport=baseball", label: "Teams" },
  ];

  // Dummy news articles
  const NEWS_ITEMS = [
    {
      title: "La Salle Wins Third PIAA State Title in Four Years",
      snippet:
        "The Explorers clinch their dominant dynasty with a 5-2 victory over Unionville in the PIAA 4A finals.",
      image: "https://placehold.co/300x180/dc2626/ffffff?text=Baseball+1",
      tag: "State Title",
      timestamp: "2 days ago",
    },
    {
      title: "Neumann-Goretti Repeats as PIAA 2A State Champions",
      snippet:
        "Saints secure back-to-back championships with dominant pitching performance and defensive excellence.",
      image: "https://placehold.co/300x180/dc2626/ffffff?text=Baseball+2",
      tag: "Champions",
      timestamp: "1 week ago",
    },
    {
      title: "Malvern Prep's Star Shortstop Selected in MLB Draft",
      snippet:
        "Marcus Williams becomes the 6th alumnus drafted since 2015, continuing Malvern's strong MLB pipeline.",
      image: "https://placehold.co/300x180/dc2626/ffffff?text=Baseball+3",
      tag: "Pro",
      timestamp: "2 weeks ago",
    },
    {
      title: "Catholic League All-Star Game Preview",
      snippet:
        "Top prospects from across the Catholic League battle for All-Star honors in the annual showcase event.",
      image: "https://placehold.co/300x180/dc2626/ffffff?text=Baseball+4",
      tag: "All-Stars",
      timestamp: "3 weeks ago",
    },
  ];

  // Dummy standings data
  const STANDINGS = {
    "Catholic League": [
      { team: "La Salle", wins: 14, losses: 2, pct: ".875" },
      { team: "Father Judge", wins: 12, losses: 4, pct: ".750" },
      { team: "Roman Catholic", wins: 10, losses: 6, pct: ".625" },
      { team: "Neumann-Goretti", wins: 9, losses: 7, pct: ".563" },
      { team: "Arch. Wood", wins: 7, losses: 9, pct: ".438" },
      { team: "Bonner-Prendergast", wins: 5, losses: 11, pct: ".313" },
    ],
    "Inter-Ac": [
      { team: "Penn Charter", wins: 12, losses: 0, pct: "1.000" },
      { team: "Haverford School", wins: 10, losses: 2, pct: ".833" },
      { team: "Episcopal Academy", wins: 8, losses: 4, pct: ".667" },
      { team: "Germantown Academy", wins: 6, losses: 6, pct: ".500" },
    ],
  };

  // Dummy schedule data
  const THIS_WEEK = [
    { day: "Monday", games: ["La Salle vs Roman 4pm", "Father Judge vs Arch. Wood 4pm"] },
    { day: "Wednesday", games: ["Penn Charter vs Episcopal 3:30pm", "Neumann-Goretti vs Bonner 4pm"] },
    { day: "Friday", games: ["La Salle vs Neumann-Goretti 4pm", "Father Judge vs Roman 4pm"] },
  ];

  // Top performers
  const TOP_PERFORMERS = [
    { category: "Batting", name: "Jake Morrison", school: "La Salle", stat: "4-for-5, 2 HR, 5 RBI" },
    { category: "Pitching", name: "Chris Williams", school: "Father Judge", stat: "7 IP, 12 K, 0 ER" },
    { category: "Fielding", name: "Marcus Lee", school: "Penn Charter", stat: "3 assists, 0 errors, 2B" },
  ];

  // MLB Alumni
  const MLB_ALUMNI = [
    { name: "Mike Piazza", hs: "Phoenixville HS", mlb: "Hall of Famer", emoji: "⚾" },
    { name: "Reggie Jackson", hs: "Cheltenham HS", mlb: "Hall of Famer", emoji: "🏆" },
    { name: "Roy Campanella", hs: "Simon Gratz HS", mlb: "Hall of Famer", emoji: "🏆" },
  ];

  // More stories
  const MORE_STORIES = [
    {
      title: "Penn Charter Pipeline: 6 Alumni in Professional Baseball",
      tag: "Alumni",
      image: "https://placehold.co/300x180/dc2626/ffffff?text=Alumni",
    },
    {
      title: "Catholic League's Top Pitching Prospects for 2025",
      tag: "Prospects",
      image: "https://placehold.co/300x180/dc2626/ffffff?text=Prospects",
    },
    {
      title: "Haverford School's 10-Game Win Streak",
      tag: "Streak",
      image: "https://placehold.co/300x180/dc2626/ffffff?text=Streak",
    },
    {
      title: "2025 Spring Season Preview & Predictions",
      tag: "Preview",
      image: "https://placehold.co/300x180/dc2626/ffffff?text=Preview",
    },
  ];

  return (
    <>
      {/* Sport Header Bar */}
      <div className="sport-hdr" style={{ borderBottomColor: BASEBALL_COLOR }}>
        <div className="sport-hdr-inner">
          <span style={{ fontSize: 28 }}>⚾</span>
          <h1>Baseball</h1>
          <div className="stat-pills">
            <div className="pill">
              <strong>{overview.players.toLocaleString()}</strong> players
            </div>
            <div className="pill">
              <strong>{overview.schools.toLocaleString()}</strong> schools
            </div>
            <div className="pill">
              <strong>{overview.championships.toLocaleString()}</strong> titles
            </div>
            <span className="db-tag">
              <span className="dot" /> Live
            </span>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="subnav">
        <div className="subnav-inner">
          {SUB_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={item.label === "Home" ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="espn-container">
        <main>
          {/* Hero Section with Featured Story */}
          <div className="hero-card">
            <div className="hero-tag">Featured</div>
            <div
              className="hero-img"
              style={{
                backgroundImage:
                  "url('https://placehold.co/800x400/dc2626/ffffff?text=Baseball+Action')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(180deg, rgba(220,38,38,.4) 0%, rgba(10,22,40,.95) 100%)",
                  padding: "40px 20px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <h2 style={{ fontSize: 28, lineHeight: 1.2, marginBottom: 8 }}>
                  La Salle Wins Third PIAA State Title in Four Years
                </h2>
                <div className="hero-sub">
                  Explorers complete dominant dynasty run with back-to-back championships and undefeated Catholic League
                  record
                </div>
              </div>
            </div>
          </div>

          {/* Latest News Grid */}
          <div className="sec-head">
            <h2>Latest News</h2>
            <Link href="/articles?sport=baseball" className="more">
              All News &#8594;
            </Link>
          </div>
          <div className="headline-list">
            {NEWS_ITEMS.map((article, i) => (
              <div key={i} className="hl-item">
                <div
                  className="hl-img"
                  style={{
                    backgroundImage: `url('${article.image}')`,
                  }}
                />
                <div className="hl-text">
                  <div className="hl-tag" style={{ background: BASEBALL_COLOR, color: "#fff" }}>
                    {article.tag}
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.snippet}</p>
                  <div className="meta">{article.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Standings Section */}
          <div className="sec-head">
            <h2>2025 Spring Standings</h2>
            <Link href="/baseball/records" className="more">
              Full Standings &#8594;
            </Link>
          </div>
          <div className="standings-grid">
            {Object.entries(STANDINGS).map(([league, teams]) => (
              <div key={league} className="standings-card">
                <div className="st-head" style={{ background: BASEBALL_COLOR }}>
                  {league}
                </div>
                <table className="st-tbl">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th className="rec">W</th>
                      <th className="rec">L</th>
                      <th className="pct">PCT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, idx) => (
                      <tr key={idx}>
                        <td>
                          <Link href={`/search?q=${team.team}&sport=baseball`} className="team-link">
                            {team.team}
                          </Link>
                        </td>
                        <td className="rec">{team.wins}</td>
                        <td className="rec">{team.losses}</td>
                        <td className="pct">{team.pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* This Week's Schedule */}
          <div className="sec-head">
            <h2>This Week's Schedule</h2>
          </div>
          <div style={{ background: "#fff", border: "1px solid var(--g100)", borderRadius: 4, padding: "12px 14px", marginBottom: 16 }}>
            {THIS_WEEK.map((dayBlock, i) => (
              <div key={i} style={{ marginBottom: i < THIS_WEEK.length - 1 ? "12px" : 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: BASEBALL_COLOR, marginBottom: 4 }}>
                  {dayBlock.day}
                </div>
                {dayBlock.games.map((game, j) => (
                  <div key={j} style={{ fontSize: 12, color: "var(--text)", marginBottom: j < dayBlock.games.length - 1 ? 4 : 0 }}>
                    ⚾ {game}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Top Performers This Week */}
          <div className="sec-head">
            <h2>Top Performers This Week</h2>
          </div>
          <div style={{ background: "#fff", border: "1px solid var(--g100)", borderRadius: 4, marginBottom: 16 }}>
            {TOP_PERFORMERS.map((perf, i) => (
              <div key={i} style={{ padding: "10px 14px", borderBottom: i < TOP_PERFORMERS.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: BASEBALL_COLOR, marginBottom: 2 }}>
                  {perf.category}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
                  <Link href={`/search?q=${perf.name}`} style={{ color: "var(--link)" }}>
                    {perf.name}
                  </Link>
                  {" — "}
                  <Link href={`/search?q=${perf.school}`} style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                    {perf.school}
                  </Link>
                </div>
                <div style={{ fontSize: 12, color: "var(--g400)" }}>{perf.stat}</div>
              </div>
            ))}
          </div>

          {/* Explore Baseball */}
          <div className="sec-head">
            <h2>Explore Baseball</h2>
          </div>
          <div className="ldr-grid">
            <Link
              href="/baseball/leaderboards/batting"
              className="ldr-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="ldr-head" style={{ background: BASEBALL_COLOR }}>
                Leaderboards
              </div>
              <div style={{ padding: "12px" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>📊</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Top performers by stat</div>
                <div style={{ fontSize: 11, color: "var(--g400)" }}>Batting, Pitching</div>
              </div>
            </Link>
            <Link
              href="/baseball/records"
              className="ldr-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="ldr-head" style={{ background: BASEBALL_COLOR }}>
                Records
              </div>
              <div style={{ padding: "12px" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🏅</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>All-time records</div>
                <div style={{ fontSize: 11, color: "var(--g400)" }}>Single-season & career milestones</div>
              </div>
            </Link>
            <Link
              href="/baseball/championships"
              className="ldr-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="ldr-head" style={{ background: BASEBALL_COLOR }}>
                Championships
              </div>
              <div style={{ padding: "12px" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🏆</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Title history</div>
                <div style={{ fontSize: 11, color: "var(--g400)" }}>State & league champions</div>
              </div>
            </Link>
          </div>

          {/* Recent Champions */}
          {champions.length > 0 && (
            <>
              <div className="sec-head">
                <h2>Recent State Champions</h2>
                <Link href="/baseball/championships" className="more">
                  All Titles &#8594;
                </Link>
              </div>
              <div className="rank-table">
                <div className="rt-head">Championship History</div>
                {champions.slice(0, 5).map((champ: any, i: number) => (
                  <div key={champ.id} className="rt-row">
                    <div className="rt-num" style={{ background: i < 3 ? BASEBALL_COLOR : "var(--g300)" }}>
                      {i + 1}
                    </div>
                    <div className="rt-info">
                      <Link
                        href={`/schools/${champ.schools?.slug}`}
                        className="rname"
                        style={{ color: "var(--link)" }}
                      >
                        {champ.schools?.name}
                      </Link>
                      <div className="rsub">
                        {champ.seasons?.label} — {champ.level}
                        {champ.score ? ` (${champ.score})` : ""}
                      </div>
                    </div>
                    <div className="rt-rec">🏆</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* MLB Alumni Pipeline */}
          <div className="sec-head">
            <h2>MLB Alumni Pipeline</h2>
            <Link href="/next-level" className="more">
              All Athletes &#8594;
            </Link>
          </div>
          <div className="alumni-strip">
            {MLB_ALUMNI.map((alumni) => (
              <div key={alumni.name} className="a-card">
                <div className="a-emoji">{alumni.emoji}</div>
                <div className="a-name">{alumni.name}</div>
                <div className="a-team">{alumni.mlb}</div>
                <div className="a-hs">{alumni.hs}</div>
              </div>
            ))}
          </div>

          {/* More Stories */}
          <div className="sec-head">
            <h2>More Stories</h2>
          </div>
          <div className="stories">
            {MORE_STORIES.map((story, i) => (
              <div key={i} className="story">
                <div
                  className="s-img"
                  style={{
                    backgroundImage: `url('${story.image}')`,
                  }}
                />
                <div className="s-body">
                  <div className="s-tag" style={{ background: BASEBALL_COLOR, color: "#fff" }}>
                    {story.tag}
                  </div>
                  <h4>{story.title}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Schools Directory */}
          {schools.length > 0 && (
            <>
              <div className="sec-head">
                <h2>Teams</h2>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                {schools.map((school: any) => (
                  <Link
                    key={school.id}
                    href={`/schools/${school.slug}`}
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
                      transition: ".1s",
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
          {/* Season Stats Widget */}
          <div className="widget">
            <div className="w-head">⚾ 2025 Season Stats</div>
            <div className="w-body">
              <div className="w-row">
                <span className="name">Players</span>
                <span className="val">{overview.players.toLocaleString()}</span>
              </div>
              <div className="w-row">
                <span className="name">Teams</span>
                <span className="val">{overview.schools.toLocaleString()}</span>
              </div>
              <div className="w-row">
                <span className="name">Seasons</span>
                <span className="val">{overview.seasons.toLocaleString()}</span>
              </div>
              <div className="w-row">
                <span className="name">Championships</span>
                <span className="val">{overview.championships.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Season Batting Leaders */}
          <div className="widget">
            <div className="w-head">🏆 Batting Leaders</div>
            <div className="w-body">
              <div className="w-row">
                <span className="rank top">1</span>
                <span className="name">Jake Morrison</span>
                <span className="val" style={{ fontSize: 11 }}>
                  .485
                </span>
              </div>
              <div className="w-row">
                <span className="rank top">2</span>
                <span className="name">Chris Rodriguez</span>
                <span className="val" style={{ fontSize: 11 }}>
                  .465
                </span>
              </div>
              <div className="w-row">
                <span className="rank">3</span>
                <span className="name">Tommy Chen</span>
                <span className="val" style={{ fontSize: 11 }}>
                  .441
                </span>
              </div>
              <div className="w-row">
                <span className="rank">4</span>
                <span className="name">Derek Martinez</span>
                <span className="val" style={{ fontSize: 11 }}>
                  .428
                </span>
              </div>
              <div className="w-row">
                <span className="rank">5</span>
                <span className="name">Alex Thompson</span>
                <span className="val" style={{ fontSize: 11 }}>
                  .412
                </span>
              </div>
            </div>
          </div>

          {/* Recent Scores */}
          <div className="widget">
            <div className="w-head">⚾ Recent Scores</div>
            <div className="w-body">
              <div
                style={{
                  padding: "8px 14px",
                  borderBottom: "1px solid #f5f5f5",
                  fontSize: 11,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 2 }}>La Salle 8</div>
                <div style={{ color: "var(--g400)" }}>Roman 3 · Final</div>
              </div>
              <div
                style={{
                  padding: "8px 14px",
                  borderBottom: "1px solid #f5f5f5",
                  fontSize: 11,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Penn Charter 5</div>
                <div style={{ color: "var(--g400)" }}>Episcopal 2 · Final</div>
              </div>
              <div
                style={{
                  padding: "8px 14px",
                  borderBottom: "1px solid #f5f5f5",
                  fontSize: 11,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Father Judge 6</div>
                <div style={{ color: "var(--g400)" }}>Arch. Wood 4 · Final</div>
              </div>
              <div style={{ padding: "8px 14px", fontSize: 11 }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>N-G 3</div>
                <div style={{ color: "var(--g400)" }}>Bonner 1 · Final</div>
              </div>
            </div>
          </div>

          {/* Tools Widget */}
          <div className="widget">
            <div className="w-head">⚙️ Tools</div>
            <div className="w-body">
              <Link href="/baseball/leaderboards/batting" className="w-link">
                &#8594; Batting Leaders
              </Link>
              <Link href="/baseball/leaderboards/pitching" className="w-link">
                &#8594; Pitching Leaders
              </Link>
              <Link href="/baseball/championships" className="w-link">
                &#8594; Championship History
              </Link>
              <Link href="/baseball/records" className="w-link">
                &#8594; Records
              </Link>
              <Link href="/search?sport=baseball" className="w-link">
                &#8594; Player Search
              </Link>
              <Link href="/compare" className="w-link">
                &#8594; Compare Players
              </Link>
            </div>
          </div>

          {/* Ad Space */}
          <AdPlaceholder size="sidebar-rect" id="psp-baseball-rail" />
          <AdPlaceholder size="sidebar-tall" id="psp-baseball-rail-2" />
        </aside>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Philadelphia High School Baseball",
            description:
              "Comprehensive baseball database for Philadelphia area high schools including stats, leaderboards, records, and championships.",
            url: "https://phillysportspack.com/baseball",
            isPartOf: {
              "@type": "WebSite",
              name: "PhillySportsPack",
              url: "https://phillysportspack.com",
            },
            about: {
              "@type": "Thing",
              name: "High School Baseball",
            },
          }),
        }}
      />
    </>
  );
}
