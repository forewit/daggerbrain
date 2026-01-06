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
	import { error } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

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

	// Separate characters into assigned and unassigned
	// Assigned = characters that are not claimable (have an owner assigned)
	// Unassigned = characters that are claimable (available to be claimed)
	const assignedCharacters = $derived(
		campaignCharacters.filter((char) => {
			// Both GMs and players see non-claimable characters as assigned
			return !char.claimable;
		})
	);
	const unassignedCharacters = $derived(
		campaignCharacters.filter((char) => {
			// Both GMs and players see all claimable characters as unassigned
			return char.claimable;
		})
	);

	// Add Character dialog state
	let showAddCharacterDialog = $state(false);
	let addCharacterMode = $state<'create' | 'existing'>('create');
	let selectedCharacterId = $state('');

	// Unassign character dialog state
	let showUnassignDialog = $state(false);
	let characterToUnassign = $state<string | null>(null);

	// Remove character dialog state
	let showRemoveDialog = $state(false);
	let characterToRemove = $state<string | null>(null);

	// Leave campaign dialog state
	let showLeaveCampaignDialog = $state(false);

	// Character limit warning dialog state
	let showCharacterLimitDialog = $state(false);

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

		// Check if player owns any non-unassigned character in this campaign
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
			let characterId: string;
			if (isGM) {
				// GM creates unassigned character
				const { create_character } = await import('$lib/remote/characters.remote');
				characterId = await create_character({ campaign_id: campaignId, claimable: true });
			} else {
				// Player creates regular character
				characterId = await user.create_character(campaignId);
			}
			showAddCharacterDialog = false;
			addCharacterMode = 'create';
			await campaignContext.load();
			// Navigate to character edit screen
			await goto(`/characters/${characterId}/edit`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create character');
		}
	}

	async function handleAddExistingCharacter() {
		if (!selectedCharacterId || !campaignId) return;

		try {
			if (isGM) {
				// GM adds existing character as unassigned
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

	async function handleRemoveCharacter() {
		if (!characterToRemove || !campaignId) return;

		try {
			await campaignContext.assignCharacter(characterToRemove, null);
			showRemoveDialog = false;
			characterToRemove = null;
		} catch (err) {
			// Error handling is done in assignCharacter
		}
	}

	async function handleClaimCharacter(characterId: string) {
		if (!characterId || !campaignId) return;

		// Check if player has reached character limit
		if (user.all_characters.length >= 3) {
			showCharacterLimitDialog = true;
			return;
		}

		try {
			await campaignContext.claimCharacter(characterId);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to claim character');
		}
	}

	async function handleUnassignCharacter() {
		if (!characterToUnassign || !campaignId) return;

		try {
			await campaignContext.unassignCharacter(characterToUnassign);
			showUnassignDialog = false;
			characterToUnassign = null;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to unassign character');
		}
	}

	async function handleLeaveCampaign() {
		if (!campaignId) return;

		try {
			await campaignContext.leaveCampaign();
			// leaveCampaign already navigates away, so we don't need to close dialog
		} catch (err) {
			// Error handling is done in leaveCampaign
			showLeaveCampaignDialog = false;
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

{#snippet characterCard(char: (typeof campaignCharacters)[number], showClaimButton: boolean = false)}
	{@const playerName = char.owner_name || (char.owner_user_id === user.user?.clerk_id ? 'you' : 'Anonymous')}
	
	<div
		class="mx- w-full overflow-hidden rounded"
	>
		<a
			href={`/characters/${char.id}/`}
			class="flex gap-2 border bg-primary-muted p-1 hover:bg-primary-muted/80"
		>
			<div class="size-19 shrink-0 overflow-hidden rounded-lg border-2">
				<img
					src={char.image_url || '/images/portrait-placeholder.png'}
					alt={char.name.trim() || 'Unnamed Character'}
					class="h-full w-full object-cover"
				/>
			</div>
			<div class="truncate grow">
				<p class=" truncate text-lg font-bold">
					{char.name.trim() || 'Unnamed Character'}
				</p>
				<p class=" truncate text-xs text-muted-foreground">
					{char.derived_descriptors.ancestry_name || 'No ancestry'}
					&ensp;•&ensp;
					{char.derived_descriptors.primary_class_name || 'No class'}
					&ensp;•&ensp;
					{char.derived_descriptors.primary_subclass_name || 'No subclass'}
				</p>
				{#if !char.claimable}
					<div class="mt-1.5 truncate text-center py-0.5 px-2 text-accent text-xs bg-accent/10 border border-accent/20 rounded-full w-min">
						Player: {playerName}
					</div>
				{/if}
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
					onclick={() => {
						characterToRemove = char.id;
						showRemoveDialog = true;
					}}
				>
					Remove
				</Button>
			{:else if char.owner_user_id === user.user?.clerk_id && !char.claimable}
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
					class="grow rounded-none border border-x-0 text-destructive hover:text-destructive"
					onclick={() => {
						characterToUnassign = char.id;
						showUnassignDialog = true;
					}}
				>
					Unassign
				</Button>
				<Button
					variant="ghost"
					size="sm"
					class="grow rounded-none border text-destructive hover:text-destructive"
					onclick={() => (showLeaveCampaignDialog = true)}
				>
					Leave
				</Button>
			{/if}
			{#if showClaimButton && isPlayer && !playerHasCharacterInCampaign}
				<Button
					variant="default"
					size="sm"
					class="grow rounded-none border border-x-0"
					onclick={() => handleClaimCharacter(char.id)}
				>
					Claim
				</Button>
			{/if}
		</div>
	</div>
{/snippet}

{#if campaign}
	<!-- Characters Section -->
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold">Active Characters</h2>
			<Button variant="outline" size="sm" onclick={() => (showAddCharacterDialog = true)}>
				{isGM ? 'Add Unassigned Character' : 'Add Character'}
			</Button>
		</div>

		{#if assignedCharacters.length === 0 && unassignedCharacters.length === 0}
			<p class="text-sm text-muted-foreground">No characters assigned yet.</p>
		{:else}
			{#if assignedCharacters.length > 0}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each assignedCharacters as char}
						{@render characterCard(char, false)}
					{/each}
				</div>
			{/if}

			{#if unassignedCharacters.length > 0}
				<div class="mt-6">
					<h3 class="mb-1 text-md font-semibold">Unassigned Characters</h3>
					<p class="mb-4 text-xs text-muted-foreground">
							These characters are available for players in the campaign to claim.
					</p>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each unassignedCharacters as char}
							{@render characterCard(char, true)}
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
						? 'Create an unassigned character or add an existing character for players to claim.'
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
						{isGM ? 'Create Unassigned Character' : 'Create Character'}
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
						{isGM ? 'Create Unassigned Character' : 'Create Character'}
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

	<!-- Unassign Character Confirmation Dialog -->
	<Dialog.Root bind:open={showUnassignDialog}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Unassign Character</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to unassign this character? If the character is claimed by another player in your campaign, you will no longer be able to edit that character unless you are the GM of that character's campaign.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="flex gap-3">
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
					onclick={() => {
						characterToUnassign = null;
					}}
				>
					Cancel
				</Dialog.Close>
				<Button
					variant="destructive"
					onclick={handleUnassignCharacter}
				>
					Unassign
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Remove Character Confirmation Dialog -->
	<Dialog.Root bind:open={showRemoveDialog}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Remove Character</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to remove this character from the campaign? This will remove the character from the campaign but will not delete the character.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="flex gap-3">
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
					onclick={() => {
						characterToRemove = null;
					}}
				>
					Cancel
				</Dialog.Close>
				<Button
					variant="destructive"
					onclick={handleRemoveCharacter}
				>
					Remove
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Leave Campaign Confirmation Dialog -->
	<Dialog.Root bind:open={showLeaveCampaignDialog}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Leave Campaign</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to leave <strong>{campaign?.name}</strong>? This action cannot be undone.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="flex gap-3">
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				>
					Cancel
				</Dialog.Close>
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'destructive' }))}
					onclick={handleLeaveCampaign}
				>
					Leave Campaign
				</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Character Limit Warning Dialog -->
	<Dialog.Root bind:open={showCharacterLimitDialog}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Character Limit Reached</Dialog.Title>
				<Dialog.Description>
					<p class="mb-2">You cannot claim a character until you have an empty character slot.</p>
			
					<Button variant="link" href="/characters" class="pl-0 text-accent">
					 <ArrowRight/>
						Manage Characters
					</Button>
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="flex gap-3">
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'default' }))}
				>
					OK
				</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}

