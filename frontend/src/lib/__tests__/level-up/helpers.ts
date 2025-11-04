import type { Character, Traits, LevelUpChoice } from "$lib/ts/types";
import { ALL_LEVEL_UP_OPTIONS, TIER_2_BASE_OPTIONS, TIER_3_BASE_OPTIONS, TIER_4_BASE_OPTIONS } from "$lib/ts/constants/rules";
import type { DOMAINS } from "$lib/ts/constants/constants";

/**
 * Get the tier number for a given level
 * Tier 1: level 1
 * Tier 2: levels 2-4
 * Tier 3: levels 5-7
 * Tier 4: levels 8-10
 */
export function getTierFromLevel(level: number): number {
    if (level === 1) return 1;
    if (level >= 2 && level <= 4) return 2;
    if (level >= 5 && level <= 7) return 3;
    if (level >= 8 && level <= 10) return 4;
    throw new Error(`Invalid level: ${level}`);
}

/**
 * Get options available for a given tier
 */
export function getTierOptions(tier: number): Partial<typeof ALL_LEVEL_UP_OPTIONS> {
    if (tier === 1) return ALL_LEVEL_UP_OPTIONS;
    if (tier === 2) return { ...TIER_2_BASE_OPTIONS };
    if (tier === 3) return { ...TIER_2_BASE_OPTIONS, ...TIER_3_BASE_OPTIONS };
    if (tier === 4) return ALL_LEVEL_UP_OPTIONS;
    throw new Error(`Invalid tier: ${tier}`);
}

/**
 * Count how many times an option has been used across all levels
 */
export function countOptionUsage(character: Character, optionId: keyof typeof ALL_LEVEL_UP_OPTIONS): number {
    let count = 0;
    for (let level = 2; level <= character.level; level++) {
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        if (choices.A.option_id === optionId) count++;
        if (choices.B.option_id === optionId) count++;
    }
    return count;
}

/**
 * Get marked traits for a specific tier
 */
export function getMarkedTraitsForTier(character: Character, tier: number): Record<keyof Traits, boolean> {
    const marked: Record<keyof Traits, boolean> = {
        agility: false,
        strength: false,
        finesse: false,
        instinct: false,
        presence: false,
        knowledge: false,
    };

    const tierOptionIds: (keyof typeof ALL_LEVEL_UP_OPTIONS)[] = [];
    if (tier >= 2) tierOptionIds.push("tier_2_traits");
    if (tier >= 3) tierOptionIds.push("tier_3_traits");
    if (tier >= 4) tierOptionIds.push("tier_4_traits");

    const startLevel = tier === 2 ? 2 : tier === 3 ? 5 : 8;
    const endLevel = tier === 2 ? 4 : tier === 3 ? 7 : 10;

    for (let level = startLevel; level <= Math.min(endLevel, character.level); level++) {
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        
        for (const choice of [choices.A, choices.B]) {
            if (choice.option_id && tierOptionIds.includes(choice.option_id)) {
                if (choice.marked_traits.A) marked[choice.marked_traits.A] = true;
                if (choice.marked_traits.B) marked[choice.marked_traits.B] = true;
            }
        }
    }

    return marked;
}

/**
 * Check if a trait is marked in a specific tier
 */
export function isTraitMarkedInTier(character: Character, trait: keyof Traits, tier: number): boolean {
    const marked = getMarkedTraitsForTier(character, tier);
    return marked[trait];
}

/**
 * Get available domain names for a character at a given level
 */
export function getAvailableDomainNames(character: Character, level: number): (keyof typeof DOMAINS)[] {
    const domains: (keyof typeof DOMAINS)[] = [];
    
    if (!character.primary_class) return domains;
    
    domains.push(character.primary_class.primary_domain as keyof typeof DOMAINS);
    domains.push(character.primary_class.secondary_domain as keyof typeof DOMAINS);

    // Check if multiclassing has been used by this level
    let multiclassUsed = false;
    for (let i = 2; i <= level; i++) {
        const choices = character.level_up_choices[i as keyof typeof character.level_up_choices];
        if (choices.A.option_id === "tier_3_multiclass" || choices.A.option_id === "tier_4_multiclass" ||
            choices.B.option_id === "tier_3_multiclass" || choices.B.option_id === "tier_4_multiclass") {
            multiclassUsed = true;
            break;
        }
    }

    if (multiclassUsed && character.secondary_class_domain) {
        domains.push(character.secondary_class_domain);
    }

    return domains;
}

/**
 * Check if a domain card is valid for a character at a given level
 */
