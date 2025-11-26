<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/';
	import * as Collapsible from '$lib/components/ui/collapsible/';
	import SubclassCard from '$lib/components/app/cards/full-cards/subclass-card.svelte';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();

	let subclass_dialog_open = $state(false);
	let subclass_cards_open = $state(false);
</script>

{#if character}
	{#if !context.primary_subclass}
		<Button onclick={() => (subclass_dialog_open = true)}>Choose a subclass</Button>
	{:else}
		<div class="flex flex-col gap-4">
			<p class="text-lg font-medium">{context.primary_subclass?.name}</p>
			<p class="-mt-2 text-xs text-muted-foreground italic">
				{@html context.primary_subclass?.description_html}
			</p>

			<SubclassCard card={context.primary_subclass.foundation_card} />

			{#if context.primary_class_mastery_level < 3}
				<Collapsible.Root bind:open={subclass_cards_open}>
					<Collapsible.Trigger class="flex items-center text-left text-sm text-muted-foreground">
						<ChevronRight
							class={cn('w-k h-4 transition-transform', subclass_cards_open && 'rotate-90')}
						/>
						Specialization and Mastery Cards
					</Collapsible.Trigger>
					<Collapsible.Content class="flex flex-col gap-3 py-4 opacity-70">
						<SubclassCard card={context.primary_subclass.specialization_card} />
						<SubclassCard card={context.primary_subclass.mastery_card} />
					</Collapsible.Content>
				</Collapsible.Root>
			{/if}

			<div class="flex justify-center sm:justify-end">
				<Button
					variant="link"
					class="text-destructive"
					onclick={() => (character.primary_subclass_id = null)}>Remove</Button
				>
			</div>
		</div>
	{/if}

	<!-- Choose a Subclass dialog -->
	<Dialog.Root bind:open={subclass_dialog_open}>
		<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col md:min-w-3xl">
			<Dialog.Header>
				<Dialog.Title>Select a Subclass</Dialog.Title>
			</Dialog.Header>
			<div class="grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
				<!-- each class -->
				{#if context.primary_class}
					{#each Object.entries(compendium.subclasses).filter(([id, s]) => s.class_id === context.primary_class?.id) as [id, subclass]}
						<div class="flex flex-col gap-3 rounded-md border-2 bg-primary-muted p-3">
							<p class="text-lg font-medium">{subclass.name}</p>
							<p class="-mt-2 text-xs text-muted-foreground italic">
								{@html subclass.description_html}
							</p>
							{#if subclass.foundation_card.spellcast_trait}
								<p class="text-xs text-muted-foreground italic">
									<b class="text-foreground"><em>Spellcast Trait:</em></b>
									{subclass.foundation_card.spellcast_trait}
								</p>
							{/if}
							<Button
								class="mt-2"
								disabled={context.primary_subclass?.name === subclass.name}
								onclick={() => {
									character.primary_subclass_id = id;
									subclass_dialog_open = false;
								}}
							>
								{context.primary_subclass?.name === subclass.name
									? 'Selected'
									: 'Select ' + subclass.name}
							</Button>
						</div>
					{/each}
				{/if}
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'link' })}>Cancel</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
