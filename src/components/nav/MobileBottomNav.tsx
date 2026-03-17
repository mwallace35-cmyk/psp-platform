'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/homepage.module.css';

const SPORTS = [
  { label: 'Football',     slug: 'football',    emoji: 'ð' },
  { label: 'Basketball',   slug: 'basketball',  emoji: 'ð' },
  { label: 'Baseball',     slug: 'baseball',    emoji: 'â¾' },
  { label: 'Soccer',       slug: 'soccer',      emoji: 'â½' },
  { label: 'Lacrosse',     slug: 'lacrosse',    emoji: 'ð¥' },
  { label: 'Track & Field',slug: 'track-field', emoji: 'ð' },
  { label: 'Wrestling',    slug: 'wrestling',   emoji: 'ð¤¼' },
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
          <span className={styles.mobileNavIcon}>ð </span>
          <span className={styles.mobileNavLabel}>Home</span>
        </Link>

        {/* Sports â opens sport picker sheet instead of /football */}
        <button
          onClick={() => { setIsSportPickerOpen(true); setIsMenuOpen(false); }}
          className={`${styles.mobileNavItem} ${isSportActive ? styles.mobileNavItemActive : ''}`}
          title="Sports"
          aria-haspopup="dialog"
          aria-expanded={isSportPickerOpen}
        >
          <span className={styles.mobileNavIcon}>ð</span>
          <span className={styles.mobileNavLabel}>Sports</span>
        </button>

        {/* Community */}
        <Link
          href="/community"
          className={`${styles.mobileNavItem} ${isActive('/community') ? styles.mobileNavItemActive : ''}`}
          title="Community"
        >
          <span className={styles.mobileNavIcon}>ð¥</span>
          <span className={styles.mobileNavLabel}>Community</span>
        </Link>

        {/* My Schools */}
        <Link
          href="/my-schools"
          className={`${styles.mobileNavItem} ${isActive('/my-schools') ? styles.mobileNavItemActive : ''}`}
          title="My Schools"
        >
          <span className={styles.mobileNavIcon}>â</span>
          <span className={styles.mobileNavLabel}>My Schools</span>
        </Link>

        {/* Menu */}
        <button
          onClick={() => { setIsMenuOpen(!isMenuOpen); setIsSportPickerOpen(false); }}
          className={`${styles.mobileNavItem} ${styles.mobileNavMenu}`}
          title="Menu"
          aria-haspopup="dialog"
          aria-expanded=={isMenuOpen}
        >
          <span className={styles.mobileNavIcon}>â°</span>
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
              â
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
               â
            </button>
            <h2 className={styles.mobileMenuTitle}>Menu</h2>
            <nav className={styles.mobileMenuNav}>
              <Link href="/" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>ð </span><span>Home</span>
              </Link>
              <Link href="/schools" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>ð«</span><span>Schools</span>
              </Link>
              <Link href="/scores" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>ð</span><span>Scores</span>
              </Link>
              <Link href="/leaderboards" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>ð</span><span>Leaderboards</span>
              </Link>
              <Link href="/pulse" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>â¡</span><span>The Pulse</span>
              </Link>
              <Link href="/search" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                <span>ð</span><span>Search</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
