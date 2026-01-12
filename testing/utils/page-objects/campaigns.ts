import { Page, Locator, expect } from '@playwright/test';
import { waitForStable, fillField } from '../helpers';

/**
 * Page Object Model for Campaigns page
 */
export class CampaignsPage {
	readonly page: Page;
	readonly createButton: Locator;
	readonly campaignList: Locator;
	readonly campaignCards: Locator;

	constructor(page: Page) {
		this.page = page;
		this.createButton = page.locator('button:has-text("Create Campaign")').or(
			page.locator('button:has-text("New Campaign")')
		);
		this.campaignList = page.locator('[data-testid="campaign-list"]').or(
			page.locator('main')
		);
		this.campaignCards = page.locator('[data-testid="campaign-card"]').or(
			page.locator('a[href^="/campaigns/"]')
		);
	}

	async goto(): Promise<void> {
		await this.page.goto('/campaigns');
		await this.page.waitForLoadState('networkidle');
	}

	async createCampaign(name: string, description?: string): Promise<string> {
		await this.createButton.click();
		await this.page.waitForTimeout(500); // Wait for dialog to appear
		
		// Fill in campaign name
		await fillField(this.page, 'input[name="name"]', name);
		
		// Fill in description if provided
		if (description) {
			await fillField(this.page, 'textarea[name="description"]', description);
		}
		
		// Submit form
		await this.page.locator('button[type="submit"]').or(
			this.page.locator('button:has-text("Create")')
		).click();
		
		// Wait for navigation to campaign page
		await this.page.waitForURL(/\/campaigns\/[^/]+/, { timeout: 10000 });
		const url = this.page.url();
		const campaignId = url.match(/\/campaigns\/([^/]+)/)?.[1];
		if (!campaignId) {
			throw new Error('Could not extract campaign ID from URL');
		}
		return campaignId;
	}

	async findCampaign(name: string): Promise<Locator | null> {
		const campaign = this.campaignCards.filter({ hasText: name }).first();
		if (await campaign.isVisible({ timeout: 2000 }).catch(() => false)) {
			return campaign;
		}
		return null;
	}

	async openCampaign(name: string): Promise<void> {
		const campaign = await this.findCampaign(name);
		if (!campaign) {
			throw new Error(`Campaign "${name}" not found`);
		}
		await campaign.click();
		await this.page.waitForLoadState('networkidle');
	}

	async getInviteCode(campaignName: string): Promise<string> {
		await this.openCampaign(campaignName);
		
		// Find invite link/code (adjust selector based on your UI)
		const inviteInput = this.page.locator('input[readonly]').filter({ 
			hasText: /campaigns\/join/
		}).or(
			this.page.locator('[data-testid="invite-link"]')
		);
		
		await inviteInput.waitFor({ state: 'visible', timeout: 5000 });
		const inviteUrl = await inviteInput.inputValue();
		const inviteCode = inviteUrl.match(/\/join\/([^/]+)/)?.[1];
		
		if (!inviteCode) {
			throw new Error('Could not extract invite code');
		}
		
		return inviteCode;
	}
}
