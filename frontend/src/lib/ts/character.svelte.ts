import { getAppContext } from './app.svelte';
import { ALL_LEVEL_UP_OPTIONS, BLANK_LEVEL_UP_OPTION, TIER_1_BASE_OPTIONS, TIER_2_BASE_OPTIONS } from './rules';
import type { Card, Character, LevelUpOption, Traits } from './types';
import { getContext, setContext } from 'svelte';

function createCharacter(uid: string) {
    const app = getAppContext();
    let character: Character | null = $state(null);

    // ! load character from app context
    $effect(() => {
        character = app.characters.find((c) => c.uid === uid) || null;
    });

    // ! keep experiences array length in sync with max_experiences
    $effect(() => {
        if (!character) return;
        if (character.experiences.length < character.derived_stats.max_experiences) {
            character.experiences.push("");
        } else if (character.experiences.length > character.derived_stats.max_experiences) {
            character.experiences.pop();
        }
    });

    // ! clear level up options above the current level
    $effect(() => {
        if (!character) return;
        console.warn("Cleared level_up_choices above level", character.level);
        if (character.level < 2) character.level_up_choices[2] = { A: BLANK_LEVEL_UP_OPTION, B: BLANK_LEVEL_UP_OPTION };
        if (character.level < 3) character.level_up_choices[3] = { A: BLANK_LEVEL_UP_OPTION, B: BLANK_LEVEL_UP_OPTION };
        if (character.level < 4) character.level_up_choices[4] = { A: BLANK_LEVEL_UP_OPTION, B: BLANK_LEVEL_UP_OPTION };
        if (character.level < 5) character.level_up_choices[5] = { A: BLANK_LEVEL_UP_OPTION, B: BLANK_LEVEL_UP_OPTION };
        if (character.level < 6) character.level_up_choices[6] = { A: BLANK_LEVEL_UP_OPTION, B: BLANK_LEVEL_UP_OPTION };
        if (character.level < 7) character.level_up_choices[7] = { A: BLANK_LEVEL_UP_OPTION, B: BLANK_LEVEL_UP_OPTION };
        if (character.level < 8) character.level_up_choices[8] = { A: BLANK_LEVEL_UP_OPTION, B: BLANK_LEVEL_UP_OPTION };
        if (character.level < 9) character.level_up_choices[9] = { A: BLANK_LEVEL_UP_OPTION, B: BLANK_LEVEL_UP_OPTION };
        if (character.level < 10) character.level_up_choices[10] = { A: BLANK_LEVEL_UP_OPTION, B: BLANK_LEVEL_UP_OPTION };
    })

    // ! clear subclass if class is null
    $effect(() => {
        if (!character) return;
        if (!character.primary_class) character.primary_subclass = null;
        if (!character.secondary_class) character.secondary_subclass = null;
    })

    // ! Clear level up option if it's used more than it's max
    let options_used: Record<string, number> = $derived.by(() => {
        if (!character) return {};
        const used: Record<string, number> = {};

        Object.values(character.level_up_choices).forEach((choice: { A: LevelUpOption, B: LevelUpOption }) => {
            if (choice.A.id) {
                if (!used[choice.A.id]) used[choice.A.id] = 1;
                else used[choice.A.id]++;
            }
            if (choice.B.id) {
                if (!used[choice.B.id]) used[choice.B.id] = 1;
                else used[choice.B.id]++;
            }
        });

        return used;
    });
    const options_max: Record<string, number> = ALL_LEVEL_UP_OPTIONS.reduce((acc, option) => {
        acc[option.id] = option.max;
        return acc;
    }, {} as Record<string, number>);

    $effect(() => {
        if (!character) return;
        for (let i = 10; i >= 2; i--) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];

            if (level_choices.A.id && options_max[level_choices.A.id] > -1 && options_used[level_choices.A.id] > options_max[level_choices.A.id]) {
                console.warn(`Option ${level_choices.A.id} used more than the max of ${options_max[level_choices.A.id]}`);
                level_choices.A = BLANK_LEVEL_UP_OPTION;
            }
            if (level_choices.B.id && options_max[level_choices.B.id] > -1 && options_used[level_choices.B.id] > options_max[level_choices.B.id]) {
                console.warn(`Option ${level_choices.B.id} used more than the max of ${options_max[level_choices.B.id]}`);
                level_choices.B = BLANK_LEVEL_UP_OPTION;
            }
        }
    });

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

    function clear_duplicated_marked_traits(level_choice_ids: string[], tier_marked_traits: Record<keyof Traits, boolean>, level_choices: { A: LevelUpOption, B: LevelUpOption }) {
        const choice_A = level_choices.A;
        const choice_B = level_choices.B;
        if (choice_A.id && level_choice_ids.includes(choice_A.id)) {
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
        } else if (choice_B.id && level_choice_ids.includes(choice_B.id)) {
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
        let mt: Record<keyof Traits, boolean> = {
            agility: false,
            strength: false,
            finesse: false,
            instinct: false,
            presence: false,
            knowledge: false,
        }
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

        for (let i = 2; i <= character.level; i++) {
            // clear marks at tier 3
            if (i === 5) {
                tier_2_mt = mt;
                mt = {
                    agility: false,
                    strength: false,
                    finesse: false,
                    instinct: false,
                    presence: false,
                    knowledge: false,
                }
            }

            // clear marks at tier 4
            if (i === 8) {
                tier_3_mt = mt;
                mt = {
                    agility: false,
                    strength: false,
                    finesse: false,
                    instinct: false,
                    presence: false,
                    knowledge: false,
                }
            }

            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            if (i <= 4) {
                clear_duplicated_marked_traits(["tier_2_traits"], tier_2_mt, level_choices);
            } else if (i <= 7) {
                clear_duplicated_marked_traits(["tier_2_traits", "tier_3_traits"], tier_3_mt, level_choices);
            } else {
                clear_duplicated_marked_traits(["tier_2_traits", "tier_3_traits", "tier_4_traits"], mt, level_choices);
            }
        }

        tier_2_marked_traits = tier_2_mt;
        tier_3_marked_traits = tier_3_mt;
        tier_4_marked_traits = mt;
    })

    // ! clear conflicting selected experience choices at each level
    $effect(() => {
        if (!character) return;

        for (let i = 2; i <= 10; i++) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            const choice_A = level_choices.A;
            const choice_B = level_choices.B;

            // clear selected experiences if the level choice is not an experience bonus choice
            if (!choice_A.id || !["tier_2_experience_bonus", "tier_3_experience_bonus", "tier_4_experience_bonus"].includes(choice_A.id)) {
                if (choice_A.selected_experiences.A !== null || choice_A.selected_experiences.B !== null) {
                    console.warn(`Clearing selected experiences because level choice was changed to ${choice_A.id}`)
                    choice_A.selected_experiences.A = null;
                    choice_A.selected_experiences.B = null;
                }
            }
            if (!choice_B.id || !["tier_2_experience_bonus", "tier_3_experience_bonus", "tier_4_experience_bonus"].includes(choice_B.id)) {
                if (choice_B.selected_experiences.A !== null || choice_B.selected_experiences.B !== null) {
                    console.warn(`Clearing selected experiences because level choice was changed to ${choice_B.id}`)
                    choice_B.selected_experiences.A = null;
                    choice_B.selected_experiences.B = null;
                }
            }

            // clear conflicting selected experiences
            if (choice_A.selected_experiences.A !== null && choice_A.selected_experiences.B !== null && choice_A.selected_experiences.A === choice_A.selected_experiences.B) {
                console.warn(`Experience ${choice_A.selected_experiences.A} is already used in another option`);
                choice_A.selected_experiences.B = null;
            }
            if (choice_B.selected_experiences.A !== null && choice_B.selected_experiences.B !== null && choice_B.selected_experiences.A === choice_B.selected_experiences.B) {
                console.warn(`Experience ${choice_B.selected_experiences.A} is already used in another option`);
                choice_B.selected_experiences.B = null;
            }
        }
    })

    // ! clear conflicting domain card choices at each level and update the domain card vault
    $effect(() => {
        if (!character) return;

        if (!character.primary_class) {
            character.level_up_domain_cards[1] = { A: null, B: null }
            return;
        }

        let domain_card_vault: Card<"domain">[] = Object.values(character.level_up_domain_cards[1]).filter((card) => card !== null)

        for (let i = 2; i <= 10; i++) {
            // ? add domain cards to the vault
            // ? level up domain cards and domain card choices
            const level_up_domain_cards = character.level_up_domain_cards[i as keyof typeof character.level_up_domain_cards];
            if (level_up_domain_cards.A !== null && domain_card_vault.some(card => card.title === level_up_domain_cards.A?.title)) {
                console.warn(`Domain card ${level_up_domain_cards.A?.title} is already in the vault`);
                level_up_domain_cards.A = null;
            } else if (level_up_domain_cards.A !== null) {
                domain_card_vault.push(level_up_domain_cards.A);
            }


            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            const choice_A = level_choices.A;
            const choice_B = level_choices.B;

            // clear domain card choices if the level choice is not a domain card choice
            if (!choice_A.id || !["tier_2_domain_card", "tier_3_domain_card", "tier_4_domain_card"].includes(choice_A.id)) {
                if (choice_A.domain_cards_added.A !== null || choice_A.domain_cards_added.B !== null) {
                    console.warn(`Clearing domain card choices because level choice was changed to ${choice_A.id}`)
                    choice_A.domain_cards_added.A = null;
                    choice_A.domain_cards_added.B = null;
                }
            }
            if (!choice_B.id || !["tier_2_domain_card", "tier_3_domain_card", "tier_4_domain_card"].includes(choice_B.id)) {
                if (choice_B.domain_cards_added.A !== null || choice_B.domain_cards_added.B !== null) {
                    console.warn(`Clearing domain card choices because level choice was changed to ${choice_B.id}`)
                    choice_B.domain_cards_added.A = null;
                    choice_B.domain_cards_added.B = null;
                }
            }

            // clear domain card choices that are already in the vault
            if (choice_A.domain_cards_added.A !== null && domain_card_vault.some(card => card.title === choice_A.domain_cards_added.A?.title)) {
                console.warn(`Domain card ${choice_A.domain_cards_added.A?.title} is already in the vault`);
                choice_A.domain_cards_added.A = null;
            } else if (choice_A.domain_cards_added.A !== null) {
                domain_card_vault.push(choice_A.domain_cards_added.A);
            }

            if (choice_A.domain_cards_added.B !== null && domain_card_vault.some(card => card.title === choice_A.domain_cards_added.B?.title)) {
                console.warn(`Domain card ${choice_A.domain_cards_added.B?.title} is already in the vault`);
                choice_A.domain_cards_added.B = null;
            } else if (choice_A.domain_cards_added.B !== null) {
                domain_card_vault.push(choice_A.domain_cards_added.B);
            }

            if (choice_B.domain_cards_added.A !== null && domain_card_vault.some(card => card.title === choice_B.domain_cards_added.A?.title)) {
                console.warn(`Domain card ${choice_B.domain_cards_added.A?.title} is already in the vault`);
                choice_B.domain_cards_added.A = null;
            } else if (choice_B.domain_cards_added.A !== null) {
                domain_card_vault.push(choice_B.domain_cards_added.A);
            }
            if (choice_B.domain_cards_added.B !== null && domain_card_vault.some(card => card.title === choice_B.domain_cards_added.B?.title)) {
                console.warn(`Domain card ${choice_B.domain_cards_added.B?.title} is already in the vault`);
                choice_B.domain_cards_added.B = null;
            } else if (choice_B.domain_cards_added.B !== null) {
                domain_card_vault.push(choice_B.domain_cards_added.B);
            }
        }

        // * derived domain card vault
        character.derived_domain_card_vault = domain_card_vault;
    })

    // ! remove invalid indices from the domain card loadout (>max or not in the domain card vault)
    $effect(() => {
        if (!character) return;
        const max = character.derived_stats.max_domain_card_loadout;
        const unique_indices = [...new Set(character.ephemeral_stats.domain_card_loadout)];
        const valid_indices = unique_indices.filter((i) => i >= 0 && i < max && i < (character?.derived_domain_card_vault.length || 0));

        if (valid_indices.length !== unique_indices.length) {
            console.warn(`Removing invalid indices from the domain card loadout`);
            character.ephemeral_stats.domain_card_loadout = valid_indices;
        }
    })

    // TODO:
    // ! calculate derived stats

    // * derived effects -- used to calculate most stats --
    $effect(() => { })
    // * derived traits
    $effect(() => { })
    // * derived proficiency
    $effect(() => { })
    // * derived max_experiences
    $effect(() => { })
    // * derived max_domain_card_loadout
    $effect(() => { })
    // * derived max_hope
    $effect(() => { })
    // * derived max_armor
    $effect(() => { })
    // * derived max_hp
    $effect(() => { })
    // * derived max_stress
    $effect(() => { })
    // * derived evasion
    $effect(() => { })
    // * derived damage_thresholds
    $effect(() => { })
    // * derived primary_class_mastery_level
    $effect(() => { })
    // * derived secondary_class_mastery_level
    $effect(() => { })
    // * derived experience_modifiers
    $effect(() => { })


    // --- cleanup ---
    const destroy = () => { }

    return {
        // read only
        get tier_2_marked_traits() { return tier_2_marked_traits },
        get tier_3_marked_traits() { return tier_3_marked_traits },
        get tier_4_marked_traits() { return tier_4_marked_traits },
        get options_used() { return options_used },
        get options_max() { return options_max },

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