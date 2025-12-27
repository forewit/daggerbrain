<script lang="ts">
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import HomebrewCommunityCardForm from '$lib/components/app/homebrew/homebrew-community-card-form.svelte';
	import CommunityCard from '$lib/components/app/cards/full-cards/community-card.svelte';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';

	let { data } = $props();

	const homebrew = getHomebrewContext();

	// Get the uid from the layout data
	let uid = $derived(data.uid);

	// Get community card directly from homebrew context
	let communityCard = $derived.by(() => {
		if (!uid) return null;
		return homebrew.community_cards[uid] || null;
	});

	// Check if community card is saved
	let isSaved = $derived.by(() => {
		if (!uid || !communityCard) return false;
		return homebrew.isSaved('community_cards', uid);
	});

	// Check if community card is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !communityCard) {
			error(404, `Community card with UID "${uid}" not found`);
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
{:else if communityCard}
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
					<h1 class="text-2xl font-semibold">{communityCard.title}</h1>
					<p class="text-sm text-muted-foreground">Editing Community Card</p>
				</div>

				<!-- Main Content: Preview and Edit Side by Side -->
				<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
					<!-- Preview Section -->
					<div class="flex-1 p-6">
						<h2 class="mb-2 text-lg font-semibold">Preview</h2>
						<p class="mb-4 text-xs text-muted-foreground">{isSaved ? 'Saved' : 'Not Saved'}</p>
						<CommunityCard card={communityCard} />
					</div>

					<!-- Edit Section -->
					<div class="w-full lg:w-auto lg:min-w-[300px] lg:max-w-[300px]">
						<div class="rounded-lg border bg-card p-6">
							<h2 class="mb-4 text-lg font-semibold">Edit</h2>
							<HomebrewCommunityCardForm bind:communityCard {uid} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
