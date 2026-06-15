<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/';
	import * as Collapsible from '$lib/components/ui/collapsible/';
	import SubclassCard from '$lib/components/compendium-items/cards/subclass-card.svelte';
	import { cn, renderMarkdown } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import CampaignBadge from '$lib/components/decorations/badges/campaign-badge.svelte';
	import SubclassDomainCardOption from '../subclass-domain-card-option.svelte';
	import {
		get_available_domain_cards,
		get_previously_chosen_domain_card_ids
	} from '../domain-card-utils';

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const compendium = $derived(characterCtx.character_compendium);
	const primary_class = $derived(derived_character_data?.primary_class);
	const primary_subclass = $derived(derived_character_data?.primary_subclass);
	const primary_class_mastery_level = $derived(
		derived_character_data?.primary_class_mastery_level ?? 0
	);
	const subclass_level_up_options = $derived(
		(derived_character_data?.subclass_level_up_options[1] ?? []).filter(
			(option) => option.type === 'domain_card'
		)
	);

	const primarySubclassOptions = $derived.by(() => {
		if (!primary_class || !compendium) return [];
		return (primary_class.subclass_ids ?? [])
			.map((id) => ({ id, subclass: compendium.subclasses[id] }))
			.filter((entry) => Boolean(entry.subclass));
	});

	let subclass_dialog_open = $state(false);
	let subclass_cards_open = $state(false);
</script>

{#if character && compendium}
	{#if !primary_subclass || !character.primary_subclass_id}
		<Button onclick={() => (subclass_dialog_open = true)}>Choose a subclass</Button>
	{:else}
		<div class="flex flex-col gap-4">
			<p class="text-lg font-medium">{primary_subclass.title}</p>
			<p class="-mt-2 text-xs text-muted-foreground italic">
				{@html renderMarkdown(primary_subclass.description_html || '')}
			</p>

			<SubclassCard
				{compendium}
				card={{ type: 'foundation', ...primary_subclass, ...primary_subclass.foundation_card }}
				bind:choices={character.card_choices[character.primary_subclass_id]}
				bind:tokens={character.card_tokens[character.primary_subclass_id]}
				enable_choices
				enable_tokens
				experiences={character.experiences}
			/>

			{#if subclass_level_up_options.length > 0}
				<div class="flex flex-col gap-3">
					{#each subclass_level_up_options as option (option.option_id)}
						<SubclassDomainCardOption
							{option}
							available_cards={get_available_domain_cards(characterCtx, 1, 1, false)}
							previously_chosen_card_ids={get_previously_chosen_domain_card_ids(
								characterCtx,
								1,
								[]
							)}
						/>
					{/each}
				</div>
			{/if}

			{#if primary_class_mastery_level < 3}
				<Collapsible.Root bind:open={subclass_cards_open}>
					<Collapsible.Trigger class="flex items-center text-left text-sm text-muted-foreground">
						<ChevronRight
							class={cn('w-k h-4 transition-transform', subclass_cards_open && 'rotate-90')}
						/>
						Specialization and Mastery Cards
					</Collapsible.Trigger>
					<Collapsible.Content class="flex flex-col gap-3 py-4 opacity-70">
						<SubclassCard
							{compendium}
							card={{
								type: 'specialization',
								...primary_subclass,
								...primary_subclass.specialization_card
							}}
						/>
						<SubclassCard
							{compendium}
							card={{ type: 'mastery', ...primary_subclass, ...primary_subclass.mastery_card }}
						/>
					</Collapsible.Content>
				</Collapsible.Root>
			{/if}

			<div class="flex justify-center sm:justify-end">
				<Button
					variant="link"
					class="text-destructive"
					onclick={() => (character.primary_subclass_id = undefined)}>Remove</Button
				>
			</div>
		</div>
	{/if}

	<Dialog.Root bind:open={subclass_dialog_open}>
		<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col md:min-w-3xl">
			<Dialog.Header>
				<Dialog.Title>Select a Subclass</Dialog.Title>
			</Dialog.Header>
			<div class="grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
				{#each primarySubclassOptions as { id, subclass }}
					<div class="flex flex-col gap-3 rounded-md border-2 bg-primary-muted p-3">
						<div class="flex items-center gap-2">
							<p class="text-lg font-medium">{subclass.title}</p>
							{#if subclass.source_key === 'Homebrew'}
								<HomebrewBadge class="size-4" />
							{:else if subclass.source_key === 'Campaign'}
								<CampaignBadge class="size-4" />
							{/if}
						</div>
						<p class="-mt-2 text-xs text-muted-foreground italic">
							{@html renderMarkdown(subclass.description_html)}
						</p>
						{#if subclass.spellcast_trait}
							<p class="text-xs text-muted-foreground italic">
								<b class="text-foreground"><em>Spellcast Trait:</em></b>
								{subclass.spellcast_trait}
							</p>
						{/if}
						<Button
							class="mt-2"
							disabled={primary_subclass?.title === subclass.title}
							onclick={() => {
								character.primary_subclass_id = id as typeof character.primary_subclass_id;
								subclass_dialog_open = false;
							}}
						>
							{primary_subclass?.title === subclass.title ? 'Selected' : 'Select ' + subclass.title}
						</Button>
					</div>
				{/each}
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'link' })}>Cancel</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
