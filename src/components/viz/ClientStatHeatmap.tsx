'use client';

import StatHeatmap from './StatHeatmap';
import type { StatHeatmapProps } from './types';

export default function ClientStatHeatmap(props: StatHeatmapProps) {
  return <StatHeatmap {...props} />;
}
