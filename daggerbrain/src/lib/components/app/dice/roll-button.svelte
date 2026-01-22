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

    let combinedModifier = $derived.by(() => {
        if (restProps.type === 'duality' && restProps.traitId) {
            return (restProps.modifier ?? 0) + (characterCtx.traits?.[restProps.traitId] ?? 0);
        }
        return restProps.modifier ?? 0;
    })
    
    let traitName = $derived.by(() => {
        if (restProps.type === 'duality' && restProps.traitId) {
            return TRAITS[restProps.traitId].short_name;
        }
        return null;
    })

	function onclick() {
		if (disabled) return;

		if (restProps.type === 'duality') {
			const parsed = parseDiceString(restProps.diceString || '');
			diceCtx.roll({
				name: name,
				dice: [...parsed.dice, { type: 'hope' }, { type: 'fear' }],
				modifier: combinedModifier
			});
		} else if (restProps.type === 'base') {
			const parsed = parseDiceString(
				restProps.applyProficiency ? diceStringWithProficiency : restProps.diceString
			);
			diceCtx.roll({
				name: name,
				dice: [...parsed.dice],
				modifier: combinedModifier
			});
		}
	}
</script>

<button
	{disabled}
	{onclick}
	class={cn(
		'w-min rounded-full border bg-foreground/5 px-2.5 py-1.5 -m-0.5 text-xs',
		'hover:border-primary hover:bg-primary/20 hover:ring ring-primary',
		className
	)}
>
	{#if restProps.type === 'duality'}
		{restProps.diceString ? `+${restProps.diceString}` : ''}
		{combinedModifier >= 0 ? `+${combinedModifier}` : combinedModifier}
        {traitName}
	{/if}

	{#if restProps.type === 'base'}
		{(restProps.applyProficiency ? diceStringWithProficiency : restProps.diceString) +
			(combinedModifier !== 0
				? combinedModifier > 0
					? `+${combinedModifier}`
					: combinedModifier
				: '')}
		{restProps.damageType}
	{/if}
</button>
