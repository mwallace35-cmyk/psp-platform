'use client';

import DynastyTimeline from './DynastyTimeline';
import type { DynastyTimelineProps } from './types';

export default function ClientDynastyTimeline(props: DynastyTimelineProps) {
  return <DynastyTimeline {...props} />;
}
