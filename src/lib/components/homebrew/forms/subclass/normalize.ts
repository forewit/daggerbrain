import {
	SubclassSchema,
	type Subclass,
	type SubclassLevelUpOption
} from '@convex/schemas/compendium';
import type { CardOption, Feature } from '@convex/schemas/rules';
import DOMPurify from 'dompurify';

type SubclassCardKey = 'foundation_card' | 'specialization_card' | 'mastery_card';

function cloneFormValue<T>(value: T): T {
	if (Array.isArray(value)) return value.map(cloneFormValue) as T;
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

function stripRawHtml(value: string): string {
	return DOMPurify.sanitize(value, {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
		KEEP_CONTENT: true
	});
}

function toInteger(value: number): number {
	return Number.isFinite(value) ? Math.trunc(value) : value;
}

function normalizeFeature(feature: Feature): Feature {
	return {
		...feature,
		title: feature.title.trim(),
		description_html: stripRawHtml(feature.description_html)
	} as Feature;
}

function normalizeOptions(options: CardOption[] | undefined): CardOption[] {
	return cloneFormValue(options ?? []).map((option) => ({
		...option,
		choice_id: option.choice_id.trim()
	}));
}

function normalizeLevelUpOption(
	option: SubclassLevelUpOption,
	index: number
): SubclassLevelUpOption {
	const title = stripRawHtml(option.title).trim();
	const shortTitle = option.short_title.trim();
	const fallbackTitle = `Level Up Option ${index + 1}`;
	const derivedTitle = title || shortTitle || fallbackTitle;
	const derivedShortTitle = shortTitle || title || fallbackTitle;

	return {
		...option,
		option_id: option.option_id.trim(),
		title: derivedTitle,
		short_title: derivedShortTitle,
		max: toInteger(option.max)
	};
}

function normalizeSubclassCard(card: Subclass[SubclassCardKey]): Subclass[SubclassCardKey] {
	return {
		...card,
		features: card.features.map(normalizeFeature),
		options: normalizeOptions(card.options),
		tokens_enabled: card.tokens_enabled || undefined,
		level_up_options: (card.level_up_options ?? []).map(normalizeLevelUpOption)
	};
}

export function subclassToFormData(item: Subclass): Subclass {
	return cloneFormValue({
		...item,
		class_id: item.class_id ?? '',
		spellcast_trait: item.spellcast_trait ?? undefined,
		foundation_card: {
			...item.foundation_card,
			options: item.foundation_card.options ?? [],
			tokens_enabled: item.foundation_card.tokens_enabled ?? false,
			level_up_options: item.foundation_card.level_up_options ?? []
		},
		specialization_card: {
			...item.specialization_card,
			options: item.specialization_card.options ?? [],
			tokens_enabled: item.specialization_card.tokens_enabled ?? false,
			level_up_options: item.specialization_card.level_up_options ?? []
		},
		mastery_card: {
			...item.mastery_card,
			options: item.mastery_card.options ?? [],
			tokens_enabled: item.mastery_card.tokens_enabled ?? false,
			level_up_options: item.mastery_card.level_up_options ?? []
		}
	});
}

export function subclassFormDataToItem(formData: Subclass): Subclass {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		description_html: stripRawHtml(formData.description_html),
		class_id: optionalTrimmedString(formData.class_id),
		artist_name: formData.artist_name.trim(),
		spellcast_trait: formData.spellcast_trait,
		foundation_card: normalizeSubclassCard(formData.foundation_card),
		specialization_card: normalizeSubclassCard(formData.specialization_card),
		mastery_card: normalizeSubclassCard(formData.mastery_card)
	};
}

export function normalizeSubclass(item: Subclass): Subclass {
	return SubclassSchema.parse(subclassFormDataToItem(item));
}
