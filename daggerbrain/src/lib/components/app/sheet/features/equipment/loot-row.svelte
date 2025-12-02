<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Loot } from '$lib/types/compendium-types';

	let {
		loot,
		quantity = 1,
		class: className = '',
		onclick
	}: { loot: Loot; quantity?: number; class?: string; onclick?: () => void } = $props();

	// Format modifiers for display
	let hasModifiers = $derived(
		loot.character_modifiers.length > 0 || loot.weapon_modifiers.length > 0
	);
</script>

<tr
	class={cn('cursor-pointer text-xs', className)}
	onclick={(e) => {
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
		{loot.title}
		{#if quantity > 1}
			<span class="ml-1 text-muted-foreground italic">×{quantity}</span>
		{/if}
	</td>
	<td class="hidden py-2 pr-4 text-right md:text-left sm:table-cell">
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
