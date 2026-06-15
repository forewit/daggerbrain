<script lang="ts">
	import { page } from '$app/state';
	import LoadError from '$lib/components/utility/load-error.svelte';
	import Loader from '$lib/components/utility/loader.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import type { Id } from '@convex/_generated/dataModel';

	let { children } = $props();

	const homebrew = getHomebrewContext();
	const typeParam = $derived(page.params.type);
	const uidParam = $derived(page.params.uid);

	const editableTypes = [
		'primary-weapon',
		'secondary-weapon',
		'armor',
		'beastform',
		'loot',
		'consumable',
		'class',
		'subclass',
		'domain',
		'adversary',
		'environment',
		'ancestry-cards',
		'domain-cards',
		'community-cards',
		'transformation-cards'
	];
	const isValidType = $derived(Boolean(typeParam && editableTypes.includes(typeParam)));
	const isLoading = $derived(homebrew.isLoading);

	const hasHomebrewItem = $derived.by(() => {
		if (!typeParam || !uidParam || !isValidType) return false;

		switch (typeParam) {
			case 'primary-weapon':
				return Boolean(homebrew.compendium?.primary_weapons[uidParam as Id<'primary_weapons'>]);
			case 'secondary-weapon':
				return Boolean(homebrew.compendium?.secondary_weapons[uidParam as Id<'secondary_weapons'>]);
			case 'armor':
				return Boolean(homebrew.compendium?.armor[uidParam as Id<'armor'>]);
			case 'beastform':
				return Boolean(homebrew.compendium?.beastforms[uidParam as Id<'beastforms'>]);
			case 'loot':
				return Boolean(homebrew.compendium?.loot[uidParam as Id<'loot'>]);
			case 'consumable':
				return Boolean(homebrew.compendium?.consumables[uidParam as Id<'consumables'>]);
			case 'class':
				return Boolean(homebrew.compendium?.classes[uidParam as Id<'classes'>]);
			case 'domain':
				return Boolean(homebrew.compendium?.domains[uidParam as Id<'domains'>]);
			case 'adversary':
				return Boolean(homebrew.compendium?.adversaries[uidParam as Id<'adversaries'>]);
			case 'environment':
				return Boolean(homebrew.compendium?.environments[uidParam as Id<'environments'>]);
			case 'subclass':
				return Boolean(homebrew.compendium?.subclasses[uidParam as Id<'subclasses'>]);
			case 'ancestry-cards':
				return Boolean(homebrew.compendium?.ancestry_cards[uidParam as Id<'ancestry_cards'>]);
			case 'domain-cards':
				return Boolean(homebrew.compendium?.domain_cards[uidParam as Id<'domain_cards'>]);
			case 'community-cards':
				return Boolean(homebrew.compendium?.community_cards[uidParam as Id<'community_cards'>]);
			case 'transformation-cards':
				return Boolean(
					homebrew.compendium?.transformation_cards[uidParam as Id<'transformation_cards'>]
				);
			default:
				return false;
		}
	});
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<Loader {isLoading} />

	{#if isLoading}
		<div></div>
	{:else if !typeParam || !uidParam || !isValidType || !hasHomebrewItem}
		<LoadError />
	{:else}
		{@render children?.()}
	{/if}
</div>
