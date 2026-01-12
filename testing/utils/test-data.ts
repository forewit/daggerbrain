/**
 * Test data utilities
 * Generate test data for characters, campaigns, homebrew, etc.
 */

export interface TestCharacter {
	name: string;
	level?: number;
	campaignId?: string;
}

export interface TestCampaign {
	name: string;
	description?: string;
	displayName?: string;
}

export interface TestHomebrew {
	name: string;
	type: string;
	description?: string;
}

/**
 * Generate a unique test character name
 */
export function generateCharacterName(prefix = 'Test Character'): string {
	return `${prefix} ${Date.now()}`;
}

/**
 * Generate a unique test campaign name
 */
export function generateCampaignName(prefix = 'Test Campaign'): string {
	return `${prefix} ${Date.now()}`;
}

/**
 * Generate a unique test homebrew name
 */
export function generateHomebrewName(prefix = 'Test Homebrew'): string {
	return `${prefix} ${Date.now()}`;
}

/**
 * Create test character data
 */
export function createTestCharacter(overrides?: Partial<TestCharacter>): TestCharacter {
	return {
		name: generateCharacterName(),
		level: 1,
		...overrides,
	};
}

/**
 * Create test campaign data
 */
export function createTestCampaign(overrides?: Partial<TestCampaign>): TestCampaign {
	return {
		name: generateCampaignName(),
		description: 'Test campaign description',
		...overrides,
	};
}

/**
 * Create test homebrew data
 */
export function createTestHomebrew(
	type: string,
	overrides?: Partial<TestHomebrew>
): TestHomebrew {
	return {
		name: generateHomebrewName(),
		type,
		description: 'Test homebrew description',
		...overrides,
	};
}
