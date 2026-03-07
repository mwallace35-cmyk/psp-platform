import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { withErrorHandling, logError, ErrorSeverity } from "@/lib/errors";
import { resetErrorTrackingState } from "@/lib/error-tracking";

describe("withErrorHandling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetErrorTrackingState();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns function result on success", async () => {
    const result = await withErrorHandling(
      async () => "success",
      "fallback",
      "TEST"
    );
    expect(result).toBe("success");
  });

  it("returns fallback on error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await withErrorHandling(
      async () => { throw new Error("test error"); },
      "fallback",
      "TEST"
    );
    expect(result).toBe("fallback");
  });

  it("returns fallback number on error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await withErrorHandling(
      async () => { throw new Error("test error"); },
      0,
      "TEST"
    );
    expect(result).toBe(0);
  });

  it("returns fallback array on error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await withErrorHandling(
      async () => { throw new Error("fail"); },
      [] as string[],
      "TEST"
    );
    expect(result).toEqual([]);
  });

  it("returns fallback object on error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fallbackObj = { status: "error" };
    const result = await withErrorHandling(
      async () => { throw new Error("fail"); },
      fallbackObj,
      "TEST"
    );
    expect(result).toBe(fallbackObj);
  });

  it("logs error with context", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await withErrorHandling(
      async () => { throw new Error("test"); },
      null,
      "TEST_CODE",
      { extra: "context" }
    );
    const call = spy.mock.calls[0];
    expect(call[0]).toContain("TEST_CODE");
    expect(call[0]).toContain("extra=context");
    spy.mockRestore();
  });

  it("logs error without context", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await withErrorHandling(
      async () => { throw new Error("test error"); },
      null,
      "ERROR_CODE"
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("ERROR_CODE"),
      expect.any(Object)
    );
    spy.mockRestore();
  });

  it("includes error message in logging", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await withErrorHandling(
      async () => { throw new Error("specific error message"); },
      null,
      "TEST_CODE"
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("specific error message"),
      expect.any(Object)
    );
    spy.mockRestore();
  });

  it("includes stack trace in context", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await withErrorHandling(
      async () => { throw new Error("test"); },
      null,
      "TEST",
      {}
    );
    const call = spy.mock.calls[0];
    const context = call[1] as Record<string, unknown>;
    expect(context).toHaveProperty("stack");
    spy.mockRestore();
  });

  it("handles non-Error exceptions", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await withErrorHandling(
      async () => { throw "string error"; },
      "fallback",
      "TEST"
    );
    expect(result).toBe("fallback");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("handles null exceptions", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await withErrorHandling(
      async () => { throw null; },
      "fallback",
      "TEST"
    );
    expect(result).toBe("fallback");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("handles undefined exceptions", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await withErrorHandling(
      async () => { throw undefined; },
      "fallback",
      "TEST"
    );
    expect(result).toBe("fallback");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("logError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the deduplication state in error-tracking
    resetErrorTrackingState();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses console.error for HIGH severity", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("TEST", "message", ErrorSeverity.HIGH);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toContain("TEST");
    spy.mockRestore();
  });

  it("uses console.error for CRITICAL severity", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("TEST", "message", ErrorSeverity.CRITICAL);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("uses console.error for MEDIUM severity", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("TEST", "message", ErrorSeverity.MEDIUM);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toContain("TEST");
    spy.mockRestore();
  });

  it("uses console.error for LOW severity", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("TEST", "message", ErrorSeverity.LOW);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("includes error code in output", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("MY_ERROR_CODE", "test message", ErrorSeverity.MEDIUM);
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("MY_ERROR_CODE"),
      expect.any(Object)
    );
    spy.mockRestore();
  });

  it("includes error message in output", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("CODE", "specific message", ErrorSeverity.MEDIUM);
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("specific message"),
      expect.any(Object)
    );
    spy.mockRestore();
  });

  it("includes severity level in output", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("CODE", "message", ErrorSeverity.HIGH);
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("HIGH"),
      expect.any(Object)
    );
    spy.mockRestore();
  });

  it("accepts optional context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const context = { userId: 123, action: "fetch" };
    logError("CODE", "message", ErrorSeverity.MEDIUM, context);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("defaults to MEDIUM severity when not specified", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("CODE", "message");
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toContain("MEDIUM");
    spy.mockRestore();
  });

  it("formats error code with PSP prefix", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("MY_CODE", "message", ErrorSeverity.MEDIUM);
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[PSP:"),
      expect.any(Object)
    );
    spy.mockRestore();
  });
});
