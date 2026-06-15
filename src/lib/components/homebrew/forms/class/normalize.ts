import { CharacterClassSchema, type CharacterClass } from '@convex/schemas/compendium';
import type { Feature } from '@convex/schemas/rules';
import DOMPurify from 'dompurify';

function cloneFormValue<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map(cloneFormValue) as T;
	}

	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, entry]) => [key, cloneFormValue(entry)])
		) as T;
	}

	return value;
}

function optionalTrimmedString(value: string | undefined): string | undefined {
	if (value === undefined) return undefined;
	const trimmed = value.trim();
	return trimmed === '' ? undefined : trimmed;
}

function trimString(value: string): string {
	return value.trim();
}

function trimStringArray(values: string[]): string[] {
	return values.map(trimString);
}

function uniqueTrimmedStrings(values: string[]): string[] {
	return [...new Set(trimStringArray(values))].filter((value) => value !== '');
}

function toInteger(value: number): number {
	return Number.isFinite(value) ? Math.trunc(value) : value;
}

function stripRawHtml(value: string): string {
	return DOMPurify.sanitize(value, {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
		KEEP_CONTENT: true
	});
}

function normalizeFeature(feature: Feature): Feature {
	return {
		...feature,
		title: feature.title.trim(),
		description_html: stripRawHtml(feature.description_html)
	} as Feature;
}

export function characterClassToFormData(item: CharacterClass): CharacterClass {
	return cloneFormValue({
		...item,
		primary_domain_id: item.primary_domain_id ?? '',
		secondary_domain_id: item.secondary_domain_id ?? '',
		suggested_primary_weapon_id: item.suggested_primary_weapon_id ?? '',
		suggested_secondary_weapon_id: item.suggested_secondary_weapon_id ?? '',
		suggested_armor_id: item.suggested_armor_id ?? '',
		starting_inventory: {
			...item.starting_inventory,
			spellbook_prompt: item.starting_inventory.spellbook_prompt ?? ''
		}
	});
}

export function characterClassFormDataToItem(formData: CharacterClass): CharacterClass {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		description_html: stripRawHtml(formData.description_html),
		image_url: formData.image_url,
		artist_name: formData.artist_name.trim(),
		starting_evasion: toInteger(formData.starting_evasion),
		starting_max_hp: toInteger(formData.starting_max_hp),
		hope_feature: normalizeFeature(formData.hope_feature),
		primary_domain_id: optionalTrimmedString(formData.primary_domain_id),
		secondary_domain_id: optionalTrimmedString(formData.secondary_domain_id),
		class_features: formData.class_features.map(normalizeFeature),
		subclass_ids: trimStringArray(formData.subclass_ids),
		suggested_traits: cloneFormValue(formData.suggested_traits),
		suggested_primary_weapon_id: optionalTrimmedString(formData.suggested_primary_weapon_id),
		suggested_secondary_weapon_id: optionalTrimmedString(formData.suggested_secondary_weapon_id),
		suggested_armor_id: optionalTrimmedString(formData.suggested_armor_id),
		starting_inventory: {
			gold_coins: toInteger(formData.starting_inventory.gold_coins),
			free_gear: uniqueTrimmedStrings(formData.starting_inventory.free_gear),
			loot_or_consumable_options: formData.starting_inventory.loot_or_consumable_options.map(
				(option) => ({ ...option, id: option.id.trim() })
			),
			class_gear_options: uniqueTrimmedStrings(formData.starting_inventory.class_gear_options),
			spellbook_prompt: optionalTrimmedString(formData.starting_inventory.spellbook_prompt)
		},
		background_questions: trimStringArray(formData.background_questions),
		connection_questions: trimStringArray(formData.connection_questions),
		character_description_suggestions: {
			clothes: formData.character_description_suggestions.clothes.trim(),
			eyes: formData.character_description_suggestions.eyes.trim(),
			body: formData.character_description_suggestions.body.trim(),
			skin: formData.character_description_suggestions.skin.trim(),
			attitude: formData.character_description_suggestions.attitude.trim()
		}
	};
}

export function normalizeCharacterClass(item: CharacterClass): CharacterClass {
	return CharacterClassSchema.parse(characterClassFormDataToItem(item));
}
