import Link from 'next/link';

type PlacementType = 'sidebar' | 'banner' | 'inline' | 'footer';

interface SponsorSlotProps {
  placement: PlacementType;
  sportId?: string;
}

const PLACEMENT_STYLES = {
  sidebar: {
    container: 'w-full rounded-lg p-6 text-center border-2 border-gold/30',
    minHeight: 'min-h-[280px]',
    dimensions: '300�250',
  },
  banner: {
    container: 'w-full rounded-lg p-4 text-center border-2 border-gold/30',
    minHeight: 'min-h-[80px]',
    dimensions: 'Full width banner',
    responsive: 'md:min-h-[100px]',
  },
  inline: {
    container: 'w-full rounded-lg p-6 text-center border-2 border-gold/30 my-8',
    minHeight: 'min-h-[120px]',
    dimensions: 'Native ad format',
  },
  footer: {
    container: 'w-full rounded-lg p-4 text-center border-t-2 border-gold/30',
    minHeight: 'min-h-[80px]',
    dimensions: 'Logo row',
  },
};

export default function SponsorSlot({ placement, sportId }: SponsorSlotProps) {
  const style = PLACEMENT_STYLES[placement];

  return (
    <div
      role="region"
      aria-label={`${placement} sponsor placement`}
      className={`
        ${style.container}
        ${style.minHeight}
        flex flex-col items-center justify-center gap-3
        bg-gradient-to-br from-navy/90 via-navy-mid/85 to-navy/90
        hover:from-navy hover:via-blue/5 hover:to-navy
        transition-all duration-300
        group
      `}
    >
      {/* PSP Logo */}
      <div className="text-2xl font-bold font-bebas tracking-widest text-gold group-hover:text-yellow-300 transition-colors">
        PSP
      </div>

      {/* Main text */}
      <div className="text-sm md:text-base font-medium text-white/80 leading-tight">
        {placement === 'footer'
          ? 'Featured Sponsors'
          : `${placement.charAt(0).toUpperCase() + placement.slice(1)} Sponsor`}
      </div>

      {/* Subtext */}
      <div className="text-xs text-white/80 mt-2">
        {placement === 'sidebar' && (
          <>
            <p className="mb-2">Support Philly sports journalism</p>
            <p className="text-white/75">300�250</p>
          </>
        )}
        {placement === 'banner' && (
          <>
            <p className="mb-1">Reach 1000+ daily visitors</p>
            <p className="text-white/75 text-xs">728�90 (or responsive)</p>
          </>
        )}
        {placement === 'inline' && (
          <>
            <p className="mb-2">Native ad placement</p>
            <p className="text-white/75 text-xs">Between content sections</p>
          </>
        )}
        {placement === 'footer' && (
          <p className="text-white/75 text-xs">Logo or text sponsorship</p>
        )}
      </div>

      {/* CTA Link */}
      <Link
        href="/advertise"
        className={`
          mt-4 px-4 py-2 rounded-md
          bg-gold text-navy font-bold
          hover:bg-yellow-300 shadow-md
          hover:shadow-lg transition-all duration-200
          text-xs md:text-sm
          inline-block
        `}
        aria-label="Learn about sponsorship opportunities"
      >
        {placement === 'footer' ? '↗ Advertise' : '← Advertise with PSP'}
      </Link>
    </div>
  );
}
