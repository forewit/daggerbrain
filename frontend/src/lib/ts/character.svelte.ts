import { getAppContext } from './app.svelte';
import { ALL_LEVEL_UP_OPTIONS, BLANK_LEVEL_UP_CHOICE, BLANK_LEVEL_UP_OPTION, TIER_1_BASE_OPTIONS, TIER_2_BASE_OPTIONS, TRAIT_OPTIONS } from './constants/rules';
import { EFFECTS } from './constants/effects';
import type { Card, Character, Effect, LevelUpChoice, LevelUpOption, Traits } from './types';
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
            console.warn("Experience list is too short. Adding a new one.")
            character.experiences.push("");
        } else if (character.experiences.length > character.derived_stats.max_experiences) {
            console.warn("Experience list is too long. Removing the last one.")
            character.experiences.pop();
        }
    });

    // ! clear invalid base traits
    $effect(() => {
        if (!character) return;

        let available_options = [...TRAIT_OPTIONS];
        for (const key in character.base_stats.traits) {
            const value = character.base_stats.traits[key as keyof Traits]
            const i = available_options.findIndex(option => option === value)

            if (value === null) {
                continue
            } else if (i !== -1) {
                available_options.splice(i, 1)
            } else {
                console.warn(`${value} was not a valid trait option. setting to ${key} to null`)
                character.base_stats.traits[key as keyof Traits] = null
            }
        }
    })

    // ! clear level up options above the current level
    $effect(() => {
        if (!character) return;
        console.warn("Cleared level_up_choices above level", character.level);
        if (character.level < 2) character.level_up_choices[2] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 3) character.level_up_choices[3] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 4) character.level_up_choices[4] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 5) character.level_up_choices[5] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 6) character.level_up_choices[6] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 7) character.level_up_choices[7] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 8) character.level_up_choices[8] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 9) character.level_up_choices[9] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
        if (character.level < 10) character.level_up_choices[10] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
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

            if (level_choices.A.option_id && ALL_LEVEL_UP_OPTIONS[level_choices.A.option_id].max > -1 && options_used[level_choices.A.option_id] > ALL_LEVEL_UP_OPTIONS[level_choices.A.option_id].max) {
                console.warn(`Option ${level_choices.A.option_id} used more than the max of ${ALL_LEVEL_UP_OPTIONS[level_choices.A.option_id].max}`);
                level_choices.A = BLANK_LEVEL_UP_CHOICE;
            }
            if (level_choices.B.option_id && ALL_LEVEL_UP_OPTIONS[level_choices.B.option_id].max > -1 && options_used[level_choices.B.option_id] > ALL_LEVEL_UP_OPTIONS[level_choices.B.option_id].max) {
                console.warn(`Option ${level_choices.B.option_id} used more than the max of ${ALL_LEVEL_UP_OPTIONS[level_choices.B.option_id].max}`);
                level_choices.B = BLANK_LEVEL_UP_CHOICE;
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

    function clear_duplicated_marked_traits(level_choice_ids: string[], tier_marked_traits: Record<keyof Traits, boolean>, level_choices: { A: LevelUpChoice, B: LevelUpChoice }) {
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
        } else if (choice_B.option_id && level_choice_ids.includes(choice_B.option_id)) {
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
            if (!choice_A.option_id || !["tier_2_experience_bonus", "tier_3_experience_bonus", "tier_4_experience_bonus"].includes(choice_A.option_id)) {
                if (choice_A.selected_experiences.A !== null || choice_A.selected_experiences.B !== null) {
                    console.warn(`Clearing selected experiences because level choice was changed to ${choice_A.option_id}`)
                    choice_A.selected_experiences.A = null;
                    choice_A.selected_experiences.B = null;
                }
            }
            if (!choice_B.option_id || !["tier_2_experience_bonus", "tier_3_experience_bonus", "tier_4_experience_bonus"].includes(choice_B.option_id)) {
                if (choice_B.selected_experiences.A !== null || choice_B.selected_experiences.B !== null) {
                    console.warn(`Clearing selected experiences because level choice was changed to ${choice_B.option_id}`)
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
            if (!choice_A.option_id || !["tier_2_domain_card", "tier_3_domain_card", "tier_4_domain_card"].includes(choice_A.option_id)) {
                if (choice_A.selected_domain_card !== null) {
                    console.warn(`Clearing selected domain card because level choice was changed to ${choice_A.option_id}`)
                    choice_A.selected_domain_card = null;
                }
            }
            if (!choice_B.option_id || !["tier_2_domain_card", "tier_3_domain_card", "tier_4_domain_card"].includes(choice_B.option_id)) {
                if (choice_B.selected_domain_card !== null) {
                    console.warn(`Clearing selected domain card because level choice was changed to ${choice_B.option_id}`)
                    choice_B.selected_domain_card = null;
                }
            }

            // clear domain card choices that are already in the vault
            if (choice_A.selected_domain_card !== null && domain_card_vault.some(card => card.title === choice_A.selected_domain_card?.title)) {
                console.warn(`Domain card ${choice_A.selected_domain_card?.title} is already in the vault`);
                choice_A.selected_domain_card = null;
            } else if (choice_A.selected_domain_card !== null) {
                domain_card_vault.push(choice_A.selected_domain_card);
            }

            if (choice_B.selected_domain_card !== null && domain_card_vault.some(card => card.title === choice_B.selected_domain_card?.title)) {
                console.warn(`Domain card ${choice_B.selected_domain_card?.title} is already in the vault`);
                choice_B.selected_domain_card = null;
            } else if (choice_B.selected_domain_card !== null) {
                domain_card_vault.push(choice_B.selected_domain_card);
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

        if (valid_indices.length !== unique_indices.length || valid_indices.length !== character.ephemeral_stats.domain_card_loadout.length) {
            console.warn(`Removing invalid indices from the domain card loadout`);
            character.ephemeral_stats.domain_card_loadout = valid_indices;
        }
    })

    // * derived experience_modifiers (no effects)
    $effect(() => {
        if (!character) return;
        const count = character.experiences.length;
        const base = character.base_stats.experience_modifier;
        const modifiers: number[] = Array(count).fill(base);

        // apply level-up experience bonus selections across levels up to current level
        for (let i = 2; i <= character.level; i++) {
            const levelChoices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            if (!levelChoices) continue;

            const choices = [levelChoices.A, levelChoices.B];
            for (const choice of choices) {
                if (!choice || !choice.option_id) continue;
                if (!["tier_2_experience_bonus", "tier_3_experience_bonus", "tier_4_experience_bonus"].includes(choice.option_id)) continue;

                const a = choice.selected_experiences.A;
                const b = choice.selected_experiences.B;

                if (a !== null && a >= 0 && a < count) modifiers[a] = modifiers[a] + 1;
                if (b !== null && b >= 0 && b < count) modifiers[b] = modifiers[b] + 1;
            }
        }

        character.derived_stats.experience_modifiers = modifiers;
    })

    // * derived effects -- used to calculate most stats --
    let base_effects: Effect[] = $state([])
    let bonus_effects: Effect[] = $state([])
    let override_effects: Effect[] = $state([])
    $effect(() => {
        if (!character) return

        let all_effects: Effect[] = []

        const level = character.level

        function pushEffectIds(effectIds: (keyof typeof EFFECTS)[] | undefined) {
            if (!effectIds || effectIds.length === 0) return
            for (const id of effectIds) {
                const effect = EFFECTS[id]
                if (!effect) continue
                const withinMin = effect.min_level === null || level >= effect.min_level
                const withinMax = effect.max_level === null || level <= effect.max_level
                if (withinMin && withinMax) all_effects.push(effect)
            }
        }

        // ancestry card
        if (character.ancestry_card) {
            character.ancestry_card.features.forEach(f => pushEffectIds(f.effect_ids))
        }

        // community card
        if (character.community_card) {
            character.community_card.features.forEach(f => pushEffectIds(f.effect_ids))
        }

        // transformation card
        if (character.transformation_card) {
            character.transformation_card.features.forEach(f => pushEffectIds(f.effect_ids))
        }

        // primary class
        if (character.primary_class) {
            pushEffectIds(character.primary_class.hope_feature.effect_ids)
            character.primary_class.class_features.forEach(f => pushEffectIds(f.effect_ids))
        }

        // primary subclass cards (gate by mastery level)
        if (character.primary_subclass) {
            const primaryMastery = character.derived_stats.primary_class_mastery_level
            pushEffectIds(character.primary_subclass.foundation_card.features.flatMap(f => f.effect_ids))
            if (primaryMastery >= 2) {
                pushEffectIds(character.primary_subclass.specialization_card.features.flatMap(f => f.effect_ids))
            }
            if (primaryMastery >= 3) {
                pushEffectIds(character.primary_subclass.mastery_card.features.flatMap(f => f.effect_ids))
            }
        }

        // secondary class
        if (character.secondary_class) {
            pushEffectIds(character.secondary_class.hope_feature.effect_ids)
            character.secondary_class.class_features.forEach(f => pushEffectIds(f.effect_ids))
        }

        // secondary subclass cards (gate by mastery level)
        if (character.secondary_subclass) {
            const secondaryMastery = character.derived_stats.secondary_class_mastery_level
            pushEffectIds(character.secondary_subclass.foundation_card.features.flatMap(f => f.effect_ids))
            if (secondaryMastery >= 2) {
                pushEffectIds(character.secondary_subclass.specialization_card.features.flatMap(f => f.effect_ids))
            }
            if (secondaryMastery >= 3) {
                pushEffectIds(character.secondary_subclass.mastery_card.features.flatMap(f => f.effect_ids))
            }
        }

        // effects from level up choices
        for (let i = 2; i <= character.level; i++) {
            const levelChoices = character.level_up_choices[i as keyof typeof character.level_up_choices];
            if (!levelChoices) continue;

            const choices = [levelChoices.A, levelChoices.B];
            for (const choice of choices) {
                if (!choice || !choice.option_id) continue;
                const option = ALL_LEVEL_UP_OPTIONS[choice.option_id];
                if (!option) continue;
                pushEffectIds(option.effect_ids);
            }
        }

        // additional cards
        character.additional_cards.forEach(card => {
            card.features.forEach(f => pushEffectIds(f.effect_ids))
        })

        // additional effect ids
        pushEffectIds(character.additional_effect_ids)

        // derived domain card vault
        character.derived_domain_card_vault.forEach(card => {
            card.features.forEach(f => pushEffectIds(f.effect_ids))
        })

        // categorize by behavior
        base_effects = all_effects.filter((e) => 'behavior' in e && e.behavior === 'base') as Effect[]
        bonus_effects = all_effects.filter((e) => 'behavior' in e && e.behavior === 'bonus') as Effect[]
        override_effects = all_effects.filter((e) => 'behavior' in e && e.behavior === 'override') as Effect[]

        console.warn("Updated effect list...")
    })

    // * derived traits
    $effect(() => {
        if (!character) return
        const base_traits = { ...character.base_stats.traits }
        if (
            base_traits.agility === null ||
            base_traits.strength === null ||
            base_traits.finesse === null ||
            base_traits.instinct === null ||
            base_traits.presence === null ||
            base_traits.knowledge === null
        ) return

        // apply base effects targeting traits (set base values)
        for (const effect of base_effects) {
            if (effect.target === 'trait') {
                const targetTrait = effect.trait
                if (effect.type === 'flat') {
                    base_traits[targetTrait] = effect.value
                }
                // ! can't derive a trait from a trait
                // else if (effect.type === 'derived_from_trait') {
                //     const source = Number(base_traits[effect.trait])
                //     base_traits[targetTrait] = Math.ceil(source * effect.multiplier)
                // }
            }
        }

        // start from base + marked trait bonuses
        let traits = {
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
        for (const effect of bonus_effects) {
            if (effect.target === 'trait') {
                const targetTrait = effect.trait
                if (effect.type === 'flat') {
                    traits[targetTrait] = traits[targetTrait] + effect.value
                }
                // ! can't derive a trait from a trait
                // else if (effect.type === 'derived_from_trait') {
                //     const source = Number(traits[effect.trait])
                //     traits[targetTrait] = traits[targetTrait] + Math.ceil(source * effect.multiplier)
                // }
            }
        }

        // apply override effects targeting traits (set final values)
        for (const effect of override_effects) {
            if (effect.target === 'trait') {
                const targetTrait = effect.trait
                if (effect.type === 'flat') {
                    traits[targetTrait] = effect.value
                }
                // ! can't derive a trait from a trait
                // else if (effect.type === 'derived_from_trait') {
                //     const source = Number(traits[effect.trait])
                //     traits[targetTrait] = Math.ceil(source * effect.multiplier)
                // }
            }
        }

        character.derived_stats.traits = traits
    })

    // * derived proficiency
    $effect(() => {
        if (!character) return
        let prof: number = character.base_stats.proficiency

        // apply base effects targeting proficiency (set base value)
        for (const effect of base_effects) {
            if (effect.target === 'proficiency') {
                if (effect.type === 'flat') {
                    prof = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    prof = Math.ceil(src * effect.multiplier)
                }
            }
        }

        // tier-based increases
        if (character.level >= 2) prof++
        if (character.level >= 5) prof++
        if (character.level >= 8) prof++

        // apply bonus effects targeting proficiency (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'proficiency') {
                if (effect.type === 'flat') {
                    prof = prof + effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    prof = prof + Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply override effects targeting proficiency (final value)
        for (const effect of override_effects) {
            if (effect.target === 'proficiency') {
                if (effect.type === 'flat') {
                    prof = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    prof = Math.ceil(src * effect.multiplier)
                }
            }
        }

        character.derived_stats.proficiency = prof;

    })

    // * derived evasion
    $effect(() => {
        if (!character) return
        let evasion: number = character.base_stats.evasion;

        // initialize with primary class's starting max hp
        if (character.primary_class) {
            evasion = character.primary_class.starting_evasion
        }

        // apply base effects targeting evasion (set base value)
        for (const effect of base_effects) {
            if (effect.target === 'evasion') {
                if (effect.type === 'flat') {
                    evasion = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    evasion = Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply bonus effects targeting evasion (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'evasion') {
                if (effect.type === 'flat') {
                    evasion = evasion + effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    evasion = evasion + Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply override effects targeting evasion (final value)
        for (const effect of override_effects) {
            if (effect.target === 'evasion') {
                if (effect.type === 'flat') {
                    evasion = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    evasion = Math.ceil(src * effect.multiplier)
                }
            }
        }

        character.derived_stats.evasion = evasion
    })

    // * derived max_hp
    $effect(() => {
        if (!character) return
        let max_hp: number = character.base_stats.max_hp;

        // initialize with primary class's starting max hp
        if (character.primary_class) {
            max_hp = character.primary_class.starting_max_hp
        }

        // apply base effects targeting max_hp (set base value)
        for (const effect of base_effects) {
            if (effect.target === 'max_hp') {
                if (effect.type === 'flat') {
                    max_hp = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_hp = Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply bonus effects targeting max_hp (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'max_hp') {
                if (effect.type === 'flat') {
                    max_hp = max_hp + effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_hp = max_hp + Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply override effects targeting max_hp (final value)
        for (const effect of override_effects) {
            if (effect.target === 'max_hp') {
                if (effect.type === 'flat') {
                    max_hp = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_hp = Math.ceil(src * effect.multiplier)
                }
            }
        }

        character.derived_stats.max_hp = max_hp
    })

    // * derived max_stress
    $effect(() => {
        if (!character) return
        let max_stress: number = character.base_stats.max_stress;

        // apply base effects targeting max_stress (set base value)
        for (const effect of base_effects) {
            if (effect.target === 'max_stress') {
                if (effect.type === 'flat') {
                    max_stress = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_stress = Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply bonus effects targeting max_stress (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'max_stress') {
                if (effect.type === 'flat') {
                    max_stress = max_stress + effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_stress = max_stress + Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply override effects targeting max_stress (final value)
        for (const effect of override_effects) {
            if (effect.target === 'max_stress') {
                if (effect.type === 'flat') {
                    max_stress = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_stress = Math.ceil(src * effect.multiplier)
                }
            }
        }

        character.derived_stats.max_stress = max_stress
    })

    // * derived primary_class_mastery_level
    $effect(() => {
        if (!character) return;
        let masteryNum: number = character.base_stats.primary_class_mastery_level

        // having a primary class guarantees at least foundation (1)
        if (character.primary_class) masteryNum = Math.max(masteryNum, 1);

        // base effects (set mastery directly)
        for (const effect of base_effects) {
            if (effect.target === 'primary_class_mastery_level') {
                if (effect.type === 'flat') {
                    masteryNum = effect.value
                }
                // ! can't derive a mastery level from a trait
                // else if (effect.type === 'derived_from_trait') {
                //     const src = Number(character.derived_stats.traits[effect.trait])
                //     masteryNum = Math.ceil(src * effect.multiplier)
                // }
            }
        }

        // bonus effects (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'primary_class_mastery_level') {
                if (effect.type === 'flat') {
                    masteryNum = masteryNum + effect.value
                }
                // ! can't derive a mastery level from a trait
                // else if (effect.type === 'derived_from_trait') {
                //     const src = Number(character.derived_stats.traits[effect.trait])
                //     masteryNum = masteryNum + Math.ceil(src * effect.multiplier)
                // }
            }
        }

        // override effects (final)
        for (const effect of override_effects) {
            if (effect.target === 'primary_class_mastery_level') {
                if (effect.type === 'flat') {
                    masteryNum = effect.value
                }
                // ! can't derive a mastery level from a trait
                // else if (effect.type === 'derived_from_trait') {
                //     const src = Number(character.derived_stats.traits[effect.trait])
                //     masteryNum = Math.ceil(src * effect.multiplier)
                // }
            }
        }

        // clamp 0..3 and assign with proper literal type
        const masteryClamped = Math.max(0, Math.min(3, Math.trunc(masteryNum))) as 0 | 1 | 2 | 3
        character.derived_stats.primary_class_mastery_level = masteryClamped
    })

    // * derived secondary_class_mastery_level
    $effect(() => {
        if (!character) return;
        let masteryNum: number = character.base_stats.secondary_class_mastery_level

        // having a secondary class guarantees at least foundation (1)
        if (character.secondary_class) masteryNum = Math.max(masteryNum, 1);

        // base effects (set mastery directly)
        for (const effect of base_effects) {
            if (effect.target === 'secondary_class_mastery_level') {
                if (effect.type === 'flat') {
                    masteryNum = effect.value
                }
                // ! can't derive a mastery level from a trait
                // else if (effect.type === 'derived_from_trait') {
                //     const src = Number(character.derived_stats.traits[effect.trait])
                //     masteryNum = Math.ceil(src * effect.multiplier)
                // }
            }
        }

        // bonus effects (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'secondary_class_mastery_level') {
                if (effect.type === 'flat') {
                    masteryNum = masteryNum + effect.value
                }
                // ! can't derive a mastery level from a trait
                // else if (effect.type === 'derived_from_trait') {
                //     const src = Number(character.derived_stats.traits[effect.trait])
                //     masteryNum = masteryNum + Math.ceil(src * effect.multiplier)
                // }
            }
        }

        // override effects (final)
        for (const effect of override_effects) {
            if (effect.target === 'secondary_class_mastery_level') {
                if (effect.type === 'flat') {
                    masteryNum = effect.value
                }
                // ! can't derive a mastery level from a trait
                // else if (effect.type === 'derived_from_trait') {
                //     const src = Number(character.derived_stats.traits[effect.trait])
                //     masteryNum = Math.ceil(src * effect.multiplier)
                // }
            }
        }

        // clamp 0..3 and assign with proper literal type
        const masteryClamped = Math.max(0, Math.min(3, Math.trunc(masteryNum))) as 0 | 1 | 2 | 3
        character.derived_stats.secondary_class_mastery_level = masteryClamped
    })

    // * derived max_hope
    $effect(() => {
        if (!character) return;
        let max_hope: number = character.base_stats.max_hope

        // apply base effects targeting max_hope (set base value)
        for (const effect of base_effects) {
            if (effect.target === 'max_hope') {
                if (effect.type === 'flat') {
                    max_hope = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_hope = Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply bonus effects targeting max_hope (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'max_hope') {
                if (effect.type === 'flat') {
                    max_hope = max_hope + effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_hope = max_hope + Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply override effects targeting max_hope (final value)
        for (const effect of override_effects) {
            if (effect.target === 'max_hope') {
                if (effect.type === 'flat') {
                    max_hope = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_hope = Math.ceil(src * effect.multiplier)
                }
            }
        }

        character.derived_stats.max_hope = max_hope
    })

    // * derived max_armor
    $effect(() => {
        if (!character) return;
        let max_armor: number = character.base_stats.max_armor

        // apply base effects targeting max_armor (set base value)
        for (const effect of base_effects) {
            if (effect.target === 'max_armor') {
                if (effect.type === 'flat') {
                    max_armor = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_armor = Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply bonus effects targeting max_armor (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'max_armor') {
                if (effect.type === 'flat') {
                    max_armor = max_armor + effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_armor = max_armor + Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply override effects targeting max_armor (final value)
        for (const effect of override_effects) {
            if (effect.target === 'max_armor') {
                if (effect.type === 'flat') {
                    max_armor = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_armor = Math.ceil(src * effect.multiplier)
                }
            }
        }

        max_armor = Math.min(max_armor, 12)
        character.derived_stats.max_armor = max_armor
    })

    // * derived damage_thresholds
    $effect(() => {
        if (!character) return
        let thresholds: { major: number, severe: number } = { ...character.base_stats.damage_thresholds }

        // apply base effects (set base values)
        for (const effect of base_effects) {
            if (effect.target === 'major_damage_threshold') {
                if (effect.type === 'flat') {
                    thresholds.major = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    thresholds.major = Math.ceil(src * effect.multiplier)
                }
            } else if (effect.target === 'severe_damage_threshold') {
                if (effect.type === 'flat') {
                    thresholds.severe = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    thresholds.severe = Math.ceil(src * effect.multiplier)
                }
            }
        }

        // level-based bump
        thresholds.major += character.level;
        thresholds.severe += character.level;

        // apply bonus effects (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'major_damage_threshold') {
                if (effect.type === 'flat') {
                    thresholds.major = thresholds.major + effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    thresholds.major = thresholds.major + Math.ceil(src * effect.multiplier)
                }
            } else if (effect.target === 'severe_damage_threshold') {
                if (effect.type === 'flat') {
                    thresholds.severe = thresholds.severe + effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    thresholds.severe = thresholds.severe + Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply override effects (final values)
        for (const effect of override_effects) {
            if (effect.target === 'major_damage_threshold') {
                if (effect.type === 'flat') {
                    thresholds.major = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    thresholds.major = Math.ceil(src * effect.multiplier)
                }
            } else if (effect.target === 'severe_damage_threshold') {
                if (effect.type === 'flat') {
                    thresholds.severe = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    thresholds.severe = Math.ceil(src * effect.multiplier)
                }
            }
        }

        character.derived_stats.damage_thresholds = thresholds
    })

    // * derived max_experiences
    $effect(() => {
        if (!character) return;
        let max_experiences: number = character.base_stats.max_experiences;

        // apply base effects targeting max_experiences (set base value)
        for (const effect of base_effects) {
            if (effect.target === 'max_experiences') {
                if (effect.type === 'flat') {
                    max_experiences = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_experiences = Math.ceil(src * effect.multiplier)
                }
            }
        }

        // tier-based increases
        if (character.level >= 2) max_experiences++
        if (character.level >= 5) max_experiences++
        if (character.level >= 8) max_experiences++

        // apply bonus effects targeting max_experiences (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'max_experiences') {
                if (effect.type === 'flat') {
                    max_experiences = max_experiences + effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_experiences = max_experiences + Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply override effects targeting max_experiences (final value)
        for (const effect of override_effects) {
            if (effect.target === 'max_experiences') {
                if (effect.type === 'flat') {
                    max_experiences = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_experiences = Math.ceil(src * effect.multiplier)
                }
            }
        }

        character.derived_stats.max_experiences = max_experiences
    })

    // * derived max_domain_card_loadout
    $effect(() => {
        if (!character) return;
        let max_domain_card_loadout: number = character.base_stats.max_domain_card_loadout

        // apply base effects targeting max_domain_card_loadout (set base value)
        for (const effect of base_effects) {
            if (effect.target === 'max_domain_card_loadout') {
                if (effect.type === 'flat') {
                    max_domain_card_loadout = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_domain_card_loadout = Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply bonus effects targeting max_domain_card_loadout (additive)
        for (const effect of bonus_effects) {
            if (effect.target === 'max_domain_card_loadout') {
                if (effect.type === 'flat') {
                    max_domain_card_loadout = max_domain_card_loadout + effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_domain_card_loadout = max_domain_card_loadout + Math.ceil(src * effect.multiplier)
                }
            }
        }

        // apply override effects targeting max_domain_card_loadout (final value)
        for (const effect of override_effects) {
            if (effect.target === 'max_domain_card_loadout') {
                if (effect.type === 'flat') {
                    max_domain_card_loadout = effect.value
                } else if (effect.type === 'derived_from_trait') {
                    const src = Number(character.derived_stats.traits[effect.trait])
                    max_domain_card_loadout = Math.ceil(src * effect.multiplier)
                }
            }
        }

        character.derived_stats.max_domain_card_loadout = max_domain_card_loadout
    })

    // --- cleanup ---
    const destroy = () => { }

    return {
        // read only
        get tier_2_marked_traits() { return tier_2_marked_traits },
        get tier_3_marked_traits() { return tier_3_marked_traits },
        get tier_4_marked_traits() { return tier_4_marked_traits },
        get options_used() { return options_used },

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