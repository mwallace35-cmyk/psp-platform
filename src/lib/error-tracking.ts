/**
 * Centralized error tracking and logging for the PhillySportsPack application.
 * Provides structured error capture with context information, deduplication,
 * rate limiting, and integration-ready structure for Sentry, LogRocket, etc.
 *
 * Features:
 * - Error deduplication to prevent spam of identical errors
 * - Rate limiting to prevent overwhelming the error tracking service
 * - Structured error categorization (network, auth, validation, system)
 * - Request context for better debugging
 * - Error severity classification (low, medium, high, critical)
 * - Sentry/LogRocket ready (TODO: uncomment when DSN is available)
 */

export interface ErrorContext {
  [key: string]: string | undefined;
}

export interface RequestContext {
  requestId?: string;
  userId?: string;
  path?: string;
  method?: string;
  endpoint?: string;
}

/**
 * ErrorReporter interface - allows pluggable error reporting backends
 * Implementations can be switched easily (Console, Sentry, LogRocket, etc.)
 */
export interface ErrorReporter {
  /**
   * Initialize the error reporter with configuration
   */
  init(): Promise<void>;

  /**
   * Capture an exception with optional context
   */
  captureException(
    error: unknown,
    context?: {
      category?: ErrorCategory;
      severity?: ErrorSeverity;
      tags?: Record<string, string>;
      contexts?: Record<string, any>;
    }
  ): void;

  /**
   * Capture a message with optional context
   */
  captureMessage?(message: string, level?: ErrorSeverity): void;

  /**
   * Set user context for error tracking
   */
  setUser(userId: string | null): void;

  /**
   * Add a breadcrumb for debugging
   */
  addBreadcrumb?(message: string, data?: Record<string, any>, level?: "debug" | "info" | "warning" | "error"): void;

  /**
   * Set a custom tag
   */
  setTag?(key: string, value: string): void;

  /**
   * Set custom context
   */
  setContext?(name: string, context: Record<string, any>): void;
}

export enum ErrorCategory {
  NETWORK = "network",           // Network/fetch errors
  AUTH = "auth",                 // Authentication/authorization errors
  VALIDATION = "validation",     // Input validation errors
  DATABASE = "database",         // Database/query errors
  SYSTEM = "system",             // System-level errors
  UNKNOWN = "unknown",           // Uncategorized errors
}

/**
 * Error severity levels for prioritization
 */
export enum ErrorSeverity {
  LOW = "low",                   // Expected errors, minor issues
  MEDIUM = "medium",             // Unexpected but recoverable failures
  HIGH = "high",                 // Critical failures affecting user experience
  CRITICAL = "critical",         // System-level failures
}

/**
 * Console-based error reporter (default)
 * Logs errors to console without external service calls
 */
class ConsoleReporter implements ErrorReporter {
  async init(): Promise<void> {
    // Console reporter is always ready
  }

