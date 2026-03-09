import Link from 'next/link';
import styles from '@/app/homepage.module.css';

interface AlumniCardData {
  name: string;
  team: string;
  school: string;
  emoji: string;
}

interface PhillyEverywhereProps {
  alumni: AlumniCardData[];
  totalCount: number;
}

export default function PhillyEverywhere({ alumni, totalCount }: PhillyEverywhereProps) {
  // Show up to 6 alumni cards
  const displayAlumni = alumni.slice(0, 6);

  return (
    <section className={styles.alumniSection}>
      <div className={styles.alumniContainer}>
        <div className={styles.alumniHeader}>
          <h2 className={styles.alumniTitle}>PHILLY EVERYWHERE</h2>
          <p className={styles.alumniSubtitle}>{totalCount} Athletes Tracked to the Pros</p>
        </div>

        <div className={styles.alumniGrid}>
          {displayAlumni.map((person, idx) => (
            <Link key={idx} href={`/search?q=${encodeURIComponent(person.school)}`}>
              <div className={styles.alumniCard}>
                <div className={styles.alumniCardName}>{person.name}</div>
                <div className={styles.alumniCardOrg}>{person.team}</div>
                <div className={styles.alumniCardSchool}>{person.school}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
