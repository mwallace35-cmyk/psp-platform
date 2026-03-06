import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SPORT_META } from '@/lib/sports';
import { getEntitiesForArticle } from '@/lib/data';
import { processArticleForDisplay } from '@/lib/content-cleaner';
import AdPlaceholder, { LeaderboardAd } from '@/components/ads/AdPlaceholder';
import CommentSection from '@/components/comments/CommentSection';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) {
    return generatePageMetadata({ pageType: 'article-detail' });
  }

  return generatePageMetadata({
    pageType: 'article-detail',
    title: article.title,
    description: article.excerpt || article.title,
    slug: article.slug,
  });
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

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
  const [{ data: relatedArticles }, linkedEntities] = await Promise.all([
    supabase
      .from('articles')
      .select('*')
      .eq('sport_id', article.sport_id)
      .eq('status', 'published')
      .neq('id', article.id)
      .order('created_at', { ascending: false })
      .limit(3),
    getEntitiesForArticle(article.id),
  ]);

  const renderMarkdown = (content: string) => {
    // Handle pipe-separated table rows (from archive content)
    const lines = content.split('\n');
    const processedLines: string[] = [];
    let inTable = false;
    let isFirstTableRow = false;
    let headerColCount = 0;

    const isMarkdownHeading = (s: string) =>
      /^#{1,3}\s/.test(s); // Only "# ", "## ", "### " — not "#-" footnote markers

    for (const line of lines) {
      let trimmed = line.trim();

      // Strip trailing " |" from lines that aren't real table rows
      // (e.g., "FIRST TEAM |" or "SECOND TEAM |")
      if (trimmed.endsWith(' |') && !trimmed.includes(' | ')) {
        trimmed = trimmed.slice(0, -2).trim();
        processedLines.push(trimmed);
        continue;
      }

      // Detect table rows (contain | separators with content on both sides)
      if (trimmed.includes(' | ') && !isMarkdownHeading(trimmed) && !trimmed.startsWith('---')) {
        if (!inTable) {
          processedLines.push('<table class="archive-table">');
          inTable = true;
          isFirstTableRow = true;
        }
        const cells = trimmed.split(' | ').map(c => c.trim());

        // First row is the header — establish column count
        if (isFirstTableRow) {
          headerColCount = cells.length;
          processedLines.push('<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>');
          isFirstTableRow = false;
        } else {
          // Pad rows with fewer columns than header
          const paddedCells = [...cells];
          while (paddedCells.length < headerColCount) {
            paddedCells.push('');
          }
          processedLines.push('<tr>' + paddedCells.slice(0, headerColCount).map(c => `<td>${c}</td>`).join('') + '</tr>');
        }
      } else {
        if (inTable) {
          processedLines.push('</tbody></table>');
          inTable = false;
          headerColCount = 0;
        }
        processedLines.push(trimmed || line);
      }
    }
    if (inTable) processedLines.push('</tbody></table>');

    return processedLines.join('\n')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^---$/gm, '<hr/>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Archive Banner */}
      {article.source_file && (
        <div className="bg-gold/10 border-b border-gold/30 py-2 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="text-sm text-navy font-medium">
              🏛️ Archive Content — from the Ted Silary collection
            </span>
            <Link href="/archive/content" className="text-xs text-gold hover:text-gold/80 font-medium">
              Browse Archive &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-navy to-navy-mid py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumb
            items={[
              ...(article.source_file
                ? [{ label: 'Archive', href: '/archive/content' }]
                : [{ label: 'Articles', href: '/articles' }]),
              { label: article.title },
            ]}
            className="mb-4"
          />
          <div className="flex items-center space-x-3 mb-3">
            {article.sport_id && SPORT_META[article.sport_id as keyof typeof SPORT_META] && (
              <span className="text-2xl">
                {SPORT_META[article.sport_id as keyof typeof SPORT_META].emoji}
              </span>
            )}
            <span className="text-sm font-medium text-gold uppercase">
              {article.sport_id || 'multi-sport'}
            </span>
            {article.content_type && article.content_type !== 'article' && (
              <span className="px-2 py-0.5 bg-white/20 rounded text-xs text-white">
                {article.content_type === 'season-recap' ? '📅 Season Recap' :
                 article.content_type === 'writer-profile' ? '✍️ Writer Profile' :
                 article.content_type === 'editorial' ? '📝 Editorial' : article.content_type}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bebas text-white mb-2">{article.title}</h1>
          <div className="flex items-center justify-between text-gold text-sm">
            <span>{article.author_name || article.author || 'PSP Staff'}</span>
            <span>
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString()
                : new Date(article.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <LeaderboardAd id="psp-article-banner" />

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Featured Image */}
          {article.featured_image_url && (
            <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-sm max-w-none mb-6">
            <div
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(processArticleForDisplay(article).cleanedBody),
              }}
            />
          </div>

          {/* Thin content notice for photo-only/stub archive pages */}
          {article.source_file && (article.body || article.content || '').length < 200 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Limited content available.</strong> This archive page originally contained
                images or media that are not available in the digital archive. The text above is all
                that could be extracted from the original source.
              </p>
              <Link href="/archive/content" className="text-sm text-gold hover:text-gold/80 font-medium mt-2 inline-block">
                Browse more archive content &rarr;
              </Link>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="py-4 border-t border-b border-gray-200 mb-6">
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
            <p className="text-sm font-medium text-gray-700 mb-3">Share:</p>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=https://phillysportspack.com/articles/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://phillysportspack.com/articles/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Facebook
              </a>
            </div>
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
                <p className="font-medium text-gray-900">{article.author_name || article.author || 'PSP Staff'}</p>
              </div>
              <div>
                <p className="text-gray-600">{article.source_file ? 'Originally Published' : 'Published'}</p>
                <p className="font-medium text-gray-900">
                  {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {!article.source_file && (
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
              )}
            </div>
          </div>

          {/* Linked Schools */}
          {linkedEntities.schools.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="font-bebas text-xl text-navy mb-4">Schools in This Article</h3>
              <div className="space-y-3">
                {linkedEntities.schools.map((school: any) => (
                  <Link
                    key={school.id}
                    href={`/schools/${school.slug}`}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition group"
                  >
                    <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(school.name || '').charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy group-hover:text-gold transition">{school.name}</p>
                      {school.city && <p className="text-xs text-gray-400">{school.city}, {school.state}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Linked Players */}
          {linkedEntities.players.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="font-bebas text-xl text-navy mb-4">Players Mentioned</h3>
              <div className="space-y-3">
                {linkedEntities.players.map((player: any) => (
                  <Link
                    key={player.id}
                    href={`/${player.sport_id || 'football'}/players/${player.slug}`}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(player.name || '').charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy group-hover:text-gold transition">{player.name}</p>
                      {player.sport_id && <p className="text-xs text-gray-400">{SPORT_META[player.sport_id as keyof typeof SPORT_META]?.name || player.sport_id}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <AdPlaceholder size="sidebar-rect" id="psp-article-rail" />

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bebas text-xl text-navy mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedArticles.map((related: any) => (
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
