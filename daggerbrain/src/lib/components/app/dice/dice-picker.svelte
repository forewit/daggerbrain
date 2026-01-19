<script lang="ts">
	import { cn } from '$lib/utils';
	import D10 from './svg-components/d10.svelte';
	import D12 from './svg-components/d12.svelte';
	import D20 from './svg-components/d20.svelte';
	import D4 from './svg-components/d4.svelte';
	import D6 from './svg-components/d6.svelte';
	import D8 from './svg-components/d8.svelte';

	type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

	type DiceCounts = {
		d4: number;
		d6: number;
		d8: number;
		d10: number;
		d12: number;
		d20: number;
	};

	let {
		value = '',
		onChange = () => {},
		label
	}: {
		value?: string;
		onChange?: (value: string) => void;
		label?: string;
	} = $props();

	// Parse the dice string into counts
	let counts = $state<DiceCounts>({
		d4: 0,
		d6: 0,
		d8: 0,
		d10: 0,
		d12: 0,
		d20: 0
	});

	// Parse value string into counts
	function parseDiceString(diceString: string): DiceCounts {
		const newCounts: DiceCounts = { d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0 };
		if (!diceString) {
			return newCounts;
		}

		// Match patterns like "1d6", "2d4", "d6", etc.
		const matches = diceString.matchAll(/(\d*)d(\d+)/g);
		for (const match of matches) {
			const numDice = match[1] === '' ? 1 : parseInt(match[1], 10);
			const dieSize = parseInt(match[2], 10);
			const dieType = `d${dieSize}` as DiceType;
			if (dieType in newCounts) {
				newCounts[dieType] = numDice;
			}
		}
		return newCounts;
	}

	// Convert counts to dice string
	function countsToDiceString(counts: DiceCounts): string {
		const parts: string[] = [];
		if (counts.d4 > 0) parts.push(`${counts.d4}d4`);
		if (counts.d6 > 0) parts.push(`${counts.d6}d6`);
		if (counts.d8 > 0) parts.push(`${counts.d8}d8`);
		if (counts.d10 > 0) parts.push(`${counts.d10}d10`);
		if (counts.d12 > 0) parts.push(`${counts.d12}d12`);
		if (counts.d20 > 0) parts.push(`${counts.d20}d20`);
		return parts.join('+');
	}

	// Update counts when value prop changes
	$effect(() => {
		counts = parseDiceString(value);
	});

	// Update value when counts change
	function updateCount(dieType: DiceType, delta: number) {
		counts[dieType] = Math.max(0, counts[dieType] + delta);
		const newValue = countsToDiceString(counts);
		onChange(newValue);
	}

	function handleClick(dieType: DiceType) {
		updateCount(dieType, 1);
	}

	function handleRightClick(e: MouseEvent, dieType: DiceType) {
		e.preventDefault();
		updateCount(dieType, -1);
	}

	// Get the current dice string
	let diceString = $derived(countsToDiceString(counts));
</script>

{#if label}
	<div class="mb-2 flex items-center justify-between truncate">
		<p class="text-xs font-medium text-muted-foreground text-nowrap">{label}</p>
		{#if diceString}
			<span class="text-xs text-muted-foreground truncate">{diceString}</span>
		{/if}
	</div>
{/if}

<div class="flex items-center justify-around gap-2">
	<!-- d4 -->
	<button
		type="button"
		class={cn(
			'relative flex items-center justify-center rounded-md p-1 hover:bg-primary/20',
			counts.d4 > 0 && 'bg-primary/10'
		)}
		onclick={() => handleClick('d4')}
		oncontextmenu={(e) => handleRightClick(e, 'd4')}
	>
		{#if counts.d4 > 0}
			<span
				class="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
				>{counts.d4}</span
			>
		{/if}
		<D4 class="size-7" showLabel/>

	</button>

	<!-- d6 -->
	<button
		type="button"
		class={cn(
			'relative flex items-center justify-center rounded-md p-1 hover:bg-primary/20',
			counts.d6 > 0 && 'bg-primary/10'
		)}
		onclick={() => handleClick('d6')}
		oncontextmenu={(e) => handleRightClick(e, 'd6')}
	>
		{#if counts.d6 > 0}
			<span
				class="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
				>{counts.d6}</span
			>
		{/if}
		<D6 class="size-7" showLabel/>
	</button>

	<!-- d8 -->
	<button
		type="button"
		class={cn(
			'relative flex items-center justify-center rounded-md p-1 hover:bg-primary/20',
			counts.d8 > 0 && 'bg-primary/10'
		)}
		onclick={() => handleClick('d8')}
		oncontextmenu={(e) => handleRightClick(e, 'd8')}
	>
		{#if counts.d8 > 0}
			<span
				class="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
				>{counts.d8}</span
			>
		{/if}
		<D8 class="size-7" showLabel/>
	</button>

	<!-- d10 -->
	<button
		type="button"
		class={cn(
			'relative flex items-center justify-center rounded-md p-1 hover:bg-primary/20',
			counts.d10 > 0 && 'bg-primary/10'
		)}
		onclick={() => handleClick('d10')}
		oncontextmenu={(e) => handleRightClick(e, 'd10')}
	>
		{#if counts.d10 > 0}
			<span
				class="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
				>{counts.d10}</span
			>
		{/if}
		<D10 class="size-7" showLabel/>
	</button>

	<!-- d12 -->
	<button
		type="button"
		class={cn(
			'relative flex items-center justify-center rounded-md p-1 hover:bg-primary/20',
			counts.d12 > 0 && 'bg-primary/10'
		)}
		onclick={() => handleClick('d12')}
		oncontextmenu={(e) => handleRightClick(e, 'd12')}
	>
		{#if counts.d12 > 0}
			<span
				class="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
				>{counts.d12}</span
			>
		{/if}
		<D12 class="size-7" showLabel/>
	</button>

	<!-- d20 -->
	<button
		type="button"
		class={cn(
			'relative flex items-center justify-center rounded-md p-1 hover:bg-primary/20',
			counts.d20 > 0 && 'bg-primary/10'
		)}
		onclick={() => handleClick('d20')}
		oncontextmenu={(e) => handleRightClick(e, 'd20')}
	>
		{#if counts.d20 > 0}
			<span
				class="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
				>{counts.d20}</span
			>
		{/if}
		<D20 class="size-7" showLabel/>
	</button>
</div>
