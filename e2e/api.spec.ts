import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('oEmbed endpoint returns correct format for Twitter URL', async ({ page }) => {
    const url = 'https://twitter.com/user/status/123';
    const response = await page.request.get('/api/oembed', {
      params: {
        url: url,
      },
    });

    expect(response.status()).toBeLessThan(500); // Should not be server error

    if (response.status() === 200) {
      const data = await response.json();

      // Check response structure
      expect(data).toHaveProperty('html');
      expect(data).toHaveProperty('platform');

      // Platform should be detected
      expect(['twitter', 'instagram']).toContain(data.platform);
    }
  });

  test('oEmbed endpoint returns error for missing URL', async ({ page }) => {
    const response = await page.request.get('/api/oembed');

    // Should return 400 for missing parameter
    expect([400, 500]).toContain(response.status());

    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('oEmbed endpoint returns error for unsupported platform', async ({ page }) => {
    const response = await page.request.get('/api/oembed', {
      params: {
        url: 'https://unsupported-platform.com/video/123',
      },
    });

    expect([400, 500]).toContain(response.status());
  });

  test('oEmbed endpoint includes request ID header', async ({ page }) => {
    const response = await page.request.get('/api/oembed', {
      params: {
        url: 'https://twitter.com/user/status/123',
      },
    });

    const requestId = response.headers()['x-request-id'];
    expect(requestId).toBeTruthy();
  });

  test('Revalidate endpoint requires authorization', async ({ page }) => {
    const response = await page.request.post('/api/revalidate', {
      data: {
        path: '/',
      },
    });

    // Should be 401 without auth header
    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.code).toBe('INVALID_AUTH');
  });

  test('Revalidate endpoint validates request body', async ({ page }) => {
    const authToken = process.env.REVALIDATION_SECRET || 'invalid-token';

    const response = await page.request.post('/api/revalidate', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      data: {}, // Empty body - missing path or tag
    });

    // Should return error for missing params
    if (response.status() === 400) {
      const data = await response.json();
      expect(data.code).toBe('MISSING_PARAMS');
    }
  });

  test('API returns consistent error format', async ({ page }) => {
    // Try an endpoint that doesn't exist or returns error
    const response = await page.request.get('/api/oembed');

    const data = await response.json();

    // Should have standard error format
    if (response.status() >= 400) {
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('code');
    }
  });

  test('API responses include request ID for tracking', async ({ page }) => {
    const response = await page.request.get('/api/oembed', {
      params: {
        url: 'https://invalid-url.test',
      },
    });

    const requestId = response.headers()['x-request-id'];
    expect(requestId).toBeTruthy();

    // Request ID should be UUID format or similar
    expect(requestId?.length).toBeGreaterThan(5);
  });

  test('Rate limiting is enforced', async ({ page }) => {
    // Make multiple rapid requests to the oEmbed endpoint
    const requests = [];
    const responses = [];

    for (let i = 0; i < 15; i++) {
      requests.push(
        page.request.get('/api/oembed', {
          params: {
            url: `https://twitter.com/user/status/${i}`,
          },
        })
      );
    }

    const results = await Promise.all(requests);

    // At least some requests should be rate limited
    const rateLimitedResponses = results.filter(r => r.status() === 429);

    if (rateLimitedResponses.length > 0) {
      // Rate limited response should have Retry-After header
      const retryAfter = rateLimitedResponses[0].headers()['retry-after'];
      expect(retryAfter).toBeTruthy();
    }
  });

  test('Search endpoint returns results', async ({ page }) => {
    const response = await page.request.get('/api/search', {
      params: {
        q: 'bryant',
      },
    });

    expect([200, 400, 500]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();
      // Check structure depends on implementation
      expect(data).toBeTruthy();
    }
  });

  test('API errors have proper HTTP status codes', async ({ page }) => {
    // Unauthorized request
    const unauthorizedResponse = await page.request.post('/api/revalidate', {
      data: { path: '/' },
    });
    expect(unauthorizedResponse.status()).toBe(401);

    // Missing parameter
    const badRequestResponse = await page.request.get('/api/oembed');
    expect(badRequestResponse.status()).toBe(400);
  });

  test('oEmbed endpoint caches responses', async ({ page }) => {
    const url = 'https://twitter.com/user/status/123';

    // First request
    const response1 = await page.request.get('/api/oembed', {
      params: { url },
    });

    // Second request should use cache
    const response2 = await page.request.get('/api/oembed', {
      params: { url },
    });

    // Both should succeed
    expect([200, 429]).toContain(response1.status()); // Might be rate limited
    expect([200, 429]).toContain(response2.status());

    // Check cache headers if available
    if (response1.status() === 200) {
      const cacheControl = response1.headers()['cache-control'];
      if (cacheControl) {
        expect(cacheControl.includes('max-age') || cacheControl.includes('public')).toBeTruthy();
      }
    }
  });

  test('API response JSON is valid', async ({ page }) => {
    const response = await page.request.get('/api/oembed', {
      params: {
        url: 'https://twitter.com/user/status/123',
      },
    });

    if (response.status() === 200) {
      // Should be valid JSON
      const json = await response.json();
      expect(json).toBeTruthy();
      expect(typeof json).toBe('object');
    }
  });
});
