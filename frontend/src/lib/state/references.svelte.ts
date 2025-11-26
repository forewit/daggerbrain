import { getUserContext } from './user.svelte';
import { ALL_LEVEL_UP_OPTIONS, BASE_STATS, TRAIT_OPTIONS } from '../types/rules';
import { getContext, setContext } from 'svelte';
import {
	get_all_ancestry_cards,
	get_all_community_cards,
	get_all_transformation_cards,
	get_ancestry_card,
	get_community_card,
	get_transformation_card
} from '$lib/remote/heritages.remote';
import {
	get_all_classes,
	get_all_subclasses,
	get_class,
	get_subclass
} from '$lib/remote/classes.remote';
import { get_all_domains, get_domain_card, get_domain_cards } from '$lib/remote/domains.remote';
import {
	get_all_primary_weapons,
	get_all_secondary_weapons,
	get_primary_weapon,
	get_secondary_weapon,
	get_all_armor,
	get_all_loot,
	get_all_consumables,
	get_armor
} from '$lib/remote/equipment.remote';
import type { Character } from '$lib/types/character-types';
import type { LevelUpChoice, LevelUpOption } from '$lib/types/rule-types';
import type {
	DamageThresholds,
	AncestryCard,
	CommunityCard,
	TransformationCard,
	Class,
	Subclass,
	Traits,
	Weapon,
	Armor,
	Loot,
	Consumable,
	CharacterCondition,
	CharacterModifier,
	WeaponModifier,
	DomainIds,
	DomainCard
} from '$lib/types/compendium-types';
import { BLANK_LEVEL_UP_CHOICE } from '$lib/types/constants';
import { update_character } from '$lib/remote/characters.remote';
import { getCharacterContext } from './character.svelte';

const context = getCharacterContext();
let character = $derived(context.character);

export let ancestry_card = $derived(
	character?.ancestry_card_id
		? await get_ancestry_card(character.ancestry_card_id)
		: null
);

export let community_card = $derived(
	character?.community_card_id
		? await get_community_card(character.community_card_id)
		: null
);

export let transformation_card = $derived(
	character?.transformation_card_id
		? await get_transformation_card(character.transformation_card_id)
		: null
);

export let primary_class = $derived(
	character?.primary_class_id ? await get_class(character.primary_class_id) : null
);

export let primary_subclass = $derived(
	character?.primary_class_id && character?.primary_subclass_id
		? await get_subclass(character.primary_subclass_id)
		: null
);

export let secondary_class = $derived(
	character?.secondary_class_id ? await get_class(character.secondary_class_id) : null
);

export let secondary_subclass = $derived(
	character?.secondary_class_id && character?.secondary_subclass_id
		? await get_subclass(character.secondary_subclass_id)
		: null
);

export let level_up_domain_cards = $derived.by(async () => {
	const ids = character?.level_up_domain_card_ids;

	return {
		1: {
			A: ids?.[1]?.A ? await get_domain_card(ids[1].A) : null,
			B: ids?.[1]?.B ? await get_domain_card(ids[1].B) : null
		},
		2: { A: ids?.[2]?.A ? await get_domain_card(ids[2].A) : null },
		3: { A: ids?.[3]?.A ? await get_domain_card(ids[3].A) : null },
		4: { A: ids?.[4]?.A ? await get_domain_card(ids[4].A) : null },
		5: { A: ids?.[5]?.A ? await get_domain_card(ids[5].A) : null },
		6: { A: ids?.[6]?.A ? await get_domain_card(ids[6].A) : null },
		7: { A: ids?.[7]?.A ? await get_domain_card(ids[7].A) : null },
		8: { A: ids?.[8]?.A ? await get_domain_card(ids[8].A) : null },
		9: { A: ids?.[9]?.A ? await get_domain_card(ids[9].A) : null },
		10: { A: ids?.[10]?.A ? await get_domain_card(ids[10].A) : null }
	};
});

export let additional_domain_cards = $derived(
	await Promise.all(
		character?.additional_domain_card_ids || []
			.map((id) => get_domain_card(id))
	)
);

export let primary_weapon = $derived(
	character?.active_primary_weapon_id
		? await get_primary_weapon(character.active_primary_weapon_id)
		: null
);

export let secondary_weapon = $derived(
	character?.active_secondary_weapon_id
		? await get_secondary_weapon(character.active_secondary_weapon_id)
		: null
);

export let armor = $derived(
	character?.active_armor_id ? await get_armor(character.active_armor_id) : null
);

export let inventory_primary_weapons = $derived(
	await Promise.all(
		Object.keys(character?.inventory.primary_weapons || {})
			.map((id) => get_primary_weapon(id))
	)
);



// todo: move to stats.svelte
export let leve_up_chosen_options = $derived.by(() => {
	const choices = character?.level_up_choices;

	return {
		2: {
			A: choices && choices[2].A.option_id ? ALL_LEVEL_UP_OPTIONS[choices[2].A.option_id] : null,
			B: choices && choices[2].B.option_id ? ALL_LEVEL_UP_OPTIONS[choices[2].B.option_id] : null
		},
		3: {
			A: choices && choices[3].A.option_id ? ALL_LEVEL_UP_OPTIONS[choices[3].A.option_id] : null,
			B: choices && choices[3].B.option_id ? ALL_LEVEL_UP_OPTIONS[choices[3].B.option_id] : null
		},
		4: {
			A: choices && choices[4].A.option_id ? ALL_LEVEL_UP_OPTIONS[choices[4].A.option_id] : null,
			B: choices && choices[4].B.option_id ? ALL_LEVEL_UP_OPTIONS[choices[4].B.option_id] : null
		},
		5: {
			A: choices && choices[5].A.option_id ? ALL_LEVEL_UP_OPTIONS[choices[5].A.option_id] : null,
			B: choices && choices[5].B.option_id ? ALL_LEVEL_UP_OPTIONS[choices[5].B.option_id] : null
		},
		6: {
			A: choices && choices[6].A.option_id ? ALL_LEVEL_UP_OPTIONS[choices[6].A.option_id] : null,
			B: choices && choices[6].B.option_id ? ALL_LEVEL_UP_OPTIONS[choices[6].B.option_id] : null
		},
		7: {
			A: choices && choices[7].A.option_id ? ALL_LEVEL_UP_OPTIONS[choices[7].A.option_id] : null,
			B: choices && choices[7].B.option_id ? ALL_LEVEL_UP_OPTIONS[choices[7].B.option_id] : null
		},
		8: {
			A: choices && choices[8].A.option_id ? ALL_LEVEL_UP_OPTIONS[choices[8].A.option_id] : null,
			B: choices && choices[8].B.option_id ? ALL_LEVEL_UP_OPTIONS[choices[8].B.option_id] : null
		},
		9: {
			A: choices && choices[9].A.option_id ? ALL_LEVEL_UP_OPTIONS[choices[9].A.option_id] : null,
			B: choices && choices[9].B.option_id ? ALL_LEVEL_UP_OPTIONS[choices[9].B.option_id] : null
		},
		10: {
			A: choices && choices[10].A.option_id ? ALL_LEVEL_UP_OPTIONS[choices[10].A.option_id] : null,
			B: choices && choices[10].B.option_id ? ALL_LEVEL_UP_OPTIONS[choices[10].B.option_id] : null
		}
	};
});