import { test, expect } from '@playwright/test';
import { CampaignsPage } from '../utils/page-objects/campaigns';
import { createTestCampaign, generateCampaignName } from '../utils/test-data';
import { login } from '../utils/auth';
import { waitForLoading } from '../utils/helpers';

// TODO: Configure test users
const TEST_USER = {
	email: process.env.TEST_USER_EMAIL || 'test@example.com',
	password: process.env.TEST_USER_PASSWORD || 'testpassword',
};

test.describe('Campaigns', () => {
	test.beforeEach(async ({ page }) => {
		await login(page, TEST_USER);
	});

	test('Test 19: Create a Basic Campaign', async ({ page }) => {
		const campaignsPage = new CampaignsPage(page);
		await campaignsPage.goto();
		
		const campaignName = generateCampaignName();
		const campaignId = await campaignsPage.createCampaign(campaignName);
		
		// Verify we're on the campaign page
		expect(page.url()).toContain(`/campaigns/${campaignId}`);
		
		// Verify campaign name appears on page
		await expect(page.locator(`text=${campaignName}`)).toBeVisible();
		
		// Verify user is listed as GM
		await expect(page.locator('text=/GM|Game Master/i')).toBeVisible();
		
		// Verify invite code exists (check for invite link)
		const inviteInput = page.locator('input[readonly]').filter({ 
			hasText: /campaigns\/join/
		});
		await expect(inviteInput).toBeVisible({ timeout: 5000 });
	});

	test('Test 20: Create Campaign with Description', async ({ page }) => {
		const campaignsPage = new CampaignsPage(page);
		await campaignsPage.goto();
		
		const campaignName = generateCampaignName();
		const description = 'This is a test campaign description';
		
		await campaignsPage.createCampaign(campaignName, description);
		
		// Verify description appears on page
		await expect(page.locator(`text=${description}`)).toBeVisible();
	});

	test('Test 42: Join via Invite Link', async ({ page, browser }) => {
		// This test requires two users - GM and player
		// For now, we'll test with one user creating and getting invite link
		
		const campaignsPage = new CampaignsPage(page);
		await campaignsPage.goto();
		
		// Create campaign as GM
		const campaignName = generateCampaignName();
		await campaignsPage.createCampaign(campaignName);
		
		// Get invite code
		const inviteCode = await campaignsPage.getInviteCode(campaignName);
		
		// Create a new context for "player" (in real test, this would be a different user)
		const playerContext = await browser.newContext();
		const playerPage = await playerContext.newPage();
		
		// Navigate to invite link
		await playerPage.goto(`/campaigns/join/${inviteCode}`);
		await waitForLoading(playerPage);
		
		// Verify campaign info is visible
		await expect(playerPage.locator(`text=${campaignName}`)).toBeVisible();
		
		// Click join button
		const joinButton = playerPage.locator('button:has-text("Join")');
		await joinButton.click();
		
		// Wait for join to complete
		await playerPage.waitForURL(/\/campaigns\/[^/]+/, { timeout: 10000 });
		
		// Verify player is now on campaign page
		expect(playerPage.url()).toContain('/campaigns/');
		
		await playerContext.close();
	});
});
