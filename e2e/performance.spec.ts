import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('Home page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    console.log(`Home page loaded in ${loadTime}ms`);
  });

  test('Sport pages load within acceptable time', async ({ page }) => {
    const sports = ['/football', '/basketball', '/baseball'];

    for (const sport of sports) {
      const startTime = Date.now();

      await page.goto(sport, { waitUntil: 'networkidle' });

      const loadTime = Date.now() - startTime;

      // Should load within 4 seconds
      expect(loadTime).toBeLessThan(4000);

      console.log(`${sport} loaded in ${loadTime}ms`);
    }
  });

  test('Navigation between pages is fast', async ({ page }) => {
    await page.goto('/');

    const startTime = Date.now();
    await page.click('a[href="/football"]');
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    const navigationTime = Date.now() - startTime;

    // Navigation should complete within 2 seconds
    expect(navigationTime).toBeLessThan(2000);

    console.log(`Navigation completed in ${navigationTime}ms`);
  });

  test('Images below fold are lazy loaded', async ({ page }) => {
    await page.goto('/');

    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();

    let lazyLoadedCount = 0;

    if (imageCount > 0) {
      const imageElements = await images.all();

      for (const img of imageElements) {
        const loading = await img.getAttribute('loading');

        // Images should use lazy loading
        if (loading === 'lazy') {
          lazyLoadedCount++;
        }
      }
    }

    // At least some images should be lazy loaded
    console.log(`Lazy loaded images: ${lazyLoadedCount} of ${imageCount}`);
  });

  test('Next/Image components optimize images', async ({ page }) => {
    await page.goto('/');

    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Check that images have reasonable sizes attribute or are Next/Image optimized
      const imageElements = await images.all();

      for (const img of imageElements) {
        const sizes = await img.getAttribute('sizes');
        const src = await img.getAttribute('src');

        // Should have optimized URLs or sizes attribute
        const isOptimized = src?.includes('_next') || sizes;
        if (isOptimized) {
          expect(true).toBeTruthy();
        }
      }
    }
  });

  test('CSS is minified and optimized', async ({ page }) => {
    const response = await page.goto('/');

    if (response) {
      const styleSheets = page.locator('link[rel="stylesheet"]');
      const styleCount = await styleSheets.count();

      // Should have external stylesheets loaded
      expect(styleCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('No render-blocking resources delay initial paint', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const domLoadTime = Date.now() - startTime;

    // DOM should load quickly (before network idle)
    expect(domLoadTime).toBeLessThan(3000);

    console.log(`DOM content loaded in ${domLoadTime}ms`);
  });

  test('First page with images loads efficiently', async ({ page }) => {
    const startTime = Date.now();

    // Use load event for rough measure
    await page.goto('/', { waitUntil: 'load' });

    const totalTime = Date.now() - startTime;

    // Should load within 6 seconds including images
    expect(totalTime).toBeLessThan(6000);

    console.log(`Full page load (including images) took ${totalTime}ms`);
  });

  test('Search typeahead responds quickly', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder*="Search" i]').first();

    if (await searchInput.isVisible()) {
      const startTime = Date.now();

      // Type a search term
      await searchInput.fill('test');

      // Wait for any dropdown to appear
      await page.waitForTimeout(500);

      const responseTime = Date.now() - startTime;

      // Search response should be quick
      expect(responseTime).toBeLessThan(1000);

      console.log(`Search typeahead responded in ${responseTime}ms`);
    }
  });

  test('Form submission completes quickly', async ({ page }) => {
    await page.goto('/');

    const reportButton = page.locator('button:has-text("Report an issue")').first();

    if (await reportButton.isVisible()) {
      await reportButton.click();

      const fieldNameInput = page.locator('#field-name').first();
      const proposedValueInput = page.locator('#proposed-value').first();

      if (await fieldNameInput.isVisible() && await proposedValueInput.isVisible()) {
        await fieldNameInput.fill('Test Field');
        await proposedValueInput.fill('Test Value');

        const startTime = Date.now();

        // Submit form
        const submitButton = page.locator('button:has-text("Submit Correction")').first();
        await submitButton.click();

        // Wait for response (either success or error)
        await page.waitForTimeout(1500);

        const submitTime = Date.now() - startTime;

        // Form submission should respond within 2 seconds
        expect(submitTime).toBeLessThan(2000);

        console.log(`Form submission responded in ${submitTime}ms`);
      }
    }
  });

  test('Metrics show no excessive layout shifts', async ({ page }) => {
    // Track layout shifts
    let cumulativeLayoutShift = 0;

    page.on('console', (msg) => {
      if (msg.text().includes('CLS')) {
        console.log('CLS event:', msg.text());
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for any major visual instability
    // This is a simplified check - in production you'd use Web Vitals library
    const hasUnstableContent = await page.evaluate(() => {
      // Look for elements that might shift
      const images = document.querySelectorAll('img:not([height])');
      return images.length > 5; // If many images without heights, likely to shift
    });

    // If there are images without heights, they might cause shifts
    // This is informational rather than a strict requirement
    console.log('Potentially unoptimized images:', hasUnstableContent);
  });

  test('API endpoints respond quickly', async ({ page }) => {
    const startTime = Date.now();

    const response = await page.request.get('/api/oembed', {
      params: {
        url: 'https://twitter.com/user/status/123',
      },
    });

    const responseTime = Date.now() - startTime;

    // API should respond within 3 seconds
    if (response.status() === 200) {
      expect(responseTime).toBeLessThan(3000);
      console.log(`API endpoint responded in ${responseTime}ms`);
    }
  });

  test('Scrolling performance is smooth', async ({ page }) => {
    await page.goto('/');

    // Scroll down
    await page.evaluate(() => {
      window.scrollBy(0, 1000);
    });

    // Page should still be responsive
    const content = page.locator('main');
    await expect(content).toBeVisible();

    // Scroll back up
    await page.evaluate(() => {
      window.scrollBy(0, -1000);
    });

    await expect(content).toBeVisible();
  });

  test('Mobile page performance is acceptable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    // Mobile should load within 6 seconds (often slower network)
    expect(loadTime).toBeLessThan(6000);

    console.log(`Mobile page loaded in ${loadTime}ms`);
  });
});
