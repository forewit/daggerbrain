import { Page, expect } from '@playwright/test';
import { clickButton, waitForPageReady, waitForToast } from './page-helpers';
import { generateCampaignName } from '../fixtures/test-data';

/**
 * Campaign-specific test helpers
 */

/**
 * Navigate to campaigns page
 */
export async function goToCampaigns(page: Page): Promise<void> {
	await page.goto('/campaigns');
	await waitForPageReady(page);
}

/**
 * Create a new campaign
 */
export async function createCampaign(
	page: Page,
	options?: {
		name?: string;
		description?: string;
		displayName?: string;
	}
): Promise<string> {
	await goToCampaigns(page);
	
	// Click create campaign button
	await clickButton(page, 'Create Campaign');
	await waitForPageReady(page);
	
	// Fill in campaign name
	const name = options?.name || generateCampaignName();
	await page.fill('input[name="name"], input[placeholder*="name" i]', name);
	
	// Fill in description if provided
	if (options?.description) {
		await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', options.description);
	}
	
	// Fill in display name if provided
	if (options?.displayName) {
		await page.fill('input[name="display_name"], input[placeholder*="display" i]', options.displayName);
	}
	
	// Submit form
	await clickButton(page, 'Create');
	
	// Wait for navigation to campaign page
	await page.waitForURL(/\/campaigns\/[^/]+/, { timeout: 10000 });
	
	// Extract campaign ID from URL
	const url = page.url();
	const match = url.match(/\/campaigns\/([^/]+)/);
	if (!match) {
		throw new Error('Could not extract campaign ID from URL');
	}
	
	return match[1];
}

/**
 * Join a campaign via invite link
 */
export async function joinCampaign(page: Page, inviteCode: string, displayName?: string): Promise<void> {
	await page.goto(`/campaigns/join/${inviteCode}`);
	await waitForPageReady(page);
	
	// Fill in display name if provided
	if (displayName) {
		await page.fill('input[name="display_name"], input[placeholder*="name" i]', displayName);
	}
	
	// Click join button
	await clickButton(page, 'Join');
	
	// Wait for navigation to campaign page
	await page.waitForURL(/\/campaigns\/[^/]+/, { timeout: 10000 });
}

/**
 * Get campaign invite code (as GM)
 */
export async function getCampaignInviteCode(page: Page, campaignId: string): Promise<string> {
	await page.goto(`/campaigns/${campaignId}`);
	await waitForPageReady(page);
	
	// Find invite link input or text
	const inviteInput = page.locator('input[readonly][value*="/campaigns/join/"]').first();
	if (await inviteInput.isVisible()) {
		const value = await inviteInput.inputValue();
		const match = value.match(/\/campaigns\/join\/([^/]+)/);
		if (match) {
			return match[1];
		}
	}
	
	// Alternative: look for invite code in text
	const inviteText = page.locator('text=/campaigns\\/join\\/[A-Za-z0-9]+/').first();
	if (await inviteText.isVisible()) {
		const text = await inviteText.textContent();
		const match = text?.match(/\/campaigns\/join\/([^/]+)/);
		if (match) {
			return match[1];
		}
	}
	
	throw new Error('Could not find invite code');
}

/**
 * Reset campaign invite code (as GM)
 */
export async function resetInviteCode(page: Page, campaignId: string): Promise<string> {
	await page.goto(`/campaigns/${campaignId}`);
	await waitForPageReady(page);
	
	// Find and click reset invite code button
	const resetButton = page.locator('button:has-text("Reset"), button[aria-label*="reset" i]').first();
	await resetButton.click();
	
	// Confirm reset if there's a confirmation dialog
	const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Reset")').first();
	if (await confirmButton.isVisible()) {
		await confirmButton.click();
	}
	
	// Wait for success message
	await waitForToast(page, /reset|success/i);
	
	// Get new invite code
	return await getCampaignInviteCode(page, campaignId);
}

/**
 * Check if user is GM of campaign
 */
export async function isGM(page: Page, campaignId: string): Promise<boolean> {
	await page.goto(`/campaigns/${campaignId}`);
	await waitForPageReady(page);
	
	// Look for GM-only UI elements
	const gmOnlyElements = [
		'button:has-text("Reset Invite")',
		'button:has-text("Delete Campaign")',
		'[data-testid="gm-controls"]',
	];
	
	for (const selector of gmOnlyElements) {
		if (await page.locator(selector).isVisible()) {
			return true;
		}
	}
	
	return false;
}
