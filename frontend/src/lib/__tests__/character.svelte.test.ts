import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Character, LevelUpChoice, Traits, Weapon } from '$lib/ts/types';
import { BLANK_LEVEL_UP_CHOICE } from '$lib/ts/constants/rules';
import { CLASSES, NEW_CHARACTER } from '$lib/ts/constants/constants';
import { TIER_1_ARMOR } from '$lib/ts/constants/equipment';
import { createTestDomainCard } from '$lib/__tests__/helpers';

vi.mock('svelte', async () => {
    const url = new URL('../../../../node_modules/svelte/src/index-client.js', import.meta.url);
    const { pathToFileURL } = await import('node:url');
    return await import(pathToFileURL(url.pathname).href);
});

const mockApp = { characters: [] as Character[] };

vi.mock('$lib/ts/app.svelte', () => ({
    getAppContext: () => mockApp,
}));

import {
    cleanupHarnesses,
    createBlankCharacter,
    flushEffects,
    setupCharacterContext,
} from '$lib/__tests__/character-context.test-utils';

function cloneCharacter(base: Character = NEW_CHARACTER): Character {
    return structuredClone(base);
}

beforeEach(() => {
    mockApp.characters = [];
});

afterEach(() => {
    cleanupHarnesses();
});

describe('character.svelte.ts reactive effects', () => {
    describe('$effect: load character from app context', () => {
        it('binds the character matching uid from the app context', async () => {
            const custom = cloneCharacter();
            custom.uid = 'alpha';
            custom.name = 'Test Hero';

            const { context } = setupCharacterContext(mockApp, { character: custom });
            await flushEffects();

            expect(context.character?.uid).toBe('alpha');
            expect(context.character?.name).toBe('Test Hero');
        });
    });

    describe('$effect: keep experiences array in sync with max_experiences', () => {
        it('pads the array when it is shorter than max', async () => {
            const base = createBlankCharacter();
            base.experiences = ['Only one'];
            base.derived_stats.max_experiences = 3;

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects(3);

            expect(context.character?.experiences).toHaveLength(3);
            expect(context.character?.experiences.slice(1)).toEqual(['', '']);
        });

        it('trims the array when it exceeds max', async () => {
            const base = createBlankCharacter();
            base.experiences = ['one', 'two', 'three', 'four'];
            base.derived_stats.max_experiences = 2;

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects(3);

            expect(context.character?.experiences).toEqual(['one', 'two']);
        });
    });

    describe('$effect: clear invalid base trait selections', () => {
        it('resets traits that use values not present in the trait pool', async () => {
            const base = createBlankCharacter();
            base.base_stats.traits.agility = 5 as unknown as number; // invalid value

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.base_stats.traits.agility).toBeNull();
        });

        it('prevents duplicate usage of trait values beyond availability', async () => {
            const base = createBlankCharacter();
            base.base_stats.traits.agility = 2;
            base.base_stats.traits.strength = 2; // only one "2" available

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            const traits = context.character?.base_stats.traits as Traits;
            const values = Object.values(traits).filter((v): v is number => v !== null);
            expect(values).toContain(2);
            expect(traits.strength).toBeNull();
        });
    });

    describe('$effect: clear subclasses when parent class is missing', () => {
        it('nulls out the primary subclass when the primary class is absent', async () => {
            const base = createBlankCharacter();
            base.primary_class = null;
            base.primary_subclass = CLASSES.assassin.subclasses.executioners_guild;

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.primary_subclass).toBeNull();
        });

        it('clears secondary subclass and domain when the secondary class is absent', async () => {
            const base = createBlankCharacter();
            base.secondary_class = null;
            base.secondary_subclass = CLASSES.assassin.subclasses.executioners_guild;
            base.secondary_class_domain = 'blade';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.secondary_subclass).toBeNull();
            expect(context.character?.secondary_class_domain).toBeNull();
        });
    });

    describe('$effect: clear level-up choices above the current level', () => {
        it('resets higher-tier choices when the level drops below the tier', async () => {
            const base = createBlankCharacter();
            base.level = 4;
            base.level_up_choices[5].A.option_id = 'tier_3_traits';
            base.level_up_choices[6].B.option_id = 'tier_3_max_hp';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[5].A).toEqual(BLANK_LEVEL_UP_CHOICE);
            expect(context.character?.level_up_choices[6].B).toEqual(BLANK_LEVEL_UP_CHOICE);
            expect(context.character?.level_up_choices[4].A.option_id).toBeNull();
        });
    });

    describe('$effect: clear secondary choice when the other costs two selections', () => {
        it('drops choice B when choice A consumes both selections', async () => {
            const base = createBlankCharacter();
            base.level = 6;
            base.level_up_choices[5].A.option_id = 'tier_3_proficiency'; // costs two
            base.level_up_choices[5].B.option_id = 'tier_3_traits';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[5].A.option_id).toBe('tier_3_proficiency');
            expect(context.character?.level_up_choices[5].B).toEqual(BLANK_LEVEL_UP_CHOICE);
        });

        it('drops choice A when choice B consumes both selections', async () => {
            const base = createBlankCharacter();
            base.level = 6;
            base.level_up_choices[5].A.option_id = 'tier_3_traits';
            base.level_up_choices[5].B.option_id = 'tier_3_proficiency';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[5].B.option_id).toBe('tier_3_proficiency');
            expect(context.character?.level_up_choices[5].A).toEqual(BLANK_LEVEL_UP_CHOICE);
        });
    });

    describe('$effect: clear invalid secondary class selections', () => {
        it('removes the secondary class when multiclass was never chosen', async () => {
            const base = createBlankCharacter();
            base.level = 6;
            base.secondary_class = CLASSES.assassin;
            base.secondary_class_domain = 'blade';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.secondary_class).toBeNull();
            expect(context.character?.secondary_class_domain).toBeNull();
        });

        it('removes the secondary class when it matches the primary class name', async () => {
            const base = createBlankCharacter();
            base.level = 6;
            base.primary_class = CLASSES.assassin;
            base.secondary_class = CLASSES.assassin;

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.secondary_class).toBeNull();
        });
    });

    describe('$derived/$effect: track and cap level-up option usage', () => {
        it('counts how often each option id is used', async () => {
            const base = createBlankCharacter();
            base.level = 5;
            base.level_up_choices[2].A.option_id = 'tier_2_max_hp';
            base.level_up_choices[3].A.option_id = 'tier_2_max_hp';
            base.level_up_choices[4].A.option_id = 'tier_2_traits';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.options_used['tier_2_max_hp']).toBe(2);
            expect(context.options_used['tier_2_traits']).toBe(1);
        });

        it('clears selections that exceed the option max count', async () => {
            const base = createBlankCharacter();
            base.level = 6;
            base.level_up_choices[2].A.option_id = 'tier_2_max_hp';
            base.level_up_choices[3].A.option_id = 'tier_2_max_hp';
            base.level_up_choices[4].A.option_id = 'tier_2_max_hp'; // exceeds max (2)

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.options_used['tier_2_max_hp']).toBe(2);
            expect(context.character?.level_up_choices[4].A).toEqual(BLANK_LEVEL_UP_CHOICE);
        });
    });

    describe('$effect: remove conflicting multiclass and subclass upgrades', () => {
        it('clears tier 3 multiclass when a tier 3 subclass upgrade is also selected', async () => {
            const base = createBlankCharacter();
            base.level = 6;
            base.level_up_choices[5].A.option_id = 'tier_3_multiclass';
            base.level_up_choices[5].B.option_id = 'tier_3_subclass_upgrade';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[5].A).toEqual(BLANK_LEVEL_UP_CHOICE);
            expect(context.character?.level_up_choices[5].B.option_id).toBe('tier_3_subclass_upgrade');
        });

        it('clears tier 4 multiclass when a tier 4 subclass upgrade is also selected', async () => {
            const base = createBlankCharacter();
            base.level = 10;
            base.level_up_choices[8].A.option_id = 'tier_4_multiclass';
            base.level_up_choices[8].B.option_id = 'tier_4_subclass_upgrade';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[8].A).toEqual(BLANK_LEVEL_UP_CHOICE);
            expect(context.character?.level_up_choices[8].B.option_id).toBe('tier_4_subclass_upgrade');
        });
    });

    describe('$effect: clear duplicated marked traits within tiers', () => {
        it('removes duplicate tier 2 markings in the same tier window', async () => {
            const base = createBlankCharacter();
            base.level = 3;
            base.level_up_choices[2].A.option_id = 'tier_2_traits';
            base.level_up_choices[2].A.marked_traits = { A: 'agility', B: 'strength' };
            base.level_up_choices[3].A.option_id = 'tier_2_traits';
            base.level_up_choices[3].A.marked_traits = { A: 'agility', B: 'finesse' };

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[3].A.marked_traits.A).toBeNull();
            expect(context.character?.level_up_choices[3].A.marked_traits.B).toBe('finesse');
        });

        it('clears duplicates separately for higher-tier pools', async () => {
            const base = createBlankCharacter();
            base.level = 8;
            base.level_up_choices[5].A.option_id = 'tier_3_traits';
            base.level_up_choices[5].A.marked_traits = { A: 'presence', B: 'knowledge' };
            base.level_up_choices[6].A.option_id = 'tier_3_traits';
            base.level_up_choices[6].A.marked_traits = { A: 'presence', B: 'instinct' };

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[6].A.marked_traits.A).toBeNull();
            expect(context.character?.level_up_choices[6].A.marked_traits.B).toBe('instinct');
        });
    });

    describe('$effect: clear invalid experience bonus selections', () => {
        it('removes selected experiences when the option no longer applies', async () => {
            const base = createBlankCharacter();
            base.level = 4;
            base.level_up_choices[2].A.option_id = 'tier_2_traits';
            base.level_up_choices[2].A.selected_experiences = { A: 0, B: 1 };

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[2].A.selected_experiences).toEqual({ A: null, B: null });
        });

        it('clears duplicate indices picked within the same choice', async () => {
            const base = createBlankCharacter();
            base.level = 4;
            base.level_up_choices[2].A.option_id = 'tier_2_experience_bonus';
            base.level_up_choices[2].A.selected_experiences = { A: 0, B: 0 };

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[2].A.selected_experiences).toEqual({ A: 0, B: null });
        });
    });

    describe('$effect: clear invalid subclass upgrade selections', () => {
        it('clears the stored upgrade when the option changes away from subclass upgrades', async () => {
            const base = createBlankCharacter();
            base.level = 6;
            base.level_up_choices[5].A.option_id = 'tier_3_traits';
            base.level_up_choices[5].A.selected_subclass_upgrade = 'primary';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[5].A.selected_subclass_upgrade).toBeNull();
        });

        it('removes tier 3 subclass upgrade choices when multiclass is already taken', async () => {
            const base = createBlankCharacter();
            base.level = 6;
            base.level_up_choices[3].A.option_id = 'tier_3_multiclass';
            base.level_up_choices[5].A.option_id = 'tier_3_subclass_upgrade';
            base.level_up_choices[5].A.selected_subclass_upgrade = 'primary';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[5].A).toEqual(BLANK_LEVEL_UP_CHOICE);
        });

        it('requires multiclass before allowing secondary subclass upgrades', async () => {
            const base = createBlankCharacter();
            base.level = 8;
            base.level_up_choices[6].A.option_id = 'tier_3_subclass_upgrade';
            base.level_up_choices[6].A.selected_subclass_upgrade = 'secondary';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[6].A.selected_subclass_upgrade).toBeNull();
        });
    });

    describe('$effect: manage domain card selections and vault', () => {
        it('clears domain cards when no primary class is set', async () => {
            const base = createBlankCharacter();
            base.primary_class = null;
            base.level_up_domain_cards[1].A = createTestDomainCard('blade', 1);
            base.level_up_domain_cards[1].B = createTestDomainCard('blade', 1);

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_domain_cards[1]).toEqual({ A: null, B: null });
            expect(context.character?.derived_domain_card_vault).toHaveLength(0);
        });

        it('removes domain cards that exceed level or domain availability and avoids duplicates', async () => {
            const base = createBlankCharacter();
            base.level = 5;
            base.primary_class = CLASSES.assassin;
            const validCard = createTestDomainCard('blade', 2);
            const tooHighCard = createTestDomainCard('blade', 6);
            const wrongDomain = createTestDomainCard('valor', 1);

            base.level_up_domain_cards[1].A = validCard;
            base.level_up_domain_cards[2].A = tooHighCard;
            base.level_up_domain_cards[3].A = wrongDomain;
            base.level_up_choices[3].A.option_id = 'tier_2_domain_card';
            base.level_up_choices[3].A.selected_domain_card = createTestDomainCard('blade', 3);
            base.level_up_choices[3].B.option_id = 'tier_2_domain_card';
            // duplicate of the vault entry should be cleared
            base.level_up_choices[3].B.selected_domain_card = validCard;

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_domain_cards[2].A).toBeNull();
            expect(context.character?.level_up_domain_cards[3].A).toBeNull();
            expect(context.character?.level_up_choices[3].B.selected_domain_card).toBeNull();
            expect(context.character?.derived_domain_card_vault).toHaveLength(2);
        });

        it('clears selected domain cards when the option changes away from domain card picks', async () => {
            const base = createBlankCharacter();
            base.level = 5;
            base.primary_class = CLASSES.assassin;
            base.level_up_choices[3].A.option_id = 'tier_2_traits';
            base.level_up_choices[3].A.selected_domain_card = createTestDomainCard('blade', 1);

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.level_up_choices[3].A.selected_domain_card).toBeNull();
        });
    });

    describe('$effect: sanitize domain card loadout indices', () => {
        it('removes duplicates and out-of-range indices', async () => {
            const base = createBlankCharacter();
            base.primary_class = CLASSES.assassin;
            base.level = 5;
            const cardA = createTestDomainCard('blade', 1);
            const cardB = createTestDomainCard('blade', 2);
            base.level_up_domain_cards[1].A = cardA;
            base.level_up_domain_cards[1].B = cardB;
            base.derived_domain_card_vault = [cardA, cardB];
            base.ephemeral_stats.domain_card_loadout = [0, 1, 1, 5, -1];
            base.derived_stats.max_domain_card_loadout = 2;

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.ephemeral_stats.domain_card_loadout).toEqual([0, 1]);
        });
    });

    describe('$effect: filter invalid active weapons', () => {
        it('drops weapons that exceed level, burden, or duplicate categories', async () => {
            const base = createBlankCharacter();
            base.level = 2;
            const primary1: Weapon = {
                title: 'Rapier',
                description_html: '',
                level_requirement: 1,
                category: 'Primary',
                burden: 1,
                trait: 'agility',
                range: 'Close',
                damage: '1d8',
                damage_type: 'phy',
                features: [],
            };
            const primary2: Weapon = { ...primary1, title: 'Claymore', burden: 2 };
            const secondary: Weapon = {
                title: 'Dagger',
                description_html: '',
                level_requirement: 1,
                category: 'Secondary',
                burden: 1,
                trait: 'finesse',
                range: 'Very Close',
                damage: '1d4',
                damage_type: 'phy',
                features: [],
            };
            const highLevelSecondary: Weapon = { ...secondary, title: 'Throwing Axe', level_requirement: 3 };
            base.active_weapons = [primary1, primary2, secondary, highLevelSecondary];

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.active_weapons.map((w) => w.title)).toEqual(['Rapier', 'Dagger']);
        });
    });

    describe('$effect: filter invalid active armor', () => {
        it('removes armor whose level requirement is not met', async () => {
            const base = createBlankCharacter();
            base.level = 1;
            base.active_armor = {
                title: 'Heavy Plate',
                description_html: '',
                level_requirement: 3,
                max_armor: 6,
                damage_thresholds: { major: 10, severe: 20 },
                features: [],
            };

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.active_armor).toBeNull();
        });
    });

    describe('$effect: derive experience modifiers', () => {
        it('increments modifiers based on selected experience bonus choices', async () => {
            const base = createBlankCharacter();
            base.level = 4;
            base.experiences = ['A', 'B', 'C'];
            base.derived_stats.experience_modifiers = [2, 2, 2];
            base.level_up_choices[2].A.option_id = 'tier_2_experience_bonus';
            base.level_up_choices[2].A.selected_experiences = { A: 0, B: 1 };
            base.level_up_choices[3].A.option_id = 'tier_3_experience_bonus';
            base.level_up_choices[3].A.selected_experiences = { A: 2, B: null };

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            expect(context.character?.derived_stats.experience_modifiers).toEqual([3, 3, 3]);
        });
    });

    describe('derived stat calculations', () => {
        it('computes derived stats using traits, tier bumps, and modifiers', async () => {
            const base = createBlankCharacter();
            base.base_stats.traits = {
                agility: 2,
                strength: 1,
                finesse: 0,
                instinct: 0,
                presence: 0,
                knowledge: 0,
            };
            base.base_stats.secondary_class_mastery_level = 3;
            base.level = 6;
            base.primary_class = CLASSES.assassin;
            base.active_armor = structuredClone(TIER_1_ARMOR.leather_armor);
            base.additional_modifier_ids = [
                'proficiency_plus_1',
                'evasion_plus_1',
                'max_hp_plus_1',
                'max_stress_plus_1',
                'valor_bare_bones_tier_3_armor',
                'valor_bare_bones_tier_3_armor_bonus',
                'valor_bare_bones_tier_3_major',
                'valor_bare_bones_tier_3_severe',
            ];
            base.level_up_choices[2].A.option_id = 'tier_2_traits';
            base.level_up_choices[2].A.marked_traits = { A: 'agility', B: 'strength' };
            base.level_up_choices[4].A.option_id = 'tier_2_traits';
            base.level_up_choices[4].A.marked_traits = { A: 'finesse', B: 'instinct' };
            base.level_up_choices[5].A.option_id = 'tier_3_subclass_upgrade';
            base.level_up_choices[5].A.selected_subclass_upgrade = 'primary';

            const { context } = setupCharacterContext(mockApp, { character: base });
            await flushEffects();

            const traits = context.character?.derived_stats.traits as Traits;
            expect(traits).toEqual({
                agility: 3,
                strength: 2,
                finesse: 1,
                instinct: 1,
                presence: 0,
                knowledge: 0,
            });
            expect(context.character?.derived_stats.proficiency).toBe(4);
            expect(context.character?.derived_stats.evasion).toBe(13);
            expect(context.character?.derived_stats.max_hp).toBe(6);
            expect(context.character?.derived_stats.max_stress).toBe(7);
            expect(context.character?.derived_stats.max_hope).toBe(6);
            expect(context.character?.derived_stats.max_experiences).toBe(4);
            expect(context.character?.derived_stats.max_domain_card_loadout).toBe(5);
            expect(context.character?.derived_stats.max_armor).toBe(5);
            expect(context.character?.derived_stats.max_burden).toBe(2);
            expect(context.character?.derived_stats.damage_thresholds).toEqual({ major: 19, severe: 37 });
            expect(context.character?.derived_stats.primary_class_mastery_level).toBe(2);
            expect(context.character?.derived_stats.secondary_class_mastery_level).toBe(2);
        });
    });
});
