import {
	DEFAULT_OG_IMAGE_PATH,
	SITE_LOCALE,
	SITE_NAME,
	DEFAULT_ROBOTS
} from '$lib/components/seo/seo';
import { createAbsoluteUrl } from '$lib/components/seo/seo';
import { error } from '@sveltejs/kit';
import { validatePostFrontmatter } from '$lib/server/posts';
import type { PostAuthor, PostHeading } from '$lib/server/posts';

export type ArticleSeo = {
	title: string;
	description: string;
	canonicalPath: string;
	imagePath?: string;
	author?: PostAuthor;
	publishedTime?: string;
	modifiedTime?: string;
};

export type ArticlePageSource = {
	sourcePath: string;
	metadata: unknown;
	rawSource: string | null | undefined;
	canonicalPath: string;
	seoTitle: string;
	notFoundMessage: string;
	slug?: string;
};

export type ArticlePagePost = {
	slug?: string;
	title: string;
	description: string;
	date: number;
	updated?: number;
	coverImage?: string;
	author: PostAuthor;
	headings: PostHeading[];
};

export type ArticlePageData = {
	post: ArticlePagePost;
	seo: ReturnType<typeof buildArticleSeo>['seo'];
	jsonLd: ReturnType<typeof buildArticleSeo>['jsonLd'];
};

function slugifyHeading(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

export function extractArticleHeadings(source: string): PostHeading[] {
	const withoutFrontmatter = source.replace(/^---[\s\S]*?---\s*/u, '');
	const withoutCodeFences = withoutFrontmatter.replace(/```[\s\S]*?```/g, '');
	const headingPattern = /^(#{2,6})\s+(.*)$/gm;
	const slugCounts = new Map<string, number>();
	const headings: PostHeading[] = [];

	for (const match of withoutCodeFences.matchAll(headingPattern)) {
		const hashes = match[1];
		const rawText = match[2]?.trim() ?? '';
		const text = rawText
			.replace(/\[(.*?)\]\(.*?\)/g, '$1')
			.replace(/[`*_~]/g, '')
			.trim();

		if (!text) {
			continue;
		}

		const baseId = slugifyHeading(text) || 'section';
		const duplicateCount = slugCounts.get(baseId) ?? 0;
		slugCounts.set(baseId, duplicateCount + 1);

		headings.push({
			id: duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount + 1}`,
			text,
			level: hashes.length
		});
	}

	return headings;
}

export function buildArticleSeo(rawOrigin: string, article: ArticleSeo) {
	const canonical = createAbsoluteUrl(rawOrigin, article.canonicalPath);
	const image = createAbsoluteUrl(rawOrigin, article.imagePath || DEFAULT_OG_IMAGE_PATH);

	return {
		seo: {
			title: article.title,
			description: article.description,
			robots: DEFAULT_ROBOTS,
			canonical,
			siteName: SITE_NAME,
			locale: SITE_LOCALE,
			type: 'article' as const,
			url: canonical,
			image,
			imageAlt: `${article.title} cover image`,
			article: article.publishedTime
				? {
						publishedTime: article.publishedTime,
						modifiedTime: article.modifiedTime,
						author: article.author?.name
					}
				: undefined
		},
		jsonLd: {
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: article.title,
			description: article.description,
			url: canonical,
			mainEntityOfPage: canonical,
			...(article.publishedTime ? { datePublished: article.publishedTime } : {}),
			...(article.modifiedTime ? { dateModified: article.modifiedTime } : {}),
			...(article.author
				? {
						author: {
							'@type': 'Person',
							name: article.author.name
						}
					}
				: {}),
			publisher: {
				'@type': 'Organization',
				name: 'Daggerbrain'
			},
			image: {
				'@type': 'ImageObject',
				url: image
			}
		}
	};
}

export function loadArticlePageData(rawOrigin: string, source: ArticlePageSource): ArticlePageData {
	if (!source.metadata || !source.rawSource) {
		error(404, source.notFoundMessage);
	}

	const article = validatePostFrontmatter(source.sourcePath, source.metadata);

	if (!article.published) {
		error(404, source.notFoundMessage);
	}

	const headings = extractArticleHeadings(source.rawSource);
	const publishedTime = new Date(article.date).toISOString();
	const modifiedTime = article.updated ? new Date(article.updated).toISOString() : undefined;
	const { seo, jsonLd } = buildArticleSeo(rawOrigin, {
		title: source.seoTitle,
		description: article.description,
		canonicalPath: source.canonicalPath,
		imagePath: article.coverImage,
		author: article.author,
		publishedTime,
		modifiedTime
	});

	return {
		post: {
			...(source.slug ? { slug: source.slug } : {}),
			title: article.title,
			description: article.description,
			date: article.date,
			updated: article.updated,
			coverImage: article.coverImage,
			author: article.author,
			headings
		},
		seo,
		jsonLd
	};
}
