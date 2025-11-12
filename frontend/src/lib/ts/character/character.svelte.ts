import { getAppContext } from '$lib/ts/app.svelte';
import { ALL_LEVEL_UP_OPTIONS, BASE_STATS, TRAIT_OPTIONS } from '$lib/ts/character/rules';
import { getContext, setContext } from 'svelte';
import { get_ancestry_card, get_armor, get_class, get_community_card, get_domain_card, get_transformation_card, get_weapon } from './helpers';
import type { Card, Character, Class, CharacterCondition, DamageThresholds, LevelUpChoice, LevelUpOption, CharacterModifier, Subclass, Traits } from './types';
import { BLANK_LEVEL_UP_CHOICE } from './constants';

function createCharacter(uid: string) {
    const app = getAppContext();
    let character = <Character | null>$state(null);

    // derived references
    let ancestry_card: Card<"ancestry"> | null = $derived(get_ancestry_card(character?.ancestry_card_id));
    let community_card: Card<"community"> | null = $derived(get_community_card(character?.community_card_id));
    let transformation_card: Card<"transformation"> | null = $derived(get_transformation_card(character?.transformation_card_id));
    let primary_class: Class | null = $derived(get_class(character?.primary_class_id));
    let primary_subclass: Subclass | null = $derived.by(() => {
        const primary_class = get_class(character?.primary_class_id);
        if (!primary_class || !character?.primary_subclass_id) return null;
        return primary_class.subclasses[character.primary_subclass_id]
    })
    let secondary_class: Class | null = $derived(get_class(character?.secondary_class_id));
    let secondary_subclass: Subclass | null = $derived.by(() => {
        const secondary_class = get_class(character?.secondary_class_id);
        if (!secondary_class || !character?.secondary_subclass_id) return null;
        return secondary_class.subclasses[character.secondary_subclass_id]
    })
    let armor = $derived(get_armor(character?.armor_id));
    let primary_weapon = $derived(get_weapon(character?.primary_weapon_id));
    let secondary_weapon = $derived(get_weapon(character?.secondary_weapon_id))
    let level_up_domain_cards: {
        1: { A: Card<"domain"> | null, B: Card<"domain"> | null },
        2: { A: Card<"domain"> | null },
        3: { A: Card<"domain"> | null },
        4: { A: Card<"domain"> | null },
        5: { A: Card<"domain"> | null },
        6: { A: Card<"domain"> | null },
        7: { A: Card<"domain"> | null },
        8: { A: Card<"domain"> | null },
        9: { A: Card<"domain"> | null },
        10: { A: Card<"domain"> | null },
    } = $derived({
        1: { A: get_domain_card(character?.level_up_domain_card_ids[1]?.A), B: get_domain_card(character?.level_up_domain_card_ids[1]?.B) },
        2: { A: get_domain_card(character?.level_up_domain_card_ids[2]?.A) },
        3: { A: get_domain_card(character?.level_up_domain_card_ids[3]?.A) },
        4: { A: get_domain_card(character?.level_up_domain_card_ids[4]?.A) },
        5: { A: get_domain_card(character?.level_up_domain_card_ids[5]?.A) },
        6: { A: get_domain_card(character?.level_up_domain_card_ids[6]?.A) },
        7: { A: get_domain_card(character?.level_up_domain_card_ids[7]?.A) },
        8: { A: get_domain_card(character?.level_up_domain_card_ids[8]?.A) },
        9: { A: get_domain_card(character?.level_up_domain_card_ids[9]?.A) },
        10: { A: get_domain_card(character?.level_up_domain_card_ids[10]?.A) },
    });

    let level_up_chosen_options: {
        2: { A: LevelUpOption | null, B: LevelUpOption | null }
        3: { A: LevelUpOption | null, B: LevelUpOption | null },
        4: { A: LevelUpOption | null, B: LevelUpOption | null },
        5: { A: LevelUpOption | null, B: LevelUpOption | null },
        6: { A: LevelUpOption | null, B: LevelUpOption | null },
        7: { A: LevelUpOption | null, B: LevelUpOption | null },
        8: { A: LevelUpOption | null, B: LevelUpOption | null },
        9: { A: LevelUpOption | null, B: LevelUpOption | null },
        10: { A: LevelUpOption | null, B: LevelUpOption | null },
    } = $derived({
        2: {
            A: character?.level_up_choices[2].A.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[2].A.option_id] : null,
            B: character?.level_up_choices[2].B.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[2].B.option_id] : null
        },
        3: {
            A: character?.level_up_choices[3].A.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[3].A.option_id] : null,
            B: character?.level_up_choices[3].B.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[3].B.option_id] : null
        },
        4: {
            A: character?.level_up_choices[4].A.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[4].A.option_id] : null,
            B: character?.level_up_choices[4].B.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[4].B.option_id] : null
        },
        5: {
            A: character?.level_up_choices[5].A.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[5].A.option_id] : null,
            B: character?.level_up_choices[5].B.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[5].B.option_id] : null
        },
        6: {
            A: character?.level_up_choices[6].A.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[6].A.option_id] : null,
            B: character?.level_up_choices[6].B.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[6].B.option_id] : null
        },
        7: {
            A: character?.level_up_choices[7].A.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[7].A.option_id] : null,
            B: character?.level_up_choices[7].B.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[7].B.option_id] : null
        },
        8: {
            A: character?.level_up_choices[8].A.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[8].A.option_id] : null,
            B: character?.level_up_choices[8].B.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[8].B.option_id] : null
        },
        9: {
            A: character?.level_up_choices[9].A.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[9].A.option_id] : null,
            B: character?.level_up_choices[9].B.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[9].B.option_id] : null
        },
        10: {
            A: character?.level_up_choices[10].A.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[10].A.option_id] : null,
            B: character?.level_up_choices[10].B.option_id ? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[10].B.option_id] : null
        },
    });
    let additional_domain_cards = $derived(
        character?.additional_domain_card_ids.map(id => get_domain_card(id)).filter(c => c !== null) || []
    );


    // derived character stats
    let domain_card_vault: Card<"domain">[] = $state([]);
    let domain_card_loadout: Card<"domain">[] = $state([]);
    let traits: Traits = $state({ ...BASE_STATS.traits });
    let proficiency: number = $state(BASE_STATS.proficiency);
    let max_experiences: number = $state(BASE_STATS.max_experiences);
    let max_domain_card_loadout: number = $state(BASE_STATS.max_domain_card_loadout);
    let max_hope: number = $state(BASE_STATS.max_hope);
    let max_armor: number = $state(BASE_STATS.max_armor);
    let max_hp: number = $state(BASE_STATS.max_hp);
    let max_stress: number = $state(BASE_STATS.max_stress);
    let max_burden: number = $state(BASE_STATS.max_burden);
    let evasion: number = $state(BASE_STATS.evasion);
    let damage_thresholds: DamageThresholds = $state({ ...BASE_STATS.damage_thresholds });
    let primary_class_mastery_level: number = $state(BASE_STATS.primary_class_mastery_level);
    let secondary_class_mastery_level: number = $state(BASE_STATS.secondary_class_mastery_level);
    let experience_modifiers: number[] = $state(Array.from({ length: BASE_STATS.max_experiences }, () => BASE_STATS.experience_modifier));
   
    let spellcast_trait: keyof Traits | null = $state(BASE_STATS.spellcast_trait);
    let spellcast_roll_bonus: number = $state(BASE_STATS.spellcast_roll_bonus);

    // derived weapon stats


    // ! load character from app context
    $effect(() => {
        character = app.characters.find((c) => c.uid === uid) || null;
    });


    // ! clear invalid base traits
    $effect(() => {
        if (!character) return;

        let available_options = [...TRAIT_OPTIONS];
        for (const key in character.selected_traits) {
            const value = character.selected_traits[key as keyof Traits]
            const i = available_options.findIndex(option => option === value)

            if (value === null) {
                continue
            } else if (i !== -1) {
                available_options.splice(i, 1)
            } else {
                console.warn(`${value} was not a valid trait option. setting to ${key} to null`)
                character.selected_traits[key as keyof Traits] = null
            }
        }
    })

    // ! clear subclass if class is null
    $effect(() => {
        if (!character) return;
        if (!character.primary_class_id) character.primary_subclass_id = null;
        if (!character.secondary_class_id) {
            character.secondary_subclass_id = null;
            character.secondary_class_domain_id_choice = null;
        }
    })

    // ! clear level up choices above the current level
    $effect(() => {
        if (!character) return;

        if (character.level < 2) character.level_up_choices[2] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 3) character.level_up_choices[3] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 4) character.level_up_choices[4] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 5) character.level_up_choices[5] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 6) character.level_up_choices[6] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 7) character.level_up_choices[7] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 8) character.level_up_choices[8] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 9) character.level_up_choices[9] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 10) character.level_up_choices[10] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };

        console.warn("Cleared level_up_choices above level", character.level);
    })

    // ! Clear level up choice if the other choice costs two 
    $effect(() => {
        if (!character) return;
        for (let i = 2; i <= 10; i++) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            const chosen_options = level_up_chosen_options[i as keyof typeof level_up_chosen_options];
            const A_id = level_choices.A.option_id;
            const B_id = level_choices.B.option_id;
            const A_costs_two_choices = chosen_options.A?.costs_two_choices || false;
            const B_costs_two_choices = chosen_options.B?.costs_two_choices || false;

            if (
                A_id !== null && A_costs_two_choices && B_id !== null
            ) {
                console.warn(`Clearing level up option because the other option costs two choices`);
                level_choices.B = { ...BLANK_LEVEL_UP_CHOICE };
            } else if (
                B_id !== null && B_costs_two_choices && A_id !== null
            ) {
                console.warn(`Clearing level up option because the other option costs two choices`);
                level_choices.A = { ...BLANK_LEVEL_UP_CHOICE };
            }
        }
    })

    // ! clear invalid secondary classes
    $effect(() => {
        if (!character || !character.secondary_class_id) return;

        // clear secondary class if multiclass is not selected as a level up choice
        if (!options_used["tier_3_multiclass"] && !options_used["tier_4_multiclass"]) {
            console.warn(`Clearing secondary class because multiclass is not selected as a level up choice`);
            character.secondary_class_id = null;
            character.secondary_class_domain_id_choice = null;
            character.secondary_subclass_id = null;
        }

        // clear secondary class if it's the same as the primary class
        if (secondary_class?.name === primary_class?.name) {
            console.warn(`Clearing secondary class because it's the same as the primary class`);
            character.secondary_class_id = null;
            character.secondary_class_domain_id_choice = null;
            character.secondary_subclass_id = null;
        }
    })


    // ! Clear level up chocie if it's used more than it's max
    let options_used: Record<string, number> = $derived.by(() => {
        if (!character) return {};
        const used: Record<string, number> = {};

        Object.values(character.level_up_choices).forEach((choice: { A: LevelUpChoice, B: LevelUpChoice }) => {
            if (choice.A.option_id) {
                if (!used[choice.A.option_id]) used[choice.A.option_id] = 1;
                else used[choice.A.option_id]++;
            }
            if (choice.B.option_id) {
                if (!used[choice.B.option_id]) used[choice.B.option_id] = 1;
                else used[choice.B.option_id]++;
            }
        });

        return used;
    });

    $effect(() => {
        if (!character) return;
        for (let i = 10; i >= 2; i--) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            const chosen_options = level_up_chosen_options[i as keyof typeof level_up_chosen_options];
            const A_id = level_choices.A.option_id;
            const B_id = level_choices.B.option_id;
            const A_max = chosen_options.A?.max || -1;
            const B_max = chosen_options.B?.max || -1;


            if (A_id && A_max > -1 && options_used[A_id] > A_max) {
                console.warn(`Option ${A_id} used more than the max of ${A_max}`);
                level_choices.A = BLANK_LEVEL_UP_CHOICE;
            }
            if (B_id && B_max > -1 && options_used[B_id] > B_max) {
                console.warn(`Option ${B_id} used more than the max of ${B_max}`);
                level_choices.B = BLANK_LEVEL_UP_CHOICE;
            }
        }
    });

    // ! Clear conflicting multiclass / subclass upgrade level up choices
    $effect(() => {
        if (!character) return;
        for (let i = 2; i <= 10; i++) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];

            if (level_choices.A.option_id === "tier_3_multiclass" && (options_used["tier_4_multiclass"] >= 1 || options_used["tier_3_subclass_upgrade"] >= 1)) {
                console.warn(`Clearing invalid multiclass choice at tier ${i}`);
                level_choices.A = BLANK_LEVEL_UP_CHOICE;
            } else if (level_choices.A.option_id === "tier_4_multiclass" && (options_used["tier_3_multiclass"] >= 1 || options_used["tier_4_subclass_upgrade"] >= 1)) {
                console.warn(`Clearing invalid multiclass choice at tier ${i}`);
                level_choices.A = BLANK_LEVEL_UP_CHOICE;
            }

            if (level_choices.B.option_id === "tier_3_multiclass" && (options_used["tier_4_multiclass"] >= 1 || options_used["tier_3_subclass_upgrade"] >= 1)) {
                console.warn(`Clearing invalid multiclass choice at tier ${i}`);
                level_choices.B = BLANK_LEVEL_UP_CHOICE;
            } else if (level_choices.B.option_id === "tier_4_multiclass" && (options_used["tier_3_multiclass"] >= 1 || options_used["tier_4_subclass_upgrade"] >= 1)) {
                console.warn(`Clearing invalid multiclass choice at tier ${i}`);
                level_choices.B = BLANK_LEVEL_UP_CHOICE;
            }
        }
    })

    // ! clear conflicting marked traits at each tier
    let tier_2_marked_traits: Record<keyof Traits, boolean> = $state({
        agility: false,
        strength: false,
        finesse: false,
        instinct: false,
        presence: false,
        knowledge: false,
    });
    let tier_3_marked_traits: Record<keyof Traits, boolean> = $state({
        agility: false,
        strength: false,
        finesse: false,
        instinct: false,
        presence: false,
        knowledge: false,
    });
    let tier_4_marked_traits: Record<keyof Traits, boolean> = $state({
        agility: false,
        strength: false,
        finesse: false,
        instinct: false,
        presence: false,
        knowledge: false,
    });

    function clear_duplicated_marked_traits(level_choice_ids: (keyof typeof ALL_LEVEL_UP_OPTIONS)[], tier_marked_traits: Record<keyof Traits, boolean>, level_choices: { A: LevelUpChoice, B: LevelUpChoice }) {
        const choice_A = level_choices.A;
        const choice_B = level_choices.B;
        if (choice_A.option_id && level_choice_ids.includes(choice_A.option_id)) {
            if (choice_A.marked_traits.A) {
                if (tier_marked_traits[choice_A.marked_traits.A]) {
                    console.warn(`Trait ${choice_A.marked_traits.A} is already used in another option`);
                    choice_A.marked_traits.A = null;
                } else {
                    tier_marked_traits[choice_A.marked_traits.A] = true;
                }
            }
            if (choice_A.marked_traits.B) {
                if (tier_marked_traits[choice_A.marked_traits.B]) {
                    console.warn(`Trait ${choice_A.marked_traits.B} is already used in another option`);
                    choice_A.marked_traits.B = null;
                } else {
                    tier_marked_traits[choice_A.marked_traits.B] = true;
                }
            }
        }
        if (choice_B.option_id && level_choice_ids.includes(choice_B.option_id)) {
            if (choice_B.marked_traits.A) {
                if (tier_marked_traits[choice_B.marked_traits.A]) {
                    console.warn(`Trait ${choice_B.marked_traits.A} is already used in another option`);
                    choice_B.marked_traits.A = null;
                } else {
                    tier_marked_traits[choice_B.marked_traits.A] = true;
                }
            }
            if (choice_B.marked_traits.B) {
                if (tier_marked_traits[choice_B.marked_traits.B]) {
                    console.warn(`Trait ${choice_B.marked_traits.B} is already used in another option`);
                    choice_B.marked_traits.B = null;
                } else {
                    tier_marked_traits[choice_B.marked_traits.B] = true;
                }
            }
        }
    }

    $effect(() => {
        if (!character) return;

        let tier_2_mt: Record<keyof Traits, boolean> = {
            agility: false,
            strength: false,
            finesse: false,
            instinct: false,
            presence: false,
            knowledge: false,
        }
        let tier_3_mt: Record<keyof Traits, boolean> = {
            agility: false,
            strength: false,
            finesse: false,
            instinct: false,
            presence: false,
            knowledge: false,
        }
        let tier_4_mt: Record<keyof Traits, boolean> = {
            agility: false,
            strength: false,
            finesse: false,
            instinct: false,
            presence: false,
            knowledge: false,
        }
        for (let i = 2; i <= character.level; i++) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            if (i <= 4) {
                clear_duplicated_marked_traits(["tier_2_traits"], tier_2_mt, level_choices);
            } else if (i <= 7) {
                clear_duplicated_marked_traits(["tier_2_traits", "tier_3_traits"], tier_3_mt, level_choices);
            } else {
                clear_duplicated_marked_traits(["tier_2_traits", "tier_3_traits", "tier_4_traits"], tier_4_mt, level_choices);
            }
        }

        tier_2_marked_traits = tier_2_mt;
        tier_3_marked_traits = tier_3_mt;
        tier_4_marked_traits = tier_4_mt;
    })

    // ! clear conflicting selected experience choices at each level
    $effect(() => {
        if (!character) return;

        for (let i = 2; i <= 10; i++) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            const choice_A = level_choices.A;
            const choice_B = level_choices.B;

            // clear selected experiences if the level choice is not an experience bonus choice
            if (!choice_A.option_id || !["tier_2_experience_bonus", "tier_3_experience_bonus", "tier_4_experience_bonus"].includes(choice_A.option_id)) {
                if (choice_A.selected_experiences.length > 0) {
                    console.warn(`Clearing selected experiences because level choice was changed to ${choice_A.option_id}`)
                    choice_A.selected_experiences = []
                }
            }
            if (!choice_B.option_id || !["tier_2_experience_bonus", "tier_3_experience_bonus", "tier_4_experience_bonus"].includes(choice_B.option_id)) {
                if (choice_B.selected_experiences.length > 0) {
                    console.warn(`Clearing selected experiences because level choice was changed to ${choice_B.option_id}`)
                    choice_B.selected_experiences = []
                }
            }

            // clear anything above 2 selected experiences
            if (choice_A.selected_experiences.length > 2) {
                console.warn("Selected Experiences length was greater than 2, removing extra selections.")
                choice_A.selected_experiences = choice_A.selected_experiences.slice(0, 1)
            }
            if (choice_B.selected_experiences.length > 2) {
                console.warn("Selected Experiences length was greater than 2, removing extra selections.")
                choice_B.selected_experiences = choice_B.selected_experiences.slice(0, 1)
            }

            // clear conflicting selected experiences
            if (choice_A.selected_experiences.length === 2 && choice_A.selected_experiences[0] === choice_A.selected_experiences[1]) {
                console.warn(`Experience ${choice_A.selected_experiences[0]} is already used in another option`);
                choice_A.selected_experiences.pop()
            }
            if (choice_B.selected_experiences.length === 2 && choice_B.selected_experiences[0] === choice_B.selected_experiences[1]) {
                console.warn(`Experience ${choice_B.selected_experiences[0]} is already used in another option`);
                choice_B.selected_experiences.pop()
            }
        }
    })

    // ! clear invalid subclass upgrade choices (mastery level) at each level
    $effect(() => {
        if (!character) return;
        let multiclass_used = false;

        for (let i = 2; i <= 10; i++) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            const choice_A = level_choices.A;
            const choice_B = level_choices.B;

            multiclass_used = multiclass_used || choice_A.option_id === "tier_3_multiclass" || choice_A.option_id === "tier_4_multiclass" || choice_B.option_id === "tier_3_multiclass" || choice_B.option_id === "tier_4_multiclass";

            // clear subclass upgrade selection if the level choice is not a subclass upgrade choice
            if (!choice_A.option_id || !["tier_3_subclass_upgrade", "tier_4_subclass_upgrade"].includes(choice_A.option_id)) {
                if (choice_A.selected_subclass_upgrade !== null) {
                    console.warn(`Clearing selected subclass upgrade because level choice was changed to ${choice_A.option_id}`)
                    choice_A.selected_subclass_upgrade = null;
                }
            }
            if (!choice_B.option_id || !["tier_3_subclass_upgrade", "tier_4_subclass_upgrade"].includes(choice_B.option_id)) {
                if (choice_B.selected_subclass_upgrade !== null) {
                    console.warn(`Clearing selected subclass upgrade because level choice was changed to ${choice_B.option_id}`)
                    choice_B.selected_subclass_upgrade = null;
                }
            }

            // clear level up choice if multiclass is already chosen in that tier
            if (options_used["tier_3_multiclass"] >= 1) {
                if (choice_A.option_id === "tier_3_subclass_upgrade") {
                    console.warn(`Clearing selected subclass upgrade because multiclass is already chosen in tier 3`)
                    character.level_up_choices[i as keyof typeof character.level_up_choices].A = BLANK_LEVEL_UP_CHOICE;
                }
                if (choice_B.option_id === "tier_3_subclass_upgrade") {
                    console.warn(`Clearing selected subclass upgrade because multiclass is already chosen in tier 3`)
                    character.level_up_choices[i as keyof typeof character.level_up_choices].B = BLANK_LEVEL_UP_CHOICE;
                }
            }
            if (options_used["tier_4_multiclass"] >= 1) {
                if (choice_A.option_id === "tier_4_subclass_upgrade") {
                    console.warn(`Clearing selected subclass upgrade because multiclass is already chosen in tier 4`)
                    character.level_up_choices[i as keyof typeof character.level_up_choices].A = BLANK_LEVEL_UP_CHOICE;
                }
                if (choice_B.option_id === "tier_4_subclass_upgrade") {
                    console.warn(`Clearing selected subclass upgrade because multiclass is already chosen in tier 4`)
                    character.level_up_choices[i as keyof typeof character.level_up_choices].B = BLANK_LEVEL_UP_CHOICE;
                }
            }

            // clear "secondary" subclass upgrade chocie if multiclass was not used before
            if (choice_A.selected_subclass_upgrade === "secondary" && !multiclass_used) {
                console.warn(`Clearing "secondary" subclass upgrade because multiclass was not used before`)
                choice_A.selected_subclass_upgrade = null;
            }
            if (choice_B.selected_subclass_upgrade === "secondary" && !multiclass_used) {
                console.warn(`Clearing "secondary" subclass upgrade because multiclass was not used before`)
                choice_B.selected_subclass_upgrade = null;
            }
        }
    })


    // * update descriptors
    $effect(() => {
        if (!character) return;
        character.derived_descriptors.ancestry_name = ancestry_card ? ancestry_card.title : "";
        character.derived_descriptors.primary_class_name = primary_class ? primary_class.name : "";
        character.derived_descriptors.primary_subclass_name = primary_subclass ? primary_subclass.name : "";
        character.derived_descriptors.secondary_class_name = secondary_class ? secondary_class.name : "";
        character.derived_descriptors.secondary_subclass_name = secondary_subclass ? secondary_subclass.name : "";
    })


    // ! clear invalid domain card choices at each level and update the domain card vault
    // * derived domain card vault (can't be done with modifiers)
    $effect(() => {
        if (!character) return;

        if (!character.primary_class_id) {
            character.level_up_domain_card_ids[1] = { A: null, B: null }
            return;
        }

        let new_domain_card_vault: Card<"domain">[] =
            Object.values(level_up_domain_cards[1])
                .filter((card) => card !== null && card.level_requirement <= 1) as Card<"domain">[]

        let multiclass_used = false;

        for (let i = 2; i <= 10; i++) {
            const level_up_domain_card = level_up_domain_cards[i as keyof typeof character.level_up_domain_card_ids].A;

            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            const choice_A = level_choices.A;
            const choice_B = level_choices.B;

            multiclass_used =
                multiclass_used ||
                choice_A.option_id === "tier_3_multiclass" ||
                choice_A.option_id === "tier_4_multiclass" ||
                choice_B.option_id === "tier_3_multiclass" ||
                choice_B.option_id === "tier_4_multiclass";

            const available_domain_names =
                [primary_class?.primary_domain_id,
                primary_class?.secondary_domain_id,
                multiclass_used ? character.secondary_class_domain_id_choice : null]
                    .filter(id => id !== null);


            //***** level up domain cards *****/
            // filter out cards that are not valid for the current level
            if (level_up_domain_card !== null && level_up_domain_card.level_requirement > i) {
                console.warn(`Domain card ${level_up_domain_card?.title} is not valid for level ${i}`);
                character.level_up_domain_card_ids[i as keyof typeof character.level_up_domain_card_ids].A = null;
            }

            // filter out cards that aren't in available domains
            if (level_up_domain_card !== null && !available_domain_names.includes(level_up_domain_card.domain_id)) {
                console.warn(`Domain card ${level_up_domain_card?.title} is not in available domains`);
                character.level_up_domain_card_ids[i as keyof typeof character.level_up_domain_card_ids].A = null;
            }

            // add to vault if it's not already in there
            if (level_up_domain_card !== null && new_domain_card_vault.some(card => card.title === level_up_domain_card?.title)) {
                console.warn(`Domain card ${level_up_domain_card?.title} is already in the vault`);
                character.level_up_domain_card_ids[i as keyof typeof character.level_up_domain_card_ids].A = null;
            } else if (level_up_domain_card !== null) {
                new_domain_card_vault.push(level_up_domain_card);
            }
            //***** END level up domain cards *****/


            //***** domain card choices *****/
            // clear domain card choices if the level choice is set and is not a domain card choice
            // (don't clear if option_id is null, as user might select domain card before selecting tier option)
            if (choice_A.option_id && !["tier_2_domain_card", "tier_3_domain_card", "tier_4_domain_card"].includes(choice_A.option_id)) {
                if (choice_A.selected_domain_card_id !== null) {
                    console.warn(`Clearing selected domain card because level choice was changed to ${choice_A.option_id}`)
                    choice_A.selected_domain_card_id = null;
                }
            }
            if (choice_B.option_id && !["tier_2_domain_card", "tier_3_domain_card", "tier_4_domain_card"].includes(choice_B.option_id)) {
                if (choice_B.selected_domain_card_id !== null) {
                    console.warn(`Clearing selected domain card because level choice was changed to ${choice_B.option_id}`)
                    choice_B.selected_domain_card_id = null;
                }
            }

            const choice_A_selected_domain_card = get_domain_card(choice_A.selected_domain_card_id);
            const choice_B_selected_domain_card = get_domain_card(choice_B.selected_domain_card_id);

            // filter domain card choices that are not valid for the current level
            if (choice_A_selected_domain_card !== null && choice_A_selected_domain_card.level_requirement > i) {
                console.warn(`Domain card ${choice_A_selected_domain_card.title} is not valid for level ${i}`);
                choice_A.selected_domain_card_id = null;
            }
            if (choice_B_selected_domain_card !== null && choice_B_selected_domain_card.level_requirement > i) {
                console.warn(`Domain card ${choice_B_selected_domain_card.title} is not valid for level ${i}`);
                choice_B.selected_domain_card_id = null;
            }

            // filter out level up choices that aren't in available domains
            if (choice_A_selected_domain_card !== null && !available_domain_names.includes(choice_A_selected_domain_card.domain_id)) {
                console.warn(`Domain card ${choice_A_selected_domain_card.title} is not in available domains`);
                choice_A.selected_domain_card_id = null;
            }
            if (choice_B_selected_domain_card !== null && !available_domain_names.includes(choice_B_selected_domain_card.domain_id)) {
                console.warn(`Domain card ${choice_B_selected_domain_card.title} is not in available domains`);
                choice_B.selected_domain_card_id = null;
            }

            // add to vault if it's not already in there
            if (choice_A_selected_domain_card !== null && new_domain_card_vault.some(card => card.title === choice_A_selected_domain_card.title)) {
                console.warn(`Domain card ${choice_A_selected_domain_card.title} is already in the vault`);
                choice_A.selected_domain_card_id = null;
            } else if (choice_A_selected_domain_card !== null) {
                new_domain_card_vault.push(choice_A_selected_domain_card);
            }

            if (choice_B_selected_domain_card !== null && new_domain_card_vault.some(card => card.title === choice_B_selected_domain_card.title)) {
                console.warn(`Domain card ${choice_B_selected_domain_card.title} is already in the vault`);
                choice_B.selected_domain_card_id = null;
            } else if (choice_B_selected_domain_card !== null) {
                new_domain_card_vault.push(choice_B_selected_domain_card);
            }
            //***** END domain card choices *****/
        }

        // ! clear invalid domain_card_tokens
        for (const domainCardId of Object.keys(character.domain_card_tokens)) {
            if (!new_domain_card_vault.some(card => card.id === domainCardId)) {
                delete character.domain_card_tokens[domainCardId];
            }
        }


        // ! clear invalid domain_card_choices
        let new_domain_card_choices: typeof character.domain_card_choices = JSON.parse(JSON.stringify(character.domain_card_choices))

        // initialize choices 
        for (const card of new_domain_card_vault) {
            if (!new_domain_card_choices[card.id]) {
                console.warn(`Creating arbitrary_choice slot for ${card.id}`)
                new_domain_card_choices[card.id] = Object.fromEntries(card.choices.map(choice => [choice.choice_id, []]))
            }
        }

        // clear invalid choices
        const valid_keys = new_domain_card_vault.map(card => card.id)
        for (const domain_card_id of Object.keys(new_domain_card_choices)) {
            if (!valid_keys.includes(domain_card_id)) delete new_domain_card_choices[domain_card_id]
        }

        function deepEqualRecords(
            a: Record<string, Record<string, string[]>>,
            b: Record<string, Record<string, string[]>>
        ): boolean {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) return false;

            for (const key of aKeys) {
                if (!b.hasOwnProperty(key)) return false;

                const aInner = a[key];
                const bInner = b[key];
                const aInnerKeys = Object.keys(aInner);
                const bInnerKeys = Object.keys(bInner);
                if (aInnerKeys.length !== bInnerKeys.length) return false;

                for (const subKey of aInnerKeys) {
                    if (!bInner.hasOwnProperty(subKey)) return false;

                    const aValues = [...aInner[subKey]].sort();
                    const bValues = [...bInner[subKey]].sort();

                    if (aValues.length !== bValues.length) return false;
                    for (let i = 0; i < aValues.length; i++) {
                        if (aValues[i] !== bValues[i]) return false;
                    }
                }
            }

            return true;
        }

        if (!deepEqualRecords(character.domain_card_choices, new_domain_card_choices)) {
            console.warn("domain_card_choices updated")
            character.domain_card_choices = new_domain_card_choices
        }



        // * derived domain card vault
        domain_card_vault = new_domain_card_vault;
    })


    // ! remove invalid indices from the ephemeral domain card loadout (>max or not in the domain card vault index range)
    // * derive domain_card_loadout
    $effect(() => {
        if (!character) return;

        // checks for uniqueness while maintaining order
        function unique<T>(arr: T[]): T[] {
            const seen = new Set<T>();
            return arr.filter(item => {
                if (seen.has(item)) return false;
                seen.add(item);
                return true;
            });
        }

        // filter out ids not in the vault and not forced in vault
        let new_loadout_domain_card_ids = unique(character.ephemeral_stats.loadout_domain_card_ids)
            .filter(id => domain_card_vault.some(card => card.id === id && !card.forced_in_vault))

        // check if any cards are forced in the loadout
        const ids_forced_in_loadout = domain_card_vault.filter(card => card.forced_in_loadout).map(card => card.id)

        // add any missing cards that were forced in the loadout
        for (const id of ids_forced_in_loadout) {
            if (!new_loadout_domain_card_ids.includes(id)) {
                console.warn(`Card with forced_in_loadout was missing. Adding to loadout:`, ids_forced_in_loadout)
                new_loadout_domain_card_ids.unshift(...ids_forced_in_loadout)
            }
        }

        if (new_loadout_domain_card_ids.length > max_domain_card_loadout) {
            console.warn(`Loadout exceeded the max. Removing extra cards`)
            new_loadout_domain_card_ids = new_loadout_domain_card_ids.slice(0, max_domain_card_loadout);
        }

        domain_card_loadout = new_loadout_domain_card_ids
            .map(id => domain_card_vault.find(card => card.id === id))
            .filter(id => !!id)

        function equivilant(a: string[], b: string[]): boolean {
            if (a.length === 0 && b.length === 0) return true
            if (a.length !== b.length) return false;
            const sortedA = [...a].sort();
            const sortedB = [...b].sort();
            return sortedA.every((v, i) => v === sortedB[i]);
        }

        if (!equivilant(new_loadout_domain_card_ids, character.ephemeral_stats.loadout_domain_card_ids)) {
            character.ephemeral_stats.loadout_domain_card_ids = new_loadout_domain_card_ids
        }
    })


    // ! clear invalid  weapons
    $effect(() => {
        if (!character) return;

        let total_burden = 0

        if (primary_weapon !== null) {
            if (primary_weapon.level_requirement <= character.level && primary_weapon.category === "Primary") {
                total_burden = primary_weapon.burden
            } else {
                console.warn(`Removing invalid primary weapon ${primary_weapon.id}`)
                character.primary_weapon_id = null;
            }
        }

        if (secondary_weapon !== null) {
            total_burden += secondary_weapon.burden
            if (secondary_weapon.level_requirement <= character.level &&
                secondary_weapon.category === "Secondary" &&
                total_burden <= max_burden) {
                    return
                }

            console.warn(`Removing invalid secondary weapon ${secondary_weapon.id}`)
            character.secondary_weapon_id = null;
        }
    })

    // ! clear invalid  armor
    $effect(() => {
        if (!character) return;
        if (armor === null) return;
        if (armor.level_requirement <= character.level) return

        console.warn(`Removing invalid armor ${armor.id}. level requirement not met`);
        character.armor_id = null;

    })


    // helper function to check if conditionsa are met
    function evaluate_condition(condition: CharacterCondition): boolean {
        if (!character) return false
        if (condition.type === "level") {
            return character.level >= condition.min_level && character.level <= condition.max_level
        } else if (condition.type === "armor_equipped") {
            const has_armor = character.armor_id !== null
            return condition.value === has_armor
        } else if (condition.type === "domain_card_choice") {

            if (!character.domain_card_choices[condition.domain_card_id] || !character.domain_card_choices[condition.domain_card_id][condition.choice_id]) {
                return false
            } else {
                return character.domain_card_choices[condition.domain_card_id][condition.choice_id].includes(condition.selection_id)
            }
        } else if (condition.type === "min_loadout_cards_from_domain") {
            // verify that the required number of cards from the domain are in the loadout
            let count = 0;
            for (const card of domain_card_loadout) {
                if (card.domain_id === condition.domain_id) {
                    count++;
                }
            }
            return count >= condition.min_cards;
        }
        return true // unknown condition types default to true
    }

    // * derived modifiers -- used to calculate most stats --
    let base_modifiers: CharacterModifier[] = $state([])
    let bonus_modifiers: CharacterModifier[] = $state([])
    let override_modifiers: CharacterModifier[] = $state([])
    $effect(() => {
        if (!character) return

        let all_modifiers: CharacterModifier[] = []

        function push_modifiers(modifiers: CharacterModifier[] | undefined) {
            if (!modifiers || modifiers.length === 0) return
            for (const modifier of modifiers) {
                // Check all conditions - all must pass (AND logic)
                const conditions_met = modifier.character_conditions.every(condition => evaluate_condition(condition))
                if (conditions_met) all_modifiers.push(modifier)
            }
        }

        // ancestry card
        if (ancestry_card) {
            ancestry_card.features.forEach(f => push_modifiers(f.character_modifiers))
        }

        // community card
        if (community_card) {
            community_card.features.forEach(f => push_modifiers(f.character_modifiers))
        }

        // transformation card
        if (transformation_card) {
            transformation_card.features.forEach(f => push_modifiers(f.character_modifiers))
        }

        // primary class
        if (primary_class) {
            push_modifiers(primary_class.hope_feature.character_modifiers)
            primary_class.class_features.forEach(f => push_modifiers(f.character_modifiers))
        }

        // primary subclass cards (gate by mastery level)
        if (primary_subclass) {
            const primaryMastery = primary_class_mastery_level
            push_modifiers(primary_subclass.foundation_card.features.flatMap(f => f.character_modifiers))
            if (primaryMastery >= 2) {
                push_modifiers(primary_subclass.specialization_card.features.flatMap(f => f.character_modifiers))
            }
            if (primaryMastery >= 3) {
                push_modifiers(primary_subclass.mastery_card.features.flatMap(f => f.character_modifiers))
            }
        }

        // secondary class
        if (secondary_class) {
            // no hope feature for secondary class
            secondary_class.class_features.forEach(f => push_modifiers(f.character_modifiers))
        }

        // secondary subclass cards (gate by mastery level)
        if (secondary_subclass) {
            const secondaryMastery = secondary_class_mastery_level
            push_modifiers(secondary_subclass.foundation_card.features.flatMap(f => f.character_modifiers))
            if (secondaryMastery >= 2) {
                push_modifiers(secondary_subclass.specialization_card.features.flatMap(f => f.character_modifiers))
            }
            if (secondaryMastery >= 3) {
                push_modifiers(secondary_subclass.mastery_card.features.flatMap(f => f.character_modifiers))
            }
        }

        // modifiers from chosen level up options
        for (let i = 2; i <= character.level; i++) {
            const chosen_options = level_up_chosen_options[i as keyof typeof level_up_chosen_options];
            if (!chosen_options) continue;
            push_modifiers(chosen_options.A?.character_modifiers);
            push_modifiers(chosen_options.B?.character_modifiers);
        }

        // modifiers from the vault where applies_in_vault=true or the card index is in the loadout
        const vault = domain_card_vault;
        const loadout_card_ids = character.ephemeral_stats.loadout_domain_card_ids;
        vault.forEach((card, i) => {
            if (card.applies_in_vault || loadout_card_ids.includes(card.id)) {
                card.features.forEach(f => push_modifiers(f.character_modifiers))
            }
        })

        // modifiers from active armor & weapons
        if (armor) {
            armor.features.forEach(f => push_modifiers(f.character_modifiers))
        }
        if (primary_weapon) {
            primary_weapon.features.forEach(f => push_modifiers(f.character_modifiers))
        }
        if (secondary_weapon) {
            secondary_weapon.features.forEach(f => push_modifiers(f.character_modifiers))
        }


        // additional cards
        additional_domain_cards.forEach(card => {
            card.features.forEach(f => push_modifiers(f.character_modifiers))
        })

        // additional modifiers
        push_modifiers(character.additional_character_modifiers)



        // categorize by behavior
        base_modifiers = all_modifiers.filter((e) => 'behavior' in e && e.behaviour === 'base') as CharacterModifier[]
        bonus_modifiers = all_modifiers.filter((e) => 'behavior' in e && e.behaviour === 'bonus') as CharacterModifier[]
        override_modifiers = all_modifiers.filter((e) => 'behavior' in e && e.behaviour === 'override') as CharacterModifier[]

        console.warn("Updated modifier list...")
    })

    /**
     * Applies modifiers of a specific behavior type to a stat value
     * @param modifiers - List of modifiers to filter and apply
     * @param target - The stat target (e.g., 'max_hp', 'evasion', etc.)
     * @param currentValue - The current value of the stat
     * @param behavior - The behavior type to apply ('base', 'bonus', or 'override')
     * @returns The modified value after applying modifiers
     */
    function apply_modifiers(
        modifiers: CharacterModifier[],
        target: CharacterModifier['target'],
        currentValue: number,
        behavior: 'base' | 'bonus' | 'override'
    ): number {
        if (!character) return currentValue;

        let value = currentValue;

        for (const modifier of modifiers) {
            if (modifier.target !== target || ('behavior' in modifier && modifier.behaviour !== behavior)) {
                continue;
            }

            // Check all conditions - all must pass (AND logic)
            const conditions_met = modifier.character_conditions.every(condition => evaluate_condition(condition))
            if (!conditions_met) {
                continue;
            }

            if (modifier.type === 'flat') {
                if (behavior === 'base' || behavior === 'override') {
                    value = modifier.value;
                } else if (behavior === 'bonus') {
                    value = value + modifier.value;
                }
            } else if (modifier.type === 'derived_from_trait' && target !== 'trait') {
                const src = Number(traits[modifier.trait]);
                const calculated = Math.ceil(src * modifier.multiplier);
                if (behavior === 'base' || behavior === 'override') {
                    value = calculated;
                } else if (behavior === 'bonus') {
                    value = value + calculated;
                }
            } else if (modifier.type === "derived_from_proficiency" && target !== 'proficiency') {
                const calculated = Math.ceil(proficiency * modifier.multiplier)
                if (behavior === 'base' || behavior === 'override') {
                    value = calculated
                } else if (behavior === 'bonus') {
                    value = value + calculated
                }
            } else if (modifier.type === "derived_from_level") {
                const calculated = Math.ceil(character.level * modifier.multiplier)
                if (behavior === 'base' || behavior === 'override') {
                    value = calculated
                } else if (behavior === 'bonus') {
                    value = value + calculated
                }
            }
        }

        return value;
    }

    // * derived traits
    $effect(() => {
        if (!character) return
        const base_traits = { ...character.selected_traits }
        if (
            base_traits.agility === null ||
            base_traits.strength === null ||
            base_traits.finesse === null ||
            base_traits.instinct === null ||
            base_traits.presence === null ||
            base_traits.knowledge === null
        ) return

        // apply base effects targeting traits (set base values)
        for (const modifier of base_modifiers) {
            if (modifier.target === 'trait') {
                const targetTrait = modifier.trait
                if (modifier.type === 'flat') {
                    base_traits[targetTrait] = modifier.value
                } else if (modifier.type === "derived_from_proficiency") {
                    base_traits[targetTrait] = Math.ceil(proficiency * modifier.multiplier)
                } else if (modifier.type === "derived_from_level") {
                    base_traits[targetTrait] = Math.ceil(character.level * modifier.multiplier)
                }
                // ! can't derive a trait from a trait
            }
        }

        // start from base + marked trait bonuses
        let new_traits = {
            agility:
                (base_traits.agility) +
                (tier_2_marked_traits.agility ? 1 : 0) +
                (tier_3_marked_traits.agility ? 1 : 0) +
                (tier_4_marked_traits.agility ? 1 : 0),
            strength:
                (base_traits.strength) +
                (tier_2_marked_traits.strength ? 1 : 0) +
                (tier_3_marked_traits.strength ? 1 : 0) +
                (tier_4_marked_traits.strength ? 1 : 0),
            finesse:
                (base_traits.finesse) +
                (tier_2_marked_traits.finesse ? 1 : 0) +
                (tier_3_marked_traits.finesse ? 1 : 0) +
                (tier_4_marked_traits.finesse ? 1 : 0),
            instinct:
                (base_traits.instinct) +
                (tier_2_marked_traits.instinct ? 1 : 0) +
                (tier_3_marked_traits.instinct ? 1 : 0) +
                (tier_4_marked_traits.instinct ? 1 : 0),
            presence:
                (base_traits.presence) +
                (tier_2_marked_traits.presence ? 1 : 0) +
                (tier_3_marked_traits.presence ? 1 : 0) +
                (tier_4_marked_traits.presence ? 1 : 0),
            knowledge:
                (base_traits.knowledge) +
                (tier_2_marked_traits.knowledge ? 1 : 0) +
                (tier_3_marked_traits.knowledge ? 1 : 0) +
                (tier_4_marked_traits.knowledge ? 1 : 0),
        }

        // apply bonus effects targeting traits (additive or derived)
        for (const modifier of bonus_modifiers) {
            if (modifier.target === 'trait') {
                const targetTrait = modifier.trait
                if (modifier.type === 'flat') {
                    new_traits[targetTrait] = new_traits[targetTrait] + modifier.value
                } else if (modifier.type === "derived_from_proficiency") {
                    new_traits[targetTrait] += Math.ceil(proficiency * modifier.multiplier)
                } else if (modifier.type === "derived_from_level") {
                    new_traits[targetTrait] += Math.ceil(character.level * modifier.multiplier)
                }
                // ! can't derive a trait from a trait
            }
        }

        // apply override effects targeting traits (set final values)
        for (const modifier of override_modifiers) {
            if (modifier.target === 'trait') {
                const targetTrait = modifier.trait
                if (modifier.type === 'flat') {
                    new_traits[targetTrait] = modifier.value
                } else if (modifier.type === "derived_from_proficiency") {
                    new_traits[targetTrait] = Math.ceil(proficiency * modifier.multiplier)
                } else if (modifier.type === "derived_from_level") {
                    new_traits[targetTrait] = Math.ceil(character.level * modifier.multiplier)
                }
                // ! can't derive a trait from a trait
            }
        }

        traits = new_traits;
    })

    // * derived experience_modifiers
    $effect(() => {
        if (!character) return;
        const count = character.experiences.length;
        const base = BASE_STATS.experience_modifier;
        const new_experience_modifiers: number[] = Array(count).fill(base);

        // apply base modifiers
        for (const modifier of base_modifiers) {
            if (modifier.target === "experience_from_selection") {
                const experience_indices: number[] = character.domain_card_choices[modifier.domain_card_id][modifier.choice_id].map(str => parseInt(str))

                if (!experience_indices || experience_indices.length === 0) continue;

                for (const i of experience_indices) {
                    if (i === null || i < 0 || i > count) continue;
                    if (modifier.type === 'flat') {
                        new_experience_modifiers[i] = modifier.value;
                    } else if (modifier.type === "derived_from_trait") {
                        new_experience_modifiers[i] = Math.ceil(Number(traits[modifier.trait]) * modifier.multiplier);
                    } else if (modifier.type === "derived_from_proficiency") {
                        new_experience_modifiers[i] = Math.ceil(proficiency * modifier.multiplier)
                    } else if (modifier.type === "derived_from_level") {
                        new_experience_modifiers[i] = Math.ceil(character.level * modifier.multiplier)
                    }
                }
            }
        }

        // apply level-up experience bonus selections across levels up to current level
        for (let i = 2; i <= character.level; i++) {
            const levelChoices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            if (!levelChoices) continue;

            const choices = [levelChoices.A, levelChoices.B];
            for (const choice of choices) {
                if (!choice || !choice.option_id) continue;
                if (!["tier_2_experience_bonus", "tier_3_experience_bonus", "tier_4_experience_bonus"].includes(choice.option_id)) continue;

                const index_a = choice.selected_experiences[0];
                const index_b = choice.selected_experiences[1];

                if (index_a !== null && index_a >= 0 && index_a < count) new_experience_modifiers[index_a] = new_experience_modifiers[index_a] + 1;
                if (index_b !== null && index_b >= 0 && index_b < count) new_experience_modifiers[index_b] = new_experience_modifiers[index_b] + 1;
            }
        }

        // apply bonus modifiers
        for (const modifier of bonus_modifiers) {
            if (modifier.target === "experience_from_selection") {
                const experience_indices: number[] = character.domain_card_choices[modifier.domain_card_id][modifier.choice_id].map(str => parseInt(str))

                if (!experience_indices || experience_indices.length === 0) continue;

                for (const i of experience_indices) {
                    if (i === null || i < 0 || i > count) continue;
                    if (modifier.type === 'flat') {
                        new_experience_modifiers[i] += modifier.value;
                    } else if (modifier.type === "derived_from_trait") {
                        new_experience_modifiers[i] += Math.ceil(Number(traits[modifier.trait]) * modifier.multiplier);
                    } else if (modifier.type === "derived_from_proficiency") {
                        new_experience_modifiers[i] += Math.ceil(proficiency * modifier.multiplier)
                    } else if (modifier.type === "derived_from_level") {
                        new_experience_modifiers[i] += Math.ceil(character.level * modifier.multiplier)
                    }
                }
            }
        }

        // apply override modifiers
        for (const modifier of override_modifiers) {
            if (modifier.target === "experience_from_selection") {
                const experience_indices: number[] = character.domain_card_choices[modifier.domain_card_id][modifier.choice_id].map(str => parseInt(str))

                if (!experience_indices || experience_indices.length === 0) continue;

                for (const i of experience_indices) {
                    if (i === null || i < 0 || i > count) continue;
                    if (modifier.type === 'flat') {
                        new_experience_modifiers[i] = modifier.value;
                    } else if (modifier.type === "derived_from_trait") {
                        new_experience_modifiers[i] = Math.ceil(Number(traits[modifier.trait]) * modifier.multiplier);
                    } else if (modifier.type === "derived_from_proficiency") {
                        new_experience_modifiers[i] = Math.ceil(proficiency * modifier.multiplier)
                    } else if (modifier.type === "derived_from_level") {
                        new_experience_modifiers[i] = Math.ceil(character.level * modifier.multiplier)
                    }
                }
            }
        }

        experience_modifiers = new_experience_modifiers;
    })

    // * derived proficiency
    $effect(() => {
        if (!character) return
        let new_proficiency: number = BASE_STATS.proficiency

        new_proficiency = apply_modifiers(base_modifiers, 'proficiency', new_proficiency, 'base')

        // tier-based increases
        if (character.level >= 2) new_proficiency++
        if (character.level >= 5) new_proficiency++
        if (character.level >= 8) new_proficiency++

        new_proficiency = apply_modifiers(bonus_modifiers, 'proficiency', new_proficiency, 'bonus')
        new_proficiency = apply_modifiers(override_modifiers, 'proficiency', new_proficiency, 'override')

        proficiency = new_proficiency;
    })

    // * derived evasion
    $effect(() => {
        if (!character) return
        let new_evasion: number = BASE_STATS.evasion;

        // initialize with primary class's starting max hp
        if (primary_class) {
            new_evasion = primary_class.starting_evasion
        }

        new_evasion = apply_modifiers(base_modifiers, 'evasion', new_evasion, 'base')
        new_evasion = apply_modifiers(bonus_modifiers, 'evasion', new_evasion, 'bonus')
        new_evasion = apply_modifiers(override_modifiers, 'evasion', new_evasion, 'override')

        evasion = new_evasion;
    })

    // * derived max_hp
    $effect(() => {
        if (!character) return
        let new_max_hp: number = BASE_STATS.max_hp;

        // initialize with primary class's starting max hp
        if (primary_class) {
            new_max_hp = primary_class.starting_max_hp
        }

        new_max_hp = apply_modifiers(base_modifiers, 'max_hp', new_max_hp, 'base')
        new_max_hp = apply_modifiers(bonus_modifiers, 'max_hp', new_max_hp, 'bonus')
        new_max_hp = apply_modifiers(override_modifiers, 'max_hp', new_max_hp, 'override')

        max_hp = new_max_hp;
    })

    // * derive spellcast roll bonus
    $effect(() => {
        if (!character) return
        let new_spellcast_roll_bonus: number = BASE_STATS.spellcast_roll_bonus;

        new_spellcast_roll_bonus = apply_modifiers(base_modifiers, 'spellcast_roll_bonus', new_spellcast_roll_bonus, 'base')
        new_spellcast_roll_bonus = apply_modifiers(bonus_modifiers, 'spellcast_roll_bonus', new_spellcast_roll_bonus, 'bonus')
        new_spellcast_roll_bonus = apply_modifiers(override_modifiers, 'spellcast_roll_bonus', new_spellcast_roll_bonus, 'override')

        spellcast_roll_bonus = new_spellcast_roll_bonus;
    })

    // * derived max_stress
    $effect(() => {
        if (!character) return
        let new_max_stress: number = BASE_STATS.max_stress;

        new_max_stress = apply_modifiers(base_modifiers, 'max_stress', new_max_stress, 'base')
        new_max_stress = apply_modifiers(bonus_modifiers, 'max_stress', new_max_stress, 'bonus')
        new_max_stress = apply_modifiers(override_modifiers, 'max_stress', new_max_stress, 'override')

        max_stress = new_max_stress;
    })

    // * derived primary_class_mastery_level and secondary_class_mastery_level
    $effect(() => {
        if (!character) return;
        let masteryNum: number = BASE_STATS.primary_class_mastery_level

        // having a primary class guarantees at least foundation (1)
        if (character.primary_class_id) masteryNum = Math.max(masteryNum, 1);

        masteryNum = apply_modifiers(base_modifiers, 'primary_class_mastery_level', masteryNum, 'base')

        for (let i = 2; i <= character.level; i++) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            const choice_A = level_choices.A;
            const choice_B = level_choices.B;

            if ((choice_A.option_id === "tier_3_subclass_upgrade" || choice_A.option_id === "tier_4_subclass_upgrade") && choice_A.selected_subclass_upgrade === "primary") {
                masteryNum++;
            }

            if ((choice_B.option_id === "tier_3_subclass_upgrade" || choice_B.option_id === "tier_4_subclass_upgrade") && choice_B.selected_subclass_upgrade === "primary") {
                masteryNum++;
            }
        }

        masteryNum = apply_modifiers(bonus_modifiers, 'primary_class_mastery_level', masteryNum, 'bonus')
        masteryNum = apply_modifiers(override_modifiers, 'primary_class_mastery_level', masteryNum, 'override')

        // clamp 0..3 and assign with proper literal type
        const masteryClamped = Math.max(0, Math.min(3, Math.trunc(masteryNum))) as 0 | 1 | 2 | 3
        primary_class_mastery_level = masteryClamped
    })

    // * derived secondary_class_mastery_level
    $effect(() => {
        if (!character) return;
        let masteryNum: number = BASE_STATS.secondary_class_mastery_level

        // having a secondary class guarantees at least foundation (1)
        if (character.secondary_class_id) masteryNum = Math.max(masteryNum, 1);

        masteryNum = apply_modifiers(base_modifiers, 'secondary_class_mastery_level', masteryNum, 'base')

        for (let i = 2; i <= character.level; i++) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            const choice_A = level_choices.A;
            const choice_B = level_choices.B;

            if ((choice_A.option_id === "tier_3_subclass_upgrade" || choice_A.option_id === "tier_4_subclass_upgrade") && choice_A.selected_subclass_upgrade === "secondary") {
                masteryNum++;
            }
            if ((choice_B.option_id === "tier_3_subclass_upgrade" || choice_B.option_id === "tier_4_subclass_upgrade") && choice_B.selected_subclass_upgrade === "secondary") {
                masteryNum++;
            }
        }

        masteryNum = apply_modifiers(bonus_modifiers, 'secondary_class_mastery_level', masteryNum, 'bonus')
        masteryNum = apply_modifiers(override_modifiers, 'secondary_class_mastery_level', masteryNum, 'override')

        // clamp 0..3 and assign with proper literal type
        const masteryClamped = Math.max(0, Math.min(2, Math.trunc(masteryNum))) as 0 | 1 | 2 | 3
        secondary_class_mastery_level = masteryClamped
    })

    // * derived max_hope
    $effect(() => {
        if (!character) return;
        let new_max_hope: number = BASE_STATS.max_hope

        new_max_hope = apply_modifiers(base_modifiers, 'max_hope', new_max_hope, 'base')
        new_max_hope = apply_modifiers(bonus_modifiers, 'max_hope', new_max_hope, 'bonus')
        new_max_hope = apply_modifiers(override_modifiers, 'max_hope', new_max_hope, 'override')

        max_hope = new_max_hope;
    })

    // * derived max_armor
    $effect(() => {
        if (!character) return;
        let new_max_armor: number = BASE_STATS.max_armor

        new_max_armor = apply_modifiers(base_modifiers, 'max_armor', new_max_armor, 'base')
        new_max_armor = apply_modifiers(bonus_modifiers, 'max_armor', new_max_armor, 'bonus')
        new_max_armor = apply_modifiers(override_modifiers, 'max_armor', new_max_armor, 'override')

        max_armor = Math.min(new_max_armor, 12)
    })

    // * derived max_burden
    $effect(() => {
        if (!character) return;
        let new_max_burden: number = BASE_STATS.max_burden

        new_max_burden = apply_modifiers(base_modifiers, 'max_burden', new_max_burden, 'base')
        new_max_burden = apply_modifiers(bonus_modifiers, 'max_burden', new_max_burden, 'bonus')
        new_max_burden = apply_modifiers(override_modifiers, 'max_burden', new_max_burden, 'override')

        max_burden = new_max_burden;
    })

    // * derived damage_thresholds
    $effect(() => {
        if (!character) return
        // default unarmored thresholds
        let thresholds: { major: number, severe: number } = {
            major: character.level,
            severe: character.level * 2
        }

        // override with currently equiped armor
        if (armor) {
            thresholds.major = armor.damage_thresholds.major
            thresholds.severe = armor.damage_thresholds.severe
        }

        thresholds.major = apply_modifiers(base_modifiers, 'major_damage_threshold', thresholds.major, 'base')
        thresholds.severe = apply_modifiers(base_modifiers, 'severe_damage_threshold', thresholds.severe, 'base')

        // level-based bump
        if (thresholds.major !== character.level && thresholds.severe !== character.level * 2) {
            thresholds.major += character.level;
            thresholds.severe += character.level;
        }

        thresholds.major = apply_modifiers(bonus_modifiers, 'major_damage_threshold', thresholds.major, 'bonus')
        thresholds.severe = apply_modifiers(bonus_modifiers, 'severe_damage_threshold', thresholds.severe, 'bonus')

        thresholds.major = apply_modifiers(override_modifiers, 'major_damage_threshold', thresholds.major, 'override')
        thresholds.severe = apply_modifiers(override_modifiers, 'severe_damage_threshold', thresholds.severe, 'override')

        damage_thresholds = thresholds
    })

    // * derived max_experiences
    $effect(() => {
        if (!character) return;
        let new_max_experiences: number = BASE_STATS.max_experiences;

        new_max_experiences = apply_modifiers(base_modifiers, 'max_experiences', new_max_experiences, 'base')

        // tier-based increases
        if (character.level >= 2) new_max_experiences++
        if (character.level >= 5) new_max_experiences++
        if (character.level >= 8) new_max_experiences++

        new_max_experiences = apply_modifiers(bonus_modifiers, 'max_experiences', new_max_experiences, 'bonus')
        new_max_experiences = apply_modifiers(override_modifiers, 'max_experiences', new_max_experiences, 'override')

        // ! keep experiences array length in sync with max_experiences
        if (character.experiences.length < new_max_experiences) {
            console.warn("Experience list is too short. Adding a new one.")
            character.experiences.push("");
        } else if (character.experiences.length > new_max_experiences) {
            console.warn("Experience list is too long. Removing the last one.")
            character.experiences.pop();
        }

        max_experiences = new_max_experiences;
    })

    // * derived max_domain_card_loadout
    $effect(() => {
        if (!character) return;
        let new_max_domain_card_loadout: number = BASE_STATS.max_domain_card_loadout

        new_max_domain_card_loadout = apply_modifiers(base_modifiers, 'max_domain_card_loadout', new_max_domain_card_loadout, 'base')
        new_max_domain_card_loadout = apply_modifiers(bonus_modifiers, 'max_domain_card_loadout', new_max_domain_card_loadout, 'bonus')
        new_max_domain_card_loadout = apply_modifiers(override_modifiers, 'max_domain_card_loadout', new_max_domain_card_loadout, 'override')

        max_domain_card_loadout = new_max_domain_card_loadout;
    })

    // --- cleanup ---
    const destroy = () => { }

    return {
        // read only
        get tier_2_marked_traits() { return tier_2_marked_traits },
        get tier_3_marked_traits() { return tier_3_marked_traits },
        get tier_4_marked_traits() { return tier_4_marked_traits },
        get options_used() { return options_used },

        // referenced objects
        get ancestry_card() { return ancestry_card },
        get community_card() { return community_card },
        get transformation_card() { return transformation_card },
        get primary_class() { return primary_class },
        get primary_subclass() { return primary_subclass },
        get secondary_class() { return secondary_class },
        get secondary_subclass() { return secondary_subclass },
        get armor() { return armor },
        get primary_weapon() { return primary_weapon },
        get secondary_weapon() { return secondary_weapon },
        get level_up_domain_cards() { return level_up_domain_cards },
        get level_up_chosen_options() { return level_up_chosen_options },
        get additional_domain_cards() { return additional_domain_cards },

        // derived stats
        get domain_card_vault() { return domain_card_vault },
        get domain_card_loadout() { return domain_card_loadout },
        get traits() { return traits },
        get proficiency() { return proficiency },
        get experience_modifiers() { return experience_modifiers },
        get max_experiences() { return max_experiences },
        get max_domain_card_loadout() { return max_domain_card_loadout },
        get max_hope() { return max_hope },
        get max_armor() { return max_armor },
        get max_hp() { return max_hp },
        get max_stress() { return max_stress },
        get max_burden() { return max_burden },
        get evasion() { return evasion },
        get damage_thresholds() { return damage_thresholds },
        get primary_class_mastery_level() { return primary_class_mastery_level },
        get secondary_class_mastery_level() { return secondary_class_mastery_level },
        get spellcast_trait() { return spellcast_trait },
        get spellcast_roll_bonus() { return spellcast_roll_bonus },

        // read/write
        get character() { return character },
        set character(value) { character = value },

        // helper functions
        destroy,
    }
}

const CHARACTER_KEY = Symbol('Character')

export const setCharacterContext = (uid: string) => {
    const newCharacter = createCharacter(uid);
    return setContext(CHARACTER_KEY, newCharacter)
}

export const getCharacterContext = (): ReturnType<typeof setCharacterContext> => {
    return getContext(CHARACTER_KEY)
}