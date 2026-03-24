import Link from 'next/link';
import { createStaticClient } from '@/lib/supabase/static';

const SPORT_EMOJI: Record<string, string> = {
  football: '\uD83C\uDFC8', basketball: '\uD83C\uDFC0', baseball: '\u26BE', soccer: '\u26BD',
  lacrosse: '\uD83E\uDD4D', 'track-field': '\uD83C\uDFC3', wrestling: '\uD83E\uDD3C',
};

const SPORT_COLOR: Record<string, string> = {
  football: '#16a34a', basketball: '#3b82f6', baseball: '#ea580c',
  soccer: '#059669', lacrosse: '#0891b2', 'track-field': '#7c3aed', wrestling: '#ca8a04',
};

export default async function HomeArticlesSection() {
  const supabase = createStaticClient();

  const { data: articlesRaw } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, author_name, sport_id, published_at, content_type')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6);

  const articles = articlesRaw ?? [];

  if (articles.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bebas text-gray-100 tracking-wider">Latest Stories</h2>
        <Link href="/articles" className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition">
          All Stories &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.slice(0, 4).map((article: Record<string, unknown>) => {
          const sportId = (article.sport_id as string) || '';
          const dotColor = SPORT_COLOR[sportId] || '#6b7280';
          const excerptText = (article.excerpt as string)
            ? (article.excerpt as string)
            : (article.title as string).length > 100
              ? (article.title as string).slice(0, 100) + '...'
              : null;
          return (
            <Link
              key={article.id as number}
              href={`/articles/${article.slug}`}
              className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 p-4 hover:border-[var(--psp-gold)]/30 hover:bg-[var(--psp-navy-mid)]/80 transition group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                <span className="text-sm">{SPORT_EMOJI[sportId] || '\uD83D\uDCF0'}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {(article.content_type as string) || 'article'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-100 group-hover:text-[var(--psp-gold)] transition line-clamp-2">
                {article.title as string}
              </h3>
              {excerptText && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{excerptText}</p>
              )}
              <p className="text-[10px] text-gray-500 mt-2">
                {article.author_name as string} &middot; {new Date(article.published_at as string).toLocaleDateString()}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
