/**
 * Test API endpoint for Sentry error tracking
 * This endpoint demonstrates how to use the error tracking system in an API route
 *
 * Usage:
 * - GET /api/sentry-example-api?type=exception - throws an error (caught by Sentry)
 * - GET /api/sentry-example-api?type=message - captures a message (sent to Sentry)
 * - GET /api/sentry-example-api?type=success - returns success response
 */

import { NextRequest, NextResponse } from "next/server";
import { captureError, setErrorTrackingUser, ErrorSeverity, ErrorCategory } from "@/lib/error-tracking";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "success";
  const requestId = request.headers.get("x-request-id") || "unknown";

  // Get user ID from query for testing
  const userId = searchParams.get("userId");
  if (userId) {
    setErrorTrackingUser(userId);
  }

  try {
    switch (type) {
      case "exception": {
        // Demonstrate error capture with context
        const testError = new Error("This is a test error from Sentry API endpoint");
        captureError(testError, {
          endpoint: "/api/sentry-example-api",
          type: "test_exception",
          message: "Testing error capture in API route",
        }, {
          requestId,
          userId: userId || undefined,
          path: "/api/sentry-example-api",
          method: "GET",
          endpoint: "/api/sentry-example-api",
        });

        return NextResponse.json(
          {
            success: false,
            message: "Test exception captured",
            type: "exception",
            requestId,
          },
          { status: 500 }
        );
      }

      case "message": {
        // Demonstrate message capture
        const reporter = (global as Record<string, unknown>).__errorReporter as { captureMessage?: (msg: string, severity: string) => void } | undefined;
        if (reporter && reporter.captureMessage) {
          reporter.captureMessage("Test message from Sentry API endpoint", ErrorSeverity.MEDIUM);
        } else {
          console.log("[API] Test message: This would be sent to Sentry in production");
        }

        return NextResponse.json(
          {
            success: true,
            message: "Test message captured",
            type: "message",
            requestId,
          },
          { status: 200 }
        );
      }

      case "validation_error": {
        // Demonstrate validation error capture
        const validationError = new Error("Validation failed: Invalid request parameters");
        captureError(validationError, {
          endpoint: "/api/sentry-example-api",
          type: "validation_error",
          field: "type",
          value: "invalid",
        }, {
          requestId,
          userId: userId || undefined,
          path: "/api/sentry-example-api",
          method: "GET",
          endpoint: "/api/sentry-example-api",
        });

        return NextResponse.json(
          {
            success: false,
            message: "Validation error captured",
            type: "validation_error",
            requestId,
          },
          { status: 400 }
        );
      }

      case "network_error": {
        // Demonstrate network error capture
        const networkError = new Error("Network timeout: Failed to connect to external service");
        captureError(networkError, {
          endpoint: "/api/sentry-example-api",
          type: "network_error",
          service: "test-service",
          timeout: "5000ms",
        }, {
          requestId,
          userId: userId || undefined,
          path: "/api/sentry-example-api",
          method: "GET",
          endpoint: "/api/sentry-example-api",
        });

        return NextResponse.json(
          {
            success: false,
            message: "Network error captured",
            type: "network_error",
            requestId,
          },
          { status: 503 }
        );
      }

      case "success":
      default: {
        return NextResponse.json(
          {
            success: true,
            message: "Test API endpoint working correctly",
            type: "success",
            requestId,
            examples: {
              exception: "/api/sentry-example-api?type=exception",
              message: "/api/sentry-example-api?type=message",
              validation_error: "/api/sentry-example-api?type=validation_error",
              network_error: "/api/sentry-example-api?type=network_error",
              with_user: "/api/sentry-example-api?type=exception&userId=user123",
            },
          },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    // Catch any unhandled errors
    captureError(error, {
      endpoint: "/api/sentry-example-api",
      type: "unhandled_error",
      requestType: type,
    }, {
      requestId,
      userId: userId || undefined,
      path: "/api/sentry-example-api",
      method: "GET",
      endpoint: "/api/sentry-example-api",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        requestId,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || "unknown";

  try {
    // Example: Process request body
    const body = await request.json();
    const { type, userId } = body;

    if (userId) {
      setErrorTrackingUser(userId);
    }

    if (type === "test_error") {
      const error = new Error("POST test error");
      captureError(error, {
        endpoint: "/api/sentry-example-api",
        method: "POST",
        body: JSON.stringify(body),
      }, {
        requestId,
        userId: userId || undefined,
        path: "/api/sentry-example-api",
        method: "POST",
        endpoint: "/api/sentry-example-api",
      });

      return NextResponse.json(
        {
          success: false,
          message: "Test error captured via POST",
          requestId,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "POST request processed",
        requestId,
      },
      { status: 200 }
    );
  } catch (error) {
    captureError(error, {
      endpoint: "/api/sentry-example-api",
      method: "POST",
    }, {
      requestId,
      path: "/api/sentry-example-api",
      method: "POST",
      endpoint: "/api/sentry-example-api",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        requestId,
      },
      { status: 500 }
    );
  }
}
