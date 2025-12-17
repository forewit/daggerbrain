<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import * as Select from '$lib/components/ui/select';
	import { TRAITS } from '$lib/types/rules';
	import type { TraitIds } from '$lib/types/compendium-types';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();
	let druid_class_id = $derived(compendium.classes.druid.compendium_id);

	let is_druid = $derived(
		character &&
			(character.primary_class_id === druid_class_id ||
				character.secondary_class_id === druid_class_id)
	);

	let evolution_trait = $derived(
		character
			? ((character.class_choices[druid_class_id]?.['evolution_trait']?.[0] || '') as TraitIds | '')
			: ('' as TraitIds | '')
	);
</script>

{#if character}
	<div class={cn('flex flex-col justify-center gap-2 text-center', className)}>
		<button
			onclick={() => {
				character.marked_hope = 0;
			}}
			class="mx-auto w-min text-sm font-medium text-accent">HOPE</button
		>
		<div class="mb-2 flex flex-wrap justify-center gap-4">
			{#each Array(context.max_hope) as _, index}
				<button
					aria-label="hope-slot"
					class={cn(
						'aspect-square h-[16px] w-[16px] rotate-45 transform rounded-[2px] border border-accent transition-all duration-300',
						index < character.marked_hope ? 'bg-accent' : 'bg-transparent',
						character.marked_hope === context.max_hope &&
							'shadow-[0_0_8px_rgba(253,212,113,0.4),0_0_16px_rgba(253,212,113,0.2)]'
					)}
					onclick={() => {
						if (index + 1 === character.marked_hope) {
							character.marked_hope = Math.max(0, character.marked_hope - 1);
						} else {
							character.marked_hope = index + 1;
						}
					}}
					type="button"
				></button>
			{/each}
		</div>

		{#if context.primary_class}
			<div class=" flex justify-center px-4">
				<p class="mr-1 text-xs font-bold text-nowrap text-foreground">
					{context.primary_class.hope_feature.title}:
				</p>
				<div class="flex flex-col gap-2">
					<p class="text-left text-xs text-muted-foreground">
						{@html context.primary_class.hope_feature.description_html}
					</p>
					{#if is_druid}
						<Select.Root
							type="single"
							value={evolution_trait}
							onValueChange={(value) => {
								if (!character) return;
								if (!character.class_choices[druid_class_id])
									character.class_choices[druid_class_id] = {};
								character.class_choices[druid_class_id]['evolution_trait'] = [value || ''];
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
									{evolution_trait ? TRAITS[evolution_trait as TraitIds].name : 'None'}
								</p>
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">None</Select.Item>
								{#each Object.keys(TRAITS) as traitId}
									{@const trait = TRAITS[traitId as TraitIds]}
									<Select.Item value={traitId}>{trait.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/if}
				</div>
			</div>

			<!-- <p class="flex justify-center px-4 text-xs text-muted-foreground">
				<span class="mr-1 text-xs font-bold text-nowrap text-foreground"
					>{context.primary_class.hope_feature.title}:</span
				>
				<span class="text-left">{@html context.primary_class.hope_feature.description_html}</span>
			</p> -->
		{/if}
	</div>
{/if}
