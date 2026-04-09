import { createStaticClient } from '@/lib/supabase/static';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SPORT_META, type SportId } from '@/lib/sports';
import { ArticleJsonLd } from '@/components/seo/JsonLd';
import { LeaderboardAd } from '@/components/ads/AdPlaceholder';
import CommentSectionLazy from '@/components/comments/CommentSectionLazy';
import { sanitizeHtml } from '@/lib/sanitize';
import ShareButtons from '@/components/social/ShareButtons';
import JoinCTA from '@/components/ui/JoinCTA';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

// Deterministic date formatter — explicit locale + timeZone makes it
// hydration-safe on both server and client. ET is correct for a Philly site.
const DATE_FMT = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return DATE_FMT.format(d);
}

// Per-sport accent map — uses SPORT_META color + translucent variants.
function getAccent(sportId: string | null | undefined): {
  bar: string; chip: string; tint: string;
} {
  const meta = sportId ? SPORT_META[sportId as SportId] : null;
  const base = meta?.color || '#f0a500';
  // Convert hex → rgba helper
  const hex = base.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return {
    bar: base,
    chip: `rgba(${r}, ${g}, ${b}, 0.18)`,
    tint: `rgba(${r}, ${g}, ${b}, 0.35)`,
  };
}

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createStaticClient();
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) return generatePageMetadata({ pageType: 'article-detail' });

  return {
    ...generatePageMetadata({
      pageType: 'article-detail',
      title: article.title,
      description: article.excerpt || article.title,
      slug: article.slug,
    }),
    alternates: { canonical: `https://phillysportspack.com/articles/${article.slug}` },
  };
}

// -----------------------------------------------------------------------------
// Markdown renderer (kept from previous version)
// -----------------------------------------------------------------------------

