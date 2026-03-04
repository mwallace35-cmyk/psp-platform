import Link from "next/link";
import type { Metadata } from "next";
import PSPPromo from "@/components/ads/PSPPromo";
import { getSportOverview, getRecentChampions, getSchoolsBySport } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Football — PhillySportsPack",
  description: "Philadelphia high school football stats, rankings, schedules, and championships. Coverage of St. Joseph's Prep, Imhotep Charter, La Salle, and more.",
  openGraph: {
    title: "Football — PhillySportsPack",
    description: "Philadelphia high school football stats, rankings, schedules, and championships.",
    url: "https://phillysportspack.com/football",
  },
};

const FOOTBALL_COLOR = "var(--fb)"; // #16a34a

// Dummy data for articles
const DUMMY_ARTICLES = [
  {
    id: 1,
    title: "SJP QB Samaj Jones Named 6A Player of the Year",
    snippet: "St. Joseph's Prep quarterback Samaj Jones earned the prestigious award after leading the Hawks to a state championship...",
    image: "https://placehold.co/300x180/16a34a/ffffff?text=SJP+QB",
    sport: "Football",
    timestamp: "2h ago",
  },
  {
    id: 2,
    title: "Imhotep Charter's Defense Dominates in Semifinal Win",
    snippet: "The Imhotep defense recorded 8 sacks and forced 4 turnovers in a dominant 31-14 victory over a strong Catholic League opponent...",
    image: "https://placehold.co/300x180/16a34a/ffffff?text=Imhotep+Defense",
    sport: "Football",
    timestamp: "5h ago",
  },
  {
    id: 3,
    title: "2025 PA All-State Selections: 11 Philly Players Earn Honors",
    snippet: "Philadelphia area high schools dominated the All-State selections with 11 players recognized across all classes, led by St. Joseph's Prep...",
    image: "https://placehold.co/300x180/16a34a/ffffff?text=All-State",
    sport: "Football",
    timestamp: "1d ago",
  },
  {
    id: 4,
    title: "Archbishop Wood Captures PCL Championship",
    snippet: "Archbishop Wood's Vikings defeated Bishop McDevitt 24-21 in overtime to claim the Philadelphia Catholic League championship...",
    image: "https://placehold.co/300x180/16a34a/ffffff?text=Wood+PCL",
    sport: "Football",
    timestamp: "2d ago",
  },
];

// Dummy data for standings
const STANDINGS_DATA = {
  catholicLeague: [
    { rank: 1, team: "St. Joseph's Prep", wins: 10, losses: 0, pct: "1.000" },
    { rank: 2, team: "La Salle College High", wins: 8, losses: 2, pct: ".800" },
    { rank: 3, team: "Roman Catholic", wins: 7, losses: 3, pct: ".700" },
    { rank: 4, team: "Archbishop Wood", wins: 6, losses: 4, pct: ".600" },
    { rank: 5, team: "Father Judge", wins: 5, losses: 5, pct: ".500" },
    { rank: 6, team: "Bonner-Prendie", wins: 3, losses: 7, pct: ".300" },
  ],
  publicLeague: [
    { rank: 1, team: "Imhotep Charter", wins: 10, losses: 0, pct: "1.000" },
    { rank: 2, team: "Martin Luther King Jr.", wins: 7, losses: 3, pct: ".700" },
    { rank: 3, team: "Northeast High", wins: 6, losses: 4, pct: ".600" },
    { rank: 4, team: "Frankford High", wins: 5, losses: 5, pct: ".500" },
  ],
};

// Dummy schedule
const THIS_WEEKS_GAMES = [
  { id: 1, home: "St. Joseph's Prep", away: "La Salle College High", time: "7:00 PM", day: "Friday" },
  { id: 2, home: "Roman Catholic", away: "Father Judge", time: "7:00 PM", day: "Friday" },
  { id: 3, home: "Imhotep Charter", away: "Martin Luther King Jr.", time: "6:00 PM", day: "Friday" },
];

// Dummy top performers
const TOP_PERFORMERS = [
  { id: 1, name: "Samaj Jones", team: "SJP", position: "QB", stat: "245 passing yards, 2 TD" },
  { id: 2, name: "Marcus Williams", team: "La Salle", position: "QB", stat: "198 passing yards, 3 TD" },
  { id: 3, name: "Jaylen Carter", team: "Roman", position: "WR", stat: "8 receptions, 142 yards" },
  { id: 4, name: "DeShawn Adams", team: "Imhotep", position: "RB", stat: "167 rushing yards, 2 TD" },
  { id: 5, name: "Jeremiah Johnson", team: "MLK", position: "LB", stat: "14 tackles, 2 sacks" },
];

