import Image from "next/image";
import type { LegendFrontmatter } from "@/content/legends-schema";
import {
  SPORT_LABELS,
  SPORT_EMOJIS,
  CATEGORY_LABELS,
} from "@/lib/data/legends";
import { Breadcrumb } from "@/components/ui";
import Badge from "@/components/ui/Badge";
import { legendPhotoUrl } from "@/lib/legends/photoUrl";

interface Props {
  frontmatter: LegendFrontmatter;
  variant: "coach" | "memoriam" | "spotlight";
  totalRecord?: { wins: number; losses: number; ties?: number } | null;
}

/**
 * Top of the legend page. Full-bleed navy (coach) / near-black (memoriam)
 * / sport-colored (spotlight) hero with a duotone ken-burns portrait,
 * breadcrumb, badges, name, role, schools, career span, and a category-
 * specific accent line (career record, memorial date, etc.).
 *
 * The portrait uses a subtle scale-up animation on load (disabled via
 * prefers-reduced-motion through the `legend-hero-img` utility class
 * below — handled globally if desired, but the animation is scoped with
 * CSS in the style block on the element itself).
 */
export default function LegendHero({
  frontmatter: l,
  variant,
  totalRecord,
}: Props) {
  const isMemoriam = variant === "memoriam";
  const isSpotlight = variant === "spotlight";
  const isCoach = variant === "coach";

  const heroPhotoUrl = legendPhotoUrl(l.slug, l.heroPhoto);
  const initials = l.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const gradientStyle: React.CSSProperties = isMemoriam
    ? {
        backgroundImage:
          "linear-gradient(to bottom right, #0b0b17, #121226 50%, #1a1a33)",
      }
    : isSpotlight
      ? {
          backgroundImage:
            "linear-gradient(to bottom right, var(--psp-navy), var(--psp-navy-mid) 50%, var(--psp-navy))",
        }
      : {
          backgroundImage:
            "linear-gradient(to bottom right, var(--psp-navy), var(--psp-navy-mid) 50%, #0c1e3d)",
        };

  return (
    <section
      className="relative overflow-hidden"
      style={gradientStyle}
      aria-label={`${l.name} hero`}
    >
      {/* Duotone portrait backdrop (blurred, low-opacity) */}
      {heroPhotoUrl && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 mix-blend-luminosity"
          style={{
            backgroundImage: `url(${heroPhotoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "blur(18px) saturate(0.7)",
          }}
        />
      )}
      <div
        aria-hidden
        className={`absolute inset-0 ${
          isMemoriam
            ? "bg-gradient-to-r from-black/70 via-black/40 to-black/70"
            : "bg-gradient-to-r from-[var(--psp-navy)]/80 via-transparent to-[var(--psp-navy)]/80"
        }`}
      />

      <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-12 md:pt-12 md:pb-16">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Hall of Fame", href: "/hof" },
            {
              label: isMemoriam
                ? "In Memoriam"
                : isSpotlight
                  ? "Spotlights"
                  : "Legends",
              href: isMemoriam
                ? "/hof/in-memoriam"
                : isSpotlight
                  ? "/hof/spotlights"
                  : "/hof/legends",
            },
            { label: l.name },
          ]}
          className="text-white/50 mb-6"
        />

        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
          {/* Portrait */}
          {heroPhotoUrl ? (
            <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden border-2 border-[var(--psp-gold)]/40 shadow-2xl flex-shrink-0 bg-[var(--psp-navy)]">
              <Image
                src={heroPhotoUrl}
                alt={l.heroCaption ?? l.name}
                fill
                sizes="(max-width: 768px) 128px, 176px"
                className="object-cover legend-hero-img"
                priority
              />
            </div>
          ) : (
            <div
              className={`w-32 h-32 md:w-44 md:h-44 rounded-2xl flex-shrink-0 flex items-center justify-center text-5xl md:text-6xl font-bold border-2 border-[var(--psp-gold)]/30 shadow-2xl ${
                isMemoriam
                  ? "bg-white/5 text-white/40"
                  : "bg-gradient-to-br from-[var(--psp-gold)] to-[var(--psp-gold)]/70 text-[var(--psp-navy)]"
              }`}
            >
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="sport">
                {SPORT_EMOJIS[l.sport]} {SPORT_LABELS[l.sport]}
              </Badge>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--psp-gold)] font-bold">
                {CATEGORY_LABELS[l.category]}
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl text-white leading-[0.95] tracking-tight">
              {l.name}
            </h1>

            <p className="text-white/75 mt-3 text-lg">
              {l.role}
              {l.schools.length > 0 && (
                <>
                  <span className="mx-2 text-white/40">&middot;</span>
                  {l.schools.join(", ")}
                </>
              )}
              {l.careerSpan && (
                <span className="ml-2 text-white/40">({l.careerSpan})</span>
              )}
            </p>

            {isCoach && totalRecord && totalRecord.wins > 0 && (
              <div className="mt-4 inline-flex items-baseline gap-2 bg-[var(--psp-gold)]/15 border border-[var(--psp-gold)]/30 rounded-full px-4 py-1.5">
                <span className="font-heading text-xl text-[var(--psp-gold)] tabular-nums">
                  {totalRecord.wins}&ndash;{totalRecord.losses}
                  {totalRecord.ties ? `\u2013${totalRecord.ties}` : ""}
                </span>
                <span className="text-xs uppercase tracking-wider text-[var(--psp-gold)]/80">
                  Career Record
                </span>
              </div>
            )}

            {isMemoriam && l.died && (
              <p className="mt-4 text-white/60 text-sm italic">
                In Memoriam &middot; {l.died}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Subtle ken-burns animation, disabled for reduced-motion */}
      <style>{`
        @keyframes legendHeroKenBurns {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.04); }
        }
        .legend-hero-img {
          animation: legendHeroKenBurns 10s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .legend-hero-img { animation: none; }
        }
      `}</style>
    </section>
  );
}
