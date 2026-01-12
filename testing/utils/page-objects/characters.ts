import { Page, Locator, expect } from '@playwright/test';
import { waitForStable, fillField, clickAndWaitForNavigation } from '../helpers';

/**
 * Page Object Model for Characters page
 */
export class CharactersPage {
	readonly page: Page;
	readonly createButton: Locator;
	readonly characterList: Locator;
	readonly characterCards: Locator;

	constructor(page: Page) {
		this.page = page;
		this.createButton = page.locator('button:has-text("New Character")').or(
			page.locator('button:has-text("Create")').or(
				page.locator('button:has-text("Create your first character!")')
			)
		);
		this.characterList = page.locator('[data-testid="character-list"]').or(
			page.locator('main')
		);
		this.characterCards = page.locator('[data-testid="character-card"]').or(
			page.locator('a[href^="/characters/"]')
		);
	}

	async goto(): Promise<void> {
		const response = await this.page.goto('/characters', { waitUntil: 'networkidle', timeout: 30000 });
		if (!response || !response.ok()) {
			throw new Error(`Failed to load characters page: ${response?.status()} ${response?.statusText()}`);
		}
		// Wait for any redirects to complete
		await this.page.waitForLoadState('domcontentloaded');
		// Give the page time to render Svelte components
		await this.page.waitForTimeout(2000);
	}

	async createCharacter(name: string): Promise<string> {
		// Wait for page to finish loading - look for loading indicators to disappear
		const loadingIndicator = this.page.locator('[class*="loader"], [class*="spinner"], [class*="loading"]');
		try {
			await loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 });
		} catch {
			// Loading indicator might not exist, that's okay
		}
		
		// Wait a bit more for Svelte to render
		await this.page.waitForTimeout(2000);
		
		// Check if we're authenticated - look for user menu or sign in button
		const signInButton = this.page.locator('button:has-text("Sign In")');
		if (await signInButton.isVisible({ timeout: 2000 }).catch(() => false)) {
			throw new Error('User is not authenticated - Sign In button is visible');
		}
		
		// Try to find the button with multiple strategies
		const buttonTexts = ['New Character', 'Create', 'Create your first character!'];
		let foundButton = false;
		
		for (const text of buttonTexts) {
			const button = this.page.locator(`button:has-text("${text}")`);
			if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
				await expect(button).toBeEnabled();
				await button.click();
				foundButton = true;
				break;
			}
		}
		
		if (!foundButton) {
			// Debug: get page text to see what's actually there
			const pageText = await this.page.textContent('body');
			throw new Error(`Create button not found. Page contains: ${pageText?.substring(0, 200)}...`);
		}
		await this.page.waitForTimeout(500); // Wait for dialog/form to appear
		
		// Fill in character name if there's a form
		const nameInput = this.page.locator('input[name="name"]').or(
			this.page.locator('input[placeholder*="name" i]')
		);
		if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
			await fillField(this.page, 'input[name="name"]', name);
			await this.page.locator('button[type="submit"]').or(
				this.page.locator('button:has-text("Create")')
			).click();
		}
		
		// Wait for navigation to character edit page
		await this.page.waitForURL(/\/characters\/[^/]+\/edit/, { timeout: 10000 });
		const url = this.page.url();
		const characterId = url.match(/\/characters\/([^/]+)\/edit/)?.[1];
		if (!characterId) {
			throw new Error('Could not extract character ID from URL');
		}
		return characterId;
	}

	async getCharacterCount(): Promise<number> {
		await waitForStable(this.page, 'main', 5000);
		const count = await this.characterCards.count();
		return count;
	}

	async findCharacter(name: string): Promise<Locator | null> {
		const character = this.characterCards.filter({ hasText: name }).first();
		if (await character.isVisible({ timeout: 2000 }).catch(() => false)) {
			return character;
		}
		return null;
	}

	async deleteCharacter(name: string): Promise<void> {
		const character = await this.findCharacter(name);
		if (!character) {
			throw new Error(`Character "${name}" not found`);
		}
		
		// Hover to reveal delete button, or click menu
		await character.hover();
		const deleteButton = this.page.locator(`button:has-text("Delete")`).or(
			this.page.locator(`[aria-label*="delete" i]`)
		).first();
		await deleteButton.click();
		
		// Confirm deletion
		const confirmButton = this.page.locator('button:has-text("Confirm")').or(
			this.page.locator('button:has-text("Delete")').filter({ hasText: /confirm|delete/i })
		);
		await confirmButton.click();
		
		// Wait for character to be removed
		await this.page.waitForTimeout(1000);
	}

	async openCharacter(name: string): Promise<void> {
		const character = await this.findCharacter(name);
		if (!character) {
			throw new Error(`Character "${name}" not found`);
		}
		await character.click();
		await this.page.waitForLoadState('networkidle');
	}
}
