<!-- src/lib/components/app/campaigns/countdown-sheet.svelte -->
<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { Countdown } from '@shared/types/campaign.types';
	import Plus from '@lucide/svelte/icons/plus';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { cn } from '$lib/utils';

	let { open = $bindable(false) } = $props();

	const campaignContext = getCampaignContext();
	const campaignState = $derived(campaignContext.campaignState);
	const countdowns = $derived(campaignState?.countdowns ?? []);

	function handleAddCountdown() {
		if (!campaignContext.campaignState) return;

		const newCountdown: Countdown = {
			id: crypto.randomUUID(),
			name: '',
			min: 0,
			current: 6,
			visibleToPlayers: false
		};

		// Direct state mutation - auto-save is handled by the context's debounced effect
		campaignContext.campaignState = {
			...campaignContext.campaignState,
			countdowns: [...countdowns, newCountdown]
		};
	}

	function handleDeleteCountdown(countdownId: string) {
		if (!campaignContext.campaignState) return;

		// Direct state mutation - auto-save is handled by the context's debounced effect
		campaignContext.campaignState = {
			...campaignContext.campaignState,
			countdowns: countdowns.filter((cd) => cd.id !== countdownId)
		};
	}

	function handleToggleVisibility(countdown: Countdown) {
		if (!campaignContext.campaignState) return;

		const updatedCountdowns = countdowns.map((cd) =>
			cd.id === countdown.id ? { ...cd, visibleToPlayers: !cd.visibleToPlayers } : cd
		);

		// Direct state mutation - auto-save is handled by the context's debounced effect
		campaignContext.campaignState = {
			...campaignContext.campaignState,
			countdowns: updatedCountdowns
		};
	}

	function handleUpdateName(countdown: Countdown, newName: string) {
		if (!campaignContext.campaignState) return;

		const updatedCountdowns = countdowns.map((cd) =>
			cd.id === countdown.id ? { ...cd, name: newName } : cd
		);

		// Direct state mutation - auto-save is handled by the context's debounced effect
		campaignContext.campaignState = {
			...campaignContext.campaignState,
			countdowns: updatedCountdowns
		};
	}

	function handleUpdateValue(countdown: Countdown, newValue: number) {
		if (!campaignContext.campaignState) return;

		// Ensure value is within bounds
		const clampedValue = Math.max(countdown.min, newValue);

		const updatedCountdowns = countdowns.map((cd) =>
			cd.id === countdown.id ? { ...cd, current: clampedValue } : cd
		);

		// Direct state mutation - auto-save is handled by the context's debounced effect
		campaignContext.campaignState = {
			...campaignContext.campaignState,
			countdowns: updatedCountdowns
		};
	}

	let whatIsCountdownsOpen = $state(false);
</script>

<Sheet.Root bind:open>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Countdowns</Sheet.Title>
			<Sheet.Description>
				Countdowns represent a period of time or series of events preceding a future effect.
			</Sheet.Description>
		</Sheet.Header>

		<div class="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
			<!-- Countdowns Table -->
			<Button class="ml-auto w-min" size="sm" onclick={handleAddCountdown}>
				<Plus class="size-3.5" />
				New Countdown</Button
			>

			<table class="w-full border-collapse text-sm">
				<thead>
					<tr class="border-b">
						<th class="py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
						<th class="py-2 text-left text-xs font-medium text-muted-foreground">Value</th>
						<th class="py-2 text-center text-xs font-medium text-muted-foreground">Visibility</th>
						<th class="py-2 text-right"></th>
					</tr>
				</thead>
				<tbody>
					{#each countdowns as countdown, i}
						<tr class="border-b">
							<td class="py-2 pr-4">
								<Input
									value={countdown.name}
									placeholder={`Countdown ${i + 1}`}
									class="w-full"
									onblur={(e) => {
										if (e.currentTarget.value !== countdown.name) {
											handleUpdateName(countdown, e.currentTarget.value);
										}
									}}
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
									min={countdown.min}
									step="1"
									class="w-16"
									onblur={(e) => {
										const newValue = Number(e.currentTarget.value);
										if (!isNaN(newValue) && newValue !== countdown.current) {
											handleUpdateValue(countdown, newValue);
										}
									}}
									onkeydown={(e) => {
										if (e.key === 'Enter') {
											e.currentTarget.blur();
										}
									}}
								/>
							</td>
							<td class="py-2 text-center">
								<Button
									variant="ghost"
									size="sm"
									class="h-auto"
									onclick={() => handleToggleVisibility(countdown)}
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
									onclick={() => handleDeleteCountdown(countdown.id)}
								>
									<CircleMinus class="size-3.5" />
								</Button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<Collapsible.Root bind:open={whatIsCountdownsOpen}>
				<Collapsible.Trigger class="mt-4 flex items-center gap-1">
					<ChevronRight
						class={cn('size-4 transition-transform', whatIsCountdownsOpen && 'rotate-90')}
					/>
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
						<li>
							<b>Visible (<Eye class="stroke- mx-0.5 -mt-0.5 inline size-3.5" />)</b> countdowns can be
							seen by players on their character sheet.
						</li>
					</ul>
				</Collapsible.Content>
			</Collapsible.Root>
		</div>
	</Sheet.Content>
</Sheet.Root>
