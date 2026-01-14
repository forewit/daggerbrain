<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Plus from '@lucide/svelte/icons/plus';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import UserRoundPen from '@lucide/svelte/icons/user-round-pen';
	import { goto } from '$app/navigation';
	import { getUserContext } from '$lib/state/user.svelte';
	import { error } from '@sveltejs/kit';
	import Footer from '$lib/components/app/footer.svelte';
	import { UI_CHARACTER_LIMIT } from '@shared/constants/constants';

	const user = getUserContext();

	let characterToDelete = $state<{ id: string; name: string } | null>(null);
	let showDeleteDialog = $state(false);
	let redirecting_to_character = $state('');
	let creatingCharacter = $state(false);

	// Check if user is at character limit (3 characters max)
	let isAtLimit = $derived(user.all_characters.length >= UI_CHARACTER_LIMIT);

	// Calculate title with character count
	let titleText = $derived(`${user.all_characters.length}/${UI_CHARACTER_LIMIT}`);

	// Create campaign lookup map for O(1) campaign name lookups
	let campaignMap = $derived(new Map(user.all_campaigns.map((c) => [c.id, c.name])));

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

	// Check if we're still loading
	let isLoading = $derived(user.loading || creatingCharacter);

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
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<!-- Characters footer image with fade effect - background -->
	<div
		class="characters-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-64 w-full overflow-hidden"
	>
		<img
			src="/images/art/characters.webp"
			alt=""
			class="characters-fade-container h-full w-full object-cover object-center"
		/>
	</div>

	{#if isLoading}
		<!-- Keep the page height so the footer doesn't jump while loading -->
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else}
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start ',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<div class="flex w-full max-w-6xl flex-col space-y-4 px-4 py-4">
				<!-- Header -->
				<div class="flex items-center justify-between gap-2">
					<p class="flex items-center gap-2 text-2xl font-bold">
						Characters <span
							class="rounded-full border bg-card px-2 py-0.5 text-base tracking-widest text-muted-foreground"
							>{titleText}</span
						>
					</p>

					<div class="flex gap-2">
						<Button variant="outline" onclick={handleCreateCharacter} disabled={isAtLimit}>
							<Plus /> New Character
						</Button>
					</div>
				</div>

				<!-- Characters -->
				{#if user.all_characters.length === 0}
					<Button class="mx-auto my-24" onclick={handleCreateCharacter}>
						<UserRoundPen />
						Create your first character!
					</Button>
				{:else}
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each user.all_characters as char}
							{#if char.id !== redirecting_to_character}
								<div class="relative mx-auto w-full max-w-[500px] overflow-hidden rounded">
									<a
										href={`/characters/${char.id}/`}
										class="flex gap-2 border bg-primary-muted p-1 hover:bg-primary-muted/80"
									>
										<div class=" size-19 shrink-0 overflow-hidden rounded-lg border-2">
											<img
												src={char.image_url || '/images/portrait-placeholder.png'}
												alt={char.name.trim() || 'Unnamed Character'}
												class="h-full w-full object-cover"
											/>
										</div>
										<div class="grow truncate">
											<p class=" truncate text-lg font-bold">
												{char.name.trim() || 'Unnamed Character'}
											</p>

											<p class="truncate text-xs text-muted-foreground">
												{char.derived_character_summary?.ancestry_name || 'No ancestry'}
												&ensp;•&ensp;
												{char.derived_character_summary?.primary_class_name || 'No class'}
												&ensp;•&ensp;
												{char.derived_character_summary?.primary_subclass_name || 'No subclass'}
											</p>
										</div>
									</a>
									{#if char.campaign_id && campaignMap.has(char.campaign_id)}
										<div class="absolute right-2 bottom-10.5 left-22 flex truncate">
											<a
												href={`/campaigns/${char.campaign_id}`}
												class="w-min max-w-full truncate rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-center text-xs text-accent hover:underline"
											>
												Campaign: {campaignMap.get(char.campaign_id)}
											</a>
										</div>
									{/if}
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

<style>
	.characters-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
