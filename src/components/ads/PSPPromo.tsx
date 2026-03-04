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
    text: '8 Hall of Famers. One city.',
    cta: '→',
    href: '/search',
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
    <Link
      href={promo.href}
      className={`
        ${styles.container}
        ${styles.minHeight}
        flex flex-col items-center justify-center gap-4
        bg-gradient-to-br from-navy via-navy to-blue-900
        border border-blue-800
        hover:border-gold hover:shadow-lg transition-all duration-300
        group
      `}
    >
      <div className={`${styles.textSize} font-semibold text-white leading-tight`}>
        {promo.text}
      </div>
      <div className="text-2xl font-bold text-gold group-hover:text-yellow-300 transition-colors">
        {promo.cta}
      </div>
    </Link>
  );
}
