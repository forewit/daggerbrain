<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/';
	import * as Collapsible from '$lib/components/ui/collapsible/';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ClassSummary from '../class-summary.svelte';
	import SubclassCard from '$lib/components/app/cards/full-cards/subclass-card.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	let { after_remove_secondary_class = () => {} } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();

	let secondary_class_dialog_open = $state(false);
	let remove_secondary_class_dialog_open = $state(false);
	let secondary_subclass_dialog_open = $state(false);
	let secondary_subclass_cards_open = $state(false);
</script>

{#if character}
	<div class="flex flex-col gap-2 rounded-md bg-primary/50 p-2">
		<p class="px-2 py-1 text-xs text-muted-foreground italic">
			Choose an additional class, select one of its domains, gain its class features, and take the
			foundation card from one of its subclasses.
		</p>

		<!-- secondary class -->
		<div class="rounded-lg border bg-primary-muted p-2">
			{#if !context.secondary_class}
				<Button onclick={() => (secondary_class_dialog_open = true)}>
					Choose an additional class
				</Button>
			{:else}
				<div class="flex flex-col gap-2">
					<ClassSummary
						character_class={context.secondary_class}
						multiclass
						bind:domain_id_selection={character.secondary_class_domain_id_choice}
						class="mb-2"
					/>

					{#each context.secondary_class.class_features as feature}
						<div class="flex flex-col gap-2">
							<p class="text-sm font-medium">{feature.title}</p>
							<div class="mb-2 flex flex-col gap-2 text-xs text-muted-foreground">
								{@html feature.description_html}
							</div>
						</div>
					{/each}
					<div class="flex justify-center sm:justify-end">
						<Button
							variant="link"
							class="text-destructive"
							onclick={() => (remove_secondary_class_dialog_open = true)}
						>
							Remove
						</Button>
					</div>
				</div>
			{/if}
		</div>

		<!-- secondary subclass -->
		<div class="rounded-lg border bg-primary-muted p-2">
			{#if !context.secondary_subclass}
				<Button
					disabled={character.secondary_class_id === null}
					onclick={() => (secondary_subclass_dialog_open = true)}>Choose a subclass</Button
				>
			{:else}
				<div class="flex flex-col gap-4">
					<p class="text-lg font-medium">{context.secondary_subclass.name}</p>
					<p class="-mt-2 text-xs text-muted-foreground italic">
						{@html context.secondary_subclass.description_html}
					</p>

					<SubclassCard card={context.secondary_subclass.foundation_card} />

					<!-- only show available at higher levels if the primary mastery level is only 1 -->
					{#if context.secondary_class_mastery_level < 3 && context.primary_class_mastery_level <= 1}
						<Collapsible.Root bind:open={secondary_subclass_cards_open}>
							<Collapsible.Trigger
								class="flex items-center text-left text-sm text-muted-foreground"
							>
								<ChevronRight
									class={cn(
										'w-k h-4 transition-transform',
										secondary_subclass_cards_open && 'rotate-90'
									)}
								/>
								Specialization and Mastery Cards
							</Collapsible.Trigger>
							<Collapsible.Content class="flex flex-col gap-3 py-4 opacity-70">
								<SubclassCard card={context.secondary_subclass.specialization_card} />
								<SubclassCard card={context.secondary_subclass.mastery_card} />
							</Collapsible.Content>
						</Collapsible.Root>
					{/if}

					<div class="flex justify-center sm:justify-end">
						<Button
							variant="link"
							class="text-destructive"
							onclick={() => (character.secondary_subclass_id = null)}>Remove</Button
						>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Choose a Class dialog -->
	<Dialog.Root bind:open={secondary_class_dialog_open}>
		<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col md:min-w-3xl">
			<Dialog.Header>
				<Dialog.Title>Select an Additional Class</Dialog.Title>
			</Dialog.Header>
			<div class="grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
				<!-- each class -->
				{#each Object.entries(compendium.classes).filter(([id, c]) => c.name !== context.primary_class?.name) as [id, c]}
					<div class="flex gap-3 rounded-md border-2 bg-primary-muted p-3">
						<ClassSummary hide_starting_stats character_class={c} bannerClasses="-mt-3">
							<Button
								disabled={context.secondary_class?.name === c.name}
								onclick={() => {
									character.secondary_class_id = id;
									character.secondary_subclass_id = null;
									character.secondary_class_domain_id_choice = null;
									secondary_class_dialog_open = false;
								}}
							>
								{context.secondary_class?.name === c.name ? 'Selected' : 'Select ' + c.name}
							</Button>
						</ClassSummary>
					</div>
				{/each}
			</div>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'link' })}>Cancel</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Remove a Class dialog -->
	<Dialog.Root bind:open={remove_secondary_class_dialog_open}>
		<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col md:min-w-3xl">
			<Dialog.Header>
				<Dialog.Title>Remove your Multiclass Selection</Dialog.Title>
			</Dialog.Header>
			<Dialog.Description>
				Removing your multiclass selection will remove your related subclass and domain card
				selections. This action cannot be undone.
			</Dialog.Description>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'link' })}>Cancel</Dialog.Close>
				<Dialog.Close
					class={buttonVariants({ variant: 'destructive' })}
					onclick={() => {
						character.secondary_class_id = null;
						character.secondary_subclass_id = null;
						character.secondary_class_domain_id_choice = null;
						if (after_remove_secondary_class) {
							after_remove_secondary_class();
						}
					}}>Remove</Dialog.Close
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Choose a Subclass dialog -->
	<Dialog.Root bind:open={secondary_subclass_dialog_open}>
		<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col md:min-w-3xl">
			<Dialog.Header>
				<Dialog.Title>Select a Subclass</Dialog.Title>
			</Dialog.Header>
			<div class="grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
				<!-- each class -->
				{#if context.secondary_class}
					{#each Object.entries(compendium.subclasses).filter(([id, s]) => s.class_id === context.secondary_class?.compendium_id) as [id, subclass]}
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
								disabled={context.secondary_subclass?.name === subclass.name}
								onclick={() => {
									character.secondary_subclass_id = id;
									secondary_subclass_dialog_open = false;
								}}
							>
								{context.secondary_subclass?.name === subclass.name
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
