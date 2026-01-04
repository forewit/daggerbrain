<!-- src/lib/components/app/campaigns/campaign-overview-player.svelte -->
<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Label from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { error } from '@sveltejs/kit';
	import { assign_character_to_campaign, leave_campaign } from '$lib/remote/campaigns.remote';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import type { Campaign, CampaignCharacterSummary, CampaignMember } from '$lib/types/campaign-types';

	let {
		campaign,
		characters,
		availableCharacters,
		userMembership,
		user,
		campaignId
	}: {
		campaign: Campaign;
		characters: Record<string, CampaignCharacterSummary>;
		availableCharacters: Array<{ id: string; name: string }>;
		userMembership: CampaignMember | null;
		user: ReturnType<typeof import('$lib/state/user.svelte').getUserContext>;
		campaignId: string;
	} = $props();

	const campaignContext = getCampaignContext();

	// Character assignment dialog
	let showAssignDialog = $state(false);
	let selectedCharacterId = $state('');

	// Leave campaign confirmation dialog
	let showLeaveDialog = $state(false);

	// Get characters in this campaign
	const campaignCharacters = $derived(Object.values(characters));

	async function handleAssignCharacter() {
		if (!selectedCharacterId || !campaignId) return;

		try {
			await assign_character_to_campaign({
				character_id: selectedCharacterId,
				campaign_id: campaignId
			});
			// Refresh characters
			await campaignContext.refreshCharacters();
			showAssignDialog = false;
			selectedCharacterId = '';
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to assign character');
		}
	}

	async function handleLeaveCampaign() {
		if (!campaignId) return;

		try {
			await leave_campaign(campaignId);
			await goto('/campaigns');
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to leave campaign');
		}
	}
</script>

<!-- Title -->
<div class="flex items-center justify-between gap-2">
	<div>
		<h1 class="text-2xl font-bold">{campaign.name}</h1>
		{#if campaign.description}
			<p class="text-sm text-muted-foreground">{campaign.description}</p>
		{/if}
	</div>
	<div class="flex items-center gap-2">
		<Button variant="outline" size="sm" href={`/campaigns/${campaignId}/live`}>
			Launch
			<ExternalLink class="size-3.5" />
		</Button>
	</div>
</div>

<!-- Characters Section -->
<div class="rounded border bg-card p-3 pb-6">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-lg font-semibold">Characters</h2>
		<div class="flex gap-2">
			<Button
				variant="default"
				size="sm"
				disabled={user.all_characters.length >= 3}
				onclick={async () => {
					try {
						const id = await user.create_character(campaignId);
						await goto(`/characters/${id}/edit/`);
					} catch (err) {
						error(500, err instanceof Error ? err.message : 'Failed to create character');
					}
				}}
			>
				Create Character
			</Button>
			{#if availableCharacters.length > 0}
				<Button variant="outline" size="sm" onclick={() => (showAssignDialog = true)}>
					Assign Character
				</Button>
			{/if}
		</div>
	</div>

	{#if campaignCharacters.length === 0}
		<p class="text-sm text-muted-foreground">No characters assigned yet.</p>
	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each campaignCharacters as char}
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
						{#if char.owner_user_id === user.user?.clerk_id}
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
</div>

{#if userMembership && userMembership.role !== 'gm'}
	<Button
		variant="link"
		class="w-min mx-auto sm:mx-0 text-destructive"
		onclick={() => (showLeaveDialog = true)}
	>
		Leave Campaign
	</Button>
{/if}

<!-- Assign Character Dialog -->
<Dialog.Root bind:open={showAssignDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Assign Character</Dialog.Title>
			<Dialog.Description>Select a character to add to this campaign.</Dialog.Description>
		</Dialog.Header>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				if (selectedCharacterId) {
					handleAssignCharacter();
				}
			}}
		>
			<div class="flex flex-col gap-4 py-4">
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
									? availableCharacters.find((c) => c.id === selectedCharacterId)?.name ||
										'Unnamed Character'
									: 'Select a character...'}
							</p>
						</Select.Trigger>
						<Select.Content>
							{#each availableCharacters as char}
								<Select.Item value={char.id}>{char.name || 'Unnamed Character'}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>

			<Dialog.Footer class="flex gap-3">
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				>
					Cancel
				</Dialog.Close>
				<Button type="submit" disabled={!selectedCharacterId}>
					Assign
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Leave Campaign Confirmation Dialog -->
<Dialog.Root bind:open={showLeaveDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Leave Campaign</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to leave <strong>{campaign?.name}</strong>? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-3 pt-4">
			<Dialog.Close class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}>
				Cancel
			</Dialog.Close>
			<Dialog.Close class={buttonVariants({ variant: 'destructive' })} onclick={handleLeaveCampaign}>
				Leave Campaign
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

