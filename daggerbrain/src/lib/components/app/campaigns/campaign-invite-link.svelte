<!-- src/lib/components/app/campaigns/campaign-invite-link.svelte -->
<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Copy from '@lucide/svelte/icons/copy';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import { page } from '$app/state';

	let {
		isGM,
		class: className = ''
	}: {
		isGM: boolean;
		class?: string;
	} = $props();

	const campaignContext = getCampaignContext();
	const campaignState = $derived(campaignContext.campaignState);

	// Invite link state
	const clipboard = new UseClipboard();
	let showResetConfirmation = $state(false);
	let isResetting = $state(false);

	const joinUrl = $derived(
		campaignState?.invite_code
			? `${page.url.origin}/campaigns/join/${campaignState.invite_code}`
			: ''
	);

	async function handleCopyJoinUrl() {
		if (!joinUrl) return;
		await clipboard.copy(joinUrl);
		if (clipboard.copied) {
			toast.success('Invite link copied');
		}
	}

	async function handleResetInviteCode() {
		if (isResetting) return;

		isResetting = true;
		try {
			await campaignContext.resetInviteCode();
			showResetConfirmation = false;
			toast.success('Invite link reset successfully');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to reset invite link';
			toast.error(message);
		} finally {
			isResetting = false;
		}
	}
</script>

<div class={cn('max-w-[490px] rounded border border-dashed border-foreground/20 p-2', className)}>
	<div class="flex items-center gap-2">
		<Input
			value={joinUrl}
			readonly
			class="border-none bg-transparent px-1 focus-visible:ring-0"
			style="box-shadow: none;"
		/>
		<Button title="Copy invite link" type="button" variant="outline" onclick={handleCopyJoinUrl}>
			<Copy class="size-4" />
		</Button>
		{#if isGM}
			<Button
				type="button"
				variant="outline"
				onclick={() => (showResetConfirmation = true)}
				title="Reset invite link"
			>
				<RotateCcw class="size-4" />
			</Button>
		{/if}
	</div>
	<p class="mt-2 ml-1 text-xs text-muted-foreground">
		Share this invite link with players to have them join your campaign.
	</p>
</div>

<!-- Reset Invite Link Confirmation Dialog -->
<Dialog.Root bind:open={showResetConfirmation}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Reset Invite Link</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to reset the invite link? The old link will no longer work.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-3">
			<Dialog.Close
				type="button"
				class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
				onclick={() => (showResetConfirmation = false)}
			>
				Cancel
			</Dialog.Close>
			<Button
				type="button"
				variant="destructive"
				disabled={isResetting}
				onclick={handleResetInviteCode}
			>
				{#if isResetting}
					<Loader2 class="size-4 animate-spin" />
					Resetting...
				{:else}
					Reset Invite Link
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
