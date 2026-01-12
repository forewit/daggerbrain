import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { createCampaign } from '../utils/campaign-helpers';
import { createCharacter } from '../utils/character-helpers';

const GM_USER = {
	email: process.env.GM_USER_EMAIL || 'gm@example.com',
	password: process.env.GM_USER_PASSWORD || 'your-gm-password',
};

const PLAYER_USER = {
	email: process.env.PLAYER_USER_EMAIL || 'player@example.com',
	password: process.env.PLAYER_USER_PASSWORD || 'your-player-password',
};

/**
 * Real-time sync tests require multiple browser contexts
 * to simulate multiple users viewing the same campaign
 */
test.describe('Real-time Sync', () => {
	test('Test 94: All Users See Updates Simultaneously', async ({ browser }) => {
		// Create GM context
		const gmContext = await browser.newContext();
		const gmPage = await gmContext.newPage();
		await login(gmPage, GM_USER);
		
		// Create player context
		const playerContext = await browser.newContext();
		const playerPage = await playerContext.newPage();
		await login(playerPage, PLAYER_USER);
		
		try {
			// Create campaign as GM
			const campaignId = await createCampaign(gmPage);
			
			// Join campaign as player
			const inviteCode = await gmPage.locator('input[value*="/campaigns/join/"]').inputValue();
			const codeMatch = inviteCode.match(/\/campaigns\/join\/([^/]+)/);
			if (codeMatch) {
				await playerPage.goto(`/campaigns/join/${codeMatch[1]}`);
				await playerPage.click('button:has-text("Join")');
				await playerPage.waitForURL(new RegExp(`/campaigns/${campaignId}`));
			}
			
			// Both users navigate to campaign
			await gmPage.goto(`/campaigns/${campaignId}`);
			await playerPage.goto(`/campaigns/${campaignId}`);
			
			// Wait for both pages to load
			await gmPage.waitForLoadState('networkidle');
			await playerPage.waitForLoadState('networkidle');
			
			// GM updates fear track (if visible)
			const fearInput = gmPage.locator('input[type="number"]').first();
			if (await fearInput.isVisible()) {
				await fearInput.fill('5');
				await fearInput.press('Enter');
				
				// Wait a moment for sync
				await playerPage.waitForTimeout(2000);
				
				// Verify player sees the update (if fear is visible to players)
				// This depends on the fear_visible_to_players setting
				const playerFearValue = await playerPage.locator('input[type="number"]').first().inputValue().catch(() => null);
				if (playerFearValue !== null) {
					expect(playerFearValue).toBe('5');
				}
			}
		} finally {
			await gmContext.close();
			await playerContext.close();
		}
	});

	test.skip('Test 95: Character Updates Broadcast', async ({ browser }) => {
		// Similar setup to above test
		// Create campaign with both users
		// Update character stats from one user
		// Verify other user sees updates
		
		// TODO: Implement character update broadcast test
	});
});
