/**
 * Next.js instrumentation hook for server-side initialization
 * This file is called by Next.js during server startup to initialize services like Sentry
 * It runs once per server process, making it ideal for setting up error tracking
 *
 * See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only initialize Sentry on the server side
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      // Check if Sentry DSN is configured
      const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

      if (!sentryDsn) {
        console.log("[Instrumentation] Sentry DSN not configured, skipping server-side initialization");
        return;
      }

      // Import and initialize Sentry
      const Sentry = await import(/* webpackIgnore: true */ "@sentry/nextjs");

      // Get the environment from NODE_ENV
      const environment = process.env.NODE_ENV || "development";

      // Check if session replay is enabled
      const sessionReplayEnabled = process.env.NEXT_PUBLIC_FEATURE_SESSION_REPLAY === "true" ||
                                  process.env.NEXT_PUBLIC_FEATURE_SESSION_REPLAY === "1";

      // Build integrations array
      const integrations = [
        Sentry.prismaIntegration && Sentry.prismaIntegration(),
        Sentry.nextjsIntegration && Sentry.nextjsIntegration({
          serverComponentStackTrace: environment === "development",
        }),
      ].filter(Boolean);

      // Add session replay integration if enabled
      if (sessionReplayEnabled) {
        // Session replay integration for debugging error sessions
        const replayIntegration = Sentry.replayIntegration && Sentry.replayIntegration({
          // Only capture replays for sampled error events
          maskAllText: true,        // Privacy: mask all text content
          blockAllMedia: true,      // Privacy: block media loading
        });

        if (replayIntegration) {
          integrations.push(replayIntegration);
        }
      }

      // Initialize Sentry with comprehensive configuration
      Sentry.init({
        // Use either NEXT_PUBLIC_SENTRY_DSN or SENTRY_DSN
        dsn: sentryDsn,

        // Environment configuration
        environment,
        release: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",

        // Sample rates for transactions and error events
        // Lower rates in production to reduce costs
        tracesSampleRate: environment === "production" ? 0.1 : 0.5,
        sampleRate: environment === "production" ? 0.5 : 1.0,

        // Session replay sample rates (only if enabled)
        // 10% for general sessions, 100% for error sessions
        replaysSessionSampleRate: sessionReplayEnabled ? 0.1 : 0,
        replaysOnErrorSampleRate: sessionReplayEnabled ? 1.0 : 0,

        // Sentry server transport options
        transportOptions: {
          // Timeout for sending events (in milliseconds)
          timeout: 5000,
        },

        // Filter out certain errors that we don't want to track
        beforeSend(event: any, hint: any) {
          // Ignore network errors from client-side navigation
          if (event.exception) {
            const error = hint.originalException;
            if (error instanceof Error) {
              // Ignore common browser extension errors
              if (
                error.message.includes("chrome-extension") ||
                error.message.includes("moz-extension")
              ) {
                return null;
              }
            }
          }
          return event;
        },

        // Ignore specific URLs/errors to reduce noise
        ignoreErrors: [
          // Browser extensions
          /chrome-extension:/i,
          /moz-extension:/i,
          // Common third-party errors
          /ResizeObserver loop/i,
          // Network errors
          /NetworkError/i,
        ],

        // Enable automatic instrumentation
        autoSessionTracking: true,
        attachStacktrace: true,

        // Breadcrumb configuration
        maxBreadcrumbs: 100,

        // Performance monitoring and session replay
        integrations,
      });

      console.log(
        `[Instrumentation] Sentry server-side initialized (${environment})${
          sessionReplayEnabled ? " with session replay enabled" : ""
        }`
      );
    } catch (error) {
      console.error("[Instrumentation] Failed to initialize Sentry:", error);
      // Don't throw - we want the app to continue even if Sentry fails to initialize
    }
  }
}
