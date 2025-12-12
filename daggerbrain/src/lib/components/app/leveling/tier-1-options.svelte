<script lang="ts">
	import { cn } from '$lib/utils';
	import Dropdown from './dropdown.svelte';
	import PrimaryClassSelector from './secondary-options/primary-class-selector.svelte';
	import PrimarySubclassSelector from './secondary-options/primary-subclass-selector.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import DomainCardSelector from './secondary-options/domain-card-selector.svelte';
	import {
		get_available_domain_cards,
		get_previously_chosen_domain_card_ids
	} from './domain-card-utils';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	let { class: className = '' } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();
</script>

{#if character}
	<div class={cn('flex flex-col gap-4', className)}>
		<!-- Select a Class -->
		<Dropdown
			title="Class"
			highlighted={!context.primary_class}
			subtitle={context.primary_class && compendium.sources[context.primary_class.source_id]
				? character.derived_descriptors.primary_class_name +
					' • ' +
					compendium.sources[context.primary_class.source_id].short_title
				: context.primary_class
					? character.derived_descriptors.primary_class_name
					: ''}
		>
			<PrimaryClassSelector />
		</Dropdown>

		<!-- Select a Subclass -->
		<Dropdown
			highlighted={!character.primary_subclass_id}
			disabled={!character.primary_class_id}
			title="Subclass"
			subtitle={character.derived_descriptors.primary_subclass_name}
		>
			<PrimarySubclassSelector />
		</Dropdown>

		<!-- Domain Cards -->
		<!--       subtitle={[
        context.level_up_domain_cards[1].A?.title,
        context.level_up_domain_cards[1].B?.title,
      ]
        .filter((title) => title !== undefined)
        .join(", ")} -->
		<Dropdown
			title="Level 1"
			disabled={!character.primary_class_id}
			highlighted={context.level_up_domain_cards[1].A === null ||
				context.level_up_domain_cards[1].B === null}
		>
			{#if context.primary_class !== null}
				{@const primaryDomain = compendium.domains[context.primary_class.primary_domain_id]}
				{@const secondaryDomain = compendium.domains[context.primary_class.secondary_domain_id]}
				{@const description_html = primaryDomain && secondaryDomain
					? `<p>Choose up to 2 level 1 domain cards from the
            <b>${primaryDomain.name}</b>
            and
            <b>${secondaryDomain.name}</b>
            domains.</p>`
					: `<p>Choose up to 2 level 1 domain cards.</p>`}
				<div class="flex flex-col gap-3 rounded-md bg-primary/50 p-2">
					<p class="px-2 pt-1 text-xs text-muted-foreground italic">
						{@html description_html}
					</p>
					<DomainCardSelector
						bind:selected_card_id={character.level_up_domain_card_ids[1].A}
						available_cards={get_available_domain_cards(context, 1, 1, false)}
						previously_chosen_card_ids={get_previously_chosen_domain_card_ids(context, 1, [])}
						{description_html}
					/>

					<DomainCardSelector
						bind:selected_card_id={character.level_up_domain_card_ids[1].B}
						available_cards={get_available_domain_cards(context, 1, 1, false)}
						previously_chosen_card_ids={get_previously_chosen_domain_card_ids(context, 1, [])}
						{description_html}
					/>
				</div>
			{/if}
		</Dropdown>
	</div>
{/if}
