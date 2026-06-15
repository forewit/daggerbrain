<script lang="ts">
	import type { DomainCard } from '@convex/schemas/compendium';
	import DomainCardComponent from '$lib/components/compendium-items/cards/domain-card.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getSourcesContext } from '$lib/state/sources.svelte';
	import { merge_compendium_content } from '$lib/utils';

	let { card }: { card: DomainCard } = $props();

	const homebrew = getHomebrewContext();
	const sources = getSourcesContext();

	const previewCompendium = $derived(
		merge_compendium_content(sources.compendium, homebrew.compendium ?? merge_compendium_content())
	);

	let choices = $state({});
	let tokens = $state(0);
	let experiences = ['Example experience 1', 'Example experience 2'];
</script>

<div class="flex max-w-[300px] min-w-[300px]">
	<DomainCardComponent
		enable_choices
		enable_tokens
		bind:choices
		bind:tokens
		{card}
		{experiences}
		compendium={previewCompendium}
		variant="card"
	/>
</div>
