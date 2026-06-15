import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';
import { loadArticlePageData } from '$lib/server/article';

type ChangelogModule = {
	metadata: import('$lib/server/posts').PostFrontmatter;
};

const changelogMetadataModules = import.meta.glob<ChangelogModule>('./*.svx', {
	eager: true
});

const changelogRawModules = import.meta.glob<string>('./*.svx', {
	query: '?raw',
	import: 'default'
});

export const load: PageServerLoad = async () => {
	const metadataModule = changelogMetadataModules['./changelog.svx'];
	const rawSource = await changelogRawModules['./changelog.svx']?.();

	if (!metadataModule || !rawSource) {
		error(404, 'Changelog not found');
	}

	return loadArticlePageData(env.PUBLIC_ORIGIN, {
		sourcePath: '/src/routes/(app)/changelog/changelog.svx',
		metadata: metadataModule.metadata,
		rawSource,
		canonicalPath: '/changelog',
		seoTitle: `${metadataModule.metadata.title} | Daggerbrain`,
		notFoundMessage: 'Changelog not found'
	});
};
