/**
 * LeaderBoardCard — wrapper card for a single sport's leaders.
 *
 * Sport-color top stripe, header with SVG icon + title + LIVE indicator,
 * children slot for LeaderRow components, optional footer with link.
 */

import Link from "next/link";
import SportIcon from "@/components/ui/SportIcon";

interface LeaderBoardCardProps {
  sport: string; // sport slug for SportIcon
  sportName: string;
  sportColor: string; // CSS var for the top stripe + accents
  statLabel: string; // e.g. "RUSH YARDS LEADERS"
  isLive?: boolean;
  freshnessLabel?: string; // e.g. "Updated 14 minutes ago · Week 13"
  href?: string; // "View [Sport] Leaders" footer link
  children: React.ReactNode;
}

export default function LeaderBoardCard({
  sport,
  sportName,
  sportColor,
  statLabel,
  isLive = false,
  freshnessLabel,
  href,
  children,
}: LeaderBoardCardProps) {
  return (
    <div className="bg-[var(--psp-navy-mid)] border border-[var(--psp-rule-strong)] rounded-xl overflow-hidden">
      <div className="h-1" style={{ background: sportColor }} />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <SportIcon sport={sport} size="sm" />
          <h2 className="psp-h3 psp-cream m-0">{sportName}</h2>
          {isLive && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-[rgba(230,57,70,0.4)] bg-[rgba(230,57,70,0.12)] text-[var(--psp-live)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--psp-live)]" />
              LIVE
            </span>
          )}
        </div>

        <p className="text-[11px] font-bold psp-cream-muted uppercase tracking-wider mb-2">
          {statLabel}
        </p>

        {freshnessLabel && (
          <p className="text-[10px] psp-cream-dim uppercase tracking-wider mb-2">
            {freshnessLabel}
          </p>
        )}

        <div className="flex flex-col">{children}</div>

        {href && (
          <div className="mt-3 pt-3 border-t border-[var(--psp-rule)]">
            <Link
              href={href}
              className="inline-flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition-colors"
            >
              <span>View {sportName} Leaders</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
