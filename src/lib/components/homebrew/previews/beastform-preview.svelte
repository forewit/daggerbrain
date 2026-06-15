<script lang="ts">
	import type { Beastform } from '@convex/schemas/compendium';
	import BeastformComponent from '$lib/components/compendium-items/beastform.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getSourcesContext } from '$lib/state/sources.svelte';
	import { merge_compendium_content } from '$lib/utils';

	let {
		beastform,
		beastformId
	}: {
		beastform: Beastform;
		beastformId?: string;
	} = $props();

	const homebrew = getHomebrewContext();
	const sources = getSourcesContext();
	const previewCompendium = $derived(
		merge_compendium_content(sources.compendium, homebrew.compendium ?? merge_compendium_content())
	);
</script>

<div
	class="flex max-w-[420px] min-w-[300px] flex-col gap-4 rounded-xl border bg-background p-4 shadow-sm"
>
	<BeastformComponent
		{beastform}
		compendium={previewCompendium}
		excludedBeastformId={beastformId}
	/>
</div>
