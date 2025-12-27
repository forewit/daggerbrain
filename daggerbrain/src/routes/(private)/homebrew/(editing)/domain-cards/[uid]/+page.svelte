<script lang="ts">
	import type { DomainIds } from '$lib/types/compendium-types';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import HomebrewDomainCardForm from '$lib/components/app/homebrew/homebrew-domain-card-form.svelte';
	import DomainCard from '$lib/components/app/cards/full-cards/domain-card.svelte';
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

	// Get domain ID for this card
	let domainId = $derived.by(() => {
		if (!uid) return null;
		for (const id of Object.keys(homebrew.domain_cards) as DomainIds[]) {
			if (homebrew.domain_cards[id][uid]) {
				return id;
			}
		}
		return null;
	});

	// Check if domain card is saved
	let isSaved = $derived.by(() => {
		if (!uid || !domainCard || !domainId) return false;
		return homebrew.isSaved('domain_cards', `${domainId}:${uid}`);
	});

	// Check if domain card is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !domainCard) {
			error(404, `Domain card with UID "${uid}" not found`);
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
					<div class="flex-1 p-6">
						<h2 class="mb-2 text-lg font-semibold">Preview</h2>
						<p class="mb-4 text-xs text-muted-foreground">{isSaved ? 'Saved' : 'Not Saved'}</p>
						<DomainCard card={domainCard} />
					</div>

					<!-- Edit Section -->
					<div class="w-full lg:w-auto lg:min-w-[300px] lg:max-w-[300px]">
						<div class="rounded-lg border bg-card p-6">
							<h2 class="mb-4 text-lg font-semibold">Edit</h2>
							{#if domainId}
							<HomebrewDomainCardForm bind:domainCard />
						{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
