import { Page, Locator, expect } from '@playwright/test';

/**
 * General test helpers and utilities
 */

/**
 * Wait for element to be visible and stable
 */
export async function waitForStable(
	page: Page,
	selector: string,
	timeout = 5000
): Promise<Locator> {
	const locator = page.locator(selector);
	await locator.waitFor({ state: 'visible', timeout });
	// Wait a bit more for any animations/transitions
	await page.waitForTimeout(200);
	return locator;
}

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, urlPattern?: RegExp): Promise<void> {
	if (urlPattern) {
		await page.waitForURL(urlPattern, { timeout: 10000 });
	} else {
		await page.waitForLoadState('networkidle');
	}
}

/**
 * Click and wait for navigation
 */
export async function clickAndWaitForNavigation(
	page: Page,
	locator: Locator,
	urlPattern?: RegExp
): Promise<void> {
	await Promise.all([
		waitForNavigation(page, urlPattern),
		locator.click(),
	]);
}

/**
 * Fill form field and verify value
 */
export async function fillField(
	page: Page,
	selector: string,
	value: string,
	options?: { clear?: boolean }
): Promise<void> {
	const field = page.locator(selector);
	await field.waitFor({ state: 'visible' });
	if (options?.clear) {
		await field.clear();
	}
	await field.fill(value);
	// Verify the value was set
	await expect(field).toHaveValue(value);
}

/**
 * Select option from dropdown
 */
export async function selectOption(
	page: Page,
	selector: string,
	value: string
): Promise<void> {
	const select = page.locator(selector);
	await select.waitFor({ state: 'visible' });
	await select.selectOption(value);
}

/**
 * Upload file
 */
export async function uploadFile(
	page: Page,
	fileInputSelector: string,
	filePath: string
): Promise<void> {
	const fileInput = page.locator(fileInputSelector);
	await fileInput.setInputFiles(filePath);
}

/**
 * Wait for toast notification
 */
export async function waitForToast(
	page: Page,
	message?: string,
	timeout = 5000
): Promise<void> {
	if (message) {
		await page.waitForSelector(`text=${message}`, { timeout });
	} else {
		// Wait for any toast to appear
		await page.waitForSelector('[role="alert"]', { timeout });
	}
}

/**
 * Check for error message
 */
export async function expectError(
	page: Page,
	errorText: string | RegExp
): Promise<void> {
	const errorLocator = page.locator(`text=${errorText}`).or(
		page.locator('[role="alert"]:has-text("' + errorText + '")')
	);
	await expect(errorLocator).toBeVisible({ timeout: 5000 });
}

/**
 * Check for success message
 */
export async function expectSuccess(
	page: Page,
	successText?: string | RegExp
): Promise<void> {
	if (successText) {
		const successLocator = page.locator(`text=${successText}`).or(
			page.locator('[role="alert"]:has-text("' + successText + '")')
		);
		await expect(successLocator).toBeVisible({ timeout: 5000 });
	} else {
		// Just check that no error is visible
		const errorLocator = page.locator('[role="alert"]:has-text("error")');
		await expect(errorLocator).not.toBeVisible({ timeout: 2000 });
	}
}

/**
 * Wait for loading to complete
 */
export async function waitForLoading(page: Page): Promise<void> {
	// Wait for loading spinners to disappear
	await page.waitForSelector('[data-testid="loading"]', { state: 'hidden', timeout: 10000 }).catch(() => {});
	await page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 10000 }).catch(() => {});
	await page.waitForLoadState('networkidle');
}

/**
 * Get text content safely
 */
export async function getTextContent(
	locator: Locator,
	timeout = 5000
): Promise<string> {
	await locator.waitFor({ state: 'visible', timeout });
	return (await locator.textContent()) || '';
}

/**
 * Check if element exists
 */
export async function elementExists(
	page: Page,
	selector: string,
	timeout = 2000
): Promise<boolean> {
	try {
		await page.waitForSelector(selector, { timeout, state: 'visible' });
		return true;
	} catch {
		return false;
	}
}
