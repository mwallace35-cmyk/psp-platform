'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './challenge.module.css';
import { Button } from '@/components/ui';

interface ChallengeQuestion {
  id: number;
  player1: {
    name: string;
    school: string;
    year: string;
    slug: string;
    sport: string;
  };
  player2: {
    name: string;
    school: string;
    year: string;
    slug: string;
    sport: string;
  };
  stat: string;
  statLabel: string;
  answer: 1 | 2; // 1 or 2 indicating which player had more
  player1Value: number;
  player2Value: number;
  difficulty: 'easy' | 'medium' | 'hard';
  successRate: number; // percentage of users who got it right
}

const CHALLENGE_BANK: ChallengeQuestion[] = [
  {
    id: 1,
    player1: { name: 'Marvin Harrison', school: 'Roman Catholic', year: '1999', slug: 'marvin-harrison', sport: 'football' },
    player2: { name: 'Mike Mamula', school: 'Boston College', year: '1996', slug: 'mike-mamula', sport: 'football' },
    stat: 'receiving_yards',
    statLabel: 'Receiving Yards (Single Season)',
    answer: 1,
    player1Value: 1454,
    player2Value: 1200,
    difficulty: 'hard',
    successRate: 42,
  },
  {
    id: 2,
    player1: { name: 'Kobe Bryant', school: 'Lower Merion', year: '1996', slug: 'kobe-bryant', sport: 'basketball' },
    player2: { name: 'Kyle Lowry', school: 'Cardinal O\'Hara', year: '2003', slug: 'kyle-lowry', sport: 'basketball' },
    stat: 'points_per_game',
    statLabel: 'Points Per Game (Career)',
    answer: 1,
    player1Value: 31.1,
    player2Value: 19.2,
    difficulty: 'medium',
    successRate: 58,
  },
  {
    id: 3,
    player1: { name: 'Jalen Duren', school: 'Imhotep Charter', year: '2022', slug: 'jalen-duren', sport: 'basketball' },
    player2: { name: 'Marvin Harrison Jr.', school: 'St. Joseph\'s Prep', year: '2022', slug: 'marvin-harrison-jr', sport: 'football' },
    stat: 'all_star_selections',
    statLabel: 'All-Star/All-City Selections',
    answer: 2,
    player1Value: 2,
    player2Value: 3,
    difficulty: 'hard',
    successRate: 35,
  },
  {
    id: 4,
    player1: { name: 'D\'Andre Swift', school: 'St. Joseph\'s Prep', year: '2016', slug: 'dandre-swift', sport: 'football' },
    player2: { name: 'Kyle McCord', school: 'St. Joseph\'s Prep', year: '2018', slug: 'kyle-mccord', sport: 'football' },
    stat: 'passing_yards',
    statLabel: 'Single Season Passing Yards',
    answer: 2,
    player1Value: 0,
    player2Value: 3847,
    difficulty: 'hard',
    successRate: 28,
  },
  {
    id: 5,
    player1: { name: 'Wilt Chamberlain', school: 'Overbrook', year: '1955', slug: 'wilt-chamberlain', sport: 'basketball' },
    player2: { name: 'Tom Gola', school: 'La Salle HS', year: '1951', slug: 'tom-gola', sport: 'basketball' },
    stat: 'nba_championships',
    statLabel: 'NBA Championships',
    answer: 1,
    player1Value: 2,
    player2Value: 1,
    difficulty: 'medium',
    successRate: 65,
  },
  {
    id: 6,
    player1: { name: 'Eddie Griffin', school: 'Roman Catholic', year: '1997', slug: 'eddie-griffin', sport: 'basketball' },
    player2: { name: 'Jalen Duren', school: 'Imhotep Charter', year: '2022', slug: 'jalen-duren', sport: 'basketball' },
    stat: 'nba_draft_position',
    statLabel: 'NBA Draft Position (Lower is Better)',
    answer: 2,
    player1Value: 18,
    player2Value: 5,
    difficulty: 'medium',
    successRate: 52,
  },
  {
    id: 7,
    player1: { name: 'Roman Catholic', school: 'Roman Catholic', year: '2021', slug: 'roman-catholic-bb', sport: 'basketball' },
    player2: { name: 'Neumann-Goretti', school: 'Neumann-Goretti', year: '2024', slug: 'neumann-goretti-bb', sport: 'basketball' },
    stat: 'state_championships',
    statLabel: 'All-Time State Championships',
    answer: 2,
    player1Value: 4,
    player2Value: 10,
    difficulty: 'easy',
    successRate: 72,
  },
  {
    id: 8,
    player1: { name: 'St. Joseph\'s Prep', school: 'St. Joseph\'s Prep', year: '2023', slug: 'sjp-fb', sport: 'football' },
    player2: { name: 'Imhotep Charter', school: 'Imhotep Charter', year: '2024', slug: 'imhotep-fb', sport: 'football' },
    stat: 'playoff_appearances',
    statLabel: 'Consecutive Playoff Appearances',
    answer: 1,
    player1Value: 23,
    player2Value: 12,
    difficulty: 'hard',
    successRate: 31,
  },
  {
    id: 9,
    player1: { name: 'Rasual Butler', school: 'Roman Catholic', year: '1998', slug: 'rasual-butler', sport: 'basketball' },
    player2: { name: 'Earl Monroe', school: 'Bartram', year: '1963', slug: 'earl-monroe', sport: 'basketball' },
    stat: 'hof_inducted',
    statLabel: 'Hall of Fame Inducted',
    answer: 2,
    player1Value: 0,
    player2Value: 1,
    difficulty: 'hard',
    successRate: 24,
  },
  {
    id: 10,
    player1: { name: 'La Salle College HS', school: 'La Salle College HS', year: '2021', slug: 'lasalle-baseball', sport: 'baseball' },
    player2: { name: 'Father Judge HS', school: 'Father Judge HS', year: '2023', slug: 'judge-baseball', sport: 'baseball' },
    stat: 'state_titles',
    statLabel: 'State Baseball Championships',
    answer: 1,
    player1Value: 3,
    player2Value: 1,
    difficulty: 'medium',
    successRate: 48,
  },
];

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
        <p className="text-gray-400 mt-4">Loading today's challenge...</p>
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
        <p className="text-gray-400">Click to select your answer</p>
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
                <p className="text-gray-400 text-xs mt-1">{dailyQuestion.player1.year}</p>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="text-gray-400 text-xs">Stats Hidden</p>
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
                    <p className="text-gray-400 text-xs mb-2">{dailyQuestion.statLabel}</p>
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
                <p className="text-gray-400 text-xs mt-1">{dailyQuestion.player2.year}</p>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="text-gray-400 text-xs">Stats Hidden</p>
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
                    <p className="text-gray-400 text-xs mb-2">{dailyQuestion.statLabel}</p>
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
                <p className="text-gray-400 text-sm mb-2">{dailyQuestion.player1.name}</p>
                <p className="font-[var(--font-bebas)] text-3xl text-white">
                  {typeof dailyQuestion.player1Value === 'number' &&
                  dailyQuestion.player1Value % 1 !== 0
                    ? dailyQuestion.player1Value.toFixed(1)
                    : dailyQuestion.player1Value}
                </p>
                {dailyQuestion.answer === 1 && <p className="text-[var(--psp-gold)] text-xs mt-2">WINNER</p>}
              </div>
              <div className={`text-center ${selectedAnswer === 2 && isCorrect ? 'ring-2 ring-[var(--psp-gold)] rounded p-3' : ''}`}>
                <p className="text-gray-400 text-sm mb-2">{dailyQuestion.player2.name}</p>
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
            <p className="text-gray-400 text-center sm:text-left sm:py-2">
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
