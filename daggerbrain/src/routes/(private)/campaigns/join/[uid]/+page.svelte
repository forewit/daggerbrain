<!-- src/routes/(private)/campaigns/join/[uid]/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import Footer from '$lib/components/app/footer.svelte';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import { formatDate } from '$lib/utils';
	import { Input } from '$lib/components/ui/input/index.js';

	let { data } = $props();

	const campaignCtx = getCampaignContext();
	const campaign = data.campaign;
	const gmDisplayName = data.gmDisplayName;
	const isMember = data.isMember;
	const userRole = data.userRole;
	const playerCount = data.playerCount;
	const characterImages = data.characterImages;

	// Set the campaign ID in context so joinCampaign can use it
	$effect(() => {
		if (campaign) {
			campaignCtx.campaignId = campaign.id;
		}
	});

	let joining = $state(false);
	let playerName = $state('');

	async function handleJoin() {
		if (joining || isMember) return;

		if (!campaign?.id) {
			toast.error('Campaign information is missing');
			return;
		}

		// Ensure campaignId is set in context before calling joinCampaign
		campaignCtx.campaignId = campaign.id;

		joining = true;
		try {
			await campaignCtx.joinCampaign({
				display_name: playerName.trim() || undefined
			});
			toast.success('Successfully joined campaign');
		} catch (err) {
			joining = false;
			const message = err instanceof Error ? err.message : 'Failed to join campaign';

			if (message.includes('already a member')) {
				toast.info('You are already a member of this campaign');
				// Redirect to campaign page since they're already a member
				setTimeout(() => {
					goto(`/campaigns/${campaign.id}`);
				}, 1000);
			} else {
				toast.error(message);
			}
		}
	}
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<!-- Campaigns footer image with fade effect - background -->
	<div
		class="campaigns-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-64 w-full overflow-hidden"
	>
		<img
			src="/images/art/campaigns.webp"
			alt=""
			class="campaigns-fade-container h-full w-full object-cover object-center"
		/>
	</div>

	<div
		class={cn(
			'relative z-10 flex h-full w-full flex-col items-center justify-start ',
			'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
		)}
	>
		<div class="flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
			<!-- Header -->
			<div class="flex flex-col items-center gap-2 text-center">
				<h1 class="font-eveleth text-2xl">
					{isMember ? 'You are already a member of this campaign' : 'Join Campaign'}
				</h1>
				<p class="text-sm text-muted-foreground">
					<span class="font-bold">GM:</span>
					{gmDisplayName || 'Anonymous'}
				</p>
			</div>

			<!-- Campaign Preview Card -->
			<div class="mx-auto w-full max-w-[500px]">
				<!-- Character Images -->
				{#if characterImages.length > 0}
					<div class="mx-auto -mb-6 flex flex-wrap justify-center gap-2">
						{#each characterImages as imageUrl}
							<div class="z-10 h-12 w-12 shrink-0 overflow-hidden rounded border-2 bg-card">
								<img
									src={imageUrl || '/images/portrait-placeholder.png'}
									alt="Character"
									class="h-full w-full object-cover"
								/>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Campaign Card -->
				<div
					class={cn(
						'block flex h-[148px] w-full flex-col overflow-hidden rounded-t border border-b-0 bg-card',
						characterImages.length > 0 ? '' : ''
					)}
				>
					<div class="grow">
						<!-- Campaign Title -->
						<div
							class={cn('px-4 pb-1.5 text-center', characterImages.length > 0 ? 'pt-8' : 'pt-6')}
						>
							<p class="truncate text-xl font-bold">{campaign.name}</p>
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
							<p class="flex font-eveleth">{playerCount}</p>
						</div>

						<!-- Role (only show if user is already a member) -->
						{#if isMember && userRole}
							<div class="flex items-center gap-2 text-center">
								<p class="text-[10px] font-medium text-muted-foreground uppercase">Role</p>
								<p class="flex font-eveleth text-xs">
									{userRole === 'gm' ? 'Game Master' : 'Player'}
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Join information -->
			<div class="mx-auto mt-2 w-full max-w-[400px]">
				{#if isMember}
					<Button
						size="sm"
						class="hover:text-text w-full rounded border"
						href={`/campaigns/${campaign.id}`}
					>
						View Campaign
					</Button>
				{:else}
					<form
						class="flex flex-col gap-6"
						onsubmit={(e) => {
							e.preventDefault();
							handleJoin();
						}}
					>
						<div class="flex flex-col gap-2">
							<label for="display-name" class="text-sm font-medium">Display Name (optional)</label>
							<Input
								id="display-name"
								type="text"
								placeholder="Enter your display name"
								bind:value={playerName}
							/>
							<p class="text-xs text-muted-foreground">
								This is how other players will see your name in this campaign.
							</p>
						</div>
						<Button type="submit" class="w-full" size="sm" disabled={joining}>
							{#if joining}
								<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
								Joining...
							{:else}
								Join Campaign
							{/if}
						</Button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</div>

<Footer />

<style>
	.campaigns-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
