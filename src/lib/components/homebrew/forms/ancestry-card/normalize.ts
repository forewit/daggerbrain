import { AncestryCardSchema, type AncestryCard } from '@convex/schemas/compendium';
import type { CardOption, Feature } from '@convex/schemas/rules';
import DOMPurify from 'dompurify';

function cloneFormValue<T>(value: T): T {
	if (Array.isArray(value)) return value.map(cloneFormValue) as T;
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, entry]) => [key, cloneFormValue(entry)])
		) as T;
	}
	return value;
}

function emptyFeature(): Feature {
	return {
		title: '',
		description_html: '',
		character_modifiers: [],
		weapon_modifiers: []
	};
}

function ensureTwoFeatures(features: Feature[]): Feature[] {
	const copy = cloneFormValue(features);
	while (copy.length < 2) copy.push(emptyFeature());
	return copy.slice(0, 2);
}

export function editableAncestryFeatures(item: AncestryCard): Feature[] {
	return item.is_mixed_ancestry ? [] : ensureTwoFeatures(item.features);
}

function referencedExperienceChoiceIds(features: Feature[]): Set<string> {
	const ids = new Set<string>();
	for (const feature of features) {
		for (const modifier of feature.character_modifiers) {
			if (modifier.target === 'experience_from_card_choice_selection') {
				ids.add(modifier.choice_id);
			}
		}
	}
	return ids;
}

export function pruneAncestryCardOptions(
	options: CardOption[] | undefined,
	features: Feature[],
	isMixedAncestry: boolean
): CardOption[] {
	const editableFeatures = isMixedAncestry ? [] : ensureTwoFeatures(features);
	const validExperienceChoiceIds = referencedExperienceChoiceIds(editableFeatures);
	return cloneFormValue(options ?? []).filter((option) => {
		if (option.type !== 'experience') return true;
		return validExperienceChoiceIds.has(option.choice_id);
	});
}

export function ancestryCardToFormData(item: AncestryCard): AncestryCard {
	const isMixedAncestry = item.is_mixed_ancestry ?? false;
	return cloneFormValue({
		...item,
		features: isMixedAncestry ? [] : ensureTwoFeatures(item.features),
		options: pruneAncestryCardOptions(item.options, item.features, isMixedAncestry),
		tokens_enabled: item.tokens_enabled ?? false,
		is_mixed_ancestry: isMixedAncestry
	});
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

export function ancestryCardFormDataToItem(formData: AncestryCard): AncestryCard {
	const isMixedAncestry = formData.is_mixed_ancestry ?? false;
	const features = isMixedAncestry
		? []
		: ensureTwoFeatures(formData.features).map(normalizeFeature);
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		description_html: stripRawHtml(formData.description_html),
		artist_name: formData.artist_name.trim(),
		features,
		options: pruneAncestryCardOptions(formData.options, features, isMixedAncestry),
		tokens_enabled: formData.tokens_enabled || undefined,
		is_mixed_ancestry: isMixedAncestry || undefined
	};
}

export function normalizeAncestryCard(item: AncestryCard): AncestryCard {
	return AncestryCardSchema.parse(ancestryCardFormDataToItem(item));
}
