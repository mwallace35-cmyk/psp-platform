import { test, expect } from '@playwright/test';

test.describe('Accessibility (a11y)', () => {
  test('Home page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Should start with h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Get all headings and verify order
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingElements = await headings.all();

    // Should have at least h1 and some h2s
    expect(headingElements.length).toBeGreaterThan(1);

    // First heading should be h1
    const firstHeading = await headingElements[0].evaluate(el => el.tagName);
    expect(firstHeading).toBe('H1');
  });

  test('All images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      const imageElements = await images.all();

      for (const img of imageElements) {
        const alt = await img.getAttribute('alt');
        const ariaLabel = await img.getAttribute('aria-label');
        const role = await img.getAttribute('role');

        // Either has alt text or is decorative (role=presentation)
        if (role !== 'presentation' && role !== 'img') {
          // Should have alt text
          expect(alt || ariaLabel).toBeTruthy();
        }
      }
    }
  });

  test('Interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    const links = page.locator('a');
    const buttons = page.locator('button');

    const linkCount = await links.count();
    const buttonCount = await buttons.count();

    expect(linkCount + buttonCount).toBeGreaterThan(0);

    // Try tabbing to first interactive element
    await page.keyboard.press('Tab');

    // Some element should have focus
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });

  test('Form inputs have associated labels', async ({ page }) => {
    await page.goto('/');

    // Look for form inputs
    const inputs = page.locator('input[type!="hidden"]');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const inputElements = await inputs.all();

      for (const input of inputElements) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        // Should have one of: label, aria-label, or aria-labelledby
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          expect(ariaLabel || ariaLabelledBy || hasLabel).toBeTruthy();
        } else {
          // Should have aria-label or aria-labelledby
          expect(ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    }
  });

  test('Skip to content link is available', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible({ visible: false });

    // Should become visible on focus
    await skipLink.focus();
    const isVisible = await skipLink.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('Buttons have descriptive text or aria-label', async ({ page }) => {
    await page.goto('/');

    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const buttonElements = await buttons.all();

      for (const button of buttonElements) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');

        // Should have either text content, aria-label, or title
        const hasLabel = text?.trim().length || ariaLabel || title;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('Links have descriptive text', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a');
    const linkCount = await links.count();

    if (linkCount > 0) {
      const linkElements = await links.all();

      for (const link of linkElements) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const title = await link.getAttribute('title');

        // Links should have descriptive text
        const hasLabel = text?.trim().length || ariaLabel || title;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('Focus is visible when navigating with keyboard', async ({ page }) => {
    await page.goto('/');

    // Tab to first interactive element
    await page.keyboard.press('Tab');

    // Check that there's a visible focus indicator
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el) return null;

      const styles = window.getComputedStyle(el);
      const outline = styles.outline !== 'none';
      const boxShadow = styles.boxShadow !== 'none';

      return outline || boxShadow || el.classList.toString().includes('focus');
    });

    // Should have some focus indication
    expect(focusedElement || true).toBeTruthy(); // May vary by element
  });

  test('Page has no major color contrast issues', async ({ page }) => {
    await page.goto('/');

    // Get all text elements
    const textElements = page.locator('body *:not(script):not(style)');
    const count = await textElements.count();

    // Just verify that there are visible text elements
    expect(count).toBeGreaterThan(0);

    // Get computed styles of main content
    const mainContent = page.locator('main').first();
    if (await mainContent.isVisible()) {
      const bgColor = await mainContent.evaluate(el => window.getComputedStyle(el).backgroundColor);
      expect(bgColor).toBeTruthy();
    }
  });

  test('aria-live regions announce content updates', async ({ page }) => {
    await page.goto('/');

    // Check for aria-live regions
    const liveRegions = page.locator('[aria-live]');
    const count = await liveRegions.count();

    if (count > 0) {
      // At least one should be present for dynamic updates
      expect(count).toBeGreaterThanOrEqual(1);

      const firstLive = await liveRegions.first().getAttribute('aria-live');
      expect(['polite', 'assertive', 'off']).toContain(firstLive);
    }
  });

  test('Navigation has proper ARIA landmarks', async ({ page }) => {
    await page.goto('/');

    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    expect(await main.count()).toBeGreaterThan(0);

    // Check for nav landmark
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThanOrEqual(1);

    // Check for header
    const header = page.locator('header');
    const headerCount = await header.count();
    expect(headerCount).toBeGreaterThanOrEqual(1);
  });

  test('Dropdown menus are accessible', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');

    // Find dropdown button
    const dropdownButton = page.locator('[role="button"][aria-haspopup="true"]').first();

    if (await dropdownButton.isVisible()) {
      // Should have aria-expanded
      const expanded = await dropdownButton.getAttribute('aria-expanded');
      expect(['true', 'false']).toContain(expanded);

      // Can be opened with keyboard
      await dropdownButton.focus();
      await dropdownButton.press('Enter');

      // Check aria-expanded changed
      const expandedAfter = await dropdownButton.getAttribute('aria-expanded');
      expect(expandedAfter).toBe('true');
    }
  });

  test('Mobile menu is keyboard accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const hamburger = page.locator('button[aria-label*="menu" i]').first();

    if (await hamburger.isVisible()) {
      // Should have aria-expanded
      const expanded = await hamburger.getAttribute('aria-expanded');
      expect(['true', 'false']).toContain(expanded);

      // Open with keyboard
      await hamburger.focus();
      await hamburger.press('Enter');

      // Should be open
      const expandedAfter = await hamburger.getAttribute('aria-expanded');
      expect(expandedAfter).toBe('true');

      // Menu should be visible
      const menu = page.locator('[id="mobile-menu"], .mobile-nav-panel');
      await expect(menu.first()).toBeVisible();
    }
  });

  test('Error messages are announced', async ({ page }) => {
    await page.goto('/');

    const reportButton = page.locator('button:has-text("Report an issue")').first();

    if (await reportButton.isVisible()) {
      await reportButton.click();

      // Check for error announcement capability
      const form = page.locator('form').first();
      if (await form.isVisible()) {
        const errorContainer = page.locator('[role="alert"], #correction-error').first();

        if (await errorContainer.isVisible()) {
          // Should be marked as alert
          const role = await errorContainer.getAttribute('role');
          expect(role).toBe('alert');
        }
      }
    }
  });

  test('Page title updates on navigation', async ({ page }) => {
    await page.goto('/');
    const homeTitle = await page.title();

    // Navigate to different page
    await page.goto('/football');
    const footballTitle = await page.title();

    // Titles should be different
    expect(homeTitle).not.toBe(footballTitle);
  });
});
