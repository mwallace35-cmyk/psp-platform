/**
 * Structured error handling for PhillySportsPack data layer.
 * Replaces silent catch blocks with categorized error reporting.
 */

import { captureError, ErrorContext, ErrorSeverity as TrackingSeverity } from "./error-tracking";
import { withRetry } from "./retry";

export enum ErrorSeverity {
  LOW = "low",        // Expected empty results, minor issues
  MEDIUM = "medium",  // Unexpected but recoverable failures
  HIGH = "high",      // Critical failures affecting user experience
  CRITICAL = "critical", // System-level failures
}

export interface AppError {
  code: string;
  message: string;
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Log structured errors. In production, this would send to Sentry/LogRocket.
 * For now, provides better console output than console.error alone.
 */
export function logError(
  code: string,
  message: string,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  context?: Record<string, unknown>
): void {
  // Create structured error object for potential external logging (Sentry, LogRocket, etc.)
  const appError: AppError = {
    code,
    message,
    severity,
    context,
    timestamp: new Date().toISOString(),
  };

  // Build context for captureError
  const errorContext: ErrorContext = {
    code,
    severity: severity.toUpperCase(),
    ...Object.entries(context ?? {}).reduce((acc, [k, v]) => {
      acc[k] = typeof v === "string" ? v : JSON.stringify(v);
      return acc;
    }, {} as ErrorContext),
  };

  // Use centralized error tracking
  captureError(message, errorContext);

  // TODO: Send to external error tracking service (Sentry, LogRocket, etc.)
  // if (process.env.SENTRY_DSN) { Sentry.captureException(appError); }
}

/**
 * Wrapper for data fetching functions that provides structured error handling.
 * Returns fallback data if fetch fails.
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  fallback: T,
  errorCode: string,
  context?: Record<string, unknown>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logError(errorCode, message, ErrorSeverity.MEDIUM, {
      ...context,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return fallback;
  }
}

/**
 * Wrapper for data fetching with retry logic and error handling.
 * Combines withRetry and withErrorHandling for critical data.
 */
export async function withRetryAndErrorHandling<T>(
  fn: () => Promise<T>,
  fallback: T,
  errorCode: string,
  context?: Record<string, unknown>,
  maxRetries: number = 3
): Promise<T> {
  try {
    return await withRetry(
      fn,
      { maxRetries, baseDelay: 1000, maxDelay: 10000 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logError(errorCode, message, ErrorSeverity.MEDIUM, {
      ...context,
      retries: maxRetries,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return fallback;
  }
}

/**
 * Helper to safely handle Promise.allSettled results
 * Returns successful results and logs failures
 */
export function handleSettledResults<T>(
  results: PromiseSettledResult<T>[],
  errorCode: string,
  context?: Record<string, unknown>
): T[] {
  const values: T[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      values.push(result.value);
    } else {
      // Log rejected promises
      logError(
        errorCode,
        result.reason instanceof Error ? result.reason.message : String(result.reason),
        ErrorSeverity.MEDIUM,
        {
          ...context,
          rejectionReason: String(result.reason),
        }
      );
    }
  }

  return values;
}
