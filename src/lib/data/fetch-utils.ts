/**
 * Data fetching utilities for safely handling multiple concurrent fetch operations
 * Provides a reusable pattern for Promise.allSettled + error handling
 */

import { captureError } from "@/lib/error-tracking";

/**
 * Task configuration for a single data fetching operation
 */
export interface FetchTask<T> {
  /** Identifier for the task (used in logging and error context) */
  name: string;
  /** The async function that fetches the data */
  fn: () => Promise<T>;
  /** Fallback value if the fetch fails */
  fallback: T;
}

/**
 * Executes multiple fetch tasks in parallel and returns an object with results
 * If a task fails, it logs the error, captures it, and uses the fallback value
 * This pattern prevents one failed request from crashing the entire page
 *
 * @param tasks - Array of fetch tasks to execute
 * @param context - Optional context object to include in error tracking (e.g., { sport: "football" })
 * @returns Object with task names as keys and either fulfilled values or fallbacks as values
 *
 * @example
 * ```typescript
 * const data = await fetchAllWithFallback(
 *   [
 *     { name: "overview", fn: () => getSportOverview(sport), fallback: defaultOverview },
 *     { name: "champions", fn: () => getRecentChampions(sport), fallback: [] },
 *   ],
 *   { sport }
 * );
 *
 * const { overview, champions } = data as {
 *   overview: typeof defaultOverview;
 *   champions: typeof defaultChampions;
 * };
 * ```
 */
export async function fetchAllWithFallback<T extends Record<string, unknown>>(
  tasks: FetchTask<unknown>[],
  context?: Record<string, string>
): Promise<T> {
  const results = await Promise.allSettled(tasks.map((t) => t.fn()));
  const output: Record<string, unknown> = {};

  results.forEach((result, idx) => {
    const task = tasks[idx];
    if (result.status === "fulfilled") {
      output[task.name] = result.value;
    } else {
      const errorMsg =
        result.reason instanceof Error
          ? result.reason.message
          : String(result.reason);
      console.error(`[PSP] Failed to fetch ${task.name}:`, errorMsg);
      captureError(result.reason, { ...context, fetch: task.name });
      output[task.name] = task.fallback;
    }
  });

  return output as T;
}
