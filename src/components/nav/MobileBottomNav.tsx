'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';
import styles from '@/app/homepage.module.css';

const SPORTS = [
  { label: 'Football',      slug: 'football',    emoji: '\u{1F3C8}', color: 'var(--fb)' },
  { label: 'Basketball',    slug: 'basketball',  emoji: '\u{1F3C0}', color: 'var(--psp-blue)' },
  { label: 'Baseball',      slug: 'baseball',    emoji: '\u26BE',     color: 'var(--base)' },
  { label: 'Soccer',        slug: 'soccer',      emoji: '\u26BD',     color: 'var(--soccer)' },
  { label: 'Lacrosse',      slug: 'lacrosse',    emoji: '\u{1F94D}', color: 'var(--lac)' },
  { label: 'Track & Field', slug: 'track-field', emoji: '\u{1F3C3}', color: 'var(--track)' },
  { label: 'Wrestling',     slug: 'wrestling',   emoji: '\u{1F93C}', color: 'var(--wrest)' },
];

const QUICK_LINKS = [
  { href: '/scores',    label: 'Scores',     emoji: '\u{1F38A}' },
  { href: '/schools',   label: 'Schools',    emoji: '\u{1F3EB}' },
  { href: '/articles',  label: 'News',       emoji: '\u{1F4F0}' },
  { href: '/awards',    label: 'Awards',     emoji: '\u{1F3C6}' },
];

const EXPLORE_LINKS = [
  { href: '/rankings',      label: 'Power Rankings',     emoji: '\u26A1' },
  { href: '/our-guys',      label: 'Our Guys',           emoji: '\u{1F30D}' },
  { href: '/recruiting',    label: 'Recruiting',         emoji: '\u{1F3AF}' },
  { href: '/hof',           label: 'Hall of Fame',       emoji: '\u{1F3C6}' },
  { href: '/potw',          label: 'Player of the Week', emoji: '\u{1F31F}' },
];

