<script lang="ts">
	import { cn, renderMarkdown } from '$lib/utils';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import PrimaryClassSelector from './secondary-options/primary-class-selector.svelte';
	import PrimarySubclassSelector from './secondary-options/primary-subclass-selector.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import DomainCardSelector from './secondary-options/domain-card-selector.svelte';
	import {
		get_available_domain_cards,
		get_previously_chosen_domain_card_ids
	} from './domain-card-utils';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import CampaignBadge from '$lib/components/decorations/badges/campaign-badge.svelte';

	let { class: className = '' } = $props();

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const compendium = $derived(characterCtx.character_compendium);
	const primary_class = $derived(derived_character_data?.primary_class);
	const primary_subclass = $derived(derived_character_data?.primary_subclass);
	const subclass_level_up_options = $derived(
		derived_character_data?.subclass_level_up_options[1] ?? []
	);
</script>

{#if character && derived_character_data && compendium}
	<div class={cn('flex flex-col gap-4', className)}>
		{#snippet class_subtitle_snippet()}
			<div class="flex items-center gap-2 truncate">
				{#if primary_class?.source_key === 'Homebrew'}
					<HomebrewBadge class="size-3.5" />
				{:else if primary_class?.source_key === 'Campaign'}
					<CampaignBadge class="size-3.5" />
				{/if}
				<p class="truncate text-sm font-normal text-muted-foreground">
					{character.derived_descriptors.primary_class_name ?? ''}
				</p>
			</div>
		{/snippet}
		<Dropdown title="Class" highlighted={!primary_class} subtitle_snippet={class_subtitle_snippet}>
			<PrimaryClassSelector />
		</Dropdown>

		{#snippet subclass_subtitle_snippet()}
			<div class="flex items-center gap-2 truncate">
				{#if primary_subclass?.source_key === 'Homebrew'}
					<HomebrewBadge class="size-3.5" />
				{:else if primary_subclass?.source_key === 'Campaign'}
					<CampaignBadge class="size-3.5" />
				{/if}
				<p class="truncate text-sm font-normal text-muted-foreground">
					{character.derived_descriptors.primary_subclass_name ?? ''}
				</p>
			</div>
		{/snippet}
		<Dropdown
			highlighted={!character.primary_subclass_id ||
				subclass_level_up_options.some(
					(option) =>
						(character.subclass_level_up_choices?.[option.option_id]?.length ?? 0) < option.max
				)}
			disabled={!character.primary_class_id}
			title="Subclass"
			subtitle_snippet={subclass_subtitle_snippet}
		>
			<PrimarySubclassSelector />
		</Dropdown>

		<Dropdown
			title="Level 1"
			disabled={!character.primary_class_id}
			highlighted={!character.level_up_domain_card_ids[1].A ||
				!character.level_up_domain_card_ids[1].B}
		>
			{#if primary_class}
				{@const primaryDomain = primary_class.primary_domain_id
					? compendium.domains[primary_class.primary_domain_id]
					: undefined}
				{@const secondaryDomain = primary_class.secondary_domain_id
					? compendium.domains[primary_class.secondary_domain_id]
					: undefined}
				{@const description_html =
					primaryDomain && secondaryDomain
						? `<p>Choose up to 2 level 1 domain cards from the
            <b>${primaryDomain.title}</b>
            and
            <b>${secondaryDomain.title}</b>
            domains.</p>`
						: `<p>Choose up to 2 level 1 domain cards.</p>`}

				<div class="flex flex-col gap-3">
					<div class="flex flex-col gap-3 rounded-md bg-primary/50 p-2">
						<p class="px-2 pt-1 text-xs text-muted-foreground italic">
							{@html renderMarkdown(description_html)}
						</p>
						<DomainCardSelector
							bind:selected_card_id={character.level_up_domain_card_ids[1].A}
							available_cards={get_available_domain_cards(characterCtx, 1, 1, false)}
							previously_chosen_card_ids={get_previously_chosen_domain_card_ids(
								characterCtx,
								1,
								[]
							)}
							{description_html}
							auto_add_to_loadout
						/>

						<DomainCardSelector
							bind:selected_card_id={character.level_up_domain_card_ids[1].B}
							available_cards={get_available_domain_cards(characterCtx, 1, 1, false)}
							previously_chosen_card_ids={get_previously_chosen_domain_card_ids(
								characterCtx,
								1,
								[]
							)}
							{description_html}
							auto_add_to_loadout
						/>
					</div>
				</div>
			{/if}
		</Dropdown>
	</div>
{/if}
