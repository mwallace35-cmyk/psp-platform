# Sentry Integration Guide

This document describes the complete Sentry error tracking integration for the PhillySportsPack Next.js application.

## Overview

The application has a pluggable error tracking system that automatically detects and uses Sentry when a DSN is configured. If Sentry is not configured, errors are logged to the console (default behavior).

**Key Features:**
- Auto-detection of Sentry DSN from environment variables
- Server-side and client-side error tracking
- Structured error categorization and severity classification
- Request correlation via x-request-id header
- Session replay for error investigation
- Breadcrumb tracking for debugging
- User context management
- Environment-aware configuration

## Installation

### 1. Install Sentry SDK

```bash
npm install @sentry/nextjs @sentry/replay
```

The `@sentry/replay` package is optional but recommended for enhanced error investigation with session replay.

### 2. Configure Environment Variables

Add the Sentry DSN to your environment configuration:

```env
# .env.local or .env.production (as needed)
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
NEXT_PUBLIC_APP_VERSION=1.0.0
```

The `NEXT_PUBLIC_` prefix makes the DSN available to both server and client code.

### 3. Next.js Configuration Updates

The integration uses Next.js instrumentation (registered automatically via `src/instrumentation.ts`) to initialize Sentry on the server side.

For client-side initialization, import the Sentry config in your layout or root component:

**In `src/app/layout.tsx` (or your root layout):**

```typescript
import "@/sentry.client.config";
// ... rest of your layout
```

This ensures Sentry is initialized before any client-side errors occur.

## Architecture

### File Structure

```
src/
  lib/
    error-tracking.ts          # Main error tracking interface and console reporter
    sentry-reporter.ts         # Full Sentry implementation (NEW)
  instrumentation.ts            # Server-side initialization hook (NEW)
  app/
    global-error.tsx           # Global error boundary (UPDATED)
    api/
      sentry-example-api/
        route.ts               # Test endpoint for Sentry (NEW)

sentry.client.config.ts         # Client-side configuration (NEW)
```

### Component Responsibilities

#### `src/lib/error-tracking.ts` (Updated)
- Defines the `ErrorReporter` interface
- Implements `ConsoleReporter` (default fallback)
- Implements a lightweight `SentryReporter` wrapper
- Manages error deduplication and rate limiting
- Auto-detects Sentry DSN and switches reporters

#### `src/lib/sentry-reporter.ts` (New)
- Full Sentry implementation with all features
- Maps error categories to Sentry levels
- Handles both server and client environments
- Provides helper methods: `addBreadcrumb`, `setTag`, `setContext`
- Gracefully handles missing @sentry/nextjs package

#### `src/instrumentation.ts` (New)
- Next.js instrumentation hook for server startup
- Initializes Sentry on the Node.js runtime
- Configures sample rates and environment settings
- Sets up error filtering to reduce noise

#### `sentry.client.config.ts` (New)
- Client-side Sentry configuration
- Enables session replay integration
- Configures sample rates for browser errors
- Handles browser extension and cross-origin errors

#### `src/app/api/sentry-example-api/route.ts` (New)
- Test endpoint for validating Sentry integration
- Demonstrates error capture patterns
- Supports different error types for testing

## Error Categorization

Errors are automatically categorized for better organization:

| Category | Examples |
|----------|----------|
| **NETWORK** | Fetch errors, timeouts, connection failures |
| **AUTH** | Unauthorized, forbidden, permission errors |
| **VALIDATION** | Input validation, required field errors |
| **DATABASE** | Query errors, Supabase failures |
| **SYSTEM** | Fatal errors, system-level failures |
| **UNKNOWN** | Uncategorized errors |

## Error Severity Levels

Errors are classified by severity for proper alerting:

| Severity | Maps to Sentry | Use Cases |
|----------|---|---|
| **LOW** | info | Expected errors, minor issues |
| **MEDIUM** | warning | Unexpected but recoverable failures |
| **HIGH** | error | Critical failures affecting UX |
| **CRITICAL** | fatal | System-level failures, crashes |

## Usage

### Basic Error Capture

```typescript
import { captureError } from "@/lib/error-tracking";

try {
  await fetchUserData();
} catch (error) {
  captureError(error, {
    endpoint: "/dashboard",
    attemptedAction: "fetch_user_data",
  });
}
```

