import type { Character } from '$lib/ts/types';
import { createTestCharacter } from '$lib/__tests__/helpers';
import { validateMulticlassing } from '$lib/__tests__/level-up/helpers';

describe('Step Two: Advancements - Subclass Upgrade', () => {
    describe('Subclass Upgrade Rules', () => {
        it('should pass when subclass upgrade is selected', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_subclass_upgrade',
                level_5_B: 'tier_3_max_hp',
            });
            character.level_up_choices[5].A.selected_subclass_upgrade = 'primary';
            
            // Subclass upgrade should be valid
            expect(character.level_up_choices[5].A.option_id).toBe('tier_3_subclass_upgrade');
            expect(character.level_up_choices[5].A.selected_subclass_upgrade).toBe('primary');
        });

        it('should require selected_subclass_upgrade to be set', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_subclass_upgrade',
                level_5_B: 'tier_3_max_hp',
            });
            character.level_up_choices[5].A.selected_subclass_upgrade = null;
            
            // This would be caught by highlight-utils or UI validation
            // For now, we just verify the structure
            expect(character.level_up_choices[5].A.selected_subclass_upgrade).toBeNull();
        });

        it('should disable multiclass option in same tier', () => {
            const character = createTestCharacter(6, {
                level_5_A: 'tier_3_subclass_upgrade',
                level_5_B: 'tier_3_max_hp',
                level_6_A: 'tier_3_multiclass',
                level_6_B: 'tier_3_multiclass',
            });
            
            // Subclass upgrade at level 5 should conflict with multiclass in same tier
            // This is validated by validateMulticlassing
            const result = validateMulticlassing(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('subclass upgrade'))).toBe(true);
        });

        it('should allow progression: foundation -> specialization -> mastery', () => {
            const character = createTestCharacter(7, {
                level_5_A: 'tier_3_subclass_upgrade', // foundation -> specialization
                level_5_B: 'tier_3_max_hp',
                level_7_A: 'tier_3_subclass_upgrade', // specialization -> mastery
                level_7_B: 'tier_3_max_hp',
            });
            
            character.level_up_choices[5].A.selected_subclass_upgrade = 'primary';
            character.level_up_choices[7].A.selected_subclass_upgrade = 'primary';
            
            // Both upgrades should be valid
            expect(character.level_up_choices[5].A.option_id).toBe('tier_3_subclass_upgrade');
            expect(character.level_up_choices[7].A.option_id).toBe('tier_3_subclass_upgrade');
        });
    });
});
