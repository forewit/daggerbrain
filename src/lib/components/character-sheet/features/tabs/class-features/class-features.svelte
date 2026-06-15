<script lang="ts">
	import { capitalize } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import BardFeatures from './bard-features.svelte';
	import GuardianFeatures from './guardian-features.svelte';
	import SeraphFeatures from './seraph-features.svelte';
	import WizardFeatures from './wizard-features.svelte';

	const characterCtx = getCharacterContext();
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const primary_class = $derived(derived_character_data?.primary_class);
	const secondary_class = $derived(derived_character_data?.secondary_class);
</script>

{#if derived_character_data}
	<div class="flex flex-col gap-4">
		{#if derived_character_data.hasRallyClassFeature}
			<BardFeatures />
		{/if}

		{#if derived_character_data.hasUnstoppableClassFeature}
			<GuardianFeatures />
		{/if}

		{#if derived_character_data.hasPrayerDiceClassFeature}
			<SeraphFeatures />
		{/if}

		{#if derived_character_data.hasStrangePatternsClassFeature}
			<WizardFeatures />
		{/if}

		{#each primary_class?.class_features as feature}
			<div class="relative text-sm">
				<p class="pb-2 text-sm font-medium">{feature.title}</p>
				<div class="flex flex-col gap-2 pl-2 text-xs leading-relaxed text-muted-foreground">
					{@html renderMarkdown(feature.description_html)}
				</div>
			</div>
		{/each}

		{#each secondary_class?.class_features as feature}
			<div class="relative text-sm">
				<p class="pb-2 text-sm font-medium">{feature.title}</p>
				<div class="flex flex-col gap-2 pl-2 text-xs leading-relaxed text-muted-foreground">
					{@html renderMarkdown(feature.description_html)}
				</div>
			</div>
		{/each}

		{#if (derived_character_data.primary_subclass && derived_character_data.primary_subclass.spellcast_trait) || (derived_character_data.secondary_subclass && derived_character_data.secondary_subclass.spellcast_trait)}
			<div class="relative flex items-center gap-1 text-xs">
				<p class="font-medium">Spellcast Trait:</p>
				<p class="text-xs text-muted-foreground">
					{[
						capitalize(derived_character_data.primary_subclass?.spellcast_trait ?? ''),
						capitalize(derived_character_data.secondary_subclass?.spellcast_trait ?? '')
					]
						.filter((str) => !!str?.trim())
						.join(', ')}
				</p>
			</div>
		{/if}
	</div>
{/if}