function renderMarkdown(content: string): string {
  const html = content
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/gm, '<p>')
    .replace(/$/gm, '</p>');
  return sanitizeHtml(html);
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createStaticClient();

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) notFound();

  const accent = getAccent(article.sport_id);
  const sportMeta = article.sport_id
    ? SPORT_META[article.sport_id as SportId]
    : null;

  // Parallel fetch: linked player, player stats, school, related articles
  const [playerRes, statsRes, schoolRes, relatedRes] = await Promise.all([
    article.player_id
      ? supabase
          .from('players')
          .select('id, slug, name, graduation_year, positions, height, weight, primary_school_id')
          .eq('id', article.player_id)
          .single()
      : Promise.resolve({ data: null }),
    article.player_id && article.sport_id === 'football'
      ? supabase
          .from('football_player_seasons')
          .select('games_played, receptions, rec_yards, rec_td, rush_yards, rush_td, pass_yards, pass_td')
          .eq('player_id', article.player_id)
      : Promise.resolve({ data: null }),
    article.school_id
      ? supabase
          .from('schools')
          .select('id, slug, name')
          .eq('id', article.school_id)
          .single()
      : Promise.resolve({ data: null }),
    supabase
      .from('articles')
      .select('id, slug, title, created_at, featured_image_url')
      .eq('sport_id', article.sport_id)
      .eq('status', 'published')
      .neq('id', article.id)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const player = playerRes.data as {
    id: number;
    slug: string;
    name: string;
    graduation_year: number | null;
    positions: string[] | null;
    height: string | null;
    weight: number | null;
    primary_school_id: number | null;
  } | null;

  const playerSeasons = (statsRes.data as Array<{
    games_played: number | null;
    receptions: number | null;
    rec_yards: number | null;
    rec_td: number | null;
    rush_yards: number | null;
    rush_td: number | null;
    pass_yards: number | null;
    pass_td: number | null;
  }> | null) || null;

  const school = schoolRes.data as { id: number; slug: string; name: string } | null;

  interface RelatedArticle {
    id: number;
    slug: string;
    title: string;
    created_at: string;
    featured_image_url: string | null;
  }
  const relatedArticles = relatedRes.data as RelatedArticle[] | null;

  // Aggregate career stats for ribbon (football receiver-focused)
  const careerStats = playerSeasons?.reduce(
    (acc, s) => ({
      gp: acc.gp + (s.games_played || 0),
      rec: acc.rec + (s.receptions || 0),
      recYds: acc.recYds + (s.rec_yards || 0),
      recTd: acc.recTd + (s.rec_td || 0),
    }),
    { gp: 0, rec: 0, recYds: 0, recTd: 0 }
  );
  const hasStats =
    careerStats && (careerStats.rec > 0 || careerStats.recYds > 0 || careerStats.recTd > 0);

  const byline = article.author_name || article.author || 'PSP Staff';
  const bylineInitial = byline.slice(0, 1).toUpperCase();
  const publishedDate = formatDate(article.published_at || article.created_at);
  const updatedDate = formatDate(article.updated_at || article.created_at);

  return (
    <div
      className="min-h-screen"
      style={
        {
          background: 'var(--psp-navy)',
          // CSS var consumed by .psp-article-prose (accent color for dropcap/h2 underline/blockquote bar)
          ['--psp-accent' as string]: accent.bar,
        } as React.CSSProperties
      }
    >
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt || article.title}
        author={byline}
        datePublished={article.created_at}
        dateModified={article.updated_at || article.created_at}
        url={`https://phillysportspack.com/articles/${article.slug}`}
        imageUrl={article.featured_image_url}
      />

      {/* Sport accent bar — full-width strip in sport color */}
      <div className="w-full h-1" style={{ background: accent.bar }} aria-hidden />

      {/* ================================================================= */}
      {/* IMMERSIVE HERO                                                      */}
      {/* ================================================================= */}
      <header
        className="psp-article-hero relative w-full overflow-hidden"
        style={{
          minHeight: 'clamp(440px, 78vh, 720px)',
          background: 'var(--psp-navy)',
        }}
      >
        {article.featured_image_url && (
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}

        {/* Gradient + radial tint overlay */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background: `
              linear-gradient(180deg, rgba(10,22,40,0.15) 0%, rgba(10,22,40,0.5) 48%, rgba(10,22,40,0.95) 100%),
              radial-gradient(ellipse 60% 50% at 85% 40%, ${accent.tint}, transparent 65%)
            `,
          }}
        />

        {/* Hero text */}
        <div className="relative h-full flex flex-col justify-end" style={{ minHeight: 'inherit' }}>
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 pt-24">
            {/* Sport chip — staggered fade */}
            {sportMeta && (
              <div
                className="psp-fade-in-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{
                  background: accent.chip,
                  border: `1px solid ${accent.bar}`,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  animationDelay: '0.1s',
                }}
              >
                <span className="text-base leading-none">{sportMeta.emoji}</span>
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.14em] text-white"
                  style={{ fontFamily: "var(--font-body), 'Inter Tight', sans-serif" }}
                >
                  {sportMeta.name}
                </span>
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: accent.bar,
                    display: 'inline-block',
                  }}
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">
                  Commitments
                </span>
              </div>
            )}

            {/* Title */}
            <h1
              className="psp-h1 psp-fade-in-up max-w-3xl"
              style={{
                color: '#ffffff',
                textShadow:
                  '0 4px 32px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.4)',
                animationDelay: '0.2s',
              }}
            >
              {article.title}
            </h1>

            {/* Excerpt (if present) */}
            {article.excerpt && (
              <p
                className="psp-fade-in-up mt-5 max-w-2xl text-base sm:text-lg leading-relaxed"
                style={{
                  color: 'rgba(245, 235, 214, 0.85)',
                  textShadow: '0 2px 14px rgba(0,0,0,0.6)',
                  animationDelay: '0.3s',
                  fontFamily: "var(--font-body), 'Inter Tight', sans-serif",
                }}
              >
                {article.excerpt}
              </p>
            )}

            {/* Byline */}
            <div
              className="psp-fade-in-up flex items-center gap-3 mt-7"
              style={{ animationDelay: '0.4s' }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                style={{
                  background: accent.bar,
                  color: '#fff',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                }}
                aria-hidden
              >
                {bylineInitial}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-white">{byline}</span>
                <span style={{ color: 'rgba(245,235,214,0.4)' }}>·</span>
                <time
                  dateTime={article.published_at || article.created_at}
                  style={{ color: 'rgba(245,235,214,0.75)' }}
                >
                  {publishedDate}
                </time>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll chevron indicator */}
        <div
          className="psp-pulse-down absolute left-1/2 bottom-5 pointer-events-none hidden sm:block"
          style={{ transform: 'translateX(-50%)' }}
          aria-hidden
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(245,235,214,0.65)"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </header>

      {/* ================================================================= */}
      {/* STAT RIBBON (conditional)                                           */}
      {/* ================================================================= */}
      {hasStats && player && (
        <section
          aria-label={`${player.name} career stats`}
          className="relative border-b"
          style={{
            background: 'linear-gradient(180deg, #0a1628 0%, #0f2040 100%)',
            borderColor: 'rgba(245,235,214,0.08)',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
            <div className="flex items-stretch gap-4">
              {/* Accent bar + label */}
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className="w-1 self-stretch rounded-full"
                  style={{ background: accent.bar }}
                  aria-hidden
                />
                <div>
                  <p
                    className="psp-caption"
                    style={{ color: accent.bar, letterSpacing: '0.14em' }}
                  >
                    Career
                  </p>
                  <p
                    className="text-[11px] uppercase tracking-wider font-semibold"
                    style={{ color: 'rgba(245,235,214,0.5)' }}
                  >
                    At Roman Catholic
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-4 gap-2 sm:gap-6">
                {[
                  { label: 'REC', value: careerStats!.rec },
                  { label: 'YDS', value: careerStats!.recYds.toLocaleString('en-US') },
                  { label: 'TDs', value: careerStats!.recTd },
                  { label: 'GP', value: careerStats!.gp || '—' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <div
                      className="font-extrabold leading-none tabular-nums"
                      style={{
                        color: 'var(--psp-gold)',
                        fontFamily: "var(--font-display), 'Fraunces', serif",
                        fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.25rem)',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                      style={{ color: 'rgba(245,235,214,0.6)' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <LeaderboardAd id="psp-article-banner" />

      {/* ================================================================= */}
      {/* BODY + SIDEBAR                                                      */}
      {/* ================================================================= */}
      <div className="psp-newsprint-bg">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* ---------- Main article ---------- */}
          <article className="md:col-span-2 min-w-0">
            <div
              className="psp-article-prose"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(article.body || article.content || ''),
              }}
            />

            {/* Destination panel (JMU — one-off for this article) */}
            {article.slug === 'eisa-nealy-jmu-commitment' && (
              <div
                className="mt-10 rounded-xl overflow-hidden relative"
                style={{
                  background:
                    'linear-gradient(135deg, #450099 0%, #5c2a9d 50%, #c8a84b 100%)',
                  boxShadow: '0 20px 50px -20px rgba(69, 0, 153, 0.5)',
                }}
              >
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
                  backgroundSize: '28px 28px',
                }} aria-hidden />
                <div className="relative p-6 sm:p-8 text-white">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
                    style={{ color: '#ffd700' }}
                  >
                    Next Stop
                  </p>
                  <h3
                    className="psp-h2 mb-3"
                    style={{ color: '#ffffff', fontWeight: 800 }}
                  >
                    James Madison University
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm mb-5">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                      style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)' }}
                    >
                      Dukes
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                      style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)' }}
                    >
                      Sun Belt Conference
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                      style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)' }}
                    >
                      FBS
                    </span>
                  </div>
                  <blockquote
                    className="pl-4 border-l-2 italic text-base sm:text-lg leading-relaxed"
                    style={{
                      borderColor: '#ffd700',
                      color: 'rgba(255,255,255,0.95)',
                      fontFamily: "var(--font-display), 'Fraunces', serif",
                    }}
                  >
                    &ldquo;JMU honestly felt like home, and they have a plan laid out for me to be successful.&rdquo;
                    <footer
                      className="mt-2 not-italic text-xs font-bold uppercase tracking-wider"
                      style={{ color: '#ffd700', fontFamily: "var(--font-body), 'Inter Tight', sans-serif" }}
                    >
                      — Eisa Nealy
                    </footer>
                  </blockquote>
                </div>
              </div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div
                className="mt-10 pt-6 border-t"
                style={{ borderColor: 'rgba(10,22,40,0.12)' }}
              >
                <p
                  className="psp-caption mb-3"
                  style={{ color: 'var(--psp-navy)' }}
                >
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full"
                      style={{
                        background: 'rgba(10,22,40,0.06)',
                        color: 'var(--psp-navy)',
                        border: '1px solid rgba(10,22,40,0.12)',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social sharing */}
            <div
              className="mt-8 pt-6 border-t"
              style={{ borderColor: 'rgba(10,22,40,0.12)' }}
            >
              <ShareButtons
                url={`/articles/${article.slug}`}
                title={`${article.title} | PhillySportsPack`}
                description={article.excerpt || article.title}
              />
            </div>

            <div className="mt-8">
              <JoinCTA action="comment" context="this article" compact />
            </div>

            <div className="mt-8">
              <CommentSectionLazy articleId={article.id} />
            </div>
          </article>

          {/* ---------- Sidebar ---------- */}
          <aside className="md:col-span-1">
            <div className="md:sticky md:top-6 space-y-6">
              {/* Player ID card */}
              {player && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(10,22,40,0.08)',
                    boxShadow: '0 4px 20px rgba(10,22,40,0.06)',
                  }}
                >
                  {/* Card header band */}
                  <div
                    className="px-5 pt-4 pb-3 flex items-center justify-between"
                    style={{ background: accent.chip, borderBottom: `2px solid ${accent.bar}` }}
                  >
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: 'var(--psp-navy)' }}
                    >
                      Featured Player
                    </span>
                    {player.graduation_year && (
                      <span
                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{
                          background: accent.bar,
                          color: '#fff',
                        }}
                      >
                        &apos;{String(player.graduation_year).slice(-2)}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-extrabold shrink-0"
                        style={{
                          background: accent.bar,
                          color: '#fff',
                          fontFamily: "var(--font-display), 'Fraunces', serif",
                        }}
                      >
                        {player.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="psp-h3 leading-tight truncate"
                          style={{ color: 'var(--psp-navy)' }}
                        >
                          {player.name}
                        </p>
                        {school && (
                          <p
                            className="text-xs font-semibold mt-0.5 truncate"
                            style={{ color: 'rgba(10,22,40,0.55)' }}
                          >
                            {school.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Meta grid */}
                    <dl
                      className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4 pb-4 border-b"
                      style={{ borderColor: 'rgba(10,22,40,0.08)' }}
                    >
                      {player.positions && player.positions.length > 0 && (
                        <div>
                          <dt
                            className="font-bold uppercase tracking-wider text-[10px]"
                            style={{ color: 'rgba(10,22,40,0.5)' }}
                          >
                            Pos
                          </dt>
                          <dd
                            className="font-semibold"
                            style={{ color: 'var(--psp-navy)' }}
                          >
                            {player.positions.join(' / ')}
                          </dd>
                        </div>
                      )}
                      {player.height && (
                        <div>
                          <dt
                            className="font-bold uppercase tracking-wider text-[10px]"
                            style={{ color: 'rgba(10,22,40,0.5)' }}
                          >
                            Ht
                          </dt>
                          <dd
                            className="font-semibold"
                            style={{ color: 'var(--psp-navy)' }}
                          >
                            {player.height}
                          </dd>
                        </div>
                      )}
                      {player.weight && (
                        <div>
                          <dt
                            className="font-bold uppercase tracking-wider text-[10px]"
                            style={{ color: 'rgba(10,22,40,0.5)' }}
                          >
                            Wt
                          </dt>
                          <dd
                            className="font-semibold"
                            style={{ color: 'var(--psp-navy)' }}
                          >
                            {player.weight} lb
                          </dd>
                        </div>
                      )}
                      {player.graduation_year && (
                        <div>
                          <dt
                            className="font-bold uppercase tracking-wider text-[10px]"
                            style={{ color: 'rgba(10,22,40,0.5)' }}
                          >
                            Class
                          </dt>
                          <dd
                            className="font-semibold"
                            style={{ color: 'var(--psp-navy)' }}
                          >
                            {player.graduation_year}
                          </dd>
                        </div>
                      )}
                    </dl>

                    <Link
                      href={`/${article.sport_id}/players/${player.slug}`}
                      className="block text-center text-xs font-bold uppercase tracking-wider py-2.5 rounded-md transition"
                      style={{
                        background: 'var(--psp-navy)',
                        color: '#fff',
                      }}
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              )}

              {/* About this article */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(10,22,40,0.08)',
                  boxShadow: '0 2px 12px rgba(10,22,40,0.04)',
                }}
              >
                <p
                  className="psp-caption mb-3"
                  style={{ color: 'var(--psp-navy)' }}
                >
                  About
                </p>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt style={{ color: 'rgba(10,22,40,0.5)' }}>Author</dt>
                    <dd
                      className="font-semibold text-right"
                      style={{ color: 'var(--psp-navy)' }}
                    >
                      {byline}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt style={{ color: 'rgba(10,22,40,0.5)' }}>Published</dt>
                    <dd
                      className="font-semibold text-right"
                      style={{ color: 'var(--psp-navy)' }}
                    >
                      {publishedDate}
                    </dd>
                  </div>
                  {updatedDate !== publishedDate && (
                    <div className="flex justify-between gap-3">
                      <dt style={{ color: 'rgba(10,22,40,0.5)' }}>Updated</dt>
                      <dd
                        className="font-semibold text-right"
                        style={{ color: 'var(--psp-navy)' }}
                      >
                        {updatedDate}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Related */}
              {relatedArticles && relatedArticles.length > 0 && (
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(10,22,40,0.08)',
                    boxShadow: '0 2px 12px rgba(10,22,40,0.04)',
                  }}
                >
                  <p
                    className="psp-caption mb-4"
                    style={{ color: 'var(--psp-navy)' }}
                  >
                    More {sportMeta?.name || 'Stories'}
                  </p>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        href={`/articles/${related.slug}`}
                        className="psp-related-card block"
                      >
                        <p
                          className="psp-related-title text-sm font-semibold leading-snug line-clamp-2"
                          style={{ color: 'var(--psp-navy)' }}
                        >
                          {related.title}
                        </p>
                        <p
                          className="text-[11px] mt-1"
                          style={{ color: 'rgba(10,22,40,0.5)' }}
                        >
                          {formatDate(related.created_at)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
