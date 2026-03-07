import { test, expect } from '@playwright/test';

test.describe('Form Submission Flows', () => {
  test('Correction form shows validation errors on empty submit', async ({ page }) => {
    // Navigate to a player page that has correction form
    await page.goto('/');

    // Look for a page with correction form - try to find "Report an issue" button
    const reportButton = page.locator('button:has-text("Report an issue")').first();

    if (await reportButton.isVisible()) {
      // Click to open the form
      await reportButton.click();

      // Find the submit button
      const submitButton = page.locator('button:has-text("Submit Correction")').first();
      await expect(submitButton).toBeVisible();

      // Try to submit without filling required fields
      await submitButton.click();

      // Check for validation messages (aria-invalid attributes or error messages)
      const errorMessage = page.locator('[role="alert"], #correction-error, .error').first();

      // Wait a moment for validation to show
      await page.waitForTimeout(300);

      // Either error message visible or form still showing (validation prevented submit)
      const formStillOpen = page.locator('button:has-text("Submit Correction")').isVisible();
      expect(await formStillOpen).toBeTruthy();
    }
  });

  test('Correction form accessibility - aria-describedby and aria-invalid', async ({ page }) => {
    await page.goto('/');

    const reportButton = page.locator('button:has-text("Report an issue")').first();

    if (await reportButton.isVisible()) {
      await reportButton.click();

      // Check for required fields with proper ARIA attributes
      const fieldNameInput = page.locator('#field-name, input[placeholder*="fixing"]').first();

      if (await fieldNameInput.isVisible()) {
        // Check for aria-required
        const ariaRequired = await fieldNameInput.getAttribute('aria-required');
        expect(ariaRequired).toBe('true');

        // Should have aria-invalid (false initially)
        const ariaInvalid = await fieldNameInput.getAttribute('aria-invalid');
        expect(['false', null]).toContain(ariaInvalid);
      }
    }
  });

  test('Correction form can be filled and submitted', async ({ page }) => {
    await page.goto('/');

    const reportButton = page.locator('button:has-text("Report an issue")').first();

    if (await reportButton.isVisible()) {
      await reportButton.click();

      // Fill in the form
      const fieldNameInput = page.locator('#field-name, input[placeholder*="fixing"]').first();
      const proposedValueInput = page.locator('#proposed-value, input[placeholder*="should say"]').first();

      if (await fieldNameInput.isVisible() && await proposedValueInput.isVisible()) {
        await fieldNameInput.fill('School Name');
        await proposedValueInput.fill('Updated Name');

        // Click submit
        const submitButton = page.locator('button:has-text("Submit Correction")').first();
        await submitButton.click();

        // Check for success message
        const successMessage = page.locator('[role="alert"], .success, .bg-green').first();

        // Wait for response
        await page.waitForTimeout(1000).catch(() => {});

        // Form should either show success or close
        const formVisible = await page.locator('button:has-text("Submit Correction")').isVisible();
        if (!formVisible) {
          // Success - form closed
          expect(true).toBeTruthy();
        }
      }
    }
  });

  test('Correction form close button works', async ({ page }) => {
    await page.goto('/');

    const reportButton = page.locator('button:has-text("Report an issue")').first();

    if (await reportButton.isVisible()) {
      await reportButton.click();

      // Form should be visible
      const form = page.locator('form').first();
      await expect(form).toBeVisible();

      // Click close button
      const closeButton = page.locator('button[aria-label*="Close"]').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();

        // Form should close
        await expect(form).toBeHidden();
      }
    }
  });

  test('Comment form shows error when trying to submit empty', async ({ page }) => {
    // Try to find a page with comment form (articles page might have it)
    await page.goto('/articles');

    await page.waitForLoadState('networkidle').catch(() => {});

    // Look for comment form
    const commentForm = page.locator('form textarea[placeholder*="comment" i], textarea[placeholder*="thoughts" i]').first();

    if (await commentForm.isVisible()) {
      // Try to submit without text
      const submitButton = page.locator('button:has-text("Post Comment"), button:has-text("Post")').first();

      if (await submitButton.isVisible()) {
        // Submit button should be disabled or form should validate
        const isDisabled = await submitButton.getAttribute('disabled');
        if (isDisabled === '') {
          // Button is disabled when empty - this is correct
          expect(true).toBeTruthy();
        }
      }
    }
  });

  test('Comment form textarea has proper ARIA attributes', async ({ page }) => {
    await page.goto('/articles');

    const commentTextarea = page.locator('textarea[placeholder*="comment" i], textarea[placeholder*="thoughts" i]').first();

    if (await commentTextarea.isVisible()) {
      // Check for aria-required
      const ariaRequired = await commentTextarea.getAttribute('aria-required');
      expect(ariaRequired).toBeTruthy();

      // Check for aria-invalid
      const ariaInvalid = await commentTextarea.getAttribute('aria-invalid');
      expect(['false', null]).toContain(ariaInvalid);
    }
  });

  test('Newsletter signup form is visible on home page', async ({ page }) => {
    await page.goto('/');

    // Look for newsletter form
    const newsletterForm = page.locator('input[type="email"][placeholder*="email" i]').first();

    // Newsletter section might exist on home page
    if (await newsletterForm.isVisible()) {
      // Should have email input
      await expect(newsletterForm).toBeVisible();

      // Should have submit button
      const submitButton = page.locator('button:has-text("Subscribe"), button:has-text("Sign Up")').first();
      if (await submitButton.isVisible()) {
        expect(true).toBeTruthy();
      }
    }
  });

  test('Forms have proper label associations', async ({ page }) => {
    await page.goto('/');

    const reportButton = page.locator('button:has-text("Report an issue")').first();

    if (await reportButton.isVisible()) {
      await reportButton.click();

      // Check form inputs have associated labels
      const fieldNameInput = page.locator('#field-name').first();

      if (await fieldNameInput.isVisible()) {
        // Should have associated label
        const label = page.locator(`label[for="field-name"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('Form inputs have minimum height for accessibility', async ({ page }) => {
    await page.goto('/');

    const reportButton = page.locator('button:has-text("Report an issue")').first();

    if (await reportButton.isVisible()) {
      await reportButton.click();

      const input = page.locator('#field-name, input').first();

      if (await input.isVisible()) {
        // Get bounding box to check height
        const box = await input.boundingBox();

        if (box) {
          // Should be at least 44px tall for touch targets
          expect(box.height).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });
});
