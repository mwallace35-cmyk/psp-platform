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
        <nav style={{ flex: "1 1 140px" }} aria-label="Data navigation">
          <h5>Data</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li><Link href="/search">Search database</Link></li>
            <li><Link href="/compare">Compare Players</Link></li>
            <li><Link href="/pulse/our-guys">Our Guys</Link></li>
            <li><Link href="/recruiting">Recruiting</Link></li>
            <li><Link href="/coaches">Coaches</Link></li>
            <li><Link href="/articles">Articles</Link></li>
            <li><Link href="/pulse">The Pulse</Link></li>
            <li><Link href="/glossary">Glossary</Link></li>
          </ul>
        </nav>
        <div style={{ flex: "1 1 140px" }}>
          <h5>About</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>Data compiled by <strong style={{ color: "var(--psp-gold)" }}>Ted Silary</strong></li>
            <li>Built by Mike Wallace</li>
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
