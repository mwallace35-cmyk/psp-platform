import React from 'react';
import styles from './contributor-leaderboard.module.css';

export interface Contributor {
  rank: number;
  username: string;
  contributionCount: number;
  streak: number;
  avatarUrl?: string;
}

interface ContributorLeaderboardProps {
  contributors: Contributor[];
  currentUserRank?: number;
  period?: 'weekly' | 'monthly' | 'all-time';
}

export default function ContributorLeaderboard({
  contributors,
  currentUserRank,
  period = 'weekly',
}: ContributorLeaderboardProps) {
  const topContributors = contributors.slice(0, 10);
  const medals = ['🥇', '🥈', '🥉'];

  const periodLabel = {
    weekly: 'This Week',
    monthly: 'This Month',
    'all-time': 'All Time',
  };

  return (
    <div className={styles.leaderboardWidget}>
      <div className={styles.header}>
        <h3 className={styles.title}>Top Contributors</h3>
        <span className={styles.period}>{periodLabel[period]}</span>
      </div>

      <div className={styles.leaderboardList}>
        {topContributors.map((contributor) => (
          <div
            key={contributor.rank}
            className={`${styles.leaderboardItem} ${contributor.rank === 1 ? styles.topRank : ''}`}
          >
            {/* Rank Badge */}
            <div className={styles.rankBadge}>
              {contributor.rank <= 3 ? (
                <span className={styles.medal}>{medals[contributor.rank - 1]}</span>
              ) : (
                <span className={styles.rankNumber}>#{contributor.rank}</span>
              )}
            </div>

            {/* Avatar */}
            {contributor.avatarUrl ? (
              <img
                src={contributor.avatarUrl}
                alt={contributor.username}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {contributor.username.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className={styles.info}>
              <h4 className={styles.username}>{contributor.username}</h4>
              <p className={styles.contributions}>
                {contributor.contributionCount} contributions
              </p>
            </div>

            {/* Streak */}
            {contributor.streak > 0 && (
              <div className={styles.streak}>
                <span className={styles.streakIcon}>🔥</span>
                <span className={styles.streakCount}>{contributor.streak}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current User Rank */}
      {currentUserRank && currentUserRank > 10 && (
        <div className={styles.userRankSection}>
          <div className={styles.divider} />
          <div className={styles.userRank}>
            <span className={styles.yourRankLabel}>Your rank:</span>
            <span className={styles.yourRankValue}>#{currentUserRank}</span>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <a href="/pulse" className={styles.viewAllLink}>
          View Full Leaderboard →
        </a>
      </div>
    </div>
  );
}
