import { Page } from '@playwright/test';
import { clerk } from '@clerk/testing/playwright';

export interface TestUser {
	email: string;
	password: string;
}

/**
 * Login a user using Clerk's testing helper
 * 
 * This uses the recommended approach from Clerk docs:
 * - Navigate to an unprotected page that loads Clerk
 * - Use clerk.signIn() helper which handles authentication programmatically
 * - Verify authentication by accessing a protected route
 * 
 * @param page - Playwright page object
 * @param user - User credentials (email and password)
 */
export async function login(page: Page, user: TestUser): Promise<void> {
	// Check if already authenticated
	const testResponse = await page.goto('/characters', { waitUntil: 'networkidle', timeout: 10000 }).catch(() => null);
	const testUrl = page.url();
	
	if (testResponse && testUrl.includes('/characters') && !testUrl.includes('/sign-in') && !testUrl.includes('/sign-up') && !testUrl.includes('accounts.dev')) {
		return; // Already authenticated
	}
	
	// Navigate to home page to load Clerk (required before clerk.signIn())
	await page.goto('/', { waitUntil: 'networkidle', timeout: 15000 });
	await page.waitForTimeout(1000); // Brief wait for Clerk to initialize
	
	// Sign in using Clerk helper
	await clerk.signIn({
		page,
		signInParams: {
			strategy: 'password',
			identifier: user.email,
			password: user.password,
		},
	});
	
	// Wait for authentication to be processed
	await page.waitForTimeout(2000);
	await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
	
	// Verify authentication by accessing a protected route
	const protectedResponse = await page.goto('/characters', { 
		waitUntil: 'networkidle', 
		timeout: 20000 
	});
	
	if (!protectedResponse) {
		throw new Error('Failed to load protected route after authentication');
	}
	
	const finalUrl = page.url();
	if (finalUrl.includes('/sign-in') || finalUrl.includes('/sign-up') || finalUrl.includes('accounts.dev')) {
		throw new Error(`Authentication failed - redirected to ${finalUrl}`);
	}
}

/**
 * Logout current user using Clerk's testing helper
 */
export async function logout(page: Page): Promise<void> {
	// Navigate to an unprotected page that loads Clerk (required by Clerk)
	await page.goto('/', { waitUntil: 'networkidle' });
	
	try {
		await clerk.signOut({ page });
		await page.waitForTimeout(1000);
	} catch (error: any) {
		// Fallback: clear cookies manually
		console.warn('[Auth] clerk.signOut() failed, clearing cookies manually');
	}
	
	// Clear all cookies to ensure complete logout
	await page.context().clearCookies();
}

/**
 * Check if user is authenticated by trying to access a protected route
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
	try {
		const currentUrl = page.url();
		await page.goto('/characters', { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
		const newUrl = page.url();
		
		// If redirected to sign-in, not authenticated
		if (newUrl.includes('/sign-in') || newUrl.includes('/sign-up') || newUrl.includes('accounts.dev')) {
			if (currentUrl !== newUrl) {
				await page.goto(currentUrl, { waitUntil: 'domcontentloaded' }).catch(() => {});
			}
			return false;
		}
		
		// If on protected route, authenticated
		if (newUrl.includes('/characters') || newUrl.includes('/campaigns') || newUrl.includes('/homebrew')) {
			if (currentUrl !== newUrl && !currentUrl.includes('/characters') && !currentUrl.includes('/campaigns') && !currentUrl.includes('/homebrew')) {
				await page.goto(currentUrl, { waitUntil: 'domcontentloaded' }).catch(() => {});
			}
			return true;
		}
		
		return false;
	} catch {
		return false;
	}
}
