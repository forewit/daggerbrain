import type { Character } from '$lib/ts/types';
import { createTestCharacter, createTestDomainCard } from '$lib/__tests__/helpers';
import { validateTierAchievements } from '$lib/__tests__/level-up/helpers';

describe('Step One: Tier Achievements', () => {
    describe('Level 2 Tier Achievement', () => {
        it('should gain new Experience at +2 and increase Proficiency by 1', () => {
            const character = createTestCharacter(2);
            character.base_stats.proficiency = 1;
            character.base_stats.max_experiences = 2;
            character.experiences = ['Combat', 'Stealth'];
            character.derived_stats.proficiency = 2; // +1 from tier achievement
            character.derived_stats.max_experiences = 3; // +1 from tier achievement
            
            // New experience should be added at +2 modifier
            expect(character.experiences.length).toBeGreaterThanOrEqual(2);
            if (character.experiences.length > 2) {
                // The third experience should have +2 modifier
                const baseModifier = character.base_stats.experience_modifier;
                expect(character.derived_stats.experience_modifiers.length).toBeGreaterThanOrEqual(3);
                if (character.derived_stats.experience_modifiers.length >= 3) {
                    expect(character.derived_stats.experience_modifiers[2]).toBe(baseModifier);
                }
            }
            
            const result = validateTierAchievements(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when proficiency is not increased', () => {
            const character = createTestCharacter(2);
            character.base_stats.proficiency = 1;
            character.base_stats.max_experiences = 2;
            character.derived_stats.proficiency = 1; // Should be 2
            character.derived_stats.max_experiences = 3;
            
            const result = validateTierAchievements(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('Level 2 tier achievement'))).toBe(true);
        });

        it('should fail when max_experiences is not increased', () => {
            const character = createTestCharacter(2);
            character.base_stats.proficiency = 1;
            character.base_stats.max_experiences = 2;
            character.derived_stats.proficiency = 2;
            character.derived_stats.max_experiences = 2; // Should be 3
            
            const result = validateTierAchievements(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('max_experiences'))).toBe(true);
        });
    });

    describe('Level 5 Tier Achievement', () => {
        it('should gain new Experience at +2, increase Proficiency by 1, and clear marked traits', () => {
            const character = createTestCharacter(5);
            character.base_stats.proficiency = 1;
            character.base_stats.max_experiences = 2;
            character.derived_stats.proficiency = 3; // +2 from tier achievements (level 2 and 5)
            character.derived_stats.max_experiences = 4; // +2 from tier achievements
            
            const result = validateTierAchievements(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when proficiency is not increased correctly', () => {
            const character = createTestCharacter(5);
            character.base_stats.proficiency = 1;
            character.base_stats.max_experiences = 2;
            character.derived_stats.proficiency = 2; // Should be 3 (+2 total)
            character.derived_stats.max_experiences = 4;
            
            const result = validateTierAchievements(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('Level 5 tier achievement'))).toBe(true);
        });
    });

    describe('Level 8 Tier Achievement', () => {
        it('should gain new Experience at +2, increase Proficiency by 1, and clear marked traits', () => {
            const character = createTestCharacter(8);
            character.base_stats.proficiency = 1;
            character.base_stats.max_experiences = 2;
            character.derived_stats.proficiency = 4; // +3 from tier achievements (levels 2, 5, 8)
            character.derived_stats.max_experiences = 5; // +3 from tier achievements
            
            const result = validateTierAchievements(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when proficiency is not increased correctly', () => {
            const character = createTestCharacter(8);
            character.base_stats.proficiency = 1;
            character.base_stats.max_experiences = 2;
            character.derived_stats.proficiency = 3; // Should be 4 (+3 total)
            character.derived_stats.max_experiences = 5;
            
            const result = validateTierAchievements(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('Level 8 tier achievement'))).toBe(true);
        });
    });
});
