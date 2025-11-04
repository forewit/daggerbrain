import type { Character } from '$lib/ts/types';
import { createTestCharacter } from '$lib/__tests__/helpers';
import { validateExperienceBonus } from '$lib/__tests__/level-up/helpers';

describe('Step Two: Advancements - Experience Bonus', () => {
    describe('Experience Bonus Rules', () => {
        it('should pass when experiences are selected correctly', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_experience_bonus',
                level_2_B: 'tier_2_max_hp',
            });
            character.experiences = ['Combat', 'Stealth'];
            character.level_up_choices[2].A.selected_experiences = { A: 0, B: 1 };
            
            const result = validateExperienceBonus(character);
            expect(result.valid).toBe(true);
        });

        it('should require exactly 2 experiences to be selected', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_experience_bonus',
                level_2_B: 'tier_2_max_hp',
            });
            character.experiences = ['Combat', 'Stealth'];
            character.level_up_choices[2].A.selected_experiences = { A: 0, B: null };
            
            const result = validateExperienceBonus(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('exactly 2 experiences'))).toBe(true);
        });

        it('should fail when same experience is selected twice', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_experience_bonus',
                level_2_B: 'tier_2_max_hp',
            });
            character.experiences = ['Combat', 'Stealth'];
            character.level_up_choices[2].A.selected_experiences = { A: 0, B: 0 }; // Same experience
            
            const result = validateExperienceBonus(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('same experience twice'))).toBe(true);
        });

        it('should fail when experience indices are invalid', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_experience_bonus',
                level_2_B: 'tier_2_max_hp',
            });
            character.experiences = ['Combat', 'Stealth'];
            character.level_up_choices[2].A.selected_experiences = { A: 0, B: 10 }; // Invalid index
            
            const result = validateExperienceBonus(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should fail when experience index is negative', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_experience_bonus',
                level_2_B: 'tier_2_max_hp',
            });
            character.experiences = ['Combat', 'Stealth'];
            character.level_up_choices[2].A.selected_experiences = { A: -1, B: 0 };
            
            const result = validateExperienceBonus(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should validate experience bonus across multiple levels', () => {
            const character = createTestCharacter(4, {
                level_2_A: 'tier_2_experience_bonus',
                level_2_B: 'tier_2_max_hp',
                level_3_A: 'tier_2_max_hp',
                level_3_B: 'tier_2_max_stress',
                level_4_A: 'tier_2_experience_bonus',
                level_4_B: 'tier_2_max_hp',
            });
            character.experiences = ['Combat', 'Stealth', 'Magic', 'Social'];
            character.level_up_choices[2].A.selected_experiences = { A: 0, B: 1 };
            character.level_up_choices[4].A.selected_experiences = { A: 2, B: 3 };
            
            const result = validateExperienceBonus(character);
            expect(result.valid).toBe(true);
        });
    });
});
