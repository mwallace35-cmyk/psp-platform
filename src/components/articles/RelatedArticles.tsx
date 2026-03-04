import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SPORT_META, type SportId } from '@/lib/sports';

interface RelatedArticlesProps {
  entityType: 'player' | 'school';
  entityId: number;
}

export default async function RelatedArticles({ entityType, entityId }: RelatedArticlesProps) {
  const supabase = await createClient();

  // Get article IDs linked to this entity
  const { data: mentions } = await supabase
    .from('article_mentions')
    .select('article_id')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId);

  if (!mentions || mentions.length === 0) return null;

  const articleIds = mentions.map((m) => m.article_id);

  // Fetch the actual articles
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, title, sport_id, published_at, excerpt, featured_image_url')
    .in('id', articleIds)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(5);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="mt-8">
      <h3
        className="text-xl font-bold mb-4 tracking-wider"
        style={{ color: 'var(--psp-navy)', fontFamily: 'Bebas Neue, sans-serif' }}
      >
        Featured in Articles
      </h3>
      <div className="space-y-3">
        {articles.map((article) => {
          const sportMeta = article.sport_id ? SPORT_META[article.sport_id as SportId] : null;
          return (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition group"
            >
              <div className="flex items-start gap-3">
                {article.featured_image_url && (
                  <img
                    src={article.featured_image_url}
                    alt=""
                    className="w-16 h-12 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-gold transition line-clamp-2">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {sportMeta && (
                      <span className="text-xs text-gray-500">
                        {sportMeta.emoji} {sportMeta.name}
                      </span>
                    )}
                    {article.published_at && (
                      <span className="text-xs text-gray-400">
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
