/**
 * Sentry-based error reporter implementation
 * Provides integration with Sentry for comprehensive error tracking and monitoring
 * Handles both server-side and client-side error reporting with proper environment setup
 */

import { ErrorReporter, ErrorCategory, ErrorSeverity } from "./error-tracking";

/**
 * Map our error severity levels to Sentry levels
 */
function mapSeverityToSentryLevel(severity: ErrorSeverity): "fatal" | "error" | "warning" | "info" {
  switch (severity) {
    case ErrorSeverity.CRITICAL:
      return "fatal";
    case ErrorSeverity.HIGH:
      return "error";
    case ErrorSeverity.MEDIUM:
      return "warning";
    case ErrorSeverity.LOW:
      return "info";
    default:
      return "error";
  }
}

/**
 * Map our error categories to Sentry tags
 */
function getCategoryTag(category: ErrorCategory): string {
  return `error_${category}`;
}

/**
 * Sentry error reporter for server and client-side error tracking
 */
export class SentryReporter implements ErrorReporter {
  private initialized = false;
  private sentryModule: any = null;

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Conditionally import Sentry based on environment
      if (typeof window !== "undefined") {
        // Client-side: Sentry should be initialized via sentry.client.config.ts
        // The module is injected by the Sentry SDK
        if ((window as any).Sentry) {
          this.sentryModule = (window as any).Sentry;
          this.initialized = true;
        }
      } else {
        // Server-side: Import the Sentry NextJS SDK
        try {
          // Use optional chaining and nullish coalescing for graceful degradation
          const sentryModule: any = await import(/* webpackIgnore: true */ "@sentry/nextjs").catch(() => null);
          if (sentryModule?.getClient) {
            this.sentryModule = sentryModule;
            this.initialized = true;
          }
        } catch (importError) {
          // Sentry not installed, fall back to console
          console.warn(
            "[SentryReporter] @sentry/nextjs not installed or initialization failed. Falling back to console."
          );
        }
      }
    } catch (error) {
      console.warn("[SentryReporter] Failed to initialize Sentry:", error);
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
    try {
      const severity = context?.severity || ErrorSeverity.MEDIUM;
      const category = context?.category || ErrorCategory.UNKNOWN;

      if (this.sentryModule && this.sentryModule.captureException) {
        // Use Sentry if available
        const sentryLevel = mapSeverityToSentryLevel(severity);
        const tags: Record<string, string> = {
          ...context?.tags,
          category: getCategoryTag(category),
          severity,
        };

        // Extract request ID from tags for correlation
        const requestId = context?.tags?.requestId || "unknown";
        tags.requestId = requestId;

        this.sentryModule.captureException(error, {
          level: sentryLevel,
          tags,
          contexts: {
            ...context?.contexts,
            error_context: {
              category,
              severity,
            },
          },
        });
      } else {
        // Fallback to console
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[Sentry] [${severity}] ${message}`, {
          category,
          tags: context?.tags,
          contexts: context?.contexts,
        });
      }
    } catch (captureError) {
      console.error("[SentryReporter] Failed to capture exception:", captureError);
    }
  }

  setUser(userId: string | null): void {
    try {
      if (this.sentryModule) {
        if (this.sentryModule.setUser) {
          // Client-side Sentry
          this.sentryModule.setUser(userId ? { id: userId } : null);
        } else if (this.sentryModule.getCurrentHub) {
          // Server-side Sentry
          const hub = this.sentryModule.getCurrentHub();
          if (hub && hub.setUser) {
            hub.setUser(userId ? { id: userId } : null);
          }
        }
      }
    } catch (error) {
      console.warn("[SentryReporter] Failed to set user context:", error);
    }
  }

  /**
   * Add a breadcrumb to Sentry for debugging
   */
  addBreadcrumb(
    message: string,
    data?: Record<string, any>,
    level: "debug" | "info" | "warning" | "error" = "info"
  ): void {
    try {
      if (this.sentryModule && this.sentryModule.addBreadcrumb) {
        this.sentryModule.addBreadcrumb({
          message,
          data,
          level,
          timestamp: Date.now() / 1000,
        });
      }
    } catch (error) {
      console.warn("[SentryReporter] Failed to add breadcrumb:", error);
    }
  }

  /**
   * Set custom tag in Sentry context
   */
  setTag(key: string, value: string): void {
    try {
      if (this.sentryModule && this.sentryModule.setTag) {
        this.sentryModule.setTag(key, value);
      }
    } catch (error) {
      console.warn("[SentryReporter] Failed to set tag:", error);
    }
  }

  /**
   * Set context data in Sentry
   */
  setContext(name: string, context: Record<string, any>): void {
    try {
      if (this.sentryModule && this.sentryModule.setContext) {
        this.sentryModule.setContext(name, context);
      }
    } catch (error) {
      console.warn("[SentryReporter] Failed to set context:", error);
    }
  }
}

/**
 * Export a singleton instance of the Sentry reporter
 */
let sentryReporterInstance: SentryReporter | null = null;

export function getSentryReporter(): SentryReporter {
  if (!sentryReporterInstance) {
    sentryReporterInstance = new SentryReporter();
  }
  return sentryReporterInstance;
}
