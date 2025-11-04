import type { Character } from '$lib/ts/types';
import { createTestCharacter, createTestDomainCard } from '$lib/__tests__/helpers';
import { validateLevelUpRules } from '$lib/__tests__/level-up/helpers';

describe('Integration Tests - Full Level Up Validation', () => {
    it('should validate all rules together for level 2 character', () => {
        const character = createTestCharacter(2, {
            level_2_A: 'tier_2_traits',
            level_2_B: 'tier_2_max_hp',
        });
        character.level_up_choices[2].A.marked_traits = { A: 'agility', B: 'strength' };
        character.primary_class = {
            primary_domain: 'blade',
            secondary_domain: 'bone',
        } as any;
        character.level_up_domain_cards[2].A = createTestDomainCard('blade', 2);
        character.base_stats.proficiency = 1;
        character.base_stats.max_experiences = 2;
        character.derived_stats.proficiency = 2;
        character.derived_stats.max_experiences = 3;
        character.derived_stats.damage_thresholds = { major: 2, severe: 4 };
        
        const result = validateLevelUpRules(character);
        expect(result.valid).toBe(true);
    });

    it('should validate all rules together for level 5 character', () => {
        const character = createTestCharacter(5, {
            level_2_A: 'tier_2_traits',
            level_2_B: 'tier_2_max_hp',
            level_3_A: 'tier_2_traits',
            level_3_B: 'tier_2_max_stress',
            level_4_A: 'tier_2_max_hp',
            level_4_B: 'tier_2_evasion',
            level_5_A: 'tier_3_traits',
            level_5_B: 'tier_3_max_hp',
        });
        
        character.level_up_choices[2].A.marked_traits = { A: 'agility', B: 'strength' };
        character.level_up_choices[3].A.marked_traits = { A: 'finesse', B: 'instinct' };
        character.level_up_choices[5].A.marked_traits = { A: 'presence', B: 'knowledge' };
        
        character.primary_class = {
            primary_domain: 'blade',
            secondary_domain: 'bone',
        } as any;
        
        character.level_up_domain_cards[2].A = createTestDomainCard('blade', 2);
        character.level_up_domain_cards[3].A = createTestDomainCard('bone', 3);
        character.level_up_domain_cards[4].A = createTestDomainCard('blade', 4);
        character.level_up_domain_cards[5].A = createTestDomainCard('bone', 5);
        
        character.base_stats.proficiency = 1;
        character.base_stats.max_experiences = 2;
        character.derived_stats.proficiency = 3; // +2 from tier achievements
        character.derived_stats.max_experiences = 4; // +2 from tier achievements
        character.derived_stats.damage_thresholds = { major: 5, severe: 10 };
        
        const result = validateLevelUpRules(character);
        expect(result.valid).toBe(true);
    });

    it('should detect multiple validation errors', () => {
        const character = createTestCharacter(2, {
            level_2_A: 'tier_2_traits',
            level_2_B: null, // Missing choice
        });
        character.level_up_choices[2].A.marked_traits = { A: 'agility', B: null }; // Missing trait
        character.base_stats.proficiency = 1;
        character.derived_stats.proficiency = 1; // Should be 2
        
        const result = validateLevelUpRules(character);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1); // Multiple errors
    });
});
