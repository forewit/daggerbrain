<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MinusIcon from '@lucide/svelte/icons/minus';

	type UnitKey = 'coin' | 'handful' | 'bag' | 'chest';

	const UNIT_VALUES: Record<UnitKey, number> = {
		coin: 1,
		handful: 10,
		bag: 100,
		chest: 1000
	} as const;

	const MAX_COUNTS: Record<UnitKey, number> = {
		coin: 9,
		handful: 9,
		bag: 9,
		chest: 1
	} as const;

	const UNIT_CONFIG: Array<{ key: UnitKey; label: string; slots: number }> = [
		{ key: 'coin', label: 'COINS', slots: MAX_COUNTS.coin },
		{ key: 'handful', label: 'HANDFULS', slots: MAX_COUNTS.handful },
		{ key: 'bag', label: 'BAGS', slots: MAX_COUNTS.bag },
		{ key: 'chest', label: 'CHEST', slots: MAX_COUNTS.chest }
	];
	const UNIT_CONFIG_NO_COINS = UNIT_CONFIG.filter((unit) => unit.key !== 'coin');

	const MAX_GOLD =
		MAX_COUNTS.coin * UNIT_VALUES.coin +
		MAX_COUNTS.handful * UNIT_VALUES.handful +
		MAX_COUNTS.bag * UNIT_VALUES.bag +
		MAX_COUNTS.chest * UNIT_VALUES.chest;

	type UnitCounts = Record<UnitKey, number>;

	let {
		class: className = '',
		gold_coins = $bindable(0),
		isCoinMode = false,
		canEdit = true
	}: { class?: string; gold_coins?: number; isCoinMode?: boolean; canEdit?: boolean } = $props();

	const clampGoldValue = (value: number) => {
		if (!Number.isFinite(value)) return 0;
		return Math.max(0, Math.min(MAX_GOLD, Math.floor(value)));
	};

	const decomposeGold = (value: number): UnitCounts => {
		let remaining = clampGoldValue(value);
		const chest = Math.floor(remaining / UNIT_VALUES.chest);
		remaining -= chest * UNIT_VALUES.chest;
		const bag = Math.floor(remaining / UNIT_VALUES.bag);
		remaining -= bag * UNIT_VALUES.bag;
		const handful = Math.floor(remaining / UNIT_VALUES.handful);
		remaining -= handful * UNIT_VALUES.handful;
		const coin = remaining;
		return {
			coin,
			handful,
			bag,
			chest
		};
	};

	const composeGold = (counts: UnitCounts) =>
		clampGoldValue(
			counts.coin * UNIT_VALUES.coin +
				counts.handful * UNIT_VALUES.handful +
				counts.bag * UNIT_VALUES.bag +
				counts.chest * UNIT_VALUES.chest
		);

	let totalGold = $derived(clampGoldValue(gold_coins ?? 0));
	let unitCounts = $derived(decomposeGold(totalGold));

	const handleSlotClick = (unit: UnitKey, slotIndex: number) => {
		const counts: UnitCounts = { ...unitCounts };
		const current = Math.min(counts[unit], MAX_COUNTS[unit]);
		let next = slotIndex + 1;

		if (next === current) {
			next = Math.max(0, current - 1);
		}

		counts[unit] = Math.min(next, MAX_COUNTS[unit]);
		gold_coins = composeGold(counts);
	};

	// const handleAddGold = (unit: UnitKey) => {
	// 	const unitValue = UNIT_VALUES[unit];
	// 	const newValue = gold_coins + unitValue;
	// 	if (newValue <= MAX_GOLD) {
	// 		gold_coins = clampGoldValue(newValue);
	// 	}
	// };

	// const handleRemoveGold = (unit: UnitKey) => {
	// 	const unitValue = UNIT_VALUES[unit];
	// 	const newValue = gold_coins - unitValue;
	// 	if (newValue >= 0) {
	// 		gold_coins = clampGoldValue(newValue);
	// 	}
	// };

	let visibleUnitConfig = $derived(isCoinMode ? UNIT_CONFIG : UNIT_CONFIG_NO_COINS);
	// let totalDisplayValue = $derived(
	// 	isCoinMode ? totalGold : Math.floor(totalGold / UNIT_VALUES.handful)
	// );
	// let totalDisplayLabel = $derived(isCoinMode ? 'coins' : 'handfuls');

	$effect(() => {
		const clamped = clampGoldValue(gold_coins);
		if (clamped !== gold_coins) {
			gold_coins = clamped;
		}
	});

	let width = $state(0);
</script>

<div
	class={cn('flex gap-2', width < 378 && 'flex-col items-center', className)}
	bind:clientWidth={width}
