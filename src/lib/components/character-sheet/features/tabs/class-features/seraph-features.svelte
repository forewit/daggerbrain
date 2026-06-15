<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import D4 from '$lib/components/dice/svg-components/d4.svelte';
	import { getDiceContext } from '$lib/state/dice.svelte';
	import type { Roll } from '@convex/schemas/dice';

	const characterCtx = getCharacterContext();
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const character = $derived(characterCtx.character);

	const diceCtx = getDiceContext();

	const max_prayer_dice = $derived(derived_character_data?.traits['strength'] ?? 0);
	const prayer_dice_values = $derived(character?.feature_choices['prayer_dice_values'] ?? []);

	// keep the prayer_dice_values length locked to the max dice length
	$effect(() => {
		if (!character) return;

		if (!character.feature_choices['prayer_dice_values']) {
			character.feature_choices['prayer_dice_values'] = [];
		}
		while (character.feature_choices['prayer_dice_values'].length < max_prayer_dice) {
			character.feature_choices['prayer_dice_values'].push('');
		}
		while (character.feature_choices['prayer_dice_values'].length > max_prayer_dice) {
			character.feature_choices['prayer_dice_values'].pop();
		}
	});

	let isRolling = $state(false);

	$effect(() => {
		if (!diceCtx.isRolling) isRolling = false;
	});

	async function rollPrayerDie(index: number) {
		if (!character) return;

		isRolling = true;

		character.feature_choices['prayer_dice_values'][index] = '';

		const resultDiceGroup = await diceCtx.roll({
			name: 'Prayer Dice',
			dice: [{ type: 'd4' }]
		});

		console.log(resultDiceGroup);

		if (resultDiceGroup.length === 0) {
			console.warn('Failed to roll prayer dice.');
			isRolling = false;
			return;
		}

		const result = resultDiceGroup[0].value;
		character.feature_choices['prayer_dice_values'][index] = result.toString();
		isRolling = false;
	}

	async function rollAllPrayerDice() {
		if (!character) return;
		isRolling = true;

		character.feature_choices['prayer_dice_values'] = [];

		let diceArray: Roll['dice'] = [];
		for (let i = 0; i < max_prayer_dice; i++) {
			diceArray.push({ type: 'd4' });
		}

		const resultDiceGroup = await diceCtx.roll({
			name: 'Prayer Dice',
			dice: diceArray
		});

		if (resultDiceGroup.length === 0) {
			console.warn('Failed to roll prayer dice, empty results.');
			isRolling = false;
			return;
		}

		const result = resultDiceGroup.map((result) => result.value.toString());
		character.feature_choices['prayer_dice_values'] = result;
		isRolling = false;
	}
</script>

{#if character && derived_character_data?.hasPrayerDiceClassFeature}
	<div class="-mb-2 flex items-center justify-center gap-2 border-y py-2">
		<div class="relative flex flex-wrap items-center gap-2">
			{#if max_prayer_dice > 0}
				{#each Array(max_prayer_dice) as _, index}
					<button
						disabled={isRolling || !characterCtx.canEdit}
						class={cn('hover:cursor-pointer', !characterCtx.canEdit && 'pointer-events-none')}
						onclick={() => {
							const value = parseInt(prayer_dice_values[index]);
							if (!value || value <= 0 || value > 4) {
								rollPrayerDie(index);
							} else {
								character.feature_choices['prayer_dice_values'][index] = '';
							}
						}}
						type="button"
					>
						<D4
							class={cn('size-7', prayer_dice_values[index] === '' && 'opacity-50')}
							showLabel
							customLabel={prayer_dice_values[index]}
						/>
					</button>
				{/each}

				<!-- roll all prayer dice button -->
				<button
					disabled={isRolling || !characterCtx.canEdit}
					onclick={rollAllPrayerDice}
					class={cn(
						'ml-2 h-7 rounded-full border bg-foreground/5 px-2.5 text-xs text-nowrap',
						'ring-primary hover:border-primary hover:bg-primary/20 hover:ring',
						isRolling && 'pointer-events-none opacity-50'
					)}
				>
					Roll Prayer Dice
				</button>
			{:else}
				<p class="flex h-6 items-center text-xs text-muted-foreground">none</p>
			{/if}
		</div>
	</div>
{/if}
