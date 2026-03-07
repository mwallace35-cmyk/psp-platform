import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { withRetry } from "@/lib/retry";

describe("withRetry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("successful operations", () => {
    it("should return result on first attempt", async () => {
      const fn = vi.fn(async () => "success");

      const result = await withRetry(fn);

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should not retry after successful first attempt", async () => {
      const fn = vi.fn(async () => "success");

      await withRetry(fn);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("retry logic", () => {
    it("should retry after failure", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      const promise = withRetry(fn, { maxRetries: 3 });
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should throw after all retries exhausted", async () => {
      const error = new Error("persistent failure");
      const fn = vi.fn().mockRejectedValue(error);

      let caughtError: unknown;
      let promiseRejection: unknown;
      const promise = withRetry(fn, { maxRetries: 2 });

      // Attach rejection handler to prevent unhandled rejection
      promise.then(() => {}, (e) => {
        promiseRejection = e;
      });

      // Run all timers to completion
      await vi.runAllTimersAsync();

      try {
        await promise;
      } catch (e) {
        caughtError = e;
      }

      expect(caughtError).toBe(error);
      expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    it("should respect maxRetries option", async () => {
      const fn = vi.fn().mockRejectedValue(new Error("fail"));

      let caughtError: unknown;
      let promiseRejection: unknown;
      const promise = withRetry(fn, { maxRetries: 1 });

      // Attach rejection handler to prevent unhandled rejection
      promise.then(() => {}, (e) => {
        promiseRejection = e;
      });

      // Run all timers to completion
      await vi.runAllTimersAsync();

      try {
        await promise;
      } catch (e) {
        caughtError = e;
      }

      expect(caughtError).toBeDefined();
      expect(fn).toHaveBeenCalledTimes(2); // initial + 1 retry
    });

    it("should use default maxRetries of 3", async () => {
      const fn = vi.fn().mockRejectedValue(new Error("fail"));

      let caughtError: unknown;
      let promiseRejection: unknown;
      const promise = withRetry(fn);

      // Attach rejection handler to prevent unhandled rejection
      promise.then(() => {}, (e) => {
        promiseRejection = e;
      });

      // Run all timers to completion
      await vi.runAllTimersAsync();

      try {
        await promise;
      } catch (e) {
        caughtError = e;
      }

      expect(caughtError).toBeDefined();
      expect(fn).toHaveBeenCalledTimes(4); // initial + 3 retries
    });
  });

  describe("exponential backoff", () => {
    it("should apply exponential backoff with default baseDelay", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      const delaysSpy = vi.spyOn(global, "setTimeout");

      const promise = withRetry(fn, { maxRetries: 3, baseDelay: 1000 });

      // First retry: 1000ms * 2^0 = 1000ms
      await vi.advanceTimersByTimeAsync(1000);

      // Second retry: 1000ms * 2^1 = 2000ms
      await vi.advanceTimersByTimeAsync(2000);

      const result = await promise;

      expect(result).toBe("success");
      expect(delaysSpy).toHaveBeenCalled();
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should cap backoff at maxDelay", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      const promise = withRetry(fn, {
        maxRetries: 2,
        baseDelay: 5000,
        maxDelay: 3000,
      });

      // Would be 5000ms * 2^0 = 5000ms but capped at 3000ms
      await vi.advanceTimersByTimeAsync(3000);

      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should use baseDelay option", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      const promise = withRetry(fn, {
        maxRetries: 1,
        baseDelay: 2000,
      });

      // First retry: 2000ms * 2^0 = 2000ms
      await vi.advanceTimersByTimeAsync(2000);

      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should calculate correct exponential delays", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockRejectedValueOnce(new Error("fail"))
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      const baseDelay = 100;
      const maxDelay = 1000;
      const maxRetries = 3;

      const promise = withRetry(fn, { maxRetries, baseDelay, maxDelay });

      // Attempt 1: fails, delay = 100 * 2^0 = 100
      await vi.advanceTimersByTimeAsync(100);

      // Attempt 2: fails, delay = 100 * 2^1 = 200
      await vi.advanceTimersByTimeAsync(200);

      // Attempt 3: fails, delay = 100 * 2^2 = 400
      await vi.advanceTimersByTimeAsync(400);

      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(4);
    });
  });

  describe("error handling", () => {
    it("should throw string errors", async () => {
      const fn = vi.fn().mockRejectedValue("string error");

      let caughtError;
      try {
        await withRetry(fn, { maxRetries: 0 });
      } catch (e) {
        caughtError = e;
      }

      expect(caughtError).toBe("string error");
    });

    it("should throw Error objects", async () => {
      const error = new Error("error object");
      const fn = vi.fn().mockRejectedValue(error);

      let caughtError;
      try {
        await withRetry(fn, { maxRetries: 0 });
      } catch (e) {
        caughtError = e;
      }

      expect(caughtError).toBe(error);
    });

    it("should throw the last error after all retries", async () => {
      const error1 = new Error("first");
      const error2 = new Error("second");
      const error3 = new Error("third");

      const fn = vi
        .fn()
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2)
        .mockRejectedValue(error3);

      let caughtError: unknown;
      let promiseRejection: unknown;
      const promise = withRetry(fn, { maxRetries: 2 });

      // Attach rejection handler to prevent unhandled rejection
      promise.then(() => {}, (e) => {
        promiseRejection = e;
      });

      // Run all timers to completion
      await vi.runAllTimersAsync();

      try {
        await promise;
      } catch (e) {
        caughtError = e;
      }

      expect(caughtError).toBe(error3);
    });
  });

  describe("custom options", () => {
    it("should work with custom maxRetries", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      const promise = withRetry(fn, { maxRetries: 2 });

      await vi.advanceTimersByTimeAsync(1000);
      await vi.advanceTimersByTimeAsync(2000);

      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should work with custom baseDelay", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      const promise = withRetry(fn, { maxRetries: 1, baseDelay: 500 });

      await vi.advanceTimersByTimeAsync(500);

      const result = await promise;

      expect(result).toBe("success");
    });

    it("should work with custom maxDelay", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      const promise = withRetry(fn, {
        maxRetries: 1,
        baseDelay: 10000,
        maxDelay: 2000,
      });

      // Should use maxDelay instead of 10000
      await vi.advanceTimersByTimeAsync(2000);

      const result = await promise;

      expect(result).toBe("success");
    });

    it("should work with all custom options", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      const promise = withRetry(fn, {
        maxRetries: 5,
        baseDelay: 500,
        maxDelay: 5000,
      });

      await vi.advanceTimersByTimeAsync(500);

      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe("generic types", () => {
    it("should preserve return type", async () => {
      const fn = vi.fn(async () => ({ data: "value" }));

      const result = await withRetry(fn);

      expect(result).toEqual({ data: "value" });
    });

    it("should work with number returns", async () => {
      const fn = vi.fn(async () => 42);

      const result = await withRetry(fn);

      expect(result).toBe(42);
    });

    it("should work with complex object returns", async () => {
      interface ComplexData {
        id: string;
        count: number;
        nested: { value: string };
      }

      const expectedData: ComplexData = {
        id: "123",
        count: 5,
        nested: { value: "test" },
      };

      const fn = vi.fn(async () => expectedData);

      const result = await withRetry(fn);

      expect(result).toEqual(expectedData);
    });
  });
});
