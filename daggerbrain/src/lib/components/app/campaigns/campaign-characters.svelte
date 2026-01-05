<!-- src/lib/components/app/campaigns/campaign-characters.svelte -->
<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Label from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { error } from '@sveltejs/kit';

	const campaignContext = getCampaignContext();
	const user = getUserContext();

	// Get data from contexts
	const campaign = $derived(campaignContext.campaign);
	const characters = $derived(campaignContext.characters);
	const members = $derived(campaignContext.members);

	// Get campaign ID from context
	const campaignId = $derived(campaign?.id);

	// Determine user role from campaign membership
	const userRole = $derived.by(() => {
		if (!campaignId || !user.user?.clerk_id) return null;
		const member = members.find((m) => m.user_id === user.user?.clerk_id);
		return member?.role || null;
	});

	const isGM = $derived(userRole === 'gm');
	const isPlayer = $derived(userRole === 'player');

	// Get characters in this campaign
	const campaignCharacters = $derived(Object.values(characters));

	// Separate characters into assigned and unassigned (claimable)
	// For GMs: unassigned = all claimable characters (regardless of owner, since they're for players to claim)
	// For Players: unassigned = claimable characters not owned by the player
	const assignedCharacters = $derived(
		campaignCharacters.filter((char) => {
			if (isGM) {
				// GMs see non-claimable characters as assigned, and claimable characters as unassigned
				return !char.claimable;
			} else {
				// Players see non-claimable or their own characters as assigned
				return !char.claimable || char.owner_user_id === user.user?.clerk_id;
			}
		})
	);
	const unassignedCharacters = $derived(
		campaignCharacters.filter((char) => {
			if (isGM) {
				// GMs see all claimable characters as unassigned
				return char.claimable;
			} else {
				// Players see claimable characters not owned by them as unassigned
				return char.claimable && char.owner_user_id !== user.user?.clerk_id;
			}
		})
	);

	// Add Character dialog state
	let showAddCharacterDialog = $state(false);
	let addCharacterMode = $state<'create' | 'existing'>('create');
	let selectedCharacterId = $state('');

	// Get available characters for assignment
	const availableCharacters = $derived(
		user.all_characters
			.filter((char) => !char.campaign_id || char.campaign_id !== campaignId)
			.map((char) => ({ id: char.id, name: char.name || 'Unnamed Character' }))
	);

	// Get GM's characters not in any campaign for the add dialog
	const availableGmCharacters = $derived(
		user.all_characters
			.filter((char) => !char.campaign_id)
			.map((char) => ({ id: char.id, name: char.name || 'Unnamed Character' }))
	);

	// Check if player already has a character in this campaign
	// This is a reactive state that will be updated when the campaign loads
	let playerHasCharacterInCampaign = $state(false);

	// Update the check when campaign or characters change
	$effect(() => {
		if (!campaignId || !isPlayer || !user.user?.clerk_id) {
			playerHasCharacterInCampaign = false;
			return;
		}

		// Check if player owns any non-claimable character in this campaign
		// Note: campaignCharacters is already filtered to this campaign, so we don't need to check campaign_id
		const hasCharacter = campaignCharacters.some(
			(char) =>
				char.owner_user_id === user.user?.clerk_id &&
				!char.claimable
		);

		playerHasCharacterInCampaign = hasCharacter;
	});

	async function handleCreateCharacter() {
		if (!campaignId) return;

		try {
			if (isGM) {
				// GM creates claimable character
				const { create_character } = await import('$lib/remote/characters.remote');
				const id = await create_character({ campaign_id: campaignId, claimable: true });
				showAddCharacterDialog = false;
				addCharacterMode = 'create';
				await goto(`/characters/${id}/edit/`);
			} else {
				// Player creates regular character
				const id = await user.create_character(campaignId);
				showAddCharacterDialog = false;
				addCharacterMode = 'create';
				await goto(`/characters/${id}/edit/`);
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create character');
		}
	}

	async function handleAddExistingCharacter() {
		if (!selectedCharacterId || !campaignId) return;

		try {
			if (isGM) {
				// GM adds existing character as claimable
				const { assign_character_to_campaign } = await import('$lib/remote/campaigns.remote');
				await assign_character_to_campaign({
					character_id: selectedCharacterId,
					campaign_id: campaignId,
					claimable: true
				});
			} else {
				// Player assigns existing character
				await campaignContext.assignCharacter(selectedCharacterId, campaignId);
			}
			showAddCharacterDialog = false;
			addCharacterMode = 'create';
			selectedCharacterId = '';
			await campaignContext.load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to add character');
		}
	}

	async function handleRemoveCharacter(characterId: string) {
		if (!campaignId) return;

		try {
			await campaignContext.assignCharacter(characterId, null);
		} catch (err) {
			// Error handling is done in assignCharacter
		}
	}

	async function handleClaimCharacter(characterId: string) {
		if (!characterId || !campaignId) return;

		try {
			await campaignContext.claimCharacter(characterId);
			toast.success('Character claimed successfully');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to claim character');
		}
	}

	// Reset dialog state when closed
	$effect(() => {
		if (!showAddCharacterDialog) {
			addCharacterMode = 'create';
			selectedCharacterId = '';
		}
	});
</script>

{#if campaign}
	<!-- Characters Section -->
	<div class="rounded border bg-card p-3 pb-6">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold">Characters</h2>
			<Button variant="default" size="sm" onclick={() => (showAddCharacterDialog = true)}>
				Add Character
			</Button>
		</div>

		{#if assignedCharacters.length === 0 && unassignedCharacters.length === 0}
			<p class="text-sm text-muted-foreground">No characters assigned yet.</p>
		{:else}
			{#if assignedCharacters.length > 0}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each assignedCharacters as char}
						<div class="mx-auto w-full max-w-[500px] overflow-hidden rounded">
							<a
								href={`/characters/${char.id}/`}
								class="flex gap-2 border bg-primary-muted p-1 hover:bg-primary-muted/80"
							>
								<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2">
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
									href={`/characters/${char.id}/`}
								>
									View
								</Button>
								{#if isGM}
									<Button
										variant="ghost"
										size="sm"
										class="hover:text-text grow rounded-none border border-x-0"
										href={`/characters/${char.id}/edit`}
									>
										Edit
									</Button>
									<Button
										variant="ghost"
										size="sm"
										class="grow rounded-none border text-destructive hover:text-destructive"
										onclick={() => handleRemoveCharacter(char.id)}
									>
										Remove
									</Button>
								{:else if char.owner_user_id === user.user?.clerk_id}
									<Button
										variant="ghost"
										size="sm"
										class="hover:text-text grow rounded-none border border-x-0"
										href={`/characters/${char.id}/edit`}
									>
										Edit
									</Button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if unassignedCharacters.length > 0}
				<div class="mt-6">
					<h3 class="mb-4 text-md font-semibold">Unassigned Characters</h3>
					<p class="mb-4 text-sm text-muted-foreground">
						{isGM
							? 'These characters are available for players to claim.'
							: 'These characters are available for you to claim.'}
					</p>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each unassignedCharacters as char}
							<div class="mx-auto w-full max-w-[500px] overflow-hidden rounded">
								<a
									href={`/characters/${char.id}/`}
									class="flex gap-2 border bg-primary-muted p-1 hover:bg-primary-muted/80"
								>
									<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2">
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
										href={`/characters/${char.id}/`}
									>
										View
									</Button>
									{#if isPlayer}
										<Button
											variant="default"
											size="sm"
											class="grow rounded-none border border-x-0"
											onclick={() => handleClaimCharacter(char.id)}
											disabled={user.all_characters.length >= 3 || playerHasCharacterInCampaign}
											title={
												playerHasCharacterInCampaign
													? 'You can only claim one character per campaign'
													: user.all_characters.length >= 3
														? 'Character limit reached. You can only have 3 characters.'
														: ''
											}
										>
											Claim
										</Button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Add Character Dialog -->
	<Dialog.Root bind:open={showAddCharacterDialog}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Add Character</Dialog.Title>
				<Dialog.Description>
					{isGM
						? 'Create a claimable character or add an existing character for players to claim.'
						: 'Create a new character or assign an existing character to this campaign.'}
				</Dialog.Description>
			</Dialog.Header>

			<div class="flex flex-col gap-4 py-4">
				<!-- Mode selection (tabs/radio buttons) -->
				<div class="flex gap-2 border-b">
					<button
						type="button"
						class={cn(
							'flex-1 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
							addCharacterMode === 'create'
								? 'border-primary text-foreground'
								: 'border-transparent text-muted-foreground hover:text-foreground'
						)}
						onclick={() => {
							addCharacterMode = 'create';
							selectedCharacterId = '';
						}}
					>
						{isGM ? 'Create Claimable Character' : 'Create Character'}
					</button>
					<button
						type="button"
						class={cn(
							'flex-1 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
							addCharacterMode === 'existing'
								? 'border-primary text-foreground'
								: 'border-transparent text-muted-foreground hover:text-foreground'
						)}
						onclick={() => {
							addCharacterMode = 'existing';
							selectedCharacterId = '';
						}}
						disabled={isGM ? availableGmCharacters.length === 0 : availableCharacters.length === 0}
					>
						{isGM ? 'Add Existing Character' : 'Assign Existing Character'}
					</button>
				</div>

				{#if addCharacterMode === 'create'}
					<div class="flex flex-col gap-2">
						<p class="text-sm text-muted-foreground">
							{isGM
								? 'This will create an unassigned character that players can claim. You will be able to edit the character before it\'s claimed.'
								: 'This will create a new character and assign it to this campaign.'}
						</p>
						{#if !isGM && user.all_characters.length >= 3}
							<p class="text-sm text-destructive">
								You have reached the character limit (3 characters).
							</p>
						{/if}
					</div>
				{:else}
					<div class="flex flex-col gap-2">
						<Label.Root>Character</Label.Root>
						<Select.Root
							type="single"
							value={selectedCharacterId}
							onValueChange={(v) => (selectedCharacterId = v || '')}
						>
							<Select.Trigger class="w-full">
								<p class="truncate">
									{selectedCharacterId
										? (isGM
												? availableGmCharacters.find((c) => c.id === selectedCharacterId)?.name ||
													'Unnamed Character'
												: availableCharacters.find((c) => c.id === selectedCharacterId)?.name ||
													'Unnamed Character')
										: 'Select a character...'}
								</p>
							</Select.Trigger>
							<Select.Content>
								{#each (isGM ? availableGmCharacters : availableCharacters) as char}
									<Select.Item value={char.id}>{char.name || 'Unnamed Character'}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						<p class="text-sm text-muted-foreground">
							{isGM
								? 'This will add an existing character as unassigned for players to claim.'
								: 'Select a character to add to this campaign.'}
						</p>
					</div>
				{/if}
			</div>

			<Dialog.Footer class="flex gap-3">
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				>
					Cancel
				</Dialog.Close>
				{#if addCharacterMode === 'create'}
					<Button
						onclick={handleCreateCharacter}
						disabled={!isGM && user.all_characters.length >= 3}
					>
						{isGM ? 'Create Claimable Character' : 'Create Character'}
					</Button>
				{:else}
					<Button
						onclick={handleAddExistingCharacter}
						disabled={!selectedCharacterId}
					>
						{isGM ? 'Add Character' : 'Assign Character'}
					</Button>
				{/if}
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}

