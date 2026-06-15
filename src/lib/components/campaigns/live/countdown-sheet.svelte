<script lang="ts">
	import type { Countdown } from '@convex/schemas/rules';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { getCampaignContext } from '$lib/state/campaign.svelte';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Plus from '@lucide/svelte/icons/plus';

	let {
		open = $bindable(false),
		isGM
	}: {
		open?: boolean;
		isGM: boolean;
	} = $props();

	const campaignCtx = getCampaignContext();
	const campaign = $derived(campaignCtx.campaign);

	const visibleCountdowns = $derived.by(() => {
		if (!campaign) return [];
		return isGM
			? campaign.countdowns
			: campaign.countdowns.filter((countdown) => countdown.visibleToPlayers);
	});

	function addCountdown() {
		if (!campaign || !isGM) return;

		campaign.countdowns = [
			...campaign.countdowns,
			{
				id: crypto.randomUUID(),
				name: 'New Countdown',
				current: 6,
				min: 0,
				visibleToPlayers: false
			} satisfies Countdown
		];
	}

	function removeCountdown(id: string) {
		if (!campaign || !isGM) return;
		campaign.countdowns = campaign.countdowns.filter((countdown) => countdown.id !== id);
	}

	function toggleVisibility(id: string) {
		if (!campaign || !isGM) return;

		const countdown = campaign.countdowns.find((entry) => entry.id === id);
		if (!countdown) return;

		countdown.visibleToPlayers = !countdown.visibleToPlayers;
	}

	function updateCountdownName(id: string, name: string) {
		if (!campaign || !isGM) return;

		const countdown = campaign.countdowns.find((entry) => entry.id === id);
		if (!countdown || countdown.name === name) return;

		countdown.name = name;
	}

	function updateCountdownValue(id: string, value: number) {
		if (!campaign || !isGM || Number.isNaN(value)) return;

		const countdown = campaign.countdowns.find((entry) => entry.id === id);
		if (!countdown) return;

		const clampedValue = Math.max(countdown.min, value);
		if (countdown.current === clampedValue) return;

		countdown.current = clampedValue;
	}

	let moreInfoOpen = $state(false);
</script>

<Sheet.Root bind:open>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Countdowns</Sheet.Title>
			<Sheet.Description>
				{#if isGM}
					Countdowns represent a period of time or series of events preceding a future effect.
				{:else}
					Countdowns your GM has shared with the table.
				{/if}
			</Sheet.Description>
		</Sheet.Header>

		<div class="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
			{#if isGM}
				<Button class="ml-auto w-min" size="sm" onclick={addCountdown}>
					<Plus class="size-3.5" />
					New Countdown
				</Button>
			{/if}

			{#if visibleCountdowns.length === 0}
				<div
					class="rounded-md border border-dashed px-4 py-8 text-center text-sm text-muted-foreground italic"
				>
					No countdowns yet.
				</div>
			{:else}
				<table class="w-full border-collapse text-sm">
					<thead>
						<tr class="border-b">
							<th class="py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
							<th class="py-2 text-left text-xs font-medium text-muted-foreground">Value</th>
							{#if isGM}
								<th class="py-2 text-center text-xs font-medium text-muted-foreground"
									>Visibility</th
								>
								<th class="py-2 text-right"></th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each visibleCountdowns as countdown, i}
							<tr class="border-b">
								<td class="py-2 pr-4">
									<Input
										value={countdown.name}
										readonly={!isGM}
										placeholder={`Countdown ${i + 1}`}
										class="w-full"
										onblur={(e) => updateCountdownName(countdown.id, e.currentTarget.value)}
										onkeydown={(e) => {
											if (e.key === 'Enter') {
												e.currentTarget.blur();
											}
										}}
									/>
								</td>
								<td class="py-2 text-center">
									<Input
										type="number"
										inputmode="numeric"
										value={countdown.current}
										readonly={!isGM}
										min={countdown.min}
										step="1"
										class="w-16"
										onblur={(e) =>
											updateCountdownValue(countdown.id, Number(e.currentTarget.value))}
										onkeydown={(e) => {
											if (e.key === 'Enter') {
												e.currentTarget.blur();
											}
										}}
									/>
								</td>
								{#if isGM}
									<td class="py-2 text-center">
										<Button
											variant="ghost"
											size="sm"
											class="h-auto"
											onclick={() => toggleVisibility(countdown.id)}
											title={countdown.visibleToPlayers ? 'Hide from players' : 'Show to players'}
										>
											{#if countdown.visibleToPlayers}
												<Eye class="size-3.5" />
											{:else}
												<EyeOff class="size-3.5" />
											{/if}
										</Button>
									</td>
									<td class="py-2 text-right">
										<Button
											variant="ghost"
											size="sm"
											class="h-auto"
											onclick={() => removeCountdown(countdown.id)}
										>
											<CircleMinus class="size-3.5" />
										</Button>
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}

			<Collapsible.Root bind:open={moreInfoOpen}>
				<Collapsible.Trigger class="mt-4 flex items-center gap-1">
					<ChevronRight class={cn('size-4 transition-transform', moreInfoOpen && 'rotate-90')} />
					<p class="text-sm font-medium">More info</p>
				</Collapsible.Trigger>
				<Collapsible.Content class="space-y-3 pt-2 pl-5">
					<p class="text-xs text-muted-foreground italic">How to use countdowns:</p>

					<ul class="list-disc space-y-3 text-xs text-muted-foreground italic">
						<li>
							<b>Clicking</b> a countdown will decrease it by one.
						</li>
						<li>
							<b>Right-clicking</b> a countdown will increase it by one.
						</li>
						{#if isGM}
							<li>
								<b>Visible (<Eye class="mx-0.5 -mt-0.5 inline size-3.5" />)</b> countdowns can be seen
								by players on their character sheet.
							</li>
						{/if}
					</ul>
				</Collapsible.Content>
			</Collapsible.Root>
		</div>
	</Sheet.Content>
</Sheet.Root>
