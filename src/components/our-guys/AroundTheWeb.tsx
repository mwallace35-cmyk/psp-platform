import { createStaticClient } from '@/lib/supabase/static';
import Link from 'next/link';

interface NewsItem {
  id: number;
  player_id: number | null;
  player_name: string;
  title: string;
  url: string;
  source: string | null;
  published_at: string | null;
  fetched_at: string;
}

/** Human-readable relative time */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return '1d ago';
  return `${diffDays}d ago`;
}

/**
 * Around the Web - Server component
 * Shows recent news articles about Philly pro athletes from Google News RSS cache.
 */
export default async function AroundTheWeb() {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from('player_news_cache')
    .select('id, player_id, player_name, title, url, source, published_at, fetched_at')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(10);

  const items: NewsItem[] = (data ?? []) as NewsItem[];

  // Don't render the section if no news items
  if (error || items.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="rounded-2xl bg-gradient-to-br from-navy via-navy-mid to-[#0d1b30] p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-lg">
            <svg
              className="w-5 h-5 text-gold"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div>
            <h2 className="psp-h2 text-white !mb-0">Around the Web</h2>
            <p className="text-gray-400 text-sm">Latest news on Philly pros</p>
          </div>
        </div>

        {/* News items */}
        <div className="space-y-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-4 hover:border-gold/40 hover:bg-white/[0.07] transition"
            >
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white group-hover:text-gold transition line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {/* Player badge */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-gold/20 text-gold border border-gold/30">
                    {item.player_name}
                  </span>
                  {/* Source */}
                  {item.source && (
                    <span className="text-[11px] text-gray-400 truncate max-w-[140px]">
                      {item.source}
                    </span>
                  )}
                  {/* Time */}
                  <span className="text-[11px] text-gray-500">
                    {item.published_at ? timeAgo(item.published_at) : timeAgo(item.fetched_at)}
                  </span>
                </div>
              </div>

              {/* External link icon */}
              <div className="shrink-0 mt-1">
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-gold transition"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-4 text-center">
          <span className="text-xs text-gray-500">
            News sourced from Google News RSS
          </span>
        </div>
      </div>
    </section>
  );
}
