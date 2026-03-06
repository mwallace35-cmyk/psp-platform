import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = generatePageMetadata({
  pageType: 'articles',
  title: 'Archive Collection | PhillySportsPack',
  description: 'Browse 75+ years of Philadelphia high school sports history — season recaps, editorials, writer profiles, and more from the Ted Silary archive.',
});

const ARTICLES_PER_PAGE = 24;

const CONTENT_TYPES = [
  { id: 'all', label: 'All Content', emoji: '📚' },
  { id: 'tribute', label: 'Tributes', emoji: '🕯️' },
  { id: 'season-recap', label: 'Season Recaps', emoji: '📅' },
  { id: 'editorial', label: 'Editorials & Features', emoji: '📝' },
  { id: 'writer-profile', label: 'Writer Profiles', emoji: '✍️' },
] as const;

const DECADES = [
  { id: 'all', label: 'All Eras' },
  { id: '2020s', label: '2020s', startYear: 2020, endYear: 2024 },
  { id: '2010s', label: '2010s', startYear: 2010, endYear: 2019 },
  { id: '2000s', label: '2000s', startYear: 2000, endYear: 2009 },
  { id: '1990s', label: '1990s', startYear: 1990, endYear: 1999 },
  { id: 'pre-1990', label: 'Pre-1990', startYear: 1900, endYear: 1989 },
] as const;

// Junk titles to exclude from browse listing
const JUNK_TITLE_PATTERNS = ['new page', 'untitled', 'test page', 'copy of'];

interface SearchParams {
  page?: string;
  sport?: string;
  type?: string;
  decade?: string;
  search?: string;
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
  const searchQuery = params.search?.trim() || '';
  const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

  const supabase = await createClient();

  // Build base query — only archive content (has source_file), exclude future dates
  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .is('deleted_at', null)
    .not('source_file', 'is', null)
    .lte('published_at', '2025-01-01')
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(offset, offset + ARTICLES_PER_PAGE - 1);

  // Content type filter
  if (selectedType !== 'all') {
    query = query.eq('content_type', selectedType);
  }

  // Sport filter
  if (selectedSport !== 'all') {
    if (selectedSport === 'general') {
      query = query.is('sport_id', null);
    } else {
      query = query.eq('sport_id', selectedSport);
    }
  }

  // Decade filter
  if (selectedDecade !== 'all') {
    const decade = DECADES.find(d => d.id === selectedDecade);
    if (decade && 'startYear' in decade) {
      query = query
        .gte('published_at', `${decade.startYear}-01-01`)
        .lte('published_at', `${decade.endYear}-12-31`);
    }
  }

