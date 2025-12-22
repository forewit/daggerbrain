<script lang="ts">
	import type { DomainIds } from '$lib/types/compendium-types';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import HomebrewDomainCardForm from '$lib/components/app/homebrew/homebrew-domain-card-form.svelte';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';

	let { data } = $props();

	const homebrew = getHomebrewContext();

	// Get the uid from the layout data
	let uid = $derived(data.uid);

	// Get domain card by searching across all domains
	let domainCard = $derived.by(() => {
		if (!uid) return null;
		for (const domainId of Object.keys(homebrew.domain_cards) as DomainIds[]) {
			if (homebrew.domain_cards[domainId][uid]) {
				return homebrew.domain_cards[domainId][uid];
			}
		}
		return null;
	});

	// Check if domain card is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !domainCard) {
			error(404, `Domain card with UID "${uid}" not found`);
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
{:else if domainCard}
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
					<h1 class="text-2xl font-semibold">{domainCard.title}</h1>
					<p class="text-sm text-muted-foreground">Editing Domain Card ({domainCard.domain_id})</p>
				</div>

				<!-- Main Content: Preview and Edit Side by Side -->
				<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
					<!-- Preview Section -->
					<div class="flex-1 rounded-lg border bg-card p-6">
						<h2 class="mb-4 text-lg font-semibold">Preview</h2>

						<div class="flex flex-col gap-6">
							<!-- Image -->
							{#if domainCard.image_url}
								<div class="rounded-lg border bg-muted p-2">
									<img src={domainCard.image_url} alt={domainCard.title} class="w-full rounded" />
								</div>
							{/if}

							<!-- Artist -->
							{#if domainCard.artist_name}
								<p class="text-xs text-muted-foreground">Artist: {domainCard.artist_name}</p>
							{/if}

							<!-- Stats Table -->
							<table class="w-full border-collapse text-sm">
								<tbody>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Domain</th>
										<td class="py-2 text-right">{domainCard.domain_id}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Category</th>
										<td class="py-2 text-right">{domainCard.category}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Level Requirement</th>
										<td class="py-2 text-right">{domainCard.level_requirement} (Tier {levelToTier(domainCard.level_requirement)})</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Recall Cost</th>
										<td class="py-2 text-right">{domainCard.recall_cost}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Uses Tokens</th>
										<td class="py-2 text-right">{domainCard.tokens ? 'Yes' : 'No'}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Applies in Vault</th>
										<td class="py-2 text-right">{domainCard.applies_in_vault ? 'Yes' : 'No'}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Forced in Loadout</th>
										<td class="py-2 text-right">{domainCard.forced_in_loadout ? 'Yes' : 'No'}</td>
									</tr>
									<tr>
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Forced in Vault</th>
										<td class="py-2 text-right">{domainCard.forced_in_vault ? 'Yes' : 'No'}</td>
									</tr>
								</tbody>
							</table>

							<!-- Features -->
							{#if domainCard.features.length > 0}
								<div class="rounded-lg border bg-primary/5 px-4 py-3">
									<div class="flex items-center justify-between">
										<p class="text-sm font-medium">Features</p>
									</div>
									<div class="mt-3 space-y-3">
										{#each domainCard.features as feature}
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

							<!-- Choices -->
							{#if domainCard.choices.length > 0}
								<div class="rounded-lg border bg-primary/5 px-4 py-3">
									<div class="flex items-center justify-between">
										<p class="text-sm font-medium">Choices</p>
									</div>
									<div class="mt-3 space-y-2">
										{#each domainCard.choices as choice}
											<div class="border-l-2 border-accent/30 pl-3">
												<p class="text-xs text-muted-foreground">
													{choice.choice_id} ({choice.type}, max: {choice.max})
												</p>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Edit Section -->
					<div class="w-full lg:w-auto lg:min-w-[300px] lg:max-w-[300px]">
						<div class="rounded-lg border bg-card p-6">
							<h2 class="mb-4 text-lg font-semibold">Edit</h2>
							<HomebrewDomainCardForm bind:domainCard />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
