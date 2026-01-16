<!-- src/lib/components/app/campaigns/campaign-header.svelte -->
<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Settings from '@lucide/svelte/icons/settings';
	import Play from '@lucide/svelte/icons/play';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';

	let {
		campaignId,
		isGM,
		onSettingsClick,
		onPlayerSettingsClick
	}: {
		campaignId: string;
		isGM: boolean;
		onSettingsClick: () => void;
		onPlayerSettingsClick: () => void;
	} = $props();

	const campaignContext = getCampaignContext();
	const campaign = $derived(campaignContext.campaign);
</script>

<div class="sticky top-[calc(var(--navbar-height,3.5rem)-1px)] z-20 w-full bg-background sm:top-0">
	<div class="w-full bg-primary/50">
		<div
			class="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4"
		>
			<div class="flex items-center gap-2">
				<Button href="/campaigns" variant="link" class=" px-0 text-muted-foreground sm:flex">
					Campaigns
				</Button>
				<ChevronRight class=" size-3.5 text-muted-foreground sm:block" />
				<p class="truncate text-sm font-medium">
					{campaign?.name || 'unnamed campaign'}
				</p>
			</div>
			<div class="flex shrink-0 items-center gap-2">
				{#if isGM}
					<Button variant="outline" size="sm" onclick={onSettingsClick} class="h-7">
						<Settings class="size-3.5" />
						<p class="hidden sm:block">Settings</p>
					</Button>
				{:else}
					<Button variant="outline" size="sm" onclick={onPlayerSettingsClick} class="h-7">
						<Settings class="size-3.5" />
						<p class="hidden sm:block">Settings</p>
					</Button>
				{/if}
				<Button size="sm" href={`/campaigns/${campaignId}/live`}>
					<p class="hidden sm:block">Launch</p>
					<Play class="size-3.5" />
				</Button>
			</div>
		</div>
	</div>
</div>
