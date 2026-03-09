'use client';

import { useState } from 'react';
import styles from '@/app/homepage.module.css';

interface HotTake {
  id: string;
  userHandle: string;
  content: string;
  upvotes: number;
  downvotes: number;
}

interface CommunityPulseProps {
  takes: HotTake[];
}

export default function CommunityPulse({ takes }: CommunityPulseProps) {
  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({});

  const displayTakes = takes.length > 0 ? takes.slice(0, 3) : [];

  const handleVote = (id: string, direction: 'up' | 'down') => {
    setVotes(prev => ({
      ...prev,
      [id]: prev[id] === direction ? null : direction
    }));
  };

  if (displayTakes.length === 0) {
    return null;
  }

  return (
    <section className={styles.communitySection}>
      <div className={styles.communityContainer}>
        <h2 className={styles.communityTitle}>COMMUNITY TAKES</h2>
        <div className={styles.takesGrid}>
          {displayTakes.map((take) => {
            const upvoteRatio = take.upvotes + take.downvotes > 0
              ? Math.round((take.upvotes / (take.upvotes + take.downvotes)) * 100)
              : 0;
            const isFire = upvoteRatio >= 90;

            return (
              <div key={take.id} className={styles.takeCard}>
                <div className={styles.takeHeader}>
                  <span className={styles.takeHandle}>{take.userHandle}</span>
                  {isFire && <span className={styles.takeRating}>🔥 {upvoteRatio}%</span>}
                </div>
                <p className={styles.takeContent}>{take.content}</p>
                <div className={styles.takeVotes}>
                  <button
                    onClick={() => handleVote(take.id, 'up')}
                    className={`${styles.voteBtn} ${votes[take.id] === 'up' ? styles.active : ''}`}
                  >
                    👍 {take.upvotes + (votes[take.id] === 'up' ? 1 : votes[take.id] === 'down' ? -1 : 0)}
                  </button>
                  <button
                    onClick={() => handleVote(take.id, 'down')}
                    className={`${styles.voteBtn} ${votes[take.id] === 'down' ? styles.active : ''}`}
                  >
                    👎 {take.downvotes + (votes[take.id] === 'down' ? 1 : votes[take.id] === 'up' ? -1 : 0)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
