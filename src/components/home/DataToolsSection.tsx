import Link from 'next/link';
import styles from '@/app/homepage.module.css';

export default function DataToolsSection() {
  const tools = [
    {
      icon: '🔍',
      name: 'Advanced Search',
      desc: 'Find any player, school, or stat across 25+ years',
      href: '/search',
    },
    {
      icon: '📊',
      name: 'Record Book',
      desc: 'All-time records and leaderboards by sport',
      href: '/football/records',
    },
    {
      icon: '⚖️',
      name: 'Compare Players',
      desc: 'Head-to-head career stat comparison',
      href: '/compare',
    },
    {
      icon: '⭐',
      name: 'Before They Were Famous',
      desc: 'NFL, NBA, MLB pros from Philly high schools',
      href: '/pros',
    },
  ];

  return (
    <section className={styles.dataToolsSection}>
      <div className={styles.dataToolsContainer}>
        <h3 className={styles.dataToolsTitle}>EXPLORE YOUR STATS</h3>
        <div className={styles.dataToolsGrid}>
          {tools.map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <div className={styles.dataToolCard}>
                <div className={styles.dataToolIcon}>{tool.icon}</div>
                <div className={styles.dataToolName}>{tool.name}</div>
                <p className={styles.dataToolDesc}>{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