  // Search filter
  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
  }

  const { data: rawArticles, count } = await query;

  // Client-side junk title filter (Supabase doesn't support complex pattern exclusions easily)
  const articles = (rawArticles || []).filter(article => {
    const titleLower = article.title?.toLowerCase() || '';
    if (titleLower.length < 5) return false;
    return !JUNK_TITLE_PATTERNS.some(pattern => titleLower.startsWith(pattern));
  });

  // Get content type counts for badges (exclude junk + future dates)
  const { data: typeCounts } = await supabase
    .from('articles')
    .select('content_type, sport_id')
    .eq('status', 'published')
    .is('deleted_at', null)
    .not('source_file', 'is', null)
    .lte('published_at', '2025-01-01');

  const typeCountMap: Record<string, number> = {};
  const sportCountMap: Record<string, number> = {};
  let totalArchive = 0;

  if (typeCounts) {
    for (const row of typeCounts) {
      const titleCheck = true; // can't filter by title here, but counts are approximate
      if (titleCheck) {
        const ct = row.content_type || 'article';
        typeCountMap[ct] = (typeCountMap[ct] || 0) + 1;
        const sp = row.sport_id || 'general';
        sportCountMap[sp] = (sportCountMap[sp] || 0) + 1;
        totalArchive++;
      }
    }
  }

  // Fetch featured article (longest body, with a good title)
  const { data: featuredRows } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .is('deleted_at', null)
    .not('source_file', 'is', null)
    .lte('published_at', '2025-01-01')
    .not('title', 'ilike', '%new page%')
    .order('published_at', { ascending: true })
    .limit(20);

  // Pick the featured article: oldest article with a substantial body
  const featured = featuredRows?.find(a =>
    a.title && a.title.length > 10 && (a.body || a.content || '').length > 500
  ) || null;

  const totalPages = Math.ceil((count || 0) / ARTICLES_PER_PAGE);

  const hasActiveFilters = selectedType !== 'all' || selectedSport !== 'all' || selectedDecade !== 'all' || searchQuery;

  function buildUrl(overrides: Partial<SearchParams>) {
    const p = new URLSearchParams();
    const page = overrides.page !== undefined ? parseInt(overrides.page || '1') : currentPage;
    const sport = overrides.sport !== undefined ? overrides.sport : selectedSport;
    const type = overrides.type !== undefined ? overrides.type : selectedType;
    const decade = overrides.decade !== undefined ? overrides.decade : selectedDecade;
    const search = overrides.search !== undefined ? overrides.search : searchQuery;
    if (page > 1) p.set('page', page.toString());
    if (sport && sport !== 'all') p.set('sport', sport);
    if (type && type !== 'all') p.set('type', type);
    if (decade && decade !== 'all') p.set('decade', decade);
    if (search) p.set('search', search);
    const qs = p.toString();
    return `/archive/content${qs ? `?${qs}` : ''}`;
  }

  function getYearDisplay(article: { published_at: string | null }) {
    if (!article.published_at) return '';
    const year = new Date(article.published_at).getFullYear();
    if (year < 1950 || year > 2024) return '';
    return year.toString();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-navy to-navy-mid py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            items={[{ label: 'Archive' }]}
            className="mb-4"
          />
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🏛️</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bebas text-white">Archive Collection</h1>
              <p className="text-gold text-lg mt-1">
                75+ years of Philadelphia high school sports history
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form action="/archive/content" method="GET" className="mt-6">
            {/* Preserve current filters */}
            {selectedType !== 'all' && <input type="hidden" name="type" value={selectedType} />}
            {selectedSport !== 'all' && <input type="hidden" name="sport" value={selectedSport} />}
            {selectedDecade !== 'all' && <input type="hidden" name="decade" value={selectedDecade} />}
            <div className="flex gap-2 max-w-xl">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search the archive — titles, players, schools..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gold text-navy font-bold text-sm rounded-lg hover:bg-gold-light transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bebas text-gold">{totalArchive}</div>
              <div className="text-xs text-white/70 uppercase">Archive Articles</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bebas text-gold">{typeCountMap['tribute'] || 0}</div>
              <div className="text-xs text-white/70 uppercase">Tributes</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bebas text-gold">{typeCountMap['season-recap'] || 0}</div>
              <div className="text-xs text-white/70 uppercase">Season Recaps</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bebas text-gold">{typeCountMap['editorial'] || 0}</div>
              <div className="text-xs text-white/70 uppercase">Editorials</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bebas text-gold">{typeCountMap['writer-profile'] || 0}</div>
              <div className="text-xs text-white/70 uppercase">Writer Profiles</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="hub-body" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <div className="hub-main">

          {/* Active search indicator */}
          {searchQuery && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gold/10 border border-gold/30 rounded-lg">
              <span className="text-sm text-navy dark:text-gold">
                Showing results for: <strong>&ldquo;{searchQuery}&rdquo;</strong>
              </span>
              <Link
                href={buildUrl({ search: '', page: '1' })}
                className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto"
              >
                Clear search &times;
              </Link>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6">
            {/* Content Type Tabs */}
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-1">Content:</span>
              {CONTENT_TYPES.map((ct) => (
                <Link
                  key={ct.id}
                  href={buildUrl({ type: ct.id, page: '1' })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    selectedType === ct.id
                      ? 'bg-navy text-white dark:bg-gold dark:text-navy'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-mid dark:text-gray-300'
                  }`}
                >
                  {ct.emoji} {ct.label}
                  {ct.id !== 'all' && typeCountMap[ct.id] ? (
                    <span className="ml-1 opacity-70">({typeCountMap[ct.id]})</span>
                  ) : null}
                </Link>
              ))}
            </div>

            {/* Sport Filter */}
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-1">Sport:</span>
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
                    {sportCountMap[sport] ? <span className="ml-1 opacity-70">({sportCountMap[sport]})</span> : null}
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

            {/* Decade Filter */}
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-1">Era:</span>
              {DECADES.map((dec) => (
                <Link
                  key={dec.id}
                  href={buildUrl({ decade: dec.id, page: '1' })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    selectedDecade === dec.id
                      ? 'bg-blue text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-navy-mid dark:text-gray-300'
                  }`}
                >
                  {dec.label}
                </Link>
              ))}
            </div>

            {count !== null && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Showing {Math.min(offset + 1, count)}–{Math.min(offset + ARTICLES_PER_PAGE, count)} of {count} archive items
                {hasActiveFilters && (
                  <Link href="/archive/content" className="ml-3 text-xs text-gold hover:text-gold/80 font-medium">
                    Clear all filters
                  </Link>
                )}
              </p>
            )}
          </div>

          {/* Featured Article (only on first page, no active filters) */}
          {currentPage === 1 && !hasActiveFilters && featured && (
            <Link href={`/articles/${featured.slug}`} className="block mb-6 group">
              <div className="bg-gradient-to-r from-navy to-navy-mid rounded-lg p-6 border border-white/10 hover:border-gold/50 transition">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-gold/20 rounded text-xs font-bold text-gold">FEATURED</span>
                  {featured.content_type && (
                    <span className="text-xs text-white/60">
                      {CONTENT_TYPES.find(ct => ct.id === featured.content_type)?.emoji}{' '}
                      {CONTENT_TYPES.find(ct => ct.id === featured.content_type)?.label}
                    </span>
                  )}
                  {getYearDisplay(featured) && (
                    <span className="text-xs text-white/50">• {getYearDisplay(featured)}</span>
                  )}
                </div>
                <h2 className="text-2xl font-bebas text-white group-hover:text-gold transition mb-2">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-sm text-white/70 line-clamp-3 mb-3">
                    {featured.excerpt.replace(/\s*\|\s*/g, ' — ').replace(/\s*\|$/g, '')}
                  </p>
                )}
                <span className="text-xs text-gold font-medium">
                  Read full article →
                </span>
              </div>
            </Link>
          )}

          {/* Content Grid */}
          {!articles || articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📂</div>
              <p className="text-gray-500 text-lg mb-2">No archive content found for these filters.</p>
              {hasActiveFilters && (
                <div className="flex flex-col items-center gap-2 mt-3">
                  <Link href="/archive/content" className="text-gold hover:text-gold/80 text-sm font-medium">
                    Browse all archive content →
                  </Link>
                  {selectedType !== 'all' && (
                    <Link href={buildUrl({ type: 'all', page: '1' })} className="text-blue text-xs">
                      Try: All content types
                    </Link>
                  )}
                  {selectedDecade !== 'all' && (
                    <Link href={buildUrl({ decade: 'all', page: '1' })} className="text-blue text-xs">
                      Try: All eras
                    </Link>
                  )}
                </div>
              )}
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
                      <article className="h-full bg-white dark:bg-navy-mid border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gold hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                        {/* Top row: year badge + type badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {yearStr && (
                              <span className="px-2 py-0.5 bg-navy/10 dark:bg-gold/20 rounded text-xs font-bold text-navy dark:text-gold">
                                {yearStr}
                              </span>
                            )}
                            <span className="text-sm">{sportMeta?.emoji || '📋'}</span>
                          </div>
                          {typeLabel && (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              article.content_type === 'tribute'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                : article.content_type === 'season-recap'
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {currentPage > 1 && (
                    <Link
                      href={buildUrl({ page: (currentPage - 1).toString() })}
                      className="px-4 py-2 rounded-md bg-gray-100 dark:bg-navy-mid text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-sm font-medium transition"
                    >
                      ← Previous
                    </Link>
                  )}

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
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="hub-sidebar">
          {/* About This Archive */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: 'var(--psp-gold, #f0a500)', color: 'var(--psp-navy, #0a1628)' }}>
              About This Archive
            </div>
            <div className="hub-wb" style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--psp-gray-600, #4b5563)' }}>
              <p style={{ marginBottom: 10 }}>
                This collection preserves the work of <strong style={{ color: 'var(--psp-navy, #0a1628)' }}>Ted Silary</strong>, who spent years documenting Philadelphia high school sports — building over <strong>7,000 hand-coded HTML pages</strong> covering 65+ schools.
              </p>
              <p style={{ marginBottom: 10 }}>
                His data spans from the <strong>early 1900s through 2020</strong>: career leaders, game results, coaching records, all-city selections, and season stats for every school he could find.
              </p>
              <p style={{ marginBottom: 0 }}>
                PhillySportsPack has digitized this archive so these stories and stats are preserved for future generations.
              </p>
              <Link href="/community" style={{ display: 'inline-block', marginTop: 12, fontSize: 12, fontWeight: 600, color: 'var(--psp-gold, #f0a500)' }}>
                Read the full story →
              </Link>
            </div>
          </div>

          {/* Archive by the Numbers */}
          <div className="hub-widget">
            <div className="hub-wh">Archive Stats</div>
            <div className="hub-wb" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Football', count: sportCountMap['football'] || 0, emoji: '🏈' },
                { label: 'Basketball', count: sportCountMap['basketball'] || 0, emoji: '🏀' },
                { label: 'Baseball', count: sportCountMap['baseball'] || 0, emoji: '⚾' },
                { label: 'Multi-Sport', count: sportCountMap['general'] || 0, emoji: '🏅' },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--psp-gray-100, #f3f4f6)' }}>
                  <span style={{ fontSize: 13 }}>{row.emoji} {row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--psp-navy, #0a1628)' }}>{row.count}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: '2px solid var(--psp-gold, #f0a500)' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--psp-gold, #f0a500)' }}>{totalArchive}</span>
              </div>
            </div>
          </div>

          {/* Explore the Database */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: 'var(--psp-gold, #f0a500)', color: 'var(--psp-navy, #0a1628)' }}>
              Explore the Database
            </div>
            <div className="hub-wb" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { href: '/search', label: '🔍 Search Database' },
                { href: '/football', label: '🏈 Football Hub' },
                { href: '/basketball', label: '🏀 Basketball Hub' },
                { href: '/football/leaderboards/rushing', label: '📊 Leaderboards' },
                { href: '/football/championships', label: '🏆 Championships' },
                { href: '/schools', label: '🏫 All Schools' },
                { href: '/community', label: '🤝 Community' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: 13, color: 'var(--psp-navy)', textDecoration: 'none', padding: '4px 0', borderBottom: '1px solid var(--psp-gray-100)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <PSPPromo size="sidebar" variant={3} />
        </aside>
      </div>
    </div>
  );
}
