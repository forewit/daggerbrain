import type { HomebrewErrorPath, HomebrewErrorSummary } from '../helpers';

export function summarizeArmorFormErrors(summary: HomebrewErrorSummary): string[] {
	return summary.fieldErrors.map((error) => `${formatPath(error.path)}: ${error.message}`);
}

function formatPath(path: HomebrewErrorPath): string {
	const [section, index] = path;
	if (section === 'features' && typeof index === 'number')
		return joinLabels(`Feature ${index + 1}`, fieldPath(path.slice(2)));
	if (typeof section === 'string') return joinLabels(label(section), fieldPath(path.slice(1)));
	return 'Armor';
}

function fieldPath(path: HomebrewErrorPath): string {
	return path.map((part) => (typeof part === 'number' ? String(part + 1) : label(part))).join(' ');
}

function label(field: string): string {
	const labels: Record<string, string> = {
		title: 'Name',
		description_html: 'Description',
		level_requirement: 'Level requirement',
		max_armor: 'Armor score',
		damage_thresholds: 'Damage thresholds',
		major: 'Major',
		severe: 'Severe',
		character_modifiers: 'Character modifier',
		weapon_modifiers: 'Weapon modifier',
		character_conditions: 'Character condition',
		weapon_conditions: 'Weapon condition'
	};
	return labels[field] ?? field.replace(/_/g, ' ');
}

function joinLabels(...labels: string[]): string {
	return labels.filter(Boolean).join(' ');
}
