'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui';

const WinLossTrendChart = dynamic(() => import('./WinLossTrendChart'), {
  loading: () => <Skeleton height="400px" />,
  ssr: false, // Don't SSR charts for better performance
});

export default WinLossTrendChart;
