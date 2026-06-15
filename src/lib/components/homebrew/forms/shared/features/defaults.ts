import type { CharacterModifier, Feature, WeaponModifier } from '@convex/schemas/rules';

export function emptyFeature(): Feature {
	return {
		title: '',
		description_html: '',
		character_modifiers: [],
		weapon_modifiers: []
	};
}

export function emptyCharacterModifier(): CharacterModifier {
	return {
		behaviour: 'bonus',
		character_conditions: [],
		type: 'flat',
		value: 0,
		target: 'evasion'
	};
}

export function emptyWeaponModifier(): WeaponModifier {
	return {
		behaviour: 'bonus',
		character_conditions: [],
		weapon_conditions: [],
		target_weapon: 'all',
		target_stat: 'attack_roll',
		type: 'flat',
		value: 0
	};
}
