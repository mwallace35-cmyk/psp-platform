import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SPORT_META, VALID_SPORTS } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';

export const revalidate = 1800;
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: 'Articles | PhillySportsPack.com',
  description: 'Read news and articles about Philadelphia high school sports.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/articles' },
  openGraph: {
    title: 'Articles | PhillySportsPack.com',
    description: 'Read news and articles about Philadelphia high school sports.',
    url: 'https://phillysportspack.com/articles',
    siteName: 'PhillySportsPack.com',
    images: [{ url: 'https://phillysportspack.com/og-default.png', width: 1200, height: 630, alt: 'PhillySportsPack.com' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Articles | PhillySportsPack.com', description: 'Read news and articles about Philadelphia high school sports.', images: ['https://phillysportspack.com/og-default.png'] },
  robots: { index: true, follow: true },
};

const ARTICLES_PER_PAGE = 12;

interface SearchParams {
  page?: string;
  sport?: string;
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1'));
  const selectedSport = params.sport || 'all';
  const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

  const supabase = createStaticClient();

  // Build query
  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + ARTICLES_PER_PAGE - 1);

  if (selectedSport !== 'all') {
    query = query.eq('sport_id', selectedSport);
  }

  const { data: articles, count } = await query;

  const totalPages = Math.ceil((count || 0) / ARTICLES_PER_PAGE);

  // Build pagination URLs
  function buildUrl(page: number, sport: string) {
    const p = new URLSearchParams();
    if (page > 1) p.set('page', page.toString());
    if (sport !== 'all') p.set('sport', sport);
    const qs = p.toString();
    return `/articles${qs ? `?${qs}` : ''}`;
  }

  return (
    <main id="main-content" className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-navy-mid py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="psp-h1 text-white mb-4">Articles</h1>
          <p className="text-gold text-lg">
            News and stories from Philadelphia high school sports
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-600 mr-2">Filter by sport:</span>
          <Link
            href={buildUrl(1, 'all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedSport === 'all'
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Sports
          </Link>
          {VALID_SPORTS.map((sport) => {
            const meta = SPORT_META[sport];
            return (
              <Link
                key={sport}
                href={buildUrl(1, sport)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedSport === sport
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {meta.emoji} {meta.name}
              </Link>
            );
          })}
        </div>

        {count !== null && (
          <p className="text-sm text-gray-500 mt-4">
            {count} article{count !== 1 ? 's' : ''} found
            {selectedSport !== 'all' && ` in ${SPORT_META[selectedSport as keyof typeof SPORT_META]?.name || selectedSport}`}
          </p>
        )}
      </div>

      <PSPPromo size="banner" variant={3} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!articles || articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📰</div>
            <p className="text-gray-500 text-lg mb-2">No articles found.</p>
            {selectedSport !== 'all' && (
              <Link href="/articles" className="text-gold hover:text-gold/80 text-sm font-medium">
                View all articles &rarr;
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group"
                >
                  <article className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gold hover:shadow-lg transition">
                    {/* Image */}
                    {article.featured_image_url && (
                      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                        <Image
                          src={article.featured_image_url}
                          alt={article.title}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={buildUrl(currentPage - 1, selectedSport)}
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition"
                  >
                    &larr; Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={buildUrl(page, selectedSport)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition ${
                      page === currentPage
                        ? 'bg-gold text-navy font-bold'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </Link>
                ))}

                {currentPage < totalPages && (
                  <Link
                    href={buildUrl(currentPage + 1, selectedSport)}
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition"
                  >
                    Next &rarr;
                  </Link>
                )}
              </div>
            )}

            <PSPPromo size="banner" variant={5} />
          </>
        )}
      </div>
    </main>
  );
}
