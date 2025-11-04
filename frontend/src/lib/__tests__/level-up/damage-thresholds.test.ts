import type { Character } from '$lib/ts/types';
import { createTestCharacter } from '$lib/__tests__/helpers';
import { validateDamageThresholds } from '$lib/__tests__/level-up/helpers';

describe('Step Three: Damage Thresholds', () => {
    describe('Damage Threshold Increases', () => {
        it('should pass when damage thresholds are at least level', () => {
            const character = createTestCharacter(3);
            character.derived_stats.damage_thresholds = { major: 3, severe: 6 };
            
            const result = validateDamageThresholds(character);
            expect(result.valid).toBe(true);
        });

        it('should pass when damage thresholds exceed level (from armor)', () => {
            const character = createTestCharacter(3);
            character.derived_stats.damage_thresholds = { major: 5, severe: 10 }; // Higher from armor
            
            const result = validateDamageThresholds(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when damage thresholds are too low', () => {
            const character = createTestCharacter(5);
            character.derived_stats.damage_thresholds = { major: 3, severe: 6 }; // Should be at least 5/10
            
            const result = validateDamageThresholds(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should validate thresholds increase by 1 each level', () => {
            const character = createTestCharacter(5);
            // Base thresholds should be level and level * 2
            character.derived_stats.damage_thresholds = { major: 5, severe: 10 };
            
            const result = validateDamageThresholds(character);
            expect(result.valid).toBe(true);
        });

        it('should validate thresholds for level 10', () => {
            const character = createTestCharacter(10);
            character.derived_stats.damage_thresholds = { major: 10, severe: 20 };
            
            const result = validateDamageThresholds(character);
            expect(result.valid).toBe(true);
        });
    });
});
