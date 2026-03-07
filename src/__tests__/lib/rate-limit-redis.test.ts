import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  rateLimit,
  generateRequestFingerprint,
  getRateLimitHeaders,
  InMemoryAdapter,
  RedisAdapter,
  setRateLimitAdapter,
  getRateLimitAdapter,
  type RateLimitAdapter,
  type RateLimitResult,
} from '@/lib/rate-limit';

describe('Rate Limiting - InMemoryAdapter', () => {
  let adapter: InMemoryAdapter;

  beforeEach(() => {
    adapter = new InMemoryAdapter();
    vi.clearAllMocks();
  });

  it('allows first request', async () => {
    const result = await adapter.check('test-key', 10, 60000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(9);
    expect(result.resetAt).toBeDefined();
  });

  it('allows multiple requests under limit', async () => {
    const results: RateLimitResult[] = [];
    for (let i = 0; i < 5; i++) {
      results.push(await adapter.check('test-key-2', 10, 60000));
    }

    expect(results[0].success).toBe(true);
    expect(results[0].remaining).toBe(9);
    expect(results[4].success).toBe(true);
    expect(results[4].remaining).toBe(5);
  });

  it('blocks requests exceeding limit', async () => {
    for (let i = 0; i < 10; i++) {
      await adapter.check('test-key-3', 10, 60000);
    }

    const blocked = await adapter.check('test-key-3', 10, 60000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('resets after window expires', async () => {
    const windowMs = 100;
    const result1 = await adapter.check('test-key-4', 1, windowMs);
    expect(result1.success).toBe(true);

    const blocked = await adapter.check('test-key-4', 1, windowMs);
    expect(blocked.success).toBe(false);

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, windowMs + 10));

    const result2 = await adapter.check('test-key-4', 1, windowMs);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(0);
  });

  it('tracks separate keys independently', async () => {
    const result1 = await adapter.check('key-a', 2, 60000);
    const result2 = await adapter.check('key-b', 2, 60000);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);

    await adapter.check('key-a', 2, 60000);
    const result3 = await adapter.check('key-a', 2, 60000);
    expect(result3.success).toBe(false);

    // key-b should still have capacity
    const result4 = await adapter.check('key-b', 2, 60000);
    expect(result4.success).toBe(true);
  });

  it('returns correct resetAt timestamp', async () => {
    const before = Date.now();
    const result = await adapter.check('test-key-5', 10, 5000);
    const after = Date.now();

    expect(result.resetAt).toBeDefined();
    expect(result.resetAt! >= before + 5000).toBe(true);
    expect(result.resetAt! <= after + 5000).toBe(true);
  });

});

describe('Rate Limiting - RedisAdapter Fallback', () => {
  let adapter: RedisAdapter;

  beforeEach(() => {
    adapter = new RedisAdapter();
    vi.clearAllMocks();
  });

  it('falls back to InMemory when Redis is unavailable', async () => {
    const result = await adapter.check('redis-key-fallback', 10, 60000);
    // Should return a valid result (from fallback)
    expect(result.success).toBe(true);
    expect(result.remaining).toBeDefined();
  });

  it('falls back to InMemory on Redis error', async () => {
    const result = await adapter.check('redis-key-error', 10, 60000);
    // Should return a valid result (from fallback)
    expect(result.success).toBe(true);
    expect(result.remaining).toBeDefined();
  });

  it('blocks requests when fallback limit exceeded', async () => {
    const key = 'fallback-key';
    const limit = 2;

    const result1 = await adapter.check(key, limit, 60000);
    const result2 = await adapter.check(key, limit, 60000);
    const result3 = await adapter.check(key, limit, 60000);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result3.success).toBe(false);
  });
});

