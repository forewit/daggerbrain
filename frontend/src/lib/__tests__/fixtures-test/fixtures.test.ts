import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Character } from '$lib/ts/types';
import { validateLevelUpRules } from '$lib/__tests__/level-up/helpers';

describe('Character JSON Fixtures', () => {
    describe('Valid Characters', () => {
        it('should validate level-1-valid.json', () => {
            const character = loadCharacterFixture('valid-characters/level-1-valid.json');
            const result = validateLevelUpRules(character);
            expect(result.valid).toBe(true);
        });

        it('should validate level-2-valid.json', () => {
            const character = loadCharacterFixture('valid-characters/level-2-valid.json');
            const result = validateLevelUpRules(character);
            expect(result.valid).toBe(true);
        });
    });

    describe('Invalid Characters', () => {
        it('should reject invalid-advancement-count.json', () => {
            const character = loadCharacterFixture('invalid-characters/invalid-advancement-count.json');
            const result = validateLevelUpRules(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some(e => e.includes('advancement choices'))).toBe(true);
        });
    });
});

function loadCharacterFixture(filename: string): Character {
    const filePath = join(__dirname, '..', 'fixtures', filename);
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Character;
}
