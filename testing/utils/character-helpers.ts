import { Page, expect } from '@playwright/test';
import { clickButton, waitForPageReady, waitForToast } from './page-helpers';
import { generateCharacterName } from '../fixtures/test-data';

/**
 * Character-specific test helpers
 */

/**
 * Navigate to characters page
 */
export async function goToCharacters(page: Page): Promise<void> {
	await page.goto('/characters');
	await waitForPageReady(page);
}

/**
 * Create a new character
 */
export async function createCharacter(
	page: Page,
	options?: {
		name?: string;
		campaignId?: string;
		claimable?: boolean;
	}
): Promise<string> {
	await goToCharacters(page);
	
	// Click create character button
	await clickButton(page, 'Create Character');
	await waitForPageReady(page);
	
	// If name is provided, fill it in
	if (options?.name) {
		await page.fill('input[name="name"], input[placeholder*="name" i]', options.name);
	}
	
	// Save character
	await clickButton(page, 'Save');
	
	// Wait for navigation to character edit page or success message
	await page.waitForURL(/\/characters\/[^/]+\/edit/, { timeout: 10000 });
	
	// Extract character ID from URL
	const url = page.url();
	const match = url.match(/\/characters\/([^/]+)\/edit/);
	if (!match) {
		throw new Error('Could not extract character ID from URL');
	}
	
	return match[1];
}

/**
 * Delete a character
 */
export async function deleteCharacter(page: Page, characterId: string): Promise<void> {
	await page.goto(`/characters/${characterId}/edit`);
	await waitForPageReady(page);
	
	// Find and click delete button
	const deleteButton = page.locator('button:has-text("Delete"), button[aria-label*="delete" i]').first();
	await deleteButton.click();
	
	// Confirm deletion if there's a confirmation dialog
	const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Delete")').first();
	if (await confirmButton.isVisible()) {
		await confirmButton.click();
	}
	
	// Wait for redirect to characters list
	await page.waitForURL('/characters', { timeout: 10000 });
}

/**
 * Update character name
 */
export async function updateCharacterName(page: Page, characterId: string, newName: string): Promise<void> {
	await page.goto(`/characters/${characterId}/edit`);
	await waitForPageReady(page);
	
	const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
	await nameInput.fill(newName);
	
	// Save changes (may auto-save or need explicit save)
	const saveButton = page.locator('button:has-text("Save")').first();
	if (await saveButton.isVisible()) {
		await saveButton.click();
		await waitForToast(page, /saved|success/i);
	}
}

/**
 * Check if character exists in list
 */
export async function characterExistsInList(page: Page, characterName: string): Promise<boolean> {
	await goToCharacters(page);
	const characterCard = page.locator(`text=${characterName}`).first();
	return await characterCard.isVisible();
}

/**
 * Get character count
 */
export async function getCharacterCount(page: Page): Promise<number> {
	await goToCharacters(page);
	const characterCards = page.locator('[data-testid="character-card"], .character-card').or(
		page.locator('a[href*="/characters/"]')
	);
	return await characterCards.count();
}
