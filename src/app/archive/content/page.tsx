import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META, VALID_SPORTS } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';

export const metadata: Metadata = generatePageMetadata({
  pageType: 'articles',
  title: 'Archive Content | PhillySportsPack',
  description: 'Browse 75+ years of Philadelphia high school sports history — season recaps, editorials, writer profiles, and more from the Ted Silary archive.',
});

const ARTICLES_PER_PAGE = 24;

const CONTENT_TYPES = [
  { id: 'all', label: 'All Content', emoji: '📚' },
  { id: 'season-recap', label: 'Season Recaps', emoji: '📅' },
  { id: 'editorial', label: 'Editorials & Features', emoji: '📝' },
  { id: 'writer-profile', label: 'Writer Profiles', emoji: '✍️' },
] as const;

interface SearchParams {
  page?: string;
  sport?: string;
  type?: string;
  decade?: string;
}

export default async function ArchiveContentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1'));
  const selectedSport = params.sport || 'all';
  const selectedType = params.type || 'all';
  const selectedDecade = params.decade || 'all';
  const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

  const supabase = await createClient();

  // Build query — only archive content (has source_file)
  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .is('deleted_at', null)
    .not('source_file', 'is', null)
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(offset, offset + ARTICLES_PER_PAGE - 1);

  if (selectedSport !== 'all') {
    query = query.eq('sport_id', selectedSport);
  }

  if (selectedType !== 'all') {
    query = query.eq('content_type', selectedType);
  }

  const { data: articles, count } = await query;

  // Get content type counts for badges
  const { data: typeCounts } = await supabase
    .from('articles')
    .select('content_type')
    .eq('status', 'published')
    .is('deleted_at', null)
    .not('source_file', 'is', null);

  const typeCountMap: Record<string, number> = {};
  if (typeCounts) {
    for (const row of typeCounts) {
      const ct = row.content_type || 'article';
      typeCountMap[ct] = (typeCountMap[ct] || 0) + 1;
    }
  }
  const totalArchive = typeCounts?.length || 0;

  const totalPages = Math.ceil((count || 0) / ARTICLES_PER_PAGE);

  function buildUrl(overrides: Partial<SearchParams>) {
    const p = new URLSearchParams();
    const page = overrides.page !== undefined ? parseInt(overrides.page || '1') : currentPage;
    const sport = overrides.sport !== undefined ? overrides.sport : selectedSport;
    const type = overrides.type !== undefined ? overrides.type : selectedType;
    if (page > 1) p.set('page', page.toString());
    if (sport && sport !== 'all') p.set('sport', sport);
    if (type && type !== 'all') p.set('type', type);
    const qs = p.toString();
    return `/archive/content${qs ? `?${qs}` : ''}`;
  }

  function getYearDisplay(article: { published_at: string | null }) {
    if (!article.published_at) return '';
    const year = new Date(article.published_at).getFullYear();
    if (year < 1950) return '';
    return year.toString();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-navy to-navy-mid py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🏛️</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bebas text-white">Archive Collection</h1>
              <p className="text-gold text-lg mt-1">
                75+ years of Philadelphia high school sports history
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bebas text-gold">{totalArchive}</div>
              <div className="text-xs text-white/70 uppercase">Archive Articles</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bebas text-gold">{typeCountMap['season-recap'] || 0}</div>
              <div className="text-xs text-white/70 uppercase">Season Recaps</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bebas text-gold">{typeCountMap['editorial'] || 0}</div>
              <div className="text-xs text-white/70 uppercase">Editorials</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bebas text-gold">{typeCountMap['writer-profile'] || 0}</div>
              <div className="text-xs text-white/70 uppercase">Writer Profiles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Content Type Tabs */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Content:</span>
          {CONTENT_TYPES.map((ct) => (
            <Link
              key={ct.id}
              href={buildUrl({ type: ct.id, page: '1' })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedType === ct.id
                  ? 'bg-navy text-white dark:bg-gold dark:text-navy'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-mid dark:text-gray-300'
              }`}
            >
              {ct.emoji} {ct.label}
              {ct.id !== 'all' && typeCountMap[ct.id] && (
                <span className="ml-1 text-xs opacity-70">({typeCountMap[ct.id]})</span>
              )}
            </Link>
          ))}
        </div>

        {/* Sport Filter */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Sport:</span>
          <Link
            href={buildUrl({ sport: 'all', page: '1' })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              selectedSport === 'all'
                ? 'bg-gold text-navy'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-navy-mid dark:text-gray-300'
            }`}
          >
            All
          </Link>
          {['football', 'basketball', 'baseball'].map((sport) => {
            const meta = SPORT_META[sport as keyof typeof SPORT_META];
            if (!meta) return null;
            return (
              <Link
                key={sport}
                href={buildUrl({ sport, page: '1' })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedSport === sport
                    ? 'bg-gold text-navy'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-navy-mid dark:text-gray-300'
                }`}
              >
                {meta.emoji} {meta.name}
              </Link>
            );
          })}
          <Link
            href={buildUrl({ sport: 'general', page: '1' })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              selectedSport === 'general'
                ? 'bg-gold text-navy'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-navy-mid dark:text-gray-300'
            }`}
          >
            🏅 Multi-Sport
          </Link>
        </div>

        {count !== null && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
            Showing {Math.min(offset + 1, count)}-{Math.min(offset + ARTICLES_PER_PAGE, count)} of {count} archive items
          </p>
        )}
      </div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {!articles || articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📂</div>
            <p className="text-gray-500 text-lg mb-2">No archive content found for these filters.</p>
            <Link href="/archive/content" className="text-gold hover:text-gold/80 text-sm font-medium">
              Browse all archive content &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => {
                const yearStr = getYearDisplay(article);
                const sportMeta = article.sport_id ? SPORT_META[article.sport_id as keyof typeof SPORT_META] : null;
                const typeLabel = CONTENT_TYPES.find(ct => ct.id === article.content_type);

                return (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group"
                  >
                    <article className="h-full bg-white dark:bg-navy-mid border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gold hover:shadow-lg transition">
                      {/* Top row: year badge + type badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {yearStr && (
                            <span className="px-2 py-0.5 bg-navy/10 dark:bg-gold/20 rounded text-xs font-bold text-navy dark:text-gold">
                              {yearStr}
                            </span>
                          )}
                          {sportMeta && (
                            <span className="text-sm">{sportMeta.emoji}</span>
                          )}
                        </div>
                        {typeLabel && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            article.content_type === 'season-recap'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : article.content_type === 'writer-profile'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          }`}>
                            {typeLabel.emoji} {typeLabel.label}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-base font-bold text-navy dark:text-white mb-2 line-clamp-2 group-hover:text-gold transition">
                        {article.title}
                      </h2>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {article.excerpt.replace(/\s*\|\s*/g, ' — ').replace(/\s*\|$/g, '')}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                        <span>{article.author_name || 'Ted Silary'}</span>
                        {article.sport_id && (
                          <span className="uppercase font-medium text-gold">{article.sport_id}</span>
                        )}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            <PSPPromo size="banner" variant={2} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {currentPage > 1 && (
                  <Link
                    href={buildUrl({ page: (currentPage - 1).toString() })}
                    className="px-4 py-2 rounded-md bg-gray-100 dark:bg-navy-mid text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-sm font-medium transition"
                  >
                    &larr; Previous
                  </Link>
                )}

                {/* Show page numbers with ellipsis for large ranges */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 2
                  )
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && page - prev > 1;
                    return (
                      <span key={page} className="flex items-center gap-1">
                        {showEllipsis && <span className="text-gray-400 px-1">...</span>}
                        <Link
                          href={buildUrl({ page: page.toString() })}
                          className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition ${
                            page === currentPage
                              ? 'bg-gold text-navy font-bold'
                              : 'bg-gray-100 dark:bg-navy-mid text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </Link>
                      </span>
                    );
                  })}

                {currentPage < totalPages && (
                  <Link
                    href={buildUrl({ page: (currentPage + 1).toString() })}
                    className="px-4 py-2 rounded-md bg-gray-100 dark:bg-navy-mid text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-sm font-medium transition"
                  >
                    Next &rarr;
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
