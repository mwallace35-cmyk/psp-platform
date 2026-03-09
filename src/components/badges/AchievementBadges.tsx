import React from 'react';
import BadgeIcon from './BadgeIcon';
import styles from './badges.module.css';

export interface BadgeData {
  type: 'voter' | 'explorer' | 'fact_checker' | 'superfan';
  earned: boolean;
  progress?: number; // 0-100
  level?: 'bronze' | 'silver' | 'gold';
}

interface AchievementBadgesProps {
  badges: BadgeData[];
  userId?: string;
}

const BADGE_INFO = {
  voter: {
    name: 'Voter',
    description: 'Voted on 5 or more POTW polls',
  },
  explorer: {
    name: 'Explorer',
    description: 'Visited 10 or more pages',
  },
  fact_checker: {
    name: 'Fact Checker',
    description: 'Submitted 5 corrections or more',
  },
  superfan: {
    name: 'Superfan',
    description: 'Earned all other badges',
  },
};

export default function AchievementBadges({ badges, userId }: AchievementBadgesProps) {
  return (
    <div className={styles.badgesGrid}>
      {badges.map((badge) => {
        const info = BADGE_INFO[badge.type];
        const level = badge.level || (badge.earned ? 'gold' : 'bronze');

        return (
          <div
            key={badge.type}
            className={`${styles.badgeCard} ${badge.earned ? styles.earned : styles.locked}`}
          >
            <div className={styles.badgeIconWrapper}>
              <BadgeIcon type={badge.type} level={level} />
            </div>

            <h3 className={styles.badgeName}>{info.name}</h3>
            <p className={styles.badgeDescription}>{info.description}</p>

            {!badge.earned && badge.progress !== undefined && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
                <span className={styles.progressText}>{Math.round(badge.progress)}%</span>
              </div>
            )}

            {badge.earned && (
              <div className={styles.earnedBadge}>
                <span>✓ Earned</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
