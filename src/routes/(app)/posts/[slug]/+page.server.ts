import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';
import { loadArticlePageData } from '$lib/server/article';

type PostMetadataModule = {
	metadata: import('$lib/server/posts').PostFrontmatter;
};

const postMetadataModules = import.meta.glob<PostMetadataModule>('/src/posts/*.svx', {
	eager: true
});

const postRawModules = import.meta.glob<string>('/src/posts/*.svx', {
	query: '?raw',
	import: 'default'
});

export const load: PageServerLoad = async ({ params }) => {
	const sourcePath = `/src/posts/${params.slug}.svx`;
	const metadataModule = postMetadataModules[sourcePath];
	const rawSource = await postRawModules[sourcePath]?.();

	if (!metadataModule || !rawSource) {
		error(404, 'Post not found');
	}

	return loadArticlePageData(env.PUBLIC_ORIGIN, {
		sourcePath,
		metadata: metadataModule.metadata,
		rawSource,
		canonicalPath: `/posts/${params.slug}`,
		seoTitle: `${metadataModule.metadata.title} | Daggerbrain Posts`,
		notFoundMessage: 'Post not found',
		slug: params.slug
	});
};
