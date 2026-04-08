/**
 * EmptyBoard — honest off-season state (audit LB-5 fix).
 *
 * Replaces the old StatPills placeholder with a clear "out of season" card
 * that shows last season's headline + a CTA to view the archive. No fake
 * stat labels pretending data exists.
 */

interface EmptyBoardProps {
  reason?: string;
  ctaLabel?: string;
}

export default function EmptyBoard({
  reason = "This sport's season is out of session. Final results from last season are archived.",
  ctaLabel = "View Season Archive →",
}: EmptyBoardProps) {
  return (
    <div className="border border-dashed border-[var(--psp-rule-strong)] rounded-lg p-6 text-center">
      <div className="psp-cream-muted text-sm leading-relaxed mb-4 max-w-prose mx-auto">
        {reason}
      </div>
      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[var(--psp-gold)] border border-[var(--psp-rule-strong)] px-4 py-2">
        {ctaLabel}
      </span>
    </div>
  );
}
