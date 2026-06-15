<script lang="ts">
	import type { SubclassCard as SubclassCardData } from '@convex/schemas/compendium';
	import type { AllTierLevelUpOptionId } from '@convex/schemas/rules';
	import * as Select from '$lib/components/ui/select/';
	import SubclassCard from '$lib/components/compendium-items/cards/subclass-card.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		selected_upgrade = $bindable(),
		option_id,
		options_used,
		width
	}: {
		selected_upgrade: 'primary' | 'secondary' | null | undefined;
		option_id: AllTierLevelUpOptionId | null | undefined;
		options_used: Record<AllTierLevelUpOptionId, number>;
		width: number;
	} = $props();

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const compendium = $derived(characterCtx.character_compendium);
	const primary_class = $derived(derived_character_data?.primary_class);
	const primary_subclass = $derived(derived_character_data?.primary_subclass);
	const secondary_class = $derived(derived_character_data?.secondary_class);
	const secondary_subclass = $derived(derived_character_data?.secondary_subclass);

	function get_card_to_show(): SubclassCardData | null {
		if (selected_upgrade !== 'primary' || !primary_subclass || !character) return null;

		if (
			options_used['tier_3_subclass_upgrade'] >= 1 &&
			options_used['tier_4_subclass_upgrade'] >= 1
		) {
			const tier_3_subclass_upgrade_level = Object.entries(character.level_up_choices).findIndex(
				([, choice]) =>
					choice.A?.option_id === 'tier_3_subclass_upgrade' ||
					choice.B?.option_id === 'tier_3_subclass_upgrade'
			);
			const tier_4_subclass_upgrade_level = Object.entries(character.level_up_choices).findIndex(
				([, choice]) =>
					choice.A?.option_id === 'tier_4_subclass_upgrade' ||
					choice.B?.option_id === 'tier_4_subclass_upgrade'
			);

			if (
				(option_id === 'tier_4_subclass_upgrade' &&
					tier_3_subclass_upgrade_level < tier_4_subclass_upgrade_level) ||
				(option_id === 'tier_3_subclass_upgrade' &&
					tier_4_subclass_upgrade_level < tier_3_subclass_upgrade_level)
			) {
				return {
					type: 'mastery' as const,
					...primary_subclass,
					...primary_subclass.mastery_card
				};
			}
		}

		return {
			type: 'specialization' as const,
			...primary_subclass,
			...primary_subclass.specialization_card
		};
	}
</script>

{#if character && compendium}
	<div class="flex flex-col gap-2 rounded-md bg-primary/50 p-2" bind:clientWidth={width}>
		<p class="px-2 py-1 text-xs text-muted-foreground italic">
			Take the next card for your subclass. If you have only the foundation card, take a
			specialization; if you have a specialization already, take a mastery.
		</p>

		<Select.Root
			value={selected_upgrade || ''}
			type="single"
			onValueChange={(value) => {
				if (value === '') selected_upgrade = null;
				else {
					selected_upgrade = value as 'primary' | 'secondary';
				}
			}}
		>
			<Select.Trigger class="w-full truncate" highlighted={!selected_upgrade}>
				{selected_upgrade === 'primary'
					? `${primary_class?.title ?? ''} • ${primary_subclass?.title ?? ''}`
					: selected_upgrade === 'secondary'
						? `${secondary_class?.title ?? ''} • ${secondary_subclass?.title ?? ''}`
						: 'Select a subclass to upgrade'}
			</Select.Trigger>
			<Select.Content class="rounded-md" align="start">
				<div style="max-width: {width}px;" class="p-2">
					<Select.Item value="" class="justify-center text-sm hover:cursor-pointer">
						-- none selected --
					</Select.Item>
					<Select.Label>Choose a subclass to upgrade</Select.Label>
					{#if primary_subclass && primary_class}
						<Select.Item value="primary">
							{primary_class.title} • {primary_subclass.title}
						</Select.Item>
					{/if}
					{#if secondary_subclass && secondary_class}
						<Select.Item value="secondary">
							{secondary_class.title} • {secondary_subclass.title}
						</Select.Item>
					{/if}
				</div>
			</Select.Content>
		</Select.Root>

		{#if selected_upgrade && primary_subclass}
			<p class="p-2">
				{#if selected_upgrade === 'primary'}
					{@const card_to_show = get_card_to_show()}
					{#if card_to_show}
						<SubclassCard {compendium} card={card_to_show} />
					{/if}
				{:else if selected_upgrade === 'secondary' && secondary_subclass}
					<SubclassCard
						{compendium}
						card={{
							type: 'specialization',
							...secondary_subclass,
							...secondary_subclass.specialization_card
						}}
					/>
				{/if}
			</p>
		{/if}
	</div>
{/if}
