<script lang="ts">
	import type { AncestryCard } from '@convex/schemas/compendium';
	import AncestryCardComponent from '$lib/components/compendium-items/cards/ancestry-card.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getSourcesContext } from '$lib/state/sources.svelte';
	import { merge_compendium_content } from '$lib/utils';

	let { card }: { card: AncestryCard } = $props();

	const homebrew = getHomebrewContext();
	const sources = getSourcesContext();

	const previewCompendium = $derived(
		merge_compendium_content(sources.compendium, homebrew.compendium ?? merge_compendium_content())
	);

	let mixed_ancestry_choices = $state({});
	let choices = $state({});
	let tokens = $state(0);
	let experiences = ['Example experience 1', 'Example experience 2'];
</script>

<div class="flex max-w-[300px] min-w-[300px]">
	<AncestryCardComponent
		enable_tokens
		enable_choices
		enable_mixed_ancestry
		bind:choices
		bind:tokens
		bind:mixed_ancestry_choices
		{card}
		{experiences}
		compendium={previewCompendium}
		variant="card"
	/>
</div>