// Dummy recent scores
const RECENT_SCORES = [
  { id: 1, home: "SJP", homeScore: 35, away: "La Salle", awayScore: 14, status: "Final" },
  { id: 2, home: "Imhotep", homeScore: 28, away: "Roman", awayScore: 21, status: "Final" },
  { id: 3, home: "Wood", homeScore: 24, away: "Father Judge", awayScore: 17, status: "Final" },
  { id: 4, home: "Northeast", homeScore: 20, away: "Frankford", awayScore: 18, status: "Final" },
];

// Dummy related stories
const MORE_STORIES = [
  {
    id: 5,
    title: "Recruiting Update: Top Philly Commits",
    snippet: "Track the top football recruits from Philadelphia area schools heading to major college programs...",
    image: "https://placehold.co/300x180/16a34a/ffffff?text=Recruiting",
    sport: "Football",
  },
  {
    id: 6,
    title: "2024-25 Season Preview & Predictions",
    snippet: "Experts pick the top contenders and sleepers for the Philadelphia high school football championship...",
    image: "https://placehold.co/300x180/16a34a/ffffff?text=Preview",
    sport: "Football",
  },
  {
    id: 7,
    title: "Historic Seasons: Philly's Best Teams Ever",
    snippet: "Revisiting the greatest football dynasties in Philadelphia high school history...",
    image: "https://placehold.co/300x180/16a34a/ffffff?text=History",
    sport: "Football",
  },
  {
    id: 8,
    title: "Next Level: Philly Players in College Football",
    snippet: "Follow Philadelphia area high school graduates playing college and professional football...",
    image: "https://placehold.co/300x180/16a34a/ffffff?text=Next+Level",
    sport: "Football",
  },
];

