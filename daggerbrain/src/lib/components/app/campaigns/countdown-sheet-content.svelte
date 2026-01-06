<!-- src/lib/components/app/campaigns/countdown-sheet-content.svelte -->
<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { Countdown } from '$lib/types/campaign-types';
	import { error } from '@sveltejs/kit';

	const campaignContext = getCampaignContext();
	const campaignState = $derived(campaignContext.campaignState);
	const countdowns = $derived(campaignState?.countdowns ?? []);

	let newCountdownName = $state('');

	async function handleAddCountdown() {
		if (!newCountdownName.trim() || !campaignState) return;

		const newCountdown: Countdown = {
			id: crypto.randomUUID(),
			name: newCountdownName.trim(),
			min: 0,
			current: 6,
			visibleToPlayers: false
		};

		const updatedCountdowns = [...countdowns, newCountdown];

		try {
			await campaignContext.updateState({
				countdowns: updatedCountdowns
			});
			// Reset form
			newCountdownName = '';
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to add countdown');
		}
	}

	async function handleDeleteCountdown(countdownId: string) {
		if (!campaignState) return;

		const updatedCountdowns = countdowns.filter((cd) => cd.id !== countdownId);

		try {
			await campaignContext.updateState({
				countdowns: updatedCountdowns
			});
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to delete countdown');
		}
	}

	async function handleToggleVisibility(countdown: Countdown) {
		if (!campaignState) return;

		const updatedCountdowns = countdowns.map((cd) =>
			cd.id === countdown.id ? { ...cd, visibleToPlayers: !cd.visibleToPlayers } : cd
		);

		try {
			await campaignContext.updateState({
				countdowns: updatedCountdowns
			});
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to toggle countdown visibility');
		}
	}
</script>

<Sheet.Header>
	<Sheet.Title>Countdowns</Sheet.Title>
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
	<!-- Add New Countdown Section -->
	<div class="flex items-center gap-2">
		<Input
			bind:value={newCountdownName}
			placeholder="Enter countdown name..."
			class="flex-1"
			onkeydown={(e) => {
				if (e.key === 'Enter' && newCountdownName.trim()) {
					handleAddCountdown();
				}
			}}
		/>
		<Button
			size="sm"
			disabled={!newCountdownName.trim()}
			onclick={handleAddCountdown}
		>
			Add
		</Button>
	</div>

	{#if countdowns.length > 0}
		<!-- Countdowns Table -->
		<table class="w-full border-collapse text-sm">
			<tbody>
				{#each countdowns as countdown}
					<tr class="border-b">
						<td class="py-2 pr-4 text-left text-muted-foreground">
							{countdown.name}
						</td>
						<td class="py-2 text-right">
							<div class="flex items-center justify-end gap-2">
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
								<Button
									variant="ghost"
									size="sm"
									class="h-auto"
									onclick={() => handleDeleteCountdown(countdown.id)}
								>
									<CircleMinus class="size-3.5" />
								</Button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="py-4 text-center text-sm text-muted-foreground italic">No countdowns</p>
	{/if}
</div>

