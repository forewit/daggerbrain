<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';

	const characterCtx = getCharacterContext();
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const character = $derived(characterCtx.character);

	const STRANGE_PATTERN_MIN = 1;
	const STRANGE_PATTERN_MAX = 12;

	let strange_pattern_value = $derived(
		character ? parseInt(character.feature_choices['strange_pattern']?.[0] || '1') : 1
	);
</script>

{#if character && derived_character_data?.hasStrangePatternsClassFeature}
	<div class="-mb-2 flex items-center justify-center gap-2 border-y py-2">
		<p class="mr-1 text-xs font-medium text-muted-foreground">Strange Patterns</p>

		<!-- <Input
			disabled={!context.canEdit}
			type="number"
			min="1"
			max="12"
			inputmode="numeric"
			value={strange_pattern_value}
			oninput={(e) => {
				const numValue = parseInt((e.target as HTMLInputElement).value);
				if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
					character.class_choices['strange_pattern'] = [numValue.toString()];
				}
			}}
			class=" w-16"
		/> -->

		<Button
			size="sm"
			variant="outline"
			class="size-5 p-0"
			disabled={strange_pattern_value <= STRANGE_PATTERN_MIN}
			onclick={() => {
				character.feature_choices['strange_pattern'] = [
					Math.max(STRANGE_PATTERN_MIN, strange_pattern_value - 1).toString()
				];
			}}
		>
			<Minus class="size-3" />
		</Button>
		<p class="w-5 text-center font-eveleth text-sm">{strange_pattern_value}</p>
		<Button
			size="sm"
			variant="outline"
			class="size-5 p-0"
			disabled={strange_pattern_value >= STRANGE_PATTERN_MAX}
			onclick={() => {
				character.feature_choices['strange_pattern'] = [
					Math.min(STRANGE_PATTERN_MAX, strange_pattern_value + 1).toString()
				];
			}}
		>
			<Plus class="size-3" />
		</Button>
	</div>
{/if}
