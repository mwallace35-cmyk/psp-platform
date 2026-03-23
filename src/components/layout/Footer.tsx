import Link from "next/link";

export default function Footer() {
  return (
    <footer className="espn-footer" aria-label="Site footer">
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
            <li><Link href="/">Home</Link></li>
            <li><Link href="/potw">Player of the Week</Link></li>
            <li><Link href="/pulse/forum">Forum</Link></li>
            <li><Link href="/pulse/rankings">Power Rankings</Link></li>
            <li><Link href="/pulse/our-guys">Our Guys</Link></li>
          </ul>
        </nav>
        <nav style={{ flex: "1 1 140px" }} aria-label="Tools navigation">
          <h5>Tools</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li><Link href="/compare">Compare Players</Link></li>
            <li><Link href="/challenge">Stats Challenge</Link></li>
            <li><Link href="/glossary">Glossary</Link></li>
            <li><Link href="/data-sources">Data Sources</Link></li>
          </ul>
        </nav>
        <nav style={{ flex: "1 1 140px" }} aria-label="Support navigation">
          <h5>Support</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li><Link href="/support">Support</Link></li>
            <li><Link href="/advertise">Advertise</Link></li>
            <li><Link href="/about">Our Story</Link></li>
            <li><Link href="/feed">RSS Feed</Link></li>
          </ul>
        </nav>
        <div style={{ flex: "1 1 140px" }}>
          <h5>About</h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>Data compiled by <strong style={{ color: "var(--psp-gold)" }}>Ted Silary</strong></li>
            <li>Built by Mike Wallace</li>
            <li><Link href="/admin">Admin</Link></li>
            <li style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
              <Link href="/advertise" style={{ color: "var(--psp-gold)" }}>
                ← Partner with PSP
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 1.5rem", textAlign: "center" }}>
          <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", opacity: 0.8 }}>
            Preserving Philadelphia's athletic legacy, one stat at a time.
          </p>
          <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.7 }}>
            &copy; {new Date().getFullYear()} PhillySportsPack.com &mdash; All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
