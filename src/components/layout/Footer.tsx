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
          <p>
            <Link href="/football">Football</Link><br />
            <Link href="/basketball">Basketball</Link><br />
            <Link href="/baseball">Baseball</Link><br />
            <Link href="/track-field">Track &amp; Field</Link><br />
            <Link href="/lacrosse">Lacrosse</Link><br />
            <Link href="/wrestling">Wrestling</Link><br />
            <Link href="/soccer">Soccer</Link>
          </p>
        </nav>
        <nav style={{ flex: "1 1 140px" }} aria-label="Data navigation">
          <h5>Data</h5>
          <p>
            <Link href="/search">Search</Link><br />
            <Link href="/compare">Compare Players</Link><br />
            <Link href="/our-guys">Our Guys</Link><br />
            <Link href="/recruiting">Recruiting</Link><br />
            <Link href="/coaches">Coaches</Link><br />
            <Link href="/articles">Articles</Link><br />
            <Link href="/events">Events</Link>
          </p>
        </nav>
        <div style={{ flex: "1 1 140px" }}>
          <h5>About</h5>
          <p>
            Data compiled by <strong style={{ color: "var(--psp-gold)" }}>Ted Silary</strong><br />
            Built by Mike Wallace<br />
            <Link href="/admin">Admin</Link>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} PhillySportsPack.com &mdash; All rights reserved.
      </div>
    </footer>
  );
}
