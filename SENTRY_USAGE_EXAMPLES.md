# Sentry Error Tracking - Usage Examples

This document provides practical examples of how to use the error tracking system in your application.

## Basic Error Capture

### Simple Error

```typescript
import { captureError } from "@/lib/error-tracking";

try {
  await fetchData();
} catch (error) {
  captureError(error);
}
```

### With Context

```typescript
import { captureError } from "@/lib/error-tracking";

try {
  const user = await getUser(userId);
} catch (error) {
  captureError(error, {
    userId,
    action: "fetch_user",
    endpoint: "/api/users/:id",
  });
}
```

## API Routes

### Basic API Error Handling

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { captureError } from "@/lib/error-tracking";

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || "unknown";

  try {
    const users = await db.user.findMany();
    return NextResponse.json({ users });
  } catch (error) {
    captureError(error, {
      endpoint: "/api/users",
      action: "list_users",
    }, {
      requestId,
      path: "/api/users",
      method: "GET",
      endpoint: "/api/users",
    });

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
```

### Database Errors

```typescript
// src/app/api/posts/[id]/route.ts
import { captureError, ErrorCategory, ErrorSeverity } from "@/lib/error-tracking";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = request.headers.get("x-request-id") || "unknown";
  const userId = request.headers.get("x-user-id") || "unknown";

  try {
    const post = await db.post.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, {
      postId: params.id,
      action: "delete_post",
    }, {
      requestId,
      userId,
      path: `/api/posts/${params.id}`,
      method: "DELETE",
      endpoint: "/api/posts/[id]",
    });

    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
```

## Server Components

### Async Server Component

```typescript
// src/components/UserProfile.tsx
import { captureError } from "@/lib/error-tracking";

async function UserProfile({ userId }: { userId: string }) {
  try {
    const user = await getUser(userId);
    return <div>{user.name}</div>;
  } catch (error) {
    captureError(error, {
      userId,
      component: "UserProfile",
      action: "render",
    });
    return <div>Error loading profile</div>;
  }
}
```

## Client Components

### Error Boundary with Sentry

```typescript
"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/error-tracking";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    captureError(error, {
      component: "CustomErrorBoundary",
      source: "error-boundary",
    });
  }, [error]);

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### User Actions with Error Handling

```typescript
"use client";

import { useState } from "react";
import { captureError } from "@/lib/error-tracking";

export function ProfileForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to update profile`);
      }

      // Success
      alert("Profile updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(message);

      captureError(error, {
        userId,
        action: "update_profile",
        formFields: ["name", "email"], // Don't log actual values
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* form fields */}
      <button disabled={loading}>{loading ? "Saving..." : "Save"}</button>
    </form>
  );
}
```

## User Context Management

### On Login

```typescript
// src/app/auth/login/route.ts
import { setErrorTrackingUser } from "@/lib/error-tracking";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await authenticateUser(email, password);

    // Set user in error tracking
    setErrorTrackingUser(user.id);

    return NextResponse.json({ user });
  } catch (error) {
    captureError(error, {
      action: "login",
      email, // Safe to log email on auth errors
    });
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
```

### On Logout

```typescript
// src/app/auth/logout/route.ts
import { setErrorTrackingUser } from "@/lib/error-tracking";

export async function POST(request: NextRequest) {
  try {
    // Clear user context before logging out
    setErrorTrackingUser(null);

    // Handle logout
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, {
      action: "logout",
    });
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
```

### In Middleware

```typescript
// src/middleware.ts
import { setErrorTrackingUser } from "@/lib/error-tracking";

export async function middleware(request: NextRequest) {
  // Extract user from session/token
  const userId = await getUserIdFromSession(request);

  if (userId) {
    setErrorTrackingUser(userId);
  }

  return NextResponse.next();
}
```

## Advanced Features

### Using Breadcrumbs

```typescript
import { getSentryReporter } from "@/lib/sentry-reporter";

async function processPayment(orderId: string) {
  const reporter = getSentryReporter();

  try {
    // Breadcrumb 1: Started processing
    reporter.addBreadcrumb(
      "Started payment processing",
      { orderId }
    );

    // Get order
    const order = await getOrder(orderId);
    reporter.addBreadcrumb(
      "Order retrieved",
      { orderTotal: order.total }
    );

    // Process payment
    const result = await stripe.charges.create({
      amount: order.total,
      currency: "usd",
    });

    reporter.addBreadcrumb(
      "Payment processed successfully",
      { chargeId: result.id }
    );

    return result;
  } catch (error) {
    reporter.addBreadcrumb(
      "Payment processing failed",
      { orderId },
      "error"
    );

    captureError(error, {
      orderId,
      action: "process_payment",
    });

    throw error;
  }
}
```

### Setting Tags for Filtering

```typescript
import { getSentryReporter } from "@/lib/sentry-reporter";

export async function checkFeatureFlag(userId: string) {
  const reporter = getSentryReporter();

  try {
    const enabled = await getFeatureFlag("new_ui", userId);

    // Tag errors with feature flag info
    if (enabled) {
      reporter.setTag("feature_flag", "new_ui_enabled");
    } else {
      reporter.setTag("feature_flag", "new_ui_disabled");
    }

    return enabled;
  } catch (error) {
    reporter.setTag("feature_flag", "check_failed");
    captureError(error, {
      userId,
      action: "check_feature_flag",
    });
  }
}
```

### Setting Context Data

```typescript
import { getSentryReporter } from "@/lib/sentry-reporter";

export async function processRefund(refundId: string) {
  const reporter = getSentryReporter();

  try {
    const refund = await getRefund(refundId);

    // Set context for better debugging
    reporter.setContext("refund_info", {
      refundId,
      amount: refund.amount,
      currency: refund.currency,
      reason: refund.reason,
      status: refund.status,
    });

    await processStripeRefund(refundId);
  } catch (error) {
    captureError(error, {
      refundId,
      action: "process_refund",
    });
  }
}
```

## Validation Error Example

```typescript
import { captureError, ErrorCategory } from "@/lib/error-tracking";

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    const error = new Error(`Invalid email format: ${email}`);
    captureError(error, {
      action: "validate_email",
      field: "email",
      value: "***", // Mask actual value
    });

    return false;
  }

  return true;
}
```

## Network Error Handling

```typescript
import { captureError, ErrorCategory } from "@/lib/error-tracking";

