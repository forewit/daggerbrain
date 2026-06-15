<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '@convex/_generated/api';
	import type { Id } from '@convex/_generated/dataModel';
	import { artCampaigns } from '$lib/assets/images';
	import Plus from '@lucide/svelte/icons/plus';
	import Rocket from '@lucide/svelte/icons/rocket';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import SafeDelete from '$lib/components/shared/safe-delete.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import LoadError from '$lib/components/utility/load-error.svelte';
	import Footer from '$lib/components/navigation/footer.svelte';
	import Loader from '$lib/components/utility/loader.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { cn, formatDate } from '$lib/utils';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { useClerkContext } from 'svelte-clerk';
	import { fade } from 'svelte/transition';
	import { toast } from 'svelte-sonner';

	const userCtx = getUserContext();
	const convexClient = useConvexClient();
	const clerkCtx = useClerkContext();

	const campaignsQuery = useQuery(api.functions.campaigns.list, {});
	const campaigns = $derived.by(() =>
		Object.entries(campaignsQuery.data ?? {}).map(([id, campaign]) => ({
			id: id as Id<'campaigns'>,
			...campaign
		}))
	);

	let creatingCampaign = $state(false);
	let showCreateDialog = $state(false);
	let showDeleteDialog = $state(false);
	let newCampaignName = $state('');
	let gmDisplayName = $state('');
	let campaignToDelete = $state<{ id: Id<'campaigns'>; name: string } | null>(null);

	const isLoading = $derived(userCtx.isLoading || campaignsQuery.isLoading || creatingCampaign);
	const loadError = $derived(userCtx.error || campaignsQuery.error);

	$effect(() => {
		if (!showCreateDialog) {
			newCampaignName = '';
			gmDisplayName = '';
		}
	});

	function openCreateDialog() {
		gmDisplayName =
			clerkCtx.user?.username ||
			[clerkCtx.user?.firstName, clerkCtx.user?.lastName].filter(Boolean).join(' ') ||
			'';
		showCreateDialog = true;
	}

	async function handleCreateCampaign() {
		if (!newCampaignName.trim()) return;

		creatingCampaign = true;
		try {
			const id = await convexClient.mutation(api.functions.campaigns.add, {
				name: newCampaignName.trim(),
				display_name: gmDisplayName.trim()
			});
			showCreateDialog = false;
			goto(`/campaigns/${id}`);
		} catch (error) {
			console.error('Failed to create campaign', error);
			toast.error('Failed to create campaign');
			creatingCampaign = false;
		}
	}

	function handleDeleteCampaign(id: Id<'campaigns'>, name: string) {
		campaignToDelete = { id, name };
		showDeleteDialog = true;
	}

	async function confirmDelete() {
		if (!campaignToDelete) return;

		try {
			await convexClient.mutation(api.functions.campaigns.remove, { id: campaignToDelete.id });
			showDeleteDialog = false;
			campaignToDelete = null;
		} catch (error) {
			console.error('Failed to delete campaign', error);
			toast.error('Failed to delete campaign');
		}
	}
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<div
		class="campaigns-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
	>
		<enhanced:img
			src={artCampaigns}
			alt=""
			fetchpriority="high"
			sizes="100vw"
			class="campaigns-fade-container h-full w-full object-cover object-center"
		/>
	</div>

	<Loader {isLoading} />

	<div
		class={cn(
			'relative z-10 flex h-full w-full flex-col items-center justify-start',
			'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
		)}
	>
		<div class="flex w-full max-w-6xl flex-col gap-4 px-4 py-4">
			<div class="flex items-center justify-between gap-2">
				<p class="flex h-9 items-center text-2xl font-bold">Campaigns</p>

				<Button variant="outline" onclick={openCreateDialog}>
					<Plus />
					New Campaign
				</Button>
			</div>

			{#if isLoading}
				<div></div>
			{:else if loadError}
				<LoadError />
			{:else if campaigns.length === 0}
				<Button class="mx-auto my-24" onclick={openCreateDialog}>
					<Rocket />
					Create your first campaign!
				</Button>
			{:else}
				<div
					in:fade
					class="relative grid grid-cols-1 items-end gap-6 sm:grid-cols-2 lg:grid-cols-3"
				>
					{#each campaigns as campaign}
						<div class="mx-auto w-full max-w-[500px]">
							{#if campaign.active_character_image_urls.length > 0}
								<a
									href={`/campaigns/${campaign.id}`}
									class="mx-auto -mb-6 flex flex-wrap justify-center gap-2"
								>
									{#each campaign.active_character_image_urls as imageUrl}
										<div class="z-10 h-12 w-12 shrink-0 overflow-hidden rounded border-2 bg-card">
											<img
												src={imageUrl || '/images/art/portrait-placeholder.webp'}
												alt="Character"
												class="h-full w-full object-cover"
											/>
										</div>
									{/each}
								</a>
							{/if}

							<a
								href={`/campaigns/${campaign.id}`}
								class="block h-[148px] w-full overflow-hidden rounded-t border border-b-0 bg-card hover:bg-card/80"
							>
								<div class="flex h-full flex-col">
									<div
										class={cn(
											'px-4 pb-1.5 text-center',
											campaign.active_character_image_urls.length > 0 ? 'pt-8' : 'pt-6'
										)}
									>
										<p class="truncate text-xl font-bold">{campaign.name || 'Unnamed Campaign'}</p>
									</div>

									<div class="px-4 pb-5 text-center">
										<p class="text-xs font-medium text-muted-foreground">
											Campaign Started {formatDate(campaign.creation_time)}
										</p>
									</div>

									<div class="mt-auto flex items-center justify-center gap-4 px-4 pb-5">
										<div class="flex items-center gap-2 text-center">
											<p class="text-[10px] font-medium text-muted-foreground uppercase">Players</p>
											<p class="font-eveleth">{campaign.player_count}</p>
										</div>

										<div class="flex items-center gap-2 text-center">
											<p class="text-[10px] font-medium text-muted-foreground uppercase">Role</p>
											<p class="font-eveleth text-xs">
												{campaign.role === 'GM' ? 'Game Master' : 'Player'}
											</p>
										</div>
									</div>
								</div>
							</a>

							<div class="flex overflow-hidden rounded-b border-t bg-muted">
								<Button
									variant="ghost"
									size="sm"
									class="grow rounded-none border hover:text-foreground"
									href={`/campaigns/${campaign.id}`}
								>
									View
								</Button>
								<Button
									variant="ghost"
									size="sm"
									class={cn(
										'grow rounded-none border hover:text-foreground',
										campaign.role === 'GM' ? 'border-x-0' : 'border-l-0'
									)}
									href={`/campaigns/${campaign.id}/live`}
								>
									Launch
								</Button>
								{#if campaign.role === 'GM'}
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
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<Footer />

<Dialog.Root bind:open={showCreateDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Create New Campaign</Dialog.Title>
			<Dialog.Description>
				Create a new campaign to start playing with your friends.
			</Dialog.Description>
		</Dialog.Header>

		<form
			onsubmit={(event) => {
				event.preventDefault();
				handleCreateCampaign();
			}}
		>
			<div class="flex flex-col gap-4 py-4">
				<div class="flex flex-col gap-2">
					<label for="campaign-name" class="text-sm font-medium">Campaign Name</label>
					<Input
						id="campaign-name"
						bind:value={newCampaignName}
						placeholder="Enter campaign name..."
						required
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="gm-display-name" class="text-sm font-medium">Your Display Name (GM)</label>
					<Input
						id="gm-display-name"
						bind:value={gmDisplayName}
						placeholder="Enter your display name (optional)"
					/>
				</div>
			</div>

			<Dialog.Footer class="flex gap-3">
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				>
					Cancel
				</Dialog.Close>
				<Button type="submit" disabled={!newCampaignName.trim()}>Create</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={showDeleteDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete Campaign</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete <strong>{campaignToDelete?.name || 'this campaign'}</strong
				>? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>

		<SafeDelete
			open={showDeleteDialog}
			itemName={campaignToDelete?.name || ''}
			itemLabel="this campaign"
			deleteLabel="Delete Campaign"
			onDelete={confirmDelete}
		/>
	</Dialog.Content>
</Dialog.Root>

<style>
	.campaigns-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
