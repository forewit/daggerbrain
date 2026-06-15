import type { HomebrewErrorPath, HomebrewErrorSummary } from '../helpers';

export function summarizeClassFormErrors(summary: HomebrewErrorSummary): string[] {
	return summary.fieldErrors.map(
		(error) => `${formatClassErrorPath(error.path)}: ${error.message}`
	);
}

function formatClassErrorPath(path: HomebrewErrorPath): string {
	if (path.length === 0) return 'Class';

	const [section, index] = path;

	if (section === 'class_features' && typeof index === 'number') {
		return joinLabels(`Feature ${index + 1}`, formatFieldPath(path.slice(2)));
	}

	if (section === 'hope_feature') {
		return joinLabels('Hope feature', formatFieldPath(path.slice(1)));
	}

	if (section === 'starting_inventory') {
		return formatStartingInventoryPath(path.slice(1));
	}

	if (section === 'background_questions' && typeof index === 'number') {
		return `Background question ${index + 1}`;
	}

	if (section === 'connection_questions' && typeof index === 'number') {
		return `Connection question ${index + 1}`;
	}

	if (
		section === 'subclass_ids' ||
		section === 'suggested_traits' ||
		section === 'character_descriptions'
	) {
		return joinLabels(fieldLabel(String(section)), formatFieldPath(path.slice(1)));
	}

	if (typeof section === 'string') {
		return joinLabels(fieldLabel(section), formatFieldPath(path.slice(1)));
	}

	return formatFieldPath(path) || 'Class';
}

function formatStartingInventoryPath(path: HomebrewErrorPath): string {
	const [section, index] = path;

	if (section === 'free_gear' && typeof index === 'number') {
		return `Starting inventory free gear ${index + 1}`;
	}

	if (section === 'class_gear_options' && typeof index === 'number') {
		return `Starting inventory gear option ${index + 1}`;
	}

	if (section === 'loot_or_consumable_options' && typeof index === 'number') {
		return joinLabels(
			`Starting inventory loot or consumable option ${index + 1}`,
			formatFieldPath(path.slice(2))
		);
	}

	if (typeof section === 'string') {
		return joinLabels(
			'Starting inventory',
			joinLabels(fieldLabel(section), formatFieldPath(path.slice(1)))
		);
	}

	return 'Starting inventory';
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
		image_url: 'Image',
		starting_evasion: 'Starting evasion',
		starting_max_hp: 'Starting hit points',
		primary_domain_id: 'Primary domain',
		secondary_domain_id: 'Secondary domain',
		suggested_primary_weapon_id: 'Suggested primary weapon',
		suggested_secondary_weapon_id: 'Suggested secondary weapon',
		suggested_armor_id: 'Suggested armor',
		subclass_ids: 'Subclasses',
		suggested_traits: 'Suggested traits',
		character_descriptions: 'Character descriptions',
		gold_coins: 'Gold coins',
		spellbook_prompt: 'Spellbook prompt',
		type: 'Type',
		value: 'Value',
		amount: 'Amount',
		trait: 'Trait',
		max: 'Maximum',
		options: 'Selection',
		character_modifiers: 'Character modifier',
		weapon_modifiers: 'Weapon modifier',
		character_conditions: 'Character condition',
		choice_id: 'Choice',
		selection_id: 'Selection',
		domain_id: 'Domain',
		id: 'Item'
	};

	return (
		labels[field] ??
		titleCase(
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

function titleCase(value: string): string {
	return value.replace(/\b\w/g, (match) => match.toUpperCase());
}
