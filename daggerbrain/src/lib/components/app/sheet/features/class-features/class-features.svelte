<script lang="ts">
	import { capitalize } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils/markdown';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import BardFeatures from './bard-features.svelte';
	import type { CharacterClass } from '$lib/types/compendium-types';
	import GuardianFeatures from './guardian-features.svelte';
	import SeraphFeatures from './seraph-features.svelte';
	import WizardFeatures from './wizard-features.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	const compendium = getCompendiumContext();
	const context = getCharacterContext();
	const primary_class = $derived(context.primary_class);
	const secondary_class = $derived(context.secondary_class);
</script>

{#snippet class_features(character_class: CharacterClass | null)}
	{#if character_class?.compendium_id === compendium.classes.bard.compendium_id}
		<BardFeatures />
	{/if}
	{#if character_class?.compendium_id === compendium.classes.guardian.compendium_id}
		<GuardianFeatures />
	{/if}
	{#if character_class?.compendium_id === compendium.classes.seraph.compendium_id}
		<SeraphFeatures />
	{/if}
	{#if character_class?.compendium_id === compendium.classes.wizard.compendium_id}
		<WizardFeatures />
	{/if}

	{#each character_class?.class_features as feature}
		<div class="relative text-sm">
			<p class="pb-2 text-sm font-medium">{feature.title}</p>
			<div class="flex flex-col gap-2 pl-2 text-xs leading-relaxed text-muted-foreground">
				{@html renderMarkdown(feature.description_html)}
			</div>
		</div>
	{/each}
{/snippet}

<div class="flex flex-col gap-4">
	{@render class_features(primary_class)}
	{@render class_features(secondary_class)}
	{#if (context.primary_subclass && context.primary_subclass.foundation_card.spellcast_trait) || (context.secondary_subclass && context.secondary_subclass.foundation_card.spellcast_trait)}
		<div class="relative flex items-center gap-1 text-xs">
			<p class="font-medium">Spellcast Trait:</p>
			<p class="text-xs text-muted-foreground">
				{[
					capitalize(context.primary_subclass?.foundation_card.spellcast_trait ?? ''),
					capitalize(context.secondary_subclass?.foundation_card.spellcast_trait ?? '')
				]
					.filter((str) => !!str?.trim())
					.join(', ')}
			</p>
		</div>
	{/if}
</div>
