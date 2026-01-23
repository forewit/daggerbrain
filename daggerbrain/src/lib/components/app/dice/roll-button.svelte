<script lang="ts">
	import { cn, applyProficiencyToDice, parseDiceString } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import type { DamageTypes, TraitIds } from '@shared/types/compendium.types';
	import { getDiceContext } from '$lib/state/dice.svelte';
	import { TRAITS } from '@shared/constants/rules';

	type RollButtonProps = {
		class?: string;
		disabled?: boolean;
		name?: string;
	} & (
		| {
				type: 'duality';
				diceString?: string;
				modifier?: number;
				traitId?: TraitIds;
		  }
		| {
				type: 'base';
				diceString: string;
				modifier?: number;
				applyProficiency?: boolean;
				damageType?: DamageTypes;
		  }
	);
	let {
		name = 'Roll',
		disabled = false,
		class: className = '',
		...restProps
	}: RollButtonProps = $props();

	const characterCtx = getCharacterContext();
	const diceCtx = getDiceContext();

	let character_proficiency = $derived(characterCtx.proficiency);

	let diceStringWithProficiency = $derived.by(() => {
		if (!restProps.diceString) return '';
		return applyProficiencyToDice(restProps.diceString, character_proficiency);
	});

	let Modifier = $derived(restProps.modifier ?? 0);

	let traitName = $derived.by(() => {
		if (restProps.type === 'duality' && restProps.traitId) {
			return TRAITS[restProps.traitId].short_name;
		}
		return null;
	});

	function onclick() {
		if (disabled) return;

		if (restProps.type === 'duality') {
			const parsed = parseDiceString(restProps.diceString || '');
			diceCtx.roll({
				name: name,
				dice: [...parsed.dice, { type: 'hope' }, { type: 'fear' }],
				modifier: Modifier
			});
		} else if (restProps.type === 'base') {
			const parsed = parseDiceString(
				restProps.applyProficiency ? diceStringWithProficiency : restProps.diceString
			);
			diceCtx.roll({
				name: name,
				dice: [...parsed.dice],
				modifier: Modifier
			});
		}
	}
</script>

<button
	{disabled}
	{onclick}
	class={cn(
		'-m-0.5 w-min rounded-full border bg-foreground/5 px-2.5 py-1.5 text-xs',
		'ring-primary hover:border-primary hover:bg-primary/20 hover:ring',
		className
	)}
>
	{#if restProps.type === 'duality'}
		{restProps.diceString ? `+${restProps.diceString}` : ''}
		{Modifier >= 0 ? `+${Modifier}` : Modifier}
		{traitName}
	{/if}

	{#if restProps.type === 'base'}
		{(restProps.applyProficiency ? diceStringWithProficiency : restProps.diceString) +
			(Modifier !== 0 ? (Modifier > 0 ? `+${Modifier}` : Modifier) : '')}
		{restProps.damageType}
	{/if}
</button>