export function isDomainCardValid(character: Character, card: { level_requirement: number; domain_name: string }, level: number, isMulticlassCard: boolean = false): boolean {
    // Check level requirement
    if (isMulticlassCard) {
        const maxLevel = Math.ceil(level / 2);
        if (card.level_requirement > maxLevel) return false;
    } else {
        if (card.level_requirement > level) return false;
    }

    // Check domain accessibility
    const availableDomains = getAvailableDomainNames(character, level);
    return availableDomains.includes(card.domain_name as keyof typeof DOMAINS);
}

/**
 * Validate that exactly 2 choices are made per level (levels 2-10)
 */
export function validateAdvancementCount(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (let level = 2; level <= Math.min(character.level, 10); level++) {
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        
        // Check if both choices are filled
        if (!choices.A.option_id || !choices.B.option_id) {
            errors.push(`Level ${level} must have exactly 2 advancement choices (found ${choices.A.option_id ? '1' : '0'} choices)`);
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate that options are from the correct tier
 */
export function validateOptionTiers(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (let level = 2; level <= Math.min(character.level, 10); level++) {
        const tier = getTierFromLevel(level);
        const availableOptions = getTierOptions(tier);
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        
        for (const [slot, choice] of [['A', choices.A], ['B', choices.B]] as const) {
            if (choice.option_id && !(choice.option_id in availableOptions)) {
                errors.push(`Level ${level} choice ${slot}: Option "${choice.option_id}" is not available for tier ${tier}`);
            }
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate that options with costs_two_choices use both slots
 */
export function validateTwoChoiceOptions(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (let level = 2; level <= Math.min(character.level, 10); level++) {
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        
        // Check if A is a two-choice option
        if (choices.A.option_id) {
            const option = ALL_LEVEL_UP_OPTIONS[choices.A.option_id];
            if (option && option.costs_two_choices) {
                if (choices.B.option_id !== choices.A.option_id) {
                    errors.push(`Level ${level}: Option "${choices.A.option_id}" costs 2 choices but slot B has different option "${choices.B.option_id}"`);
                }
            }
        }
        
        // Check if B is a two-choice option
        if (choices.B.option_id && choices.B.option_id !== choices.A.option_id) {
            const option = ALL_LEVEL_UP_OPTIONS[choices.B.option_id];
            if (option && option.costs_two_choices) {
                errors.push(`Level ${level}: Option "${choices.B.option_id}" costs 2 choices but slot A has different option "${choices.A.option_id}"`);
            }
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate that option max limits are not exceeded
 */
export function validateOptionMaxLimits(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Count usage for each option
    const usageCounts = new Map<keyof typeof ALL_LEVEL_UP_OPTIONS, number>();
    
    for (let level = 2; level <= Math.min(character.level, 10); level++) {
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        
        if (choices.A.option_id) {
            const count = usageCounts.get(choices.A.option_id) || 0;
            usageCounts.set(choices.A.option_id, count + 1);
        }
        
        if (choices.B.option_id) {
            const count = usageCounts.get(choices.B.option_id) || 0;
            usageCounts.set(choices.B.option_id, count + 1);
        }
    }
    
    // Check against max limits
    for (const [optionId, count] of usageCounts.entries()) {
        const option = ALL_LEVEL_UP_OPTIONS[optionId];
        if (option && count > option.max) {
            errors.push(`Option "${optionId}" used ${count} times but max is ${option.max}`);
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate trait marking rules
 */
export function validateTraitMarking(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (let level = 2; level <= Math.min(character.level, 10); level++) {
        const tier = getTierFromLevel(level);
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        
        const traitOptionIds = ["tier_2_traits", "tier_3_traits", "tier_4_traits"] as const;
        
        for (const [slot, choice] of [['A', choices.A], ['B', choices.B]] as const) {
            if (choice.option_id && traitOptionIds.includes(choice.option_id as any)) {
                // Must mark exactly 2 traits
                if (!choice.marked_traits.A || !choice.marked_traits.B) {
                    errors.push(`Level ${level} choice ${slot}: Trait option must mark exactly 2 traits`);
                }
                
                // Traits must be different
                if (choice.marked_traits.A === choice.marked_traits.B) {
                    errors.push(`Level ${level} choice ${slot}: Cannot mark the same trait twice`);
                }
                
                // Traits must not be marked in current tier
                if (choice.marked_traits.A && isTraitMarkedInTier(character, choice.marked_traits.A, tier)) {
                    // Check if this is the first time marking in this tier
                    let wasMarkedBefore = false;
                    for (let prevLevel = tier === 2 ? 2 : tier === 3 ? 5 : 8; prevLevel < level; prevLevel++) {
                        const prevChoices = character.level_up_choices[prevLevel as keyof typeof character.level_up_choices];
                        for (const prevChoice of [prevChoices.A, prevChoices.B]) {
                            if (prevChoice.option_id && traitOptionIds.includes(prevChoice.option_id as any)) {
                                if (prevChoice.marked_traits.A === choice.marked_traits.A || 
                                    prevChoice.marked_traits.B === choice.marked_traits.A) {
                                    wasMarkedBefore = true;
                                    break;
                                }
                            }
                        }
                        if (wasMarkedBefore) break;
                    }
                    if (wasMarkedBefore) {
                        errors.push(`Level ${level} choice ${slot}: Trait "${choice.marked_traits.A}" is already marked in tier ${tier}`);
                    }
                }
                
                if (choice.marked_traits.B && isTraitMarkedInTier(character, choice.marked_traits.B, tier)) {
                    let wasMarkedBefore = false;
                    for (let prevLevel = tier === 2 ? 2 : tier === 3 ? 5 : 8; prevLevel < level; prevLevel++) {
                        const prevChoices = character.level_up_choices[prevLevel as keyof typeof character.level_up_choices];
                        for (const prevChoice of [prevChoices.A, prevChoices.B]) {
                            if (prevChoice.option_id && traitOptionIds.includes(prevChoice.option_id as any)) {
                                if (prevChoice.marked_traits.A === choice.marked_traits.B || 
                                    prevChoice.marked_traits.B === choice.marked_traits.B) {
                                    wasMarkedBefore = true;
                                    break;
                                }
                            }
                        }
                        if (wasMarkedBefore) break;
                    }
                    if (wasMarkedBefore) {
                        errors.push(`Level ${level} choice ${slot}: Trait "${choice.marked_traits.B}" is already marked in tier ${tier}`);
                    }
                }
            }
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate experience bonus selections
 */
export function validateExperienceBonus(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (let level = 2; level <= Math.min(character.level, 10); level++) {
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        const experienceOptionIds = ["tier_2_experience_bonus", "tier_3_experience_bonus", "tier_4_experience_bonus"] as const;
        
        for (const [slot, choice] of [['A', choices.A], ['B', choices.B]] as const) {
            if (choice.option_id && experienceOptionIds.includes(choice.option_id as any)) {
                // Must select exactly 2 experiences
                if (choice.selected_experiences.A === null || choice.selected_experiences.B === null) {
                    errors.push(`Level ${level} choice ${slot}: Experience bonus must select exactly 2 experiences`);
                }
                
                // Experiences must be different
                if (choice.selected_experiences.A === choice.selected_experiences.B) {
                    errors.push(`Level ${level} choice ${slot}: Cannot select the same experience twice`);
                }
                
                // Experiences must be valid indices
                if (choice.selected_experiences.A !== null && 
                    (choice.selected_experiences.A < 0 || choice.selected_experiences.A >= character.experiences.length)) {
                    errors.push(`Level ${level} choice ${slot}: Invalid experience index ${choice.selected_experiences.A}`);
                }
                if (choice.selected_experiences.B !== null && 
                    (choice.selected_experiences.B < 0 || choice.selected_experiences.B >= character.experiences.length)) {
                    errors.push(`Level ${level} choice ${slot}: Invalid experience index ${choice.selected_experiences.B}`);
                }
            }
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate domain card choices
 */
export function validateDomainCardChoices(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (let level = 2; level <= Math.min(character.level, 10); level++) {
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        const domainCardOptionIds = ["tier_2_domain_card", "tier_3_domain_card", "tier_4_domain_card"] as const;
        
        for (const [slot, choice] of [['A', choices.A], ['B', choices.B]] as const) {
            if (choice.option_id && domainCardOptionIds.includes(choice.option_id as any)) {
                if (!choice.selected_domain_card) {
                    errors.push(`Level ${level} choice ${slot}: Domain card option must have a selected domain card`);
                    continue;
                }
                
                // Check if multiclass card
                let isMulticlassCard = false;
                if (character.secondary_class_domain) {
                    // Check if multiclassing was used before this level
                    for (let prevLevel = 2; prevLevel <= level; prevLevel++) {
                        const prevChoices = character.level_up_choices[prevLevel as keyof typeof character.level_up_choices];
                        if (prevChoices.A.option_id === "tier_3_multiclass" || prevChoices.A.option_id === "tier_4_multiclass" ||
                            prevChoices.B.option_id === "tier_3_multiclass" || prevChoices.B.option_id === "tier_4_multiclass") {
                            isMulticlassCard = choice.selected_domain_card.domain_name === character.secondary_class_domain;
                            break;
                        }
                    }
                }
                
                if (!isDomainCardValid(character, choice.selected_domain_card, level, isMulticlassCard)) {
                    const maxLevel = isMulticlassCard ? Math.ceil(level / 2) : level;
                    errors.push(`Level ${level} choice ${slot}: Domain card "${choice.selected_domain_card.title}" (level ${choice.selected_domain_card.level_requirement}) is not valid for level ${level}${isMulticlassCard ? ' (multiclass: max level ' + maxLevel + ')' : ''}`);
                }
            }
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate domain cards from Step Four (level up domain cards)
 */
export function validateLevelUpDomainCards(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (let level = 2; level <= Math.min(character.level, 10); level++) {
        const domainCard = character.level_up_domain_cards[level as keyof typeof character.level_up_domain_cards].A;
        
        if (!domainCard) {
            errors.push(`Level ${level}: Must have a domain card selected (Step Four)`);
            continue;
        }
        
        // Check if this is from multiclass domain
        let isMulticlassCard = false;
        if (character.secondary_class_domain && domainCard.domain_name === character.secondary_class_domain) {
            // Check if multiclassing was used before this level
            for (let prevLevel = 2; prevLevel <= level; prevLevel++) {
                const prevChoices = character.level_up_choices[prevLevel as keyof typeof character.level_up_choices];
                if (prevChoices.A.option_id === "tier_3_multiclass" || prevChoices.A.option_id === "tier_4_multiclass" ||
                    prevChoices.B.option_id === "tier_3_multiclass" || prevChoices.B.option_id === "tier_4_multiclass") {
                    isMulticlassCard = true;
                    break;
                }
            }
        }
        
        // Check level requirement
        if (isMulticlassCard) {
            const maxLevel = Math.ceil(level / 2);
            if (domainCard.level_requirement > maxLevel) {
                errors.push(`Level ${level}: Domain card "${domainCard.title}" (level ${domainCard.level_requirement}) exceeds half level ${maxLevel} for multiclass domain`);
            }
        } else {
            if (domainCard.level_requirement > level) {
                errors.push(`Level ${level}: Domain card "${domainCard.title}" (level ${domainCard.level_requirement}) exceeds level ${level}`);
            }
        }
        
        // Check domain accessibility
        const availableDomains = getAvailableDomainNames(character, level);
        if (!availableDomains.includes(domainCard.domain_name as keyof typeof DOMAINS)) {
            errors.push(`Level ${level}: Domain card "${domainCard.title}" from domain "${domainCard.domain_name}" is not accessible`);
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate multiclassing rules
 */
export function validateMulticlassing(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (let level = 2; level <= Math.min(character.level, 10); level++) {
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        const multiclassOptionIds = ["tier_3_multiclass", "tier_4_multiclass"] as const;
        
        for (const [slot, choice] of [['A', choices.A], ['B', choices.B]] as const) {
            if (choice.option_id && multiclassOptionIds.includes(choice.option_id as any)) {
                // Multiclassing only available at level 5+
                if (level < 5) {
                    errors.push(`Level ${level} choice ${slot}: Multiclassing is only available at level 5 or higher`);
                }
                
                // Must use both slots
                if (choices.A.option_id !== choices.B.option_id) {
                    errors.push(`Level ${level}: Multiclass option must use both slots A and B`);
                }
                
                // Check if subclass upgrade conflicts in same tier
                const tier = getTierFromLevel(level);
                const subclassUpgradeId = tier === 3 ? "tier_3_subclass_upgrade" : "tier_4_subclass_upgrade";
                
                // Check if subclass upgrade was used in same tier
                const tierStartLevel = tier === 3 ? 5 : 8;
                const tierEndLevel = tier === 3 ? 7 : 10;
                for (let tierLevel = tierStartLevel; tierLevel <= Math.min(tierEndLevel, character.level); tierLevel++) {
                    if (tierLevel === level) continue; // Skip current level
                    const tierChoices = character.level_up_choices[tierLevel as keyof typeof character.level_up_choices];
                    if (tierChoices.A.option_id === subclassUpgradeId || tierChoices.B.option_id === subclassUpgradeId) {
                        errors.push(`Level ${level} choice ${slot}: Multiclass conflicts with subclass upgrade at level ${tierLevel}`);
                    }
                }
            }
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate tier achievements
 */
export function validateTierAchievements(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Level 2: +1 proficiency, +1 max_experiences
    if (character.level >= 2) {
        const expectedProficiency = character.base_stats.proficiency + 1;
        const actualProficiency = character.derived_stats.proficiency;
        if (actualProficiency < expectedProficiency) {
            errors.push(`Level 2 tier achievement: Expected proficiency >= ${expectedProficiency}, got ${actualProficiency}`);
        }
        
        const expectedMaxExperiences = character.base_stats.max_experiences + 1;
        const actualMaxExperiences = character.derived_stats.max_experiences;
        if (actualMaxExperiences < expectedMaxExperiences) {
            errors.push(`Level 2 tier achievement: Expected max_experiences >= ${expectedMaxExperiences}, got ${actualMaxExperiences}`);
        }
    }
    
    // Level 5: +1 proficiency, +1 max_experiences, clear marked traits
    if (character.level >= 5) {
        const expectedProficiency = character.base_stats.proficiency + 2;
        const actualProficiency = character.derived_stats.proficiency;
        if (actualProficiency < expectedProficiency) {
            errors.push(`Level 5 tier achievement: Expected proficiency >= ${expectedProficiency}, got ${actualProficiency}`);
        }
        
        const expectedMaxExperiences = character.base_stats.max_experiences + 2;
        const actualMaxExperiences = character.derived_stats.max_experiences;
        if (actualMaxExperiences < expectedMaxExperiences) {
            errors.push(`Level 5 tier achievement: Expected max_experiences >= ${expectedMaxExperiences}, got ${actualMaxExperiences}`);
        }
        
        // Traits cleared at level 5 - tier 2 marked traits should not affect tier 3
        // This is validated by trait marking rules
    }
    
    // Level 8: +1 proficiency, +1 max_experiences, clear marked traits
    if (character.level >= 8) {
        const expectedProficiency = character.base_stats.proficiency + 3;
        const actualProficiency = character.derived_stats.proficiency;
        if (actualProficiency < expectedProficiency) {
            errors.push(`Level 8 tier achievement: Expected proficiency >= ${expectedProficiency}, got ${actualProficiency}`);
        }
        
        const expectedMaxExperiences = character.base_stats.max_experiences + 3;
        const actualMaxExperiences = character.derived_stats.max_experiences;
        if (actualMaxExperiences < expectedMaxExperiences) {
            errors.push(`Level 8 tier achievement: Expected max_experiences >= ${expectedMaxExperiences}, got ${actualMaxExperiences}`);
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Validate multiclassing rules - check for multiple multiclass options
 */
export function validateMultipleMulticlass(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    let multiclassUsed = false;
    let multiclassLevel = 0;
    
    for (let level = 2; level <= Math.min(character.level, 10); level++) {
        const choices = character.level_up_choices[level as keyof typeof character.level_up_choices];
        const multiclassOptionIds = ["tier_3_multiclass", "tier_4_multiclass"] as const;
        
        if (choices.A.option_id && multiclassOptionIds.includes(choices.A.option_id as any)) {
            if (multiclassUsed) {
                errors.push(`Level ${level}: Multiclass option chosen, but multiclass was already chosen at level ${multiclassLevel}. You can only multiclass once.`);
            } else {
                multiclassUsed = true;
                multiclassLevel = level;
            }
        }
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Main validation function that runs all validations
 */
export function validateLevelUpRules(character: Character): { valid: boolean; errors: string[] } {
    const allErrors: string[] = [];
    
    const validations = [
        validateAdvancementCount(character),
        validateOptionTiers(character),
        validateTwoChoiceOptions(character),
        validateOptionMaxLimits(character),
        validateTraitMarking(character),
        validateExperienceBonus(character),
        validateDomainCardChoices(character),
        validateLevelUpDomainCards(character),
        validateMulticlassing(character),
        validateMultipleMulticlass(character),
        validateTierAchievements(character),
        validateDamageThresholds(character),
    ];
    
    for (const validation of validations) {
        allErrors.push(...validation.errors);
    }
    
    return { valid: allErrors.length === 0, errors: allErrors };
}

/**
 * Validate damage thresholds increase by 1 each level
 */
export function validateDamageThresholds(character: Character): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Base thresholds should be level and level * 2
    const expectedMajor = character.level;
    const expectedSevere = character.level * 2;
    
    // Actual thresholds may be modified by armor, but should be at least level
    if (character.derived_stats.damage_thresholds.major < expectedMajor) {
        errors.push(`Damage threshold major should be at least ${expectedMajor} (level) but is ${character.derived_stats.damage_thresholds.major}`);
    }
    
    if (character.derived_stats.damage_thresholds.severe < expectedSevere) {
        errors.push(`Damage threshold severe should be at least ${expectedSevere} (level * 2) but is ${character.derived_stats.damage_thresholds.severe}`);
    }
    
    return { valid: errors.length === 0, errors };
}
