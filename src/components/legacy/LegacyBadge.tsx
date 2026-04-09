import Link from "next/link";

interface Props {
  href: string;
}

/**
 * Small "Career Arc" pill badge. Renders on player, coach, and legend pages
 * when the person has a published legacy profile.
 */
export default function LegacyBadge({ href }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 bg-[var(--psp-gold)]/10 hover:bg-[var(--psp-gold)]/20 border border-[var(--psp-gold)]/40 hover:border-[var(--psp-gold)] rounded-full px-3 py-1 text-xs font-semibold text-[var(--psp-navy)] hover:text-[var(--psp-navy)] transition-colors group"
    >
      <span
        className="w-2 h-2 rounded-full bg-[var(--psp-gold)] group-hover:scale-110 transition-transform"
        aria-hidden
      />
      Career Arc
    </Link>
  );
}
