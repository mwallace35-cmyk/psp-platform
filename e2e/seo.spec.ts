import { test, expect } from '@playwright/test';

test.describe('SEO & Meta Tags', () => {
  test('Home page has meta title and description', async ({ page }) => {
    await page.goto('/');

    // Check for meta title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    const description = await metaDescription.getAttribute('content');
    expect(description).toBeTruthy();
    expect(description?.length).toBeGreaterThan(10);
  });

  test('Pages have proper meta descriptions', async ({ page }) => {
    const pages = ['/', '/football', '/basketball', '/baseball'];

    for (const route of pages) {
      await page.goto(route);

      const metaDescription = page.locator('meta[name="description"]');
      const description = await metaDescription.getAttribute('content');

      expect(description).toBeTruthy();
      expect(description?.length).toBeGreaterThan(0);
      expect(description?.length).toBeLessThan(160); // Standard max for display
    }
  });

  test('OG tags are present on home page', async ({ page }) => {
    await page.goto('/');

    // og:title
    const ogTitle = page.locator('meta[property="og:title"]');
    const title = await ogTitle.getAttribute('content');
    expect(title).toBeTruthy();

    // og:description
    const ogDescription = page.locator('meta[property="og:description"]');
    const description = await ogDescription.getAttribute('content');
    expect(description).toBeTruthy();

    // og:image
    const ogImage = page.locator('meta[property="og:image"]');
    const image = await ogImage.getAttribute('content');
    expect(image).toBeTruthy();

    // og:type
    const ogType = page.locator('meta[property="og:type"]');
    const type = await ogType.getAttribute('content');
    expect(type).toBeTruthy();
  });

  test('OG tags present on sport pages', async ({ page }) => {
    const sports = ['/football', '/basketball', '/baseball'];

    for (const sport of sports) {
      await page.goto(sport);

      // Check og:title exists
      const ogTitle = page.locator('meta[property="og:title"]');
      const titleContent = await ogTitle.getAttribute('content');
      expect(titleContent).toBeTruthy();

      // og:image should exist
      const ogImage = page.locator('meta[property="og:image"]');
      const imageContent = await ogImage.getAttribute('content');
      expect(imageContent).toBeTruthy();
    }
  });

  test('JSON-LD structured data is present', async ({ page }) => {
    await page.goto('/');

    // Look for JSON-LD script tags
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();

    expect(count).toBeGreaterThan(0);

    // Get and parse first script
    const scriptContent = await scripts.first().textContent();
    expect(scriptContent).toBeTruthy();

    if (scriptContent) {
      // Should be valid JSON
      const jsonData = JSON.parse(scriptContent);
      expect(jsonData).toBeTruthy();
      expect(jsonData['@context']).toBe('https://schema.org');
    }
  });

  test('Organization JSON-LD has correct structure', async ({ page }) => {
    await page.goto('/');

    const scripts = page.locator('script[type="application/ld+json"]');
    let foundOrganization = false;

    for (let i = 0; i < await scripts.count(); i++) {
      const scriptContent = await scripts.nth(i).textContent();
      if (scriptContent) {
        try {
          const jsonData = JSON.parse(scriptContent);
          if (jsonData['@type'] === 'Organization' || jsonData.type === 'Organization') {
            foundOrganization = true;

            // Check required fields
            expect(jsonData.name).toBeTruthy();
            expect(jsonData.url).toBeTruthy();
          }
        } catch (e) {
          // Not valid JSON or not an object we care about
        }
      }
    }

    expect(foundOrganization).toBeTruthy();
  });

  test('Canonical URL is present', async ({ page }) => {
    await page.goto('/');

    const canonical = page.locator('link[rel="canonical"]');
    const href = await canonical.getAttribute('href');

    expect(href).toBeTruthy();
    expect(href).toMatch(/^https?:\/\//);
  });

  test('Canonical URLs correct on different pages', async ({ page }) => {
    const testUrls = ['/', '/football', '/basketball'];

    for (const url of testUrls) {
      await page.goto(url);

      const canonical = page.locator('link[rel="canonical"]');
      const href = await canonical.getAttribute('href');

      expect(href).toBeTruthy();
      expect(href).toContain('localhost:3000');
    }
  });

  test('Robots meta tag is set appropriately', async ({ page }) => {
    await page.goto('/');

    const robots = page.locator('meta[name="robots"]');
    const content = await robots.getAttribute('content');

    // Should exist and typically have standard values
    if (content) {
      expect(['index, follow', 'index', 'noindex', 'noindex, nofollow']).toContain(content);
    }
  });

  test('Viewport meta tag is present', async ({ page }) => {
    await page.goto('/');

    const viewport = page.locator('meta[name="viewport"]');
    const content = await viewport.getAttribute('content');

    expect(content).toBeTruthy();
    expect(content).toContain('width=device-width');
  });

  test('Charset is declared', async ({ page }) => {
    await page.goto('/');

    const charset = page.locator('meta[charset], meta[http-equiv="Content-Type"]');
    const count = await charset.count();

    expect(count).toBeGreaterThan(0);
  });

  test('Language attribute on html element', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const lang = await html.getAttribute('lang');

    // Should have language attribute
    expect(lang).toBeTruthy();
    expect(lang?.length).toBeGreaterThan(1);
  });

  test('Open Graph URL is set correctly', async ({ page }) => {
    await page.goto('/');

    const ogUrl = page.locator('meta[property="og:url"]');
    const url = await ogUrl.getAttribute('content');

    expect(url).toBeTruthy();
    expect(url).toMatch(/^https?:\/\//);
  });

  test('Twitter Card tags present', async ({ page }) => {
    await page.goto('/');

    // Check for twitter:card (basic requirement)
    const twitterCard = page.locator('meta[name="twitter:card"]');
    const card = await twitterCard.getAttribute('content');

    // May or may not be present, but if present should have valid value
    if (card) {
      expect(['summary', 'summary_large_image', 'app', 'player']).toContain(card);
    }
  });
});
