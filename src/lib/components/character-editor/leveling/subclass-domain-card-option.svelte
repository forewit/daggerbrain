<script lang="ts">
	import { cn, renderMarkdown } from '$lib/utils';
	import type { DomainCard, SubclassLevelUpOption } from '@convex/schemas/compendium';
	import type { DomainCardId } from '@convex/schemas/rules';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import DomainCardSelector from './secondary-options/domain-card-selector.svelte';

	type ActiveSubclassDomainCardOption = SubclassLevelUpOption & {
		type: 'domain_card';
		option_id: string;
		short_title: string;
		title: string;
		max: number;
	};

	let {
		class: className = '',
		option,
		available_cards,
		previously_chosen_card_ids
	}: {
		class?: string;
		option: ActiveSubclassDomainCardOption;
		available_cards: Record<string, DomainCard>;
		previously_chosen_card_ids: DomainCardId[];
	} = $props();

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);

	function resolveSelectedCardId(cardId: string | undefined): DomainCardId | undefined {
		if (!cardId) return undefined;
		const card = available_cards[cardId];
		if (!card) return undefined;
		return {
			card_id: cardId,
			domain_id: card.domain_id
		};
	}

	function getSelectedCardIdAt(index: number): DomainCardId | undefined {
		return resolveSelectedCardId(character?.subclass_level_up_choices?.[option.option_id]?.[index]);
	}

	function updateSelectedCardAt(index: number, selected_card_id: DomainCardId | undefined) {
		if (!character) return;
		const existingChoices = character.subclass_level_up_choices?.[option.option_id] ?? [];
		const nextChoices = [...existingChoices];
		if (selected_card_id) {
			nextChoices[index] = selected_card_id.card_id;
		} else {
			nextChoices.splice(index, 1);
		}
		const normalizedChoices = nextChoices
			.filter((cardId): cardId is string => !!cardId)
			.slice(0, option.max);
		character.subclass_level_up_choices ??= {};
		character.subclass_level_up_choices[option.option_id] = normalizedChoices;
	}
</script>

{#if character}
	<div class={cn('flex flex-col gap-2 rounded-md bg-primary/50 p-2', className)}>
		<p class="px-2 text-xs text-muted-foreground italic">
			{@html renderMarkdown(`**${option.short_title}**: ` + option.title)}
		</p>
		{#each Array.from({ length: option.max }, (_, index) => index) as index (index)}
			<DomainCardSelector
				selected_card_id={getSelectedCardIdAt(index)}
				onSelectionChange={(selected_card_id) => {
					updateSelectedCardAt(index, selected_card_id);
				}}
				{available_cards}
				{previously_chosen_card_ids}
				description_html={option.title}
				title={option.short_title}
				auto_add_to_loadout
			/>
		{/each}
	</div>
{/if}
