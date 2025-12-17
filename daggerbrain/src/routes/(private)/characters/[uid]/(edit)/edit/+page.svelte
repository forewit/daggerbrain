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

	let showVoidDisableDialog = $state(false);
	let voidCheckboxState = $state(false);

	// Sync checkbox state with character's void_enabled
	$effect(() => {
		if (character) {
			voidCheckboxState = character.settings.void_enabled;
		}
	});

	function handleVoidCheckboxChange(checked: boolean) {
		if (!checked && character?.settings.void_enabled) {
			// User is trying to disable void - show warning and prevent change
			voidCheckboxState = true; // Keep it checked until confirmed
			showVoidDisableDialog = true;
		} else if (character) {
			// User is enabling void - allow it directly
			character.settings.void_enabled = checked;
		}
	}

	function confirmDisableVoid() {
		if (character) {
			character.settings.void_enabled = false;
		}
		showVoidDisableDialog = false;
	}

	function cancelDisableVoid() {
		// Reset checkbox to previous state
		voidCheckboxState = character?.settings.void_enabled ?? false;
		showVoidDisableDialog = false;
	}
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

			<!-- todo: uncomment before adding void content -->
			<!-- The Void -->
			<!-- <Label class="cursor-pointer">
				The Void:
				<Checkbox
					bind:checked={voidCheckboxState}
					onCheckedChange={(checked) => handleVoidCheckboxChange(checked ?? false)}
				/>
			</Label> -->

			<!-- Use Gold Coins -->
			<Label class="cursor-pointer items-start">
				<Checkbox bind:checked={character.settings.use_gold_coins} />

				<div class="space-y-1">
					<p class="whitespace-nowrap">Use Gold Coins</p>
					<p class="text-xs font-normal text-muted-foreground">
						If your group wants to track gold with more granularity, you can add coins as your
						lowest denomination. 10 coins equal 1 handful.
					</p>
				</div>
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

<!-- Void Disable Confirmation Dialog -->
<Dialog.Root bind:open={showVoidDisableDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Disable The Void</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to disable The Void? This will remove any void content on this
				character. This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-3 pt-4">
			<Dialog.Close
				class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				onclick={cancelDisableVoid}>Cancel</Dialog.Close
			>
			<Dialog.Close class={buttonVariants({ variant: 'destructive' })} onclick={confirmDisableVoid}
				>Disable</Dialog.Close
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
