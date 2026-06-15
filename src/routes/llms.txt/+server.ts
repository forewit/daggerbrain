import { env } from '$env/dynamic/public';
import {
	PUBLIC_PAGES,
	SITE_DESCRIPTION,
	SITE_NAME,
	createAbsoluteUrl,
	normalizePublicOrigin
} from '$lib/components/seo/seo';
import type { RequestHandler } from './$types';

const PRIVATE_CONTENT_NOTE =
	'Private user content such as individual character sheets, campaigns, encounters, homebrew drafts, invite links, and account pages should not be indexed.';

export const GET: RequestHandler = async () => {
	const origin = normalizePublicOrigin(env.PUBLIC_ORIGIN);

	const body = [
		`# ${SITE_NAME}`,
		'',
		SITE_DESCRIPTION,
		'',
		'## Public pages',
		...PUBLIC_PAGES.map((page) => `- ${createAbsoluteUrl(origin, page.pathname)}: ${page.summary}`),
		'',
		'## Private content',
		PRIVATE_CONTENT_NOTE
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
