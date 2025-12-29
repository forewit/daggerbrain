import { getUserContext } from './user.svelte';
import { toast } from 'svelte-sonner';
import {
	ALL_LEVEL_UP_OPTIONS,
	BASE_COMPANION,
	BASE_MIXED_ANCESTRY_CARD,
	BASE_STATS,
	COMPANION_BASE_EXPERIENCE_MODIFIER,
	CONDITIONS,
	TRAIT_OPTIONS
} from '../types/rules';
import { getContext, setContext } from 'svelte';
import type {
	Character,
	DomainCardId,
	ChosenBeastform,
	Companion
} from '$lib/types/character-types';
import type { AllTierOptionIds, ConditionIds, LevelUpChoice } from '$lib/types/rule-types';
import type {
	DamageThresholds,
	Traits,
	Weapon,
	CharacterCondition,
	CharacterModifier,
	WeaponModifier,
	DomainCard,
	Armor,
	CommunityCard,
	AncestryCard,
	Beastform
} from '$lib/types/compendium-types';
import { BLANK_LEVEL_UP_CHOICE } from '$lib/types/constants';
import { update_character } from '$lib/remote/characters.remote';
import { getCompendiumContext } from './compendium.svelte';
import { increaseDie, increase_range } from '$lib/utils';

function createCharacter(id: string) {
	const user = getUserContext();
	let character = <Character | null>$state(null);
	$effect(() => {
		character = user.all_characters.find((c) => c.id === id) || null;
	});

	const compendium = getCompendiumContext();
	// ! void and homebrew source whitelists
	$effect(() => {
		if (!character) return;

		if (!compendium.source_whitelist.has('SRD')) {
			compendium.source_whitelist.add('SRD');
		}

		// void content
		if (character.settings.void_enabled) {
			compendium.source_whitelist.add('Void 1.5');
		} else {
			compendium.source_whitelist.delete('Void 1.5');
		}

		// homebrew content
		if (character.settings.homebrew_enabled) {
			compendium.source_whitelist.add('Homebrew');
		} else {
			compendium.source_whitelist.delete('Homebrew');
		}
	});

	// ================================================
	// DERIVED COMPENDIUM REFERENCES
	// ================================================

	// Heritage
	let ancestry_card: AncestryCard | null = $derived.by(() => {
		if (!character) return null;

		if (character.ancestry_card_id === BASE_MIXED_ANCESTRY_CARD.compendium_id) {
			const custom_top_ancestry = character.custom_top_ancestry
				? compendium.ancestry_cards[character.custom_top_ancestry] || null
				: null;
			const custom_bottom_ancestry = character.custom_bottom_ancestry
				? compendium.ancestry_cards[character.custom_bottom_ancestry] || null
				: null;

			return {
				...BASE_MIXED_ANCESTRY_CARD,
				features: [custom_top_ancestry?.features[0], custom_bottom_ancestry?.features[1]].filter(
					(f) => !!f
				),
				choices: [
					...(custom_top_ancestry?.choices.filter((c) => c.feature_index === 0) || []),
					...(custom_bottom_ancestry?.choices.filter((c) => c.feature_index === 1) || [])
				].filter((c) => !!c)
			};
		} else {
			return character?.ancestry_card_id
				? compendium.ancestry_cards[character.ancestry_card_id] || null
				: null;
		}
	});
	let community_card = $derived(
		character?.community_card_id
			? compendium.community_cards[character.community_card_id] || null
			: null
	);
	let transformation_card = $derived(
		character?.transformation_card_id
			? compendium.transformation_cards[character.transformation_card_id] || null
			: null
	);

	// Class and subclass
	let primary_class = $derived(
		character?.primary_class_id ? compendium.classes[character.primary_class_id] || null : null
	);
	let primary_subclass = $derived(
		character?.primary_subclass_id ? compendium.subclasses[character.primary_subclass_id] : null
	);
	let secondary_class = $derived(
		character?.secondary_class_id ? compendium.classes[character.secondary_class_id] || null : null
	);
	let secondary_subclass = $derived(
		character?.secondary_subclass_id
			? compendium.subclasses[character.secondary_subclass_id] || null
			: null
	);

	// domain cards
	let level_up_domain_cards = $derived.by(() => {
		const ids = character?.level_up_domain_card_ids;
		const getDomainCard = (id: DomainCardId | null) => {
			if (!id) return null;
			const domainCards = compendium.domain_cards[id.domainId];
			return domainCards?.[id.cardId] || null;
		};
		return {
			1: {
				A: getDomainCard(ids?.[1]?.A || null),
				B: getDomainCard(ids?.[1]?.B || null)
			},
			2: { A: getDomainCard(ids?.[2]?.A || null) },
			3: { A: getDomainCard(ids?.[3]?.A || null) },
			4: { A: getDomainCard(ids?.[4]?.A || null) },
			5: { A: getDomainCard(ids?.[5]?.A || null) },
			6: { A: getDomainCard(ids?.[6]?.A || null) },
			7: { A: getDomainCard(ids?.[7]?.A || null) },
			8: { A: getDomainCard(ids?.[8]?.A || null) },
			9: { A: getDomainCard(ids?.[9]?.A || null) },
			10: { A: getDomainCard(ids?.[10]?.A || null) }
		};
	});
	let additional_domain_cards = $derived(
		character?.additional_domain_card_ids
			.map((id) => compendium.domain_cards[id.domainId]?.[id.cardId])
			.filter((c) => !!c) || []
	);
	let additional_ancestry_cards = $derived(
		character?.additional_ancestry_card_ids
			.map((id) => compendium.ancestry_cards[id])
			.filter((c) => !!c) || []
	);
	let additional_community_cards = $derived(
		character?.additional_community_card_ids
			.map((id) => compendium.community_cards[id])
			.filter((c) => !!c) || []
	);
	let additional_transformation_cards = $derived(
		character?.additional_transformation_card_ids
			.map((id) => compendium.transformation_cards[id])
			.filter((c) => !!c) || []
	);

	// Equipment
	let inventory_primary_weapons = $derived.by(() => {
		return Object.entries(character?.inventory.primary_weapons || {})
			.map(([uniqueId, item]) => {
				const compendiumItem = compendium.primary_weapons[item.compendium_id];
				if (!compendiumItem) return null;
				const weapon = { ...compendiumItem, id: uniqueId };
				// Apply customizations
				if (item.custom_title) weapon.title = item.custom_title;
				if (item.custom_level_requirement !== null) {
					weapon.level_requirement = item.custom_level_requirement;
				}
				if (item.custom_range !== null) {
					weapon.range = item.custom_range;
				}
				if (item.custom_available_damage_types !== null) {
					weapon.available_damage_types = item.custom_available_damage_types;
				}
				if (item.custom_burden !== null) {
					weapon.burden = item.custom_burden;
				}
				if (item.custom_damage_dice !== null) {
					weapon.damage_dice = item.custom_damage_dice;
				}
				if (item.custom_damage_bonus !== null) {
					weapon.damage_bonus += item.custom_damage_bonus;
				}
				if (item.custom_attack_roll_bonus !== null) {
					weapon.attack_roll_bonus += item.custom_attack_roll_bonus;
				}
				return weapon;
			})
			.filter((w): w is NonNullable<typeof w> => !!w);
	});
	let inventory_secondary_weapons = $derived.by(() => {
		return Object.entries(character?.inventory.secondary_weapons || {})
			.map(([uniqueId, item]) => {
				const compendiumItem = compendium.secondary_weapons[item.compendium_id];
				if (!compendiumItem) return null;
				const weapon = { ...compendiumItem, id: uniqueId };
				// Apply customizations
				if (item.custom_title) weapon.title = item.custom_title;
				if (item.custom_level_requirement !== null) {
					weapon.level_requirement = item.custom_level_requirement;
				}
				if (item.custom_range !== null) {
					weapon.range = item.custom_range;
				}
				if (item.custom_available_damage_types !== null) {
					weapon.available_damage_types = item.custom_available_damage_types;
				}
				if (item.custom_burden !== null) {
					weapon.burden = item.custom_burden;
				}
				if (item.custom_damage_dice !== null) {
					weapon.damage_dice = item.custom_damage_dice;
				}
				if (item.custom_damage_bonus !== null) {
					weapon.damage_bonus = item.custom_damage_bonus;
				}
				if (item.custom_attack_roll_bonus !== null) {
					weapon.attack_roll_bonus = item.custom_attack_roll_bonus;
				}
				return weapon;
			})
			.filter((w): w is NonNullable<typeof w> => !!w);
	});
	let inventory_armor = $derived.by(() => {
		return Object.entries(character?.inventory.armor || {})
			.map(([uniqueId, item]) => {
				const compendiumItem = compendium.armor[item.compendium_id];
				if (!compendiumItem) return null;
				const armor = { ...compendiumItem, id: uniqueId };
				// Apply customizations
				if (item.custom_title) armor.title = item.custom_title;
				if (item.custom_level_requirement !== null) {
					armor.level_requirement = item.custom_level_requirement;
				}
				if (item.custom_max_armor !== null) {
					armor.max_armor = item.custom_max_armor;
				}
				if (
					item.custom_damage_thresholds.major !== null ||
					item.custom_damage_thresholds.severe !== null
				) {
					armor.damage_thresholds = {
						major: item.custom_damage_thresholds.major ?? armor.damage_thresholds.major,
						severe: item.custom_damage_thresholds.severe ?? armor.damage_thresholds.severe
					};
				}
				return armor;
			})
			.filter((a): a is NonNullable<typeof a> => !!a);
	});
	let inventory_loot = $derived.by(() => {
		return Object.entries(character?.inventory.loot || {})
			.map(([uniqueId, item]) => {
				const compendiumItem = compendium.loot[item.compendium_id];
				if (!compendiumItem) return null;
				const loot = { ...compendiumItem, id: uniqueId };
				// Apply customizations
				if (item.custom_title) loot.title = item.custom_title;
				if (item.custom_description) loot.description_html = item.custom_description;
				return loot;
			})
			.filter((l): l is NonNullable<typeof l> => !!l);
	});
	let inventory_consumables = $derived.by(() => {
		return Object.entries(character?.inventory.consumables || {})
			.map(([uniqueId, item]) => {
				const compendiumItem = compendium.consumables[item.compendium_id];
				if (!compendiumItem) return null;
				const consumable = { ...compendiumItem, id: uniqueId };
				// Apply customizations
				if (item.custom_title) consumable.title = item.custom_title;
				if (item.custom_description) consumable.description_html = item.custom_description;
				return consumable;
			})
			.filter((c): c is NonNullable<typeof c> => !!c);
	});

	let active_primary_weapon = $derived(
		inventory_primary_weapons.find((w) => w.id === character?.active_primary_weapon_id) || null
	);
	let active_secondary_weapon = $derived(
		inventory_secondary_weapons.find((w) => w.id === character?.active_secondary_weapon_id) || null
	);
	let active_armor = $derived(
		inventory_armor.find((a) => a.id === character?.active_armor_id) || null
	);

	// other
	let level_up_chosen_options = $derived({
		2: {
			A: character?.level_up_choices[2].A.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[2].A.option_id]
				: null,
			B: character?.level_up_choices[2].B.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[2].B.option_id]
				: null
		},
		3: {
			A: character?.level_up_choices[3].A.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[3].A.option_id]
				: null,
			B: character?.level_up_choices[3].B.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[3].B.option_id]
				: null
		},
		4: {
			A: character?.level_up_choices[4].A.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[4].A.option_id]
				: null,
			B: character?.level_up_choices[4].B.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[4].B.option_id]
				: null
		},
		5: {
			A: character?.level_up_choices[5].A.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[5].A.option_id]
				: null,
			B: character?.level_up_choices[5].B.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[5].B.option_id]
				: null
		},
		6: {
			A: character?.level_up_choices[6].A.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[6].A.option_id]
				: null,
			B: character?.level_up_choices[6].B.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[6].B.option_id]
				: null
		},
		7: {
			A: character?.level_up_choices[7].A.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[7].A.option_id]
				: null,
			B: character?.level_up_choices[7].B.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[7].B.option_id]
				: null
		},
		8: {
			A: character?.level_up_choices[8].A.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[8].A.option_id]
				: null,
			B: character?.level_up_choices[8].B.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[8].B.option_id]
				: null
		},
		9: {
			A: character?.level_up_choices[9].A.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[9].A.option_id]
				: null,
			B: character?.level_up_choices[9].B.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[9].B.option_id]
				: null
		},
		10: {
			A: character?.level_up_choices[10].A.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[10].A.option_id]
				: null,
			B: character?.level_up_choices[10].B.option_id
				? ALL_LEVEL_UP_OPTIONS[character.level_up_choices[10].B.option_id]
				: null
		}
	});
	let options_used: Record<AllTierOptionIds, number> = $derived.by(() => {
		if (!character) return {};
		const used: Record<string, number> = {};

		Object.values(character.level_up_choices).forEach(
			(choice: { A: LevelUpChoice; B: LevelUpChoice }) => {
				if (choice.A.option_id) {
					if (!used[choice.A.option_id]) used[choice.A.option_id] = 1;
					else used[choice.A.option_id]++;
				}
				if (choice.B.option_id) {
					if (!used[choice.B.option_id]) used[choice.B.option_id] = 1;
					else used[choice.B.option_id]++;
				}
			}
		);

		return used;
	});

	// ================================================
	// DERIVED STATS
	// ================================================
	let derived_primary_weapon: (Weapon & { id: string }) | null = $state(null);
	let derived_secondary_weapon: (Weapon & { id: string }) | null = $state(null);
	let derived_unarmed_attack: (Weapon & { id: string }) | null = $state(null);
	let derived_armor: (Armor & { id: string }) | null = $state(null);
	let domain_card_vault: DomainCard[] = $state([]);
	let domain_card_loadout: DomainCard[] = $state([]);
	let traits: Traits = $state({ ...BASE_STATS.traits });
	let proficiency: number = $state(BASE_STATS.proficiency);
	let max_experiences: number = $state(BASE_STATS.max_experiences);
	let max_loadout: number = $state(BASE_STATS.max_loadout);
	let max_hope: number = $state(BASE_STATS.max_hope);
	let max_armor: number = $state(BASE_STATS.max_armor);
	let max_hp: number = $state(BASE_STATS.max_hp);
	let max_stress: number = $state(BASE_STATS.max_stress);
	let max_burden: number = $state(BASE_STATS.max_burden);
	let max_short_rest_actions: number = $state(BASE_STATS.max_short_rest_actions);
	let max_long_rest_actions: number = $state(BASE_STATS.max_long_rest_actions);
	let max_consumables: number = $state(BASE_STATS.max_consumables);
	let consumable_count = $derived.by(() => {
		if (!character) return 0;
		return Object.keys(character.inventory.consumables || {}).length;
	});
	let evasion: number = $state(BASE_STATS.evasion);
	let damage_thresholds: DamageThresholds = $state({ ...BASE_STATS.damage_thresholds });
	let primary_class_mastery_level: number = $state(BASE_STATS.primary_class_mastery_level);
	let secondary_class_mastery_level: number = $state(BASE_STATS.secondary_class_mastery_level);
	let experience_modifiers: number[] = $state(
		Array.from({ length: BASE_STATS.max_experiences }, () => BASE_STATS.experience_modifier)
	);
	let spellcast_roll_bonus: number = $state(BASE_STATS.spellcast_roll_bonus);
	let derived_beastform: Beastform | null = $state(null);
	let derived_companion: Companion | null = $state(null);

	// ================================================
	// CHARACTER VALIDATION EFFECTS
	// ================================================

	// Helper function to get available beastforms filtered by level and excluding special cases
	const get_available_beastforms = (
		character_level: number,
		exclude_ids: string[]
	): Beastform[] => {
		const special_case_ids = [
			'legendary_beast',
			'legendary_hybrid',
			'mythic_beast',
			'mythic_hybrid'
		];
		const all_exclude_ids = [...exclude_ids, ...special_case_ids];

		return Object.values(compendium.beastforms).filter(
			(beastform) =>
				beastform.level_requirement <= character_level &&
				!all_exclude_ids.includes(beastform.compendium_id)
		);
	};

	// ! initialize companion if subclass is ranger_beastbound
	$effect(() => {
		if (!character) return;
		const rangerBeastbound = compendium.subclasses.ranger_beastbound;
		if (!rangerBeastbound) return;
		if (
			character.primary_subclass_id !== rangerBeastbound.compendium_id &&
			character.secondary_subclass_id !== rangerBeastbound.compendium_id
		) {
			character.companion = null;
		} else {
			// Only initialize if companion doesn't exist, otherwise preserve existing companion data
			if (!character.companion) {
				character.companion = { ...BASE_COMPANION };
			}
		}
	});

	// ! derived companion
	$effect(() => {
		if (!character) return;
		if (!character.companion) {
			if (derived_companion !== null) {
				derived_companion = null;
			}
			return;
		}

		// Start with a deep copy of the companion
		const base_companion = character.companion as Companion;
		const new_derived_companion: Companion = {
			name: base_companion.name,
			image_url: base_companion.image_url,
			attack: base_companion.attack ? { ...base_companion.attack } : null,
			max_stress: base_companion.max_stress,
			marked_stress: base_companion.marked_stress,
			max_hope: base_companion.max_hope,
			marked_hope: base_companion.marked_hope,
			evasion: base_companion.evasion,
			level_up_choices: [...base_companion.level_up_choices],
			experiences: [...base_companion.experiences],
			experience_modifiers: [...base_companion.experience_modifiers],
			choices: { ...base_companion.choices }
		};

		// Limit level_up_choices array to character.level - 1
		// Index 0 = level 2 choice, index 1 = level 3 choice, etc.
		const maxChoicesLength = Math.max(0, character.level - 1);
		if (new_derived_companion.level_up_choices.length > maxChoicesLength) {
			new_derived_companion.level_up_choices = new_derived_companion.level_up_choices.slice(
				0,
				maxChoicesLength
			);
		}

		// Keep the companion's experiences and experience_modifiers array locked to the same size as the character's experiences array
		const targetSize = character.experiences.length;
		while (new_derived_companion.experiences.length < targetSize) {
			new_derived_companion.experiences.push('');
		}
		while (new_derived_companion.experiences.length > targetSize) {
			new_derived_companion.experiences.pop();
		}

		// Initialize experience_modifiers to base value and resize to match experiences
		new_derived_companion.experience_modifiers = Array(targetSize).fill(
			COMPANION_BASE_EXPERIENCE_MODIFIER
		);

		// Apply "intelligent" bonuses: +1 to chosen experience modifiers
		const intelligentChoices = new_derived_companion.choices['intelligent'] || [];
		for (const experienceIndexStr of intelligentChoices) {
			const experienceIndex = parseInt(experienceIndexStr, 10);
			if (!isNaN(experienceIndex) && experienceIndex >= 0 && experienceIndex < targetSize) {
				new_derived_companion.experience_modifiers[experienceIndex] += 1;
			}
		}

		// Apply "vicious" bonuses: increase damage dice or range by one step
		if (new_derived_companion.attack) {
			const viciousChoices = new_derived_companion.choices['vicious'] || [];
			for (const choice of viciousChoices) {
				if (choice === 'damage_dice' && new_derived_companion.attack) {
					new_derived_companion.attack.damage_dice = increaseDie(
						new_derived_companion.attack.damage_dice
					);
				} else if (choice === 'range' && new_derived_companion.attack) {
					new_derived_companion.attack.range = increase_range(new_derived_companion.attack.range);
				}
			}
		}

		// Apply "resilient" bonuses: +1 to max_stress per choice
		const resilientCount = new_derived_companion.level_up_choices.filter(
			(id) => id === 'resilient'
		).length;
		new_derived_companion.max_stress += resilientCount;

		// Apply "light-in-the-dark" bonuses: +1 to max_hope per choice
		const lightInTheDarkCount = new_derived_companion.level_up_choices.filter(
			(id) => id === 'light-in-the-dark'
		).length;
		new_derived_companion.max_hope += lightInTheDarkCount;

		// Apply "aware" bonuses: +2 to evasion per choice
		const awareCount = new_derived_companion.level_up_choices.filter((id) => id === 'aware').length;
		new_derived_companion.evasion += awareCount * 2;

		// Cap marked_stress between 0 and max_stress
		new_derived_companion.marked_stress = Math.max(
			0,
			Math.min(new_derived_companion.marked_stress, new_derived_companion.max_stress)
		);

		// Cap marked_hope between 0 and max_hope
		new_derived_companion.marked_hope = Math.max(
			0,
			Math.min(new_derived_companion.marked_hope, new_derived_companion.max_hope)
		);

		if (JSON.stringify(new_derived_companion) !== JSON.stringify(derived_companion)) {
			derived_companion = new_derived_companion;
		}
	});

	// ! clear beastform if class isn't druid
	$effect(() => {
		if (!character || !character.chosen_beastform) return;

		if (
			character.primary_class_id !== compendium.classes.druid.compendium_id &&
			character.secondary_class_id !== compendium.classes.druid.compendium_id
		) {
			character.chosen_beastform = null;
		}
	});

	// ! derive beastform
	$effect(() => {
		if (!character || !character.chosen_beastform) {
			if (derived_beastform !== null) {
				derived_beastform = null;
			}
			return;
		}

		const chosen_beastform = character.chosen_beastform;
		const base_compendium_id = chosen_beastform.compendium_id;

		// Initialize choices object if it doesn't exist
		if (!chosen_beastform.choices) {
			chosen_beastform.choices = {};
		}
		const choices = chosen_beastform.choices;

		// Helper function to check if two beastforms are equivalent
		function equivalent_beastform(
			a: Beastform | null | undefined,
			b: Beastform | null | undefined
		): boolean {
			if ((a === null || a === undefined) && (b === null || b === undefined)) return true;
			if (a === null || a === undefined || b === null || b === undefined) return false;

			return JSON.stringify(a) === JSON.stringify(b);
		}

		// Handle special cases
		if (base_compendium_id === 'legendary_beast') {
			// Legendary Beast: Tier 3, level 5
			// Requires 1 Tier 1 beastform (level_requirement === 1)
			const legendary_beast_template = compendium.beastforms['legendary_beast'];
			if (!legendary_beast_template) {
				if (derived_beastform !== null) {
					derived_beastform = null;
				}
				return;
			}

			if (character.level < 5) {
				// Return template even if level is too low, so UI can show it
				if (!equivalent_beastform(derived_beastform, legendary_beast_template)) {
					derived_beastform = legendary_beast_template;
				}
				return;
			}

			// Initialize choice array if it doesn't exist
			if (!choices.legendary_beast_base_form) {
				choices.legendary_beast_base_form = [];
			}

			const base_form_choice = choices.legendary_beast_base_form;
			if (base_form_choice.length !== 1) {
				// Return template when choices aren't complete
				if (!equivalent_beastform(derived_beastform, legendary_beast_template)) {
					derived_beastform = legendary_beast_template;
				}
				return;
			}

			const base_form_id = base_form_choice[0];
			const base_form = compendium.beastforms[base_form_id];
			if (!base_form) {
				// Return template if base form doesn't exist
				if (!equivalent_beastform(derived_beastform, legendary_beast_template)) {
					derived_beastform = legendary_beast_template;
				}
				return;
			}

			// Merge: Start with base form, apply bonuses, retain all original traits/features, use template's category
			const new_beastform: Beastform = {
				...base_form,
				compendium_id: legendary_beast_template.compendium_id,
				name: legendary_beast_template.name,
				category: legendary_beast_template.category,
				level_requirement: legendary_beast_template.level_requirement,
				attack: {
					...base_form.attack,
					damage_bonus: base_form.attack.damage_bonus + 6
				},
				character_trait: {
					...base_form.character_trait,
					bonus: base_form.character_trait.bonus + 1
				},
				evasion_bonus: base_form.evasion_bonus + 2
			};

			if (!equivalent_beastform(derived_beastform, new_beastform)) {
				derived_beastform = new_beastform;
			}
		} else if (base_compendium_id === 'legendary_hybrid') {
			// Legendary Hybrid: Tier 3, level 5
			// Requires 2 beastforms from Tiers 1-2 (level_requirement <= 4)
			// User selects 4 advantages and 2 features total
			const legendary_hybrid_template = compendium.beastforms['legendary_hybrid'];
			if (!legendary_hybrid_template) {
				if (derived_beastform !== null) {
					derived_beastform = null;
				}
				return;
			}

			if (character.level < 5) {
				// Return template even if level is too low
				if (!equivalent_beastform(derived_beastform, legendary_hybrid_template)) {
					derived_beastform = legendary_hybrid_template;
				}
				return;
			}

			// Initialize choice arrays if they don't exist
			if (!choices.legendary_hybrid_base_forms) {
				choices.legendary_hybrid_base_forms = [];
			}
			if (!choices.legendary_hybrid_base_forms_0_advantages) {
				choices.legendary_hybrid_base_forms_0_advantages = [];
			}
			if (!choices.legendary_hybrid_base_forms_1_advantages) {
				choices.legendary_hybrid_base_forms_1_advantages = [];
			}
			if (!choices.legendary_hybrid_base_forms_0_features) {
				choices.legendary_hybrid_base_forms_0_features = [];
			}
			if (!choices.legendary_hybrid_base_forms_1_features) {
				choices.legendary_hybrid_base_forms_1_features = [];
			}

			const base_forms_choice = choices.legendary_hybrid_base_forms;
			if (base_forms_choice.length !== 2) {
				// Return template when choices aren't complete
				if (!equivalent_beastform(derived_beastform, legendary_hybrid_template)) {
					derived_beastform = legendary_hybrid_template;
				}
				return;
			}

			const base_form_0_id = base_forms_choice[0];
			const base_form_1_id = base_forms_choice[1];
			const base_form_0 = compendium.beastforms[base_form_0_id];
			const base_form_1 = compendium.beastforms[base_form_1_id];

			if (!base_form_0 || !base_form_1) {
				// Return template if base forms don't exist
				if (!equivalent_beastform(derived_beastform, legendary_hybrid_template)) {
					derived_beastform = legendary_hybrid_template;
				}
				return;
			}

			// Get selected advantages and features
			const advantages_0_indexes = choices.legendary_hybrid_base_forms_0_advantages || [];
			const advantages_1_indexes = choices.legendary_hybrid_base_forms_1_advantages || [];
			const features_0_indexes = choices.legendary_hybrid_base_forms_0_features || [];
			const features_1_indexes = choices.legendary_hybrid_base_forms_1_features || [];

			// Validate advantage indexes (must total 4)
			const all_advantage_indexes = [...advantages_0_indexes, ...advantages_1_indexes];
			if (all_advantage_indexes.length !== 4) {
				// Return template when choices aren't complete
				if (!equivalent_beastform(derived_beastform, legendary_hybrid_template)) {
					derived_beastform = legendary_hybrid_template;
				}
				return;
			}

			// Validate feature indexes (must total 2)
			const all_feature_indexes = [...features_0_indexes, ...features_1_indexes];
			if (all_feature_indexes.length !== 2) {
				// Return template when choices aren't complete
				if (!equivalent_beastform(derived_beastform, legendary_hybrid_template)) {
					derived_beastform = legendary_hybrid_template;
				}
				return;
			}

			// Collect selected advantages
			const selected_advantages: string[] = [];
			for (const idxStr of advantages_0_indexes) {
				const idx = parseInt(idxStr, 10);
				if (idx >= 0 && idx < base_form_0.advantages.length) {
					selected_advantages.push(base_form_0.advantages[idx]);
				}
			}
			for (const idxStr of advantages_1_indexes) {
				const idx = parseInt(idxStr, 10);
				if (idx >= 0 && idx < base_form_1.advantages.length) {
					selected_advantages.push(base_form_1.advantages[idx]);
				}
			}

			// Collect selected features
			const selected_features = [];
			for (const idxStr of features_0_indexes) {
				const idx = parseInt(idxStr, 10);
				if (idx >= 0 && idx < base_form_0.features.length) {
					selected_features.push(base_form_0.features[idx]);
				}
			}
			for (const idxStr of features_1_indexes) {
				const idx = parseInt(idxStr, 10);
				if (idx >= 0 && idx < base_form_1.features.length) {
					selected_features.push(base_form_1.features[idx]);
				}
			}

			// Remove duplicate advantages
			const unique_advantages = [...new Set(selected_advantages)];

			// Merge: use legendary_hybrid's base stats, merge unique advantages, merge all selected features
			const new_beastform: Beastform = {
				...legendary_hybrid_template,
				advantages: unique_advantages,
				features: selected_features
			};

			if (!equivalent_beastform(derived_beastform, new_beastform)) {
				derived_beastform = new_beastform;
			}
		} else if (base_compendium_id === 'mythic_beast') {
			// Mythic Beast: Tier 4, level 8
			// Requires 1 beastform from Tiers 1-2 (level_requirement <= 4)
			const mythic_beast_template = compendium.beastforms['mythic_beast'];
			if (!mythic_beast_template) {
				if (derived_beastform !== null) {
					derived_beastform = null;
				}
				return;
			}

			if (character.level < 8) {
				// Return template even if level is too low
				if (!equivalent_beastform(derived_beastform, mythic_beast_template)) {
					derived_beastform = mythic_beast_template;
				}
				return;
			}

			// Initialize choice array if it doesn't exist
			if (!choices.mythic_beast_base_form) {
				choices.mythic_beast_base_form = [];
			}

			const base_form_choice = choices.mythic_beast_base_form;
			if (base_form_choice.length !== 1) {
				// Return template when choices aren't complete
				if (!equivalent_beastform(derived_beastform, mythic_beast_template)) {
					derived_beastform = mythic_beast_template;
				}
				return;
			}

			const base_form_id = base_form_choice[0];
			const base_form = compendium.beastforms[base_form_id];
			if (!base_form) {
				// Return template if base form doesn't exist
				if (!equivalent_beastform(derived_beastform, mythic_beast_template)) {
					derived_beastform = mythic_beast_template;
				}
				return;
			}

			// Merge: Start with base form, apply bonuses, increase damage die, retain all original traits/features, use template's category
			const new_beastform: Beastform = {
				...base_form,
				compendium_id: mythic_beast_template.compendium_id,
				name: mythic_beast_template.name,
				category: mythic_beast_template.category,
				level_requirement: mythic_beast_template.level_requirement,
				attack: {
					...base_form.attack,
					damage_dice: increaseDie(base_form.attack.damage_dice),
					damage_bonus: base_form.attack.damage_bonus + 9
				},
				character_trait: {
					...base_form.character_trait,
					bonus: base_form.character_trait.bonus + 2
				},
				evasion_bonus: base_form.evasion_bonus + 3
			};

			if (!equivalent_beastform(derived_beastform, new_beastform)) {
				derived_beastform = new_beastform;
			}
		} else if (base_compendium_id === 'mythic_hybrid') {
			// Mythic Hybrid: Tier 4, level 8
			// Requires 3 beastforms from Tiers 1-3 (level_requirement <= 7)
			// User selects 5 advantages and 3 features total
			const mythic_hybrid_template = compendium.beastforms['mythic_hybrid'];
			if (!mythic_hybrid_template) {
				if (derived_beastform !== null) {
					derived_beastform = null;
				}
				return;
			}

			if (character.level < 8) {
				// Return template even if level is too low
				if (!equivalent_beastform(derived_beastform, mythic_hybrid_template)) {
					derived_beastform = mythic_hybrid_template;
				}
				return;
			}

			// Initialize choice arrays if they don't exist
			if (!choices.mythic_hybrid_base_forms) {
				choices.mythic_hybrid_base_forms = [];
			}
			if (!choices.mythic_hybrid_base_forms_0_advantages) {
				choices.mythic_hybrid_base_forms_0_advantages = [];
			}
			if (!choices.mythic_hybrid_base_forms_1_advantages) {
				choices.mythic_hybrid_base_forms_1_advantages = [];
			}
			if (!choices.mythic_hybrid_base_forms_2_advantages) {
				choices.mythic_hybrid_base_forms_2_advantages = [];
			}
			if (!choices.mythic_hybrid_base_forms_0_features) {
				choices.mythic_hybrid_base_forms_0_features = [];
			}
			if (!choices.mythic_hybrid_base_forms_1_features) {
				choices.mythic_hybrid_base_forms_1_features = [];
			}
			if (!choices.mythic_hybrid_base_forms_2_features) {
				choices.mythic_hybrid_base_forms_2_features = [];
			}

			const base_forms_choice = choices.mythic_hybrid_base_forms;
			if (base_forms_choice.length !== 3) {
				// Return template when choices aren't complete
				if (!equivalent_beastform(derived_beastform, mythic_hybrid_template)) {
					derived_beastform = mythic_hybrid_template;
				}
				return;
			}

			const base_form_0_id = base_forms_choice[0];
			const base_form_1_id = base_forms_choice[1];
			const base_form_2_id = base_forms_choice[2];
			const base_form_0 = compendium.beastforms[base_form_0_id];
			const base_form_1 = compendium.beastforms[base_form_1_id];
			const base_form_2 = compendium.beastforms[base_form_2_id];

			if (!base_form_0 || !base_form_1 || !base_form_2) {
				// Return template if base forms don't exist
				if (!equivalent_beastform(derived_beastform, mythic_hybrid_template)) {
					derived_beastform = mythic_hybrid_template;
				}
				return;
			}

			// Get selected advantages and features
			const advantages_0_indexes = choices.mythic_hybrid_base_forms_0_advantages || [];
			const advantages_1_indexes = choices.mythic_hybrid_base_forms_1_advantages || [];
			const advantages_2_indexes = choices.mythic_hybrid_base_forms_2_advantages || [];
			const features_0_indexes = choices.mythic_hybrid_base_forms_0_features || [];
			const features_1_indexes = choices.mythic_hybrid_base_forms_1_features || [];
			const features_2_indexes = choices.mythic_hybrid_base_forms_2_features || [];

			// Validate advantage indexes (must total 5)
			const all_advantage_indexes = [
				...advantages_0_indexes,
				...advantages_1_indexes,
				...advantages_2_indexes
			];
			if (all_advantage_indexes.length !== 5) {
				// Return template when choices aren't complete
				if (!equivalent_beastform(derived_beastform, mythic_hybrid_template)) {
					derived_beastform = mythic_hybrid_template;
				}
				return;
			}

			// Validate feature indexes (must total 3)
			const all_feature_indexes = [
				...features_0_indexes,
				...features_1_indexes,
				...features_2_indexes
			];
			if (all_feature_indexes.length !== 3) {
				// Return template when choices aren't complete
				if (!equivalent_beastform(derived_beastform, mythic_hybrid_template)) {
					derived_beastform = mythic_hybrid_template;
				}
				return;
			}

			// Collect selected advantages
			const selected_advantages: string[] = [];
			for (const idxStr of advantages_0_indexes) {
				const idx = parseInt(idxStr, 10);
				if (idx >= 0 && idx < base_form_0.advantages.length) {
					selected_advantages.push(base_form_0.advantages[idx]);
				}
			}
			for (const idxStr of advantages_1_indexes) {
				const idx = parseInt(idxStr, 10);
				if (idx >= 0 && idx < base_form_1.advantages.length) {
					selected_advantages.push(base_form_1.advantages[idx]);
				}
			}
			for (const idxStr of advantages_2_indexes) {
				const idx = parseInt(idxStr, 10);
				if (idx >= 0 && idx < base_form_2.advantages.length) {
					selected_advantages.push(base_form_2.advantages[idx]);
				}
			}

			// Collect selected features
			const selected_features = [];
			for (const idxStr of features_0_indexes) {
				const idx = parseInt(idxStr, 10);
				if (idx >= 0 && idx < base_form_0.features.length) {
					selected_features.push(base_form_0.features[idx]);
				}
			}
			for (const idxStr of features_1_indexes) {
				const idx = parseInt(idxStr, 10);
				if (idx >= 0 && idx < base_form_1.features.length) {
					selected_features.push(base_form_1.features[idx]);
				}
			}
			for (const idxStr of features_2_indexes) {
				const idx = parseInt(idxStr, 10);
				if (idx >= 0 && idx < base_form_2.features.length) {
					selected_features.push(base_form_2.features[idx]);
				}
			}

			// Remove duplicate advantages
			const unique_advantages = [...new Set(selected_advantages)];

			// Merge: use mythic_hybrid's base stats, merge unique advantages, merge all selected features
			const new_beastform: Beastform = {
				...mythic_hybrid_template,
				advantages: unique_advantages,
				features: selected_features
			};

			if (!equivalent_beastform(derived_beastform, new_beastform)) {
				derived_beastform = new_beastform;
			}
		} else {
			// Normal case: use compendium directly
			const beastform = compendium.beastforms[base_compendium_id];
			if (!beastform) {
				if (derived_beastform !== null) {
					derived_beastform = null;
				}
				return;
			}

			// Validate level requirement for regular beastforms
			if (character.level < beastform.level_requirement) {
				if (derived_beastform !== null) {
					derived_beastform = null;
				}
				return;
			}

			const new_beastform = beastform;
			if (!equivalent_beastform(derived_beastform, new_beastform)) {
				derived_beastform = new_beastform;
			}
		}
	});

	// ! clear invalid class choices
	$effect(() => {
		if (!character) return;

		for (const class_id of Object.keys(character.class_choices)) {
			if (class_id !== character.primary_class_id && class_id !== character.secondary_class_id) {
				delete character.class_choices[class_id];
			}
		}
	});

	// ! clear invalid mixed-ancestry
	$effect(() => {
		if (!character) return;
		if (character.ancestry_card_id !== BASE_MIXED_ANCESTRY_CARD.compendium_id) {
			character.custom_top_ancestry = null;
			character.custom_bottom_ancestry = null;
		}
	});

	// ! clear consumables above max
	$effect(() => {
		if (!character) return;

		const currentCount = consumable_count;
		const max = max_consumables;

		if (currentCount <= max) return;

		const excess = currentCount - max;
		let removed = 0;

		// Iterate through consumables and remove excess items
		for (const id of Object.keys(character.inventory.consumables)) {
			if (removed >= excess) break;

			delete character.inventory.consumables[id];
			removed++;
		}

		if (removed > 0) {
			console.warn(`Removed ${removed} consumables to stay within max of ${max}`);
		}
	});

	// ! clear invalid ancestry card choices
	$effect(() => {
		if (!character) return;
		let new_ancestry_card_choices: Record<string, string[]> = JSON.parse(
			JSON.stringify(character.ancestry_card_choices)
		);

		// initialize choices
		if (ancestry_card) {
			for (const choice of ancestry_card.choices) {
				if (!new_ancestry_card_choices[choice.choice_id]) {
					console.warn(`Creating arbitrary_choice slot for ${choice.choice_id}`);
					new_ancestry_card_choices[choice.choice_id] = [];
				}
			}
			// delete other attributes
			for (const choice_id of Object.keys(new_ancestry_card_choices)) {
				if (!ancestry_card.choices.some((choice) => choice.choice_id === choice_id)) {
					delete new_ancestry_card_choices[choice_id];
				}
			}
		} else {
			new_ancestry_card_choices = {};
		}

		function deepEqualRecords(a: Record<string, string[]>, b: Record<string, string[]>): boolean {
			const aKeys = Object.keys(a);
			const bKeys = Object.keys(b);
			if (aKeys.length !== bKeys.length) return false;

			for (const key of aKeys) {
				if (!b.hasOwnProperty(key)) return false;

				const aValues = [...a[key]].sort();
				const bValues = [...b[key]].sort();

				if (aValues.length !== bValues.length) return false;
				for (let i = 0; i < aValues.length; i++) {
					if (aValues[i] !== bValues[i]) return false;
				}
			}

			return true;
		}

		if (!deepEqualRecords(character.ancestry_card_choices, new_ancestry_card_choices)) {
			console.warn('ancestry_card_choices updated');
			character.ancestry_card_choices = new_ancestry_card_choices;
		}
	});

	// ! clear invalid selected traits
	$effect(() => {
		if (!character) return;

		let available_options = [...TRAIT_OPTIONS];
		for (const key in character.selected_traits) {
			const value = character.selected_traits[key as keyof Traits];
			const i = available_options.findIndex((option) => option === value);

			if (value === null) {
				continue;
			} else if (i !== -1) {
				available_options.splice(i, 1);
			} else {
				console.warn(`${value} was not a valid trait option. setting to ${key} to null`);
				character.selected_traits[key as keyof Traits] = null;
			}
		}
	});

	// ! clear subclass if class is null
	$effect(() => {
		if (!character) return;
		if (!character.primary_class_id) character.primary_subclass_id = null;
		if (!character.secondary_class_id) {
			character.secondary_subclass_id = null;
			character.secondary_class_domain_id_choice = null;
		}
	});

	// ! clear invalid secondary classes
	$effect(() => {
		if (!character || !character.secondary_class_id) return;

		// clear secondary class if multiclass is not selected as a level up choice
		if (!options_used['tier_3_multiclass'] && !options_used['tier_4_multiclass']) {
			console.warn(
				`Clearing secondary class because multiclass is not selected as a level up choice`
			);
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
	});

	// ! initialize class choices, background questions, and connections
	let last_primary_class_id_for_background: string | null = null;
	$effect(() => {
		if (!character) return;

		const current_class_id = character.primary_class_id;

		// If class hasn't changed, don't reset (preserves saved answers on page load)
		if (current_class_id === last_primary_class_id_for_background) return;

		// Track the class change
		const classChanged = last_primary_class_id_for_background !== null;
		last_primary_class_id_for_background = current_class_id;

		if (!primary_class) {
			character.background_question_answers = [];
			character.connection_answers = [];
		} else {
			// Only reset if class actually changed; preserve existing answers on initial load
			if (classChanged) {
				// Class changed: preserve answers where questions match
				const existingAnswers = new Map(
					character.background_question_answers.map((item) => [item.question, item.answer])
				);
				character.background_question_answers = primary_class.background_questions.map(
					(question) => ({
						question,
						answer: existingAnswers.get(question) || ''
					})
				);

				const existingConnections = new Map(
					character.connection_answers.map((item) => [item.question, item.answer])
				);
				character.connection_answers = primary_class.connection_questions.map((question) => ({
					question,
					answer: existingConnections.get(question) || ''
				}));
			} else {
				// Initial load: only initialize if character has no answers
				if (character.background_question_answers.length === 0) {
					character.background_question_answers = primary_class.background_questions.map(
						(question) => ({ question, answer: '' })
					);
				}
				if (character.connection_answers.length === 0) {
					character.connection_answers = primary_class.connection_questions.map((question) => ({
						question,
						answer: ''
					}));
				}
			}
		}
	});

	// ! clear duplicate or invalid active_conditions
	$effect(() => {
		if (!character) return;

		const validConditionIds = Object.keys(CONDITIONS) as ConditionIds[];
		const cleaned = character.active_conditions
			.filter((condition) => validConditionIds.includes(condition))
			.filter((condition, index, array) => array.indexOf(condition) === index)
			.sort();

		if (JSON.stringify(cleaned) !== JSON.stringify(character.active_conditions)) {
			character.active_conditions = cleaned;
		}
	});

	// ! clear level up choices above the current level
	$effect(() => {
		if (!character) return;

		if (character.level < 2)
			character.level_up_choices[2] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
		if (character.level < 3)
			character.level_up_choices[3] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
		if (character.level < 4)
			character.level_up_choices[4] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
		if (character.level < 5)
			character.level_up_choices[5] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
		if (character.level < 6)
			character.level_up_choices[6] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
		if (character.level < 7)
			character.level_up_choices[7] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
		if (character.level < 8)
			character.level_up_choices[8] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
		if (character.level < 9)
			character.level_up_choices[9] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };
		if (character.level < 10)
			character.level_up_choices[10] = { A: BLANK_LEVEL_UP_CHOICE, B: BLANK_LEVEL_UP_CHOICE };

		console.warn('Cleared level_up_choices above level', character.level);
	});

	// ! Clear level up choice if the other choice costs two
	$effect(() => {
		if (!character) return;
		for (let i = 2; i <= 10; i++) {
			const level_choices =
				character.level_up_choices[i as keyof typeof character.level_up_choices];
			const chosen_options = level_up_chosen_options[i as keyof typeof level_up_chosen_options];
			const A_id = level_choices.A.option_id;
			const B_id = level_choices.B.option_id;
			const A_costs_two_choices = chosen_options.A?.costs_two_choices || false;
			const B_costs_two_choices = chosen_options.B?.costs_two_choices || false;

			if (A_id !== null && A_costs_two_choices && B_id !== null) {
				console.warn(`Clearing level up option because the other option costs two choices`);
				level_choices.B = { ...BLANK_LEVEL_UP_CHOICE };
			} else if (B_id !== null && B_costs_two_choices && A_id !== null) {
				console.warn(`Clearing level up option because the other option costs two choices`);
				level_choices.A = { ...BLANK_LEVEL_UP_CHOICE };
			}
		}
	});

	// ! Clear level up chocie if it's used more than it's max
	$effect(() => {
		if (!character) return;
		for (let i = 10; i >= 2; i--) {
			const level_choices =
				character.level_up_choices[i as keyof typeof character.level_up_choices];
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

	// ! Clear level up choices with conflicting multiclass / subclass upgrade options
	$effect(() => {
		if (!character) return;
		for (let i = 2; i <= 10; i++) {
			const level_choices =
				character.level_up_choices[i as keyof typeof character.level_up_choices];

			if (
				level_choices.A.option_id === 'tier_3_multiclass' &&
				(options_used['tier_4_multiclass'] >= 1 || options_used['tier_3_subclass_upgrade'] >= 1)
			) {
				console.warn(`Clearing invalid multiclass choice at tier ${i}`);
				level_choices.A = BLANK_LEVEL_UP_CHOICE;
			} else if (
				level_choices.A.option_id === 'tier_4_multiclass' &&
				(options_used['tier_3_multiclass'] >= 1 || options_used['tier_4_subclass_upgrade'] >= 1)
			) {
				console.warn(`Clearing invalid multiclass choice at tier ${i}`);
				level_choices.A = BLANK_LEVEL_UP_CHOICE;
			}

			if (
				level_choices.B.option_id === 'tier_3_multiclass' &&
				(options_used['tier_4_multiclass'] >= 1 || options_used['tier_3_subclass_upgrade'] >= 1)
			) {
				console.warn(`Clearing invalid multiclass choice at tier ${i}`);
				level_choices.B = BLANK_LEVEL_UP_CHOICE;
			} else if (
				level_choices.B.option_id === 'tier_4_multiclass' &&
				(options_used['tier_3_multiclass'] >= 1 || options_used['tier_4_subclass_upgrade'] >= 1)
			) {
				console.warn(`Clearing invalid multiclass choice at tier ${i}`);
				level_choices.B = BLANK_LEVEL_UP_CHOICE;
			}
		}
	});

	// ! clear invalid subclass upgrade choices at each level
	$effect(() => {
		if (!character) return;
		let multiclass_used = false;

		for (let i = 2; i <= 10; i++) {
			const level_choices =
				character.level_up_choices[i as keyof typeof character.level_up_choices];
			const choice_A = level_choices.A;
			const choice_B = level_choices.B;

			multiclass_used =
				multiclass_used ||
				choice_A.option_id === 'tier_3_multiclass' ||
				choice_A.option_id === 'tier_4_multiclass' ||
				choice_B.option_id === 'tier_3_multiclass' ||
				choice_B.option_id === 'tier_4_multiclass';

			// clear subclass upgrade selection if the level choice is not a subclass upgrade choice
			if (
				!choice_A.option_id ||
				!['tier_3_subclass_upgrade', 'tier_4_subclass_upgrade'].includes(choice_A.option_id)
			) {
				if (choice_A.selected_subclass_upgrade !== null) {
					console.warn(
						`Clearing selected subclass upgrade because level choice was changed to ${choice_A.option_id}`
					);
					choice_A.selected_subclass_upgrade = null;
				}
			}
			if (
				!choice_B.option_id ||
				!['tier_3_subclass_upgrade', 'tier_4_subclass_upgrade'].includes(choice_B.option_id)
			) {
				if (choice_B.selected_subclass_upgrade !== null) {
					console.warn(
						`Clearing selected subclass upgrade because level choice was changed to ${choice_B.option_id}`
					);
					choice_B.selected_subclass_upgrade = null;
				}
			}

			// clear level up choice if multiclass is already chosen in that tier
			if (options_used['tier_3_multiclass'] >= 1) {
				if (choice_A.option_id === 'tier_3_subclass_upgrade') {
					console.warn(
						`Clearing selected subclass upgrade because multiclass is already chosen in tier 3`
					);
					character.level_up_choices[i as keyof typeof character.level_up_choices].A =
						BLANK_LEVEL_UP_CHOICE;
				}
				if (choice_B.option_id === 'tier_3_subclass_upgrade') {
					console.warn(
						`Clearing selected subclass upgrade because multiclass is already chosen in tier 3`
					);
					character.level_up_choices[i as keyof typeof character.level_up_choices].B =
						BLANK_LEVEL_UP_CHOICE;
				}
			}
			if (options_used['tier_4_multiclass'] >= 1) {
				if (choice_A.option_id === 'tier_4_subclass_upgrade') {
					console.warn(
						`Clearing selected subclass upgrade because multiclass is already chosen in tier 4`
					);
					character.level_up_choices[i as keyof typeof character.level_up_choices].A =
						BLANK_LEVEL_UP_CHOICE;
				}
				if (choice_B.option_id === 'tier_4_subclass_upgrade') {
					console.warn(
						`Clearing selected subclass upgrade because multiclass is already chosen in tier 4`
					);
					character.level_up_choices[i as keyof typeof character.level_up_choices].B =
						BLANK_LEVEL_UP_CHOICE;
				}
			}

			// clear "secondary" subclass upgrade chocie if multiclass was not used before
			if (choice_A.selected_subclass_upgrade === 'secondary' && !multiclass_used) {
				console.warn(
					`Clearing "secondary" subclass upgrade because multiclass was not used before`
				);
				choice_A.selected_subclass_upgrade = null;
			}
			if (choice_B.selected_subclass_upgrade === 'secondary' && !multiclass_used) {
				console.warn(
					`Clearing "secondary" subclass upgrade because multiclass was not used before`
				);
				choice_B.selected_subclass_upgrade = null;
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
		knowledge: false
	});
	let tier_3_marked_traits: Record<keyof Traits, boolean> = $state({
		agility: false,
		strength: false,
		finesse: false,
		instinct: false,
		presence: false,
		knowledge: false
	});
	let tier_4_marked_traits: Record<keyof Traits, boolean> = $state({
		agility: false,
		strength: false,
		finesse: false,
		instinct: false,
		presence: false,
		knowledge: false
	});

	function clear_duplicated_marked_traits(
		level_choice_ids: (keyof typeof ALL_LEVEL_UP_OPTIONS)[],
		tier_marked_traits: Record<keyof Traits, boolean>,
		level_choices: { A: LevelUpChoice; B: LevelUpChoice }
	) {
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
			knowledge: false
		};
		let tier_3_mt: Record<keyof Traits, boolean> = {
			agility: false,
			strength: false,
			finesse: false,
			instinct: false,
			presence: false,
			knowledge: false
		};
		let tier_4_mt: Record<keyof Traits, boolean> = {
			agility: false,
			strength: false,
			finesse: false,
			instinct: false,
			presence: false,
			knowledge: false
		};
		for (let i = 2; i <= character.level; i++) {
			const level_choices =
				character.level_up_choices[i as keyof typeof character.level_up_choices];
			if (i <= 4) {
				clear_duplicated_marked_traits(['tier_2_traits'], tier_2_mt, level_choices);
			} else if (i <= 7) {
				clear_duplicated_marked_traits(
					['tier_2_traits', 'tier_3_traits'],
					tier_3_mt,
					level_choices
				);
			} else {
				clear_duplicated_marked_traits(
					['tier_2_traits', 'tier_3_traits', 'tier_4_traits'],
					tier_4_mt,
					level_choices
				);
			}
		}

		tier_2_marked_traits = tier_2_mt;
		tier_3_marked_traits = tier_3_mt;
		tier_4_marked_traits = tier_4_mt;
	});

	// ! clear conflicting selected experience choices at each level
	$effect(() => {
		if (!character) return;

		for (let i = 2; i <= 10; i++) {
			const level_choices =
				character.level_up_choices[i as keyof typeof character.level_up_choices];
			const choice_A = level_choices.A;
			const choice_B = level_choices.B;

			// clear selected experiences if the level choice is not an experience bonus choice
			if (
				!choice_A.option_id ||
				!['tier_2_experience_bonus', 'tier_3_experience_bonus', 'tier_4_experience_bonus'].includes(
					choice_A.option_id
				)
			) {
				if (choice_A.selected_experiences.length > 0) {
					console.warn(
						`Clearing selected experiences because level choice was changed to ${choice_A.option_id}`
					);
					choice_A.selected_experiences = [];
				}
			}
			if (
				!choice_B.option_id ||
				!['tier_2_experience_bonus', 'tier_3_experience_bonus', 'tier_4_experience_bonus'].includes(
					choice_B.option_id
				)
			) {
				if (choice_B.selected_experiences.length > 0) {
					console.warn(
						`Clearing selected experiences because level choice was changed to ${choice_B.option_id}`
					);
					choice_B.selected_experiences = [];
				}
			}

			// clear anything above 2 selected experiences
			if (choice_A.selected_experiences.length > 2) {
				console.warn('Selected Experiences length was greater than 2, removing extra selections.');
				choice_A.selected_experiences = choice_A.selected_experiences.slice(0, 1);
			}
			if (choice_B.selected_experiences.length > 2) {
				console.warn('Selected Experiences length was greater than 2, removing extra selections.');
				choice_B.selected_experiences = choice_B.selected_experiences.slice(0, 1);
			}

			// clear conflicting selected experiences
			if (
				choice_A.selected_experiences.length === 2 &&
				choice_A.selected_experiences[0] === choice_A.selected_experiences[1]
			) {
				console.warn(
					`Experience ${choice_A.selected_experiences[0]} is already used in another option`
				);
				choice_A.selected_experiences.pop();
			}
			if (
				choice_B.selected_experiences.length === 2 &&
				choice_B.selected_experiences[0] === choice_B.selected_experiences[1]
			) {
				console.warn(
					`Experience ${choice_B.selected_experiences[0]} is already used in another option`
				);
				choice_B.selected_experiences.pop();
			}
		}
	});

	// ! update descriptors
	$effect(() => {
		if (!character) return;
		character.derived_descriptors.ancestry_name = ancestry_card ? ancestry_card.title : '';
		character.derived_descriptors.primary_class_name = primary_class ? primary_class.name : '';
		character.derived_descriptors.primary_subclass_name = primary_subclass
			? primary_subclass.name
			: '';
		character.derived_descriptors.secondary_class_name = secondary_class
			? secondary_class.name
			: '';
		character.derived_descriptors.secondary_subclass_name = secondary_subclass
			? secondary_subclass.name
			: '';
	});

	// ! clear invalid community card tokens
	$effect(() => {
		if (!character) return;

		if (!community_card?.tokens) character.community_card_tokens = 0;
	});

	// ! build domain card vault and clear invalid domain card choices at each level
	$effect(() => {
		if (!character) return;

		if (!character.primary_class_id) {
			character.level_up_domain_card_ids[1] = { A: null, B: null };
			return;
		}

		let new_domain_card_vault: DomainCard[] = Object.values(level_up_domain_cards[1]).filter(
			(card) => card !== null && card.level_requirement <= 1
		) as DomainCard[];

		let multiclass_used = false;

		// ! add cards from level up choices
		for (let i = 2; i <= 10; i++) {
			const level_up_domain_card =
				level_up_domain_cards[i as keyof typeof character.level_up_domain_card_ids].A;

			const level_choices =
				character.level_up_choices[i as keyof typeof character.level_up_choices];
			const choice_A = level_choices.A;
			const choice_B = level_choices.B;

			multiclass_used =
				multiclass_used ||
				choice_A.option_id === 'tier_3_multiclass' ||
				choice_A.option_id === 'tier_4_multiclass' ||
				choice_B.option_id === 'tier_3_multiclass' ||
				choice_B.option_id === 'tier_4_multiclass';

			const available_domain_names = [
				primary_class?.primary_domain_id,
				primary_class?.secondary_domain_id,
				multiclass_used ? character.secondary_class_domain_id_choice : null
			].filter((id) => id !== null);

			//***** level up domain cards *****/
			// filter out cards that are not valid for the current level
			if (level_up_domain_card !== null && level_up_domain_card.level_requirement > i) {
				console.warn(`Domain card ${level_up_domain_card?.title} is not valid for level ${i}`);
				character.level_up_domain_card_ids[i as keyof typeof character.level_up_domain_card_ids].A =
					null;
			}

			// filter out cards that aren't in available domains
			if (
				level_up_domain_card !== null &&
				!available_domain_names.includes(level_up_domain_card.domain_id)
			) {
				console.warn(`Domain card ${level_up_domain_card?.title} is not in available domains`);
				character.level_up_domain_card_ids[i as keyof typeof character.level_up_domain_card_ids].A =
					null;
			}

			// add to vault if it's not already in there
			if (
				level_up_domain_card !== null &&
				new_domain_card_vault.some((card) => card.title === level_up_domain_card?.title)
			) {
				console.warn(`Domain card ${level_up_domain_card?.title} is already in the vault`);
				character.level_up_domain_card_ids[i as keyof typeof character.level_up_domain_card_ids].A =
					null;
			} else if (level_up_domain_card !== null) {
				new_domain_card_vault.push(level_up_domain_card);
			}
			//***** END level up domain cards *****/

			//***** domain card choices *****/
			// clear domain card choices if the level choice is set and is not a domain card choice
			// (don't clear if option_id is null, as user might select domain card before selecting tier option)
			if (
				choice_A.option_id &&
				!['tier_2_domain_card', 'tier_3_domain_card', 'tier_4_domain_card'].includes(
					choice_A.option_id
				)
			) {
				if (choice_A.selected_domain_card_id !== null) {
					console.warn(
						`Clearing selected domain card because level choice was changed to ${choice_A.option_id}`
					);
					choice_A.selected_domain_card_id = null;
				}
			}
			if (
				choice_B.option_id &&
				!['tier_2_domain_card', 'tier_3_domain_card', 'tier_4_domain_card'].includes(
					choice_B.option_id
				)
			) {
				if (choice_B.selected_domain_card_id !== null) {
					console.warn(
						`Clearing selected domain card because level choice was changed to ${choice_B.option_id}`
					);
					choice_B.selected_domain_card_id = null;
				}
			}

			const choice_A_selected_domain_card = choice_A.selected_domain_card_id
				? compendium.domain_cards[choice_A.selected_domain_card_id.domainId]?.[
						choice_A.selected_domain_card_id.cardId
					] || null
				: null;
			const choice_B_selected_domain_card = choice_B.selected_domain_card_id
				? compendium.domain_cards[choice_B.selected_domain_card_id.domainId]?.[
						choice_B.selected_domain_card_id.cardId
					] || null
				: null;

			// filter domain card choices that are not valid for the current level
			if (
				choice_A_selected_domain_card !== null &&
				choice_A_selected_domain_card.level_requirement > i
			) {
				console.warn(
					`Domain card ${choice_A_selected_domain_card.title} is not valid for level ${i}`
				);
				choice_A.selected_domain_card_id = null;
			}
			if (
				choice_B_selected_domain_card !== null &&
				choice_B_selected_domain_card.level_requirement > i
			) {
				console.warn(
					`Domain card ${choice_B_selected_domain_card.title} is not valid for level ${i}`
				);
				choice_B.selected_domain_card_id = null;
			}

			// filter out level up choices that aren't in available domains
			if (
				choice_A_selected_domain_card !== null &&
				!available_domain_names.includes(choice_A_selected_domain_card.domain_id)
			) {
				console.warn(
					`Domain card ${choice_A_selected_domain_card.title} is not in available domains`
				);
				choice_A.selected_domain_card_id = null;
			}
			if (
				choice_B_selected_domain_card !== null &&
				!available_domain_names.includes(choice_B_selected_domain_card.domain_id)
			) {
				console.warn(
					`Domain card ${choice_B_selected_domain_card.title} is not in available domains`
				);
				choice_B.selected_domain_card_id = null;
			}

			// add to vault if it's not already in there
			if (
				choice_A_selected_domain_card !== null &&
				new_domain_card_vault.some((card) => card.title === choice_A_selected_domain_card.title)
			) {
				console.warn(`Domain card ${choice_A_selected_domain_card.title} is already in the vault`);
				choice_A.selected_domain_card_id = null;
			} else if (choice_A_selected_domain_card !== null) {
				new_domain_card_vault.push(choice_A_selected_domain_card);
			}

			if (
				choice_B_selected_domain_card !== null &&
				new_domain_card_vault.some((card) => card.title === choice_B_selected_domain_card.title)
			) {
				console.warn(`Domain card ${choice_B_selected_domain_card.title} is already in the vault`);
				choice_B.selected_domain_card_id = null;
			} else if (choice_B_selected_domain_card !== null) {
				new_domain_card_vault.push(choice_B_selected_domain_card);
			}
			//***** END domain card choices *****/
		}

		// ! add cards from additional_domain_Cards
		new_domain_card_vault.push(...additional_domain_cards);

		// ! clear invalid domain_card_tokens
		for (const domainCardId of Object.keys(character.domain_card_tokens)) {
			if (!new_domain_card_vault.some((card) => card.compendium_id === domainCardId)) {
				delete character.domain_card_tokens[domainCardId];
			}
		}

		// ! clear invalid domain_card_choices
		let new_domain_card_choices: Record<string, Record<string, string[]>> = JSON.parse(
			JSON.stringify(character.domain_card_choices)
		);

		// initialize choices
		for (const card of new_domain_card_vault) {
			if (!new_domain_card_choices[card.compendium_id]) {
				console.warn(`Creating arbitrary_choice slot for ${card.compendium_id}`);
				new_domain_card_choices[card.compendium_id] = Object.fromEntries(
					card.choices.map((choice) => [choice.choice_id, []])
				);
			}
		}

		// clear invalid choices
		const valid_keys = new_domain_card_vault.map((card) => card.compendium_id);
		for (const domain_card_id of Object.keys(new_domain_card_choices)) {
			if (!valid_keys.includes(domain_card_id)) delete new_domain_card_choices[domain_card_id];
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
			console.warn('domain_card_choices updated');
			character.domain_card_choices = new_domain_card_choices;
		}

		// * derived domain card vault
		domain_card_vault = new_domain_card_vault;
	});

	// ! build domain card loadout and clear invalid indices (>max or not in the domain card vault index range)
	$effect(() => {
		if (!character) return;

		// helper function to compare DomainCardId objects
		function domainCardIdEqual(a: DomainCardId, b: DomainCardId): boolean {
			return a.domainId === b.domainId && a.cardId === b.cardId;
		}

		// checks for uniqueness while maintaining order
		function unique<T>(arr: T[], equalFn?: (a: T, b: T) => boolean): T[] {
			if (equalFn) {
				const seen: T[] = [];
				return arr.filter((item) => {
					if (seen.some((seenItem) => equalFn(item, seenItem))) return false;
					seen.push(item);
					return true;
				});
			} else {
				const seen = new Set<T>();
				return arr.filter((item) => {
					if (seen.has(item)) return false;
					seen.add(item);
					return true;
				});
			}
		}

		// filter out ids not in the vault and not forced in vault
		let new_loadout_domain_card_ids = unique(
			character.loadout_domain_card_ids,
			domainCardIdEqual
		).filter((id) =>
			domain_card_vault.some(
				(card) =>
					card.compendium_id === id.cardId &&
					card.domain_id === id.domainId &&
					!card.forced_in_vault
			)
		);

		// check if any cards are forced in the loadout
		const ids_forced_in_loadout: DomainCardId[] = domain_card_vault
			.filter((card) => card.forced_in_loadout)
			.map((card) => ({ domainId: card.domain_id, cardId: card.compendium_id }));

		// add any missing cards that were forced in the loadout
		for (const id of ids_forced_in_loadout) {
			if (!new_loadout_domain_card_ids.some((existingId) => domainCardIdEqual(existingId, id))) {
				console.warn(`Card with forced_in_loadout was missing. Adding to loadout:`, id);
				new_loadout_domain_card_ids.unshift(id);
			}
		}

		if (new_loadout_domain_card_ids.length > max_loadout) {
			console.warn(`Loadout exceeded the max. Removing extra cards`);
			new_loadout_domain_card_ids = new_loadout_domain_card_ids.slice(0, max_loadout);
		}

		domain_card_loadout = new_loadout_domain_card_ids
			.map((id) =>
				domain_card_vault.find(
					(card) => card.compendium_id === id.cardId && card.domain_id === id.domainId
				)
			)
			.filter((card): card is DomainCard => card !== undefined);

		function equivalent(a: DomainCardId[], b: DomainCardId[]): boolean {
			if (a.length === 0 && b.length === 0) return true;
			if (a.length !== b.length) return false;
			const sortedA = [...a].sort((x, y) => {
				const domainCompare = x.domainId.localeCompare(y.domainId);
				return domainCompare !== 0 ? domainCompare : x.cardId.localeCompare(y.cardId);
			});
			const sortedB = [...b].sort((x, y) => {
				const domainCompare = x.domainId.localeCompare(y.domainId);
				return domainCompare !== 0 ? domainCompare : x.cardId.localeCompare(y.cardId);
			});
			return sortedA.every((v, i) => domainCardIdEqual(v, sortedB[i]));
		}

		if (!equivalent(new_loadout_domain_card_ids, character.loadout_domain_card_ids)) {
			character.loadout_domain_card_ids = new_loadout_domain_card_ids;
		}
	});

	// ! build modifier lists -- used to calculate most stats --
	let base_character_modifiers: CharacterModifier[] = $state([]);
	let bonus_character_modifiers: CharacterModifier[] = $state([]);
	let override_character_modifiers: CharacterModifier[] = $state([]);
	let base_weapon_modifiers: WeaponModifier[] = $state([]);
	let bonus_weapon_modifiers: WeaponModifier[] = $state([]);
	let override_weapon_modifiers: WeaponModifier[] = $state([]);
	$effect(() => {
		if (!character) return;

		let all_character_modifiers: CharacterModifier[] = [];
		function push_character_modifiers(modifiers: CharacterModifier[] | undefined) {
			if (!modifiers || modifiers.length === 0) return;
			for (const modifier of modifiers) {
				const conditions_met = modifier.character_conditions.every((condition) =>
					evaluate_character_condition(condition)
				);
				if (conditions_met) all_character_modifiers.push(modifier);
			}
		}

		let all_weapon_modifiers: WeaponModifier[] = [];
		function push_weapon_modifiers(modifiers: WeaponModifier[] | undefined) {
			if (!modifiers || modifiers.length === 0) return;
			for (const modifier of modifiers) {
				const conditions_met = modifier.character_conditions.every((condition) =>
					evaluate_character_condition(condition)
				);
				if (conditions_met) all_weapon_modifiers.push(modifier);
			}
		}

		// ancestry card
		if (ancestry_card) {
			ancestry_card.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		}

		// community card
		if (community_card) {
			community_card.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		}

		// transformation card
		if (transformation_card) {
			transformation_card.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		}

		// primary class
		if (primary_class) {
			push_character_modifiers(primary_class.hope_feature.character_modifiers);
			push_weapon_modifiers(primary_class.hope_feature.weapon_modifiers);

			primary_class.class_features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		}

		// primary subclass cards (gate by mastery level)
		if (primary_subclass) {
			const primaryMastery = primary_class_mastery_level;
			push_character_modifiers(
				primary_subclass.foundation_card.features.flatMap((f) => f.character_modifiers)
			);
			push_weapon_modifiers(
				primary_subclass.foundation_card.features.flatMap((f) => f.weapon_modifiers)
			);
			if (primaryMastery >= 2) {
				push_character_modifiers(
					primary_subclass.specialization_card.features.flatMap((f) => f.character_modifiers)
				);
				push_weapon_modifiers(
					primary_subclass.specialization_card.features.flatMap((f) => f.weapon_modifiers)
				);
			}
			if (primaryMastery >= 3) {
				push_character_modifiers(
					primary_subclass.mastery_card.features.flatMap((f) => f.character_modifiers)
				);
				push_weapon_modifiers(
					primary_subclass.mastery_card.features.flatMap((f) => f.weapon_modifiers)
				);
			}
		}

		// secondary class
		if (secondary_class) {
			// no hope feature for secondary class
			secondary_class.class_features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		}

		// secondary subclass cards (gate by mastery level)
		if (secondary_subclass) {
			const secondaryMastery = secondary_class_mastery_level;
			push_character_modifiers(
				secondary_subclass.foundation_card.features.flatMap((f) => f.character_modifiers)
			);
			push_weapon_modifiers(
				secondary_subclass.foundation_card.features.flatMap((f) => f.weapon_modifiers)
			);

			if (secondaryMastery >= 2) {
				push_character_modifiers(
					secondary_subclass.specialization_card.features.flatMap((f) => f.character_modifiers)
				);
				push_weapon_modifiers(
					secondary_subclass.specialization_card.features.flatMap((f) => f.weapon_modifiers)
				);
			}
			if (secondaryMastery >= 3) {
				push_character_modifiers(
					secondary_subclass.mastery_card.features.flatMap((f) => f.character_modifiers)
				);
				push_weapon_modifiers(
					secondary_subclass.mastery_card.features.flatMap((f) => f.weapon_modifiers)
				);
			}
		}

		// character_modifiers from chosen level up options
		for (let i = 2; i <= character.level; i++) {
			const chosen_options = level_up_chosen_options[i as keyof typeof level_up_chosen_options];
			if (!chosen_options) continue;
			push_character_modifiers(chosen_options.A?.character_modifiers);
			push_character_modifiers(chosen_options.B?.character_modifiers);
		}

		// modifiers from the vault where applies_in_vault=true or the card index is in the loadout
		const vault = domain_card_vault;
		const loadout_card_ids = character.loadout_domain_card_ids;
		vault.forEach((card, i) => {
			if (
				card.applies_in_vault ||
				loadout_card_ids.some(
					(id) => id.cardId === card.compendium_id && id.domainId === card.domain_id
				)
			) {
				card.features.forEach((f) => {
					push_character_modifiers(f.character_modifiers);
					push_weapon_modifiers(f.weapon_modifiers);
				});
			}
		});

		// modifiers from active armor & derived weapons
		if (derived_armor) {
			derived_armor.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		}
		if (derived_primary_weapon) {
			derived_primary_weapon.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		}
		if (derived_secondary_weapon) {
			derived_secondary_weapon.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		}
		if (derived_unarmed_attack) {
			derived_unarmed_attack.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		}

		// additional cards
		// // todo: remove and update the vault with these cards instead of here
		// additional_domain_cards.forEach((card) => {
		// 	card.features.forEach((f) => {
		// 		push_character_modifiers(f.character_modifiers);
		// 		push_weapon_modifiers(f.weapon_modifiers);
		// 	});
		// });
		additional_ancestry_cards.forEach((card) => {
			card.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		});
		additional_community_cards.forEach((card) => {
			card.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		});
		additional_transformation_cards.forEach((card) => {
			card.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		});

		// categorize by behavior
		base_character_modifiers = all_character_modifiers.filter((m) => m.behaviour === 'base');
		bonus_character_modifiers = all_character_modifiers.filter((m) => m.behaviour === 'bonus');
		override_character_modifiers = all_character_modifiers.filter(
			(m) => m.behaviour === 'override'
		);

		base_weapon_modifiers = all_weapon_modifiers.filter((m) => m.behaviour === 'base');
		bonus_weapon_modifiers = all_weapon_modifiers.filter((m) => m.behaviour === 'bonus');
		override_weapon_modifiers = all_weapon_modifiers.filter((m) => m.behaviour === 'override');

		console.warn('Updated modifier list...');
	});

	// ! derive armor and clear if invalid
	$effect(() => {
		if (!character) return;

		let new_armor: Armor & { id: string } = BASE_STATS.unarmored;

		if (active_armor !== null && active_armor.level_requirement > character.level) {
			console.warn(`Removing invalid armor ${active_armor.id}. level requirement not met`);
			character.active_armor_id = null;
		} else if (active_armor !== null) {
			new_armor = active_armor;
		}

		function equivalent_armor(
			a: (Armor & { id: string }) | null | undefined,
			b: (Armor & { id: string }) | null | undefined
		) {
			if ((a === null || a === undefined) && (b === null || b === undefined)) return true;
			if (a === null || a === undefined || b === null || b === undefined) return false;
			return a.id === b.id;
		}

		if (!equivalent_armor(derived_armor, new_armor)) {
			derived_armor = new_armor;
		}
	});

	// ! derive weapons and apply weapon modifiers
	$effect(() => {
		if (!character) return;
		// Create deep copies of weapons to avoid mutating the original inventory weapons
		let new_primary_weapon = active_primary_weapon
			? JSON.parse(JSON.stringify(active_primary_weapon))
			: null;
		let new_secondary_weapon = active_secondary_weapon
			? JSON.parse(JSON.stringify(active_secondary_weapon))
			: null;

		let new_unarmed_attack = BASE_STATS.unarmed_attack;

		// apply base weapon modifiers
		for (const modifier of base_weapon_modifiers) {
			// Check all conditions
			const conditions_met = modifier.character_conditions.every((condition) =>
				evaluate_character_condition(condition)
			);
			if (!conditions_met) continue;

			const for_primary =
				new_primary_weapon &&
				(modifier.target_weapon === 'all' || modifier.target_weapon === 'primary');
			const for_secondary =
				new_secondary_weapon &&
				(modifier.target_weapon === 'all' || modifier.target_weapon === 'secondary');
			const for_unarmed =
				new_unarmed_attack &&
				(modifier.target_weapon === 'all' || modifier.target_weapon === 'unarmed');

			if (modifier.target_stat === 'attack_roll') {
				if (for_primary) new_primary_weapon.attack_roll_bonus = modifier.value;
				if (for_secondary) new_secondary_weapon.attack_roll_bonus = modifier.value;
				if (for_unarmed) new_unarmed_attack.attack_roll_bonus = modifier.value;
			} else if (modifier.target_stat === 'damage_bonus') {
				if (for_primary) new_primary_weapon.damage_bonus = modifier.value;
				if (for_secondary) new_secondary_weapon.damage_bonus = modifier.value;
				if (for_unarmed) new_unarmed_attack.damage_bonus = modifier.value;
			} else if (modifier.target_stat === 'damage_dice') {
				if (for_primary) new_primary_weapon.damage_dice = modifier.dice;
				if (for_secondary) new_secondary_weapon.damage_dice = modifier.dice;
				if (for_unarmed) new_unarmed_attack.damage_dice = modifier.dice;
			} else if (modifier.target_stat === 'damage_type') {
				if (for_primary) new_primary_weapon.available_damage_types = [modifier.damage_type];
				if (for_secondary) new_secondary_weapon.available_damage_types = [modifier.damage_type];
				if (for_unarmed) new_unarmed_attack.available_damage_types = [modifier.damage_type];
			} else if (modifier.target_stat === 'range') {
				if (for_primary) new_primary_weapon.range = modifier.range;
				if (for_secondary) new_secondary_weapon.range = modifier.range;
				if (for_unarmed) new_unarmed_attack.range = modifier.range;
			} else if (modifier.target_stat === 'trait') {
				if (for_primary) new_primary_weapon.available_traits = [modifier.trait];
				if (for_secondary) new_secondary_weapon.available_traits = [modifier.trait];
				if (for_unarmed) new_unarmed_attack.available_traits = [modifier.trait];
			}
		}

		// apply bonus weapon modifiers
		for (const modifier of bonus_weapon_modifiers) {
			// Check all conditions
			const conditions_met = modifier.character_conditions.every((condition) =>
				evaluate_character_condition(condition)
			);
			if (!conditions_met) continue;

			// Additional check: if modifier targets primary weapon but comes from secondary weapon features,
			// ensure secondary weapon is actually equipped (not just in derived_secondary_weapon)
			// This handles race conditions where derived_secondary_weapon hasn't updated yet
			// BUT: only skip if primary weapon is NOT equipped (to avoid blocking modifiers from primary weapon itself)
			if (
				modifier.target_weapon === 'primary' &&
				new_primary_weapon === null &&
				new_secondary_weapon === null &&
				active_secondary_weapon === null
			) {
				// Modifier targets primary but neither primary nor secondary weapon is equipped - skip it
				continue;
			}

			const for_primary =
				new_primary_weapon &&
				(modifier.target_weapon === 'all' || modifier.target_weapon === 'primary');
			const for_secondary =
				new_secondary_weapon &&
				(modifier.target_weapon === 'all' || modifier.target_weapon === 'secondary');
			const for_unarmed =
				new_unarmed_attack &&
				(modifier.target_weapon === 'all' || modifier.target_weapon === 'unarmed');

			if (modifier.target_stat === 'attack_roll') {
				if (for_primary) new_primary_weapon.attack_roll_bonus += modifier.value;
				if (for_secondary) new_secondary_weapon.attack_roll_bonus += modifier.value;
				if (for_unarmed) new_unarmed_attack.attack_roll_bonus += modifier.value;
			} else if (modifier.target_stat === 'damage_bonus') {
				if (for_primary) new_primary_weapon.damage_bonus += modifier.value;
				if (for_secondary) new_secondary_weapon.damage_bonus += modifier.value;
				if (for_unarmed) new_unarmed_attack.damage_bonus += modifier.value;
			} else if (modifier.target_stat === 'damage_dice') {
				if (for_primary) new_primary_weapon.damage_dice += '+' + modifier.dice;
				if (for_secondary) new_secondary_weapon.damage_dice += '+' + modifier.dice;
				if (for_unarmed) new_unarmed_attack.damage_dice += '+' + modifier.dice;
			} else if (modifier.target_stat === 'damage_type') {
				if (
					for_primary &&
					!new_primary_weapon.available_damage_types.includes(modifier.damage_type)
				)
					new_primary_weapon.available_damage_types.push(modifier.damage_type);
				if (
					for_secondary &&
					!new_secondary_weapon.available_damage_types.includes(modifier.damage_type)
				)
					new_secondary_weapon.available_damage_types.push(modifier.damage_type);
				if (
					for_unarmed &&
					!new_unarmed_attack.available_damage_types.includes(modifier.damage_type)
				)
					new_unarmed_attack.available_damage_types.push(modifier.damage_type);
			} else if (modifier.target_stat === 'range') {
				if (for_primary) new_primary_weapon.range = modifier.range;
				if (for_secondary) new_secondary_weapon.range = modifier.range;
				if (for_unarmed) new_unarmed_attack.range = modifier.range;
			} else if (modifier.target_stat === 'trait') {
				if (for_primary && !new_primary_weapon.available_traits.includes(modifier.trait))
					new_primary_weapon.available_traits.push(modifier.trait);
				if (for_secondary && !new_secondary_weapon.available_traits.includes(modifier.trait))
					new_secondary_weapon.available_traits.push(modifier.trait);
				if (for_unarmed && !new_unarmed_attack.available_traits.includes(modifier.trait))
					new_unarmed_attack.available_traits.push(modifier.trait);
			}
		}

		// apply override weapon modifiers
		for (const modifier of override_weapon_modifiers) {
			// Check all conditions
			const conditions_met = modifier.character_conditions.every((condition) =>
				evaluate_character_condition(condition)
			);
			if (!conditions_met) continue;

			const for_primary =
				new_primary_weapon &&
				(modifier.target_weapon === 'all' || modifier.target_weapon === 'primary');
			const for_secondary =
				new_secondary_weapon &&
				(modifier.target_weapon === 'all' || modifier.target_weapon === 'secondary');
			const for_unarmed =
				new_unarmed_attack &&
				(modifier.target_weapon === 'all' || modifier.target_weapon === 'unarmed');

			if (modifier.target_stat === 'attack_roll') {
				if (for_primary) new_primary_weapon.attack_roll_bonus = modifier.value;
				if (for_secondary) new_secondary_weapon.attack_roll_bonus = modifier.value;
				if (for_unarmed) new_unarmed_attack.attack_roll_bonus = modifier.value;
			} else if (modifier.target_stat === 'damage_bonus') {
				if (for_primary) new_primary_weapon.damage_bonus = modifier.value;
				if (for_secondary) new_secondary_weapon.damage_bonus = modifier.value;
				if (for_unarmed) new_unarmed_attack.damage_bonus = modifier.value;
			} else if (modifier.target_stat === 'damage_dice') {
				if (for_primary) new_primary_weapon.damage_dice = modifier.dice;
				if (for_secondary) new_secondary_weapon.damage_dice = modifier.dice;
				if (for_unarmed) new_unarmed_attack.damage_dice = modifier.dice;
			} else if (modifier.target_stat === 'damage_type') {
				if (for_primary) new_primary_weapon.available_damage_types = [modifier.damage_type];
				if (for_secondary) new_secondary_weapon.available_damage_types = [modifier.damage_type];
				if (for_unarmed) new_unarmed_attack.available_damage_types = [modifier.damage_type];
			} else if (modifier.target_stat === 'range') {
				if (for_primary) new_primary_weapon.range = modifier.range;
				if (for_secondary) new_secondary_weapon.range = modifier.range;
				if (for_unarmed) new_unarmed_attack.range = modifier.range;
			} else if (modifier.target_stat === 'trait') {
				if (for_primary) new_primary_weapon.available_traits = [modifier.trait];
				if (for_secondary) new_secondary_weapon.available_traits = [modifier.trait];
				if (for_unarmed) new_unarmed_attack.available_traits = [modifier.trait];
			}
		}

		function equivalent_weapons(
			a: (Weapon & { id: string }) | null | undefined,
			b: (Weapon & { id: string }) | null | undefined
		) {
			if ((a === null || a === undefined) && (b === null || b === undefined)) return true;
			if (a === null || a === undefined || b === null || b === undefined) return false;
			// Use JSON.stringify to compare all properties - simpler and more reliable
			return JSON.stringify(a) === JSON.stringify(b);
		}

		if (!equivalent_weapons(derived_primary_weapon, new_primary_weapon)) {
			derived_primary_weapon = new_primary_weapon;
		}
		if (!equivalent_weapons(derived_secondary_weapon, new_secondary_weapon)) {
			derived_secondary_weapon = new_secondary_weapon;
		}
		if (!equivalent_weapons(derived_unarmed_attack, new_unarmed_attack)) {
			derived_unarmed_attack = new_unarmed_attack;
		}
	});

	// ! helper function to check if conditions are met
	function evaluate_character_condition(condition: CharacterCondition): boolean {
		if (!character) return false;
		if (condition.type === 'level') {
			return character.level >= condition.min_level && character.level <= condition.max_level;
		} else if (condition.type === 'armor_equipped') {
			const has_armor = character.active_armor_id !== null;
			return condition.value === has_armor;
		} else if (condition.type === 'primary_weapon_equipped') {
			return condition.weapon_id === character.active_primary_weapon_id;
		} else if (condition.type === 'secondary_weapon_equipped') {
			return condition.weapon_id === character.active_secondary_weapon_id;
		} else if (condition.type === 'domain_card_choice') {
			if (
				!character.domain_card_choices[condition.domain_card_id] ||
				!character.domain_card_choices[condition.domain_card_id][condition.choice_id]
			) {
				return false;
			} else {
				return character.domain_card_choices[condition.domain_card_id][
					condition.choice_id
				].includes(condition.selection_id);
			}
		} else if (condition.type === 'ancestry_card_choice') {
			if (!character.ancestry_card_choices[condition.choice_id]) {
				return false;
			} else {
				return character.ancestry_card_choices[condition.choice_id].includes(
					condition.selection_id
				);
			}
		} else if (condition.type === 'loot_choice') {
			if (
				!character.inventory.loot[condition.loot_id] ||
				!character.inventory.loot[condition.loot_id].choices[condition.choice_id]
			) {
				return false;
			} else {
				return character.inventory.loot[condition.loot_id].choices[condition.choice_id].includes(
					condition.selection_id
				);
			}
		} else if (condition.type === 'min_loadout_cards_from_domain') {
			let count = 0;
			for (const card of domain_card_loadout) {
				if (card.domain_id === condition.domain_id) {
					count++;
				}
			}
			return count >= condition.min_cards;
		}
		return true; // unknown condition types default to true
	}

	// ! helper function to apply modifiers
	function apply_modifiers(
		modifiers: CharacterModifier[],
		target: CharacterModifier['target'],
		currentValue: number,
		behavior: 'base' | 'bonus' | 'override'
	): number {
		if (!character) return currentValue;

		let value = currentValue;

		for (const modifier of modifiers) {
			if (
				modifier.target !== target ||
				('behavior' in modifier && modifier.behaviour !== behavior)
			) {
				continue;
			}

			// Check all conditions - all must pass (AND logic)
			const conditions_met = modifier.character_conditions.every((condition) =>
				evaluate_character_condition(condition)
			);
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
			} else if (modifier.type === 'derived_from_proficiency' && target !== 'proficiency') {
				const calculated = Math.ceil(proficiency * modifier.multiplier);
				if (behavior === 'base' || behavior === 'override') {
					value = calculated;
				} else if (behavior === 'bonus') {
					value = value + calculated;
				}
			} else if (modifier.type === 'derived_from_level') {
				const calculated = Math.ceil(character.level * modifier.multiplier);
				if (behavior === 'base' || behavior === 'override') {
					value = calculated;
				} else if (behavior === 'bonus') {
					value = value + calculated;
				}
			}
		}

		return value;
	}

	// * derived traits
	$effect(() => {
		if (!character) return;
		const base_traits = { ...character.selected_traits };

		// apply base effects targeting traits (set base values)
		for (const modifier of base_character_modifiers) {
			// Check all conditions
			const conditions_met = modifier.character_conditions.every((condition) =>
				evaluate_character_condition(condition)
			);
			if (!conditions_met) continue;

			if (modifier.target === 'trait') {
				const targetTrait = modifier.trait;
				if (modifier.type === 'flat') {
					base_traits[targetTrait] = modifier.value;
				} else if (modifier.type === 'derived_from_proficiency') {
					base_traits[targetTrait] = Math.ceil(proficiency * modifier.multiplier);
				} else if (modifier.type === 'derived_from_level') {
					base_traits[targetTrait] = Math.ceil(character.level * modifier.multiplier);
				}
			}
		}

		// start from base + marked trait bonuses
		let new_traits = {
			agility:
				(base_traits.agility === null ? 0 : base_traits.agility) +
				(tier_2_marked_traits.agility ? 1 : 0) +
				(tier_3_marked_traits.agility ? 1 : 0) +
				(tier_4_marked_traits.agility ? 1 : 0),
			strength:
				(base_traits.strength === null ? 0 : base_traits.strength) +
				(tier_2_marked_traits.strength ? 1 : 0) +
				(tier_3_marked_traits.strength ? 1 : 0) +
				(tier_4_marked_traits.strength ? 1 : 0),
			finesse:
				(base_traits.finesse === null ? 0 : base_traits.finesse) +
				(tier_2_marked_traits.finesse ? 1 : 0) +
				(tier_3_marked_traits.finesse ? 1 : 0) +
				(tier_4_marked_traits.finesse ? 1 : 0),
			instinct:
				(base_traits.instinct === null ? 0 : base_traits.instinct) +
				(tier_2_marked_traits.instinct ? 1 : 0) +
				(tier_3_marked_traits.instinct ? 1 : 0) +
				(tier_4_marked_traits.instinct ? 1 : 0),
			presence:
				(base_traits.presence === null ? 0 : base_traits.presence) +
				(tier_2_marked_traits.presence ? 1 : 0) +
				(tier_3_marked_traits.presence ? 1 : 0) +
				(tier_4_marked_traits.presence ? 1 : 0),
			knowledge:
				(base_traits.knowledge === null ? 0 : base_traits.knowledge) +
				(tier_2_marked_traits.knowledge ? 1 : 0) +
				(tier_3_marked_traits.knowledge ? 1 : 0) +
				(tier_4_marked_traits.knowledge ? 1 : 0)
		};

		// apply bonus effects targeting traits (additive or derived)
		for (const modifier of bonus_character_modifiers) {
			// Check all conditions
			const conditions_met = modifier.character_conditions.every((condition) =>
				evaluate_character_condition(condition)
			);
			if (!conditions_met) continue;

			if (modifier.target === 'trait') {
				const targetTrait = modifier.trait;
				if (modifier.type === 'flat') {
					new_traits[targetTrait] = new_traits[targetTrait] + modifier.value;
				} else if (modifier.type === 'derived_from_proficiency') {
					new_traits[targetTrait] += Math.ceil(proficiency * modifier.multiplier);
				} else if (modifier.type === 'derived_from_level') {
					new_traits[targetTrait] += Math.ceil(character.level * modifier.multiplier);
				}
			}
		}

		// apply override effects targeting traits (set final values)
		for (const modifier of override_character_modifiers) {
			// Check all conditions
			const conditions_met = modifier.character_conditions.every((condition) =>
				evaluate_character_condition(condition)
			);
			if (!conditions_met) continue;

			if (modifier.target === 'trait') {
				const targetTrait = modifier.trait;
				if (modifier.type === 'flat') {
					new_traits[targetTrait] = modifier.value;
				} else if (modifier.type === 'derived_from_proficiency') {
					new_traits[targetTrait] = Math.ceil(proficiency * modifier.multiplier);
				} else if (modifier.type === 'derived_from_level') {
					new_traits[targetTrait] = Math.ceil(character.level * modifier.multiplier);
				}
			}
		}

		traits = new_traits;
	});

	// * derived experience_modifiers
	$effect(() => {
		if (!character) return;
		const count = character.experiences.length;
		const base = BASE_STATS.experience_modifier;
		const new_experience_modifiers: number[] = Array(count).fill(base);

		// apply base modifiers
		for (const modifier of base_character_modifiers) {
			// Check all conditions
			const conditions_met = modifier.character_conditions.every((condition) =>
				evaluate_character_condition(condition)
			);
			if (!conditions_met) continue;

			if (
				modifier.target === 'experience_from_domain_card_choice_selection' ||
				modifier.target === 'experience_from_ancestry_card_choice_selection'
			) {
				let experience_indices: number[] = [];
				if (modifier.target === 'experience_from_domain_card_choice_selection') {
					experience_indices = character.domain_card_choices[modifier.domain_card_id][
						modifier.choice_id
					].map((str) => parseInt(str));
				} else if (modifier.target === 'experience_from_ancestry_card_choice_selection') {
					experience_indices = character.ancestry_card_choices[modifier.choice_id].map((str) =>
						parseInt(str)
					);
				}
				// console.log(experience_indices);

				if (!experience_indices || experience_indices.length === 0) continue;

				for (const i of experience_indices) {
					if (i === null || i < 0 || i > count) continue;
					if (modifier.type === 'flat') {
						new_experience_modifiers[i] = modifier.value;
					} else if (modifier.type === 'derived_from_trait') {
						new_experience_modifiers[i] = Math.ceil(
							Number(traits[modifier.trait]) * modifier.multiplier
						);
					} else if (modifier.type === 'derived_from_proficiency') {
						new_experience_modifiers[i] = Math.ceil(proficiency * modifier.multiplier);
					} else if (modifier.type === 'derived_from_level') {
						new_experience_modifiers[i] = Math.ceil(character.level * modifier.multiplier);
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
				if (
					![
						'tier_2_experience_bonus',
						'tier_3_experience_bonus',
						'tier_4_experience_bonus'
					].includes(choice.option_id)
				)
					continue;

				const index_a = choice.selected_experiences[0];
				const index_b = choice.selected_experiences[1];

				if (index_a !== null && index_a >= 0 && index_a < count)
					new_experience_modifiers[index_a] = new_experience_modifiers[index_a] + 1;
				if (index_b !== null && index_b >= 0 && index_b < count)
					new_experience_modifiers[index_b] = new_experience_modifiers[index_b] + 1;
			}
		}

		// apply bonus modifiers
		for (const modifier of bonus_character_modifiers) {
			// Check all conditions
			const conditions_met = modifier.character_conditions.every((condition) =>
				evaluate_character_condition(condition)
			);
			if (!conditions_met) continue;

			if (
				modifier.target === 'experience_from_domain_card_choice_selection' ||
				modifier.target === 'experience_from_ancestry_card_choice_selection'
			) {
				let experience_indices: number[] = [];
				if (modifier.target === 'experience_from_domain_card_choice_selection') {
					experience_indices = character.domain_card_choices[modifier.domain_card_id][
						modifier.choice_id
					].map((str) => parseInt(str));
				} else if (modifier.target === 'experience_from_ancestry_card_choice_selection') {
					experience_indices = character.ancestry_card_choices[modifier.choice_id].map((str) =>
						parseInt(str)
					);
				}

				if (!experience_indices || experience_indices.length === 0) continue;

				for (const i of experience_indices) {
					if (i === null || i < 0 || i > count) continue;
					if (modifier.type === 'flat') {
						new_experience_modifiers[i] += modifier.value;
					} else if (modifier.type === 'derived_from_trait') {
						new_experience_modifiers[i] += Math.ceil(
							Number(traits[modifier.trait]) * modifier.multiplier
						);
					} else if (modifier.type === 'derived_from_proficiency') {
						new_experience_modifiers[i] += Math.ceil(proficiency * modifier.multiplier);
					} else if (modifier.type === 'derived_from_level') {
						new_experience_modifiers[i] += Math.ceil(character.level * modifier.multiplier);
					}
				}
			}
		}

		// apply override modifiers
		for (const modifier of override_character_modifiers) {
			// Check all conditions
			const conditions_met = modifier.character_conditions.every((condition) =>
				evaluate_character_condition(condition)
			);
			if (!conditions_met) continue;

			if (
				modifier.target === 'experience_from_domain_card_choice_selection' ||
				modifier.target === 'experience_from_ancestry_card_choice_selection'
			) {
				let experience_indices: number[] = [];
				if (modifier.target === 'experience_from_domain_card_choice_selection') {
					experience_indices = character.domain_card_choices[modifier.domain_card_id][
						modifier.choice_id
					].map((str) => parseInt(str));
				} else if (modifier.target === 'experience_from_ancestry_card_choice_selection') {
					experience_indices = character.ancestry_card_choices[modifier.choice_id].map((str) =>
						parseInt(str)
					);
				}

				if (!experience_indices || experience_indices.length === 0) continue;

				for (const i of experience_indices) {
					if (i === null || i < 0 || i > count) continue;
					if (modifier.type === 'flat') {
						new_experience_modifiers[i] = modifier.value;
					} else if (modifier.type === 'derived_from_trait') {
						new_experience_modifiers[i] = Math.ceil(
							Number(traits[modifier.trait]) * modifier.multiplier
						);
					} else if (modifier.type === 'derived_from_proficiency') {
						new_experience_modifiers[i] = Math.ceil(proficiency * modifier.multiplier);
					} else if (modifier.type === 'derived_from_level') {
						new_experience_modifiers[i] = Math.ceil(character.level * modifier.multiplier);
					}
				}
			}
		}

		experience_modifiers = new_experience_modifiers;
	});

	// * derived proficiency
	$effect(() => {
		if (!character) return;
		let new_proficiency: number = BASE_STATS.proficiency;

		new_proficiency = apply_modifiers(
			base_character_modifiers,
			'proficiency',
			new_proficiency,
			'base'
		);

		// tier-based increases
		if (character.level >= 2) new_proficiency++;
		if (character.level >= 5) new_proficiency++;
		if (character.level >= 8) new_proficiency++;

		new_proficiency = apply_modifiers(
			bonus_character_modifiers,
			'proficiency',
			new_proficiency,
			'bonus'
		);
		new_proficiency = apply_modifiers(
			override_character_modifiers,
			'proficiency',
			new_proficiency,
			'override'
		);

		proficiency = new_proficiency;
	});

	// * derived evasion
	$effect(() => {
		if (!character) return;
		let new_evasion: number = BASE_STATS.evasion;

		// initialize with primary class's starting max hp
		if (primary_class) {
			new_evasion = primary_class.starting_evasion;
		}

		new_evasion = apply_modifiers(base_character_modifiers, 'evasion', new_evasion, 'base');
		new_evasion = apply_modifiers(bonus_character_modifiers, 'evasion', new_evasion, 'bonus');
		new_evasion = apply_modifiers(override_character_modifiers, 'evasion', new_evasion, 'override');

		evasion = new_evasion;
	});

	// * derived max_hp
	$effect(() => {
		if (!character) return;
		let new_max_hp: number = BASE_STATS.max_hp;

		// initialize with primary class's starting max hp
		if (primary_class) {
			new_max_hp = primary_class.starting_max_hp;
		}

		new_max_hp = apply_modifiers(base_character_modifiers, 'max_hp', new_max_hp, 'base');
		new_max_hp = apply_modifiers(bonus_character_modifiers, 'max_hp', new_max_hp, 'bonus');
		new_max_hp = apply_modifiers(override_character_modifiers, 'max_hp', new_max_hp, 'override');

		max_hp = new_max_hp;
	});

	// * derived max_short_rest_actions
	$effect(() => {
		if (!character) return;
		let new_max_short_rest_actions: number = BASE_STATS.max_short_rest_actions;

		new_max_short_rest_actions = apply_modifiers(
			base_character_modifiers,
			'max_short_rest_actions',
			new_max_short_rest_actions,
			'base'
		);
		new_max_short_rest_actions = apply_modifiers(
			bonus_character_modifiers,
			'max_short_rest_actions',
			new_max_short_rest_actions,
			'bonus'
		);
		new_max_short_rest_actions = apply_modifiers(
			override_character_modifiers,
			'max_short_rest_actions',
			new_max_short_rest_actions,
			'override'
		);

		max_short_rest_actions = new_max_short_rest_actions;
	});

	// * derived max_long_rest_actions
	$effect(() => {
		if (!character) return;
		let new_max_long_rest_actions: number = BASE_STATS.max_long_rest_actions;

		new_max_long_rest_actions = apply_modifiers(
			base_character_modifiers,
			'max_long_rest_actions',
			new_max_long_rest_actions,
			'base'
		);
		new_max_long_rest_actions = apply_modifiers(
			bonus_character_modifiers,
			'max_long_rest_actions',
			new_max_long_rest_actions,
			'bonus'
		);
		new_max_long_rest_actions = apply_modifiers(
			override_character_modifiers,
			'max_long_rest_actions',
			new_max_long_rest_actions,
			'override'
		);

		max_long_rest_actions = new_max_long_rest_actions;
	});

	// * derive spellcast roll bonus
	$effect(() => {
		if (!character) return;
		let new_spellcast_roll_bonus: number = BASE_STATS.spellcast_roll_bonus;

		new_spellcast_roll_bonus = apply_modifiers(
			base_character_modifiers,
			'spellcast_roll_bonus',
			new_spellcast_roll_bonus,
			'base'
		);
		new_spellcast_roll_bonus = apply_modifiers(
			bonus_character_modifiers,
			'spellcast_roll_bonus',
			new_spellcast_roll_bonus,
			'bonus'
		);
		new_spellcast_roll_bonus = apply_modifiers(
			override_character_modifiers,
			'spellcast_roll_bonus',
			new_spellcast_roll_bonus,
			'override'
		);

		spellcast_roll_bonus = new_spellcast_roll_bonus;
	});

	// * derived max_stress
	$effect(() => {
		if (!character) return;
		let new_max_stress: number = BASE_STATS.max_stress;

		new_max_stress = apply_modifiers(
			base_character_modifiers,
			'max_stress',
			new_max_stress,
			'base'
		);
		new_max_stress = apply_modifiers(
			bonus_character_modifiers,
			'max_stress',
			new_max_stress,
			'bonus'
		);
		new_max_stress = apply_modifiers(
			override_character_modifiers,
			'max_stress',
			new_max_stress,
			'override'
		);

		max_stress = new_max_stress;
	});

	// * derived primary_class_mastery_level and secondary_class_mastery_level
	$effect(() => {
		if (!character) return;
		let masteryNum: number = BASE_STATS.primary_class_mastery_level;

		// having a primary class guarantees at least foundation (1)
		if (character.primary_class_id) masteryNum = Math.max(masteryNum, 1);

		masteryNum = apply_modifiers(
			base_character_modifiers,
			'primary_class_mastery_level',
			masteryNum,
			'base'
		);

		for (let i = 2; i <= character.level; i++) {
			const level_choices =
				character.level_up_choices[i as keyof typeof character.level_up_choices];
			const choice_A = level_choices.A;
			const choice_B = level_choices.B;

			if (
				(choice_A.option_id === 'tier_3_subclass_upgrade' ||
					choice_A.option_id === 'tier_4_subclass_upgrade') &&
				choice_A.selected_subclass_upgrade === 'primary'
			) {
				masteryNum++;
			}

			if (
				(choice_B.option_id === 'tier_3_subclass_upgrade' ||
					choice_B.option_id === 'tier_4_subclass_upgrade') &&
				choice_B.selected_subclass_upgrade === 'primary'
			) {
				masteryNum++;
			}
		}

		masteryNum = apply_modifiers(
			bonus_character_modifiers,
			'primary_class_mastery_level',
			masteryNum,
			'bonus'
		);
		masteryNum = apply_modifiers(
			override_character_modifiers,
			'primary_class_mastery_level',
			masteryNum,
			'override'
		);

		// clamp 0..3 and assign with proper literal type
		const masteryClamped = Math.max(0, Math.min(3, Math.trunc(masteryNum))) as 0 | 1 | 2 | 3;
		primary_class_mastery_level = masteryClamped;
	});

	// * derived secondary_class_mastery_level
	$effect(() => {
		if (!character) return;
		let masteryNum: number = BASE_STATS.secondary_class_mastery_level;

		// having a secondary class guarantees at least foundation (1)
		if (character.secondary_class_id) masteryNum = Math.max(masteryNum, 1);

		masteryNum = apply_modifiers(
			base_character_modifiers,
			'secondary_class_mastery_level',
			masteryNum,
			'base'
		);

		for (let i = 2; i <= character.level; i++) {
			const level_choices =
				character.level_up_choices[i as keyof typeof character.level_up_choices];
			const choice_A = level_choices.A;
			const choice_B = level_choices.B;

			if (
				(choice_A.option_id === 'tier_3_subclass_upgrade' ||
					choice_A.option_id === 'tier_4_subclass_upgrade') &&
				choice_A.selected_subclass_upgrade === 'secondary'
			) {
				masteryNum++;
			}
			if (
				(choice_B.option_id === 'tier_3_subclass_upgrade' ||
					choice_B.option_id === 'tier_4_subclass_upgrade') &&
				choice_B.selected_subclass_upgrade === 'secondary'
			) {
				masteryNum++;
			}
		}

		masteryNum = apply_modifiers(
			bonus_character_modifiers,
			'secondary_class_mastery_level',
			masteryNum,
			'bonus'
		);
		masteryNum = apply_modifiers(
			override_character_modifiers,
			'secondary_class_mastery_level',
			masteryNum,
			'override'
		);

		// clamp 0..3 and assign with proper literal type
		const masteryClamped = Math.max(0, Math.min(2, Math.trunc(masteryNum))) as 0 | 1 | 2 | 3;
		secondary_class_mastery_level = masteryClamped;
	});

	// * derived max_hope
	$effect(() => {
		if (!character) return;
		let new_max_hope: number = BASE_STATS.max_hope;

		new_max_hope = apply_modifiers(base_character_modifiers, 'max_hope', new_max_hope, 'base');
		new_max_hope = apply_modifiers(bonus_character_modifiers, 'max_hope', new_max_hope, 'bonus');
		new_max_hope = apply_modifiers(
			override_character_modifiers,
			'max_hope',
			new_max_hope,
			'override'
		);

		max_hope = new_max_hope;
	});

	// * derived max_armor
	$effect(() => {
		if (!character) return;
		let new_max_armor: number = BASE_STATS.max_armor;

		if (derived_armor !== null) {
			new_max_armor = derived_armor.max_armor;
		}

		new_max_armor = apply_modifiers(base_character_modifiers, 'max_armor', new_max_armor, 'base');
		new_max_armor = apply_modifiers(bonus_character_modifiers, 'max_armor', new_max_armor, 'bonus');
		new_max_armor = apply_modifiers(
			override_character_modifiers,
			'max_armor',
			new_max_armor,
			'override'
		);

		max_armor = Math.min(new_max_armor, 12);
	});

	// * derived max_burden
	$effect(() => {
		if (!character) return;
		let new_max_burden: number = BASE_STATS.max_burden;

		new_max_burden = apply_modifiers(
			base_character_modifiers,
			'max_burden',
			new_max_burden,
			'base'
		);
		new_max_burden = apply_modifiers(
			bonus_character_modifiers,
			'max_burden',
			new_max_burden,
			'bonus'
		);
		new_max_burden = apply_modifiers(
			override_character_modifiers,
			'max_burden',
			new_max_burden,
			'override'
		);

		max_burden = new_max_burden;
	});

	// * derived damage_thresholds
	$effect(() => {
		if (!character) return;
		// default unarmored thresholds
		let thresholds: { major: number; severe: number } = {
			major: character.level,
			severe: character.level * 2
		};

		// override with currently equiped armor
		if (derived_armor !== null && derived_armor.compendium_id !== 'unarmored') {
			thresholds.major = derived_armor.damage_thresholds.major;
			thresholds.severe = derived_armor.damage_thresholds.severe;
		}

		thresholds.major = apply_modifiers(
			base_character_modifiers,
			'major_damage_threshold',
			thresholds.major,
			'base'
		);
		thresholds.severe = apply_modifiers(
			base_character_modifiers,
			'severe_damage_threshold',
			thresholds.severe,
			'base'
		);

		// level-based bump
		if (thresholds.major !== character.level && thresholds.severe !== character.level * 2) {
			thresholds.major += character.level;
			thresholds.severe += character.level;
		}

		thresholds.major = apply_modifiers(
			bonus_character_modifiers,
			'major_damage_threshold',
			thresholds.major,
			'bonus'
		);
		thresholds.severe = apply_modifiers(
			bonus_character_modifiers,
			'severe_damage_threshold',
			thresholds.severe,
			'bonus'
		);

		thresholds.major = apply_modifiers(
			override_character_modifiers,
			'major_damage_threshold',
			thresholds.major,
			'override'
		);
		thresholds.severe = apply_modifiers(
			override_character_modifiers,
			'severe_damage_threshold',
			thresholds.severe,
			'override'
		);

		damage_thresholds = thresholds;
	});

	// * derived max_experiences
	$effect(() => {
		if (!character) return;
		let new_max_experiences: number = BASE_STATS.max_experiences;

		new_max_experiences = apply_modifiers(
			base_character_modifiers,
			'max_experiences',
			new_max_experiences,
			'base'
		);

		// tier-based increases
		if (character.level >= 2) new_max_experiences++;
		if (character.level >= 5) new_max_experiences++;
		if (character.level >= 8) new_max_experiences++;

		new_max_experiences = apply_modifiers(
			bonus_character_modifiers,
			'max_experiences',
			new_max_experiences,
			'bonus'
		);
		new_max_experiences = apply_modifiers(
			override_character_modifiers,
			'max_experiences',
			new_max_experiences,
			'override'
		);

		// ! keep experiences array length in sync with max_experiences
		if (character.experiences.length < new_max_experiences) {
			console.warn('Experience list is too short. Adding a new one.');
			character.experiences.push('');
		} else if (character.experiences.length > new_max_experiences) {
			console.warn('Experience list is too long. Removing the last one.');
			character.experiences.pop();
		}

		max_experiences = new_max_experiences;
	});

	// * derived max_loadout
	$effect(() => {
		if (!character) return;
		let new_max_loadout: number = BASE_STATS.max_loadout;

		new_max_loadout = apply_modifiers(
			base_character_modifiers,
			'max_loadout',
			new_max_loadout,
			'base'
		);

		// apply customizations
		new_max_loadout += character.bonus_max_loadout;

		new_max_loadout = apply_modifiers(
			bonus_character_modifiers,
			'max_loadout',
			new_max_loadout,
			'bonus'
		);
		new_max_loadout = apply_modifiers(
			override_character_modifiers,
			'max_loadout',
			new_max_loadout,
			'override'
		);

		max_loadout = new_max_loadout;
	});

	// ! helper function to get tier from level
	const level_to_tier = (level: number): 1 | 2 | 3 | 4 => {
		if (level === 1) return 1;
		if (level >= 2 && level <= 4) return 2;
		if (level >= 5 && level <= 7) return 3;
		return 4;
	};

	// ! helper function to get the first level of a tier
	const tier_to_min_level = (tier: number): number => {
		if (tier === 1) return 1;
		if (tier === 2) return 2;
		if (tier === 3) return 5;
		return 8; // tier 4
	};

	// ! Auto-save character changes to database
	let initialLoadComplete = $state(false);
	let lastSavedCharacter = $state<string | null>(null);
	let inFlightSave: Promise<void> | null = null;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// Track when character is first loaded from the authoritative source
	$effect(() => {
		if (character && !initialLoadComplete) {
			// Character has been loaded from app.characters, mark initial load as complete
			initialLoadComplete = true;
			// Set initial saved state to match what was loaded
			lastSavedCharacter = JSON.stringify(character);
		}
	});

	// Debounced auto-save effect
	$effect(() => {
		if (!character || !initialLoadComplete) return;

		const currentCharacterJson = JSON.stringify(character);
		// Only save if the character actually changed from the last saved state
		if (currentCharacterJson === lastSavedCharacter) return;

		// Clear any existing debounce timer
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}

		// Debounce: wait 300ms before triggering save
		debounceTimer = setTimeout(() => {
			debounceTimer = null;
			if (!character) return; // Guard against null character

			// Don't start a new save if one is already in flight
			if (inFlightSave) {
				return;
			}

			// Use JSON serialization for deep clone to avoid structuredClone issues
			const cloned = JSON.parse(JSON.stringify(character));
			const savePromise = update_character(cloned)
				.then(() => {
					if (!character) return; // Guard against null character
					// Only update lastSavedCharacter after successful save
					lastSavedCharacter = JSON.stringify(character);
				})
				.catch((error) => {
					if (!character) return; // Guard against null character
					console.error('Failed to auto-save character:', error);
					// Leave lastSavedCharacter unchanged so the next debounced change will retry
				})
				.finally(() => {
					// Clear the in-flight save promise when done
					if (inFlightSave === savePromise) {
						inFlightSave = null;
					}
				});

			inFlightSave = savePromise;
		}, 300);

		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
				debounceTimer = null;
			}
		};
	});

	// ================================================
	// INVENTORY HELPER FUNCTIONS
	// ================================================

	/**
	 * Add an item to the character's inventory
	 * @param item - The item to add, where item.id is the compendium_id
	 */
	function addToInventory(
		item: { compendium_id: string; title?: string },
		type:
			| 'primary_weapon'
			| 'secondary_weapon'
			| 'armor'
			| 'consumable'
			| 'loot'
			| 'adventuring_gear'
	) {
		if (!character) return;

		const compendium_id = item.compendium_id;
		toast.success(`${item.title} added to inventory.`);

		if (type === 'primary_weapon') {
			// Generate unique id for this inventory item
			const uniqueId = crypto.randomUUID();
			character.inventory.primary_weapons[uniqueId] = {
				id: uniqueId,
				compendium_id,
				choices: {},
				custom_title: null,
				custom_level_requirement: null,
				custom_range: null,
				custom_available_damage_types: null,
				custom_burden: null,
				custom_damage_bonus: null,
				custom_damage_dice: null,
				custom_attack_roll_bonus: null
			};
		} else if (type === 'secondary_weapon') {
			const uniqueId = crypto.randomUUID();
			character.inventory.secondary_weapons[uniqueId] = {
				id: uniqueId,
				compendium_id,
				choices: {},
				custom_title: null,
				custom_level_requirement: null,
				custom_range: null,
				custom_available_damage_types: null,
				custom_burden: null,
				custom_damage_bonus: null,
				custom_damage_dice: null,
				custom_attack_roll_bonus: null
			};
		} else if (type === 'armor') {
			const uniqueId = crypto.randomUUID();
			character.inventory.armor[uniqueId] = {
				id: uniqueId,
				compendium_id,
				choices: {},
				custom_title: null,
				custom_level_requirement: null,
				custom_max_armor: null,
				custom_damage_thresholds: {
					major: null,
					severe: null
				}
			};
		} else if (type === 'consumable') {
			const uniqueId = crypto.randomUUID();
			character.inventory.consumables[uniqueId] = {
				id: uniqueId,
				compendium_id,
				choices: {},
				custom_title: null,
				custom_description: null
			};
		} else if (type === 'loot') {
			const uniqueId = crypto.randomUUID();
			character.inventory.loot[uniqueId] = {
				id: uniqueId,
				compendium_id,
				choices: {},
				custom_title: null,
				custom_description: null
			};
		} else if (type === 'adventuring_gear') {
			const title = item.title || item.compendium_id;
			character.inventory.adventuring_gear.push({ title });
		}
	}

	/**
	 * Remove an item from the character's inventory
	 * @param item - The item to remove, where item.id is the unique inventory item id (or title for adventuring_gear)
	 */
	function removeFromInventory(
		item: { id: string },
		type:
			| 'primary_weapon'
			| 'secondary_weapon'
			| 'armor'
			| 'consumable'
			| 'loot'
			| 'adventuring_gear'
	) {
		if (!character) return;

		if (type === 'primary_weapon') {
			// Unequip if currently equipped
			if (character.active_primary_weapon_id === item.id) {
				character.active_primary_weapon_id = null;
			}
			if (item.id in character.inventory.primary_weapons) {
				delete character.inventory.primary_weapons[item.id];
			}
		} else if (type === 'secondary_weapon') {
			// Unequip if currently equipped
			if (character.active_secondary_weapon_id === item.id) {
				character.active_secondary_weapon_id = null;
			}
			if (item.id in character.inventory.secondary_weapons) {
				delete character.inventory.secondary_weapons[item.id];
			}
		} else if (type === 'armor') {
			// Unequip if currently equipped
			if (character.active_armor_id === item.id) {
				character.active_armor_id = null;
			}
			if (item.id in character.inventory.armor) {
				delete character.inventory.armor[item.id];
			}
		} else if (type === 'consumable') {
			if (item.id in character.inventory.consumables) {
				delete character.inventory.consumables[item.id];
			}
		} else if (type === 'loot') {
			if (item.id in character.inventory.loot) {
				delete character.inventory.loot[item.id];
			}
		} else if (type === 'adventuring_gear') {
			const index = character.inventory.adventuring_gear.findIndex(
				(gear) => gear.title === item.id
			);
			if (index !== -1) {
				character.inventory.adventuring_gear.splice(index, 1);
			}
		}
	}

	/**
	 * Equip an armor or weapon
	 */
	function equipItem(
		item: { id: string; level_requirement: number },
		type: 'primary_weapon' | 'secondary_weapon' | 'armor'
	) {
		if (!character) return;
		if (character.level < item.level_requirement) {
			toast.error(`You must be level ${item.level_requirement} to equip this item.`);
			return; // Level requirement not met
		}

		if (type === 'primary_weapon') {
			character.active_primary_weapon_id = item.id;
		} else if (type === 'secondary_weapon') {
			character.active_secondary_weapon_id = item.id;
		} else if (type === 'armor') {
			character.active_armor_id = item.id;
		}
	}

	/**
	 * Unequip an armor or weapon
	 */
	function unequipItem(
		item: { id: string },
		type: 'primary_weapon' | 'secondary_weapon' | 'armor'
	) {
		if (!character) return;

		if (type === 'primary_weapon' && character.active_primary_weapon_id === item.id) {
			character.active_primary_weapon_id = null;
		} else if (type === 'secondary_weapon' && character.active_secondary_weapon_id === item.id) {
			character.active_secondary_weapon_id = null;
		} else if (type === 'armor' && character.active_armor_id === item.id) {
			character.active_armor_id = null;
		}
	}

	/**
	 * Check if an armor or weapon is equipped
	 */
	function isItemEquipped(
		item: { id: string },
		type: 'primary_weapon' | 'secondary_weapon' | 'armor'
	): boolean {
		if (!character) return false;

		if (type === 'primary_weapon') {
			return character.active_primary_weapon_id === item.id;
		} else if (type === 'secondary_weapon') {
			return character.active_secondary_weapon_id === item.id;
		} else if (type === 'armor') {
			return character.active_armor_id === item.id;
		}
		return false;
	}

	/**
	 * Check if the character meets the level requirement to equip an item
	 */
	function canEquipItem(item: { level_requirement: number }): boolean {
		if (!character) return false;
		return character.level >= item.level_requirement;
	}

	/**
	 * Add a condition to the character's active conditions
	 */
	function addCondition(conditionId: ConditionIds) {
		if (!character) return;
		const validConditionIds = Object.keys(CONDITIONS) as ConditionIds[];
		if (!validConditionIds.includes(conditionId)) {
			console.warn(`Invalid condition ID: ${conditionId}`);
			return;
		}
		if (!character.active_conditions.includes(conditionId)) {
			character.active_conditions.push(conditionId);
		}
	}

	/**
	 * Remove a condition from the character's active conditions
	 */
	function removeCondition(conditionId: ConditionIds) {
		if (!character) return;
		const index = character.active_conditions.indexOf(conditionId);
		if (index !== -1) {
			character.active_conditions.splice(index, 1);
		}
	}

	const destroy = () => {};

	return {
		// read only
		get tier_2_marked_traits() {
			return tier_2_marked_traits;
		},
		get tier_3_marked_traits() {
			return tier_3_marked_traits;
		},
		get tier_4_marked_traits() {
			return tier_4_marked_traits;
		},
		get options_used() {
			return options_used;
		},

		// referenced objects
		get ancestry_card() {
			return ancestry_card;
		},
		get community_card() {
			return community_card;
		},
		get transformation_card() {
			return transformation_card;
		},
		get primary_class() {
			return primary_class;
		},
		get primary_subclass() {
			return primary_subclass;
		},
		get secondary_class() {
			return secondary_class;
		},
		get secondary_subclass() {
			return secondary_subclass;
		},
		get level_up_domain_cards() {
			return level_up_domain_cards;
		},
		get level_up_chosen_options() {
			return level_up_chosen_options;
		},
		get additional_domain_cards() {
			return additional_domain_cards;
		},
		get additional_ancestry_cards() {
			return additional_ancestry_cards;
		},
		get additional_community_cards() {
			return additional_community_cards;
		},
		get additional_transformation_cards() {
			return additional_transformation_cards;
		},

		// derived equipment
		get derived_armor() {
			return derived_armor;
		},
		get derived_primary_weapon() {
			return derived_primary_weapon;
		},
		get derived_secondary_weapon() {
			return derived_secondary_weapon;
		},
		get derived_unarmed_attack() {
			return derived_unarmed_attack;
		},
		get inventory_primary_weapons() {
			return inventory_primary_weapons;
		},
		get inventory_secondary_weapons() {
			return inventory_secondary_weapons;
		},
		get inventory_armor() {
			return inventory_armor;
		},
		get inventory_loot() {
			return inventory_loot;
		},
		get inventory_consumables() {
			return inventory_consumables;
		},
		get derived_beastform() {
			return derived_beastform;
		},
		get derived_companion() {
			return derived_companion;
		},

		// derived stats
		get domain_card_vault() {
			return domain_card_vault;
		},
		get domain_card_loadout() {
			return domain_card_loadout;
		},
		get traits() {
			return traits;
		},
		get proficiency() {
			return proficiency;
		},
		get experience_modifiers() {
			return experience_modifiers;
		},
		get max_experiences() {
			return max_experiences;
		},
		get max_loadout() {
			return max_loadout;
		},
		get max_hope() {
			return max_hope;
		},
		get max_armor() {
			return max_armor;
		},
		get max_hp() {
			return max_hp;
		},
		get max_stress() {
			return max_stress;
		},
		get max_burden() {
			return max_burden;
		},
		get max_short_rest_actions() {
			return max_short_rest_actions;
		},
		get max_long_rest_actions() {
			return max_long_rest_actions;
		},
		get max_consumables() {
			return max_consumables;
		},
		get consumable_count() {
			return consumable_count;
		},
		get evasion() {
			return evasion;
		},
		get damage_thresholds() {
			return damage_thresholds;
		},
		get primary_class_mastery_level() {
			return primary_class_mastery_level;
		},
		get secondary_class_mastery_level() {
			return secondary_class_mastery_level;
		},
		get spellcast_roll_bonus() {
			return spellcast_roll_bonus;
		},

		// read/write
		get character() {
			return character;
		},
		// set character(value) {
		// 	character = value;
		// },

		// helper functions
		destroy,
		level_to_tier,
		tier_to_min_level,
		get_available_beastforms,

		// inventory helper functions
		addToInventory,
		removeFromInventory,
		equipItem,
		unequipItem,
		isItemEquipped,
		canEquipItem,

		// condition helper functions
		addCondition,
		removeCondition
	};
}

const CHARACTER_KEY = Symbol('Character');

export const setCharacterContext = (uid: string) => {
	const newCharacter = createCharacter(uid);
	return setContext(CHARACTER_KEY, newCharacter);
};

export const getCharacterContext = (): ReturnType<typeof setCharacterContext> => {
	return getContext(CHARACTER_KEY);
};
