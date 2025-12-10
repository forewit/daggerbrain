<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import BardFeatures from './bard-features.svelte';
	import DruidFeatures from './druid-features.svelte';
	import type { CharacterClass } from '$lib/types/compendium-types';

	let {
		onBeastformCatalogClick = () => {}
	}: {
		onBeastformCatalogClick?: () => void;
	} = $props();

	const context = getCharacterContext();
	const primary_class = $derived(context.primary_class);
	const secondary_class = $derived(context.secondary_class);
</script>

{#snippet class_features(character_class: CharacterClass | null)}
	{#if character_class?.compendium_id === 'bard'}
		<BardFeatures />
	{/if}
	{#if character_class?.compendium_id === 'druid'}
		<DruidFeatures {onBeastformCatalogClick} />
	{/if}
	{#each character_class?.class_features as feature}
		<div class="relative text-sm">
			<p class="pb-2 text-sm font-medium">{feature.title}</p>
			<div class="flex flex-col gap-2 pl-2 text-xs leading-relaxed text-muted-foreground">
				{@html feature.description_html}
			</div>
		</div>
	{/each}
{/snippet}

<div class="flex flex-col gap-4">
	{@render class_features(primary_class)}
	{@render class_features(secondary_class)}
</div>
