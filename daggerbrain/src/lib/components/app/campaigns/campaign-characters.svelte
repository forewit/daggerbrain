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
	import { UI_CHARACTER_LIMIT } from '$lib/types/constants';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import Loader2 from '@lucide/svelte/icons/loader-2';


	let { class: className }: { class?: string } = $props();

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
		if (!campaignId || !user?.user?.clerk_id) return null;
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
	const unassignedCharacters = $derived.by(() => {
		const result = campaignCharacters.filter((char) => {
			// Both GMs and players see all claimable characters as unassigned
			return char.claimable;
		});
		return result;
	});

	// Add Character dialog state
	let showAddCharacterDialog = $state(false);
	let selectedCharacterId = $state('');
	let isAddingCharacter = $state(false);

	// Unassign character dialog state
	let showUnassignDialog = $state(false);
	let characterToUnassign = $state<string | null>(null);

	// Remove character dialog state
	let showRemoveDialog = $state(false);
	let characterToRemove = $state<string | null>(null);
	let isRemovingCharacter = $state(false);

	// Leave campaign dialog state
	let showLeaveCampaignDialog = $state(false);

	// Character limit warning dialog state
	let showCharacterLimitDialog = $state(false);

	// Get available characters for assignment
	const availableCharacters = $derived(
		user?.all_characters
			.filter((char) => !char.campaign_id || char.campaign_id !== campaignId)
			.map((char) => ({ id: char.id, name: char.name || 'Unnamed Character' })) || []
	);

	// Get GM's characters not in any campaign for the add dialog
	const availableGmCharacters = $derived(
		user?.all_characters
			.filter((char) => !char.campaign_id)
			.map((char) => ({ id: char.id, name: char.name || 'Unnamed Character' })) || []
	);

	// Check if player already has a character in this campaign
	// This is a reactive state that will be updated when the campaign loads
	let playerHasCharacterInCampaign = $state(false);

	// Update the check when campaign or characters change
	$effect(() => {
		if (!campaignId || !isPlayer || !user?.user?.clerk_id) {
			playerHasCharacterInCampaign = false;
			return;
		}

		// Check if player owns any non-unassigned character in this campaign
		// Note: campaignCharacters is already filtered to this campaign, so we don't need to check campaign_id
		const hasCharacter = campaignCharacters.some(
			(char) => char.owner_user_id === user.user?.clerk_id && !char.claimable
		);

		playerHasCharacterInCampaign = hasCharacter;
	});

	async function handleCreateCharacter() {
		if (!campaignId) return;

		try {
			let characterId: string;
			if (isGM) {
				// GM creates unassigned character (claimable by players)
				if (!user?.create_character) throw new Error('User context not available');
				characterId = await user.create_character(campaignId, { claimable: true });
			} else {
				// Player creates regular character
				if (!user?.create_character) throw new Error('User context not available');
				characterId = await user.create_character(campaignId);
			}
			showAddCharacterDialog = false;
			await campaignContext.load();
			// Navigate to character edit screen
			await goto(`/characters/${characterId}/edit`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create character');
		}
	}

	async function handleAddExistingCharacter(characterId?: string) {
		const idToUse = characterId || selectedCharacterId;
		if (!idToUse || !campaignId || isAddingCharacter) return;

		isAddingCharacter = true;
		try {
			if (isGM) {
				// GM adds existing character as unassigned (claimable by players)
				await campaignContext.assignCharacter(idToUse, campaignId, { claimable: true });
			} else {
				// Player assigns existing character
				await campaignContext.assignCharacter(idToUse, campaignId);
			}
			showAddCharacterDialog = false;
			selectedCharacterId = '';
			await campaignContext.load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to add character');
		} finally {
			isAddingCharacter = false;
		}
	}

	async function handleRemoveCharacter() {
		if (!characterToRemove || !campaignId || isRemovingCharacter) return;

		isRemovingCharacter = true;
		try {
			await campaignContext.assignCharacter(characterToRemove, null);
			showRemoveDialog = false;
			characterToRemove = null;
		} catch (err) {
			// Error handling is done in assignCharacter
		} finally {
			isRemovingCharacter = false;
		}
	}

	async function handleClaimCharacter(characterId: string) {
		if (!characterId || !campaignId) return;

		// Check if player has reached character limit
		if (user?.all_characters?.length >= 3) {
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
			selectedCharacterId = '';
			isAddingCharacter = false;
		}
		if (!showRemoveDialog) {
			isRemovingCharacter = false;
		}
	});
</script>

