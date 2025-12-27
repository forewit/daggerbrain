<script lang="ts">
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import HomebrewArmorForm from '$lib/components/app/homebrew/homebrew-armor-form.svelte';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';

	let { data } = $props();

	const homebrew = getHomebrewContext();

	// Get the uid from the layout data
	let uid = $derived(data.uid);

	// Get armor directly from homebrew context
	let armor = $derived.by(() => {
		if (!uid) return null;
		return homebrew.armor[uid] || null;
	});

	// Check if armor is saved
	let isSaved = $derived.by(() => {
		if (!uid || !armor) return false;
		return homebrew.isSaved('armor', uid);
	});

	// Check if armor is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !armor) {
			error(404, `Armor with UID "${uid}" not found`);
		}
	});

	// Helper to convert level requirement to tier
	function levelToTier(level: number): number {
		if (level >= 8) return 4;
		if (level >= 5) return 3;
		if (level >= 2) return 2;
		return 1;
	}
</script>

{#if homebrew.loading}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<!-- Keep the page height so the footer doesn't jump while loading -->
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	</div>
{:else if armor}
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
					<h1 class="text-2xl font-semibold">{armor.title}</h1>
					<p class="text-sm text-muted-foreground">Editing Armor</p>
				</div>

				<!-- Main Content: Preview and Edit Side by Side -->
				<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
					<!-- Preview Section -->
					<div class="flex-1 p-6">
						<h2 class="mb-2 text-lg font-semibold">Preview</h2>
						<p class="mb-4 text-xs text-muted-foreground">{isSaved ? 'Saved' : 'Not Saved'}</p>

						<div class="flex flex-col gap-6">
							<!-- Description -->
							{#if armor.description_html.trim().length > 0}
								<div class="text-sm">{@html armor.description_html}</div>
							{/if}

							<!-- Stats Table -->
							<table class="w-full border-collapse text-sm">
								<tbody>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Tier</th>
										<td class="py-2 text-right">{levelToTier(armor.level_requirement)}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Max Armor</th>
										<td class="py-2 text-right">{armor.max_armor}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Major Threshold</th>
										<td class="py-2 text-right">{armor.damage_thresholds.major}</td>
									</tr>
									<tr>
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Severe Threshold</th>
										<td class="py-2 text-right">{armor.damage_thresholds.severe}</td>
									</tr>
								</tbody>
							</table>

							<!-- Features -->
							{#if armor.features.length > 0}
								<div class="rounded-lg border bg-primary/5 px-4 py-3">
									<div class="flex items-center justify-between">
										<p class="text-sm font-medium">Features</p>
									</div>
									<div class="mt-3 space-y-3">
										{#each armor.features as feature}
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
							<HomebrewArmorForm bind:armor {uid} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
