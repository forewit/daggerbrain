import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

type ChangelogPageModule = {
	default: import('svelte').Component;
};

const changelogModules = import.meta.glob<ChangelogPageModule>('./*.svx');

export const load: PageLoad = async ({ data }) => {
	const importer = changelogModules['./changelog.svx'];

	if (!importer) {
		error(404, 'Changelog not found');
	}

	const module = await importer();

	return {
		...data,
		Content: module.default
	};
};
