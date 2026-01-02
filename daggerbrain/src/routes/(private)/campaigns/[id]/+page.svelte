<!-- src/routes/(private)/campaigns/[id]/+page.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Settings from '@lucide/svelte/icons/settings';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Label from '$lib/components/ui/label';
	import Input from '$lib/components/ui/input/input.svelte';
	import { error } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/app/footer.svelte';
	import { update_campaign, delete_campaign } from '$lib/remote/campaigns.remote';
	import { page } from '$app/state';
	import {
		get_campaign,
		get_campaign_members,
		get_campaign_state,
		get_campaign_characters
	} from '$lib/remote/campaigns.remote';
	import { get_campaign_homebrew_vault } from '$lib/remote/campaign-homebrew.remote';
	import { getUserContext } from '$lib/state/user.svelte';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import { toast } from 'svelte-sonner';
	import type { Campaign, CampaignState, CampaignCharacterSummary, CampaignMember } from '$lib/types/campaign-types';
	import type { HomebrewType } from '$lib/types/homebrew-types';
	import CampaignOverviewPlayer from '$lib/components/app/campaigns/campaign-overview-player.svelte';
	import CampaignOverviewGm from '$lib/components/app/campaigns/campaign-overview-gm.svelte';
	import CampaignLivePlayer from '$lib/components/app/campaigns/campaign-live-player.svelte';
	import CampaignLiveGm from '$lib/components/app/campaigns/campaign-live-gm.svelte';

	let { data }: { data: import('./$types').PageData } = $props();

	const user = getUserContext();
	const campaignId = $derived(page.params.id);
	const clipboard = new UseClipboard();

	let campaign = $state<Campaign | null>(null);
	let members = $state<CampaignMember[]>([]);
	let campaignState = $state<CampaignState | null>(null);
	let characters = $state<Record<string, CampaignCharacterSummary>>({});
	let vaultItems = $state<Array<{ id: string; homebrew_type: HomebrewType; homebrew_id: string }>>([]);
	let loading = $state(true);

	// Note: Fear tracker is now in the live view, not here

	// View switcher - true for live, false for overview
	// Initialize from URL parameter, default to false
	let isLive = $state(page.url.searchParams.get('live') === 'true');

	// Sync with URL changes (e.g., browser back/forward)
	$effect(() => {
		const urlLive = page.url.searchParams.get('live') === 'true';
		if (isLive !== urlLive) {
			isLive = urlLive;
		}
	});

	// Handler for toggle changes - updates both state and URL
	function handleLiveToggle(checked: boolean) {
		isLive = checked;
		const url = new URL(page.url);
		if (checked) {
			url.searchParams.set('live', 'true');
		} else {
			url.searchParams.delete('live');
		}
		goto(url.pathname + url.search, { keepFocus: true, noScroll: true, invalidateAll: false });
	}

	// Create refs for reactive updates from child components
	const charactersRef = $state<{ value: Record<string, CampaignCharacterSummary> }>({ value: {} });
	let campaignStateRef = $state<{ value: CampaignState | null }>({ value: null });
	const vaultItemsRef = $state<{ value: Array<{ id: string; homebrew_type: HomebrewType; homebrew_id: string }> }>({ value: [] });

	// Sync refs with state
	$effect(() => {
		charactersRef.value = characters;
	});
	$effect(() => {
		// Only sync campaignState to ref if they're different and ref is not newer
		// This prevents overwriting child component updates
		if (campaignState !== campaignStateRef.value) {
			// Only update ref if campaignState is newer (has updated_at) or if ref is null
			if (!campaignStateRef.value || !campaignState || 
			    campaignState.updated_at >= (campaignStateRef.value.updated_at || 0)) {
				campaignStateRef.value = campaignState;
			}
		}
	});
	$effect(() => {
		vaultItemsRef.value = vaultItems;
	});

	// Sync state with refs (for updates from child components)
	$effect(() => {
		if (charactersRef.value !== characters) {
			characters = charactersRef.value;
		}
	});
	$effect(() => {
		if (campaignStateRef.value !== campaignState) {
			campaignState = campaignStateRef.value;
		}
	});
	$effect(() => {
		if (vaultItemsRef.value !== vaultItems) {
			vaultItems = vaultItemsRef.value;
		}
	});

	// Load initial data
	$effect(() => {
		if (!campaignId) return;

		loading = true;
		Promise.all([
			get_campaign(campaignId),
			get_campaign_members(campaignId),
			get_campaign_state(campaignId),
			get_campaign_characters(campaignId),
			get_campaign_homebrew_vault(campaignId)
		])
			.then(([camp, mems, state, chars, vault]) => {
				campaign = camp;
				members = mems;
				campaignState = state;
				characters = chars;
				vaultItems = vault;

			})
			.catch((err) => {
				error(500, err.message);
			})
			.finally(() => {
				loading = false;
			});
	});

	// Set up polling for real-time updates (every 2 seconds)
	$effect(() => {
		if (!campaignId || loading) return;

		const pollingInterval = setInterval(async () => {
			// Pause polling when tab is hidden
			if (document.hidden) {
				return;
			}

			try {
				const [state, chars] = await Promise.all([
					get_campaign_state(campaignId),
					get_campaign_characters(campaignId)
				]);
				campaignState = state;
				characters = chars;
			} catch (err) {
				console.error('Polling error:', err);
			}
		}, 2000);

		// Cleanup on unmount
		return () => {
			clearInterval(pollingInterval);
		};
	});



	// Get available characters for assignment (user's characters not in this campaign)
	const availableCharacters = $derived(
		user.all_characters
			.filter((char) => !char.campaign_id || char.campaign_id !== campaignId)
			.map((char) => ({ id: char.id, name: char.name || 'Unnamed Character' }))
	);

	const isGM = $derived(data.role === 'gm');

	// Settings dialog state
	let showSettingsDialog = $state(false);
	let campaignName = $state('');
	let campaignDescription = $state('');
	let isRenaming = $state(false);
	let showDeleteDialog = $state(false);
	let isDeleting = $state(false);

	// Initialize settings dialog values
	$effect(() => {
		if (campaign) {
			campaignName = campaign.name;
			campaignDescription = campaign.description || '';
		}
	});

	async function handleRename() {
		if (!campaignId || !campaignName.trim() || isRenaming) return;

		isRenaming = true;
		try {
			await update_campaign({
				campaign_id: campaignId,
				name: campaignName.trim(),
				description: campaignDescription.trim() || null
			});
			// Refresh campaign data
			campaign = await get_campaign(campaignId);
			showSettingsDialog = false;
			toast.success('Campaign updated');
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to update campaign');
		} finally {
			isRenaming = false;
		}
	}

	async function handleDelete() {
		if (!campaignId || isDeleting) return;

		isDeleting = true;
		try {
			await delete_campaign(campaignId);
			await goto('/campaigns');
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to delete campaign');
		} finally {
			isDeleting = false;
		}
	}
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else if !campaign}
		<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
			<p class="text-sm text-muted-foreground italic">Campaign not found</p>
			<Button href="/campaigns">Back to Campaigns</Button>
		</div>
	{:else}
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start ',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<!-- Header -->
			<div
				class="sticky top-[calc(var(--navbar-height,3.5rem)-1px)] z-20 w-full bg-background sm:top-0"
			>
				<div class="w-full bg-primary/50">
					<div class="relative mx-auto flex w-full max-w-6xl items-center gap-2 py-2 pr-4">
						<Button href="/campaigns" variant="link">
							<ChevronLeft />
							Back to Campaigns
						</Button>

						<div class="grow"></div>

						<div class="flex items-center gap-2">
							<!-- Live Toggle -->
							<label
								class={cn(
									buttonVariants({ variant: 'outline', size: 'sm' }),
									'cursor-pointer gap-3 rounded-full px-4 h-7',
									isLive &&
										'border-accent/10 bg-accent/5 text-accent hover:bg-accent/10 hover:text-accent'
								)}
							>
								Live
								<Switch
									class="data-[state=checked]:bg-accent/50"
									checked={isLive}
									onCheckedChange={handleLiveToggle}
								/>
							</label>

							{#if isGM}
								<Button
									variant="outline"
									size="sm"
									onclick={() => (showSettingsDialog = true)}
									class="h-7"
								>
									<Settings class="size-3.5" />
									<p class="hidden sm:block">Settings</p>
								</Button>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<div class="flex w-full max-w-6xl flex-col space-y-6 px-4 py-4">
				{#if isLive}
					{#if data.role === 'gm' && campaignId}
						<CampaignLiveGm
							{campaign}
							campaignId={campaignId}
							{campaignState}
							bind:campaignStateRef={campaignStateRef}
						/>
					{:else if campaignId}
						<CampaignLivePlayer {campaign} campaignId={campaignId} {campaignState} />
					{/if}
				{:else}
					{#if data.role === 'gm' && campaignId}
						<CampaignOverviewGm
							{campaign}
							{characters}
							{campaignState}
							{vaultItems}
							campaignId={campaignId}
							{user}
							{members}
							charactersRef={charactersRef}
							campaignStateRef={campaignStateRef}
							vaultItemsRef={vaultItemsRef}
						/>
					{:else if campaignId}
						<CampaignOverviewPlayer
							{campaign}
							{characters}
							{availableCharacters}
							userMembership={data.userMembership}
							{user}
							campaignId={campaignId}
							charactersRef={charactersRef}
						/>
					{/if}
				{/if}
			</div>
		</div>
	{/if}
</div>

<Footer />

<!-- Settings Dialog -->
<Dialog.Root bind:open={showSettingsDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Campaign Settings</Dialog.Title>
			<!-- <Dialog.Description>Manage your campaign settings and information.</Dialog.Description> -->
		</Dialog.Header>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleRename();
			}}
		>
			<div class="flex flex-col gap-4 py-4">
				<div class="flex flex-col gap-2">
					<Label.Root>Campaign Name</Label.Root>
					<Input bind:value={campaignName} placeholder="Campaign name" required />
				</div>
				<div class="flex flex-col gap-2">
					<Label.Root>Subtitle</Label.Root>
					<Input bind:value={campaignDescription} placeholder="In a world full of wonder..." />
				</div>
			</div>

			<Dialog.Footer class="flex gap-3">
				<Button
					type="button"
					variant="link"
					class="text-destructive"
					onclick={() => {
						showSettingsDialog = false;
						showDeleteDialog = true;
					}}
				>
					Delete Campaign
				</Button>
				<div class="grow"></div>
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				>
					Cancel
				</Dialog.Close>
				<Button type="submit" disabled={!campaignName.trim() || isRenaming}>
					{#if isRenaming}
						<Loader2 class="size-4 animate-spin" />
						Saving...
					{:else}
						Save
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Campaign Confirmation Dialog -->
<Dialog.Root bind:open={showDeleteDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete Campaign</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete <strong>{campaign?.name}</strong>? This action cannot be undone
				and will remove all campaign data, including characters and notes.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-3 pt-4">
			<Dialog.Close class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}>
				Cancel
			</Dialog.Close>
			<Dialog.Close
				class={buttonVariants({ variant: 'destructive' })}
				onclick={handleDelete}
				disabled={isDeleting}
			>
				{#if isDeleting}
					<Loader2 class="size-4 animate-spin" />
					Deleting...
				{:else}
					<Trash2 class="size-4" />
					Delete Campaign
				{/if}
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
