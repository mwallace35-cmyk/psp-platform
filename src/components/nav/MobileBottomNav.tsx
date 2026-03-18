'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/homepage.module.css';

const SPORTS = [
  { label: 'Football',     slug: 'football',    emoji: '\u00C3\u00B0\u00C2\u009F\u00C2\u008F\u00C2\u0088' },
  { label: 'Basketball',   slug: 'basketball',  emoji: '\u00C3\u00B0\u00C2\u009F\u00C2\u008F\u00C2\u0080' },
  { label: 'Baseball',     slug: 'baseball',    emoji: '\u00C3\u00A2\u00C2\u009A\u00C2\u00BE' },
  { label: 'Soccer',       slug: 'soccer',      emoji: '\u00C3\u00A2\u00C2\u009A\u00C2\u00BD' },
  { label: 'Lacrosse',     slug: 'lacrosse',    emoji: '\u00C3\u00B0\u00C2\u009F\u00C2\u00A5\u00C2\u008D' },
  { label: 'Track & Field',slug: 'track-field', emoji: '\u00C3\u00B0\u00C2\u009F\u00C2\u008F\u00C2\u0083' },
  { label: 'Wrestling',    slug: 'wrestling',   emoji: '\u00C3\u00B0\u00C2\u009F\u00C2\u00A4\u00C2\u00BC' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSportPickerOpen, setIsSportPickerOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close pickers on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSportPickerOpen(false);
  }, [pathname]);

  if (!isMounted) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const isSportActive = SPORTS.some(s => pathname.startsWith('/' + s.slug));

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className={`${styles.mobileBottomNav} md:hidden`} role="navigation" aria-label="Mobile navigation">

        {/* Home */}
        <Link
          href="/"
          className={`${styles.mobileNavItem} ${pathname === '/' ? styles.mobileNavItemActive : ''}`}
          title="Home"
        >
          <span className={styles.mobileNavIcon}>{'\u00C3\u00B0\u00C2\u009F\u00C2\u008F\u00C2\u00A0'}</span>
          <span className={styles.mobileNavLabel}>Home</span>
        </Link>

        {/* Sports \u00C3\u00A2\u00C2\u0080\u00C2\u0094 opens sport picker sheet instead of /football */}
        <button
          onClick={() => { setIsSportPickerOpen(true); setIsMenuOpen(false); }}
          className={`${styles.mobileNavItem} ${isSportActive ? styles.mobileNavItemActive : ''}`}
          title="Sports"
          aria-haspopup="dialog"
          aria-expanded={isSportPickerOpen}
        >
          <span className={styles.mobileNavIcon}>{'\u00C3\u00B0\u00C2\u009F\u00C2\u008F\u00C2\u0086'}</span>
          <span className={styles.mobileNavLabel}>Sports</span>
        </button>

        {/* Community */}
        <Link
          href="/community"
          className={`${styles.mobileNavItem} ${isActive('/community') ? styles.mobileNavItemActive : ''}`}
          title="Community"
        >
          <span className={styles.mobileNavIcon}>{'\u00C3\u00B0\u00C2\u009F\u00C2\u0091\u00C2\u00A5'}</span>
          <span className={styles.mobileNavLabel}>Community</span>
        </Link>

        {/* My Schools */}
        <Link
          href="/my-schools"
          className={`${styles.mobileNavItem} ${isActive('/my-schools') ? styles.mobileNavItemActive : ''}`}
          title="My Schools"
        >
          <span className={styles.mobileNavIcon}>{'\u00C3\u00A2\u00C2\u0098\u00C2\u0085'}</span>
          <span className={styles.mobileNavLabel}>My Schools</span>
        </Link>

        {/* Menu */}
        <button
          onClick={() => { setIsMenuOpen(!isMenuOpen); setIsSportPickerOpen(false); }}
          className={`${styles.mobileNavItem} ${styles.mobileNavMenu}`}
          title="Menu"
          aria-haspopup="dialog"
        aria-expanded={isMenuOpen}
        >
          <span className={styles.mobileNavIcon}>{'\u00C3\u00A2\u00C2\u0098\u00C2\u00B0'}</span>
          <span className={styles.mobileNavLabel}>Menu</span>
        </button>
      </nav>

      {/* Sport Picker Sheet */}
      {isSportPickerOpen && (
        <div
          className={styles.mobileMenuOverlay}
          onClick={() => setIsSportPickerOpen(false)}
          role="dialog"
          aria-label="Choose a sport"
          aria-modal="true"
        >
          <div
            className={styles.mobileMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.mobileMenuClose}
              onClick={() => setIsSportPickerOpen(false)}
              aria-label="Close sport picker"
            >
              \u00C3\u00A2\u00C2\u009C\u00C2\u0095
            </button>
            <h2 className={styles.mobileMenuTitle}>Choose a Sport</h2>
            <nav className={styles.mobileMenuNav} aria-label="Sports navigation">
              {SPORTS.map((sport) => (
                <Link
                  key={sport.slug}
                  href={`/${sport.slug}`}
                  className={`${styles.mobileMenuItem} ${pathname.startsWith('/' + sport.slug) ? styles.mobileNavItemActive : ''}`}
                  onClick={() => setIsSportPickerOpen(false)}
                >
                  <span>{sport.emoji}</span>
                  <span>{sport.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div
          className={styles.mobileMenuOverlay}
          onClick={() => setIsMenuOpen(false)}
          role="dialog"
          aria-label="Menu"
          aria-modal="true"
        >
          <div
            className={styles.mobileMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.mobileMenuClose}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
               \u00C3\u00A2\u00C2\u009C\u00C2\u0095
            </button>
            <h2 className={styles.mobileMenuTitle}>Menu</h2>
            <nav className={styles.mobileMenuNav}>
              <Link href="/" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u00C3\u00B0\u00C2\u009F\u00C2\u008F\u00C2\u00A0'}</span><span>Home</span>
              </Link>
              <Link href="/schools" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u00C3\u00B0\u00C2\u009F\u00C2\u008F\u00C2\u00AB'}</span><span>Schools</span>
              </Link>
              <Link href="/scores" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u00C3\u00B0\u00C2\u009F\u00C2\u008E\u00C2\u008A'}</span><span>Scores</span>
              </Link>
              <Link href="/leaderboards" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u00C3\u00B0\u00C2\u009F\u00C2\u008F\u00C2\u0085'}</span><span>Leaderboards</span>
              </Link>
              <Link href="/pulse" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u00C3\u00A2\u00C2\u009A\u00C2\u00A1'}</span><span>The Pulse</span>
              </Link>
              <Link href="/search" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u00C3\u00B0\u00C2\u009F\u00C2\u0094\u00C2\u008D'}</span><span>Search</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
