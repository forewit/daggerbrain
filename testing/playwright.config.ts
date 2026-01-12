import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file from testing directory or parent directory
config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '..', '.env') });

/**
 * Playwright configuration for E2E tests
 * 
 * Tests run against the application via URL (local dev or deployed)
 * Set BASE_URL environment variable to point to your app (or in .env file)
 */
export default defineConfig({
	testDir: './e2e',
	/* Global setup file for Clerk authentication */
	globalSetup: './global.setup.ts',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: process.env.BASE_URL || 'http://localhost:8787',
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
		/* Screenshot on failure */
		screenshot: 'only-on-failure',
		/* Video on failure */
		video: 'retain-on-failure',
	},

	/* Configure projects for major browsers */
	projects: [
		/* Setup project - runs first to authenticate users and save auth state */
		{
			name: 'setup',
			testMatch: /.*\.setup\.ts/,
		},

		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['setup'],
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
			dependencies: ['setup'],
		},

		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
			dependencies: ['setup'],
		},

		/* Test against mobile viewports. */
		{
			name: 'Mobile Chrome',
			use: { ...devices['Pixel 5'] },
			dependencies: ['setup'],
		},
		{
			name: 'Mobile Safari',
			use: { ...devices['iPhone 12'] },
			dependencies: ['setup'],
		},
	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'cd ../daggerbrain && bun run dev:wrangler',
	//   url: 'http://localhost:8788',
	//   reuseExistingServer: !process.env.CI,
	//   timeout: 120 * 1000,
	// },
});
