<!-- src/lib/components/app/campaigns/campaign-overview-player.svelte -->
<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import type { CampaignMember } from '$lib/types/campaign-types';
	import CampaignCharacters from './campaign-characters.svelte';

	let {
		availableCharacters,
		userMembership,
		user,
		campaignId
	}: {
		availableCharacters: Array<{ id: string; name: string }>;
		userMembership: CampaignMember | null;
		user: ReturnType<typeof import('$lib/state/user.svelte').getUserContext>;
		campaignId: string;
	} = $props();

	const campaignContext = getCampaignContext();

	// Get data from context
	const campaign = $derived(campaignContext.campaign);

	// Leave campaign confirmation dialog
	let showLeaveDialog = $state(false);

	async function handleLeaveCampaign() {
		if (!campaignId) return;

		try {
			await campaignContext.leaveCampaign();
		} catch (err) {
			// Error handling is done in leaveCampaign
		}
	}
</script>

{#if campaign}
<!-- Characters Section -->
<CampaignCharacters />

{#if userMembership && userMembership.role !== 'gm'}
	<Button
		variant="link"
		class="w-min mx-auto sm:mx-0 text-destructive"
		onclick={() => (showLeaveDialog = true)}
	>
		Leave Campaign
	</Button>
{/if}

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
{/if}
