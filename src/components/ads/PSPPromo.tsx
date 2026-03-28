'use client';

import Link from 'next/link';
import { useMemo } from 'react';

type PromoSize = 'sidebar' | 'banner' | 'billboard';

interface PSPPromoProps {
  size: PromoSize;
  variant?: number;
}

const PROMOS = [
  {
    text: 'Did you know? 72 Philly athletes went pro',
    cta: '→',
    href: '/search',
  },
  {
    text: 'Compare your favorite players',
    cta: '→',
    href: '/compare',
  },
  {
    text: '25 years of Philly HS sports data',
    cta: '→',
    href: '/football',
  },
  {
    text: 'Explore the Archive: 2000-2025',
    cta: '→',
    href: '/archive',
  },
  {
    text: 'Explore 55,000+ Philly HS athletes',
    cta: '→',
    href: '/players',
  },
];

const SIZE_STYLES = {
  sidebar: {
    container: 'w-full rounded-lg px-6 py-8 text-center',
    textSize: 'text-base',
    minHeight: 'min-h-[250px]',
  },
  banner: {
    container: 'w-full rounded-lg px-6 py-4 text-center',
    textSize: 'text-sm',
    minHeight: 'min-h-[80px]',
  },
  billboard: {
    container: 'w-full rounded-lg px-6 py-12 text-center',
    textSize: 'text-lg',
    minHeight: 'min-h-[320px]',
  },
};

export default function PSPPromo({ size, variant = 0 }: PSPPromoProps) {
  const promo = useMemo(() => {
    return PROMOS[variant % PROMOS.length];
  }, [variant]);

  const styles = SIZE_STYLES[size];

  return (
    <div role="region" aria-label="Promotional content">
      <Link
        href={promo.href}
        aria-label={`Promotional content: ${promo.text}`}
        className={`
          ${styles.container}
          ${styles.minHeight}
          flex flex-col items-center justify-center gap-4
          border-2
          hover:shadow-lg hover:border-[var(--psp-gold-light,#f5c542)] transition-all duration-300
          group
        `}
        style={{
          background: 'var(--psp-navy, #0a1628)',
          borderColor: 'var(--psp-gold, #f0a500)',
        }}
      >
        <div className={`${styles.textSize} font-semibold leading-tight`} style={{ color: '#ffffff' }}>
          {promo.text}
        </div>
        <div className="text-2xl font-bold transition-colors" style={{ color: 'var(--psp-gold, #f0a500)' }} aria-hidden="true">
          {promo.cta}
        </div>
      </Link>
    </div>
  );
}