### With Request Context

```typescript
captureError(error, {
  endpoint: "/api/users",
  action: "delete_user",
}, {
  requestId: "req-123",
  userId: "user-456",
  path: "/api/users",
  method: "DELETE",
  endpoint: "/api/users",
});
```

### Capture Messages

```typescript
import { captureError } from "@/lib/error-tracking";

const reporter = (global as any).__errorReporter;
if (reporter?.captureMessage) {
  reporter.captureMessage("Custom warning message", ErrorSeverity.MEDIUM);
}
```

### Setting User Context

```typescript
import { setErrorTrackingUser } from "@/lib/error-tracking";

// When user logs in
setErrorTrackingUser("user-123");

// When user logs out
setErrorTrackingUser(null);
```

### Advanced Sentry Features

Access the Sentry reporter directly for advanced features:

```typescript
import { getSentryReporter } from "@/lib/sentry-reporter";

const reporter = getSentryReporter();

// Add breadcrumb for debugging
reporter.addBreadcrumb("User action: clicked submit button", {
  button: "save_profile",
  formId: "profile_form",
});

// Set custom tags
reporter.setTag("feature_flag", "new_ui_v2");

// Set context data
reporter.setContext("payment_info", {
  method: "credit_card",
  last4: "4242",
});
```

## Testing the Integration

### 1. Test Endpoint

Use the provided test endpoint to verify Sentry integration:

```bash
# Test exception capture
curl "http://localhost:3000/api/sentry-example-api?type=exception"

# Test message capture
curl "http://localhost:3000/api/sentry-example-api?type=message"

# Test validation error
curl "http://localhost:3000/api/sentry-example-api?type=validation_error"

# Test with user context
curl "http://localhost:3000/api/sentry-example-api?type=exception&userId=test-user-123"
```

### 2. Client-Side Testing

In browser console:

```javascript
// Simulate an error
throw new Error("Test client-side error");

// Or use Sentry directly if available
if (window.Sentry) {
  window.Sentry.captureException(new Error("Test Sentry error"));
}
```

### 3. Verify in Sentry Dashboard

1. Log into your Sentry project dashboard
2. Check "Issues" tab for captured errors
3. Verify error categorization and severity levels
4. Check "Sessions" tab for replay data (if enabled)

## Environment Configuration

### Development

```env
NODE_ENV=development
NEXT_PUBLIC_SENTRY_DSN=https://your-dev-dsn@o0.ingest.sentry.io/0
```

Settings:
- 100% sample rate (all errors captured)
- 50% transaction sample rate
- Console debug logging enabled

### Staging

```env
NODE_ENV=staging
NEXT_PUBLIC_SENTRY_DSN=https://your-staging-dsn@o0.ingest.sentry.io/0
```

Settings:
- 100% error sample rate
- 50% transaction sample rate
- Debug logging disabled

### Production

```env
NODE_ENV=production
NEXT_PUBLIC_SENTRY_DSN=https://your-prod-dsn@o0.ingest.sentry.io/0
```

Settings:
- 50% error sample rate (to reduce costs)
- 10% transaction sample rate
- 10% session replay sample rate (100% for errors)
- Error filtering enabled

## Sample Rates

Sample rates control what percentage of errors and transactions are sent to Sentry:

| Environment | Errors | Transactions | Session Replay |
|---|---|---|---|
| Development | 100% | 50% | 50% (and 100% on error) |
| Staging | 100% | 50% | 50% (and 100% on error) |
| Production | 50% | 10% | 10% (and 100% on error) |

Adjust these in `src/instrumentation.ts` and `sentry.client.config.ts` based on your needs.

## Error Filtering

The integration includes filters to reduce noise from:

