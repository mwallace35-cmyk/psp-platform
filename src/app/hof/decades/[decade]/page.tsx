import { notFound } from "next/navigation";
import { renderMarkdown } from "@/lib/legends/renderMarkdown";
import { loadDecadeMDX } from "@/lib/mdx/loadDecade";
import {
  getDecadeRoster,
  DECADE_SLUGS,
  type DecadeSlug,
} from "@/lib/data/decades";
import DecadeNav from "@/components/decades/DecadeNav";
import DecadeHero from "@/components/decades/DecadeHero";
import DecadeIntro from "@/components/decades/DecadeIntro";
import PlayerOfDecadeCard from "@/components/decades/PlayerOfDecadeCard";
import CoachOfDecadeCard from "@/components/decades/CoachOfDecadeCard";
import DecadeRoster from "@/components/decades/DecadeRoster";
import DecadeByTheNumbers from "@/components/decades/DecadeByTheNumbers";
import DecadeSchoolChips from "@/components/decades/DecadeSchoolChips";

export const revalidate = 3600;

/**
 * Map Coach of the Decade names → existing legend slugs.
 * Populated manually — these slugs were confirmed present in content/legends/.
 */
const COACH_LEGEND_SLUGS: Record<string, string> = {
  "Al Angelo": "al-angelo",
  "Pat Manzi": "pat-manzi",
  "Glen Galeone": "glen-galeone",
  "Ron Cohen": "ron-cohen",
};

const VALID_DECADE_SLUGS: DecadeSlug[] = ["1970s", "1980s", "1990s", "2000s"];

export async function generateStaticParams() {
  return VALID_DECADE_SLUGS.map((decade) => ({ decade }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ decade: string }>;
}) {
  const { decade } = await params;
  if (!VALID_DECADE_SLUGS.includes(decade as DecadeSlug)) return {};
  const slug = decade as DecadeSlug;
  const mdx = loadDecadeMDX(slug);
  const title = mdx?.label ?? `${decade} All-Decade Team`;
  return {
    title: `${title} | Ted Silary Canon | PhillySportsPack`,
    description:
      mdx?.headline ??
      `Ted Silary's ${decade} All-Decade football selections — the definitive Philly HS football canon.`,
  };
}

export default async function DecadePage({
  params,
}: {
  params: Promise<{ decade: string }>;
}) {
  const { decade } = await params;

  if (!VALID_DECADE_SLUGS.includes(decade as DecadeSlug)) notFound();
  const slug = decade as DecadeSlug;

  const [roster, mdx] = await Promise.all([
    getDecadeRoster(slug),
    Promise.resolve(loadDecadeMDX(slug)),
  ]);

  // Enrich coach legendSlug from our local lookup
  const enrichedCoach = roster.coachOfDecade
    ? {
        ...roster.coachOfDecade,
        legendSlug: COACH_LEGEND_SLUGS[roster.coachOfDecade.name] ?? null,
      }
    : null;

  const bodyHtml = mdx?.body ? renderMarkdown(mdx.body) : "";

  return (
    <div style={{ background: "var(--psp-navy)", minHeight: "100vh" }}>
      <DecadeNav current={slug} />

      <DecadeHero
        slug={slug}
        label={roster.label}
        years={roster.years}
        headline={mdx?.headline}
        pullQuote={mdx?.pullQuote}
        sourceUrl={roster.sourceUrl}
      />

      {mdx && (
        <DecadeIntro
          body={bodyHtml}
          headline={mdx.headline}
          pullQuote={mdx.pullQuote}
        />
      )}

      {roster.playersOfDecade.length > 0 && (
        <PlayerOfDecadeCard
          entries={roster.playersOfDecade}
          decadeLabel={roster.label}
        />
      )}

      {enrichedCoach && (
        <CoachOfDecadeCard
          coach={enrichedCoach}
          decadeLabel={roster.label}
        />
      )}

      <DecadeRoster picks={roster.picks} />

      <DecadeByTheNumbers stats={roster.stats} />

      <DecadeSchoolChips picks={roster.picks} />

      {/* Footer attribution */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
        }}
      >
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              color: "#475569",
              fontStyle: "italic",
            }}
          >
            Selections by <strong style={{ color: "#64748b" }}>Ted Silary</strong>.
            Originally published on TedSilary.com. Preserved and republished by
            PhillySportsPack.
          </p>
        </div>
      </section>
    </div>
  );
}
