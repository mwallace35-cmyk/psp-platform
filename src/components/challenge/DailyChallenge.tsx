'use client';

import React, { useState, useEffect } from 'react';
import styles from './challenge.module.css';
import { Button } from '@/components/ui';
import { CHALLENGE_BANK, type ChallengeQuestion } from './challengeData';

export default function DailyChallenge() {
  const [dailyQuestion, setDailyQuestion] = useState<ChallengeQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<1 | 2 | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed daily challenge based on current date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();
    const daysSinceEpoch = Math.floor(
      (new Date(year, month, date).getTime() - new Date(2026, 0, 1).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const questionIndex = daysSinceEpoch % CHALLENGE_BANK.length;
    setDailyQuestion(CHALLENGE_BANK[questionIndex]);
    setLoading(false);
  }, []);

  const handleAnswer = (choice: 1 | 2) => {
    if (!revealed && dailyQuestion) {
      setSelectedAnswer(choice);
      setRevealed(true);
      setIsCorrect(choice === dailyQuestion.answer);

      // Save to localStorage for streak tracking
      const today = new Date().toISOString().split('T')[0];
      const lastAttempt = localStorage.getItem('psp_challenge_date');
      const attempts = JSON.parse(localStorage.getItem('psp_challenge_attempts') || '{}');

      if (lastAttempt !== today) {
        const currentStreak = parseInt(localStorage.getItem('psp_challenge_streak') || '0');
        const lastDate = new Date(lastAttempt || today);
        const dayDifference = Math.floor(
          (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Streak continues only if it's the next day
        if (dayDifference === 1) {
          localStorage.setItem('psp_challenge_streak', String(currentStreak + 1));
        } else if (dayDifference > 1) {
          localStorage.setItem('psp_challenge_streak', '1');
        }

        localStorage.setItem('psp_challenge_date', today);
      }

      attempts[today] = choice === dailyQuestion.answer ? 'correct' : 'incorrect';
      localStorage.setItem('psp_challenge_attempts', JSON.stringify(attempts));
    }
  };

  const handleShare = () => {
    if (!dailyQuestion) return;

    const result = isCorrect ? '✅ Correct!' : '❌ Missed it!';
    const text = `I ${isCorrect ? 'correctly guessed' : 'tried'} PhillySportsPack's Daily Challenge!\n\n${result}\n\nCan you get it right? Play now! 🏀🏈`;

    if (navigator.share) {
      navigator.share({
        title: 'PhillySportsPack Daily Challenge',
        text: text,
        url: 'https://phillysportspack.com/challenge',
      });
    } else {
      // Fallback: copy to clipboard
      const fullText = `${text}\n\nhttps://phillysportspack.com/challenge`;
      navigator.clipboard.writeText(fullText).then(() => {
        alert('Copied to clipboard!');
      });
    }
  };

  if (loading || !dailyQuestion) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-[var(--psp-gold)]/30 border-t-[var(--psp-gold)] rounded-full animate-spin" />
        <p className="text-gray-300 mt-4">Loading today's challenge...</p>
      </div>
    );
  }

  return (
    <div className={styles.challengeContainer}>
      {/* Question Prompt */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl text-gray-200 font-medium mb-2">
          {dailyQuestion.statLabel}
        </h2>
        <p className="text-gray-300">Click to select your answer</p>
      </div>

      {/* Player Cards */}
      <div className={styles.playerCardsGrid}>
        {/* Player 1 */}
        <div
          className={`${styles.playerCard} ${
            selectedAnswer === 1 ? styles.selected : ''
          } ${revealed ? (selectedAnswer === 1 ? (isCorrect ? styles.correct : styles.incorrect) : '') : ''}`}
          onClick={() => !revealed && handleAnswer(1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (!revealed && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleAnswer(1);
            }
          }}
        >
          <div className={styles.cardInner}>
            {/* Front */}
            <div className={styles.cardFront}>
              <div className="bg-gradient-to-b from-[var(--psp-navy)] to-[#0f2040] p-6 rounded-lg">
                <h3 className="font-[var(--font-bebas)] text-2xl text-white mb-1">
                  {dailyQuestion.player1.name}
                </h3>
                <p className="text-[var(--psp-gold)] text-sm font-medium">
                  {dailyQuestion.player1.school}
                </p>
                <p className="text-gray-300 text-xs mt-1">{dailyQuestion.player1.year}</p>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="text-gray-300 text-xs">Stats Hidden</p>
                </div>
              </div>
            </div>

            {/* Back (revealed) */}
            {revealed && (
              <div className={styles.cardBack}>
                <div className="bg-gradient-to-b from-[var(--psp-navy)] to-[#0f2040] p-6 rounded-lg">
                  <h3 className="font-[var(--font-bebas)] text-2xl text-white mb-1">
                    {dailyQuestion.player1.name}
                  </h3>
                  <p className="text-[var(--psp-gold)] text-sm font-medium">
                    {dailyQuestion.player1.school}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-gray-300 text-xs mb-2">{dailyQuestion.statLabel}</p>
                    <p className="text-[var(--psp-gold)] font-[var(--font-bebas)] text-3xl">
                      {typeof dailyQuestion.player1Value === 'number' &&
                      dailyQuestion.player1Value % 1 !== 0
                        ? dailyQuestion.player1Value.toFixed(1)
                        : dailyQuestion.player1Value}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Player 2 */}
        <div
          className={`${styles.playerCard} ${
            selectedAnswer === 2 ? styles.selected : ''
          } ${revealed ? (selectedAnswer === 2 ? (isCorrect ? styles.correct : styles.incorrect) : '') : ''}`}
          onClick={() => !revealed && handleAnswer(2)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (!revealed && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleAnswer(2);
            }
          }}
        >
          <div className={styles.cardInner}>
            {/* Front */}
            <div className={styles.cardFront}>
              <div className="bg-gradient-to-b from-[var(--psp-navy)] to-[#0f2040] p-6 rounded-lg">
                <h3 className="font-[var(--font-bebas)] text-2xl text-white mb-1">
                  {dailyQuestion.player2.name}
                </h3>
                <p className="text-[var(--psp-gold)] text-sm font-medium">
                  {dailyQuestion.player2.school}
                </p>
                <p className="text-gray-300 text-xs mt-1">{dailyQuestion.player2.year}</p>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="text-gray-300 text-xs">Stats Hidden</p>
                </div>
              </div>
            </div>

            {/* Back (revealed) */}
            {revealed && (
              <div className={styles.cardBack}>
                <div className="bg-gradient-to-b from-[var(--psp-navy)] to-[#0f2040] p-6 rounded-lg">
                  <h3 className="font-[var(--font-bebas)] text-2xl text-white mb-1">
                    {dailyQuestion.player2.name}
                  </h3>
                  <p className="text-[var(--psp-gold)] text-sm font-medium">
                    {dailyQuestion.player2.school}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-gray-300 text-xs mb-2">{dailyQuestion.statLabel}</p>
                    <p className="text-[var(--psp-gold)] font-[var(--font-bebas)] text-3xl">
                      {typeof dailyQuestion.player2Value === 'number' &&
                      dailyQuestion.player2Value % 1 !== 0
                        ? dailyQuestion.player2Value.toFixed(1)
                        : dailyQuestion.player2Value}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {revealed && (
        <div className={`${styles.resultsSection} ${isCorrect ? styles.resultCorrect : styles.resultIncorrect}`}>
          <div className="text-center mb-6">
            <h3 className="text-3xl font-[var(--font-bebas)] mb-2">
              {isCorrect ? '🎯 CORRECT!' : '❌ INCORRECT'}
            </h3>
            <p className="text-gray-300">
              Only {dailyQuestion.successRate}% of players got this one right!
            </p>
          </div>

          {/* Stat Comparison */}
          <div className="bg-black/30 rounded-lg p-6 mb-6 border border-[var(--psp-gold)]/20">
            <div className="grid grid-cols-2 gap-4">
              <div className={`text-center ${selectedAnswer === 1 && isCorrect ? 'ring-2 ring-[var(--psp-gold)] rounded p-3' : ''}`}>
                <p className="text-gray-300 text-sm mb-2">{dailyQuestion.player1.name}</p>
                <p className="font-[var(--font-bebas)] text-3xl text-white">
                  {typeof dailyQuestion.player1Value === 'number' &&
                  dailyQuestion.player1Value % 1 !== 0
                    ? dailyQuestion.player1Value.toFixed(1)
                    : dailyQuestion.player1Value}
                </p>
                {dailyQuestion.answer === 1 && <p className="text-[var(--psp-gold)] text-xs mt-2">WINNER</p>}
              </div>
              <div className={`text-center ${selectedAnswer === 2 && isCorrect ? 'ring-2 ring-[var(--psp-gold)] rounded p-3' : ''}`}>
                <p className="text-gray-300 text-sm mb-2">{dailyQuestion.player2.name}</p>
                <p className="font-[var(--font-bebas)] text-3xl text-white">
                  {typeof dailyQuestion.player2Value === 'number' &&
                  dailyQuestion.player2Value % 1 !== 0
                    ? dailyQuestion.player2Value.toFixed(1)
                    : dailyQuestion.player2Value}
                </p>
                {dailyQuestion.answer === 2 && <p className="text-[var(--psp-gold)] text-xs mt-2">WINNER</p>}
              </div>
            </div>
          </div>

          {/* Share & Next */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="md"
              onClick={handleShare}
            >
              📤 Share Result
            </Button>
            <p className="text-gray-300 text-center sm:text-left sm:py-2">
              Come back tomorrow for a new challenge!
            </p>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-12 bg-black/30 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-300 text-sm text-center">
          All stats are based on high school performance only. Data sourced from official school records and MaxPreps.
        </p>
      </div>
    </div>
  );
}