- Browser extension errors (chrome-extension://, moz-extension://)
- ResizeObserver loop errors
- Network errors from ad blockers
- Random plugin/extension failures

Configure additional filters in `src/instrumentation.ts` and `sentry.client.config.ts` if needed.

## Global Error Boundary

The application's global error boundary in `src/app/global-error.tsx` automatically captures errors:

```typescript
useEffect(() => {
  captureError(error, {
    digest: error.digest,
    component: "app/global-error.tsx",
    source: "global-error-boundary",
  });
}, [error]);
```

This ensures all unhandled errors are reported to Sentry.

## Request Correlation

Errors are correlated with requests using the `x-request-id` header:

1. Generated in `src/middleware.ts` for all requests
2. Passed through response headers and to Sentry as a tag
3. Available in error context for debugging

Use the request ID to correlate errors with server logs and client activity.

## Performance Monitoring

The integration includes transaction tracking for:

- API routes
- Page loads
- Database operations (with Prisma integration)
- Server components

Monitor performance in the Sentry dashboard under "Performance" tab.

## Session Replay

When enabled, Sentry captures:

- User interactions (clicks, scrolls, typing)
- Network requests
- Console logs and errors
- DOM mutations

Session replay is especially useful for reproducing errors in production.

**Privacy Note:** Session replay captures all DOM changes. Configure masking rules in `sentry.client.config.ts` to hide sensitive data:

```typescript
new Sentry.Replay({
  maskAllText: true,        // Mask all text content
  blockAllMedia: true,      // Block images and videos
  maskAllInputs: true,      // Mask form inputs
})
```

## Alerts and Notifications

Set up alerts in your Sentry project dashboard:

1. **New Issues Alert**: Notify when new error patterns are detected
2. **Error Rate Alert**: Notify if error rate exceeds threshold
3. **Critical Error Alert**: Immediate notification for CRITICAL severity errors

Configure in Sentry Project Settings → Alerts.

## Troubleshooting

### Errors Not Appearing in Sentry

1. **Check DSN Configuration**
   ```bash
   echo $NEXT_PUBLIC_SENTRY_DSN
   ```

2. **Verify Package Installation**
   ```bash
   npm list @sentry/nextjs
   ```

3. **Check Network Requests**
   - Open DevTools → Network tab
   - Look for requests to `*.ingest.sentry.io`
   - Check for 404 or 403 errors

4. **Enable Debug Logging**
   - Set debug: true in Sentry configuration
   - Check browser console for initialization messages

5. **Verify DSN is Public Key**
   - DSN should be like: `https://examplePublicKey@o0.ingest.sentry.io/0`
   - Not a secret key (which should never be used client-side)

### Sampling Too Aggressive

If errors are not being captured:

1. Check `tracesSampleRate` and `sampleRate` in configurations
2. Increase sample rates in development/staging
3. Remember: 50% means roughly half of errors are captured (random sampling)

### Too Many Errors from Extensions

1. Update `ignoreErrors` pattern in configurations
2. Use `beforeSend` hook to filter specific errors
3. Block specific domains with `allowUrls` in client config

### Session Replay Consuming Too Much Data

1. Reduce `replaysSessionSampleRate` in `sentry.client.config.ts`
2. Enable masking to reduce data size
3. Monitor project quota in Sentry dashboard

## Migration Path

If you were previously using a different error tracking service:

1. **Parallel Initialization**: Both services can run simultaneously
2. **Gradual Rollout**: Deploy with reduced sample rates first
3. **Monitoring**: Compare error counts and patterns
4. **Switchover**: When confident, disable old service
5. **Cleanup**: Remove old error tracking code

## Security Considerations

1. **DSN Management**
   - Use public keys only (NEXT_PUBLIC_SENTRY_DSN)
   - Never commit secret keys
   - Rotate DSNs if accidentally exposed

2. **Sensitive Data**
   - Configure masking for PII (credit cards, SSNs, etc.)
   - Review `beforeSend` hooks for data leakage
   - Audit breadcrumbs and context data

3. **Rate Limiting**
   - The integration includes built-in rate limiting
   - Adjust `maxErrorsPerHour` in `error-tracking.ts` if needed
   - Monitor Sentry quota usage

## Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry SDK Configuration](https://docs.sentry.io/platforms/javascript/configuration/options/)
- [Session Replay Documentation](https://docs.sentry.io/platforms/javascript/session-replay/)
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/performance/)

## Support

For issues or questions:

1. Check Sentry's status page
2. Review Sentry documentation
3. Check application logs in `/tmp` or CloudWatch
4. Contact your DevOps/Infrastructure team for DSN issues
