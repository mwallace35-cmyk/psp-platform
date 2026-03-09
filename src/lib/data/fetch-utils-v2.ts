/**
 * Enhanced Data Fetching Utilities v2
 *
 * Provides advanced patterns for efficient data retrieval:
 * - Parallel fetch with individual error handling
 * - Server-side caching with Next.js unstable_cache + revalidation tags
 * - Batch operations with automatic pagination
 * - Performance metrics and logging
 */

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { captureError } from "@/lib/error-tracking";

/**
 * Cache tags for coordinated invalidation
 * Use these tags in revalidatePath/revalidateTag calls to expire multiple related queries
 */
export const CACHE_TAGS = {
  // Sport data
  "sport-football": "sport:football",
  "sport-basketball": "sport:basketball",
  "sport-baseball": "sport:baseball",
  "sport-soccer": "sport:soccer",
  "sport-lacrosse": "sport:lacrosse",
  "sport-track": "sport:track",
  "sport-wrestling": "sport:wrestling",

  // Entity types
  "entities-schools": "entity:schools",
  "entities-players": "entity:players",
  "entities-coaches": "entity:coaches",
  "entities-teams": "entity:teams",
  "entities-championships": "entity:championships",
  "entities-awards": "entity:awards",

  // Collections
  "leaderboards-all": "collection:leaderboards",
  "records-all": "collection:records",
  "games-all": "collection:games",
  "articles-all": "collection:articles",

  // Frequency-based
  "live-scores": "live:scores", // Revalidate more frequently
  "current-season": "live:season",
  "this-week": "live:week",

  // General
  "all-data": "data:all", // Invalidates everything
  "site-wide": "site:wide",
} as const;

/**
 * Configuration for cache revalidation
 * Shorter TTLs for live data, longer for historical data
 */
export const CACHE_CONFIG = {
  SHORT: 60, // 1 minute - for live scores, current standings
  MEDIUM: 300, // 5 minutes - for weekly data
  LONG: 3600, // 1 hour - for historical data
  EXTENDED: 86400, // 24 hours - for archives
  NEVER: false, // No automatic revalidation
} as const;

/**
 * Individual fetch task for parallel operations
 */
interface FetchTaskV2<T> {
  name: string;
  fn: () => Promise<T>;
  fallback: T;
  timeout?: number; // ms, default 30000
}

/**
 * Batch fetch configuration
 */
interface BatchFetchConfig {
  batchSize: number;
  maxParallel?: number;
  timeout?: number;
}

/**
 * Performance metrics from batch operations
 */
interface PerformanceMetrics {
  totalTime: number;
  operationTime: number;
  items: {
    operation: string;
    duration: number;
    status: "success" | "error" | "timeout";
  }[];
}

/**
 * Executes multiple fetch operations in parallel with individual error handling
 * One failure doesn't block others
 *
 * @param tasks - Array of fetch tasks to execute in parallel
 * @param context - Optional context for error tracking
 * @returns Promise resolving to object with task results
 *
 * @example
 * ```typescript
 * const results = await batchFetch([
 *   { name: "schools", fn: () => getSchools(), fallback: [] },
 *   { name: "players", fn: () => getPlayers(), fallback: [] },
 *   { name: "stats", fn: () => getStats(), fallback: null },
 * ]);
 * ```
 */
