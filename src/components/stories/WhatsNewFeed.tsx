import Link from 'next/link';
import { SPORT_META, type SportId } from '@/lib/sports';

export type ActivityType = 'article' | 'championship' | 'record' | 'player';

export interface FeedItem {
  type: ActivityType;
  title: string;
  description: string;
  link: string;
  timestamp: string;
  sport?: SportId;
  icon?: string;
}

export interface WhatsNewFeedProps {
  items: FeedItem[];
}

function getActivityIcon(type: ActivityType): string {
  switch (type) {
    case 'article':
      return '📰';
    case 'championship':
      return '🏆';
    case 'record':
      return '⚡';
    case 'player':
      return '⭐';
    default:
      return '📢';
  }
}

function getActivityLabel(type: ActivityType): string {
  switch (type) {
    case 'article':
      return 'New Article';
    case 'championship':
      return 'Championship';
    case 'record':
      return 'New Record';
    case 'player':
      return 'New Player';
    default:
      return 'Update';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function ActivityBadge({ type, sport }: { type: ActivityType; sport?: SportId }) {
  const badgeColors: Record<ActivityType, string> = {
    article: 'bg-blue-100 text-blue-700 [data-theme=dark]:bg-blue-900/30 [data-theme=dark]:text-blue-300',
    championship: 'bg-yellow-100 text-yellow-700 [data-theme=dark]:bg-yellow-900/30 [data-theme=dark]:text-yellow-300',
    record: 'bg-purple-100 text-purple-700 [data-theme=dark]:bg-purple-900/30 [data-theme=dark]:text-purple-300',
    player: 'bg-green-100 text-green-700 [data-theme=dark]:bg-green-900/30 [data-theme=dark]:text-green-300',
  };

  const sportMeta = sport ? SPORT_META[sport] : null;

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeColors[type]}`}>
        <span>{getActivityIcon(type)}</span>
        <span>{getActivityLabel(type)}</span>
      </span>
      {sportMeta && (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-semibold text-[var(--psp-gray-700)] [data-theme=dark]:text-[var(--psp-gray-300)] bg-[var(--psp-gray-100)] [data-theme=dark]:bg-[var(--psp-navy)]">
          {sportMeta.emoji} {sportMeta.name}
        </span>
      )}
    </div>
  );
}

export default function WhatsNewFeed({ items }: WhatsNewFeedProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const displayItems = items.slice(0, 5);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white [data-theme=dark]:bg-[var(--psp-navy)]/40">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white font-bebas tracking-wide mb-3 sm:mb-4">
            What&apos;s New
          </h2>
          <p className="text-base sm:text-lg text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-300)] max-w-2xl">
            Stay updated with the latest activity across the PSP platform
          </p>
        </div>

        {/* Feed items */}
        <div className="space-y-4 sm:space-y-5 mb-10 sm:mb-12 lg:mb-16">
          {displayItems.map((item, idx) => (
            <Link
              key={`${item.type}-${idx}`}
              href={item.link}
              className="group block p-4 sm:p-6 bg-[var(--psp-gray-50)] [data-theme=dark]:bg-[var(--psp-navy-light)] rounded-lg border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)] hover:shadow-md hover:border-[var(--psp-gold)] [data-theme=dark]:hover:border-[var(--psp-gold)]/60 transition-all"
              aria-label={`Read more about ${item.title}`}
            >
              {/* Top row: badges and timestamp */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <ActivityBadge type={item.type} sport={item.sport} />
                <span className="text-xs sm:text-sm text-[var(--psp-gray-500)] [data-theme=dark]:text-[var(--psp-gray-400)]">
                  {formatDate(item.timestamp)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white mb-2 group-hover:text-[var(--psp-blue)] [data-theme=dark]:group-hover:text-[var(--psp-gold)] transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)] line-clamp-2">
                {item.description}
              </p>

              {/* Arrow indicator on hover */}
              <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-[var(--psp-blue)] [data-theme=dark]:text-[var(--psp-gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Read More</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[var(--psp-navy)] [data-theme=dark]:bg-[var(--psp-gold)] text-white [data-theme=dark]:text-[var(--psp-navy)] font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            View All Updates
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
