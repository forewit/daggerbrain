<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Consumable } from '$lib/types/compendium-types';

	let {
		consumable,
		quantity = 1,
		class: className = '',
		onclick
	}: { consumable: Consumable; quantity?: number; class?: string; onclick?: () => void } = $props();
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
		{consumable.title}
		{#if quantity > 1}
			<span class="ml-1 text-muted-foreground italic">×{quantity}</span>
		{/if}
	</td>
	<td class="py-2 pr-4 text-right">
		{#if consumable.description_html}
			<div class="line-clamp-1 text-muted-foreground">
				{@html consumable.description_html}
			</div>
		{:else}
			<span class="text-muted-foreground">—</span>
		{/if}
	</td>
</tr>