async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    const isNetworkError = error instanceof TypeError;

    captureError(error, {
      url,
      method: options?.method || "GET",
      isNetworkError,
      action: "fetch_request",
    });

    throw error;
  }
}
```

## Exception vs Message Capture

### Capturing Exceptions (Errors)

```typescript
// Use for actual errors that were caught
try {
  await riskyOperation();
} catch (error) {
  captureError(error); // Sends as exception to Sentry
}
```

### Capturing Messages

```typescript
import { getSentryReporter, ErrorSeverity } from "@/lib/sentry-reporter";

const reporter = getSentryReporter();

// Use for informational messages or warnings
reporter.captureMessage?.("User skipped optional setup step", ErrorSeverity.LOW);

reporter.captureMessage?.(
  "Database connection slow (>1000ms)",
  ErrorSeverity.MEDIUM
);

reporter.captureMessage?.(
  "Payment service unavailable",
  ErrorSeverity.HIGH
);
```

## Testing Error Capture

### Manual Testing in Browser

```javascript
// In browser console
if (window.Sentry) {
  // Capture a test error
  window.Sentry.captureException(new Error("Test error from console"));

  // Add breadcrumb
  window.Sentry.addBreadcrumb({
    message: "User action",
    data: { action: "clicked_button" },
  });

  // Set user
  window.Sentry.setUser({ id: "user-123" });
}
```

### Unit Test Example

```typescript
// __tests__/error-tracking.test.ts
import { captureError, ErrorCategory, ErrorSeverity } from "@/lib/error-tracking";

describe("Error Tracking", () => {
  it("captures error with context", () => {
    const consoleSpy = jest.spyOn(console, "error");

    const error = new Error("Test error");
    captureError(error, {
      userId: "test-user",
      action: "test_action",
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("categorizes database errors correctly", () => {
    const dbError = new Error("Database query failed");
    // Error categorization happens automatically
    captureError(dbError, { action: "database_operation" });
  });
});
```

## Best Practices

### Do's

- ✓ Always include context when capturing errors
- ✓ Set user context when user logs in
- ✓ Use breadcrumbs for complex operations
- ✓ Add tags for filtering in Sentry dashboard
- ✓ Mask sensitive data before logging
- ✓ Include request IDs for correlation
- ✓ Categorize errors appropriately

### Don'ts

- ✗ Don't log sensitive data (passwords, tokens, PII)
- ✗ Don't capture expected errors (like 404 for missing resources)
- ✗ Don't swallow errors without reporting
- ✗ Don't use error tracking for business logic (use proper logging)
- ✗ Don't report duplicate errors in tight loops
- ✗ Don't exceed Sentry quota with over-sampling

## Common Patterns

### API Route Pattern

```typescript
import { NextRequest, NextResponse } from "next/server";
import { captureError } from "@/lib/error-tracking";

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id");
  const userId = request.headers.get("x-user-id");

  try {
    // Your logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { action: "endpoint_action" }, {
      requestId,
      userId,
      path: request.nextUrl.pathname,
      method: "POST",
      endpoint: "/api/endpoint",
    });

    return NextResponse.json(
      { error: "Operation failed" },
      { status: 500 }
    );
  }
}
```

### Server Component Pattern

```typescript
async function DataComponent() {
  try {
    const data = await fetchData();
    return <div>{/* render data */}</div>;
  } catch (error) {
    captureError(error, {
      component: "DataComponent",
      action: "render",
    });
    return <ErrorFallback />;
  }
}
```

### Client Component Pattern

```typescript
"use client";

import { useCallback } from "react";
import { captureError } from "@/lib/error-tracking";

export function MyComponent() {
  const handleClick = useCallback(async () => {
    try {
      await myAsyncAction();
    } catch (error) {
      captureError(error, { action: "my_async_action" });
    }
  }, []);

  return <button onClick={handleClick}>Click me</button>;
}
```

## Monitoring Checklist

After implementing error tracking:

- [ ] Errors appear in Sentry dashboard
- [ ] User context is set correctly
- [ ] Request IDs correlate properly
- [ ] Error categorization is accurate
- [ ] Severity levels are appropriate
- [ ] No sensitive data in errors
- [ ] Breadcrumbs provide useful context
- [ ] Custom tags enable filtering
- [ ] Performance isn't impacted
- [ ] Quota usage is acceptable
