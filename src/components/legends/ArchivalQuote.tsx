import type { ArchivalQuote } from "@/content/legends-schema";

interface Props {
  quote: ArchivalQuote;
}

/**
 * Lighter-weight quote variant for sideline reactions, post-game press,
 * and archival reflections that aren't centerpiece pull quotes. Visually
 * less imposing than `<PullQuote>` so a page can host both kinds without
 * them competing for attention.
 */
export default function ArchivalQuote({ quote }: Props) {
  return (
    <figure className="my-6 not-prose">
      <blockquote className="border-l-2 border-[var(--psp-gold)] pl-4 py-1">
        <p className="text-[15px] leading-relaxed text-[var(--psp-gray-700)] italic">
          &ldquo;{quote.text}&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-2 pl-4 text-xs text-[var(--psp-gray-500)] uppercase tracking-wider">
        — <span className="font-semibold text-[var(--psp-navy)]">{quote.speaker}</span>
        {quote.role && <span>, {quote.role}</span>}
        {quote.context && <span> · {quote.context}</span>}
        {quote.date && <span> · {quote.date}</span>}
      </figcaption>
    </figure>
  );
}
