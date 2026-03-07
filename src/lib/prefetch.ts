/**
 * Intelligent prefetching strategies for Next.js routes
 *
 * This module provides utilities for prefetching route data and assets
 * before user navigation, improving perceived performance and reducing
 * perceived latency.
 *
 * Strategies:
 * - prefetchOnHover: Prefetch when user hovers over a link
 * - prefetchVisible: Prefetch when link appears in viewport
 * - prefetchRoute: Explicit prefetch with priority control
 *
 * Performance considerations:
 * - Only prefetch likely navigation targets
 * - Respect user bandwidth and device capabilities
 * - Avoid prefetching when on slow connections (4G, etc.)
 * - Batch prefetch requests to avoid excessive network usage
 */

// Track prefetched URLs to avoid duplicate requests
const prefetchedUrls = new Set<string>();

// Request idle callback for non-blocking prefetch
const scheduleIdleTask = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
};

/**
 * Prefetch a route when user hovers over a link
 *
 * Timing: Waits for user hover event
 * Use cases:
 * - Navigation links in header/sidebar
 * - Primary action links
 *
 * Example:
 * ```tsx
 * <a href="/football" onMouseEnter={() => prefetchOnHover('/football')}>
 *   Football Hub
 * </a>
 * ```
 */
export function prefetchOnHover(href: string) {
  if (prefetchedUrls.has(href)) {
    return;
  }

  prefetchedUrls.add(href);

  // Prefetch on idle to avoid blocking user input
  scheduleIdleTask(() => {
    // Next.js automatically prefetches with <Link> component
    // This function is for custom Link implementations or manual prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'fetch';
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch a route when link becomes visible in viewport
 *
 * Timing: Uses IntersectionObserver to detect viewport entry
 * Use cases:
 * - Related content below the fold
 * - Sidebar links in feed/list pages
 * - Pagination links
 *
 * Note: This is typically called from PrefetchLink component
 */
export function prefetchVisible(href: string) {
  if (prefetchedUrls.has(href)) {
    return;
  }

  prefetchedUrls.add(href);

  // Prefetch immediately when visible (higher priority than hover)
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'fetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Explicit prefetch with priority control
 *
 * Timing: Immediate (not deferred to idle)
 * Use cases:
 * - High-priority routes (player detail pages)
 * - Common next steps in navigation flow
 * - Critical cross-domain resources
 *
 * Priority levels:
 * - high: Prefetch immediately (useful for obvious next step)
 * - normal: Prefetch on idle (default)
 * - low: Prefetch with delay (secondary content)
 *
 * Example:
 * ```tsx
 * // Prefetch player detail when viewing team roster
 * prefetchRoute(`/football/players/${playerId}`, 'high')
 * ```
 */
export function prefetchRoute(href: string, priority: 'high' | 'normal' | 'low' = 'normal') {
  if (prefetchedUrls.has(href)) {
    return;
  }

  prefetchedUrls.add(href);

  const execute = () => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'fetch';
    link.href = href;
    document.head.appendChild(link);
  };

  switch (priority) {
    case 'high':
      execute();
      break;
    case 'normal':
      scheduleIdleTask(execute);
      break;
    case 'low':
      setTimeout(() => scheduleIdleTask(execute), 2000);
      break;
  }
}

/**
 * Prefetch multiple routes in batch
 *
 * Stagger prefetch requests to avoid network congestion
 *
 * Example:
 * ```tsx
 * // On homepage, prefetch all sport hubs
 * batchPrefetch([
 *   '/football',
 *   '/basketball',
 *   '/baseball',
 * ], { delayMs: 200 })
 * ```
 */
export function batchPrefetch(
  hrefs: string[],
  options: { delayMs?: number; priority?: 'high' | 'normal' | 'low' } = {}
) {
  const { delayMs = 100, priority = 'normal' } = options;

  hrefs.forEach((href, index) => {
    setTimeout(
      () => {
        prefetchRoute(href, priority);
      },
      index * delayMs
    );
  });
}

/**
 * Clear prefetch cache
 * Useful for testing or clearing memory
 */
export function clearPrefetchCache() {
  prefetchedUrls.clear();
}

/**
 * Check if a route has been prefetched
 */
export function isPrefetched(href: string): boolean {
  return prefetchedUrls.has(href);
}

/**
 * Get prefetch stats (for debugging/monitoring)
 */
export function getPrefetchStats() {
  return {
    totalPrefetched: prefetchedUrls.size,
    prefetchedUrls: Array.from(prefetchedUrls),
  };
}
