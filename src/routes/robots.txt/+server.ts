import { env } from '$env/dynamic/public';
import { normalizePublicOrigin } from '$lib/components/seo/seo';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const normalizedOrigin = normalizePublicOrigin(env.PUBLIC_ORIGIN);
	const body = ['User-agent: *', 'Disallow:', '', `Sitemap: ${normalizedOrigin}/sitemap.xml`].join(
		'\n'
	);

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
