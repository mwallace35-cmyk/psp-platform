import { createStaticClient } from '@/lib/supabase/static';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SPORT_META } from '@/lib/sports';
import { ArticleJsonLd } from '@/components/seo/JsonLd';
import AdPlaceholder, { LeaderboardAd } from '@/components/ads/AdPlaceholder';
import CommentSection from '@/components/comments/CommentSection';
import { sanitizeHtml } from '@/lib/sanitize';
import ShareButtons from '@/components/social/ShareButtons';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createStaticClient();

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) {
    return generatePageMetadata({ pageType: 'article-detail' });
  }

  return {
    ...generatePageMetadata({
      pageType: 'article-detail',
      title: article.title,
      description: article.excerpt || article.title,
      slug: article.slug,
    }),
    alternates: {
      canonical: `https://phillysportspack.com/articles/${article.slug}`,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createStaticClient();

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) {
    notFound();
  }

  // Fetch related articles (same sport, different article)
  interface RelatedArticle {
    id: number;
    slug: string;
    title: string;
    created_at: string;
  }

  const { data: relatedArticles } = await supabase
    .from('articles')
    .select('id, slug, title, created_at')
    .eq('sport_id', article.sport_id)
    .eq('status', 'published')
    .neq('id', article.id)
    .order('created_at', { ascending: false })
    .limit(3) as { data: RelatedArticle[] | null };

  const renderMarkdown = (content: string) => {
    const html = content
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/gm, '<p>')
      .replace(/$/gm, '</p>');
    return sanitizeHtml(html);
  };

  return (
    <div className="min-h-screen bg-white">
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt || article.title}
        author={article.author}
        datePublished={article.created_at}
        dateModified={article.updated_at || article.created_at}
        url={`https://phillysportspack.com/articles/${article.slug}`}
        imageUrl={article.featured_image_url}
      />
      {/* Hero */}
      <div className="bg-gradient-to-r from-navy to-navy-mid py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            {article.sport_id && SPORT_META[article.sport_id as keyof typeof SPORT_META] && (
              <span className="text-2xl">
                {SPORT_META[article.sport_id as keyof typeof SPORT_META].emoji}
              </span>
            )}
            <span className="text-sm font-medium text-gold uppercase">
              {article.sport_id}
            </span>
          </div>
          <h1 className="text-4xl font-bebas text-white mb-4">{article.title}</h1>
          <div className="flex items-center justify-between text-gold text-sm">
            <span>{article.author}</span>
            <span>{new Date(article.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <LeaderboardAd id="psp-article-banner" />

      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Featured Image */}
          {article.featured_image_url && (
            <div className="mb-8 rounded-lg overflow-hidden border border-gray-200 relative w-full h-96">
              <Image
                src={article.featured_image_url}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                className="object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-sm max-w-none mb-8">
            <div
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(article.content),
              }}
            />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="py-6 border-t border-b border-gray-200 mb-8">
              <p className="text-sm font-medium text-gray-700 mb-3">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Sharing */}
          <div className="py-6">
            <ShareButtons
              url={`/articles/${article.slug}`}
              title={`${article.title} | PhillySportsPack`}
              description={article.excerpt || article.title}
            />
          </div>

          {/* Comments */}
          <CommentSection articleId={article.id} />
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          {/* Article Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-bebas text-xl text-navy mb-4">About This Article</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Author</p>
                <p className="font-medium text-gray-900">{article.author}</p>
              </div>
              <div>
                <p className="text-gray-600">Published</p>
                <p className="font-medium text-gray-900">
                  {new Date(article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Updated</p>
                <p className="font-medium text-gray-900">
                  {new Date(article.updated_at || article.created_at).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          <AdPlaceholder size="sidebar-rect" id="psp-article-rail" />

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bebas text-xl text-navy mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/articles/${related.slug}`}
                    className="block group"
                  >
                    <p className="text-sm font-medium text-navy group-hover:text-gold transition line-clamp-2">
                      {related.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(related.created_at).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
