import Link from 'next/link';
import styles from '@/app/homepage.module.css';

interface SportNavigationGridProps {
  sports: Array<{
    id: string;
    name: string;
    slug: string;
    playerCount: number;
  }>;
}

export default function SportNavigationGrid({ sports }: SportNavigationGridProps) {
  const SPORT_EMOJIS: Record<string, string> = {
    football: '🏈',
    basketball: '🏀',
    baseball: '⚾',
    soccer: '⚽',
    lacrosse: '🥍',
    wrestling: '🤼',
    'track-field': '🏃',
  };

  return (
    <section className={styles.sportGridSection}>
      <div className={styles.sportGridContainer}>
        <h2 className={styles.sportGridTitle}>EXPLORE BY SPORT</h2>

        <div className={styles.sportGrid}>
          {sports.map((sport) => (
            <Link key={sport.id} href={`/${sport.slug}`}>
              <div className={styles.sportCard}>
                <div className={styles.sportCardHeader}>
                  <div>
                    <div className={styles.sportName}>{sport.name}</div>
                    <div className={styles.sportCount}>{sport.playerCount} Players</div>
                  </div>
                  <div className={styles.sportIcon}>
                    {SPORT_EMOJIS[sport.slug] || '🏅'}
                  </div>
                </div>
                <div className={styles.sportCardFooter}>
                  Explore →
                </div>
              </div>
            </Link>
          ))}

          {/* All Sports CTA */}
          <Link href="/search">
            <div className={`${styles.sportCard} ${styles.allSportsCard}`}>
              <div className={styles.allSportsIcon}>🔍</div>
              <div className={styles.allSportsLabel}>Search All</div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