{#snippet characterCard(
	char: (typeof campaignCharacters)[number],
	showClaimButton: boolean = false
)}
	{@const playerName =
		char.owner_name || (char.owner_user_id === user?.user?.clerk_id ? 'you' : 'Anonymous')}

	<div class="mx- w-full overflow-hidden rounded-lg shadow-lg">
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
			<div class="grow truncate">
				<p class=" truncate text-lg font-bold">
					{char.name.trim() || 'Unnamed Character'}
				</p>
				<p class=" truncate text-xs text-muted-foreground">
					{char.derived_character_summary?.ancestry_name || 'No ancestry'}
					&ensp;•&ensp;
					{char.derived_character_summary?.primary_class_name || 'No class'}
					&ensp;•&ensp;
					{char.derived_character_summary?.primary_subclass_name || 'No subclass'}
				</p>
				{#if !char.claimable}
					<div
						class="mt-1.5 w-min truncate rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-center text-xs text-accent"
					>
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
	<div class={className}>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold">Active Characters</h2>
			{#if isGM || !playerHasCharacterInCampaign}
				<Button variant="outline" size="sm" onclick={() => (showAddCharacterDialog = true)}>
					Add Character
				</Button>
			{/if}
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
					<h3 class="text-md mb-1 font-semibold">Unassigned Characters</h3>
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
		<Dialog.Content class="flex max-h-[90%] flex-col sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Add Character</Dialog.Title>
				<Dialog.Description>
					{isGM
						? 'Add characters to this campaign that players can claim.'
						: 'Add one of your characters to this campaign.'}
				</Dialog.Description>
			</Dialog.Header>

			<div class="flex flex-col gap-6 overflow-y-auto py-4">
				{#if isGM}
					<div class="mb-2 rounded border border-accent/20 bg-accent/10 p-2">
						<p class="text-sm text-accent/80">
							<TriangleAlert class="-mt-[4px] mr-[5px] inline size-3.5" />Characters you add can be
							claimed by players. You will not be able to edit these characters unless you are the
							GM of that character's campaign.
						</p>
					</div>
				{/if}

				<div class="flex flex-col gap-2">
					<Label.Root>Add Existing Character</Label.Root>
					<Select.Root
						type="single"
						value={selectedCharacterId || 'none'}
						onValueChange={(v) => {
							if (v === 'none') {
								selectedCharacterId = '';
							} else if (v) {
								selectedCharacterId = v;
							}
						}}
					>
						<Select.Trigger class="w-full">
							<p class="truncate">
								{selectedCharacterId && selectedCharacterId !== 'none'
									? isGM
										? availableGmCharacters.find((c) => c.id === selectedCharacterId)?.name ||
											'Unnamed Character'
										: availableCharacters.find((c) => c.id === selectedCharacterId)?.name ||
											'Unnamed Character'
									: 'None'}
							</p>
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="none">None</Select.Item>
							{#each isGM ? availableGmCharacters : availableCharacters as char}
								<Select.Item value={char.id}>{char.name || 'Unnamed Character'}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="flex items-center gap-4">
					<div class="h-px flex-1 bg-border"></div>
					<span class="text-sm text-muted-foreground">Or</span>
					<div class="h-px flex-1 bg-border"></div>
				</div>

				<div class="flex flex-col gap-2">
					<Button
						onclick={handleCreateCharacter}
						disabled={(user?.all_characters?.length ?? 0) >= UI_CHARACTER_LIMIT}
					>
						Create New Character
					</Button>
					{#if (user?.all_characters?.length ?? 0) >= UI_CHARACTER_LIMIT}
						<p class="text-xs text-muted-foreground">
							* You have reached the character limit. Free up a character slot to create a new
							character.
						</p>
					{/if}
				</div>
			</div>

			<Dialog.Footer class="flex gap-3">
				<div class="grow"></div>
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				>
					Cancel
				</Dialog.Close>
				{#if selectedCharacterId && selectedCharacterId !== 'none'}
					<Button
						onclick={() => handleAddExistingCharacter(selectedCharacterId)}
						disabled={isAddingCharacter}
					>
						{#if isAddingCharacter}
							<Loader2 class="size-4 animate-spin" />
							Adding...
						{:else}
							Add Character
						{/if}
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
					Are you sure you want to unassign this character? If the character is claimed by another
					player in your campaign, you will no longer be able to edit that character unless you are
					the GM of that character's campaign.
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
				<Button variant="destructive" onclick={handleUnassignCharacter}>Unassign</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Remove Character Confirmation Dialog -->
	<Dialog.Root bind:open={showRemoveDialog}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Remove Character</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to remove this character from the campaign? This will remove the
					character from the campaign but will not delete the character.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="flex gap-3">
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
					onclick={() => {
						characterToRemove = null;
						isRemovingCharacter = false;
					}}
				>
					Cancel
				</Dialog.Close>
				<Button
					variant="destructive"
					onclick={handleRemoveCharacter}
					disabled={isRemovingCharacter}
				>
					{#if isRemovingCharacter}
						<Loader2 class="size-4 animate-spin" />
						Removing...
					{:else}
						Remove
					{/if}
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
					Are you sure you want to leave <strong>{campaign?.name}</strong>? This action cannot be
					undone.
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
						<ArrowRight />
						Manage Characters
					</Button>
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="flex gap-3">
				<Dialog.Close type="button" class={cn(buttonVariants({ variant: 'default' }))}>
					OK
				</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
