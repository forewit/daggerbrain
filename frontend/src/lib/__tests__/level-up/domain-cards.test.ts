import type { Character } from '$lib/ts/types';
import { createTestCharacter, createTestDomainCard } from '$lib/__tests__/helpers';
import { validateDomainCardChoices, validateLevelUpDomainCards, getAvailableDomainNames } from '$lib/__tests__/level-up/helpers';

describe('Step Two: Advancements - Domain Cards & Step Four: Domain Cards', () => {
    describe('Domain Card Advancement (Additional Domain Card)', () => {
        it('should pass when domain card is valid for level', () => {
            const character = createTestCharacter(3, {
                level_3_A: 'tier_2_domain_card',
                level_3_B: 'tier_2_max_hp',
            });
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            character.level_up_choices[3].A.selected_domain_card = createTestDomainCard('blade', 3);
            
            const result = validateDomainCardChoices(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when domain card level exceeds character level', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_domain_card',
                level_2_B: 'tier_2_max_hp',
            });
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            character.level_up_choices[2].A.selected_domain_card = createTestDomainCard('blade', 5); // Too high
            
            const result = validateDomainCardChoices(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should fail when domain card is not from accessible domains', () => {
            const character = createTestCharacter(2, {
                level_2_A: 'tier_2_domain_card',
                level_2_B: 'tier_2_max_hp',
            });
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            character.level_up_choices[2].A.selected_domain_card = createTestDomainCard('arcana', 2); // Not accessible
            
            const result = validateDomainCardChoices(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should allow domain card at or below level', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_domain_card',
                level_5_B: 'tier_3_max_hp',
            });
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            character.level_up_choices[5].A.selected_domain_card = createTestDomainCard('blade', 3); // Below level is valid
            
            const result = validateDomainCardChoices(character);
            expect(result.valid).toBe(true);
        });
    });

    describe('Multiclass Domain Cards', () => {
        it('should allow multiclass domain cards at or below half level (rounded up)', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
            });
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            character.secondary_class = {} as any;
            character.secondary_class_domain = 'valor';
            character.secondary_subclass = {} as any;
            
            // Level 5: half is 2.5, rounded up is 3
            character.level_up_choices[6] = {
                A: { option_id: 'tier_3_domain_card', marked_traits: { A: null, B: null }, selected_experiences: { A: null, B: null }, selected_domain_card: createTestDomainCard('valor', 3), selected_subclass_upgrade: null },
                B: { option_id: 'tier_3_max_hp', marked_traits: { A: null, B: null }, selected_experiences: { A: null, B: null }, selected_domain_card: null, selected_subclass_upgrade: null },
            };
            character.level = 6;
            
            const result = validateDomainCardChoices(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when multiclass domain card exceeds half level', () => {
            const character = createTestCharacter(5, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
            });
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            character.secondary_class = {} as any;
            character.secondary_class_domain = 'valor';
            character.secondary_subclass = {} as any;
            
            // Level 5: half is 2.5, rounded up is 3, so level 4 is too high
            character.level_up_choices[5].A.selected_domain_card = createTestDomainCard('valor', 4);
            character.level_up_choices[5].A.option_id = 'tier_3_domain_card';
            
            const result = validateDomainCardChoices(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('multiclass'))).toBe(true);
        });

        it('should calculate half level correctly for odd levels', () => {
            const character = createTestCharacter(7, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
            });
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            character.secondary_class = {} as any;
            character.secondary_class_domain = 'valor';
            character.secondary_subclass = {} as any;
            
            // Level 7: half is 3.5, rounded up is 4
            character.level_up_choices[7] = {
                A: { option_id: 'tier_3_domain_card', marked_traits: { A: null, B: null }, selected_experiences: { A: null, B: null }, selected_domain_card: createTestDomainCard('valor', 4), selected_subclass_upgrade: null },
                B: { option_id: 'tier_3_max_hp', marked_traits: { A: null, B: null }, selected_experiences: { A: null, B: null }, selected_domain_card: null, selected_subclass_upgrade: null },
            };
            
            const result = validateDomainCardChoices(character);
            expect(result.valid).toBe(true);
        });
    });

    describe('Step Four: Domain Cards', () => {
        it('should require domain card for each level (levels 2-10)', () => {
            const character = createTestCharacter(3);
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            
            character.level_up_domain_cards[2].A = createTestDomainCard('blade', 2);
            character.level_up_domain_cards[3].A = createTestDomainCard('blade', 3);
            
            const result = validateLevelUpDomainCards(character);
            expect(result.valid).toBe(true);
        });

        it('should fail when domain card is missing for a level', () => {
            const character = createTestCharacter(3);
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            
            character.level_up_domain_cards[2].A = createTestDomainCard('blade', 2);
            character.level_up_domain_cards[3].A = null; // Missing
            
            const result = validateLevelUpDomainCards(character);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('Level 3'))).toBe(true);
        });

        it('should fail when domain card level exceeds character level', () => {
            const character = createTestCharacter(2);
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            
            character.level_up_domain_cards[2].A = createTestDomainCard('blade', 5); // Too high
            
            const result = validateLevelUpDomainCards(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should fail when domain card is not from accessible domains', () => {
            const character = createTestCharacter(2);
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            
            character.level_up_domain_cards[2].A = createTestDomainCard('arcana', 2); // Not accessible
            
            const result = validateLevelUpDomainCards(character);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should allow domain card from multiclass domain after multiclassing', () => {
            const character = createTestCharacter(6, {
                level_5_A: 'tier_3_multiclass',
                level_5_B: 'tier_3_multiclass',
                level_6_A: 'tier_3_max_hp',
                level_6_B: 'tier_3_max_stress',
            });
            character.primary_class = {
                primary_domain: 'blade',
                secondary_domain: 'bone',
            } as any;
            character.secondary_class = {} as any;
            character.secondary_class_domain = 'valor';
            character.secondary_subclass = {} as any;
            
            // Need domain cards for levels 2-6
            character.level_up_domain_cards[2].A = createTestDomainCard('blade', 2);
            character.level_up_domain_cards[3].A = createTestDomainCard('blade', 3);
            character.level_up_domain_cards[4].A = createTestDomainCard('bone', 4);
            character.level_up_domain_cards[5].A = createTestDomainCard('blade', 5);
            // Level 6 domain card from multiclass domain (half level = 3)
            character.level_up_domain_cards[6].A = createTestDomainCard('valor', 3);
            
            const availableDomains = getAvailableDomainNames(character, 6);
            expect(availableDomains.includes('valor')).toBe(true);
            
            const result = validateLevelUpDomainCards(character);
            // Step Four domain cards from multiclass domain follow half-level rule
            expect(result.valid).toBe(true);
        });
    });
});
