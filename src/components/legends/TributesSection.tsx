import type { LegendTribute } from "@/lib/legends/fetchTributes";
import TributeComposer from "./TributeComposer";

interface Props {
  legendSlug: string;
  legendName: string;
  tributes: LegendTribute[];
  variant?: "default" | "memoriam";
}

/**
 * Merged feed of archived Ted Silary comments and new user-submitted
 * tributes for a legend. Archived rows are tagged with a small gold
 * badge so provenance is clear. The composer form posts new submissions
 * to the moderation queue.
 */
export default function TributesSection({
  legendSlug,
  legendName,
  tributes,
  variant = "default",
}: Props) {
  const archivedCount = tributes.filter(
    (t) => t.source === "ted-silary-archive",
  ).length;
  const liveCount = tributes.length - archivedCount;

  return (
    <section
      id="tributes"
      aria-labelledby="tributes-heading"
      className="scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2
            id="tributes-heading"
            className="font-heading text-3xl md:text-4xl text-[var(--psp-navy)]"
          >
            {variant === "memoriam" ? "Remembrances" : "Tributes"}
          </h2>
          <p className="text-[var(--psp-gray-600)] mt-1 text-sm">
            {tributes.length === 0
              ? `Be the first to share a tribute for ${legendName}.`
              : `${tributes.length} tribute${tributes.length === 1 ? "" : "s"}${
                  archivedCount > 0
                    ? ` — ${archivedCount} from the original TedSilary.com archive${liveCount > 0 ? `, ${liveCount} from readers` : ""}`
                    : ""
                }.`}
          </p>
        </div>

        {tributes.length > 0 && (
          <ol className="space-y-6 mb-10" aria-label="Tribute feed">
            {tributes.map((t) => (
              <li
                key={t.id}
                className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-5 shadow-sm"
              >
                <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                  <span className="font-heading text-base text-[var(--psp-navy)]">
                    {t.name}
                  </span>
                  {t.affiliation && (
                    <span className="text-xs text-[var(--psp-gray-500)]">
                      {t.affiliation}
                    </span>
                  )}
                  {t.source === "ted-silary-archive" && (
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-[var(--psp-gold)]/15 text-[var(--psp-gold)] px-2 py-0.5 rounded-full border border-[var(--psp-gold)]/30">
                      Archived from TedSilary.com
                    </span>
                  )}
                  <time
                    className="ml-auto text-[11px] text-[var(--psp-gray-400)]"
                    dateTime={t.archived_date ?? t.created_at}
                  >
                    {new Date(
                      t.archived_date ?? t.created_at,
                    ).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <p className="text-[15px] text-[var(--psp-gray-700)] leading-relaxed whitespace-pre-wrap">
                  {t.body}
                </p>
              </li>
            ))}
          </ol>
        )}

        <TributeComposer
          legendSlug={legendSlug}
          legendName={legendName}
          variant={variant}
        />
      </div>
    </section>
  );
}
