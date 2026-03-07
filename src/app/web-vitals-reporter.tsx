'use client';

import { useEffect } from 'react';
import { initializeWebVitalsMonitoring } from '@/lib/web-vitals';

/**
 * Web Vitals Reporter Component
 * Initializes Web Vitals monitoring on mount
 * Call this component once in your root layout
 */
export function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    const isDev = process.env.NODE_ENV === 'development';
    const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

    initializeWebVitalsMonitoring({
      endpoint: analyticsEndpoint,
      includeConsoleLog: isDev,
    });
  }, []);

  // Component renders nothing
  return null;
}

export default WebVitalsReporter;
