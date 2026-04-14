import Image from 'next/image';
import type { SPORT_META, SportId } from '@/lib/sports';

interface ArticleHeroProps {
  title: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  byline: string;
  bylineInitial: string;
  publishedDate: string;
  accent: { bar: string; chip: string; tint: string };
  sportMeta: (typeof SPORT_META)[SportId] | null;
}

export default function ArticleHero({
  title,
  excerpt,
  featuredImageUrl,
  publishedAt,
  createdAt,
  byline,
  bylineInitial,
  publishedDate,
  accent,
  sportMeta,
}: ArticleHeroProps) {
  return (
    <header
      className="psp-article-hero relative w-full overflow-hidden"
      style={{
        minHeight: 'clamp(440px, 78vh, 720px)',
        background: 'var(--psp-navy)',
      }}
    >
      {featuredImageUrl && (
        <Image
          src={featuredImageUrl}
          alt={title}
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
          {/* Sport chip -- staggered fade */}
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
            {title}
          </h1>

          {/* Excerpt (if present) */}
          {excerpt && (
            <p
              className="psp-fade-in-up mt-5 max-w-2xl text-base sm:text-lg leading-relaxed"
              style={{
                color: 'rgba(245, 235, 214, 0.85)',
                textShadow: '0 2px 14px rgba(0,0,0,0.6)',
                animationDelay: '0.3s',
                fontFamily: "var(--font-body), 'Inter Tight', sans-serif",
              }}
            >
              {excerpt}
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
                dateTime={publishedAt || createdAt}
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
  );
}
