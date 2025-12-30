<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/';
	import ClassSummary from './class-summary.svelte';
	import { renderMarkdown } from '$lib/utils/markdown';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();

	let class_dialog_open = $state(false);
	let remove_class_dialog_open = $state(false);
</script>

{#if character}
	{#if !context.primary_class}
		<Button onclick={() => (class_dialog_open = true)}>Choose a class</Button>
	{:else}
		<div class="flex flex-col gap-2">
			<ClassSummary character_class={context.primary_class} bannerClasses="-mt-4" />
			<div class="mt-4 flex flex-col gap-2">
				<p class="text font-medium">{context.primary_class.hope_feature.title}</p>
				<div class="mb-2 flex flex-col gap-2 text-sm text-muted-foreground">
					{@html renderMarkdown(context.primary_class.hope_feature.description_html)}
				</div>
			</div>
			{#each context.primary_class.class_features as feature}
				<div class="flex flex-col gap-2">
					<p class="text font-medium">{feature.title}</p>
					<div class="mb-2 flex flex-col gap-2 text-sm text-muted-foreground">
						{@html renderMarkdown(feature.description_html)}
					</div>
				</div>
			{/each}
			<div class="flex justify-center sm:justify-end">
				<Button
					variant="link"
					class="text-destructive"
					onclick={() => (remove_class_dialog_open = true)}>Remove</Button
				>
			</div>
		</div>
	{/if}

	<!-- Choose a Class dialog -->
	<Dialog.Root bind:open={class_dialog_open}>
		<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col md:min-w-3xl">
			<Dialog.Header>
				<Dialog.Title>Select a Class</Dialog.Title>
			</Dialog.Header>
			<div class="grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
				<!-- each class -->
				{#each Object.entries(compendium.classes) as [id, c]}
					<div class="flex gap-3 rounded-md border-2 bg-primary-muted p-3">
						<ClassSummary character_class={c} bannerClasses="-mt-3">
							<Button
								disabled={context.primary_class?.name === c.name}
								onclick={() => {
									character.primary_class_id = id;
									character.primary_subclass_id = null;
									class_dialog_open = false;
								}}
							>
								{context.primary_class?.name === c.name ? 'Selected' : 'Select ' + c.name}
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
	<Dialog.Root bind:open={remove_class_dialog_open}>
		<Dialog.Content class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col md:min-w-3xl">
			<Dialog.Header>
				<Dialog.Title>Remove your class</Dialog.Title>
			</Dialog.Header>
			<Dialog.Description>
				Removing your class will remove your subclass and domain card selections. This action cannot
				be undone.
			</Dialog.Description>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'link' })}>Cancel</Dialog.Close>
				<Dialog.Close
					class={buttonVariants({ variant: 'destructive' })}
					onclick={() => {
						character.primary_class_id = null;
					}}>Remove</Dialog.Close
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
