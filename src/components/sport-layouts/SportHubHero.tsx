import Link from "next/link";

interface FeaturedArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string | null;
  published_at?: string | null;
  author_name?: string | null;
}

interface SportHubHeroProps {
  sport: string;
  sportName: string;
  sportEmoji: string;
  sportColorHex: string;
  article: FeaturedArticle | null;
  seasonPhaseBadge: { label: string; color: string; bg: string };
  fallbackBannerSport: string; // e.g. "track" for track-field
}

export default function SportHubHero({
  sport,
  sportName,
  sportEmoji,
  sportColorHex,
  article,
  seasonPhaseBadge,
  fallbackBannerSport,
}: SportHubHeroProps) {
  // If we have a featured article, render the editorial hero
  if (article) {
    const bgImage = article.featured_image_url
      ? `linear-gradient(to right, rgba(10,22,40,0.92) 40%, rgba(10,22,40,0.5)), url(${article.featured_image_url}) center/cover no-repeat`
      : `linear-gradient(to right, rgba(10,22,40,0.92) 40%, rgba(10,22,40,0.55)), url(/images/banners/${fallbackBannerSport}.jpg) center/cover no-repeat`;

    const publishDate = article.published_at
      ? new Date(article.published_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

    return (
      <section
        className="relative overflow-hidden bg-[#0a1628]"
        aria-label={`Featured ${sportName} story`}
      >
        <div
          className="w-full min-h-[340px] md:min-h-[400px] flex items-end"
          style={{ background: bgImage }}
        >
          {/* Sport color accent bar at top */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: sportColorHex }}
          />

          <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pb-8 pt-16 relative z-10">
            {/* Sport tag + season badge */}
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded"
                style={{ background: sportColorHex, color: "#fff" }}
              >
                {sportEmoji} {sportName}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${seasonPhaseBadge.color} ${seasonPhaseBadge.bg}`}
              >
                {seasonPhaseBadge.label}
              </span>
            </div>

            {/* Headline */}
            <Link
              href={`/articles/${article.slug}`}
              className="group block focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:outline-none rounded"
            >
              <h1 className="psp-h1-lg text-white mb-3 group-hover:text-[var(--psp-gold)] transition-colors duration-200 max-w-3xl">
                {article.title}
              </h1>
            </Link>

            {/* Excerpt */}
            {article.excerpt && (
              <p
                className="text-white/80 text-base md:text-lg leading-relaxed mb-4 max-w-2xl"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                {article.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-3 text-xs text-white/50">
              {article.author_name && <span>{article.author_name}</span>}
              {article.author_name && publishDate && (
                <span className="text-white/30">|</span>
              )}
              {publishDate && <span>{publishDate}</span>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback: original banner design (no articles)
  return (
    <section
      className="text-white py-10 px-4 relative overflow-hidden flex items-center bg-[#0a1628]"
      style={{
        background: `linear-gradient(to right, rgba(10,22,40,0.55), rgba(10,22,40,0.15)), url(/images/banners/${fallbackBannerSport}.jpg) center/cover no-repeat`,
      }}
      role="img"
      aria-label={`Philadelphia high school ${sportName.toLowerCase()} banner`}
    >
      {/* Sport color accent bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: sportColorHex }}
      />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="flex items-center gap-4">
          <span className="text-4xl" aria-hidden="true">
            {sportEmoji}
          </span>
          <div className="flex items-center gap-3">
            <h1 className="psp-h1-lg text-white">{sportName}</h1>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${seasonPhaseBadge.color} ${seasonPhaseBadge.bg}`}
            >
              {seasonPhaseBadge.label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
