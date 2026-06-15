import type { HomebrewErrorPath, HomebrewErrorSummary } from '../helpers';

export function summarizeLootFormErrors(summary: HomebrewErrorSummary): string[] {
	return summary.fieldErrors.map((error) => `${formatPath(error.path)}: ${error.message}`);
}

function formatPath(path: HomebrewErrorPath): string {
	const [section, index] = path;
	if (section === 'character_modifiers' && typeof index === 'number')
		return `Character Modifier ${index + 1}`;
	if (section === 'weapon_modifiers' && typeof index === 'number')
		return `Weapon Modifier ${index + 1}`;
	if (section === 'title') return 'Name';
	if (section === 'description_html') return 'Description';
	return 'Loot';
}
