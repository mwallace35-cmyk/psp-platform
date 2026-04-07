import type { PullQuote as PullQuoteData } from "@/content/legends-schema";

interface Props {
  quote: PullQuoteData;
  className?: string;
}

/**
 * Pull-quote block. A large gold-accented quote with an em-dash attribution
 * line. Used inline in the narrative for memorable lines like "He was
 * Frankford's Joe Paterno."
 */
export default function PullQuote({ quote, className = "" }: Props) {
  return (
    <figure
      className={`relative my-10 border-l-4 border-[var(--psp-gold)] pl-6 md:pl-8 ${className}`}
    >
      <span
        aria-hidden
        className="absolute -left-1 -top-4 font-heading text-6xl leading-none text-[var(--psp-gold)]/30 select-none"
      >
        &ldquo;
      </span>
      <blockquote className="font-heading text-xl md:text-2xl leading-snug text-[var(--psp-navy)]">
        {quote.text}
      </blockquote>
      {quote.attribution && (
        <figcaption className="mt-3 text-sm uppercase tracking-wider text-[var(--psp-gray-500)]">
          &mdash; {quote.attribution}
        </figcaption>
      )}
    </figure>
  );
}