const TOOLS_LINKS = [
  { href: '/compare',        label: 'Compare Players',  emoji: '\u{1F504}' },
  { href: '/recruit-finder', label: 'Recruit Finder',   emoji: '\u{1F50D}' },
  { href: '/coaches',        label: 'Coaches',          emoji: '\u{1F4CB}' },
  { href: '/pickem',         label: "Pick'em",          emoji: '\u{1F3C8}' },
  { href: '/challenge',      label: 'Stats Challenge',  emoji: '\u{1F9E0}' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSportPickerOpen, setIsSportPickerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close sheets on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSportPickerOpen(false);
  }, [pathname]);

  // Focus trap for menu dialog
  const handleMenuKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMenuOpen(false);
      setIsSportPickerOpen(false);
      return;
    }
    if (e.key !== 'Tab' || !menuRef.current) return;

    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!isMenuOpen && !isSportPickerOpen) return;
    document.addEventListener('keydown', handleMenuKeyDown);
    // Focus first focusable element
    setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>('a[href], button')?.focus();
    }, 50);
    return () => document.removeEventListener('keydown', handleMenuKeyDown);
  }, [isMenuOpen, isSportPickerOpen, handleMenuKeyDown]);

  if (!isMounted) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const isSportActive = SPORTS.some(s => pathname.startsWith('/' + s.slug));

  const closeAll = () => { setIsMenuOpen(false); setIsSportPickerOpen(false); };

  return (
    <>
      {/* Bottom Tab Bar */}
      <nav
        className={`${styles.mobileBottomNav} md:hidden`}
        role="navigation"
        aria-label="Mobile navigation"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <Link
          href="/"
          className={`${styles.mobileNavItem} ${pathname === '/' ? styles.mobileNavItemActive : ''}`}
          title="Home"
        >
          <span className={styles.mobileNavIcon}>{'\u{1F3E0}'}</span>
          <span className={styles.mobileNavLabel}>Home</span>
        </Link>

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

        <Link
          href="/search"
          className={`${styles.mobileNavItem} ${isActive('/search') ? styles.mobileNavItemActive : ''}`}
          title="Search"
        >
          <span className={styles.mobileNavIcon}>{'\u{1F50D}'}</span>
          <span className={styles.mobileNavLabel}>Search</span>
        </Link>

        <Link
          href="/my-schools"
          className={`${styles.mobileNavItem} ${isActive('/my-schools') ? styles.mobileNavItemActive : ''}`}
          title="My Schools"
        >
          <span className={styles.mobileNavIcon}>{'\u2605'}</span>
          <span className={styles.mobileNavLabel}>My Schools</span>
        </Link>

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
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 50,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          }}
          onClick={closeAll}
          role="dialog"
          aria-label="Choose a sport"
          aria-modal="true"
        >
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()} ref={menuRef}>
            <button className={styles.mobileMenuClose} onClick={closeAll} aria-label="Close sport picker">
              {'\u2715'}
            </button>
            <h2 className={styles.mobileMenuTitle}>Choose a Sport</h2>
            <nav className={styles.mobileMenuNav} aria-label="Sports navigation">
              {SPORTS.map((sport) => (
                <Link
                  key={sport.slug}
                  href={`/${sport.slug}`}
                  className={`${styles.mobileMenuItem} ${pathname.startsWith('/' + sport.slug) ? styles.mobileNavItemActive : ''}`}
                  onClick={closeAll}
                >
                  <span>{sport.emoji}</span>
                  <span>{sport.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Full Menu Sheet */}
      {isMenuOpen && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 50,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          }}
          onClick={closeAll}
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="true"
        >
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()} ref={menuRef}>
            <button className={styles.mobileMenuClose} onClick={closeAll} aria-label="Close menu">
              {'\u2715'}
            </button>
            <h2 className={styles.mobileMenuTitle}>Menu</h2>

            {/* Sports */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(10,22,40,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Sports
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SPORTS.map((sport) => (
                  <Link
                    key={sport.slug}
                    href={`/${sport.slug}`}
                    onClick={closeAll}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 20,
                      background: pathname.startsWith('/' + sport.slug) ? 'var(--psp-gold)' : 'var(--psp-gray-100, #f1f5f9)',
                      color: pathname.startsWith('/' + sport.slug) ? '#fff' : 'var(--psp-navy)',
                      textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{sport.emoji}</span>
                    {sport.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <MenuSection title="Quick Links" items={QUICK_LINKS} pathname={pathname} onClose={closeAll} />

            {/* Explore */}
            <MenuSection title="Explore" items={EXPLORE_LINKS} pathname={pathname} onClose={closeAll} />

            {/* Tools */}
            <MenuSection title="Tools" items={TOOLS_LINKS} pathname={pathname} onClose={closeAll} />

            {/* Account */}
            <div style={{ borderTop: '1px solid var(--psp-gray-200, #e2e8f0)', paddingTop: 12, marginTop: 4 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(10,22,40,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Account
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <MenuLink href="/my-schools" emoji={'\u2605'} label="My Schools" pathname={pathname} onClose={closeAll} />
                <MenuLink href="/signup" emoji={'\u{1F464}'} label="Sign Up / Log In" pathname={pathname} onClose={closeAll} />
              </div>
            </div>

            {/* Settings */}
            <div style={{ borderTop: '1px solid var(--psp-gray-200, #e2e8f0)', paddingTop: 12, marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--psp-navy)' }}>Dark Mode</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Section with title + link list */
function MenuSection({ title, items, pathname, onClose }: {
  title: string;
  items: { href: string; label: string; emoji: string }[];
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div style={{ borderTop: '1px solid var(--psp-gray-200, #e2e8f0)', paddingTop: 12, marginTop: 4 }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(10,22,40,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => (
          <MenuLink key={item.href} {...item} pathname={pathname} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

/** Individual menu link */
function MenuLink({ href, emoji, label, pathname, onClose }: {
  href: string; emoji: string; label: string; pathname: string; onClose: () => void;
}) {
  const active = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      onClick={onClose}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 8px', borderRadius: 8,
        textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
        color: active ? 'var(--psp-gold)' : 'var(--psp-navy)',
        background: active ? 'rgba(240,165,0,0.08)' : 'transparent',
      }}
    >
      <span style={{ fontSize: '1.1rem', minWidth: 24, textAlign: 'center' }}>{emoji}</span>
      {label}
    </Link>
  );
}
