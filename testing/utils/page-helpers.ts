import { Page, Locator, expect } from '@playwright/test';

/**
 * Page helper utilities for common interactions
 */

/**
 * Wait for page to be fully loaded and ready
 */
export async function waitForPageReady(page: Page): Promise<void> {
	await page.waitForLoadState('networkidle');
	await page.waitForLoadState('domcontentloaded');
}

/**
 * Wait for a toast notification to appear
 */
export async function waitForToast(page: Page, text?: string | RegExp): Promise<Locator> {
	const toast = page.locator('[role="status"], [data-sonner-toast]').first();
	if (text) {
		await expect(toast).toContainText(text);
	} else {
		await expect(toast).toBeVisible();
	}
	return toast;
}

/**
 * Wait for an error message to appear
 */
export async function waitForError(page: Page, text?: string): Promise<Locator> {
	const error = page.locator('[role="alert"], .error, [data-error]').first();
	if (text) {
		await expect(error).toContainText(text);
	} else {
		await expect(error).toBeVisible();
	}
	return error;
}

/**
 * Click a button by text
 */
export async function clickButton(page: Page, text: string): Promise<void> {
	await page.click(`button:has-text("${text}")`);
}

/**
 * Fill a form field by label
 */
export async function fillField(page: Page, label: string, value: string): Promise<void> {
	const field = page.locator(`label:has-text("${label}")`).locator('..').locator('input, textarea').first();
	await field.fill(value);
}

/**
 * Check if element is visible
 */
export async function isVisible(page: Page, selector: string): Promise<boolean> {
	const count = await page.locator(selector).count();
	if (count === 0) return false;
	return await page.locator(selector).first().isVisible();
}

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, url?: string | RegExp): Promise<void> {
	if (url) {
		await page.waitForURL(url);
	} else {
		await page.waitForLoadState('networkidle');
	}
}

/**
 * Get text content of an element
 */
export async function getText(page: Page, selector: string): Promise<string> {
	return await page.locator(selector).first().textContent() || '';
}

/**
 * Check if text is visible on page
 */
export async function hasText(page: Page, text: string): Promise<boolean> {
	const locator = page.locator(`text=${text}`);
	return (await locator.count()) > 0 && await locator.first().isVisible();
}
