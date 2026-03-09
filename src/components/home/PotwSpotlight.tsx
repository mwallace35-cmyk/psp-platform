'use client';

import { useState } from 'react';
import styles from '@/app/homepage.module.css';

interface PotwNominee {
  id: string;
  playerName: string;
  schoolName: string;
  sportId: string;
  statLine: string;
  votes: number;
}

interface PotwSpotlightProps {
  nominees: PotwNominee[];
}

export default function PotwSpotlight({ nominees }: PotwSpotlightProps) {
  const [localVotes, setLocalVotes] = useState<Record<string, number>>({});

  const handleVote = (nomineeId: string) => {
    setLocalVotes(prev => ({
      ...prev,
      [nomineeId]: (prev[nomineeId] || 0) + 1
    }));
  };

  const displayNominees = nominees.length > 0 ? nominees : [
    {
      id: '1',
      playerName: 'Top Nominee',
      schoolName: 'Sample School',
      sportId: 'football',
      statLine: '285 yards, 3 TDs',
      votes: 437,
    }
  ];

  return (
    <section className={styles.potwSection}>
      <div className={styles.potwContainer}>
        <h2 className={styles.potwTitle}>PLAYER OF THE WEEK</h2>

        <div className={styles.potwNomineeCard}>
          {displayNominees[0] && (
            <>
              <div className={styles.nomineeImage}>🏆</div>
              <div className={styles.nomineeName}>{displayNominees[0].playerName}</div>
              <div className={styles.nomineeSchool}>{displayNominees[0].schoolName}</div>
              <div className={styles.nomineeStatLine}>{displayNominees[0].statLine}</div>
              <button
                onClick={() => handleVote(displayNominees[0].id)}
                className={styles.nomineeVoteBtn}
              >
                VOTE
              </button>
              <div className={styles.voteCount}>
                {(displayNominees[0].votes + (localVotes[displayNominees[0].id] || 0))} people voted
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
