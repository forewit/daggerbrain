<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { getCampaignContext } from '$lib/state/campaign.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Input from '$lib/components/ui/input/input.svelte';
	import Play from '@lucide/svelte/icons/play';
	import Settings from '@lucide/svelte/icons/settings';
	import TvMinimalPlay from '@lucide/svelte/icons/tv-minimal-play';
	import { cn } from '$lib/utils';

	let {
		campaignId,
		isGM,
		onStreamSettingsClick,
		onSettingsClick,
		onPlayerSettingsClick
	}: {
		campaignId: string;
		isGM: boolean;
		onStreamSettingsClick: () => void;
		onSettingsClick: () => void;
		onPlayerSettingsClick: () => void;
	} = $props();

	const campaignCtx = getCampaignContext();
	const campaign = $derived(campaignCtx.campaign);
	let editingName = $state(false);
</script>

{#if campaign}
	<div
		class="sticky top-[calc(var(--navbar-height,3.5rem)-1px)] z-20 w-full bg-background sm:top-0"
	>
		<div class="w-full bg-primary/50">
			<div
				class="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4"
			>
				<div class="flex items-center gap-2 truncate">
					<Button
						href="/campaigns"
						variant="link"
						class="hidden px-0 text-muted-foreground sm:flex"
					>
						Campaigns
					</Button>
					<ChevronRight class="hidden size-3.5 text-muted-foreground sm:block" />

					<Button href="/campaigns" variant="ghost" size="icon" class="shrink-0 sm:hidden">
						<ChevronLeft class="shrink-0" />
					</Button>

					{#if isGM && editingName}
						<Input
							class="-ml-2 border-none px-2"
							autofocus
							onblur={() => (editingName = false)}
							bind:value={campaign.name}
							placeholder="Campaign name"
						/>
					{:else}
						<Button
							variant="ghost"
							onclick={() => (editingName = true)}
							class={cn('-ml-2 truncate px-2', !isGM && 'pointer-events-none')}
						>
							<span class="truncate">{campaign.name || 'Unnamed Campaign'}</span>
						</Button>
					{/if}
				</div>

				<div class="flex shrink-0 items-center gap-2">
					{#if isGM}
						<Button
							variant="outline"
							size="sm"
							class="h-7"
							title="Stream Overlay"
							onclick={onStreamSettingsClick}
						>
							<TvMinimalPlay class="size-3.5" />
							<p class="hidden sm:block">Stream Overlay</p>
						</Button>
					{/if}

					<Button
						variant="outline"
						size="sm"
						class="h-7"
						onclick={isGM ? onSettingsClick : onPlayerSettingsClick}
					>
						<Settings class="size-3.5" />
						<p class="hidden sm:block">Settings</p>
					</Button>

					<Button size="sm" href={`/campaigns/${campaignId}/live`}>
						<p>Launch</p>
						<Play class="size-3.5" />
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
