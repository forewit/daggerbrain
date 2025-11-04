import type { Character } from '$lib/ts/types';
import { NEW_CHARACTER } from '$lib/ts/constants/constants';

/**
 * Create a test character with specified level and choices
 */
export function createTestCharacter(
    level: number,
    choices: Partial<Record<string, string | null>> = {}
): Character {
    const character: Character = JSON.parse(JSON.stringify(NEW_CHARACTER));
    character.level = level;

    // Apply choices
    for (const [key, value] of Object.entries(choices)) {
        const match = key.match(/level_(\d+)_([AB])/);
        if (match) {
            const level = parseInt(match[1]);
            const slot = match[2] as 'A' | 'B';
            character.level_up_choices[level as keyof typeof character.level_up_choices][slot].option_id = value as any;
        }
    }

    return character;
}

/**
 * Create a test domain card
 */
export function createTestDomainCard(domain: string, level: number) {
    return {
        card_type: 'domain' as const,
        domain_name: domain,
        level_requirement: level,
        recall_cost: 1,
        type: 'ability' as const,
        title: `Test ${domain} Card Level ${level}`,
        description_html: '',
        artist_name: 'Test Artist',
        image_url: '/test-image.webp',
        features: [],
    };
}
