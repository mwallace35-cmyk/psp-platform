/**
 * Sentry client-side configuration
 * Initializes Sentry for browser error tracking and session replay
 * This is a separate config file to allow for client-specific settings
 *
 * Usage in sentry.instrumentation.client.ts or next.config.ts
 */

// Detect environment
const environment = process.env.NODE_ENV || "development";
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize if DSN is present
if (dsn && typeof window !== "undefined") {
  // Dynamic import to avoid issues if Sentry is not installed
  import("@sentry/nextjs").then((Sentry) => {
    try {
      Sentry.init({
        // Sentry DSN (Data Source Name)
        dsn,

        // Environment
        environment,
        release: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",

        // Sample rates (percentage of events to send)
        // Lower in production to reduce costs
        tracesSampleRate: environment === "production" ? 0.1 : 0.5,
        sampleRate: environment === "production" ? 0.5 : 1.0,

        // Session replay settings
        replaysSessionSampleRate: environment === "production" ? 0.1 : 0.5,
        replaysOnErrorSampleRate: 1.0, // Always capture replays on errors

        // Performance monitoring
        autoSessionTracking: true,
        attachStacktrace: true,

        // Breadcrumb configuration
        maxBreadcrumbs: 50,

        // Filter out certain errors
        beforeSend(event, hint) {
          // Ignore network errors from extensions
          if (event.exception) {
            const error = hint.originalException;
            if (error instanceof Error) {
              if (
                error.message.includes("chrome-extension") ||
                error.message.includes("moz-extension") ||
                error.message.includes("top.GLOBALS")
              ) {
                return null;
              }
            }
          }

          // Ignore certain URL patterns
          if (event.request && event.request.url) {
            if (event.request.url.includes("chrome-extension://")) {
              return null;
            }
          }

          return event;
        },

        // List of errors/patterns to ignore
        ignoreErrors: [
          // Browser extensions
          /chrome-extension:/i,
          /moz-extension:/i,
          // ResizeObserver
          /ResizeObserver loop/i,
          // Network
          /NetworkError/i,
          /XHR failed loading/i,
          // Ad blockers and extensions
          /top\.GLOBALS/i,
          // Random plugin/extension errors
          /Can't find variable: ZiteReader/,
          /jigsaw is not defined/,
          /ComboSearch is not defined/,
          // ISP Optimization
          /bmi_SafeAddOnload/,
          /EBCallBackMessageReceived/,
          // See http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
          /SecurityError: Permission denied to access property "document"/,
          // Avast
          /top\.GLOBALS/,
        ],

        // Integrations to use
        integrations: [
          // Session replay integration
          new Sentry.Replay({
            maskAllText: true,
            blockAllMedia: true,
            maskAllInputs: true,
          }),
        ],

        // Debug mode (only in development)
        debug: environment === "development",

        // Custom client options
        dsn,
        allowUrls: [
          // Match your domain
          /https?:\/\/[^\n]*\.(localhost|127\.0\.0\.1|yourapp\.com)/,
        ],
      });

      console.log(`[Sentry Client] Initialized for ${environment}`);
    } catch (error) {
      console.error("[Sentry Client] Failed to initialize:", error);
    }
  });
}

export {};
