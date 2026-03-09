'use client';

import React, { useState, useEffect } from 'react';
import styles from './emoji-reactions.module.css';

export interface ReactionCounts {
  fire: number;
  ice: number;
  cap: number;
}

interface EmojiReactionsProps {
  entityId: string;
  entityType: 'comment' | 'article' | 'post';
  initialReactions?: ReactionCounts;
  onReactionChange?: (reactions: ReactionCounts) => void;
}

const REACTIONS = [
  { emoji: '🔥', label: 'Fire Take', key: 'fire' },
  { emoji: '🧊', label: 'Cold Take', key: 'ice' },
  { emoji: '🧢', label: 'Cap/Disagree', key: 'cap' },
];

export default function EmojiReactions({
  entityId,
  entityType,
  initialReactions = { fire: 0, ice: 0, cap: 0 },
  onReactionChange,
}: EmojiReactionsProps) {
  const [reactions, setReactions] = useState<ReactionCounts>(initialReactions);
  const [userReaction, setUserReaction] = useState<'fire' | 'ice' | 'cap' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const storageKey = `psp_reaction_${entityType}_${entityId}`;

  useEffect(() => {
    // Load user's reaction from localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setUserReaction(saved as 'fire' | 'ice' | 'cap');
    }
  }, [entityId, entityType, storageKey]);

  const handleReaction = async (reactionKey: 'fire' | 'ice' | 'cap') => {
    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const previousReactions = { ...reactions };
    const previousUserReaction = userReaction;

    // Remove previous reaction
    if (userReaction && userReaction in reactions) {
      setReactions((prev) => ({
        ...prev,
        [userReaction]: Math.max(0, prev[userReaction] - 1),
      }));
    }

    // Add new reaction
    setReactions((prev) => ({
      ...prev,
      [reactionKey]: prev[reactionKey] + 1,
    }));

    setUserReaction(userReaction === reactionKey ? null : reactionKey);

    // Save to localStorage
    if (userReaction === reactionKey) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, reactionKey);
    }

    // TODO: In a real app, sync with backend
    // try {
    //   await fetch(`/api/reactions`, {
    //     method: 'POST',
    //     body: JSON.stringify({ entityId, entityType, reaction: reactionKey }),
    //   });
    // } catch (error) {
    //   // Revert on error
    //   setReactions(previousReactions);
    //   setUserReaction(previousUserReaction);
    // }

    setIsLoading(false);

    if (onReactionChange) {
      onReactionChange(reactions);
    }
  };

  const mostPopular = Object.entries(reactions).reduce((prev, current) =>
    prev[1] > current[1] ? prev : current
  )[0];

  return (
    <div className={styles.reactionsContainer}>
      <div className={styles.reactionsGrid}>
        {REACTIONS.map((reaction) => (
          <button
            key={reaction.key}
            onClick={() => handleReaction(reaction.key as 'fire' | 'ice' | 'cap')}
            className={`${styles.reactionButton} ${
              userReaction === reaction.key ? styles.selected : ''
            } ${mostPopular === reaction.key ? styles.mostPopular : ''}`}
            title={reaction.label}
            disabled={isLoading}
            aria-label={`${reaction.label}: ${reactions[reaction.key as keyof ReactionCounts]} votes`}
          >
            <span className={styles.emoji}>{reaction.emoji}</span>
            <span className={styles.count}>
              {reactions[reaction.key as keyof ReactionCounts]}
            </span>
          </button>
        ))}
      </div>

      {mostPopular && (
        <p className={styles.popularNote}>
          Most popular: {REACTIONS.find((r) => r.key === mostPopular)?.emoji}
        </p>
      )}
    </div>
  );
}
