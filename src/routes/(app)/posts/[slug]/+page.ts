import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

type PostPageModule = {
	default: import('svelte').Component;
};

const postModules = import.meta.glob<PostPageModule>('/src/posts/*.svx');

export const load: PageLoad = async ({ params, data }) => {
	const importer = postModules[`/src/posts/${params.slug}.svx`];

	if (!importer) {
		error(404, 'Post not found');
	}

	const module = await importer();

	return {
		...data,
		Content: module.default
	};
};
