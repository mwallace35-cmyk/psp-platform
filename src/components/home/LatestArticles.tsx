import Link from 'next/link';
import styles from '@/app/homepage.module.css';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  sport_id: string;
  featured_image_url: string;
  published_at: string;
}

interface LatestArticlesProps {
  articles: Article[];
}

const SPORT_COLORS: Record<string, string> = {
  football: '#16a34a',
  basketball: '#3b82f6',
  baseball: '#dc2626',
  soccer: '#059669',
  lacrosse: '#0891b2',
  wrestling: '#ca8a04',
  'track-field': '#7c3aed',
};

export default function LatestArticles({ articles }: LatestArticlesProps) {
  const displayArticles = articles.slice(0, 3);

  if (displayArticles.length === 0) {
    return null;
  }

  return (
    <section className={styles.articlesSection}>
      <div className={styles.articlesContainer}>
        <h2 className={styles.articlesTitle}>LATEST ARTICLES</h2>
        <div className={styles.articlesGrid}>
          {displayArticles.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`}>
              <article className={styles.articleCard}>
                <div
                  className={styles.articleImage}
                  style={{
                    background: SPORT_COLORS[article.sport_id] || '#e2e8f0',
                  }}
                />
                <div className={styles.articleContent}>
                  <span className={styles.articleSport}>{article.sport_id || 'News'}</span>
                  <h3 className={styles.articleTitle}>{article.title}</h3>
                  <p className={styles.articleExcerpt}>{article.excerpt}</p>
                  <time className={styles.articleDate}>
                    {new Date(article.published_at).toLocaleDateString()}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
