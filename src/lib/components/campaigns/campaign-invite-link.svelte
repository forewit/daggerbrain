<script lang="ts">
	import { page } from '$app/state';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import { getCampaignContext } from '$lib/state/campaign.svelte';
	import { cn } from '$lib/utils';
	import { api } from '@convex/_generated/api';
	import Copy from '@lucide/svelte/icons/copy';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import { useConvexClient } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	let {
		isGM,
		class: className = ''
	}: {
		isGM: boolean;
		class?: string;
	} = $props();

	const campaignCtx = getCampaignContext();
	const convexClient = useConvexClient();
	const clipboard = new UseClipboard();
	let showResetConfirmation = $state(false);
	let isResetting = $state(false);

	const inviteUrl = $derived.by(() => {
		if (!campaignCtx.inviteCode) return '';
		return `${page.url.origin}/campaigns/join/${campaignCtx.inviteCode}`;
	});

	async function handleCopyInviteUrl() {
		if (!inviteUrl) return;
		await clipboard.copy(inviteUrl);
		if (clipboard.copied) {
			toast.success('Invite link copied');
		}
	}

	async function handleResetInviteCode() {
		if (isResetting || !campaignCtx.id) return;

		isResetting = true;
		try {
			await convexClient.mutation(api.functions.campaigns.rotateInviteCode, {
				campaign_id: campaignCtx.id
			});
			showResetConfirmation = false;
			toast.success('Invite link reset successfully');
		} catch (error) {
			console.error('Failed to reset invite link', error);
			toast.error('Failed to reset invite link');
		} finally {
			isResetting = false;
		}
	}
</script>

<div class={cn('max-w-[500px] rounded border border-dashed border-foreground/20 p-2', className)}>
	<div class="flex items-center gap-2">
		<Input
			value={inviteUrl}
			readonly
			class="border-none bg-transparent px-1 focus-visible:ring-0"
			style="box-shadow: none;"
		/>
		<Button title="Copy invite link" type="button" variant="outline" onclick={handleCopyInviteUrl}>
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
