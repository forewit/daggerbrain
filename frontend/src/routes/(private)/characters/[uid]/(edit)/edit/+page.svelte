<script lang="ts">
	import { goto } from '$app/navigation';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '$lib/components/ui/button';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { delete_character } from '$lib/remote/characters.remote';

	let { data } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	<div
		class={cn(
			//"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
			'mx-auto max-w-2xl'
		)}
	>
		<div class="m-4 flex flex-col gap-4">
			<p class="border-b pb-2 text-2xl font-medium">Settings</p>

			<!-- The Void -->
			<Label>
				The Void:
				<Checkbox bind:checked={character.settings.void_enabled} />
			</Label>

			<!-- Use Gold Coins -->
			<Label>
				Use Gold Coins:
				<Checkbox bind:checked={character.settings.use_gold_coins} />
			</Label>

			<Dialog.Root>
				<Dialog.Trigger
					class={cn(buttonVariants({ variant: 'link' }), 'h-min w-min p-0 text-destructive')}
					>Delete Character</Dialog.Trigger
				>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Delete Character</Dialog.Title>
						<Dialog.Description>
							Are you sure you want to delete <strong>{character.name}</strong>? This action cannot
							be undone.
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer>
						<Dialog.Close class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
							>Cancel</Dialog.Close
						>
						<Dialog.Close
							class={buttonVariants({ variant: 'destructive' })}
							onclick={async () => {
								try {
									await delete_character(character.id);
									await goto('/characters/');
								} catch (error) {
									console.error(error);
								}
							}}>Delete</Dialog.Close
						>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
{/if}
