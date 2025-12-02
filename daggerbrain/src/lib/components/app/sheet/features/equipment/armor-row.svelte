<script lang="ts">
	import { cn } from '$lib/utils';
	import Shield from '@lucide/svelte/icons/shield';
	import type { Armor } from '$lib/types/compendium-types';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		armor,
		showEquipButton = false,
		quantity = 1,
		class: className = '',
		onclick
	}: {
		armor: Armor;
		showEquipButton?: boolean;
		quantity?: number;
		class?: string;
		onclick?: () => void;
	} = $props();

	const context = getCharacterContext();

	// Check if this armor is currently equipped
	let isEquipped = $derived(context.isItemEquipped(armor, 'armor'));

	// Toggle equip/unequip
	function toggleEquip(e: MouseEvent) {
		e.stopPropagation();
		if (isEquipped) {
			context.unequipItem(armor, 'armor');
		} else {
			context.equipItem(armor, 'armor');
		}
	}
</script>

<tr
	class={cn('cursor-pointer text-xs', className)}
	onclick={(e) => {
		// Don't trigger onclick if clicking on interactive elements
		const target = e.target as HTMLElement;
		if (target.closest('button, [role="button"], select, input')) {
			return;
		}
		onclick?.();
	}}
	role="button"
	tabindex="0"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.();
		}
	}}
>
	<td class="px-4 py-2">
		<div class="flex items-center gap-1">
			{#if showEquipButton}
				<button 
				class="pr-1 -ml-4 pl-4 -my-2 self-stretch group"
				onclick={toggleEquip}
					title={isEquipped ? 'Unequip' : 'Equip'}
				>
				<div class="size-[16px] rounded-full border-2 border-muted-foreground flex items-center justify-center group-hover:border-foreground transition-colors">

					{#if isEquipped}
						<div class="size-[8px] rounded-full bg-muted-foreground"></div>
					{/if}
									</div>

				</button>
			{/if}
			{armor.title}
			{#if quantity > 1}
				<span class="text-muted-foreground italic">×{quantity}</span>
			{/if}
		</div>
	</td>
	<td class="py-2 pr-4 whitespace-nowrap">
		<div
			class="mx-auto flex w-min items-center gap-1 rounded-full leading-none text-xs"
		>
			{armor.max_armor}<Shield class="size-3.5" />
		</div>
	</td>
	<td class="py-2 pr-4 whitespace-nowrap text-right sm:text-center">
		<div class="ml-auto sm:mx-auto w-min rounded-full text-xs">
			{armor.damage_thresholds.major} / {armor.damage_thresholds.severe}
		</div>
	</td>
	<td class="hidden py-2 pr-4 text-xs text-right sm:table-cell">
		<div class="ml-auto w-min text-right">
			{armor.features.map((f) => f.title).join(', ') || '—'}
		</div>
	</td>
</tr>
