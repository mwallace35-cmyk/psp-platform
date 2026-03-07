import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Testing Configuration
 *
 * To run tests locally:
 *   npm run test:e2e                 # Run all tests
 *   npm run test:e2e -- --ui         # Run tests with UI mode
 *   npm run test:e2e -- --debug      # Run tests in debug mode
 *   npm run test:e2e --  e2e/navigation.spec.ts  # Run specific test file
 *
 * Add to package.json scripts:
 *   "test:e2e": "playwright test",
 *   "test:e2e:ui": "playwright test --ui",
 *   "test:e2e:debug": "playwright test --debug",
 */

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
