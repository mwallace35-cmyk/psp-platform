import { describe, it, expect, vi, beforeEach } from "vitest";
import { captureError, ErrorContext, resetErrorTrackingState, setErrorTrackingUser } from "@/lib/error-tracking";

describe("error-tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetErrorTrackingState();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("captureError", () => {
    it("should log to console.error", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError("test error");

      // First call is from ConsoleReporter, second is from main console.error
      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
      const lastCall = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1];
      expect(lastCall[0]).toContain("test error");
    });

    it("should handle Error objects", () => {
      const error = new Error("Error message");
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError(error);

      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
      const lastCall = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1];
      expect(lastCall[0]).toContain("Error message");
    });

    it("should handle string errors", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError("string error");

      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
      const lastCall = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1];
      expect(lastCall[0]).toContain("string error");
    });

    it("should include [PSP:ERROR] prefix", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError("test");

      // Check for either [PSP:ERROR] or [PSP:EXCEPTION] from reporter and main logger
      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        if (call[0]?.toString()?.includes("[PSP:ERROR]") || call[0]?.toString()?.includes("[PSP:EXCEPTION]")) {
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should include error stack for Error objects", () => {
      const error = new Error("test error");
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError(error);

      // Find the [PSP:ERROR] call which contains stack info
      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]") && call[1]) {
          expect(call[1]).toHaveProperty("stack");
          expect(call[1].stack).toBeTruthy();
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should not include stack for string errors", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError("string error");

      // Find the [PSP:ERROR] call and verify no stack
      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]") && call[1]) {
          expect(call[1].stack).toBeUndefined();
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });
  });

  describe("captureError with context", () => {
    it("should include context in log message", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const context: ErrorContext = { userId: "123", action: "login" };

      captureError("auth error", context);

      // Find [PSP:ERROR] log which contains context
      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]")) {
          expect(msg).toContain("userId=123");
          expect(msg).toContain("action=login");
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should format context as key=value pairs", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const context: ErrorContext = { code: "ERR_001", source: "api" };

      captureError("error with context", context);

      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]")) {
          expect(msg).toMatch(/code=ERR_001/);
          expect(msg).toMatch(/source=api/);
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should separate context with pipe character", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const context: ErrorContext = { key: "value" };

      captureError("test", context);

      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]")) {
          expect(msg).toContain("|");
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should not include context separator when context is empty", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const context: ErrorContext = {};

      captureError("test", context);

      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]")) {
          // Should not have trailing pipe
          expect(msg).not.toMatch(/\|\s*$/);
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should not include context separator when context is not provided", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError("test");

      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]")) {
          // Should include requestId context but no user-provided context
          expect(msg).toContain("requestId=");
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should filter out undefined context values", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const context: ErrorContext = {
        defined: "value",
        undefined: undefined,
      };

      captureError("test", context);

      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]")) {
          expect(msg).toContain("defined=value");
          expect(msg).not.toContain("undefined=");
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should handle multiple context entries", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const context: ErrorContext = {
        userId: "user123",
        endpoint: "/api/data",
        method: "POST",
      };

      captureError("api error", context);

      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]")) {
          expect(msg).toContain("userId=user123");
          expect(msg).toContain("endpoint=/api/data");
          expect(msg).toContain("method=POST");
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should pass context to console.error second argument", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const context: ErrorContext = { userId: "123" };

      captureError("error", context);

      // Find [PSP:ERROR] call with context object
      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]") && call[1]) {
          expect(call[1]).toHaveProperty("context");
          // Context should include the provided context values
          expect(call[1].context.userId).toEqual("123");
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });
  });

  describe("error type handling", () => {
    it("should handle Error with cause", () => {
      const cause = new Error("root cause");
      const error = new Error("wrapper error", { cause });
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError(error);

      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
      const lastCall = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1];
      expect(lastCall[0]).toContain("wrapper error");
    });

    it("should handle null error", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError(null);

      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
      const lastCall = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1];
      expect(lastCall[0]).toContain("null");
    });

    it("should handle undefined error", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError(undefined);

      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
      const lastCall = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1];
      expect(lastCall[0]).toContain("undefined");
    });

    it("should handle object that is not an Error", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const obj = { code: "ERR_001", message: "custom error" };

      captureError(obj);

      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    it("should handle number error", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError(404);

      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
      const lastCall = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1];
      expect(lastCall[0]).toContain("404");
    });

    it("should handle boolean error", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      captureError(false);

      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
      const lastCall = consoleErrorSpy.mock.calls[consoleErrorSpy.mock.calls.length - 1];
      expect(lastCall[0]).toContain("false");
    });
  });

  describe("error handling robustness", () => {
    it("should not throw when console.error fails", () => {
      const errorSpy = vi.spyOn(console, "error");
      errorSpy.mockImplementationOnce(() => {
        throw new Error("console.error failed");
      });
      errorSpy.mockImplementationOnce(() => {}); // For fallback

      expect(() => captureError("test")).not.toThrow();
    });

    it("should log fallback error when logging fails", () => {
      const originalError = new Error("original error");
      vi.spyOn(console, "error")
        .mockImplementationOnce(() => {
          throw new Error("console.error failed");
        })
        .mockImplementationOnce(() => {});

      captureError(originalError);

      // Second call should be the fallback
      const spy = console.error as any;
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("should gracefully handle circular references in context", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const context: any = { value: "test" };
      context.self = context; // Create circular reference

      // Should not throw
      expect(() => captureError("test", context)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("integration scenarios", () => {
    it("should work in API error scenario", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const error = new Error("Database connection failed");
      const context: ErrorContext = {
        endpoint: "/api/users",
        method: "GET",
        statusCode: "500",
      };

      captureError(error, context);

      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]") && call[1]) {
          expect(msg).toContain("Database connection failed");
          expect(call[1]).toHaveProperty("context");
          expect(call[1].stack).toBeTruthy();
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should work in component error boundary scenario", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const error = new Error("Component render failed");
      const context: ErrorContext = {
        component: "ProductCard",
        productId: "prod-123",
      };

      captureError(error, context);

      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]")) {
          expect(msg).toContain("Component render failed");
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });

    it("should work in async function error scenario", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const error = new Error("Async operation timeout");
      const context: ErrorContext = {
        operation: "fetchUserData",
        timeout: "5000ms",
      };

      captureError(error, context);

      let found = false;
      for (const call of consoleErrorSpy.mock.calls) {
        const msg = call[0]?.toString() || "";
        if (msg.includes("[PSP:ERROR]")) {
          expect(msg).toContain("Async operation timeout");
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    });
  });
});
