import type { Championship } from "@/content/legends-schema";

interface Props {
  championship: Championship;
  /** Optional prose recap — the markdown chunk that follows the token. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Inline championship recap card. Left border stripe in PSP gold, a
 * compact meta row (opponent, score, venue, date, weather), and the
 * full prose recap below as children. Rendered inside the main narrative
 * at the exact position the MDX body places the {{ChampionshipRecap
 * id="..."}} token.
 */
export default function ChampionshipRecap({
  championship,
  children,
  className = "",
}: Props) {
  const heading = championship.headline ?? `${championship.year} ${championship.title}`;
  const dateDisplay =
    championship.date ??
    (championship.year ? String(championship.year) : undefined);

  const metaItems: string[] = [];
  if (championship.opponent) metaItems.push(`vs ${championship.opponent}`);
  if (championship.score) metaItems.push(championship.score);
  if (championship.venue) metaItems.push(championship.venue);
  if (dateDisplay) metaItems.push(dateDisplay);
  if (championship.weather) metaItems.push(championship.weather);

  return (
    <aside
      className={`my-10 border-l-[6px] border-[var(--psp-gold)] bg-[var(--psp-cream)] rounded-r-xl shadow-sm ${className}`}
      aria-label={heading}
    >
      <div className="px-6 py-5">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-xs uppercase tracking-[0.15em] text-[var(--psp-gold)] font-bold">
            Championship Recap
          </span>
          {championship.year && (
            <span className="text-xs text-[var(--psp-gray-500)]">
              {championship.year}
            </span>
          )}
        </div>
        <h3 className="font-heading text-2xl md:text-3xl text-[var(--psp-navy)] mt-1 leading-tight">
          {heading}
        </h3>
        {metaItems.length > 0 && (
          <p className="mt-2 text-sm text-[var(--psp-gray-700)]">
            {metaItems.join(" \u00b7 ")}
          </p>
        )}
        {children && (
          <div className="mt-4 text-[var(--psp-gray-700)] leading-relaxed space-y-4 text-[15px]">
            {children}
          </div>
        )}
      </div>
    </aside>
  );
}
