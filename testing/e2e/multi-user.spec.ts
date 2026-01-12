import { test, expect } from '@playwright/test';
import { CampaignsPage } from '../utils/page-objects/campaigns';
import { CharactersPage } from '../utils/page-objects/characters';
import { generateCampaignName, generateCharacterName } from '../utils/test-data';
import { login } from '../utils/auth';
import { waitForLoading } from '../utils/helpers';

/**
 * Multi-user tests require two different user accounts
 * Configure these in your environment or test setup
 */
const GM_USER = {
	email: process.env.GM_USER_EMAIL || 'gm@test.com',
	password: process.env.GM_USER_PASSWORD || 'testpassword',
};

const PLAYER_USER = {
	email: process.env.PLAYER_USER_EMAIL || 'player@test.com',
	password: process.env.PLAYER_USER_PASSWORD || 'testpassword',
};

test.describe('Multi-User Real-time Sync', () => {
	test('Test 94: All Users See Updates Simultaneously', async ({ browser }) => {
		// Create two browser contexts for GM and Player
		const gmContext = await browser.newContext();
		const playerContext = await browser.newContext();
		
		const gmPage = await gmContext.newPage();
		const playerPage = await playerContext.newPage();
		
		// Login both users
		await login(gmPage, GM_USER);
		await login(playerPage, PLAYER_USER);
		
		// GM creates a campaign
		const campaignsPage = new CampaignsPage(gmPage);
		await campaignsPage.goto();
		const campaignName = generateCampaignName();
		const campaignId = await campaignsPage.createCampaign(campaignName);
		
		// Get invite code
		const inviteCode = await campaignsPage.getInviteCode(campaignName);
		
		// Player joins campaign
		await playerPage.goto(`/campaigns/join/${inviteCode}`);
		await waitForLoading(playerPage);
		await playerPage.locator('button:has-text("Join")').click();
		await playerPage.waitForURL(/\/campaigns\/[^/]+/, { timeout: 10000 });
		
		// Both users navigate to campaign live view
		await gmPage.goto(`/campaigns/${campaignId}/live`);
		await playerPage.goto(`/campaigns/${campaignId}/live`);
		await waitForLoading(gmPage);
		await waitForLoading(playerPage);
		
		// GM updates fear track
		const fearInput = gmPage.locator('input[type="number"]').first();
		if (await fearInput.isVisible({ timeout: 2000 }).catch(() => false)) {
			await fearInput.fill('5');
			await fearInput.press('Enter');
		}
		
		// Player should see the update in real-time (within a few seconds)
		await expect(playerPage.locator('text=5')).toBeVisible({ timeout: 5000 });
		
		await gmContext.close();
		await playerContext.close();
	});

	test('Test 71: Multiple Players Try to Claim Same Character', async ({ browser }) => {
		// This test requires GM + 2 players
		// For now, we'll demonstrate the structure
		
		const gmContext = await browser.newContext();
		const player1Context = await browser.newContext();
		const player2Context = await browser.newContext();
		
		const gmPage = await gmContext.newPage();
		const player1Page = await player1Context.newPage();
		const player2Page = await player2Context.newPage();
		
		// Login all users
		await login(gmPage, GM_USER);
		await login(player1Page, PLAYER_USER);
		// TODO: Add second player user
		
		// GM creates campaign and claimable character
		// Both players join
		// Both players try to claim simultaneously
		// Verify only one succeeds
		
		await gmContext.close();
		await player1Context.close();
		await player2Context.close();
	});
});
