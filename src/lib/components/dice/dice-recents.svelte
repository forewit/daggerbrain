<script lang="ts">
	import { getDiceContext } from '$lib/state/dice.svelte';
	import { slide } from 'svelte/transition';
	import RollSummary from './roll-summary.svelte';
	import { cn } from '$lib/utils';
	import type { Roll } from '@convex/schemas/dice';
	import { flip } from 'svelte/animate';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Box from '@lucide/svelte/icons/box';
	import DiceLog from './dice-log-sheet.svelte';

	let {
		class: className = '',
		showDiceLog = $bindable(false)
	}: {
		class?: string;
		showDiceLog?: boolean;
	} = $props();

	const DURATION = 180;

	const context = getDiceContext();

	type RecentRoll = {
		id: number;
		size: 'default' | 'sm';
		roll: Roll;
	};

	function getRollSignature(roll: Roll): string {
		return JSON.stringify(roll);
	}

	let id = 0;

	let recentRolls: RecentRoll[] = $state([]);

	let expanded = $state(true);

	$effect(() => {
		const historyById = new Map(context.history.map((roll) => [roll.id, roll]));
		let changed = false;

		for (const recentRoll of recentRolls) {
			const historyRoll = historyById.get(recentRoll.roll.id);
			if (historyRoll && getRollSignature(historyRoll) !== getRollSignature(recentRoll.roll)) {
				recentRoll.roll = historyRoll;
				changed = true;
			}
		}

		if (changed) {
			recentRolls = [...recentRolls];
		}
	});

	$effect(() => {
		const unsubscribe = context.onRollEnd((roll) => {
			const existingIndex = recentRolls.findIndex((recentRoll) => recentRoll.roll.id === roll.id);
			if (existingIndex !== -1) {
				const [existingRecentRoll] = recentRolls.splice(existingIndex, 1);
				existingRecentRoll.roll = roll;
				existingRecentRoll.size = 'default';
				recentRolls.unshift(existingRecentRoll);
				recentRolls = [...recentRolls];
				return;
			}

			recentRolls.unshift({
				id: id++,
				size: 'default',
				roll
			});
		});

		return unsubscribe;
	});

	$effect(() => {
		// only the first one should have size of 'default'
		for (let i = 0; i < recentRolls.length; i++) {
			if (i > 0) {
				recentRolls[i].size = 'sm';
			}
		}

		// trim to three most recent
		if (recentRolls.length > 3) {
			setTimeout(() => {
				recentRolls = recentRolls.slice(0, 3);
			}, DURATION);
		}
	});
</script>

<div
	class={cn(
		'pointer-events-none z-44 flex flex-col-reverse items-end gap-2',
		'fixed right-[calc(env(safe-area-inset-left)+16px+var(--scrollbar-width,0px))] bottom-[calc(env(safe-area-inset-bottom)+16px)]',
		className
	)}
>
	{#if recentRolls.length > 0}
		<div transition:slide={{ axis: 'x', duration: DURATION }} class="flex gap-2">
			<button
				onclick={() => {
					expanded = !expanded;
				}}
				class={cn(
					'pointer-events-auto cursor-pointer',
					'flex items-center',
					'h-7 rounded-2xl border-2 border-primary-muted bg-card px-3 shadow-xl'
				)}
			>
				<ChevronRight class={cn('size-3.5 transition-all', expanded && '-rotate-90')} />
			</button>
			<button
				onclick={() => (showDiceLog = !showDiceLog)}
				class={cn(
					'pointer-events-auto cursor-pointer',
					'flex items-center',
					'h-7 rounded-2xl border-2 border-primary-muted bg-card px-3 shadow-xl'
				)}
			>
				<Box class={cn('size-3.5')} />
			</button>
			<button
				onclick={() => {
					recentRolls = [];
				}}
				class={cn(
					'pointer-events-auto cursor-pointer text-nowrap',
					'flex items-center text-sm font-bold',
					'h-7 rounded-2xl border-2 border-primary-muted bg-card px-3 shadow-xl'
				)}
			>
				Clear
			</button>
		</div>
	{/if}

	{#if expanded}
		{#each recentRolls as recentRoll, i (recentRoll.id)}
			<div
				animate:flip={{ duration: DURATION }}
				transition:slide={{ axis: 'x', duration: DURATION }}
				class="w-min"
			>
				<RollSummary
					roll={recentRoll.roll}
					size={recentRoll.size}
					allowDieReroll={recentRoll.size === 'default'}
				/>
			</div>
		{/each}
	{/if}
</div>
