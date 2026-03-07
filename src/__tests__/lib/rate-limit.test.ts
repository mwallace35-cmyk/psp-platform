import { describe, it, expect, beforeEach, vi } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("Rate limiter", () => {
  beforeEach(() => {
    // Clear the rate limit map before each test
    // We do this by importing and testing with different IPs
    vi.clearAllMocks();
  });

  it("allows requests under the limit", async () => {
    const result = await rateLimit("192.168.1.1", 30, 60000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(29);
  });

  it("allows multiple requests under the limit", async () => {
    const ip = "192.168.1.2";

    const result1 = await rateLimit(ip, 5, 60000);
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(4);

    const result2 = await rateLimit(ip, 5, 60000);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(3);

    const result3 = await rateLimit(ip, 5, 60000);
    expect(result3.success).toBe(true);
    expect(result3.remaining).toBe(2);
  });

  it("blocks requests over the limit", async () => {
    const ip = "192.168.1.3";
    const maxRequests = 3;

    // Make maxRequests requests
    for (let i = 0; i < maxRequests; i++) {
      await rateLimit(ip, maxRequests, 60000);
    }

    // Next request should be blocked
    const result = await rateLimit(ip, maxRequests, 60000);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks correct remaining count as requests accumulate", async () => {
    const ip = "192.168.1.4";
    const maxRequests = 5;

    let result = await rateLimit(ip, maxRequests, 60000);
    expect(result.remaining).toBe(4);

    result = await rateLimit(ip, maxRequests, 60000);
    expect(result.remaining).toBe(3);

    result = await rateLimit(ip, maxRequests, 60000);
    expect(result.remaining).toBe(2);

    result = await rateLimit(ip, maxRequests, 60000);
    expect(result.remaining).toBe(1);
  });

  it("tracks different IPs separately", async () => {
    const ip1 = "192.168.1.5";
    const ip2 = "192.168.1.6";
    const maxRequests = 2;

    // First IP uses 2 requests
    await rateLimit(ip1, maxRequests, 60000);
    const result1_2 = await rateLimit(ip1, maxRequests, 60000);
    expect(result1_2.success).toBe(true);

    // Second IP should be independent
    const result2_1 = await rateLimit(ip2, maxRequests, 60000);
    expect(result2_1.success).toBe(true);
    expect(result2_1.remaining).toBe(1);
  });

  it("allows requests to different IPs independently", async () => {
    const ip1 = "192.168.1.7";
    const ip2 = "192.168.1.8";

    const result1 = await rateLimit(ip1, 1, 60000);
    expect(result1.success).toBe(true);

    // ip1 is now at limit
    const result1_blocked = await rateLimit(ip1, 1, 60000);
    expect(result1_blocked.success).toBe(false);

    // ip2 should still work
    const result2 = await rateLimit(ip2, 1, 60000);
    expect(result2.success).toBe(true);
  });

  it("resets after window expires", async () => {
    const ip = "192.168.1.9";
    const maxRequests = 1;
    const windowMs = 100; // 100ms window

    // First request succeeds
    const result1 = await rateLimit(ip, maxRequests, windowMs);
    expect(result1.success).toBe(true);

    // Second request is blocked
    const result2 = await rateLimit(ip, maxRequests, windowMs);
    expect(result2.success).toBe(false);

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, windowMs + 10));

    // Request should now succeed (window has reset)
    const result3 = await rateLimit(ip, maxRequests, windowMs);
    expect(result3.success).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it("uses provided maxRequests parameter", async () => {
    const ip = "192.168.1.10";

    // Make 9 requests with limit of 10
    for (let i = 0; i < 9; i++) {
      await rateLimit(ip, 10, 60000);
    }

    // 10th request should succeed
    const result1 = await rateLimit(ip, 10, 60000);
    expect(result1.success).toBe(true);

    // 11th request should fail
    const result2 = await rateLimit(ip, 10, 60000);
    expect(result2.success).toBe(false);
  });

  it("uses provided windowMs parameter", async () => {
    const ip = "192.168.1.11";
    const windowMs = 50;

    await rateLimit(ip, 1, windowMs);
    const blocked = await rateLimit(ip, 1, windowMs);
    expect(blocked.success).toBe(false);

    await new Promise(resolve => setTimeout(resolve, windowMs + 10));
    const afterReset = await rateLimit(ip, 1, windowMs);
    expect(afterReset.success).toBe(true);
  });

  it("initializes with correct remaining count on first request", async () => {
    const result = await rateLimit("192.168.1.12", 100, 60000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(99);
  });

  it("handles default parameters correctly", async () => {
    const result = await rateLimit("192.168.1.13");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(29); // 30 - 1
  });

  it("blocks when exactly at limit", async () => {
    const ip = "192.168.1.14";
    const limit = 2;

    await rateLimit(ip, limit, 60000);
    await rateLimit(ip, limit, 60000);

    // At this point we've made 2 requests, trying to make a 3rd should fail
    const result = await rateLimit(ip, limit, 60000);
    expect(result.success).toBe(false);
  });

  it("maintains state across multiple operations for same IP", async () => {
    const ip = "192.168.1.15";

    let remaining = 5;

    for (let i = 0; i < 5; i++) {
      const result = await rateLimit(ip, 5, 60000);
      expect(result.remaining).toBe(remaining - 1);
      remaining--;
    }

    const blocked = await rateLimit(ip, 5, 60000);
    expect(blocked.success).toBe(false);
  });
});