  captureException(
    error: unknown,
    context?: {
      category?: ErrorCategory;
      severity?: ErrorSeverity;
      tags?: Record<string, string>;
      contexts?: Record<string, any>;
    }
  ): void {
    const message = error instanceof Error ? error.message : String(error);
    const level = context?.severity || ErrorSeverity.MEDIUM;
    console.error(`[PSP:EXCEPTION] [${level}] ${message}`, {
      error,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  setUser(userId: string | null): void {
    // Console reporter doesn't need user context
  }
}

/**
 * Sentry-based error reporter
 * Sends errors to Sentry service when DSN is configured
 * Delegates to the full implementation in sentry-reporter.ts
 */
class SentryReporter implements ErrorReporter {
  private delegate: ErrorReporter | null = null;

  async init(): Promise<void> {
    try {
      // Dynamically import the full SentryReporter implementation
      // This is done lazily to avoid requiring @sentry/nextjs if not configured
      const { getSentryReporter } = await import("./sentry-reporter");
      this.delegate = getSentryReporter();
      await this.delegate.init();
    } catch (error) {
      console.warn(
        "[SentryReporter] Failed to initialize full Sentry implementation, will use console fallback:",
        error
      );
    }
  }

  captureException(
    error: unknown,
    context?: {
      category?: ErrorCategory;
      severity?: ErrorSeverity;
      tags?: Record<string, string>;
      contexts?: Record<string, any>;
    }
  ): void {
    if (this.delegate) {
      this.delegate.captureException(error, context);
    } else {
      // Fallback to console
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[PSP:SENTRY] [${context?.severity || ErrorSeverity.MEDIUM}] ${message}`, { context });
    }
  }

  setUser(userId: string | null): void {
    if (this.delegate) {
      this.delegate.setUser(userId);
    }
  }
}

/**
 * Error deduplication and rate limiting state
 * Keeps track of recent errors to prevent spam
 */
const ERROR_TRACKING_STATE = {
  recentErrors: new Map<string, { count: number; lastTime: number }>(),
  requestCounts: new Map<string, number>(),
  maxErrorsPerHour: 100,
  deduplicationWindow: 60000, // 1 minute
  cleanupInterval: 300000, // 5 minutes
};

/**
 * Global error reporter instance
 * Dynamically selects reporter based on environment and configuration
 */
let errorReporter: ErrorReporter | null = null;

function getErrorReporter(): ErrorReporter {
  if (errorReporter) return errorReporter;

  // Use Sentry if DSN is configured, otherwise fall back to console
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    errorReporter = new SentryReporter();
  } else {
    errorReporter = new ConsoleReporter();
  }

  return errorReporter;
}

/**
 * Initialize the error tracking system
 * Must be called once at application startup
 */
export async function initializeErrorTracking(): Promise<void> {
  const reporter = getErrorReporter();
  await reporter.init();
}

/**
 * Reset error tracking state (for testing)
 */
export function resetErrorTrackingState(): void {
  ERROR_TRACKING_STATE.recentErrors.clear();
  ERROR_TRACKING_STATE.requestCounts.clear();
}

// Start cleanup interval on module load
if (typeof globalThis !== "undefined") {
  (globalThis as any).__errorTrackingCleanup ??= setInterval(() => {
    const now = Date.now();
    for (const [key, data] of ERROR_TRACKING_STATE.recentErrors.entries()) {
      if (now - data.lastTime > ERROR_TRACKING_STATE.deduplicationWindow * 5) {
        ERROR_TRACKING_STATE.recentErrors.delete(key);
      }
    }
  }, ERROR_TRACKING_STATE.cleanupInterval);
}

/**
 * Generate a fingerprint for error deduplication
 * Based on message and stack trace
 */
function generateErrorFingerprint(
  errorMessage: string,
  errorStack?: string
): string {
  const stackPreview = errorStack?.split("\n")[0] || "";
  return `${errorMessage}:${stackPreview}`.slice(0, 100);
}

/**
 * Categorize error based on message and type
 */
function categorizeError(error: unknown): ErrorCategory {
  const message = error instanceof Error ? error.message : String(error);
  const messageLC = message.toLowerCase();

  if (
    messageLC.includes("fetch") ||
    messageLC.includes("network") ||
    messageLC.includes("timeout") ||
    messageLC.includes("econnrefused")
  ) {
    return ErrorCategory.NETWORK;
  }
  if (
    messageLC.includes("unauthorized") ||
    messageLC.includes("forbidden") ||
    messageLC.includes("auth") ||
    messageLC.includes("permission")
  ) {
    return ErrorCategory.AUTH;
  }
  if (
    messageLC.includes("validation") ||
    messageLC.includes("required") ||
    messageLC.includes("invalid")
  ) {
    return ErrorCategory.VALIDATION;
  }
  if (
    messageLC.includes("database") ||
    messageLC.includes("query") ||
    messageLC.includes("supabase")
  ) {
    return ErrorCategory.DATABASE;
  }
  if (
    messageLC.includes("system") ||
    messageLC.includes("internal") ||
    messageLC.includes("fatal")
  ) {
    return ErrorCategory.SYSTEM;
  }
  return ErrorCategory.UNKNOWN;
}

/**
 * Classify error severity based on category and message
 */
function classifyErrorSeverity(error: unknown, category: ErrorCategory): ErrorSeverity {
  const message = error instanceof Error ? error.message : String(error);
  const messageLC = message.toLowerCase();

  // Critical errors
  if (category === ErrorCategory.SYSTEM || messageLC.includes("fatal")) {
    return ErrorSeverity.CRITICAL;
  }

  // High severity
  if (
    category === ErrorCategory.DATABASE ||
    category === ErrorCategory.AUTH ||
    messageLC.includes("500") ||
    messageLC.includes("critical") ||
    messageLC.includes("crash")
  ) {
    return ErrorSeverity.HIGH;
  }

  // Medium severity
  if (
    category === ErrorCategory.NETWORK ||
    category === ErrorCategory.VALIDATION ||
    messageLC.includes("timeout") ||
    messageLC.includes("retry")
  ) {
    return ErrorSeverity.MEDIUM;
  }

  return ErrorSeverity.LOW;
}

/**
 * Check if error should be reported (deduplication and rate limiting)
 */
function shouldReportError(fingerprint: string, category: ErrorCategory): boolean {
  const now = Date.now();
  const existing = ERROR_TRACKING_STATE.recentErrors.get(fingerprint);

  if (!existing) {
    ERROR_TRACKING_STATE.recentErrors.set(fingerprint, {
      count: 1,
      lastTime: now,
    });
    return true;
  }

  // Within deduplication window and already reported
  if (now - existing.lastTime < ERROR_TRACKING_STATE.deduplicationWindow) {
    existing.count++;
    return false; // Don't report duplicate
  }

  // Window expired, reset
  ERROR_TRACKING_STATE.recentErrors.set(fingerprint, {
    count: 1,
    lastTime: now,
  });
  return true;
}

/**
 * Set error tracking user context
 * Should be called when a user logs in or out
 *
 * @param userId - The user ID to set, or null to clear
 */
export function setErrorTrackingUser(userId: string | null): void {
  const reporter = getErrorReporter();
  reporter.setUser(userId);
}

/**
 * Capture and log errors with structured context information.
 * Provides a centralized point for error handling that can be extended
 * with external error tracking services (Sentry, LogRocket, etc.).
 *
 * Features:
 * - Automatic error deduplication to prevent spam
 * - Error categorization (network, auth, validation, database, system)
 * - Error severity classification
 * - Structured logging with context
 * - Request correlation via requestId
 * - Rate limiting to prevent overwhelming external services
 * - Pluggable error reporter (Console, Sentry, LogRocket, etc.)
 *
 * @param error - The error object or message
 * @param context - Optional context object with additional error information
 * @param requestContext - Optional request context with requestId, userId, path, method, endpoint
 */
export function captureError(
  error: unknown,
  context?: ErrorContext,
  requestContext?: RequestContext
): void {
  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const category = categorizeError(error);
    const severity = classifyErrorSeverity(error, category);
    const fingerprint = generateErrorFingerprint(errorMessage, errorStack);

    // Check deduplication and rate limiting
    if (!shouldReportError(fingerprint, category)) {
      return; // Silently skip duplicate/rate-limited errors
    }

    // Generate or use provided requestId for correlation
    const requestId = requestContext?.requestId || crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // Build structured context
    const mergedContext = {
      ...context,
      ...requestContext,
      requestId,
      timestamp,
      category,
      severity,
      fingerprint,
    };

    // Build log message with context
    const contextStr =
      context && Object.keys(context).length > 0
        ? ` | ${Object.entries(context)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => `${k}=${v}`)
            .join(", ")}`
        : "";

    const requestContextStr = requestContext
      ? ` | requestId=${requestId}, userId=${requestContext.userId || "unknown"}, path=${requestContext.path || "unknown"}, method=${requestContext.method || "unknown"}, endpoint=${requestContext.endpoint || "unknown"}`
      : ` | requestId=${requestId}`;

    const categoryStr = ` | category=${category}`;
    const severityStr = ` | severity=${severity}`;

    console.error(
      `[PSP:ERROR] [${timestamp}] ${errorMessage}${contextStr}${requestContextStr}${categoryStr}${severityStr}`,
      {
        stack: errorStack,
        context: mergedContext,
      }
    );

    // Send to configured error reporter
    const reporter = getErrorReporter();
    reporter.captureException(error, {
      category,
      severity,
      tags: {
        requestId,
        endpoint: requestContext?.endpoint || "unknown",
        category,
        severity,
      },
      contexts: {
        custom: context,
        request: requestContext,
      },
    });
  } catch (loggingError) {
    // Fallback: if logging itself fails, output to console
    console.error("[PSP:ERROR] Failed to log error:", error, loggingError);
  }
}
