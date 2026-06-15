<script lang="ts">
	import type { Component } from 'svelte';

	let {
		Content,
		articleElement = $bindable()
	}: {
		Content: Component;
		articleElement: HTMLElement | null;
	} = $props();
</script>

<article bind:this={articleElement} class="post-article">
	<Content />
</article>

<style>
	.post-article :global(h2) {
		margin-top: 2.5rem;
		margin-bottom: 0;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid rgb(from var(--border) r g b / 0.7);
		font-family: var(--font-eveleth);
		font-size: var(--text-xl);
		font-weight: var(--font-weight-normal);
		line-height: var(--text-2xl--line-height);
		color: var(--primary);
	}

	.post-article :global(h3) {
		margin-top: 2rem;
		margin-bottom: 0;
		font-family: var(--font-sans);
		font-size: var(--text-lg);
		font-weight: var(--font-weight-bold);
		line-height: var(--text-xl--line-height);
		color: var(--foreground);
	}

	.post-article :global(h4) {
		margin-top: 1.5rem;
		margin-bottom: 0;
		font-family: var(--font-sans);
		font-size: var(--text-lg);
		font-weight: var(--font-weight-medium);
		line-height: var(--text-lg--line-height);
		color: var(--foreground);
	}

	.post-article :global(p) {
		margin: 1rem 0 0;
		font-family: var(--font-sans);
		font-size: var(--text-base);
		font-weight: var(--font-weight-normal);
		line-height: calc(var(--spacing) * 6);
		color: var(--foreground);
	}

	.post-article :global(blockquote) {
		margin: 1rem 0.5rem;
		padding: 0.875rem 1rem;
		border-left: 2px solid var(--border);
		background: rgb(from var(--card) r g b / 0.3);
		color: var(--muted-foreground);
	}

	.post-article :global(blockquote p:first-child) {
		margin-top: 0;
	}

	.post-article :global(blockquote p:last-child) {
		margin-bottom: 0;
	}

	.post-article :global(blockquote p) {
		color: var(--muted-foreground);
	}

	.post-article :global(ul),
	.post-article :global(ol) {
		margin-top: 0.75rem;
		margin-bottom: 1rem;
	}

	.post-article :global(ul) {
		padding-left: 1.5rem;
		list-style: disc;
	}

	.post-article :global(ol) {
		padding-left: 1.5rem;
		list-style: decimal;
	}

	.post-article :global(li) {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		font-weight: var(--font-weight-normal);
		line-height: calc(var(--spacing) * 6);
	}

	.post-article :global(a) {
		color: var(--primary);
		text-decoration: underline;
	}

	.post-article :global(a:hover) {
		color: var(--accent);
	}

	.post-article :global(strong) {
		font-weight: var(--font-weight-semibold);
		color: var(--foreground);
	}
</style>
