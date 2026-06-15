<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { cn } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils';
	import * as Select from '$lib/components/ui/select';
	import { TRAITS } from '@convex/constants/rules';
	import type { TraitId } from '@convex/schemas/rules';

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);

	let evolution_trait = $derived(character?.feature_choices['evolution_trait']?.[0]);
</script>

{#if derived_character_data && derived_character_data.primary_class}
	<div class="flex flex-col items-center gap-2 px-4 text-center">
		<p class="text-xs text-muted-foreground">
			{@html renderMarkdown(
				`**${derived_character_data.primary_class.hope_feature.title}**: ` +
					derived_character_data.primary_class.hope_feature.description_html
			)}
		</p>
		{#if derived_character_data.hasEvolutionHopeFeature && characterCtx.canEdit}
			<Select.Root
				type="single"
				value={evolution_trait}
				onValueChange={(value) => {
					if (!character) return;
					character.feature_choices['evolution_trait'] = [value || ''];
					if (value && character.chosen_beastform) {
						character.chosen_beastform.apply_beastform_bonuses = true;
					}
				}}
			>
				<Select.Trigger
					class={cn(
						'w-min max-w-xs text-xs',
						evolution_trait && 'border border-accent/50 text-accent'
					)}
				>
					<p class="truncate">
						{evolution_trait ? TRAITS[evolution_trait as TraitId]?.name : 'None'}
					</p>
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="">None</Select.Item>
					{#each Object.keys(TRAITS) as traitId}
						{@const trait = TRAITS[traitId as TraitId]}
						<Select.Item value={traitId}>{trait.name}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{/if}
	</div>
{/if}
