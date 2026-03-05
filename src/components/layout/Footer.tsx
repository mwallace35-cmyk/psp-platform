"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <footer className="mega-footer">
        {/* Ted Silary tribute */}
        <div className="mf-tribute">
          <div className="mf-tribute-inner">
            <div className="mf-tribute-icon">📰</div>
            <div>
              <p className="mf-tribute-quote">
                &ldquo;If it happened on a high school field in Philadelphia, Ted Silary wrote about it.&rdquo;
              </p>
              <p className="mf-tribute-credit">
                Data compiled &amp; curated by <strong>Ted Silary</strong> &mdash; The godfather of Philly high school sports coverage
              </p>
            </div>
          </div>
        </div>

        {/* Column links */}
        <div className="mf-columns">
          {/* Sports */}
          <div className="mf-col">
            <h5 className="mf-col-head">Sports</h5>
            <Link href="/football">Football</Link>
            <Link href="/basketball">Basketball</Link>
            <Link href="/baseball">Baseball</Link>
            <Link href="/track-field">Track &amp; Field</Link>
            <Link href="/lacrosse">Lacrosse</Link>
            <Link href="/wrestling">Wrestling</Link>
            <Link href="/soccer">Soccer</Link>
          </div>

          {/* Data & Tools */}
          <div className="mf-col">
            <h5 className="mf-col-head">Data &amp; Tools</h5>
            <Link href="/search">Search</Link>
            <Link href="/compare">Compare Players</Link>
            <Link href="/glossary">Stats Glossary</Link>
            <Link href="/our-guys">Our Guys</Link>
            <Link href="/recruiting">Recruiting</Link>
            <Link href="/coaches">Coaches</Link>
          </div>

          {/* Community */}
          <div className="mf-col">
            <h5 className="mf-col-head">Community</h5>
            <Link href="/articles">Articles</Link>
            <Link href="/events">Events</Link>
            <Link href="/community">Community</Link>
            <Link href="/potw">Player of the Week</Link>
            <Link href="/gotw">Game of the Week</Link>
          </div>

          {/* About */}
          <div className="mf-col">
            <h5 className="mf-col-head">About</h5>
            <Link href="/schools">All Schools</Link>
            <Link href="/glossary">Glossary</Link>
            <span className="mf-col-note">Built by Mike Wallace</span>
          </div>

          {/* Connect */}
          <div className="mf-col">
            <h5 className="mf-col-head">Connect</h5>
            <Link href="/signup" style={{ color: "var(--psp-gold)" }}>Sign Up</Link>
            <Link href="/community">Join the Community</Link>
            <a href="mailto:info@phillysportspack.com">Contact Us</a>
          </div>
        </div>

        {/* Social row */}
        <div className="mf-social">
          <a href="https://twitter.com/PhillySportsPak" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            𝕏
          </a>
          <a href="https://instagram.com/PhillySportsPack" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            📸
          </a>
          <a href="mailto:info@phillysportspack.com" aria-label="Email">
            ✉️
          </a>
        </div>

        {/* Copyright bar */}
        <div className="mf-copyright">
          <div className="mf-copyright-inner">
            <span>&copy; {new Date().getFullYear()} PhillySportsPack.com — All rights reserved.</span>
            <span className="mf-copyright-links">
              <Link href="/admin">Admin</Link>
            </span>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      {showTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </>
  );
}
