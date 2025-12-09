<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Plus from '@lucide/svelte/icons/plus';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import X from '@lucide/svelte/icons/x';
	import { goto } from '$app/navigation';
	import { getUserContext } from '$lib/state/user.svelte';
	import { error } from '@sveltejs/kit';
	import DomainCardCatalog from '$lib/components/app/cards/domain-card-catalog.svelte';
	import { update_character_slots, dismiss_popup } from '$lib/remote/users.remote';

	const CHARACTER_LIMIT_POPUP_ID = 'popup:characters:limit_reached';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	const user = getUserContext();

	let characterToDelete = $state<{ id: string; name: string } | null>(null);
	let showDeleteDialog = $state(false);
	let redirecting_to_character = $state('');
	let inactiveCharactersOpen = $state(false);
	let activationError = $state<string | null>(null);
	let creatingCharacter = $state(false);

	// Separate active and inactive characters
	let activeCharacters = $derived.by(() => {
		if (data.has_unlimited_slots) {
			return user.all_characters;
		}
		if (!user.user_slots) {
			return [];
		}
		const activeSlotIds = user.getActiveSlotIds();
		return user.all_characters.filter((char) => activeSlotIds.includes(char.id));
	});

	let inactiveCharacters = $derived.by(() => {
		if (data.has_unlimited_slots) {
			return [];
		}
		if (!user.user_slots) {
			return user.all_characters;
		}
		const activeSlotIds = user.getActiveSlotIds();
		return user.all_characters.filter((char) => !activeSlotIds.includes(char.id));
	});

	// Check if user is at character limit
	let isAtLimit = $derived.by(() => {
		if (data.has_unlimited_slots) return false;
		if (!user.user_slots) return false;
		const activeSlots = user.getActiveSlotIds();
		return activeSlots.length >= 3;
	});

	// Calculate title with active character count
	let titleText = $derived.by(() => {
		if (data.has_unlimited_slots) {
			const activeCount = user.all_characters.length;
			return `Characters (${activeCount}/∞)`;
		} else {
			if (!user.user_slots) {
				return 'Characters';
			}
			const activeCount = user.getActiveSlotIds().length;
			return `Characters (${activeCount}/3)`;
		}
	});

	async function handleCreateCharacter() {
		creatingCharacter = true;
		try {
			const id = await user.create_character();
			goto(`/characters/${id}/edit/`);
		} catch (err) {
			creatingCharacter = false;
			error(500, err instanceof Error ? err.message : 'Failed to create character');
		}
	}

	// Check if we're still loading (characters, slots, or creating character)
	let isLoading = $derived.by(() => {
		return user.loading || creatingCharacter;
	});
	function handleDeleteCharacter(characterId: string, characterName: string) {
		characterToDelete = { id: characterId, name: characterName };
		showDeleteDialog = true;
	}

	async function confirmDelete() {
		if (characterToDelete) {
			user
				.delete_character(characterToDelete.id)
				.catch((err) => {
					error(500, err.message);
				})
				.finally(() => {
					characterToDelete = null;
					showDeleteDialog = false;
				});
		}
	}

	async function handleActivateCharacter(characterId: string) {
		if (data.has_unlimited_slots) return;

		activationError = null;

		const activeSlotIds = user.getActiveSlotIds();
		if (activeSlotIds.length >= 3) {
			activationError =
				'All 3 character slots are currently in use. To activate this character, please delete one of your active characters first to free up a slot.';
			return;
		}

		// Add to active slots
		const newActiveSlots = [...activeSlotIds, characterId];
		try {
			await update_character_slots(newActiveSlots);
			activationError = null;
		} catch (err) {
			// Check if it's a limit error or a different error
			const errorMessage = err instanceof Error ? err.message : 'Failed to activate character';
			if (
				errorMessage.includes('limit') ||
				errorMessage.includes('3') ||
				errorMessage.includes('403')
			) {
				activationError =
					'All 3 character slots are currently in use. To activate this character, please delete one of your active characters first to free up a slot.';
			} else {
				activationError = errorMessage || 'Failed to activate character. Please try again.';
			}
		}
	}
</script>

