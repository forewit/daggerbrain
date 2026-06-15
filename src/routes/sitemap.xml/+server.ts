import { env } from '$env/dynamic/public';
import { PUBLIC_PAGES, createAbsoluteUrl, normalizePublicOrigin } from '$lib/components/seo/seo';
import { listPublishedPosts } from '$lib/server/posts';
import type { RequestHandler } from './$types';

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export const GET: RequestHandler = async () => {
	const normalizedOrigin = normalizePublicOrigin(env.PUBLIC_ORIGIN);
	const staticRoutes = [...PUBLIC_PAGES].sort((left, right) => {
		if (left.pathname === '/') return -1;
		if (right.pathname === '/') return 1;
		return left.pathname.localeCompare(right.pathname);
	});
	const postRoutes = listPublishedPosts().map((post) => ({
		pathname: `/posts/${post.slug}`,
		changefreq: 'monthly' as const,
		priority: '0.8',
		lastmod: new Date(post.updated ?? post.date).toISOString()
	}));
	const routes = [
		...staticRoutes.map((route) => ({
			pathname: route.pathname,
			changefreq: route.changefreq,
			priority: route.priority,
			lastmod: null
		})),
		...postRoutes
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
	.map((route) => {
		const loc = escapeXml(createAbsoluteUrl(normalizedOrigin, route.pathname));
		const lastmod = route.lastmod ? `    <lastmod>${escapeXml(route.lastmod)}</lastmod>\n` : '';

		return `  <url>
    <loc>${loc}</loc>
${lastmod}    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
	})
	.join('\n')}
</urlset>`;

	return new Response(sitemap.trim(), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
