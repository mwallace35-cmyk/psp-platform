import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/data';

export const metadata: Metadata = generatePageMetadata({ pageType: 'articles' });

interface Article {
  id: string;
  slug: string;
  title: string;
  author: string;
  sport_id: string;
  featured_image_url?: string;
  excerpt?: string;
  status: string;
  created_at: string;
}

export default async function ArticlesPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(12);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-navy-mid py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas text-white mb-4">Articles</h1>
          <p className="text-gold text-lg">
            News and stories from Philadelphia high school sports
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {!articles || articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group"
              >
                <article className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gold hover:shadow-lg transition">
                  {/* Image */}
                  {article.featured_image_url && (
                    <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      {article.sport_id && SPORT_META[article.sport_id as keyof typeof SPORT_META] && (
                        <span className="text-lg">
                          {SPORT_META[article.sport_id as keyof typeof SPORT_META].emoji}
                        </span>
                      )}
                      <span className="text-xs font-medium text-gold uppercase">
                        {article.sport_id}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-navy mb-2 line-clamp-2 group-hover:text-gold transition">
                      {article.title}
                    </h2>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt || 'Click to read article...'}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-xs text-gray-600">
                      <span>{article.author}</span>
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
