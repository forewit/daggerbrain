import { AdversarySchema, type Adversary } from '@convex/schemas/compendium';
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

function stripRawHtml(value: string): string {
	return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true });
}

export function adversaryToFormData(item: Adversary): Adversary {
	return cloneFormValue(item);
}

export function adversaryFormDataToItem(formData: Adversary): Adversary {
	return {
		...formData,
		source_key: 'Homebrew',
		title: formData.title.trim(),
		artist_name: formData.artist_name.trim(),
		description: stripRawHtml(formData.description),
		motives_tactics: formData.motives_tactics.trim(),
		standard_attack: {
			...formData.standard_attack,
			name: formData.standard_attack.name.trim() || 'Attack',
			damage_dice: formData.standard_attack.damage_dice.trim()
		},
		experiences: formData.experiences.map((experience) => experience.trim()).filter(Boolean),
		features: formData.features.map((feature) => ({
			...feature,
			name: feature.name.trim(),
			description_html: stripRawHtml(feature.description_html)
		}))
	};
}

export function normalizeAdversary(item: Adversary): Adversary {
	return AdversarySchema.parse(adversaryFormDataToItem(item));
}
