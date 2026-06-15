import type { HomebrewErrorPath, HomebrewErrorSummary } from '../helpers';

export function summarizePrimaryWeaponFormErrors(summary: HomebrewErrorSummary): string[] {
	return summary.fieldErrors.map(
		(error) => `${formatWeaponErrorPath(error.path)}: ${error.message}`
	);
}

function formatWeaponErrorPath(path: HomebrewErrorPath): string {
	if (path.length === 0) return 'Primary weapon';
	const [section, index] = path;
	if (section === 'features' && typeof index === 'number') {
		return joinLabels(`Feature ${index + 1}`, formatFieldPath(path.slice(2)));
	}
	if (typeof section === 'string')
		return joinLabels(fieldLabel(section), formatFieldPath(path.slice(1)));
	return formatFieldPath(path) || 'Primary weapon';
}

function formatFieldPath(path: HomebrewErrorPath): string {
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
		level_requirement: 'Level requirement',
		available_traits: 'Traits',
		available_damage_types: 'Damage types',
		attack_roll_bonus: 'Attack bonus',
		damage_bonus: 'Damage bonus',
		damage_dice: 'Damage dice',
		burden: 'Burden',
		type: 'Type',
		range: 'Range',
		character_modifiers: 'Character modifier',
		weapon_modifiers: 'Weapon modifier',
		character_conditions: 'Character condition',
		weapon_conditions: 'Weapon condition',
		value: 'Value',
		amount: 'Amount',
		trait: 'Trait'
	};
	return labels[field] ?? titleCase(field.replace(/_html$/, '').replace(/_/g, ' '));
}

function joinLabels(...labels: string[]): string {
	return labels.filter(Boolean).join(' ');
}

function titleCase(value: string): string {
	return value.replace(/\b\w/g, (match) => match.toUpperCase());
}
