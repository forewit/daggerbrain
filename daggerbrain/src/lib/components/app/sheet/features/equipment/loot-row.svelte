<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		id,
		class: className = '',
		onclick
	}: { id: string; class?: string; onclick?: () => void } = $props();

	const context = getCharacterContext();

	// Look up the loot from inventory
	let loot = $derived(context.inventory_loot.find((l) => l.id === id));

	// Format modifiers for display
	let hasModifiers = $derived(
		loot ? loot.character_modifiers.length > 0 || loot.weapon_modifiers.length > 0 : false
	);
</script>

{#if loot}
	<tr
		class={cn('cursor-pointer text-xs', className)}
		onclick={(e) => {
			// Don't trigger onclick if clicking on interactive elements (but allow the row itself)
			const target = e.target as HTMLElement;
			const interactive = target.closest('button, select, input');
			if (interactive && interactive !== e.currentTarget) {
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
			{loot.title}
		</td>
		<td class="hidden py-2 pr-4 text-right sm:table-cell md:text-left">
			{#if loot.description_html}
				<div class="line-clamp-1 text-muted-foreground">
					{@html loot.description_html}
				</div>
			{:else}
				<span class="text-muted-foreground">—</span>
			{/if}
		</td>
		<td class="hidden py-2 pr-4 text-right md:table-cell">
			{#if hasModifiers}
				<span class="text-muted-foreground">
					{loot.character_modifiers.length + loot.weapon_modifiers.length}
				</span>
			{:else}
				<span class="text-muted-foreground">—</span>
			{/if}
		</td>
	</tr>
{/if}