{#if isLoading}
	<div class="fixed inset-0 flex items-center justify-center">
		<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
	</div>
{:else}
	<div
		class={cn(
			'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]',
			'mx-auto max-w-6xl px-4 py-2'
		)}
	>
		<!-- Header -->
		<div class="mb-2 flex justify-between gap-2 py-2">
			<p class="text-2xl font-bold">{titleText}</p>

			<div class="flex gap-2">
				<Button variant="outline" onclick={handleCreateCharacter} disabled={isAtLimit}>
					<Plus /> New Character
				</Button>
			</div>
		</div>

		{#if isAtLimit && !data.has_unlimited_slots && !user.isPopupDismissed(CHARACTER_LIMIT_POPUP_ID)}
			<div
				class="relative mb-4 rounded-md border border-accent/10 bg-accent/5 p-3 pr-8 text-sm text-accent"
			>
				<a href="/subscribe" class="text-accent underline">Subscribe</a> to unlock unlimited
				character slots!
				<button
					onclick={async () => {
						try {
							await dismiss_popup(CHARACTER_LIMIT_POPUP_ID);
						} catch (err) {
							error(500, err instanceof Error ? err.message : 'Failed to dismiss notice');
						}
					}}
					class="absolute top-2 right-2 rounded-sm opacity-70 hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
					aria-label="Dismiss notice"
				>
					<X class="size-4" />
				</button>
			</div>
		{/if}
		<!-- Active Characters -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each activeCharacters as char}
				{#if char.id !== redirecting_to_character}
					<div class="mx-auto w-full max-w-[500px] overflow-hidden rounded">
						<a
							href={`/characters/${char.id}/`}
							class="flex gap-2 border bg-primary-muted p-1 hover:bg-primary-muted/80"
						>
							<div class=" h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2">
								<img
									src={char.image_url || '/images/portrait-placeholder.png'}
									alt={char.name.trim() || 'Unnamed Character'}
									class="h-full w-full object-cover"
								/>
							</div>
							<div class="truncate">
								<p class="mt-1 truncate text-lg font-bold">
									{char.name.trim() || 'Unnamed Character'}
								</p>

								<p class="mt-1 truncate text-xs text-muted-foreground">
									{char.derived_descriptors.ancestry_name || 'No ancestry'}
									&ensp;•&ensp;
									{char.derived_descriptors.primary_class_name || 'No class'}
									&ensp;•&ensp;
									{char.derived_descriptors.primary_subclass_name || 'No subclass'}
								</p>
							</div>
						</a>
						<div class="flex bg-muted">
							<Button
								variant="ghost"
								size="sm"
								class="hover:text-text grow rounded-none border"
								href={`/characters/${char.id}/`}>View</Button
							>
							<Button
								variant="ghost"
								size="sm"
								class="hover:text-text grow rounded-none border border-x-0"
								href={`/characters/${char.id}/edit`}>Edit</Button
							>
							<Button
								variant="ghost"
								size="sm"
								class=" grow rounded-none border text-destructive hover:text-destructive"
								onclick={() => handleDeleteCharacter(char.id, char.name)}>Delete</Button
							>
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Inactive Characters (Collapsible) -->
		{#if !data.has_unlimited_slots && inactiveCharacters.length > 0}
			<Collapsible.Root bind:open={inactiveCharactersOpen} class="mt-6">
				<Collapsible.Trigger class="mb-4 flex items-center gap-2 text-muted-foreground">
					<ChevronRight
						class={cn('size-4 transition-transform', inactiveCharactersOpen && 'rotate-90')}
					/>
					<p class="text-lg font-medium">
						Inactive Characters ({inactiveCharacters.length})
					</p>
				</Collapsible.Trigger>
				<Collapsible.Content>
					{#if activationError}
						<div
							class="relative mb-4 rounded-md border border-destructive/10 bg-destructive/5 p-3 pr-8 text-sm text-destructive"
						>
							{activationError}
							<button
								onclick={() => (activationError = null)}
								class="absolute top-2 right-2 rounded-sm opacity-70 hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
								aria-label="Dismiss error"
							>
								<X class="size-4" />
							</button>
						</div>
					{/if}
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each inactiveCharacters as char}
							{#if char.id !== redirecting_to_character}
								<div class="mx-auto w-full max-w-[500px] overflow-hidden rounded">
									<div class="flex gap-2 border bg-primary-muted p-1 opacity-60">
										<div class=" h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2">
											<img
												src={char.image_url || '/images/portrait-placeholder.png'}
												alt={char.name.trim() || 'Unnamed Character'}
												class="h-full w-full object-cover"
											/>
										</div>
										<div class="truncate">
											<p class="mt-1 truncate text-lg font-bold">
												{char.name.trim() || 'Unnamed Character'}
											</p>

											<p class="mt-1 truncate text-xs text-muted-foreground">
												{char.derived_descriptors.ancestry_name || 'No ancestry'}
												&ensp;•&ensp;
												{char.derived_descriptors.primary_class_name || 'No class'}
												&ensp;•&ensp;
												{char.derived_descriptors.primary_subclass_name || 'No subclass'}
											</p>
										</div>
									</div>
									<div class="flex bg-muted">
										<Button
											variant="ghost"
											size="sm"
											class="hover:text-text grow rounded-none border"
											onclick={() => handleActivateCharacter(char.id)}>Activate</Button
										>
										<Button
											variant="ghost"
											size="sm"
											class=" grow rounded-none border text-destructive hover:text-destructive"
											onclick={() => handleDeleteCharacter(char.id, char.name)}>Delete</Button
										>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		{/if}
	</div>
{/if}

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={showDeleteDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete Character</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete <strong
					>{characterToDelete?.name.trim() || 'Unnamed Character'}</strong
				>? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-3 pt-4">
			<Dialog.Close class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				>Cancel</Dialog.Close
			>
			<Dialog.Close class={buttonVariants({ variant: 'destructive' })} onclick={confirmDelete}
				>Delete</Dialog.Close
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
