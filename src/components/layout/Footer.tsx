import Link from "next/link";

export default function Footer() {
  return (
    <footer className="espn-footer">
      <div className="footer-inner">
        <div style={{ flex: "1 1 200px" }}>
          <h5>PhillySportsPack</h5>
          <p>
            The definitive Philadelphia high school sports database.
            Decades of football, basketball, baseball, and more &mdash;
            every stat, every champion, every player.
          </p>
        </div>
        <nav style={{ flex: "1 1 140px" }} aria-label="Sports navigation">
          <h5>Sports</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li><Link href="/football">Football</Link></li>
            <li><Link href="/basketball">Basketball</Link></li>
            <li><Link href="/baseball">Baseball</Link></li>
            <li><Link href="/track-field">Track &amp; Field</Link></li>
            <li><Link href="/lacrosse">Lacrosse</Link></li>
            <li><Link href="/wrestling">Wrestling</Link></li>
            <li><Link href="/soccer">Soccer</Link></li>
          </ul>
        </nav>
        <nav style={{ flex: "1 1 140px" }} aria-label="The Pulse navigation">
          <h5>The Pulse</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li><Link href="/pulse">Hub</Link></li>
            <li><Link href="/potw">Player of the Week</Link></li>
            <li><Link href="/pulse/calendar">Game Calendar</Link></li>
            <li><Link href="/pulse/forum">Forum</Link></li>
            <li><Link href="/pulse/rankings">Power Rankings</Link></li>
            <li><Link href="/pulse/our-guys">Our Guys</Link></li>
            <li><Link href="/pulse/outside-the-215">Outside the 215</Link></li>
          </ul>
        </nav>
        <nav style={{ flex: "1 1 140px" }} aria-label="Content navigation">
          <h5>Content</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li><Link href="/articles">News</Link></li>
            <li><Link href="/recruiting">Recruiting</Link></li>
            <li><Link href="/next-level">Next Level (Pro)</Link></li>
            <li><Link href="/coaches">Coaches</Link></li>
            <li><Link href="/philly-everywhere">Philly Everywhere</Link></li>
          </ul>
        </nav>
        <nav style={{ flex: "1 1 140px" }} aria-label="Tools navigation">
          <h5>Tools</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li><Link href="/search">Search</Link></li>
            <li><Link href="/schools">Schools</Link></li>
            <li><Link href="/compare">Compare Players</Link></li>
            <li><Link href="/challenge">Stats Challenge</Link></li>
            <li><Link href="/glossary">Glossary</Link></li>
          </ul>
        </nav>
        <div style={{ flex: "1 1 140px" }}>
          <h5>About</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>Data compiled by <strong style={{ color: "var(--psp-gold)" }}>Ted Silary</strong></li>
            <li>Built by Mike Wallace</li>
            <li><Link href="/feed">RSS Feed</Link></li>
            <li><Link href="/admin">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} PhillySportsPack.com &mdash; All rights reserved.
      </div>
    </footer>
  );
}
