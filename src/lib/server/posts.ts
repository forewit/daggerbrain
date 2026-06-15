import type { Component } from 'svelte';

export type PostAuthor = {
	name: string;
	role?: string;
	avatar?: string;
};

export type PostFrontmatter = {
	title: string;
	description: string;
	date: number;
	published: boolean;
	author: PostAuthor;
	updated?: number;
	coverImage?: string;
};

export type PostSummary = {
	slug: string;
	title: string;
	description: string;
	date: number;
	published: boolean;
	author: PostAuthor;
	updated?: number;
	coverImage?: string;
};

export type PostHeading = {
	id: string;
	text: string;
	level: number;
};

export type PostDetail = PostSummary & {
	Content: Component;
};

type PostMetadataModule = {
	metadata: PostFrontmatter;
};

type PostContentModule = {
	default: Component;
	metadata: PostFrontmatter;
};

export type PostMetadataEntry = [path: string, module: PostMetadataModule];
export type PostContentImporter = () => Promise<PostContentModule>;

const postMetadataModules = import.meta.glob<PostMetadataModule>('/src/posts/*.svx', {
	eager: true
});

const postContentModules = import.meta.glob<PostContentModule>('/src/posts/*.svx');

const PAGE_SIZE = 10;

function getSlugFromPath(path: string) {
	const match = /\/([^/]+)\.svx$/i.exec(path);

	if (!match?.[1]) {
		throw new Error(`Could not derive a post slug from "${path}".`);
	}

	return match[1];
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

function isOptionalString(value: unknown): value is string | undefined {
	return value === undefined || isNonEmptyString(value);
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function isOptionalFiniteNumber(value: unknown): value is number | undefined {
	return value === undefined || isFiniteNumber(value);
}

export function validatePostFrontmatter(path: string, metadata: unknown): PostFrontmatter {
	if (!metadata || typeof metadata !== 'object') {
		throw new Error(`Post "${path}" is missing frontmatter metadata.`);
	}

	const candidate = metadata as Record<string, unknown>;
	const author = candidate.author as Record<string, unknown> | undefined;

	if (!isNonEmptyString(candidate.title)) {
		throw new Error(`Post "${path}" is missing a valid "title" frontmatter field.`);
	}

	if (!isNonEmptyString(candidate.description)) {
		throw new Error(`Post "${path}" is missing a valid "description" frontmatter field.`);
	}

	if (!isFiniteNumber(candidate.date)) {
		throw new Error(`Post "${path}" is missing a valid "date" frontmatter field.`);
	}

	if (typeof candidate.published !== 'boolean') {
		throw new Error(`Post "${path}" is missing a valid "published" frontmatter field.`);
	}

	if (!author || typeof author !== 'object') {
		throw new Error(`Post "${path}" is missing a valid "author" frontmatter field.`);
	}

	if (!isNonEmptyString(author.name)) {
		throw new Error(`Post "${path}" is missing a valid "author.name" frontmatter field.`);
	}

	if (!isOptionalString(author.role)) {
		throw new Error(`Post "${path}" has an invalid "author.role" frontmatter field.`);
	}

	if (!isOptionalString(author.avatar)) {
		throw new Error(`Post "${path}" has an invalid "author.avatar" frontmatter field.`);
	}

	if (!isOptionalFiniteNumber(candidate.updated)) {
		throw new Error(`Post "${path}" has an invalid "updated" frontmatter field.`);
	}

	if (!isOptionalString(candidate.coverImage)) {
		throw new Error(`Post "${path}" has an invalid "coverImage" frontmatter field.`);
	}

	return {
		title: candidate.title,
		description: candidate.description,
		date: candidate.date,
		published: candidate.published,
		author: {
			name: author.name,
			role: author.role,
			avatar: author.avatar
		},
		updated: candidate.updated,
		coverImage: candidate.coverImage
	};
}

export function normalizePostSummary(path: string, metadata: unknown): PostSummary {
	const frontmatter = validatePostFrontmatter(path, metadata);

	return {
		slug: getSlugFromPath(path),
		title: frontmatter.title,
		description: frontmatter.description,
		date: frontmatter.date,
		published: frontmatter.published,
		author: frontmatter.author,
		updated: frontmatter.updated,
		coverImage: frontmatter.coverImage
	};
}

export function listPublishedPosts(
	entries: PostMetadataEntry[] = Object.entries(postMetadataModules) as PostMetadataEntry[]
) {
	return entries
		.map(([path, module]) => normalizePostSummary(path, module.metadata))
		.filter((post) => post.published)
		.sort((left, right) => right.date - left.date);
}

export function normalizePageNumber(page: string | null) {
	const parsed = Number.parseInt(page ?? '1', 10);

	if (!Number.isFinite(parsed) || parsed < 1) {
		return 1;
	}

	return parsed;
}

export function buildPageHref(page: number) {
	return page <= 1 ? '/posts' : `/posts?page=${page}`;
}

export function paginatePosts(posts: PostSummary[], page: number, pageSize = PAGE_SIZE) {
	const totalPosts = posts.length;
	const totalPages = totalPosts === 0 ? 1 : Math.ceil(totalPosts / pageSize);
	const currentPage = Math.min(Math.max(page, 1), totalPages);
	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;

	return {
		posts: posts.slice(start, end),
		pagination: {
			page: currentPage,
			pageSize,
			totalPosts,
			totalPages,
			hasPreviousPage: currentPage > 1,
			hasNextPage: currentPage < totalPages,
			previousPageHref: currentPage > 1 ? buildPageHref(currentPage - 1) : null,
			nextPageHref: currentPage < totalPages ? buildPageHref(currentPage + 1) : null
		}
	};
}

export async function getPublishedPostBySlug(
	slug: string,
	importers: Record<string, PostContentImporter> = postContentModules
): Promise<PostDetail | null> {
	const path = `/src/posts/${slug}.svx`;
	const importer = importers[path];

	if (!importer) {
		return null;
	}

	const module = await importer();
	const summary = normalizePostSummary(path, module.metadata);

	if (!summary.published) {
		return null;
	}

	return {
		...summary,
		Content: module.default
	};
}

export const postsPageSize = PAGE_SIZE;
