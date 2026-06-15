<script lang="ts">
	import { artMountains } from '$lib/assets/images';
	import Footer from '$lib/components/navigation/footer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { formatTimeAgo } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<div
		class="forest-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
	>
		<enhanced:img
			src={artMountains}
			alt=""
			fetchpriority="high"
			sizes="100vw"
			class="forest-fade-container h-full w-full object-cover object-bottom"
		/>
	</div>

	<main class="relative z-10 flex h-full w-full items-center justify-center p-4 pb-16">
		<div class="w-full max-w-6xl">
			<div class="mt-3 flex items-center gap-1 border-b pb-2.5">
				<h1 class="font-eveleth text-2xl font-bold">Posts</h1>
			</div>

			<section class="mx-auto mt-6 w-full" aria-label="Recent posts">
				<div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
					{#each data.posts as post}
						<a
							href={`/posts/${post.slug}`}
							class="group block overflow-hidden rounded bg-muted shadow transition-all hover:bg-accent-muted"
						>
							<div class="relative aspect-4/1 overflow-hidden border-b border-accent/20">
								<img
									src={post.coverImage || '/images/card/banner.webp'}
									alt=""
									aria-hidden="true"
									class="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
								></div>
								<div
									class="mr- absolute right-0 bottom-0 z-10 -mb-0.5 flex items-center gap-3 rounded-tl-xl bg-card px-3 pt-2 pb-2.5 text-xs shadow"
								>
									<span class="font-bold text-accent"
										><span class="mr-1 font-medium text-muted-foreground"
											>{formatTimeAgo(post.date)} by</span
										>{post.author.name}</span
									>
								</div>
							</div>

							<div class="p-4">
								<h2
									class="text-base leading-snug font-semibold text-foreground transition-colors group-hover:text-accent"
								>
									{post.title}
								</h2>
							</div>
						</a>
					{/each}
				</div>

				{#if data.pagination.totalPosts > 0}
					<nav class="mt-8 flex flex-wrap items-center justify-between gap-4">
						<p class="text-sm text-muted-foreground">
							Page {data.pagination.page} of {data.pagination.totalPages}
						</p>
						<div class="flex items-center gap-3">
							<Button
								href={data.pagination.previousPageHref ?? undefined}
								variant="outline"
								disabled={!data.pagination.hasPreviousPage}
							>
								Previous
							</Button>
							<Button
								href={data.pagination.nextPageHref ?? undefined}
								variant="outline"
								disabled={!data.pagination.hasNextPage}
							>
								Next
							</Button>
						</div>
					</nav>
				{/if}
			</section>
		</div>
	</main>
</div>
<Footer />

<style>
	.forest-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
