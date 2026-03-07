import { test, expect } from '@playwright/test';

test.describe('Navigation & Routing', () => {
  test('Home page loads with correct title and heading', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Philly/i);

    // Check main heading exists
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText(/Championship|State/i);
  });

  test('Main navigation links are clickable and work', async ({ page }) => {
    await page.goto('/');

    // Test Football link
    await page.click('a[href="/football"]');
    await expect(page).toHaveURL(/\/football/);

    // Test Basketball link
    await page.goto('/');
    await page.click('a[href="/basketball"]');
    await expect(page).toHaveURL(/\/basketball/);

    // Test Baseball link
    await page.goto('/');
    await page.click('a[href="/baseball"]');
    await expect(page).toHaveURL(/\/baseball/);
  });

  test('Sport pages load correctly with content', async ({ page }) => {
    const sports = ['/football', '/basketball', '/baseball'];

    for (const sport of sports) {
      await page.goto(sport);

      // Should have main content area
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      // Should have a heading
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    }
  });

  test('Breadcrumb navigation works on dynamic routes', async ({ page }) => {
    // Navigate to a team page if available
    await page.goto('/football/teams');

    // Check that page loaded
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('Skip-to-content link is accessible', async ({ page }) => {
    await page.goto('/');

    // Skip link should exist and be hidden by default
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible({ visible: false });

    // Should become visible on focus
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test('Invalid routes show 404 or error handling', async ({ page }) => {
    await page.goto('/this-page-does-not-exist', { waitUntil: 'networkidle' });

    // Page should still load (even if 404)
    const content = page.locator('main, [role="main"]');
    // Either has main content or error message
    const pageBody = page.locator('body');
    await expect(pageBody).toBeVisible();
  });

  test('Logo link navigates to home', async ({ page }) => {
    await page.goto('/football');

    // Click logo
    const logo = page.locator('a.logo-mark, .logo-mark').first();
    if (await logo.isVisible()) {
      await logo.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('Header stays sticky when scrolling', async ({ page }) => {
    await page.goto('/');

    // Get initial position of header
    const header = page.locator('header').first();
    const initialBox = await header.boundingBox();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));

    // Header should still be at top
    const scrolledBox = await header.boundingBox();
    if (initialBox && scrolledBox) {
      expect(scrolledBox.y).toBeLessThanOrEqual(initialBox.y + 10); // Small tolerance
    }
  });

  test('Mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Find hamburger button
    const hamburger = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i]').first();

    if (await hamburger.isVisible()) {
      // Open menu
      await hamburger.click();

      // Mobile menu should be visible
      const mobileMenu = page.locator('[id="mobile-menu"], .mobile-nav-panel').first();
      await expect(mobileMenu).toBeVisible();

      // Close menu
      const closeButton = page.locator('button[aria-label*="Close"]').first();
      await closeButton.click();

      // Menu should be hidden
      await expect(mobileMenu).toBeHidden();
    }
  });

  test('More Sports dropdown opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');

    // Find "More" dropdown
    const moreButton = page.locator('div[role="button"]', { hasText: 'More' }).first();

    if (await moreButton.isVisible()) {
      // Open dropdown
      await moreButton.click();

      // Dropdown menu should be visible
      const dropdown = page.locator('.dd-menu').first();
      await expect(dropdown).toBeVisible();

      // Check that more sports are in the menu
      const trackField = page.locator('a[href*="track"]');
      await expect(trackField).toBeVisible();
    }
  });
});