export default async function FootballPage() {
  // Fetch real data from database
  const [overview, champions, schools] = await Promise.all([
    getSportOverview("football"),
    getRecentChampions("football", 10),
    getSchoolsBySport("football", 30),
  ]);

  const SUB_NAV = [
    { href: "/football", label: "Home", active: true },
    { href: "/football/leaderboards/rushing_yards", label: "Leaders" },
    { href: "/football/championships", label: "Championships" },
    { href: "/football/records", label: "Records" },
    { href: "/football/teams", label: "Teams" },
    { href: "/search?sport=football", label: "Players" },
  ];

  return (
    <>
      {/* Sport Header Bar */}
      <div className="sport-hdr" style={{ borderBottomColor: FOOTBALL_COLOR }}>
        <div className="sport-hdr-inner">
          <span style={{ fontSize: 28 }}>🏈</span>
          <h1>Football</h1>
          <div className="stat-pills">
            <div className="pill"><strong>{overview.players.toLocaleString()}</strong> players</div>
            <div className="pill"><strong>{overview.schools.toLocaleString()}</strong> schools</div>
            <div className="pill"><strong>{overview.championships.toLocaleString()}</strong> titles</div>
            <span className="db-tag"><span className="dot" /> Live</span>
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
              className={item.active ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="espn-container">
        <main>
          {/* Hero Section - Featured Article */}
          <div className="hero-card">
            <div className="hero-tag">Featured</div>
            <div
              className="hero-img"
              style={{
                backgroundImage: "url(https://placehold.co/800x400/16a34a/ffffff?text=Football+Action)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div style={{ background: "linear-gradient(180deg, rgba(22,163,74,.4) 0%, rgba(10,22,40,.95) 100%)", width: "100%", height: "100%", display: "flex", alignItems: "flex-end", padding: "20px" }}>
                <div>
                  <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8, fontFamily: "'Barlow Condensed', sans-serif" }}>
                    St. Joseph's Prep Captures 9th State Championship
                  </h2>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,.8)" }}>
                    Hawks dominate PIAA 6A final 42-14 behind All-State QB Samaj Jones
                  </div>
                  <Link href="#" style={{ display: "inline-block", marginTop: 12, fontSize: 12, fontWeight: 600, color: "#f0a500", textDecoration: "none" }}>
                    Read full story →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* PSP Promo */}
          <PSPPromo size="banner" variant={2} />

          {/* Latest News */}
          <div className="sec-head">
            <h2>Latest News</h2>
            <Link href="#" className="more">View All &#8594;</Link>
          </div>
          <div className="headline-list">
            {DUMMY_ARTICLES.map((article) => (
              <div key={article.id} className="hl-item">
                <div
                  className="hl-img"
                  style={{
                    backgroundImage: `url(${article.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="hl-text">
                  <div className="hl-tag" style={{ background: FOOTBALL_COLOR, color: "#fff" }}>
                    {article.sport}
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.snippet}</p>
                  <div className="meta">{article.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Standings */}
          <div className="sec-head">
            <h2>2024-25 Standings</h2>
            <Link href="/football/standings" className="more">Full Standings &#8594;</Link>
          </div>
          <div className="standings-grid">
            {/* Catholic League */}
            <div className="standings-card">
              <div className="st-head" style={{ background: FOOTBALL_COLOR }}>
                Catholic League
              </div>
              <table className="st-tbl">
                <thead>
                  <tr>
                    <th style={{ width: "70%" }}>Team</th>
                    <th>W</th>
                    <th>L</th>
                    <th>PCT</th>
                  </tr>
                </thead>
                <tbody>
                  {STANDINGS_DATA.catholicLeague.map((row, idx) => (
                    <tr key={row.rank} style={{ background: idx < 2 ? "rgba(22,163,74,.05)" : "transparent" }}>
                      <td>
                        <Link href={`/schools/${row.team.toLowerCase().replace(/\s+/g, "-")}`} className="team-link">
                          {row.team}
                        </Link>
                      </td>
                      <td className="rec">{row.wins}</td>
                      <td className="rec">{row.losses}</td>
                      <td className="pct">{row.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Public League */}
            <div className="standings-card">
              <div className="st-head" style={{ background: FOOTBALL_COLOR }}>
                Public League
              </div>
              <table className="st-tbl">
                <thead>
                  <tr>
                    <th style={{ width: "70%" }}>Team</th>
                    <th>W</th>
                    <th>L</th>
                    <th>PCT</th>
                  </tr>
                </thead>
                <tbody>
                  {STANDINGS_DATA.publicLeague.map((row, idx) => (
                    <tr key={row.rank} style={{ background: idx === 0 ? "rgba(22,163,74,.05)" : "transparent" }}>
                      <td>
                        <Link href={`/schools/${row.team.toLowerCase().replace(/\s+/g, "-")}`} className="team-link">
                          {row.team}
                        </Link>
                      </td>
                      <td className="rec">{row.wins}</td>
                      <td className="rec">{row.losses}</td>
                      <td className="pct">{row.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* This Week's Schedule */}
          <div className="sec-head">
            <h2>This Week's Schedule</h2>
          </div>
          <div style={{ marginBottom: 16 }}>
            {THIS_WEEKS_GAMES.map((game) => (
              <div key={game.id} className="evt-item">
                <div className="evt-date">
                  <div className="m">{game.day}</div>
                  <div className="d" style={{ fontSize: 18 }}>▶</div>
                </div>
                <div className="evt-info">
                  <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {game.home} vs {game.away}
                  </h4>
                  <p style={{ color: FOOTBALL_COLOR, fontWeight: 600 }}>{game.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Top Performers */}
          <div className="sec-head">
            <h2>Top Performers This Week</h2>
          </div>
          <div className="rank-table">
            <div className="rt-head">2024-25 Season Leaders</div>
            {TOP_PERFORMERS.map((performer, idx) => (
              <div key={performer.id} className="rt-row">
                <div
                  className="rt-num"
                  style={{
                    background: idx < 3 ? FOOTBALL_COLOR : "var(--g300)"
                  }}
                >
                  {idx + 1}
                </div>
                <div className="rt-info">
                  <Link href={`/football/players/${performer.name.toLowerCase().replace(/\s+/g, "-")}`} className="rname" style={{ color: "var(--link)" }}>
                    {performer.name}
                  </Link>
                  <div className="rsub">
                    {performer.team} · {performer.position}
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "right", fontSize: 12, fontWeight: 600, color: "var(--g400)" }}>
                  {performer.stat}
                </div>
              </div>
            ))}
          </div>

          {/* More Stories */}
          <div className="sec-head">
            <h2>More Stories</h2>
          </div>
          <div className="stories">
            {MORE_STORIES.map((story) => (
              <div key={story.id} className="story">
                <div
                  className="s-img"
                  style={{
                    backgroundImage: `url(${story.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="s-body">
                  <div className="s-tag" style={{ background: FOOTBALL_COLOR, color: "#fff" }}>
                    {story.sport}
                  </div>
                  <h4>{story.title}</h4>
                  <p>{story.snippet}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Season Leaders Widget */}
          <div className="widget">
            <div className="w-head" style={{ background: FOOTBALL_COLOR, color: "#fff" }}>
              🏆 Rushing Leaders
            </div>
            <div className="w-body">
              <div className="w-row" style={{ padding: "10px 14px", borderBottom: "none", fontWeight: 600, fontSize: 11, color: "var(--g400)", textTransform: "uppercase" }}>
                <span style={{ flex: 1 }}>Player</span>
                <span>Yards</span>
              </div>
              {[
                { rank: 1, name: "Samaj Jones (SJP)", yards: "1,245" },
                { rank: 2, name: "DeShawn Adams (Imhotep)", yards: "1,089" },
                { rank: 3, name: "Marcus Brown (La Salle)", yards: "987" },
                { rank: 4, name: "Jaylen Washington (Roman)", yards: "876" },
                { rank: 5, name: "Tyrell Johnson (Wood)", yards: "745" },
              ].map((leader) => (
                <div key={leader.rank} className="w-row">
                  <span className={`rank ${leader.rank <= 3 ? 'top' : ''}`}>{leader.rank}</span>
                  <span className="name">{leader.name}</span>
                  <span className="val">{leader.yards}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Scores Widget */}
          <div className="widget">
            <div className="w-head" style={{ background: FOOTBALL_COLOR, color: "#fff" }}>
              📊 Recent Scores
            </div>
            <div className="w-body">
              {RECENT_SCORES.map((score) => (
                <div key={score.id} style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 12 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 4, fontWeight: 600 }}>
                    <span style={{ flex: 1 }}>{score.home}</span>
                    <span style={{ fontWeight: 800, color: FOOTBALL_COLOR }}>{score.homeScore}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 4, fontWeight: 600 }}>
                    <span style={{ flex: 1 }}>{score.away}</span>
                    <span style={{ fontWeight: 800, color: "var(--g400)" }}>{score.awayScore}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--g300)", textAlign: "right" }}>{score.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PSP Promo */}
          <PSPPromo size="sidebar" variant={1} />

          {/* Quick Links Widget */}
          <div className="widget">
            <div className="w-head" style={{ background: FOOTBALL_COLOR, color: "#fff" }}>
              🔗 Quick Links
            </div>
            <div className="w-body">
              <Link href="/football/leaderboards/rushing_yards" className="w-link">📈 Leaderboards</Link>
              <Link href="/football/championships" className="w-link">🏆 Championships</Link>
              <Link href="/football/records" className="w-link">📋 Records</Link>
              <Link href="/football/teams" className="w-link">🏈 Teams</Link>
              <Link href="/search?sport=football" className="w-link">👥 Players</Link>
              <Link href="/compare?sport=football" className="w-link">⚖️ Compare</Link>
            </div>
          </div>

          {/* Upcoming Events Widget */}
          <div className="widget">
            <div className="w-head" style={{ background: FOOTBALL_COLOR, color: "#fff" }}>
              📅 Upcoming
            </div>
            <div className="w-body">
              <Link href="/events" style={{ display: "block", padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 12, fontWeight: 600, color: "var(--link)", textDecoration: "none" }}>
                ➜ Friday Night Lights 2024-25
              </Link>
              <Link href="/events" style={{ display: "block", padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 12, fontWeight: 600, color: "var(--link)", textDecoration: "none" }}>
                ➜ Playoff Schedule
              </Link>
              <Link href="/events" style={{ display: "block", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "var(--link)", textDecoration: "none" }}>
                ➜ State Championship
              </Link>
            </div>
          </div>

          {/* PSP Promo */}
          <PSPPromo size="sidebar" variant={4} />
        </aside>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Philadelphia High School Football",
            description: "Comprehensive football database for Philadelphia area high schools including statistics, standings, championships, and player records.",
            url: "https://phillysportspack.com/football",
            isPartOf: {
              "@type": "WebSite",
              name: "PhillySportsPack",
              url: "https://phillysportspack.com",
            },
            mainEntity: {
              "@type": "SportsEvent",
              name: "2024-25 Philadelphia High School Football Season",
              sport: "American Football",
              startDate: "2024-09-01",
              endDate: "2024-12-31",
            },
          }),
        }}
      />
    </>
  );
}
