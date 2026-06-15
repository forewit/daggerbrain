<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import AncestryCard from '$lib/components/compendium-items/cards/ancestry-card.svelte';
	import TransformationCard from '$lib/components/compendium-items/cards/transformation-card.svelte';
	import CommunityCard from '$lib/components/compendium-items/cards/community-card.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';

	const characterCtx = getCharacterContext();
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const character = $derived(characterCtx.character);
	const compendium = $derived(characterCtx.character_compendium);

	let ancestryDialogOpen = $state(false);
	let communityDialogOpen = $state(false);
	let transformationDialogOpen = $state(false);
</script>

{#if character && derived_character_data}
	<div
		class={cn(
			//"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
			'mx-auto max-w-2xl'
		)}
	>
		<div class="m-4 flex flex-col gap-4">
			<Dropdown
				highlighted={!character.ancestry_card_id}
				title="Ancestry"
				subtitle={derived_character_data.ancestry_card?.title || ''}
			>
				<div class="flex flex-col gap-4">
					<p class="text-sm text-muted-foreground italic">
						Ancestries represent your character's lineage which affects their physical appearance
						and access to certain special abilities.
					</p>
					{#if derived_character_data.ancestry_card && character.ancestry_card_id}
						<AncestryCard
							card={derived_character_data.ancestry_card}
							{compendium}
							bind:choices={character.card_choices[character.ancestry_card_id]}
							bind:tokens={character.card_tokens[character.ancestry_card_id]}
							bind:mixed_ancestry_choices={
								character.mixed_ancestry_choices[character.ancestry_card_id]
							}
							enable_choices
							enable_tokens
							enable_mixed_ancestry
							experiences={character.experiences}
						/>
					{/if}
					<div class="flex w-full justify-between gap-2">
						{#if !character.ancestry_card_id}
							<Button onclick={() => (ancestryDialogOpen = true)}>Choose an ancestry</Button>
						{:else}
							<div class="flex w-full justify-center sm:justify-end">
								<Button
									variant="link"
									class="text-destructive"
									onclick={() => (character.ancestry_card_id = undefined)}>Remove</Button
								>
							</div>
						{/if}
					</div>
				</div>
			</Dropdown>

			<Dropdown
				highlighted={!character.community_card_id}
				title="Community"
				subtitle={derived_character_data.community_card?.title || ''}
			>
				<div class="flex flex-col gap-4">
					<p class="text-sm text-muted-foreground italic">
						Communities represent a key aspect of the culture class or environment of origin that
						has had the most influence over your character's upbringing.
					</p>
					{#if derived_character_data.community_card && character.community_card_id}
						<CommunityCard
							card={derived_character_data.community_card}
							bind:choices={character.card_choices[character.community_card_id]}
							bind:tokens={character.card_tokens[character.community_card_id]}
							enable_tokens
							enable_choices
							experiences={character.experiences}
						/>
					{/if}

					<div class="flex justify-between gap-2">
						{#if !character.community_card_id}
							<Button onclick={() => (communityDialogOpen = true)}>Choose a community</Button>
						{:else}
							<div class="flex w-full justify-center sm:justify-end">
								<Button
									variant="link"
									class={cn('text-destructive', !character.community_card_id && 'hidden')}
									onclick={() => (character.community_card_id = undefined)}>Remove</Button
								>
							</div>
						{/if}
					</div>
				</div>
			</Dropdown>

			{#if character.settings.void_enabled}
				<Dropdown
					title="Transformation"
					subtitle={derived_character_data.transformation_card?.title
						? derived_character_data.transformation_card?.title +
							' • ' +
							(characterCtx.sources.find(
								(source) =>
									source.source_key === derived_character_data.transformation_card?.source_key
							)?.short_title ?? 'Unknown')
						: ''}
				>
					<div class="flex flex-col gap-4">
						<p class="text-sm text-muted-foreground italic">
							Transformations represent changes or augmentations to characters in Daggerheart. These
							are optional aspects of a character's identity that may be given out by the GM during
							a campaign for narrative purposes. GMs may also present transformations as an option
							at character creation, at their discretion.
						</p>
						{#if derived_character_data.transformation_card && character.transformation_card_id}
							<TransformationCard
								card={derived_character_data.transformation_card}
								bind:choices={character.card_choices[character.transformation_card_id]}
								bind:tokens={character.card_tokens[character.transformation_card_id]}
								experiences={character.experiences}
							/>
						{/if}

						<div class="flex justify-between gap-2">
							{#if !character.transformation_card_id}
								<Button onclick={() => (transformationDialogOpen = true)}>
									Choose a transformation
								</Button>
							{:else}
								<div class="flex w-full justify-center sm:justify-end">
									<Button
										variant="link"
										class={cn('text-destructive', !character.transformation_card_id && 'hidden')}
										onclick={() => (character.transformation_card_id = undefined)}>Remove</Button
									>
								</div>
							{/if}
						</div>
					</div>
				</Dropdown>
			{/if}
		</div>
	</div>

	<Dialog.Root bind:open={ancestryDialogOpen}>
		<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col md:min-w-3xl">
			<Dialog.Header>
				<Dialog.Title>Select an ancestry</Dialog.Title>
			</Dialog.Header>
			<div class="grid grid-cols-1 gap-3 overflow-y-auto p-2 sm:grid-cols-2">
				{#each Object.entries(compendium.ancestry_cards) as [id, card]}
					<div>
						<AncestryCard {card} {compendium}
							><Button
								onclick={() => {
									character.ancestry_card_id = id;
									ancestryDialogOpen = false;
								}}
								class="mt-auto w-min">Select {card.title}</Button
							>
						</AncestryCard>
					</div>
				{/each}
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'link' })}>Cancel</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<Dialog.Root bind:open={communityDialogOpen}>
		<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col md:min-w-3xl">
			<Dialog.Header>
				<Dialog.Title>Select a community</Dialog.Title>
			</Dialog.Header>
			<div class="grid grid-cols-1 gap-3 overflow-y-auto p-2 sm:grid-cols-2">
				{#each Object.entries(compendium.community_cards) as [id, card]}
					<div>
						<CommunityCard {card}
							><Button
								onclick={() => {
									character.community_card_id = id;
									communityDialogOpen = false;
								}}
								class="mt-auto w-min">Select {card.title}</Button
							>
						</CommunityCard>
					</div>
				{/each}
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'link' })}>Cancel</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<Dialog.Root bind:open={transformationDialogOpen}>
		<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col md:min-w-3xl">
			<Dialog.Header>
				<Dialog.Title>Select a transformation</Dialog.Title>
			</Dialog.Header>
			<div class="grid grid-cols-1 gap-3 overflow-y-auto p-2 sm:grid-cols-2">
				{#each Object.entries(compendium.transformation_cards) as [id, card]}
					<div>
						<TransformationCard {card}
							><Button
								onclick={() => {
									character.transformation_card_id = id;
									transformationDialogOpen = false;
								}}
								class="mt-auto w-min">Select {card.title}</Button
							>
						</TransformationCard>
					</div>
				{/each}
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'link' })}>Cancel</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
