'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '@/app/homepage.module.css';
import ScrollIndicator from './ScrollIndicator';
import EditorialTeaser from './EditorialTeaser';

/**
 * Animated Counter Component
 * SSR renders the real value (no flash of "0").
 * After hydration the counter animates up from 0 to the target value.
 */
function AnimatedCounter({
  value,
  label,
  suffix = '',
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  // â FIX: initialise with `value` so SSR / first paint shows real numbers.
  // The animation still runs on the client after mount.
  const [displayValue, setDisplayValue] = useState(value);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 1200;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(value * eased));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasMounted, value]);

  return (
    <div className={styles.statBlock}>
      <div className={styles.statValue}>
        {displayValue.toLocaleString()}
        {suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

interface HeroSectionProps {
  stats: {
    players: number;
    schools: number;
    championships: number;
    years: number;
  };
}

export default function HeroSectionNew({ stats }: HeroSectionProps) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        {/* Headline */}
        <h1 className={styles.heroHeadline}>BUILT BY LEGENDS. PROVEN BY DATA.</h1>

        {/* Subheading */}
        <p className={styles.heroSubheading}>
          Track the stats, celebrate the champions, and discover tomorrow&apos;s stars across 13
          sports and 25+ years of history
        </p>

        {/* CTAs */}
        <div className={styles.heroCTAContainer}>
          <Link href="/search" className={`${styles.heroCTA} ${styles.heroCTAPrimary}`}>
            Find Your School
          </Link>
          <Link href="/schools" className={`${styles.heroCTA} ${styles.heroCTASecondary}`}>
            Browse Sports
          </Link>
        </div>

        {/* Animated Stats â real values on first paint, animate after hydration */}
        <div className={styles.heroStats}>
          <AnimatedCounter value={stats.players}       label="Players" />
          <AnimatedCounter value={stats.schools}       label="Schools" />
          <AnimatedCounter value={stats.championships} label="Championships" />
          <AnimatedCounter value={stats.years}         label="Years of Data" suffix="+" />
        </div>

        {/* Editorial Teaser */}
        <EditorialTeaser />
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}
