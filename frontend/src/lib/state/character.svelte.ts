import { getUserContext } from './user.svelte';
import { ALL_LEVEL_UP_OPTIONS, BASE_STATS, TRAIT_OPTIONS } from '../types/rules';
import { getContext, setContext } from 'svelte';
import type { Character, DomainCardId } from '$lib/types/character-types';
import type { AllTierOptionIds, LevelUpChoice, } from '$lib/types/rule-types';
import type {
	DamageThresholds,
	Traits,
	Weapon,
	CharacterCondition,
	CharacterModifier,
	WeaponModifier,
	DomainCard,
} from '$lib/types/compendium-types';
import { BLANK_LEVEL_UP_CHOICE } from '$lib/types/constants';
import { update_character } from '$lib/remote/characters.remote';
import { getCompendiumContext } from './compendium.svelte';

function createCharacter(id: string) {
	const user = getUserContext();
	const compendium = getCompendiumContext();

	let character = <Character | null>$state(null);
	$effect(()=>{
		character = user.all_characters.find((c) => c.id === id) || null
	})

	// ================================================
	// DERIVED COMPENDIUM REFERENCES
	// ================================================

	// Heritage
	let ancestry_card = $derived(
		character?.ancestry_card_id ? compendium.ancestry_cards[character.ancestry_card_id] : null
	);
	let community_card = $derived(
		character?.community_card_id ? compendium.community_cards[character.community_card_id] : null
	);
	let transformation_card = $derived(
		character?.transformation_card_id
			? compendium.transformation_cards[character.transformation_card_id]
			: null
	);

	// Class and subclass
	let primary_class = $derived(
		character?.primary_class_id ? compendium.classes[character.primary_class_id] : null
	);
	let primary_subclass = $derived(
		character?.primary_subclass_id ? compendium.subclasses[character.primary_subclass_id] : null
	);
	let secondary_class = $derived(
		character?.secondary_class_id ? compendium.classes[character.secondary_class_id] : null
	);
	let secondary_subclass = $derived(
		character?.secondary_subclass_id ? compendium.subclasses[character.secondary_subclass_id] : null
	);

	// domain cards
	let level_up_domain_cards = $derived.by(() => {
		const ids = character?.level_up_domain_card_ids;
		return {
			1: {
				A: ids?.[1]?.A ? compendium.domain_cards[ids[1].A.domainId][ids[1].A.cardId] : null,
				B: ids?.[1]?.B ? compendium.domain_cards[ids[1].B.domainId][ids[1].B.cardId] : null
			},
			2: { A: ids?.[2]?.A ? compendium.domain_cards[ids[2].A.domainId][ids[2].A.cardId] : null },
			3: { A: ids?.[3]?.A ? compendium.domain_cards[ids[3].A.domainId][ids[3].A.cardId] : null },
			4: { A: ids?.[4]?.A ? compendium.domain_cards[ids[4].A.domainId][ids[4].A.cardId] : null },
			5: { A: ids?.[5]?.A ? compendium.domain_cards[ids[5].A.domainId][ids[5].A.cardId] : null },
			6: { A: ids?.[6]?.A ? compendium.domain_cards[ids[6].A.domainId][ids[6].A.cardId] : null },
			7: { A: ids?.[7]?.A ? compendium.domain_cards[ids[7].A.domainId][ids[7].A.cardId] : null },
			8: { A: ids?.[8]?.A ? compendium.domain_cards[ids[8].A.domainId][ids[8].A.cardId] : null },
			9: { A: ids?.[9]?.A ? compendium.domain_cards[ids[9].A.domainId][ids[9].A.cardId] : null },
			10: { A: ids?.[10]?.A ? compendium.domain_cards[ids[10].A.domainId][ids[10].A.cardId] : null }
		};
	});
	let additional_domain_cards = $derived(
		character?.additional_domain_card_ids
			.map((id) => compendium.domain_cards[id.domainId][id.cardId])
			.filter((c) => !!c) || []
	);

	// Equipment
	let active_primary_weapon = $derived(
		character?.active_primary_weapon_id
			? compendium.primary_weapons[character.active_primary_weapon_id]
			: null
	);
	let active_secondary_weapon = $derived(
		character?.active_secondary_weapon_id
			? compendium.secondary_weapons[character.active_secondary_weapon_id]
			: null
	);
	let active_armor = $derived(
		character?.active_armor_id ? compendium.armor[character.active_armor_id] : null
	);
	let inventory_primary_weapons = $derived(
		Object.keys(character?.inventory.primary_weapons || {})
			.map((id) => compendium.primary_weapons[id])
			.filter((w) => !!w) || []
	);
	let inventory_secondary_weapons = $derived(
		Object.keys(character?.inventory.secondary_weapons || {})
			.map((id) => compendium.secondary_weapons[id])
			.filter((w) => !!w) || []
	);
	let inventory_armor = $derived(
		Object.keys(character?.inventory.armor || {})
			.map((id) => compendium.armor[id])
			.filter((a) => !!a) || []
	);
	let inventory_loot = $derived(
		Object.keys(character?.inventory.loot || {})
			.map((id) => compendium.loot[id])
			.filter((l) => !!l) || []
	);
	let inventory_consumables = $derived(
		Object.keys(character?.inventory.consumables || {})
			.map((id) => compendium.consumables[id])
			.filter((c) => !!c) || []
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
	let derived_primary_weapon: Weapon | null = $state(null);
	let derived_secondary_weapon: Weapon | null = $state(null);
	let derived_unarmed_attack: Weapon | null = $state(null);
	let domain_card_vault: DomainCard[] = $state([]);
	let domain_card_loadout: DomainCard[] = $state([]);
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
	let experience_modifiers: number[] = $state(
		Array.from({ length: BASE_STATS.max_experiences }, () => BASE_STATS.experience_modifier)
	);
	let spellcast_trait: keyof Traits | null = $state(BASE_STATS.spellcast_trait);
	let spellcast_roll_bonus: number = $state(BASE_STATS.spellcast_roll_bonus);

	// ================================================
	// CHARACTER VALIDATION EFFECTS
	// ================================================

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
	$effect(() => {
		if (!character) return;
		if (!primary_class) {
			character.background_question_answers = [];
			character.connection_answers = [];
		} else {
			character.background_question_answers = primary_class.background_questions.map(
				(question) => ({ question, answer: '' })
			);
			character.connection_answers = primary_class.connections.map((question) => ({
				question,
				answer: ''
			}));
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
				? compendium.domain_cards[choice_A.selected_domain_card_id.domainId][
						choice_A.selected_domain_card_id.cardId
					]
				: null;
			const choice_B_selected_domain_card = choice_B.selected_domain_card_id
				? compendium.domain_cards[choice_B.selected_domain_card_id.domainId][
						choice_B.selected_domain_card_id.cardId
					]
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

		// ! clear invalid domain_card_tokens
		for (const domainCardId of Object.keys(character.domain_card_tokens)) {
			if (!new_domain_card_vault.some((card) => card.id === domainCardId)) {
				delete character.domain_card_tokens[domainCardId];
			}
		}

		// ! clear invalid domain_card_choices
		let new_domain_card_choices: Record<string, Record<string, string[]>> = JSON.parse(
			JSON.stringify(character.domain_card_choices)
		);

		// initialize choices
		for (const card of new_domain_card_vault) {
			if (!new_domain_card_choices[card.id]) {
				console.warn(`Creating arbitrary_choice slot for ${card.id}`);
				new_domain_card_choices[card.id] = Object.fromEntries(
					card.choices.map((choice) => [choice.choice_id, []])
				);
			}
		}

		// clear invalid choices
		const valid_keys = new_domain_card_vault.map((card) => card.id);
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
				(card) => card.id === id.cardId && card.domain_id === id.domainId && !card.forced_in_vault
			)
		);

		// check if any cards are forced in the loadout
		const ids_forced_in_loadout: DomainCardId[] = domain_card_vault
			.filter((card) => card.forced_in_loadout)
			.map((card) => ({ domainId: card.domain_id, cardId: card.id }));

		// add any missing cards that were forced in the loadout
		for (const id of ids_forced_in_loadout) {
			if (!new_loadout_domain_card_ids.some((existingId) => domainCardIdEqual(existingId, id))) {
				console.warn(`Card with forced_in_loadout was missing. Adding to loadout:`, id);
				new_loadout_domain_card_ids.unshift(id);
			}
		}

		if (new_loadout_domain_card_ids.length > max_domain_card_loadout) {
			console.warn(`Loadout exceeded the max. Removing extra cards`);
			new_loadout_domain_card_ids = new_loadout_domain_card_ids.slice(0, max_domain_card_loadout);
		}

		domain_card_loadout = new_loadout_domain_card_ids
			.map((id) =>
				domain_card_vault.find((card) => card.id === id.cardId && card.domain_id === id.domainId)
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
				loadout_card_ids.some((id) => id.cardId === card.id && id.domainId === card.domain_id)
			) {
				card.features.forEach((f) => {
					push_character_modifiers(f.character_modifiers);
					push_weapon_modifiers(f.weapon_modifiers);
				});
			}
		});

		// modifiers from active armor & derived weapons
		if (active_armor) {
			active_armor.features.forEach((f) => {
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
		additional_domain_cards.forEach((card) => {
			card.features.forEach((f) => {
				push_character_modifiers(f.character_modifiers);
				push_weapon_modifiers(f.weapon_modifiers);
			});
		});

		// additional modifiers
		push_character_modifiers(character.additional_character_modifiers);
		push_weapon_modifiers(character.additional_weapon_modifiers);

		// categorize by behavior
		base_character_modifiers = all_character_modifiers.filter(
			(e) => 'behavior' in e && e.behaviour === 'base'
		);
		bonus_character_modifiers = all_character_modifiers.filter(
			(e) => 'behavior' in e && e.behaviour === 'bonus'
		);
		override_character_modifiers = all_character_modifiers.filter(
			(e) => 'behavior' in e && e.behaviour === 'override'
		);

		base_weapon_modifiers = all_weapon_modifiers.filter(
			(e) => 'behavior' in e && e.behaviour === 'base'
		);
		bonus_weapon_modifiers = all_weapon_modifiers.filter(
			(e) => 'behavior' in e && e.behaviour === 'bonus'
		);
		override_weapon_modifiers = all_weapon_modifiers.filter(
			(e) => 'behavior' in e && e.behaviour === 'override'
		);

		console.warn('Updated modifier list...');
	});

	// ! derive armor and clear if invalid
	$effect(() => {
		if (!character) return;
		if (active_armor === null) return;
		if (active_armor.level_requirement <= character.level) return;

		console.warn(`Removing invalid armor ${active_armor.id}. level requirement not met`);
		character.active_armor_id = null;
	});

	// ! derive weapons and apply weapon modifiers
	$effect(() => {
		if (!character) return;
		let new_primary_weapon = active_primary_weapon;
		let new_secondary_weapon = active_secondary_weapon;
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

		function equivalent_weapons(a: Weapon | null, b: Weapon | null) {
			if (a === null && b === null) return true;
			if (a === null || b === null) return false;
			return a.id === b.id;
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
		if (
			base_traits.agility === null ||
			base_traits.strength === null ||
			base_traits.finesse === null ||
			base_traits.instinct === null ||
			base_traits.presence === null ||
			base_traits.knowledge === null
		)
			return;

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
				base_traits.agility +
				(tier_2_marked_traits.agility ? 1 : 0) +
				(tier_3_marked_traits.agility ? 1 : 0) +
				(tier_4_marked_traits.agility ? 1 : 0),
			strength:
				base_traits.strength +
				(tier_2_marked_traits.strength ? 1 : 0) +
				(tier_3_marked_traits.strength ? 1 : 0) +
				(tier_4_marked_traits.strength ? 1 : 0),
			finesse:
				base_traits.finesse +
				(tier_2_marked_traits.finesse ? 1 : 0) +
				(tier_3_marked_traits.finesse ? 1 : 0) +
				(tier_4_marked_traits.finesse ? 1 : 0),
			instinct:
				base_traits.instinct +
				(tier_2_marked_traits.instinct ? 1 : 0) +
				(tier_3_marked_traits.instinct ? 1 : 0) +
				(tier_4_marked_traits.instinct ? 1 : 0),
			presence:
				base_traits.presence +
				(tier_2_marked_traits.presence ? 1 : 0) +
				(tier_3_marked_traits.presence ? 1 : 0) +
				(tier_4_marked_traits.presence ? 1 : 0),
			knowledge:
				base_traits.knowledge +
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

			if (modifier.target === 'experience_from_selection') {
				const experience_indices: number[] = character.domain_card_choices[modifier.domain_card_id][
					modifier.choice_id
				].map((str) => parseInt(str));

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

			if (modifier.target === 'experience_from_selection') {
				const experience_indices: number[] = character.domain_card_choices[modifier.domain_card_id][
					modifier.choice_id
				].map((str) => parseInt(str));

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

			if (modifier.target === 'experience_from_selection') {
				const experience_indices: number[] = character.domain_card_choices[modifier.domain_card_id][
					modifier.choice_id
				].map((str) => parseInt(str));

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
		if (active_armor) {
			thresholds.major = active_armor.damage_thresholds.major;
			thresholds.severe = active_armor.damage_thresholds.severe;
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

	// * derived max_domain_card_loadout
	$effect(() => {
		if (!character) return;
		let new_max_domain_card_loadout: number = BASE_STATS.max_domain_card_loadout;

		new_max_domain_card_loadout = apply_modifiers(
			base_character_modifiers,
			'max_domain_card_loadout',
			new_max_domain_card_loadout,
			'base'
		);
		new_max_domain_card_loadout = apply_modifiers(
			bonus_character_modifiers,
			'max_domain_card_loadout',
			new_max_domain_card_loadout,
			'bonus'
		);
		new_max_domain_card_loadout = apply_modifiers(
			override_character_modifiers,
			'max_domain_card_loadout',
			new_max_domain_card_loadout,
			'override'
		);

		max_domain_card_loadout = new_max_domain_card_loadout;
	});

	// ! helper function to get tier from level
	const get_tier_from_level = (level: number): '1' | '2' | '3' | '4' => {
		if (level === 1) return '1';
		if (level >= 2 && level <= 4) return '2';
		if (level >= 5 && level <= 7) return '3';
		return '4';
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

			// Don't start a new save if one is already in flight
			if (inFlightSave) {
				return;
			}

			// Use JSON serialization for deep clone to avoid structuredClone issues
			const cloned = JSON.parse(JSON.stringify(character));
			const savePromise = update_character(cloned)
				.then(() => {
					// Only update lastSavedCharacter after successful save
					lastSavedCharacter = JSON.stringify(character);
				})
				.catch((error) => {
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

		// derived equipment
		get active_armor() {
			return active_armor;
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
		get max_domain_card_loadout() {
			return max_domain_card_loadout;
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
		get spellcast_trait() {
			return spellcast_trait;
		},
		get spellcast_roll_bonus() {
			return spellcast_roll_bonus;
		},

		// read/write
		get character() {
			return character;
		},
		set character(value) {
			character = value;
		},

		// helper functions
		destroy,
		get_tier_from_level
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
