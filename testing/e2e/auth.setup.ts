import { test as setup } from '@playwright/test';
import { clerk } from '@clerk/testing/playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths for auth state files (relative to testing directory)
const authDir = path.join(__dirname, '..', '.auth');
const testUserAuthFile = path.join(authDir, 'test-user.json');
const gmUserAuthFile = path.join(authDir, 'gm-user.json');
const playerUserAuthFile = path.join(authDir, 'player-user.json');

/**
 * Auth state setup for Playwright tests
 * 
 * This file creates authenticated sessions for test users and saves them
 * to storage files that can be reused across tests. This eliminates the
 * need to authenticate in every test, improving performance.
 * 
 * To use a pre-authenticated state in a test:
 *   test.use({ storageState: '.auth/test-user.json' })
 */

// Test user authentication
setup('authenticate test user', async ({ page }) => {
	const email = process.env.TEST_USER_EMAIL;
	const password = process.env.TEST_USER_PASSWORD;
	
	if (!email || !password) {
		console.warn('TEST_USER_EMAIL or TEST_USER_PASSWORD not set, skipping test user auth state');
		return;
	}
	
	console.log(`[Auth Setup] Authenticating test user: ${email}`);
	
	// Navigate to home page to load Clerk
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForTimeout(1000);
	
	// Sign in using Clerk helper
	await clerk.signIn({
		page,
		signInParams: {
			strategy: 'password',
			identifier: email,
			password: password,
		},
	});
	
	// Wait for authentication to be processed
	await page.waitForTimeout(2000);
	await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
	
	// Verify authentication by accessing a protected route
	await page.goto('/characters', { waitUntil: 'networkidle', timeout: 15000 });
	
	const url = page.url();
	if (url.includes('/sign-in') || url.includes('/sign-up') || url.includes('accounts.dev')) {
		throw new Error(`Failed to authenticate test user - redirected to ${url}`);
	}
	
	// Save auth state
	await page.context().storageState({ path: testUserAuthFile });
	console.log(`[Auth Setup] Test user auth state saved to ${testUserAuthFile}`);
});

// GM user authentication (for multi-user tests)
setup('authenticate GM user', async ({ page }) => {
	const email = process.env.GM_USER_EMAIL;
	const password = process.env.GM_USER_PASSWORD;
	
	if (!email || !password) {
		console.warn('GM_USER_EMAIL or GM_USER_PASSWORD not set, skipping GM user auth state');
		return;
	}
	
	console.log(`[Auth Setup] Authenticating GM user: ${email}`);
	
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForTimeout(1000);
	
	await clerk.signIn({
		page,
		signInParams: {
			strategy: 'password',
			identifier: email,
			password: password,
		},
	});
	
	await page.waitForTimeout(2000);
	await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
	
	await page.goto('/characters', { waitUntil: 'networkidle', timeout: 15000 });
	
	const url = page.url();
	if (url.includes('/sign-in') || url.includes('/sign-up') || url.includes('accounts.dev')) {
		throw new Error(`Failed to authenticate GM user - redirected to ${url}`);
	}
	
	await page.context().storageState({ path: gmUserAuthFile });
	console.log(`[Auth Setup] GM user auth state saved to ${gmUserAuthFile}`);
});

// Player user authentication (for multi-user tests)
setup('authenticate player user', async ({ page }) => {
	const email = process.env.PLAYER_USER_EMAIL;
	const password = process.env.PLAYER_USER_PASSWORD;
	
	if (!email || !password) {
		console.warn('PLAYER_USER_EMAIL or PLAYER_USER_PASSWORD not set, skipping player user auth state');
		return;
	}
	
	console.log(`[Auth Setup] Authenticating player user: ${email}`);
	
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForTimeout(1000);
	
	await clerk.signIn({
		page,
		signInParams: {
			strategy: 'password',
			identifier: email,
			password: password,
		},
	});
	
	await page.waitForTimeout(2000);
	await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
	
	await page.goto('/characters', { waitUntil: 'networkidle', timeout: 15000 });
	
	const url = page.url();
	if (url.includes('/sign-in') || url.includes('/sign-up') || url.includes('accounts.dev')) {
		throw new Error(`Failed to authenticate player user - redirected to ${url}`);
	}
	
	await page.context().storageState({ path: playerUserAuthFile });
	console.log(`[Auth Setup] Player user auth state saved to ${playerUserAuthFile}`);
});
