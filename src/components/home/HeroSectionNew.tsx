'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '@/app/homepage.module.css';
import ScrollIndicator from './ScrollIndicator';

/**
 * Animated Counter Component
 * Counts up from 0 to target value when component mounts
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
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;
    const startTime = Date.now();
    const duration = 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const nextValue = Math.floor(value * progress);

      if (progress < 1) {
        setDisplayValue(nextValue);
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

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
          Track the stats, celebrate the champions, and discover tomorrow's stars across 13 sports and 25+ years of history
        </p>

        {/* CTAs */}
        <div className={styles.heroCTAContainer}>
          <Link href="/search" className={`${styles.heroCTA} ${styles.heroCTAPrimary}`}>
            Find Your School
          </Link>
          <Link href="/football" className={`${styles.heroCTA} ${styles.heroCTASecondary}`}>
            Browse Sports
          </Link>
        </div>

        {/* Animated Stats */}
        <div className={styles.heroStats}>
          <AnimatedCounter value={stats.players} label="Players" />
          <AnimatedCounter value={stats.schools} label="Schools" />
          <AnimatedCounter value={stats.championships} label="Championships" />
          <AnimatedCounter value={stats.years} label="Years of Data" suffix="+" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}
