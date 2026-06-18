<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { artCharacters } from '$lib/assets/images';
	import { cn } from '$lib/utils';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import SafeDelete from '$lib/components/shared/safe-delete.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Plus from '@lucide/svelte/icons/plus';
	import UserRoundPen from '@lucide/svelte/icons/user-round-pen';
	import { goto } from '$app/navigation';
	import LoadError from '$lib/components/utility/load-error.svelte';
	import Loader from '$lib/components/utility/loader.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import Footer from '$lib/components/navigation/footer.svelte';
	import CharacterPortrait from '$lib/components/character-sheet/standalone/character-portrait.svelte';
	import type { Id } from '@convex/_generated/dataModel';
	import { useQuery } from 'convex-svelte';
	import { api } from '@convex/_generated/api';
	import { fade } from 'svelte/transition';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import { toast } from 'svelte-sonner';
	import { CHARACTER_LIMIT } from '@convex/constants/entitlements';

	const userContext = getUserContext();

	const charactersQuery = useQuery(api.functions.characters.list);
	const characters = $derived(charactersQuery.data ?? []);

	let characterToDelete = $state<{ id: Id<'characters'>; name: string } | null>(null);
	let showDeleteDialog = $state(false);
	let redirecting_to_character = $state('');
	let creatingCharacter = $state(false);

	const canCreateCharacter = $derived(userContext.character_limits.can_create_character);
	const hasUnlimitedCharacters = $derived(userContext.character_limits.has_unlimited);

	let titleText = $derived(
		userContext.user ? `${userContext.user.character_count}/${CHARACTER_LIMIT}` : ''
	);

	async function handleCreateCharacter() {
		creatingCharacter = true;
		try {
			const id = await userContext.createCharacter();
			goto(`/characters/${id}/edit/`);
		} catch (err) {
			toast.error('Failed to create character');
			console.error(err);
			creatingCharacter = false;
		}
	}

	function handleDeleteCharacter(characterId: Id<'characters'>, characterName: string) {
		characterToDelete = { id: characterId, name: characterName };
		showDeleteDialog = true;
	}

	async function confirmDelete() {
		if (characterToDelete) {
			try {
				await userContext.deleteCharacter(characterToDelete.id);
				characterToDelete = null;
				showDeleteDialog = false;
			} catch (err) {
				console.error('Failed to delete character', err);
				toast.error('Failed to delete character');
			}
		}
	}

	const isLoading = $derived(
		userContext.isLoading || charactersQuery.isLoading || creatingCharacter
	);
	const loadError = $derived(userContext.error || charactersQuery.error);

	$effect(() => {
		if (loadError) {
			console.error('Error loading characters page', loadError);
		}
	});
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<!-- Characters footer image with fade effect - background -->
	<div
		class="characters-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
	>
		<enhanced:img
			src={artCharacters}
			alt=""
			fetchpriority="high"
			sizes="100vw"
			class="characters-fade-container h-full w-full object-cover object-center"
		/>
	</div>

	<Loader isLoading={isLoading || creatingCharacter} />

	{#if !creatingCharacter}
		<div
			class={cn(
				'z-10 flex h-full w-full flex-col items-center justify-start ',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<div class="flex w-full max-w-6xl flex-col space-y-4 px-4 py-4">
				<!-- Header -->
				<div class="flex items-center justify-between gap-2">
					<p class="flex h-9 items-center gap-2 text-2xl font-bold">
						Characters

						{#if !isLoading && !hasUnlimitedCharacters}<span
								in:fade
								class="rounded-full border bg-card px-2 py-0.5 text-base tracking-widest text-muted-foreground"
								>{titleText}</span
							>{/if}
					</p>

					<Button
						variant="outline"
						onclick={handleCreateCharacter}
						disabled={!canCreateCharacter}
						class={cn(isLoading && 'pointer-events-none')}
					>
						<Plus /> New Character
					</Button>
				</div>

				{#if isLoading}
					<div></div>
				{:else if loadError}
					<LoadError />
				{:else if characters.length === 0}
					{#if !hasUnlimitedCharacters && !canCreateCharacter}
						<div class="flex flex-col items-start gap-1">
							<p class="text-sm text-muted-foreground">
								Want unlimited characters? Become an
								<a href="/subscribe" class="font-bold hover:underline">
									Adventurer <ExternalLink class="-mt-[2px] inline size-3.5 stroke-3" />
								</a>
							</p>
						</div>
					{/if}

					<div in:fade class="mx-auto my-20">
						<Button onclick={handleCreateCharacter}>
							<UserRoundPen />
							Create your first character!
						</Button>
					</div>
				{:else}
					{#if !hasUnlimitedCharacters && !canCreateCharacter}
						<div class="flex flex-col items-start gap-1">
							<p class="text-sm text-muted-foreground">
								Want unlimited characters? Become an
								<a href="/subscribe" class="font-bold hover:underline">
									Adventurer <ExternalLink class="-mt-[2px] inline size-3.5 stroke-3" />
								</a>
							</p>
						</div>
					{/if}

					<div in:fade class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each characters as { id, character }}
							{#if id !== redirecting_to_character}
								<div
									class="relative mx-auto w-full max-w-[500px] overflow-hidden bg-background shadow"
								>
									<a
										href={`/characters/${id}/`}
										class="flex gap-2 rounded-t border-x border-t bg-primary-muted p-2 hover:bg-primary-muted/80"
									>
										<div
											class=" size-19 shrink-0 overflow-hidden rounded-lg border-2 border-background/50 bg-background"
										>
											<CharacterPortrait
												src={character.image_url || '/images/art/portrait-placeholder.webp'}
												alt={character.name.trim() || 'Unnamed Character'}
												death_state={character.death_state}
												class="h-full w-full"
											/>
										</div>
										<div class="grow truncate">
											<p class=" truncate text-lg font-bold">
												{character.name.trim() || 'Unnamed Character'}
											</p>

											<p class="truncate text-xs text-muted-foreground">
												{character.derived_descriptors.ancestry_name || 'No ancestry'}
												&ensp;•&ensp;
												{character.derived_descriptors.primary_class_name || 'No class'}
												&ensp;•&ensp;
												{character.derived_descriptors.primary_subclass_name || 'No subclass'}
											</p>
										</div>
									</a>
									{#if character.campaign_id}
										<div
											class="pointer-events-none absolute right-2 bottom-10.5 left-22 flex truncate"
										>
											<a
												href={`/campaigns/${character.campaign_id}`}
												class="pointer-events-auto w-min max-w-full truncate rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-center text-xs text-accent hover:underline"
											>
												View Campaign
											</a>
										</div>
									{/if}
									<div class="flex overflow-hidden rounded-b border-t border-background bg-muted">
										<Button
											variant="ghost"
											size="sm"
											class="hover:text-text grow rounded-none bg-card hover:bg-muted"
											href={`/characters/${id}/`}>View</Button
										>
										<Button
											variant="ghost"
											size="sm"
											class="hover:text-text grow rounded-none bg-card hover:bg-muted"
											href={`/characters/${id}/edit`}>Edit</Button
										>
										<Button
											variant="ghost"
											size="sm"
											class="grow rounded-none bg-card text-destructive hover:bg-muted hover:text-destructive"
											onclick={() => handleDeleteCharacter(id, character.name)}>Delete</Button
										>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<Footer />

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
		<SafeDelete
			open={showDeleteDialog}
			itemName={characterToDelete?.name.trim() || ''}
			itemLabel="Unnamed Character"
			deleteLabel="Delete Character"
			onDelete={confirmDelete}
		/>
	</Dialog.Content>
</Dialog.Root>

<style>
	.characters-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
