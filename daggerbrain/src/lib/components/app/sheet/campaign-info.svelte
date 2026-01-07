<!-- src/lib/components/app/sheet/campaign-info.svelte -->
<script lang="ts">
	import Fear from './fear.svelte';
	import { cn } from '$lib/utils';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const campaignCtx = getCampaignContext();

	// Get values from campaign context
	const fearValue = $derived(campaignCtx?.campaignState?.fear_track ?? 0);
	const countdowns = $derived(campaignCtx?.campaignState?.countdowns ?? []);
	const visibleCountdowns = $derived(countdowns.filter((c) => c.visibleToPlayers));
	const connected = $derived(!campaignCtx?.loading);

	// Local state for Fear component (since it uses bind)
	let localFearValue = $state(0);

	// Sync local fear value from campaign context
	$effect(() => {
		localFearValue = fearValue;
	});

	// No-op handler since players can't update fear
	function handleFearUpdate(_value: number) {
		// Players cannot update fear - this is read-only
	}
</script>

{#if connected}
	<div
		class={cn(
			'flex flex-col items-center gap-4 border-b border-destructive/20 bg-destructive/5 px-4 py-4',
			className
		)}
	>
		<!-- Fear Tracker (read-only for players) - always show if connected -->
		<Fear bind:fearValue={localFearValue} onUpdate={handleFearUpdate} isGM={false} />

		<!-- Visible Countdowns (read-only) -->
		{#if visibleCountdowns.length > 0}
			<div class="flex flex-wrap items-center justify-center gap-4">
				{#each visibleCountdowns as countdown (countdown.id)}
					<div class="flex flex-col items-center gap-1">
						<span class="font-eveleth text-sm text-muted-foreground">{countdown.name}</span>
						<div
							class="flex h-10 w-16 items-center justify-center rounded-md border bg-background font-eveleth text-xl"
						>
							{countdown.current}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}
