<!-- src/routes/(private)/campaigns/+page.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Label from '$lib/components/ui/label';
	import Plus from '@lucide/svelte/icons/plus';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Rocket from '@lucide/svelte/icons/rocket';
	import { goto } from '$app/navigation';
	import { error } from '@sveltejs/kit';
	import Footer from '$lib/components/app/footer.svelte';
	import {
		get_user_campaigns,
		create_campaign,
		delete_campaign
	} from '$lib/remote/campaigns.remote';
	import { getUserContext } from '$lib/state/user.svelte';
	import type { CampaignWithDetails } from '$lib/types/campaign-types';
	import { formatDate } from '$lib/utils';

	const user = getUserContext();

	let campaigns = $state<CampaignWithDetails[]>([]);
	let loading = $state(true);
	let creatingCampaign = $state(false);

	// Create campaign dialog state
	let showCreateDialog = $state(false);
	let newCampaignName = $state('');

	// Delete campaign dialog state
	let campaignToDelete = $state<{ id: string; name: string } | null>(null);
	let showDeleteDialog = $state(false);
	let deletingCampaign = $state(false);

	// Load campaigns
	$effect(() => {
		loading = true;
		get_user_campaigns()
			.then((c) => {
				campaigns = c;
			})
			.catch((err) => {
				error(500, err.message);
			})
			.finally(() => {
				loading = false;
			});
	});

	async function handleCreateCampaign() {
		if (!newCampaignName.trim()) return;

		creatingCampaign = true;
		try {
			const id = await create_campaign({
				name: newCampaignName.trim()
			});
			// Reset form
			newCampaignName = '';
			showCreateDialog = false;
			// Navigate to campaign
			await goto(`/campaigns/${id}`);
		} catch (err) {
			creatingCampaign = false;
			error(500, err instanceof Error ? err.message : 'Failed to create campaign');
		}
	}

	// Clear dialog fields when dialogs close
	$effect(() => {
		if (!showCreateDialog) {
			newCampaignName = '';
		}
	});

	function handleDeleteCampaign(campaignId: string, campaignName: string) {
		campaignToDelete = { id: campaignId, name: campaignName };
		showDeleteDialog = true;
	}

	async function confirmDelete() {
		if (campaignToDelete && !deletingCampaign) {
			deletingCampaign = true;
			try {
				await delete_campaign(campaignToDelete.id);
				// Refresh campaigns query to get updated data
				campaigns = await get_user_campaigns();
				campaignToDelete = null;
				showDeleteDialog = false;
			} catch (err) {
				error(500, err instanceof Error ? err.message : 'Failed to delete campaign');
			} finally {
				deletingCampaign = false;
			}
		}
	}

	// Helper to check if user is GM of a campaign
	function isGM(campaign: CampaignWithDetails): boolean {
		return campaign.user_role === 'gm';
	}
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	{#if loading}
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
					<p class="text-2xl font-bold">Campaigns</p>

					<div class="flex gap-2">
						<Button variant="outline" onclick={() => (showCreateDialog = true)}>
							<Plus /> New Campaign
						</Button>
					</div>
				</div>

				<!-- Campaigns -->
				{#if campaigns.length === 0}
					<Button class="mx-auto my-24" onclick={() => (showCreateDialog = true)}>
						<Plus />
						Create your first campaign!
					</Button>
				{:else}
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-end">
						{#each campaigns as campaign}
							
						<div class="mx-auto w-full max-w-[500px]">
						<!-- Character Images -->
							{#if campaign.character_images.length > 0}
								<a href={`/campaigns/${campaign.id}/`} class="-mb-6 flex mx-auto flex-wrap justify-center gap-2">
									{#each campaign.character_images as imageUrl}
										<div class="z-10 h-12 w-12 shrink-0 overflow-hidden rounded border-2 bg-card">
											<img
												src={imageUrl || '/images/portrait-placeholder.png'}
												alt="Character"
												class="h-full w-full object-cover"
											/>
										</div>
									{/each}
									</a>
							{/if}

							<a href={`/campaigns/${campaign.id}/`} class="block w-full rounded border bg-card hover:bg-card/80 h-[180px] overflow-hidden flex flex-col">
								
								<div class="grow">
								<!-- Campaign Title -->
								<div
									class={cn(
										'px-4 pb-1.5 text-center',
										campaign.character_images.length > 0 ? 'pt-8' : 'pt-6'
									)}
								>
									<p class="text-xl font-bold truncate">{campaign.name}</p>
								</div>

								<!-- Start Date -->
								<div class="px-4 pb-5 text-center">
									<p class="text-xs font-medium text-muted-foreground">
										Campaign Started {formatDate(campaign.created_at)}
									</p>
								</div>
							</div>

								<div class="flex items-center justify-center gap-4 px-4 pb-5">
									<!-- Player Count -->
									<div class="flex items-center gap-2 text-center">
										<p class="text-[10px] font-medium text-muted-foreground uppercase">Players</p>

										<p class="text- flex font-eveleth">
											{campaign.player_count}
										</p>
									</div>

									<!-- role -->
									<div class="flex items-center gap-2 text-center">
										<p class="text-[10px] font-medium text-muted-foreground uppercase">Role</p>
										<p class="flex font-eveleth text-xs">
											{campaign.user_role === 'gm' ? 'Game Master' : 'Player'}
										</p>
									</div>
								</div>

								<!-- Action Buttons -->
								<div class="flex border-t bg-muted">
									<Button
										variant="ghost"
										size="sm"
										class="hover:text-text grow rounded-none border"
										href={`/campaigns/${campaign.id}/`}
									>
										View
									</Button>
									<Button
										variant="ghost"
										size="sm"
										class={cn(
											'hover:text-text grow rounded-none border',
											isGM(campaign) ? 'border-x-0' : 'border-l-0'
										)}
										href={`/campaigns/${campaign.id}/live`}
									>
										Launch
									</Button>
									{#if isGM(campaign)}
										<Button
											variant="ghost"
											size="sm"
											class="grow rounded-none border text-destructive hover:text-destructive"
											onclick={() => handleDeleteCampaign(campaign.id, campaign.name)}
										>
											Delete
										</Button>
									{/if}
								</div>
							</a>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<Footer />

<!-- Create Campaign Dialog -->
<Dialog.Root bind:open={showCreateDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Create New Campaign</Dialog.Title>
			<Dialog.Description>
				Create a new campaign to start playing with your friends.
			</Dialog.Description>
		</Dialog.Header>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				if (newCampaignName.trim() && !creatingCampaign) {
					handleCreateCampaign();
				}
			}}
		>
			<div class="flex flex-col gap-4 py-4">
				<!-- Name Input -->
				<div class="flex flex-col gap-2">
					<Label.Root>Campaign Name</Label.Root>
					<Input bind:value={newCampaignName} placeholder="Enter campaign name..." required />
				</div>
			</div>

			<Dialog.Footer class="flex gap-3">
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				>
					Cancel
				</Dialog.Close>
				<Button type="submit" disabled={!newCampaignName.trim() || creatingCampaign}>
					{creatingCampaign ? 'Creating...' : 'Create'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={showDeleteDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete Campaign</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete <strong>{campaignToDelete?.name}</strong>? This action
				cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-3 pt-4">
			<Dialog.Close class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				>Cancel</Dialog.Close
			>
			<Dialog.Close
				class={buttonVariants({ variant: 'destructive' })}
				onclick={confirmDelete}
				disabled={deletingCampaign}>{deletingCampaign ? 'Deleting...' : 'Delete'}</Dialog.Close
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
