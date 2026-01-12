/**
 * Test data generators and helpers
 */

export interface TestCharacter {
	name: string;
	level?: number;
}

export interface TestCampaign {
	name: string;
	description?: string;
}

/**
 * Generate a unique test character name
 */
export function generateCharacterName(prefix = 'Test Character'): string {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 1000);
	return `${prefix} ${timestamp}-${random}`;
}

/**
 * Generate a unique test campaign name
 */
export function generateCampaignName(prefix = 'Test Campaign'): string {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 1000);
	return `${prefix} ${timestamp}-${random}`;
}

/**
 * Generate test character data
 */
export function createTestCharacter(overrides?: Partial<TestCharacter>): TestCharacter {
	return {
		name: generateCharacterName(),
		level: 1,
		...overrides,
	};
}

/**
 * Generate test campaign data
 */
export function createTestCampaign(overrides?: Partial<TestCampaign>): TestCampaign {
	return {
		name: generateCampaignName(),
		description: 'Test campaign description',
		...overrides,
	};
}
