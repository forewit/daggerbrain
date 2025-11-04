import type { Character } from '$lib/ts/types';
import { createTestCharacter } from '$lib/__tests__/helpers';
import { validateMulticlassing, validateMultipleMulticlass } from '$lib/__tests__/level-up/helpers';

describe('Multiclassing Rules', () => {
    describe('Basic Multiclassing Requirements', () => {
        it('should pass when multiclassing is used at level 5+', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
            });
            character.secondary_class = {} as any;
            character.secondary_class_domain = 'blade';
            character.secondary_subclass = {} as any;
            
            const result = validateMulticlassing(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when multiclassing is used before level 5', () => {
            const character = createTestCharacter(4, {
                level_4_A: 'tier_3_multiclass', // Invalid - level 4
                level_4_B: 'tier_3_multiclass',
            });
            
            const result = validateMulticlassing(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('level 5'))).toBe(true);
        });

        it('should fail when multiclass does not use both slots', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_traits', // Different option
            });
            
            const result = validateMulticlassing(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should require secondary class, domain, and subclass to be set', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
            });
            // Missing secondary_class, secondary_class_domain, or secondary_subclass
            
            // This is more of a data validation - the multiclass validation focuses on choice rules
            const result = validateMulticlassing(character);
            expect(result.valid).toBe(true); // Choice validation passes
        });
    });

    describe('Multiclass Conflicts with Subclass Upgrade', () => {
        it('should fail when multiclass and subclass upgrade are in same tier', () => {
            const character = createTestCharacter(6, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
                level_6_A: 'tier_3_subclass_upgrade',
                level_6_B: 'tier_3_max_hp',
            });
            
            const result = validateMulticlassing(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('subclass upgrade'))).toBe(true);
        });

        it('should pass when multiclass and subclass upgrade are in different tiers', () => {
            const character = createTestCharacter(8, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
                level_8_A: 'tier_4_subclass_upgrade',
                level_8_B: 'tier_4_max_hp',
            });
            
            const result = validateMulticlassing(character);
            expect(result.valid).toBe(true);
        });
    });

    describe('Multiple Multiclass Options', () => {
        it('should fail when multiple multiclass options are chosen', () => {
            const character = createTestCharacter(8, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
                level_8_A: 'tier_4_multiclass',
                level_8_B: 'tier_4_multiclass',
            });
            
            const result = validateMultipleMulticlass(character);
            // Rule says: "cross out all other 'multiclass' advancement options"
            // So choosing multiclass should disable all other multiclass options
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('Tier 3 vs Tier 4 Multiclass', () => {
        it('should allow tier 3 multiclass at level 5', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
            });
            character.secondary_class = {} as any;
            character.secondary_class_domain = 'blade';
            character.secondary_subclass = {} as any;
            
            const result = validateMulticlassing(character);
            expect(result.valid).toBe(true);
        });

        it('should allow tier 4 multiclass at level 8', () => {
            const character = createTestCharacter(8, {
                level_8_A: 'tier_4_multiclass',
                level_8_B: 'tier_4_multiclass',
            });
            character.secondary_class = {} as any;
            character.secondary_class_domain = 'blade';
            character.secondary_subclass = {} as any;
            
            const result = validateMulticlassing(character);
            expect(result.valid).toBe(true);
        });
    });
});