export async function batchFetch<T extends Record<string, unknown>>(
  tasks: FetchTaskV2<unknown>[],
  context?: Record<string, string | number>
): Promise<T> {
  const startTime = Date.now();
  const metrics = {
    items: [] as PerformanceMetrics["items"],
  };

  const timeoutPromise = <U,>(
    promise: Promise<U>,
    ms: number,
    taskName: string
  ): Promise<U> =>
    Promise.race([
      promise,
      new Promise<U>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Task ${taskName} timed out after ${ms}ms`)),
          ms
        )
      ),
    ]);

  const results = await Promise.allSettled(
    tasks.map((task) => {
      const taskStart = Date.now();
      const timeout = task.timeout || 30000;

      return timeoutPromise(task.fn(), timeout, task.name)
        .then((result) => {
          metrics.items.push({
            operation: task.name,
            duration: Date.now() - taskStart,
            status: "success",
          });
          return { success: true, value: result, task };
        })
        .catch((error) => {
          metrics.items.push({
            operation: task.name,
            duration: Date.now() - taskStart,
            status: "error",
          });
          return { success: false, error, task };
        });
    })
  );

  const output: Record<string, unknown> = {};

  results.forEach((result, idx) => {
    const task = tasks[idx];

    if (result.status === "fulfilled") {
      const val = result.value as Record<string, unknown>;
      if (val.success) {
        output[task.name] = val.value;
      } else {
        const errorMsg =
          val.error instanceof Error
            ? val.error.message
            : String(val.error);
        console.error(`[PSP] Batch fetch failed for ${task.name}:`, errorMsg);
        captureError(val.error, {
          ...context,
          operation: task.name,
          type: "batch_fetch",
        });
        output[task.name] = task.fallback;
      }
    } else {
      const errorMsg =
        result.reason instanceof Error
          ? result.reason.message
          : String(result.reason);
      console.error(`[PSP] Batch fetch error for ${task.name}:`, errorMsg);
      captureError(result.reason, {
        ...context,
        operation: task.name,
        type: "batch_fetch",
      });
      output[task.name] = task.fallback;
    }
  });

  // Log performance metrics in development
  if (process.env.NODE_ENV === "development") {
    const totalTime = Date.now() - startTime;
    console.log(`[PSP] Batch fetch completed in ${totalTime}ms`, {
      tasks: tasks.length,
      metrics: metrics.items,
    });
  }

  return output as T;
}

/**
 * Wraps a query function with Next.js server-side caching
 * Automatically caches results with optional revalidation tags
 *
 * @param fn - The async function to cache
 * @param tags - Cache invalidation tags for this query
 * @param revalidate - Revalidation time in seconds (or use CACHE_CONFIG)
 * @returns Cached version of the function
 *
 * @example
 * ```typescript
 * const cachedGetSchools = withCache(
 *   () => supabase.from("schools").select("*"),
 *   [CACHE_TAGS["entities-schools"], CACHE_TAGS["sport-football"]],
 *   CACHE_CONFIG.LONG
 * );
 * ```
 */
export function withCache<T>(
  fn: () => Promise<T>,
  tags: string[],
  revalidate: number | boolean = CACHE_CONFIG.LONG
) {
  // Use Next.js unstable_cache for server-side caching with tags
  const cached = unstable_cache(fn, tags as [string, ...string[]]);

  return cached;
}

/**
 * Wrapper for withCache that uses React's cache (request-level)
 * Deduplicates identical requests within a single render
 *
 * @param fn - The async function to cache
 * @returns Request-cached version of the function
 */
export function withRequestCache<T>(fn: () => Promise<T>) {
  return cache(fn);
}

/**
 * Generic function to fetch paginated data in batches
 * Automatically handles pagination and batching
 *
 * @param fetchFn - Function that accepts (offset, limit) and returns { data: T[], total: number }
 * @param config - Batch configuration
 * @param context - Optional error tracking context
 * @returns All items across all pages
 *
 * @example
 * ```typescript
 * const allPlayers = await batchFetchPages(
 *   (offset, limit) => getPlayersPaginated(offset, limit),
 *   { batchSize: 100, maxParallel: 3 }
 * );
 * ```
 */
export async function batchFetchPages<T>(
  fetchFn: (offset: number, limit: number) => Promise<{ data: T[]; total: number }>,
  config: BatchFetchConfig,
  context?: Record<string, string | number>
): Promise<T[]> {
  const { batchSize, maxParallel = 3 } = config;
  const results: T[] = [];

  try {
    // Fetch first page to get total count
    const firstPage = await fetchFn(0, batchSize);
    results.push(...firstPage.data);

    const totalPages = Math.ceil(firstPage.total / batchSize);

    if (totalPages === 1) {
      return results;
    }

    // Fetch remaining pages with controlled parallelism
    const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 1);
    let pageIndex = 0;

    while (pageIndex < remainingPages.length) {
      const batch = remainingPages.slice(pageIndex, pageIndex + maxParallel);
      const pageFetches = batch.map((pageNum) =>
        fetchFn((pageNum - 1) * batchSize, batchSize)
          .then((page) => page.data)
          .catch((error) => {
            captureError(error, {
              ...context,
              page: String(pageNum),
              type: "batch_fetch_page",
            });
            return [];
          })
      );

      const pageResults = await Promise.all(pageFetches);
      pageResults.forEach((items) => results.push(...items));
      pageIndex += maxParallel;
    }

    return results;
  } catch (error) {
    captureError(error, {
      ...context,
      type: "batch_fetch_pages_init",
    });
    throw error;
  }
}

/**
 * Fetch all data for a page using optimized parallel queries
 * Coordinates multiple related data fetches
 *
 * @param queries - Object mapping query names to fetch functions
 * @param options - Configuration including cache tags and timeouts
 * @returns Object with all fetched data
 *
 * @example
 * ```typescript
 * const pageData = await parallelFetchPage({
 *   school: () => getSchoolBySlug(slug),
 *   seasons: () => getTeamSeasons(schoolId, sport),
 *   championships: () => getChampionships(schoolId, sport),
 *   recentGames: () => getRecentGames(schoolId, sport, 10),
 * }, {
 *   tags: [CACHE_TAGS["entities-schools"], CACHE_TAGS["sport-football"]],
 * });
 * ```
 */
export async function parallelFetchPage<T extends Record<string, unknown>>(
  queries: Record<keyof T, () => Promise<unknown>>,
  options?: {
    tags?: string[];
    revalidate?: number | boolean;
    timeout?: number;
    context?: Record<string, string | number>;
  }
): Promise<T> {
  const { timeout = 30000, context = {} } = options || {};

  const tasks = Object.entries(queries).map(([name, fn]) => ({
    name,
    fn,
    fallback: null,
    timeout,
  }));

  return batchFetch<T>(tasks, context);
}

/**
 * Utility to create a cached data fetcher with automatic revalidation
 *
 * @param fn - The async function to wrap
 * @param cacheKey - Unique key for this query
 * @param config - Cache configuration
 * @returns Wrapped function with caching
 */
export function createCachedDataFetcher<T>(
  fn: () => Promise<T>,
  cacheKey: string,
  config?: {
    revalidate?: number | false;
    tags?: string[];
  }
) {
  const { revalidate = CACHE_CONFIG.LONG, tags = [cacheKey] } = config || {};

  return unstable_cache(fn, tags as [string, ...string[]], {
    revalidate: typeof revalidate === 'number' ? revalidate : false,
    tags,
  });
}

/**
 * Helper to measure query performance
 * Wraps a fetch operation and logs timing
 */
export async function measureFetch<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === "development") {
    console.log(`[PSP Performance] ${name}: ${duration}ms`);
  }

  return { result, duration };
}
