import type { Character } from '$lib/ts/types';
import { createTestCharacter } from '$lib/__tests__/helpers';
import {
    validateAdvancementCount,
    validateOptionTiers,
    validateTwoChoiceOptions,
    validateOptionMaxLimits,
    getTierFromLevel,
} from '$lib/__tests__/level-up/helpers';

describe('Step Two: Advancements - General Rules', () => {
    describe('Tier Calculation', () => {
        it('should return correct tier for each level', () => {
            expect(getTierFromLevel(1)).toBe(1);
            expect(getTierFromLevel(2)).toBe(2);
            expect(getTierFromLevel(4)).toBe(2);
            expect(getTierFromLevel(5)).toBe(3);
            expect(getTierFromLevel(7)).toBe(3);
            expect(getTierFromLevel(8)).toBe(4);
            expect(getTierFromLevel(10)).toBe(4);
        });
    });

    describe('Advancement Count', () => {
        it('should require exactly 2 advancements per level (levels 2-10)', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
            });
            
            const result = validateAdvancementCount(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when a level is missing choices', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_traits',
                level_2_B: null, // Missing choice
            });
            
            const result = validateAdvancementCount(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should validate all levels up to character level', () => {
            const character = createTestCharacter(5, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
                level_3_A: 'tier_2_max_hp',
                level_3_B: 'tier_2_max_stress',
                level_4_A: 'tier_2_traits',
                level_4_B: 'tier_2_evasion',
                level_5_A: 'tier_3_traits',
                level_5_B: 'tier_3_max_hp',
            });
            
            const result = validateAdvancementCount(character);
            expect(result.valid).toBe(true);
        });
    });

    describe('Option Tier Availability', () => {
        it('should pass when options are from correct tiers', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
            });
            
            const result = validateOptionTiers(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when tier 3 option is used at level 2', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_3_traits', // Wrong tier
                level_2_B: 'tier_2_max_hp',
            });
            
            const result = validateOptionTiers(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('tier_3_traits'))).toBe(true);
        });

        it('should pass when tier 2 options are used at tier 3 levels', () => {
            const character = createTestCharacter(5, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
                level_5_A: 'tier_2_max_hp', // Tier 2 option at tier 3 level is valid
                level_5_B: 'tier_3_traits',
            });
            
            const result = validateOptionTiers(character);
            expect(result.valid).toBe(true);
        });

        it('should allow tier 4 options only at tier 4 levels', () => {
            const character = createTestCharacter(8, {
                level_8_A: 'tier_4_traits',
                level_8_B: 'tier_4_max_hp',
            });
            
            const result = validateOptionTiers(character);
            expect(result.valid).toBe(true);
        });
    });

    describe('Two-Choice Options', () => {
        it('should pass when two-choice option uses both slots', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_proficiency',
                level_5_B: 'tier_3_proficiency', // Same option in both slots
            });
            
            const result = validateTwoChoiceOptions(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when two-choice option does not use both slots', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_proficiency',
                level_5_B: 'tier_3_traits', // Different option
            });
            
            const result = validateTwoChoiceOptions(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should validate multiclass requires both slots', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
            });
            
            const result = validateTwoChoiceOptions(character);
            expect(result.valid).toBe(true);
        });
    });

    describe('Option Max Limits', () => {
        it('should pass when options are within max limits', () => {
            const character = createTestCharacter(4, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
                level_3_A: 'tier_2_traits',
                level_3_B: 'tier_2_max_hp',
                level_4_A: 'tier_2_traits',
                level_4_B: 'tier_2_evasion', // Using different option to stay within limits
            });
            
            const result = validateOptionMaxLimits(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when option exceeds max limit', () => {
            const character = createTestCharacter(4, {
                level_2_A: 'tier_2_evasion',
                level_2_B: 'tier_2_max_hp',
                level_3_A: 'tier_2_evasion', // tier_2_evasion max is 1
                level_3_B: 'tier_2_max_hp',
                level_4_A: 'tier_2_evasion', // Exceeds max
                level_4_B: 'tier_2_max_hp',
            });
            
            const result = validateOptionMaxLimits(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('tier_2_evasion'))).toBe(true);
        });

        it('should allow options with multiple slots to be chosen multiple times', () => {
            const character = createTestCharacter(4, {
                level_2_A: 'tier_2_traits', // max 3
                level_2_B: 'tier_2_max_hp', // max 2
                level_3_A: 'tier_2_traits',
                level_3_B: 'tier_2_max_hp',
                level_4_A: 'tier_2_traits', // Third time for traits, still within max
                level_4_B: 'tier_2_max_stress', // Using different option to stay within max_hp limit
            });
            
            const result = validateOptionMaxLimits(character);
            expect(result.valid).toBe(true);
        });
    });
});
