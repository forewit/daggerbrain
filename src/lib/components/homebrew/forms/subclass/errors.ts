import { capitalize } from '$lib/utils';
import type { HomebrewErrorPath, HomebrewErrorSummary } from '../helpers';

export function summarizeSubclassFormErrors(summary: HomebrewErrorSummary): string[] {
	return summary.fieldErrors.map(
		(error) => `${formatSubclassErrorPath(error.path)}: ${error.message}`
	);
}

function formatSubclassErrorPath(path: HomebrewErrorPath): string {
	if (path.length === 0) return 'Subclass';
	const [section] = path;

	if (isSubclassCard(section)) {
		return formatSubclassCardPath(section, path.slice(1));
	}

	if (typeof section === 'string')
		return joinLabels(fieldLabel(section), formatFieldPath(path.slice(1)));
	return formatFieldPath(path) || 'Subclass';
}

function formatSubclassCardPath(cardKey: string, path: HomebrewErrorPath): string {
	const cardLabel = subclassCardLabel(cardKey);
	const [section, index] = path;

	if (section === 'features' && typeof index === 'number') {
		return joinLabels(`${cardLabel} feature ${index + 1}`, formatFieldPath(path.slice(2)));
	}
	if (section === 'options' && typeof index === 'number') {
		return formatCardChoicePath(`${cardLabel} card choice ${index + 1}`, path.slice(2));
	}
	if (section === 'level_up_options' && typeof index === 'number') {
		return joinLabels(`${cardLabel} level up option ${index + 1}`, formatFieldPath(path.slice(2)));
	}
	if (typeof section === 'string')
		return joinLabels(cardLabel, fieldLabel(section), formatFieldPath(path.slice(1)));
	return cardLabel;
}

function formatCardChoicePath(choiceLabel: string, path: HomebrewErrorPath): string {
	const [section, index] = path;
	if (section === 'choice_id') return `${choiceLabel} name`;
	if (section === 'options' && typeof index === 'number') {
		const [selectionField] = path.slice(2);
		if (selectionField === 'selection_id') return `${choiceLabel} selection ${index + 1} name`;
		return joinLabels(`${choiceLabel} selection ${index + 1}`, formatFieldPath(path.slice(2)));
	}
	if (section === 'conditional_choice')
		return joinLabels(`${choiceLabel} condition`, formatFieldPath(path.slice(1)));
	return joinLabels(choiceLabel, formatFieldPath(path));
}

function isSubclassCard(value: unknown): value is string {
	return value === 'foundation_card' || value === 'specialization_card' || value === 'mastery_card';
}

function subclassCardLabel(cardKey: string): string {
	return capitalize(cardKey.replace('_card', ''));
}

function formatFieldPath(path: HomebrewErrorPath): string {
	if (path.length === 0) return '';
	const labels: string[] = [];
	for (const segment of path) {
		if (typeof segment === 'number') {
			const previous = labels.pop();
			labels.push(previous ? `${previous} ${segment + 1}` : String(segment + 1));
			continue;
		}
		labels.push(fieldLabel(segment));
	}
	return labels.join(' ');
}

function fieldLabel(field: string): string {
	const labels: Record<string, string> = {
		title: 'Name',
		description_html: 'Description',
		class_id: 'Class',
		image_url: 'Image',
		spellcast_trait: 'Spellcast trait',
		type: 'Type',
		max: 'Maximum',
		option_id: 'Option',
		short_title: 'Short name',
		choice_id: 'Choice',
		selection_id: 'Selection',
		conditional_choice: 'Condition',
		character_modifiers: 'Character modifier',
		weapon_modifiers: 'Weapon modifier',
		character_conditions: 'Character condition',
		value: 'Value',
		amount: 'Amount',
		trait: 'Trait',
		options: 'Selection',
		id: 'Item'
	};
	return (
		labels[field] ??
		capitalize(
			field
				.replace(/_id$/, '')
				.replace(/_html$/, '')
				.replace(/_/g, ' ')
		)
	);
}

function joinLabels(...labels: string[]): string {
	return labels.filter(Boolean).join(' ');
}
