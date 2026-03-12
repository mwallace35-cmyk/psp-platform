'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/homepage.module.css';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const isActive = (href: string) => pathname === href;

  const navItems = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/football', icon: '🏆', label: 'Sports' },
    { href: '/community', icon: '👥', label: 'Community' },
    { href: '/my-schools', icon: '★', label: 'My Schools' },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation - Hidden on md+ */}
      <nav className={`${styles.mobileBottomNav} md:hidden`} role="navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.mobileNavItem} ${isActive(item.href) ? styles.mobileNavItemActive : ''}`}
            title={item.label}
          >
            <span className={styles.mobileNavIcon}>{item.icon}</span>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${styles.mobileNavItem} ${styles.mobileNavMenu}`}
          title="Menu"
        >
          <span className={styles.mobileNavIcon}>☰</span>
          <span className={styles.mobileNavLabel}>Menu</span>
        </button>
      </nav>

      {/* Menu Overlay */}
      {isOpen && (
        <div
          className={styles.mobileMenuOverlay}
          onClick={() => setIsOpen(false)}
        >
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.mobileMenuClose}
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h2 className={styles.mobileMenuTitle}>Menu</h2>
            <nav className={styles.mobileMenuNav}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.mobileMenuItem}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
