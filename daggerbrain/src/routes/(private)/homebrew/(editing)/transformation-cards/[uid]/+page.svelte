<script lang="ts">
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import HomebrewTransformationCardForm from '$lib/components/app/homebrew/homebrew-transformation-card-form.svelte';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';

	let { data } = $props();

	const homebrew = getHomebrewContext();

	// Get the uid from the layout data
	let uid = $derived(data.uid);

	// Get transformation card directly from homebrew context - auto-save is handled by the context
	let transformationCard = $derived.by(() => {
		if (!uid) return null;
		return homebrew.transformation_cards[uid] || null;
	});

	// Check if transformation card is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !transformationCard) {
			error(404, `Transformation card with UID "${uid}" not found`);
		}
	});
</script>

{#if homebrew.loading}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<!-- Keep the page height so the footer doesn't jump while loading -->
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	</div>
{:else if transformationCard}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<div class="w-full max-w-6xl space-y-4 px-4 py-4">
				<!-- Header -->
				<div class="flex flex-col gap-1">
					<h1 class="text-2xl font-semibold">{transformationCard.title}</h1>
					<p class="text-sm text-muted-foreground">Editing Transformation Card</p>
				</div>

				<!-- Main Content: Preview and Edit Side by Side -->
				<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
					<!-- Preview Section -->
					<div class="flex-1 rounded-lg border bg-card p-6">
						<h2 class="mb-4 text-lg font-semibold">Preview</h2>

						<div class="flex flex-col gap-6">
							<!-- Description -->
							{#if transformationCard.description_html.trim().length > 0}
								<div class="text-sm">{@html transformationCard.description_html}</div>
							{/if}

							<!-- Image -->
							{#if transformationCard.image_url}
								<div class="rounded-lg border bg-muted p-2">
									<img src={transformationCard.image_url} alt={transformationCard.title} class="w-full rounded" />
								</div>
							{/if}

							<!-- Artist -->
							{#if transformationCard.artist_name}
								<p class="text-xs text-muted-foreground">Artist: {transformationCard.artist_name}</p>
							{/if}

							<!-- Features -->
							{#if transformationCard.features.length > 0}
								<div class="rounded-lg border bg-primary/5 px-4 py-3">
									<div class="flex items-center justify-between">
										<p class="text-sm font-medium">Features</p>
									</div>
									<div class="mt-3 space-y-3">
										{#each transformationCard.features as feature}
											<div class="border-l-2 border-accent/30 pl-3">
												<p class="text-sm font-medium text-muted-foreground">{feature.title}</p>
												<p class="mt-0.5 text-xs text-muted-foreground">{@html feature.description_html}</p>
											</div>
										{/each}
									</div>
								</div>
							{:else}
								<div class="rounded-lg border bg-muted/50 px-4 py-3">
									<p class="text-sm text-muted-foreground italic">No features</p>
								</div>
							{/if}
						</div>
					</div>

					<!-- Edit Section -->
					<div class="w-full lg:w-auto lg:min-w-[300px] lg:max-w-[300px]">
						<div class="rounded-lg border bg-card p-6">
							<h2 class="mb-4 text-lg font-semibold">Edit</h2>
							<HomebrewTransformationCardForm bind:transformationCard />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
