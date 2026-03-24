import Link from 'next/link';
import styles from '@/app/homepage.module.css';

interface GameScore {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  gameDate: string;
  sportId: string;
}

interface RecentScoresProps {
  scores: GameScore[];
}

export default function RecentScores({ scores }: RecentScoresProps) {
  const displayScores = scores.length > 0 ? scores.slice(0, 3) : [];

  if (displayScores.length === 0) {
    return null;
  }

  return (
    <section className={styles.scoresSection}>
      <div className={styles.scoresContainer}>
        <h2 className={styles.scoresTitle}>RECENT SCORES</h2>
        <div className={styles.scoresGrid}>
          {displayScores.map((game) => (
            <Link key={game.id} href={`/${game.sportId}/games/${game.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.scoreCard} style={{ cursor: 'pointer' }}>
                <div className={styles.scoreTeam}>
                  <span className={styles.scoreTeamName}>{game.awayTeam}</span>
                  <span className={styles.scoreTeamScore}>{game.awayScore}</span>
                </div>
                <div className={styles.scoreTeam}>
                  <span className={styles.scoreTeamName}>{game.homeTeam}</span>
                  <span className={styles.scoreTeamScore}>{game.homeScore}</span>
                </div>
                <div className={styles.scoreDate}>
                  {new Date(game.gameDate).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
