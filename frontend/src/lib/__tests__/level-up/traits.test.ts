import type { Character } from '$lib/ts/types';
import { createTestCharacter } from '$lib/__tests__/helpers';
import { validateTraitMarking } from '$lib/__tests__/level-up/helpers';

describe('Step Two: Advancements - Trait Increases', () => {
    describe('Trait Marking Rules', () => {
        it('should pass when traits are marked correctly', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
            });
            character.level_up_choices[2].A.marked_traits = { A: 'agility', B: 'strength' };
            
            const result = validateTraitMarking(character);
            expect(result.valid).toBe(true);
        });

        it('should require exactly 2 traits to be marked', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
            });
            character.level_up_choices[2].A.marked_traits = { A: 'agility', B: null };
            
            const result = validateTraitMarking(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('exactly 2 traits'))).toBe(true);
        });

        it('should fail when same trait is marked twice in same choice', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
            });
            character.level_up_choices[2].A.marked_traits = { A: 'agility', B: 'agility' };
            
            const result = validateTraitMarking(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('same trait twice'))).toBe(true);
        });

        it('should fail when same trait is marked twice in same tier', () => {
            const character = createTestCharacter(3, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
                level_3_A: 'tier_2_traits',
                level_3_B: 'tier_2_max_hp',
            });
            character.level_up_choices[2].A.marked_traits = { A: 'agility', B: 'strength' };
            character.level_up_choices[3].A.marked_traits = { A: 'agility', B: 'finesse' }; // agility already marked
            
            const result = validateTraitMarking(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('already marked'))).toBe(true);
        });

        it('should allow marking same trait again after tier achievement clears marks', () => {
            const character = createTestCharacter(6, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
                level_3_A: 'tier_2_traits',
                level_3_B: 'tier_2_max_hp',
                level_5_A: 'tier_3_traits',
                level_5_B: 'tier_3_max_hp',
                level_6_A: 'tier_3_traits',
                level_6_B: 'tier_3_max_hp',
            });
            // Tier 2: mark agility and strength
            character.level_up_choices[2].A.marked_traits = { A: 'agility', B: 'strength' };
            character.level_up_choices[3].A.marked_traits = { A: 'finesse', B: 'instinct' };
            // Tier 3: can mark agility again after level 5 clears marks
            character.level_up_choices[5].A.marked_traits = { A: 'agility', B: 'presence' };
            character.level_up_choices[6].A.marked_traits = { A: 'knowledge', B: 'strength' };
            
            const result = validateTraitMarking(character);
            expect(result.valid).toBe(true);
        });

        it('should require unmarked traits only', () => {
            const character = createTestCharacter(4, {
                level_2_A: 'tier_2_traits',
                level_2_B: 'tier_2_max_hp',
                level_3_A: 'tier_2_traits',
                level_3_B: 'tier_2_max_hp',
                level_4_A: 'tier_2_traits',
                level_4_B: 'tier_2_max_hp',
            });
            character.level_up_choices[2].A.marked_traits = { A: 'agility', B: 'strength' };
            character.level_up_choices[3].A.marked_traits = { A: 'finesse', B: 'instinct' };
            character.level_up_choices[4].A.marked_traits = { A: 'agility', B: 'presence' }; // agility already marked in tier 2
            
            const result = validateTraitMarking(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('already marked'))).toBe(true);
        });
    });
});
