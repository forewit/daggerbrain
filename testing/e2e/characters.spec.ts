import { test, expect } from '@playwright/test';
import { CharactersPage } from '../utils/page-objects/characters';
import { createTestCharacter, generateCharacterName } from '../utils/test-data';
import { login } from '../utils/auth';
import { waitForLoading } from '../utils/helpers';

// TODO: Configure test users
const TEST_USER = {
	email: process.env.TEST_USER_EMAIL || 'test@example.com',
	password: process.env.TEST_USER_PASSWORD || 'testpassword',
};

test.describe('Characters', () => {
	test.beforeEach(async ({ page }) => {
		// Login before each test
		await login(page, TEST_USER);
	});

	test('Test 1: Create a Standalone Character', async ({ page }) => {
		const charactersPage = new CharactersPage(page);
		await charactersPage.goto();
		
		const characterName = generateCharacterName();
		const characterId = await charactersPage.createCharacter(characterName);
		
		// Verify we're on the character edit page
		expect(page.url()).toContain(`/characters/${characterId}/edit`);
		
		// Go back to characters list
		await charactersPage.goto();
		await waitForLoading(page);
		
		// Verify character appears in list
		const character = await charactersPage.findCharacter(characterName);
		expect(character).not.toBeNull();
		
		// Verify character is not assigned to a campaign
		// (This would require checking the character's data or UI)
	});

	test('Test 5: Character Limit Enforcement', async ({ page }) => {
		const charactersPage = new CharactersPage(page);
		await charactersPage.goto();
		
		// Create 3 characters (the limit)
		const characterNames: string[] = [];
		for (let i = 0; i < 3; i++) {
			const name = generateCharacterName(`Limit Test ${i + 1}`);
			await charactersPage.createCharacter(name);
			characterNames.push(name);
			await charactersPage.goto();
			await waitForLoading(page);
		}
		
		// Verify we have 3 characters
		const count = await charactersPage.getCharacterCount();
		expect(count).toBe(3);
		
		// Try to create a 4th character
		await charactersPage.createButton.click();
		
		// Should see error message about character limit
		await expect(page.locator('text=/character limit/i')).toBeVisible({ timeout: 5000 });
		
		// Delete one character
		await charactersPage.deleteCharacter(characterNames[0]);
		await waitForLoading(page);
		
		// Now should be able to create a new character
		const newName = generateCharacterName('After Delete');
		await charactersPage.createCharacter(newName);
		expect(page.url()).toContain('/characters/');
	});

	test('Test 6: Basic Character Updates', async ({ page }) => {
		const charactersPage = new CharactersPage(page);
		await charactersPage.goto();
		
		// Create a character
		const characterName = generateCharacterName();
		await charactersPage.createCharacter(characterName);
		
		// Update character name
		const newName = generateCharacterName('Updated');
		const nameInput = page.locator('input[name="name"]').or(
			page.locator('input[placeholder*="name" i]')
		);
		if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
			await nameInput.fill(newName);
			await nameInput.press('Enter'); // Or click save button
		}
		
		// Refresh page
		await page.reload();
		await waitForLoading(page);
		
		// Verify name persisted
		const updatedNameInput = page.locator('input[name="name"]');
		if (await updatedNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
			const value = await updatedNameInput.inputValue();
			expect(value).toContain(newName);
		}
	});

	test('Test 9: Delete a Standalone Character', async ({ page }) => {
		const charactersPage = new CharactersPage(page);
		await charactersPage.goto();
		
		// Create a character
		const characterName = generateCharacterName();
		await charactersPage.createCharacter(characterName);
		await charactersPage.goto();
		await waitForLoading(page);
		
		// Verify character exists
		const character = await charactersPage.findCharacter(characterName);
		expect(character).not.toBeNull();
		
		// Delete the character
		await charactersPage.deleteCharacter(characterName);
		await waitForLoading(page);
		
		// Verify character is removed
		const deletedCharacter = await charactersPage.findCharacter(characterName);
		expect(deletedCharacter).toBeNull();
		
		// Try to access character URL directly - should be gone/404
		// (This would require storing the character ID)
	});
});
