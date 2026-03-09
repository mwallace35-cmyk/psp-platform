'use client';

import CareerTrajectoryChart from './CareerTrajectoryChart';
import type { CareerTrajectoryChartProps } from './types';

export default function ClientCareerTrajectory(props: CareerTrajectoryChartProps) {
  return <CareerTrajectoryChart {...props} />;
}
