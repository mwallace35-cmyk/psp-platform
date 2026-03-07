/**
 * Web Vitals monitoring and reporting
 * Tracks Core Web Vitals and other performance metrics
 * Supports reporting to console (dev) and analytics endpoints (prod)
 */

export interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

interface ReportOptions {
  endpoint?: string;
  includeConsoleLog?: boolean;
}

// Thresholds for Web Vitals (from web.dev)
const VITALS_THRESHOLDS: Record<string, { good: number; poor: number }> = {
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FID: { good: 100, poor: 300 }, // First Input Delay
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  TTFB: { good: 600, poor: 1800 }, // Time to First Byte
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint
};

/**
 * Determine the rating for a metric value
 */
function getRating(
  metricName: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = VITALS_THRESHOLDS[metricName];
  if (!threshold) return 'needs-improvement';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report a single Web Vital metric
 */
export function reportWebVital(vital: WebVital, options: ReportOptions = {}): void {
  const { endpoint, includeConsoleLog = true } = options;

  // Log to console in development
  if (includeConsoleLog && typeof window !== 'undefined') {
    const bgColor =
      vital.rating === 'good' ? '#4ade80' :
      vital.rating === 'needs-improvement' ? '#facc15' :
      '#ef4444';

    console.log(
      `%c${vital.name}`,
      `background-color: ${bgColor}; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
      `${vital.value.toFixed(2)}ms - ${vital.rating}`
    );
  }

  // Send to analytics endpoint if provided
  if (endpoint && typeof window !== 'undefined' && navigator.sendBeacon) {
    const data = new FormData();
    data.append('name', vital.name);
    data.append('value', vital.value.toString());
    data.append('rating', vital.rating);
    if (vital.delta !== undefined) {
      data.append('delta', vital.delta.toString());
    }
    if (vital.id) {
      data.append('id', vital.id);
    }

    navigator.sendBeacon(endpoint, data);
  }
}

/**
 * Collect and report all Web Vitals
 * Uses basic measurements via Navigation Timing API
 */
export async function collectWebVitals(options: ReportOptions = {}): Promise<WebVital[]> {
  const vitals: WebVital[] = [];

  if (typeof window === 'undefined') {
    return vitals;
  }

  // Use basic measurements (web-vitals library is optional)
  reportBasicMetrics(options);

  return vitals;
}

/**
 * Fallback: Report basic performance metrics using Navigation Timing API
 */
function reportBasicMetrics(options: ReportOptions = {}): void {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }

  const perfData = window.performance.timing;
  const perfNav = window.performance.navigation;

  // TTFB: Time to First Byte
  const ttfb = perfData.responseStart - perfData.navigationStart;
  const ttfbVital: WebVital = {
    name: 'TTFB',
    value: ttfb,
    rating: getRating('TTFB', ttfb),
  };
  reportWebVital(ttfbVital, options);

  // FCP estimate: First Contentful Paint
  const fcp = perfData.domLoading - perfData.navigationStart;
  const fcpVital: WebVital = {
    name: 'FCP',
    value: fcp,
    rating: getRating('FCP', fcp),
  };
  reportWebVital(fcpVital, options);

  // Load Time: Full page load
  const loadTime = perfData.loadEventEnd - perfData.navigationStart;
  const loadVital: WebVital = {
    name: 'LoadTime',
    value: loadTime,
    rating: getRating('LCP', loadTime), // Using LCP threshold as approximation
  };
  reportWebVital(loadVital, options);
}

/**
 * Initialize Web Vitals monitoring on page load
 */
export function initializeWebVitalsMonitoring(options: ReportOptions = {}): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Use requestIdleCallback if available, otherwise use onload
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      collectWebVitals(options).catch(() => {
        // Silently handle errors
      });
    });
  } else {
    (window as Window).addEventListener('load', () => {
      collectWebVitals(options).catch(() => {
        // Silently handle errors
      });
    });
  }
}
