<!-- src/routes/(private)/campaigns/[id]/+page.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	import Loader2 from '@lucide/svelte/icons/loader-2';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import Input from '$lib/components/ui/input/input.svelte';
	import Footer from '$lib/components/app/footer.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { update_campaign_member } from '$lib/remote/campaigns.remote';
	import { toast } from 'svelte-sonner';
	import CampaignOverviewPlayer from '$lib/components/app/campaigns/campaign-overview-player.svelte';
	import CampaignOverviewGm from '$lib/components/app/campaigns/campaign-overview-gm.svelte';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import Copy from '@lucide/svelte/icons/copy';
	import Settings from '@lucide/svelte/icons/settings';
	import Play from '@lucide/svelte/icons/play';
	import { page } from '$app/state';

	let { data }: { data: import('./$types').PageData } = $props();

	const user = getUserContext();
	const campaignId = $derived(page.params.id);

	// Set up campaign context (reactive to campaignId changes)
	const campaign = getCampaignContext();

	// Get available characters for assignment (user's characters not in this campaign)
	const availableCharacters = $derived(
		user.all_characters
			.filter((char) => !char.campaign_id || char.campaign_id !== campaignId)
			.map((char) => ({ id: char.id, name: char.name || 'Unnamed Character' }))
	);

	const loading = $derived(campaign.loading);

	// Settings dialog state
	let showSettingsDialog = $state(false);
	let campaignName = $state('');
	let campaignDescription = $state('');
	let gmDisplayName = $state('');
	let isDeleting = $state(false);

	// Player settings dialog state
	let showPlayerSettingsDialog = $state(false);
	let playerDisplayName = $state('');
	let isLeaving = $state(false);
	let showLeaveConfirmation = $state(false);

	const clipboard = new UseClipboard();
	const joinUrl = $derived(campaignId ? `${page.url.origin}/campaigns/join/${campaignId}` : '');

	// Initialize settings dialog values
	$effect(() => {
		if (campaign.campaign) {
			campaignName = campaign.campaign.name;
			campaignDescription = campaign.campaign.description || '';
		}
	});

	// Initialize GM display name when settings dialog opens
	$effect(() => {
		if (data.userMembership && showSettingsDialog) {
			gmDisplayName = data.userMembership.display_name || '';
		}
	});

	// Check if there are any changes
	const hasChanges = $derived(
		campaign.campaign &&
			(campaignName.trim() !== campaign.campaign.name ||
				(gmDisplayName.trim() || '') !== (data.userMembership?.display_name || ''))
	);

	async function handleSave() {
		if (!campaignId || !campaignName.trim() || !campaign.campaign) return;

		try {
			// Update campaign name - auto-save will handle persistence
			campaign.campaign.name = campaignName.trim();

			// Update GM display name if it changed
			if (gmDisplayName.trim() !== (data.userMembership?.display_name || '')) {
				await update_campaign_member({
					campaign_id: campaignId,
					display_name: gmDisplayName.trim() || undefined
				});
			}

			showSettingsDialog = false;
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to save settings';
			toast.error(message);
		}
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

	async function handleCopyJoinUrl() {
		if (!joinUrl) return;
		await clipboard.copy(joinUrl);
		if (clipboard.copied) {
			toast.success('Join link copied');
		}
	}

	async function handleCopyCampaignId() {
		if (!campaignId) return;
		const inviteLink = `${page.url.origin}/campaigns/join/${campaignId}`;
		await clipboard.copy(inviteLink);
		if (clipboard.copied) {
			toast.success('Invite link copied');
		}
	}

	const isGM = $derived(data.role === 'gm');

	let deleteConfirmation = $state('');
	$effect(() => {
		if (!showSettingsDialog) {
			deleteConfirmation = '';
			gmDisplayName = '';
		}
	});

	// Initialize player settings dialog values
	$effect(() => {
		if (data.userMembership && showPlayerSettingsDialog) {
			playerDisplayName = data.userMembership.display_name || '';
		}
	});

	// Check if player display name has changed
	const hasPlayerChanges = $derived(
		data.userMembership && playerDisplayName.trim() !== (data.userMembership.display_name || '')
	);

	async function handleSavePlayerSettings() {
		if (!campaignId || !data.userMembership) return;

		try {
			await update_campaign_member({
				campaign_id: campaignId,
				display_name: playerDisplayName.trim() || undefined
			});
			toast.success('Settings saved');
			showPlayerSettingsDialog = false;
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to save settings';
			toast.error(message);
		}
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
	{:else}
		<!-- Header -->
		<div
			class="sticky top-[calc(var(--navbar-height,3.5rem)-1px)] z-20 w-full bg-background sm:top-0"
		>
			<div class="w-full bg-primary/50">
				<div
					class="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4"
				>
					<div class="flex items-center gap-2">
						<Button
							href="/campaigns"
							variant="link"
							class="hidden px-0 text-muted-foreground sm:flex"
						>
							Campaigns
						</Button>
						<ChevronRight class="hidden size-3.5 text-muted-foreground sm:block" />
						<p class="truncate text-sm font-medium">
							{campaign.campaign?.name || 'unnamed campaign'}
						</p>
					</div>
					<div class="flex shrink-0 items-center gap-2">
						{#if isGM}
							<Button variant="outline" size="sm" onclick={handleCopyCampaignId} class="h-7">
								<Copy class="size-3.5" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onclick={() => (showSettingsDialog = true)}
								class="h-7"
							>
								<Settings class="size-3.5" />
								<p class="hidden sm:block">Settings</p>
							</Button>
						{:else}
							<Button
								variant="outline"
								size="sm"
								onclick={() => (showPlayerSettingsDialog = true)}
								class="h-7"
							>
								<Settings class="size-3.5" />
								<p class="hidden sm:block">Settings</p>
							</Button>
						{/if}
						<Button size="sm" href={`/campaigns/${campaignId}/live`}>
							<p class="hidden sm:block">Launch</p>
							<Play class="size-3.5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start ',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<div class="flex w-full max-w-6xl flex-col gap-6 px-4 py-4">
				{#if data.role === 'gm' && campaignId}
					<CampaignOverviewGm {campaignId} {user} />
				{:else if campaignId}
					<CampaignOverviewPlayer
						{availableCharacters}
						userMembership={data.userMembership}
						{user}
						{campaignId}
					/>
				{/if}
			</div>
		</div>
	{/if}
</div>

<Footer />

<!-- Settings Dialog -->
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
				<Label>Invite Link</Label>
				<div class="flex gap-2">
					<Input value={joinUrl} readonly class="flex-1" />
					<Button type="button" variant="outline" onclick={handleCopyJoinUrl}>
						<Copy class="size-4" />
					</Button>
				</div>
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
						size="sm"
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
				variant="link"
				class="h-auto justify-start p-0 text-destructive"
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
