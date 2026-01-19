<!-- src/lib/components/app/campaigns/campaign-notes.svelte -->
<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { cn } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Pencil from '@lucide/svelte/icons/pencil';

	let { class: className = '', isGM = false }: { class?: string; isGM?: boolean } = $props();

	const campaignContext = getCampaignContext();
	const campaignState = $derived(campaignContext.campaignState);

	let showPreview = $state(true);
</script>

<div class={cn('rounded-2xl border-y bg-primary/15 p-4 shadow-xl', className)}>
	<div class="mb-2 flex items-center justify-between">
		<h2 class="text-lg font-semibold">
			{#if isGM}
				Public Notes
			{:else}
				Campaign Notes
			{/if}
		</h2>
		{#if isGM}
			<Button variant="ghost" size="sm" onclick={() => (showPreview = !showPreview)}>
				{#if showPreview}
					<Pencil class="size-4" />
				{:else}
					<Eye class="size-4" />
				{/if}
			</Button>
		{/if}
	</div>
	{#if campaignState}
		{#if showPreview || !isGM}
			<div class="px-2 py-2 text-sm text-muted-foreground">
				{@html renderMarkdown(campaignState.notes || 'No notes')}
			</div>
		{:else}
			<Textarea
				bind:value={campaignState.notes}
				class=" bg-background"
				placeholder="Add campaign notes..."
			/>
		{/if}
	{/if}
</div>
