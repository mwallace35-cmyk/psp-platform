import styles from '@/app/homepage.module.css';

interface LiveStatsStripProps {
  topScorer?: { name: string; stat: string };
  activeStreaks?: { school: string; count: number };
  recentRecord?: string;
  weeklyGames?: number;
}

export default function LiveStatsStrip({
  topScorer = { name: 'Jalen Duren', stat: '28.5 PPG' },
  activeStreaks = { school: 'Neumann-Goretti', count: 12 },
  recentRecord = 'All-City Record Set',
  weeklyGames = 24,
}: LiveStatsStripProps) {
  return (
    <section className={styles.liveStatsStrip}>
      <div className={styles.liveStatsContainer}>
        {/* Top Scorer */}
        <div className={`${styles.statBlockCard} ${styles.pulse}`}>
          <div className={styles.statBlockLabel}>Top Scorer</div>
          <div className={styles.statBlockValue}>{topScorer.name}</div>
          <div className={styles.statBlockSubtext}>{topScorer.stat}</div>
        </div>

        {/* Active Streaks */}
        <div className={styles.statBlockCard}>
          <div className={styles.statBlockLabel}>Active Streaks</div>
          <div className={styles.statBlockValue}>{activeStreaks.school}</div>
          <div className={styles.statBlockSubtext}>{activeStreaks.count} Game Win Streak</div>
        </div>

        {/* Recent Record */}
        <div className={styles.statBlockCard}>
          <div className={styles.statBlockLabel}>Records Set</div>
          <div className={styles.statBlockValue} style={{ fontSize: '1.25rem' }}>
            {recentRecord}
          </div>
          <div className={styles.statBlockSubtext}>This season</div>
        </div>

        {/* Weekly Games */}
        <div className={styles.statBlockCard}>
          <div className={styles.statBlockLabel}>Weekly Games</div>
          <div className={styles.statBlockValue}>{weeklyGames}</div>
          <div className={styles.statBlockSubtext}>In Play</div>
        </div>
      </div>
    </section>
  );
}
