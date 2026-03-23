import Link from 'next/link';
import { createStaticClient } from '@/lib/supabase/static';

const SPORT_EMOJI: Record<string, string> = {
  football: '🏈', basketball: '🏀', baseball: '⚾', soccer: '⚽',
  lacrosse: '🥍', 'track-field': '🏃', wrestling: '🤼',
};

interface Props {
  entityType: 'player' | 'school';
  entityId: number;
  limit?: number;
}

export default async function InTheNews({ entityType, entityId, limit = 3 }: Props) {
  const supabase = createStaticClient();

  const { data: mentions } = await supabase
    .from('article_mentions')
    .select('article_id, articles!inner(id, slug, title, sport_id, published_at, author_name)')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!mentions || mentions.length === 0) return null;

  const articles = mentions
    .map((m: Record<string, unknown>) => {
      const a = Array.isArray(m.articles) ? m.articles[0] : m.articles;
      return a as { id: number; slug: string; title: string; sport_id: string; published_at: string; author_name: string } | null;
    })
    .filter(Boolean);

  if (articles.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
        📰 In the News
      </h3>
      <div className="space-y-2">
        {articles.map((article) => (
          <Link
            key={article!.id}
            href={`/articles/${article!.slug}`}
            className="block bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50 px-4 py-3 hover:border-[var(--psp-gold)]/30 transition group"
          >
            <div className="flex items-start gap-2">
              <span className="text-sm shrink-0">{SPORT_EMOJI[article!.sport_id] || '📰'}</span>
              <div className="min-w-0">
                <p className="text-sm text-gray-200 font-medium group-hover:text-[var(--psp-gold)] transition line-clamp-2">
                  {article!.title}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  {article!.author_name || 'PSP Staff'} · {new Date(article!.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
