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
        <div style={{ flex: "1 1 140px" }}>
          <h5>Sports</h5>
          <p>
            <Link href="/football" style={{ color: "rgba(255,255,255,.5)" }}>Football</Link><br />
            <Link href="/basketball" style={{ color: "rgba(255,255,255,.5)" }}>Basketball</Link><br />
            <Link href="/baseball" style={{ color: "rgba(255,255,255,.5)" }}>Baseball</Link><br />
            <Link href="/track-field" style={{ color: "rgba(255,255,255,.5)" }}>Track &amp; Field</Link><br />
            <Link href="/lacrosse" style={{ color: "rgba(255,255,255,.5)" }}>Lacrosse</Link><br />
            <Link href="/wrestling" style={{ color: "rgba(255,255,255,.5)" }}>Wrestling</Link><br />
            <Link href="/soccer" style={{ color: "rgba(255,255,255,.5)" }}>Soccer</Link>
          </p>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <h5>Data</h5>
          <p>
            <Link href="/search" style={{ color: "rgba(255,255,255,.5)" }}>Search</Link><br />
            <Link href="/compare" style={{ color: "rgba(255,255,255,.5)" }}>Compare Players</Link><br />
            <Link href="/our-guys" style={{ color: "rgba(255,255,255,.5)" }}>Our Guys</Link><br />
            <Link href="/recruiting" style={{ color: "rgba(255,255,255,.5)" }}>Recruiting</Link><br />
            <Link href="/coaches" style={{ color: "rgba(255,255,255,.5)" }}>Coaches</Link><br />
            <Link href="/articles" style={{ color: "rgba(255,255,255,.5)" }}>Articles</Link><br />
            <Link href="/events" style={{ color: "rgba(255,255,255,.5)" }}>Events</Link>
          </p>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <h5>About</h5>
          <p>
            Data compiled by <strong style={{ color: "var(--psp-gold)" }}>Ted Silary</strong><br />
            Built by Mike Wallace<br />
            <Link href="/admin" style={{ color: "rgba(255,255,255,.5)" }}>Admin</Link>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} PhillySportsPack.com &mdash; All rights reserved.
      </div>
    </footer>
  );
}
