<script lang="ts">
	import { goto } from '$app/navigation';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import SafeDelete from '$lib/components/shared/safe-delete.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getUserContext } from '$lib/state/user.svelte';

	let {} = $props();

	const characterCtx = getCharacterContext();
	const userCtx = getUserContext();
	const character = $derived(characterCtx.character);
	const campaignId = $derived(character?.campaign_id);
	const isOwner = $derived(characterCtx.isOwner);

	let showVoidDisableDialog = $state(false);
	let voidCheckboxState = $state(false);

	let showHomebrewDisableDialog = $state(false);
	let homebrewCheckboxState = $state(false);

	// Sync checkbox state with character's void_enabled, homebrew_enabled, and visibility
	$effect(() => {
		if (character) {
			voidCheckboxState = character.settings.void_enabled;
		}
	});
	$effect(() => {
		if (character) {
			homebrewCheckboxState = character.settings.homebrew_enabled;
		}
	});

	// function handleVoidCheckboxChange(checked: boolean) {
	// 	if (!checked && character?.settings.void_enabled) {
	// 		// User is trying to disable void - show warning and prevent change
	// 		voidCheckboxState = true; // Keep it checked until confirmed
	// 		showVoidDisableDialog = true;
	// 	} else if (character) {
	// 		// User is enabling void - allow it directly
	// 		character.settings.void_enabled = checked;
	// 	}
	// }

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

	function handleHomebrewCheckboxChange(checked: boolean) {
		if (!checked && character?.settings.homebrew_enabled) {
			// User is trying to disable void - show warning and prevent change
			homebrewCheckboxState = true; // Keep it checked until confirmed
			showHomebrewDisableDialog = true;
		} else if (character) {
			// User is enabling homebrew - allow it directly
			character.settings.homebrew_enabled = checked;
		}
	}

	function confirmDisableHomebrew() {
		if (character) {
			character.settings.homebrew_enabled = false;
		}
		showHomebrewDisableDialog = false;
	}

	function cancelDisableHomebrew() {
		// Reset checkbox to previous state
		homebrewCheckboxState = character?.settings.homebrew_enabled ?? false;
		showHomebrewDisableDialog = false;
	}

	async function confirmDeleteCharacter() {
		try {
			if (!characterCtx.id) throw new Error('Cannot delete character, id is missing');
			await userCtx.deleteCharacter(characterCtx.id);
			await goto('/characters/');
		} catch (error) {
			console.error(error);
			throw error;
		}
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

			<!-- homebrew -->
			<Label class="cursor-pointer">
				<Checkbox
					bind:checked={homebrewCheckboxState}
					onCheckedChange={(checked) => handleHomebrewCheckboxChange(checked ?? false)}
				/>
				Enable Homebrew
			</Label>

			<!-- The Void -->
			<!-- <Label class="cursor-pointer items-start">
				<Checkbox
					bind:checked={voidCheckboxState}
					onCheckedChange={(checked) => handleVoidCheckboxChange(checked ?? false)}
				/>
								<div class="space-y-1">
					<p class="whitespace-nowrap">The Void:</p>
					<ul class="text-xs font-normal text-muted-foreground">
						<li>Transformation Cards</li>
						<li>More coming soon...</li>
					</ul>
				</div>
			</Label> -->

			<!-- Show Campaign Information - only visible when character is in a campaign -->
			{#if campaignId}
				<Label class="cursor-pointer items-start">
					<Checkbox bind:checked={character.settings.show_campaign_info} />

					<div class="space-y-1">
						<p class="whitespace-nowrap">Show Campaign Information</p>
						<p class="text-xs font-normal text-muted-foreground">
							Display campaign information that the GM shares with players (Fear tracker and visible
							countdowns) at the top of your character sheet.
						</p>
					</div>
				</Label>
			{/if}

			<!-- Optional Rules -->
			<p class="mt-4 text-sm font-bold">Optional Rules</p>

			<!-- Use Gold Coins -->
			<Label class="cursor-pointer items-start">
				<Checkbox bind:checked={character.settings.use_gold_coins} />

				<div class="space-y-1">
					<p class="whitespace-nowrap">Gold Coins</p>
					<p class="text-xs font-normal text-muted-foreground">
						If your group wants to track gold with more granularity, you can add coins as your
						lowest denomination. 10 coins equal 1 handful.
					</p>
				</div>
			</Label>

			<!-- massive damage -->
			<Label class="cursor-pointer items-start">
				<Checkbox
					checked={character.settings.massive_damage}
					onCheckedChange={(checked) => {
						character.settings.massive_damage = checked;
					}}
				/>

				<div class="space-y-1">
					<p class="whitespace-nowrap">Massive Damage</p>
					<p class="text-xs font-normal text-muted-foreground">
						If a character ever takes damage equal to twice their Severe threshold, they mark 4 HP
						instead of 3.
					</p>
				</div>
			</Label>

			<!-- delete character -->
			{#if isOwner}
				<SafeDelete
					open={true}
					itemName={character.name}
					itemLabel="this character"
					deleteLabel="Delete Character"
					onDelete={confirmDeleteCharacter}
					class="mt-6"
				/>
			{/if}
		</div>
	</div>

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
				<Dialog.Close
					class={buttonVariants({ variant: 'destructive' })}
					onclick={confirmDisableVoid}>Disable The Void</Dialog.Close
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Homebrew Disable Confirmation Dialog -->
	<Dialog.Root bind:open={showHomebrewDisableDialog}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Disable Homebrew</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to disable Homebrew? This will remove any homebrew content on this
					character. This action cannot be undone.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="flex gap-3 pt-4">
				<Dialog.Close
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
					onclick={cancelDisableHomebrew}>Cancel</Dialog.Close
				>
				<Dialog.Close
					class={buttonVariants({ variant: 'destructive' })}
					onclick={confirmDisableHomebrew}>Disable Homebrew</Dialog.Close
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
