'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export interface HeroSectionProps {
  stats: {
    players: number;
    schools: number;
    sports: number;
    yearsActive: number;
  };
}

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
    const duration = 1000; // 1 second animation duration

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

    // Start animation after a small delay to sync with page load
    timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return (
    <div className="text-center sm:text-left">
      <div className="text-2xl sm:text-3xl font-bold text-[var(--psp-gold)] font-bebas">
        {displayValue.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs sm:text-sm text-white/70 mt-1">{label}</div>
    </div>
  );
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <section className="relative w-full bg-gradient-to-br from-[var(--psp-navy)] via-[var(--psp-navy-mid)] to-[#1a4d8f] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
      {/* Decorative background element */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--psp-gold) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 font-bebas tracking-wide">
          Philadelphia&apos;s Home for High School Sports
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-white/95 mb-8 sm:mb-10 max-w-2xl leading-relaxed">
          Track the stats, celebrate the champions, and discover tomorrow&apos;s stars across 13 sports and 25+ years of history
        </p>

        {/* Search box with icon */}
        <div className="mb-10 sm:mb-12">
          <div
            className={`relative transition-all duration-300 ${
              searchFocused ? 'ring-2 ring-[var(--psp-gold)]' : ''
            }`}
          >
            <input
              type="text"
              placeholder="Find your school, your player, your stats..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white text-[var(--psp-navy)] placeholder-gray-500 rounded-lg text-base sm:text-lg focus:outline-none transition-shadow"
              disabled
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-white/70 mt-2">Search by school name, player name, or stat</p>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {[
            {
              href: '/search',
              icon: '🏫',
              label: 'Browse Schools',
              description: 'Explore profiles',
            },
            {
              href: '/search?q=recent',
              icon: '📊',
              label: 'Leaderboards',
              description: 'Top stats',
            },
            {
              href: '/compare',
              icon: '⚖️',
              label: 'Compare Players',
              description: 'Head-to-head',
            },
            {
              href: '/search?q=championships',
              icon: '🏆',
              label: 'Championships',
              description: 'Titles & records',
            },
          ].map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group flex flex-col items-center gap-2 p-3 sm:p-4 bg-white/10 hover:bg-white/15 rounded-lg transition-all duration-300 border border-white/10 hover:border-[var(--psp-gold)]/30"
            >
              <span className="text-2xl sm:text-3xl">{card.icon}</span>
              <div className="text-center">
                <div className="text-white text-sm sm:text-base font-semibold group-hover:text-[var(--psp-gold)] transition-colors">
                  {card.label}
                </div>
                <div className="text-white/70 text-xs">{card.description}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats strip with animated counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-10 border-t border-white/10">
          <AnimatedCounter value={stats.players} label="Players Tracked" />
          <AnimatedCounter value={stats.schools} label="Schools" />
          <AnimatedCounter value={stats.sports} label="Sports" />
          <AnimatedCounter value={stats.yearsActive} label="Years of Data" suffix="+" />
        </div>
      </div>
    </section>
  );
}
