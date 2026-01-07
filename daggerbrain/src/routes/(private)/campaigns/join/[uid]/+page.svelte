<!-- src/routes/(private)/campaigns/join/[uid]/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import Input from '$lib/components/ui/input/input.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { get_campaign, join_campaign } from '$lib/remote/campaigns.remote';
	import { getUserContext } from '$lib/state/user.svelte';
	import Footer from '$lib/components/app/footer.svelte';
	import { toast } from 'svelte-sonner';
	import type { Campaign } from '$lib/types/campaign-types';

	const campaignId = $derived($page.params.uid);
	const user = getUserContext();
	let loading = $state(true);
	let campaign = $state<Campaign | null>(null);
	let errorMessage = $state<string | null>(null);
	let joining = $state(false);
	let playerName = $state('');
	let selectedCharacterId = $state<string>('');

	// Get available characters (not in any campaign)
	const availableCharacters = $derived(
		user.all_characters
			.filter((char) => !char.campaign_id)
			.map((char) => ({ id: char.id, name: char.name || 'Unnamed Character' }))
	);

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
			await join_campaign({
				campaign_id: campaignId,
				display_name: playerName.trim() || undefined,
				character_id: selectedCharacterId || undefined
			});
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
	<div class="flex h-full w-full flex-col items-center justify-center gap-4 px-4 py-12">
		{#if loading}
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
			<p class="text-sm text-muted-foreground">Loading campaign...</p>
		{:else if errorMessage}
			<div class="flex w-full flex-col items-center justify-center py-16">
				<p class="text-sm text-muted-foreground italic">{errorMessage}</p>
				<p class="mt-4 text-sm text-muted-foreground italic">
					If the issue persists <a href="/contact" class="underline">let us know</a>.
				</p>
				<Button href="/campaigns" class="mt-4">Back to Campaigns</Button>
			</div>
		{:else if campaign}
			<div class="flex w-full max-w-md flex-col items-center gap-4">
				<div class="text-center">
					<h1 class="mb-2 text-2xl font-bold">{campaign.name}</h1>
					{#if campaign.description}
						<p class="text-sm text-muted-foreground">{campaign.description}</p>
					{/if}
				</div>
				<form
					class="flex w-full flex-col gap-4"
					onsubmit={(e) => {
						e.preventDefault();
						handleJoin();
					}}
				>
					<div class="flex flex-col gap-2">
						<Label for="player-name">Player Name (optional)</Label>
						<Input id="player-name" bind:value={playerName} placeholder="Enter your display name" />
					</div>
					<div class="flex flex-col gap-2">
						<Label for="character-select">Character (optional)</Label>
						<Select.Root
							type="single"
							value={selectedCharacterId}
							onValueChange={(v) => (selectedCharacterId = v || '')}
						>
							<Select.Trigger id="character-select" class="w-full">
								<p class="truncate">
									{selectedCharacterId
										? availableCharacters.find((c) => c.id === selectedCharacterId)?.name ||
											'Unnamed Character'
										: 'Join without character'}
								</p>
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">Join without character</Select.Item>
								{#each availableCharacters as char}
									<Select.Item value={char.id}>{char.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
					<Button type="submit" disabled={joining} class="w-full">
						{#if joining}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
							Joining...
						{:else}
							Join Campaign
						{/if}
					</Button>
				</form>
			</div>
		{/if}
	</div>
</div>

<Footer />
