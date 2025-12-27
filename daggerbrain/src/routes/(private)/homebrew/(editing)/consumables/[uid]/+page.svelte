<script lang="ts">
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import HomebrewConsumableForm from '$lib/components/app/homebrew/homebrew-consumable-form.svelte';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';

	let { data } = $props();

	const homebrew = getHomebrewContext();

	// Get the uid from the layout data
	let uid = $derived(data.uid);

	// Get consumable directly from homebrew context
	let consumable = $derived.by(() => {
		if (!uid) return null;
		return homebrew.consumables[uid] || null;
	});

	// Check if consumable is saved
	let isSaved = $derived.by(() => {
		if (!uid || !consumable) return false;
		return homebrew.isSaved('consumables', uid);
	});

	// Check if consumable is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !consumable) {
			error(404, `Consumable with UID "${uid}" not found`);
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
{:else if consumable}
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
					<h1 class="text-2xl font-semibold">{consumable.title}</h1>
					<p class="text-sm text-muted-foreground">Editing Consumable</p>
				</div>

				<!-- Main Content: Preview and Edit Side by Side -->
				<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
					<!-- Preview Section -->
					<div class="flex-1 p-6">
						<h2 class="mb-2 text-lg font-semibold">Preview</h2>
						<p class="mb-4 text-xs text-muted-foreground">{isSaved ? 'Saved' : 'Not Saved'}</p>

						<div class="flex flex-col gap-6">
							<!-- Description -->
							{#if consumable.description_html.trim().length > 0}
								<div class="text-sm">{@html consumable.description_html}</div>
							{/if}
						</div>
					</div>

					<!-- Edit Section -->
					<div class="w-full lg:w-auto lg:min-w-[300px] lg:max-w-[300px]">
						<div class="rounded-lg border bg-card p-6">
							<h2 class="mb-4 text-lg font-semibold">Edit</h2>
							<HomebrewConsumableForm bind:consumable {uid} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
