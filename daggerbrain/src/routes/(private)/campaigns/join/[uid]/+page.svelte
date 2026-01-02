<!-- src/routes/(private)/campaigns/join/[uid]/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { get_campaign, join_campaign } from '$lib/remote/campaigns.remote';
	import Footer from '$lib/components/app/footer.svelte';
	import { toast } from 'svelte-sonner';
	import type { Campaign } from '$lib/types/campaign-types';

	const campaignId = $derived($page.params.uid);
	let loading = $state(true);
	let campaign = $state<Campaign | null>(null);
	let errorMessage = $state<string | null>(null);
	let joining = $state(false);

	// Validate campaign on mount
	$effect(() => {
		if (!campaignId) {
			errorMessage = 'Invalid campaign ID';
			loading = false;
			return;
		}

		loading = true;
		get_campaign(campaignId)
			.then((c) => {
				campaign = c;
				errorMessage = null;
			})
			.catch((err) => {
				const message = err instanceof Error ? err.message : 'Campaign not found';
				errorMessage = message;
				campaign = null;
			})
			.finally(() => {
				loading = false;
			});
	});

	async function handleJoin() {
		if (!campaignId || joining) return;

		joining = true;
		try {
			await join_campaign(campaignId);
			toast.success('Successfully joined campaign');
			await goto(`/campaigns/${campaignId}`);
		} catch (err) {
			joining = false;
			const message = err instanceof Error ? err.message : 'Failed to join campaign';
			
			if (message.includes('already a member')) {
				toast.info('You are already a member of this campaign');
				// Redirect to campaign page since they're already a member
				setTimeout(() => {
					goto(`/campaigns/${campaignId}`);
				}, 1000);
			} else {
				toast.error(message);
			}
		}
	}
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<div
		class="flex h-full w-full flex-col items-center justify-center gap-4 px-4 py-12"
	>
		{#if loading}
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
			<p class="text-sm text-muted-foreground">Loading campaign...</p>
		{:else if errorMessage}
			<div class="flex w-full flex-col items-center justify-center py-16">
				<p class="text-sm text-muted-foreground italic">{errorMessage}</p>
				<p class="text-sm text-muted-foreground italic mt-4">
					If the issue persists <a href="/contact" class="underline">let us know</a>.
				</p>
				<Button href="/campaigns" class="mt-4">Back to Campaigns</Button>
			</div>
		{:else if campaign}
			<div class="flex flex-col items-center gap-4 max-w-md w-full">
				<div class="text-center">
					<h1 class="text-2xl font-bold mb-2">{campaign.name}</h1>
					{#if campaign.description}
						<p class="text-sm text-muted-foreground">{campaign.description}</p>
					{/if}
				</div>
				<Button onclick={handleJoin} disabled={joining} class="w-full">
					{#if joining}
						<LoaderCircle class="h-4 w-4 animate-spin mr-2" />
						Joining...
					{:else}
						Join Campaign
					{/if}
				</Button>
			</div>
		{/if}
	</div>
</div>

<Footer />

