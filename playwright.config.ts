import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = 'http://localhost:7990/bitbucket';

const webServer = process.env.CI ? {
  command: 'npm run start:bitbucket',
  url: BASE_URL,
  reuseExistingServer: true,
  timeout: 120 * 1000, // 2 minutes
  stdout: 'pipe',
} : undefined;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/main/tests/integration',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['junit', { outputFile: './test-reports/jest-integration-tests-report.xml' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,

    screenshot: 'only-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Match minimum supported resolution */
    viewport: { width: 1024, height: 768 },
  },

  /* Match against supported browsers */
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome', storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge', storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],

  /* Run your local dev server before starting the tests */
  // @ts-ignore -- TS doesn't do deep inference and the type is not exported anymore
  webServer,
});