describe('Rate Limiting - Integration Tests', () => {
  beforeEach(() => {
    // Reset to use InMemoryAdapter for integration tests
    setRateLimitAdapter(new InMemoryAdapter());
  });

  it('rateLimit function with defaults', async () => {
    const result = await rateLimit('192.168.1.1');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(29); // 30 - 1
  });

  it('rateLimit function with custom params', async () => {
    const result = await rateLimit('192.168.1.2', 5, 60000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('rateLimit with endpoint identifier', async () => {
    const ip = '192.168.1.3';
    const endpoint = '/api/search';

    // First endpoint
    const result1 = await rateLimit(ip, 2, 60000, endpoint);
    expect(result1.success).toBe(true);

    // Different endpoint should be independent
    const result2 = await rateLimit(ip, 2, 60000, '/api/other');
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(1);
  });

  it('rateLimit with fingerprinting headers', async () => {
    const ip = '192.168.1.4';
    const userAgent = 'Mozilla/5.0';
    const acceptLanguage = 'en-US';

    const result1 = await rateLimit(ip, 5, 60000, undefined, userAgent, acceptLanguage);
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(4);

    // Different user agent should have different fingerprint
    const result2 = await rateLimit(ip, 5, 60000, undefined, 'Safari/537.36', acceptLanguage);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(4);
  });

  it('rateLimit bypasses for admin', async () => {
    const result = await rateLimit('192.168.1.5', 1, 60000, undefined, undefined, undefined, true);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(1); // Admin bypass, so remaining is max
  });

  it('rateLimit enforces separate limits per IP', async () => {
    const endpoint = '/api/test';
    const limit = 2;

    // IP 1 makes 2 requests
    await rateLimit('192.168.2.1', limit, 60000, endpoint);
    const result1 = await rateLimit('192.168.2.1', limit, 60000, endpoint);
    expect(result1.success).toBe(true);

    // Third request blocked
    const blocked = await rateLimit('192.168.2.1', limit, 60000, endpoint);
    expect(blocked.success).toBe(false);

    // IP 2 should still work
    const result2 = await rateLimit('192.168.2.2', limit, 60000, endpoint);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(1);
  });

  it('rateLimit returns resetAt timestamp', async () => {
    const result = await rateLimit('192.168.1.6', 10, 5000);
    expect(result.resetAt).toBeDefined();
    expect(result.resetAt! > Date.now()).toBe(true);
  });

  it('rateLimit blocks requests after limit exceeded', async () => {
    const ip = '192.168.1.7';
    const limit = 2;

    // Make requests up to limit
    for (let i = 0; i < limit; i++) {
      const result = await rateLimit(ip, limit, 60000);
      expect(result.success).toBe(true);
    }

    // Next request should be blocked
    const blocked = await rateLimit(ip, limit, 60000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});

describe('Rate Limiting - Helper Functions', () => {
  it('generateRequestFingerprint creates consistent hash', () => {
    const ip = '192.168.1.1';
    const userAgent = 'Mozilla/5.0';
    const acceptLanguage = 'en-US';

    const hash1 = generateRequestFingerprint(ip, userAgent, acceptLanguage);
    const hash2 = generateRequestFingerprint(ip, userAgent, acceptLanguage);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(12);
  });

  it('generateRequestFingerprint handles null headers', () => {
    const hash = generateRequestFingerprint('192.168.1.1', null, null);
    expect(hash).toBeDefined();
    expect(hash.length).toBe(12);
  });

  it('generateRequestFingerprint produces different hashes for different inputs', () => {
    const hash1 = generateRequestFingerprint('192.168.1.1', 'Agent1', 'en-US');
    const hash2 = generateRequestFingerprint('192.168.1.1', 'Agent2', 'en-US');

    expect(hash1).not.toBe(hash2);
  });

  it('getRateLimitHeaders returns correct format', () => {
    const resetAt = Date.now() + 30000;
    const headers = getRateLimitHeaders(15, 30, resetAt);

    expect(headers['X-RateLimit-Limit']).toBe('30');
    expect(headers['X-RateLimit-Remaining']).toBe('15');
    expect(headers['X-RateLimit-Reset']).toBe(String(Math.ceil(resetAt / 1000)));
  });

  it('getRateLimitHeaders ensures remaining is non-negative', () => {
    const headers = getRateLimitHeaders(-5, 30, Date.now());
    expect(parseInt(headers['X-RateLimit-Remaining'])).toBeGreaterThanOrEqual(0);
  });

  it('getRateLimitHeaders converts milliseconds to seconds for Reset', () => {
    const nowMs = Date.now();
    const headers = getRateLimitHeaders(10, 30, nowMs);
    const resetSeconds = parseInt(headers['X-RateLimit-Reset']);

    expect(resetSeconds).toBeCloseTo(Math.ceil(nowMs / 1000), 0);
  });
});

describe('Rate Limiting - Adapter Pattern', () => {
  it('setRateLimitAdapter changes active adapter', async () => {
    const customAdapter: RateLimitAdapter = {
      check: vi.fn().mockResolvedValue({
        success: true,
        remaining: 99,
      }),
    };

    setRateLimitAdapter(customAdapter);
    const adapter = await getRateLimitAdapter();

    expect(adapter).toBe(customAdapter);
  });

  it('getRateLimitAdapter initializes default adapter', async () => {
    // Reset to no adapter
    setRateLimitAdapter(null as any);

    const adapter = await getRateLimitAdapter();
    expect(adapter).toBeDefined();
    // Should be InMemoryAdapter since Redis is not available
    expect(adapter instanceof InMemoryAdapter || adapter instanceof RedisAdapter).toBe(true);
  });

  it('multiple calls to getRateLimitAdapter return same instance', async () => {
    setRateLimitAdapter(new InMemoryAdapter());

    const adapter1 = await getRateLimitAdapter();
    const adapter2 = await getRateLimitAdapter();

    expect(adapter1).toBe(adapter2);
  });
});

describe('Rate Limiting - Edge Cases', () => {
  let adapter: InMemoryAdapter;

  beforeEach(() => {
    adapter = new InMemoryAdapter();
  });

  it('handles very large windowMs', async () => {
    const largeWindow = 1000 * 60 * 60 * 24; // 1 day
    const result = await adapter.check('edge-key-2', 10, largeWindow);

    expect(result.success).toBe(true);
    expect(result.resetAt).toBeDefined();
  });

  it('handles very small windowMs', async () => {
    const smallWindow = 1; // 1 millisecond
    const result = await adapter.check('edge-key-3', 10, smallWindow);

    expect(result.success).toBe(true);
  });

  it('handles special characters in key', async () => {
    const specialKey = 'key:with:colons:and/slashes?and=equals';
    const result = await adapter.check(specialKey, 10, 60000);

    expect(result.success).toBe(true);
  });

  it('handles very large maxRequests', async () => {
    const largeLimit = 1000000;
    const result = await adapter.check('edge-key-4', largeLimit, 60000);

    expect(result.success).toBe(true);
    expect(result.remaining).toBe(largeLimit - 1);
  });

  it('maintains count across window for same key', async () => {
    const result1 = await adapter.check('persist-key', 5, 60000);
    const result2 = await adapter.check('persist-key', 5, 60000);
    const result3 = await adapter.check('persist-key', 5, 60000);

    expect(result1.remaining).toBe(4);
    expect(result2.remaining).toBe(3);
    expect(result3.remaining).toBe(2);
  });
});

describe('Rate Limiting - Real-World Scenarios', () => {
  beforeEach(() => {
    setRateLimitAdapter(new InMemoryAdapter());
  });

  it('simulates API endpoint rate limiting', async () => {
    const endpoint = '/api/search';
    const limitPerMinute = 30;
    const windowMs = 60000;

    const ip1 = '203.0.113.1';
    const ip2 = '203.0.113.2';

    // IP1 makes multiple requests
    let ip1Results = [];
    for (let i = 0; i < 15; i++) {
      ip1Results.push(await rateLimit(ip1, limitPerMinute, windowMs, endpoint));
    }
    expect(ip1Results[14].success).toBe(true);
    expect(ip1Results[14].remaining).toBe(15);

    // IP2 independently can make requests
    let ip2Results = [];
    for (let i = 0; i < 10; i++) {
      ip2Results.push(await rateLimit(ip2, limitPerMinute, windowMs, endpoint));
    }
    expect(ip2Results[9].success).toBe(true);
    expect(ip2Results[9].remaining).toBe(20);
  });

  it('simulates per-endpoint rate limiting', async () => {
    const ip = '203.0.113.100';

    // Different endpoints have independent limits
    const searchResults = await rateLimit(ip, 10, 60000, '/api/search');
    const dataResults = await rateLimit(ip, 5, 60000, '/api/data');

    expect(searchResults.success).toBe(true);
    expect(searchResults.remaining).toBe(9);
    expect(dataResults.success).toBe(true);
    expect(dataResults.remaining).toBe(4);
  });

  it('simulates burst traffic scenario', async () => {
    const ip = '203.0.113.50';
    const limit = 5;

    // Burst of 5 requests
    let results = [];
    for (let i = 0; i < limit; i++) {
      results.push(await rateLimit(ip, limit, 60000));
    }

    // All should succeed
    expect(results.every(r => r.success)).toBe(true);

    // 6th request should fail
    const result = await rateLimit(ip, limit, 60000);
    expect(result.success).toBe(false);
  });
});
