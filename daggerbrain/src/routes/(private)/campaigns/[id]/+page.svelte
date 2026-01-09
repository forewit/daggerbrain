<!-- src/routes/(private)/campaigns/[id]/+page.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import Input from '$lib/components/ui/input/input.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Footer from '$lib/components/app/footer.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import CampaignInviteLink from '$lib/components/app/campaigns/campaign-invite-link.svelte';
	import CampaignVault from '$lib/components/app/campaigns/campaign-vault.svelte';
	import CampaignNotes from '$lib/components/app/campaigns/campaign-notes.svelte';
	import CampaignCharacters from '$lib/components/app/campaigns/campaign-characters.svelte';
	import CampaignHeader from '$lib/components/app/campaigns/campaign-overview-header.svelte';
	import { page } from '$app/state';

	let { data }: { data: import('./$types').PageData } = $props();

	const user = getUserContext();
	const campaignId = $derived(page.params.id);

	// Set up campaign context (reactive to campaignId changes)
	const campaign = getCampaignContext();
	const loading = $derived(campaign.loading);

	// Settings dialog state
	let showSettingsDialog = $state(false);
	let campaignName = $state('');
	let campaignDescription = $state('');
	let gmDisplayName = $state('');
	let fearVisibleToPlayers = $state(false);
	let isDeleting = $state(false);

	// Player settings dialog state
	let showPlayerSettingsDialog = $state(false);
	let playerDisplayName = $state('');
	let isLeaving = $state(false);
	let showLeaveConfirmation = $state(false);

	// Initialize settings dialog values
	$effect(() => {
		if (campaign.campaign) {
			campaignName = campaign.campaign.name;
			campaignDescription = campaign.campaign.description || '';
		}
	});

	// Initialize GM display name and fear visibility when settings dialog opens
	$effect(() => {
		if (campaign.userMembership && showSettingsDialog) {
			gmDisplayName = campaign.userMembership.display_name || '';
		}
		if (campaign.campaignState && showSettingsDialog) {
			fearVisibleToPlayers = campaign.campaignState.fear_visible_to_players ?? false;
		}
	});

	// Check if there are any changes
	const hasChanges = $derived(
		campaign.campaign &&
			(campaignName.trim() !== campaign.campaign.name ||
				(gmDisplayName.trim() || '') !== (campaign.userMembership?.display_name || '') ||
				fearVisibleToPlayers !== (campaign.campaignState?.fear_visible_to_players ?? false))
	);

	function handleSave() {
		if (!campaignId || !campaignName.trim() || !campaign.campaign) return;

		// Update campaign name - auto-save will handle persistence
		campaign.campaign.name = campaignName.trim();

		// Update GM display name if it changed - auto-save will handle persistence
		if (gmDisplayName.trim() !== (campaign.userMembership?.display_name || '')) {
			if (campaign.userMembership) {
				campaign.userMembership = {
					...campaign.userMembership,
					display_name: gmDisplayName.trim() || null
				};
			}
		}

		// Update fear visibility if it changed - auto-save will handle persistence
		if (fearVisibleToPlayers !== (campaign.campaignState?.fear_visible_to_players ?? false)) {
			if (campaign.campaignState) {
				campaign.campaignState = {
					...campaign.campaignState,
					fear_visible_to_players: fearVisibleToPlayers
				};
			}
		}

		showSettingsDialog = false;
	}

	async function handleDelete() {
		if (!campaignId || isDeleting) return;

		isDeleting = true;
		try {
			await campaign.deleteCampaign();
		} catch (err) {
			// Error handling is done in deleteCampaign
			isDeleting = false;
		}
	}

	const isGM = $derived(data.role === 'gm');

	let deleteConfirmation = $state('');
	$effect(() => {
		if (!showSettingsDialog) {
			deleteConfirmation = '';
			gmDisplayName = '';
			fearVisibleToPlayers = campaign.campaignState?.fear_visible_to_players ?? false;
		}
	});

	// Initialize player settings dialog values
	$effect(() => {
		if (campaign.userMembership && showPlayerSettingsDialog) {
			playerDisplayName = campaign.userMembership.display_name || '';
		}
	});

	// Check if player display name has changed
	const hasPlayerChanges = $derived(
		campaign.userMembership &&
			playerDisplayName.trim() !== (campaign.userMembership.display_name || '')
	);

	function handleSavePlayerSettings() {
		if (!campaignId || !campaign.userMembership) return;

		// Update player display name - auto-save will handle persistence
		campaign.userMembership = {
			...campaign.userMembership,
			display_name: playerDisplayName.trim() || null
		};

		showPlayerSettingsDialog = false;
	}

	async function handleLeaveCampaign() {
		if (!campaignId || isLeaving) return;

		isLeaving = true;
		try {
			await campaign.leaveCampaign();
			// leaveCampaign already navigates away, so we don't need to close dialog
		} catch (err) {
			isLeaving = false;
			// Error handling is done in leaveCampaign
		}
	}
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else if !campaign.campaign}
		<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
			<p class="text-sm text-muted-foreground italic">Campaign not found</p>
			<Button href="/campaigns">Campaigns</Button>
		</div>
	{:else if campaignId}
		<CampaignHeader
			{campaignId}
			{isGM}
			onSettingsClick={() => (showSettingsDialog = true)}
			onPlayerSettingsClick={() => (showPlayerSettingsDialog = true)}
		/>
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start ',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<div class=" w-full max-w-6xl px-4 pt-4 pb-8">
				{#if campaignId && campaign.campaign}
					<div class="flex flex-col gap-6">
						<div class="flex justify-end">
							<CampaignInviteLink {isGM} class="grow" />
						</div>
						<CampaignCharacters />
						{#if isGM}
							<CampaignVault {campaignId} />

							<CampaignNotes {campaignId} />
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<Footer />

<!-- GM Settings Dialog -->
<Dialog.Root bind:open={showSettingsDialog}>
	<Dialog.Content class="flex max-h-[90%] flex-col">
		<Dialog.Header>
			<Dialog.Title>Campaign Settings</Dialog.Title>
			<!-- <Dialog.Description>Manage your campaign settings and information.</Dialog.Description> -->
		</Dialog.Header>

		<form
			class="flex flex-col gap-6 overflow-y-auto py-4"
			onsubmit={(e) => {
				e.preventDefault();
				handleSave();
			}}
		>
			<div class="flex flex-col gap-2">
				<Label>Campaign Name</Label>
				<Input bind:value={campaignName} placeholder="Campaign name" required />
			</div>
			<div class="flex flex-col gap-2">
				<Label>Your Display Name (GM)</Label>
				<Input bind:value={gmDisplayName} placeholder="Enter your display name (optional)" />
				<p class="text-xs text-muted-foreground">
					This is how other players will see your name in this campaign.
				</p>
			</div>

			<div class="flex flex-col gap-2">
				<Label class="cursor-pointer items-start">
					<div class="flex items-center gap-3">
						<Switch
							checked={fearVisibleToPlayers}
							onCheckedChange={(checked) => (fearVisibleToPlayers = checked ?? false)}
						/>
						<div class="space-y-1">
							<p class="whitespace-nowrap">Fear Visible to Players</p>
							<p class="text-xs font-normal text-muted-foreground">
								If enabled, players can see the Fear tracker on their character sheets.
							</p>
						</div>
					</div>
				</Label>
			</div>

			<div
				class="my-2 flex flex-col gap-2 rounded border border-destructive/20 bg-destructive/5 p-2"
			>
				<Label class="font-bold text-destructive">Danger Zone</Label>
				<p class="text-xs text-destructive">
					Type "delete" to delete <strong>{campaign.campaign?.name || 'Campaign'}</strong>.
				</p>
				<div class="flex gap-2">
					<Input
						bind:value={deleteConfirmation}
						class=" border-destructive/20 bg-card/50"
						onkeydown={(e) => {
							if (e.key === 'Enter' && deleteConfirmation === 'delete' && !isDeleting) {
								e.preventDefault();
								handleDelete();
							}
						}}
					/>
					<Button
						type="button"
						variant="destructive"
						class="w-min"
						disabled={deleteConfirmation !== 'delete' || isDeleting}
						onclick={handleDelete}
					>
						{#if isDeleting}
							<Loader2 class="size-4 animate-spin" />
							Deleting...
						{:else}
							Delete Campaign
						{/if}
					</Button>
				</div>
			</div>

			<button type="submit" class="hidden">Save</button>
		</form>

		<Dialog.Footer class="flex gap-3">
			<div class="grow"></div>
			<Dialog.Close
				type="button"
				class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
			>
				Cancel
			</Dialog.Close>
			<Button onclick={handleSave} disabled={!hasChanges || !campaignName.trim()}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Player Settings Dialog -->
<Dialog.Root bind:open={showPlayerSettingsDialog}>
	<Dialog.Content class="flex max-h-[90%] flex-col">
		<Dialog.Header>
			<Dialog.Title>Player Settings</Dialog.Title>
		</Dialog.Header>

		<form
			class="flex flex-col gap-6 overflow-y-auto py-4"
			onsubmit={(e) => {
				e.preventDefault();
				handleSavePlayerSettings();
			}}
		>
			<div class="flex flex-col gap-2">
				<Label for="player-display-name">Display Name</Label>
				<Input
					id="player-display-name"
					bind:value={playerDisplayName}
					placeholder="Enter your display name"
				/>
			</div>

			<Button
				type="button"
				variant="destructive"
				class="w-min"
				size="sm"
				onclick={() => (showLeaveConfirmation = true)}
			>
				Leave Campaign
			</Button>

			<button type="submit" class="hidden">Save</button>
		</form>

		<Dialog.Footer class="flex gap-3">
			<div class="grow"></div>
			<Dialog.Close
				type="button"
				class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				onclick={() => {
					showLeaveConfirmation = false;
				}}
			>
				Cancel
			</Dialog.Close>
			<Button onclick={handleSavePlayerSettings} disabled={!hasPlayerChanges}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Leave Campaign Confirmation Dialog -->
<Dialog.Root bind:open={showLeaveConfirmation}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Leave Campaign</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to leave <strong>{campaign.campaign?.name || 'this campaign'}</strong
				>? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-3">
			<Dialog.Close
				type="button"
				class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				onclick={() => (showLeaveConfirmation = false)}
			>
				Cancel
			</Dialog.Close>
			<Button
				type="button"
				variant="destructive"
				disabled={isLeaving}
				onclick={handleLeaveCampaign}
			>
				{#if isLeaving}
					<Loader2 class="size-4 animate-spin" />
					Leaving...
				{:else}
					Leave Campaign
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
