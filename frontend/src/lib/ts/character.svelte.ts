import { getAppContext } from './app.svelte';
import { ALL_LEVEL_UP_OPTIONS, BLANK_LEVEL_UP_OPTION, TIER_1_BASE_OPTIONS, TIER_2_BASE_OPTIONS } from './rules';
import type { Character, LevelUpOption, Traits } from './types';
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
        if (character.experiences.length < character.derieved_stats.max_experiences) {
            character.experiences.push("");
        } else if (character.experiences.length > character.derieved_stats.max_experiences) {
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
        for (let i = 10; i > 1; i--) {
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
    function clear_duplicated_marked_traits(level_choice_id: string, tier_marked_traits: Record<keyof Traits, boolean>, level_choices: { A: LevelUpOption, B: LevelUpOption }) {
        const choice_A = level_choices.A;
        const choice_B = level_choices.B;
        if (choice_A.id === level_choice_id) {
            if (choice_A.marked_traits.A) {
                if (tier_marked_traits[choice_A.marked_traits.A]) {
                    choice_A.marked_traits.A = null;
                    console.warn(`${level_choice_id}: Trait ${choice_A.marked_traits.A} is already used in another option`);
                } else {
                    tier_marked_traits[choice_A.marked_traits.A] = true;
                }
            }
            if (choice_A.marked_traits.B) {
                if (tier_marked_traits[choice_A.marked_traits.B]) {
                    choice_A.marked_traits.B = null;
                    console.warn(`${level_choice_id}: Trait ${choice_A.marked_traits.B} is already used in another option`);
                } else {
                    tier_marked_traits[choice_A.marked_traits.B] = true;
                }
            }
        } else if (choice_B.id === level_choice_id) {
            if (choice_B.marked_traits.A) {
                if (tier_marked_traits[choice_B.marked_traits.A]) {
                    choice_B.marked_traits.A = null;
                } else {
                    tier_marked_traits[choice_B.marked_traits.A] = true;
                }
            }
            if (choice_B.marked_traits.B) {
                if (tier_marked_traits[choice_B.marked_traits.B]) {
                    choice_B.marked_traits.B = null;
                } else {
                    tier_marked_traits[choice_B.marked_traits.B] = true;
                }
            }
        }
    }

    $effect(() => {
        // tier 2
        if (!character) return;
        const tier_2_marked_traits: Record<keyof Traits, boolean> = {
            agility: false,
            strength: false,
            finesse: false,
            instinct: false,
            presence: false,
            knowledge: false,
        }
        const tier_3_marked_traits: Record<keyof Traits, boolean> = {
            agility: false,
            strength: false,
            finesse: false,
            instinct: false,
            presence: false,
            knowledge: false,
        }
        const tier_4_marked_traits: Record<keyof Traits, boolean> = {
            agility: false,
            strength: false,
            finesse: false,
            instinct: false,
            presence: false,
            knowledge: false,
        }
        for (let i = 1; i <= 10; i++) {
            const level_choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            clear_duplicated_marked_traits("tier_2_traits", tier_2_marked_traits, level_choices);
            clear_duplicated_marked_traits("tier_3_traits", tier_3_marked_traits, level_choices);
            clear_duplicated_marked_traits("tier_4_traits", tier_4_marked_traits, level_choices);
        }
    })


    // todo:
    // ! clear conflicting selected experiences at each tier
    // ! clear conflicting domain cards at each tier

    // --- cleanup ---
    const destroy = () => { }

    return {
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