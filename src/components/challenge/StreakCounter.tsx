'use client';

import React, { useState, useEffect } from 'react';
import styles from './streak.module.css';

export default function StreakCounter() {
  const [streak, setStreak] = useState(0);
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get streak from localStorage
    const storedStreak = parseInt(localStorage.getItem('psp_challenge_streak') || '0');
    setStreak(storedStreak);

    // Get current day of week for progress ring
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    const dayInWeek = (today === 0 ? 7 : today); // Convert to 1-7
    setDayOfWeek(dayInWeek);

    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (dayOfWeek / 7) * circumference;

  return (
    <div className={styles.streakContainer}>
      <div className={styles.ringWrapper}>
        <svg width="120" height="120" viewBox="0 0 120 120" className={styles.progressRing}>
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="var(--psp-gold)"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={styles.progressCircle}
            style={{
              transition: 'stroke-dashoffset 0.3s ease-out',
            }}
          />
        </svg>

        {/* Center content */}
        <div className={styles.centerContent}>
          <div className={styles.streakNumber}>{streak}</div>
          <div className={styles.streakLabel}>Streak</div>
        </div>
      </div>

      {/* Day indicators */}
      <div className={styles.dayIndicators}>
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className={`${styles.dayDot} ${i + 1 <= dayOfWeek ? styles.completed : ''}`}
            title={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
          />
        ))}
      </div>
    </div>
  );
}
