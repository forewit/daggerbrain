import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import { redirect } from '@sveltejs/kit';
import { createAbsoluteUrl } from '$lib/components/seo/seo';
import {
	listPublishedPosts,
	normalizePageNumber,
	paginatePosts,
	postsPageSize
} from '$lib/server/posts';

export const load: PageServerLoad = async ({ url }) => {
	const posts = listPublishedPosts();
	const requestedPage = normalizePageNumber(url.searchParams.get('page'));
	const { posts: paginatedPosts, pagination } = paginatePosts(posts, requestedPage, postsPageSize);
	const canonicalPath = pagination.page <= 1 ? '/posts' : `/posts?page=${pagination.page}`;

	if (posts.length > 0 && requestedPage > pagination.totalPages) {
		redirect(302, pagination.page === 1 ? '/posts' : `/posts?page=${pagination.page}`);
	}

	return {
		posts: paginatedPosts,
		pagination,
		seo: {
			title:
				pagination.page <= 1
					? 'Posts | Daggerbrain'
					: `Posts Page ${pagination.page} | Daggerbrain`,
			description:
				'Read Daggerbrain product updates, development notes, and behind-the-screen posts from the app build process.',
			robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
			canonical: createAbsoluteUrl(env.PUBLIC_ORIGIN, canonicalPath),
			siteName: 'Daggerbrain',
			locale: 'en_US',
			type: 'website',
			url: createAbsoluteUrl(env.PUBLIC_ORIGIN, canonicalPath),
			image: createAbsoluteUrl(env.PUBLIC_ORIGIN, '/images/card/banner.webp'),
			imageAlt: 'Daggerbrain banner artwork'
		}
	};
};