>
	{#each visibleUnitConfig as unit}
		{@const heightClass = unit.key === 'coin' ? 'h-5' : 'h-6'}

		<div class={cn('flex h-min flex-wrap gap-0.5', unit.key === 'chest' && 'justify-center')}>
			{#each Array(unit.slots) as _, slotIndex}
				{@const isActive = slotIndex < Math.min(unitCounts[unit.key], MAX_COUNTS[unit.key])}
				<button
					disabled={!canEdit}
					type="button"
					aria-label={`${unit.label} slot ${slotIndex + 1}`}
					aria-pressed={isActive}
					class={cn(
						'flex aspect-square items-center justify-center rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
						heightClass,
						isActive
							? 'text-accent drop-shadow-[0_0_6px_rgba(253,212,113,0.4)]'
							: 'text-muted-foreground',
						!canEdit && 'pointer-events-none'
					)}
					onclick={() => handleSlotClick(unit.key, slotIndex)}
				>
					{#if unit.key === 'coin'}
						<!-- <svg viewBox="0 0 24 24" class="size-3 stroke-5 fill-current" aria-hidden="true">
                <path
                  d="M 12 2 C 5.271 2 0 4.855 0 8.5 L 0 15.5 C 0 19.145 5.271 22 12 22 C 18.729 22 24 19.145 24 15.5 L 24 8.5 C 24 4.855 18.729 2 12 2 Z M 2 15.5 L 2 12.14 C 7.695 16.678 18.811 15.207 21.979 12.183 L 22.007 15.526 C 20.507 21.28 3.843 21.819 2 15.501 L 2 15.5 Z M 12 13.001 C 6.107 13.001 2 10.629 2 8.501 C 2 6.373 6.107 4 12 4 C 17.893 4 22 6.372 22 8.5 C 22 10.628 17.893 13 12 13 Z"
                />
              </svg> -->
						<div class="size-3 rounded-full border-2 border-current"></div>
					{:else if unit.key === 'handful'}
						<svg viewBox="0 0 24 24" class="size-4.5 fill-current" aria-hidden="true">
							<path
								d="M16.5,0c-4.206,0-7.5,1.977-7.5,4.5v2.587c-.484-.057-.985-.087-1.5-.087C3.294,7,0,8.977,0,11.5v8c0,2.523,3.294,4.5,7.5,4.5,3.416,0,6.231-1.304,7.167-3.146,.597,.087,1.207,.146,1.833,.146,4.206,0,7.5-1.977,7.5-4.5V4.5c0-2.523-3.294-4.5-7.5-4.5Zm0,2c3.148,0,5.5,1.32,5.5,2.5s-2.352,2.5-5.5,2.5-5.5-1.32-5.5-2.5,2.352-2.5,5.5-2.5ZM7.5,9c3.148,0,5.5,1.32,5.5,2.5s-2.352,2.5-5.5,2.5-5.5-1.32-5.5-2.5,2.352-2.5,5.5-2.5ZM2,14.582c1.36,.875,3.303,1.418,5.5,1.418s4.14-.543,5.5-1.418v.918c0,1.18-2.352,2.5-5.5,2.5s-5.5-1.32-5.5-2.5v-.918Zm5.5,7.418c-3.148,0-5.5-1.32-5.5-2.5v-.918c1.36,.875,3.303,1.418,5.5,1.418s4.14-.543,5.5-1.418v.918c0,1.18-2.352,2.5-5.5,2.5Zm9-3c-.514,0-1.012-.047-1.5-.116v-1.98c.492,.058,.99,.096,1.5,.096,2.197,0,4.14-.543,5.5-1.418v.918c0,1.18-2.352,2.5-5.5,2.5Zm0-4c-.514,0-1.012-.047-1.5-.116v-1.98c.492,.058,.99,.096,1.5,.096,2.197,0,4.14-.543,5.5-1.418v.918c0,1.18-2.352,2.5-5.5,2.5Zm0-4c-.542,0-1.066-.051-1.578-.127-.198-.887-.809-1.684-1.721-2.321,.992,.285,2.106,.449,3.299,.449,2.197,0,4.14-.543,5.5-1.418v.918c0,1.18-2.352,2.5-5.5,2.5Z"
							/>
						</svg>
					{:else if unit.key === 'bag'}
						<svg viewBox="0 0 24 24" class="size-5 fill-current" aria-hidden="true">
							<path
								d="M14.648,5.493c.872-.701,1.772-1.643,2.227-2.788,.238-.598,.163-1.276-.203-1.816-.377-.557-1.002-.889-1.672-.889h-6c-.67,0-1.295,.333-1.672,.889-.366,.54-.441,1.218-.204,1.814,.456,1.146,1.355,2.089,2.228,2.789C4.695,7.221,1,13.159,1,18c0,3.309,2.691,6,6,6h10c3.309,0,6-2.691,6-6,0-4.841-3.695-10.779-8.352-12.507Zm.368-3.528c-.515,1.296-2.094,2.393-3.018,2.91-.923-.513-2.495-1.6-2.999-2.875l6.017-.035Zm1.983,20.035H7c-2.206,0-4-1.794-4-4,0-5.243,4.71-11,9-11s9,5.757,9,11c0,2.206-1.794,4-4,4Z"
							/>
						</svg>
					{:else}
						<svg viewBox="0 0 24 24" class="size-5 fill-current" aria-hidden="true">
							<path
								d="M18,0H6C2.691,0,0,2.691,0,6V24H24V6c0-3.309-2.691-6-6-6Zm4,6v3h-2V2.556c1.19,.694,2,1.97,2,3.444Zm-4-4v7h-3c0-1.654-1.346-3-3-3s-3,1.346-3,3h-3V2h12Zm-5,7v4h-2v-4c0-.551,.448-1,1-1s1,.449,1,1ZM4,2.556v6.444H2v-3c0-1.474,.81-2.75,2-3.444ZM20,22V13h-2v9H6V13h-2v9H2V11h7v4h6v-4h7v11h-2Z"
							/>
						</svg>
					{/if}
				</button>
			{/each}
			<!-- <div class={cn("px-1 flex items-center", heightClass)}>
          <button
            onclick={() => handleRemoveGold(unit.key)}
            class=" h-4.5 rounded-l-full bg-red-500/20 hover:bg-red-500/30 px-1"
            ><MinusIcon class="size-3.5" /></button
          >

          <button
            onclick={() => handleAddGold(unit.key)}
            class=" h-4.5 rounded-r-full bg-green-500/20 hover:bg-green-500/30 px-1"
            ><PlusIcon class="size-3.5" /></button
          >
        </div> -->
		</div>
	{/each}
</div>
