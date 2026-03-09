import Link from 'next/link';
import { SPORT_META, type SportId } from '@/lib/sports';

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  sport_id: SportId;
  featured_image_url: string | null;
  published_at: string;
}

export interface LatestCoverageSectionProps {
  articles: Article[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function ArticleCard({ article }: { article: Article }) {
  const sportMeta = SPORT_META[article.sport_id] || SPORT_META.football;
  const hasImage = !!article.featured_image_url;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col h-full overflow-hidden rounded-lg bg-white [data-theme=dark]:bg-[var(--psp-navy-light)] border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)] hover:shadow-lg transition-shadow"
    >
      {/* Featured image or fallback gradient */}
      <div
        className="relative w-full h-48 sm:h-56 bg-gradient-to-br from-[var(--psp-navy)] to-[var(--psp-blue)] overflow-hidden flex items-center justify-center"
        style={
          hasImage
            ? {
                backgroundImage: `url(${article.featured_image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {!hasImage && (
          <div className="text-6xl opacity-50">{sportMeta.emoji}</div>
        )}

        {/* Sport badge overlay */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[var(--psp-gold)] text-[var(--psp-navy)] font-semibold text-xs sm:text-sm rounded-full">
            <span>{sportMeta.emoji}</span>
            <span>{sportMeta.name}</span>
          </span>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col p-4 sm:p-6">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white mb-3 line-clamp-2 group-hover:text-[var(--psp-blue)] [data-theme=dark]:group-hover:text-[var(--psp-gold)] transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm sm:text-base text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-300)] mb-4 line-clamp-2 flex-1 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Footer with date */}
        <div className="pt-3 sm:pt-4 border-t border-[var(--psp-gray-100)] [data-theme=dark]:border-[var(--psp-navy)]">
          <span className="text-xs sm:text-sm text-[var(--psp-gray-500)] [data-theme=dark]:text-[var(--psp-gray-400)]">
            {formatDate(article.published_at)}
          </span>
        </div>
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-5 h-5 text-[var(--psp-navy)] [data-theme=dark]:text-[var(--psp-gold)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>
    </Link>
  );
}

export default function LatestCoverageSection({
  articles,
}: LatestCoverageSectionProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  const displayArticles = articles.slice(0, 3);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white [data-theme=dark]:bg-[var(--psp-navy)]/40">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white font-bebas tracking-wide mb-3 sm:mb-4">
            Latest Coverage
          </h2>
          <p className="text-base sm:text-lg text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-300)] max-w-2xl">
            Stay up to date with the latest Philadelphia high school sports news and highlights
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 lg:mb-16">
          {displayArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[var(--psp-navy)] [data-theme=dark]:bg-[var(--psp-gold)] text-white [data-theme=dark]:text-[var(--psp-navy)] font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            View All Articles
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
