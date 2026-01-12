import { test, expect } from '@playwright/test';
import { login, logout, isAuthenticated } from '../utils/auth';

const TEST_USER = {
	email: process.env.TEST_USER_EMAIL || 'test@example.com',
	password: process.env.TEST_USER_PASSWORD || 'testpassword',
};

test.describe('Authentication', () => {
	// Ensure these tests start with a clean state (no auth)
	test.use({ storageState: { cookies: [], origins: [] } });
	
	test('Sign in with email and password', async ({ page, context }) => {
		// Clear any existing cookies/auth state to ensure clean start
		await context.clearCookies();
		
		// Start from home page
		await page.goto('/', { waitUntil: 'networkidle' });
		
		// Verify we're not authenticated initially
		const initiallyAuthenticated = await isAuthenticated(page);
		expect(initiallyAuthenticated).toBe(false);
		
		// Test the login function
		await login(page, TEST_USER);
		
		// Verify we can access a protected route
		await page.goto('/characters', { waitUntil: 'domcontentloaded', timeout: 15000 });
		
		// Should not be redirected to sign-in
		expect(page.url()).not.toContain('/sign-in');
		expect(page.url()).not.toContain('/sign-up');
		expect(page.url()).not.toContain('accounts.dev');
		
		// Should be on a protected page
		expect(page.url()).toMatch(/\/(characters|campaigns|homebrew)/);
		
		// Verify authentication state - this is the primary verification
		// The UI elements (UserButton) may take time to render, so we rely on route access
		const isAuth = await isAuthenticated(page);
		expect(isAuth).toBe(true);
	});

	test('Accessing protected route redirects to sign-in when not authenticated', async ({ page, context }) => {
		// Clear any existing cookies/auth state
		await context.clearCookies();
		
		// Navigate to home page first
		await page.goto('/', { waitUntil: 'networkidle' });
		
		// Try to access a protected route
		await page.goto('/characters', { waitUntil: 'networkidle', timeout: 15000 });
		
		// Should be redirected to sign-in
		const url = page.url();
		expect(url).toMatch(/sign-in|accounts\.dev/);
	});

	test('Can sign out after signing in', async ({ page, context }) => {
		// Clear any existing cookies/auth state to ensure clean start
		await context.clearCookies();
		
		// Sign in first
		await login(page, TEST_USER);
		
		// Verify we're authenticated
		expect(await isAuthenticated(page)).toBe(true);
		
		// Sign out
		await logout(page);
		
		// Verify we're no longer authenticated
		await page.goto('/', { waitUntil: 'networkidle' });
		const isAuth = await isAuthenticated(page);
		expect(isAuth).toBe(false);
		
		// Verify we can't access protected routes
		await page.goto('/characters', { waitUntil: 'networkidle', timeout: 15000 });
		const url = page.url();
		expect(url).toMatch(/sign-in|accounts\.dev/);
	});
});
