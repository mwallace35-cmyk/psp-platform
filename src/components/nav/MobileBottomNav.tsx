'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/homepage.module.css';

const SPORTS = [
  { label: 'Football',     slug: 'football',    emoji: '\u{1F3C8}' },
  { label: 'Basketball',   slug: 'basketball',  emoji: '\u{1F3C0}' },
  { label: 'Baseball',     slug: 'baseball',    emoji: '\u26BE' },
  { label: 'Soccer',       slug: 'soccer',      emoji: '\u26BD' },
  { label: 'Lacrosse',     slug: 'lacrosse',    emoji: '\u{1F94D}' },
  { label: 'Track & Field',slug: 'track-field', emoji: '\u{1F3C3}' },
  { label: 'Wrestling',    slug: 'wrestling',   emoji: '\u{1F93C}' },
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
          <span className={styles.mobileNavIcon}>{'\u{1F3E0}'}</span>
          <span className={styles.mobileNavLabel}>Home</span>
        </Link>

        {/* Sports \u2014 opens sport picker sheet instead of /football */}
        <button
          onClick={() => { setIsSportPickerOpen(true); setIsMenuOpen(false); }}
          className={`${styles.mobileNavItem} ${isSportActive ? styles.mobileNavItemActive : ''}`}
          title="Sports"
          aria-haspopup="dialog"
          aria-expanded={isSportPickerOpen}
        >
          <span className={styles.mobileNavIcon}>{'\u{1F3C6}'}</span>
          <span className={styles.mobileNavLabel}>Sports</span>
        </button>

        {/* Vote (POTW) */}
        <Link
          href="/potw"
          className={`${styles.mobileNavItem} ${isActive('/potw') ? styles.mobileNavItemActive : ''}`}
          title="Vote"
        >
          <span className={styles.mobileNavIcon}>{'\u{1F3C6}'}</span>
          <span className={styles.mobileNavLabel}>Vote</span>
        </Link>

        {/* My Schools */}
        <Link
          href="/my-schools"
          className={`${styles.mobileNavItem} ${isActive('/my-schools') ? styles.mobileNavItemActive : ''}`}
          title="My Schools"
        >
          <span className={styles.mobileNavIcon}>{'\u2605'}</span>
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
          <span className={styles.mobileNavIcon}>{'\u2630'}</span>
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
              \u2715
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
               \u2715
            </button>
            <h2 className={styles.mobileMenuTitle}>Menu</h2>
            <nav className={styles.mobileMenuNav}>
              <Link href="/" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u{1F3E0}'}</span><span>Home</span>
              </Link>
              <Link href="/schools" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u{1F3EB}'}</span><span>Schools</span>
              </Link>
              <Link href="/scores" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u{1F38A}'}</span><span>Scores</span>
              </Link>
              <Link href="/leaderboards" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u{1F3C5}'}</span><span>Leaderboards</span>
              </Link>
              <Link href="/pulse" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u26A1'}</span><span>The Pulse</span>
              </Link>
              <Link href="/search" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>{'\u{1F50D}'}</span><span>Search</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
